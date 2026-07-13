"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ComingSoonOverlay() {
  const [isOpen, setIsOpen] = useState(true);
  const [timeLeft, setTimeLeft] = useState({ days: 10, hours: 0, minutes: 0, seconds: 0 });
  const [pulse, setPulse] = useState(false);
  const [flicker, setFlicker] = useState(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'auto'; };
  }, []);

  // Random flicker effect
  useEffect(() => {
    const flickerInterval = setInterval(() => {
      setFlicker(true);
      setTimeout(() => setFlicker(false), 80 + Math.random() * 120);
    }, 3000 + Math.random() * 4000);
    return () => clearInterval(flickerInterval);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const targetDate = new Date().getTime() + (10 * 24 * 60 * 60 * 1000);
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;
      if (distance < 0) {
        clearInterval(interval);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      setPulse(p => !p);
      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen]);

  const topPanel = {
    hidden: { y: '-100%' },
    visible: { y: '0%', transition: { duration: 0.9, ease: [0.76, 0, 0.24, 1] } },
  };
  const bottomPanel = {
    hidden: { y: '100%' },
    visible: { y: '0%', transition: { duration: 0.9, ease: [0.76, 0, 0.24, 1] } },
  };
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: (i: number) => ({
      opacity: 1, y: 0,
      transition: { duration: 0.7, delay: 0.8 + i * 0.15, ease: [0.33, 1, 0.68, 1] }
    }),
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          overflow: 'hidden', background: '#fff',
        }}>
          <style>{`
            @keyframes grain {
              0%, 100% { transform: translate(0, 0); }
              10% { transform: translate(-5%, -10%); }
              20% { transform: translate(-15%, 5%); }
              30% { transform: translate(7%, -25%); }
              40% { transform: translate(-5%, 25%); }
              50% { transform: translate(-15%, 10%); }
              60% { transform: translate(15%, 0%); }
              70% { transform: translate(0%, 15%); }
              80% { transform: translate(3%, 35%); }
              90% { transform: translate(-10%, 10%); }
            }

            @keyframes heavyGlitch {
              0% { clip-path: inset(0 0 0 0); transform: translate(0); }
              2% { clip-path: inset(80% 0 0 0); transform: translate(-8px, 0); filter: hue-rotate(90deg); }
              4% { clip-path: inset(10% 0 85% 0); transform: translate(8px, 0); filter: hue-rotate(180deg); }
              5% { clip-path: inset(40% 0 40% 0); transform: translate(-5px, 2px); filter: hue-rotate(0deg); }
              6% { clip-path: inset(0 0 0 0); transform: translate(0); filter: none; }
              20% { clip-path: inset(0 0 0 0); transform: translate(0); filter: none; }
              21% { clip-path: inset(65% 0 0 0); transform: translate(6px, 0); filter: hue-rotate(270deg); }
              22% { clip-path: inset(0 0 70% 0); transform: translate(-6px, 0); }
              23% { clip-path: inset(0 0 0 0); transform: translate(0); filter: none; }
              50% { clip-path: inset(0 0 0 0); transform: translate(0); filter: none; }
              51% { clip-path: inset(30% 0 30% 0); transform: translate(10px, -2px) skewX(-2deg); }
              52% { clip-path: inset(50% 0 20% 0); transform: translate(-10px, 2px) skewX(2deg); }
              53% { clip-path: inset(0 0 0 0); transform: translate(0) skewX(0); filter: none; }
              100% { clip-path: inset(0 0 0 0); transform: translate(0); filter: none; }
            }

            @keyframes glitchShift1 {
              0%, 100% { clip-path: inset(0 0 0 0); transform: translate(0); opacity: 0; }
              3% { clip-path: inset(20% 0 60% 0); transform: translate(-6px, 0); opacity: 0.8; }
              6% { clip-path: inset(70% 0 10% 0); transform: translate(6px, 0); opacity: 0.8; }
              9% { clip-path: inset(0 0 0 0); transform: translate(0); opacity: 0; }
              50% { opacity: 0; }
              52% { clip-path: inset(45% 0 30% 0); transform: translate(-4px, -1px); opacity: 0.6; }
              55% { clip-path: inset(0 0 0 0); transform: translate(0); opacity: 0; }
            }

            @keyframes glitchShift2 {
              0%, 100% { clip-path: inset(0 0 0 0); transform: translate(0); opacity: 0; }
              4% { clip-path: inset(50% 0 20% 0); transform: translate(5px, 0); opacity: 0.7; }
              7% { clip-path: inset(10% 0 70% 0); transform: translate(-5px, 0); opacity: 0.7; }
              10% { clip-path: inset(0 0 0 0); transform: translate(0); opacity: 0; }
              70% { opacity: 0; }
              72% { clip-path: inset(60% 0 15% 0); transform: translate(7px, 2px); opacity: 0.5; }
              75% { clip-path: inset(0 0 0 0); transform: translate(0); opacity: 0; }
            }

            @keyframes electricPulse {
              0%, 100% { box-shadow: 0 0 0px rgba(0,150,255,0), 0 8px 30px rgba(0,0,0,0.2); }
              25% { box-shadow: 0 0 15px rgba(0,150,255,0.3), 0 0 30px rgba(0,150,255,0.1), 0 8px 30px rgba(0,0,0,0.2); }
              50% { box-shadow: 0 0 5px rgba(0,150,255,0.1), 0 8px 30px rgba(0,0,0,0.2); }
              75% { box-shadow: 0 0 20px rgba(0,150,255,0.4), 0 0 40px rgba(0,150,255,0.15), 0 8px 30px rgba(0,0,0,0.2); }
            }

            @keyframes scanline {
              0% { top: -10%; }
              100% { top: 110%; }
            }

            @keyframes ticker {
              0% { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }

            @keyframes breathe {
              0%, 100% { opacity: 0.03; }
              50% { opacity: 0.06; }
            }

            @keyframes float {
              0%, 100% { transform: translateY(0px) rotate(0deg); }
              50% { transform: translateY(-12px) rotate(2deg); }
            }

            @keyframes electricArc {
              0% { opacity: 0; d: path('M0,50 Q25,20 50,50 T100,50'); }
              10% { opacity: 1; }
              20% { opacity: 0; }
              40% { opacity: 0.8; }
              50% { opacity: 0; }
              100% { opacity: 0; }
            }

            @keyframes borderGlitch {
              0%, 100% { border-color: rgba(0,150,255,0); }
              10% { border-color: rgba(0,150,255,0.5); }
              12% { border-color: rgba(255,0,100,0.3); }
              14% { border-color: rgba(0,150,255,0); }
              50% { border-color: rgba(0,150,255,0); }
              60% { border-color: rgba(0,255,150,0.3); }
              62% { border-color: rgba(0,150,255,0); }
            }

            @keyframes rgbSplit {
              0%, 100% { text-shadow: 0 0 0 transparent; }
              15% { text-shadow: -2px 0 #ff0040, 2px 0 #00d4ff; }
              16% { text-shadow: 3px 0 #ff0040, -3px 0 #00d4ff; }
              17% { text-shadow: 0 0 0 transparent; }
              65% { text-shadow: 0 0 0 transparent; }
              66% { text-shadow: -1px 1px #ff0040, 1px -1px #00d4ff; }
              68% { text-shadow: 0 0 0 transparent; }
            }
          `}</style>

          {/* Film grain */}
          <div style={{
            position: 'absolute', inset: '-50%', zIndex: 3,
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E")`,
            animation: 'grain 0.5s steps(6) infinite',
            pointerEvents: 'none', opacity: 0.5,
          }} />

          {/* Scanline */}
          <div style={{
            position: 'absolute', left: 0, width: '100%',
            height: '2px', background: 'rgba(0,150,255,0.08)',
            zIndex: 4, pointerEvents: 'none',
            animation: 'scanline 3s linear infinite',
            boxShadow: '0 0 10px rgba(0,150,255,0.1)',
          }} />

          {/* Diagonal street stripes */}
          <div style={{
            position: 'absolute', inset: 0, zIndex: 0,
            backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 60px, rgba(0,0,0,0.015) 60px, rgba(0,0,0,0.015) 61px)',
            animation: 'breathe 4s ease-in-out infinite',
            pointerEvents: 'none',
          }} />

          {/* Electric flicker overlay */}
          <div style={{
            position: 'absolute', inset: 0, zIndex: 3,
            background: flicker ? 'rgba(0,150,255,0.02)' : 'transparent',
            pointerEvents: 'none',
            transition: 'background 0.05s',
          }} />

          {/* Top Shutter */}
          <motion.div variants={topPanel} initial="hidden" animate="visible"
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '50vh', background: '#ffffff', zIndex: 1 }}
          />
          {/* Bottom Shutter */}
          <motion.div variants={bottomPanel} initial="hidden" animate="visible"
            style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '50vh', background: '#ffffff', zIndex: 1 }}
          />

          {/* Top ticker */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.8 }}
            style={{
              position: 'absolute', top: 0, left: 0, width: '100%',
              overflow: 'hidden', zIndex: 5,
              borderBottom: '1px solid #eee',
              background: '#111', padding: '10px 0',
            }}
          >
            <div style={{
              display: 'flex', whiteSpace: 'nowrap',
              animation: 'ticker 20s linear infinite',
            }}>
              {[...Array(10)].map((_, i) => (
                <span key={i} style={{
                  fontSize: '0.7rem', fontWeight: 700, letterSpacing: '4px',
                  color: '#fff', textTransform: 'uppercase', marginRight: '4rem',
                  fontFamily: 'var(--font-display)',
                }}>
                  ★ COMING SOON &nbsp;&nbsp; ★ EXCLUSIVE DROP &nbsp;&nbsp; ★ DRIPEON &nbsp;&nbsp; ★ STREET CULTURE &nbsp;&nbsp; ★ DRIP STARTS HERE &nbsp;&nbsp;
                </span>
              ))}
            </div>
          </motion.div>

          {/* Bottom ticker */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.8 }}
            style={{
              position: 'absolute', bottom: 0, left: 0, width: '100%',
              overflow: 'hidden', zIndex: 5,
              borderTop: '1px solid #eee',
              background: '#111', padding: '10px 0',
            }}
          >
            <div style={{
              display: 'flex', whiteSpace: 'nowrap',
              animation: 'ticker 25s linear infinite',
              direction: 'rtl',
            }}>
              {[...Array(10)].map((_, i) => (
                <span key={i} style={{
                  fontSize: '0.7rem', fontWeight: 700, letterSpacing: '4px',
                  color: '#fff', textTransform: 'uppercase', marginRight: '4rem',
                  fontFamily: 'var(--font-display)', direction: 'ltr',
                }}>
                  ★ LIMITED EDITION &nbsp;&nbsp; ★ STREETWEAR &nbsp;&nbsp; ★ DRIPEON 2026 &nbsp;&nbsp; ★ DON'T MISS OUT &nbsp;&nbsp; ★ THE DRIP IS REAL &nbsp;&nbsp;
                </span>
              ))}
            </div>
          </motion.div>

          {/* Main Content */}
          <div style={{
            position: 'relative', zIndex: 10,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', textAlign: 'center',
            padding: '2rem', width: '100%', maxWidth: '900px',
          }}>

            {/* Logo */}
            <motion.div
              custom={0} variants={fadeUp} initial="hidden" animate="visible"
              style={{ marginBottom: '2.5rem', animation: 'float 6s ease-in-out infinite' }}
            >
              <img
                src="/logo.jpeg"
                alt="Dripeon"
                style={{
                  height: '110px', width: 'auto',
                  borderRadius: '14px',
                  boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
                }}
              />
            </motion.div>

            {/* COMING SOON with heavy glitch + RGB split */}
            <motion.div
              custom={1} variants={fadeUp} initial="hidden" animate="visible"
              style={{ position: 'relative', marginBottom: '1rem' }}
            >
              {/* Base text with RGB split */}
              <h1 style={{
                fontSize: 'clamp(2.5rem, 7vw, 5.5rem)',
                fontWeight: 900,
                letterSpacing: 'clamp(3px, 1.5vw, 12px)',
                textTransform: 'uppercase',
                fontFamily: 'var(--font-display)',
                color: '#111',
                lineHeight: 1.1,
                animation: 'rgbSplit 4s infinite',
              }}>
                COMING SOON
              </h1>

              {/* Glitch layer — red channel */}
              <h1 aria-hidden="true" style={{
                position: 'absolute', top: 0, left: 0, width: '100%',
                fontSize: 'clamp(2.5rem, 7vw, 5.5rem)',
                fontWeight: 900,
                letterSpacing: 'clamp(3px, 1.5vw, 12px)',
                textTransform: 'uppercase',
                fontFamily: 'var(--font-display)',
                color: '#ff0040',
                lineHeight: 1.1,
                animation: 'glitchShift1 4s infinite',
                mixBlendMode: 'multiply',
              }}>
                COMING SOON
              </h1>

              {/* Glitch layer — cyan channel */}
              <h1 aria-hidden="true" style={{
                position: 'absolute', top: 0, left: 0, width: '100%',
                fontSize: 'clamp(2.5rem, 7vw, 5.5rem)',
                fontWeight: 900,
                letterSpacing: 'clamp(3px, 1.5vw, 12px)',
                textTransform: 'uppercase',
                fontFamily: 'var(--font-display)',
                color: '#00d4ff',
                lineHeight: 1.1,
                animation: 'glitchShift2 4s infinite',
                mixBlendMode: 'multiply',
              }}>
                COMING SOON
              </h1>

              {/* Heavy distortion layer */}
              <h1 aria-hidden="true" style={{
                position: 'absolute', top: 0, left: 0, width: '100%',
                fontSize: 'clamp(2.5rem, 7vw, 5.5rem)',
                fontWeight: 900,
                letterSpacing: 'clamp(3px, 1.5vw, 12px)',
                textTransform: 'uppercase',
                fontFamily: 'var(--font-display)',
                color: '#111',
                lineHeight: 1.1,
                animation: 'heavyGlitch 5s infinite',
                opacity: 0.15,
              }}>
                COMING SOON
              </h1>
            </motion.div>

            {/* Tagline */}
            <motion.p
              custom={2} variants={fadeUp} initial="hidden" animate="visible"
              style={{
                fontSize: 'clamp(0.7rem, 1.3vw, 0.95rem)',
                color: '#aaa', marginBottom: '3.5rem',
                letterSpacing: '5px', textTransform: 'uppercase', fontWeight: 500,
              }}
            >
              SOMETHING EXCLUSIVE IS DROPPING SOON
            </motion.p>

            {/* Countdown */}
            <motion.div
              custom={3} variants={fadeUp} initial="hidden" animate="visible"
              style={{
                display: 'flex',
                gap: 'clamp(0.4rem, 1.5vw, 1rem)',
                alignItems: 'center', justifyContent: 'center',
              }}
            >
              <TimeBox value={timeLeft.days} label="DAYS" />
              <Separator />
              <TimeBox value={timeLeft.hours} label="HOURS" />
              <Separator />
              <TimeBox value={timeLeft.minutes} label="MINS" />
              <Separator />
              <TimeBox value={timeLeft.seconds} label="SECS" accent pulse={pulse} />
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}

