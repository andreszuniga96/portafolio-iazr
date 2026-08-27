"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight } from "lucide-react";

import { featuredProjects, type Project } from "@/lib/data/projects";
import { SectionHeading } from "@/components/section-heading";
import { Badge } from "@/components/ui/badge";

/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  PROJECT PARALLAX — Narrativa profunda controlada por GSAP ScrollTrigger.
 *
 *  La especificación exige GSAP ScrollTrigger para el control narrativo basado
 *  en desplazamiento: cada tarjeta sticky emerge desde la profundidad
 *  (rotateX + translateY + scale, scrub) y luego se desliza a velocidad propia
 *  según su índice → capas flotantes pseudo-3D.
 *
 *  Rendimiento:
 *  · Los tweens escriben transforms directamente (compositor, sin re-render de
 *    React por frame). `scrub: true` liga el progreso al scroll (cero trabajo
 *    cuando el usuario no se desplaza).
 *  · gsap.context + ctx.revert(): limpieza total de tweens y triggers en cada
 *    remontaje (seguro bajo Strict Mode de React 19).
 *  · prefers-reduced-motion: se fijan los valores finales, sin animación.
 *  · Lenis mueve el scroll NATIVO → ScrollTrigger se sincroniza solo.
 * ─────────────────────────────────────────────────────────────────────────────
 */

gsap.registerPlugin(ScrollTrigger);

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Accesibilidad vestibular: valores finales, cero animación.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(el, {
        transformPerspective: 1200,
        rotateX: 0,
        y: 0,
        scale: 1,
        opacity: 1,
      });
      return;
    }

    const ctx = gsap.context(() => {
      // Acto 1 — Entrada: la tarjeta emerge desde la profundidad (narrativa).
      gsap.fromTo(
        el,
        {
          transformPerspective: 1200,
          rotateX: 20,
          y: 90 - index * 18,
          scale: 0.92,
          opacity: 0.3,
        },
        {
          transformPerspective: 1200,
          rotateX: 0,
          y: 0,
          scale: 1,
          opacity: 1,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "top 20%",
            scrub: true,
          },
        }
      );

      // Acto 2 — Salida: cada capa se desliza a velocidad distinta (parallax).
      gsap.fromTo(
        el,
        {
          transformPerspective: 1200,
          y: 0,
          scale: 1,
          opacity: 1,
        },
        {
          transformPerspective: 1200,
          y: -70 + index * 18,
          scale: 0.96,
          opacity: 0.3,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "bottom 90%",
            end: "bottom top",
            scrub: true,
          },
        }
      );
    }, el);

    return () => ctx.revert();
  }, [index]);

  return (
    // `top-16` + tarjeta compacta: si la tarjeta fuese más alta que el
    // viewport, al fijarse (sticky) su parte inferior quedaría inalcanzable
    // al hacer scroll — el síntoma que el usuario reportó (descripción y CTA
    // cortados). Con `top-16` y la imagen acotada, la tarjeta completa cabe
    // en viewports de portátil (~650px útiles) y nada queda oculto.
    <article ref={ref} className="sticky top-16 my-5 will-change-transform">
      <ProjectCardInner project={project} />
    </article>
  );
}

/** Sub-componente puro: contenido de la tarjeta (fácil de reutilizar/testear). */
function ProjectCardInner({ project }: { project: Project }) {
  return (
    <div
      data-slot="project-card"
      className="group relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-[0_20px_60px_-24px_rgba(0,0,0,0.55)] sm:p-6"
    >
      {/* Halo decorativo superior (cian frío) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full opacity-30"
        style={{
          background:
            "radial-gradient(closest-side, color-mix(in oklch, var(--primary) 50%, transparent), transparent)",
        }}
      />

      {/* Artefactos flotantes pseudo-3D: glifos técnicos con deriva propia */}
      <div aria-hidden="true" className="pointer-events-none absolute right-6 top-6 flex gap-2">
        {project.artifacts.map((glyph, i) => (
          <span
            key={glyph}
            className={`inline-flex size-10 items-center justify-center rounded-lg border border-border/70 bg-secondary/50 font-mono text-lg text-primary/80 ${
              i % 2 === 0 ? "animate-float" : "animate-float-slow"
            }`}
          >
            {glyph}
          </span>
        ))}
      </div>

      {/* Captura del proyecto en producción (next/image → AVIF/WebP en el borde).
          La altura se acota (max-h-60) para que la tarjeta quepa completa en
          viewports bajos; object-top conserva la parte reconocible (hero del sitio). */}
      <div className="relative mb-5 aspect-[16/10] max-h-60 w-full overflow-hidden rounded-xl border border-border/60 bg-secondary/30">
        <Image
          src={project.image}
          alt={`Captura del proyecto ${project.name}`}
          fill
          sizes="(max-width: 896px) 100vw, 896px"
          className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
        />
        {/* Velo inferior para integrar la imagen con la tarjeta */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-card to-transparent"
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Badge variant="terminal">{project.codename}</Badge>
        <Badge variant="outline">{project.role}</Badge>
        <Badge variant="outline" className="text-muted-foreground/70">
          {project.year}
        </Badge>
      </div>

      <h3 className="mt-4 font-mono text-xl font-bold tracking-tight sm:text-2xl">
        {project.name}
      </h3>

      <p className="mt-2.5 max-w-3xl text-pretty leading-relaxed text-muted-foreground">
        {project.description}
      </p>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        {project.stack.map((tech) => (
          <span
            key={tech}
            className="rounded-md border border-primary/25 bg-primary/5 px-2.5 py-1 font-mono text-xs text-primary"
          >
            {tech}
          </span>
        ))}
      </div>

      <a
        href={project.href}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-accent"
      >
        {project.hrefLabel}
        <ArrowUpRight className="size-4" aria-hidden="true" />
      </a>
    </div>
  );
}

export function ProjectParallax() {
  return (
    <section id="proyectos" className="relative px-6 py-24 sm:py-32">
      <SectionHeading
        eyebrow="casos_de_exito"
        title={
          <>
            Proyectos críticos,{" "}
            <span className="italic text-primary">profundidad de ingeniería</span>
          </>
        }
        description="Nueve despliegues verificables en producción — de portales institucionales a dashboards de salud — que demuestran cómo IAZR combina dirección tecnológica, desarrollo Full-Stack e IA aplicada en entornos corporativos."
      />

      <div className="mx-auto flex max-w-4xl flex-col gap-8 [perspective:1400px]">
        {featuredProjects.map((project, index) => (
          <ProjectCard key={project.id} project={project} index={index} />
        ))}
      </div>
    </section>
  );
}
