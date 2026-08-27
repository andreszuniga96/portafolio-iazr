import { Mail } from "lucide-react";

import { siteConfig } from "@/lib/data/site";
import { GitHubIcon, LinkedInIcon, WhatsAppIcon } from "@/components/icons";

/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  FOOTER — Server Component puro.
 *  No manipula el DOM → se pre-renderiza en el cascarón PPR (cero JavaScript
 *  de cliente). Contiene marca, navegación, contacto y la firma técnica del
 *  stack que construye el sitio (autoreferencial: el footer demuestra la pila).
 * ─────────────────────────────────────────────────────────────────────────────
 */

export function Footer() {
  return (
    <footer
      data-slot="footer"
      className="border-t border-border/70 bg-background"
    >
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 md:grid-cols-3">
        {/* Marca */}
        <div>
          <p className="font-mono text-lg font-bold">
            IAZR<span className="text-primary">_</span>
          </p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
            {siteConfig.description}
          </p>
          <div className="mt-5 flex items-center gap-3">
            {[
              { icon: GitHubIcon, href: siteConfig.socials.github, label: "GitHub" },
              { icon: LinkedInIcon, href: siteConfig.socials.linkedin, label: "LinkedIn" },
              { icon: WhatsAppIcon, href: siteConfig.socials.whatsapp, label: "WhatsApp" },
              { icon: Mail, href: siteConfig.socials.email, label: "Email" },
            ].map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                aria-label={label}
                className="inline-flex size-9 items-center justify-center rounded-md border border-border/70 text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
              >
                <Icon className="size-4" />
              </a>
            ))}
          </div>
        </div>

        {/* Navegación */}
        <nav aria-label="Navegación del pie de página">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Secciones
          </p>
          <ul className="mt-4 space-y-2.5">
            {siteConfig.nav.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Contacto */}
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Contacto
          </p>
          <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
            <li>
              <a
                href={siteConfig.socials.email}
                className="transition-colors hover:text-primary"
              >
                {siteConfig.author.email}
              </a>
            </li>
            <li>
              <a
                href={siteConfig.socials.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-primary"
              >
                {siteConfig.author.whatsappDisplay}
              </a>
            </li>
            <li>{siteConfig.location}</li>
            <li className="font-mono text-xs text-muted-foreground/70">
              franja: {siteConfig.timezoneShort}
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border/50">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-6 py-5 text-center sm:flex-row sm:text-left">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} {siteConfig.author.name} — {siteConfig.name}.
            Todos los derechos reservados.
          </p>
          <p className="font-mono text-[10px] text-muted-foreground/60">
            next.js 15 · react 19 · tailwind v4 · r3f · gsap · zod · lenis
          </p>
        </div>
      </div>
    </footer>
  );
}
