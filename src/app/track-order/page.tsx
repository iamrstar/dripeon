"use client";

import { useState } from "react";
import { Package, Truck, CheckCircle, AlertCircle, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function TrackOrder() {
  const [orderId, setOrderId] = useState("");
  const [email, setEmail] = useState("");
  
  const [tracking, setTracking] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [trackingData, setTrackingData] = useState<any>(null);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    try {
      const res = await fetch("/api/track-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, email })
      });
      const data = await res.json();
      
      if (data.success) {
        setTrackingData(data.trackingInfo);
        setTracking(true);
      } else {
        setError(data.error || "Failed to track order");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  // Helper to determine the visual progress bar state
  const getProgressWidth = (status: string) => {
    switch(status) {
      case 'PROCESSING': return '20%';
      case 'PACKED': return '40%';
      case 'SHIPPED': return '60%';
      case 'OUT_FOR_DELIVERY': return '80%';
      case 'DELIVERED': return '100%';
      case 'RETURN_REQUESTED': return '100%';
      case 'RETURNED': return '100%';
      case 'CANCELLED': return '0%';
      default: return '20%';
    }
  };

  const getStatusColor = (status: string) => {
    if (status === 'CANCELLED' || status === 'RETURNED' || status === 'RETURN_REQUESTED') return '#d32f2f'; // Red
    if (status === 'DELIVERED') return '#2e7d32'; // Green
    return '#c5a059'; // Dripeon Gold
  };

  return (
    <div style={{ minHeight: '70vh', padding: '4rem 1.5rem', backgroundColor: 'var(--color-bg)' }}>
      <div className="container" style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, textTransform: 'uppercase', marginBottom: '2rem', color: 'var(--color-text)', textAlign: 'center' }}>
          Track Your Order
        </h1>
        
        {!tracking ? (
          <div style={{ backgroundColor: 'var(--color-secondary)', padding: '3rem 2rem', borderRadius: '12px', border: '1px solid var(--color-border)', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
            <p style={{ color: '#888', textAlign: 'center', marginBottom: '2rem', fontWeight: 500 }}>
              Enter your Order ID and Email Address below to view live tracking updates.
            </p>
            
            {error && (
              <div style={{ backgroundColor: 'rgba(211, 47, 47, 0.1)', color: '#d32f2f', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '0.9rem' }}>
                <AlertCircle size={18} /> {error}
              </div>
            )}

            <form onSubmit={handleTrack} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', letterSpacing: '1px', textTransform: 'uppercase', fontWeight: 800, marginBottom: '0.6rem', color: 'var(--color-text)' }}>Order ID</label>
                <input 
                  type="text" 
                  placeholder="e.g. 64b7c8a..." 
                  required 
                  value={orderId}
                  onChange={e => setOrderId(e.target.value)}
                  style={{ width: '100%', padding: '1rem', border: '2px solid var(--color-border)', borderRadius: '8px', backgroundColor: 'var(--color-bg)', color: 'var(--color-text)', outline: 'none', fontSize: '1rem', fontWeight: 600, transition: 'border-color 0.2s' }} 
                  onFocus={(e) => e.target.style.borderColor = '#c5a059'}
                  onBlur={(e) => e.target.style.borderColor = 'var(--color-border)'}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', letterSpacing: '1px', textTransform: 'uppercase', fontWeight: 800, marginBottom: '0.6rem', color: 'var(--color-text)' }}>Email Address</label>
                <input 
                  type="email" 
                  placeholder="Email used at checkout" 
                  required 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  style={{ width: '100%', padding: '1rem', border: '2px solid var(--color-border)', borderRadius: '8px', backgroundColor: 'var(--color-bg)', color: 'var(--color-text)', outline: 'none', fontSize: '1rem', fontWeight: 600, transition: 'border-color 0.2s' }} 
                  onFocus={(e) => e.target.style.borderColor = '#c5a059'}
                  onBlur={(e) => e.target.style.borderColor = 'var(--color-border)'}
                />
              </div>
              <button type="submit" disabled={loading} style={{ padding: '1.2rem', backgroundColor: 'var(--color-text)', color: 'var(--color-bg)', border: 'none', borderRadius: '8px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px', cursor: loading ? 'not-allowed' : 'pointer', marginTop: '1rem', fontSize: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', opacity: loading ? 0.7 : 1 }}>
                {loading && <Loader2 size={18} className="animate-spin" />}
                {loading ? 'Locating Order...' : 'Track Order'}
              </button>
            </form>
          </div>
        ) : (
          <div style={{ backgroundColor: 'var(--color-secondary)', padding: '3rem 2rem', borderRadius: '12px', border: '1px solid var(--color-border)', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '0.5rem', textAlign: 'center', textTransform: 'uppercase' }}>Order #{orderId.substring(0, 6).toUpperCase()}</h3>
            <p style={{ textAlign: 'center', fontWeight: 800, color: getStatusColor(trackingData.orderStatus), letterSpacing: '1px', fontSize: '0.9rem', marginBottom: '2.5rem' }}>
              STATUS: {trackingData.orderStatus.replace(/_/g, ' ')}
            </p>
            
            {/* Dynamic Progress Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', margin: '3rem 0' }}>
              <div style={{ position: 'absolute', top: '24px', left: '10%', right: '10%', height: '4px', backgroundColor: 'var(--color-border)', zIndex: 0, borderRadius: '2px' }}>
                <div style={{ width: getProgressWidth(trackingData.orderStatus), height: '100%', backgroundColor: getStatusColor(trackingData.orderStatus), transition: 'width 0.5s ease-in-out', borderRadius: '2px' }}></div>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.8rem', zIndex: 1, flex: 1 }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: getProgressWidth(trackingData.orderStatus) !== '0%' ? getStatusColor(trackingData.orderStatus) : 'var(--color-bg)', border: `2px solid ${getStatusColor(trackingData.orderStatus)}`, color: getProgressWidth(trackingData.orderStatus) !== '0%' ? 'white' : 'var(--color-text)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Package size={20} />
                </div>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Packed</span>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.8rem', zIndex: 1, flex: 1 }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: parseInt(getProgressWidth(trackingData.orderStatus)) >= 60 ? getStatusColor(trackingData.orderStatus) : 'var(--color-bg)', border: `2px solid ${parseInt(getProgressWidth(trackingData.orderStatus)) >= 60 ? getStatusColor(trackingData.orderStatus) : 'var(--color-border)'}`, color: parseInt(getProgressWidth(trackingData.orderStatus)) >= 60 ? 'white' : '#888', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.5s ease' }}>
                  <Truck size={20} />
                </div>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.5px', color: parseInt(getProgressWidth(trackingData.orderStatus)) >= 60 ? 'var(--color-text)' : '#888' }}>Shipped</span>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.8rem', zIndex: 1, flex: 1 }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: parseInt(getProgressWidth(trackingData.orderStatus)) >= 100 ? getStatusColor(trackingData.orderStatus) : 'var(--color-bg)', border: `2px solid ${parseInt(getProgressWidth(trackingData.orderStatus)) >= 100 ? getStatusColor(trackingData.orderStatus) : 'var(--color-border)'}`, color: parseInt(getProgressWidth(trackingData.orderStatus)) >= 100 ? 'white' : '#888', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.5s ease' }}>
                  <CheckCircle size={20} />
                </div>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.5px', color: parseInt(getProgressWidth(trackingData.orderStatus)) >= 100 ? 'var(--color-text)' : '#888' }}>Delivered</span>
              </div>
            </div>

            {/* Advanced Logistics Info */}
            {(trackingData.trackingNumber || trackingData.courierPartner) && (
               <div style={{ marginTop: '2rem', padding: '1.5rem', backgroundColor: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRadius: '8px' }}>
                  <h4 style={{ fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1rem', color: '#c5a059' }}>Logistics Details</h4>
                  {trackingData.courierPartner && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem', paddingBottom: '0.8rem', borderBottom: '1px solid var(--color-border)' }}>
                      <span style={{ color: '#888', fontWeight: 600, fontSize: '0.9rem' }}>Courier</span>
                      <span style={{ fontWeight: 800, color: 'var(--color-text)' }}>{trackingData.courierPartner}</span>
                    </div>
                  )}
                  {trackingData.trackingNumber && (
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#888', fontWeight: 600, fontSize: '0.9rem' }}>Tracking Number (AWB)</span>
                      <span style={{ fontWeight: 800, color: 'var(--color-text)', letterSpacing: '1px' }}>{trackingData.trackingNumber}</span>
                    </div>
                  )}
               </div>
            )}
            
            <div style={{ textAlign: 'center', marginTop: '3rem' }}>
              <button onClick={() => setTracking(false)} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', color: '#888', fontWeight: 800, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', cursor: 'pointer', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-text)'} onMouseLeave={(e) => e.currentTarget.style.color = '#888'}>
                <ArrowLeft size={16} /> Track Another Order
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
