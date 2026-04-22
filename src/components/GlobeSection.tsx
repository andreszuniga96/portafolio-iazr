import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";

// ─── Marquee data ────────────────────────────────────────────────────────────
const techStack = [
  { label: "React.js", category: "Frontend" },
  { label: "Node.js", category: "Backend" },
  { label: "Python", category: "IA / Data" },
  { label: "OpenAI GPT-4", category: "LLM" },
  { label: "Google Gemini", category: "LLM" },
  { label: "LangChain", category: "Agentes" },
  { label: "PostgreSQL", category: "Database" },
  { label: "MongoDB", category: "Database" },
  { label: "n8n", category: "Automate" },
  { label: "AWS / Vercel", category: "Cloud" },
  { label: "Zero-Trust", category: "Seguridad" },
  { label: "Three.js", category: "3D" },
  { label: "GSAP", category: "Animación" },
  { label: "Power BI", category: "Analytics" },
  { label: "Scikit-learn", category: "ML" },
  { label: "Docker", category: "DevOps" },
];

const clients = [
  "MinTIC Colombia",
  "Zolaris Platform",
  "Registraduría Nacional",
  "Parquesoft Nariño",
  "Talento Tech",
  "StartUp Hub Pasto",
  "MGA Gov Projects",
  "Solar IoT Networks",
];

const stats = [
  { value: 40, suffix: "+", label: "Proyectos entregados" },
  { value: 98, suffix: "%", label: "Satisfacción de clientes" },
  { value: 5, suffix: " años", label: "En el ecosistema digital" },
  { value: 24, suffix: "/7", label: "Sistemas activos" },
];

