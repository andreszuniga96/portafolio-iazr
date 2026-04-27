import { motion } from "framer-motion";
import { Award, Cloud, ShieldCheck, Database } from "lucide-react";
import { useRef } from "react";
import { useInView } from "framer-motion";
import { FlipFlow } from "@/components/ui/flipflow";

// ── IAZR Tech Stack for FlipFlow ──────────────────────────────────────────────
const iazrTechStack = [
  { name: "React" },
  { name: "Python" },
  { name: "LangChain" },
  { name: "Node.js" },
  { name: "AWS" },
  { name: "Gemini AI" },
  { name: "n8n" },
  { name: "Postgres" },
  { name: "Linux" },
];

const technicalSkills = [
  { name: "React / Node.js", level: 95, color: "#61DAFB" },
  { name: "Python / IA", level: 88, color: "#F59E0B" },
  { name: "SQL / NoSQL", level: 90, color: "#8B5CF6" },
  { name: "Linux / Infra", level: 80, color: "#22C55E" },
];

const certifications = [
  { name: "Google Developer / Cloud", icon: <Cloud /> },
  { name: "Microsoft Azure", icon: <Database /> },
  { name: "Huawei ICT Academy", icon: <ShieldCheck /> },
  { name: "UNIR España", icon: <Award /> },
];

const SkillBar = ({ name, level, color, delay = 0 }: { name: string; level: number; color: string; delay?: number }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  return (
    <div ref={ref} className="mb-5">
      <div className="flex justify-between items-end mb-1.5">
        <span className="text-sm font-poppins" style={{ color: "rgba(240,237,232,0.7)" }}>{name}</span>
        <span className="text-xs font-poppins font-bold" style={{ color }}>{level}%</span>
      </div>
      <div className="h-1.5 w-full rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: inView ? `${level}%` : 0 }}
          transition={{ duration: 1.4, delay, ease: [0.16, 1, 0.3, 1] }}
          className="h-full rounded-full"
          style={{ background: `linear-gradient(90deg, ${color}80, ${color})` }}
        />
      </div>
    </div>
  );
};

const ExplorationsSection = () => {
  return (
    <section id="skills" className="relative py-24 md:py-32 overflow-hidden border-t border-white/5"
      style={{ background: "linear-gradient(180deg, #07080d 0%, #050810 100%)" }}>

      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(255,255,255,0.04), transparent)" }} />

      <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16 relative z-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="text-xs font-poppins uppercase tracking-[0.3em] font-bold block mb-4"
            style={{ color: "#FFFFFF" }}>
            Ecosistema Técnico
          </span>
          <h2 className="text-4xl md:text-6xl font-sora leading-none" style={{ color: "#f0ede8" }}>
            Habilidades &{" "}
            <span className="font-display italic" style={{ color: "#8a857c", fontWeight: 300 }}>
              Herramientas
            </span>
          </h2>
          <p className="mt-4 font-poppins text-sm max-w-xl mx-auto" style={{ color: "rgba(240,237,232,0.4)" }}>
            Stack tecnológico activo — pasa el cursor sobre las tarjetas
          </p>
        </motion.div>

        {/* FlipFlow — Full width tech stack showcase */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mb-16"
        >
          <FlipFlow data={iazrTechStack} />
        </motion.div>

        {/* Bottom: Skill bars + Certifications */}
        <div className="grid md:grid-cols-2 gap-12 items-start">

          {/* Left: Skill bars */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <p className="text-[10px] font-poppins uppercase tracking-[0.3em] font-bold mb-6"
              style={{ color: "rgba(240,237,232,0.3)" }}>
              Nivel de Expertise
            </p>
            {technicalSkills.map((s, i) => (
              <SkillBar key={s.name} name={s.name} level={s.level} color={s.color} delay={i * 0.1} />
            ))}
          </motion.div>

          {/* Right: Certifications */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <p className="text-[10px] font-poppins uppercase tracking-[0.3em] font-bold mb-6"
              style={{ color: "rgba(240,237,232,0.3)" }}>
              Certificaciones Destacadas
            </p>
            <div className="grid grid-cols-2 gap-3">
              {certifications.map((cert, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.08 }}
                  whileHover={{ y: -3 }}
                  className="p-4 rounded-2xl border transition-all duration-300 flex items-center gap-3 group cursor-default"
                  style={{
                    background: "rgba(255,255,255,0.025)",
                    border: "1px solid rgba(255,255,255,0.07)",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)")}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)")}
                >
                  <div className="text-white shrink-0">{cert.icon}</div>
                  <span className="text-xs font-poppins font-medium" style={{ color: "rgba(240,237,232,0.7)" }}>
                    {cert.name}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ExplorationsSection;
