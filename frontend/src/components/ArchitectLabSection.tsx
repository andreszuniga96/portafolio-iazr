/**
 * ArchitectLabSection — Supreme WebGL Tech Stack Visualizer
 * Full-width immersive canvas with:
 * - Animated node graph (architecture topology)
 * - Particle data-flow streams between nodes
 * - Per-layer glowing pulse rings
 * - Real-time animated "metrics" overlay
 * - Mouse parallax on the 3D scene
 */
import { useRef, useState, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { motion, AnimatePresence } from "framer-motion";
import * as THREE from "three";
import { Cloud, Shield, Link2, Brain, Activity, Cpu, Zap, Lock } from "lucide-react";

// ── Layer definitions ─────────────────────────────────────────────────────────
const LAYERS = [
  {
    id: "cloud", label: "Cloud Infra", icon: Cloud, color: "#38bdf8",
    tech: ["AWS EC2", "Vercel Edge", "Supabase", "CloudFlare CDN"],
    metric: { label: "Uptime", value: "99.98%", icon: Activity },
    desc: "Infraestructura cloud-native multi-región con zero-downtime deployments.",
  },
  {
    id: "security", label: "Seguridad", icon: Shield, color: "#22c55e",
    tech: ["Zero-Trust", "E2E Encrypt", "WAF", "SAST/DAST"],
    metric: { label: "Threat blocks/día", value: "12.4K", icon: Lock },
    desc: "Hardening completo con auditoría continua, firewalls adaptativos y encriptación E2E.",
  },
  {
    id: "blockchain", label: "Blockchain", icon: Link2, color: "#F59E0B",
    tech: ["Solidity", "IPFS", "Ethers.js", "Chainlink"],
    metric: { label: "Tx/s", value: "1,200", icon: Zap },
    desc: "Smart contracts auditados, trazabilidad inmutable y oráculos descentralizados.",
  },
  {
    id: "ai", label: "IA & Agentes", icon: Brain, color: "#a855f7",
    tech: ["Gemini 2.0", "LangChain", "RAG", "n8n Pipelines"],
    metric: { label: "Tokens/min", value: "840K", icon: Cpu },
    desc: "Agentes LLM autónomos con RAG, pipelines de automatización y modelos fine-tuned.",
  },
] as const;

type LayerId = typeof LAYERS[number]["id"];

// ── Node positions for the architecture graph ─────────────────────────────────
const NODE_CONFIGS: Record<LayerId, { positions: [number,number,number][], hubPos: [number,number,number] }> = {
  cloud:      { hubPos: [0, 1.2, 0],    positions: [[-3,2,0],[-2,0,1.5],[2,0,-1.5],[3,2,0],[0,3,0],[-1.5,-0.5,0],[1.5,2.5,0],[0,0.5,2]] },
  security:   { hubPos: [0, 0, 0],      positions: [[-2.5,1,0],[2.5,1,0],[0,2.5,0],[0,-2.5,0],[-1.8,-1.8,0],[1.8,-1.8,0],[-1.8,1.8,0],[1.8,1.8,0]] },
  blockchain: { hubPos: [-2.5, 0, 0],   positions: [[-3.5,0,0],[-1.5,0,0],[0.5,0,0],[2.5,0,0],[-2.5,1.2,0],[-0.5,1.2,0],[1.5,1.2,0],[-1.5,-1.2,0]] },
  ai:         { hubPos: [0, -0.5, 0],   positions: [[-3,1,0],[3,1,0],[0,2.5,0],[-1.5,-1.5,0],[1.5,-1.5,0],[-2.8,-0.5,0],[2.8,-0.5,0],[0,-2,0]] },
};

// ── Particle stream between two points ───────────────────────────────────────
function ParticleStream({ from, to, color, count = 8 }: { from: THREE.Vector3; to: THREE.Vector3; color: string; count?: number }) {
  const ref = useRef<THREE.InstancedMesh>(null!);
  const offsets = useMemo(() => Array.from({ length: count }, (_, i) => i / count), [count]);
  const dummy  = useMemo(() => new THREE.Object3D(), []);
  const colorObj = useMemo(() => new THREE.Color(color), [color]);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.elapsedTime;
    offsets.forEach((off, i) => {
      const p = ((t * 0.35 + off) % 1);
      dummy.position.lerpVectors(from, to, p);
      const scale = 0.5 + Math.sin(p * Math.PI) * 0.5;
      dummy.scale.setScalar(scale * 0.08);
      dummy.updateMatrix();
      ref.current.setMatrixAt(i, dummy.matrix);
    });
    ref.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshBasicMaterial color={colorObj} transparent opacity={0.9} />
    </instancedMesh>
  );
}

