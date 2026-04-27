import { useEffect, useRef } from "react";
import { motion, useSpring, useMotionValue, AnimatePresence } from "framer-motion";

/**
 * Premium AI Cursor — sleek crosshair ring that follows the mouse
 * with spring easing. On hover: glows and expands. On click: ripple.
 * Designed for international-level AI portfolio.
 */
const CursorFollower = () => {
  const mouseX = useMotionValue(-200);
  const mouseY = useMotionValue(-200);

  // Outer ring — slower, smoother spring
  const ringSpring = { damping: 22, stiffness: 160, mass: 0.6 };
  const ringX = useSpring(mouseX, ringSpring);
  const ringY = useSpring(mouseY, ringSpring);

  // Inner dot — snappy, fast
  const dotSpring = { damping: 40, stiffness: 600, mass: 0.08 };
  const dotX = useSpring(mouseX, dotSpring);
  const dotY = useSpring(mouseY, dotSpring);

  const ringScale = useMotionValue(1);
  const springRingScale = useSpring(ringScale, { damping: 18, stiffness: 280 });
  const ringOpacity = useMotionValue(0.7);
  const dotOpacity = useMotionValue(1);

  const ripple = useRef<{ x: number; y: number; id: number } | null>(null);
  const rippleId = useRef(0);
  const isHovering = useRef(false);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    const onEnter = () => {
      isHovering.current = true;
      ringScale.set(2.4);
      ringOpacity.set(1);
    };

    const onLeave = () => {
      isHovering.current = false;
      ringScale.set(1);
      ringOpacity.set(0.7);
    };

    const onMouseDown = (e: MouseEvent) => {
      ripple.current = { x: e.clientX, y: e.clientY, id: ++rippleId.current };
      ringScale.set(0.8);
      setTimeout(() => ringScale.set(isHovering.current ? 2.4 : 1), 150);
    };

    const bindInteractives = () => {
      const els = document.querySelectorAll("a, button, [data-cursor-expand], .cursor-expand, input, textarea");
      els.forEach(el => {
        el.addEventListener("mouseenter", onEnter);
        el.addEventListener("mouseleave", onLeave);
      });
      return els;
    };

    let bound = bindInteractives();

    const observer = new MutationObserver(() => {
      bound.forEach(el => {
        el.removeEventListener("mouseenter", onEnter);
        el.removeEventListener("mouseleave", onLeave);
      });
      bound = bindInteractives();
    });

    observer.observe(document.body, { childList: true, subtree: true });
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mousedown", onMouseDown);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onMouseDown);
      observer.disconnect();
    };
  }, []);

  // Hide on touch devices
  if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
    return null;
  }

  return (
    <>
      {/* ── Outer ring — follows with lag ── */}
      <motion.div
        style={{
          x: ringX,
          y: ringY,
          scale: springRingScale,
          opacity: ringOpacity,
          translateX: "-50%",
          translateY: "-50%",
          position: "fixed",
          top: 0,
          left: 0,
          width: 36,
          height: 36,
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: 99999,
        }}
      >
        {/* Main ring */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            border: "1.5px solid rgba(255,255,255,0.75)",
            boxShadow: "0 0 12px rgba(255,255,255,0.3), inset 0 0 8px rgba(255,255,255,0.06)",
          }}
        />
        {/* Crosshair lines */}
        {/* Top */}
        <div style={{
          position: "absolute", left: "50%", top: -7, width: 1, height: 5,
          background: "rgba(255,255,255,0.6)", transform: "translateX(-50%)", borderRadius: 1,
        }} />
        {/* Bottom */}
        <div style={{
          position: "absolute", left: "50%", bottom: -7, width: 1, height: 5,
          background: "rgba(255,255,255,0.6)", transform: "translateX(-50%)", borderRadius: 1,
        }} />
        {/* Left */}
        <div style={{
          position: "absolute", top: "50%", left: -7, height: 1, width: 5,
          background: "rgba(255,255,255,0.6)", transform: "translateY(-50%)", borderRadius: 1,
        }} />
        {/* Right */}
        <div style={{
          position: "absolute", top: "50%", right: -7, height: 1, width: 5,
          background: "rgba(255,255,255,0.6)", transform: "translateY(-50%)", borderRadius: 1,
        }} />
      </motion.div>

      {/* ── Inner dot — snappy center ── */}
      <motion.div
        style={{
          x: dotX,
          y: dotY,
          opacity: dotOpacity,
          translateX: "-50%",
          translateY: "-50%",
          position: "fixed",
          top: 0,
          left: 0,
          width: 4,
          height: 4,
          borderRadius: "50%",
          backgroundColor: "#FFFFFF",
          boxShadow: "0 0 6px rgba(255,255,255,0.9)",
          pointerEvents: "none",
          zIndex: 99999,
        }}
      />
    </>
  );
};

export default CursorFollower;
