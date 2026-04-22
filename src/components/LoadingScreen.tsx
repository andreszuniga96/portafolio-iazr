import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const words = ["Develop", "Mentor", "Innovate", "IAZR"];

function Particles() {
  const count = 5000;
  const positions = useMemo(() => {
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      p[i * 3] = (Math.random() - 0.5) * 10;
      p[i * 3 + 1] = (Math.random() - 0.5) * 10;
      p[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return p;
  }, [count]);

  const pointsRef = useRef<THREE.Points>(null);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.1;
      pointsRef.current.rotation.x = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.02} color="#4da4ff" transparent opacity={0.6} sizeAttenuation />
    </points>
  );
}

interface LoadingScreenProps {
  onComplete: () => void;
}

const LoadingScreen = ({ onComplete }: LoadingScreenProps) => {
  const [count, setCount] = useState(0);
  const [wordIndex, setWordIndex] = useState(0);
  const startRef = useRef<number | null>(null);
  const rafRef = useRef<number>(0);
  const duration = 2800; // slightly longer for the particles

  const animate = useCallback(
    (timestamp: number) => {
      if (!startRef.current) startRef.current = timestamp;
      const elapsed = timestamp - startRef.current;
      const progress = Math.min(elapsed / duration, 1);
      setCount(Math.floor(progress * 100));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        setTimeout(onComplete, 500);
      }
    },
    [onComplete]
  );

  useEffect(() => {
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [animate]);

  useEffect(() => {
    const interval = setInterval(() => setWordIndex((i) => (i + 1) % words.length), 700);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      exit={{ opacity: 0, filter: "blur(10px)" }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="fixed inset-0 z-[9999] bg-background flex flex-col justify-between overflow-hidden"
    >
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
          <Particles />
        </Canvas>
      </div>

      <div className="absolute inset-0 bg-background/40 backdrop-blur-[2px] z-10" />

      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="p-8 z-20"
      >
        <span className="text-xs text-primary uppercase font-outfit tracking-[0.3em]">Portfolio 2026</span>
      </motion.div>

      <div className="flex-1 flex items-center justify-center z-20">
        <AnimatePresence mode="wait">
          <motion.span
            key={wordIndex}
            initial={{ scale: 0.9, opacity: 0, filter: "blur(4px)" }}
            animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
            exit={{ scale: 1.1, opacity: 0, filter: "blur(4px)" }}
            transition={{ duration: 0.3 }}
            className={`text-5xl md:text-7xl lg:text-8xl font-display italic text-foreground tracking-wider ${
              words[wordIndex] === "IAZR" ? "glitch-text font-outfit not-italic font-bold" : ""
            }`}
          >
            {words[wordIndex]}
          </motion.span>
        </AnimatePresence>
      </div>

      <div className="p-8 flex flex-col items-end z-20">
        <span className="text-6xl md:text-8xl lg:text-9xl font-outfit font-light text-foreground tabular-nums leading-none mb-6">
          {String(count).padStart(3, "0")}%
        </span>
      </div>

      <div className="h-[4px] bg-secondary w-full z-20">
        <div
          className="h-full accent-gradient"
          style={{
            transform: `scaleX(${count / 100})`,
            transformOrigin: "left",
            boxShadow: "0 0 15px rgba(77, 164, 255, 0.8)",
            transition: "transform 0.05s linear",
          }}
        />
      </div>
    </motion.div>
  );
};

export default LoadingScreen;
