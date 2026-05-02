/**
 * DataSpaceBackground — WebGL Immersive Background
 * Grafo de partículas 3D con nodos interconectados.
 * Sin bufferAttribute args[], usa array+count+itemSize separados.
 */
import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const NODE_COUNT = 160;
const CONNECTION_DISTANCE = 2.6;
const SPREAD = 13;

const mouse = { x: 0, y: 0 };
let scrollY = 0;

if (typeof window !== "undefined") {
  window.addEventListener("mousemove", (e) => {
    mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
    mouse.y = -(e.clientY / window.innerHeight - 0.5) * 2;
  }, { passive: true });
  window.addEventListener("scroll", () => { scrollY = window.scrollY; }, { passive: true });
}

function NodeGraph() {
  const { size } = useThree();
  const meshRef  = useRef<THREE.InstancedMesh>(null!);
  const linesRef = useRef<THREE.LineSegments>(null!);
  const groupRef = useRef<THREE.Group>(null!);

  const positions = useMemo(() => {
    const arr: THREE.Vector3[] = [];
    for (let i = 0; i < NODE_COUNT; i++) {
      arr.push(new THREE.Vector3(
        (Math.random() - 0.5) * SPREAD,
        (Math.random() - 0.5) * SPREAD * 0.6,
        (Math.random() - 0.5) * SPREAD * 0.5,
      ));
    }
    return arr;
  }, []);

  const scales = useMemo(() => positions.map(() => 0.04 + Math.random() * 0.07), [positions]);

  // Pre-compute initial line buffer (over-allocated)
  const maxLines = NODE_COUNT * NODE_COUNT;
  const lineBuffer = useMemo(() => new Float32Array(maxLines * 6), [maxLines]);

  useEffect(() => {
    if (!meshRef.current) return;
    const dummy = new THREE.Object3D();
    positions.forEach((pos, i) => {
      dummy.position.copy(pos);
      dummy.scale.setScalar(scales[i]);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [positions, scales]);

  const velocities = useMemo(() => positions.map(() => new THREE.Vector3(
    (Math.random() - 0.5) * 0.003,
    (Math.random() - 0.5) * 0.002,
    (Math.random() - 0.5) * 0.001,
  )), [positions]);

  const clock = useRef(0);

  useFrame((_, delta) => {
    clock.current += delta;
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.04 + mouse.x * 0.001;
      groupRef.current.rotation.x += delta * 0.015 + mouse.y * 0.0008;
      groupRef.current.position.y = -scrollY * 0.00012;
    }

    const dummy = new THREE.Object3D();
    positions.forEach((pos, i) => {
      pos.add(velocities[i]);
      if (Math.abs(pos.x) > SPREAD / 2) velocities[i].x *= -1;
      if (Math.abs(pos.y) > SPREAD * 0.3) velocities[i].y *= -1;
      if (Math.abs(pos.z) > SPREAD * 0.25) velocities[i].z *= -1;
      dummy.position.copy(pos);
      const pulse = 1 + Math.sin(clock.current * 0.8 + i * 0.4) * 0.15;
      dummy.scale.setScalar(scales[i] * pulse);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;

    // Update connection lines
    let lineCount = 0;
    for (let i = 0; i < NODE_COUNT; i++) {
      for (let j = i + 1; j < NODE_COUNT; j++) {
        if (positions[i].distanceTo(positions[j]) < CONNECTION_DISTANCE) {
          const base = lineCount * 6;
          lineBuffer[base]     = positions[i].x;
          lineBuffer[base + 1] = positions[i].y;
          lineBuffer[base + 2] = positions[i].z;
          lineBuffer[base + 3] = positions[j].x;
          lineBuffer[base + 4] = positions[j].y;
          lineBuffer[base + 5] = positions[j].z;
          lineCount++;
        }
      }
    }

    const geo = linesRef.current?.geometry;
    if (geo) {
      const buf = geo.getAttribute("position") as THREE.BufferAttribute;
      if (buf) {
        (buf.array as Float32Array).set(lineBuffer.subarray(0, lineCount * 6));
        buf.count = lineCount * 2;
        buf.needsUpdate = true;
      }
    }
  });

  const isMobile = size.width < 768;
  const nodeMat = useMemo(() => new THREE.MeshBasicMaterial({ color: new THREE.Color("#7C3AED"), transparent: true, opacity: 0.75 }), []);
  const lineMat = useMemo(() => new THREE.LineBasicMaterial({ color: new THREE.Color("#8B5CF6"), transparent: true, opacity: isMobile ? 0.10 : 0.16 }), [isMobile]);
  const geo = useMemo(() => new THREE.SphereGeometry(1, 7, 7), []);
  const lineGeo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(lineBuffer, 3));
    return g;
  }, [lineBuffer]);

  return (
    <group ref={groupRef}>
      <instancedMesh ref={meshRef} args={[geo, nodeMat, NODE_COUNT]} />
      <lineSegments ref={linesRef} geometry={lineGeo} material={lineMat} />
    </group>
  );
}

export default function DataSpaceBackground() {
  return (
    <div
      aria-hidden="true"
      style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", opacity: 0.85 }}
    >
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 12], fov: 60, near: 0.1, far: 100 }}
        gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
        style={{ background: "transparent" }}
      >
        <NodeGraph />
      </Canvas>
    </div>
  );
}