function TimeBox({ value, label, accent = false, pulse = false }: { value: number; label: string; accent?: boolean; pulse?: boolean }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.7rem' }}>
      <motion.div
        animate={accent ? { scale: pulse ? 1.05 : 1 } : {}}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        style={{
          width: 'clamp(65px, 13vw, 115px)',
          height: 'clamp(75px, 15vw, 125px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          borderRadius: '12px',
          background: accent ? '#111' : '#fafafa',
          border: accent ? '2px solid transparent' : '1px solid #eee',
          boxShadow: accent ? '0 8px 30px rgba(0,0,0,0.2)' : '0 2px 15px rgba(0,0,0,0.04)',
          position: 'relative', overflow: 'hidden',
          animation: accent ? 'electricPulse 2s ease-in-out infinite, borderGlitch 5s infinite' : 'none',
        }}
      >
        {/* Electric shine sweep */}
        {accent && (
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(105deg, transparent 30%, rgba(0,150,255,0.08) 45%, rgba(0,200,255,0.15) 50%, rgba(0,150,255,0.08) 55%, transparent 70%)',
            pointerEvents: 'none',
          }} />
        )}
        <span style={{
          fontSize: 'clamp(1.8rem, 4.5vw, 3rem)',
          fontWeight: 900, fontFamily: 'var(--font-display)',
          color: accent ? '#fff' : '#111',
          position: 'relative', zIndex: 1,
          textShadow: accent ? '0 0 10px rgba(0,150,255,0.3)' : 'none',
        }}>
          {value.toString().padStart(2, '0')}
        </span>
      </motion.div>
      <span style={{
        fontSize: '0.6rem', fontWeight: 700, letterSpacing: '3px',
        color: accent ? '#111' : '#ccc',
      }}>
        {label}
      </span>
    </div>
  );
}

function Separator() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', paddingBottom: '1.8rem' }}>
      <div style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: '#ddd' }} />
      <div style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: '#ddd' }} />
    </div>
  );
}
