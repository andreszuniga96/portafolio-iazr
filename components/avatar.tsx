import Image from "next/image";

import { cn } from "@/lib/utils";

/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  AVATAR — Retrato circular con halo bioluminiscente (Server Component).
 *
 *  FUENTE ÚNICA del bloque visual "foto + aura" que antes se duplicaba en el
 *  hero, la sección de contacto y la página /about. Cualquier cambio estético
 *  (tamaño del halo, borde, degradado) se hace aquí una sola vez.
 *
 *  · `sizeClass` recibe utilidades Tailwind de tamaño (p. ej. "size-24
 *    sm:size-28") para permitir saltos responsive; los atributos width/height
 *    de next/image solo fijan la relación de aspecto → CLS ≈ 0.
 *  · `priority` habilita la precarga (LCP) solo donde el retrato está sobre el
 *    pliegue (hero y about); en contacto se omite y el navegador lo carga lazy.
 *  · Server-safe: sin "use client", sin listeners; la animación de entrada se
 *    aplica desde el llamador (el hero la envuelve en motion.div).
 * ─────────────────────────────────────────────────────────────────────────────
 */

export function Avatar({
  src,
  alt,
  sizeClass = "size-24",
  className,
  priority = false,
}: {
  src: string;
  alt: string;
  /** Utilidades de tamaño responsive, p. ej. "size-24 sm:size-28". */
  sizeClass?: string;
  className?: string;
  /** Precarga la imagen (LCP). Usar solo sobre el pliegue. */
  priority?: boolean;
}) {
  return (
    <div className={cn("relative inline-block shrink-0", className)}>
      {/* Halo bioluminiscente: degradado cian → violeta difuminado en CSS puro
          (el navegador lo compone sin tocar el hilo principal). */}
      <div
        aria-hidden="true"
        className="absolute -inset-2 rounded-full bg-gradient-to-tr from-primary/50 to-accent/40 blur-lg"
      />

      <Image
        src={src}
        alt={alt}
        width={160}
        height={160}
        priority={priority}
        className={cn(
          "relative rounded-full border border-border object-cover",
          sizeClass
        )}
      />
    </div>
  );
}
