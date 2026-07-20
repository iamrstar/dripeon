"use client";

import Link from 'next/link';
import { ShoppingCart, Menu, X, User, Search, Sun, Moon, Plus, Minus } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';
import { useSession, signOut } from 'next-auth/react';
import { useCart } from '@/context/CartContext';
import SearchOverlay from '@/components/SearchOverlay';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [expandedMobileMenu, setExpandedMobileMenu] = useState<string | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [marqueeText, setMarqueeText] = useState("FREE SHIPPING ON ALL ORDERS OVER ₹999");
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { data: session } = useSession();
  const profileRef = useRef<HTMLDivElement>(null);
  const { cartItems, openCart } = useCart();

  useEffect(() => {
    setMounted(true);
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setCategories(data);
      })
      .catch(err => console.error('Failed to load categories', err));

    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.settings.marquee_text) {
          setMarqueeText(data.settings.marquee_text);
        }
      })
      .catch(err => console.error('Failed to load settings', err));
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
      <div className="announcement-bar" style={{ backgroundColor: '#000000', color: '#ffffff', padding: '0.6rem 1rem', textAlign: 'center', border: 'none' }}>
        <div style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '1.5px', textTransform: 'uppercase', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {marqueeText}
        </div>
      </div>
      <nav className="navbar">
        <div className="container navbar-content">
          
          {/* Mobile Menu Button */}
          <button className="mobile-menu-btn" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={26} /> : <Menu size={26} />}
          </button>

          {/* Desktop Nav - Left */}
          <div className="nav-desktop-wrapper" onMouseLeave={() => setActiveMenu(null)}>
            <div className="nav-links">
              {categories.map((cat) => (
                <div key={cat._id} className="nav-item-wrapper" onMouseEnter={() => setActiveMenu(cat.slug)}>
                  <Link href={`/collections/${cat.slug}`} className="nav-link-main">{cat.name}</Link>
                </div>
              ))}
            </div>

            {/* Megamenu Overlay */}
            <AnimatePresence>
              {activeMenu && categories.find(c => c.slug === activeMenu) && (
                <motion.div 
                  className="megamenu-panel"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  onMouseEnter={() => setActiveMenu(activeMenu)}
                >
                  <div className="container megamenu-container">
                    <div className="megamenu-columns">
                      {categories.find(c => c.slug === activeMenu).columns.map((col: any, i: number) => (
                        <div key={i} className="megamenu-col">
                          <h4>{col.title}</h4>
                          {col.links.map((link: any, j: number) => (
                            <Link key={j} href={link.url}>{link.label}</Link>
                          ))}
                        </div>
                      ))}
                    </div>
                    <div className="megamenu-images">
                      {categories.find(c => c.slug === activeMenu).imageCards.map((img: any, i: number) => (
                        <Link key={i} href={img.url} className="megamenu-image-card">
                          <img src={img.imageUrl} alt={img.title} />
                          <div className="megamenu-image-text">
                            <span>{img.title}</span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Logo - Center */}
          <Link href="/" className="logo" style={{ textDecoration: 'none', margin: '0 auto', display: 'flex', alignItems: 'center' }}>
            <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 900, fontSize: '1.75rem', letterSpacing: '-0.05em', color: 'var(--color-text)' }}>
              DRIPEON
            </span>
          </Link>

          {/* Icons - Right */}
          <div className="nav-icons">
            {mounted && (
              <button 
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                aria-label="Toggle Theme" 
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}
              >
                {theme === 'dark' ? <Sun size={22} /> : <Moon size={22} />}
              </button>
            )}
            <button 
              aria-label="Search" 
              onClick={() => setSearchOpen(true)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}
            >
              <Search size={22} />
            </button>
            
            <div ref={profileRef} style={{ position: 'relative' }}>
              {session ? (
                <>
                  <button 
                    onClick={() => setProfileOpen(!profileOpen)}
                    aria-label="Account Menu"
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', display: 'flex', alignItems: 'center' }}
                  >
                    <User size={22} />
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
                          right: -10,
                          backgroundColor: 'var(--color-bg)',
                          border: '1px solid var(--color-border)',
                          boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                          width: '200px',
                          display: 'flex',
                          flexDirection: 'column',
                          zIndex: 50
                        }}
                      >
                        <div style={{ padding: '1rem', borderBottom: '1px solid var(--color-border)', fontWeight: 700, fontSize: '0.9rem' }}>
                          Hi, {session.user?.name?.split(' ')[0] || 'User'}
                        </div>
                        <Link href="/profile/orders" onClick={() => setProfileOpen(false)} style={{ padding: '1rem', borderBottom: '1px solid var(--color-border)', textDecoration: 'none', color: 'inherit', fontWeight: 500, fontSize: '0.9rem' }}>
                          My Orders
                        </Link>
                        <Link href="/profile/wishlist" onClick={() => setProfileOpen(false)} style={{ padding: '1rem', borderBottom: '1px solid var(--color-border)', textDecoration: 'none', color: 'inherit', fontWeight: 500, fontSize: '0.9rem' }}>
                          Wishlist
                        </Link>
                        <button 
                          onClick={() => { signOut(); setProfileOpen(false); }}
                          style={{ padding: '1rem', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', color: '#ff3333', fontWeight: 700, fontSize: '0.9rem' }}
                        >
                          Logout
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              ) : (
                <Link href="/login" aria-label="Account">
                  <User size={22} />
                </Link>
              )}
            </div>

            <button onClick={openCart} aria-label="Cart" style={{ position: 'relative', background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}>
              <ShoppingCart size={22} />
              {mounted && cartItems.length > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-6px',
                  right: '-8px',
                  backgroundColor: '#000000',
                  color: '#ffffff',
                  fontSize: '0.65rem',
                  fontWeight: 800,
                  width: '18px',
                  height: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '50%',
                  border: '2px solid var(--color-bg)'
                }}>
                  {cartItems.length}
                </span>
              )}
            </button>
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
                background: 'var(--color-bg)',
                borderBottom: '1px solid var(--color-border)',
                padding: '2rem 1.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.5rem',
                overflow: 'hidden',
                boxShadow: '0 10px 20px rgba(0, 0, 0, 0.05)'
              }}
            >
              {categories.map((cat) => (
                <div key={cat._id} style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Link 
                      href={`/collections/${cat.slug}`} 
                      onClick={() => setIsOpen(false)} 
                      style={{ fontWeight: 800, fontSize: '1.5rem', textTransform: 'uppercase', letterSpacing: '-0.02em', flex: 1 }}
                    >
                      {cat.name}
                    </Link>
                    <button 
                      onClick={() => setExpandedMobileMenu(expandedMobileMenu === cat.slug ? null : cat.slug)}
                      style={{ background: 'none', border: 'none', padding: '0.5rem', cursor: 'pointer', color: 'var(--color-text)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      {expandedMobileMenu === cat.slug ? <Minus size={24} /> : <Plus size={24} />}
                    </button>
                  </div>
                  
                  <AnimatePresence>
                    {expandedMobileMenu === cat.slug && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        style={{ overflow: 'hidden', paddingLeft: '1rem', marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
                      >
                        {cat.columns.map((col: any, i: number) => (
                          <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <h4 style={{ fontSize: '0.85rem', color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>{col.title}</h4>
                            {col.links.map((link: any, j: number) => (
                              <Link 
                                key={j} 
                                href={link.url} 
                                onClick={() => setIsOpen(false)}
                                style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--color-text)' }}
                              >
                                {link.label}
                              </Link>
                            ))}
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
