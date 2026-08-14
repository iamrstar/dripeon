"use client";

import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Menu, X, User, Search, Sun, Moon, Plus, Minus, ShoppingBag, Heart } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';
import { useUser, UserButton } from '@clerk/nextjs';
import { useCart } from '@/context/CartContext';
import SearchOverlay from '@/components/SearchOverlay';

export default function Navbar() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [expandedMobileMenu, setExpandedMobileMenu] = useState<string | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [marqueeText, setMarqueeText] = useState("FREE SHIPPING ON ALL ORDERS OVER ₹999");
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
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

  const leftCategories = categories.slice(0, Math.ceil(categories.length / 2));
  const rightCategories = categories.slice(Math.ceil(categories.length / 2));

  return (
    <>
      <div className="announcement-bar" style={{ backgroundColor: '#000000', color: '#ffffff', padding: '0.6rem 1rem', textAlign: 'center', border: 'none' }}>
        <div style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '1.5px', textTransform: 'uppercase', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {marqueeText}
        </div>
      </div>
      <nav className="navbar" onMouseLeave={() => setActiveMenu(null)}>
        <div className="container navbar-content">
          
          {/* Left Column */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <button className="mobile-menu-btn" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X size={26} /> : <Menu size={26} />}
            </button>

            <div className="nav-desktop-wrapper hidden md:flex">
              <div className="nav-links">
                {leftCategories.map((cat) => (
                  <div key={cat._id} className="nav-item-wrapper" onMouseEnter={() => setActiveMenu(cat.slug)}>
                    <Link href={`/collections/${cat.slug}`} className="nav-link-main">{cat.name}</Link>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Center Column - Logo */}
          <div className="logo-wrapper absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 md:static md:transform-none" style={{ zIndex: 50 }}>
            <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
              {mounted ? (
                <Image 
                  src="/dripeon-logo.png" 
                  alt="Dripeon Logo" 
                  width={160} 
                  height={50} 
                  style={{ 
                    objectFit: 'contain', 
                    filter: theme === 'dark' ? 'invert(1)' : 'none',
                    transition: 'filter 0.3s ease'
                  }} 
                  priority
                />
              ) : (
                <div style={{ width: 160, height: 50 }} />
              )}
            </Link>
          </div>

          {/* Right Column */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '3rem' }}>
            {/* Desktop Nav - Right */}
            <div className="nav-desktop-wrapper hidden md:flex">
              <div className="nav-links">
                {rightCategories.map((cat) => (
                  <div key={cat._id} className="nav-item-wrapper" onMouseEnter={() => setActiveMenu(cat.slug)}>
                    <Link href={`/collections/${cat.slug}`} className="nav-link-main">{cat.name}</Link>
                  </div>
                ))}
              </div>
            </div>

            {/* Icons - Far Right */}
            <div className="nav-icons">
              {mounted && (
                <button 
                  className="theme-toggle-desktop"
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
              
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                {isLoaded && isSignedIn ? (
                  <UserButton>
                    <UserButton.MenuItems>
                      <UserButton.Link
                        label="My Orders"
                        labelIcon={<ShoppingBag size={14} />}
                        href="/profile/orders"
                      />
                      <UserButton.Link
                        label="Wishlist"
                        labelIcon={<Heart size={14} />}
                        href="/profile/wishlist"
                      />
                    </UserButton.MenuItems>
                  </UserButton>
                ) : isLoaded && !isSignedIn ? (
                  <Link href="/login" aria-label="Account">
                    <User size={22} />
                  </Link>
                ) : (
                  <div style={{ width: 22, height: 22 }} />
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

          {/* Megamenu Overlay */}
          <AnimatePresence>
            {activeMenu && categories.find(c => c.slug === activeMenu) && 
              (categories.find(c => c.slug === activeMenu).columns?.length > 0 || 
               categories.find(c => c.slug === activeMenu).imageCards?.length > 0) && (
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
                    {categories.find(c => c.slug === activeMenu).columns.map((col: any, i: number) => {
                      if (col.title === "New Column" && col.links.length === 0) return null;
                      if (col.title === "New Column" && col.links.length === 1 && col.links[0].label === "New Link") return null;
                      
                      return (
                        <div key={i} className="megamenu-col">
                          <h4>{col.title}</h4>
                          <ul>
                            {col.links.map((link: any, j: number) => (
                              <li key={j}><Link href={link.url}>{link.label}</Link></li>
                            ))}
                          </ul>
                        </div>
                      );
                    })}
                  </div>
                  
                  <div className="megamenu-images">
                    {categories.find(c => c.slug === activeMenu).imageCards?.map((img: any, i: number) => (
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

              <div style={{ marginTop: '1rem', paddingTop: '1.5rem', borderTop: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 600, fontSize: '1.1rem' }}>Theme</span>
                {mounted && (
                  <button 
                    onClick={() => {
                      setTheme(theme === 'dark' ? 'light' : 'dark');
                      setIsOpen(false);
                    }}
                    style={{ background: 'var(--color-secondary)', border: '1px solid var(--color-border)', padding: '0.5rem 1rem', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: 'var(--color-text)' }}
                  >
                    {theme === 'dark' ? <><Sun size={18} /> Light Mode</> : <><Moon size={18} /> Dark Mode</>}
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
