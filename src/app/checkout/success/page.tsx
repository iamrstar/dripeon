"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

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
    <motion.div 
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
      style={{ 
        width: '100%', 
        maxWidth: '650px', 
        padding: '4rem 3rem', 
        backgroundColor: 'var(--color-secondary)', 
        backgroundImage: 'radial-gradient(circle at top, rgba(16, 185, 129, 0.05) 0%, transparent 50%)',
        border: '1px solid rgba(16, 185, 129, 0.2)',
        boxShadow: '0 20px 40px rgba(0,0,0,0.4), 0 0 60px rgba(16, 185, 129, 0.05)',
        borderRadius: '16px',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    }}>
      <motion.div
        style={{ 
          filter: 'drop-shadow(0 0 20px rgba(16, 185, 129, 0.6))',
          marginBottom: '1.5rem',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <motion.svg
          width="100" 
          height="100" 
          viewBox="0 0 100 100" 
          fill="none"
          initial="hidden"
          animate="visible"
        >
          <motion.circle 
            cx="50" cy="50" r="40" 
            stroke="#10b981" 
            strokeWidth="6" 
            variants={{ hidden: { pathLength: 0, opacity: 0 }, visible: { pathLength: 1, opacity: 1 } }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
          />
          <motion.path 
            d="M 35 50 L 45 60 L 65 40" 
            stroke="#10b981" 
            strokeWidth="6" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            variants={{ hidden: { pathLength: 0, opacity: 0 }, visible: { pathLength: 1, opacity: 1 } }}
            transition={{ duration: 0.4, delay: 0.6, ease: "easeOut" }}
          />
        </motion.svg>
      </motion.div>
      
      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        style={{ fontSize: '3.5rem', marginBottom: '1rem', color: '#10b981', lineHeight: 1, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-1px' }}
      >
        Drip Drip Dripeon!
      </motion.h1>
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        style={{ color: '#888', fontSize: '1.1rem', fontWeight: 600, marginBottom: '2rem', lineHeight: 1.6 }}
      >
        <p style={{ color: 'var(--color-text)', fontSize: '1.3rem', fontWeight: 800, marginBottom: '0.8rem' }}>Your order is successfully placed!</p>
        <p style={{ marginBottom: '0.4rem' }}>Tracking details will be shared when your item is shipped.</p>
        <p style={{ color: 'var(--color-accent-gold)', fontWeight: 700 }}>Your item will be delivered in 5-7 days.</p>
      </motion.div>

      {orderId && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          style={{ 
            padding: '1.2rem', 
            backgroundColor: 'rgba(255,255,255,0.03)', 
            border: '1px solid rgba(255,255,255,0.1)', 
            borderRadius: '12px',
            width: '100%', 
            marginBottom: order ? '2rem' : '3rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <span style={{ color: '#888', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px' }}>
            Order Number
          </span>
          <span style={{ 
            color: 'var(--color-text)', 
            fontSize: '1.8rem', 
            fontWeight: 900, 
            letterSpacing: '1px',
            background: 'linear-gradient(90deg, #fff, #ccc)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            #{order?.orderNumber || parseInt(orderId.slice(-6), 16).toString().padStart(8, '0')}
          </span>
        </motion.div>
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
            <span style={{ fontWeight: 900, fontSize: '1.4rem', color: '#10b981' }}>₹{order.totalAmount.toLocaleString()}</span>
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
    </motion.div>
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
