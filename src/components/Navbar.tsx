"use client";

import Link from 'next/link';
import { ShoppingCart, Menu, X, User, Search, Sun, Moon } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';
import { useSession, signOut } from 'next-auth/react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [imageError, setImageError] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { data: session } = useSession();
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    };

    if (profileOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [profileOpen]);

  return (
    <>
      <div className="announcement-bar marquee-container" style={{ backgroundColor: '#FF0033', color: '#ffffff', padding: '0.5rem 0', border: 'none' }}>
        <div className="marquee-content" style={{ fontSize: '0.85rem', fontWeight: 700, letterSpacing: '1px' }}>
          FREE SHIPPING ON ALL ORDERS OVER ₹999 &nbsp;&nbsp;|&nbsp;&nbsp; SHOP THE LATEST DROP &nbsp;&nbsp;|&nbsp;&nbsp; DRIPEON EXCLUSIVES &nbsp;&nbsp;|&nbsp;&nbsp; FREE SHIPPING ON ALL ORDERS OVER ₹999 &nbsp;&nbsp;|&nbsp;&nbsp; SHOP THE LATEST DROP
        </div>
      </div>
      <nav className="navbar">
        <div className="container navbar-content">
          
          {/* Mobile Menu Button */}
          <button className="mobile-menu-btn" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>

          {/* Desktop Nav - Left */}
          <div className="nav-links">
            <Link href="/collections/topwear">Topwear</Link>
            <Link href="/collections/bottomwear">Bottomwear</Link>
            <Link href="/collections/accessories">Accessories</Link>
          </div>

          {/* Logo - Center */}
          <Link href="/" className="logo" style={{ textDecoration: 'none', margin: '0 auto' }}>
            {!imageError ? (
              <img 
                src="/logo1.png" 
                alt="Dripeon Logo" 
                style={{ height: '50px', width: 'auto' }} 
                onError={() => setImageError(true)} 
              />
            ) : (
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '2rem', letterSpacing: '-1px' }}>DRIPEON</span>
            )}
          </Link>

          {/* Icons - Right */}
          <div className="nav-icons">
            {mounted && (
              <button 
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                aria-label="Toggle Theme" 
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}
              >
                {theme === 'dark' ? <Sun size={24} /> : <Moon size={24} />}
              </button>
            )}
            <button aria-label="Search" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}>
              <Search size={24} />
            </button>
            
            <div ref={profileRef} style={{ position: 'relative' }}>
              {session ? (
                <>
                  <button 
                    onClick={() => setProfileOpen(!profileOpen)}
                    aria-label="Account Menu"
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', display: 'flex', alignItems: 'center' }}
                  >
                    <User size={24} />
                  </button>
                  <AnimatePresence>
                    {profileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        style={{
                          position: 'absolute',
                          top: '140%',
                          right: 0,
                          backgroundColor: 'var(--color-bg)',
                          border: '1px solid var(--color-border)',
                          boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                          width: '200px',
                          display: 'flex',
                          flexDirection: 'column',
                          zIndex: 50
                        }}
                      >
                        <div style={{ padding: '1rem', borderBottom: '1px solid var(--color-border)', fontWeight: 800 }}>
                          Hi, {session.user?.name?.split(' ')[0] || 'User'}
                        </div>
                        <Link href="/profile/orders" onClick={() => setProfileOpen(false)} style={{ padding: '1rem', borderBottom: '1px solid var(--color-border)', textDecoration: 'none', color: 'inherit', fontWeight: 600 }}>
                          My Orders
                        </Link>
                        <Link href="/profile/wishlist" onClick={() => setProfileOpen(false)} style={{ padding: '1rem', borderBottom: '1px solid var(--color-border)', textDecoration: 'none', color: 'inherit', fontWeight: 600 }}>
                          Wishlist
                        </Link>
                        <button 
                          onClick={() => { signOut(); setProfileOpen(false); }}
                          style={{ padding: '1rem', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', color: '#FF0033', fontWeight: 800 }}
                        >
                          Logout
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              ) : (
                <Link href="/login" aria-label="Account">
                  <User size={24} />
                </Link>
              )}
            </div>

            <Link href="/checkout" aria-label="Cart">
              <ShoppingCart size={24} />
            </Link>
          </div>
        </div>

        {/* Mobile Nav Overlay */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                width: '100%',
                background: '#ffffff',
                borderBottom: '1px solid var(--color-border)',
                padding: '2rem 1rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.5rem',
                overflow: 'hidden',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
              }}
            >
              <Link href="/collections/topwear" onClick={() => setIsOpen(false)} style={{ fontWeight: 700, fontSize: '1.2rem', textTransform: 'uppercase' }}>Topwear</Link>
              <Link href="/collections/bottomwear" onClick={() => setIsOpen(false)} style={{ fontWeight: 700, fontSize: '1.2rem', textTransform: 'uppercase' }}>Bottomwear</Link>
              <Link href="/collections/accessories" onClick={() => setIsOpen(false)} style={{ fontWeight: 700, fontSize: '1.2rem', textTransform: 'uppercase' }}>Accessories</Link>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
}
