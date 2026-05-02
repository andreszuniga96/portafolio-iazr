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
<<<<<<< HEAD:frontend/src/components/HeroImmersive.tsx
          <div className="absolute inset-0" style={{ pointerEvents: 'auto' }}>
            <Ballpit
              className="absolute inset-0"
              followCursor={!isMobile}
              count={isMobile ? 80 : 120}
              gravity={0.45}
              friction={0.996}
              wallBounce={0.92}
              maxVelocity={0.14}
              colors={[0x1a1d2e, 0x2e334d, 0x4a5078, 0x8b95c1, 0xe8edf7]}
              ambientColor={0xffffff}
              ambientIntensity={0.45}
              lightIntensity={90}
              materialParams={{
                metalness: 0.5,
                roughness: 0.45,
                clearcoat: 1,
                clearcoatRoughness: 0.12,
              }}
              minSize={0.6}
              maxSize={1.2}
            />
          </div>
        </BallpitBoundary>
        {/* Dark overlay so text stays readable — sutil para no ocultar el ballpit */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#09090B]/85 via-[#09090B]/45 to-[#09090B]/15 pointer-events-none" />
=======
          {/* On desktop: full WebGL Ballpit — on mobile: CSS-only aurora orbs (no touch capture) */}
          <div
            className="absolute inset-0"
            style={{ pointerEvents: isMobile ? 'none' : 'auto' }}
          >
            {!isMobile ? (
              <Ballpit
                className="absolute inset-0"
                followCursor={true}
                count={200}
                gravity={0.45}
                friction={0.997}
                wallBounce={0.92}
                maxVelocity={0.12}
                colors={[0xA855F7, 0x7C3AED, 0x6366F1, 0xEC4899, 0xF472B6, 0xFBBF24, 0xffffff, 0x8B5CF6]}
                ambientColor={0xffffff}
                ambientIntensity={0.5}
                lightIntensity={90}
                minSize={0.4}
                maxSize={1.1}
              />
            ) : (
              /* Mobile: lightweight CSS aurora orbs — zero JS overhead, full scroll freedom */
              <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="hero-mobile-orb"
                    style={{
                      '--orb-idx': i,
                      '--orb-x': `${10 + (i * 11) % 80}%`,
                      '--orb-y': `${5 + (i * 17) % 85}%`,
                      '--orb-size': `${60 + (i * 23) % 120}px`,
                      '--orb-hue': `${260 + (i * 40) % 100}`,
                      '--orb-dur': `${3 + (i * 0.7) % 4}s`,
                      '--orb-delay': `${(i * 0.4) % 2}s`,
                    } as React.CSSProperties}
                  />
                ))}
              </div>
            )}
          </div>
        </BallpitBoundary>
        {/* Lighter overlay so balls show through vividly */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#09090B] via-[#09090B]/52 to-transparent pointer-events-none" />
>>>>>>> 806e164 (Quinta modificacion):src/components/HeroImmersive.tsx
      </motion.div>

      {/* Radial ambient glow behind text — adds depth and warmth */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 90% 65% at 50% 85%, rgba(124,58,237,0.28) 0%, rgba(99,102,241,0.15) 45%, transparent 75%)'
      }} />

      {/* ── Layer 3: Text content ── */}
      <motion.div
        style={{ y: textY, opacity: textOpacity }}
        className="relative z-10 w-full h-screen max-w-7xl mx-auto px-5 sm:px-8 md:px-12 flex flex-col justify-end pb-24 sm:pb-32 md:pb-40"
      >
        <div>
          <div className="hero-sub mb-4 sm:mb-5">
            <SectionLabel text="IAZR — Tu CTO Externo · Arquitectura · IA · Full-Stack" delay={0.3} />
          </div>

          <h1
            className="font-outfit font-bold uppercase text-white leading-[0.88] tracking-[-0.03em] mb-6 sm:mb-8 overflow-visible"
            style={{ fontSize: 'clamp(2.4rem, 9vw, 96px)' }}
          >
            <span className="block">
              <TextReveal text="Arquitecturas" delay={0.35} className="text-white" />
            </span>
            <span className="block aurora-text">
              <TextReveal text="que Escalan." delay={0.55} />
            </span>
            <span className="block">
              <TextReveal text="IA que Decide." delay={0.75} className="text-white" />
            </span>
          </h1>

          <p
            className="hero-sub max-w-2xl text-sm sm:text-base md:text-lg font-outfit font-light mb-6 sm:mb-8"
            style={{ color: 'rgba(255,255,255,0.65)' }}
          >
            Diseño arquitecturas escalables, automatizo procesos críticos y dirijo equipos técnicos con{' '}
            <span className="text-white font-medium">IA & Data Strategy</span> para empresas que quieren liderar en Colombia y el mundo.
          </p>

          {/* ─ Credibility stats strip ─ */}
          <div className="hero-sub flex items-center gap-4 sm:gap-6 mb-8 sm:mb-10 flex-wrap">
            {[
              { val: '40+', label: 'Proyectos' },
              { val: '98%', label: 'Satisfacción' },
              { val: '6+', label: 'Años' },
              { val: '1200+', label: 'Estudiantes' },
            ].map((s, i) => (
              <div key={i} className="flex items-baseline gap-1.5">
                <span className="font-outfit font-bold text-white" style={{ fontSize: 'clamp(1rem, 2.5vw, 1.4rem)' }}>{s.val}</span>
                <span className="font-outfit text-xs uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.35)' }}>{s.label}</span>
                {i < 3 && <span className="ml-3 sm:ml-4" style={{ color: 'rgba(255,255,255,0.12)' }}>|</span>}
              </div>
            ))}
          </div>

          <div className="hero-sub flex flex-col sm:flex-row gap-3 sm:gap-4">
            <a
              href="#servicios"
              className="btn-glow px-6 sm:px-8 py-4 rounded-full font-outfit font-bold text-sm uppercase tracking-wider hover:brightness-110 hover:scale-105 active:scale-95 transition-all text-center text-white"
              style={{
                background: 'linear-gradient(135deg, #7C3AED 0%, #EC4899 100%)',
                boxShadow: '0 0 32px rgba(124,58,237,0.45)',
                minHeight: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}
            >
              Ver Servicios
            </a>
            <a
              href="#proyectos"
              className="px-6 sm:px-8 py-4 rounded-full font-outfit font-semibold text-sm uppercase tracking-wider transition-all hover:scale-105 active:scale-95 text-center"
              style={{
                border: '1px solid rgba(168,85,247,0.3)',
                color: 'rgba(240,237,232,0.85)',
                background: 'rgba(124,58,237,0.08)',
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
