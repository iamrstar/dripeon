import Link from 'next/link';

export default async function CategoryPage({ params }: { params: { category: string } }) {
  const { category } = await params;
  
  // Format category slug to Title Case (e.g. full-sleeve-tshirt -> Full Sleeve Tshirt)
  const categoryTitle = category.replace(/-/g, ' ').toUpperCase();

  // Mock Products Data
  const mockProducts = [
    { id: 1, name: `${categoryTitle} BASIC BLK`, price: '₹1,499', image: '/IMG_3031.jpeg' },
    { id: 2, name: `${categoryTitle} ESSENTIAL WHT`, price: '₹1,499', image: '/IMG_3033.jpeg' },
    { id: 3, name: `${categoryTitle} SIGNATURE GRY`, price: '₹1,799', image: '/IMG_3034.jpeg' },
    { id: 4, name: `${categoryTitle} VINTAGE WASH`, price: '₹1,999', image: '/IMG_3035.jpeg' },
    { id: 5, name: `${categoryTitle} GRAPHIC TEE`, price: '₹1,599', image: '/IMG_3031.jpeg' },
    { id: 6, name: `${categoryTitle} OVERSIZED FIT`, price: '₹1,899', image: '/IMG_3033.jpeg' },
  ];

  return (
    <div className="container" style={{ padding: '4rem 1.5rem', minHeight: '80vh' }}>
      <div style={{ marginBottom: '3rem', borderBottom: '2px solid var(--color-border)', paddingBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '0.5rem', fontWeight: 600 }}>HOME / COLLECTIONS / {categoryTitle}</p>
          <h1 style={{ fontSize: '3.5rem', margin: 0 }}>{categoryTitle}</h1>
        </div>
        <p style={{ fontWeight: 600 }}>{mockProducts.length} PRODUCTS</p>
      </div>

      <div className="product-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
        {mockProducts.map((product) => (
          <div key={product.id} className="product-card" style={{ display: 'flex', flexDirection: 'column' }}>
            <Link href={`/products/${product.id}`} style={{ display: 'block', position: 'relative', aspectRatio: '3/4', backgroundColor: 'var(--color-secondary)', overflow: 'hidden', marginBottom: '1rem' }}>
              <img 
                src={product.image} 
                alt={product.name} 
                style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }} 
                onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
              />
            </Link>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <Link href={`/products/${product.id}`}>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '0.2rem', fontFamily: 'var(--font-sans)', fontWeight: 800 }}>{product.name}</h3>
                </Link>
                <p style={{ color: 'var(--color-accent-red)', fontWeight: 700, fontSize: '1.1rem' }}>{product.price}</p>
              </div>
              
              <button 
                style={{ 
                  background: 'none', 
                  border: '1px solid var(--color-primary)', 
                  padding: '0.4rem 0.8rem', 
                  cursor: 'pointer',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  textTransform: 'uppercase'
                }}
                onMouseOver={(e) => { e.currentTarget.style.background = 'var(--color-primary)'; e.currentTarget.style.color = 'white'; }}
                onMouseOut={(e) => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--color-primary)'; }}
              >
                ADD
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