// ── Architecture node ──────────────────────────────────────────────────────────
function ArchNode({ pos, color, active, isHub }: { pos: [number,number,number]; color: string; active: boolean; isHub: boolean }) {
  const ref = useRef<THREE.Mesh>(null!);
  const ringRef = useRef<THREE.Mesh>(null!);
  const phase = useMemo(() => Math.random() * Math.PI * 2, []);
  const colorObj = useMemo(() => new THREE.Color(color), [color]);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (ref.current) {
      ref.current.scale.setScalar(active ? 1 + Math.sin(t * 2 + phase) * 0.08 : 0.6);
      (ref.current.material as THREE.MeshBasicMaterial).opacity = active ? 0.95 : 0.15;
    }
    if (ringRef.current) {
      const s = 1 + ((t * 0.5 + phase) % 1) * 1.8;
      ringRef.current.scale.setScalar(s);
      (ringRef.current.material as THREE.MeshBasicMaterial).opacity = active ? Math.max(0, 0.4 - ((t * 0.5 + phase) % 1) * 0.4) : 0;
    }
  });

  return (
    <group position={pos}>
      {/* Pulse ring */}
      <mesh ref={ringRef}>
        <ringGeometry args={[isHub ? 0.28 : 0.16, isHub ? 0.32 : 0.19, 32]} />
        <meshBasicMaterial color={colorObj} transparent opacity={0} side={THREE.DoubleSide} />
      </mesh>
      {/* Core node */}
      <mesh ref={ref}>
        {isHub
          ? <icosahedronGeometry args={[0.28, 1]} />
          : <sphereGeometry args={[0.12, 12, 12]} />}
        <meshBasicMaterial color={colorObj} transparent opacity={0.15} />
      </mesh>
    </group>
  );
}

// ── Edge line between two nodes ────────────────────────────────────────────────
function Edge({ from, to, color, active }: { from: THREE.Vector3; to: THREE.Vector3; color: string; active: boolean }) {
  const ref = useRef<THREE.Line>(null!);
  const points = useMemo(() => [from, to], [from, to]);
  const geo = useMemo(() => new THREE.BufferGeometry().setFromPoints(points), [points]);
  const mat = useMemo(() => new THREE.LineBasicMaterial({ color, transparent: true, opacity: active ? 0.3 : 0.05 }), [color, active]);
  useEffect(() => { mat.opacity = active ? 0.3 : 0.05; }, [active, mat]);
  return <primitive object={new THREE.Line(geo, mat)} ref={ref} />;
}

// ── Layer scene ───────────────────────────────────────────────────────────────
function LayerScene({ layerId }: { layerId: LayerId }) {
  const layer = LAYERS.find(l => l.id === layerId)!;
  const cfg   = NODE_CONFIGS[layerId];
  const color = layer.color;

  const hubVec  = useMemo(() => new THREE.Vector3(...cfg.hubPos), [cfg]);
  const nodeVecs = useMemo(() => cfg.positions.map(p => new THREE.Vector3(...p)), [cfg]);

  return (
    <group>
      {/* Hub */}
      <ArchNode pos={cfg.hubPos} color={color} active isHub />
      {/* Satellite nodes */}
      {cfg.positions.map((pos, i) => (
        <ArchNode key={i} pos={pos} color={color} active={false} isHub={false} />
      ))}
      {/* Edges hub→satellites */}
      {nodeVecs.map((nv, i) => (
        <Edge key={i} from={hubVec} to={nv} color={color} active />
      ))}
      {/* Particle streams on first 4 edges */}
      {nodeVecs.slice(0, 4).map((nv, i) => (
        <ParticleStream key={i} from={hubVec} to={nv} color={color} count={6} />
      ))}
      {/* Grid floor */}
      <gridHelper args={[14, 24, "#0d0a2e", "#07051a"]} position={[0, -2.8, 0]} />
    </group>
  );
}

