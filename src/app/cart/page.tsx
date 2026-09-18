"use client";

import { useCart } from "@/context/CartContext";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import { Minus, Plus, Trash2, ArrowRight, ShieldCheck, Truck, RotateCcw, Tag } from "lucide-react";

export default function CartPage() {
  const {
    cartItems,
    cartTotal,
    removeFromCart,
    updateQuantity,
    appliedCoupon,
    discountAmount,
    applyCoupon,
    removeCoupon
  } = useCart();

  const [couponCode, setCouponCode] = useState("");
  const [couponMessage, setCouponMessage] = useState<{ text: string; type: 'success' | 'error' | '' }>({ text: '', type: '' });
  const [applying, setApplying] = useState(false);

  const shippingCost = cartTotal > 999 || cartItems.length === 0 ? 0 : 100;
  const finalTotal = Math.max(0, cartTotal - discountAmount + shippingCost);
  const freeShippingThreshold = 999;
  const progressToFreeShipping = Math.min(100, (cartTotal / freeShippingThreshold) * 100);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    setApplying(true);
    const res = await applyCoupon(couponCode.trim());
    setCouponMessage({ text: res.message, type: res.success ? 'success' : 'error' });
    setApplying(false);
    if (res.success) setCouponCode("");
  };

  if (cartItems.length === 0) {
    return (
      <div className="container" style={{ minHeight: '65vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '4rem 1.5rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '1rem', letterSpacing: '-0.5px' }}>YOUR CART IS EMPTY</h1>
        <p style={{ color: '#888', marginBottom: '2.5rem', fontSize: '1.1rem', maxWidth: '400px' }}>
          Looks like you haven&apos;t added any drip to your bag yet.
        </p>
        <Link href="/collections/all" className="btn-primary" style={{ padding: '1.2rem 3rem', borderRadius: '4px', textDecoration: 'none' }}>
          START SHOPPING
        </Link>
      </div>
    );
  }

  return (
    <div style={{ minHeight: 'calc(100vh - 120px)', backgroundColor: 'var(--color-bg)', paddingBottom: '5rem' }}>
      {/* Header */}
      <div style={{ borderBottom: '1px solid var(--color-border)', padding: '2rem 0' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-1px', margin: 0 }}>
              Shopping Bag
            </h1>
            <p style={{ color: '#888', fontSize: '0.9rem', marginTop: '0.5rem', margin: 0 }}>
              {cartItems.reduce((acc, item) => acc + item.quantity, 0)} items in your cart
            </p>
          </div>
          <Link href="/collections/all" style={{ color: 'var(--color-text)', fontSize: '0.9rem', fontWeight: 700, textDecoration: 'underline' }}>
            Continue Shopping
          </Link>
        </div>
      </div>

      <div className="container" style={{ paddingTop: '3rem' }}>
        {/* Free Shipping Progress */}
        {cartTotal < freeShippingThreshold ? (
          <div style={{ backgroundColor: 'var(--color-secondary)', padding: '1.2rem 1.5rem', borderRadius: '8px', marginBottom: '2.5rem', border: '1px solid var(--color-border)' }}>
            <p style={{ fontSize: '0.9rem', fontWeight: 700, margin: '0 0 0.8rem 0' }}>
              Add <span style={{ color: '#e53935' }}>₹{freeShippingThreshold - cartTotal}</span> more to get <span style={{ textDecoration: 'underline' }}>FREE SHIPPING</span>!
            </p>
            <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--color-border)', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{ width: `${progressToFreeShipping}%`, height: '100%', backgroundColor: 'var(--color-text)', transition: 'width 0.3s ease' }} />
            </div>
          </div>
        ) : (
          <div style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.3)', padding: '1rem 1.5rem', borderRadius: '8px', marginBottom: '2.5rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <Truck size={20} color="#22c55e" />
            <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#22c55e' }}>
              You&apos;ve unlocked FREE SHIPPING!
            </span>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '3.5rem', alignItems: 'start' }} className="cart-grid">
          
          {/* Item List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {cartItems.map((item) => (
              <motion.div
                key={`${item.id}-${item.size}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                style={{
                  display: 'flex',
                  gap: '1.5rem',
                  paddingBottom: '1.5rem',
                  borderBottom: '1px solid var(--color-border)',
                  alignItems: 'center',
                }}
              >
                {/* Product Image */}
                <Link href={`/products/${item.id}`} style={{ position: 'relative', width: '100px', height: '120px', borderRadius: '8px', overflow: 'hidden', flexShrink: 0, backgroundColor: '#f0f0f0' }}>
                  <Image src={item.image} alt={item.name} fill style={{ objectFit: 'cover' }} sizes="100px" />
                </Link>

                {/* Product Details */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <Link href={`/products/${item.id}`} style={{ textDecoration: 'none', color: 'var(--color-text)' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '0 0 0.3rem 0', textTransform: 'uppercase' }}>
                      {item.name}
                    </h3>
                  </Link>
                  <p style={{ color: '#888', fontSize: '0.85rem', margin: '0 0 0.8rem 0', fontWeight: 600 }}>
                    Size: <span style={{ color: 'var(--color-text)' }}>{item.size}</span>
                  </p>
                  <p style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0 }}>
                    ₹{item.price}
                  </p>
                </div>

                {/* Quantity Controls */}
                <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--color-border)', borderRadius: '4px', overflow: 'hidden' }}>
                  <button
                    onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                    style={{ padding: '0.5rem 0.8rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text)', display: 'flex', alignItems: 'center' }}
                    aria-label="Decrease quantity"
                  >
                    <Minus size={14} />
                  </button>
                  <span style={{ padding: '0 0.8rem', fontWeight: 700, fontSize: '0.9rem' }}>
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                    style={{ padding: '0.5rem 0.8rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text)', display: 'flex', alignItems: 'center' }}
                    aria-label="Increase quantity"
                  >
                    <Plus size={14} />
                  </button>
                </div>

                {/* Total & Remove */}
                <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.8rem' }}>
                  <span style={{ fontWeight: 900, fontSize: '1.15rem' }}>
                    ₹{item.price * item.quantity}
                  </span>
                  <button
                    onClick={() => removeFromCart(item.id, item.size)}
                    style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', padding: '4px', transition: 'color 0.2s' }}
                    aria-label="Remove item"
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#e53935')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#888')}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Order Summary Card */}
          <div style={{ backgroundColor: 'var(--color-secondary)', padding: '2rem', borderRadius: '12px', border: '1px solid var(--color-border)', position: 'sticky', top: '2rem' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 900, textTransform: 'uppercase', margin: '0 0 1.5rem 0' }}>
              Order Summary
            </h2>

            {/* Coupon Code Section */}
            <div style={{ marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--color-border)' }}>
              {appliedCoupon ? (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(34, 197, 94, 0.1)', padding: '0.8rem 1rem', borderRadius: '6px', border: '1px dashed #22c55e' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Tag size={16} color="#22c55e" />
                    <span style={{ fontWeight: 800, fontSize: '0.85rem', color: '#22c55e' }}>{appliedCoupon}</span>
                  </div>
                  <button onClick={removeCoupon} style={{ background: 'none', border: 'none', color: '#e53935', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}>
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="text"
                    placeholder="Enter Coupon Code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    style={{ flex: 1, padding: '0.8rem 1rem', border: '1px solid var(--color-border)', borderRadius: '4px', backgroundColor: 'var(--color-bg)', color: 'var(--color-text)', fontSize: '0.9rem', textTransform: 'uppercase', fontWeight: 600 }}
                  />
                  <button type="submit" disabled={applying || !couponCode.trim()} className="btn-primary" style={{ padding: '0.8rem 1.2rem', borderRadius: '4px', fontSize: '0.85rem' }}>
                    {applying ? "..." : "APPLY"}
                  </button>
                </form>
              )}
              {couponMessage.text && (
                <p style={{ fontSize: '0.8rem', marginTop: '0.6rem', marginBottom: 0, fontWeight: 600, color: couponMessage.type === 'success' ? '#22c55e' : '#e53935' }}>
                  {couponMessage.text}
                </p>
              )}
            </div>

            {/* Price Calculations */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#888' }}>Subtotal</span>
                <span style={{ fontWeight: 700 }}>₹{cartTotal}</span>
              </div>
              {discountAmount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#22c55e' }}>
                  <span>Discount</span>
                  <span style={{ fontWeight: 700 }}>-₹{discountAmount}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#888' }}>Estimated Shipping</span>
                <span style={{ fontWeight: 700 }}>{shippingCost === 0 ? 'FREE' : `₹${shippingCost}`}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '1rem', borderTop: '1px solid var(--color-border)', fontSize: '1.25rem', fontWeight: 900 }}>
                <span>Total</span>
                <span>₹{finalTotal}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <Link
              href="/checkout"
              className="btn-primary"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                width: '100%',
                padding: '1.2rem',
                borderRadius: '6px',
                fontSize: '1rem',
                textDecoration: 'none',
                fontWeight: 800,
                letterSpacing: '0.5px'
              }}
            >
              PROCEED TO CHECKOUT <ArrowRight size={18} />
            </Link>

            {/* Trust Badges */}
            <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '0.8rem', borderTop: '1px solid var(--color-border)', paddingTop: '1.5rem', fontSize: '0.85rem', color: '#888' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <ShieldCheck size={16} color="var(--color-text)" />
                <span>100% Authentic &amp; Quality Checked</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <RotateCcw size={16} color="var(--color-text)" />
                <span>Easy 7-day Returns &amp; Exchanges</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Truck size={16} color="var(--color-text)" />
                <span>Pan-India Express Delivery in 3-5 days</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .cart-grid {
            grid-template-columns: 1fr !important;
            gap: 2.5rem !important;
          }
        }
      `}</style>
    </div>
  );
}
