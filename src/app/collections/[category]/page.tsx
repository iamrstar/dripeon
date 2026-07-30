"use client";

import Link from 'next/link';
import { use, useState, useEffect } from 'react';
import { Heart, ShoppingBag, X, Ruler, ChevronLeft, ChevronRight, Zap } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import Loader from '@/components/Loader';

export default function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = use(params);
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [quickView, setQuickView] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const categoryTitle = category.replace(/-/g, ' ').toUpperCase();

  // Map URL slugs to DB categories
  const categoryMap: Record<string, string> = {
    topwear: 'topwear',
    bottomwear: 'bottomwear',
    accessories: 'accessories',
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const dbCategory = categoryMap[category.toLowerCase()] || category.toLowerCase();
        const res = await fetch(`/api/products?category=${dbCategory}`);
        if (res.ok) {
          const data = await res.json();
          setProducts(data);
        }
      } catch (err) {
        console.error('Failed to fetch products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [category]);

  if (loading) return <Loader />;

  return (
    <div style={{ minHeight: '80vh' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              {
                '@type': 'ListItem',
                position: 1,
                name: 'Home',
                item: 'https://dripeon.com'
              },
              {
                '@type': 'ListItem',
                position: 2,
                name: 'Collections',
                item: 'https://dripeon.com/collections'
              },
              {
                '@type': 'ListItem',
                position: 3,
                name: categoryTitle,
                item: `https://dripeon.com/collections/${category}`
              }
            ]
          })
        }}
      />
      {/* Header */}
      <div className="container" style={{ padding: '2.5rem 1.5rem 0.5rem' }}>
        <p style={{ color: '#888', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase' }}>
          <Link href="/" style={{ color: '#aaa' }}>Home</Link>
          <span style={{ margin: '0 0.5rem', color: '#ccc' }}>/</span>
          <span>Collections</span>
          <span style={{ margin: '0 0.5rem', color: '#ccc' }}>/</span>
          <span style={{ color: 'var(--color-text)' }}>{categoryTitle}</span>
        </p>
      </div>

      <div className="container" style={{ padding: '1rem 1.5rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', margin: 0, fontWeight: 900, letterSpacing: '-1px' }}>{categoryTitle}</h1>
        <p style={{ fontWeight: 700, color: '#aaa', fontSize: '0.9rem', letterSpacing: '0.5px' }}>{products.length} PRODUCTS</p>
      </div>

      {/* Product Grid */}
      <div className="container" style={{ padding: '0 1.5rem 5rem' }}>
        {products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 1rem', color: '#888' }}>
            <p style={{ fontSize: '1.2rem', fontWeight: 600 }}>No products found in this category yet.</p>
            <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>Check back soon!</p>
          </div>
        ) : (
          <div className="collections-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.2rem' }}>
            {products.map((product: any) => (
              <ProductCard 
                key={product._id} 
                product={product} 
                isWishlisted={isInWishlist(product._id || product.slug)} 
                onToggleWishlist={() => toggleWishlist(product._id || product.slug)}
                onQuickView={() => setQuickView(product)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Quick View Drawer */}
      {quickView && (
        <QuickViewDrawer 
          product={quickView} 
          onClose={() => setQuickView(null)}
          isWishlisted={isInWishlist(quickView._id || quickView.slug)}
          onToggleWishlist={() => toggleWishlist(quickView._id || quickView.slug)}
        />
      )}

      {/* Responsive CSS */}
      <style>{`
        @media (max-width: 1024px) {
          .collections-grid { grid-template-columns: repeat(3, 1fr) !important; }
        }
        @media (max-width: 768px) {
          .collections-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 0.8rem !important; }
        }
      `}</style>
    </div>
  );
}

/* ===== PRODUCT CARD ===== */
function ProductCard({ product, isWishlisted, onToggleWishlist, onQuickView }: { 
  product: any; isWishlisted: boolean; onToggleWishlist: () => void; onQuickView: () => void; 
}) {
  const [hovered, setHovered] = useState(false);
  const productId = product._id || product.slug;

  return (
    <div 
      style={{ display: 'flex', flexDirection: 'column', cursor: 'pointer' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link href={`/products/${productId}`} style={{ 
        display: 'block', position: 'relative', aspectRatio: '4/5', 
        backgroundColor: '#f5f5f5', overflow: 'hidden', marginBottom: '1rem',
        borderRadius: '8px'
      }}>
        {/* Discount Badge */}
        {product.discount > 0 && (
          <span style={{
            position: 'absolute', top: '12px', left: '12px',
            backgroundColor: '#e53935', color: '#fff', padding: '4px 10px',
            fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.5px', zIndex: 2, borderRadius: '4px',
          }}>
            -{product.discount}%
          </span>
        )}

        {/* Wishlist Heart */}
        <button 
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); onToggleWishlist(); }}
          style={{
            position: 'absolute', top: '12px', right: '12px',
            backgroundColor: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(4px)',
            border: 'none', cursor: 'pointer', zIndex: 2, padding: '6px',
            borderRadius: '50%', width: '36px', height: '36px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.2s ease', transform: isWishlisted ? 'scale(1.1)' : 'scale(1)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}
        >
          <Heart size={18} fill={isWishlisted ? '#e53935' : 'none'} color={isWishlisted ? '#e53935' : '#444'} strokeWidth={2} />
        </button>

        {/* Product Image */}
        <img 
          src={hovered && product.images?.length > 1 ? product.images[1] : product.images?.[0] || '/IMG_3031.jpeg'} 
          alt={product.name} 
          style={{ 
            width: '100%', height: '100%', objectFit: 'cover', 
            transition: 'transform 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            transform: hovered ? 'scale(1.05)' : 'scale(1)',
          }} 
        />

        {/* ADD TO CART slide-up */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          transform: hovered ? 'translateY(0)' : 'translateY(100%)',
          transition: 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)', zIndex: 3,
        }}>
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onQuickView(); }}
            style={{
              width: '100%', padding: '1rem',
              backgroundColor: 'rgba(0,0,0,0.85)', color: '#fff', border: 'none', backdropFilter: 'blur(4px)',
              fontWeight: 800, fontSize: '0.8rem', letterSpacing: '2px', textTransform: 'uppercase',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
            }}
          >
            <ShoppingBag size={16} /> QUICK ADD
          </button>
        </div>
      </Link>
      
      {/* Product Info */}
      <div style={{ padding: '0.5rem 0', textAlign: 'center' }}>
        <Link href={`/products/${productId}`} style={{ textDecoration: 'none', color: 'inherit' }}>
          <h3 style={{ fontSize: '0.9rem', marginBottom: '0.4rem', fontWeight: 800, lineHeight: 1.4, color: 'var(--color-text)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            {product.name}
          </h3>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.8rem' }}>
          {product.originalPrice > product.salePrice && (
            <span style={{ color: '#aaa', textDecoration: 'line-through', fontSize: '0.85rem', fontWeight: 600 }}>
              Rs.{product.originalPrice?.toLocaleString()}.00
            </span>
          )}
          <span style={{ color: product.originalPrice > product.salePrice ? '#e53935' : 'var(--color-text)', fontWeight: 800, fontSize: '0.95rem' }}>
            Rs.{product.salePrice?.toLocaleString()}.00
          </span>
        </div>
        {product.stock !== undefined && product.stock < 5 && product.stock > 0 && (
          <div style={{ marginTop: '0.4rem', color: '#e53935', fontSize: '0.75rem', fontWeight: 700 }}>
            Only {product.stock} left!
          </div>
        )}
        {product.stock === 0 && (
          <div style={{ marginTop: '0.4rem', color: '#e53935', fontSize: '0.75rem', fontWeight: 700 }}>
            Out of stock
          </div>
        )}
      </div>
    </div>
  );
}

/* ===== QUICK VIEW DRAWER ===== */
function QuickViewDrawer({ product, onClose, isWishlisted, onToggleWishlist }: { 
  product: any; onClose: () => void; isWishlisted: boolean; onToggleWishlist: () => void;
}) {
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || 'M');
  const [quantity, setQuantity] = useState(1);
  const [currentImage, setCurrentImage] = useState(0);
  const [isClosing, setIsClosing] = useState(false);
  const { addToCart } = useCart();

  const images = product.images || ['/IMG_3031.jpeg'];

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => onClose(), 300);
  };

  const handleAddToCart = () => {
    addToCart({
      id: product._id || product.slug,
      name: product.name,
      price: product.salePrice,
      image: product.images?.[0] || '/IMG_3031.jpeg',
      size: selectedSize,
      quantity,
    });
    window.dispatchEvent(new CustomEvent('show-toast', { detail: { message: "Added to cart!" } }));
    handleClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        onClick={handleClose}
        style={{
          position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)',
          zIndex: 100, opacity: isClosing ? 0 : 1, transition: 'opacity 0.3s ease',
        }} 
      />

      {/* Drawer */}
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0,
        width: '480px', maxWidth: '92vw', backgroundColor: 'var(--color-bg)',
        zIndex: 101, boxShadow: '-20px 0 60px rgba(0,0,0,0.15)',
        display: 'flex', flexDirection: 'column',
        transform: isClosing ? 'translateX(100%)' : 'translateX(0)',
        transition: 'transform 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        animation: isClosing ? 'none' : 'drawerSlideIn 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      }}>

        {/* Header */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '1rem 1.5rem', borderBottom: '1px solid var(--color-border)', flexShrink: 0,
        }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 800, letterSpacing: '2px', textTransform: 'uppercase', color: '#999' }}>
            SELECT OPTIONS
          </span>
          <button onClick={handleClose} style={{ 
            background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text)',
            width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            borderRadius: '50%', transition: 'background-color 0.2s',
          }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--color-secondary)'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <X size={20} strokeWidth={2.5} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          
          {/* Image Carousel */}
          <div style={{ position: 'relative', width: '100%', aspectRatio: '3/4', backgroundColor: '#f0eeeb', overflow: 'hidden' }}>
            <img src={images[currentImage]} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'opacity 0.3s ease' }} />
            
            {images.length > 1 && (
              <>
                <button onClick={() => setCurrentImage(prev => (prev - 1 + images.length) % images.length)} style={{
                  position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)',
                  backgroundColor: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '50%',
                  width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                }}>
                  <ChevronLeft size={18} color="#111" />
                </button>
                <button onClick={() => setCurrentImage(prev => (prev + 1) % images.length)} style={{
                  position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                  backgroundColor: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '50%',
                  width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                }}>
                  <ChevronRight size={18} color="#111" />
                </button>
              </>
            )}

            <div style={{ position: 'absolute', bottom: '14px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '5px' }}>
              {images.map((_: string, idx: number) => (
                <button key={idx} onClick={() => setCurrentImage(idx)} style={{
                  width: currentImage === idx ? '18px' : '7px', height: '7px', borderRadius: '10px',
                  backgroundColor: currentImage === idx ? 'var(--color-text)' : 'rgba(0,0,0,0.2)',
                  border: 'none', cursor: 'pointer', transition: 'all 0.3s ease', padding: 0,
                }} />
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div style={{ padding: '1.5rem 1.5rem 2rem', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            
            {/* Name + Heart */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 800, textTransform: 'uppercase', margin: 0, lineHeight: 1.3, color: 'var(--color-text)', letterSpacing: '0.3px' }}>
                {product.name}
              </h2>
              <button onClick={onToggleWishlist} style={{ background: 'none', border: 'none', cursor: 'pointer', flexShrink: 0, padding: '2px', transition: 'transform 0.2s', transform: isWishlisted ? 'scale(1.2)' : 'scale(1)' }}>
                <Heart size={22} fill={isWishlisted ? '#e53935' : 'none'} color={isWishlisted ? '#e53935' : '#aaa'} strokeWidth={1.8} />
              </button>
            </div>

            {/* Price */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
              {product.originalPrice > product.salePrice && (
                <span style={{ color: '#bbb', textDecoration: 'line-through', fontSize: '1rem', fontWeight: 500 }}>Rs.{product.originalPrice?.toLocaleString()}.00</span>
              )}
              <span style={{ color: '#e53935', fontWeight: 800, fontSize: '1.2rem' }}>Rs.{product.salePrice?.toLocaleString()}.00</span>
              {product.discount > 0 && (
                <span style={{ backgroundColor: '#e53935', color: '#fff', padding: '3px 8px', fontSize: '0.65rem', fontWeight: 800, borderRadius: '2px', letterSpacing: '0.5px' }}>SAVE {product.discount}%</span>
              )}
            </div>

            <p style={{ fontSize: '0.8rem', color: '#aaa', fontWeight: 500, margin: 0, textDecoration: 'underline', cursor: 'pointer' }}>Shipping calculated at checkout.</p>

            <div style={{ height: '1px', backgroundColor: 'var(--color-border)' }} />

            {/* Size Selector */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.7rem' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--color-text)', letterSpacing: '0.5px' }}>SIZE: <span style={{ fontWeight: 600 }}>{selectedSize}</span></span>
                <button style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'none', border: 'none', cursor: 'pointer', color: '#999', fontSize: '0.78rem', fontWeight: 600 }}>
                  <Ruler size={12} /> Sizing guide
                </button>
              </div>
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                {(product.sizes || ['S', 'M', 'L', 'XL']).map((size: string) => (
                  <button key={size} onClick={() => setSelectedSize(size)} style={{
                    minWidth: '46px', height: '42px', padding: '0 12px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer',
                    backgroundColor: selectedSize === size ? 'var(--color-text)' : 'transparent',
                    color: selectedSize === size ? 'var(--color-bg)' : 'var(--color-text)',
                    border: `1.5px solid ${selectedSize === size ? 'var(--color-text)' : 'var(--color-border)'}`,
                    transition: 'all 0.2s ease', borderRadius: '2px',
                  }}>
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ height: '1px', backgroundColor: 'var(--color-border)' }} />

            {/* Quantity + Add to Cart */}
            <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'stretch' }}>
              <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid var(--color-border)', borderRadius: '2px' }}>
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} style={qtyBtnStyle}>−</button>
                <span style={{ width: '32px', textAlign: 'center', fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-text)' }}>{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} style={qtyBtnStyle}>+</button>
              </div>
              <button onClick={handleAddToCart} style={{
                flex: 1, padding: '0 1.5rem', height: '46px',
                backgroundColor: 'transparent', border: '1.5px solid var(--color-text)',
                color: 'var(--color-text)', fontWeight: 800, fontSize: '0.82rem',
                textTransform: 'uppercase', letterSpacing: '1.5px', cursor: 'pointer', 
                transition: 'all 0.3s ease', borderRadius: '2px',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
              }}
                onMouseOver={(e) => { e.currentTarget.style.backgroundColor = 'var(--color-text)'; e.currentTarget.style.color = 'var(--color-bg)'; }}
                onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--color-text)'; }}
              >
                <ShoppingBag size={15} /> ADD TO CART
              </button>
            </div>

            {/* Buy It Now */}
            <button style={{
              width: '100%', padding: '0.9rem', backgroundColor: 'var(--color-text)', color: 'var(--color-bg)',
              border: 'none', fontWeight: 800, fontSize: '0.85rem', textTransform: 'uppercase',
              letterSpacing: '1.5px', cursor: 'pointer', transition: 'opacity 0.3s ease', borderRadius: '2px',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
            }}
              onMouseOver={(e) => e.currentTarget.style.opacity = '0.85'}
              onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
            >
              <Zap size={15} /> BUY IT NOW
            </button>

            {/* Savings callout */}
            {product.originalPrice > product.salePrice && (
              <div style={{
                backgroundColor: 'var(--color-secondary)', padding: '0.8rem 1rem',
                borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '0.6rem',
                fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text)',
              }}>
                <span style={{ fontSize: '1.1rem' }}>🎉</span>
                You save <strong>Rs.{(product.originalPrice - product.salePrice).toLocaleString()}.00</strong> on this order!
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes drawerSlideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </>
  );
}

const qtyBtnStyle: React.CSSProperties = {
  width: '36px', height: '46px', background: 'none',
  border: 'none', cursor: 'pointer', fontSize: '1.1rem', fontWeight: 600, color: 'inherit',
};
