import type { Metadata } from "next";

import { siteConfig } from "@/lib/data/site";
import { JsonLd } from "@/components/seo/json-ld";
import { SectionHeading } from "@/components/section-heading";
import { Timeline } from "@/components/timeline";
import { AboutHeader } from "@/components/about/about-header";
import { Credentials } from "@/components/about/credentials";
import { ContactDirect } from "@/components/about/contact-direct";

/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  PÁGINA /ABOUT — Hoja de vida verificable (Server Component puro).
 *
 *  · Sin "use client": toda la página se pre-renderiza como HTML estático
 *    (PPR-ready con `experimental_ppr`). Cero JavaScript de cliente salvo el
 *    navbar compartido del layout.
 *  · Metadata PROPIA: `title` se compone con el template del layout
 *    ("Acerca de | IAZR · Director Tecnológico & Full-Stack") y `canonical`
 *    apunta a /about — sin conflictos de títulos ni URLs duplicadas.
 *  · JSON-LD de migas de pan (BreadcrumbList): el layout ya inyecta el grafo
 *    Person + Organization; aquí añadimos la ruta de navegación Home › About.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export const experimental_ppr = true;

export const metadata: Metadata = {
  title: "Acerca de",
  description:
    "Trayectoria, formación y datos de contacto de Iván Andrés Zúñiga (IAZR): Director Tecnológico, Full-Stack Developer y Mentor Tech con experiencia en IA aplicada, datos y transformación digital.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "Acerca de IAZR — Trayectoria y formación",
    description:
      "La hoja de vida verificable de Iván Andrés Zúñiga: Director Tecnológico, Full-Stack Developer y Mentor Tech. 7+ años, 11 certificaciones internacionales.",
    url: "/about",
    type: "profile",
  },
};

/** Migas de pan Schema.org para la ruta Home › Acerca de. */
const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Inicio",
      item: siteConfig.url,
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Acerca de",
      item: `${siteConfig.url}/about`,
    },
  ],
};

export default function AboutPage() {
  return (
    <>
      {/* Cabecera de identidad (foto, rol, disponibilidad, CTAs) */}
      <AboutHeader />

      {/* Trayectoria: reutiliza el Timeline de la portada (datos compartidos) */}
      <section className="px-6 pt-6 pb-24 sm:pb-32">
        <SectionHeading
          eyebrow="trayectoria"
          title={
            <>
              De la <span className="italic text-primary">academia</span> a la dirección tecnológica
            </>
          }
          description="Educación formal en ingeniería y administración, especialización en IA y una trayectoria que combina dirección tecnológica, desarrollo Full-Stack, datos y mentoría tech."
        />
      </section>
      <Timeline />

      {/* Certificaciones y formación continua */}
      <Credentials />

      {/* Datos de contacto directo */}
      <ContactDirect />

      {/* JSON-LD de migas de pan (renderizado en el servidor) */}
      <JsonLd data={breadcrumbJsonLd} />
    </>
  );
}
