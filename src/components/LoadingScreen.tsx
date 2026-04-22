import { useState, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";

const words = ["Develop", "Mentor", "Innovate", "IAZR"];

interface LoadingScreenProps {
  onComplete: () => void;
}

/* ── CSS-only premium loading screen — no WebGL, no Three.js ── */
const LoadingScreen = ({ onComplete }: LoadingScreenProps) => {
  const [count, setCount] = useState(0);
  const [wordIndex, setWordIndex] = useState(0);
  const duration = 1800; // Reduced from 2800ms → faster FCP

  const animate = useCallback(
    (startTime: number) => {
      const tick = (timestamp: number) => {
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1);
        setCount(Math.floor(progress * 100));
        if (progress < 1) {
          requestAnimationFrame(tick);
        } else {
          setTimeout(onComplete, 350);
        }
      };
      requestAnimationFrame(tick);
    },
    [onComplete]
  );

  useEffect(() => {
    const rafId = requestAnimationFrame((ts) => animate(ts));
    return () => cancelAnimationFrame(rafId);
  }, [animate]);

  useEffect(() => {
    const interval = setInterval(() => setWordIndex((i) => (i + 1) % words.length), 600);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      exit={{ opacity: 0, filter: "blur(8px)" }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      className="fixed inset-0 z-[9999] bg-[#0c0d10] flex flex-col justify-between overflow-hidden"
      aria-label="Cargando portafolio"
      role="status"
    >
      {/* ── CSS Particle field (no Three.js) ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        {/* Ambient glow orbs */}
        <div
          className="absolute w-[600px] h-[600px] rounded-full opacity-20"
          style={{
            background: "radial-gradient(circle, rgba(255,107,43,0.35) 0%, transparent 70%)",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
            animation: "loading-pulse 3s ease-in-out infinite",
          }}
        />
        <div
          className="absolute w-[300px] h-[300px] rounded-full opacity-10"
          style={{
            background: "radial-gradient(circle, rgba(245,158,11,0.4) 0%, transparent 70%)",
            top: "20%",
            left: "15%",
            animation: "loading-pulse 4s ease-in-out infinite reverse",
          }}
        />
        <div
          className="absolute w-[200px] h-[200px] rounded-full opacity-10"
          style={{
            background: "radial-gradient(circle, rgba(255,107,43,0.3) 0%, transparent 70%)",
            bottom: "25%",
            right: "10%",
            animation: "loading-pulse 3.5s ease-in-out 1s infinite",
          }}
        />

        {/* CSS dot grid */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: "radial-gradient(circle, #f0ede8 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* Floating lines */}
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute"
            style={{
              width: "1px",
              height: `${60 + i * 20}px`,
              background: "linear-gradient(to bottom, transparent, rgba(255,107,43,0.35), transparent)",
              left: `${12 + i * 16}%`,
              top: `${10 + (i % 3) * 30}%`,
              animation: `loading-stream ${2.5 + i * 0.4}s ease-in-out ${i * 0.3}s infinite`,
              opacity: 0.6,
            }}
          />
        ))}
      </div>

      {/* ── Top label ── */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="p-6 md:p-8 z-20 relative"
      >
        <span className="text-xs text-primary uppercase font-outfit tracking-[0.3em]">
          Portfolio 2026
        </span>
      </motion.div>

      {/* ── Center word ── */}
      <div className="flex-1 flex items-center justify-center z-20 relative">
        <AnimatePresence mode="wait">
          <motion.span
            key={wordIndex}
            initial={{ scale: 0.92, opacity: 0, y: 12 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 1.06, opacity: 0, y: -12 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className={`text-5xl md:text-7xl lg:text-8xl font-display italic text-foreground tracking-wider select-none ${
              words[wordIndex] === "IAZR"
                ? "font-outfit not-italic font-bold aurora-text"
                : ""
            }`}
          >
            {words[wordIndex]}
          </motion.span>
        </AnimatePresence>
      </div>

      {/* ── Counter ── */}
      <div className="p-6 md:p-8 flex flex-col items-end z-20 relative">
        <span className="text-5xl md:text-7xl lg:text-8xl font-outfit font-light text-foreground tabular-nums leading-none mb-4">
          {String(count).padStart(3, "0")}%
        </span>
      </div>

      {/* ── Progress bar ── */}
      <div className="h-[3px] bg-white/5 w-full z-20 relative">
        <div
          className="h-full bg-gradient-to-r from-primary via-amber-400 to-primary"
          style={{
            transform: `scaleX(${count / 100})`,
            transformOrigin: "left",
            boxShadow: "0 0 12px rgba(255,107,43,0.6)",
            transition: "transform 0.05s linear",
          }}
        />
      </div>

      <style>{`
        @keyframes loading-pulse {
          0%, 100% { transform: translate(-50%,-50%) scale(1); opacity: 0.2; }
          50% { transform: translate(-50%,-50%) scale(1.15); opacity: 0.35; }
        }
        @keyframes loading-stream {
          0% { transform: translateY(-20px); opacity: 0; }
          30% { opacity: 0.6; }
          70% { opacity: 0.6; }
          100% { transform: translateY(60px); opacity: 0; }
        }
      `}</style>
    </motion.div>
  );
};

export default LoadingScreen;
