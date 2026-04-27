import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import * as THREE from "three";

/**
 * BlockchainPulse — Visualizador 3D de transacciones Polygon en vivo.
 * ───────────────────────────────────────────────────────────────────
 * - Usa el RPC público de Polygon (https://polygon-rpc.com)
 * - Polling cada 4 s para `eth_blockNumber` + `eth_getBlockByNumber`
 * - Cada tx se visualiza como una partícula 3D con tamaño ∝ valor
 * - Color: verde si tx con valor > 0, moon si tx 0-value (contract calls)
 */

interface PolygonTx {
  hash: string;
  value: number; // in MATIC (number for visualization)
  to: string | null;
  from: string;
}

const RPC_ENDPOINTS = [
  "https://polygon.publicnode.com",
  "https://1rpc.io/matic",
  "https://polygon-rpc.com",
  "https://rpc.ankr.com/polygon",
];

async function rpcCall(method: string, params: any[]): Promise<any> {
  for (const url of RPC_ENDPOINTS) {
    try {
      const r = await fetch(url, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
      });
      if (!r.ok) continue;
      const j = await r.json();
      if (j.error) continue;
      return j.result;
    } catch {
      continue;
    }
  }
  throw new Error("Todos los RPC fallaron");
}

const hexToNum = (h: string): number => (h ? parseInt(h, 16) : 0);
const weiHexToMatic = (h: string): number => {
  if (!h || h === "0x0") return 0;
  const v = BigInt(h);
  return Number(v) / 1e18;
};

