/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  DATA / EXPERIENCE — Trayectoria verificable (educación + experiencia).
 *
 *  Fuente única de verdad de la línea de tiempo (components/timeline.tsx) y
 *  del JSON-LD (lib/seo/json-ld.ts): los filtros por `id` que usa Schema.org
 *  viven en los identificadores estables de cada entrada.
 *
 *  Datos tomados del CV de Iván Andrés Zúñiga (julio 2026).
 * ─────────────────────────────────────────────────────────────────────────────
 */

export type EducationEntry = {
  id: string;
  institution: string;
  degree: string;
  period: string;
  description: string;
};

export type ExperienceEntry = {
  id: string;
  role: string;
  org: string;
  period: string;
  description: string;
  highlights: string[];
};

export type CertificationGroup = {
  id: string;
  vendor: string;
  description: string;
  credentials: string[];
};

export const education: EducationEntry[] = [
  {
    id: "unir-ia",
    institution: "Fundación Universitaria Internacional de La Rioja (UNIR)",
    degree: "Especialización en Inteligencia Artificial",
    period: "En curso",
    description:
      "Formación avanzada en IA: modelos, agentes y aplicaciones de inteligencia artificial aplicadas a producto y transformación digital.",
  },
  {
    id: "magister-administracion",
    institution: "Universidad Mariana — Sede Pasto",
    degree: "Magíster en Administración",
    period: "2021 – 2023",
    description:
      "Máster con Mención de Honor: gestión estratégica, toma de decisiones y administración de alto nivel para liderar proyectos tecnológicos y de negocio.",
  },
  {
    id: "alta-gerencia",
    institution: "Universidad Mariana — Sede Pasto",
    degree: "Especialista en Alta Gerencia",
    period: "2018 – 2019",
    description:
      "Especialización con certificado de Alto Rendimiento: dirección de organizaciones, liderazgo y gestión de equipos de alto desempeño.",
  },
  {
    id: "ing-sistemas",
    institution: "Universidad Sergio Arboleda — Sede Bogotá",
    degree: "Ingeniero de Sistemas y Telecomunicaciones",
    period: "2012 – 2017",
    description:
      "Base académica en ingeniería de sistemas: programación, redes, telecomunicaciones y arquitectura de software.",
  },
];

/** Certificaciones internacionales del CV (11 en total, agrupadas por emisor). */
export const certifications: CertificationGroup[] = [
  {
    id: "microsoft",
    vendor: "Microsoft",
    description: "Credenciales de analítica de datos, desarrollo web y fundamentos de nube.",
    credentials: [
      "Power BI Data Analyst",
      "Front-End Developer",
      "Azure Fundamentals",
    ],
  },
  {
    id: "huawei",
    vendor: "Huawei",
    description: "Certificaciones oficiales HCIA en inteligencia artificial, nube, IoT y 5G.",
    credentials: [
      "HCIA — Artificial Intelligence V3.5",
      "HCIA — Cloud Service",
      "HCIA — IoT V3.0",
      "HCIA — 5G V2.0",
    ],
  },
  {
    id: "google",
    vendor: "Google",
    description: "Carreras profesionales de Google en ciberseguridad, soporte, datos y marketing digital.",
    credentials: [
      "Cybersecurity Professional",
      "IT Support Professional",
      "Data Analytics",
      "Digital Marketing & E-commerce",
    ],
  },
];

