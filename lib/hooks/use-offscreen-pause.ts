"use client";

import { useEffect, useRef, useState } from "react";

/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  USE_OFFSCREEN_PAUSE — Estrategia INP "Offscreen pause".
 *  Pausa bucles de animación costosos (rAF de WebGL, loops de Framer Motion,
 *  relojes) cuando su contenedor sale de la ventana gráfica. Con un rootMargin
 *  positivo el pausado ocurre ANTES de que el elemento se oculte por completo,
 *  evitando transiciones perceptibles.
 *
 *  Uso:
 *    const { ref, inView } = useOffscreenPause<HTMLDivElement>("200px");
 *    <div ref={ref}>{inView ? <Canvas frameloop="always" /> : <Canvas frameloop="never" />}</div>
 *
 *  Sin IntersectionObserver (SSR / navegadores antiguos) devuelve inView=true:
 *  degradación segura que jamás oculta contenido.
 * ─────────────────────────────────────────────────────────────────────────────
 */
export function useOffscreenPause<T extends HTMLElement>(rootMargin = "200px") {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          setInView(entry.isIntersecting);
        }
      },
      { rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin]);

  return { ref, inView } as const;
}