const BlockchainPulse = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const meshGroupRef = useRef<THREE.Group | null>(null);
  const [stats, setStats] = useState({
    block: 0,
    txs: 0,
    totalMatic: 0,
    lastUpdate: "—",
  });
  const [error, setError] = useState<string | null>(null);

  // ── Three.js scene setup ──────────────────────────────────────
  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const w = container.clientWidth;
    const h = container.clientHeight;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(w, h);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, w / h, 0.1, 200);
    camera.position.set(0, 0, 28);

    // Ambient + point light
    scene.add(new THREE.AmbientLight(0xffffff, 0.5));
    const pl = new THREE.PointLight(0xc7d2fe, 1.4, 100);
    pl.position.set(10, 10, 10);
    scene.add(pl);

    // Central nucleus ("Polygon node")
    const nucleus = new THREE.Mesh(
      new THREE.IcosahedronGeometry(2.4, 1),
      new THREE.MeshStandardMaterial({
        color: 0x7c66ff,
        emissive: 0x7c66ff,
        emissiveIntensity: 0.4,
        wireframe: true,
      })
    );
    scene.add(nucleus);

    // Group that holds tx particles (replaced each tick)
    const meshGroup = new THREE.Group();
    meshGroupRef.current = meshGroup;
    scene.add(meshGroup);

    // ── Animate ─────────────────────────────────────────────────
    const clock = new THREE.Clock();
    let isHidden = false;
    const onVis = () => { isHidden = document.hidden; };
    document.addEventListener("visibilitychange", onVis);

    const tick = () => {
      rafRef.current = requestAnimationFrame(tick);
      if (isHidden) return;
      const t = clock.getElapsedTime();
      nucleus.rotation.x = t * 0.3;
      nucleus.rotation.y = t * 0.45;
      meshGroup.rotation.y = t * 0.18;
      renderer.render(scene, camera);
    };
    tick();

    const onResize = () => {
      const W = container.clientWidth, H = container.clientHeight;
      camera.aspect = W / H;
      camera.updateProjectionMatrix();
      renderer.setSize(W, H);
    };
    window.addEventListener("resize", onResize);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVis);
      meshGroup.children.forEach((c) => {
        const m = c as THREE.Mesh;
        if (m.geometry) m.geometry.dispose();
        if (m.material) (m.material as THREE.Material).dispose();
      });
      nucleus.geometry.dispose();
      (nucleus.material as THREE.Material).dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, []);

  // ── Build tx particles in scene ───────────────────────────────
  const renderTxs = (txs: PolygonTx[]) => {
    const group = meshGroupRef.current;
    if (!group) return;
    while (group.children.length > 0) {
      const c = group.children[0] as THREE.Mesh;
      group.remove(c);
      if (c.geometry) c.geometry.dispose();
      if (c.material) (c.material as THREE.Material).dispose();
    }
    txs.slice(0, 80).forEach((tx, i) => {
      const isValueTx = tx.value > 0;
      const r = 5 + (i % 6) * 1.2;
      const theta = (i / Math.max(txs.length, 1)) * Math.PI * 2 + Math.random() * 0.5;
      const phi = Math.acos(2 * Math.random() - 1);
      const size = isValueTx ? 0.18 + Math.min(tx.value, 100) * 0.005 : 0.12;
      const m = new THREE.Mesh(
        new THREE.SphereGeometry(size, 12, 12),
        new THREE.MeshStandardMaterial({
          color: isValueTx ? 0x4ade80 : 0xc7d2fe,
          emissive: isValueTx ? 0x4ade80 : 0xc7d2fe,
          emissiveIntensity: 0.6,
        })
      );
      m.position.set(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi)
      );
      group.add(m);
    });
  };

  // ── Polling Polygon RPC ───────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    const fetchLatestBlock = async () => {
      try {
        // 1. Get block number (with fallback chain)
        const blockHex = await rpcCall("eth_blockNumber", []);
        const blockNum = hexToNum(blockHex);
        if (!blockNum) throw new Error("No block num");

        // 2. Get latest block with full txs
        const block = await rpcCall("eth_getBlockByNumber", [blockHex, true]);
        if (cancelled) return;
        if (!block || !block.transactions) throw new Error("No txs");
        const rawTxs = block.transactions as any[];
        const txs: PolygonTx[] = rawTxs.map((t) => ({
          hash: t.hash,
          value: weiHexToMatic(t.value),
          to: t.to,
          from: t.from,
        }));
        const total = txs.reduce((s, t) => s + t.value, 0);
        renderTxs(txs);
        setStats({
          block: blockNum,
          txs: txs.length,
          totalMatic: total,
          lastUpdate: new Date().toLocaleTimeString("es-CO"),
        });
        setError(null);
      } catch (e: any) {
        if (!cancelled) setError("RPC público temporalmente saturado · reintentando…");
      }
    };

    fetchLatestBlock();
    const id = setInterval(fetchLatestBlock, 4500);
    return () => { cancelled = true; clearInterval(id); };
  }, []);

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="font-poppins text-[11px] uppercase tracking-[0.3em] text-[#C7D2FE]/70 mb-1">
            Live · Polygon Mainnet
          </p>
          <h4 className="font-sora text-2xl md:text-3xl text-white font-semibold">
            Latido en cadena
          </h4>
          <p className="font-poppins text-sm text-white/50 mt-1">
            Cada esfera es una transacción del último bloque. Verde = MATIC en movimiento · Lunar = smart-contract call
          </p>
        </div>
        <span className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-[#C7D2FE]/15">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-poppins text-xs text-white/70">RPC en vivo</span>
        </span>
      </div>

      <div className="relative rounded-2xl overflow-hidden border border-[#C7D2FE]/12 bg-black/40" style={{ height: 380 }}>
        <div ref={containerRef} className="absolute inset-0" />
        {/* Stats overlay */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-3 left-3 right-3 grid grid-cols-2 md:grid-cols-4 gap-2"
        >
          {[
            { k: "BLOQUE", v: stats.block ? `#${stats.block.toLocaleString()}` : "…" },
            { k: "TXs",    v: stats.txs ? stats.txs.toString() : "…" },
            { k: "MATIC",  v: stats.totalMatic > 0 ? stats.totalMatic.toFixed(4) : "0" },
            { k: "ÚLT.",   v: stats.lastUpdate },
          ].map((s) => (
            <div key={s.k} className="px-3 py-2 rounded-lg bg-black/55 backdrop-blur border border-white/8">
              <p className="text-[9px] font-poppins uppercase tracking-[0.25em] text-white/40">{s.k}</p>
              <p className="font-mono text-sm text-[#C7D2FE]">{s.v}</p>
            </div>
          ))}
        </motion.div>
        {error && (
          <div className="absolute top-3 right-3 px-3 py-1.5 rounded-md bg-red-500/15 border border-red-500/30">
            <p className="text-xs text-red-300 font-poppins">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlockchainPulse;
