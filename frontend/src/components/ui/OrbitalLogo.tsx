import { motion } from "framer-motion";

/**
 * OrbitalLogo — Espacial Minimalista
 * ────────────────────────────────────────────────────────────────
 * SVG animado: dos anillos orbitales concéntricos + un punto luminoso
 * (moon) trazando órbita. Paleta moon (#C7D2FE) + cosmic violet.
 *
 * Reutilizable: Navbar (size 32) y Hero (size 96+).
 */
interface OrbitalLogoProps {
  size?: number;
  interactive?: boolean;
  className?: string;
}

const OrbitalLogo = ({ size = 32, interactive = true, className = "" }: OrbitalLogoProps) => {
  const id = `orbital-${Math.random().toString(36).slice(2, 8)}`;

  return (
    <motion.div
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
      whileHover={interactive ? { scale: 1.06 } : undefined}
      transition={{ type: "spring", stiffness: 300, damping: 18 }}
      aria-label="IAZR · Iván Zuñiga"
    >
      <svg
        viewBox="0 0 64 64"
        width={size}
        height={size}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="overflow-visible"
      >
        {/* ── Glows ── */}
        <defs>
          <radialGradient id={`${id}-core`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#C7D2FE" stopOpacity="0.95" />
            <stop offset="55%" stopColor="#7C66FF" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#1A1D2E" stopOpacity="0" />
          </radialGradient>
          <linearGradient id={`${id}-ring`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#C7D2FE" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#7C66FF" stopOpacity="0.35" />
          </linearGradient>
        </defs>

        {/* ── Outer halo ── */}
        <circle cx="32" cy="32" r="30" fill="none"
          stroke="rgba(199,210,254,0.06)" strokeWidth="0.6" />

        {/* ── Outer orbital ring (rotates clockwise) ── */}
        <motion.g
          style={{ originX: "32px", originY: "32px" }}
          animate={{ rotate: 360 }}
          transition={{ duration: 9, ease: "linear", repeat: Infinity }}
        >
          <ellipse cx="32" cy="32" rx="26" ry="9"
            fill="none"
            stroke={`url(#${id}-ring)`}
            strokeWidth="1.2"
            strokeDasharray="78 30"
          />
          {/* Moon dot orbiting on this ring */}
          <circle cx="58" cy="32" r="2.6" fill="#C7D2FE">
            <animate
              attributeName="opacity"
              values="1;0.55;1"
              dur="2.4s"
              repeatCount="indefinite"
            />
          </circle>
        </motion.g>

        {/* ── Inner orbital ring (rotates counter, tilted) ── */}
        <motion.g
          style={{ originX: "32px", originY: "32px" }}
          animate={{ rotate: -360 }}
          transition={{ duration: 14, ease: "linear", repeat: Infinity }}
        >
          <ellipse cx="32" cy="32" rx="20" ry="7"
            transform="rotate(60 32 32)"
            fill="none"
            stroke="rgba(199,210,254,0.45)"
            strokeWidth="0.9"
            strokeDasharray="50 18"
          />
        </motion.g>

        {/* ── Core nucleus ── */}
        <circle cx="32" cy="32" r="5.5" fill={`url(#${id}-core)`} />
        <circle cx="32" cy="32" r="2.2" fill="#FFFFFF">
          <animate
            attributeName="r"
            values="2;2.6;2"
            dur="3s"
            repeatCount="indefinite"
          />
        </circle>
      </svg>

      {/* Soft outer glow on hover */}
      {interactive && (
        <div
          className="absolute inset-0 rounded-full opacity-0 transition-opacity duration-300 pointer-events-none group-hover:opacity-100"
          style={{
            background: "radial-gradient(circle, rgba(199,210,254,0.25) 0%, transparent 65%)",
            filter: "blur(8px)",
          }}
        />
      )}
    </motion.div>
  );
};

export default OrbitalLogo;
