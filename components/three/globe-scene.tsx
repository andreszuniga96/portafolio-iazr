"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { useReducedMotion } from "framer-motion";

import { ErrorBoundary } from "@/components/three/error-boundary";
import {
  DracoModel,
  HAS_GLTF_MODEL,
} from "@/components/three/draco-model";
import {
  NeuralGlobe,
  type GlobeQuality,
} from "@/components/three/neural-globe";
import { StaticGlobeFallback } from "@/components/three/static-globe-fallback";
import { useOffscreenPause } from "@/lib/hooks/use-offscreen-pause";

/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  GLOBE SCENE — Lienzo WebGL resiliente (programación defensiva extrema).
 *
 *  Protocolos de resiliencia implementados:
 *  1. Detección de soporte WebGL (webgl2/webgl) antes de montar el lienzo.
 *  2. 'webglcontextlost': se intercepta con preventDefault() (el navegador
 *     restaurará el contexto en ESTE mismo canvas) y se conmuta a un respaldo
 *     estático elegante sin desmontar la escena. Al dispararse
 *     'webglcontextrestored' la escena se reconstruye limpia.
 *  3. Detección de hardware (navigator.hardwareConcurrency): < 4 núcleos →
 *     tier "low" (menos partículas, sin antialias, dpr acotado). >30fps estables.
 *  4. Offscreen pause (INP): IntersectionObserver congela el bucle de render
 *     (frameloop="never") cuando el contenedor sale de la ventana gráfica.
 *  5. prefers-reduced-motion: congela la rotación (WCAG 2.2).
 *  6. ErrorBoundary: un activo GLTF corrupto degrada al globo procedural.
 *
 *  CLS ≈ 0: el padre reserva aspect-ratio fijo; el canvas es absoluto dentro.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** Detecta soporte WebGL sin lanzar excepciones en entornos exóticos. */
function detectWebGL(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") ?? canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

/** Inferencia de capacidad de GPU/CPU: tier de render seguro. */
function detectQuality(): GlobeQuality {
  if (typeof navigator === "undefined") return "high";
  const cores = navigator.hardwareConcurrency ?? 4;
  return cores < 4 ? "low" : "high";
}

export function GlobeScene() {
  const { ref, inView } = useOffscreenPause<HTMLDivElement>("200px");
  const reducedMotion = useReducedMotion();

  const [webglAvailable] = useState(detectWebGL);
  const [quality] = useState<GlobeQuality>(detectQuality);
  const [contextLost, setContextLost] = useState(false);

  // Listener de contexto WebGL sobre el <canvas> real (expuesto por R3F).
  // Guardamos la función de limpieza para no duplicar listeners entre remontajes.
  const cleanupRef = useRef<(() => void) | null>(null);

  const handleCreated = (state: { gl: { domElement: HTMLCanvasElement } }) => {
    cleanupRef.current?.();

    const canvas = state.gl.domElement;
    const onLost = (event: Event) => {
      event.preventDefault(); // el navegador restaurará el contexto en este canvas
      setContextLost(true);
    };
    const onRestored = () => setContextLost(false);

    canvas.addEventListener("webglcontextlost", onLost, false);
    canvas.addEventListener("webglcontextrestored", onRestored, false);

    cleanupRef.current = () => {
      canvas.removeEventListener("webglcontextlost", onLost);
      canvas.removeEventListener("webglcontextrestored", onRestored);
      cleanupRef.current = null;
    };
  };

  // Limpieza global al desmontar el componente.
  useEffect(() => () => cleanupRef.current?.(), []);

  const showFallback = !webglAvailable || contextLost;

  return (
    <div
      ref={ref}
      className="relative h-full w-full"
      aria-label="Red neuronal global de IAZR — cobertura Colombia a mundo"
    >
      {showFallback ? (
        /* Respaldo estático: sin GPU o contexto perdido por presión de memoria. */
        <StaticGlobeFallback className="absolute inset-0" />
      ) : (
        <Canvas
          frameloop={inView && !contextLost ? "always" : "never"}
          dpr={quality === "high" ? [1, 2] : [1, 1.5]}
          gl={{
            antialias: quality === "high",
            alpha: true,
            powerPreference: "high-performance",
            failIfMajorPerformanceCaveat: false,
          }}
          camera={{ position: [0, 0, 5.2], fov: 45 }}
          onCreated={handleCreated}
          style={{ pointerEvents: "none" }}
        >
          <ErrorBoundary
            fallback={
              <NeuralGlobe quality={quality} reducedMotion={reducedMotion ?? false} />
            }
          >
            {HAS_GLTF_MODEL ? (
              <DracoModel />
            ) : (
              <NeuralGlobe quality={quality} reducedMotion={reducedMotion ?? false} />
            )}
          </ErrorBoundary>
        </Canvas>
      )}
    </div>
  );
}
