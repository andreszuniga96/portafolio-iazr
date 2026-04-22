import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { User } from "lucide-react";

// ── Tech stack logos (text-based) ─────────────────────────────────────────────
const techStack = [
  { name: "React",    color: "#61DAFB", bg: "#61DAFB18" },
  { name: "Gemini",   color: "#8B5CF6", bg: "#8B5CF618" },
  { name: "Python",   color: "#F59E0B", bg: "#F59E0B18" },
  { name: "Node.js",  color: "#22C55E", bg: "#22C55E18" },
  { name: "AWS",      color: "#EF4444", bg: "#EF444418" },
  { name: "LangChain",color: "#FF6B2B", bg: "#FF6B2B18" },
];



// ── Mini Skill Bar ─────────────────────────────────────────────────────────────
const SkillBar = ({ label, pct, color, delay = 0 }: { label: string; pct: number; color: string; delay?: number }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <div ref={ref} className="space-y-1">
      <div className="flex justify-between text-[11px] font-poppins" style={{ color: "rgba(240,237,232,0.55)" }}>
        <span>{label}</span>
        <span style={{ color }}>{pct}%</span>
      </div>
      <div className="h-1 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }}>
        <motion.div
          className="h-full rounded-full"
          style={{ background: `linear-gradient(90deg, ${color}80, ${color})` }}
          initial={{ width: 0 }} animate={{ width: inView ? `${pct}%` : 0 }}
          transition={{ duration: 1.2, delay, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
    </div>
  );
};

const AboutSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [techIdx, setTechIdx] = useState(0);

  // Tech stack carousel
  useEffect(() => {
    const t = setInterval(() => setTechIdx(p => (p + 1) % techStack.length), 1600);
    return () => clearInterval(t);
  }, []);

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.98 },
    visible: (i: number) => ({ opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] } }),
  };

  return (
    <section id="about" ref={sectionRef}
      className="relative py-24 md:py-32 overflow-hidden border-t"
      style={{ backgroundColor: "#0c0c0e", borderColor: "rgba(42,39,36,0.6)" }}
    >
      {/* Ambient */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 50% 60% at 20% 50%, rgba(255,107,43,0.035), transparent)" }} />

      <div className="max-w-[1400px] mx-auto px-6 relative z-10">
        {/* Label + Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="mb-14"
        >
          <span className="text-xs font-poppins uppercase tracking-[0.3em] font-bold block mb-4"
            style={{ color: "#FF6B2B" }}>¿Quien soy?</span>
          <h2 className="text-4xl md:text-6xl font-sora leading-none" style={{ color: "#f0ede8" }}>
            Perfil Hibrido —
            <br />
            <span className="font-display italic" style={{ color: "#8a857c", fontWeight: 300 }}>
              Tech & Educacion
            </span>
          </h2>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 auto-rows-auto">

          {/* 1: Bio principal — 7 col, row span 2 */}
          <motion.div custom={0} variants={cardVariants} initial="hidden" whileInView="visible"
            viewport={{ once: true }}
            className="bento-card lg:col-span-7 lg:row-span-2 flex flex-col justify-between min-h-[280px]"
          >
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
                  style={{ background: "rgba(255,107,43,0.12)", border: "1.5px solid rgba(255,107,43,0.25)" }}>
                  <User className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-sora font-bold text-lg" style={{ color: "#f0ede8" }}>Ivan Zuñiga</p>
                  <p className="text-xs font-poppins" style={{ color: "#8a857c" }}>Director de Innovacion · IAZR</p>
                </div>
              </div>
              <p className="font-poppins leading-relaxed text-sm mb-4" style={{ color: "rgba(240,237,232,0.60)" }}>
                Ingeniero Full-Stack y Director de Innovacion en Zolaris. Cuento con amplia experiencia en la creacion de plataformas completas utilizando React, Node.js y Python. Tengo una profunda pasion por la IA aplicada a negocios.
              </p>
              <p className="font-poppins leading-relaxed text-sm" style={{ color: "rgba(240,237,232,0.55)" }}>
                He formado a mas de{" "}
                <span className="font-semibold aurora-text">1.200 estudiantes</span>{" "}
                en IA y Data a traves de Talento Tech Colombia, UTP, UDEA y Cymetria.
              </p>
            </div>
            <a href="#contact"
              className="mt-6 inline-flex items-center gap-2 text-sm font-outfit font-medium pb-0.5 transition-colors"
              style={{ borderBottom: "1px solid #FF6B2B", color: "#f0ede8" }}>
              Conectar →
            </a>
          </motion.div>

          {/* 2: Disponibilidad — 5 col */}
          <motion.div custom={1} variants={cardVariants} initial="hidden" whileInView="visible"
            viewport={{ once: true }}
            className="bento-card lg:col-span-5 flex flex-col justify-center items-center text-center py-8"
          >
            <div className="relative mb-4">
              <div className="w-14 h-14 rounded-full flex items-center justify-center"
                style={{ background: "rgba(34,197,94,0.12)", border: "1.5px solid rgba(34,197,94,0.3)" }}>
                <span className="text-2xl">✓</span>
              </div>
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-green-500 border-2"
                style={{ borderColor: "#0c0c0e", animation: "orb-glow 2s ease-in-out infinite" }} />
            </div>
            <p className="font-sora font-bold text-lg" style={{ color: "#f0ede8" }}>Disponible</p>
            <p className="text-xs font-poppins mt-1" style={{ color: "#8a857c" }}>Para nuevos proyectos</p>
            <div className="mt-4 px-4 py-2 rounded-full text-xs font-poppins"
              style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.25)", color: "#22c55e" }}>
              Colombia 🇨🇴 → Mundo 🌍
            </div>
          </motion.div>

          {/* 3: Tech stack rotating — 5 col */}
          <motion.div custom={2} variants={cardVariants} initial="hidden" whileInView="visible"
            viewport={{ once: true }}
            className="bento-card lg:col-span-5"
          >
            <p className="text-[10px] font-poppins uppercase tracking-widest mb-4"
              style={{ color: "rgba(240,237,232,0.3)" }}>Stack Principal</p>
            <div className="flex flex-wrap gap-2">
              {techStack.map((tech, i) => (
                <motion.span key={tech.name}
                  animate={{ scale: techIdx === i ? 1.08 : 1, opacity: techIdx === i ? 1 : 0.55 }}
                  className="px-2.5 py-1 rounded-full text-xs font-poppins uppercase tracking-wider font-semibold cursor-default"
                  style={{ background: techIdx === i ? tech.bg : "rgba(255,255,255,0.04)", color: techIdx === i ? tech.color : "#8a857c", border: `1px solid ${techIdx === i ? tech.color + "40" : "rgba(255,255,255,0.06)"}` }}>
                  {tech.name}
                </motion.span>
              ))}
            </div>
          </motion.div>

          {/* 4: Habilidades — 7 col */}
          <motion.div custom={3} variants={cardVariants} initial="hidden" whileInView="visible"
            viewport={{ once: true }}
            className="bento-card lg:col-span-7"
          >
            <p className="text-[10px] font-poppins uppercase tracking-widest mb-4"
              style={{ color: "rgba(240,237,232,0.3)" }}>Nivel de Expertise</p>
            <div className="space-y-3">
              <SkillBar label="Full-Stack Development"  pct={94} color="#3B82F6" delay={0.1} />
              <SkillBar label="AI & Machine Learning"   pct={88} color="#8B5CF6" delay={0.2} />
              <SkillBar label="Automatizacion (n8n)"    pct={85} color="#FF6B2B" delay={0.3} />
              <SkillBar label="Ciberseguridad"          pct={78} color="#EF4444" delay={0.4} />
              <SkillBar label="Data Analytics"          pct={82} color="#F59E0B" delay={0.5} />
            </div>
          </motion.div>



        </div>
      </div>
    </section>
  );
};

export default AboutSection;
