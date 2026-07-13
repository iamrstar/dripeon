"use client";

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Home() {
  return (
    <div>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-text-block">
          <motion.h1
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <span style={{ color: 'var(--color-accent-gold)' }}>DRIP</span><br/>
            <span className="outline-text">STARTS</span><br/>
            HERE
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          >
            Explore our latest collection of premium oversized t-shirts, hoodies, and streetwear essentials.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
          >
            <button 
              onClick={() => window.dispatchEvent(new CustomEvent('show-coming-soon'))}
              className="btn-primary"
              style={{ cursor: 'pointer' }}
            >
              Shop Now
            </button>
          </motion.div>
        </div>
        
        {/* Abstract Hero Image Area */}
        <motion.div 
          className="hero-image-placeholder"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          style={{ 
            backgroundImage: "url('/IMG_3031.jpeg')", 
            backgroundSize: 'cover', 
            backgroundPosition: 'center' 
          }}
        />
      </section>

      {/* Categories Grid */}
      <section className="category-section container">
        <h2 className="section-title">MEN'S COLLECTION</h2>
        <div className="category-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
          
          <Link href="/collections/oversized" className="category-card" style={{ backgroundImage: "url('/IMG_3033.jpeg')", backgroundSize: 'cover', backgroundPosition: 'center', minHeight: '300px', transform: 'none' }}>
            <h3 style={{ fontSize: '1.5rem', padding: '0.5rem 1rem' }}>OVERSIZED</h3>
          </Link>
          
          <Link href="/collections/full-sleeve-tshirt" className="category-card" style={{ background: '#f5f5f5', minHeight: '300px', transform: 'none' }}>
            <h3 style={{ fontSize: '1.5rem', padding: '0.5rem 1rem' }}>FULL SLEEVE T-SHIRT</h3>
          </Link>

          <Link href="/collections/football-jersey" className="category-card" style={{ background: '#ebebeb', minHeight: '300px', transform: 'none' }}>
            <h3 style={{ fontSize: '1.5rem', padding: '0.5rem 1rem' }}>FOOTBALL JERSEY</h3>
          </Link>
          
          <Link href="/collections/baggy-jeans" className="category-card" style={{ backgroundImage: "url('/IMG_3034.jpeg')", backgroundSize: 'cover', backgroundPosition: 'center', minHeight: '300px', transform: 'none' }}>
            <h3 style={{ fontSize: '1.5rem', padding: '0.5rem 1rem' }}>BAGGY JEANS</h3>
          </Link>

          <Link href="/collections/fitted-jeans" className="category-card" style={{ background: '#f0f0f0', minHeight: '300px', transform: 'none' }}>
            <h3 style={{ fontSize: '1.5rem', padding: '0.5rem 1rem' }}>FITTED JEANS</h3>
          </Link>

          <Link href="/collections/trouser" className="category-card" style={{ background: '#e0e0e0', minHeight: '300px', transform: 'none' }}>
            <h3 style={{ fontSize: '1.5rem', padding: '0.5rem 1rem' }}>TROUSER</h3>
          </Link>

          <Link href="/collections/cap" className="category-card" style={{ backgroundImage: "url('/IMG_3035.jpeg')", backgroundSize: 'cover', backgroundPosition: 'center', minHeight: '300px', transform: 'none', gridColumn: 'span 1' }}>
            <h3 style={{ fontSize: '1.5rem', padding: '0.5rem 1rem' }}>CAP</h3>
          </Link>

          <Link href="/collections/socks" className="category-card" style={{ background: '#dcdcdc', minHeight: '300px', transform: 'none', gridColumn: 'span 1' }}>
            <h3 style={{ fontSize: '1.5rem', padding: '0.5rem 1rem' }}>SOCKS</h3>
          </Link>

          <Link href="/collections/accessories" className="category-card" style={{ background: '#d0d0d0', backgroundImage: 'radial-gradient(var(--color-border) 1px, transparent 1px)', backgroundSize: '20px 20px', minHeight: '300px', transform: 'none', gridColumn: 'span 1' }}>
            <h3 style={{ fontSize: '1.5rem', padding: '0.5rem 1rem' }}>ACCESSORIES</h3>
          </Link>

        </div>
      </section>
    </div>
  );
}
