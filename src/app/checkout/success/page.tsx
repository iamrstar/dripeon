"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { CheckCircle } from "lucide-react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

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
        <div style={{ padding: '1.5rem', backgroundColor: 'var(--color-bg)', border: '1px dashed var(--color-border)', width: '100%', marginBottom: '3rem' }}>
          <p style={{ color: '#888', fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>
            Order Reference
          </p>
          <p style={{ color: 'var(--color-text)', fontSize: '1.5rem', fontWeight: 900 }}>
            {orderId}
          </p>
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
