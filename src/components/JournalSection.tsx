import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Briefcase, GraduationCap, MonitorPlay, Code, Network, Building2 } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const experiences = [
  {
    id: 1,
    role: "Director de Innovación",
    org: "Zolaris",
    desc: "Plataforma IoT Solar — IA & Blockchain",
    date: "Ene 2026 – Presente",
    color: "#FFFFFF",
    icon: <MonitorPlay className="w-5 h-5" />,
    details: "Supervisión de arquitectura cloud (AWS/GCP), gemelos digitales y despliegue de modelos de IA predictivos para el sector solar en Colombia. Orquestación de equipos técnicos multidisciplinarios y definición de roadmap de producto.",
    tags: ["React", "Node.js", "Python", "AWS", "IA Generativa"]
  },
  {
    id: 2,
    role: "Mentor de Bootcamps",
    org: "UTP Región 3",
    desc: "Formación técnica intensiva Full-Stack",
    date: "Ene 2026 – May 2026",
    color: "#4da4ff",
    icon: <Code className="w-5 h-5" />,
    details: "Enseñanza de metodologías ágiles, programación Full-Stack (React, Node.js) y acompañamiento en despliegue de proyectos finales para cientos de futuros desarrolladores del eje cafetero.",
    tags: ["React", "Node.js", "Scrum", "REST APIs"]
  },
  {
    id: 3,
    role: "Profesor de Cátedra",
    org: "UDEA",
    desc: "Docencia en tecnología y sistemas",
    date: "Feb 2026 – Abr 2026",
    color: "#f59e0b",
    icon: <GraduationCap className="w-5 h-5" />,
    details: "Diseño y aplicación de módulos de vanguardia en facultades STEM, integrando IA generativa como herramienta transversal pedagógica.",
    tags: ["Machine Learning", "Python", "Pedagogía Activa"]
  },
  {
    id: 4,
    role: "Mentor Talento Tech MinTIC",
    org: "IU Training / Cymetria",
    desc: "IA & Data Analytics — Programa Nacional",
    date: "2025 – 2026",
    color: "#10b981",
    icon: <Briefcase className="w-5 h-5" />,
    details: "Capacitación masiva de +1000 estudiantes a lo largo de Colombia en Python, Machine Learning y análisis de datos en la nube bajo el programa Talento Tech del MinTIC.",
    tags: ["Python", "Pandas", "Scikit-learn", "Power BI"]
  },
  {
    id: 5,
    role: "Facilitador de Innovación",
    org: "Parquesoft CTel",
    desc: "Ecosistema Tech & Emprendimiento",
    date: "2024 – 2025",
    color: "#8b5cf6",
    icon: <Network className="w-5 h-5" />,
    details: "Dinamización del ecosistema tecnológico en el suroccidente colombiano. Acompañamiento técnico a startups en fases seed y growth.",
    tags: ["Startups", "Innovación", "Pitch", "Lean Startup"]
  },
  {
    id: 6,
    role: "Consultor MGA & Ciberseguridad",
    org: "Gobernación de Nariño",
    desc: "Infraestructura electoral y proyectos de inversión",
    date: "2023 – 2024",
    color: "#ec4899",
    icon: <Building2 className="w-5 h-5" />,
    details: "Auditoría y hardening de centros de datos para el preconteo electoral de Nariño. Formulación técnica y financiera de proyectos TIC bajo MGA.",
    tags: ["Ciberseguridad", "Linux", "Zero-Trust", "MGA"]
  },
];

