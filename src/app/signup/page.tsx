"use client";

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'details' | 'otp'>('details');
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

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

  const handleVerifyOtpAndSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 1. Hit the signup API to verify OTP and create the user
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, otp }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Signup failed');
      }

      // 2. Automatically log them in with NextAuth using their password
      const loginRes = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (loginRes?.error) {
        setError("Invalid or expired OTP. Please check and try again.");
      } else {
        window.dispatchEvent(new CustomEvent('show-toast', { detail: { message: `Welcome to Dripeon, ${name}!` } }));
        router.push('/');
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.');
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
          JOIN <br/><span style={{ color: 'var(--color-text)' }}>DRIPEON</span>
        </h1>
        
        {error && <div style={{ color: 'red', marginBottom: '1rem', textAlign: 'center', fontWeight: 600 }}>{error}</div>}

        {step === 'details' ? (
          <form onSubmit={handleRequestOtp} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.8rem', fontWeight: 800, fontSize: '0.9rem', letterSpacing: '1px', textTransform: 'uppercase' }}>Full Name</label>
              <input 
                type="text" 
                placeholder="Enter your full name" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                style={inputStyle} 
                onFocus={(e) => e.target.style.borderColor = 'var(--color-text)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--color-border)'}
              />
            </div>
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
                placeholder="Create a password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={inputStyle} 
                onFocus={(e) => e.target.style.borderColor = 'var(--color-text)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--color-border)'}
              />
            </div>
            
            <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', marginTop: '1.5rem', padding: '1.2rem', fontSize: '1.2rem', opacity: loading ? 0.7 : 1 }}>
              {loading ? 'SENDING OTP...' : 'VERIFY EMAIL TO SIGNUP'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtpAndSignup} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
             <div>
              <label style={{ display: 'block', marginBottom: '0.8rem', fontWeight: 800, fontSize: '0.9rem', letterSpacing: '1px', textTransform: 'uppercase' }}>Enter 6-Digit OTP</label>
              <p style={{ fontSize: '0.85rem', color: '#888', marginBottom: '1rem' }}>Sent to {email} to verify your account.</p>
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
              {loading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
            </button>

            <button type="button" onClick={() => setStep('details')} style={{ background: 'none', border: 'none', color: '#888', textDecoration: 'underline', cursor: 'pointer', fontWeight: 600 }}>
              Back to details
            </button>
          </form>
        )}

        <p style={{ marginTop: '2rem', textAlign: 'center', color: '#aaa', fontWeight: 500 }}>
          Already have an account? <Link href="/login" style={{ color: 'var(--color-text)', fontWeight: 800, textDecoration: 'underline' }}>Sign in here</Link>
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
