"use client";

import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Loader from "@/components/Loader";
import { ShieldCheck, Lock, CreditCard, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function PaymentPage() {
  const { cartTotal, cartItems, clearCart, discountAmount, appliedCoupon } = useCart();
  const router = useRouter();
  const [address, setAddress] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'cod'>('card');
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    // Load Razorpay script
    const loadRazorpayScript = () => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => setScriptLoaded(true);
      document.body.appendChild(script);
    };
    loadRazorpayScript();
  }, []);

  useEffect(() => {
    if (cartItems.length === 0 && !isSuccess) {
      router.push('/');
    }
    const savedAddress = localStorage.getItem("dripeon_shipping_address");
    if (savedAddress) {
      setAddress(JSON.parse(savedAddress));
    } else {
      router.push('/checkout');
    }
  }, [cartItems, router]);

  const handlePayment = async () => {
    setLoading(true);
    try {
      const shippingCost = cartTotal > 999 ? 0 : 100;
      const totalAmount = cartTotal - discountAmount + shippingCost;
      
      const orderData = {
        products: cartItems.map(item => ({
          product_id: item.id,
          name: item.name,
          size: item.size,
          quantity: item.quantity,
          price: item.price
        })),
        shippingAddress: address,
        totalAmount: totalAmount,
        coupon: appliedCoupon,
        discountAmount: discountAmount
      };

      if (paymentMethod === 'cod') {
        // --- CASH ON DELIVERY FLOW ---
        const res = await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(orderData)
        });

        if (res.ok) {
          setIsSuccess(true);
          const data = await res.json();
          setTimeout(() => {
            clearCart();
            localStorage.removeItem("dripeon_shipping_address");
          }, 100);
          router.push(`/checkout/success?orderId=${data.orderId}`);
        } else {
          alert("Order failed. Please try again.");
        }
      } else {
        // --- RAZORPAY FLOW (Card / UPI) ---
        if (!scriptLoaded) {
          alert("Payment gateway is still loading. Please try again in a few seconds.");
          setLoading(false);
          return;
        }

        // 1. Create Order on Backend
        const createRes = await fetch('/api/razorpay/create-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            products: orderData.products,
            coupon: appliedCoupon
          })
        });
        
        const createData = await createRes.json();
        if (!createData.success) {
          alert("Could not initialize payment. Please try again.");
          setLoading(false);
          return;
        }

        // 2. Open Razorpay Modal
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, 
          amount: createData.amount, 
          currency: createData.currency,
          name: "Dripeon",
          description: "Premium Streetwear",
          image: "https://res.cloudinary.com/yxaowb5x/image/upload/v1/dripeon_logo.png", // fallback or omit
          order_id: createData.order_id, 
          handler: async function (response: any) {
            // 3. Verify Payment Signature
            try {
              const verifyRes = await fetch('/api/razorpay/verify-payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  ...orderData, // Send order details to create it after verification
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_signature: response.razorpay_signature
                })
              });

              const verifyData = await verifyRes.json();
              if (verifyRes.ok && verifyData.success) {
                setIsSuccess(true);
                setTimeout(() => {
                  clearCart();
                  localStorage.removeItem("dripeon_shipping_address");
                }, 100);
                router.push(`/checkout/success?orderId=${verifyData.orderId}`);
              } else {
                alert("Payment verification failed. If money was deducted, it will be refunded.");
              }
            } catch (err) {
              alert("Error verifying payment.");
            }
          },
          prefill: {
            name: address.name,
            email: address.email,
            contact: address.phone
          },
          theme: {
            color: "#000000"
          },
          modal: {
            ondismiss: function() {
              setLoading(false);
            }
          }
        };

        const rzp1 = new (window as any).Razorpay(options);
        rzp1.on('payment.failed', function (response: any) {
          alert(`Payment Failed: ${response.error.description}`);
          setLoading(false);
        });
        rzp1.open();
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("An error occurred. Please try again.");
      setLoading(false);
    }
  };

  if (!address) return <Loader />;

  const shippingCost = cartTotal > 999 ? 0 : 100;
  const total = cartTotal - discountAmount + shippingCost;

  return (
    <div style={{ minHeight: 'calc(100vh - 120px)', backgroundColor: 'var(--color-bg)' }}>
      
      {/* Header */}
      <div style={{ borderBottom: '1px solid var(--color-border)', padding: '1.5rem 0' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center' }}>
          <Link href="/checkout" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text)', textDecoration: 'none', fontWeight: 600 }}>
            <ChevronLeft size={20} /> Back to Information
          </Link>
          <div style={{ flex: 1, textAlign: 'center', fontSize: '1.2rem', fontWeight: 900, letterSpacing: '1px' }}>
            SECURE CHECKOUT
          </div>
          <div style={{ width: '100px' }} /> {/* Spacer */}
        </div>
      </div>

      <div className="container" style={{ padding: '3rem 1.5rem' }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1.2fr 1fr', 
          gap: '4rem', 
          alignItems: 'start' 
        }} className="payment-grid">
          
          {/* LEFT: Payment Methods */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '2rem', letterSpacing: '-0.5px' }}>
              Payment Method
            </h2>
            
            <p style={{ color: '#888', fontSize: '0.9rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Lock size={16} /> All transactions are secure and encrypted.
            </p>

            <div style={{ border: '1px solid var(--color-border)', borderRadius: '8px', overflow: 'hidden' }}>
              
              {/* Card Option */}
              <label style={{ display: 'flex', alignItems: 'center', padding: '1.5rem', borderBottom: '1px solid var(--color-border)', cursor: 'pointer', backgroundColor: paymentMethod === 'card' ? 'rgba(0,0,0,0.02)' : 'transparent', transition: 'all 0.2s' }}>
                <input 
                  type="radio" 
                  name="payment" 
                  value="card" 
                  checked={paymentMethod === 'card'} 
                  onChange={() => setPaymentMethod('card')} 
                  style={{ accentColor: 'var(--color-text)', transform: 'scale(1.2)', marginRight: '1rem' }}
                />
                <div style={{ flex: 1 }}>
                  <span style={{ fontWeight: 700, display: 'block' }}>Credit / Debit Card</span>
                  <span style={{ fontSize: '0.8rem', color: '#888' }}>Visa, Mastercard, AMEX, RuPay</span>
                </div>
                <CreditCard size={24} color="#555" />
              </label>

              {/* UPI Option */}
              <label style={{ display: 'flex', alignItems: 'center', padding: '1.5rem', borderBottom: '1px solid var(--color-border)', cursor: 'pointer', backgroundColor: paymentMethod === 'upi' ? 'rgba(0,0,0,0.02)' : 'transparent', transition: 'all 0.2s' }}>
                <input 
                  type="radio" 
                  name="payment" 
                  value="upi" 
                  checked={paymentMethod === 'upi'} 
                  onChange={() => setPaymentMethod('upi')} 
                  style={{ accentColor: 'var(--color-text)', transform: 'scale(1.2)', marginRight: '1rem' }}
                />
                <div style={{ flex: 1 }}>
                  <span style={{ fontWeight: 700, display: 'block' }}>UPI (GPay, PhonePe, Paytm)</span>
                  <span style={{ fontSize: '0.8rem', color: '#888' }}>Pay instantly using your UPI app</span>
                </div>
                <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo-vector.svg" alt="UPI" style={{ height: '20px' }} />
              </label>

              {/* COD Option */}
              <label style={{ display: 'flex', alignItems: 'center', padding: '1.5rem', cursor: 'pointer', backgroundColor: paymentMethod === 'cod' ? 'rgba(0,0,0,0.02)' : 'transparent', transition: 'all 0.2s' }}>
                <input 
                  type="radio" 
                  name="payment" 
                  value="cod" 
                  checked={paymentMethod === 'cod'} 
                  onChange={() => setPaymentMethod('cod')} 
                  style={{ accentColor: 'var(--color-text)', transform: 'scale(1.2)', marginRight: '1rem' }}
                />
                <div style={{ flex: 1 }}>
                  <span style={{ fontWeight: 700, display: 'block' }}>Cash on Delivery (COD)</span>
                  <span style={{ fontSize: '0.8rem', color: '#888' }}>Pay when your order arrives</span>
                </div>
              </label>
            </div>
          </motion.div>


          {/* RIGHT: Order Summary */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ duration: 0.5, delay: 0.2 }}
            style={{ 
              backgroundColor: 'var(--color-secondary)', 
              padding: '2.5rem', 
              borderRadius: '12px',
              border: '1px solid var(--color-border)',
              position: 'sticky',
              top: '2rem'
            }}
          >
            <h3 style={{ fontSize: '1.4rem', fontWeight: 900, marginBottom: '2rem' }}>Order Summary</h3>
            
            {/* Items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem', maxHeight: '400px', overflowY: 'auto', paddingRight: '0.5rem' }}>
              {cartItems.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <Link href={`/products/${item.id}`} style={{ position: 'relative', width: '75px', height: '95px', backgroundColor: '#f0f0f0', borderRadius: '6px', overflow: 'hidden', flexShrink: 0, display: 'block' }}>
                    <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <span style={{ position: 'absolute', top: '-6px', right: '-6px', backgroundColor: 'var(--color-text)', color: 'var(--color-bg)', fontSize: '0.7rem', fontWeight: 800, width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%' }}>
                      {item.quantity}
                    </span>
                  </Link>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 800, fontSize: '0.9rem', marginBottom: '0.2rem', textTransform: 'uppercase', lineHeight: 1.2 }}>{item.name}</p>
                    <p style={{ fontSize: '0.8rem', color: '#888', fontWeight: 600 }}>Size: {item.size}</p>
                  </div>
                  <div style={{ fontWeight: 800, fontSize: '1rem' }}>
                    ₹{(item.price * item.quantity).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ borderTop: '1px dashed var(--color-border)', margin: '1.5rem 0' }} />

            {/* Shipping Info */}
            <div style={{ marginBottom: '1.5rem' }}>
              <p style={{ fontSize: '0.85rem', color: '#888', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.5rem' }}>Shipping To</p>
              <p style={{ fontSize: '0.95rem', fontWeight: 600, lineHeight: 1.5 }}>
                {address.name}<br/>
                {address.street}, {address.city}, {address.state} {address.zip}
              </p>
            </div>

            <div style={{ borderTop: '1px dashed var(--color-border)', margin: '1.5rem 0' }} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem', fontWeight: 600, color: '#888' }}>
                <span>Subtotal</span>
                <span style={{ color: 'var(--color-text)' }}>₹{cartTotal.toLocaleString()}</span>
              </div>
              {appliedCoupon && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem', fontWeight: 700, color: '#2e7d32' }}>
                  <span>Discount ({appliedCoupon})</span>
                  <span>-₹{discountAmount.toLocaleString()}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem', fontWeight: 600, color: '#888' }}>
                <span>Shipping</span>
                <span style={{ color: 'var(--color-text)' }}>{shippingCost === 0 ? 'FREE' : `₹${shippingCost}`}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-text)', alignItems: 'center' }}>
                <span>Total</span>
                <span style={{ fontSize: '1.8rem', fontWeight: 900 }}>₹{total.toLocaleString()}</span>
              </div>
            </div>

            <button 
              onClick={handlePayment}
              disabled={loading}
              className="btn-primary" 
              style={{ 
                width: '100%', padding: '1.2rem', fontSize: '1rem', 
                opacity: loading ? 0.7 : 1, display: 'flex', alignItems: 'center', 
                justifyContent: 'center', gap: '0.8rem', borderRadius: '6px' 
              }}
            >
              {loading ? 'PROCESSING...' : (
                <>
                  <ShieldCheck size={20} />
                  PAY ₹{total.toLocaleString()} SECURELY
                </>
              )}
            </button>
            <p style={{ textAlign: 'center', fontSize: '0.75rem', color: '#888', marginTop: '1rem', fontWeight: 600 }}>
              By clicking "Pay", you agree to our Terms of Service and Privacy Policy.
            </p>
          </motion.div>
        </div>
      </div>

      <style>{`
        .input-field {
          width: 100%;
          padding: 1.2rem;
          background-color: var(--color-bg);
          border: 1px solid var(--color-border);
          border-radius: 6px;
          color: var(--color-text);
          font-family: inherit;
          font-size: 1rem;
          font-weight: 500;
        }
        @media (max-width: 900px) {
          .payment-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
