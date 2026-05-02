import { useRef, useEffect, useState } from "react";
import { motion, useInView, useMotionValue, animate } from "framer-motion";
import { TrendingUp, Users, Award, Star, Globe2, Zap, Brain, Code2 } from "lucide-react";

// ── Animated Counter ──────────────────────────────────────────────────────────
const AnimatedCounter = ({ target, suffix = "", duration = 2 }: {
  target: number; suffix?: string; duration?: number;
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const motionVal = useMotionValue(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(motionVal, target, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        if (ref.current) ref.current.textContent = Math.round(v) + suffix;
      },
    });
    return controls.stop;
  }, [inView, target, duration, motionVal, suffix]);

  return <span ref={ref}>0{suffix}</span>;
};

// ── Data ──────────────────────────────────────────────────────────────────────
const impactStats = [
  {
    icon: <TrendingUp className="w-7 h-7" />,
    value: 40, suffix: "+",
    label: "Proyectos entregados",
    detail: "Colombia · LATAM · España",
    color: "#A855F7",
    glow: "rgba(168,85,247,0.25)",
  },
  {
    icon: <Users className="w-7 h-7" />,
    value: 1200, suffix: "+",
    label: "Estudiantes formados",
    detail: "MinTIC · Universidades · Bootcamps",
    color: "#EC4899",
    glow: "rgba(236,72,153,0.25)",
  },
  {
    icon: <Award className="w-7 h-7" />,
    value: 25, suffix: "+",
    label: "Certificaciones activas",
    detail: "IA · Cloud · Ciberseguridad",
    color: "#6366F1",
    glow: "rgba(99,102,241,0.25)",
  },
  {
    icon: <Star className="w-7 h-7" />,
    value: 98, suffix: "%",
    label: "Satisfacción de clientes",
    detail: "Promedio de proyectos",
    color: "#FBBF24",
    glow: "rgba(251,191,36,0.25)",
  },
  {
    icon: <Globe2 className="w-7 h-7" />,
    value: 4, suffix: "+",
    label: "Universidades aliadas",
    detail: "UTP · UDEA · UNIR · Parquesoft",
    color: "#22C55E",
    glow: "rgba(34,197,94,0.25)",
  },
  {
    icon: <Zap className="w-7 h-7" />,
    value: 8, suffix: " años",
    label: "De experiencia real",
    detail: "Full-Stack + IA + Estrategia",
    color: "#F97316",
    glow: "rgba(249,115,22,0.25)",
  },
];

// ── Roles Timeline ─────────────────────────────────────────────────────────────
const roles = [
  { role: "Director de Innovación", org: "Zolaris Platform",        color: "#FFFFFF", icon: <Brain className="w-4 h-4" />,  period: "2026 →" },
  { role: "Mentor Talento Tech",   org: "MinTIC / IU Training",    color: "#A855F7", icon: <Users className="w-4 h-4" />, period: "2025–2026" },
  { role: "Facilitador Tech",      org: "Parquesoft CTel",          color: "#EC4899", icon: <Zap className="w-4 h-4" />,   period: "2024–2025" },
  { role: "Consultor MGA / Cyber", org: "Gobernación de Nariño",   color: "#6366F1", icon: <Award className="w-4 h-4" />, period: "2023–2024" },
  { role: "Arquitecto Cloud",      org: "Freelance LATAM",         color: "#22C55E", icon: <Code2 className="w-4 h-4" />, period: "2018–2023" },
];