const TimelineCard = ({ exp, index }: { exp: typeof experiences[0]; index: number }) => {
  const [isOpen, setIsOpen] = useState(false);
  const isLeft = index % 2 === 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
      // Parallax: alternate left/right offset speed
      data-parallax-side={isLeft ? "left" : "right"}
      className={`timeline-card relative flex w-full my-6 ${isLeft ? "justify-start" : "justify-end"} items-center`}
    >
      {/* Timeline dot */}
      <div
        className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center justify-center w-12 h-12 rounded-full z-20 shadow-lg"
        style={{
          backgroundColor: exp.color + "20",
          border: `2px solid ${exp.color}`,
          boxShadow: `0 0 20px ${exp.color}40`,
        }}
      >
        <span style={{ color: exp.color }}>{exp.icon}</span>
      </div>

      {/* Connector */}
      <div
        className={`hidden md:block absolute top-1/2 -translate-y-1/2 w-8 h-[2px] z-10 ${
          isLeft ? "right-[calc(50%-56px)]" : "left-[calc(50%-56px)]"
        }`}
        style={{ backgroundColor: exp.color + "50" }}
      />

      <div className="w-full md:w-[44%] px-2">
        <motion.button
          whileHover={{ scale: 1.01 }}
          onClick={() => setIsOpen(!isOpen)}
          className="w-full text-left group cursor-expand"
        >
          <div
            className="liquid-glass-strong rounded-2xl md:rounded-3xl p-6 border border-white/10 hover:border-white/30 transition-all duration-500 group-hover:bg-white/[0.05]"
            style={{
              boxShadow: isOpen ? `0 0 40px ${exp.color}15, inset 0 1px 1px rgba(255,255,255,0.1)` : undefined,
            }}
          >
            <div className="flex items-start gap-4 mb-3">
              <div
                className="md:hidden w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: exp.color + "20", border: `1px solid ${exp.color}` }}
              >
                <span style={{ color: exp.color }}>{exp.icon}</span>
              </div>
              <div className="flex-1">
                {/* Date floats at different parallax rate */}
                <span
                  className="timeline-date text-[10px] font-poppins tracking-[0.2em] uppercase text-white/30 block mb-1"
                >
                  {exp.date}
                </span>
                <span
                  className="text-xs font-poppins tracking-widest uppercase font-bold block mb-1"
                  style={{ color: exp.color }}
                >
                  {exp.org}
                </span>
                <h3 className="text-xl md:text-2xl font-sora text-white leading-tight">{exp.role}</h3>
              </div>
            </div>

            <div className="flex items-center justify-between mt-2">
              <span className="text-xs font-poppins text-white/30">{exp.desc}</span>
              <motion.span
                animate={{ rotate: isOpen ? 45 : 0 }}
                transition={{ duration: 0.25 }}
                className="text-white/40 text-xl leading-none ml-4"
              >
                +
              </motion.span>
            </div>

            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <div className="pt-4 mt-4 border-t border-white/10">
                    <p className="text-sm font-poppins text-white/60 leading-relaxed mb-4">{exp.details}</p>
                    <div className="flex flex-wrap gap-2">
                      {exp.tags.map(tag => (
                        <span
                          key={tag}
                          className="px-3 py-1 rounded-full text-[10px] font-poppins uppercase tracking-wider"
                          style={{ color: exp.color, backgroundColor: exp.color + "15", border: `1px solid ${exp.color}30` }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.button>
      </div>
    </motion.div>
  );
};

const JournalSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !lineRef.current) return;

    const ctx = gsap.context(() => {
      // Timeline line grows with scroll
      gsap.fromTo(
        lineRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            end: "bottom 30%",
            scrub: 1,
          },
        }
      );

      // Subtle lateral parallax on cards (left cards shift slightly left on scroll, right cards right)
      const leftCards = sectionRef.current!.querySelectorAll("[data-parallax-side='left'] .liquid-glass-strong");
      const rightCards = sectionRef.current!.querySelectorAll("[data-parallax-side='right'] .liquid-glass-strong");

      if (leftCards.length) {
        gsap.fromTo(leftCards, { x: 0 }, {
          x: -12,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 2,
          },
        });
      }
      if (rightCards.length) {
        gsap.fromTo(rightCards, { x: 0 }, {
          x: 12,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 2,
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="experiencia"
      ref={sectionRef}
      className="py-24 md:py-32 bg-[#050810] relative overflow-hidden border-t border-white/5"
    >
      {/* Ambient blobs */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-20"
        >
          {/* Crosshair icon */}
          <motion.div
            initial={{ opacity: 0, scale: 0.6 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-center mb-6"
          >
            <div className="relative w-10 h-10">
              <div className="absolute inset-0 rounded-full border border-white/20/30" />
              <div className="absolute inset-[4px] rounded-full border border-white/20/20" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
              <div className="absolute top-1/2 left-0 right-0 h-px bg-white/20" />
              <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/20" />
            </div>
          </motion.div>

          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-sm font-outfit text-white font-bold uppercase tracking-[0.3em] block mb-4"
          >
            Trayectoria Profesional
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="text-5xl sm:text-6xl md:text-7xl font-outfit font-bold text-white leading-[0.95] tracking-tight"
          >
            Experiencia{" "}
            <span className="text-white">2023&nbsp;–&nbsp;2026</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="text-white/40 max-w-lg mx-auto mt-5 font-outfit text-sm"
          >
            Haz clic en cada rol para desplegar el detalle completo.
          </motion.p>
        </motion.div>

        <div className="relative">
          {/* Animated vertical line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-[2px] bg-white/5 -translate-x-1/2">
            <div
              ref={lineRef}
              className="w-full bg-gradient-to-b from-primary via-blue-400 to-purple-500 origin-top"
              style={{ height: "100%", transform: "scaleY(0)" }}
            />
          </div>

          <div className="flex flex-col relative pl-10 md:pl-0">
            {experiences.map((exp, index) => (
              <TimelineCard key={exp.id} exp={exp} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default JournalSection;
