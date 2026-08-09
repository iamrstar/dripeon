"use client";

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const { addToCart, openCart } = useCart();
  const [addingToCart, setAddingToCart] = useState<string | null>(null);
  const [sizeSelectMode, setSizeSelectMode] = useState<string | null>(null);
  const [fetchedArrivals, setFetchedArrivals] = useState<any[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);

  // Fetch real products from the database for the "New In" section
  useEffect(() => {
    fetch('/api/products?limit=4')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setFetchedArrivals(data);
        }
        setIsLoadingProducts(false);
      })
      .catch(err => {
        console.error("Error fetching homepage products:", err);
        setIsLoadingProducts(false);
      });
  }, []);

  const handleAddToCart = (product: any, size: string, e: React.MouseEvent) => {
    e.preventDefault();
    setAddingToCart(product.id);
    
    // Simulate loading for better UX
    setTimeout(() => {
      addToCart({
        id: product._id,
        name: product.name,
        price: product.salePrice || product.price,
        image: product.images && product.images.length > 0 ? product.images[0] : '/placeholder.png',
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
            style={{ textShadow: '0 4px 20px rgba(0,0,0,0.3)' }}
          >
            DRIP STARTS HERE
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            style={{ textShadow: '0 2px 10px rgba(0,0,0,0.4)' }}
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
                    {isOnSale && <span className="product-badge" style={{ backgroundColor: '#e53935' }}>SAVE {discountPercent}%</span>}
                    {!isOnSale && product.featured && <span className="product-badge" style={{ backgroundColor: '#000' }}>FEATURED</span>}
                    
                    <button className="product-wishlist" aria-label="Add to wishlist" style={{ fontSize: '1.5rem', zIndex: 10 }}>♡</button>
                    
                    <Link href={productUrl} style={{ display: 'block', position: 'absolute', inset: 0, zIndex: 1 }}>
                      <Image 
                        src={product.images && product.images.length > 0 ? product.images[0] : '/placeholder.png'} 
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
                                flex: 1,
                                padding: '0.85rem 0',
                                border: 'none',
                                borderRight: size !== availableSizes[availableSizes.length-1] ? '1px solid var(--color-border)' : 'none',
                                backgroundColor: 'transparent',
                                fontWeight: 700,
                                cursor: 'pointer',
                                color: 'var(--color-text)',
                                transition: 'background-color 0.2s ease',
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
                      <h3 className="product-title" style={{ transition: 'color 0.2s ease' }} onMouseEnter={(e) => e.currentTarget.style.color = '#888'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-text)'}>
                        {product.name}
                      </h3>
                    </Link>
                    <p className="product-price">
                      {isOnSale && <span className="product-original-price">₹{product.originalPrice}</span>}
                      <span className={isOnSale ? "product-sale-price" : ""}>₹{product.salePrice || product.originalPrice}</span>
                    </p>
                  </div>
                </motion.div>
              );
            })
          )}
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
