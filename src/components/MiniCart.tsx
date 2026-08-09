"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

export default function MiniCart() {
  const { isCartOpen, closeCart, cartItems, updateQuantity, removeFromCart, cartTotal } = useCart();

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={closeCart}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              zIndex: 9998,
              backdropFilter: 'blur(2px)',
            }}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3, ease: 'easeOut' }}
            style={{
              position: 'fixed',
              top: 0,
              right: 0,
              width: '100%',
              maxWidth: '400px',
              height: '100vh',
              backgroundColor: 'var(--color-bg)',
              zIndex: 9999,
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '-10px 0 30px rgba(0, 0, 0, 0.1)',
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', borderBottom: '1px solid var(--color-border)' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, textTransform: 'uppercase', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShoppingBag size={20} /> Your Cart
              </h2>
              <button 
                onClick={closeCart}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.5rem', color: 'var(--color-text)' }}
              >
                <X size={24} />
              </button>
            </div>

            {/* Cart Items */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
              {cartItems.length === 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#888', gap: '1rem' }}>
                  <ShoppingBag size={48} strokeWidth={1} />
                  <p>Your cart is currently empty.</p>
                  <button onClick={closeCart} className="btn-outline" style={{ marginTop: '1rem' }}>
                    CONTINUE SHOPPING
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {cartItems.map((item) => (
                    <div key={`${item.id}-${item.size}`} style={{ display: 'flex', gap: '1rem' }}>
                      <div style={{ width: '80px', height: '100px', position: 'relative', backgroundColor: '#f5f5f5', flexShrink: 0 }}>
                        <Image src={item.image} alt={item.name} fill style={{ objectFit: 'cover' }} />
                      </div>
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <div>
                          <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 600, textTransform: 'uppercase' }}>{item.name}</h4>
                          <p style={{ margin: '0.2rem 0 0', fontSize: '0.8rem', color: '#666' }}>Size: {item.size}</p>
                          <p style={{ margin: '0.2rem 0 0', fontSize: '0.9rem', fontWeight: 600 }}>₹{item.price.toLocaleString()}</p>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--color-border)' }}>
                            <button 
                              onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                              style={{ background: 'none', border: 'none', padding: '0.2rem 0.5rem', cursor: 'pointer' }}
                            >
                              <Minus size={14} />
                            </button>
                            <span style={{ fontSize: '0.9rem', width: '20px', textAlign: 'center', fontWeight: 500 }}>
                              {item.quantity}
                            </span>
                            <button 
                              onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                              disabled={item.maxStock !== undefined && item.quantity >= item.maxStock}
                              style={{ 
                                background: 'none', border: 'none', padding: '0.2rem 0.5rem', 
                                cursor: (item.maxStock !== undefined && item.quantity >= item.maxStock) ? 'not-allowed' : 'pointer',
                                opacity: (item.maxStock !== undefined && item.quantity >= item.maxStock) ? 0.3 : 1
                              }}
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                          <button 
                            onClick={() => removeFromCart(item.id, item.size)}
                            style={{ background: 'none', border: 'none', fontSize: '0.75rem', textDecoration: 'underline', color: '#888', cursor: 'pointer' }}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {cartItems.length > 0 && (
              <div style={{ padding: '1.5rem', borderTop: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <span style={{ fontWeight: 600, textTransform: 'uppercase' }}>Subtotal</span>
                  <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>₹{cartTotal.toLocaleString()}</span>
                </div>
                <p style={{ fontSize: '0.75rem', color: '#888', marginBottom: '1.5rem', textAlign: 'center' }}>
                  Shipping & taxes calculated at checkout
                </p>
                <Link href="/checkout" onClick={closeCart} style={{ width: '100%', textDecoration: 'none' }}>
                  <button className="btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1rem' }}>
                    PROCEED TO CHECKOUT
                  </button>
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
