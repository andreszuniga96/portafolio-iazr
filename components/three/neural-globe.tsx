"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Line, PointMaterial, Points } from "@react-three/drei";
import * as THREE from "three";

/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  NEURAL GLOBE — Escena 3D procedural (red neuronal global de IAZR).
 *  · 100% procedimental: cero activos de red → el bundle 3D es solo JS y el
 *    primer pintado nunca espera por una malla (protege LCP).
 *  · Dos niveles de calidad por detección de hardware (hardwareConcurrency):
 *    tier "low" → 1.2k partículas, 8 arcos, sin antialias; tier "high" → 2.6k
 *    partículas, 14 arcos. Mantiene >30fps en dispositivos de gama baja.
 *  · Materiales básicos (sin luces ni sombras): cero pases de post-proceso.
 *  · `reducedMotion` congela la rotación (WCAG 2.2 / vestibular).
 * ─────────────────────────────────────────────────────────────────────────────
 */

export type GlobeQuality = "high" | "low";

const RADIUS = 1.6;

/** Distribución de Fibonacci sobre la esfera — determinista por tier. */
function createSpherePositions(count: number, radius: number): Float32Array {
  const positions = new Float32Array(count * 3);
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));

  for (let i = 0; i < count; i += 1) {
    const y = 1 - (i / (count - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = goldenAngle * i;

    positions[i * 3] = Math.cos(theta) * r * radius;
    positions[i * 3 + 1] = y * radius;
    positions[i * 3 + 2] = Math.sin(theta) * r * radius;
  }

  return positions;
}

type Vec3 = [number, number, number];

/** Arcos de "conexión neuronal": curvas de Bézier elevadas entre pares de nodos. */
function createArcs(count: number, radius: number, lift = 0.55): Vec3[][] {
  const points = createSpherePositions(count * 2, radius);
  const arcs: Vec3[][] = [];

  for (let i = 0; i < count; i += 1) {
    const a: Vec3 = [points[i * 6], points[i * 6 + 1], points[i * 6 + 2]];
    const b: Vec3 = [points[i * 6 + 3], points[i * 6 + 4], points[i * 6 + 5]];

    // Punto de control: normalizado(A + B) elevado fuera de la esfera.
    const mx = a[0] + b[0];
    const my = a[1] + b[1];
    const mz = a[2] + b[2];
    const mag = Math.sqrt(mx * mx + my * my + mz * mz) || 1;
    const c: Vec3 = [
      (mx / mag) * radius * (1 + lift),
      (my / mag) * radius * (1 + lift),
      (mz / mag) * radius * (1 + lift),
    ];

    const arc: Vec3[] = [];
    const SEGMENTS = 24;
    for (let s = 0; s <= SEGMENTS; s += 1) {
      const t = s / SEGMENTS;
      const u = 1 - t;
      // Bézier cuadrática: (1-t)²A + 2(1-t)tC + t²B
      arc.push([
        u * u * a[0] + 2 * u * t * c[0] + t * t * b[0],
        u * u * a[1] + 2 * u * t * c[1] + t * t * b[1],
        u * u * a[2] + 2 * u * t * c[2] + t * t * b[2],
      ]);
    }
    arcs.push(arc);
  }

  return arcs;
}

/** Datos precomputados a nivel de módulo: sin trabajo por frame ni por render. */
const HIGH_POINTS = createSpherePositions(2600, RADIUS);
const LOW_POINTS = createSpherePositions(1200, RADIUS);
const HIGH_ARCS = createArcs(14, RADIUS);
const LOW_ARCS = createArcs(8, RADIUS);

export function NeuralGlobe({
  quality,
  reducedMotion,
}: {
  quality: GlobeQuality;
  reducedMotion: boolean;
}) {
  const group = useRef<THREE.Group>(null);
  const high = quality === "high";
  const points = high ? HIGH_POINTS : LOW_POINTS;
  const arcs = high ? HIGH_ARCS : LOW_ARCS;

  // Rotación lenta de deriva; delta acotado evita saltos tras reanudar la pestaña.
  useFrame((_, rawDelta) => {
    if (reducedMotion || !group.current) return;
    const delta = Math.min(rawDelta, 0.05);
    group.current.rotation.y += delta * 0.07;
    group.current.rotation.x = Math.sin(group.current.rotation.y * 0.4) * 0.12;
  });

  return (
    <group ref={group}>
      {/* Núcleo frío + halo interno */}
      <mesh>
        <sphereGeometry args={[0.34, 24, 24]} />
        <meshBasicMaterial color="#0b0f0f" />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.42, 24, 24]} />
        <meshBasicMaterial color="#67e8f9" transparent opacity={0.08} />
      </mesh>

      {/* Superficie: nube de puntos (partículas) */}
      <Points positions={points} stride={3} frustumCulled>
        <PointMaterial
          transparent
          color="#6fe3f2"
          size={high ? 0.016 : 0.02}
          sizeAttenuation
          depthWrite={false}
          opacity={0.85}
        />
      </Points>

      {/* Conexiones neuronales */}
      {arcs.map((arc, i) => (
        <Line
          key={`arc-${i}`}
          points={arc}
          color="#67e8f9"
          transparent
          opacity={0.3}
          lineWidth={1}
        />
      ))}

      {/* Anillo orbital fino */}
      <mesh rotation={[Math.PI / 2.2, 0, 0.4]}>
        <torusGeometry args={[2.05, 0.0035, 8, 128]} />
        <meshBasicMaterial color="#67e8f9" transparent opacity={0.35} />
      </mesh>
    </group>
  );
}
