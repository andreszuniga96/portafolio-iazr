/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  CONFIGURACIÓN CENTRAL DEL SITIO IAZR
 *  Fuente única de verdad para nombre, URL y contactos. Layout, SEO (JSON-LD),
 *  Open Graph y componentes la importan: cambiar un dato aquí lo propaga a todo
 *  el ecosistema, evitando cadenas mágicas duplicadas.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export const siteConfig = {
  /** Marca visible y apéndice del patrón title.template de SEO */
  name: "IAZR",
  /** Título por defecto de la landing (sin plantilla aplicada) */
  title: "IAZR — Director Tecnológico · Full-Stack Developer · Mentor Tech",
  description:
    "Iván Andrés Zúñiga — Director Tecnológico, Full-Stack Developer y Mentor Tech. Ingeniero de Sistemas y Telecomunicaciones, Magíster en Administración y Especialista en Inteligencia Artificial (UNIR). Transformación digital, plataformas web, IA aplicada y formación tecnológica. 7+ años, 11 certificaciones internacionales.",
  /** metadataBase: todas las URLs relativas de SEO/OG se resuelven contra este origen */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://portafolio-iazr.vercel.app",
  ogImage: "/og.png",
  locale: "es_CO",
  // Cast explícito: `as const` (del objeto contenedor) haría el tuple readonly
  // e incompatible con el tipo string[] que exige la API de Metadatos de Next.
  keywords: [
    "IAZR",
    "Iván Andrés Zúñiga",
    "Director Tecnológico",
    "Full-Stack Developer",
    "Mentor Tech",
    "Ingeniero de Sistemas",
    "Magíster en Administración",
    "Inteligencia Artificial",
    "React",
    "Next.js",
    "Node.js",
    "Power BI",
    "Azure",
    "Huawei Cloud",
    "Transformación Digital",
    "Talento TECH",
    "Colombia",
  ] as string[],
  /** Ubicación y horario del ingeniero (footer, contacto, about, JSON-LD). */
  location: "Colombia · Remoto global",
  timezone: "GMT-5 (UTC-5)",
  /** Abreviatura corta de franja (p. ej. badges y footer). */
  timezoneShort: "GMT-5",
  author: {
    name: "Iván Andrés Zúñiga",
    givenName: "Iván Andrés",
    familyName: "Zúñiga",
    /** Perfil público principal (proporcionado por el usuario). AnZuCa y los
        demás identificadores del informe quedan como alias secundarios. */
    github: "https://github.com/andreszuniga96",
    githubAlt: [
      "https://github.com/AnZuCa",
      "https://github.com/andres-zuniga",
      "https://github.com/Xgamer1999",
    ],
    /** Datos reales de contacto (CV julio 2026). */
    linkedin: "https://www.linkedin.com/in/iazr96/",
    email: "ivanzuiga1996@gmail.com",
    /** WhatsApp: número con código de país (sin +, espacios ni guiones). */
    whatsapp: "https://wa.me/573229132643",
    whatsappDisplay: "+57 322 913 2643",
  },
  socials: {
    github: "https://github.com/andreszuniga96",
    linkedin: "https://www.linkedin.com/in/iazr96/",
    email: "mailto:ivanzuiga1996@gmail.com",
    whatsapp: "https://wa.me/573229132643",
  },
  /** Navegación principal: anclas de la landing + ruta /about (página propia) */
  nav: [
    { label: "Inicio", href: "#inicio" },
    { label: "Acerca de", href: "/about" },
    { label: "Capacidades", href: "#capacidades" },
    { label: "Proyectos", href: "#proyectos" },
    { label: "Conversación", href: "#conversacion" },
    { label: "Contacto", href: "#contacto" },
  ],
} as const;
