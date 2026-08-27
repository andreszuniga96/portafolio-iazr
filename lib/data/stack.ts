/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  DATA / STACK — Marquesinas de herramientas técnicas (Magic UI Marquee).
 *
 *  Dos filas con direcciones opuestas generan el clásico "carrusel infinito"
 *  del ecosistema: cada ítem es un par [nombre, rol-semántico] que la
 *  marquesina renderiza con un glifo separador. Este archivo es la fuente
 *  única de verdad del stack publicitado en el hero y en el chat (system
 *  prompt) — cambiar aquí propaga a todo el sitio.
 *
 *  Stack real del CV (julio 2026).
 * ─────────────────────────────────────────────────────────────────────────────
 */

export type StackItem = {
  /** Nombre visible de la tecnología. */
  name: string;
  /** Categoría corta (para micro-etiquetas si la marquesina las usa). */
  tag: string;
};

/** Fila superior — fundamentos de la identidad (Full-Stack + Datos). */
export const stackRowA: StackItem[] = [
  { name: "React", tag: "Full-Stack" },
  { name: "Next.js", tag: "Full-Stack" },
  { name: "Node.js", tag: "Full-Stack" },
  { name: "Python", tag: "Full-Stack" },
  { name: "JavaScript", tag: "Full-Stack" },
  { name: "TypeScript", tag: "Full-Stack" },
  { name: "HTML/CSS", tag: "Full-Stack" },
  { name: "Git", tag: "Full-Stack" },
  { name: "PostgreSQL", tag: "Datos" },
  { name: "MongoDB", tag: "Datos" },
  { name: "SQL", tag: "Datos" },
];

/** Fila inferior — datos, IA e infraestructura (dirección contraria). */
export const stackRowB: StackItem[] = [
  { name: "Power BI", tag: "Datos" },
  { name: "Machine Learning", tag: "IA" },
  { name: "IA aplicada", tag: "IA" },
  { name: "Linux", tag: "Infra" },
  { name: "Azure", tag: "Cloud" },
  { name: "Huawei Cloud", tag: "Cloud" },
  { name: "Vercel", tag: "Cloud" },
  { name: "n8n", tag: "Automatización" },
  { name: "Ciberseguridad", tag: "Seguridad" },
  { name: "Scrum", tag: "Gestión" },
  { name: "CRM", tag: "Gestión" },
];

/** Tercera fila — metodologías, gestión y plataformas de producción. */
export const stackRowC: StackItem[] = [
  { name: "MGA", tag: "Gestión" },
  { name: "PDM", tag: "Gestión" },
  { name: "BPM", tag: "Gestión" },
  { name: "REST APIs", tag: "Backend" },
  { name: "Automatización", tag: "DevOps" },
  { name: "Vercel AI SDK", tag: "IA" },
  { name: "Groq", tag: "IA" },
  { name: "Prompt Engineering", tag: "IA" },
  { name: "CI/CD", tag: "DevOps" },
  { name: "GitHub Actions", tag: "DevOps" },
  { name: "Observabilidad", tag: "DevOps" },
];
