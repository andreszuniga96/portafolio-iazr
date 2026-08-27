import { siteConfig } from "@/lib/data/site";
import { Avatar } from "@/components/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GitHubIcon, LinkedInIcon } from "@/components/icons";

/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  ABOUT HEADER — Cabecera de la página /about (Server Component puro).
 *
 *  Sin "use client": no manipula el DOM, así que se pre-renderiza en el
 *  cascarón estático (PPR). Reutiliza el mismo lenguaje visual del hero de la
 *  portada (retrato circular con halo, wordmark, insignia terminal) pero con
 *  una disposición orientada a la identidad verificable del ingeniero.
 *
 *  Los datos (nombre, GitHub, LinkedIn, email) provienen de lib/data/site.ts:
 *  cambiar allí propaga a TODO el ecosistema (layout, footer, JSON-LD, chat).
 * ─────────────────────────────────────────────────────────────────────────────
 */

export function AboutHeader() {
  return (
    <header className="relative overflow-hidden px-6 pb-16 pt-32 sm:pt-36">
      {/* Halos de fondo (capas CSS en el compositor, sin JS) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      >
        <div
          className="absolute -left-[8%] top-[-12%] h-[46vh] w-[38vw] rounded-full"
          style={{
            background:
              "radial-gradient(closest-side, color-mix(in oklch, var(--primary) 20%, transparent), transparent 70%)",
            filter: "blur(80px)",
          }}
        />
        <div
          className="absolute -right-[10%] bottom-[-14%] h-[42vh] w-[34vw] rounded-full"
          style={{
            background:
              "radial-gradient(closest-side, color-mix(in oklch, var(--accent) 16%, transparent), transparent 70%)",
            filter: "blur(90px)",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center text-center">
        {/* Retrato reutilizable (Avatar) — priority: LCP de esta página. */}
        <Avatar
          src="/perfil.png"
          alt="Retrato de Iván Andrés Zúñiga (IAZR)"
          sizeClass="size-28 sm:size-32"
          priority
          className="mb-7"
        />

        {/* Insignia de rol (estilo terminal) */}
        <Badge
          variant="terminal"
          className="max-w-[92vw] whitespace-normal px-4 py-1.5 text-center text-xs leading-snug"
        >
          <span className="size-1.5 shrink-0 rounded-full bg-success shadow-[0_0_8px_var(--success)]" />
          Director Tecnológico · Full-Stack Developer · Mentor Tech
        </Badge>

        <p className="mt-7 font-mono text-sm uppercase tracking-[0.5em] text-muted-foreground">
          $ whoami --verbose
        </p>

        {/* Wordmark de marca */}
        <h1 className="mt-3 font-display text-5xl font-bold tracking-tight sm:text-6xl">
          IAZR<span className="text-primary">_</span>
        </h1>

        <p className="mt-3 font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          {siteConfig.author.name}
        </p>

        {/* Disponibilidad verificable */}
        <p className="mt-4 inline-flex items-center gap-2 rounded-md border border-success/30 bg-success/5 px-3 py-1 font-mono text-xs text-success">
          <span className="size-1.5 rounded-full bg-success shadow-[0_0_8px_var(--success)]" />
          disponible para proyectos · franja {siteConfig.timezoneShort}
        </p>

        <p className="mt-6 max-w-2xl text-pretty leading-relaxed text-muted-foreground">
          Ingeniero de Sistemas y Telecomunicaciones, Magíster en Administración y
          Especialista en Inteligencia Artificial (UNIR, en curso). Perfil híbrido
          técnico-estratégico: dirección de innovación digital, desarrollo Full-Stack,
          IA aplicada y mentoría tech con impacto nacional en Colombia y remoto global.
        </p>

        {/* CTAs de conversión */}
        <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Button variant="cyber" size="lg" asChild>
            <a href="/#proyectos">Ver casos de éxito</a>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <a href="/#contacto">Iniciar auditoría técnica</a>
          </Button>
          <div className="mt-2 flex items-center justify-center gap-3 sm:mt-0 sm:ml-1">
            <a
              href={siteConfig.socials.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub de IAZR"
              className="inline-flex size-11 items-center justify-center rounded-md border border-border/70 text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
            >
              <GitHubIcon className="size-4" />
            </a>
            <a
              href={siteConfig.socials.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn de IAZR"
              className="inline-flex size-11 items-center justify-center rounded-md border border-border/70 text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
            >
              <LinkedInIcon className="size-4" />
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
