export default function PrivacyPolicy() {
  return (
    <div style={{ minHeight: '60vh', padding: '4rem 1.5rem', backgroundColor: 'var(--color-bg)' }}>
      <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, textTransform: 'uppercase', marginBottom: '2rem', color: 'var(--color-text)' }}>
          Privacy Policy
        </h1>
        <div style={{ color: '#555', fontSize: '1rem', lineHeight: 1.8, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <p>
            At Dripeon, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you visit our website.
          </p>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-text)', marginTop: '1rem' }}>Information We Collect</h2>
          <p>
            We collect information you provide directly to us, such as when you create an account, place an order, or contact customer support. This may include your name, email address, shipping address, and payment information.
          </p>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-text)', marginTop: '1rem' }}>How We Use Your Information</h2>
          <p>
            We use the information we collect to process your transactions, communicate with you about your orders, improve our website, and send you promotional offers if you have opted in to our newsletter.
          </p>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-text)', marginTop: '1rem' }}>Data Security</h2>
          <p>
            We implement appropriate technical and organizational measures to protect your personal data against unauthorized or unlawful processing, accidental loss, destruction, or damage.
          </p>
          <p style={{ marginTop: '2rem', fontSize: '0.9rem', color: '#888' }}>
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
}
