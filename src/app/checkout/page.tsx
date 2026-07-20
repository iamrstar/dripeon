"use client";

import { useCart } from "@/context/CartContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronRight, X } from "lucide-react";

export default function CheckoutPage() {
  const { cartItems, cartTotal, removeFromCart, updateQuantity, appliedCoupon, discountAmount, applyCoupon, removeCoupon } = useCart();
  const router = useRouter();

  const [address, setAddress] = useState({
    name: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    phone: ""
  });
  const [couponCode, setCouponCode] = useState('');
  const [couponMessage, setCouponMessage] = useState({ text: '', type: '' });

  const handleProceed = (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) return;
    
    // In a real app, we'd save this address to a state manager or database.
    // For now, we'll store it in localStorage to pass it to the payment page.
    localStorage.setItem("dripeon_shipping_address", JSON.stringify(address));
    router.push('/checkout/payment');
  };

  if (cartItems.length === 0) {
    return (
      <div className="container" style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: 'var(--color-text)', fontWeight: 900 }}>YOUR CART IS EMPTY</h2>
        <p style={{ color: '#888', marginBottom: '2rem', fontWeight: 600 }}>Looks like you haven't added any drip yet.</p>
        <Link href="/" className="btn-primary" style={{ padding: '1.2rem 2.5rem', borderRadius: '4px' }}>
          CONTINUE SHOPPING
        </Link>
      </div>
    );
  }

  const shippingCost = cartTotal > 999 ? 0 : 100;
  const finalTotal = cartTotal - discountAmount + shippingCost;

  const handleApplyCoupon = async () => {
    if (!couponCode) return;
    const res = await applyCoupon(couponCode);
    setCouponMessage({ text: res.message, type: res.success ? 'success' : 'error' });
    if (res.success) setCouponCode('');
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 120px)', backgroundColor: 'var(--color-bg)' }}>
      
      {/* Header breadcrumb */}
      <div style={{ borderBottom: '1px solid var(--color-border)', padding: '1.5rem 0' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', fontWeight: 700 }}>
          <Link href="/cart" style={{ color: 'var(--color-text)' }}>Cart</Link>
          <ChevronRight size={16} color="#888" />
          <span style={{ color: 'var(--color-text)' }}>Information</span>
          <ChevronRight size={16} color="#888" />
          <span style={{ color: '#888' }}>Payment</span>
        </div>
      </div>

      <div className="container" style={{ padding: '3rem 1.5rem' }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1.2fr 1fr', 
          gap: '4rem', 
          alignItems: 'start' 
        }} className="checkout-grid">
          
          {/* LEFT: Address Form */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 style={{ fontSize: '2rem', marginBottom: '2rem', color: 'var(--color-text)', fontWeight: 900, letterSpacing: '-0.5px' }}>
              Shipping Information
            </h1>
            
            <form onSubmit={handleProceed} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>Full Name</label>
                  <input type="text" required value={address.name} onChange={e => setAddress({...address, name: e.target.value})} style={inputStyle} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>Email Address</label>
                  <input type="email" required value={address.email} onChange={e => setAddress({...address, email: e.target.value})} style={inputStyle} />
                </div>
              </div>
              
              <div>
                <label style={labelStyle}>Street Address</label>
                <input type="text" required value={address.street} onChange={e => setAddress({...address, street: e.target.value})} style={inputStyle} />
              </div>
              
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>City</label>
                  <input type="text" required value={address.city} onChange={e => setAddress({...address, city: e.target.value})} style={inputStyle} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>State</label>
                  <input type="text" required value={address.state} onChange={e => setAddress({...address, state: e.target.value})} style={inputStyle} />
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>PIN Code</label>
                  <input type="text" required value={address.zip} onChange={e => setAddress({...address, zip: e.target.value})} style={inputStyle} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>Phone Number</label>
                  <input type="tel" required value={address.phone} onChange={e => setAddress({...address, phone: e.target.value})} style={inputStyle} />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2rem' }}>
                <Link href="/" style={{ color: 'var(--color-text)', fontWeight: 700, fontSize: '0.9rem', textDecoration: 'underline' }}>
                  Return to store
                </Link>
                <button type="submit" className="btn-primary" style={{ padding: '1.2rem 2rem', borderRadius: '6px' }}>
                  CONTINUE TO PAYMENT
                </button>
              </div>
            </form>
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
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem', maxHeight: '500px', overflowY: 'auto', paddingRight: '0.5rem' }}>
              {cartItems.map((item) => (
                <div key={`${item.id}-${item.size}`} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  
                  <Link href={`/products/${item.id}`} style={{ position: 'relative', width: '75px', height: '95px', backgroundColor: '#f0f0f0', borderRadius: '6px', overflow: 'hidden', flexShrink: 0, display: 'block' }}>
                    <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <span style={{ position: 'absolute', top: '-6px', right: '-6px', backgroundColor: 'var(--color-text)', color: 'var(--color-bg)', fontSize: '0.7rem', fontWeight: 800, width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%' }}>
                      {item.quantity}
                    </span>
                  </Link>
                  
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: '1rem', fontWeight: 800, margin: '0 0 0.3rem 0', color: 'var(--color-text)', lineHeight: 1.2 }}>{item.name}</h4>
                    <p style={{ color: '#888', margin: 0, fontSize: '0.85rem', fontWeight: 600 }}>Size: {item.size}</p>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.8rem' }}>
                      <div style={{ display: 'flex', border: '1px solid var(--color-border)', borderRadius: '4px', overflow: 'hidden' }}>
                        <button onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)} style={qtyBtnStyle}>-</button>
                        <span style={{ padding: '0.1rem 0.6rem', fontWeight: 700, fontSize: '0.85rem', display: 'flex', alignItems: 'center', borderLeft: '1px solid var(--color-border)', borderRight: '1px solid var(--color-border)' }}>
                          {item.quantity}
                        </span>
                        <button onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)} style={qtyBtnStyle}>+</button>
                      </div>
                      <button onClick={() => removeFromCart(item.id, item.size)} style={{ background: 'none', border: 'none', color: '#ff4444', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer', textDecoration: 'underline' }}>
                        REMOVE
                      </button>
                    </div>
                  </div>
                  
                  <div style={{ fontWeight: 900, fontSize: '1.1rem', color: 'var(--color-text)' }}>
                    ₹{(item.price * item.quantity).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ borderTop: '1px dashed var(--color-border)', margin: '1.5rem 0' }} />

            {/* Coupon Input */}
            <div style={{ marginBottom: '1.5rem' }}>
              {!appliedCoupon ? (
                <div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input 
                      type="text" 
                      placeholder="Gift card or discount code" 
                      value={couponCode} 
                      onChange={(e) => setCouponCode(e.target.value)} 
                      style={{ ...inputStyle, marginBottom: 0, textTransform: 'uppercase' }} 
                    />
                    <button 
                      type="button" 
                      onClick={handleApplyCoupon}
                      style={{ padding: '0 1.5rem', backgroundColor: couponCode ? 'var(--color-text)' : '#e0e0e0', color: couponCode ? 'var(--color-bg)' : '#999', border: 'none', borderRadius: '4px', fontWeight: 800, cursor: couponCode ? 'pointer' : 'not-allowed', transition: 'all 0.2s' }}
                      disabled={!couponCode}
                    >
                      Apply
                    </button>
                  </div>
                  {couponMessage.text && (
                    <p style={{ marginTop: '0.5rem', fontSize: '0.85rem', fontWeight: 600, color: couponMessage.type === 'success' ? '#2e7d32' : '#d32f2f' }}>
                      {couponMessage.text}
                    </p>
                  )}
                </div>
              ) : (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f5f5f5', padding: '1rem', borderRadius: '6px', border: '1px solid #e0e0e0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '1.2rem' }}>🎟️</span>
                    <span style={{ fontWeight: 800, color: 'var(--color-text)', letterSpacing: '0.5px' }}>{appliedCoupon}</span>
                  </div>
                  <button onClick={removeCoupon} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <X size={18} />
                  </button>
                </div>
              )}
            </div>

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
                <span style={{ fontSize: '1.8rem', fontWeight: 900 }}>₹{finalTotal.toLocaleString()}</span>
              </div>
            </div>
          </motion.div>

        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .checkout-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '0.85rem',
  fontWeight: 700,
  marginBottom: '0.4rem',
  color: 'var(--color-text)'
};

const inputStyle: React.CSSProperties = {
  width: '100%', 
  padding: '1rem 1.2rem', 
  backgroundColor: 'var(--color-bg)',
  border: '1px solid var(--color-border)', 
  borderRadius: '6px',
  color: 'var(--color-text)',
  fontFamily: 'inherit',
  fontWeight: 500,
  fontSize: '0.95rem',
  outline: 'none',
  transition: 'border-color 0.2s ease'
};

const qtyBtnStyle: React.CSSProperties = {
  padding: '0.3rem 0.6rem', 
  background: 'transparent', 
  border: 'none', 
  cursor: 'pointer', 
  color: 'var(--color-text)',
  fontWeight: 800
};
