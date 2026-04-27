/**
 * TextReveal — ScrollXUI-style animated text components
 * Palabra por palabra con blur fade-in, escaneo line por line, o char por char.
 * Todas las variantes usan Framer Motion whileInView para lazy-load compatibility.
 */

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

// ── Word-by-word blur reveal (ScrollXUI TextGenerate style) ──────────────────
interface TextRevealProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  once?: boolean;
}

export const TextReveal = ({ text, className = "", delay = 0, duration = 0.5, once = true }: TextRevealProps) => {
  const words = text.split(" ");
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once, margin: "-60px" });

  return (
    <span ref={ref} className={`inline ${className}`} aria-label={text}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, filter: "blur(8px)", y: 12 }}
          animate={inView ? { opacity: 1, filter: "blur(0px)", y: 0 } : {}}
          transition={{
            duration,
            delay: delay + i * 0.06,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="inline-block mr-[0.25em]"
          aria-hidden="true"
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
};

// ── Line-by-line slide up reveal ─────────────────────────────────────────────
interface LineRevealProps {
  lines: string[];
  className?: string;
  delay?: number;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  lineClassName?: string;
}

export const LineReveal = ({
  lines,
  className = "",
  delay = 0,
  lineClassName = "",
}: LineRevealProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <div ref={ref} className={className}>
      {lines.map((line, i) => (
        <div key={i} className="overflow-hidden">
          <motion.span
            className={`block ${lineClassName}`}
            initial={{ y: "110%", opacity: 0 }}
            animate={inView ? { y: "0%", opacity: 1 } : {}}
            transition={{
              duration: 0.75,
              delay: delay + i * 0.1,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {line}
          </motion.span>
        </div>
      ))}
    </div>
  );
};

// ── Section label (eyebrow) with animated underline ──────────────────────────
interface SectionLabelProps {
  text: string;
  color?: string;
  delay?: number;
  className?: string;
}

export const SectionLabel = ({ text, color = "#FFFFFF", delay = 0, className = "" }: SectionLabelProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -20 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] }}
      className={`inline-flex items-center gap-3 ${className}`}
    >
      {/* Animated bar */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={inView ? { scaleX: 1 } : {}}
        transition={{ duration: 0.4, delay: delay + 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="h-px w-8 origin-left"
        style={{ background: color }}
      />
      <span
        className="text-xs font-outfit uppercase tracking-[0.3em] font-bold"
        style={{ color }}
      >
        {text}
      </span>
    </motion.div>
  );
};

// ── Spotlight card wrapper (hover follows mouse) ──────────────────────────────
import { useMotionValue, useSpring, useMotionTemplate } from "framer-motion";
import { useState } from "react";

interface SpotlightCardProps {
  children: React.ReactNode;
  className?: string;
  spotColor?: string;
  style?: React.CSSProperties;
}

export const SpotlightCard = ({ children, className = "", spotColor = "rgba(255,255,255,0.12)", style }: SpotlightCardProps) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const spotX = useSpring(mouseX, { stiffness: 300, damping: 40 });
  const spotY = useSpring(mouseY, { stiffness: 300, damping: 40 });
  const background = useMotionTemplate`radial-gradient(280px circle at ${spotX}px ${spotY}px, ${spotColor}, transparent 70%)`;

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  return (
    <div
      onMouseMove={onMouseMove}
      className={`relative ${className}`}
      style={style}
    >
      {/* Spotlight layer */}
      <motion.div
        className="absolute inset-0 rounded-[inherit] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-[1]"
        style={{ background }}
      />
      {children}
    </div>
  );
};

// ── Animated gradient border ──────────────────────────────────────────────────
export const GradientBorder = ({ children, className = "", color = "#FFFFFF" }: {
  children: React.ReactNode;
  className?: string;
  color?: string;
}) => {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className={`relative ${className}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Animated border glow */}
      <motion.div
        className="absolute inset-0 rounded-[inherit] pointer-events-none"
        animate={{
          opacity: hovered ? 1 : 0,
          boxShadow: hovered
            ? `0 0 0 1px ${color}60, 0 0 20px ${color}20`
            : `0 0 0 1px transparent`,
        }}
        transition={{ duration: 0.3 }}
      />
      {children}
    </div>
  );
};

// ── Number counter with easing ────────────────────────────────────────────────
import { useEffect } from "react";

interface AnimatedCounterProps {
  value: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  className?: string;
}

export const AnimatedCounter = ({ value, suffix = "", prefix = "", duration = 2000, className = "" }: AnimatedCounterProps) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4); // ease-out quart
      setCount(Math.floor(eased * value));
      if (progress < 1) requestAnimationFrame(tick);
      else setCount(value);
    };
    requestAnimationFrame(tick);
  }, [inView, value, duration]);

  return (
    <span ref={ref} className={`tabular-nums ${className}`}>
      {prefix}{count}{suffix}
    </span>
  );
};
