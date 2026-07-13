"use client";

import { useCart } from "@/context/CartContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CheckoutPage() {
  const { cartItems, cartTotal, removeFromCart, updateQuantity } = useCart();
  const router = useRouter();

  const [address, setAddress] = useState({
    name: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    phone: ""
  });

  const handleProceed = (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) return;
    
    // In a real app, we'd save this address to a state manager or database.
    // For now, we'll store it in localStorage to pass it to the payment page.
    localStorage.setItem("dripeon_shipping_address", JSON.stringify(address));
    router.push('/checkout/payment');
  };

  if (cartItems.length === 0) {
    return (
      <div className="container" style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: 'var(--color-text)' }}>YOUR CART IS EMPTY</h2>
        <Link href="/" className="btn-primary" style={{ padding: '1rem 2rem' }}>
          CONTINUE SHOPPING
        </Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '4rem 1rem', minHeight: 'calc(100vh - 120px)' }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '3rem', color: 'var(--color-text)', lineHeight: 1 }}>
        CHECKOUT
      </h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '4rem', alignItems: 'start' }}>
        
        {/* Cart Summary */}
        <div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem' }}>
            ORDER SUMMARY
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {cartItems.map((item) => (
              <div key={`${item.id}-${item.size}`} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <div style={{ width: '80px', height: '100px', backgroundColor: 'var(--color-secondary)', backgroundImage: `url('${item.image}')`, backgroundSize: 'cover', backgroundPosition: 'center', border: '1px solid var(--color-border)' }} />
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: 'var(--color-text)' }}>{item.name}</h4>
                  <p style={{ color: '#888', margin: '0.2rem 0', fontSize: '0.9rem', fontWeight: 600 }}>Size: {item.size}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem' }}>
                    <div style={{ display: 'flex', border: '1px solid var(--color-border)' }}>
                      <button onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)} style={{ padding: '0.2rem 0.5rem', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--color-text)' }}>-</button>
                      <span style={{ padding: '0.2rem 0.8rem', fontWeight: 600, borderLeft: '1px solid var(--color-border)', borderRight: '1px solid var(--color-border)', color: 'var(--color-text)' }}>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)} style={{ padding: '0.2rem 0.5rem', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--color-text)' }}>+</button>
                    </div>
                    <button 
                      onClick={() => removeFromCart(item.id, item.size)}
                      style={{ background: 'none', border: 'none', color: 'red', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}
                    >
                      REMOVE
                    </button>
                  </div>
                </div>
                <div style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--color-text)' }}>
                  ₹{item.price * item.quantity}
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '3rem', paddingTop: '1.5rem', borderTop: '1px solid var(--color-border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '1.1rem', fontWeight: 600, color: '#888' }}>
              <span>Subtotal</span>
              <span>₹{cartTotal}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '1.1rem', fontWeight: 600, color: '#888' }}>
              <span>Shipping</span>
              <span>{cartTotal > 999 ? 'FREE' : '₹100'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-text)' }}>
              <span>TOTAL</span>
              <span>₹{cartTotal > 999 ? cartTotal : cartTotal + 100}</span>
            </div>
          </div>
        </div>

        {/* Address Form */}
        <div style={{ backgroundColor: 'var(--color-secondary)', padding: '2.5rem', border: '1px solid var(--color-border)', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '2rem', color: 'var(--color-text)' }}>
            SHIPPING DETAILS
          </h2>
          
          <form onSubmit={handleProceed} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <input type="text" placeholder="Full Name" required value={address.name} onChange={e => setAddress({...address, name: e.target.value})} style={inputStyle} />
            <input type="text" placeholder="Street Address" required value={address.street} onChange={e => setAddress({...address, street: e.target.value})} style={inputStyle} />
            
            <div style={{ display: 'flex', gap: '1rem' }}>
              <input type="text" placeholder="City" required value={address.city} onChange={e => setAddress({...address, city: e.target.value})} style={{...inputStyle, flex: 1}} />
              <input type="text" placeholder="State" required value={address.state} onChange={e => setAddress({...address, state: e.target.value})} style={{...inputStyle, flex: 1}} />
            </div>
            
            <div style={{ display: 'flex', gap: '1rem' }}>
              <input type="text" placeholder="PIN Code" required value={address.zip} onChange={e => setAddress({...address, zip: e.target.value})} style={{...inputStyle, flex: 1}} />
              <input type="tel" placeholder="Phone Number" required value={address.phone} onChange={e => setAddress({...address, phone: e.target.value})} style={{...inputStyle, flex: 1}} />
            </div>

            <button type="submit" className="btn-primary" style={{ width: '100%', padding: '1.2rem', marginTop: '1rem' }}>
              PROCEED TO PAYMENT
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}

const inputStyle = {
  width: '100%', 
  padding: '1rem', 
  backgroundColor: 'transparent',
  border: '2px solid var(--color-border)', 
  color: 'var(--color-text)',
  fontFamily: 'var(--font-sans)',
  fontWeight: 500,
  outline: 'none',
}
