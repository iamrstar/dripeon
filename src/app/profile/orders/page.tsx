"use client";

import { useEffect, useState } from "react";
import Loader from "@/components/Loader";
import Link from "next/link";
import { Package, Truck, CheckCircle } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function OrdersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
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
    }
  }, [status, router]);

  if (status === "loading" || loading) return <Loader />;

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
                <div>
                  <span style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: order.orderStatus === 'DELIVERED' ? 'rgba(76, 175, 80, 0.1)' : 'rgba(255, 255, 255, 0.1)',
                    color: order.orderStatus === 'DELIVERED' ? '#4caf50' : 'var(--color-text)',
                    fontWeight: 800,
                    fontSize: '0.8rem',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    {order.orderStatus === 'PROCESSING' && <Package size={16} />}
                    {order.orderStatus === 'SHIPPED' && <Truck size={16} />}
                    {order.orderStatus === 'DELIVERED' && <CheckCircle size={16} />}
                    {order.orderStatus}
                  </span>
                </div>
              </div>

              {/* Order Items */}
              <div style={{ padding: '1.5rem' }}>
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

            </div>
          ))}
        </div>
      )}
    </div>
  );
}
