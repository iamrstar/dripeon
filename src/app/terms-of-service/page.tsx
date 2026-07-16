export default function TermsOfService() {
  return (
    <div style={{ minHeight: '60vh', padding: '4rem 1.5rem', backgroundColor: 'var(--color-bg)' }}>
      <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, textTransform: 'uppercase', marginBottom: '2rem', color: 'var(--color-text)' }}>
          Terms of Service
        </h1>
        <div style={{ color: '#555', fontSize: '1rem', lineHeight: 1.8, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <p>
            Welcome to Dripeon! By accessing or using our website, you agree to be bound by these Terms of Service. Please read them carefully before using our platform.
          </p>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-text)', marginTop: '1rem' }}>User Accounts</h2>
          <p>
            When you create an account with us, you must provide accurate, complete, and current information. You are responsible for safeguarding the password that you use to access the service and for any activities or actions under your password.
          </p>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-text)', marginTop: '1rem' }}>Purchases and Payment</h2>
          <p>
            We accept various payment methods. By providing a payment method, you represent and warrant that you are authorized to use the designated payment method. We reserve the right to refuse or cancel any order at our discretion.
          </p>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-text)', marginTop: '1rem' }}>Intellectual Property</h2>
          <p>
            The service and its original content, features, and functionality are and will remain the exclusive property of Dripeon and its licensors. The service is protected by copyright, trademark, and other laws.
          </p>
          <p style={{ marginTop: '2rem', fontSize: '0.9rem', color: '#888' }}>
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
}
