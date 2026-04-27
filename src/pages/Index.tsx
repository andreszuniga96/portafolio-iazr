import { useState, Suspense, lazy } from "react";
import Navbar from "@/components/Navbar";
import LoadingScreen from "@/components/LoadingScreen";
import CursorFollower from "@/components/CursorFollower";
import WhatsAppButton from "@/components/WhatsAppButton";
import { useImmersiveScroll } from "@/hooks/useImmersiveScroll";
import { useAppearOnScroll } from "@/hooks/useAppearOnScroll";

// ── Lazy-load all below-the-fold sections ──────────────────────────────────────
// REMOVED: StatsSection (stats merged into AboutSection)
// REMOVED: AIStackSection (merged into SkillsSection)
// REMOVED: ExplorationsSection (merged into SkillsSection)
// REMOVED: GlobeSection (stats + clients merged into AboutSection)
const HeroImmersive      = lazy(() => import("@/components/HeroImmersive"));
const AISection          = lazy(() => import("@/components/AISection"));
const ServicesSection    = lazy(() => import("@/components/ServicesSection"));
const WorksSection       = lazy(() => import("@/components/WorksSection"));
const PricingCalculator  = lazy(() => import("@/components/PricingCalculator"));
const HowItWorksSection  = lazy(() => import("@/components/HowItWorksSection"));
const AITerminalSection  = lazy(() => import("@/components/AITerminalSection"));
const AboutSection       = lazy(() => import("@/components/AboutSection"));
const JournalSection     = lazy(() => import("@/components/JournalSection"));
const TestimonialsSection= lazy(() => import("@/components/TestimonialsSection"));
const FAQSection         = lazy(() => import("@/components/FAQSection"));
const CTASection         = lazy(() => import("@/components/CTASection"));
const FooterSection      = lazy(() => import("@/components/FooterSection"));
const ChatbotWidget      = lazy(() => import("@/components/ChatbotWidget"));

const SectionSkeleton = () => (
  <div className="w-full py-24 flex items-center justify-center" aria-hidden="true">
    <div className="w-8 h-8 rounded-full border-2 border-white/20/30 border-t-primary animate-spin" />
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
        <Suspense fallback={<div className="h-screen w-full bg-[#0c0c0e]" />}>
          <HeroImmersive />
        </Suspense>

        <Suspense fallback={<SectionSkeleton />}>

          {/* ② AI Core — "¿Por qué IA?" · El diferenciador único de IAZR */}
          <AISection />

          {/* ③ Services — Qué ofrezco exactamente · Conversión directa */}
          <ServicesSection />

          {/* ④ Works — Proyectos reales · Prueba tangible */}
          <WorksSection />

          {/* ⑤ Proceso + Oferta — primero claridad, luego inversión */}
          <HowItWorksSection />

          {/* ⑥ Pricing — transparencia total · calculadora de inversión */}
          <PricingCalculator />

          {/* ⑦ AI Terminal — Demo viva · Diferenciador técnico memorable */}
          <AITerminalSection />

          {/* ⑧ Credibilidad — bio + stats + clientes */}
          <AboutSection />

          {/* ⑨ Experiencia + prueba social */}
          <JournalSection />
          <TestimonialsSection />

          {/* ⑩ FAQ — Resuelve dudas antes del CTA */}
          <FAQSection />

          {/* ⑪ CTA — Acción final sin dudas pendientes */}
          <CTASection />

          {/* ⑫ Footer — Cierre premium IAZR */}
          <FooterSection />

          {/* Floating: Nova AI */}
          <ChatbotWidget />

        </Suspense>

        <WhatsAppButton />
      </div>
    </>
  );
};

export default Index;
