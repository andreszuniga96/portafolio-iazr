import { useRef } from "react";
import { motion } from "framer-motion";
import CircularGallery from "@/components/CircularGallery";
import LiquidImage from "@/components/LiquidImage";

import projectCyber from "@/assets/cyber.png";
import projectDev from "@/assets/zolaris.png";
import projectConsulting from "@/assets/consulting.png";
import projectInnovation from "@/assets/education.png";

// ── Project data ─────────────────────────────────────────────────────────────
const projects = [
  {
    id: 1,
    title: "Zolaris Platform",
    category: "IA",
    desc: "Plataforma SaaS para ecosistemas solares IoT, utilizando modelos LLM y análisis predictivos.",
    img: projectDev,
    color: "#5337E5",
  },
  {
    id: 2,
    title: "Ciberseguridad Electoral",
    category: "Tech",
    desc: "Aseguramiento de infraestructuras críticas para escrutinio electoral.",
    img: projectCyber,
    color: "#3B28CC",
  },
  {
    id: 3,
    title: "Talento Tech MinTIC",
    category: "Educación",
    desc: "Bootcamps de IA & Data Analytics en ecosistemas interactivos.",
    img: projectInnovation,
    color: "#1D1B50",
  },
  {
    id: 4,
    title: "MGA Startups Hub",
    category: "Consultoría",
    desc: "Proyectos de impacto regional formulados bajo metodología MGA.",
    img: projectConsulting,
    color: "#FFFFFF",
  },
];

const WorksSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  return (
    <section
      id="proyectos"
      ref={sectionRef}
      className="py-24 md:py-32 relative overflow-visible border-t border-white/5"
      style={{ background: "transparent" }}
    >
      {/* Subtle background grid */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.02]" aria-hidden>
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
            backgroundSize: "5rem 5rem",
          }}
        />
      </div>

      <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16"
        >
          <div>
            <span
              className="text-sm font-poppins uppercase tracking-[0.2em] font-bold block mb-4"
              style={{ color: "var(--primary-color)" }}
            >
              Innovación
            </span>
            <h2 className="text-4xl md:text-6xl text-white font-sora">
              Proyectos Destacados
            </h2>
          </div>

          {/* Category badges — decorative */}
          <div className="flex flex-wrap gap-2">
            {["IA", "Tech", "Educación", "Consultoría"].map((cat) => (
              <span
                key={cat}
                className="px-4 py-1.5 rounded-full text-xs font-poppins tracking-wider uppercase border"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  color: "rgba(255,255,255,0.35)",
                  borderColor: "rgba(255,255,255,0.08)",
                }}
              >
                {cat}
              </span>
            ))}
          </div>
        </motion.div>

        {/* ── Circular Gallery (WebGL carousel) ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="w-full"
          style={{ height: 'clamp(240px, 40vw, 460px)' }}
        >
          <CircularGallery
            items={projects.map((p) => ({
              image: p.img as string,
              text: p.title,
            }))}
            bend={3}
            textColor="#FFFFFF"
            borderRadius={0.05}
            scrollSpeed={2}
          />
        </motion.div>


        {/* Project cards row — text info below gallery */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10"
        >
          {projects.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              whileHover={{ y: -4 }}
              className="rounded-2xl border cursor-default group transition-all duration-300 overflow-hidden"
              style={{
                background: "rgba(255,255,255,0.025)",
                borderColor: "rgba(255,255,255,0.07)",
                boxShadow: `0 0 0 0 ${p.color}`,
              }}
              onMouseEnter={e =>
                (e.currentTarget.style.boxShadow = `0 0 24px ${p.color}22`)
              }
              onMouseLeave={e =>
                (e.currentTarget.style.boxShadow = `0 0 0 0 ${p.color}`)
              }
            >
              {/* GLSL Liquid Image — 140px height thumbnail */}
              <div className="w-full relative" style={{ height: 140 }}>
                <LiquidImage src={p.img as string} alt={p.title} className="w-full h-full" />
                {/* Color overlay tint */}
                <div
                  className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: `linear-gradient(135deg, ${p.color}22, transparent 70%)` }}
                />
              </div>

              {/* Info panel */}
              <div className="p-4">
                <span
                  className="inline-block px-3 py-1 text-[10px] font-poppins font-bold uppercase tracking-widest rounded-full mb-3"
                  style={{ color: p.color, background: `${p.color}18`, border: `1px solid ${p.color}30` }}
                >
                  {p.category}
                </span>
                <h3 className="text-sm font-sora font-bold text-white leading-tight mb-1">{p.title}</h3>
                <p className="text-[11px] font-poppins leading-relaxed" style={{ color: "rgba(255,255,255,0.35)" }}>
                  {p.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex justify-center mt-12"
        >
          <a
            href="https://wa.me/573229132643?text=Hola%20IAZR%20%F0%9F%91%8B%2C%20me%20interesa%20formalizar%20un%20proyecto%20contigo."
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-sora font-bold text-sm uppercase tracking-wider transition-all hover:scale-105 active:scale-95 border"
            style={{
              background: "rgba(255,255,255,0.04)",
              color: "rgba(255,255,255,0.7)",
              borderColor: "rgba(255,255,255,0.12)",
            }}
          >
            Formalizar un proyecto ↗
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default WorksSection;