// ── Full scene with mouse parallax ────────────────────────────────────────────
function Scene({ layerId, mouse }: { layerId: LayerId; mouse: React.MutableRefObject<[number,number]> }) {
  const groupRef = useRef<THREE.Group>(null!);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.elapsedTime;
    const [mx, my] = mouse.current;
    groupRef.current.rotation.y = mx * 0.18 + Math.sin(t * 0.08) * 0.06;
    groupRef.current.rotation.x = -my * 0.10 + Math.cos(t * 0.06) * 0.03;
  });

  return (
    <group ref={groupRef}>
      <ambientLight intensity={2} />
      <LayerScene layerId={layerId} />
    </group>
  );
}

// ── Real-time ticker ──────────────────────────────────────────────────────────
function MetricTicker({ value, label, icon: Icon, color }: { value: string; label: string; icon: React.ElementType; color: string }) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-xl border" style={{ background: "rgba(0,0,0,0.5)", borderColor: `${color}25`, backdropFilter: "blur(8px)" }}>
      <Icon className="w-3.5 h-3.5 flex-shrink-0" style={{ color }} />
      <div>
        <div className="text-xs font-poppins font-bold leading-none" style={{ color }}>{value}</div>
        <div className="text-[9px] font-poppins text-white/30 leading-none mt-0.5">{label}</div>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
