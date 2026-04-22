import { useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Zap } from "lucide-react";

// ── Particle field background ──────────────────────────────────────────────────
const ParticleField = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener("resize", resize);

    const particles: { x: number; y: number; vx: number; vy: number; size: number; opacity: number }[] = Array.from({ length: 55 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      size: Math.random() * 1.5 + 0.5,
      opacity: Math.random() * 0.4 + 0.1,
    }));

    let raf: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,107,43,${p.opacity})`;
        ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={canvasRef} className="neural-canvas opacity-60" />;
};

const CTASection = () => {
  const slotsLeft = 3;

  return (
    <section className="relative py-24 md:py-36 overflow-hidden border-t"
      style={{ backgroundColor: "#0c0c0e", borderColor: "rgba(42,39,36,0.6)" }}>
      <ParticleField />

      {/* Radial warm glow */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(255,107,43,0.06), transparent 70%)" }} />

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8"
          style={{ background: "rgba(255,107,43,0.1)", border: "1px solid rgba(255,107,43,0.25)" }}
        >
          <Zap className="w-3.5 h-3.5 text-primary" />
          <span className="text-xs font-poppins uppercase tracking-[0.25em] font-bold text-primary">
            {slotsLeft} slots disponibles este mes
          </span>
          <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
        </motion.div>

        {/* Main headline */}
        <motion.h2
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-6xl lg:text-7xl font-sora font-bold leading-none mb-6"
          style={{ color: "#f0ede8" }}
        >
          ¿Listo para construir
          <br />
          <span className="aurora-text">algo extraordinario?</span>
        </motion.h2>

        {/* Sub */}
        <motion.p
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-base md:text-lg font-poppins mb-12 max-w-xl mx-auto"
          style={{ color: "rgba(240,237,232,0.5)" }}
        >
          En 30 minutos definimos tu proyecto, el stack ideal y una inversión transparente. Sin compromisos, con visión de producto.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a
            href="https://wa.me/573229132643?text=Hola%20Ivan%20Zu%C3%B1iga%20%F0%9F%91%8B%2C%20quiero%20agendar%20una%20reuni%C3%B3n%20virtual%20para%20hablar%20de%20mi%20proyecto."
            target="_blank" rel="noreferrer"
            className="btn-glow inline-flex items-center gap-2.5 px-9 py-5 rounded-full bg-primary text-black font-sora font-bold text-sm uppercase tracking-wider hover:brightness-110 hover:scale-105 active:scale-95 transition-all"
          >
            Agendar reunión gratuita
            <ArrowRight className="w-4 h-4" />
          </a>
          <a
            href="#servicios"
            className="inline-flex items-center gap-2 px-9 py-5 rounded-full font-sora font-semibold text-sm uppercase tracking-wider transition-all hover:scale-105 active:scale-95"
            style={{ border: "1px solid rgba(255,255,255,0.1)", color: "rgba(240,237,232,0.7)", background: "rgba(255,255,255,0.03)" }}
          >
            Ver servicios
          </a>
        </motion.div>

        {/* Social proof testimonial */}
        <motion.div
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-14 inline-flex items-center gap-4 px-6 py-4 rounded-2xl"
          style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div className="flex -space-x-2">
            {["#FF6B2B", "#3B82F6", "#22C55E"].map((c, i) => (
              <div key={i} className="w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold"
                style={{ background: `${c}25`, borderColor: "#0c0c0e", color: c }}>
                {["C", "M", "L"][i]}
              </div>
            ))}
          </div>
          <div className="text-left">
            <p className="text-xs font-poppins" style={{ color: "rgba(240,237,232,0.65)" }}>
              "Ivan transformó nuestro proyecto en 4 semanas con IA real."
            </p>
            <p className="text-[10px] font-poppins mt-0.5" style={{ color: "#8a857c" }}>
              — Clientes reales · Colombia
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
