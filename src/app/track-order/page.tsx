"use client";

import { useState } from "react";
import { Package, Truck, CheckCircle, AlertCircle, Loader2, ArrowLeft, Search, MapPin, CalendarClock, ShoppingBag, RefreshCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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
        setError(data.error || "Failed to locate order. Please check your details.");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Determine active steps for the vertical timeline
  const getStepStatus = (stepIndex: number, status: string) => {
    const statusMap: Record<string, number> = {
      'PENDING': 0,
      'PROCESSING': 1,
      'PACKED': 2,
      'SHIPPED': 3,
      'OUT_FOR_DELIVERY': 4,
      'DELIVERED': 5,
    };
    
    // Handle cancellations explicitly
    if (status.includes('CANCELLED')) {
      return stepIndex === 0 ? 'completed' : 'cancelled_step';
    }

    // Handle returns explicitly
    const returnStatusMap: Record<string, number> = {
      'RETURN_REQUESTED': 0,
      'RETURN_ACCEPTED': 1,
      'PICKUP_SUCCESSFUL': 2,
      'REFUND_INITIATED': 3,
      'REPLACEMENT_PROCESSED': 3,
      'RETURNED': 3
    };

    if (Object.keys(returnStatusMap).includes(status)) {
      const currentStep = returnStatusMap[status];
      if (stepIndex < currentStep) return 'completed';
      if (stepIndex === currentStep) return 'current';
      return 'pending';
    }

    const currentStep = statusMap[status] ?? 1;
    if (stepIndex < currentStep) return 'completed';
    if (stepIndex === currentStep) return 'current';
    return 'pending';
  };

  const timelineSteps = [
    { title: "Order Confirmed", icon: ShoppingBag, desc: "We've received your order." },
    { title: "Processing", icon: Loader2, desc: "Order is being prepared in our warehouse." },
    { title: "Packed", icon: Package, desc: "Your items are securely packed." },
    { title: "Shipped", icon: Truck, desc: "Handed over to our courier partner." },
    { title: "Out for Delivery", icon: MapPin, desc: "The package is arriving today." },
    { title: "Delivered", icon: CheckCircle, desc: "Order successfully delivered." }
  ];

  return (
    <div style={{ minHeight: '80vh', padding: '4rem 1.5rem', backgroundColor: 'var(--color-bg)' }}>
      <div className="container" style={{ maxWidth: '650px', margin: '0 auto' }}>
        
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 900, textTransform: 'uppercase', marginBottom: '0.5rem', color: 'var(--color-text)', textAlign: 'center', letterSpacing: '-1px' }}>
            Track Your Drip
          </h1>
          <p style={{ color: '#888', textAlign: 'center', marginBottom: '3rem', fontWeight: 600, fontSize: '0.9rem' }}>
            Real-time logistics updates for your premium streetwear.
          </p>
        </motion.div>
        
        <AnimatePresence mode="wait">
          {!tracking ? (
            <motion.div 
              key="tracking-form"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98, filter: 'blur(4px)' }}
              transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
              style={{ backgroundColor: 'var(--color-secondary)', padding: '3.5rem 2.5rem', borderRadius: '16px', border: '1px solid var(--color-border)', boxShadow: '0 20px 40px rgba(0,0,0,0.08)' }}
            >
              {error && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ backgroundColor: 'rgba(229, 57, 53, 0.1)', color: '#e53935', padding: '1.2rem', borderRadius: '8px', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.8rem', fontWeight: 700, fontSize: '0.85rem' }}>
                  <AlertCircle size={20} /> {error}
                </motion.div>
              )}

              <form onSubmit={handleTrack} style={{ display: 'flex', flexDirection: 'column', gap: '1.8rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', letterSpacing: '1.5px', textTransform: 'uppercase', fontWeight: 800, marginBottom: '0.8rem', color: '#888' }}>Order ID</label>
                  <div style={{ position: 'relative' }}>
                    <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#888' }} />
                    <input 
                      type="text" 
                      placeholder="e.g. 64b7c8a..." 
                      required 
                      value={orderId}
                      onChange={e => setOrderId(e.target.value)}
                      style={{ width: '100%', padding: '1.2rem 1.2rem 1.2rem 3rem', border: '2px solid var(--color-border)', borderRadius: '8px', backgroundColor: 'var(--color-bg)', color: 'var(--color-text)', outline: 'none', fontSize: '1.05rem', fontWeight: 600, transition: 'border-color 0.2s', letterSpacing: '1px' }} 
                      onFocus={(e) => e.target.style.borderColor = 'var(--color-text)'}
                      onBlur={(e) => e.target.style.borderColor = 'var(--color-border)'}
                    />
                  </div>
                </div>
                
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', letterSpacing: '1.5px', textTransform: 'uppercase', fontWeight: 800, marginBottom: '0.8rem', color: '#888' }}>Email Address</label>
                  <div style={{ position: 'relative' }}>
                    <UserIcon size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#888' }} />
                    <input 
                      type="email" 
                      placeholder="Email used at checkout" 
                      required 
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      style={{ width: '100%', padding: '1.2rem 1.2rem 1.2rem 3rem', border: '2px solid var(--color-border)', borderRadius: '8px', backgroundColor: 'var(--color-bg)', color: 'var(--color-text)', outline: 'none', fontSize: '1rem', fontWeight: 600, transition: 'border-color 0.2s' }} 
                      onFocus={(e) => e.target.style.borderColor = 'var(--color-text)'}
                      onBlur={(e) => e.target.style.borderColor = 'var(--color-border)'}
                    />
                  </div>
                </div>
                
                <button type="submit" disabled={loading} style={{ padding: '1.4rem', backgroundColor: 'var(--color-text)', color: 'var(--color-bg)', border: 'none', borderRadius: '8px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '2px', cursor: loading ? 'not-allowed' : 'pointer', marginTop: '1rem', fontSize: '0.9rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.8rem', transition: 'all 0.3s ease' }} onMouseOver={(e) => e.currentTarget.style.opacity = '0.9'} onMouseOut={(e) => e.currentTarget.style.opacity = '1'}>
                  {loading ? (
                    <><Loader2 size={20} className="animate-spin" /> LOCATING...</>
                  ) : (
                    <><MapPin size={20} /> TRACK PACKAGE</>
                  )}
                </button>
              </form>
            </motion.div>
          ) : (
            <motion.div 
              key="tracking-results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
              style={{ backgroundColor: 'var(--color-secondary)', padding: '3rem', borderRadius: '16px', border: '1px solid var(--color-border)', boxShadow: '0 20px 40px rgba(0,0,0,0.08)' }}
            >
              {/* Header Info */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem', paddingBottom: '2rem', borderBottom: '1px solid var(--color-border)' }}>
                <div>
                  <h3 style={{ fontSize: '0.85rem', color: '#888', fontWeight: 800, letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Order Number</h3>
                  <p style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--color-text)', letterSpacing: '1px' }}>#{orderId.replace(/^#/, '').toUpperCase()}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <h3 style={{ fontSize: '0.85rem', color: '#888', fontWeight: 800, letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Status</h3>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', backgroundColor: trackingData.orderStatus === 'DELIVERED' ? 'rgba(46, 125, 50, 0.1)' : trackingData.orderStatus.includes('CANCELLED') ? 'rgba(229, 57, 53, 0.1)' : 'var(--color-text)', color: trackingData.orderStatus === 'DELIVERED' ? '#2e7d32' : trackingData.orderStatus.includes('CANCELLED') ? '#e53935' : 'var(--color-bg)', padding: '0.4rem 1rem', borderRadius: '50px', fontWeight: 800, fontSize: '0.75rem', letterSpacing: '1px' }}>
                    {trackingData.orderStatus.replace(/_/g, ' ')}
                  </div>
                </div>
              </div>

              {/* Vertical Timeline */}
              <div style={{ position: 'relative', paddingLeft: '2rem' }}>
                {/* Connecting Line */}
                <div style={{ position: 'absolute', left: '39px', top: '24px', bottom: '24px', width: '2px', backgroundColor: 'var(--color-border)', zIndex: 0 }} />
                
                {(trackingData.orderStatus.includes('CANCELLED') ? [
                  { title: "Order Confirmed", icon: ShoppingBag, desc: "We've received your order." },
                  { title: "Order Cancelled", icon: AlertCircle, desc: trackingData.cancellationReason ? `Reason: ${trackingData.cancellationReason}` : "This order has been cancelled." }
                ] : ['RETURN_REQUESTED', 'RETURN_ACCEPTED', 'PICKUP_SUCCESSFUL', 'REFUND_INITIATED', 'REPLACEMENT_PROCESSED', 'RETURNED'].includes(trackingData.orderStatus) ? [
                  { title: "Request Received", icon: Package, desc: "We've received your return/replacement request." },
                  { title: "Request Accepted", icon: CheckCircle, desc: "Your request has been approved by our team." },
                  { title: "Pickup Successful", icon: Truck, desc: "Our delivery partner has picked up the item." },
                  { title: trackingData.orderStatus === 'REPLACEMENT_PROCESSED' || trackingData.cancellationReason?.includes('[REPLACE]') ? "Replacement Processed" : "Refund Initiated", icon: RefreshCcw, desc: trackingData.orderStatus === 'REPLACEMENT_PROCESSED' || trackingData.cancellationReason?.includes('[REPLACE]') ? "Your replacement has been processed." : "Your refund has been initiated." }
                ] : timelineSteps).map((step, index, arr) => {
                  const status = getStepStatus(index, trackingData.orderStatus);
                  const Icon = step.icon;
                  const isCancelledStep = status === 'cancelled_step';
                  const isCancelledState = trackingData.orderStatus.includes('CANCELLED');
                  const isCurrent = status === 'current';
                  const isCompleted = status === 'completed';
                  
                  // Colors
                  let circleBg = 'var(--color-bg)';
                  let circleBorder = 'var(--color-border)';
                  let iconColor = '#888';
                  let titleColor = '#888';
                  
                  if (isCompleted) {
                    circleBg = 'var(--color-text)';
                    circleBorder = 'var(--color-text)';
                    iconColor = 'var(--color-bg)';
                    titleColor = 'var(--color-text)';
                  } else if (isCurrent) {
                    circleBg = 'var(--color-bg)';
                    circleBorder = 'var(--color-text)';
                    iconColor = 'var(--color-text)';
                    titleColor = 'var(--color-text)';
                  } else if (isCancelledStep) {
                    circleBg = 'rgba(229, 57, 53, 0.1)';
                    circleBorder = '#e53935';
                    iconColor = '#e53935';
                    titleColor = '#e53935';
                  }
                  
                  // Removed obsolete hiding logic
                  return (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.15, duration: 0.5 }}
                      style={{ display: 'flex', gap: '2rem', marginBottom: index === arr.length - 1 ? 0 : '2.5rem', position: 'relative', zIndex: 1, opacity: isCancelledState ? 0.5 : 1 }}
                    >
                      {/* Step Circle */}
                      <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: circleBg, border: `2px solid ${circleBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s ease', flexShrink: 0, boxShadow: isCurrent ? '0 0 0 4px rgba(17,17,17,0.1)' : 'none' }}>
                        {isCurrent && index === 1 ? (
                          <Loader2 size={18} color={iconColor} className="animate-spin" />
                        ) : (
                          <Icon size={18} color={iconColor} />
                        )}
                      </div>
                      
                      {/* Step Content */}
                      <div style={{ paddingTop: '0.5rem', width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: titleColor, marginBottom: '0.3rem', letterSpacing: '0.5px' }}>{isCancelledState ? 'Order Cancelled' : step.title}</h4>
                          <p style={{ fontSize: '0.85rem', color: '#888', fontWeight: 500, lineHeight: 1.5 }}>{isCancelledState ? trackingData.cancellationReason || 'Order was cancelled.' : step.desc}</p>
                        </div>
                        {((index === 0 && trackingData.createdAt) || ((isCurrent || isCancelledStep || (isCompleted && index === arr.length - 1)) && trackingData.updatedAt)) && (
                          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#888', textAlign: 'right', marginTop: '0.2rem' }}>
                            {new Date(index === 0 ? trackingData.createdAt : trackingData.updatedAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                            <br />
                            <span style={{ fontSize: '0.7rem', opacity: 0.8 }}>
                              {new Date(index === 0 ? trackingData.createdAt : trackingData.updatedAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Logistics Specifics */}
              {(trackingData.trackingNumber || trackingData.courierPartner) && (
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
                  style={{ marginTop: '3.5rem', padding: '1.8rem', backgroundColor: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRadius: '12px' }}
                >
                  <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '1.5rem', color: 'var(--color-text)' }}>
                    <Truck size={16} /> Courier Information
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    {trackingData.courierPartner && (
                      <div>
                        <p style={{ fontSize: '0.75rem', color: '#888', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700, marginBottom: '0.3rem' }}>Partner</p>
                        <p style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--color-text)' }}>{trackingData.courierPartner}</p>
                      </div>
                    )}
                    {trackingData.trackingNumber && (
                      <div>
                        <p style={{ fontSize: '0.75rem', color: '#888', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700, marginBottom: '0.3rem' }}>Tracking ID</p>
                        <p style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--color-text)', letterSpacing: '1px' }}>{trackingData.trackingNumber}</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
              
              {/* Back Button */}
              <div style={{ textAlign: 'center', marginTop: '3.5rem' }}>
                <button 
                  onClick={() => setTracking(false)} 
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', background: 'none', border: 'none', color: 'var(--color-text)', fontWeight: 800, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1.5px', cursor: 'pointer', opacity: 0.6, transition: 'opacity 0.2s' }} 
                  onMouseEnter={(e) => e.currentTarget.style.opacity = '1'} 
                  onMouseLeave={(e) => e.currentTarget.style.opacity = '0.6'}
                >
                  <ArrowLeft size={16} /> Check Another Order
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Simple icon for the form
function UserIcon({ size, style }: { size: number, style?: React.CSSProperties }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
      <circle cx="12" cy="7" r="4"></circle>
    </svg>
  );
}
