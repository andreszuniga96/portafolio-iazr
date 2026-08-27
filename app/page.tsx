import { Suspense } from "react";

import { HeroSection } from "@/components/hero/hero-section";
import { Marquee } from "@/components/marquee";
import { BentoGrid } from "@/components/bento/bento-grid";
import { ServicesGrid } from "@/components/services/services-grid";
import { GlobeSection } from "@/components/three/globe-section";
import { ProjectParallax } from "@/components/projects/project-parallax";
import { Timeline } from "@/components/timeline";
import { TerminalChat } from "@/components/chat/terminal-chat";
import { ContactSection } from "@/components/contact/contact-section";
import { SectionHeading } from "@/components/section-heading";
import { Footer } from "@/components/footer";
import { stackRowA, stackRowB, stackRowC } from "@/lib/data/stack";

/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  PÁGINA PRINCIPAL — Composición de secciones.
 *
 *  PARTIAL PRERENDERING (PPR):
 *  · `export const experimental_ppr = true` opta a esta ruta por el modo de
 *    adopción incremental configurado en next.config.ts.
 *  · Efecto: TODO el cascarón estático (hero, marquesinas, bento, proyectos,
 *    trayectoria, footer) se compila a HTML puro y se entrega al borde casi
 *    instantáneamente (FCP ≈ 0 ms).
 *  · El único agujero dinámico es el TerminalChat (llamada de IA por streaming):
 *    se aísla en un <Suspense> para que su HTML se transmita por separado sin
 *    bloquear el primer pintado.
 *
 *  Server Components puros (sin "use client"): Marquee, BentoGrid, Timeline,
 *  SectionHeading, Footer.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export const experimental_ppr = true;

/** Fallback estático del chat mientras el Suspense resuelve (skeleton PPR). */
function TerminalSkeleton() {
  return (
    <div
      aria-label="Cargando terminal de IA"
      className="mx-auto h-[560px] w-full max-w-3xl animate-pulse overflow-hidden rounded-xl border border-border bg-terminal"
    >
      <div className="h-11 border-b border-border/70 bg-secondary/40" />
      <div className="space-y-3 px-5 py-6">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-4 rounded bg-secondary/60"
            style={{ width: `${82 - i * 12}%` }}
          />
        ))}
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <>
      {/* Cabecera cinemática (client: Framer Motion + Lenis anchors) */}
      <HeroSection />

      {/* Marquesinas de stack — CSS puro, Server Components */}
      <section aria-label="Stack tecnológico" className="space-y-0 py-10">
        <Marquee items={stackRowA} reverse className="py-2" duration={38} />
        <Marquee items={stackRowB} className="py-2" duration={46} />
        {/* Tercera fila: herramientas y plataformas de producción */}
        <Marquee items={stackRowC} reverse className="py-2" duration={40} />
      </section>

      {/* Interludio 3D — red neuronal global (R3F resiliente, offscreen pause) */}
      <GlobeSection />

      {/* Esquema de destrezas — Bento asimétrico (Full-Stack · Datos/IA · Gestión) */}
      <section id="capacidades" className="px-6 py-24 sm:py-32">
        <SectionHeading
          eyebrow="capacidades"
          title={
            <>
              Cuatro dominios, un solo{" "}
              <span className="italic text-primary">estándar</span>
            </>
          }
          description="Desarrollo Full-Stack, Datos & IA, Infraestructura/Cloud y gestión estratégica: capacidades verificadas en una cuadrícula Bento asimétrica y comprobable."
        />
        <div className="mx-auto max-w-6xl">
          <BentoGrid />
        </div>
      </section>

      {/* Oferta B2B — traduce el stack a entregables de negocio */}
      <ServicesGrid />

      {/* Casos de éxito — parallax 3D */}
      <ProjectParallax />

      {/* Trayectoria verificable */}
      <Timeline />

      {/* Motor conversacional — único agujero dinámico (Suspense/PPR) */}
      <section id="conversacion" className="px-6 py-24 sm:py-32">
        <SectionHeading
          eyebrow="conversacion"
          title="Interroga a la red neuronal de IAZR"
          description="¿Viabilidad técnica? ¿Disponibilidad en tu franja horaria? Pregúntale directamente al asistente: responde en tiempo real con el contexto verificado del ingeniero."
        />
        <Suspense fallback={<TerminalSkeleton />}>
          <TerminalChat />
        </Suspense>
      </section>

      {/* Canal de conversión B2B — Server Action + validación Zod */}
      <ContactSection />

      <Footer />
    </>
  );
}