const ArchitectLabSection = () => {
  const [activeId, setActiveId] = useState<LayerId>("cloud");
  const mouse = useRef<[number, number]>([0, 0]);
  const containerRef = useRef<HTMLDivElement>(null);

  const activeLayer = LAYERS.find(l => l.id === activeId)!;
  const MetricIcon  = activeLayer.metric.icon;

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouse.current = [
      ((e.clientX - rect.left) / rect.width  - 0.5) * 2,
      ((e.clientY - rect.top)  / rect.height - 0.5) * 2,
    ];
  };

  return (
    <section
      id="architect-lab"
      className="relative overflow-hidden border-t border-white/5"
      style={{ background: "linear-gradient(180deg,#060811 0%,#09090B 100%)" }}
    >
      {/* ── Header ── */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16 pt-24 pb-10">
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
          <span className="text-xs font-poppins uppercase tracking-[0.3em] font-bold block mb-4" style={{ color: "var(--primary-color)" }}>
            Prueba de Concepto Técnica
          </span>
          <div className="flex flex-col md:flex-row md:items-end gap-4 justify-between">
            <h2 className="text-4xl md:text-6xl font-sora text-white leading-tight">
              Arquitecto Lab
              <span className="font-display italic ml-3" style={{ color: "#8a857c", fontWeight: 300 }}>360°</span>
            </h2>
            <p className="font-poppins text-sm max-w-md md:text-right" style={{ color: "rgba(240,237,232,0.4)" }}>
              Explora las capas de arquitectura que diseño para mis clientes. Cada capa muestra las tecnologías, flujos de datos y métricas reales.
            </p>
          </div>
        </motion.div>
      </div>

      {/* ── Layer selector tabs ── */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16 pb-8">
        <div className="flex flex-wrap gap-2">
          {LAYERS.map(l => {
            const Icon = l.icon;
            const active = activeId === l.id;
            return (
              <motion.button
                key={l.id}
                onClick={() => setActiveId(l.id)}
                whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-2xl border text-xs font-poppins font-semibold uppercase tracking-wider transition-all duration-300"
                style={{
                  background:   active ? `${l.color}18` : "rgba(255,255,255,0.03)",
                  borderColor:  active ? `${l.color}50` : "rgba(255,255,255,0.07)",
                  color:        active ? l.color : "rgba(255,255,255,0.35)",
                  boxShadow:    active ? `0 0 24px ${l.color}20` : "none",
                }}
              >
                <Icon className="w-3.5 h-3.5" />
                {l.label}
                {active && (
                  <span className="w-1.5 h-1.5 rounded-full animate-pulse ml-1" style={{ background: l.color }} />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* ── Full-width WebGL + Info ── */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => { mouse.current = [0, 0]; }}
        className="relative w-full"
        style={{ height: "520px" }}
      >
        {/* Canvas — full width */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeId}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
          >
            <Canvas
              dpr={[1, 1.5]}
              camera={{ position: [0, 1.5, 9], fov: 52 }}
              gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
              style={{ background: "transparent" }}
            >
              <Scene layerId={activeId} mouse={mouse} />
            </Canvas>
          </motion.div>
        </AnimatePresence>

        {/* Left gradient fade */}
        <div className="absolute inset-y-0 left-0 w-24 pointer-events-none" style={{ background: "linear-gradient(to right, #060811, transparent)" }} />
        {/* Right gradient fade */}
        <div className="absolute inset-y-0 right-0 w-24 pointer-events-none" style={{ background: "linear-gradient(to left, #09090B, transparent)" }} />
        {/* Bottom gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none" style={{ background: "linear-gradient(to top, #09090B, transparent)" }} />

        {/* ── Overlay info panel ── */}
        <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-6 md:p-10">
          {/* Top row: layer title + metric */}
          <div className="flex items-start justify-between">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeId + "-title"}
                initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.4 }}
                className="flex items-center gap-3"
              >
                <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: activeLayer.color, boxShadow: `0 0 8px ${activeLayer.color}` }} />
                <span className="text-xs font-poppins font-bold uppercase tracking-[0.2em]" style={{ color: activeLayer.color }}>
                  {activeLayer.label} — ACTIVO
                </span>
              </motion.div>
            </AnimatePresence>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeId + "-metric"}
                initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 16 }}
                transition={{ duration: 0.4 }}
              >
                <MetricTicker value={activeLayer.metric.value} label={activeLayer.metric.label} icon={MetricIcon} color={activeLayer.color} />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Bottom row: description + tech stack + CTA */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeId + "-bottom"}
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 16 }}
              transition={{ duration: 0.45, delay: 0.05 }}
              className="flex flex-col md:flex-row gap-4 items-start md:items-end justify-between"
            >
              {/* Description */}
              <div className="max-w-md">
                <p className="text-sm font-poppins text-white/70 leading-relaxed mb-3">{activeLayer.desc}</p>
                <div className="flex flex-wrap gap-2">
                  {activeLayer.tech.map(t => (
                    <span key={t} className="px-2.5 py-1 rounded-full text-[10px] font-poppins font-bold border"
                      style={{ borderColor: `${activeLayer.color}35`, color: activeLayer.color, background: `${activeLayer.color}10` }}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div className="pointer-events-auto">
                <motion.a
                  href={`https://wa.me/573229132643?text=Hola%20IAZR%20%F0%9F%91%8B%2C%20quiero%20dise%C3%B1ar%20la%20capa%20${encodeURIComponent(activeLayer.label)}%20de%20mi%20sistema.`}
                  target="_blank" rel="noreferrer"
                  whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-poppins font-bold border"
                  style={{
                    background: `${activeLayer.color}15`,
                    borderColor: `${activeLayer.color}50`,
                    color: activeLayer.color,
                    boxShadow: `0 0 20px ${activeLayer.color}20`,
                    backdropFilter: "blur(12px)",
                  }}
                >
                  Diseñar esta capa ↗
                </motion.a>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* ── Bottom padding ── */}
      <div className="h-16" />
    </section>
  );
};

export default ArchitectLabSection;
