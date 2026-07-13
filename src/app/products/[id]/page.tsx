"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { ShoppingCart } from "lucide-react";
import Loader from "@/components/Loader";

// Mock database for when actual DB is empty during development
const mockProducts: any = {
  "1": {
    id: "1",
    name: "Classic Oversized Tee",
    price: 1499,
    description: "Premium heavy-weight cotton oversized t-shirt. Features a drop shoulder fit and ribbed crewneck. Designed for maximum comfort and a true streetwear aesthetic.",
    image: "/IMG_3033.jpeg",
    category: "Topwear"
  },
  "2": {
    id: "2",
    name: "Baggy Wash Jeans",
    price: 2999,
    description: "Relaxed fit baggy denim jeans with a vintage wash finish. Heavyweight denim built to last, featuring a classic 5-pocket design.",
    image: "/IMG_3034.jpeg",
    category: "Bottomwear"
  },
  "3": {
    id: "3",
    name: "Dripeon Signature Cap",
    price: 999,
    description: "Structured 6-panel cap featuring our signature embroidered logo. Adjustable strapback for a custom fit.",
    image: "/IMG_3035.jpeg",
    category: "Accessories"
  }
};

export default function ProductDetail() {
  const params = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<string>("M");
  const [quantity, setQuantity] = useState<number>(1);

  const sizes = ["S", "M", "L", "XL"];

  useEffect(() => {
    // In a real app, we would fetch from /api/products/${params.id}
    // For now, use the mock data to build the UI
    const id = params.id as string;
    setTimeout(() => {
      setProduct(mockProducts[id] || mockProducts["1"]); // fallback to 1
      setLoading(false);
    }, 500);
  }, [params.id]);

  if (loading) {
    return <Loader />;
  }

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      size: selectedSize,
      quantity: quantity
    });
    // Optional: show a toast or slide open the cart drawer here
    alert("Added to cart!");
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push('/checkout');
  };

  return (
    <div className="container" style={{ padding: '4rem 1rem', minHeight: 'calc(100vh - 120px)' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'start' }}>
        
        {/* Left Side: Product Image */}
        <div style={{ 
          width: '100%', 
          aspectRatio: '4/5', 
          backgroundColor: 'var(--color-secondary)',
          backgroundImage: `url('${product.image}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          border: '1px solid var(--color-border)',
          boxShadow: '15px 15px 0px var(--color-accent-gold)'
        }} />

        {/* Right Side: Product Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          <div>
            <span style={{ color: '#888', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.9rem' }}>
              {product.category}
            </span>
            <h1 style={{ fontSize: '3.5rem', lineHeight: 1.1, marginTop: '0.5rem', color: 'var(--color-text)' }}>
              {product.name}
            </h1>
            <div style={{ fontSize: '2rem', fontWeight: 800, marginTop: '1rem', color: 'var(--color-text)' }}>
              ₹{product.price}
            </div>
          </div>

          <p style={{ fontSize: '1.1rem', lineHeight: 1.6, color: '#aaa', fontWeight: 500 }}>
            {product.description}
          </p>

          {/* Size Selector */}
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1rem' }}>
              Select Size
            </h4>
            <div style={{ display: 'flex', gap: '1rem' }}>
              {sizes.map(size => (
                <button 
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  style={{
                    width: '50px',
                    height: '50px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '1.1rem',
                    cursor: 'pointer',
                    backgroundColor: selectedSize === size ? 'var(--color-text)' : 'transparent',
                    color: selectedSize === size ? 'var(--color-bg)' : 'var(--color-text)',
                    border: `2px solid ${selectedSize === size ? 'var(--color-text)' : 'var(--color-border)'}`,
                    transition: 'all 0.2s ease'
                  }}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button 
              onClick={handleAddToCart}
              style={{
                flex: 1,
                padding: '1.2rem',
                backgroundColor: 'transparent',
                border: '2px solid var(--color-text)',
                color: 'var(--color-text)',
                fontWeight: 800,
                fontSize: '1.1rem',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => { e.currentTarget.style.backgroundColor = 'var(--color-text)'; e.currentTarget.style.color = 'var(--color-bg)'; }}
              onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--color-text)'; }}
            >
              <ShoppingCart size={20} /> Add To Cart
            </button>
            <button 
              onClick={handleBuyNow}
              className="btn-primary"
              style={{
                flex: 1,
                padding: '1.2rem',
                fontSize: '1.1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              Buy It Now
            </button>
          </div>

          {/* Perks */}
          <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid var(--color-border)', display: 'flex', flexDirection: 'column', gap: '1rem', color: '#888', fontWeight: 600, fontSize: '0.9rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--color-accent-gold)' }}></span>
              Free shipping on orders over ₹999
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--color-accent-gold)' }}></span>
              7-Day easy returns
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--color-accent-gold)' }}></span>
              100% Secure Checkout
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
