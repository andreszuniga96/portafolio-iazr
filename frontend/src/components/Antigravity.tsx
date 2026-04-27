import { Canvas, useFrame, useThree } from '@react-three/fiber';
import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';

interface AntigravityProps {
  count?: number;
  magnetRadius?: number;
  ringRadius?: number;
  waveSpeed?: number;
  waveAmplitude?: number;
  particleSize?: number;
  lerpSpeed?: number;
  color?: string;
  autoAnimate?: boolean;
  particleVariance?: number;
  rotationSpeed?: number;
  depthFactor?: number;
  pulseSpeed?: number;
  particleShape?: 'capsule' | 'sphere' | 'box' | 'tetrahedron';
  fieldStrength?: number;
}

const AntigravityInner: React.FC<AntigravityProps> = ({
  count = 300, magnetRadius = 10, ringRadius = 10, waveSpeed = 0.4, waveAmplitude = 1,
  particleSize = 2, lerpSpeed = 0.1, color = '#FFFFFF', autoAnimate = false,
  particleVariance = 1, rotationSpeed = 0, depthFactor = 1, pulseSpeed = 3,
  particleShape = 'capsule', fieldStrength = 10,
}) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const { viewport } = useThree();
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const lastMousePos = useRef({ x: 0, y: 0 });
  const lastMoveTime = useRef(0);
  const virtualMouse = useRef({ x: 0, y: 0 });

  const particles = useMemo(() => {
    const w = viewport.width || 100, h = viewport.height || 100;
    return Array.from({ length: count }, () => ({
      t: Math.random() * 100, speed: 0.01 + Math.random() / 200,
      mx: (Math.random() - 0.5) * w, my: (Math.random() - 0.5) * h, mz: (Math.random() - 0.5) * 20,
      cx: (Math.random() - 0.5) * w, cy: (Math.random() - 0.5) * h, cz: (Math.random() - 0.5) * 20,
      randomRadiusOffset: (Math.random() - 0.5) * 2,
    }));
  }, [count, viewport.width, viewport.height]);

  useFrame(state => {
    const mesh = meshRef.current; if (!mesh) return;
    const { viewport: v, pointer: m } = state;
    const dist = Math.hypot(m.x - lastMousePos.current.x, m.y - lastMousePos.current.y);
    if (dist > 0.001) { lastMoveTime.current = Date.now(); lastMousePos.current = { x: m.x, y: m.y }; }
    let destX = (m.x * v.width) / 2, destY = (m.y * v.height) / 2;
    if (autoAnimate && Date.now() - lastMoveTime.current > 2000) {
      const t = state.clock.getElapsedTime();
      destX = Math.sin(t * 0.5) * (v.width / 4); destY = Math.cos(t) * (v.height / 4);
    }
    virtualMouse.current.x += (destX - virtualMouse.current.x) * 0.05;
    virtualMouse.current.y += (destY - virtualMouse.current.y) * 0.05;
    const tx = virtualMouse.current.x, ty = virtualMouse.current.y;
    const globalRot = state.clock.getElapsedTime() * rotationSpeed;

    particles.forEach((p, i) => {
      p.t += p.speed / 2;
      const pf = 1 - p.cz / 50, ptx = tx * pf, pty = ty * pf;
      const dx = p.mx - ptx, dy = p.my - pty, dist2 = Math.hypot(dx, dy);
      let target = { x: p.mx, y: p.my, z: p.mz * depthFactor };
      if (dist2 < magnetRadius) {
        const angle = Math.atan2(dy, dx) + globalRot;
        const wave = Math.sin(p.t * waveSpeed + angle) * (0.5 * waveAmplitude);
        const curR = ringRadius + wave + p.randomRadiusOffset * (5 / (fieldStrength + 0.1));
        target = { x: ptx + curR * Math.cos(angle), y: pty + curR * Math.sin(angle), z: p.mz * depthFactor + Math.sin(p.t) * waveAmplitude * depthFactor };
      }
      p.cx += (target.x - p.cx) * lerpSpeed; p.cy += (target.y - p.cy) * lerpSpeed; p.cz += (target.z - p.cz) * lerpSpeed;
      dummy.position.set(p.cx, p.cy, p.cz);
      dummy.lookAt(ptx, pty, p.cz); dummy.rotateX(Math.PI / 2);
      const fromRing = Math.abs(Math.hypot(p.cx - ptx, p.cy - pty) - ringRadius);
      const sf = Math.max(0, Math.min(1, 1 - fromRing / 10));
      const fs = sf * (0.8 + Math.sin(p.t * pulseSpeed) * 0.2 * particleVariance) * particleSize;
      dummy.scale.setScalar(fs); dummy.updateMatrix(); mesh.setMatrixAt(i, dummy.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      {particleShape === 'capsule' && <capsuleGeometry args={[0.1, 0.4, 4, 8]} />}
      {particleShape === 'sphere' && <sphereGeometry args={[0.2, 16, 16]} />}
      {particleShape === 'box' && <boxGeometry args={[0.3, 0.3, 0.3]} />}
      {particleShape === 'tetrahedron' && <tetrahedronGeometry args={[0.3]} />}
      <meshBasicMaterial color={color} />
    </instancedMesh>
  );
};

const Antigravity: React.FC<AntigravityProps> = (props) => (
  <Canvas camera={{ position: [0, 0, 50], fov: 35 }}>
    <AntigravityInner {...props} />
  </Canvas>
);

export default Antigravity;
