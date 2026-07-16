"use client";

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { Loader2 } from 'lucide-react';

export default function Home() {
  // Sample data for the "New In" section
  const newArrivals = [
    { id: 1, title: 'Navy League Stripe Polo', originalPrice: '₹1,299', price: '₹999', image: '/product_navy_polo.png', badge: 'SAVE 20%' },
    { id: 2, title: 'Vintage Oversized Graphic Tee', originalPrice: '₹1,499', price: '₹1,299', image: '/product_vintage_tee.png', badge: 'SAVE 15%' },
    { id: 3, title: 'Premium Streetwear Cap', originalPrice: '₹1,099', price: '₹899', image: '/category_accessories.png', badge: 'SAVE 15%' },
    { id: 4, title: 'Rhythm in Control Hoodie', originalPrice: null, price: '₹1,499', image: '/hero_mens_streetwear.png', badge: 'NEW' },
  ];

  const { addToCart, openCart } = useCart();
  const [addingToCart, setAddingToCart] = useState<number | null>(null);
  const [sizeSelectMode, setSizeSelectMode] = useState<number | null>(null);

  const handleAddToCart = (product: any, size: string, e: React.MouseEvent) => {
    e.preventDefault();
    setAddingToCart(product.id);
    
    // Simulate loading for better UX
    setTimeout(() => {
      addToCart({
        id: product.id.toString(),
        name: product.title,
        price: parseInt(product.price.replace(/\D/g, '')),
        image: product.image,
        size: size,
        quantity: 1
      });
      setAddingToCart(null);
      setSizeSelectMode(null);
      openCart();
    }, 400);
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-bg">
          <Image 
            src="/hero_mens_streetwear.png" 
            alt="Drip starts here" 
            fill 
            style={{ objectFit: 'cover', objectPosition: 'center top' }} 
            priority 
            sizes="100vw"
          />
        </div>
        <div className="hero-content">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            DRIP STARTS HERE
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            Upgrade your closet with everything trendy and new.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}
          >
            <Link href="/collections/mens" className="btn-outline">
              SHOP NOW
            </Link>
          </motion.div>
        </div>
      </section>

      {/* New In Section */}
      <section className="section-padding container">
        <div className="section-header" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
          <h2 style={{ marginBottom: '0' }}>NEW IN</h2>
          <p style={{ textTransform: 'none', letterSpacing: 'normal', color: '#666', marginBottom: '0.5rem' }}>Upgrade your closet with everything trendy and new</p>
          <Link href="/collections/new-arrivals" style={{ fontWeight: 700, textDecoration: 'underline', textUnderlineOffset: '4px' }}>
            Shop All
          </Link>
        </div>
        
        <div className="product-grid">
          {newArrivals.map((product, index) => (
            <motion.div 
              key={product.id}
              className="product-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div 
                className="product-image group" 
                onMouseLeave={() => setSizeSelectMode(null)}
              >
                {product.badge && <span className="product-badge">{product.badge}</span>}
                <button className="product-wishlist" aria-label="Add to wishlist" style={{ fontSize: '1.5rem' }}>♡</button>
                <Image 
                  src={product.image} 
                  alt={product.title} 
                  fill
                  style={{ objectFit: 'cover' }}
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
                <div className="product-hover-action">
                  {sizeSelectMode === product.id ? (
                    <div style={{ display: 'flex', width: '100%', backgroundColor: 'var(--color-bg)' }}>
                      {['S', 'M', 'L', 'XL'].map(size => (
                        <button
                          key={size}
                          onClick={(e) => handleAddToCart(product, size, e)}
                          disabled={addingToCart === product.id}
                          style={{
                            flex: 1,
                            padding: '0.85rem 0',
                            border: 'none',
                            borderRight: size !== 'XL' ? '1px solid var(--color-border)' : 'none',
                            backgroundColor: 'transparent',
                            fontWeight: 700,
                            cursor: 'pointer',
                            color: 'var(--color-text)',
                            transition: 'background-color 0.2s ease',
                            borderTop: '1px solid var(--color-border)'
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f0f0f0')}
                          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                        >
                          {addingToCart === product.id ? <Loader2 size={16} className="animate-spin" style={{ margin: '0 auto' }} /> : size}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <button 
                      className="btn-primary" 
                      style={{ width: '100%', padding: '0.85rem' }}
                      onClick={(e) => { e.preventDefault(); setSizeSelectMode(product.id); }}
                    >
                      ADD TO CART
                    </button>
                  )}
                </div>
              </div>
              <div className="product-info">
                <h3 className="product-title">{product.title}</h3>
                <p className="product-price">
                  {product.originalPrice && <span className="product-original-price">{product.originalPrice}</span>}
                  <span className={product.originalPrice ? "product-sale-price" : ""}>{product.price}</span>
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Categories Section */}
      <section className="section-padding container" style={{ paddingTop: '0' }}>
        <div className="category-grid">
          
          <Link href="/collections/mens" className="category-card">
            <div className="category-card-bg">
              <Image src="/hero_mens_streetwear.png" alt="Shop Mens" fill style={{ objectFit: 'cover' }} sizes="(max-width: 768px) 100vw, 50vw" />
            </div>
            <div className="category-card-content">
              <h3>SHOP MENS</h3>
              <span className="btn-outline">SHOP NOW</span>
            </div>
          </Link>
          
          <Link href="/collections/womens" className="category-card">
            <div className="category-card-bg">
              <Image src="/product_vintage_tee.png" alt="Shop Womens" fill style={{ objectFit: 'cover' }} sizes="(max-width: 768px) 100vw, 50vw" />
            </div>
            <div className="category-card-content">
              <h3>SHOP WOMENS</h3>
              <span className="btn-outline">SHOP NOW</span>
            </div>
          </Link>

          <Link href="/collections/accessories" className="category-card" style={{ gridColumn: '1 / -1' }}>
            <div className="category-card-bg">
              <Image src="/category_accessories.png" alt="Shop Accessories" fill style={{ objectFit: 'cover', objectPosition: 'center 30%' }} sizes="100vw" />
            </div>
            <div className="category-card-content">
              <h3>ACCESSORIES</h3>
              <span className="btn-outline">SHOP NOW</span>
            </div>
          </Link>

        </div>
      </section>
    </div>
  );
}
