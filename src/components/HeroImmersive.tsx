import { useEffect, useRef, useState, Component, ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { TextReveal, SectionLabel } from '@/components/ui/AnimatedElements';
import Ballpit from '@/components/Ballpit';

gsap.registerPlugin(ScrollTrigger);

// Error boundary so Ballpit failures don't crash the page
class BallpitBoundary extends Component<{ children: ReactNode }, { error: boolean }> {
  state = { error: false };
  static getDerivedStateFromError() { return { error: true }; }
  render() {
    if (this.state.error) {
      return (
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(255,255,255,0.18) 0%, rgba(139,92,246,0.10) 50%, transparent 100%)'
        }} />
      );
    }
    return this.props.children;
  }
}


const HeroImmersive = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const ballpitY    = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);
  const textY       = useTransform(scrollYProgress, [0, 0.6], ['0%', '-28%']);
  const textOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  useEffect(() => {
    if (!containerRef.current) return;
    const ctx = gsap.context(() => {
      gsap.set('.hero-sub', { opacity: 0, y: 24 });
      gsap.to('.hero-sub', { opacity: 1, y: 0, duration: 0.9, stagger: 0.12, ease: 'power3.out', delay: 1.4 });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <section
      id="home"
      ref={containerRef}
      className="relative min-h-screen overflow-hidden"
      style={{ backgroundColor: '#09090B', contain: 'layout' }}
    >
      {/* ── Layer 1: Ballpit physics background ── */}
      <motion.div
        style={{ y: ballpitY }}
        className="absolute inset-0 w-full h-full"
      >
        <BallpitBoundary>
          <div className="absolute inset-0" style={{ pointerEvents: 'auto' }}>
            <Ballpit
              className="absolute inset-0"
              followCursor={!isMobile}
              count={isMobile ? 120 : 180}
              gravity={0.55}
              friction={0.996}
              wallBounce={0.95}
              maxVelocity={0.15}
              colors={[0x5b3df5, 0x7c66ff, 0x2232a8, 0xf5f7ff, 0x1a1c24]}
              ambientColor={0xffffff}
              ambientIntensity={0.3}
              lightIntensity={70}
              minSize={0.5}
              maxSize={1}
            />
          </div>
        </BallpitBoundary>
        {/* Dark overlay so text stays readable */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#09090B] via-[#09090B]/78 to-[#09090B]/40 pointer-events-none" />
      </motion.div>

      {/* ── Layer 3: Text content ── */}
      <motion.div
        style={{ y: textY, opacity: textOpacity }}
        className="relative z-10 w-full h-screen max-w-7xl mx-auto px-5 sm:px-8 md:px-12 flex flex-col justify-end pb-24 sm:pb-32 md:pb-40"
      >
        <div>
          <div className="hero-sub mb-4 sm:mb-5">
            <SectionLabel text="Ivan Zuñiga — Ingeniería & Inteligencia Artificial" delay={0.3} />
          </div>

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

          <p
            className="hero-sub max-w-2xl text-sm sm:text-base md:text-lg font-outfit font-light mb-8 sm:mb-12"
            style={{ color: 'rgba(255,255,255,0.7)' }}
          >
            Construyo plataformas inmersivas, automatizo con{' '}
            <span className="text-white font-medium">Inteligencia Artificial</span> y formo el
            talento tecnológico que Colombia necesita para competir a nivel mundial.
          </p>

          <div className="hero-sub flex flex-col sm:flex-row gap-3 sm:gap-4">
            <a
              href="#servicios"
              className="btn-glow px-6 sm:px-8 py-4 rounded-full bg-primary text-primary-foreground font-outfit font-bold text-sm uppercase tracking-wider hover:brightness-110 hover:scale-105 active:scale-95 transition-all text-center"
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
          <div className="w-full h-full bg-white absolute top-0 left-0 animate-scroll-down" />
        </div>
        <span className="text-[9px] text-white/20 font-outfit tabular-nums">01</span>
      </motion.div>
    </section>
  );
};

export default HeroImmersive;
