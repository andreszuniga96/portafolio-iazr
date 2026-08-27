"use client";

import dynamic from "next/dynamic";

import { StaticGlobeFallback } from "@/components/three/static-globe-fallback";

/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  GLOBE CANVAS MOUNT — Punto de entrada client del lienzo 3D.
 *
 *  next/dynamic + ssr:false:
 *  · El chunk de three.js (~150KB gzip) NO se incluye en el HTML inicial ni en
 *    el primer paint: el hilo de pintura del LCP queda libre de WebGL.
 *  · Se descarga y ejecuta solo al hidratar esta hoja (client island aislada).
 *  · `loading`: el respaldo estático (SVG) se sirve hasta que el chunk resuelve,
 *    manteniendo el aspect-ratio reservado → CLS ≈ 0.
 * ─────────────────────────────────────────────────────────────────────────────
 */
const GlobeScene = dynamic(
  () =>
    import("@/components/three/globe-scene").then((mod) => mod.GlobeScene),
  {
    ssr: false,
    loading: () => <StaticGlobeFallback />,
  }
);

export function GlobeCanvasMount() {
  return <GlobeScene />;
}
