"use client";

import { useState } from "react";
import { Package, Truck, CheckCircle } from "lucide-react";

export default function TrackOrder() {
  const [orderId, setOrderId] = useState("");
  const [email, setEmail] = useState("");
  const [tracking, setTracking] = useState(false);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (orderId && email) {
      setTracking(true);
    }
  };

  return (
    <div style={{ minHeight: '60vh', padding: '4rem 1.5rem', backgroundColor: 'var(--color-bg)' }}>
      <div className="container" style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, textTransform: 'uppercase', marginBottom: '2rem', color: 'var(--color-text)', textAlign: 'center' }}>
          Track Your Order
        </h1>
        
        {!tracking ? (
          <div style={{ backgroundColor: 'var(--color-secondary)', padding: '3rem 2rem', borderRadius: '12px', border: '1px solid var(--color-border)' }}>
            <p style={{ color: '#666', textAlign: 'center', marginBottom: '2rem' }}>
              Enter your Order ID and Email Address below to see your package's current status.
            </p>
            <form onSubmit={handleTrack} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--color-text)' }}>Order ID</label>
                <input 
                  type="text" 
                  placeholder="e.g. 64b7c8a..." 
                  required 
                  value={orderId}
                  onChange={e => setOrderId(e.target.value)}
                  style={{ width: '100%', padding: '1rem', border: '1px solid var(--color-border)', borderRadius: '4px', backgroundColor: 'var(--color-bg)', color: 'var(--color-text)', outline: 'none' }} 
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--color-text)' }}>Email Address</label>
                <input 
                  type="email" 
                  placeholder="Email used at checkout" 
                  required 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  style={{ width: '100%', padding: '1rem', border: '1px solid var(--color-border)', borderRadius: '4px', backgroundColor: 'var(--color-bg)', color: 'var(--color-text)', outline: 'none' }} 
                />
              </div>
              <button type="submit" style={{ padding: '1.2rem', backgroundColor: 'var(--color-text)', color: 'var(--color-bg)', border: 'none', borderRadius: '4px', fontWeight: 800, cursor: 'pointer', marginTop: '1rem', fontSize: '1rem' }}>
                TRACK ORDER
              </button>
            </form>
          </div>
        ) : (
          <div style={{ backgroundColor: 'var(--color-secondary)', padding: '3rem 2rem', borderRadius: '12px', border: '1px solid var(--color-border)' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1.5rem', textAlign: 'center' }}>Order #{orderId.substring(0, 8).toUpperCase()}</h3>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', margin: '2rem 0' }}>
              {/* Progress Line */}
              <div style={{ position: 'absolute', top: '24px', left: '10%', right: '10%', height: '4px', backgroundColor: '#e0e0e0', zIndex: 0 }}>
                <div style={{ width: '50%', height: '100%', backgroundColor: '#2e7d32' }}></div>
              </div>
              
              {/* Steps */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', zIndex: 1, flex: 1 }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#2e7d32', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Package size={20} />
                </div>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, textAlign: 'center' }}>Confirmed</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', zIndex: 1, flex: 1 }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#2e7d32', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Truck size={20} />
                </div>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, textAlign: 'center' }}>Shipped</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', zIndex: 1, flex: 1 }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#e0e0e0', color: '#888', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CheckCircle size={20} />
                </div>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#888', textAlign: 'center' }}>Delivered</span>
              </div>
            </div>
            
            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
              <p style={{ color: '#2e7d32', fontWeight: 700, marginBottom: '0.5rem' }}>Your order is currently in transit.</p>
              <p style={{ color: '#666', fontSize: '0.9rem' }}>Expected Delivery: 3-4 Business Days</p>
              <button onClick={() => setTracking(false)} style={{ background: 'none', border: 'none', textDecoration: 'underline', color: 'var(--color-text)', fontWeight: 600, marginTop: '2rem', cursor: 'pointer' }}>
                Track another order
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
