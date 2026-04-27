import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import * as THREE from "three";

/**
 * LiveThreatMap — Visualizador 3D de amenazas cibernéticas globales
 * ───────────────────────────────────────────────────────────────────
 * Tier-1 mock realista (sin API key): Earth 3D rotando + arcos animados
 * que conectan ciudades reales con tipo de amenaza.
 * El feed se actualiza cada 3 s simulando un SOC global.
 */

const CITIES: { name: string; lat: number; lon: number; flag: string }[] = [
  { name: "Bogotá",         lat: 4.71,   lon: -74.07, flag: "🇨🇴" },
  { name: "São Paulo",      lat: -23.55, lon: -46.63, flag: "🇧🇷" },
  { name: "México DF",      lat: 19.43,  lon: -99.13, flag: "🇲🇽" },
  { name: "Madrid",         lat: 40.41,  lon: -3.70,  flag: "🇪🇸" },
  { name: "London",         lat: 51.50,  lon: -0.12,  flag: "🇬🇧" },
  { name: "Berlin",         lat: 52.52,  lon: 13.40,  flag: "🇩🇪" },
  { name: "Moscow",         lat: 55.75,  lon: 37.61,  flag: "🇷🇺" },
  { name: "Tehran",         lat: 35.68,  lon: 51.38,  flag: "🇮🇷" },
  { name: "Beijing",        lat: 39.90,  lon: 116.40, flag: "🇨🇳" },
  { name: "Pyongyang",      lat: 39.03,  lon: 125.75, flag: "🇰🇵" },
  { name: "Tokyo",          lat: 35.68,  lon: 139.69, flag: "🇯🇵" },
  { name: "Sydney",          lat: -33.86, lon: 151.20, flag: "🇦🇺" },
  { name: "New York",       lat: 40.71,  lon: -74.00, flag: "🇺🇸" },
  { name: "San Francisco",  lat: 37.77,  lon: -122.41,flag: "🇺🇸" },
  { name: "Buenos Aires",   lat: -34.61, lon: -58.38, flag: "🇦🇷" },
  { name: "Lagos",          lat: 6.52,   lon: 3.37,   flag: "🇳🇬" },
];

const THREAT_TYPES = [
  { name: "DDoS",        color: 0xff4d6d },
  { name: "Phishing",    color: 0xfbbf24 },
  { name: "Ransomware",  color: 0xa855f7 },
  { name: "Brute-Force", color: 0x60a5fa },
  { name: "Exploit",     color: 0xc7d2fe },
];

const latLonToVec3 = (lat: number, lon: number, r: number) => {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -r * Math.sin(phi) * Math.cos(theta),
     r * Math.cos(phi),
     r * Math.sin(phi) * Math.sin(theta)
  );
};

