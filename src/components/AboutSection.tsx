import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Zap, Award, Code2, GraduationCap, Users } from "lucide-react";
import ProfileCard from "@/components/ProfileCard";
import CardSwap, { Card } from "@/components/CardSwap";

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
        style={{ background: "radial-gradient(ellipse 60% 60% at 80% 40%, rgba(255,255,255,0.05), transparent)" }} />

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

          {/* ── Bio card: ProfileCard holographic ── */}
          <motion.div
            variants={cardVariants} initial="hidden" whileInView="visible" custom={0} viewport={{ once: true }}
            className="lg:col-span-5 flex items-center justify-center"
          >
            <ProfileCard
              name="Ivan Zuñiga"
              title="Full-Stack & AI Engineer"
              handle="iazr"
              status="Disponible ✓"
              contactText="Contactar"
              onContactClick={() => window.open('https://wa.me/573229132643', '_blank')}
            />
          </motion.div>

          {/* ── CardSwap ── */}
          <motion.div
            variants={cardVariants} initial="hidden" whileInView="visible" custom={1} viewport={{ once: true }}
            className="lg:col-span-3 flex items-center justify-center min-h-[300px]"
          >
            <CardSwap width={260} height={200} cardDistance={35} verticalDistance={28} delay={4500} pauseOnHover easing="elastic">
              {[
                { icon: <Code2 className="w-5 h-5" />, color: "#61DAFB", title: "Full-Stack", desc: "React · Node · Python" },
                { icon: <Zap className="w-5 h-5" />, color: "#a855f7", title: "AI Architect", desc: "LLMs · RAG · n8n" },
                { icon: <GraduationCap className="w-5 h-5" />, color: "#22c55e", title: "Mentor", desc: "1.200+ estudiantes" },
                { icon: <Award className="w-5 h-5" />, color: "#F59E0B", title: "Certificado", desc: "Google · AWS · UNIR" },
              ].map((item, i) => (
                <Card key={i} style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '24px', justifyContent: 'center' }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${item.color}18`, color: item.color }}>
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="font-sora font-bold text-base text-white leading-tight">{item.title}</h4>
                    <p className="text-xs font-poppins mt-1" style={{ color: 'rgba(240,237,232,0.4)' }}>{item.desc}</p>
                  </div>
                </Card>
              ))}
            </CardSwap>
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
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.3)"; (e.currentTarget as HTMLElement).style.color = "rgba(240,237,232,0.8)"; }}
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
