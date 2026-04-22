import { useState } from "react";
import Navbar from "@/components/Navbar";
import LoadingScreen from "@/components/LoadingScreen";
import HeroImmersive from "@/components/HeroImmersive";
import StatsSection from "@/components/StatsSection";
import AISection from "@/components/AISection";
import AITerminalSection from "@/components/AITerminalSection";
import AIStackSection from "@/components/AIStackSection";
import ServicesSection from "@/components/ServicesSection";
import WorksSection from "@/components/WorksSection";
import PricingCalculator from "@/components/PricingCalculator";
import HowItWorksSection from "@/components/HowItWorksSection";
import AboutSection from "@/components/AboutSection";
import ExplorationsSection from "@/components/ExplorationsSection";
import JournalSection from "@/components/JournalSection";
import GlobeSection from "@/components/GlobeSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import CTASection from "@/components/CTASection";
import ChatbotWidget from "@/components/ChatbotWidget";
import FooterSection from "@/components/FooterSection";
import CursorFollower from "@/components/CursorFollower";
import WhatsAppButton from "@/components/WhatsAppButton";
import { useImmersiveScroll } from "@/hooks/useImmersiveScroll";
import { useAppearOnScroll } from "@/hooks/useAppearOnScroll";

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

        {/* 1. Hero — Primera impresión · WOW factor */}
        <HeroImmersive />

        {/* 2. Stats — Credibilidad inmediata */}
        <StatsSection />

        {/* 3. AI Core — El diferenciador clave (subido al frente) */}
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
        <WhatsAppButton />
      </div>
    </>
  );
};

export default Index;
