import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";

// â”€â”€â”€ Stats (combined from StatsSection + Globe) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const stats = [
  { value: 40, suffix: "+", label: "Proyectos entregados" },
  { value: 98, suffix: "%", label: "SatisfacciÃ³n de clientes" },
  { value: 6, suffix: "+", label: "AÃ±os de experiencia" },
  { value: 1200, suffix: "+", label: "Estudiantes formados" },
  { value: 24, suffix: "/7", label: "Sistemas activos" },
  { value: 4, suffix: "+", label: "Universidades aliadas" },
];

const clients = [
  "MinTIC Colombia",
  "Zolaris Platform",
  "RegistradurÃ­a Nacional",
  "Parquesoft NariÃ±o",
  "Talento Tech",
  "StartUp Hub Pasto",
  "GobernaciÃ³n de NariÃ±o",
  "Solar IoT Networks",
];

// â”€â”€â”€ Animated Counter â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const Counter = ({ value, suffix }: { value: number; suffix: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 2000;
    const step = (ts: number) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * value));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, value]);

  return <span ref={ref}>{count}{suffix}</span>;
};

// â”€â”€â”€ Floating Orb â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const FloatingOrb = () => (
  <motion.div
    className="absolute rounded-full pointer-events-none"
    animate={{ y: [0, -24, 0], scale: [1, 1.05, 1] }}
    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
    style={{
      width: 600, height: 600,
      top: "50%", left: "50%",
      transform: "translate(-50%, -50%)",
      background: "radial-gradient(circle, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.03) 50%, transparent 70%)",
      filter: "blur(50px)",
    }}
  />
);

// â”€â”€â”€ Main Section â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const GlobalPresenceSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [30, -30]);

  return (
    <section
      ref={sectionRef}
      className="relative py-28 md:py-40 overflow-hidden border-t border-white/5"
      style={{ background: "linear-gradient(180deg, #06070c 0%, #070912 50%, #050810 100%)" }}
    >
      <FloatingOrb />

      {/* Noise overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundSize: "200px 200px",
        }}
      />

      <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16 relative z-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-20"
        >
          <span className="text-sm font-poppins uppercase tracking-[0.25em] font-bold block mb-5"
            style={{ color: "var(--primary-color)" }}>
            Presencia & Alcance
          </span>
          <h2 className="text-4xl md:text-6xl font-sora text-white leading-tight">
            Resultados que{" "}
            <span style={{ color: "var(--primary-color)" }}>hablan solos</span>
          </h2>
          <p className="mt-6 text-white/40 font-poppins text-lg max-w-2xl mx-auto leading-relaxed">
            Desde Pasto, NariÃ±o, construyo soluciones digitales que operan a escala nacional e internacional.
          </p>
        </motion.div>

        {/* Stats grid â€” 6 stats */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-24"
          style={{ y }}
        >
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              whileHover={{ scale: 1.05, y: -4 }}
              className="relative p-6 rounded-3xl overflow-hidden cursor-default group text-center"
              style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}
            >
              <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.10), transparent 70%)" }}
              />
              <p className="text-3xl md:text-4xl font-sora font-bold mb-1 relative z-10"
                style={{ color: "var(--primary-color)" }}>
                <Counter value={stat.value} suffix={stat.suffix} />
              </p>
              <p className="text-white/40 font-poppins text-xs relative z-10 leading-tight">{stat.label}</p>
              {/* Bottom accent */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-px rounded-full opacity-0 group-hover:w-10 group-hover:opacity-100 transition-all duration-500"
                style={{ background: "var(--primary-color)" }} />
            </motion.div>
          ))}
        </motion.div>

        {/* Client grid â€” elegant badge layout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-20"
        >
          <p className="text-center text-xs font-poppins uppercase tracking-[0.3em] text-white/25 font-bold mb-8">
            Instituciones & Clientes
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {clients.map((client, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                whileHover={{ scale: 1.06, borderColor: "rgba(255,255,255,0.4)" }}
                className="px-5 py-2.5 rounded-full text-sm font-poppins cursor-default transition-all duration-300"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "rgba(240,237,232,0.55)",
                }}
              >
                {client}
              </motion.span>
            ))}
          </div>
        </motion.div>

        {/* Bottom CTA card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative rounded-[2.5rem] overflow-hidden p-10 md:p-16 text-center"
          style={{
            background: "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 50%, rgba(255,255,255,0.02) 100%)",
            border: "1px solid rgba(255,255,255,0.2)",
          }}
        >
          <div className="absolute top-0 right-0 w-80 h-80 pointer-events-none"
            style={{ background: "radial-gradient(circle at 80% 20%, rgba(255,255,255,0.15), transparent 70%)" }} />
          <div className="absolute bottom-0 left-0 w-80 h-80 pointer-events-none"
            style={{ background: "radial-gradient(circle at 20% 80%, rgba(255,255,255,0.08), transparent 70%)" }} />

          <span className="text-xs font-poppins uppercase tracking-[0.3em] font-bold block mb-4"
            style={{ color: "var(--primary-color)" }}>
            Â¿Listo para comenzar?
          </span>
          <h3 className="text-3xl md:text-5xl font-sora text-white mb-6 relative z-10">
            Tu prÃ³ximo proyecto me espera
          </h3>
          <p className="text-white/40 font-poppins max-w-xl mx-auto mb-10 relative z-10">
            CuÃ©ntame tu idea. En 24 horas tendrÃ¡s una propuesta tÃ©cnica lista, sin compromiso.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
            <a href="https://wa.me/573229132643?text=Hola%20IAZR%20%F0%9F%91%8B%2C%20quiero%20hablar%20sobre%20un%20proyecto"
              target="_blank" rel="noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-full font-sora font-bold text-sm uppercase tracking-wider transition-all hover:scale-105 active:scale-95 shadow-xl text-black"
              style={{ background: "var(--primary-color)", boxShadow: "0 0 40px rgba(255,255,255,0.4)" }}>
              Iniciar conversaciÃ³n
            </a>
            <a href="#servicios"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-sora font-bold text-sm uppercase tracking-wider text-white/60 hover:text-white border border-white/15 hover:border-white/30 transition-all">
              Ver servicios â†’
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default GlobalPresenceSection;