const LiveThreatMap = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const arcsGroupRef = useRef<THREE.Group | null>(null);
  const earthRef = useRef<THREE.Mesh | null>(null);
  const [feed, setFeed] = useState<{ id: number; from: string; to: string; type: string; flag: string }[]>([]);
  const [counter, setCounter] = useState({ blocked: 0, country: "COL" });

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const W = container.clientWidth, H = container.clientHeight;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(W, H);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 200);
    camera.position.set(0, 0, 12);

    scene.add(new THREE.AmbientLight(0xffffff, 0.4));
    const dl = new THREE.DirectionalLight(0xc7d2fe, 1.1);
    dl.position.set(8, 6, 5);
    scene.add(dl);

    const R = 3.3;
    const earth = new THREE.Mesh(
      new THREE.SphereGeometry(R, 64, 64),
      new THREE.MeshStandardMaterial({
        color: 0x131725,
        emissive: 0x1a1d2e,
        emissiveIntensity: 0.35,
        wireframe: true,
        wireframeLinewidth: 0.5,
      } as any)
    );
    scene.add(earth);
    earthRef.current = earth;

    // Solid darker inner sphere so wireframe pops
    const inner = new THREE.Mesh(
      new THREE.SphereGeometry(R * 0.985, 48, 48),
      new THREE.MeshBasicMaterial({ color: 0x0a0b12, transparent: true, opacity: 0.85 })
    );
    scene.add(inner);

    // Atmospheric halo
    const halo = new THREE.Mesh(
      new THREE.SphereGeometry(R * 1.06, 32, 32),
      new THREE.MeshBasicMaterial({
        color: 0xc7d2fe,
        transparent: true,
        opacity: 0.06,
        side: THREE.BackSide,
      })
    );
    scene.add(halo);

    // Permanent city dots
    CITIES.forEach((c) => {
      const v = latLonToVec3(c.lat, c.lon, R + 0.02);
      const dot = new THREE.Mesh(
        new THREE.SphereGeometry(0.06, 12, 12),
        new THREE.MeshBasicMaterial({ color: 0xc7d2fe })
      );
      dot.position.copy(v);
      scene.add(dot);
    });

    const arcsGroup = new THREE.Group();
    arcsGroupRef.current = arcsGroup;
    scene.add(arcsGroup);

    let isHidden = false;
    const onVis = () => { isHidden = document.hidden; };
    document.addEventListener("visibilitychange", onVis);

    const clock = new THREE.Clock();
    const tick = () => {
      rafRef.current = requestAnimationFrame(tick);
      if (isHidden) return;
      const t = clock.getElapsedTime();
      earth.rotation.y = t * 0.06;
      inner.rotation.y = t * 0.06;
      arcsGroup.rotation.y = t * 0.06;
      // Animate arcs ("travel")
      arcsGroup.children.forEach((arc) => {
        const m = arc as THREE.Line;
        const mat = m.material as THREE.LineBasicMaterial;
        const userData = (arc.userData as any);
        userData.life = (userData.life || 0) + 0.012;
        mat.opacity = Math.max(0, 1 - userData.life);
      });
      // Cleanup expired arcs
      arcsGroup.children = arcsGroup.children.filter((a) => {
        const ud = (a.userData as any);
        if (ud.life > 1) {
          const m = a as THREE.Line;
          (m.geometry as THREE.BufferGeometry).dispose();
          (m.material as THREE.Material).dispose();
          return false;
        }
        return true;
      });
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
      arcsGroup.children.forEach((a) => {
        const m = a as THREE.Line;
        m.geometry?.dispose();
        (m.material as THREE.Material)?.dispose();
      });
      [earth, inner, halo].forEach((mesh) => {
        mesh.geometry?.dispose();
        (mesh.material as THREE.Material)?.dispose();
      });
      renderer.dispose();
      if (renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement);
    };
  }, []);

  // Generate threats
  useEffect(() => {
    let id = 1;
    const generate = () => {
      const arcs = arcsGroupRef.current;
      if (!arcs) return;
      const from = CITIES[Math.floor(Math.random() * CITIES.length)];
      let to = CITIES[Math.floor(Math.random() * CITIES.length)];
      while (to.name === from.name) to = CITIES[Math.floor(Math.random() * CITIES.length)];
      const threat = THREAT_TYPES[Math.floor(Math.random() * THREAT_TYPES.length)];

      const R = 3.3;
      const start = latLonToVec3(from.lat, from.lon, R + 0.02);
      const end = latLonToVec3(to.lat, to.lon, R + 0.02);
      const mid = start.clone().lerp(end, 0.5);
      mid.normalize().multiplyScalar(R + 1.4);

      const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
      const points = curve.getPoints(40);
      const geom = new THREE.BufferGeometry().setFromPoints(points);
      const mat = new THREE.LineBasicMaterial({ color: threat.color, transparent: true, opacity: 1 });
      const line = new THREE.Line(geom, mat);
      line.userData = { life: 0 };
      arcs.add(line);

      setFeed((prev) => [{ id: id++, from: `${from.flag} ${from.name}`, to: `${to.flag} ${to.name}`, type: threat.name, flag: from.flag }, ...prev].slice(0, 6));
      setCounter((c) => ({
        blocked: c.blocked + Math.floor(Math.random() * 4) + 1,
        country: from.flag,
      }));
    };
    generate();
    const interval = setInterval(generate, 1900);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div>
          <p className="font-poppins text-[11px] uppercase tracking-[0.3em] text-[#C7D2FE]/70 mb-1">
            Threat intelligence · Tier-1
          </p>
          <h4 className="font-sora text-2xl md:text-3xl text-white font-semibold">Mapa de amenazas global</h4>
          <p className="font-poppins text-sm text-white/50 mt-1">
            Cada arco representa un evento detectado en SOC simulado. Color = tipo de amenaza.
          </p>
        </div>
        <span className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/8 border border-red-500/22">
          <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
          <span className="font-poppins text-xs text-red-300">{counter.blocked.toLocaleString()} bloqueadas</span>
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 relative rounded-2xl overflow-hidden border border-[#C7D2FE]/12 bg-black/40" style={{ height: 380 }}>
          <div ref={containerRef} className="absolute inset-0" />
        </div>
        <div className="rounded-2xl border border-[#C7D2FE]/12 bg-black/40 p-4 overflow-hidden" style={{ height: 380 }}>
          <p className="font-poppins text-[10px] uppercase tracking-[0.3em] text-white/40 mb-3">Live feed</p>
          <div className="space-y-2 overflow-y-auto max-h-[330px] pr-1">
            {feed.map((f) => {
              const t = THREAT_TYPES.find((x) => x.name === f.type);
              return (
                <motion.div
                  key={f.id}
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="px-3 py-2 rounded-lg bg-white/[0.025] border border-white/6"
                >
                  <p className="text-xs font-mono text-white/85 leading-snug">
                    <span style={{ color: t ? `#${t.color.toString(16).padStart(6, "0")}` : "#C7D2FE" }}>{f.type}</span>
                    <span className="text-white/50"> · </span>
                    {f.from} <span className="text-white/30">→</span> {f.to}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveThreatMap;
