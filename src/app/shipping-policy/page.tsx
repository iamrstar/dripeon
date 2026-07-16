export default function ShippingPolicy() {
  return (
    <div style={{ minHeight: '60vh', padding: '4rem 1.5rem', backgroundColor: 'var(--color-bg)' }}>
      <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, textTransform: 'uppercase', marginBottom: '2rem', color: 'var(--color-text)' }}>
          Shipping & Returns
        </h1>
        
        <div style={{ color: '#555', fontSize: '1rem', lineHeight: 1.8, display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          <section>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-text)', marginBottom: '1rem', borderBottom: '2px solid var(--color-border)', paddingBottom: '0.5rem' }}>Shipping Policy</h2>
            <ul style={{ paddingLeft: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <li><strong>Processing Time:</strong> All orders are processed within 1-2 business days. Orders are not shipped or delivered on weekends or holidays.</li>
              <li><strong>Shipping Rates:</strong> We offer FREE standard shipping on all orders over ₹1000. For orders under ₹1000, a flat shipping rate of ₹100 applies.</li>
              <li><strong>Delivery Estimates:</strong> Standard shipping typically takes 5-7 business days across India.</li>
              <li><strong>Order Tracking:</strong> Once your order ships, you will receive an email with a tracking number and courier details.</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-text)', marginBottom: '1rem', borderBottom: '2px solid var(--color-border)', paddingBottom: '0.5rem' }}>Returns & Exchanges</h2>
            <ul style={{ paddingLeft: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <li><strong>Return Window:</strong> We accept returns within 14 days of delivery.</li>
              <li><strong>Condition:</strong> Items must be unworn, unwashed, and in original condition with all tags attached.</li>
              <li><strong>Process:</strong> To initiate a return, please contact us at info.dripeon@gmail.com with your order number.</li>
              <li><strong>Refunds:</strong> Once we receive and inspect your return, we will process the refund to your original method of payment within 5-7 business days.</li>
              <li><strong>Non-returnable Items:</strong> Accessories, innerwear, and final sale items cannot be returned or exchanged.</li>
            </ul>
          </section>

        </div>
      </div>
    </div>
  );
}
