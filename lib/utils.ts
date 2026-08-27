import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  CN — Combinador de clases de Tailwind (patrón Shadcn UI).
 *
 *  · clsx: une clases condicionales con sintaxis limpia.
 *  · tailwind-merge: resuelve conflictos de utilidades (p. ej. "px-2 px-4"
 *    se reduce a "px-4"), imprescindible cuando un componente acepta
 *    `className` desde el exterior.
 *
 *  Es la utilidad que consumen TODOS los componentes Shadcn del proyecto;
 *  centralizarla aquí evita duplicar la lógica de fusión.
 * ─────────────────────────────────────────────────────────────────────────────
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