// ── Main ──────────────────────────────────────────────────────────────────────
const ImpactSection = () => {
  const [activeRole, setActiveRole] = useState(0);

  return (
    <section
      id="impacto"
      className="relative py-24 md:py-36 overflow-hidden border-t border-white/5"
      style={{ background: "linear-gradient(180deg, #050810 0%, #09090B 100%)" }}
    >
      {/* Ambient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 70% 50% at 30% 60%, rgba(168,85,247,0.08), transparent)" }}
      />

      <div className="max-w-[1300px] mx-auto px-6 md:px-10 lg:px-16 relative z-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="text-xs font-poppins uppercase tracking-[0.35em] font-bold block mb-4" style={{ color: "#A855F7" }}>
            Trayectoria & Resultados
          </span>
          <h2 className="text-4xl md:text-6xl font-sora text-white leading-none mb-5">
            Números que{" "}
            <span className="aurora-text font-bold">hablan solos</span>
          </h2>
          <p className="max-w-lg mx-auto font-poppins text-sm leading-relaxed" style={{ color: "rgba(240,237,232,0.4)" }}>
            Cada cifra representa un proyecto real, un estudiante formado o un sistema que sigue corriendo en producción.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-20">
          {impactStats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30, scale: 0.92 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.6, delay: i * 0.09, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -6, scale: 1.04, transition: { duration: 0.22 } }}
              className="relative group flex flex-col items-center text-center p-6 rounded-3xl overflow-hidden cursor-default"
              style={{
                background: `${stat.color}07`,
                border: `1px solid ${stat.color}18`,
              }}
            >
              {/* Hover glow */}
              <div
                className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl -z-10"
                style={{ background: stat.glow }}
              />
              {/* Top accent line */}
              <div
                className="absolute top-0 left-4 right-4 h-px"
                style={{ background: `linear-gradient(90deg, transparent, ${stat.color}50, transparent)` }}
              />
              {/* Icon */}
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
                style={{ background: `${stat.color}15`, border: `1.5px solid ${stat.color}30`, color: stat.color }}
              >
                {stat.icon}
              </div>
              {/* Number */}
              <p className="font-sora font-black text-3xl md:text-4xl mb-1" style={{ color: stat.color }}>
                <AnimatedCounter target={stat.value} suffix={stat.suffix} />
              </p>
              {/* Label */}
              <p className="font-outfit font-semibold text-xs text-white/70 mb-1 leading-snug">{stat.label}</p>
              <p className="font-poppins text-[10px] leading-tight" style={{ color: "rgba(240,237,232,0.3)" }}>{stat.detail}</p>
            </motion.div>
          ))}
        </div>

        {/* Roles Timeline — horizontal interactive */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="rounded-3xl overflow-hidden"
          style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)" }}
        >
          {/* Tab bar */}
          <div className="flex flex-wrap border-b border-white/5">
            {roles.map((r, i) => (
              <button
                key={i}
                onClick={() => setActiveRole(i)}
                className="flex-1 min-w-[160px] flex items-center gap-2.5 px-5 py-4 text-left transition-all duration-300 text-xs font-poppins font-semibold uppercase tracking-wider"
                style={{
                  color: activeRole === i ? r.color : "rgba(255,255,255,0.3)",
                  background: activeRole === i ? `${r.color}08` : "transparent",
                  borderBottom: activeRole === i ? `2px solid ${r.color}` : "2px solid transparent",
                }}
              >
                <span style={{ color: r.color }}>{r.icon}</span>
                <span className="truncate hidden sm:block">{r.org}</span>
              </button>
            ))}
          </div>
          {/* Detail panel */}
          <motion.div
            key={activeRole}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="p-8 flex flex-col sm:flex-row sm:items-center gap-6"
          >
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{
                background: `${roles[activeRole].color}15`,
                border: `1.5px solid ${roles[activeRole].color}40`,
                color: roles[activeRole].color,
                boxShadow: `0 0 24px ${roles[activeRole].color}25`,
              }}
            >
              {roles[activeRole].icon}
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h3 className="font-sora font-bold text-xl text-white">{roles[activeRole].role}</h3>
                <span
                  className="text-[10px] font-poppins font-bold uppercase tracking-widest px-3 py-1 rounded-full"
                  style={{ color: roles[activeRole].color, background: `${roles[activeRole].color}15`, border: `1px solid ${roles[activeRole].color}30` }}
                >
                  {roles[activeRole].period}
                </span>
              </div>
              <p className="font-outfit text-sm font-semibold mb-1" style={{ color: roles[activeRole].color }}>
                {roles[activeRole].org}
              </p>
            </div>
            <motion.a
              href="https://wa.me/573229132643?text=Hola%20IAZR%20%F0%9F%91%8B%2C%20vi%20su%20trayectoria%20y%20quiero%20explorar%20una%20colaboraci%C3%B3n."
              target="_blank" rel="noreferrer"
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
              className="flex-shrink-0 px-6 py-3 rounded-full font-outfit font-bold text-sm text-white uppercase tracking-wider transition-all"
              style={{ background: `${roles[activeRole].color}20`, border: `1px solid ${roles[activeRole].color}40` }}
            >
              Trabajar juntos ↗
            </motion.a>
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
};

export default ImpactSection;
