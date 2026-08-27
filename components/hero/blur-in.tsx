"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  BLUR IN — Renderización de texto difuminado (Magic UI).
 *
 *  Cada palabra entra en cascada desde el desenfoque (blur(12px) + opacity 0)
 *  hasta el enfoque nítido. Es el "titular de entrada" de la especificación:
 *  un movimiento tipográfico de alta percepción que NO bloquea el hilo
 *  principal (Framer Motion escribe en el compositor).
 *
 *  API:
 *   · `as`      → etiqueta semántica (h1/h2/p…).
 *   · `text`    → contenido textual (cada palabra se anima por separado).
 *   · `delay`   → retardo inicial del primer word.
 *   · `once`    → si la animación corre solo la primera vez en viewport.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export function BlurIn({
  as: Tag = "p",
  text,
  className,
  delay = 0,
  once = true,
}: {
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span";
  text: string;
  className?: string;
  delay?: number;
  once?: boolean;
}) {
  const words = text.split(" ");

  return (
    <Tag className={cn("", className)}>
      {words.map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          initial={{ opacity: 0, filter: "blur(12px)" }}
          whileInView={{ opacity: 1, filter: "blur(0px)" }}
          viewport={{ once, margin: "-20%" }}
          transition={{
            duration: 0.65,
            delay: delay + i * 0.12,
            ease: [0.22, 1, 0.36, 1],
          }}
          // SIN will-change: promover cada palabra a su propia capa de
          // composición rompe el recorte `background-clip: text` de los
          // degradados (el texto quedaría transparente e invisible).
          className="inline-block"
        >
          {word}
          {/* Espacio visible entre palabras en línea */}
          {i < words.length - 1 ? "\u00A0" : ""}
        </motion.span>
      ))}
    </Tag>
  );
}
