"use client";

import { useGLTF } from "@react-three/drei";

/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  DRACO MODEL — Carga de mallas GLTF comprimidas con Draco.
 *
 *  Requisito de la especificación: compresión de geometría Draco (80–98% de
 *  ahorro frente a GLTF plano). drei descarga el decodificador de Draco desde
 *  el decoder path configurado y descomprime la malla en tiempo de ejecución.
 *
 *  Estado del activo: el repositorio aún no incluye un modelo `.gltf`, así que
 *  HAS_GLTF_MODEL permanece en `false` y el componente NO realiza ninguna
 *  petición de red (evita 404s ruidosos en cada visita). Cuando exportes tu
 *  modelo (p. ej. el globo corporativo o una neurona LIF) a
 *  `public/models/iazr-core.gltf` con Draco, cambia la constante a `true`:
 *  la escena lo cargará automáticamente con esta pipeline ya cableada y el
 *  ErrorBoundary del lienzo degrada al globo procedural si el archivo falla.
 * ─────────────────────────────────────────────────────────────────────────────
 */
export const HAS_GLTF_MODEL = false;
export const GLTF_MODEL_URL = "/models/iazr-core.gltf";

/** Decoder Draco oficial de Google (CDN estático, versionado). */
useGLTF.setDecoderPath("https://www.gstatic.com/draco/versioned/decoders/1.5.7/");

export function DracoModel() {
  // Segundo argumento `true` → decodificación Draco activada.
  const { scene } = useGLTF(GLTF_MODEL_URL, true);

  return <primitive object={scene} scale={2.2} />;
}
