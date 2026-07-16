"use client";

import { useState, useRef } from "react";
import { Mail, MapPin, Phone, Paperclip, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function ContactUs() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError("File size must be less than 5MB");
        setFile(null);
      } else {
        setError("");
        setFile(selectedFile);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/contact");
      return;
    }

    if (!formData.name || !formData.email || !formData.message) {
      setError("Please fill out all required fields.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("email", formData.email);
      data.append("message", formData.message);
      if (file) {
        data.append("file", file);
      }

      const response = await fetch("/api/contact", {
        method: "POST",
        body: data,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to send message");
      }

      setSubmitted(true);
      setFormData({ name: "", email: "", message: "" });
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '1rem', border: '1px solid var(--color-border)', 
    borderRadius: '6px', backgroundColor: 'var(--color-bg)', color: 'var(--color-text)', 
    outline: 'none', fontSize: '0.95rem', transition: 'border-color 0.2s ease'
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 120px)', backgroundColor: 'var(--color-bg)', padding: '5rem 1.5rem' }}>
      <div className="container" style={{ maxWidth: '1000px', margin: '0 auto' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', fontWeight: 900, textTransform: 'uppercase', color: 'var(--color-text)', margin: 0, letterSpacing: '-1px' }}>
            Get In Touch
          </h1>
          <p style={{ color: '#888', fontSize: '1.1rem', marginTop: '1rem', maxWidth: '600px', margin: '1rem auto 0 auto' }}>
            Have a question about a product, your order, or just want to say what's up? We're here for it.
          </p>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '4rem', alignItems: 'start' }}>
          
          {/* LEFT: Contact Info Card */}
          <div style={{ backgroundColor: 'var(--color-secondary)', padding: '3rem', borderRadius: '12px', border: '1px solid var(--color-border)' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '2.5rem', color: 'var(--color-text)' }}>Contact Info</h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div style={{ display: 'flex', gap: '1.2rem', alignItems: 'flex-start' }}>
                <div style={{ width: '45px', height: '45px', borderRadius: '50%', backgroundColor: 'var(--color-text)', color: 'var(--color-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Mail size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 800, margin: '0 0 0.3rem 0', color: 'var(--color-text)' }}>Email Us</h3>
                  <a href="mailto:info.dripeon@gmail.com" style={{ color: '#666', textDecoration: 'none', fontSize: '0.95rem', fontWeight: 500, transition: 'color 0.2s ease' }}>info.dripeon@gmail.com</a>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1.2rem', alignItems: 'flex-start' }}>
                <div style={{ width: '45px', height: '45px', borderRadius: '50%', backgroundColor: 'var(--color-text)', color: 'var(--color-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <MapPin size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 800, margin: '0 0 0.3rem 0', color: 'var(--color-text)' }}>Headquarters</h3>
                  <p style={{ color: '#666', margin: 0, fontSize: '0.95rem', lineHeight: 1.5 }}>
                    Dripeon Outfits<br/>
                    Dhanbad, Jharkhand 828127
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1.2rem', alignItems: 'flex-start' }}>
                <div style={{ width: '45px', height: '45px', borderRadius: '50%', backgroundColor: 'var(--color-text)', color: 'var(--color-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Phone size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 800, margin: '0 0 0.3rem 0', color: 'var(--color-text)' }}>Contact Numbers</h3>
                  <p style={{ color: '#666', margin: 0, fontSize: '0.95rem', lineHeight: 1.5 }}>
                    <a href="tel:9279010494" style={{ color: '#666', textDecoration: 'none' }}>+91 9279010494</a><br/>
                    <a href="tel:9942800210" style={{ color: '#666', textDecoration: 'none' }}>+91 9942800210</a>
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1.2rem', alignItems: 'flex-start' }}>
                <div style={{ width: '45px', height: '45px', borderRadius: '50%', backgroundColor: 'var(--color-text)', color: 'var(--color-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                </div>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 800, margin: '0 0 0.3rem 0', color: 'var(--color-text)' }}>Working Hours</h3>
                  <p style={{ color: '#666', margin: 0, fontSize: '0.95rem', lineHeight: 1.5 }}>
                    Monday - Saturday<br/>
                    10:00 AM - 7:00 PM (IST)
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Contact Form */}
          <div>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              <div style={{ display: 'flex', gap: '1.5rem' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--color-text)' }}>Name</label>
                  <input type="text" required placeholder="John Doe" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={inputStyle} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--color-text)' }}>Email</label>
                  <input type="email" required placeholder="john@example.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} style={inputStyle} />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--color-text)' }}>Message</label>
                <textarea required rows={6} placeholder="How can we help you today?" value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} style={{ ...inputStyle, resize: 'vertical' }}></textarea>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--color-text)' }}>Attachment (Max 5MB)</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', padding: '0.6rem 1rem', border: '1px solid var(--color-border)', borderRadius: '6px', backgroundColor: 'var(--color-secondary)', color: 'var(--color-text)', fontSize: '0.9rem', fontWeight: 600, transition: 'all 0.2s' }}>
                    <Paperclip size={16} />
                    {file ? 'Change File' : 'Attach File'}
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} />
                  </label>
                  {file && (
                    <span style={{ fontSize: '0.85rem', color: '#666', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {file.name}
                      <button type="button" onClick={() => { setFile(null); if (fileInputRef.current) fileInputRef.current.value = ""; }} style={{ background: 'none', border: 'none', color: '#e53935', cursor: 'pointer', fontWeight: 700 }}>✕</button>
                    </span>
                  )}
                </div>
              </div>

              {error && (
                <div style={{ padding: '1rem', backgroundColor: '#ffebee', color: '#c62828', borderRadius: '6px', fontWeight: 700, fontSize: '0.95rem', border: '1px solid #ffcdd2' }}>
                  {error}
                </div>
              )}

              {submitted && (
                <div style={{ padding: '1rem', backgroundColor: '#e8f5e9', color: '#2e7d32', borderRadius: '6px', fontWeight: 700, fontSize: '0.95rem', border: '1px solid #c8e6c9', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                  Message sent successfully! We will get back to you shortly.
                </div>
              )}

              <button disabled={loading} type="submit" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', padding: '1.2rem', backgroundColor: 'var(--color-text)', color: 'var(--color-bg)', border: 'none', borderRadius: '6px', fontWeight: 800, cursor: loading ? 'not-allowed' : 'pointer', marginTop: '1rem', fontSize: '1rem', transition: 'opacity 0.2s ease', letterSpacing: '0.5px', opacity: loading ? 0.7 : 1 }}>
                {loading && <Loader2 size={18} className="spin" />}
                {loading ? 'SENDING...' : 'SEND MESSAGE'}
              </button>
            </form>
          </div>

        </div>
      </div>

      <style>{`
        @keyframes spin { 100% { transform: rotate(360deg); } }
        .spin { animation: spin 1s linear infinite; }
        @media (max-width: 768px) {
          .container > div:nth-child(2) {
            grid-template-columns: 1fr !important;
            gap: 3rem !important;
          }
          form > div:first-child {
            flex-direction: column;
            gap: 1.5rem !important;
          }
        }
      `}</style>
    </div>
  );
}
