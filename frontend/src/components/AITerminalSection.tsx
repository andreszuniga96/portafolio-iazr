import { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Terminal, Cpu, Zap, Check, Activity } from "lucide-react";

// ─── Terminal lines definition ────────────────────────────────────────────────
interface TermLine {
  type: "prompt" | "output" | "success" | "info" | "warn" | "blank";
  text: string;
  delay: number; // cumulative ms before this line appears
}

const SESSIONS: TermLine[][] = [
  [
    { type: "prompt", text: "python agent_runner.py --model gemini-2.5-flash --task classify", delay: 0 },
    { type: "output", text: "▶  Initializing IAZR Agent v2.1 ...", delay: 600 },
    { type: "info",   text: "✦  Conectando a Gemini 2.5 Flash endpoint...", delay: 1100 },
    { type: "output", text: "✦  Cargando base de conocimiento (1,482 docs)...", delay: 1600 },
    { type: "success",text: "✔  Modelo listo · latencia: 312ms", delay: 2200 },
    { type: "blank",  text: "", delay: 2500 },
    { type: "prompt", text: "agent.run('clasifica las quejas del último sprint')", delay: 2700 },
    { type: "output", text: "▶  Procesando 87 documentos...", delay: 3300 },
    { type: "output", text: "▶  Embedding (dim=1536) · batch 4/4  ████████ 100%", delay: 3800 },
    { type: "info",   text: "✦  Clusters detectados: Performance (34%), Bug (28%), UX (38%)", delay: 4500 },
    { type: "success",text: "✔  Reporte generado → informe_sprint_2026.pdf", delay: 5100 },
    { type: "blank",  text: "", delay: 5400 },
    { type: "prompt", text: "# Next: n8n webhook auto-sends report to Slack ✦", delay: 5600 },
    { type: "success",text: "✔  Webhook disparado · canal #product-analytics notificado", delay: 6200 },
  ],
  [
    { type: "prompt", text: "langchain_rag.py --source crm_data --query 'leads calientes'", delay: 0 },
    { type: "output", text: "▶  Cargando RAG pipeline (LangChain + Chroma DB)...", delay: 700 },
    { type: "info",   text: "✦  Vectorizando 3,241 registros CRM...", delay: 1300 },
    { type: "output", text: "▶  Retrieval top-8 chunks · similarity > 0.82", delay: 1900 },
    { type: "success",text: "✔  Contexto enriquecido con historial de interacciones", delay: 2500 },
    { type: "blank",  text: "", delay: 2800 },
    { type: "prompt", text: "llm.invoke('redacta email de seguimiento personalizado')", delay: 3000 },
    { type: "output", text: "▶  Tokens procesados: 1,847  ·  costo: $0.0012 USD", delay: 3700 },
    { type: "info",   text: "✦  Sentimiento detectado: positivo (84%) · acción: formalizar", delay: 4400 },
    { type: "success",text: "✔  Email generado y enviado vía SendGrid API", delay: 5000 },
    { type: "blank",  text: "", delay: 5300 },
    { type: "success",text: "✔  Pipeline completado · ahorro estimado: 3.2h/día", delay: 5600 },
  ],
];

// ─── Animated metric counter ──────────────────────────────────────────────────
const MetricCounter = ({ target, unit, label, color }: { target: number; unit: string; label: string; color: string }) => {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        let start = 0;
        const duration = 1800;
        const step = target / (duration / 16);
        const t = setInterval(() => {
          start = Math.min(start + step, target);
          setValue(Math.round(start));
          if (start >= target) clearInterval(t);
        }, 16);
      }
    }, { threshold: 0.5 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return (
    <div ref={ref} className="flex flex-col items-center">
      <div className="text-3xl md:text-4xl font-sora font-bold tabular-nums" style={{ color }}>
        {value.toLocaleString()}{unit}
      </div>
      <div className="text-[10px] font-poppins uppercase tracking-widest mt-1" style={{ color: "rgba(240,237,232,0.35)" }}>
        {label}
      </div>
    </div>
  );
};