// ─── Animated Counter ────────────────────────────────────────────────────────
const Counter = ({ value, suffix }: { value: number; suffix: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 1800;
    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      // Easing: ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * value));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, value]);

  return <span ref={ref}>{count}{suffix}</span>;
};

// ─── Marquee Track ───────────────────────────────────────────────────────────
interface MarqueeTrackProps {
  items: { label: string; category?: string }[];
  speed?: number;
  reverse?: boolean;
}

const MarqueeTrack = ({ items, speed = 35, reverse = false }: MarqueeTrackProps) => {
  const doubled = [...items, ...items];

  return (
    <div className="overflow-hidden relative">
      {/* Edge fade masks */}
      <div className="absolute inset-y-0 left-0 w-24 z-10 pointer-events-none"
        style={{ background: "linear-gradient(to right, #08090e, transparent)" }} />
      <div className="absolute inset-y-0 right-0 w-24 z-10 pointer-events-none"
        style={{ background: "linear-gradient(to left, #08090e, transparent)" }} />

      <motion.div
        className="flex gap-4 w-max"
        animate={{ x: reverse ? ["0%", "50%"] : ["50%", "0%"] }}
        transition={{ duration: speed, repeat: Infinity, ease: "linear" }}
      >
        {doubled.map((item, i) => (
          <div key={i}
            className="flex items-center gap-2.5 px-5 py-2.5 rounded-full border flex-shrink-0 group cursor-default transition-all duration-300 hover:scale-105"
            style={{
              background: "rgba(255,255,255,0.03)",
              borderColor: "rgba(255,255,255,0.08)",
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,107,43,0.4)";
              (e.currentTarget as HTMLElement).style.background = "rgba(255,107,43,0.08)";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.08)";
              (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.03)";
            }}
          >
            {item.category && (
              <span className="text-[10px] font-poppins uppercase tracking-wider text-white/25 font-bold">
                {item.category}
              </span>
            )}
            <span className="text-sm font-sora text-white/70 font-medium whitespace-nowrap">{item.label}</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

// ─── Floating Orb ────────────────────────────────────────────────────────────
const FloatingOrb = () => (
  <motion.div
    className="absolute rounded-full pointer-events-none"
    animate={{ y: [0, -20, 0], scale: [1, 1.04, 1] }}
    transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
    style={{
      width: 500,
      height: 500,
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      background: "radial-gradient(circle, rgba(255,107,43,0.12) 0%, rgba(255,107,43,0.04) 50%, transparent 70%)",
      filter: "blur(40px)",
    }}
  />
);

// ─── Main Section ────────────────────────────────────────────────────────────
const GlobalPresenceSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [40, -40]);

  return (
    <section
      ref={sectionRef}
      className="relative py-28 md:py-40 overflow-hidden border-t border-white/5"
      style={{ background: "linear-gradient(180deg, #08090e 0%, #060708 50%, #05060a 100%)" }}
    >
      <FloatingOrb />

      {/* Noise texture overlay */}
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
            Tecnología con<br />
            <span style={{ color: "var(--primary-color)" }}>impacto regional</span>
          </h2>
          <p className="mt-6 text-white/40 font-poppins text-lg max-w-2xl mx-auto leading-relaxed">
            Desde Pasto, Nariño, construyo soluciones digitales que operan a escala nacional e internacional.
          </p>
        </motion.div>

        {/* ── Stats grid ── */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-24"
          style={{ y }}
        >
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              whileHover={{ scale: 1.04, y: -4 }}
              className="relative p-7 rounded-3xl overflow-hidden cursor-default group"
              style={{
                background: "rgba(255,255,255,0.025)",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              {/* Glow on hover */}
              <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: "radial-gradient(circle at 50% 50%, rgba(255,107,43,0.08), transparent 70%)" }}
              />
              <p className="text-4xl md:text-5xl font-sora font-bold mb-2 relative z-10"
                style={{ color: "var(--primary-color)" }}>
                <Counter value={stat.value} suffix={stat.suffix} />
              </p>
              <p className="text-white/40 font-poppins text-sm relative z-10">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Divider */}
        <div className="mb-16 text-center">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-xs font-poppins uppercase tracking-[0.3em] text-white/25 font-bold"
          >
            Stack tecnológico · Herramientas
          </motion.p>
        </div>
      </div>

      {/* ── Tech Marquees ── */}
      <div className="space-y-4 mb-16">
        <MarqueeTrack items={techStack} speed={40} />
        <MarqueeTrack
          items={clients.map(c => ({ label: c }))}
          speed={30}
          reverse
        />
        <MarqueeTrack items={techStack.slice(8)} speed={50} />
      </div>

      {/* ── Bottom CTA ── */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mt-16 relative rounded-[2.5rem] overflow-hidden p-10 md:p-16 text-center"
          style={{
            background: "linear-gradient(135deg, rgba(255,107,43,0.08) 0%, rgba(255,107,43,0.03) 50%, rgba(255,255,255,0.02) 100%)",
            border: "1px solid rgba(255,107,43,0.2)",
          }}
        >
          {/* Corner glow */}
          <div className="absolute top-0 right-0 w-80 h-80 pointer-events-none"
            style={{ background: "radial-gradient(circle at 80% 20%, rgba(255,107,43,0.15), transparent 70%)" }}
          />
          <div className="absolute bottom-0 left-0 w-80 h-80 pointer-events-none"
            style={{ background: "radial-gradient(circle at 20% 80%, rgba(255,107,43,0.08), transparent 70%)" }}
          />

          <span className="text-xs font-poppins uppercase tracking-[0.3em] font-bold block mb-4"
            style={{ color: "var(--primary-color)" }}>
            ¿Listo para comenzar?
          </span>
          <h3 className="text-3xl md:text-5xl font-sora text-white mb-6 relative z-10">
            Tu próximo proyecto me espera
          </h3>
          <p className="text-white/40 font-poppins max-w-xl mx-auto mb-10 relative z-10">
            Cuéntame tu idea. En 24 horas tendrás una propuesta técnica lista, sin compromiso.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
            <a
              href="https://wa.me/573229132643?text=Hola%20Ivan%2C%20quiero%20hablar%20sobre%20un%20proyecto"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-full font-sora font-bold text-sm uppercase tracking-wider transition-all hover:scale-105 active:scale-95 shadow-xl"
              style={{ background: "var(--primary-color)", color: "#000", boxShadow: "0 0 40px rgba(255,107,43,0.4)" }}
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z"/>
              </svg>
              Iniciar conversación
            </a>
            <a
              href="#servicios"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-sora font-bold text-sm uppercase tracking-wider text-white/60 hover:text-white border border-white/15 hover:border-white/30 transition-all"
            >
              Ver servicios →
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default GlobalPresenceSection;
