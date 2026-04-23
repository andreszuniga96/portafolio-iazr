import { useState, Suspense, lazy } from "react";
import Navbar from "@/components/Navbar";
import LoadingScreen from "@/components/LoadingScreen";
import HeroImmersive from "@/components/HeroImmersive";
import CursorFollower from "@/components/CursorFollower";
import WhatsAppButton from "@/components/WhatsAppButton";
import { useImmersiveScroll } from "@/hooks/useImmersiveScroll";
import { useAppearOnScroll } from "@/hooks/useAppearOnScroll";

// ── Lazy-load all below-the-fold sections ──────────────────────────────────────
// REMOVED: StatsSection (stats merged into AboutSection)
// REMOVED: AIStackSection (merged into SkillsSection)
// REMOVED: ExplorationsSection (merged into SkillsSection)
// REMOVED: GlobeSection (stats + clients merged into AboutSection)
const AISection          = lazy(() => import("@/components/AISection"));
const ServicesSection    = lazy(() => import("@/components/ServicesSection"));
const WorksSection       = lazy(() => import("@/components/WorksSection"));
const PricingCalculator  = lazy(() => import("@/components/PricingCalculator"));
const HowItWorksSection  = lazy(() => import("@/components/HowItWorksSection"));
const AITerminalSection  = lazy(() => import("@/components/AITerminalSection"));
const AboutSection       = lazy(() => import("@/components/AboutSection"));
const SkillsSection      = lazy(() => import("@/components/SkillsSection"));
const JournalSection     = lazy(() => import("@/components/JournalSection"));
const TestimonialsSection= lazy(() => import("@/components/TestimonialsSection"));
const FAQSection         = lazy(() => import("@/components/FAQSection"));
const CTASection         = lazy(() => import("@/components/CTASection"));
const FooterSection      = lazy(() => import("@/components/FooterSection"));
const ChatbotWidget      = lazy(() => import("@/components/ChatbotWidget"));

const SectionSkeleton = () => (
  <div className="w-full py-24 flex items-center justify-center" aria-hidden="true">
    <div className="w-8 h-8 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
  </div>
);

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);
  useImmersiveScroll();
  useAppearOnScroll();

  return (
    <>
      <CursorFollower />
      <div className="grain-overlay" aria-hidden="true" />
      <Navbar />
      {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}

      <div className={isLoading ? "h-screen overflow-hidden" : ""}>

        {/* ① Hero — Hook & primera impresión WOW */}
        <HeroImmersive />

        <Suspense fallback={<SectionSkeleton />}>

          {/* ② AI Core — "¿Por qué IA?" · El diferenciador único de IAZR */}
          <AISection />

          {/* ③ Services — Qué ofrezco exactamente · Conversión directa */}
          <div id="servicios"><ServicesSection /></div>

          {/* ④ Works — Proyectos reales · Prueba tangible */}
          <div id="proyectos"><WorksSection /></div>

          {/* ⑤ Pricing — Transparencia total · Calculadora de inversión */}
          <div id="pricing"><PricingCalculator /></div>

          {/* ⑥ How It Works — Proceso sin fricción · 4 pasos */}
          <div id="proceso"><HowItWorksSection /></div>

          {/* ⑦ AI Terminal — Demo viva · Diferenciador técnico memorable */}
          <AITerminalSection />

          {/* ⑧ About — Hub de credibilidad: bio + stats + clientes */}
          <div id="about"><AboutSection /></div>

          {/* ⑨ Skills — Ecosistema técnico: FlipFlow + tools + certs */}
          <SkillsSection />

          {/* ⑩ Journal — Trayectoria profesional 2023-2026 */}
          <div id="experiencia"><JournalSection /></div>

          {/* ⑪ Testimonials — Prueba social · Kinetic vertical marquee */}
          <TestimonialsSection />

          {/* ⑫ FAQ — Resuelve dudas antes del CTA */}
          <div id="faq"><FAQSection /></div>

          {/* ⑬ CTA — Acción final sin dudas pendientes */}
          <CTASection />

          {/* ⑭ Footer — Cierre premium IAZR */}
          <div id="contact"><FooterSection /></div>

          {/* Floating: Nova AI */}
          <ChatbotWidget />

        </Suspense>

        <WhatsAppButton />
      </div>
    </>
  );
};

export default Index;
