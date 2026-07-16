export default function FAQ() {
  const faqs = [
    {
      q: "What is Dripeon's return policy?",
      a: "We accept returns within 14 days of delivery for unworn, unwashed items with original tags attached. Please check our Shipping & Returns page for full details."
    },
    {
      q: "How long does shipping take?",
      a: "Standard shipping typically takes 5-7 business days within India. Express shipping options are available at checkout."
    },
    {
      q: "Do you ship internationally?",
      a: "Currently, we only ship within India. We are working on expanding our logistics to support international shipping soon."
    },
    {
      q: "How do I care for my Dripeon apparel?",
      a: "We recommend washing all our garments inside out on a cold, gentle cycle. Hang dry to maintain the premium quality and fit. Avoid direct ironing on prints."
    },
    {
      q: "Can I change or cancel my order?",
      a: "Orders can only be modified or cancelled within 2 hours of placement. Once processed, we cannot make changes."
    }
  ];

  return (
    <div style={{ minHeight: '60vh', padding: '4rem 1.5rem', backgroundColor: 'var(--color-bg)' }}>
      <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, textTransform: 'uppercase', marginBottom: '2rem', color: 'var(--color-text)', textAlign: 'center' }}>
          Frequently Asked Questions
        </h1>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '3rem' }}>
          {faqs.map((faq, idx) => (
            <div key={idx} style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-text)', marginBottom: '0.8rem' }}>
                {faq.q}
              </h3>
              <p style={{ color: '#666', fontSize: '1rem', lineHeight: 1.6, margin: 0 }}>
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
