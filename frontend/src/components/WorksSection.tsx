import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useSpring, useMotionValue, useMotionTemplate } from "framer-motion";
import { X } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import CircularGallery from "@/components/CircularGallery";

import projectCyber from "@/assets/cyber.png";
import projectDev from "@/assets/zolaris.png";
import projectConsulting from "@/assets/consulting.png";
import projectInnovation from "@/assets/education.png";

gsap.registerPlugin(ScrollTrigger);

const categories = ["Todos", "Tech", "Educación", "Consultoría", "IA"];

const projects = [
  {
    id: 1,
    title: "Zolaris Platform",
    category: "IA",
    desc: "Plataforma SaaS para ecosistemas solares IoT, utilizando modelos LLM y análisis predictivos.",
    fullDesc: "Zolaris es un ecosistema inmersivo. Utiliza gemelos digitales para visualizar la generación y consumo en tiempo real de inversores solares globales. El backend, potenciado por IA generativa, optimiza la matriz energética automáticamente.",
    img: projectDev,
    color: "#5337E5", // Vibrant Purple
  },
  {
    id: 2,
    title: "Ciberseguridad Electoral",
    category: "Tech",
    desc: "Aseguramiento de infraestructuras críticas para escrutinio.",
    fullDesc: "Auditoría integral, hardening e implementación de arquitecturas Zero-Trust en los centros de datos electorales de Nariño, mitigando la superficie de ataque y garantizando integridad en transmisión de datos.",
    img: projectCyber,
    color: "#3B28CC", // Glow Purple
  },
  {
    id: 3,
    title: "Metodologías Talento Tech",
    category: "Educación",
    desc: "Bootcamps de IA & Data Analytics en ecosistemas interactivos.",
    fullDesc: "Conceptualización tecnológica para el programa nacional del MinTIC. Los estudiantes incursionan en análisis de datos intensivo y modelos de LLM usando infraestructuras escalables en la nube.",
    img: projectInnovation,
    color: "#1D1B50", // Navy Blue
  },
  {
    id: 4,
    title: "MGA Startups Hub",
    category: "Consultoría",
    desc: "Proyectos de impacto regional formulados bajo MGA.",
    fullDesc: "Intersección entre finanzas públicas y desarrollo tecnológico privado. Facilitación de orquestación técnica, predimensionamiento de presupuestos e infraestructura de big data aplicada a regiones.",
    img: projectConsulting,
    color: "#FFFFFF",
  },
];

// ── 3D Spotlight Card — uses forwardRef to satisfy AnimatePresence ─────────
interface TiltProjectCardProps {
  project: typeof projects[0];
  onClick: () => void;
  colClass?: string;
}

