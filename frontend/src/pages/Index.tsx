import { useState, Suspense, lazy } from "react";
import Navbar from "@/components/Navbar";
import LoadingScreen from "@/components/LoadingScreen";
import CursorFollower from "@/components/CursorFollower";
import WhatsAppButton from "@/components/WhatsAppButton";
import GlobalCosmicBackground from "@/components/ui/GlobalCosmicBackground";
import { useImmersiveScroll } from "@/hooks/useImmersiveScroll";
import { useAppearOnScroll } from "@/hooks/useAppearOnScroll";

/* ──────────────────────────────────────────────────────────────────────────────
   ESPACIAL MINIMALISTA — Section Architecture v2
   ──────────────────────────────────────────────────────────────────────────────
   Total: 8 secciones (era 13). Tonos alternan entre 5 niveles de profundidad
   cósmica para crear ritmo visual sin romper la unidad cromática.

   FUSIONES / ELIMINACIONES aplicadas:
   • AISection         → fusionada en AITerminalSection (terminal demo viva
                         es el diferenciador real, no las cards estáticas)
   • JournalSection    → fusionada visualmente con AboutSection (Credibilidad)
   • CTASection        → fusionada en FAQSection (cierre con CTA integrado)
   • TestimonialsSection→ se mantiene compacta antes de FAQ+CTA
   ──────────────────────────────────────────────────────────────────────────── */

const HeroImmersive          = lazy(() => import("@/components/HeroImmersive"));
const AITerminalSection      = lazy(() => import("@/components/AITerminalSection"));
const ServicesSection        = lazy(() => import("@/components/ServicesSection"));
const WorksSection           = lazy(() => import("@/components/WorksSection"));
const HowItWorksSection      = lazy(() => import("@/components/HowItWorksSection"));
const PricingCalculator      = lazy(() => import("@/components/PricingCalculator"));
const InteractiveLabSection  = lazy(() => import("@/components/InteractiveLabSection"));
const AboutSection           = lazy(() => import("@/components/AboutSection"));
const JournalSection         = lazy(() => import("@/components/JournalSection"));
const TestimonialsSection    = lazy(() => import("@/components/TestimonialsSection"));
const FAQSection             = lazy(() => import("@/components/FAQSection"));
const FooterSection          = lazy(() => import("@/components/FooterSection"));
const ChatbotWidget          = lazy(() => import("@/components/ChatbotWidget"));

const SectionSkeleton = () => (
  <div className="w-full py-24 flex items-center justify-center" aria-hidden="true">
    <div className="w-8 h-8 rounded-full border-2 border-white/20 border-t-[#C7D2FE] animate-spin" />
  </div>
);

/**
 * ToneWrapper — aplica el tono Espacial Minimalista a la sección
 * y un overlay sutil de moon-glow opcional.
 */
const ToneWrapper = ({
  tone,
  children,
  withGlow = false,
}: {
  tone: "void" | "ink" | "deep" | "slate" | "cosmic";
  children: React.ReactNode;
  withGlow?: boolean;
}) => (
  <div className={`tone-${tone} relative`}>
    {withGlow && (
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none opacity-60"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(199,210,254,0.05) 0%, transparent 70%)",
        }}
      />
    )}
    {children}
  </div>
);

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);
  useImmersiveScroll();
  useAppearOnScroll();

  return (
    <>
      {/* Capa WebGL global persistente — Espacial Minimalista */}
      <GlobalCosmicBackground />
      <CursorFollower />
      <div className="grain-overlay" aria-hidden="true" />
      <Navbar />
      {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}

      <div className={isLoading ? "h-screen overflow-hidden" : ""}>

        {/* ① HERO — Ballpit Espacial Minimalista (tono ink) */}
        <Suspense fallback={<div className="h-screen w-full bg-[#0A0B12]" />}>
          <HeroImmersive />
        </Suspense>

        <Suspense fallback={<SectionSkeleton />}>

          {/* ② IA CORE — Terminal demo viva (tono deep) — fusiona el mensaje "soluciones que piensan" */}
          <ToneWrapper tone="deep" withGlow>
            <AITerminalSection />
          </ToneWrapper>

          {/* ③ SERVICIOS — Qué ofrezco · Conversión directa (tono slate) */}
          <ToneWrapper tone="slate">
            <ServicesSection />
          </ToneWrapper>

          {/* ④ PROYECTOS — Prueba tangible (tono deep) */}
          <ToneWrapper tone="deep">
            <WorksSection />
          </ToneWrapper>

          {/* ⑤ PROCESO + INVERSIÓN — pareja narrativa (tono cosmic + slate) */}
          <ToneWrapper tone="cosmic">
            <HowItWorksSection />
          </ToneWrapper>
          <ToneWrapper tone="slate">
            <PricingCalculator />
          </ToneWrapper>

          {/* ⑥ INTERACTIVE LAB — 4 demos en vivo: Threat / Cloud / Blockchain / Sentiment */}
          <ToneWrapper tone="ink" withGlow>
            <InteractiveLabSection />
          </ToneWrapper>

          {/* ⑦ CREDIBILIDAD — bio + stats + clientes + experiencia profesional (tono deep) */}
          <ToneWrapper tone="deep">
            <AboutSection />
            <JournalSection />
          </ToneWrapper>

          {/* ⑧ TESTIMONIOS — voz de clientes (tono cosmic, compacto) */}
          <ToneWrapper tone="cosmic">
            <TestimonialsSection />
          </ToneWrapper>

          {/* ⑨ FAQ + CTA fusionados — cierre con acción (tono void, máximo contraste) */}
          <ToneWrapper tone="void" withGlow>
            <FAQSection />
          </ToneWrapper>

          {/* FOOTER — cierre premium (tono void) */}
          <ToneWrapper tone="void">
            <FooterSection />
          </ToneWrapper>

          {/* Nova AI · floating */}
          <ChatbotWidget />

        </Suspense>

        <WhatsAppButton />
      </div>
    </>
  );
};

export default Index;
