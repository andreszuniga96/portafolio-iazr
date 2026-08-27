"use client";

import { motion } from "framer-motion";
import { ArrowDown, ClipboardCheck, FolderKanban } from "lucide-react";

import { BackgroundBeams } from "@/components/hero/background-beams";
import { BlurIn } from "@/components/hero/blur-in";
import { Avatar } from "@/components/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  HERO SECTION — Cabecera arquitectónica (estética Linear / neuroestética).
 *  Client Component (requiere DOM directo: Framer Motion + anclas Lenis).
 *
 *  Sistema tipográfico restringido aplicado:
 *   · H1 "IAZR" + titular de entrada → Geist Sans (font-display) — solidez
 *     geométrica (la especificación exige Geist Sans como fundamento).
 *   · Datos/métricas/terminal     → JetBrains Mono — identidad del ingeniero.
 *
 *  Estructura:
 *   1. Retrato del ingeniero (perfil.png vía next/image, priority → LCP).
 *   2. BackgroundBeams: fondo volumétrico (capas CSS en el compositor, no
 *      bloquean el hilo de pintura → protege LCP/INP).
 *   3. BlurIn: titular en cascada desenfoque → enfoque (Magic UI) que
 *      pronuncia "IAZR / Inteligencia Técnica & Arquitectura Full-Stack".
 *   4. CTAs duales: "Solicitar Auditoría Técnica" (#contacto) +
 *      "Explorar Proyectos" (#proyectos).
 *   5. Franja de métricas verificadas (7+ / 11 / 13 / 3).
 * ─────────────────────────────────────────────────────────────────────────────
 */

const stats = [
  { value: "7+", label: "Años de experiencia" },
  { value: "11", label: "Certificaciones internacionales" },
  { value: "13", label: "Roles profesionales" },
  { value: "3", label: "Títulos de postgrado" },
];

export function HeroSection() {
  return (
    <section
      id="inicio"
      className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden px-6 pb-20 pt-32"
    >
      <BackgroundBeams />

      <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center text-center">
        {/* Retrato del ingeniero — Avatar reutilizable; motion.div añade la
            entrada en escala. priority=true: es el LCP del hero. */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-7"
        >
          <Avatar
            src="/perfil.png"
            alt="Retrato de Iván Andrés Zúñiga (IAZR)"
            sizeClass="size-24 sm:size-28"
            priority
          />
        </motion.div>

        {/* Insignia de estado: "disponible para proyectos" estilo terminal */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
        >
          <Badge variant="terminal" className="max-w-[92vw] whitespace-normal px-4 py-1.5 text-center text-xs leading-snug">
            <span className="size-1.5 shrink-0 rounded-full bg-success shadow-[0_0_8px_var(--success)]" />
            Director Tecnológico · Full-Stack Developer · Mentor Tech
          </Badge>
        </motion.div>

        {/* Marca en mono con acento de gradiente */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.12 }}
          className="mt-8 font-mono text-sm uppercase tracking-[0.5em] text-muted-foreground"
        >
          $ whoami
        </motion.p>

        {/* Titular en cascada desenfoque → enfoque (Geist Sans 700) */}
        <BlurIn
          as="h1"
          text="IAZR"
          className="mt-3 font-display text-6xl font-bold tracking-tight sm:text-7xl md:text-8xl"
        />

        {/* Subtítulo de entrada con degradado cian/violeta. Se anima como un
            único elemento (sin spans inline-block): `background-clip: text`
            no recorta el degradado sobre hijos atómicos, así que el reveal
            usa opacity/translate en el propio h2. La cascada blur→focus la
            ejecuta el H1 (BlurIn) como exige la especificación. */}
        <motion.h2
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="mt-5 max-w-3xl text-balance font-display text-2xl font-semibold tracking-tight text-gradient-cyber sm:text-4xl md:text-5xl"
        >
          Tecnología, estrategia e IA aplicada a resultados
        </motion.h2>

        {/* Resumen de posicionamiento (Inter, cuerpo) */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.55 }}
          className="mt-8 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg"
        >
          Ingeniero de Sistemas y Telecomunicaciones, Magíster en Administración
          y Especialista en IA (UNIR). Transformación digital, desarrollo
          Full-Stack, IA aplicada y mentoría tech con impacto nacional.
        </motion.p>

        {/* CTAs duales */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-10 flex flex-col gap-4 sm:flex-row"
        >
          <Button variant="cyber" size="lg" asChild>
            <a href="#contacto">
              <ClipboardCheck className="size-4" />
              Solicitar Auditoría Técnica
            </a>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <a href="#proyectos">
              <FolderKanban className="size-4" />
              Explorar Proyectos
            </a>
          </Button>
        </motion.div>

        {/* Métricas auditadas (fuente: informe de modernización) */}
        <motion.dl
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="mt-16 grid w-full max-w-2xl grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border/60 sm:grid-cols-4"
        >
          {stats.map((s) => (
            <div
              key={s.label}
              className="flex flex-col bg-card/80 px-4 py-5 backdrop-blur-sm"
            >
              {/* dt precede a dd (semántica HTML) y se reposiciona con order */}
              <dt className="order-2 mt-1 text-xs text-muted-foreground">{s.label}</dt>
              <dd className="order-1 font-mono text-2xl font-bold text-gradient-cyber">
                {s.value}
              </dd>
            </div>
          ))}
        </motion.dl>
      </div>

      {/* Indicador de scroll (se oculta en pantallas pequeñas) */}
      <motion.a
        href="#capacidades"
        aria-label="Desplazarse a capacidades"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.8 }}
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 text-muted-foreground transition-colors hover:text-primary md:block"
      >
        <ArrowDown className="size-5 animate-bounce" />
      </motion.a>
    </section>
  );
}