const TiltProjectCard = React.forwardRef<HTMLDivElement, TiltProjectCardProps>(
  ({ project, onClick, colClass = "w-full" }, ref) => {
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
    const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });
    const rotateX = useMotionTemplate`${mouseYSpring}deg`;
    const rotateY = useMotionTemplate`${mouseXSpring}deg`;

    const spotX = useMotionValue(0);
    const spotY = useMotionValue(0);
    const spotXSpring = useSpring(spotX, { stiffness: 300, damping: 40 });
    const spotYSpring = useSpring(spotY, { stiffness: 300, damping: 40 });
    const spotBg = useMotionTemplate`radial-gradient(350px circle at ${spotXSpring}px ${spotYSpring}px, rgba(255,255,255,0.07), transparent 70%)`;

    const [borderPos, setBorderPos] = useState({ x: 50, y: 50 });

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      x.set((mx / rect.width - 0.5) * 12);
      y.set((my / rect.height - 0.5) * -12);
      spotX.set(mx);
      spotY.set(my);
      setBorderPos({ x: (mx / rect.width) * 100, y: (my / rect.height) * 100 });
    };

    const handleMouseLeave = () => { x.set(0); y.set(0); };

    return (
      // ← forwardRef wrapper — this div receives the ref from AnimatePresence
      <div ref={ref} className={`${colClass} perspective-[1200px] cursor-pointer`} onClick={onClick}>
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.94 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            whileHover={{ y: -8, transition: { duration: 0.3 } }}
            className="relative w-full h-[380px] md:h-[460px] rounded-[2rem] overflow-hidden border border-white/8 group shadow-2xl shadow-black/50"
          >
            {/* Dynamic border glow */}
            <div
              className="absolute inset-0 rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-20"
              style={{
                background: `radial-gradient(200px circle at ${borderPos.x}% ${borderPos.y}%, ${project.color}30, transparent 70%)`,
              }}
            />

            {/* Spotlight overlay */}
            <motion.div
              className="absolute inset-0 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
              style={{ background: spotBg }}
            />

            {/* Image */}
            <img
              src={project.img}
              alt={project.title}
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06] opacity-50 group-hover:opacity-80"
            />

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent z-10" />

            {/* Content */}
            <div
              style={{ transform: "translateZ(60px)" }}
              className="absolute bottom-0 left-0 p-8 w-full z-30 transition-transform duration-500 group-hover:-translate-y-2"
            >
              <span
                className="inline-block px-4 py-1.5 text-xs font-poppins font-bold uppercase tracking-widest rounded-full mb-3 bg-black/60 backdrop-blur-md border border-white/15"
                style={{ color: project.color }}
              >
                {project.category}
              </span>
              <h3 className="text-3xl md:text-4xl font-sora text-white mb-2">{project.title}</h3>
              <p className="text-sm font-poppins text-white/50 line-clamp-2 max-w-md group-hover:text-white/70 transition-colors">
                {project.desc}
              </p>
              <div className="flex items-center gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                <span className="text-xs font-poppins uppercase tracking-widest font-bold" style={{ color: project.color }}>
                  Ver detalle
                </span>
                <span style={{ color: project.color }}>→</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    );
  }
);

TiltProjectCard.displayName = "TiltProjectCard";

