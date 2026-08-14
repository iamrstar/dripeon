"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export default function SideGlitchBorders() {
  const [mounted, setMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    setMounted(true);
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 1.5 } }}
        >
      {/* =========================================
          LEFT ELECTRO SHOCK
      ========================================= */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '80px',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 9997,
        overflow: 'hidden',
      }} className="hidden xl:block">
        
        {/* Cyan Lightning Bolt */}
        <motion.svg width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 80 1000" style={{ position: 'absolute', left: 0 }}>
          <motion.path 
            d="M40 0 L60 100 L20 150 L70 250 L10 300 L50 450 L30 500 L60 650 L15 750 L50 850 L20 950 L40 1000" 
            fill="none" 
            stroke="rgba(0, 255, 255, 0.9)" 
            strokeWidth="3" 
            style={{ filter: 'drop-shadow(0 0 12px rgba(0, 255, 255, 1))' }}
            animate={{
              opacity: [0, 1, 0, 0, 0.8, 1, 0, 0],
              pathLength: [0, 1, 1, 0, 0, 1, 1, 0],
              x: [-10, 10, -5, 8, -2, 5, 0]
            }}
            transition={{
              duration: 0.9,
              repeat: Infinity,
              repeatType: "mirror",
              ease: "linear"
            }}
          />
        </motion.svg>

        {/* Magenta Lightning Bolt */}
        <motion.svg width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 80 1000" style={{ position: 'absolute', left: 0 }}>
          <motion.path 
            d="M40 0 L20 80 L60 180 L15 280 L70 380 L25 480 L55 580 L10 680 L65 780 L30 880 L60 980 L40 1000" 
            fill="none" 
            stroke="rgba(255, 0, 100, 0.9)" 
            strokeWidth="4" 
            style={{ filter: 'drop-shadow(0 0 15px rgba(255, 0, 100, 1))' }}
            animate={{
              opacity: [1, 0, 0, 1, 0, 0.5, 0, 1],
              pathLength: [1, 0, 0, 1, 1, 0, 0, 1],
              x: [10, -10, 5, -8, 2, -5, 0]
            }}
            transition={{
              duration: 0.7,
              repeat: Infinity,
              repeatType: "mirror",
              ease: "linear"
            }}
          />
        </motion.svg>

        {/* Heavy Glitch Blocks */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={`l-glitch-${i}`}
            style={{
              position: 'absolute',
              left: Math.random() * 30,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 50 + 10}px`,
              height: `${Math.random() * 8 + 2}px`,
              backgroundColor: i % 2 === 0 ? 'rgba(0, 255, 255, 0.9)' : 'rgba(255, 0, 100, 0.9)',
              boxShadow: i % 2 === 0 ? '0 0 20px rgba(0, 255, 255, 1)' : '0 0 20px rgba(255, 0, 100, 1)',
              mixBlendMode: 'screen'
            }}
            animate={{
              opacity: [0, 1, 0, 0.8, 0],
              x: [0, Math.random() * 40 - 20, 0],
              scaleY: [1, 4, 1]
            }}
            transition={{
              duration: Math.random() * 0.2 + 0.05,
              repeat: Infinity,
              repeatDelay: Math.random() * 1.5,
            }}
          />
        ))}
      </div>

      {/* =========================================
          RIGHT ELECTRO SHOCK
      ========================================= */}
      <div style={{
        position: 'fixed',
        top: 0,
        right: 0,
        width: '80px',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 9997,
        overflow: 'hidden',
      }} className="hidden xl:block">
        
        {/* Cyan Lightning Bolt */}
        <motion.svg width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 80 1000" style={{ position: 'absolute', right: 0 }}>
          <motion.path 
            d="M40 0 L20 100 L60 150 L10 250 L70 300 L30 450 L50 500 L20 650 L65 750 L30 850 L60 950 L40 1000" 
            fill="none" 
            stroke="rgba(0, 255, 255, 0.9)" 
            strokeWidth="3" 
            style={{ filter: 'drop-shadow(0 0 12px rgba(0, 255, 255, 1))' }}
            animate={{
              opacity: [0, 1, 0, 0, 0.8, 1, 0, 0],
              pathLength: [0, 1, 1, 0, 0, 1, 1, 0],
              x: [10, -10, 5, -8, 2, -5, 0]
            }}
            transition={{
              duration: 0.85,
              repeat: Infinity,
              repeatType: "mirror",
              ease: "linear"
            }}
          />
        </motion.svg>

        {/* Magenta Lightning Bolt */}
        <motion.svg width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 80 1000" style={{ position: 'absolute', right: 0 }}>
          <motion.path 
            d="M40 0 L60 80 L20 180 L65 280 L10 380 L55 480 L25 580 L70 680 L15 780 L50 880 L20 980 L40 1000" 
            fill="none" 
            stroke="rgba(255, 0, 100, 0.9)" 
            strokeWidth="4" 
            style={{ filter: 'drop-shadow(0 0 15px rgba(255, 0, 100, 1))' }}
            animate={{
              opacity: [1, 0, 0, 1, 0, 0.5, 0, 1],
              pathLength: [1, 0, 0, 1, 1, 0, 0, 1],
              x: [-10, 10, -5, 8, -2, 5, 0]
            }}
            transition={{
              duration: 0.75,
              repeat: Infinity,
              repeatType: "mirror",
              ease: "linear"
            }}
          />
        </motion.svg>

        {/* Heavy Glitch Blocks */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={`r-glitch-${i}`}
            style={{
              position: 'absolute',
              right: Math.random() * 30,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 50 + 10}px`,
              height: `${Math.random() * 8 + 2}px`,
              backgroundColor: i % 2 === 0 ? 'rgba(0, 255, 255, 0.9)' : 'rgba(255, 0, 100, 0.9)',
              boxShadow: i % 2 === 0 ? '0 0 20px rgba(0, 255, 255, 1)' : '0 0 20px rgba(255, 0, 100, 1)',
              mixBlendMode: 'screen'
            }}
            animate={{
              opacity: [0, 1, 0, 0.8, 0],
              x: [0, Math.random() * 40 - 20, 0],
              scaleY: [1, 4, 1]
            }}
            transition={{
              duration: Math.random() * 0.2 + 0.05,
              repeat: Infinity,
              repeatDelay: Math.random() * 1.5,
            }}
          />
        ))}
      </div>

      {/* =========================================
          MOBILE GRAFFITI GLITCH EFFECT (Phone Only)
      ========================================= */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 9996,
        overflow: 'hidden',
      }} className="block xl:hidden">
        
        {/* Graffiti Text 1 (Cyan) */}
        <motion.div
          style={{
            position: 'absolute',
            top: '25%',
            left: '-40px',
            transform: 'rotate(-90deg)',
            fontFamily: '"Impact", "Arial Black", sans-serif',
            fontStyle: 'italic',
            fontSize: '2.5rem',
            color: 'transparent',
            WebkitTextStroke: '2px rgba(0, 255, 255, 0.9)',
            whiteSpace: 'nowrap',
            mixBlendMode: 'screen',
            filter: 'drop-shadow(0 0 8px rgba(0, 255, 255, 0.6))'
          }}
          animate={{
            opacity: [0, 1, 0, 0.6, 0],
            x: [-10, 5, -2, 0],
            scale: [1, 1.05, 1]
          }}
          transition={{ duration: 0.8, repeat: Infinity, repeatDelay: 1.2 }}
        >
          STREET
        </motion.div>

        {/* Graffiti Text 2 (Magenta) */}
        <motion.div
          style={{
            position: 'absolute',
            bottom: '25%',
            right: '-50px',
            transform: 'rotate(90deg)',
            fontFamily: '"Impact", "Arial Black", sans-serif',
            fontStyle: 'italic',
            fontSize: '2.8rem',
            color: 'transparent',
            WebkitTextStroke: '2px rgba(255, 0, 100, 0.9)',
            whiteSpace: 'nowrap',
            mixBlendMode: 'screen',
            filter: 'drop-shadow(0 0 8px rgba(255, 0, 100, 0.6))'
          }}
          animate={{
            opacity: [0, 1, 0, 0.8, 0],
            x: [10, -5, 2, 0],
            scale: [1, 1.05, 1]
          }}
          transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 1.8 }}
        >
          CULTURE
        </motion.div>

        {/* Thin Edge Scanners for Mobile */}
        <motion.div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '3px',
            height: '30vh',
            background: 'linear-gradient(to bottom, transparent, rgba(0,255,255,1), transparent)',
            boxShadow: '0 0 10px rgba(0,255,255,0.8)'
          }}
          animate={{ y: ['-30vh', '130vh'] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '3px',
            height: '30vh',
            background: 'linear-gradient(to top, transparent, rgba(255,0,100,1), transparent)',
            boxShadow: '0 0 10px rgba(255,0,100,0.8)'
          }}
          animate={{ y: ['130vh', '-30vh'] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        />
      </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
