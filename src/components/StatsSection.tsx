import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import CountUp from "react-countup";

const stats = [
  { value: 6, suffix: "+", label: "Años experiencia" },
  { value: 1.2, suffix: "k+", decimals: 1, label: "Estudiantes mentorizados" },
  { value: 25, suffix: "+", label: "Certificaciones" },
  { value: 4, suffix: "+", label: "Universidades aliadas" },
];

// ── Neural network canvas background ──────────────────────────────────────────
const NeuralCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener("resize", resize);

    const nodes: { x: number; y: number; vx: number; vy: number }[] = Array.from({ length: 28 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
    }));

    let raf: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      nodes.forEach(n => {
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > canvas.width) n.vx *= -1;
        if (n.y < 0 || n.y > canvas.height) n.vy *= -1;
      });
      nodes.forEach((a, i) => {
        nodes.slice(i + 1).forEach(b => {
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist < 120) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(255,107,43,${0.12 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.8;
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        });
        ctx.beginPath();
        ctx.arc(a.x, a.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,107,43,0.35)";
        ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={canvasRef} className="neural-canvas" />;
};

const StatsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="relative py-24 md:py-28 overflow-hidden border-y" ref={ref}
      style={{ borderColor: "rgba(42,39,36,0.8)", backgroundColor: "#0c0c0e" }}>
      <NeuralCanvas />
      {/* Radial glow */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(255,107,43,0.04), transparent)" }} />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-xs font-poppins uppercase tracking-[0.3em] font-bold block mb-3"
            style={{ color: "#FF6B2B" }}>
            Métricas de Impacto
          </span>
          <h2 className="text-3xl md:text-5xl font-display" style={{ color: "#f0ede8" }}>
            Resultados en <em className="italic" style={{ color: "#8a857c", fontWeight: 300 }}>Cifras</em>
          </h2>
        </motion.div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {stats.map((s, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -4, scale: 1.02 }}
              className="bento-card text-center group cursor-default"
            >
              {/* Glow blob */}
              <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-xl"
                style={{ background: "rgba(255,107,43,0.08)" }} />

              <div className="relative z-10">
                <div className="text-4xl md:text-[3.5rem] font-display italic mb-2 leading-none"
                  style={{ color: "#f0ede8" }}>
                  {isInView ? (
                    <CountUp
                      start={0}
                      end={s.value}
                      duration={2.2}
                      decimals={s.decimals || 0}
                      delay={i * 0.15}
                      useEasing
                      easingFn={(t, b, c, d) => {
                        // Custom cinematic easing (exponential out)
                        return t === d ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
                      }}
                    />
                  ) : "0"}
                  <span style={{ color: "#FF6B2B" }}>{s.suffix}</span>
                </div>
                <p className="text-xs font-poppins uppercase tracking-widest" style={{ color: "#8a857c" }}>
                  {s.label}
                </p>
              </div>

              {/* Bottom accent line */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-px rounded-full opacity-0 group-hover:w-12 group-hover:opacity-100 transition-all duration-500"
                style={{ background: "#FF6B2B" }} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
