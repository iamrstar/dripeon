"use client";

import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Loader from "@/components/Loader";

export default function PaymentPage() {
  const { cartTotal, cartItems, clearCart } = useCart();
  const router = useRouter();
  const [address, setAddress] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (cartItems.length === 0) {
      router.push('/');
    }
    const savedAddress = localStorage.getItem("dripeon_shipping_address");
    if (savedAddress) {
      setAddress(JSON.parse(savedAddress));
    } else {
      router.push('/checkout');
    }
  }, [cartItems, router]);

  const handleMockPayment = async () => {
    setLoading(true);
    // Simulate a payment delay
    setTimeout(() => {
      // In a real app, you would create the Order in MongoDB here via an API route.
      // For now, we clear the cart and go to success.
      clearCart();
      localStorage.removeItem("dripeon_shipping_address");
      router.push('/checkout/success?orderId=DRP-' + Math.floor(Math.random() * 1000000));
    }, 2000);
  };

  if (!address) return <Loader />;

  const total = cartTotal > 999 ? cartTotal : cartTotal + 100;

  return (
    <div className="container" style={{ minHeight: 'calc(100vh - 120px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ 
        width: '100%', 
        maxWidth: '500px', 
        padding: '3rem', 
        backgroundColor: 'var(--color-secondary)', 
        border: '1px solid var(--color-border)',
        boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
      }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem', textAlign: 'center', lineHeight: 1, color: 'var(--color-text)' }}>
          SECURE <br/><span style={{ color: 'var(--color-accent-gold)' }}>PAYMENT</span>
        </h1>
        
        <div style={{ marginBottom: '2rem', paddingBottom: '2rem', borderBottom: '1px solid var(--color-border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ color: '#888', fontWeight: 600 }}>Total Amount</span>
            <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-text)' }}>₹{total}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#888', fontWeight: 600 }}>Deliver To</span>
            <span style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-text)', textAlign: 'right' }}>
              {address.name}<br/>
              {address.city}, {address.state}
            </span>
          </div>
        </div>

        <button 
          onClick={handleMockPayment}
          disabled={loading}
          className="btn-primary" 
          style={{ width: '100%', padding: '1.2rem', fontSize: '1.2rem', opacity: loading ? 0.7 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}
        >
          {loading ? 'PROCESSING...' : `PAY ₹${total}`}
        </button>

        <p style={{ marginTop: '1.5rem', textAlign: 'center', color: '#888', fontSize: '0.9rem', fontWeight: 600 }}>
          🔒 This is a secure 256-bit SSL encrypted payment.
        </p>
      </div>
    </div>
  );
}
