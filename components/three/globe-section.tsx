import { GlobeCanvasMount } from "@/components/three/globe-canvas-mount";
import { SectionHeading } from "@/components/section-heading";

/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  GLOBE SECTION — Interludio 3D "Red global".
 *  Server Component: emite el cascarón estático (encabezado + contenedor con
 *  aspect-ratio fijo). La interactividad WebGL vive confinada en la hoja
 *  client <GlobeCanvasMount> (ssr:false) — aislamiento quirúrgico del cliente.
 * ─────────────────────────────────────────────────────────────────────────────
 */
export function GlobeSection() {
  return (
    <section id="red-global" className="px-6 py-24 sm:py-32">
      <SectionHeading
        eyebrow="red_global"
        title={
          <>
            La <span className="italic text-primary">red neuronal</span>{" "}
            detrás del Director Tecnológico
          </>
        }
        description="Una esfera de 2.600 partículas y conexiones neurales renderizada en WebGL (React Three Fiber). Sin activos externos, con degradación elegante en hardware limitado y pausa automática fuera de la ventana gráfica."
      />

      <div className="mx-auto max-w-4xl">
        {/* aspect-ratio fijo: el navegador reserva el espacio antes de cargar el
            chunk 3D → CLS erradicado incluso con WebGL diferido. */}
        <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-border bg-card sm:aspect-[16/8]">
          <GlobeCanvasMount />
        </div>

        <p className="mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-1 font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
          <span>r3f · three.js</span>
          <span aria-hidden="true" className="text-primary/50">
            ✦
          </span>
          <span>2600 partículas</span>
          <span aria-hidden="true" className="text-primary/50">
            ✦
          </span>
          <span>draco-ready</span>
          <span aria-hidden="true" className="text-primary/50">
            ✦
          </span>
          <span>webgl-context-loss-safe</span>
        </p>
      </div>
    </section>
  );
}
