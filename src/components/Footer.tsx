"use client";

import Link from "next/link";
import { useState } from "react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer style={{ backgroundColor: '#000000', color: '#ffffff', padding: '6rem 0 2rem 0', marginTop: '4rem', fontFamily: 'var(--font-sans)' }}>
      <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '4rem', marginBottom: '4rem' }}>
        
        {/* Brand Column */}
        <div style={{ flex: '1 1 300px' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-2px', marginBottom: '1.5rem', color: '#ffffff' }}>
            DRIPEON
          </h2>
          <p style={{ color: '#a3a3a3', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '2rem', maxWidth: '320px' }}>
            Premium streetwear and hip-hop outfits. Quality pieces designed for the culture. Drip Starts Here.
          </p>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Link href="https://www.instagram.com/dripeon_?igsh=YzhreDNoZ3Y1aXBz" target="_blank" style={{ color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '45px', height: '45px', borderRadius: '50%', border: '1px solid #333', transition: 'all 0.3s ease' }} className="footer-social-link">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </Link>
          </div>
        </div>

        {/* Links Column */}
        <div>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.5rem', color: '#ffffff', letterSpacing: '1px' }}>SHOP</h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <li><Link href="/collections/topwear" className="footer-link">Topwear</Link></li>
            <li><Link href="/collections/bottomwear" className="footer-link">Bottomwear</Link></li>
            <li><Link href="/collections/accessories" className="footer-link">Accessories</Link></li>
            <li><Link href="/collections/new-arrivals" className="footer-link">New Arrivals</Link></li>
          </ul>
        </div>

        {/* Support Column */}
        <div>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.5rem', color: '#ffffff', letterSpacing: '1px' }}>SUPPORT</h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <li><Link href="/faq" className="footer-link">FAQ</Link></li>
            <li><Link href="/shipping-policy" className="footer-link">Shipping & Returns</Link></li>
            <li><Link href="/track-order" className="footer-link">Track Order</Link></li>
            <li><Link href="/contact" className="footer-link">Contact Us</Link></li>
          </ul>
        </div>

        {/* Newsletter Column */}
        <div style={{ flex: '1 1 300px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.5rem', color: '#ffffff', letterSpacing: '1px' }}>JOIN THE DRIP LIST</h3>
          <p style={{ color: '#a3a3a3', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
            Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.
          </p>
          
          {subscribed ? (
            <div style={{ backgroundColor: '#1a1a1a', border: '1px solid #333', color: '#ffffff', padding: '1.2rem', borderRadius: '4px', fontWeight: 600, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
              You're on the list!
            </div>
          ) : (
            <form onSubmit={handleSubscribe} style={{ position: 'relative', display: 'flex' }}>
              <input 
                type="email" 
                placeholder="Enter your email address" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: '100%', padding: '1rem 3.5rem 1rem 1rem', border: '1px solid #333', borderRadius: '0', backgroundColor: '#111', color: '#fff', fontSize: '0.95rem', outline: 'none', transition: 'border-color 0.3s' }}
                onFocus={(e) => (e.target.style.borderColor = '#666')}
                onBlur={(e) => (e.target.style.borderColor = '#333')}
              />
              <button 
                type="submit" 
                style={{ position: 'absolute', right: 0, top: 0, height: '100%', padding: '0 1.2rem', backgroundColor: '#fff', color: '#000', border: 'none', fontWeight: 800, cursor: 'pointer', transition: 'background-color 0.2s' }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#e5e5e5')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#fff')}
                aria-label="Subscribe"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </button>
            </form>
          )}
        </div>
      </div>
      
      <div className="container" style={{ borderTop: '1px solid #222', paddingTop: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '2rem' }}>
        
        {/* Left Side: Copyright & Credits */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <p style={{ color: '#888', fontSize: '0.85rem', margin: 0 }}>
            &copy; {new Date().getFullYear()} Dripeon. All rights reserved.
          </p>
          <p style={{ color: '#666', fontSize: '0.75rem', margin: 0 }}>
            designed and developed by <a href="https://hancore-technologies.vercel.app" target="_blank" rel="noopener noreferrer" style={{ color: '#fff', textDecoration: 'none', fontWeight: 600, borderBottom: '1px solid #333', paddingBottom: '2px', transition: 'border-color 0.3s' }} onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#fff')} onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#333')}>hancore technologies</a>
          </p>
        </div>

        {/* Middle: Payment Methods */}
        <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center', opacity: 0.7 }}>
          {/* Visa */}
          <div style={{ width: '40px', height: '25px', backgroundColor: '#fff', borderRadius: '3px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#1434CB', fontWeight: 900, fontSize: '0.7rem', fontStyle: 'italic' }}>VISA</span>
          </div>
          {/* Mastercard */}
          <div style={{ width: '40px', height: '25px', backgroundColor: '#fff', borderRadius: '3px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            <div style={{ width: '14px', height: '14px', borderRadius: '50%', backgroundColor: '#EB001B', position: 'absolute', left: '6px' }}></div>
            <div style={{ width: '14px', height: '14px', borderRadius: '50%', backgroundColor: '#F79E1B', position: 'absolute', right: '6px' }}></div>
          </div>
          {/* Amex */}
          <div style={{ width: '40px', height: '25px', backgroundColor: '#016FD0', borderRadius: '3px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#fff', fontWeight: 700, fontSize: '0.6rem' }}>AMEX</span>
          </div>
          {/* UPI */}
          <div style={{ width: '40px', height: '25px', backgroundColor: '#fff', borderRadius: '3px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#000', fontWeight: 700, fontSize: '0.65rem' }}>UPI</span>
          </div>
        </div>

        {/* Right Side: Legal Links */}
        <div style={{ display: 'flex', gap: '2rem' }}>
          <Link href="/privacy-policy" className="footer-link" style={{ fontSize: '0.85rem' }}>Privacy Policy</Link>
          <Link href="/terms-of-service" className="footer-link" style={{ fontSize: '0.85rem' }}>Terms of Service</Link>
        </div>
      </div>

      <style>{`
        .footer-social-link:hover {
          background-color: #ffffff !important;
          color: #000000 !important;
        }
        .footer-link {
          color: #a3a3a3;
          text-decoration: none;
          font-size: 0.95rem;
          font-weight: 500;
          transition: color 0.2s ease;
        }
        .footer-link:hover {
          color: #ffffff;
        }
      `}</style>
    </footer>
  );
}
