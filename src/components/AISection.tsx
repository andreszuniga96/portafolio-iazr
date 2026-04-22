import { useRef, useEffect, useMemo, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Brain, Zap, BarChart3, Globe2, ShieldCheck, ArrowRight } from "lucide-react";
import { SectionLabel, TextReveal } from "@/components/ui/AnimatedElements";

const PRIMARY = "#FF6B2B";

const aiCapabilities = [
  {
    icon: <Brain className="w-8 h-8" />,
    title: "LLMs & Agentes Autónomos",
    desc: "Integración de modelos de lenguaje (GPT-4, Gemini, Llama) que toman decisiones, ejecutan tareas y aprenden de la conversación.",
    color: "#8B5CF6",
  },
  {
    icon: <Zap className="w-8 h-8" />,
    title: "Automatización Inteligente",
    desc: "Pipelines que procesan datos, generan reportes y disparan acciones sin intervención humana, 24×7.",
    color: PRIMARY,
  },
  {
    icon: <BarChart3 className="w-8 h-8" />,
    title: "Predicción & Analytics",
    desc: "Modelos de Machine Learning que anticipan tendencias, optimizan precios y detectan anomalías en tiempo real.",
    color: "#22C55E",
  },
  {
    icon: <Globe2 className="w-8 h-8" />,
    title: "IA en tu Plataforma Web",
    desc: "Asistentes integrados, búsqueda semántica y personalización de contenido impulsada por IA directamente en tu aplicación.",
    color: "#3B82F6",
  },
  {
    icon: <ShieldCheck className="w-8 h-8" />,
    title: "Ciberseguridad con IA",
    desc: "Detección de amenazas en tiempo real, análisis de comportamientos anómalos y hardening asistido por modelos especializados.",
    color: "#EF4444",
  },
];

