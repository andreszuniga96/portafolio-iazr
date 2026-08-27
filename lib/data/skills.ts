/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  DATA / SKILLS — Esquema de destrezas (Bento Grid asimétrico).
 *
 *  Ecosistema tecnológico real del CV (julio 2026), segmentado en dominios:
 *   · Desarrollo Full-Stack (React, Next.js, Node.js, Python)
 *   · Datos & IA (PostgreSQL, MongoDB, Power BI, SQL, Machine Learning)
 *   · Infraestructura & Cloud (Linux, Azure, Huawei Cloud, Vercel, n8n)
 *   · Gestión estratégica (MGA, PDM, Scrum, CRM, BPM) y mentoría tech.
 *
 *  Cada celda declara su tamaño en la rejilla (colSpan/rowSpan) para lograr
 *  la asimetría "bento" y un `featured` que la BentoGrid usa para resaltar
 *  la celda principal. Los iconos son componentes lucide-react.
 * ─────────────────────────────────────────────────────────────────────────────
 */
import {
  Bot,
  Cloud,
  Cpu,
  GraduationCap,
  ShieldCheck,
  Workflow,
  type LucideIcon,
} from "lucide-react";

export type SkillTile = {
  id: string;
  /** Título de la celda (dominio). */
  title: string;
  /** Descripción corta orientada a resultados B2B. */
  description: string;
  /** Icono lucide que identifica el dominio. */
  icon: LucideIcon;
  /** Tecnologías específicas del dominio (chips mono). */
  tags: string[];
  /** Proporción dentro de la rejilla bento. */
  colSpan: 1 | 2;
  rowSpan: 1 | 2;
  /** Celda principal (más superficie, luz hover más intensa). */
  featured?: boolean;
};

export const skills: SkillTile[] = [
  {
    id: "fullstack",
    title: "Desarrollo Full-Stack",
    description:
      "Aplicaciones y sitios web de producción con React, Next.js y Node.js: de la interfaz al backend, con arquitectura limpia y rendimiento medible.",
    icon: Cpu,
    tags: ["React", "Next.js", "Node.js", "Python", "JavaScript", "TypeScript", "HTML/CSS", "Git"],
    colSpan: 2,
    rowSpan: 1,
    featured: true,
  },
  {
    id: "datos-ia",
    title: "Datos & IA",
    description:
      "Analítica de datos con Power BI y SQL, bases PostgreSQL/MongoDB y Machine Learning aplicado a decisiones y productos.",
    icon: Bot,
    tags: ["PostgreSQL", "MongoDB", "Power BI", "SQL", "Machine Learning"],
    colSpan: 1,
    rowSpan: 1,
  },
  {
    id: "infraestructura",
    title: "Infraestructura & Cloud",
    description:
      "Despliegue y operación en la nube con Azure, Huawei Cloud y Vercel, más automatización de procesos con n8n sobre Linux.",
    icon: Cloud,
    tags: ["Linux", "Azure", "Huawei Cloud", "Vercel", "n8n", "Automatización"],
    colSpan: 1,
    rowSpan: 1,
  },
  {
    id: "ciberseguridad",
    title: "Ciberseguridad",
    description:
      "Experiencia en análisis de seguridad de la información: protección de sistemas y redes, respuesta a incidentes y protocolos de integridad.",
    icon: ShieldCheck,
    tags: ["Seguridad de la información", "Respuesta a incidentes", "Redes"],
    colSpan: 2,
    rowSpan: 1,
  },
  {
    id: "gestion",
    title: "Gestión estratégica",
    description:
      "Metodologías de gestión pública y empresarial: formulación de proyectos (MGA), PDM, Scrum, CRM y BPM para dirección tecnológica.",
    icon: Workflow,
    tags: ["MGA", "PDM", "Scrum", "CRM", "BPM"],
    colSpan: 1,
    rowSpan: 1,
  },
  {
    id: "mentoria",
    title: "Mentoría tech & formación",
    description:
      "Mentor de bootcamps (Talento TECH), profesor de cátedra y formador en habilidades digitales: +500 beneficiarios acompañados.",
    icon: GraduationCap,
    tags: ["Talento TECH", "Bootcamps", "Habilidades digitales", "Hackathones"],
    colSpan: 1,
    rowSpan: 1,
  },
];
