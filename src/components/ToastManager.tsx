"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function ToastManager() {
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    const handleShowToast = (e: any) => {
      setToast(e.detail.message);
      setTimeout(() => {
        setToast(null);
      }, 4000);
    };

    window.addEventListener("show-toast", handleShowToast);
    return () => window.removeEventListener("show-toast", handleShowToast);
  }, []);

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          style={{
            position: "fixed",
            bottom: "2rem",
            right: "2rem",
            zIndex: 9999,
            backgroundColor: "var(--color-text)",
            color: "var(--color-bg)",
            padding: "1rem 2rem",
            borderRadius: "4px",
            fontWeight: 800,
            fontSize: "1.1rem",
            letterSpacing: "1px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
            display: "flex",
            alignItems: "center",
            gap: "1rem"
          }}
        >
          <span style={{ fontSize: "1.5rem" }}>🔥</span> {toast}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
