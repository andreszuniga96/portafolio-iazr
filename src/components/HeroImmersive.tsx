import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { TextReveal, SectionLabel } from '@/components/ui/AnimatedElements';

gsap.registerPlugin(ScrollTrigger);

/* ── CSS Aurora Particle Dots (GPU-friendly, no Three.js) ── */
const AuroraDots = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
    {[...Array(18)].map((_, i) => {
      const size = 2 + (i % 3);
      const col = i % 4 === 0 ? '#FF6B2B' : i % 4 === 1 ? '#f59e0b' : i % 4 === 2 ? '#8b5cf6' : '#3b82f6';
      return (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            width: size,
            height: size,
            background: col,
            opacity: 0.25 + (i % 3) * 0.1,
            left: `${5 + (i * 17) % 90}%`,
            top: `${10 + (i * 23) % 80}%`,
            animation: `aurora-float-${i % 4} ${5 + (i % 5)}s ease-in-out ${i * 0.4}s infinite`,
            boxShadow: `0 0 ${6 + size * 2}px ${col}60`,
          }}
        />
      );
    })}
    {/* Connecting lines */}
    <svg className="absolute inset-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
      {[...Array(6)].map((_, i) => (
        <line
          key={i}
          x1={`${10 + i * 16}%`} y1={`${20 + (i % 3) * 25}%`}
          x2={`${26 + i * 16}%`} y2={`${40 + (i % 3) * 20}%`}
          stroke="#FF6B2B" strokeWidth="0.5"
        />
      ))}
    </svg>
  </div>
);

/* ── Magnetic floating badge ── */
const FloatingBadge = ({
  label, emoji, style, delay = 0,
}: { label: string; emoji?: string; style?: React.CSSProperties; delay?: number }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 120, damping: 20 });
  const springY = useSpring(y, { stiffness: 120, damping: 20 });

  const onMouseMove = (e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const dx = (e.clientX - rect.left - rect.width / 2) * 0.15;
    const dy = (e.clientY - rect.top - rect.height / 2) * 0.15;
    x.set(dx); y.set(dy);
  };
  const onMouseLeave = () => { x.set(0); y.set(0); };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.6, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      style={{ x: springX, y: springY, ...style }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className="absolute pointer-events-auto select-none hidden md:block cursor-default"
    >
      <div
        className="animate-float-badge px-3 py-1.5 rounded-full backdrop-blur-sm flex items-center gap-1.5 whitespace-nowrap text-xs font-outfit font-semibold transition-all hover:scale-105"
        style={{
          background: 'rgba(255,107,43,0.12)',
          border: '1px solid rgba(255,107,43,0.3)',
          color: 'rgba(255,255,255,0.85)',
          animationDelay: `${delay}s`,
          boxShadow: '0 4px 20px rgba(255,107,43,0.15)',
        }}
      >
        {emoji && <span className="text-sm">{emoji}</span>}
        {label}
      </div>
    </motion.div>
  );
};

