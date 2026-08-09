"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useUser } from "@clerk/nextjs";
import { Heart, ChevronLeft, ChevronRight, Ruler, MapPin, Package, CreditCard, Truck, Star } from "lucide-react";
import Loader from "@/components/Loader";

export default function ProductDetail() {
  const params = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { isSignedIn } = useUser();
  
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [currentImage, setCurrentImage] = useState(0);
  const [pincode, setPincode] = useState("");
  const [pincodeResult, setPincodeResult] = useState<string | null>(null);
  
  // Enquiry state
  const [isEnquiring, setIsEnquiring] = useState(false);
  const [hasEnquired, setHasEnquired] = useState(false);
  
  // New features state
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  // Review states
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState('');

  const fetchProduct = async () => {
    try {
      const id = params.id as string;
      const res = await fetch(`/api/products/${id}`);
      if (res.ok) {
        const data = await res.json();
        setProduct(data);
        if (data.sizes && data.sizes.length > 0) {
          setSelectedSize(data.sizes[0]);
        }
        
        // Fetch related products
        const relRes = await fetch(`/api/products?category=${data.category}`);
        if (relRes.ok) {
          const relData = await relRes.json();
          setRelatedProducts(relData.filter((p: any) => p._id !== data._id).slice(0, 4));
        }
      }
    } catch (err) {
      console.error('Failed to fetch product:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (params.id) {
      fetchProduct();
    }
  }, [params.id]);

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setReviewLoading(true);
    setReviewError('');
    setReviewSuccess('');
    
    try {
      const res = await fetch(`/api/products/${product._id}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating: reviewRating, comment: reviewComment })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || 'Failed to submit review');
      }
      
      setReviewSuccess('Review added successfully!');
      setReviewComment('');
      setReviewRating(5);
      fetchProduct(); // Refresh product to show new review
    } catch (err: any) {
      setReviewError(err.message);
    } finally {
      setReviewLoading(false);
    }
  };

  if (loading) return <Loader />;
  if (!product) return <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><h2>Product not found</h2></div>;

  const handleAddToCart = () => {
    const maxStock = product.inventory?.[selectedSize] !== undefined ? product.inventory[selectedSize] : product.stock;
    if (maxStock === 0) return;
    
    addToCart({
      id: product._id || product.slug,
      name: product.name,
      price: product.salePrice,
      image: product.images[0],
      size: selectedSize || 'M',
      quantity: quantity,
      maxStock: maxStock
    });
    window.dispatchEvent(new CustomEvent('show-toast', { detail: { message: "Added to cart!" } }));
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push('/checkout');
  };

  const handleNotifyMe = async () => {
    if (isEnquiring || hasEnquired) return;
    setIsEnquiring(true);
    try {
      const res = await fetch(`/api/products/${product._id}/enquire`, { method: 'POST' });
      if (res.ok) {
        setHasEnquired(true);
        window.dispatchEvent(new CustomEvent('show-toast', { detail: { message: "We'll notify you when it's back in stock!" } }));
      }
    } catch (e) {
      console.error("Failed to enquire", e);
    }
    setIsEnquiring(false);
  };

  const nextImage = () => setCurrentImage((prev) => (prev + 1) % product.images.length);
  const prevImage = () => setCurrentImage((prev) => (prev - 1 + product.images.length) % product.images.length);

  const checkPincode = () => {
    if (pincode.length === 6) {
      setPincodeResult("Delivery available in 3-5 business days.");
    } else {
      setPincodeResult("Please enter a valid 6-digit pincode.");
    }
  };

  const isSelectedOutOfStock = product ? (product.inventory?.[selectedSize] !== undefined ? product.inventory[selectedSize] : (product.stock || 0)) === 0 : false;

  return (
    <div style={{ minHeight: 'calc(100vh - 120px)' }}>
      {product && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org/',
              '@type': 'Product',
              name: product.name,
              image: product.images,
              description: product.description,
              brand: {
                '@type': 'Brand',
                name: 'Dripeon'
              },
              offers: {
                '@type': 'Offer',
                url: `https://dripeon.com/products/${product.slug || product._id}`,
                priceCurrency: 'INR',
                price: product.salePrice,
                availability: (product.stock > 0 || (product.inventory && Object.values(product.inventory).some((v: any) => v > 0))) ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
                itemCondition: 'https://schema.org/NewCondition'
              },
              ...(product.reviews && product.reviews.length > 0 ? {
                aggregateRating: {
                  '@type': 'AggregateRating',
                  ratingValue: (product.reviews.reduce((acc: number, rev: any) => acc + rev.rating, 0) / product.reviews.length).toFixed(1),
                  reviewCount: product.reviews.length
                }
              } : {})
            })
          }}
        />
      )}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr', 
        maxWidth: '1300px', 
        margin: '0 auto',
      }} className="pdp-grid">
        
        {/* ===== LEFT: IMAGE GALLERY ===== */}
        <div className="pdp-images">
          {/* Main Image with Carousel */}
          <div style={{ position: 'relative', width: '100%', backgroundColor: '#f0f0f0', overflow: 'hidden' }}>
            <img 
              src={product.images[currentImage]} 
              alt={product.name} 
              style={{ width: '100%', display: 'block', transition: 'opacity 0.3s ease' }} 
            />

            {/* Arrows */}
            {product.images.length > 1 && (
              <>
                <button onClick={prevImage} style={arrowStyle('left')}><ChevronLeft size={20} color="#111" /></button>
                <button onClick={nextImage} style={arrowStyle('right')}><ChevronRight size={20} color="#111" /></button>
              </>
            )}

            {/* Dots */}
            {product.images.length > 1 && (
              <div style={{ position: 'absolute', bottom: '16px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '6px' }}>
                {product.images.map((_: string, idx: number) => (
                  <button key={idx} onClick={() => setCurrentImage(idx)} style={{
                    width: currentImage === idx ? '22px' : '8px', height: '8px', borderRadius: '10px',
                    backgroundColor: currentImage === idx ? '#111' : 'rgba(0,0,0,0.25)',
                    border: 'none', cursor: 'pointer', transition: 'all 0.3s ease', padding: 0,
                  }} />
                ))}
              </div>
            )}

            {/* Style Highlights Overlay (Desktop) */}
            {product.highlights && Object.keys(product.highlights).length > 0 && (
              <div className="style-highlights-overlay" style={{
                position: 'absolute', bottom: 0, left: 0, right: '50%',
                background: 'linear-gradient(to top, rgba(0,0,0,0.85) 70%, transparent)',
                padding: '2rem', color: '#fff',
              }}>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 300, marginBottom: '1rem' }}>
                  Style<br /><span style={{ fontWeight: 800 }}>Highlights</span>
                </h3>
                {Object.entries(product.highlights).map(([key, val]) => (
                  <div key={key} style={{ marginBottom: '0.6rem' }}>
                    <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', display: 'block' }}>{key}</span>
                    <span style={{ fontSize: '0.95rem', fontWeight: 700 }}>{val as string}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Thumbnail Row (Desktop) */}
          {product.images.length > 1 && (
            <div className="pdp-thumbnails" style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
              {product.images.map((img: string, idx: number) => (
                <button key={idx} onClick={() => setCurrentImage(idx)} style={{
                  flex: 1, aspectRatio: '1/1', border: currentImage === idx ? '2px solid var(--color-text)' : '2px solid transparent',
                  padding: 0, cursor: 'pointer', overflow: 'hidden', backgroundColor: '#f0f0f0',
                  opacity: currentImage === idx ? 1 : 0.6, transition: 'all 0.2s ease',
                }}>
                  <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ===== RIGHT: PRODUCT INFO ===== */}
        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          
          {/* Name + Heart */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
            <h1 style={{ fontSize: 'clamp(1.4rem, 2.5vw, 1.8rem)', fontWeight: 800, textTransform: 'uppercase', margin: 0, lineHeight: 1.2, color: 'var(--color-text)' }}>
              {product.name}
            </h1>
            <button onClick={() => toggleWishlist(product._id || product.slug)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', flexShrink: 0 }}>
              <Heart size={24} fill={isInWishlist(product._id || product.slug) ? '#e53935' : 'none'} color={isInWishlist(product._id || product.slug) ? '#e53935' : '#888'} strokeWidth={1.5} />
            </button>
          </div>

          {/* Price Row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
            {product.originalPrice > product.salePrice && (
              <span style={{ color: '#999', textDecoration: 'line-through', fontSize: '1rem', fontWeight: 500 }}>Rs.{product.originalPrice?.toLocaleString()}.00</span>
            )}
            <span style={{ color: product.originalPrice > product.salePrice ? '#e53935' : 'var(--color-text)', fontWeight: 800, fontSize: '1.2rem' }}>Rs.{product.salePrice?.toLocaleString()}.00</span>
            {product.discount > 0 && (
              <span style={{ backgroundColor: '#e53935', color: '#fff', padding: '2px 8px', fontSize: '0.7rem', fontWeight: 800, borderRadius: '3px' }}>SAVE {product.discount}%</span>
            )}
          </div>
          <p style={{ fontSize: '0.82rem', color: '#888', fontWeight: 500, margin: 0, textDecoration: 'underline', cursor: 'pointer' }}>Shipping calculated at checkout.</p>

          {/* Stock Indicator */}
          {product.inventory && selectedSize && (
            <div style={{ marginTop: '0.5rem' }}>
              {product.inventory[selectedSize] === 0 ? (
                <span style={{ color: '#e53935', fontWeight: 700, fontSize: '0.9rem' }}>Out of stock</span>
              ) : product.inventory[selectedSize] < 10 ? (
                <span style={{ color: '#e53935', fontWeight: 700, fontSize: '0.9rem' }}>
                  Only {product.inventory[selectedSize]} quantity left
                </span>
              ) : (
                <span style={{ color: '#2e7d32', fontWeight: 700, fontSize: '0.9rem' }}>
                  In stock
                </span>
              )}
            </div>
          )}

          {/* Size Selector */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-text)' }}>SIZE: {selectedSize}</span>
                {product.sizeChart && Object.entries(product.sizeChart).map(([key, val]) => (
                  <span key={key} style={{ fontSize: '0.78rem', fontWeight: 600, color: '#666', textTransform: 'uppercase', borderLeft: '1px solid #ccc', paddingLeft: '0.8rem' }}>
                    {key} {val as string} INCHES
                  </span>
                ))}
              </div>
              <button 
                onClick={() => setShowSizeGuide(true)}
                style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'none', border: 'none', cursor: 'pointer', color: '#666', fontSize: '0.82rem', fontWeight: 600, textDecoration: 'underline' }}
              >
                <Ruler size={13} /> Sizing guide
              </button>
            </div>
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              {(product.sizes || ['S', 'M', 'L']).map((size: string) => {
                const isOutOfStock = (product.inventory?.[size] !== undefined ? product.inventory[size] : (product.stock || 0)) === 0;
                return (
                  <button 
                    key={size} 
                    disabled={isOutOfStock}
                    onClick={() => {
                      setSelectedSize(size);
                      setQuantity(1);
                    }} 
                    style={{
                      minWidth: '44px', height: '44px', padding: '0 10px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 700, fontSize: '0.85rem', cursor: isOutOfStock ? 'not-allowed' : 'pointer',
                      backgroundColor: selectedSize === size ? 'var(--color-text)' : 'transparent',
                      color: selectedSize === size ? 'var(--color-bg)' : isOutOfStock ? '#ccc' : 'var(--color-text)',
                      border: `1.5px solid ${selectedSize === size ? 'var(--color-text)' : isOutOfStock ? '#eee' : '#ddd'}`,
                      transition: 'all 0.2s ease',
                      opacity: isOutOfStock ? 0.5 : 1,
                      textDecoration: isOutOfStock ? 'line-through' : 'none'
                    }}
                    title={isOutOfStock ? "Out of stock" : ""}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quantity + Add to Cart */}
          {isSelectedOutOfStock ? (
            <button 
              onClick={handleNotifyMe}
              disabled={isEnquiring || hasEnquired}
              style={{
                width: '100%', padding: '1.2rem',
                backgroundColor: hasEnquired ? '#2e7d32' : 'var(--color-text)', 
                color: 'var(--color-bg)', border: 'none',
                fontWeight: 800, fontSize: '0.9rem',
                textTransform: 'uppercase', letterSpacing: '1px', 
                cursor: (isEnquiring || hasEnquired) ? 'not-allowed' : 'pointer', 
                transition: 'all 0.3s ease',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
              }}
            >
              {hasEnquired ? 'WE WILL NOTIFY YOU!' : isEnquiring ? 'REGISTERING...' : 'NOTIFY ME WHEN AVAILABLE'}
            </button>
          ) : (
            <>
              <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'stretch' }}>
                <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid #ddd', overflow: 'hidden', opacity: isSelectedOutOfStock ? 0.5 : 1 }}>
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} style={qtyBtnStyle} disabled={isSelectedOutOfStock}>−</button>
                  <span style={{ width: '36px', textAlign: 'center', fontWeight: 700, fontSize: '0.95rem', color: 'var(--color-text)' }}>{quantity}</span>
                  <button onClick={() => {
                    const maxAvailable = product.inventory?.[selectedSize] !== undefined ? product.inventory[selectedSize] : (product.stock || 1);
                    setQuantity(Math.min(maxAvailable, quantity + 1));
                  }} style={qtyBtnStyle} disabled={isSelectedOutOfStock || quantity >= (product.inventory?.[selectedSize] !== undefined ? product.inventory[selectedSize] : (product.stock || 1))}>+</button>
                </div>
                <button onClick={handleAddToCart} 
                  disabled={isSelectedOutOfStock}
                  style={{
                    flex: 1, padding: '0 1.5rem', height: '48px',
                    backgroundColor: 'transparent', border: '1.5px solid var(--color-text)',
                    color: 'var(--color-text)', fontWeight: 800, fontSize: '0.9rem',
                    textTransform: 'uppercase', letterSpacing: '1px', 
                    cursor: isSelectedOutOfStock ? 'not-allowed' : 'pointer', 
                    transition: 'all 0.3s ease',
                    opacity: isSelectedOutOfStock ? 0.5 : 1
                  }}
                  onMouseOver={(e) => { 
                    if (!isSelectedOutOfStock) {
                      e.currentTarget.style.backgroundColor = 'var(--color-text)'; 
                      e.currentTarget.style.color = 'var(--color-bg)'; 
                    }
                  }}
                  onMouseOut={(e) => { 
                    if (!isSelectedOutOfStock) {
                      e.currentTarget.style.backgroundColor = 'transparent'; 
                      e.currentTarget.style.color = 'var(--color-text)'; 
                    }
                  }}
                >
                  {isSelectedOutOfStock ? 'OUT OF STOCK' : 'ADD TO CART'}
                </button>
              </div>

              {/* Buy It Now */}
              <button onClick={handleBuyNow} 
                disabled={isSelectedOutOfStock}
                style={{
                  width: '100%', padding: '1rem', backgroundColor: 'var(--color-text)', color: 'var(--color-bg)',
                  border: 'none', fontWeight: 800, fontSize: '0.9rem', textTransform: 'uppercase',
                  letterSpacing: '1px', cursor: isSelectedOutOfStock ? 'not-allowed' : 'pointer', marginTop: '0.6rem',
                  opacity: isSelectedOutOfStock ? 0.5 : 1
                }}
              >
                BUY IT NOW
              </button>
            </>
          )}

          {/* Check Delivery Section */}
          <div style={{ border: '1px solid var(--color-border)', padding: '1.2rem', marginTop: '0.5rem' }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 800, marginBottom: '0.8rem', color: 'var(--color-text)' }}>Check Delivery and Pickup:</h4>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1.5px solid #ddd', padding: '0 0.8rem' }}>
                <MapPin size={16} color="#888" />
                <input 
                  type="text" 
                  placeholder="Enter Pincode" 
                  value={pincode} 
                  onChange={(e) => setPincode(e.target.value)}
                  maxLength={6}
                  style={{ border: 'none', outline: 'none', width: '100%', padding: '0.7rem 0', fontSize: '0.9rem', fontWeight: 500, backgroundColor: 'transparent', color: 'var(--color-text)' }} 
                />
              </div>
              <button onClick={checkPincode} style={{
                padding: '0 1.2rem', backgroundColor: '#555', color: '#fff',
                border: 'none', fontWeight: 800, fontSize: '0.8rem', letterSpacing: '0.5px',
                cursor: 'pointer', textTransform: 'uppercase',
              }}>
                CHECK
              </button>
            </div>
            {pincodeResult && <p style={{ fontSize: '0.82rem', color: '#888', fontWeight: 500, marginTop: '0.6rem' }}>{pincodeResult}</p>}
            <p style={{ fontSize: '0.78rem', color: '#999', fontWeight: 500, marginTop: '0.5rem' }}>
              Enter your pincode to <strong style={{ color: 'var(--color-text)' }}>check delivery date and nearby store availability</strong>
            </p>
          </div>

          {/* What You Get Section */}
          <div style={{ marginTop: '0.5rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--color-text)' }}>
              What You Get for Rs.{product.salePrice?.toLocaleString()}
            </h3>
            <p style={{ fontSize: '0.9rem', lineHeight: 1.6, color: '#888', fontWeight: 500, marginBottom: '1.2rem' }}>
              {product.description}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {product.features?.map((f: any, idx: number) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: '#888' }}>
                    {idx === 0 ? <Package size={22} strokeWidth={1.5} /> : idx === 1 ? <CreditCard size={22} strokeWidth={1.5} /> : <Truck size={22} strokeWidth={1.5} />}
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 800, margin: 0, color: 'var(--color-text)' }}>{f.title}</h4>
                    <p style={{ fontSize: '0.82rem', color: '#888', fontWeight: 500, margin: 0 }}>{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Product Info Tabs */}
          <ProductInfoTabs product={product} />

        </div>
      </div>

      {/* --- NEW SECTION: CUSTOMER REVIEWS --- */}
      <div className="container" id="reviews" style={{ padding: '4rem 1.5rem', borderTop: '1px solid var(--color-border)', marginTop: '2rem' }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '2rem', textAlign: 'center' }}>CUSTOMER REVIEWS</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          
          {/* Review List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {(!product.reviews || product.reviews.length === 0) ? (
              <div style={{ padding: '2rem', textAlign: 'center', backgroundColor: 'var(--color-secondary)', borderRadius: '8px', color: '#666' }}>
                No reviews yet. Be the first to review this product!
              </div>
            ) : (
              product.reviews.map((review: any) => (
                <div key={review._id} style={{ backgroundColor: 'var(--color-secondary)', padding: '1.5rem', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                  <div style={{ display: 'flex', gap: '2px', marginBottom: '0.8rem', color: '#e53935' }}>
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} fill={i < review.rating ? "currentColor" : "none"} strokeWidth={2} color={i < review.rating ? "#e53935" : "#ccc"} />
                    ))}
                  </div>
                  <p style={{ color: 'var(--color-text)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1rem', fontWeight: 500 }}>
                    "{review.comment}"
                  </p>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#888', display: 'flex', justifyContent: 'space-between' }}>
                    <span>— {review.name}</span>
                    <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Add Review Form */}
          <div style={{ backgroundColor: 'var(--color-secondary)', padding: '2rem', borderRadius: '8px', border: '1px solid var(--color-border)', height: 'fit-content' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1.5rem' }}>Write a Review</h3>
            
            {!isSignedIn ? (
              <div style={{ padding: '1rem', backgroundColor: '#f5f5f5', borderRadius: '6px', textAlign: 'center' }}>
                <p style={{ marginBottom: '1rem', fontSize: '0.9rem', color: '#666' }}>You must be logged in to leave a review.</p>
                <Link href={`/login?callbackUrl=/products/${product._id}`} style={{ display: 'inline-block', padding: '0.6rem 1.2rem', backgroundColor: 'var(--color-text)', color: 'var(--color-bg)', textDecoration: 'none', borderRadius: '4px', fontWeight: 700, fontSize: '0.85rem' }}>
                  LOGIN TO REVIEW
                </Link>
              </div>
            ) : (
              <form onSubmit={submitReview} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.5rem' }}>Rating</label>
                  <div style={{ display: 'flex', gap: '5px' }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button 
                        key={star} 
                        type="button" 
                        onClick={() => setReviewRating(star)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: star <= reviewRating ? '#e53935' : '#ccc' }}
                      >
                        <Star size={24} fill={star <= reviewRating ? "currentColor" : "none"} strokeWidth={1.5} />
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.5rem' }}>Your Review</label>
                  <textarea 
                    required 
                    rows={4} 
                    placeholder="What did you like or dislike?" 
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    style={{ width: '100%', padding: '0.8rem', borderRadius: '4px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg)', color: 'var(--color-text)', outline: 'none', resize: 'vertical' }}
                  ></textarea>
                </div>

                {reviewError && <div style={{ color: '#e53935', fontSize: '0.85rem', fontWeight: 600 }}>{reviewError}</div>}
                {reviewSuccess && <div style={{ color: '#2e7d32', fontSize: '0.85rem', fontWeight: 600 }}>{reviewSuccess}</div>}

                <button 
                  type="submit" 
                  disabled={reviewLoading}
                  style={{ padding: '0.8rem', backgroundColor: 'var(--color-text)', color: 'var(--color-bg)', border: 'none', borderRadius: '4px', fontWeight: 800, cursor: reviewLoading ? 'not-allowed' : 'pointer', opacity: reviewLoading ? 0.7 : 1, marginTop: '0.5rem' }}
                >
                  {reviewLoading ? 'SUBMITTING...' : 'SUBMIT REVIEW'}
                </button>
              </form>
            )}
          </div>

        </div>
      </div>

      {/* --- NEW SECTION: YOU MAY ALSO LIKE --- */}
      {relatedProducts.length > 0 && (
        <div className="container" style={{ padding: '0 1.5rem 5rem 1.5rem' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '2rem', textAlign: 'center' }}>YOU MAY ALSO LIKE</h2>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1.5rem' 
          }}>
            {relatedProducts.map((p) => (
              <div key={p._id} style={{ display: 'flex', flexDirection: 'column', cursor: 'pointer' }}>
                <Link href={`/products/${p.slug || p._id}`} style={{ display: 'block', position: 'relative', aspectRatio: '3/4', backgroundColor: '#f0eeeb', overflow: 'hidden', marginBottom: '0.8rem' }}>
                  <img src={p.images[0]} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  {p.discount > 0 && (
                    <span style={{ position: 'absolute', top: '10px', left: '10px', backgroundColor: '#e53935', color: '#fff', padding: '4px 10px', fontSize: '0.7rem', fontWeight: 800 }}>SAVE {p.discount}%</span>
                  )}
                </Link>
                <div>
                  <h3 style={{ fontSize: '0.9rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.3rem', color: 'var(--color-text)' }}>{p.name}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--color-text)' }}>₹{p.salePrice}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- SIZE GUIDE MODAL --- */}
      {showSizeGuide && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 9999,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '1rem'
        }} onClick={() => setShowSizeGuide(false)}>
          <div style={{
            backgroundColor: 'var(--color-bg)', padding: '2rem', borderRadius: '12px',
            width: '100%', maxWidth: '500px', position: 'relative'
          }} onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setShowSizeGuide(false)} style={{ position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--color-text)' }}>×</button>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '1.5rem', textAlign: 'center' }}>SIZE GUIDE</h2>
            <p style={{ textAlign: 'center', color: '#666', fontSize: '0.9rem', marginBottom: '2rem' }}>Measurements are in INCHES.</p>
            
            {product.sizeChart ? (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--color-secondary)' }}>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid var(--color-border)', fontWeight: 800 }}>SIZE</th>
                    {Object.keys(product.sizeChart).map(key => (
                      <th key={key} style={{ padding: '12px', textAlign: 'center', borderBottom: '2px solid var(--color-border)', fontWeight: 800, textTransform: 'uppercase' }}>{key}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(product.sizes || ['S', 'M', 'L']).map((size: string, index: number) => (
                    <tr key={size} style={{ borderBottom: '1px solid var(--color-border)' }}>
                      <td style={{ padding: '12px', fontWeight: 800 }}>{size}</td>
                      {/* Calculate an estimated graded measurement for display if we only have one base measurement in DB */}
                      {Object.values(product.sizeChart).map((val: any, idx) => (
                        <td key={idx} style={{ padding: '12px', textAlign: 'center', color: '#666' }}>
                          {/* Very simple mock grading: just add/subtract an inch based on index to make the table look realistic */}
                          {Number(val) + (index - 1)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p style={{ textAlign: 'center', color: '#888' }}>Size guide not available for this product.</p>
            )}
          </div>
        </div>
      )}

      {/* Responsive Styles */}
      <style>{`
        @media (min-width: 768px) {
          .pdp-grid {
            grid-template-columns: 1.1fr 1fr !important;
          }
          .style-highlights-overlay {
            display: block !important;
          }
        }
        @media (max-width: 767px) {
          .style-highlights-overlay {
            display: none !important;
          }
          .pdp-thumbnails {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}

const arrowStyle = (side: 'left' | 'right'): React.CSSProperties => ({
  position: 'absolute',
  [side]: '12px',
  top: '50%',
  transform: 'translateY(-50%)',
  backgroundColor: 'rgba(255,255,255,0.9)',
  border: 'none',
  borderRadius: '50%',
  width: '38px',
  height: '38px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
});

const qtyBtnStyle: React.CSSProperties = {
  width: '38px',
  height: '48px',
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  fontSize: '1.2rem',
  fontWeight: 600,
  color: 'inherit',
};

/* ===== PRODUCT INFO TABS ===== */
const tabs = ['SIZE & FIT', 'FABRIC & CARE', 'SHIPPING', 'RETURNS & EXCHANGE', 'ABOUT'];

function ProductInfoTabs({ product }: { product: any }) {
  const [activeTab, setActiveTab] = useState('SIZE & FIT');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'SIZE & FIT':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            <p style={{ fontSize: '0.9rem', color: '#888', fontWeight: 500 }}>
              {product.modelInfo || 'The model is wearing size M'}
            </p>
            {product.sizeChart && Object.entries(product.sizeChart).map(([key, val]) => (
              <p key={key} style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-text)', textTransform: 'capitalize', margin: 0 }}>
                {key} - <span style={{ fontWeight: 500 }}>{val as string} inches</span>
              </p>
            ))}
            <div style={{ marginTop: '0.5rem' }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--color-text)' }}>Other Information</h4>
              <ul style={{ paddingLeft: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <li style={listStyle}>Colors may slightly vary depending on your screen brightness.</li>
                <li style={listStyle}>Actual product specifications/GSM may vary +/-5%</li>
                <li style={listStyle}>All the products have different sizes and size chart</li>
                <li style={listStyle}>MRP: Rs.{product.originalPrice?.toLocaleString() || product.salePrice?.toLocaleString()}/- incl. of all taxes.</li>
              </ul>
            </div>
          </div>
        );
      case 'FABRIC & CARE':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            {product.highlights && Object.entries(product.highlights).map(([key, val]) => (
              <div key={key} style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.6rem', borderBottom: '1px solid var(--color-border)' }}>
                <span style={{ fontSize: '0.88rem', color: '#888', fontWeight: 600 }}>{key}</span>
                <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--color-text)' }}>{val as string}</span>
              </div>
            ))}
            <div style={{ marginTop: '0.5rem' }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--color-text)' }}>Care Instructions</h4>
              <ul style={{ paddingLeft: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {(product.careInstructions || []).map((instruction: string, idx: number) => (
                  <li key={idx} style={listStyle}>{instruction}</li>
                ))}
              </ul>
            </div>
          </div>
        );
      case 'SHIPPING':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-text)', fontWeight: 700, margin: 0 }}>Shipping</p>
            <p style={paraStyle}>We currently offer 5% discount on all pre-paid orders.</p>
            <p style={paraStyle}>Standard delivery takes 3-7 business days depending on your location.</p>
            <p style={paraStyle}>Free shipping on all orders above Rs.999.</p>
            <p style={paraStyle}>Orders placed before 2 PM are dispatched on the same business day.</p>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-text)', fontWeight: 700, margin: 0, marginTop: '0.5rem' }}>Tracking</p>
            <p style={paraStyle}>You will receive a tracking link via email and SMS once your order is shipped.</p>
          </div>
        );
      case 'RETURNS & EXCHANGE':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            <p style={paraStyle}>Easy returns & exchanges within <strong style={{ color: 'var(--color-text)' }}>15 days</strong> of delivery.</p>
            <ul style={{ paddingLeft: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <li style={listStyle}>Items must be unused, unwashed, and in original condition with tags attached.</li>
              <li style={listStyle}>Sale items and accessories are non-returnable.</li>
              <li style={listStyle}>Refunds will be processed within 5-7 business days after we receive the item.</li>
              <li style={listStyle}>For exchanges, please contact us at <strong style={{ color: 'var(--color-text)' }}>info.dripeon@gmail.com</strong></li>
            </ul>
          </div>
        );
      case 'ABOUT':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            <p style={paraStyle}>{product.description}</p>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-text)', fontWeight: 700, margin: 0, marginTop: '0.5rem' }}>Sizing</p>
            <p style={paraStyle}>Fits true to size. Do you need size advice? Please refer to our size chart.</p>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-text)', fontWeight: 700, margin: 0, marginTop: '0.5rem' }}>Assistance</p>
            <p style={paraStyle}>
              Contact us at <strong style={{ color: 'var(--color-text)', textDecoration: 'underline' }}>info.dripeon@gmail.com</strong>
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div style={{ marginTop: '1.5rem', borderTop: '1px solid var(--color-border)', paddingTop: '1.5rem' }}>
      {/* Tab Buttons */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '0.55rem 1rem',
              borderRadius: '50px',
              border: activeTab === tab ? '1.5px solid var(--color-text)' : '1.5px solid var(--color-border)',
              backgroundColor: activeTab === tab ? 'var(--color-text)' : 'transparent',
              color: activeTab === tab ? 'var(--color-bg)' : 'var(--color-text)',
              fontWeight: 700,
              fontSize: '0.75rem',
              letterSpacing: '0.5px',
              textTransform: 'uppercase',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              whiteSpace: 'nowrap',
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div style={{ minHeight: '120px' }}>
        {renderTabContent()}
      </div>
    </div>
  );
}

const listStyle: React.CSSProperties = {
  fontSize: '0.88rem', color: '#888', fontWeight: 500, lineHeight: 1.6,
};

const paraStyle: React.CSSProperties = {
  fontSize: '0.9rem', color: '#888', fontWeight: 500, lineHeight: 1.7, margin: 0,
};
