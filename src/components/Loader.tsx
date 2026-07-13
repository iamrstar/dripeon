"use client";

import { motion } from "framer-motion";

export default function Loader() {
  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: 'calc(100vh - 120px)',
      width: '100%'
    }}>
      <motion.img
        src="/logo.jpeg"
        alt="Loading Dripeon..."
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.7, 1, 0.7]
        }}
        transition={{ 
          duration: 1.5, 
          repeat: Infinity,
          ease: "easeInOut" 
        }}
        style={{ height: '80px', width: 'auto', borderRadius: '4px' }}
      />
    </div>
  );
}
