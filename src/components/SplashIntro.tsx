"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ==============================================
   DRIPEON — STREET STYLE SPLASH INTRO
   Full-screen animated intro on first visit.
   Shows once per session (sessionStorage).
   ============================================== */

export default function SplashIntro({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState(0);
  // Phase 0: Initial black screen
  // Phase 1: Glitch lines flash
  // Phase 2: Brand name reveals
  // Phase 3: Tagline appears
  // Phase 4: Exit animation

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 300),   // Glitch lines
      setTimeout(() => setPhase(2), 800),   // Brand reveal
      setTimeout(() => setPhase(3), 2200),  // Tagline
      setTimeout(() => setPhase(4), 3800),  // Start exit
      setTimeout(() => onComplete(), 4600), // Fully gone
    ];
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  // Allow skip on click
  const handleSkip = useCallback(() => {
    setPhase(4);
    setTimeout(() => onComplete(), 600);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {phase < 5 && (
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
            y: phase >= 4 ? "-100%" : "0%",
            transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] },
          }}
        >
          {/* Scan lines overlay */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.015) 2px, rgba(255,255,255,0.015) 4px)",
              zIndex: 1,
              pointerEvents: "none",
            }}
          />

          {/* Noise grain overlay */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              opacity: 0.04,
              zIndex: 1,
              pointerEvents: "none",
              background:
                "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
            }}
          />

          {/* Glitch horizontal lines */}
          {phase >= 1 && phase < 4 && (
            <>
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={`line-${i}`}
                  initial={{ scaleX: 0, opacity: 0 }}
                  animate={{
                    scaleX: [0, 1, 1, 0],
                    opacity: [0, 1, 0.6, 0],
                  }}
                  transition={{
                    duration: 0.5,
                    delay: i * 0.06,
                    ease: "easeOut",
                  }}
                  style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    top: `${15 + i * 13}%`,
                    height: "1px",
                    backgroundColor: "rgba(255,255,255,0.3)",
                    transformOrigin: "left",
                    zIndex: 2,
                  }}
                />
              ))}
            </>
          )}

          {/* Corner brackets */}
          {phase >= 2 && (
            <>
              {/* Top-left */}
              <motion.div
                initial={{ opacity: 0, scale: 1.5 }}
                animate={{ opacity: 0.3, scale: 1 }}
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
                initial={{ opacity: 0, scale: 1.5 }}
                animate={{ opacity: 0.3, scale: 1 }}
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
            {phase >= 2 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                style={{ position: "relative" }}
              >
                {/* Glitch ghost layers */}
                <motion.h1
                  animate={{
                    x: [0, -3, 5, -2, 0, 3, -5, 0],
                    opacity: [0.3, 0.5, 0.2, 0.4, 0.3],
                  }}
                  transition={{
                    duration: 0.3,
                    repeat: phase < 4 ? Infinity : 0,
                    repeatDelay: 2,
                  }}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    fontSize: "clamp(4rem, 15vw, 12rem)",
                    fontWeight: 900,
                    letterSpacing: "-0.03em",
                    color: "transparent",
                    WebkitTextStroke: "1px rgba(255,255,255,0.15)",
                    userSelect: "none",
                    whiteSpace: "nowrap",
                  }}
                >
                  DRIPEON
                </motion.h1>

                {/* Red glitch offset */}
                <motion.h1
                  animate={{
                    x: [0, 4, -6, 2, 0],
                    clipPath: [
                      "inset(0 0 80% 0)",
                      "inset(30% 0 50% 0)",
                      "inset(60% 0 10% 0)",
                      "inset(0 0 80% 0)",
                    ],
                  }}
                  transition={{
                    duration: 0.15,
                    repeat: phase < 4 ? Infinity : 0,
                    repeatDelay: 3,
                  }}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: "2px",
                    fontSize: "clamp(4rem, 15vw, 12rem)",
                    fontWeight: 900,
                    letterSpacing: "-0.03em",
                    color: "rgba(255,50,50,0.4)",
                    userSelect: "none",
                    whiteSpace: "nowrap",
                  }}
                >
                  DRIPEON
                </motion.h1>

                {/* Cyan glitch offset */}
                <motion.h1
                  animate={{
                    x: [0, -4, 6, -2, 0],
                    clipPath: [
                      "inset(70% 0 0 0)",
                      "inset(10% 0 60% 0)",
                      "inset(40% 0 30% 0)",
                      "inset(70% 0 0 0)",
                    ],
                  }}
                  transition={{
                    duration: 0.15,
                    repeat: phase < 4 ? Infinity : 0,
                    repeatDelay: 3.5,
                    delay: 0.05,
                  }}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: "-2px",
                    fontSize: "clamp(4rem, 15vw, 12rem)",
                    fontWeight: 900,
                    letterSpacing: "-0.03em",
                    color: "rgba(50,200,255,0.3)",
                    userSelect: "none",
                    whiteSpace: "nowrap",
                  }}
                >
                  DRIPEON
                </motion.h1>

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
            {phase >= 3 && (
              <motion.p
                initial={{ opacity: 0, y: 10, letterSpacing: "0.5em" }}
                animate={{ opacity: 0.6, y: 0, letterSpacing: "0.3em" }}
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
            {phase >= 3 && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.4, 0.4, 0] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: 0.5,
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
          {phase >= 2 && (
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{
                duration: 1.2,
                ease: [0.76, 0, 0.24, 1],
                delay: 0.3,
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
            animate={{ scaleX: phase >= 4 ? 1 : phase / 4 }}
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
