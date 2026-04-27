import { useState, useMemo, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import * as THREE from "three";

/**
 * DataSentimentLab — Análisis de sentimiento + visualización 3D.
 * ───────────────────────────────────────────────────────────────────
 * - Lexicón ES + EN (positivo/negativo/neutro/intensificadores/negaciones).
 * - Cada palabra-clave se renderiza como esfera 3D coloreada según su
 *   polaridad. La cámara orbita lentamente.
 */

const LEXICON = {
  positive: [
    "excelente","increíble","genial","feliz","amor","éxito","hermoso","perfecto","rápido","eficiente",
    "innovador","poderoso","confiable","profesional","limpio","claro","feliz","satisfecho","ganancia",
    "oportunidad","crecimiento","valor","impecable","fluido","sólido","seguro","inteligente",
    "good","great","happy","awesome","perfect","love","best","amazing","wonderful","success",
  ],
  negative: [
    "malo","terrible","horrible","odio","problema","falla","error","lento","caro","complicado",
    "frustrante","riesgo","pérdida","miedo","caída","crash","bug","vulnerable","obsoleto",
    "insuficiente","débil","inestable","deficiente","perezoso","caótico","opaco","injusto",
    "bad","hate","awful","slow","buggy","broken","fail","loss","poor","weak",
  ],
  intensifiers: ["muy","extremadamente","super","súper","totalmente","completamente","absolutamente","very","really"],
  negations: ["no","nunca","jamás","sin","not","never","no"],
};

function analyze(text: string) {
  const tokens = text
    .toLowerCase()
    .replace(/[^\p{L}\s]/gu, " ")
    .split(/\s+/)
    .filter(Boolean);

  let pos = 0, neg = 0, neuCount = 0;
  const wordsTagged: { word: string; polarity: 1 | -1 | 0; weight: number }[] = [];

  for (let i = 0; i < tokens.length; i++) {
    const w = tokens[i];
    const prev = tokens[i - 1] || "";
    const isIntensified = LEXICON.intensifiers.includes(prev);
    const isNegated = LEXICON.negations.includes(prev);
    const weight = isIntensified ? 1.7 : 1;
    if (LEXICON.positive.includes(w)) {
      const polarity = isNegated ? -1 : 1;
      if (polarity > 0) pos += weight;
      else neg += weight;
      wordsTagged.push({ word: w, polarity: polarity as 1 | -1, weight });
    } else if (LEXICON.negative.includes(w)) {
      const polarity = isNegated ? 1 : -1;
      if (polarity < 0) neg += weight;
      else pos += weight;
      wordsTagged.push({ word: w, polarity: polarity as 1 | -1, weight });
    }
  }
  neuCount = Math.max(0, tokens.length - wordsTagged.length);

  const total = pos + neg + 1e-6;
  const score = (pos - neg) / Math.max(total, 1);
  const verdict =
    score > 0.25 ? "POSITIVO" : score < -0.25 ? "NEGATIVO" : "NEUTRO";
  return { pos, neg, neuCount, score, verdict, wordsTagged };
}

const DataSentimentLab = () => {
  const [text, setText] = useState(
    "La nueva plataforma se siente increíblemente sólida y rápida. La arquitectura es limpia, segura y profesional. No tiene errores ni fallas."
  );
  const result = useMemo(() => analyze(text), [text]);
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const groupRef = useRef<THREE.Group | null>(null);

  // ── Three.js setup ────────────────────────────────────────────
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
    const camera = new THREE.PerspectiveCamera(55, W / H, 0.1, 200);
    camera.position.set(0, 0, 14);

    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const pl = new THREE.PointLight(0xc7d2fe, 1.4, 100);
    pl.position.set(8, 8, 8);
    scene.add(pl);

    const group = new THREE.Group();
    groupRef.current = group;
    scene.add(group);

    let isHidden = false;
    const onVis = () => { isHidden = document.hidden; };
    document.addEventListener("visibilitychange", onVis);

    const clock = new THREE.Clock();
    const tick = () => {
      rafRef.current = requestAnimationFrame(tick);
      if (isHidden) return;
      const t = clock.getElapsedTime();
      group.rotation.y = t * 0.18;
      group.children.forEach((m, i) => {
        m.position.y += Math.sin(t * 1.2 + i) * 0.005;
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
      group.children.forEach((m) => {
        const me = m as THREE.Mesh;
        me.geometry?.dispose();
        (me.material as THREE.Material)?.dispose();
      });
      renderer.dispose();
      if (renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement);
    };
  }, []);

  // ── Rebuild meshes when result changes ────────────────────────
  useEffect(() => {
    const group = groupRef.current;
    if (!group) return;
    while (group.children.length > 0) {
      const c = group.children[0] as THREE.Mesh;
      group.remove(c);
      c.geometry?.dispose();
      (c.material as THREE.Material)?.dispose();
    }

    const words = result.wordsTagged.slice(0, 24);
    if (words.length === 0) {
      // single neutral sphere
      const m = new THREE.Mesh(
        new THREE.IcosahedronGeometry(2, 1),
        new THREE.MeshStandardMaterial({ color: 0x4a5078, emissive: 0x4a5078, emissiveIntensity: 0.3, wireframe: true })
      );
      group.add(m);
      return;
    }

    words.forEach((w, i) => {
      const r = 4 + (i % 3) * 0.8;
      const theta = (i / words.length) * Math.PI * 2;
      const phi = Math.acos(2 * ((i + 0.5) / words.length) - 1);
      const color = w.polarity === 1 ? 0x4ade80 : w.polarity === -1 ? 0xef4444 : 0xc7d2fe;
      const m = new THREE.Mesh(
        new THREE.IcosahedronGeometry(0.4 + w.weight * 0.2, 1),
        new THREE.MeshStandardMaterial({
          color,
          emissive: color,
          emissiveIntensity: 0.5,
        })
      );
      m.position.set(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi)
      );
      group.add(m);
    });
  }, [result]);

  const verdictColor =
    result.verdict === "POSITIVO" ? "#4ade80" : result.verdict === "NEGATIVO" ? "#ef4444" : "#C7D2FE";

  return (
    <div className="relative">
      <div className="mb-4">
        <p className="font-poppins text-[11px] uppercase tracking-[0.3em] text-[#C7D2FE]/70 mb-1">
          Data analytics · NLP
        </p>
        <h4 className="font-sora text-2xl md:text-3xl text-white font-semibold">Sentiment 3D Lab</h4>
        <p className="font-poppins text-sm text-white/50 mt-1">
          Pega un texto. Lo analizamos y lo proyectamos como nube 3D donde cada esfera es una palabra clave coloreada por polaridad.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="md:col-span-2 flex flex-col gap-3">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={6}
            placeholder="Escribe o pega texto aquí…"
            className="w-full p-3.5 rounded-xl font-poppins text-sm text-white/90 bg-black/45 border border-white/10 focus:border-[#C7D2FE]/40 focus:outline-none resize-none"
          />
          <div className="grid grid-cols-3 gap-2">
            {[
              { l: "POS", v: result.pos.toFixed(1), c: "#4ade80" },
              { l: "NEG", v: result.neg.toFixed(1), c: "#ef4444" },
              { l: "SCORE", v: result.score.toFixed(2), c: "#C7D2FE" },
            ].map((s) => (
              <div key={s.l} className="px-3 py-2 rounded-lg bg-white/[0.025] border border-white/8 text-center">
                <p className="text-[9px] font-poppins uppercase tracking-[0.25em] text-white/40">{s.l}</p>
                <p className="font-mono text-sm" style={{ color: s.c }}>{s.v}</p>
              </div>
            ))}
          </div>
          <motion.div
            key={result.verdict}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="px-4 py-3 rounded-xl text-center"
            style={{ background: `${verdictColor}14`, border: `1px solid ${verdictColor}55` }}
          >
            <p className="text-[10px] font-poppins uppercase tracking-[0.3em] text-white/45">Veredicto</p>
            <p className="font-sora font-bold text-xl" style={{ color: verdictColor }}>{result.verdict}</p>
          </motion.div>
        </div>
        <div className="md:col-span-3 relative rounded-2xl overflow-hidden border border-[#C7D2FE]/12 bg-black/40" style={{ height: 380 }}>
          <div ref={containerRef} className="absolute inset-0" />
          <div className="absolute bottom-3 left-3 px-3 py-1.5 rounded-md bg-black/55 backdrop-blur border border-white/8">
            <p className="text-[10px] font-poppins uppercase tracking-[0.25em] text-white/40 mb-0.5">Tokens analizados</p>
            <p className="font-mono text-xs text-[#C7D2FE]">{result.wordsTagged.length} clave · {result.neuCount} neutro</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataSentimentLab;
