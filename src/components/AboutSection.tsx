import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { MapPin, Zap, Award, Users, Code2, GraduationCap } from "lucide-react";

// ─── Stats (unified from Globe) ───────────────────────────────────────────────
const stats = [
  { value: 40, suffix: "+", label: "Proyectos" },
  { value: 98, suffix: "%", label: "Satisfacción" },
  { value: 6, suffix: "+", label: "Años" },
  { value: 1200, suffix: "+", label: "Estudiantes" },
  { value: 25, suffix: "+", label: "Certificaciones" },
  { value: 4, suffix: "+", label: "Universidades" },
];

const clients = [
  "MinTIC · Talento Tech",
  "Parquesoft Nariño",
  "Gobernación de Nariño",
  "Registraduría Nacional",
  "Zolaris Platform",
  "StartUp Hub Pasto",
  "Solar IoT Networks",
  "UNIR España",
];

const Counter = ({ value, suffix }: { value: number; suffix: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / 1800, 1);
      setCount(Math.floor((1 - Math.pow(1 - p, 3)) * value));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, value]);
  return <span ref={ref}>{count}{suffix}</span>;
};

const AboutSection = () => {
  const [techIdx, setTechIdx] = useState(0);
  const techLabels = ["React & Next.js", "Python & IA", "Node.js & APIs", "Gemini & LLMs", "AWS & Cloud", "n8n & Automation"];
  const techColors = ["#61DAFB", "#F59E0B", "#22C55E", "#8B5CF6", "#FF9900", "#EA4B71"];

  useEffect(() => {
    const t = setInterval(() => setTechIdx(p => (p + 1) % techLabels.length), 1800);
    return () => clearInterval(t);
  }, []);

  const cardVariants = {
    hidden: { opacity: 0, y: 24, scale: 0.97 },
    visible: (i: number) => ({
      opacity: 1, y: 0, scale: 1,
      transition: { duration: 0.55, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] },
    }),
  };

  return (
    <section
      id="about"
      className="relative py-24 md:py-32 overflow-hidden border-t border-white/5"
      style={{ background: "linear-gradient(180deg, #0a0b12 0%, #0c0d14 100%)" }}
    >
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 60% 60% at 80% 40%, rgba(255,107,43,0.05), transparent)" }} />

      <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16 relative z-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <span className="text-xs font-poppins uppercase tracking-[0.3em] font-bold block mb-4" style={{ color: "var(--primary-color)" }}>
            Sobre Ivan
          </span>
          <h2 className="text-4xl md:text-6xl font-sora text-white leading-tight">
            El perfil detrás{" "}
            <span className="font-display italic" style={{ color: "#8a857c", fontWeight: 300 }}>de IAZR</span>
          </h2>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 mb-20">

          {/* ── Bio card (large) ── */}
          <motion.div
            variants={cardVariants} initial="hidden" whileInView="visible" custom={0} viewport={{ once: true }}
            className="lg:col-span-5 bento-card relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-48 h-48 pointer-events-none"
              style={{ background: "radial-gradient(circle at 80% 20%, rgba(255,107,43,0.08), transparent 70%)" }} />
            <div className="flex items-start gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 text-2xl font-sora font-black"
                style={{ background: "rgba(255,107,43,0.12)", border: "1.5px solid rgba(255,107,43,0.25)", color: "var(--primary-color)" }}>
                IA
              </div>
              <div>
                <h3 className="font-sora font-bold text-xl text-white">Ivan Andres Zuñiga Rada</h3>
                <p className="text-xs font-poppins mt-1 flex items-center gap-1.5" style={{ color: "rgba(240,237,232,0.4)" }}>
                  <MapPin className="w-3 h-3" /> Pasto, Nariño — Colombia
                </p>
              </div>
            </div>
            <p className="font-poppins text-sm leading-relaxed mb-5" style={{ color: "rgba(240,237,232,0.55)" }}>
              Ingeniero de Sistemas con maestría en Inteligencia Artificial. Más de 6 años construyendo plataformas digitales de alto impacto, agentes IA en producción y formando talento tecnológico en Colombia. Mi misión: hacer que la tecnología trabaje para tu negocio.
            </p>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" style={{ boxShadow: "0 0 8px rgba(74,222,128,0.6)" }} />
              <span className="text-xs font-poppins" style={{ color: "rgba(240,237,232,0.4)" }}>
                Disponible para nuevos proyectos
              </span>
            </div>
          </motion.div>

          {/* ── Rotating tech badge ── */}
          <motion.div
            variants={cardVariants} initial="hidden" whileInView="visible" custom={1} viewport={{ once: true }}
            className="lg:col-span-3 bento-card flex flex-col items-center justify-center text-center gap-4 relative overflow-hidden"
          >
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: `radial-gradient(circle at 50% 50%, ${techColors[techIdx]}08, transparent 65%)`, transition: "background 0.5s" }} />
            <p className="text-[10px] font-poppins uppercase tracking-[0.3em] text-white/25 font-bold">Actualmente trabajando con</p>
            <motion.div
              key={techIdx}
              initial={{ opacity: 0, scale: 0.85, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85 }}
              transition={{ duration: 0.4 }}
              className="text-2xl font-sora font-bold"
              style={{ color: techColors[techIdx] }}
            >
              {techLabels[techIdx]}
            </motion.div>
            <div className="flex gap-1.5">
              {techLabels.map((_, i) => (
                <div key={i} className="w-1.5 h-1.5 rounded-full transition-all duration-300"
                  style={{ background: i === techIdx ? techColors[techIdx] : "rgba(255,255,255,0.12)" }} />
              ))}
            </div>
          </motion.div>

          {/* ── Role cards ── */}
          {[
            { icon: <Code2 className="w-5 h-5" />, color: "#61DAFB", title: "Full-Stack Engineer", desc: "React, Node.js, Python, PostgreSQL" },
            { icon: <Zap className="w-5 h-5" />, color: "#a855f7", title: "AI Solutions Architect", desc: "LangChain, RAG, n8n, Gemini" },
            { icon: <GraduationCap className="w-5 h-5" />, color: "#22c55e", title: "Tech Mentor", desc: "1.200+ estudiantes formados" },
            { icon: <Award className="w-5 h-5" />, color: "#F59E0B", title: "25+ Certificaciones", desc: "Google, Microsoft, Huawei, UNIR" },
          ].map((item, i) => (
            <motion.div
              key={i}
              variants={cardVariants} initial="hidden" whileInView="visible" custom={i + 2} viewport={{ once: true }}
              whileHover={{ y: -4 }}
              className="lg:col-span-2 bento-card flex flex-col gap-3 group transition-all duration-200"
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: `${item.color}14`, color: item.color }}>
                {item.icon}
              </div>
              <div>
                <h4 className="font-sora font-bold text-sm text-white leading-tight">{item.title}</h4>
                <p className="text-[11px] font-poppins mt-1" style={{ color: "rgba(240,237,232,0.4)" }}>{item.desc}</p>
              </div>
            </motion.div>
          ))}

          {/* ── Availability card ── */}
          <motion.div
            variants={cardVariants} initial="hidden" whileInView="visible" custom={6} viewport={{ once: true }}
            className="lg:col-span-2 bento-card flex flex-col items-center justify-center text-center gap-3"
          >
            <Users className="w-7 h-7" style={{ color: "var(--primary-color)" }} />
            <div>
              <p className="text-[10px] font-poppins uppercase tracking-[0.25em] text-white/25 font-bold">Disponibilidad</p>
              <p className="font-sora font-bold text-white mt-1">Freelance & Proyectos</p>
              <p className="text-xs font-poppins mt-1" style={{ color: "rgba(240,237,232,0.4)" }}>Colombia → Mundo</p>
            </div>
          </motion.div>
        </div>

        {/* Stats strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <p className="text-[10px] font-poppins uppercase tracking-[0.3em] text-white/25 font-bold text-center mb-8">
            Resultados que hablan solos
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {stats.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.07 }}
                whileHover={{ scale: 1.05, y: -3 }}
                className="text-center p-5 rounded-2xl border cursor-default group"
                style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}
              >
                <p className="text-2xl md:text-3xl font-sora font-bold" style={{ color: "var(--primary-color)" }}>
                  <Counter value={s.value} suffix={s.suffix} />
                </p>
                <p className="text-[10px] font-poppins mt-1 leading-tight" style={{ color: "rgba(240,237,232,0.35)" }}>
                  {s.label}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Clients grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-[10px] font-poppins uppercase tracking-[0.3em] text-white/25 font-bold text-center mb-6">
            Instituciones & Clientes
          </p>
          <div className="flex flex-wrap justify-center gap-2.5">
            {clients.map((client, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                whileHover={{ scale: 1.06 }}
                className="px-4 py-2 rounded-full text-sm font-poppins cursor-default transition-all duration-300"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  color: "rgba(240,237,232,0.5)",
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,107,43,0.3)"; (e.currentTarget as HTMLElement).style.color = "rgba(240,237,232,0.8)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.07)"; (e.currentTarget as HTMLElement).style.color = "rgba(240,237,232,0.5)"; }}
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

export default AboutSection;