export const experience: ExperienceEntry[] = [
  {
    id: "zolaris",
    role: "Director Tecnológico e Innovación Digital",
    org: "ZOLARIS INGENIERÍA",
    period: "Ene – Jun 2026",
    description:
      "Liderazgo en transformación digital: diseño y desarrollo de asistente virtual con IA para ventas (WhatsApp), sitio web corporativo Full-Stack y plataforma web tipo CRM para la gestión de recursos humanos.",
    highlights: [
      "Asistente virtual con IA para ventas (WhatsApp)",
      "Sitio web corporativo Full-Stack",
      "Plataforma web tipo CRM para gestión de RRHH",
    ],
  },
  {
    id: "mentor-talentotech-3",
    role: "Mentor de Bootcamps — Talento TECH (Región 3)",
    org: "Universidad Tecnológica de Pereira",
    period: "Feb – Abr 2026",
    description:
      "Acompañamiento presencial y simulación práctica en habilidades digitales. Mentoría especializada en hackathones, nivelaciones académicas y enseñanza de IA.",
    highlights: [
      "Mentoría en hackathones y nivelaciones académicas",
      "Enseñanza de Inteligencia Artificial",
    ],
  },
  {
    id: "mentor-iu-training",
    role: "Mentor Talento Tech 2.0",
    org: "IU TRAINING",
    period: "Mar – Oct 2025",
    description:
      "Formación en habilidades digitales: solución de inquietudes, revisión de código en proyectos finales y preparación de perfiles para su transición al mercado laboral.",
    highlights: [
      "Revisión de código en proyectos finales",
      "Preparación de perfiles para el mercado laboral",
    ],
  },
  {
    id: "profesor-udea",
    role: "Profesor de Cátedra (Extensión)",
    org: "Universidad de Antioquia",
    period: "2025",
    description:
      "Docente titular en bootcamps de Análisis de Datos y Programación: diseño de talleres y fomento de la lógica computacional en grupos masivos.",
    highlights: [
      "Bootcamps de Análisis de Datos y Programación",
      "Diseño de talleres y lógica computacional en grupos masivos",
    ],
  },
  {
    id: "mentor-talentotech-2",
    role: "Mentor Bootcamps — Talento TECH (Región 2)",
    org: "Universidad de Antioquia",
    period: "Jun – Dic 2024",
    description:
      "Clases sincrónicas de 8+ horas semanales, gestión de contenidos educativos, evaluación de talleres y proyectos, reportes diarios y formación personalizada.",
    highlights: [
      "Clases sincrónicas de 8+ horas semanales",
      "Evaluación de talleres y proyectos",
      "Formación personalizada a beneficiarios",
    ],
  },
  {
    id: "mentor-talentotech-1",
    role: "Mentor Bootcamps — Talento TECH (Región 1)",
    org: "Cymetria Group S.A.S.",
    period: "Oct – Dic 2024",
    description:
      "Formación sincrónica en habilidades digitales, promoción de propuestas innovadoras, evaluación de talleres y acompañamiento personalizado a beneficiarios.",
    highlights: [
      "Formación sincrónica en habilidades digitales",
      "Promoción de propuestas innovadoras",
      "Acompañamiento personalizado a beneficiarios",
    ],
  },
  {
    id: "monitor-talentotech-3",
    role: "Monitor Bootcamps — Talento TECH (Región 3)",
    org: "Universidad Tecnológica de Pereira — UTP",
    period: "Jun – Sep 2024",
    description:
      "Gestión del proceso educativo, formación en conceptos financieros, dinamización de hackathones y ferias de empleo, e implementación de estrategias innovadoras.",
    highlights: [
      "Dinamización de hackathones y ferias de empleo",
      "Gestión del proceso educativo",
      "Formación en conceptos financieros",
    ],
  },
  {
    id: "asesor-mga",
    role: "Asesor de Metodología General Ajustada (MGA)",
    org: "Alcaldía Municipal de Guachucal",
    period: "Mar – May 2024",
    description:
      "Fortalecer capacidades locales, fomentar la participación comunitaria, desarrollar sesiones prácticas de formulación de proyectos, apoyar al personal municipal y evaluar resultados.",
    highlights: [
      "Formulación de proyectos con metodología MGA",
      "Sesiones prácticas con el personal municipal",
      "Evaluación de resultados",
    ],
  },
  {
    id: "asesor-adel",
    role: "Asesor Plan de Desarrollo del Municipio de Pasto",
    org: "Agencia de Desarrollo Local — ADEL",
    period: "Feb – Jul 2024",
    description:
      "Coordinación y asesoría en la formulación del plan de desarrollo: control de procesos, manejo de información, facilitación de discusiones técnicas e informes mensuales.",
    highlights: [
      "Formulación de plan de desarrollo municipal",
      "Facilitación técnica y reportes mensuales",
    ],
  },
  {
    id: "preconteo",
    role: "Director Técnico Proceso Electoral PRECONTEO",
    org: "Thomas Processing & System",
    period: "Ago – Nov 2023",
    description:
      "Dirección y supervisión de infraestructura tecnológica, protocolos de seguridad y equipos de trabajo para garantizar la integridad del preconteo electoral en Nariño.",
    highlights: [
      "Supervisión de infraestructura tecnológica electoral",
      "Protocolos de seguridad para integridad del preconteo",
    ],
  },
  {
    id: "parquesoft",
    role: "Ingeniero Facilitador CTeI",
    org: "Parquesoft Pacífico",
    period: "Dic 2022 – Mar 2023",
    description:
      "Promoción de Ciencia, Tecnología e Innovación: talleres y asesoría técnica estratégica para el fortalecimiento comunitario y el desarrollo sostenible local.",
    highlights: [
      "Talleres de CTeI para fortalecimiento comunitario",
      "Asesoría técnica estratégica de desarrollo local",
    ],
  },
  {
    id: "dozurcol",
    role: "Analista de Seguridad de la Información",
    org: "Dozurcol Pasto",
    period: "Ago 2019 – Dic 2022",
    description:
      "Supervisión de registros de seguridad, identificación de amenazas, coordinación de respuestas a incidentes, implementación de soluciones y protección continua de sistemas y redes.",
    highlights: [
      "Gestión de incidentes y protección de sistemas y redes",
      "Implementación de soluciones de seguridad",
    ],
  },
  {
    id: "docente-itseinar",
    role: "Docente Hora Cátedra",
    org: "Instituto Técnico Sistematizado de Nariño",
    period: "Ene 2021 – Dic 2022",
    description:
      "Diseño y actualización de contenidos académicos, impartición de clases, evaluación de estudiantes y coordinación con personal académico para garantizar calidad educativa.",
    highlights: [
      "Diseño de contenidos académicos y clases",
      "Evaluación de estudiantes y coordinación académica",
    ],
  },
];
