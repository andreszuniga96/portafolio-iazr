import { Briefcase, GraduationCap } from "lucide-react";

import { education, experience } from "@/lib/data/experience";
import { cn } from "@/lib/utils";

/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  TIMELINE — Trayectoria verificable (educación + experiencia).
 *
 *  Server Component puro: el contenido se pre-renderiza en el cascarón PPR.
 *  La línea vertical es un borde CSS (1px); cada nodo es un punto con acento
 *  cian. En escritorio las entradas alternan lado izquierdo/derecho; en móvil
 *  todo se alinea a la izquierda (sin desbordes horizontales).
 *
 *  Los datos provienen de lib/data/experience.ts (fuente única de verdad,
 *  compartida con el JSON-LD de Schema.org).
 * ─────────────────────────────────────────────────────────────────────────────
 */

type Entry = {
  kind: "work" | "education";
  role: string;
  org: string;
  period: string;
  description: string;
  highlights?: string[];
};

const entries: Entry[] = [
  ...experience.map((e) => ({
    kind: "work" as const,
    role: e.role,
    org: e.org,
    period: e.period,
    description: e.description,
    highlights: e.highlights,
  })),
  ...education.map((e) => ({
    kind: "education" as const,
    role: e.degree,
    org: e.institution,
    period: e.period,
    description: e.description,
  })),
];

export function Timeline() {
  return (
    <section id="trayectoria" className="px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-4xl">
        <div className="relative">
          {/* Línea vertical central (escritorio) / izquierda (móvil) */}
          <div
            aria-hidden="true"
            className="absolute inset-y-0 left-4 w-px bg-gradient-to-b from-primary/60 via-border to-transparent md:left-1/2"
          />

          <ol className="space-y-12">
            {entries.map((entry, index) => {
              const alignLeft = index % 2 === 0;
              return (
                <li key={`${entry.kind}-${entry.role}`} className="relative">
                  {/* Nodo de la línea temporal */}
                  <span
                    aria-hidden="true"
                    className="absolute left-4 top-6 size-2.5 -translate-x-1/2 rounded-full bg-primary shadow-[0_0_12px_var(--primary)] md:left-1/2"
                  />

                  <div
                    className={cn(
                      "pl-12 md:w-1/2 md:pl-0",
                      alignLeft
                        ? "md:pr-12 md:text-right"
                        : "md:ml-auto md:pl-12"
                    )}
                  >
                    <article className="rounded-2xl border border-border bg-card p-6 transition-colors hover:border-primary/30">
                      <div
                        className={cn(
                          "flex flex-wrap items-center gap-2",
                          alignLeft && "md:justify-end"
                        )}
                      >
                        <span className="inline-flex items-center gap-1.5 rounded-md border border-primary/25 bg-primary/5 px-2 py-1 font-mono text-[11px] text-primary">
                          {entry.kind === "work" ? (
                            <Briefcase className="size-3" aria-hidden="true" />
                          ) : (
                            <GraduationCap className="size-3" aria-hidden="true" />
                          )}
                          {entry.period}
                        </span>
                      </div>

                      <h3 className="mt-3 text-lg font-semibold tracking-tight">
                        {entry.role}
                      </h3>
                      <p className="font-mono text-sm text-primary">{entry.org}</p>
                      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                        {entry.description}
                      </p>

                      {entry.highlights ? (
                        <ul className="mt-4 space-y-1.5">
                          {entry.highlights.map((item) => (
                            <li
                              key={item}
                              className="flex gap-2 text-xs leading-relaxed text-muted-foreground/90"
                            >
                              <span
                                aria-hidden="true"
                                className="mt-1.5 size-1 shrink-0 rounded-full bg-primary/70"
                              />
                              {item}
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </article>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
