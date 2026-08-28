import type { Metadata } from "next";
import { Suspense } from "react";
import { Geist, JetBrains_Mono } from "next/font/google";

import { siteConfig } from "@/lib/data/site";
import { buildJsonLdGraph } from "@/lib/seo/json-ld";
import { JsonLd } from "@/components/seo/json-ld";
import { Providers } from "@/components/providers/providers";
import { PostHogProvider } from "@/components/providers/posthog-provider";
import { PostHogPageView } from "@/components/providers/posthog-pageview";
import { Navbar } from "@/components/navbar";

import "./globals.css";

/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  TIPOGRAFÍA — Sistema restringido de 2 familias (next/font, auto-alojado).
 *
 *  La especificación exige un sistema tipográfico mínimo con CERO bloqueo:
 *   · Geist Sans (fundamento geométrico general) → cuerpo, titulares y UI.
 *   · JetBrains Mono (estricto para código / acentos técnicos) → datos,
 *     fragmentos de código, terminal, métricas.
 *
 *  next/font subconjunta (solo los glifos usados), auto-aloja los woff2 en el
 *  despliegue (cero peticiones externas en runtime) y ajusta métricas para
 *  estabilizar el CLS ≈ 0. Solo se cargan los pesos que el sistema usa.
 * ─────────────────────────────────────────────────────────────────────────────
 */
const geist = Geist({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-geist",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

/**
 * API de Metadatos de Next.js — SEO técnico centralizado.
 * · metadataBase: ancla todas las URLs relativas (OG, canonical) al dominio real,
 *   anulando rutas relativas rotas.
 * · title.template: cada página hija aporta su título y el enrutador lo
 *   compone como "%s | IAZR · Director Tecnológico & Full-Stack",
 *   previniendo títulos duplicados o genéricos ante Googlebot.
 */
export const metadata: Metadata = {
  /**
   * metadataBase: ancla TODAS las URLs relativas (og:image, canonical, etc.) al
   * dominio de producción. Sin esto, los scrapers de redes sociales reciben una
   * URL relativa que no pueden resolver → la preview no se renderiza.
   */
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name} · Director Tecnológico & Full-Stack`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  /**
   * Categoría semántica: ayuda a los motores a clasificar el tipo de sitio.
   * "technology" → perfil técnico profesional.
   */
  category: "technology",
  /**
   * Política de referrer: origin-when-cross-origin permite que analytics
   * reciba el origen sin exponer la ruta completa a terceros.
   */
  referrer: "origin-when-cross-origin",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      /**
       * SVG favicon: Chrome 77+, Edge 79+, Firefox 41+ lo usan cuando está
       * disponible. Es resolución infinita y cambia de color automáticamente
       * en modo oscuro del SO si se usa currentColor en el SVG.
       */
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      { rel: "mask-icon", url: "/favicon.svg", color: "#00E5FF" },
    ],
  },
  manifest: "/site.webmanifest",
  keywords: siteConfig.keywords,
  authors: [{ name: siteConfig.author.name, url: siteConfig.url }],
  creator: siteConfig.author.name,
  publisher: siteConfig.author.name,
  alternates: {
    canonical: "/",
    languages: {
      "es": "/",
      "es-CO": "/",
      "x-default": "/",
    },
  },
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    /**
     * og:locale:alternate: señala a los scrapers que el sitio existe también
     * en variante de idioma. Mejora la clasificación multi-locale.
     */
    alternateLocale: ["es"],
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.title,
    description: siteConfig.description,
    images: [
      {
        /**
         * URL ABSOLUTA garantizada: `${siteConfig.url}${siteConfig.ogImage}`.
         * Aunque metadataBase resuelve las relativas, especificarla absoluta
         * es la práctica más robusta — Facebook, WhatsApp y LinkedIn
         * verifican ambas formas y prefieren la absoluta.
         */
        url: `${siteConfig.url}/og.png`,
        secureUrl: `${siteConfig.url}/og.png`,
        width: 1200,
        height: 630,
        type: "image/png",
        alt: `${siteConfig.name} — Director Tecnológico · Full-Stack Developer · Mentor Tech`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    /**
     * URL absoluta también en Twitter Card — el validator de Twitter
     * no siempre resuelve rutas relativas correctamente.
     */
    images: [`${siteConfig.url}/og.png`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="es"
      suppressHydrationWarning
      className={`${geist.variable} ${jetbrainsMono.variable}`}
    >
      <body>
        {/*
         * Providers: next-themes (modo claro/oscuro OKLCH) + Lenis (smooth
         * scroll). Lenis no debe bloquear el primer pintado: es un cliente
         * ligero que se adjunta tras la hidratación.
         */}
        <Providers>
          <PostHogProvider>
            <Navbar />
            <main id="inicio">{children}</main>
            {/*
             * Pageviews de PostHog (funnel visita → envío); null-render.
             * <Suspense> obligatorio: useSearchParams() en una página estática
             * exige boundary para no abortar el prerender (error de build
             * "missing-suspense-with-csr-bailout").
             */}
            <Suspense fallback={null}>
              <PostHogPageView />
            </Suspense>
          </PostHogProvider>
        </Providers>

        {/*
         * JSON-LD en el Server Component raíz: los datos estructurados quedan
         * embebidos en el HTML crudo del servidor para acceso inmediato de las
         * arañas (sin esperar hidratación de JavaScript).
         */}
        <JsonLd data={buildJsonLdGraph()} />
      </body>
    </html>
  );
}
