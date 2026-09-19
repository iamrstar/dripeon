"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ==============================================
   DRIPEON — PREMIUM SPLASH INTRO
   Full-screen clean animated intro on first visit.
   Shows once per session (sessionStorage).
   ============================================== */

export default function SplashIntro({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState(0);
  // Phase 0: Initial dark screen
  // Phase 1: Brand reveal
  // Phase 2: Tagline appears
  // Phase 3: Smooth exit curtain

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 100),   // Brand reveal
      setTimeout(() => setPhase(2), 700),   // Tagline
      setTimeout(() => setPhase(3), 1400),  // Start exit curtain
      setTimeout(() => onComplete(), 1900), // Fully gone
    ];
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  // Allow skip on click
  const handleSkip = useCallback(() => {
    setPhase(3);
    setTimeout(() => onComplete(), 600);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {phase < 4 && (
        <motion.div
          onClick={handleSkip}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 99999,
            backgroundColor: "#000",
            cursor: "pointer",
            overflow: "hidden",
          }}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          animate={{
            y: phase >= 3 ? "-100%" : "0%",
            transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] },
          }}
        >
          {/* Subtle grain overlay */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              opacity: 0.03,
              zIndex: 1,
              pointerEvents: "none",
              background:
                "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
            }}
          />

          {/* Corner brackets */}
          {phase >= 1 && (
            <>
              {/* Top-left */}
              <motion.div
                initial={{ opacity: 0, scale: 1.3 }}
                animate={{ opacity: 0.35, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                style={{
                  position: "absolute",
                  top: "15%",
                  left: "10%",
                  width: "40px",
                  height: "40px",
                  borderTop: "2px solid rgba(255,255,255,0.3)",
                  borderLeft: "2px solid rgba(255,255,255,0.3)",
                  zIndex: 3,
                }}
              />
              {/* Bottom-right */}
              <motion.div
                initial={{ opacity: 0, scale: 1.3 }}
                animate={{ opacity: 0.35, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                style={{
                  position: "absolute",
                  bottom: "15%",
                  right: "10%",
                  width: "40px",
                  height: "40px",
                  borderBottom: "2px solid rgba(255,255,255,0.3)",
                  borderRight: "2px solid rgba(255,255,255,0.3)",
                  zIndex: 3,
                }}
              />
            </>
          )}

          {/* Main brand text — DRIPEON */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 5,
            }}
          >
            {phase >= 1 && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                style={{ position: "relative" }}
              >
                {/* Main text */}
                <motion.h1
                  initial={{ clipPath: "inset(0 100% 0 0)" }}
                  animate={{ clipPath: "inset(0 0% 0 0)" }}
                  transition={{
                    duration: 0.8,
                    ease: [0.76, 0, 0.24, 1],
                  }}
                  style={{
                    fontSize: "clamp(4rem, 15vw, 12rem)",
                    fontWeight: 900,
                    letterSpacing: "-0.03em",
                    color: "#fff",
                    userSelect: "none",
                    whiteSpace: "nowrap",
                    position: "relative",
                  }}
                >
                  DRIPEON
                </motion.h1>
              </motion.div>
            )}

            {/* Tagline */}
            {phase >= 2 && (
              <motion.p
                initial={{ opacity: 0, y: 10, letterSpacing: "0.5em" }}
                animate={{ opacity: 0.7, y: 0, letterSpacing: "0.3em" }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                style={{
                  color: "#fff",
                  fontSize: "clamp(0.7rem, 1.5vw, 0.95rem)",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  marginTop: "1.5rem",
                }}
              >
                DRIP STARTS HERE
              </motion.p>
            )}

            {/* Tap to enter hint */}
            {phase >= 2 && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.45, 0.45, 0] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: 0.3,
                }}
                style={{
                  position: "absolute",
                  bottom: "-120px",
                  color: "#fff",
                  fontSize: "0.65rem",
                  fontWeight: 500,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                }}
              >
                TAP ANYWHERE TO ENTER
              </motion.span>
            )}
          </div>

          {/* Horizontal accent line */}
          {phase >= 1 && (
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{
                duration: 1.2,
                ease: [0.76, 0, 0.24, 1],
                delay: 0.2,
              }}
              style={{
                position: "absolute",
                top: "50%",
                left: "5%",
                right: "5%",
                height: "1px",
                background:
                  "linear-gradient(90deg, transparent, rgba(255,255,255,0.08) 20%, rgba(255,255,255,0.08) 80%, transparent)",
                transformOrigin: "left",
                zIndex: 3,
                marginTop: "4rem",
              }}
            />
          )}

          {/* Loading progress bar at bottom */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: phase >= 3 ? 1 : phase / 3 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "2px",
              background:
                "linear-gradient(90deg, #fff, rgba(255,255,255,0.5))",
              transformOrigin: "left",
              zIndex: 10,
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
