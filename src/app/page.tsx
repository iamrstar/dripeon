"use client";

import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useCart } from '@/context/CartContext';
import { Loader2 } from 'lucide-react';
import SplashIntro from '@/components/SplashIntro';

/* ============================
   ANIMATED LETTER COMPONENT
   ============================ */
function AnimatedTitle({ text, className }: { text: string; className?: string }) {
  return (
    <span className={className} style={{ display: 'inline-block', perspective: '1000px' }}>
      {text.split('').map((char, i) => (
        <span
          key={i}
          className={`hero-letter ${char === ' ' ? 'space' : ''}`}
          style={{ animationDelay: `${0.3 + i * 0.05}s` }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </span>
  );
}

/* ============================
   MARQUEE TICKER
   ============================ */
function MarqueeTicker() {
  const words = ['STREETWEAR', 'PREMIUM', 'CULTURE', 'DRIP', 'OVERSIZED', 'EXCLUSIVE', 'URBAN', 'HYPEBEAST'];
  const content = words.map((w, i) => (
    <span key={i}>
      <span className="marquee-dot">✦</span>
      {w}
    </span>
  ));

  return (
    <div className="marquee-strip">
      <div className="marquee-track">
        {content}
        {content}
      </div>
    </div>
  );
}

/* ============================
   3D TILT CARD WRAPPER
   ============================ */
function TiltCard({ children, className, style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -6;
    const rotateY = ((x - centerX) / centerX) * 6;
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
  }, []);

  const handleMouseLeave = useCallback(() => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
  }, []);

  return (
    <div className={`card-3d-wrap ${className || ''}`} style={style}>
      <div
        ref={cardRef}
        className="card-3d"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {children}
      </div>
    </div>
  );
}

/* ============================
   BRAND STATEMENT WITH WORD REVEAL
   ============================ */
function BrandStatement() {
  const ref = useRef<HTMLDivElement>(null);
  const [revealedCount, setRevealedCount] = useState(0);
  const words = "WE DON'T FOLLOW TRENDS. WE SET THEM.".split(' ');

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Stagger reveal words one by one
          words.forEach((_, i) => {
            setTimeout(() => setRevealedCount(i + 1), i * 150);
          });
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="brand-statement" ref={ref}>
      <div className="section-divider" />
      <p className="brand-statement-text">
        {words.map((word, i) => (
          <span key={i} className={`word ${i < revealedCount ? 'revealed' : ''}`}>
            {word}
          </span>
        ))}
      </p>
    </section>
  );
}

/* ============================
   MAIN HOME PAGE
   ============================ */
export default function Home() {
  const { addToCart, openCart } = useCart();
  const [addingToCart, setAddingToCart] = useState<string | null>(null);
  const [sizeSelectMode, setSizeSelectMode] = useState<string | null>(null);
  const [fetchedArrivals, setFetchedArrivals] = useState<any[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLElement>(null);
  const [showSplash, setShowSplash] = useState(false);
  const [pageReady, setPageReady] = useState(false);

  // Show splash only once per session
  useEffect(() => {
    const hasSeenSplash = sessionStorage.getItem('dripeon-splash-seen');
    if (!hasSeenSplash) {
      setShowSplash(true);
    } else {
      setPageReady(true);
    }
  }, []);

  const handleSplashComplete = useCallback(() => {
    sessionStorage.setItem('dripeon-splash-seen', 'true');
    setShowSplash(false);
    setPageReady(true);
  }, []);

  // Fetch real products
  useEffect(() => {
    fetch('/api/products?limit=4')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setFetchedArrivals(data);
        setIsLoadingProducts(false);
      })
      .catch(() => setIsLoadingProducts(false));
  }, []);

  // Hero parallax mouse tracking
  const handleHeroMouseMove = useCallback((e: React.MouseEvent) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    setMousePos({ x, y });
  }, []);

  const handleAddToCart = (product: any, size: string, e: React.MouseEvent) => {
    e.preventDefault();
    setAddingToCart(product._id);
    setTimeout(() => {
      addToCart({
        id: product._id,
        name: product.name,
        price: product.salePrice || product.price,
        image: product.images?.[0] || '/placeholder.png',
        size,
        quantity: 1
      });
      setAddingToCart(null);
      setSizeSelectMode(null);
      openCart();
    }, 400);
  };

  return (
    <>
      {/* ===== STREET STYLE SPLASH INTRO ===== */}
      <AnimatePresence>
        {showSplash && <SplashIntro onComplete={handleSplashComplete} />}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: pageReady ? 1 : 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
      {/* ===== CINEMATIC HERO ===== */}
      <section
        className="hero"
        ref={heroRef}
        onMouseMove={handleHeroMouseMove}
        style={{ height: '100vh', minHeight: '700px' }}
      >
        {/* Parallax Background Layer */}
        <div
          className="hero-bg hero-parallax-layer"
          style={{
            transform: `translate(${mousePos.x * -15}px, ${mousePos.y * -15}px)`,
          }}
        >
          <Image
            src="/hero_mens_streetwear.png"
            alt="Dripeon Premium Streetwear"
            fill
            style={{ objectFit: 'cover', objectPosition: 'center top' }}
            priority
            sizes="100vw"
          />
        </div>

        {/* Floating 3D Shapes */}
        <div className="hero-shapes">
          <div className="floating-shape shape-cube" />
          <div className="floating-shape shape-ring" />
          <div className="floating-shape shape-diamond" />
          <div className="floating-shape shape-triangle" />
          <div className="floating-shape shape-line" />
          <div className="floating-shape shape-dot-cluster" />
        </div>

        {/* Hero Content */}
        <div className="hero-content" style={{ paddingBottom: '6rem' }}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="hero-text-3d"
          >
            <h1 style={{ textShadow: '0 6px 30px rgba(0,0,0,0.4)', marginBottom: '0.3rem' }}>
              <AnimatedTitle text="DRIP STARTS" />
              <br />
              <AnimatedTitle text="HERE" />
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2, ease: 'easeOut' }}
            style={{
              textShadow: '0 2px 15px rgba(0,0,0,0.5)',
              fontSize: '1.05rem',
              fontWeight: 400,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              marginBottom: '2.5rem',
            }}
          >
            Premium Streetwear. Designed for the Culture.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.6, ease: 'easeOut' }}
          >
            <Link href="/collections/mens" className="btn-magnetic">
              <span>SHOP THE COLLECTION</span>
            </Link>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <div className="scroll-indicator">
          <span style={{ fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
            Scroll
          </span>
          <div className="scroll-indicator-line" />
        </div>
      </section>

      {/* ===== MARQUEE TICKER ===== */}
      <MarqueeTicker />

      {/* ===== NEW ARRIVALS ===== */}
      <section className="section-padding container" style={{ paddingTop: '5rem', paddingBottom: '5rem' }}>
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}
        >
          <div className="section-divider" />
          <h2 style={{ marginBottom: '0' }}>NEW IN</h2>
          <p style={{ textTransform: 'none', letterSpacing: 'normal', color: '#666', marginBottom: '0.5rem' }}>
            Upgrade your closet with everything trendy and new
          </p>
          <Link href="/collections/new-arrivals" style={{ fontWeight: 700, textDecoration: 'underline', textUnderlineOffset: '4px' }}>
            Shop All
          </Link>
        </motion.div>

        <div className="product-grid">
          {isLoadingProducts ? (
            <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'center', padding: '4rem' }}>
              <Loader2 size={32} className="animate-spin" color="var(--color-primary)" />
            </div>
          ) : fetchedArrivals.length === 0 ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem', color: '#888' }}>
              No products found. Add some products to the database!
            </div>
          ) : (
            fetchedArrivals.map((product, index) => {
              const isOnSale = product.originalPrice && product.salePrice && product.salePrice < product.originalPrice;
              const discountPercent = isOnSale ? Math.round(((product.originalPrice - product.salePrice) / product.originalPrice) * 100) : 0;
              const productUrl = `/products/${product.slug || product._id}`;
              const availableSizes = product.inventory ? Object.keys(product.inventory).filter(k => product.inventory[k] > 0) : ['S', 'M', 'L', 'XL'];

              return (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.6, delay: index * 0.12, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                  <TiltCard>
                    <div className="product-card">
                      <div className="product-image group" onMouseLeave={() => setSizeSelectMode(null)}>
                        {isOnSale && <span className="product-badge" style={{ backgroundColor: '#e53935' }}>SAVE {discountPercent}%</span>}
                        {!isOnSale && product.featured && <span className="product-badge" style={{ backgroundColor: '#000' }}>FEATURED</span>}

                        <button className="product-wishlist" aria-label="Add to wishlist" style={{ fontSize: '1.5rem', zIndex: 10 }}>♡</button>

                        <Link href={productUrl} style={{ display: 'block', position: 'absolute', inset: 0, zIndex: 1 }}>
                          <Image
                            src={product.images?.[0] || '/placeholder.png'}
                            alt={product.name}
                            fill
                            style={{ objectFit: 'cover' }}
                            sizes="(max-width: 768px) 50vw, 25vw"
                          />
                        </Link>

                        <div className="product-hover-action" style={{ zIndex: 10 }}>
                          {sizeSelectMode === product._id ? (
                            <div style={{ display: 'flex', width: '100%', backgroundColor: 'var(--color-bg)' }}>
                              {availableSizes.length > 0 ? availableSizes.map(size => (
                                <button
                                  key={size}
                                  onClick={(e) => handleAddToCart(product, size, e)}
                                  disabled={addingToCart === product._id}
                                  style={{
                                    flex: 1, padding: '0.85rem 0', border: 'none',
                                    borderRight: size !== availableSizes[availableSizes.length-1] ? '1px solid var(--color-border)' : 'none',
                                    backgroundColor: 'transparent', fontWeight: 700, cursor: 'pointer',
                                    color: 'var(--color-text)', transition: 'background-color 0.2s ease',
                                    borderTop: '1px solid var(--color-border)'
                                  }}
                                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-secondary)')}
                                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                                >
                                  {addingToCart === product._id ? <Loader2 size={16} className="animate-spin" style={{ margin: '0 auto' }} /> : size}
                                </button>
                              )) : (
                                <button disabled style={{ width: '100%', padding: '0.85rem', border: 'none', backgroundColor: '#f5f5f5', color: '#888', fontWeight: 700 }}>OUT OF STOCK</button>
                              )}
                            </div>
                          ) : (
                            <button
                              className="btn-primary"
                              style={{ width: '100%', padding: '0.85rem' }}
                              onClick={(e) => { e.preventDefault(); e.stopPropagation(); setSizeSelectMode(product._id); }}
                            >
                              ADD TO CART
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="product-info">
                        <Link href={productUrl} style={{ textDecoration: 'none' }}>
                          <h3 className="product-title">{product.name}</h3>
                        </Link>
                        <p className="product-price">
                          {isOnSale && <span className="product-original-price">₹{product.originalPrice}</span>}
                          <span className={isOnSale ? "product-sale-price" : ""}>₹{product.salePrice || product.originalPrice}</span>
                        </p>
                      </div>
                    </div>
                  </TiltCard>
                </motion.div>
              );
            })
          )}
        </div>
      </section>

      {/* ===== EDITORIAL STRIP ===== */}
      <section className="editorial-strip">
        <motion.div
          className="editorial-item"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="editorial-item-bg">
            <Image src="/IMG_3033.jpeg" alt="Drip Starts Here" fill style={{ objectFit: 'cover' }} sizes="50vw" />
          </div>
          <div className="editorial-item-content">
            <motion.h3
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              DRIP STARTS<br />HERE
            </motion.h3>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Link href="/collections/topwear" className="btn-magnetic">
                <span>EXPLORE</span>
              </Link>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          className="editorial-item"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.15 }}
        >
          <div className="editorial-item-bg">
            <Image src="/IMG_3034.jpeg" alt="Culture First" fill style={{ objectFit: 'cover' }} sizes="50vw" />
          </div>
          <div className="editorial-item-content">
            <motion.h3
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.35 }}
            >
              CULTURE<br />FIRST
            </motion.h3>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.55 }}
            >
              <Link href="/collections/bottomwear" className="btn-magnetic">
                <span>EXPLORE</span>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ===== BRAND STATEMENT ===== */}
      <BrandStatement />

      {/* ===== CATEGORY CARDS WITH 3D DEPTH ===== */}
      <section className="section-padding container" style={{ paddingTop: '0' }}>
        <div className="category-grid">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <TiltCard>
              <Link href="/collections/mens" className="category-card" style={{ display: 'flex' }}>
                <div className="category-card-bg">
                  <Image src="/hero_mens_streetwear.png" alt="Shop Mens" fill style={{ objectFit: 'cover' }} sizes="(max-width: 768px) 100vw, 50vw" />
                </div>
                <div className="category-card-content">
                  <h3>SHOP MENS</h3>
                  <span className="btn-magnetic"><span>SHOP NOW</span></span>
                </div>
              </Link>
            </TiltCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            <TiltCard>
              <Link href="/collections/womens" className="category-card" style={{ display: 'flex' }}>
                <div className="category-card-bg">
                  <Image src="/product_vintage_tee.png" alt="Shop Womens" fill style={{ objectFit: 'cover' }} sizes="(max-width: 768px) 100vw, 50vw" />
                </div>
                <div className="category-card-content">
                  <h3>SHOP WOMENS</h3>
                  <span className="btn-magnetic"><span>SHOP NOW</span></span>
                </div>
              </Link>
            </TiltCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.3 }}
            style={{ gridColumn: '1 / -1' }}
          >
            <TiltCard>
              <Link href="/collections/accessories" className="category-card" style={{ display: 'flex' }}>
                <div className="category-card-bg">
                  <Image src="/category_accessories.png" alt="Shop Accessories" fill style={{ objectFit: 'cover', objectPosition: 'center 30%' }} sizes="100vw" />
                </div>
                <div className="category-card-content">
                  <h3>ACCESSORIES</h3>
                  <span className="btn-magnetic"><span>SHOP NOW</span></span>
                </div>
              </Link>
            </TiltCard>
          </motion.div>
        </div>
      </section>

      {/* ===== BOTTOM MARQUEE ===== */}
      <MarqueeTicker />
    </motion.div>
    </>
  );
}
