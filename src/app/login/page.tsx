"use client";

import Link from 'next/link';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [loginMethod, setLoginMethod] = useState<'password' | 'otp'>('password');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'email' | 'otp'>('email');
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        setError("Invalid email or password. Please try again.");
      } else {
        window.dispatchEvent(new CustomEvent('show-toast', { detail: { message: "Welcome Back!" } }));
        router.push('/');
        router.refresh();
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setStep('otp');
      } else {
        const data = await res.json();
        setError(data.message || 'Failed to send OTP');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await signIn('credentials', {
        redirect: false,
        email,
        otp,
      });

      if (res?.error) {
        setError("Invalid or expired OTP. Please check and try again.");
      } else {
        window.dispatchEvent(new CustomEvent('show-toast', { detail: { message: "Welcome Back!" } }));
        router.push('/');
        router.refresh();
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ minHeight: 'calc(100vh - 120px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ 
        width: '100%', 
        maxWidth: '450px', 
        padding: '3rem', 
        backgroundColor: 'var(--color-secondary)', 
        border: '1px solid var(--color-border)',
        boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
      }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '2rem', textAlign: 'center', lineHeight: 1 }}>
          WELCOME <br/><span style={{ color: 'var(--color-text)' }}>BACK</span>
        </h1>
        
        {error && <div style={{ color: 'red', marginBottom: '1rem', textAlign: 'center', fontWeight: 600 }}>{error}</div>}

        {/* PASSWORD LOGIN FORM */}
        {loginMethod === 'password' && (
          <form onSubmit={handlePasswordLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.8rem', fontWeight: 800, fontSize: '0.9rem', letterSpacing: '1px', textTransform: 'uppercase' }}>Email Address</label>
              <input 
                type="email" 
                placeholder="Enter your email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={inputStyle} 
                onFocus={(e) => e.target.style.borderColor = 'var(--color-text)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--color-border)'}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.8rem', fontWeight: 800, fontSize: '0.9rem', letterSpacing: '1px', textTransform: 'uppercase' }}>Password</label>
              <input 
                type="password" 
                placeholder="Enter your password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={inputStyle} 
                onFocus={(e) => e.target.style.borderColor = 'var(--color-text)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--color-border)'}
              />
            </div>
            
            <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', marginTop: '1.5rem', padding: '1.2rem', fontSize: '1.2rem', opacity: loading ? 0.7 : 1 }}>
              {loading ? 'LOGGING IN...' : 'LOGIN'}
            </button>

            <div style={{ display: 'flex', alignItems: 'center', margin: '1rem 0' }}>
              <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--color-border)' }}></div>
              <span style={{ padding: '0 1rem', color: '#888', fontWeight: 600, fontSize: '0.9rem' }}>OR</span>
              <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--color-border)' }}></div>
            </div>

            <button type="button" onClick={() => setLoginMethod('otp')} style={{ background: 'transparent', border: '2px solid var(--color-border)', padding: '1.2rem', fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-text)', cursor: 'pointer', transition: 'all 0.3s' }}>
              LOGIN WITH MAGIC LINK (OTP)
            </button>
          </form>
        )}

        {/* OTP LOGIN FORM */}
        {loginMethod === 'otp' && step === 'email' && (
          <form onSubmit={handleRequestOtp} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.8rem', fontWeight: 800, fontSize: '0.9rem', letterSpacing: '1px', textTransform: 'uppercase' }}>Email Address</label>
              <input 
                type="email" 
                placeholder="Enter your email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={inputStyle} 
                onFocus={(e) => e.target.style.borderColor = 'var(--color-text)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--color-border)'}
              />
            </div>
            
            <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', marginTop: '1.5rem', padding: '1.2rem', fontSize: '1.2rem', opacity: loading ? 0.7 : 1 }}>
              {loading ? 'SENDING OTP...' : 'GET MAGIC LINK OTP'}
            </button>

            <div style={{ display: 'flex', alignItems: 'center', margin: '1rem 0' }}>
              <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--color-border)' }}></div>
              <span style={{ padding: '0 1rem', color: '#888', fontWeight: 600, fontSize: '0.9rem' }}>OR</span>
              <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--color-border)' }}></div>
            </div>

            <button type="button" onClick={() => setLoginMethod('password')} style={{ background: 'transparent', border: '2px solid var(--color-border)', padding: '1.2rem', fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-text)', cursor: 'pointer', transition: 'all 0.3s' }}>
              LOGIN WITH PASSWORD
            </button>
          </form>
        )}

        {/* OTP VERIFICATION STEP */}
        {loginMethod === 'otp' && step === 'otp' && (
          <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
             <div>
              <label style={{ display: 'block', marginBottom: '0.8rem', fontWeight: 800, fontSize: '0.9rem', letterSpacing: '1px', textTransform: 'uppercase' }}>Enter 6-Digit OTP</label>
              <p style={{ fontSize: '0.85rem', color: '#888', marginBottom: '1rem' }}>Sent to {email}</p>
              <input 
                type="text" 
                placeholder="000000" 
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                maxLength={6}
                style={{ 
                  ...inputStyle,
                  fontSize: '1.5rem',
                  letterSpacing: '5px',
                  textAlign: 'center',
                }} 
                onFocus={(e) => e.target.style.borderColor = 'var(--color-text)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--color-border)'}
              />
            </div>
            
            <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', marginTop: '1.5rem', padding: '1.2rem', fontSize: '1.2rem', opacity: loading ? 0.7 : 1 }}>
              {loading ? 'VERIFYING...' : 'LOGIN'}
            </button>

            <button type="button" onClick={() => setStep('email')} style={{ background: 'none', border: 'none', color: '#888', textDecoration: 'underline', cursor: 'pointer', fontWeight: 600 }}>
              Use a different email
            </button>
          </form>
        )}

        <p style={{ marginTop: '2rem', textAlign: 'center', color: '#aaa', fontWeight: 500 }}>
          New to Dripeon? <Link href="/signup" style={{ color: 'var(--color-text)', fontWeight: 800, textDecoration: 'underline' }}>Create an account</Link>
        </p>
      </div>
    </div>
  );
}

const inputStyle = {
  width: '100%', 
  padding: '1rem', 
  backgroundColor: 'transparent',
  border: '2px solid var(--color-border)', 
  color: 'var(--color-text)',
  fontFamily: 'var(--font-sans)',
  fontWeight: 500,
  outline: 'none',
  transition: 'border-color 0.3s ease'
};
