"use client";

export default function OrdersPage() {
  return (
    <div className="container" style={{ minHeight: 'calc(100vh - 120px)', padding: '4rem 1rem' }}>
      <h1 style={{ fontSize: '3rem', color: 'var(--color-text)', marginBottom: '2rem' }}>
        MY ORDERS
      </h1>
      
      <div style={{ backgroundColor: 'var(--color-secondary)', padding: '3rem', border: '1px solid var(--color-border)', textAlign: 'center' }}>
        <h3 style={{ fontSize: '1.5rem', color: 'var(--color-text)', marginBottom: '1rem' }}>No Orders Yet</h3>
        <p style={{ color: '#888', fontWeight: 600 }}>Looks like you haven't bought anything yet.</p>
      </div>
    </div>
  );
}