// ─── Main Component ────────────────────────────────────────────────────────────
const AITerminalSection = () => {
  const [sessionIdx, setSessionIdx] = useState(0);
  const [visibleLines, setVisibleLines] = useState<TermLine[]>([]);
  const [isDone, setIsDone] = useState(false);
  const termRef = useRef<HTMLDivElement>(null);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const runSession = useCallback((idx: number) => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    setVisibleLines([]);
    setIsDone(false);

    const lines = SESSIONS[idx];
    lines.forEach((line) => {
      const t = setTimeout(() => {
        setVisibleLines((prev) => [...prev, line]);
        if (termRef.current) {
          termRef.current.scrollTop = termRef.current.scrollHeight;
        }
        if (line === lines[lines.length - 1]) setIsDone(true);
      }, line.delay);
      timeoutsRef.current.push(t);
    });
  }, []);

  useEffect(() => {
    runSession(0);
    return () => timeoutsRef.current.forEach(clearTimeout);
  }, [runSession]);

  // Auto-cycle sessions
  useEffect(() => {
    if (!isDone) return;
    const t = setTimeout(() => {
      const next = (sessionIdx + 1) % SESSIONS.length;
      setSessionIdx(next);
      runSession(next);
    }, 3500);
    return () => clearTimeout(t);
  }, [isDone, sessionIdx, runSession]);

  const getLineColor = (type: TermLine["type"]) => {
    switch (type) {
      case "prompt":  return "#FFFFFF";
      case "success": return "#22c55e";
      case "info":    return "#60a5fa";
      case "warn":    return "#F59E0B";
      default:        return "rgba(240,237,232,0.55)";
    }
  };

  return (
    <section
      id="ai-terminal"
      className="relative py-24 md:py-32 overflow-hidden border-t"
      style={{ background: "transparent", borderTop: "1px solid rgba(199,210,254,0.06)" }}
    >
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full blur-[120px] pointer-events-none"
        style={{ background: "rgba(255,255,255,0.04)" }} />

      {/* Data stream lines */}
      {[15, 35, 55, 75, 90].map((left, i) => (
        <div key={i} className="data-stream-line" style={{ left: `${left}%`, animationDelay: `${i * 0.8}s`, opacity: 0.06 }} />
      ))}

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.25)" }}>
              <Terminal className="w-4 h-4" style={{ color: "#FFFFFF" }} />
            </div>
            <span className="text-xs font-poppins text-white uppercase tracking-[0.3em] font-bold">
              IA en Acción · Live Demo
            </span>
          </div>
          <h2 className="text-4xl md:text-6xl font-sora leading-tight" style={{ color: "#f0ede8" }}>
            Así trabaja la{" "}
            <span className="aurora-text">inteligencia artificial</span>
            <br />en tus procesos
          </h2>
          <p className="mt-4 font-poppins text-base max-w-xl" style={{ color: "rgba(240,237,232,0.45)" }}>
            Pipelines reales. Modelos reales. Resultados medibles. Esto es lo que implemento para mis clientes.
          </p>
        </motion.div>

        {/* Main grid */}
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Terminal window */}
          <motion.div
            initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.7 }}
          >
            {/* Session switcher */}
            <div className="flex gap-2 mb-3">
              {["Análisis & Reporte IA", "RAG + CRM Automation"].map((label, i) => (
                <button
                  key={i}
                  onClick={() => { setSessionIdx(i); runSession(i); }}
                  className="px-3 py-1.5 rounded-full text-[10px] font-poppins uppercase tracking-wider transition-all"
                  style={{
                    background: sessionIdx === i ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.03)",
                    border: `1px solid ${sessionIdx === i ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.06)"}`,
                    color: sessionIdx === i ? "#FFFFFF" : "rgba(255,255,255,0.35)",
                  }}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="terminal-window shadow-2xl shadow-black/60">
              {/* Header */}
              <div className="terminal-header">
                <div className="terminal-dot" style={{ background: "#EF4444" }} />
                <div className="terminal-dot" style={{ background: "#F59E0B" }} />
                <div className="terminal-dot" style={{ background: "#22C55E" }} />
                <div className="flex-1 text-center">
                  <span className="text-[11px] font-poppins" style={{ color: "rgba(255,255,255,0.25)" }}>
                    iazr@ai-lab ~ /projects/client
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-[10px] font-poppins" style={{ color: "rgba(255,255,255,0.2)" }}>LIVE</span>
                </div>
              </div>

              {/* Lines */}
              <div
                ref={termRef}
                className="p-5 overflow-y-auto space-y-0.5"
                style={{ minHeight: "320px", maxHeight: "380px" }}
              >
                {visibleLines.map((line, i) => (
                  line.type === "blank" ? (
                    <div key={i} className="h-3" />
                  ) : (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2 }}
                      className="terminal-line flex gap-2"
                    >
                      {line.type === "prompt" && (
                        <span className="terminal-prompt flex-shrink-0">›</span>
                      )}
                      <span style={{ color: getLineColor(line.type) }}>{line.text}</span>
                    </motion.div>
                  )
                ))}
                {!isDone && visibleLines.length > 0 && (
                  <div className="terminal-line flex gap-2">
                    <span className="terminal-prompt">›</span>
                    <span className="terminal-cursor" />
                  </div>
                )}
                {isDone && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-3 flex items-center gap-2 terminal-line"
                  >
                    <span className="terminal-prompt">›</span>
                    <span className="terminal-success">Pipeline ejecutado con éxito ·</span>
                    <span className="terminal-cursor" />
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Right column: Metrics + Features */}
          <motion.div
            initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.15 }}
            className="flex flex-col gap-6"
          >
            {/* Live AI Metrics */}
            <div className="bento-card">
              <div className="flex items-center gap-2 mb-5">
                <Activity className="w-4 h-4" style={{ color: "#FFFFFF" }} />
                <span className="text-[10px] font-poppins uppercase tracking-widest font-bold" style={{ color: "#FFFFFF" }}>
                  Métricas en Producción
                </span>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <MetricCounter target={12} unit="+" label="Modelos en prod." color="#FFFFFF" />
                <MetricCounter target={2400000} unit="+" label="Tokens / mes" color="#F59E0B" />
                <MetricCounter target={312} unit="ms" label="Latencia prom." color="#22c55e" />
              </div>
            </div>

            {/* Feature list */}
            <div className="grid gap-3">
              {[
                { icon: <Cpu className="w-4 h-4" />, color: "#8B5CF6", title: "Arquitecturas Multi-Agente", desc: "Sistemas donde varios agentes LLM colaboran en paralelo para resolver tareas complejas." },
                { icon: <Zap className="w-4 h-4" />, color: "#FFFFFF", title: "Pipelines RAG de Alta Precisión", desc: "Recuperación semántica sobre tus datos privados con embeddings y vectores." },
                { icon: <Check className="w-4 h-4" />, color: "#22c55e", title: "Evaluación y Fine-tuning", desc: "Métricas de calidad, RLHF y ajuste fino para máxima precisión en tu dominio." },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: 0.2 + i * 0.1 }}
                  className="flex items-start gap-3 p-4 rounded-xl transition-all hover:translate-x-1 duration-200"
                  style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}
                >
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: `${item.color}15`, color: item.color }}>
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="text-sm font-sora font-semibold mb-0.5" style={{ color: "#f0ede8" }}>{item.title}</h4>
                    <p className="text-xs font-poppins leading-relaxed" style={{ color: "rgba(240,237,232,0.4)" }}>{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.a
              href="https://wa.me/573229132643?text=Hola%20Ivan%2C%20quiero%20implementar%20un%20pipeline%20de%20IA%20en%20mi%20empresa."
              target="_blank" rel="noreferrer"
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              className="btn-glow flex items-center justify-center gap-2 py-4 rounded-2xl bg-primary text-primary-foreground font-sora font-bold text-sm uppercase tracking-wider"
            >
              <Terminal className="w-4 h-4" />
              Implementar IA en mi empresa
            </motion.a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AITerminalSection;
