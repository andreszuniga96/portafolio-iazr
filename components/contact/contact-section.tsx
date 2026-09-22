import { Mail, MessageSquare, ExternalLink, ArrowRight, Clock, Globe, Zap } from "lucide-react";

import { siteConfig } from "@/lib/data/site";
import { Avatar } from "@/components/avatar";
import { SectionHeading } from "@/components/section-heading";
import { GitHubIcon, LinkedInIcon, WhatsAppIcon } from "@/components/icons";

/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  CONTACT SECTION v3.0 — Hub de canales directos (Server Component).
 *
 *  Rediseño sin dependencia de Resend: el visitante contacta directamente
 *  por el canal que prefiera (email, WhatsApp, LinkedIn). Más rápido, más
 *  honesto y sin fricción de formulario.
 *
 *  Estructura:
 *   · Columna izquierda: tarjeta de identidad + métricas de respuesta.
 *   · Columna derecha: canales de contacto accionables (CTA premium) + SLA.
 * ─────────────────────────────────────────────────────────────────────────────
 */

const contactChannels = [
  {
    id: "email",
    icon: Mail,
    label: "Email directo",
    value: siteConfig.author.email,
    href: siteConfig.socials.email,
    description: "Correo profesional — respuesta en <24 h hábiles",
    cta: "Escribir ahora",
    accent: "from-primary/20 to-primary/5 border-primary/30 hover:border-primary/60",
    iconAccent: "text-primary bg-primary/10 border-primary/20",
  },
  {
    id: "whatsapp",
    icon: WhatsAppIcon,
    label: "WhatsApp",
    value: siteConfig.author.whatsappDisplay,
    href: siteConfig.socials.whatsapp,
    description: "Respuesta ágil para consultas urgentes",
    cta: "Iniciar chat",
    accent: "from-[oklch(0.65_0.18_142)]/20 to-[oklch(0.65_0.18_142)]/5 border-[oklch(0.65_0.18_142)]/30 hover:border-[oklch(0.65_0.18_142)]/60",
    iconAccent: "text-[oklch(0.65_0.18_142)] bg-[oklch(0.65_0.18_142)]/10 border-[oklch(0.65_0.18_142)]/20",
  },
  {
    id: "linkedin",
    icon: LinkedInIcon,
    label: "LinkedIn",
    value: "linkedin.com/in/iazr96",
    href: siteConfig.socials.linkedin,
    description: "Perfil profesional verificado",
    cta: "Ver perfil",
    accent: "from-[oklch(0.55_0.18_250)]/20 to-[oklch(0.55_0.18_250)]/5 border-[oklch(0.55_0.18_250)]/30 hover:border-[oklch(0.55_0.18_250)]/60",
    iconAccent: "text-[oklch(0.55_0.18_250)] bg-[oklch(0.55_0.18_250)]/10 border-[oklch(0.55_0.18_250)]/20",
  },
  {
    id: "github",
    icon: GitHubIcon,
    label: "GitHub",
    value: "github.com/andreszuniga96",
    href: siteConfig.socials.github,
    description: "Proyectos verificados en producción",
    cta: "Ver código",
    accent: "from-foreground/10 to-foreground/5 border-border hover:border-foreground/40",
    iconAccent: "text-foreground bg-secondary border-border",
  },
];

const slaFeatures = [
  {
    icon: Clock,
    label: "SLA de respuesta",
    value: "< 24 h hábiles",
  },
  {
    icon: Globe,
    label: "Cobertura",
    value: "Remoto global · GMT-5",
  },
  {
    icon: Zap,
    label: "Arranque de proyecto",
    value: "1–2 semanas",
  },
];

