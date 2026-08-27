/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  DATA / SERVICES — Oferta B2B (lo que contrata un cliente o empresa).
 *
 *  El portafolio no vende tecnologías sueltas: vende RESULTADOS verificables.
 *  Esta sección traduce el perfil real del CV (dirección tecnológica,
 *  desarrollo Full-Stack, IA aplicada y datos) a entregables de negocio con
 *  un CTA por tarjeta hacia la sección que lo demuestra. Fuente única de
 *  verdad para la grilla de servicios.
 * ─────────────────────────────────────────────────────────────────────────────
 */
import {
  BrainCircuit,
  Globe,
  LineChart,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";

export type Service = {
  id: string;
  /** Nombre del servicio (orientado al comprador B2B). */
  title: string;
  /** Descripción con resultado medible, no con jerga técnica. */
  description: string;
  /** Tecnologías clave que lo respaldan (chips mono). */
  tags: string[];
  /** Icono lucide del dominio. */
  icon: LucideIcon;
  /** CTA que lleva a la sección del sitio que demuestra el servicio. */
  cta: { label: string; href: string };
};

export const services: Service[] = [
  {
    id: "direccion-tecnologica",
    title: "Dirección Tecnológica & Transformación Digital",
    description:
      "Dirección de innovación digital de extremo a extremo: asistentes virtuales con IA para ventas (WhatsApp), plataformas CRM y hojas de ruta de transformación para tu empresa.",
    tags: ["Dirección tecnológica", "Transformación digital", "IA"],
    icon: ShieldCheck,
    cta: { label: "iniciar_proyecto()", href: "#contacto" },
  },
  {
    id: "fullstack",
    title: "Desarrollo Full-Stack & Web corporativa",
    description:
      "Sitios web corporativos y plataformas web a medida con React, Next.js y Node.js: de la landing a la aplicación completa, con arquitectura y rendimiento medibles.",
    tags: ["React", "Next.js", "Node.js"],
    icon: Globe,
    cta: { label: "ver_proyectos()", href: "#proyectos" },
  },
  {
    id: "ia-datos",
    title: "IA aplicada & Datos",
    description:
      "Analítica de datos con Power BI y SQL, bases de datos PostgreSQL/MongoDB e integración de inteligencia artificial directamente en tu producto o proceso.",
    tags: ["Power BI", "SQL", "Machine Learning", "IA"],
    icon: BrainCircuit,
    cta: { label: "preguntar_al_asistente()", href: "#conversacion" },
  },
  {
    id: "mentoria",
    title: "Mentoría & Formación Tech",
    description:
      "Formación en habilidades digitales, programación y análisis de datos para equipos y programas de impacto: mentor de bootcamps y profesor de cátedra con +500 beneficiarios.",
    tags: ["Bootcamps", "Habilidades digitales", "Talento TECH"],
    icon: LineChart,
    cta: { label: "conocer_trayectoria()", href: "/about" },
  },
];
