import { services } from "@/lib/data/services";
import { SectionHeading } from "@/components/section-heading";
import { MagicCard } from "@/components/bento/magic-card";

/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  SERVICES GRID — Oferta B2B (Server Component puro).
 *
 *  Traduce el stack técnico a entregables de negocio que un cliente/empresa
 *  puede contratar. Server Component: solo emite el marcado; cada tarjeta
 *  delega la interacción (luz hover) en <MagicCard> (client island aislada),
 *  igual que la BentoGrid de capacidades.
 * ─────────────────────────────────────────────────────────────────────────────
 */
export function ServicesGrid() {
  return (
    <section id="servicios" className="px-6 py-24 sm:py-32">
      <SectionHeading
        eyebrow="servicios"
        title={
          <>
            Servicios que <span className="italic text-primary">mueven métricas</span>
          </>
        }
        description="No tecnologías sueltas: resultados verificables. Esto es lo que un cliente o empresa contrata con IAZR — calidad, rendimiento e IA integrados en producto."
      />

      <div className="mx-auto grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {services.map(({ id, title, description, tags, icon: Icon, cta }) => (
          <MagicCard key={id} className="flex flex-col">
            <div className="flex items-start justify-between gap-4">
              <span className="inline-flex size-11 items-center justify-center rounded-lg border border-primary/25 bg-primary/5 text-primary">
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground/60">
                {"// " + id.replace(/-/g, "_")}
              </span>
            </div>

            <h3 className="mt-5 text-lg font-semibold tracking-tight text-foreground">
              {title}
            </h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
              {description}
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-md border border-primary/20 bg-primary/5 px-2 py-1 font-mono text-[11px] text-primary"
                >
                  {tag}
                </span>
              ))}
            </div>

            <a
              href={cta.href}
              className="mt-5 inline-flex items-center gap-1.5 font-mono text-sm text-primary transition-colors hover:text-accent"
            >
              {cta.label}
              <span aria-hidden="true" className="caret-blink">
                _
              </span>
            </a>
          </MagicCard>
        ))}
      </div>
    </section>
  );
}
