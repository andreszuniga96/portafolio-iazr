import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Zap, Brain, Shield, Target, TrendingUp, Users, Award, Globe } from "lucide-react";
import { SectionLabel, TextReveal } from "@/components/ui/AnimatedElements";

// ── Differentials ─────────────────────────────────────────────────────────────
const differentials = [
  {
    icon: <Zap className="w-6 h-6" />,
    title: "Velocidad Extrema",
    desc: "De concepto a producción en días, no en meses. MVPs funcionales que validan tu idea rápido.",
    color: "#FBBF24",
    glow: "rgba(251,191,36,0.2)",
  },
  {
    icon: <Brain className="w-6 h-6" />,
    title: "Visión Estratégica",
    desc: "No ejecutamos código. Diseñamos soluciones completas: arquitectura, escalabilidad y negocio.",
    color: "#A855F7",
    glow: "rgba(168,85,247,0.2)",
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Sin Intermediarios",
    desc: "Trato directo con el arquitecto. Comunicación clara, decisiones rápidas y cero burocracia.",
    color: "#6366F1",
    glow: "rgba(99,102,241,0.2)",
  },
  {
    icon: <Target className="w-6 h-6" />,
    title: "Resultados Medibles",
    desc: "KPIs definidos desde el día 1. Cada entregable tiene métricas claras de éxito.",
    color: "#EC4899",
    glow: "rgba(236,72,153,0.2)",
  },
];

// ── Timeline ──────────────────────────────────────────────────────────────────
const timeline = [
  { year: "2018", event: "Inicio como desarrollador freelance Full-Stack", color: "#7C3AED" },
  { year: "2020", event: "Primera arquitectura cloud para Gobernación de Nariño", color: "#A855F7" },
  { year: "2022", event: "Director de Tecnología en Zolaris Platform S.A.S", color: "#6366F1" },
  { year: "2024", event: "+1.200 estudiantes formados en IA, Dev & Data", color: "#EC4899" },
  { year: "2026", event: "IAZR — Tu CTO Externo. Soluciones de Alto Impacto", color: "#FBBF24" },
];

// ── Stats ─────────────────────────────────────────────────────────────────────
const brandStats = [
  { icon: <TrendingUp className="w-5 h-5" />, val: "40+", label: "Proyectos Entregados", color: "#A855F7" },
  { icon: <Users className="w-5 h-5" />, val: "1200+", label: "Estudiantes Formados", color: "#EC4899" },
  { icon: <Award className="w-5 h-5" />, val: "25+", label: "Certificaciones", color: "#6366F1" },
  { icon: <Globe className="w-5 h-5" />, val: "4+", label: "Universidades", color: "#FBBF24" },
];

// ── Timeline Item ─────────────────────────────────────────────────────────────
const TimelineItem = ({ item, index }: { item: typeof timeline[0]; index: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
      className={`flex items-start gap-4 sm:gap-6 ${index % 2 === 0 ? "sm:flex-row" : "sm:flex-row-reverse"} flex-row`}
    >
      {/* Year bubble */}
      <div className="flex-shrink-0 flex flex-col items-center">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center font-outfit font-bold text-sm"
          style={{
            background: `${item.color}15`,
            border: `1.5px solid ${item.color}40`,
            color: item.color,
            boxShadow: `0 0 20px ${item.color}20`,
          }}
        >
          {item.year}
        </div>
        {index < timeline.length - 1 && (
          <div className="w-px flex-1 mt-2 min-h-[40px]" style={{ background: `linear-gradient(to bottom, ${item.color}30, transparent)` }} />
        )}
      </div>

      {/* Event */}
      <div
        className="flex-1 p-4 rounded-2xl mb-3"
        style={{
          background: `${item.color}06`,
          border: `1px solid ${item.color}20`,
        }}
      >
        <p className="font-outfit text-sm leading-relaxed" style={{ color: "rgba(240,237,232,0.75)" }}>
          {item.event}
        </p>
      </div>
    </motion.div>
  );
};

