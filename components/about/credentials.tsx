import { Award, Bot, GraduationCap, ShieldCheck, Workflow } from "lucide-react";

import { certifications, education } from "@/lib/data/experience";
import { SectionHeading } from "@/components/section-heading";

/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  CREDENTIALS — Formación, certificaciones y formación continua (Server).
 *
 *  Reutiliza lib/data/experience.ts (fuente única de verdad compartida con el
 *  JSON-LD Person del layout): los títulos de postgrado e ingeniería se pintan
 *  desde los datos, las 11 certificaciones internacionales se agrupan por
 *  emisor (Microsoft, Huawei, Google) y dos tarjetas de "formación continua"
 *  resumen los dominios de especialización reales del perfil.
 * ─────────────────────────────────────────────────────────────────────────────
 */

const continuousLearning = [
  {
    id: "datos-ia",
    title: "Datos & IA aplicada",
    detail: "Analítica con Power BI y SQL, bases de datos PostgreSQL/MongoDB y Machine Learning aplicado a producto y decisiones de negocio.",
    icon: Bot,
    tags: ["Power BI", "SQL", "Machine Learning"],
  },
  {
    id: "gestion-estrategica",
    title: "Gestión estratégica & mentoría",
    detail: "Formulación de proyectos (MGA), PDM, Scrum, CRM y BPM — con mentoría a +500 beneficiarios en habilidades digitales (Talento TECH).",
    icon: Workflow,
    tags: ["MGA", "Scrum", "CRM", "Talento TECH"],
  },
];

export function Credentials() {
  return (
    <section id="credenciales" className="px-6 py-24 sm:py-32">
      <SectionHeading
        eyebrow="credenciales"
        title={
          <>
            Certificaciones <span className="italic text-primary">verificables</span>
          </>
        }
        description="Formación formal auditada, 11 certificaciones internacionales y dominios de especialización continua: cada credencial aquí se puede comprobar contra el perfil público del ingeniero."
      />

      {/* ── Formación formal (títulos del CV) ─────────────────────────── */}
      <div className="mx-auto grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {education.map((entry) => (
          <article
            key={entry.id}
            className="group relative flex flex-col rounded-2xl border border-border bg-card p-6 transition-colors hover:border-primary/40"
          >
            <span className="inline-flex size-11 items-center justify-center rounded-lg border border-primary/25 bg-primary/5 text-primary">
              {entry.id === "unir-ia" ? (
                <ShieldCheck className="size-5" aria-hidden="true" />
              ) : (
                <GraduationCap className="size-5" aria-hidden="true" />
              )}
            </span>
            <h3 className="mt-5 font-semibold tracking-tight">{entry.degree}</h3>
            <p className="mt-1 font-mono text-xs text-primary">{entry.institution}</p>
            <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
              {entry.description}
            </p>
            <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground/60">
              {"// " + entry.period}
            </p>
          </article>
        ))}
      </div>

      {/* ── Certificaciones internacionales (11 credenciales) ─────────── */}
      <div className="mx-auto mt-14 max-w-5xl">
        <p className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">
          // certificaciones internacionales · 11
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {certifications.map((group) => (
            <article
              key={group.id}
              className="group relative flex flex-col rounded-2xl border border-border bg-card p-6 transition-colors hover:border-primary/40"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="inline-flex size-11 items-center justify-center rounded-lg border border-accent/30 bg-accent/10 text-accent">
                  <Award className="size-5" aria-hidden="true" />
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground/60">
                  {group.credentials.length} credenciales
                </span>
              </div>
              <h3 className="mt-5 font-semibold tracking-tight">{group.vendor}</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                {group.description}
              </p>
              <ul className="mt-4 flex-1 space-y-2">
                {group.credentials.map((credential) => (
                  <li
                    key={credential}
                    className="flex items-start gap-2 text-sm leading-snug text-foreground/90"
                  >
                    <span
                      aria-hidden="true"
                      className="mt-1.5 size-1 shrink-0 rounded-full bg-primary/70"
                    />
                    {credential}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>

      {/* ── Formación continua ────────────────────────────────────────── */}
      <div className="mx-auto mt-14 grid max-w-5xl gap-4 sm:grid-cols-2">
        {continuousLearning.map((item) => {
          const Icon = item.icon;
          return (
            <article
              key={item.id}
              className="group relative flex flex-col rounded-2xl border border-border bg-card p-6 transition-colors hover:border-accent/40"
            >
              <span className="inline-flex size-11 items-center justify-center rounded-lg border border-accent/30 bg-accent/10 text-accent">
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <h3 className="mt-5 font-semibold tracking-tight">{item.title}</h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                {item.detail}
              </p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-md border border-primary/20 bg-primary/5 px-2 py-0.5 font-mono text-[10px] text-primary"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
