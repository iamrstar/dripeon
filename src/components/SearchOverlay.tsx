"use client";

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Loader2, TrendingUp } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input and fetch recommendations when overlay opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = 'hidden';
      
      // Fetch recommendations (random/top products) if not already fetched
      if (recommendations.length === 0) {
        fetch('/api/products?limit=4')
          .then(res => res.json())
          .then(data => setRecommendations(data))
          .catch(err => console.error("Failed to load recommendations", err));
      }
    } else {
      document.body.style.overflow = '';
      setQuery("");
      setResults([]);
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Debounced search
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (query.trim().length > 2) {
        setIsSearching(true);
        try {
          const res = await fetch(`/api/products?search=${encodeURIComponent(query)}&limit=6`);
          const data = await res.json();
          setResults(data);
        } catch (error) {
          console.error("Search failed:", error);
        } finally {
          setIsSearching(false);
        }
      } else {
        setResults([]);
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(255,255,255,0.98)',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Header / Search Input */}
          <div style={{ borderBottom: '1px solid #e0e0e0', padding: '2rem 5%', backgroundColor: '#fff' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
              <button 
                onClick={onClose}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#111', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}
              >
                CLOSE <X size={20} strokeWidth={2.5} />
              </button>
            </div>
            
            <div style={{ position: 'relative', maxWidth: '900px', margin: '0 auto' }}>
              <Search 
                size={32} 
                style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', color: '#111' }} 
              />
              <input
                ref={inputRef}
                type="text"
                placeholder="WHAT ARE YOU LOOKING FOR?"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '1rem 1rem 1rem 3.5rem',
                  fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
                  fontWeight: 900,
                  border: 'none',
                  borderBottom: '3px solid #111',
                  backgroundColor: 'transparent',
                  color: '#111',
                  outline: 'none',
                  textTransform: 'uppercase',
                  letterSpacing: '-1px'
                }}
              />
            </div>
          </div>

          {/* Results Area */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '3rem 5%', backgroundColor: '#f9f9f9' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
              {isSearching ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem 0' }}>
                  <Loader2 size={40} className="animate-spin" style={{ color: '#111' }} />
                </div>
              ) : query.trim().length > 2 && results.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem 0', color: '#666' }}>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1rem', color: '#111' }}>NO RESULTS FOUND FOR "{query}"</h3>
                  <p style={{ fontWeight: 500 }}>Try checking your spelling or searching for a different term.</p>
                </div>
              ) : results.length > 0 ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '2rem', textTransform: 'uppercase', color: '#111', borderBottom: '2px solid #111', paddingBottom: '0.5rem', display: 'inline-block' }}>
                    Results for "{query}"
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '2rem' }}>
                    {results.map((product) => (
                      <ProductCard key={product._id} product={product} onClose={onClose} />
                    ))}
                  </div>
                </motion.div>
              ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                  
                  {/* Trending Searches Tags */}
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#111' }}>
                      <TrendingUp size={18} /> POPULAR SEARCHES
                    </h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.8rem' }}>
                      {["Oversized Tees", "Hoodies", "Cargo Pants", "Varsity Jackets", "Accessories"].map(tag => (
                        <button 
                          key={tag}
                          onClick={() => setQuery(tag)} 
                          style={{ 
                            background: '#fff', border: '1px solid #ddd', borderRadius: '50px',
                            padding: '0.6rem 1.2rem', cursor: 'pointer', fontSize: '0.85rem', 
                            fontWeight: 700, textTransform: 'uppercase', color: '#111',
                            transition: 'all 0.2s ease', boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                          }}
                          onMouseOver={(e) => { e.currentTarget.style.borderColor = '#111'; e.currentTarget.style.backgroundColor = '#111'; e.currentTarget.style.color = '#fff'; }}
                          onMouseOut={(e) => { e.currentTarget.style.borderColor = '#ddd'; e.currentTarget.style.backgroundColor = '#fff'; e.currentTarget.style.color = '#111'; }}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Recommended Products Grid */}
                  {recommendations.length > 0 && (
                    <div>
                      <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '1.5rem', color: '#111' }}>RECOMMENDED FOR YOU</h3>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '2rem' }}>
                        {recommendations.map((product) => (
                          <ProductCard key={product._id} product={product} onClose={onClose} />
                        ))}
                      </div>
                    </div>
                  )}

                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Reusable Product Card Component for Search Results & Recommendations
function ProductCard({ product, onClose }: { product: any, onClose: () => void }) {
  return (
    <Link 
      href={`/products/${product.slug || product._id}`} 
      onClick={onClose}
      style={{ textDecoration: 'none', color: '#111', display: 'flex', flexDirection: 'column' }}
      className="group"
    >
      <div style={{ position: 'relative', aspectRatio: '3/4', backgroundColor: '#f5f5f5', marginBottom: '1rem', overflow: 'hidden', borderRadius: '4px' }}>
        <Image 
          src={product.images?.[0] || '/hero_mens_streetwear.png'} 
          alt={product.name}
          fill
          style={{ objectFit: 'cover', transition: 'transform 0.5s ease' }}
        />
        {product.discount > 0 && (
          <span style={{ position: 'absolute', top: '10px', left: '10px', backgroundColor: '#e53935', color: '#fff', padding: '4px 8px', fontSize: '0.7rem', fontWeight: 800, zIndex: 10 }}>SAVE {product.discount}%</span>
        )}
      </div>
      <h4 style={{ fontSize: '0.9rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.3rem', lineHeight: 1.3 }}>{product.name}</h4>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        {product.originalPrice > product.salePrice && (
          <span style={{ fontSize: '0.8rem', color: '#888', textDecoration: 'line-through', fontWeight: 600 }}>₹{product.originalPrice}</span>
        )}
        <span style={{ fontSize: '0.95rem', fontWeight: 800, color: product.originalPrice > product.salePrice ? '#e53935' : '#111' }}>₹{product.salePrice || product.price}</span>
      </div>
    </Link>
  );
}