// ─── Skill Constellation (Canvas D3-like) ────────────────────────────────────
const SkillConstellation = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const skills = useMemo(() => [
    { label: "Gemini", x: 0.5, y: 0.22, size: 14, color: "#8B5CF6", connections: [1, 2, 4] },
    { label: "React",  x: 0.2, y: 0.45, size: 12, color: "#61DAFB", connections: [0, 3, 5] },
    { label: "Python", x: 0.78, y: 0.42, size: 13, color: "#F59E0B", connections: [0, 4, 6] },
    { label: "Node",   x: 0.22, y: 0.72, size: 10, color: "#22C55E", connections: [1, 5] },
    { label: "n8n",    x: 0.78, y: 0.7, size: 10, color: "#EF4444", connections: [2, 6] },
    { label: "AWS",    x: 0.5, y: 0.82, size: 11, color: "#F97316", connections: [3, 4] },
    { label: "SQL",    x: 0.5, y: 0.54, size: 9, color: "#3B82F6", connections: [2, 5] },
  ], []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    let pulse = 0;
    let raf: number;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pulse += 0.02;

      const pts = skills.map(s => ({
        ...s,
        px: s.x * canvas.width,
        py: s.y * canvas.height,
      }));

      // Draw connections
      pts.forEach((a, i) => {
        a.connections.forEach(j => {
          const b = pts[j];
          const grd = ctx.createLinearGradient(a.px, a.py, b.px, b.py);
          grd.addColorStop(0, `${a.color}30`);
          grd.addColorStop(1, `${b.color}30`);
          ctx.beginPath();
          ctx.strokeStyle = grd;
          ctx.lineWidth = 1;
          ctx.moveTo(a.px, a.py);
          ctx.lineTo(b.px, b.py);
          ctx.stroke();

          // Traveling dot on connection
          const t = (Math.sin(pulse + i * 0.8) * 0.5 + 0.5);
          const dotX = a.px + (b.px - a.px) * t;
          const dotY = a.py + (b.py - a.py) * t;
          ctx.beginPath();
          ctx.arc(dotX, dotY, 2, 0, Math.PI * 2);
          ctx.fillStyle = a.color;
          ctx.fill();
        });
      });

      // Draw nodes
      pts.forEach((p, i) => {
        const breathe = Math.sin(pulse * 1.2 + i * 0.7) * 2;

        // Glow
        const grd = ctx.createRadialGradient(p.px, p.py, 0, p.px, p.py, p.size * 3 + breathe);
        grd.addColorStop(0, `${p.color}40`);
        grd.addColorStop(1, "transparent");
        ctx.beginPath();
        ctx.arc(p.px, p.py, p.size * 3 + breathe, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();

        // Node circle
        ctx.beginPath();
        ctx.arc(p.px, p.py, p.size + breathe * 0.4, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}25`;
        ctx.fill();
        ctx.strokeStyle = p.color;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Label
        ctx.fillStyle = "rgba(240,237,232,0.7)";
        ctx.font = `bold 10px 'Poppins', sans-serif`;
        ctx.textAlign = "center";
        ctx.fillText(p.label, p.px, p.py + p.size + 14);
      });

      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, [skills]);

  return (
    <canvas ref={canvasRef}
      className="w-full h-full"
      style={{ filter: "drop-shadow(0 0 20px rgba(255,107,43,0.15))" }} />
  );
};

// ─── Neural dot background ────────────────────────────────────────────────────
const NeuralBackground = () => {
  const dots = useMemo(() => Array.from({ length: 30 }, (_, i) => ({
    x: Math.random() * 100, y: Math.random() * 100,
    size: Math.random() * 2 + 0.5, delay: Math.random() * 3,
  })), []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
        {dots.map((dot, i) =>
          dots.slice(i + 1, i + 4).map((target, j) => (
            <motion.line key={`l-${i}-${j}`}
              x1={dot.x} y1={dot.y} x2={target.x} y2={target.y}
              stroke="rgba(255,107,43,0.07)" strokeWidth="0.15"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: [0, 1, 0] }}
              transition={{ duration: 4, delay: dot.delay, repeat: Infinity, repeatDelay: 2 }}
            />
          ))
        )}
        {dots.map((dot, i) => (
          <motion.circle key={`d-${i}`}
            cx={dot.x} cy={dot.y} r={dot.size * 0.12}
            fill="rgba(255,107,43,0.45)"
            animate={{ scale: [0, 1, 0], opacity: [0, 0.8, 0] }}
            transition={{ duration: 3.5, delay: dot.delay, repeat: Infinity, repeatDelay: 1.5 }}
          />
        ))}
      </svg>
    </div>
  );
};

const AISection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const [focusedCap, setFocusedCap] = useState<number | null>(null);

  return (
    <section ref={ref} className="relative py-24 md:py-32 overflow-hidden border-t"
      style={{ backgroundColor: "#0d0d10", borderColor: "rgba(42,39,36,0.6)" }}>
      <NeuralBackground />
      {/* Central glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[130px] pointer-events-none"
        style={{ background: "rgba(255,107,43,0.05)" }} />

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10">
        {/* Header with SectionLabel + TextReveal */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          <motion.div
            initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.7 }}
          >
            <SectionLabel text="Potenciado por IA" className="mb-5" />
            <h2 className="text-4xl md:text-6xl font-outfit leading-tight" style={{ color: "#f0ede8" }}>
              <TextReveal text="Soluciones que piensan," delay={0.05} />
              <br />
              <span className="aurora-text">
                <TextReveal text="aprenden y actúan" delay={0.25} />
              </span>
            </h2>
          </motion.div>
          <motion.div style={{ y }}
            initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.2 }}
          >
            <p className="font-poppins leading-relaxed text-lg mb-8"
              style={{ color: "rgba(240,237,232,0.55)" }}>
              La inteligencia artificial no es el futuro — es la ventaja competitiva de hoy. Implemento soluciones de IA que generan valor real: más eficiencia, mejores decisiones y nuevas fuentes de ingreso para tu negocio.
            </p>
            <a href="https://wa.me/573229132643?text=Hola%20Ivan%20Zu%C3%B1iga%2C%20quiero%20implementar%20IA%20en%20mi%20negocio."
              target="_blank" rel="noreferrer"
              className="inline-flex items-center gap-3 px-7 py-4 rounded-full bg-primary text-black font-sora font-bold text-sm uppercase tracking-wider hover:brightness-110 hover:scale-105 active:scale-95 transition-all">
              Implementar IA en mi negocio <ArrowRight className="w-4 h-4" />
            </a>
          </motion.div>
        </div>

        {/* Two column: Cards + Constellation */}
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Capability cards — with Bento Focus */}
          <div
            className="grid gap-4"
            onMouseLeave={() => setFocusedCap(null)}
          >
            {aiCapabilities.map((cap, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.55, delay: i * 0.08 }}
                animate={{
                  opacity: focusedCap !== null && focusedCap !== i ? 0.35 : 1,
                  scale: focusedCap !== null && focusedCap !== i ? 0.97 : 1,
                  x: focusedCap === i ? 6 : 0,
                }}
                onMouseEnter={() => setFocusedCap(i)}
                className="group flex items-start gap-4 p-5 rounded-2xl cursor-default transition-colors duration-300"
                style={{
                  background: focusedCap === i ? `${cap.color}08` : "rgba(255,255,255,0.02)",
                  border: `1px solid ${focusedCap === i ? cap.color + '25' : 'rgba(255,255,255,0.05)'}`,
                }}
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                  style={{ background: `${cap.color}15`, border: `1.5px solid ${cap.color}30`, color: cap.color }}>
                  {cap.icon}
                </div>
                <div>
                  <h3 className="font-outfit font-semibold mb-1.5" style={{ color: "#f0ede8" }}>{cap.title}</h3>
                  <p className="text-sm font-outfit leading-relaxed" style={{ color: "rgba(240,237,232,0.45)" }}>
                    {cap.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Skill Constellation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.3 }}
            className="bento-card h-[420px] lg:h-[500px] sticky top-24"
          >
            <p className="text-[10px] font-poppins uppercase tracking-widest mb-2 relative z-10"
              style={{ color: "rgba(240,237,232,0.3)" }}>
              Skill Constellation — Stack IA
            </p>
            <div className="absolute inset-0 top-10 rounded-3xl overflow-hidden">
              <SkillConstellation />
            </div>
          </motion.div>
        </div>

        {/* Tech strip */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { n: "GPT-4 / Gemini", l: "Modelos integrados" },
            { n: "n8n + Python", l: "Stack de automatización" },
            { n: "RAG + Agents", l: "Técnicas avanzadas" },
            { n: "24/7", l: "Disponibilidad del sistema" },
          ].map((s, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, scale: 0.92 }} whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }} transition={{ delay: 0.15 + i * 0.1 }}
              className="bento-card text-center"
            >
              <p className="font-sora text-primary font-bold text-lg">{s.n}</p>
              <p className="text-[10px] uppercase tracking-widest font-poppins mt-1" style={{ color: "#8a857c" }}>{s.l}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AISection;
