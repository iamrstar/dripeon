"use client";

import { useEffect, useState, useRef } from "react";
import Loader from "@/components/Loader";
import Link from "next/link";
import { Package, Truck, CheckCircle, X, UploadCloud, AlertCircle } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function OrdersPage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal States
  const [cancelModal, setCancelModal] = useState<string | null>(null);
  const [returnModal, setReturnModal] = useState<string | null>(null);
  const [reasonMode, setReasonMode] = useState<string>('');
  const [otherReason, setOtherReason] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Cloudinary Upload States
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchOrders = () => {
    fetch("/api/orders")
      .then(res => res.json())
      .then(data => {
        setOrders(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching orders:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/login");
    } else if (isLoaded && isSignedIn) {
      fetchOrders();
    }
  }, [isLoaded, isSignedIn, router]);

  const handleCancelSubmit = async (orderId: string) => {
    if (!reasonMode) return alert("Please select a reason.");
    if (reasonMode === 'Other' && !otherReason.trim()) return alert("Please provide a reason.");
    
    setIsProcessing(true);
    const finalReason = reasonMode === 'Other' ? otherReason : reasonMode;

    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'CANCEL', reason: finalReason })
      });
      if (res.ok) {
        setCancelModal(null);
        fetchOrders();
      } else {
        const data = await res.json();
        alert(data.message || "Failed to cancel order.");
      }
    } catch (err) {
      alert("Something went wrong.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReturnSubmit = async (orderId: string) => {
    if (!reasonMode) return alert("Please select a reason.");
    if (reasonMode === 'Other' && !otherReason.trim()) return alert("Please provide a reason.");
    if (!imageFile) return alert("Please upload a photo of the product showing the tags.");
    
    setIsProcessing(true);
    
    try {
      // 1. Upload to Cloudinary
      const formData = new FormData();
      formData.append('file', imageFile);
      formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'dripeon_preset');
      
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'demo';
      
      let imageUrl = '';
      try {
        const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
          method: 'POST',
          body: formData,
        });
        const uploadData = await uploadRes.json();
        if (uploadData.secure_url) {
          imageUrl = uploadData.secure_url;
        } else {
          throw new Error("Cloudinary upload failed");
        }
      } catch (uploadError) {
        console.error("Image upload failed", uploadError);
        // Fallback for demo purposes if cloudinary fails
        imageUrl = imagePreview || '';
      }

      // 2. Submit Return Request
      const finalReason = reasonMode === 'Other' ? otherReason : reasonMode;
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'RETURN', reason: finalReason, image: imageUrl })
      });
      
      if (res.ok) {
        setReturnModal(null);
        fetchOrders();
      } else {
        const data = await res.json();
        alert(data.message || "Failed to submit return request.");
      }
    } catch (err) {
      alert("Something went wrong.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  if (!isLoaded || loading) return <Loader />;

  return (
    <div className="container" style={{ minHeight: 'calc(100vh - 120px)', padding: '4rem 1rem' }}>
      <h1 style={{ fontSize: '3rem', color: 'var(--color-text)', marginBottom: '3rem', letterSpacing: '-1px' }}>
        MY ORDERS
      </h1>
      
      {orders.length === 0 ? (
        <div style={{ backgroundColor: 'var(--color-secondary)', padding: '4rem', border: '1px solid var(--color-border)', textAlign: 'center' }}>
          <h3 style={{ fontSize: '1.8rem', color: 'var(--color-text)', marginBottom: '1rem', fontWeight: 800 }}>No Orders Yet</h3>
          <p style={{ color: '#888', fontWeight: 500, marginBottom: '2rem', fontSize: '1.1rem' }}>Looks like you haven't bought anything yet.</p>
          <Link href="/" className="btn-primary" style={{ padding: '1rem 2.5rem' }}>
            START SHOPPING
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {orders.map((order) => (
            <div key={order._id} style={{ border: '1px solid var(--color-border)', backgroundColor: 'var(--color-secondary)', overflow: 'hidden' }}>
              
              {/* Order Header */}
              <div style={{ 
                padding: '1.5rem', 
                borderBottom: '1px solid var(--color-border)', 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1rem'
              }}>
                <div>
                  <p style={{ fontSize: '0.8rem', color: '#888', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.2rem' }}>Order ID</p>
                  <p style={{ fontSize: '1rem', color: 'var(--color-text)', fontWeight: 800 }}>{order._id}</p>
                </div>
                <div>
                  <p style={{ fontSize: '0.8rem', color: '#888', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.2rem' }}>Date</p>
                  <p style={{ fontSize: '1rem', color: 'var(--color-text)', fontWeight: 800 }}>{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <p style={{ fontSize: '0.8rem', color: '#888', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.2rem' }}>Total Amount</p>
                  <p style={{ fontSize: '1.1rem', color: 'var(--color-text)', fontWeight: 800 }}>₹{order.totalAmount}</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <span style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: ['DELIVERED', 'RETURNED'].includes(order.orderStatus) ? 'rgba(76, 175, 80, 0.1)' : 
                                     ['CANCELLED'].includes(order.orderStatus) ? 'rgba(244, 67, 54, 0.1)' : 'rgba(255, 255, 255, 0.1)',
                    color: ['DELIVERED', 'RETURNED'].includes(order.orderStatus) ? '#4caf50' : 
                           ['CANCELLED'].includes(order.orderStatus) ? '#f44336' : 'var(--color-text)',
                    fontWeight: 800,
                    fontSize: '0.8rem',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    {['PENDING', 'PROCESSING'].includes(order.orderStatus) && <Package size={16} />}
                    {['SHIPPED', 'OUT_FOR_DELIVERY'].includes(order.orderStatus) && <Truck size={16} />}
                    {['DELIVERED', 'RETURNED'].includes(order.orderStatus) && <CheckCircle size={16} />}
                    {['CANCELLED', 'RETURN_REQUESTED'].includes(order.orderStatus) && <AlertCircle size={16} />}
                    {order.orderStatus.replace('_', ' ')}
                  </span>
                </div>
              </div>

              {/* Order Items & Actions */}
              <div style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '2rem' }}>
                <div style={{ flex: 1, minWidth: '300px' }}>
                  <h4 style={{ fontSize: '0.9rem', color: 'var(--color-text)', fontWeight: 800, marginBottom: '1rem', textTransform: 'uppercase' }}>Items</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {order.products.map((item: any, idx: number) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: idx !== order.products.length - 1 ? '1px dashed var(--color-border)' : 'none', paddingBottom: idx !== order.products.length - 1 ? '1rem' : 0 }}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontSize: '1rem', color: 'var(--color-text)', fontWeight: 800 }}>{item.name}</span>
                          <span style={{ fontSize: '0.85rem', color: '#888', fontWeight: 600 }}>Size: {item.size} &nbsp;|&nbsp; Qty: {item.quantity}</span>
                        </div>
                        <span style={{ fontSize: '1rem', color: 'var(--color-text)', fontWeight: 800 }}>₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', justifyContent: 'center' }}>
                  {['PENDING', 'PROCESSING'].includes(order.orderStatus) && (
                    <button 
                      onClick={() => { setCancelModal(order._id); setReasonMode(''); setOtherReason(''); }}
                      style={{ padding: '0.8rem 2rem', backgroundColor: 'transparent', border: '1.5px solid #f44336', color: '#f44336', fontWeight: 800, cursor: 'pointer', borderRadius: '4px' }}
                    >
                      CANCEL ORDER
                    </button>
                  )}
                  {order.orderStatus === 'DELIVERED' && (
                    <button 
                      onClick={() => { setReturnModal(order._id); setReasonMode(''); setOtherReason(''); setImageFile(null); setImagePreview(null); }}
                      style={{ padding: '0.8rem 2rem', backgroundColor: 'var(--color-text)', border: 'none', color: 'var(--color-bg)', fontWeight: 800, cursor: 'pointer', borderRadius: '4px' }}
                    >
                      RETURN ORDER
                    </button>
                  )}
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* CANCEL MODAL */}
      {cancelModal && (
        <div style={modalBackdropStyle}>
          <div style={modalBoxStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.5rem' }}>Cancel Order</h3>
              <button onClick={() => setCancelModal(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text)' }}><X size={24} /></button>
            </div>
            <p style={{ marginBottom: '1rem', color: '#888' }}>Please select a reason for cancellation:</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
              {["Ordered by mistake", "Found a better price", "Changed my mind", "Other"].map(reason => (
                <label key={reason} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input type="radio" name="cancelReason" checked={reasonMode === reason} onChange={() => setReasonMode(reason)} />
                  <span style={{ fontWeight: 600 }}>{reason}</span>
                </label>
              ))}
            </div>

            {reasonMode === 'Other' && (
              <div style={{ marginBottom: '1.5rem' }}>
                <textarea 
                  placeholder="Please specify (max 180 chars)"
                  maxLength={180}
                  value={otherReason}
                  onChange={(e) => setOtherReason(e.target.value)}
                  style={{ width: '100%', height: '80px', padding: '0.8rem', backgroundColor: 'var(--color-bg)', color: 'var(--color-text)', border: '1px solid var(--color-border)', borderRadius: '4px', resize: 'none', fontFamily: 'inherit' }}
                />
                <p style={{ fontSize: '0.8rem', color: '#888', textAlign: 'right', marginTop: '0.3rem' }}>{otherReason.length}/180</p>
              </div>
            )}

            <button 
              onClick={() => handleCancelSubmit(cancelModal)}
              disabled={isProcessing}
              style={{ width: '100%', padding: '1rem', backgroundColor: '#f44336', color: '#fff', border: 'none', fontWeight: 800, cursor: isProcessing ? 'not-allowed' : 'pointer', borderRadius: '4px' }}
            >
              {isProcessing ? 'PROCESSING...' : 'CONFIRM CANCELLATION'}
            </button>
          </div>
        </div>
      )}

      {/* RETURN MODAL */}
      {returnModal && (
        <div style={modalBackdropStyle}>
          <div style={modalBoxStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.5rem' }}>Return Order</h3>
              <button onClick={() => setReturnModal(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text)' }}><X size={24} /></button>
            </div>
            
            <p style={{ marginBottom: '1rem', color: '#888' }}>Upload a photo of the product (with tags):</p>
            <div 
              onClick={() => fileInputRef.current?.click()}
              style={{ width: '100%', height: '150px', border: '2px dashed var(--color-border)', borderRadius: '4px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', marginBottom: '1.5rem', backgroundColor: 'var(--color-bg)', overflow: 'hidden' }}
            >
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              ) : (
                <>
                  <UploadCloud size={32} color="#888" style={{ marginBottom: '0.5rem' }} />
                  <span style={{ fontWeight: 600, color: '#888' }}>Click to Upload Image</span>
                </>
              )}
            </div>
            <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageChange} style={{ display: 'none' }} />

            <p style={{ marginBottom: '1rem', color: '#888' }}>Please select a reason for the return:</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
              {["Size doesn't fit", "Defective or Damaged", "Wrong item received", "Other"].map(reason => (
                <label key={reason} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input type="radio" name="returnReason" checked={reasonMode === reason} onChange={() => setReasonMode(reason)} />
                  <span style={{ fontWeight: 600 }}>{reason}</span>
                </label>
              ))}
            </div>

            {reasonMode === 'Other' && (
              <div style={{ marginBottom: '1.5rem' }}>
                <textarea 
                  placeholder="Please specify (max 180 chars)"
                  maxLength={180}
                  value={otherReason}
                  onChange={(e) => setOtherReason(e.target.value)}
                  style={{ width: '100%', height: '80px', padding: '0.8rem', backgroundColor: 'var(--color-bg)', color: 'var(--color-text)', border: '1px solid var(--color-border)', borderRadius: '4px', resize: 'none', fontFamily: 'inherit' }}
                />
                <p style={{ fontSize: '0.8rem', color: '#888', textAlign: 'right', marginTop: '0.3rem' }}>{otherReason.length}/180</p>
              </div>
            )}

            <button 
              onClick={() => handleReturnSubmit(returnModal)}
              disabled={isProcessing}
              style={{ width: '100%', padding: '1rem', backgroundColor: 'var(--color-text)', color: 'var(--color-bg)', border: 'none', fontWeight: 800, cursor: isProcessing ? 'not-allowed' : 'pointer', borderRadius: '4px' }}
            >
              {isProcessing ? 'SUBMITTING...' : 'REQUEST RETURN'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const modalBackdropStyle: React.CSSProperties = {
  position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 100,
  display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
};

const modalBoxStyle: React.CSSProperties = {
  backgroundColor: 'var(--color-secondary)', border: '1px solid var(--color-border)', borderRadius: '8px',
  width: '100%', maxWidth: '500px', padding: '2rem', maxHeight: '90vh', overflowY: 'auto',
  color: 'var(--color-text)'
};
