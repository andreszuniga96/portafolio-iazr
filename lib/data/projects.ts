/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  DATA / PROJECTS — Casos de éxito desplegados en producción.
 *
 *  Los 9 proyectos provienen del portafolio real de IAZR (sitios vivos en
 *  Vercel y dominios propios). Cada entrada incluye la captura de pantalla
 *  alojada en /public/proyectos/ y el enlace directo al sitio, de modo que el
 *  reclutador puede verificar el resultado con un clic.
 *
 *  · codename  → badge terminal (identificador técnico del proyecto).
 *  · role      → badge outline (tipo de despliegue).
 *  · artifacts → glifos técnicos que flotan sobre la tarjeta (pseudo-3D).
 *  · hrefLabel → texto del CTA ("Visitar sitio" vs "Ver en GitHub").
 *
 *  Perfil público de GitHub del ingeniero: https://github.com/andreszuniga96
 * ─────────────────────────────────────────────────────────────────────────────
 */

export type Project = {
  id: string;
  codename: string;
  role: string;
  name: string;
  description: string;
  stack: string[];
  href: string;
  hrefLabel: string;
  artifacts: string[];
  image: string;
  year: string;
};

export const featuredProjects: Project[] = [
  {
    id: "la-campana",
    codename: "lacampana.co",
    role: "Web corporativa",
    name: "La Campana",
    description:
      "Presencia digital corporativa para La Campana: identidad de marca, contenidos institucionales y estructura orientada a conversión, con rendimiento optimizado y accesibilidad auditada.",
    stack: ["Next.js", "Tailwind CSS", "SEO técnico"],
    href: "https://lacampana.co/",
    hrefLabel: "Visitar sitio",
    artifacts: ["</>", "◎"],
    image: "/proyectos/LaCampana.png",
    year: "2025",
  },
  {
    id: "emssanar-eps",
    codename: "emssanareps.co",
    role: "Portal institucional",
    name: "Emssanar EPS",
    description:
      "Portal institucional para una EPS del sistema de salud colombiano: información de afiliados, servicios y canales de atención con arquitectura accesible y escalable.",
    stack: ["Next.js", "React", "Accesibilidad", "CMS"],
    href: "https://emssanareps.co/",
    hrefLabel: "Visitar sitio",
    artifacts: ["▣", "+"],
    image: "/proyectos/EmssanarEPS.png",
    year: "2025",
  },
  {
    id: "paisajes-sonoros",
    codename: "paisajes-sonoros",
    role: "Experiencia cultural",
    name: "Paisajes Sonoros",
    description:
      "Plataforma experiencial de paisajes sonoros: reproducción de audio inmersivo, curaduría editorial y diseño visual cinematográfico para un proyecto cultural.",
    stack: ["Next.js", "Framer Motion", "Audio"],
    href: "https://paisajes-sonoros.vercel.app/",
    hrefLabel: "Visitar sitio",
    artifacts: ["♪", "≈"],
    image: "/proyectos/PaisajesSonoros.png",
    year: "2025",
  },
  {
    id: "dozurcol-pasto",
    codename: "dozurcol-pasto",
    role: "Sitio comercial",
    name: "Dozurcol Pasto",
    description:
      "Sitio comercial para la sede Pasto de Dozurcol: catálogo de productos, datos de contacto y generación de confianza para venta B2B regional.",
    stack: ["Next.js", "Tailwind CSS", "SEO local"],
    href: "https://dozurcol-pasto.vercel.app/",
    hrefLabel: "Visitar sitio",
    artifacts: ["◇", "≡"],
    image: "/proyectos/DozurcolPasto.png",
    year: "2025",
  },
  {
    id: "portafolio-sandra",
    codename: "portafolio-sandra-sst",
    role: "Portafolio profesional",
    name: "Portafolio Sandra Gómez",
    description:
      "Portafolio profesional de SST (Seguridad y Salud en el Trabajo): hoja de vida interactiva, servicios y casos de éxito para posicionar la consultoría personal.",
    stack: ["Next.js", "Framer Motion", "Web vitals"],
    href: "https://portafolio-sandra-sst.vercel.app/",
    hrefLabel: "Visitar sitio",
    artifacts: ["✚", "◉"],
    image: "/proyectos/PortafolioSandraGomez.png",
    year: "2025",
  },
  {
    id: "panini-2026",
    codename: "panini26",
    role: "Experiencia de colección",
    name: "Panini 2026",
    description:
      "Experiencia web de colección para el álbum Panini 2026: interfaz de intercambio de cromos, listas de colección y comunidad, con interacción fluida.",
    stack: ["Next.js", "React 19", "Estado global"],
    href: "https://panini26.vercel.app/",
    hrefLabel: "Visitar sitio",
    artifacts: ["★", "⇄"],
    image: "/proyectos/Panini2026.png",
    year: "2026",
  },
  {
    id: "metodo-sonora",
    codename: "metodo-sonora",
    role: "Plataforma educativa",
    name: "Método Sonora",
    description:
      "Plataforma educativa del Método Sonora: contenidos de formación musical, progreso del estudiante y diseño editorial de alto impacto.",
    stack: ["Next.js", "Tailwind CSS", "Audio"],
    href: "https://metodo-sonora.vercel.app/",
    hrefLabel: "Visitar sitio",
    artifacts: ["♫", "Δ"],
    image: "/proyectos/MetodoSonora.png",
    year: "2025",
  },
  {
    id: "zolaris",
    codename: "zolarisweb",
    role: "Web de empresa tech",
    name: "Zolaris",
    description:
      "Sitio web para empresa de tecnología: servicios, casos de éxito y equipo, con arquitectura SEO y rendimiento de clase mundial.",
    stack: ["Next.js", "SEO técnico", "Analítica"],
    href: "https://zolarisweb.vercel.app/",
    hrefLabel: "Visitar sitio",
    artifacts: ["⚡", "✦"],
    image: "/proyectos/Zolaris.png",
    year: "2025",
  },
  {
    id: "sst-medsys",
    codename: "sst-med-sys",
    role: "Dashboard de salud",
    name: "SST MedSys",
    description:
      "Dashboard de gestión para seguridad y salud en el trabajo: métricas en tiempo real, reportes clínicos y control de indicadores desde una interfaz de datos densa.",
    stack: ["Next.js", "React", "Dashboard", "Datos"],
    href: "https://sst-med-sys.vercel.app/dashboard",
    hrefLabel: "Ver dashboard",
    artifacts: ["📊", "∿"],
    image: "/proyectos/SSTMedSys.png",
    year: "2025",
  },
];

export const githubProfileUrl = "https://github.com/andreszuniga96";