// ── Main Component ─────────────────────────────────────────────────────────────
const BrandSection = () => {
  return (
    <section
      id="brand"
      className="relative py-24 md:py-36 overflow-hidden border-t section-tone-brand-vivid"
      style={{ borderColor: "rgba(124,58,237,0.15)" }}
    >
      {/* Ambient glows */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full blur-[180px] pointer-events-none"
        style={{ background: "radial-gradient(ellipse at center, rgba(124,58,237,0.12) 0%, rgba(99,102,241,0.06) 50%, transparent 80%)" }}
      />
      <div
        className="absolute bottom-0 right-0 w-[600px] h-[400px] rounded-full blur-[160px] pointer-events-none"
        style={{ background: "rgba(236,72,153,0.06)" }}
      />

      <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16 relative z-10">

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16 md:mb-20"
        >
          <SectionLabel text="¿Por qué IAZR?" className="mb-5" />
          <h2
            className="font-outfit font-bold leading-none tracking-tight mb-6"
            style={{ fontSize: "clamp(2.4rem, 7vw, 76px)", color: "#f0ede8" }}
          >
            <TextReveal text="No somos una agencia." delay={0.05} />
            <br />
            <span className="aurora-text">
              <TextReveal text="Somos tu CTO Externo." delay={0.25} />
            </span>
          </h2>
          <p
            className="max-w-2xl mx-auto font-outfit text-base md:text-lg leading-relaxed"
            style={{ color: "rgba(240,237,232,0.5)" }}
          >
            IAZR es la suma de experiencia técnica real, visión estratégica de negocio y ejecución sin burocracia.
            Trabajamos contigo como un miembro más de tu equipo — con la ventaja de haber resuelto este problema antes.
          </p>
        </motion.div>

        {/* ── Differentials Grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-20 md:mb-28">
          {differentials.map((d, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -6, scale: 1.02, transition: { duration: 0.25 } }}
              className="group relative p-6 rounded-3xl cursor-default"
              style={{
                background: `${d.color}06`,
                border: `1px solid ${d.color}18`,
              }}
            >
              {/* Glow on hover */}
              <div
                className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl -z-10"
                style={{ background: d.glow }}
              />

              {/* Top line accent */}
              <div className="absolute top-0 left-6 right-6 h-px" style={{
                background: `linear-gradient(90deg, transparent, ${d.color}50, transparent)`
              }} />

              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
                style={{ background: `${d.color}15`, border: `1.5px solid ${d.color}30`, color: d.color }}
              >
                {d.icon}
              </div>

              <h3 className="font-outfit font-bold text-base mb-2" style={{ color: "#f0ede8" }}>
                {d.title}
              </h3>
              <p className="font-outfit text-sm leading-relaxed" style={{ color: "rgba(240,237,232,0.45)" }}>
                {d.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* ── Two columns: Timeline + Stats ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 mb-20 md:mb-28">

          {/* Timeline */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-10"
            >
              <span className="text-xs font-outfit uppercase tracking-[0.3em] font-bold block mb-3" style={{ color: "#7C3AED" }}>
                Historia de IAZR
              </span>
              <h3 className="text-2xl md:text-3xl font-outfit font-bold" style={{ color: "#f0ede8" }}>
                Del código a la estrategia.
              </h3>
            </motion.div>

            <div className="flex flex-col gap-0">
              {timeline.map((item, i) => (
                <TimelineItem key={i} item={item} index={i} />
              ))}
            </div>
          </div>

          {/* Stats + Manifesto */}
          <div className="flex flex-col gap-6">
            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-3">
              {brandStats.map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  whileHover={{ scale: 1.04, y: -2 }}
                  className="p-5 rounded-2xl group cursor-default text-center"
                  style={{ background: `${s.color}08`, border: `1px solid ${s.color}20` }}
                >
                  <div className="flex justify-center mb-2" style={{ color: s.color }}>
                    {s.icon}
                  </div>
                  <p className="font-outfit font-bold text-2xl md:text-3xl mb-1" style={{ color: s.color }}>
                    {s.val}
                  </p>
                  <p className="font-outfit text-[11px] uppercase tracking-wider" style={{ color: "rgba(240,237,232,0.35)" }}>
                    {s.label}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Manifesto card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="relative p-6 md:p-8 rounded-3xl overflow-hidden flex-1"
              style={{
                background: "rgba(124,58,237,0.06)",
                border: "1px solid rgba(124,58,237,0.2)",
              }}
            >
              {/* Glow */}
              <div className="absolute inset-0 rounded-3xl blur-2xl -z-10" style={{ background: "rgba(124,58,237,0.08)" }} />
              <div className="absolute top-0 left-0 right-0 h-px" style={{
                background: "linear-gradient(90deg, transparent, rgba(168,85,247,0.5), rgba(236,72,153,0.3), transparent)"
              }} />

              <span className="text-[10px] font-outfit uppercase tracking-[0.35em] font-bold block mb-4" style={{ color: "#7C3AED" }}>
                La Promesa IAZR
              </span>
              <p className="font-outfit text-base md:text-lg leading-relaxed mb-6" style={{ color: "rgba(240,237,232,0.65)" }}>
                "Cada proyecto que construimos no es solo código — es una{" "}
                <span className="text-white font-semibold">ventaja competitiva</span> diseñada para escalar, adaptarse y generar resultados reales."
              </p>
              <p className="font-outfit text-sm font-medium" style={{ color: "rgba(168,85,247,0.8)" }}>
                — IAZR, Arquitecto de Soluciones
              </p>
            </motion.div>

            {/* CTA */}
            <motion.a
              href="https://wa.me/573229132643?text=Hola%20IAZR%20%F0%9F%91%8B%2C%20quiero%20conocer%20m%C3%A1s%20sobre%20c%C3%B3mo%20pueden%20ayudar%20a%20mi%20empresa."
              target="_blank"
              rel="noreferrer"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-outfit font-bold text-sm uppercase tracking-wider text-white"
              style={{
                background: "linear-gradient(135deg, #7C3AED 0%, #EC4899 100%)",
                boxShadow: "0 0 40px rgba(124,58,237,0.35)",
              }}
            >
              Trabajar con IAZR →
            </motion.a>
          </div>
        </div>

        {/* ── Clients / Allies strip ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <p className="text-[10px] font-outfit uppercase tracking-[0.3em] text-white/20 font-bold mb-6">
            Instituciones & Aliados de IAZR
          </p>
          <div className="flex flex-wrap justify-center gap-2.5">
            {[
              "MinTIC · Talento Tech",
              "Parquesoft Nariño",
              "Gobernación de Nariño",
              "Registraduría Nacional",
              "Zolaris Platform",
              "StartUp Hub Pasto",
              "Solar IoT Networks",
              "UNIR España",
            ].map((client, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.04 }}
                whileHover={{ scale: 1.06, borderColor: "rgba(168,85,247,0.4)", color: "rgba(240,237,232,0.85)" }}
                className="px-4 py-2 rounded-full text-sm font-outfit cursor-default transition-all duration-300"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  color: "rgba(240,237,232,0.45)",
                }}
              >
                {client}
              </motion.span>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default BrandSection;