export function ContactSection() {
  return (
    <section id="contacto" className="px-6 py-24 sm:py-32">
      <SectionHeading
        eyebrow="contacto"
        title={
          <>
            Hablemos de tu{" "}
            <span className="italic text-primary">próximo proyecto</span>
          </>
        }
        description="Elige el canal que prefieras. Respondo con un plan de acción concreto en menos de 24 horas hábiles."
      />

      <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[1fr_1.4fr]">
        {/* ── Columna izquierda: identidad + SLA ─────────────────── */}
        <aside className="flex flex-col gap-5">
          {/* Tarjeta de identidad */}
          <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-6">
            {/* Glow de fondo */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-8 -top-8 size-32 rounded-full bg-primary/10 blur-2xl"
            />
            <div className="relative flex items-center gap-4">
              <Avatar
                src="/perfil.png"
                alt="Retrato de Iván Andrés Zúñiga (IAZR)"
                sizeClass="size-16 shrink-0"
              />
              <div className="min-w-0">
                <p className="font-semibold tracking-tight">
                  {siteConfig.author.name}
                </p>
                <p className="mt-0.5 font-mono text-xs text-muted-foreground">
                  Director Tecnológico · Full-Stack Developer
                </p>
                <p className="mt-1.5 font-mono text-[10px] text-primary">
                  <span className="mr-1.5 inline-block size-1.5 rounded-full bg-success align-middle shadow-[0_0_6px_var(--success)]" />
                  disponible · {siteConfig.timezoneShort}
                </p>
              </div>
            </div>

            {/* Bio corta */}
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              7+ años transformando ideas en producto. Ingeniero de Sistemas,
              Magíster en Administración y Especialista en IA.
            </p>
          </div>

          {/* SLA & capacidades */}
          <div className="rounded-2xl border border-border bg-card p-6">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">
              Compromisos verificados
            </p>
            <ul className="mt-4 space-y-4">
              {slaFeatures.map(({ icon: Icon, label, value }) => (
                <li key={label} className="flex items-center gap-3">
                  <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg border border-border bg-secondary text-primary">
                    <Icon className="size-3.5" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                      {label}
                    </p>
                    <p className="text-sm font-medium">{value}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Terminal de estado */}
          <div className="rounded-2xl border border-border/70 bg-terminal p-5 font-mono text-xs leading-relaxed text-muted-foreground">
            <p className="text-success">$ ping iazr.code@gmail.com</p>
            <p className="mt-1 text-muted-foreground/80">
              {"{"} &quot;status&quot;: &quot;online&quot;, &quot;sla&quot;: &quot;&lt;24h&quot;, &quot;stack&quot;: &quot;full-stack+ia&quot; {"}"}
            </p>
            <p className="mt-1">
              <span className="text-primary">→</span> Listo para iniciar conversación…
              <span className="caret-blink text-primary">▊</span>
            </p>
          </div>
        </aside>

        {/* ── Columna derecha: canales de contacto ───────────────── */}
        <div className="flex flex-col gap-4">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Canales directos
          </p>

          {contactChannels.map(({ id, icon: Icon, label, value, href, description, cta, accent, iconAccent }) => (
            <a
              key={id}
              href={href}
              target={href.startsWith("mailto") ? undefined : "_blank"}
              rel="noopener noreferrer"
              aria-label={`Contactar por ${label}`}
              className={`group relative overflow-hidden rounded-2xl border bg-gradient-to-br p-5 transition-all duration-300 hover:shadow-[0_8px_32px_-8px_rgba(0,0,0,0.3)] hover:-translate-y-0.5 ${accent}`}
            >
              <div className="flex items-center gap-4">
                <span className={`inline-flex size-10 shrink-0 items-center justify-center rounded-xl border ${iconAccent}`}>
                  <Icon className="size-5" aria-hidden="true" />
                </span>

                <div className="min-w-0 flex-1">
                  <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                    {label}
                  </p>
                  <p className="mt-0.5 truncate font-medium text-foreground">
                    {value}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {description}
                  </p>
                </div>

                <span className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-current/20 bg-current/5 px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider transition-all duration-200 group-hover:gap-2.5">
                  {cta}
                  <ArrowRight className="size-3 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true" />
                </span>
              </div>
            </a>
          ))}

          {/* Nota de método de trabajo */}
          <div className="mt-2 rounded-2xl border border-border/60 bg-secondary/30 p-5">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">
              Método de trabajo
            </p>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li className="flex gap-3">
                <span aria-hidden="true" className="mt-1.5 size-1 shrink-0 rounded-full bg-primary" />
                Auditoría inicial: arquitectura, riesgos y roadmap en 1–2 semanas.
              </li>
              <li className="flex gap-3">
                <span aria-hidden="true" className="mt-1.5 size-1 shrink-0 rounded-full bg-primary" />
                Ejecución por proyecto o retainer con reportes de calidad medibles.
              </li>
              <li className="flex gap-3">
                <span aria-hidden="true" className="mt-1.5 size-1 shrink-0 rounded-full bg-primary" />
                Coordinación remota global, franja {siteConfig.timezoneShort} con solape a Europa/América.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
