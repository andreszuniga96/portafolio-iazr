import { useState, Suspense, lazy } from "react";
import Navbar from "@/components/Navbar";
import LoadingScreen from "@/components/LoadingScreen";
import CursorFollower from "@/components/CursorFollower";
import WhatsAppButton from "@/components/WhatsAppButton";
import ScrollProgress from "@/components/ScrollProgress";
import { useImmersiveScroll } from "@/hooks/useImmersiveScroll";
import { useAppearOnScroll } from "@/hooks/useAppearOnScroll";
import { useGPUTier } from "@/hooks/useGPUTier";

// ── WebGL Global Background ───────────────────────────────────────────────────
const DataSpaceBackground = lazy(() => import("@/components/DataSpaceBackground"));

// ── Lazy-load all sections ────────────────────────────────────────────────────
// ORDEN FINAL: flujo narrativo Hero → IA → Evidencia → Servicios → Social proof → Acción
const HeroImmersive       = lazy(() => import("@/components/HeroImmersive"));
// ① Hero — Primera impresión inmersiva WOW

const AISection           = lazy(() => import("@/components/AISection"));
// ② IA Core — ¿Qué puede hacer la IA por tu negocio? Diferenciador único

const AIToolsSection      = lazy(() => import("@/components/AIToolsSection"));
// ③ Arsenal IA — Credibilidad técnica: 20+ herramientas con expertise real

const ServicesSection     = lazy(() => import("@/components/ServicesSection"));
// ④ Servicios — Qué ofrecemos: 6 servicios concretos, sin precios expuestos

const WorksSection        = lazy(() => import("@/components/WorksSection"));
// ⑤ Proyectos — Prueba social: trabajos reales entregados

const HowItWorksSection   = lazy(() => import("@/components/HowItWorksSection"));
// ⑥ Proceso — Cómo trabajamos: transparencia antes de la compra

const ImpactSection       = lazy(() => import("@/components/ImpactSection"));
// ⑦ Impacto — Números reales: 40+ proyectos, 1200+ estudiantes, roles key

const BrandSection        = lazy(() => import("@/components/BrandSection"));
// ⑧ ¿Por qué IAZR? — Diferenciales, promesa de marca y aliados

const ArchitectLabSection = lazy(() => import("@/components/ArchitectLabSection"));
// ⑨ Lab 360° — Wow factor técnico (solo GPU ≥ 2)

const TestimonialsSection = lazy(() => import("@/components/TestimonialsSection"));
// ⑩ Testimonios — Validación externa de clientes reales

const PricingCalculator   = lazy(() => import("@/components/PricingCalculator"));
// ⑪ Cotizar — Calculadora de alcance → siempre redirige a WhatsApp

const FAQSection          = lazy(() => import("@/components/FAQSection"));
// ⑫ FAQ — Resuelve objeciones antes del CTA final

const CTASection          = lazy(() => import("@/components/CTASection"));
// ⑬ CTA — Acción final sin fricción

const FooterSection       = lazy(() => import("@/components/FooterSection"));
// ⑭ Footer — Cierre premium IAZR

const ChatbotWidget       = lazy(() => import("@/components/ChatbotWidget"));
// Floating: Nova AI assistant

const SectionSkeleton = () => (
  <div className="w-full py-24 flex items-center justify-center" aria-hidden="true">
    <div className="w-8 h-8 rounded-full border-2 border-white/20 border-t-primary animate-spin" />
  </div>
);

const DataSpaceFallback = () => (
  <div
    aria-hidden="true"
    style={{
      position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none",
      background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(83,55,229,0.12) 0%, transparent 65%)",
    }}
  />
);

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);
  const gpuTier = useGPUTier();
  useImmersiveScroll();
  useAppearOnScroll();

  const showDataSpace    = gpuTier >= 2;
  const showArchitectLab = gpuTier >= 2;

  return (
    <>
      <ScrollProgress />
      <CursorFollower />
      <div className="grain-overlay" aria-hidden="true" />
      <Navbar />
      {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}

      {!isLoading && (
        showDataSpace ? (
          <Suspense fallback={null}>
            <DataSpaceBackground />
          </Suspense>
        ) : (
          <DataSpaceFallback />
        )
      )}

      <div className={isLoading ? "h-screen overflow-hidden" : ""} style={{ position: "relative", zIndex: 1 }}>

        {/* ① Hero */}
        <Suspense fallback={<div className="h-screen w-full bg-[#09090B]" />}>
          <HeroImmersive />
        </Suspense>

        <Suspense fallback={<SectionSkeleton />}>

          {/* ② IA Core */}
          <AISection />

          {/* ③ Arsenal IA */}
          <AIToolsSection />

          {/* ④ Servicios */}
          <ServicesSection />

          {/* ⑤ Proyectos */}
          <WorksSection />

          {/* ⑥ Proceso */}
          <HowItWorksSection />

          {/* ⑦ Impacto (métricas + trayectoria) */}
          <ImpactSection />

          {/* ⑧ Brand IAZR (¿Por qué IAZR? + aliados) */}
          <BrandSection />

          {/* ⑨ Lab 360° (solo GPU alta) */}
          {showArchitectLab && <ArchitectLabSection />}

          {/* ⑩ Testimonios */}
          <TestimonialsSection />

          {/* ⑪ Cotizar */}
          <PricingCalculator />

          {/* ⑫ FAQ */}
          <FAQSection />

          {/* ⑬ CTA */}
          <CTASection />

          {/* ⑭ Footer */}
          <FooterSection />

          {/* Floating */}
          <ChatbotWidget />

        </Suspense>

        <WhatsAppButton />
      </div>
    </>
  );
};

export default Index;
