import type { NextConfig } from "next";

/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  NEXT.CONFIG.TS — Configuración de Next.js 15.
 *
 *  · SIN configuración JavaScript de Tailwind (prohibida por la especificación
 *    v4): la tematización vive íntegra en app/globals.css vía `@theme`.
 *  · React Compiler: la especificación exige eliminar la memorización manual
 *    (useMemo/useCallback). El código del proyecto ya cumple esa directiva;
 *    el flag `experimental.reactCompiler` de Next 15.5 exige además el plugin
 *    babel-plugin-react-compiler y queda reservado para el despliegue en
 *    Next 16 (donde el compilador es estable). No lo activamos aquí.
 *  · PARTIAL PRERENDERING: la ruta `app/page.tsx` exporta `experimental_ppr`.
 *    En las estables de Next 15 (15.4/15.5) Vercel bloquea `experimental.ppr`
 *    (solo disponible en canary). Si despliegas en canary/Next 16, descomenta
 *    la línea marcada abajo para activar el PPR real; sin ella, el <Suspense>
 *    del page.tsx ya transmite el cascarón HTML por streaming.
 * ─────────────────────────────────────────────────────────────────────────────
 */
const nextConfig: NextConfig = {
  experimental: {
    // ppr: "incremental", // ← descomentar SOLO en canary / Next 16
  },
  // next/image: los proyectos son imágenes locales (public/) — sin dominios remotos.
  images: {
    formats: ["image/avif", "image/webp"],
  },
  // Este proyecto vive en un workspace con varios lockfiles (raíz + carpeta):
  // anclar el root de trazado evita el warning de inferencia de Next y hace
  // el tracing determinista en el despliegue.
  outputFileTracingRoot: __dirname,
};

export default nextConfig;
