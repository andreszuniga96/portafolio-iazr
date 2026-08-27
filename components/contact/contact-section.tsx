import { Mail } from "lucide-react";

import { siteConfig } from "@/lib/data/site";
import { Avatar } from "@/components/avatar";
import { SectionHeading } from "@/components/section-heading";
import { ContactForm } from "@/components/contact/contact-form";
import { GitHubIcon, LinkedInIcon, WhatsAppIcon } from "@/components/icons";

/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  CONTACT SECTION — Canal de conversión B2B (Server Component).
 *  El encabezado, la tarjeta de contexto y la estructura se pre-renderizan; solo
 *  <ContactForm> (useActionState + Server Action) es una hoja client aislada.
 * ─────────────────────────────────────────────────────────────────────────────
 */
export function ContactSection() {
  return (
    <section id="contacto" className="px-6 py-24 sm:py-32">
      <SectionHeading
        eyebrow="contacto"
        title={
          <>
            ¿Listo para una{" "}
            <span className="italic text-primary">auditoría técnica</span>?
          </>
        }
        description="Cuéntame el contexto de tu producto o equipo: recibo la solicitud, la valido en el servidor y te respondo con un plan de acción concreto en menos de 24 horas hábiles."
      />

      <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[1fr_1.35fr]">
        {/* Contexto del canal */}
        <aside className="flex flex-col gap-6">
          {/* Tarjeta de identidad: quién responde al otro lado del formulario */}
          <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5">
            {/* Retrato reutilizable (Avatar) — sin priority: está bajo el
                pliegue, el navegador lo carga lazy. */}
            <Avatar
              src="/perfil.png"
              alt="Retrato de Iván Andrés Zúñiga (IAZR)"
              sizeClass="size-16"
            />
            <div className="min-w-0">
              <p className="font-semibold tracking-tight">
                {siteConfig.author.name}
              </p>
              <p className="mt-0.5 font-mono text-xs text-muted-foreground">
                Director Tecnológico · Full-Stack Developer
              </p>
              <p className="mt-1 font-mono text-[10px] text-primary">
                <span className="mr-1.5 inline-block size-1.5 rounded-full bg-success align-middle shadow-[0_0_6px_var(--success)]" />
                disponible · {siteConfig.timezoneShort}
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">
              Canales directos
            </p>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <a
                  href={siteConfig.socials.email}
                  className="inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-primary"
                >
                  <Mail className="size-4" aria-hidden="true" />
                  <span className="font-mono">{siteConfig.author.email}</span>
                </a>
              </li>
              <li>
                <a
                  href={siteConfig.socials.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-primary"
                >
                  <GitHubIcon className="size-4" aria-hidden="true" />
                  github.com/andreszuniga96
                </a>
              </li>
              <li>
                <a
                  href={siteConfig.socials.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-primary"
                >
                  <LinkedInIcon className="size-4" aria-hidden="true" />
                  linkedin.com/in/iazr96
                </a>
              </li>
              <li>
                <a
                  href={siteConfig.socials.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-primary"
                >
                  <WhatsAppIcon className="size-4" aria-hidden="true" />
                  {siteConfig.author.whatsappDisplay}
                </a>
              </li>
            </ul>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">
              Método de trabajo
            </p>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
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

          <div className="rounded-2xl border border-border/70 bg-terminal p-5 font-mono text-xs leading-relaxed text-muted-foreground">
            <p className="text-success">$ curl -s {siteConfig.url}/auditoria</p>
            <p className="mt-1 text-muted-foreground/80">
              {"{"} "sla": "&lt;24h", "cobertura": "global", "rol": "Director Tecnológico", "certificaciones": "11" {"}"}
            </p>
          </div>
        </aside>

        {/* Formulario (Server Action + Zod) */}
        <div className="relative rounded-2xl border border-border bg-card p-6 sm:p-8">
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
