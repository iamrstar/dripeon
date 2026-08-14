"use client";

import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function Loader() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted ? theme === 'dark' : true; // Default to dark visually for loader

  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: 'calc(100vh - 120px)',
      width: '100%',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{ position: 'relative', width: '200px', height: '60px' }}>
        
        {/* Cyan Glitch Layer */}
        <motion.img
          src="/dripeon-logo.png"
          alt="Loading..."
          animate={{
            x: [-4, 6, -2, 4, -4],
            y: [2, -2, 1, -1, 2],
            opacity: [0.2, 0.8, 0.3, 0.9, 0.2]
          }}
          transition={{
            duration: 0.2,
            repeat: Infinity,
            repeatType: "mirror"
          }}
          style={{ 
            position: 'absolute', 
            inset: 0, 
            width: '100%', 
            height: '100%', 
            objectFit: 'contain',
            filter: `drop-shadow(0 0 8px rgba(0, 255, 255, 0.8)) ${isDark ? 'invert(1)' : 'none'}`,
            mixBlendMode: isDark ? 'screen' : 'multiply'
          }}
        />

        {/* Red/Magenta Glitch Layer */}
        <motion.img
          src="/dripeon-logo.png"
          alt="Loading..."
          animate={{
            x: [4, -6, 2, -4, 4],
            y: [-2, 2, -1, 1, -2],
            opacity: [0.8, 0.2, 0.9, 0.3, 0.8]
          }}
          transition={{
            duration: 0.15,
            repeat: Infinity,
            repeatType: "mirror"
          }}
          style={{ 
            position: 'absolute', 
            inset: 0, 
            width: '100%', 
            height: '100%', 
            objectFit: 'contain',
            filter: `drop-shadow(0 0 8px rgba(255, 0, 100, 0.8)) ${isDark ? 'invert(1)' : 'none'}`,
            mixBlendMode: isDark ? 'screen' : 'multiply'
          }}
        />

        {/* Base Layer */}
        <motion.img
          src="/dripeon-logo.png"
          alt="Loading Dripeon..."
          animate={{ 
            scale: [1, 1.05, 1],
            filter: [
              `brightness(1) ${isDark ? 'invert(1)' : 'none'}`,
              `brightness(1.5) ${isDark ? 'invert(1)' : 'none'}`,
              `brightness(1) ${isDark ? 'invert(1)' : 'none'}`
            ]
          }}
          transition={{ 
            duration: 1.5, 
            repeat: Infinity,
            ease: "easeInOut" 
          }}
          style={{ 
            position: 'relative',
            width: '100%', 
            height: '100%', 
            objectFit: 'contain',
            zIndex: 10,
            filter: isDark ? 'invert(1)' : 'none'
          }}
        />
      </div>
      
      {/* Loading Scanline Overlay inside loader */}
      <motion.div
        animate={{ y: ["-100%", "200%"] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '300px',
          height: '4px',
          background: 'rgba(0, 255, 255, 0.6)',
          boxShadow: '0 0 10px rgba(0, 255, 255, 0.8)',
          zIndex: 20,
          pointerEvents: 'none'
        }}
      />
    </div>
  );
}
