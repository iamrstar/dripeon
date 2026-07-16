"use client";

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Loader2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when overlay opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = 'hidden';
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
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'var(--color-bg)',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Header / Search Input */}
          <div style={{ borderBottom: '1px solid var(--color-border)', padding: '2rem 5%' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
              <button 
                onClick={onClose}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}
              >
                CLOSE <X size={24} />
              </button>
            </div>
            
            <div style={{ position: 'relative', maxWidth: '800px', margin: '0 auto' }}>
              <Search 
                size={32} 
                style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', color: '#888' }} 
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
                  fontSize: '2rem',
                  fontWeight: 800,
                  border: 'none',
                  borderBottom: '2px solid var(--color-text)',
                  backgroundColor: 'transparent',
                  color: 'var(--color-text)',
                  outline: 'none',
                  textTransform: 'uppercase'
                }}
              />
            </div>
          </div>

          {/* Results Area */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '3rem 5%' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
              {isSearching ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem 0' }}>
                  <Loader2 size={40} className="animate-spin" style={{ color: '#888' }} />
                </div>
              ) : query.trim().length > 2 && results.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem 0', color: '#888' }}>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1rem' }}>NO RESULTS FOUND FOR "{query}"</h3>
                  <p>Try checking your spelling or searching for a different term.</p>
                </div>
              ) : results.length > 0 ? (
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '2rem', textTransform: 'uppercase' }}>
                    Results for "{query}"
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '2rem' }}>
                    {results.map((product) => (
                      <Link 
                        href={`/products/${product.slug || product._id}`} 
                        key={product._id}
                        onClick={onClose}
                        style={{ textDecoration: 'none', color: 'inherit' }}
                        className="group"
                      >
                        <div style={{ position: 'relative', aspectRatio: '3/4', backgroundColor: '#f5f5f5', marginBottom: '1rem', overflow: 'hidden' }}>
                          <Image 
                            src={product.images?.[0] || '/hero_mens_streetwear.png'} 
                            alt={product.name}
                            fill
                            style={{ objectFit: 'cover', transition: 'transform 0.3s ease' }}
                          />
                        </div>
                        <h4 style={{ fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.3rem' }}>{product.name}</h4>
                        <p style={{ fontSize: '0.9rem', fontWeight: 600, color: '#888' }}>₹{product.price}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4rem', opacity: 0.6 }}>
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>POPULAR SEARCHES</h3>
                    <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <li><button onClick={() => setQuery("Oversized")} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', fontWeight: 600, textTransform: 'uppercase', padding: 0 }}>Oversized T-Shirts</button></li>
                      <li><button onClick={() => setQuery("Hoodie")} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', fontWeight: 600, textTransform: 'uppercase', padding: 0 }}>Hoodies</button></li>
                      <li><button onClick={() => setQuery("Jeans")} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', fontWeight: 600, textTransform: 'uppercase', padding: 0 }}>Baggy Jeans</button></li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
