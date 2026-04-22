import { useState, Suspense, lazy } from "react";
import Navbar from "@/components/Navbar";
import LoadingScreen from "@/components/LoadingScreen";
import HeroImmersive from "@/components/HeroImmersive";
import CursorFollower from "@/components/CursorFollower";
import WhatsAppButton from "@/components/WhatsAppButton";
import { useImmersiveScroll } from "@/hooks/useImmersiveScroll";
import { useAppearOnScroll } from "@/hooks/useAppearOnScroll";

// ── Lazy-load all below-the-fold sections ──────────────────────────────────────
// This drastically reduces the initial JS bundle, improving FCP & TBT
const StatsSection       = lazy(() => import("@/components/StatsSection"));
const AISection          = lazy(() => import("@/components/AISection"));
const AITerminalSection  = lazy(() => import("@/components/AITerminalSection"));
const AIStackSection     = lazy(() => import("@/components/AIStackSection"));
const ServicesSection    = lazy(() => import("@/components/ServicesSection"));
const WorksSection       = lazy(() => import("@/components/WorksSection"));
const PricingCalculator  = lazy(() => import("@/components/PricingCalculator"));
const HowItWorksSection  = lazy(() => import("@/components/HowItWorksSection"));
const AboutSection       = lazy(() => import("@/components/AboutSection"));
const ExplorationsSection= lazy(() => import("@/components/ExplorationsSection"));
const JournalSection     = lazy(() => import("@/components/JournalSection"));
const GlobeSection       = lazy(() => import("@/components/GlobeSection"));
const TestimonialsSection= lazy(() => import("@/components/TestimonialsSection"));
const CTASection         = lazy(() => import("@/components/CTASection"));
const FooterSection      = lazy(() => import("@/components/FooterSection"));
const ChatbotWidget      = lazy(() => import("@/components/ChatbotWidget"));

// ── Lightweight fallback for lazy sections ─────────────────────────────────────
const SectionSkeleton = () => (
  <div className="w-full py-24 flex items-center justify-center" aria-hidden="true">
    <div className="w-8 h-8 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
  </div>
);

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);

  // Global animation hooks
  useImmersiveScroll();
  useAppearOnScroll();

  return (
    <>
      {/* Custom cursor follower (desktop only) */}
      <CursorFollower />

      {/* Grain texture overlay */}
      <div className="grain-overlay" aria-hidden="true" />

      <Navbar />
      {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}

      <div className={isLoading ? "h-screen overflow-hidden" : ""}>

        {/* 1. Hero — Primera impresión · WOW factor (always eager-loaded) */}
        <HeroImmersive />

        {/* All below-the-fold sections are lazy-loaded */}
        <Suspense fallback={<SectionSkeleton />}>

          {/* 2. Stats — Credibilidad inmediata */}
          <StatsSection />

          {/* 3. AI Core — El diferenciador clave */}
          <AISection />

          {/* 4. AI Terminal — Demo viva de IA en acción */}
          <AITerminalSection />

          {/* 5. AI Stack — Arsenal tecnológico completo */}
          <AIStackSection />

          {/* 6. Services — Catálogo de servicios */}
          <div id="servicios"><ServicesSection /></div>

          {/* 7. Works — Proyectos reales destacados */}
          <div id="proyectos"><WorksSection /></div>

          {/* 8. Pricing — Calculadora de inversión */}
          <div id="pricing"><PricingCalculator /></div>

          {/* 9. How It Works — Metodología */}
          <div id="proceso"><HowItWorksSection /></div>

          {/* 10. About — Bento personal */}
          <div id="about"><AboutSection /></div>

          {/* 11. Explorations — Skills radar */}
          <ExplorationsSection />

          {/* 12. Journal — Trayectoria · Experience timeline */}
          <div id="experiencia"><JournalSection /></div>

          {/* 13. Globe — Alcance global */}
          <GlobeSection />

          {/* 14. Testimonials */}
          <TestimonialsSection />

          {/* 15. CTA — Sección de conversión */}
          <CTASection />

          {/* 16. Footer */}
          <div id="contact"><FooterSection /></div>

          {/* Floating: Nova AI + WhatsApp */}
          <ChatbotWidget />

        </Suspense>

        <WhatsAppButton />
      </div>
    </>
  );
};

export default Index;