const HeroImmersive = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const videoScale   = useTransform(scrollYProgress, [0, 1], [1.12, 1.0]);
  const videoY       = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);
  const textY        = useTransform(scrollYProgress, [0, 0.6], ['0%', '-28%']);
  const textOpacity  = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const badgesOpacity= useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  useEffect(() => {
    if (!containerRef.current) return;
    const ctx = gsap.context(() => {
      /* Sub-elements: opacity only (compositable, no filter:blur) */
      gsap.set('.hero-sub', { opacity: 0, y: 24 });
      gsap.to('.hero-sub', {
        opacity: 1, y: 0,
        duration: 0.9, stagger: 0.12,
        ease: 'power3.out', delay: 1.4,
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="home"
      ref={containerRef}
      className="relative min-h-screen overflow-hidden"
      style={{ backgroundColor: '#0c0c0e', contain: 'layout' }}
    >
      {/* ── Layer 1: Video parallax ── */}
      <motion.div
        style={{ scale: videoScale, y: videoY }}
        className="absolute inset-0 w-full h-full origin-center"
      >
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
          preload="none"
          poster="/hero-poster.webp"
          aria-hidden="true"
        >
          <source
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260206_044704_dd33cb15-c23f-4cfc-aa09-a0465d4dcb54.mp4"
            type="video/mp4"
          />
        </video>
        {/* Warm dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0e] via-[#0c0c0e]/50 to-transparent" />
        <div className="absolute inset-0" style={{ background: 'rgba(12,10,8,0.22)' }} />
      </motion.div>

      {/* ── Aurora dots (CSS particles, no WebGL) ── */}
      <AuroraDots />

      {/* ── Layer 2: Floating Badges (desktop only, magnetic) ── */}
      <motion.div
        style={{ opacity: badgesOpacity }}
        className="absolute inset-0 pointer-events-none z-10"
        aria-hidden="true"
      >
        <FloatingBadge label="6+ Años Experiencia" emoji="⚡" delay={1.8} style={{ top: '22%', right: '8%' }} />
        <FloatingBadge label="IA & Full-Stack" emoji="🧠" delay={2.0} style={{ top: '36%', right: '4%' }} />
        <FloatingBadge label="Disponible ✓" emoji="🟢" delay={2.2} style={{ bottom: '32%', right: '10%' }} />
        <FloatingBadge label="Colombia 🇨🇴 → Mundo 🌍" delay={2.4} style={{ bottom: '44%', left: '3%' }} />
      </motion.div>

      {/* ── Layer 3: Text content ── */}
      <motion.div
        style={{ y: textY, opacity: textOpacity }}
        className="relative z-10 w-full h-screen max-w-7xl mx-auto px-5 sm:px-8 md:px-12 flex flex-col justify-end pb-24 sm:pb-32 md:pb-40"
      >
        <div>
          {/* Section label with animated bar */}
          <div className="hero-sub mb-4 sm:mb-5">
            <SectionLabel text="Ivan Zuñiga — Ingeniería & Inteligencia Artificial" delay={0.3} />
          </div>

          {/* Main headline with TextReveal */}
          <h1
            className="font-outfit font-bold uppercase text-white leading-[0.9] tracking-[-0.03em] mb-6 sm:mb-8 overflow-visible"
            style={{ fontSize: 'clamp(2.2rem, 9vw, 90px)' }}
          >
            <span className="block">
              <TextReveal text="Tecnología" delay={0.35} className="text-white" />
            </span>
            <span className="block aurora-text">
              <TextReveal text="de Vanguardia" delay={0.6} />
            </span>
            <span className="block">
              <TextReveal text="para Colombia." delay={0.85} className="text-white" />
            </span>
          </h1>

          {/* Sub-description */}
          <p
            className="hero-sub max-w-2xl text-sm sm:text-base md:text-lg font-outfit font-light mb-8 sm:mb-12"
            style={{ color: 'rgba(240,237,232,0.65)' }}
          >
            Construyo plataformas inmersivas, automatizo con{' '}
            <span className="aurora-text font-medium">Inteligencia Artificial</span> y formo el
            talento tecnológico que Colombia necesita para competir a nivel mundial.
          </p>

          {/* CTAs */}
          <div className="hero-sub flex flex-col sm:flex-row gap-3 sm:gap-4">
            <a
              href="#servicios"
              className="btn-glow px-6 sm:px-8 py-4 rounded-full bg-primary text-black font-outfit font-bold text-sm uppercase tracking-wider hover:brightness-110 hover:scale-105 active:scale-95 transition-all text-center"
              style={{ minHeight: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              Ver Servicios
            </a>
            <a
              href="#proyectos"
              className="px-6 sm:px-8 py-4 rounded-full font-outfit font-semibold text-sm uppercase tracking-wider transition-all hover:scale-105 active:scale-95 text-center"
              style={{
                border: '1px solid rgba(255,255,255,0.2)',
                color: 'rgba(240,237,232,0.8)',
                background: 'rgba(255,255,255,0.04)',
                backdropFilter: 'blur(8px)',
                minHeight: '48px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              Ver Proyectos
            </a>
          </div>
        </div>
      </motion.div>

      {/* ── Scroll indicator ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.4 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
        aria-hidden="true"
      >
        <span className="text-[9px] text-white/30 uppercase tracking-[0.35em] font-outfit">Scroll</span>
        <div className="w-px h-10 sm:h-12 relative overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
          <div className="w-full h-full bg-primary absolute top-0 left-0 animate-scroll-down" />
        </div>
        <span className="text-[9px] text-white/20 font-outfit tabular-nums">01</span>
      </motion.div>
    </section>
  );
};

export default HeroImmersive;
