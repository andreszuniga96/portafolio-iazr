/**
 * NovaOrb3D — R3F animated 3D orb for ChatbotWidget trigger button.
 * Uses an icosahedron with a custom glow pulse shader.
 * Falls back to a plain SVG icon if WebGL fails (ErrorBoundary parent).
 */
import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

// ── Inner animated orb scene ────────────────────────────────────────────────
function OrbScene({ isOpen }: { isOpen: boolean }) {
  const meshRef  = useRef<THREE.Mesh>(null!);
  const wireRef  = useRef<THREE.Mesh>(null!);
  const glowRef  = useRef<THREE.Mesh>(null!);
  const clock    = useRef(0);

  const coreMat = useMemo(() => new THREE.MeshBasicMaterial({
    color: new THREE.Color("#7C66FF"),
    transparent: true,
    opacity: 0.92,
  }), []);

  const wireMat = useMemo(() => new THREE.MeshBasicMaterial({
    color: new THREE.Color("#FFFFFF"),
    wireframe: true,
    transparent: true,
    opacity: 0.18,
  }), []);

  const glowMat = useMemo(() => new THREE.MeshBasicMaterial({
    color: new THREE.Color("#5337E5"),
    transparent: true,
    opacity: 0.25,
    side: THREE.BackSide,
  }), []);

  const geo     = useMemo(() => new THREE.IcosahedronGeometry(0.62, 1), []);
  const glowGeo = useMemo(() => new THREE.IcosahedronGeometry(0.85, 1), []);

  useFrame((_, delta) => {
    clock.current += delta;
    const t = clock.current;

    if (meshRef.current) {
      meshRef.current.rotation.x = t * 0.35 + (isOpen ? Math.PI * 0.5 : 0);
      meshRef.current.rotation.y = t * 0.55;
      const pulse = 1 + Math.sin(t * 2.4) * 0.06;
      meshRef.current.scale.setScalar(pulse);
    }
    if (wireRef.current) {
      wireRef.current.rotation.x = -t * 0.2;
      wireRef.current.rotation.y = t * 0.4;
    }
    if (glowRef.current) {
      const g = 1 + Math.sin(t * 1.8) * 0.12;
      glowRef.current.scale.setScalar(g);
      (glowRef.current.material as THREE.MeshBasicMaterial).opacity =
        0.18 + Math.sin(t * 2.1) * 0.08;
    }
  });

  return (
    <>
      {/* Core icosahedron */}
      <mesh ref={meshRef} geometry={geo} material={coreMat} />
      {/* Wireframe overlay */}
      <mesh ref={wireRef} geometry={geo} material={wireMat} />
      {/* Glow shell */}
      <mesh ref={glowRef} geometry={glowGeo} material={glowMat} />
    </>
  );
}

// ── Exported orb — embedded in a tiny Canvas ────────────────────────────────
interface Props {
  isOpen: boolean;
  size?: number;
}

export default function NovaOrb3D({ isOpen, size = 56 }: Props) {
  return (
    <div
      style={{ width: size, height: size, borderRadius: "1rem", overflow: "hidden" }}
      aria-hidden="true"
    >
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 2.2], fov: 50 }}
        gl={{ alpha: true, antialias: false, powerPreference: "low-power" }}
        style={{ background: "transparent", width: "100%", height: "100%" }}
      >
        <OrbScene isOpen={isOpen} />
      </Canvas>
    </div>
  );
}
