import { Clock, Globe, Mail, MapPin, MessageSquareText } from "lucide-react";

import { siteConfig } from "@/lib/data/site";
import { SectionHeading } from "@/components/section-heading";
import { Button } from "@/components/ui/button";
import { GitHubIcon, LinkedInIcon, WhatsAppIcon } from "@/components/icons";

/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  CONTACT DIRECT — Datos de contacto verificables (Server Component puro).
 *
 *  Muestra los canales reales (email, GitHub, LinkedIn), la cobertura
 *  geográfica y el SLA de respuesta, con un CTA hacia el formulario de la
 *  portada (/contacto) donde vive la Server Action con validación Zod.
 * ─────────────────────────────────────────────────────────────────────────────
 */

const channels = [
  {
    label: "Correo corporativo",
    value: siteConfig.author.email,
    href: siteConfig.socials.email,
    icon: Mail,
    mono: true,
  },
  {
    label: "GitHub",
    value: "github.com/andreszuniga96",
    href: siteConfig.socials.github,
    icon: GitHubIcon,
    mono: true,
  },
  {
    label: "LinkedIn",
    value: "linkedin.com/in/iazr96",
    href: siteConfig.socials.linkedin,
    icon: LinkedInIcon,
    mono: true,
  },
  {
    label: "WhatsApp",
    value: siteConfig.author.whatsappDisplay,
    href: siteConfig.socials.whatsapp,
    icon: WhatsAppIcon,
    mono: true,
  },
];

const facts = [
  {
    icon: MapPin,
    title: "Cobertura",
    detail: siteConfig.location,
  },
  {
    icon: Clock,
    title: "Franja horaria",
    detail: `${siteConfig.timezone} con solape a Europa y América`,
  },
  {
    icon: MessageSquareText,
    title: "Respuesta",
    detail: "Menos de 24 horas hábiles",
  },
  {
    icon: Globe,
    title: "Idiomas",
    detail: "Español (nativo) · Inglés B1 certificado / B2 conversacional",
  },
];

export function ContactDirect() {
  return (
    <section id="contacto-directo" className="px-6 py-24 sm:py-32">
      <SectionHeading
        eyebrow="contacto"
        title={
          <>
            Datos de <span className="italic text-primary">contacto</span>
          </>
        }
        description="Canales directos y contexto operativo para coordinar una primera llamada o una auditoría técnica."
      />

      <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[1.2fr_1fr]">
        {/* Canales directos */}
        <div className="flex flex-col gap-3">
          {channels.map(({ label, value, href, icon: Icon, mono }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith("http") ? "_blank" : undefined}
              rel="noopener noreferrer"
              className="group flex items-center gap-4 rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary/40"
            >
              <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-lg border border-primary/25 bg-primary/5 text-primary">
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <span className="min-w-0">
                <span className="block text-xs text-muted-foreground">{label}</span>
                <span
                  className={
                    "block truncate font-medium text-foreground transition-colors group-hover:text-primary " +
                    (mono ? "font-mono text-sm" : "text-sm")
                  }
                >
                  {value}
                </span>
              </span>
            </a>
          ))}
        </div>

        {/* Contexto operativo */}
        <div className="rounded-2xl border border-border bg-card p-6">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Contexto operativo
          </p>
          <ul className="mt-5 space-y-5">
            {facts.map(({ icon: Icon, title, detail }) => (
              <li key={title} className="flex gap-4">
                <span className="mt-0.5 inline-flex size-9 shrink-0 items-center justify-center rounded-lg border border-border/70 bg-secondary/40 text-primary">
                  <Icon className="size-4" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-sm font-medium text-foreground">{title}</p>
                  <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">
                    {detail}
                  </p>
                </div>
              </li>
            ))}
          </ul>

          <Button variant="cyber" size="lg" asChild className="mt-7 w-full">
            <a href="/#contacto">Solicitar auditoría técnica</a>
          </Button>
        </div>
      </div>
    </section>
  );
}