const WorksSection = () => {
  const [filter, setFilter] = useState("Todos");
  const [selectedProject, setSelectedProject] = useState<typeof projects[0] | null>(null);
  const colOddRef = useRef<HTMLDivElement>(null);
  const colEvenRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  const filteredProjects = projects.filter(
    (p) => filter === "Todos" || p.category === filter
  );

  const colOdd = filteredProjects.filter((_, i) => i % 2 === 0);
  const colEven = filteredProjects.filter((_, i) => i % 2 === 1);

  // Grid scroll — asymmetric columns
  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      if (colOddRef.current) {
        gsap.to(colOddRef.current, {
          yPercent: -5,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.5,
          },
        });
      }
      if (colEvenRef.current) {
        gsap.to(colEvenRef.current, {
          yPercent: 5,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.5,
          },
        });
      }
    }, sectionRef);
    return () => ctx.revert();
  }, [filteredProjects.length]);

  const isGridView = filter === "Todos" || filteredProjects.length >= 3;

  return (
    <section
      id="proyectos"
      ref={sectionRef}
      className="py-24 md:py-32 relative overflow-visible border-t border-white/5"
      style={{ background: "transparent" }}
    >
      {/* Background grid */}
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
            <span className="text-sm font-poppins uppercase tracking-[0.2em] font-bold block mb-4" style={{ color: "var(--primary-color)" }}>
              Innovación
            </span>
            <h2 className="text-4xl md:text-6xl text-white font-sora">
              Proyectos Destacados
            </h2>
          </div>

          {/* Filter pills */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <motion.button
                key={cat}
                onClick={() => setFilter(cat)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-5 py-2.5 rounded-full text-xs font-poppins tracking-wider uppercase transition-all duration-300 cursor-pointer border"
                style={{
                  background: filter === cat ? "var(--primary-color)" : "rgba(255,255,255,0.04)",
                  color: filter === cat ? "#000" : "rgba(255,255,255,0.5)",
                  borderColor: filter === cat ? "var(--primary-color)" : "rgba(255,255,255,0.1)",
                  fontWeight: filter === cat ? 700 : 400,
                  boxShadow: filter === cat ? `0 0 20px rgba(255,255,255,0.3)` : "none",
                }}
              >
                {cat}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* ── Circular Gallery showcase ── */}
        <div className="w-full mb-12" style={{ height: '420px' }}>
          <CircularGallery
            items={[
              { image: projectDev as string,          text: 'Zolaris Platform' },
              { image: projectCyber as string,         text: 'Ciberseguridad' },
              { image: projectInnovation as string,    text: 'Talento Tech' },
              { image: projectConsulting as string,    text: 'MGA Startups' },
            ]}
            bend={3}
            textColor="#FFFFFF"
            borderRadius={0.05}
            scrollSpeed={2}
          />
        </div>

        {/* Gallery */}
        {isGridView ? (
          <div className="flex gap-6 md:gap-8 items-start">
            <div ref={colOddRef} className="flex-1 flex flex-col gap-6 md:gap-8">
              <AnimatePresence>
                {colOdd.map((p) => (
                  <TiltProjectCard
                    key={p.id}
                    project={p}
                    onClick={() => setSelectedProject(p)}
                  />
                ))}
              </AnimatePresence>
            </div>
            <div ref={colEvenRef} className="flex-1 flex flex-col gap-6 md:gap-8" style={{ marginTop: "60px" }}>
              <AnimatePresence>
                {colEven.map((p) => (
                  <TiltProjectCard
                    key={p.id}
                    project={p}
                    onClick={() => setSelectedProject(p)}
                  />
                ))}
              </AnimatePresence>
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            <AnimatePresence>
              {filteredProjects.map((p) => (
                <TiltProjectCard
                  key={p.id}
                  project={p}
                  onClick={() => setSelectedProject(p)}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* ── Project Modal ── */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6"
          >
            <div
              className="absolute inset-0 bg-black/85 backdrop-blur-3xl"
              onClick={() => setSelectedProject(null)}
            />
            <motion.div
              initial={{ y: 60, scale: 0.93, opacity: 0 }}
              animate={{ y: 0, scale: 1, opacity: 1 }}
              exit={{ y: 30, scale: 0.96, opacity: 0 }}
              transition={{ type: "spring", bounce: 0.18, duration: 0.6 }}
              className="relative w-full max-w-5xl border border-white/15 rounded-[2.5rem] overflow-hidden shadow-2xl z-10 flex flex-col md:flex-row"
              style={{ background: "linear-gradient(135deg, #0a0b10 0%, #060709 100%)" }}
            >
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-6 right-6 z-20 w-12 h-12 bg-black/50 hover:bg-white/10 border border-white/15 rounded-full flex items-center justify-center text-white backdrop-blur-md transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="md:w-[55%] h-64 md:h-auto relative overflow-hidden">
                <motion.img
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                  src={selectedProject.img}
                  alt={selectedProject.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/90 via-black/40 to-transparent" />
              </div>

              <div className="md:w-[45%] p-8 md:p-12 flex flex-col justify-center">
                <span
                  className="inline-block px-4 py-1.5 text-xs font-poppins font-bold uppercase tracking-widest rounded-full mb-6 w-fit border"
                  style={{
                    color: selectedProject.color,
                    backgroundColor: selectedProject.color + "18",
                    borderColor: selectedProject.color + "35",
                  }}
                >
                  {selectedProject.category}
                </span>
                <h3 className="text-4xl lg:text-5xl font-sora text-white mb-6">
                  {selectedProject.title}
                </h3>
                <p className="text-white/60 font-poppins leading-relaxed mb-10">
                  {selectedProject.fullDesc}
                </p>
                <a
                  href="https://wa.me/573229132643"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-sora font-bold text-sm hover:scale-105 active:scale-95 transition-transform uppercase tracking-wider shadow-xl"
                  style={{
                    background: selectedProject.color,
                    color: "#000",
                    boxShadow: `0 0 30px ${selectedProject.color}40`,
                  }}
                >
                  Formalizar proyecto ↗
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default WorksSection;
