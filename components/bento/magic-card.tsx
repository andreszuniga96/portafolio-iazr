"use client";

import { useRef, useState, type ReactNode } from "react";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  MAGIC CARD — Contenedor con iluminación focal dinámica (Magic UI).
 *
 *  · La luz sigue al puntero: se leen las coordenadas relativas en mousemove
 *    (un solo listener por tarjeta) y se escriben como variables CSS --x/--y
 *    que alimentan un degradado radial. El navegador pinta el degradado en el
 *    compositor; NO se re-renderiza React por frame (el estado de posición se
 *    actualiza solo cuando cambia el contador de eventos).
 *  · Entrada con whileInView: aparece suavemente la primera vez que entra en
 *    viewport (once: true → no se repite al volver a scrollear).
 *  · `featured` intensifica el brillo del borde para la celda principal.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export function MagicCard({
  children,
  className,
  featured = false,
}: {
  children: ReactNode;
  className?: string;
  featured?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [spot, setSpot] = useState({ x: 0, y: 0, visible: false });

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    setSpot({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
      visible: true,
    });
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setSpot((s) => ({ ...s, visible: false }))}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-colors duration-300 hover:border-primary/40",
        featured && "border-primary/20",
        className
      )}
    >
      {/* Luz focal que sigue al cursor (degradado radial en el compositor) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{
          opacity: spot.visible ? 1 : 0,
          background: `radial-gradient(320px circle at ${spot.x}px ${spot.y}px, color-mix(in oklch, var(--primary) 14%, transparent), transparent 65%)`,
        }}
      />
      {/* Halo sutil permanente en tarjetas destacadas */}
      {featured ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 -top-20 size-56 rounded-full opacity-20 blur-3xl"
          style={{
            background:
              "radial-gradient(closest-side, var(--primary), transparent)",
          }}
        />
      ) : null}

      <div className="relative">{children}</div>
    </motion.div>
  );
}
