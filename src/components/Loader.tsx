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
        {/* Clean Pulsing Base Layer */}
        <motion.img
          src="/dripeon-logo.png"
          alt="Loading Dripeon..."
          animate={{ 
            scale: [1, 1.04, 1],
            opacity: [0.7, 1, 0.7]
          }}
          transition={{ 
            duration: 1.6, 
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
    </div>
  );
}
