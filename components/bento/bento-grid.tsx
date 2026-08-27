import { ArrowRight } from "lucide-react";

import { skills } from "@/lib/data/skills";
import { cn } from "@/lib/utils";
import { MagicCard } from "@/components/bento/magic-card";

/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  BENTO GRID — Esquema de destrezas (Bento Grid asimétrico, Aceternity).
 *
 *  Server Component: solo emite el marcado; cada celda delega la interacción
 *  (luz hover) en <MagicCard> (client island aislada). La asimetría nace del
 *  colSpan declarado en lib/data/skills.ts:
 *
 *    [2+1]        QA destacado (span 2) + Backend
 *    [1+2]        Datos/IA + Infraestructura destacado (span 2)
 *    [1+1+1]      Full-Stack + Gestión + CTA de contacto
 *
 *  Las celdas aparecen con stagger sutil (whileInView de MagicCard).
 * ─────────────────────────────────────────────────────────────────────────────
 */

export function BentoGrid() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {skills.map((tile, index) => {
        const Icon = tile.icon;
        return (
          <MagicCard
            key={tile.id}
            featured={tile.featured}
            // El stagger es incremental: cada celda se retrasa 60ms más.
            className={cn(
              tile.colSpan === 2 && "sm:col-span-2",
              // Índices pares/impares alternan un desplazamiento mínimo para
              // romper la monotonía de la entrada.
              index % 2 === 0 ? "sm:translate-y-0" : "sm:translate-y-2"
            )}
          >
            <div className="flex items-start justify-between gap-4">
              <span className="inline-flex size-11 items-center justify-center rounded-lg border border-primary/25 bg-primary/5 text-primary">
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground/60">
                {"// " + tile.id.replace(/-/g, "_")}
              </span>
            </div>

            <h3 className="mt-5 text-lg font-semibold tracking-tight text-foreground sm:text-xl">
              {tile.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {tile.description}
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              {tile.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-md border border-primary/20 bg-primary/5 px-2 py-1 font-mono text-[11px] text-primary"
                >
                  {tag}
                </span>
              ))}
            </div>
          </MagicCard>
        );
      })}

      {/* CTA que completa la retícula (1 col) — convierte visitante en lead */}
      <MagicCard className="flex flex-col justify-between">
        <div className="flex items-start justify-between gap-4">
          <span className="inline-flex size-11 items-center justify-center rounded-lg border border-accent/30 bg-accent/10 text-accent">
            <ArrowRight className="size-5" aria-hidden="true" />
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground/60">
            {"// siguiente_paso"}
          </span>
        </div>
        <h3 className="mt-5 text-lg font-semibold tracking-tight sm:text-xl">
          ¿Tu equipo necesita este estándar?
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Solicita una auditoría técnica de 1–2 semanas y recibe un roadmap
          accionable en menos de 24 horas.
        </p>
        <a
          href="#contacto"
          className="mt-5 inline-flex items-center gap-1.5 font-mono text-sm text-primary transition-colors hover:text-accent"
        >
          iniciar_auditoría()
          <span aria-hidden="true" className="caret-blink">
            _
          </span>
        </a>
      </MagicCard>
    </div>
  );
}
