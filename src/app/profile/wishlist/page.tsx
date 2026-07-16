"use client";

import { useWishlist } from "@/context/WishlistContext";
import { useEffect, useState } from "react";
import Loader from "@/components/Loader";
import Link from "next/link";
import { Heart } from "lucide-react";

export default function WishlistPage() {
  const { wishlist, toggleWishlist, isInWishlist } = useWishlist();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (wishlist.length === 0) {
      setProducts([]);
      setLoading(false);
      return;
    }

    const fetchWishlistProducts = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/products?ids=${wishlist.join(',')}`);
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching wishlist products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlistProducts();
  }, [wishlist]);

  if (loading) return <Loader />;

  return (
    <div className="container" style={{ minHeight: 'calc(100vh - 120px)', padding: '4rem 1rem' }}>
      <h1 style={{ fontSize: '3rem', color: 'var(--color-text)', marginBottom: '3rem', letterSpacing: '-1px' }}>
        WISHLIST
      </h1>
      
      {products.length === 0 ? (
        <div style={{ backgroundColor: 'var(--color-secondary)', padding: '4rem', border: '1px solid var(--color-border)', textAlign: 'center' }}>
          <h3 style={{ fontSize: '1.8rem', color: 'var(--color-text)', marginBottom: '1rem', fontWeight: 800 }}>Your Wishlist is Empty</h3>
          <p style={{ color: '#888', fontWeight: 500, marginBottom: '2rem', fontSize: '1.1rem' }}>Start adding some heat to your collection.</p>
          <Link href="/" className="btn-primary" style={{ padding: '1rem 2.5rem' }}>
            START SHOPPING
          </Link>
        </div>
      ) : (
        <div className="category-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
          {products.map((product) => (
            <div key={product._id} style={{ display: 'flex', flexDirection: 'column', cursor: 'pointer' }}>
              <Link href={`/products/${product.slug || product._id}`} style={{ 
                display: 'block', position: 'relative', aspectRatio: '3/4', 
                backgroundColor: '#f0eeeb', overflow: 'hidden', marginBottom: '0.8rem',
              }}>
                <img src={product.images[0]} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                
                <button 
                  onClick={(e) => { e.preventDefault(); toggleWishlist(product.slug || product._id); }}
                  style={{
                    position: 'absolute', top: '10px', right: '10px',
                    backgroundColor: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '50%',
                    width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', zIndex: 2
                  }}
                >
                  <Heart size={18} fill={isInWishlist(product.slug || product._id) ? '#e53935' : 'none'} color={isInWishlist(product.slug || product._id) ? '#e53935' : '#888'} />
                </button>
              </Link>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ fontSize: '0.9rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.3rem', color: 'var(--color-text)' }}>
                    {product.name}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--color-text)' }}>₹{product.salePrice}</span>
                    {product.originalPrice > product.salePrice && (
                      <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#888', textDecoration: 'line-through' }}>
                        ₹{product.originalPrice}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
