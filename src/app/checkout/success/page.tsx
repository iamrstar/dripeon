"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { CheckCircle } from "lucide-react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    if (orderId) {
      fetch(`/api/orders/${orderId}`)
        .then(res => res.json())
        .then(data => {
          if (data && !data.message) {
            setOrder(data);
          }
        })
        .catch(console.error);
    }
  }, [orderId]);

  return (
    <div style={{ 
      width: '100%', 
      maxWidth: '600px', 
      padding: '4rem 2rem', 
      backgroundColor: 'var(--color-secondary)', 
      border: '1px solid var(--color-border)',
      boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      <CheckCircle size={80} color="var(--color-accent-gold)" style={{ marginBottom: '2rem' }} />
      
      <h1 style={{ fontSize: '3rem', marginBottom: '1rem', color: 'var(--color-text)', lineHeight: 1 }}>
        ORDER <br/>CONFIRMED
      </h1>
      
      <p style={{ color: '#888', fontSize: '1.2rem', fontWeight: 600, marginBottom: '2rem' }}>
        Thank you for your purchase. Your drip is on the way.
      </p>

      {orderId && (
        <div style={{ padding: '1.5rem', backgroundColor: 'var(--color-bg)', border: '1px dashed var(--color-border)', width: '100%', marginBottom: order ? '1rem' : '3rem' }}>
          <p style={{ color: '#888', fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>
            Order Reference
          </p>
          <p style={{ color: 'var(--color-text)', fontSize: '1.5rem', fontWeight: 900 }}>
            {orderId}
          </p>
        </div>
      )}

      {order && (
        <div style={{ width: '100%', textAlign: 'left', marginBottom: '3rem', borderTop: '1px solid var(--color-border)', paddingTop: '2rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1.5rem', textTransform: 'uppercase' }}>Items Ordered</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {order.products.map((item: any, idx: number) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--color-bg)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                <div>
                  <p style={{ fontWeight: 800, fontSize: '0.95rem', margin: '0 0 0.2rem 0', textTransform: 'uppercase' }}>{item.name}</p>
                  <p style={{ color: '#888', fontSize: '0.8rem', margin: 0, fontWeight: 600 }}>Size: {item.size} | Qty: {item.quantity}</p>
                </div>
                <div style={{ fontWeight: 800, fontSize: '1rem' }}>
                  ₹{(item.price * item.quantity).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px dashed var(--color-border)' }}>
            <span style={{ fontWeight: 700, color: '#888' }}>Total Paid</span>
            <span style={{ fontWeight: 900, fontSize: '1.4rem' }}>₹{order.totalAmount.toLocaleString()}</span>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: '1rem', width: '100%' }}>
        <Link href="/profile/orders" className="btn-primary" style={{ flex: 1, padding: '1.2rem', fontSize: '1rem', backgroundColor: 'transparent', border: '1px solid var(--color-text)', color: 'var(--color-text)' }}>
          VIEW MY ORDERS
        </Link>
        <Link href="/" className="btn-primary" style={{ flex: 1, padding: '1.2rem', fontSize: '1rem' }}>
          BACK TO STORE
        </Link>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <div className="container" style={{ minHeight: 'calc(100vh - 120px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Suspense fallback={<div style={{ color: 'var(--color-text)' }}>Loading...</div>}>
        <SuccessContent />
      </Suspense>
    </div>
  );
}
