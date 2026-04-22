import { useRef, useState } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useMotionTemplate } from "framer-motion";
import { Code2, BrainCircuit, GraduationCap, ShieldAlert, LineChart, Briefcase, X, ArrowUpRight } from "lucide-react";
import { SectionLabel, TextReveal } from "@/components/ui/AnimatedElements";

interface Service {
  title: string;
  category: string;
  categoryColor: string;
  icon: React.ReactNode;
  desc: string;
  fullDesc: string;
  price: string;
  tags: string[];
  tagColors: string[];
  ctaText: string;
  num: string;
  featured?: boolean;
}

const PRIMARY = "#FF6B2B";

const services: Service[] = [
  {
    num: "01",
    title: "Desarrollo Full-Stack",
    category: "Ingeniería",
    categoryColor: "#3B82F6",
    icon: <Code2 className="w-7 h-7" />,
    desc: "Plataformas web escalables con React, Node.js y bases de datos cloud.",
    fullDesc: "Diseño y desarrollo de aplicaciones web completas desde cero. Implemento arquitecturas modernas (microservicios, REST APIs, GraphQL), bases de datos NoSQL y SQL, autenticación segura, despliegue en Vercel/AWS y optimización de rendimiento.",
    price: "Frontend: $800k – $2.5M COP\nFull-Stack: $4M – $6M COP",
    tags: ["React", "Node.js", "Python", "PostgreSQL", "AWS"],
    tagColors: ["#3B82F6", "#22C55E", "#F59E0B", "#8B5CF6", "#EF4444"],
    ctaText: "Cotizar mi proyecto",
    featured: true,
  },
  {
    num: "02",
    title: "IA & Automatización",
    category: "IA",
    categoryColor: "#8B5CF6",
    icon: <BrainCircuit className="w-7 h-7" />,
    desc: "Bots, agentes LLM y flujos de automatización para ahorrar tiempo y dinero.",
    fullDesc: "Implemento soluciones de Inteligencia Artificial adaptadas a tu negocio: chatbots con memoria, agentes autónomos que procesan datos, automatizan decisiones y se integran con tus sistemas existentes. Trabajo con OpenAI, Gemini, LangChain y herramientas de RPA.",
    price: "Desde $3.500.000 COP",
    tags: ["LangChain", "OpenAI", "Gemini", "n8n", "Python"],
    tagColors: ["#8B5CF6", "#10B981", "#F59E0B", "#3B82F6", "#F59E0B"],
    ctaText: "Automatizar mi negocio",
    featured: true,
  },
  {
    num: "03",
    title: "Mentoría Tecnológica",
    category: "Educación",
    categoryColor: "#10B981",
    icon: <GraduationCap className="w-7 h-7" />,
    desc: "Sesiones 1 a 1 para acelerar tu aprendizaje en programación o IA.",
    fullDesc: "Sesiones personalizadas de mentoría técnica por videollamada. Analizo tu nivel actual, identifico puntos débiles y creo un plan de estudio o proyecto práctico a medida.",
    price: "$60.000 – $80.000 COP / hora\n(Pago previo: Nequi, DaviPlata)",
    tags: ["1 a 1", "Google Meet", "Full-Stack", "IA"],
    tagColors: ["#10B981", "#3B82F6", "#F59E0B", "#8B5CF6"],
    ctaText: "Reservar sesión",
  },
  {
    num: "04",
    title: "Ciberseguridad",
    category: "Infraestructura",
    categoryColor: "#EF4444",
    icon: <ShieldAlert className="w-7 h-7" />,
    desc: "Auditorías, hardening y arquitecturas Zero-Trust para proteger tus sistemas.",
    fullDesc: "Evaluación integral de la seguridad de tus sistemas: pentesting de aplicaciones web, hardening de servidores Linux, análisis de vulnerabilidades y diseño de políticas Zero-Trust.",
    price: "Auditoría: Desde $800.000 COP",
    tags: ["Pentesting", "Linux", "Zero-Trust", "OWASP"],
    tagColors: ["#EF4444", "#F59E0B", "#8B5CF6", "#3B82F6"],
    ctaText: "Auditar mi sistema",
  },
  {
    num: "05",
    title: "Analítica de Datos",
    category: "Big Data",
    categoryColor: "#F59E0B",
    icon: <LineChart className="w-7 h-7" />,
    desc: "Dashboards, modelos predictivos y storytelling de datos para decisiones.",
    fullDesc: "Transformo datos en ventajas competitivas. Construyo pipelines ETL, dashboards interactivos, modelos de predicción y reportes ejecutivos.",
    price: "A cotizar según alcance",
    tags: ["Power BI", "Python", "SQL", "Scikit-learn"],
    tagColors: ["#F59E0B", "#3B82F6", "#8B5CF6", "#10B981"],
    ctaText: "Analizar mis datos",
  },
  {
    num: "06",
    title: "Formulación MGA",
    category: "Consultoría",
    categoryColor: "#6366F1",
    icon: <Briefcase className="w-7 h-7" />,
    desc: "Estructuración de proyectos de inversión pública bajo la metodología MGA.",
    fullDesc: "Consultoría especializada en formulación y evaluación de proyectos del sector público bajo la Metodología General Ajustada. Incluye diagnóstico, árbol de problemas, cadena de valor y viabilidad.",
    price: "A cotizar (según alcance)",
    tags: ["MGA", "DNP", "Inversión Pública", "Viabilidad"],
    tagColors: ["#6366F1", "#3B82F6", "#10B981", "#F59E0B"],
    ctaText: "Formular mi proyecto",
  },
];

// ── Service Modal ─────────────────────────────────────────────────────────────
const ServiceModal = ({ service, onClose }: { service: Service; onClose: () => void }) => {
  const waMsg = encodeURIComponent(`Hola Ivan Zuñiga 👋, quiero cotizar el servicio de *${service.title}*.\n\n¿Podemos agendar una sesión?`);
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/85 backdrop-blur-2xl" />
      <motion.div
        initial={{ scale: 0.92, y: 30, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.92, y: 30, opacity: 0 }}
        transition={{ type: "spring", bounce: 0.2 }}
        className="relative w-full max-w-xl liquid-glass-strong border rounded-[2rem] p-8 md:p-10 z-10 shadow-2xl"
        style={{ borderColor: `${service.categoryColor}25` }}
        onClick={e => e.stopPropagation()}
      >
        {/* Glow */}
        <div className="absolute inset-0 rounded-[2rem] opacity-50 blur-3xl -z-10"
          style={{ background: `${service.categoryColor}15` }} />

        <button onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full flex items-center justify-center transition-all"
          style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.4)" }}>
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ background: `${service.categoryColor}15`, border: `1.5px solid ${service.categoryColor}35`, color: service.categoryColor }}>
            {service.icon}
          </div>
          <div>
            <span className="text-[10px] font-poppins uppercase tracking-widest font-bold block mb-1"
              style={{ color: service.categoryColor }}>{service.num} · {service.category}</span>
            <h3 className="text-xl md:text-2xl font-sora" style={{ color: "#f0ede8" }}>{service.title}</h3>
          </div>
        </div>

        <p className="font-poppins leading-relaxed mb-6 text-sm" style={{ color: "rgba(240,237,232,0.65)" }}>
          {service.fullDesc}
        </p>

        <div className="p-4 rounded-2xl mb-6" style={{ background: `${PRIMARY}08`, border: `1px solid ${PRIMARY}20` }}>
          <p className="text-[10px] font-poppins uppercase tracking-widest font-bold mb-2" style={{ color: PRIMARY }}>Inversión</p>
          {service.price.split("\n").map((line, i) => (
            <p key={i} className="font-sora text-base" style={{ color: "#f0ede8" }}>{line}</p>
          ))}
        </div>

        <div className="flex flex-wrap gap-1.5 mb-6">
          {service.tags.map((tag, i) => (
            <span key={tag}
              className="px-2.5 py-1 rounded-full text-[10px] font-poppins uppercase tracking-wider"
              style={{ background: `${service.tagColors[i] || "#8a857c"}15`, border: `1px solid ${service.tagColors[i] || "#8a857c"}30`, color: service.tagColors[i] || "#8a857c" }}>
              {tag}
            </span>
          ))}
        </div>

        <a href={`https://wa.me/573229132643?text=${waMsg}`} target="_blank" rel="noreferrer"
          className="w-full py-4 bg-primary text-black font-sora font-bold text-sm uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 hover:brightness-110 hover:scale-[1.02] active:scale-95 transition-all">
          {service.ctaText} <ArrowUpRight className="w-4 h-4" />
        </a>
      </motion.div>
    </motion.div>
  );
};

const ServiceCard = ({ service, index, onClick, isFocused, isDimmed }: {
  service: Service; index: number; onClick: () => void;
  isFocused?: boolean; isDimmed?: boolean;
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotX = useMotionValue(0);
  const rotY = useMotionValue(0);
  const springRotX = useSpring(rotX, { stiffness: 280, damping: 28 });
  const springRotY = useSpring(rotY, { stiffness: 280, damping: 28 });
  const rotateX = useMotionTemplate`${springRotX}deg`;
  const rotateY = useMotionTemplate`${springRotY}deg`;
  const spotX   = useSpring(mouseX, { stiffness: 300, damping: 40 });
  const spotY   = useSpring(mouseY, { stiffness: 300, damping: 40 });
  const spotBg  = useMotionTemplate`radial-gradient(260px circle at ${spotX}px ${spotY}px, rgba(255,107,43,0.09), transparent 70%)`;
  const [borderPos, setBorderPos] = useState({ x: 50, y: 50 });

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left, y = e.clientY - rect.top;
    rotX.set((y / rect.height - 0.5) * -12);
    rotY.set((x / rect.width - 0.5) * 12);
    mouseX.set(x); mouseY.set(y);
    setBorderPos({ x: (x / rect.width) * 100, y: (y / rect.height) * 100 });
  };
  const onMouseLeave = () => { rotX.set(0); rotY.set(0); };

  const isFeatured = service.featured;

  return (
    <div className="folder-card-wrapper h-full">
      <motion.div
        ref={cardRef}
        layout
        initial={{ opacity: 0, y: 60, scale: 0.92 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.65, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
        animate={{
          opacity: isDimmed ? 0.35 : 1,
          scale: isDimmed ? 0.97 : 1,
          filter: isDimmed ? "blur(1px)" : "blur(0px)",
        }}
        style={{ rotateX: rotateX, rotateY: rotateY, transformStyle: "preserve-3d" }}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        whileHover={{ y: -6, transition: { duration: 0.25 } }}
        className="relative group rounded-3xl cursor-pointer h-full"
        onClick={onClick}
      >
        {/* Outer glow — stronger when focused */}
        <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-2xl -z-10"
          style={{ background: `${service.categoryColor}${isFocused ? '28' : '18'}` }} />
        {/* Mouse border glow */}
        <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{ background: `radial-gradient(180px circle at ${borderPos.x}% ${borderPos.y}%, ${service.categoryColor}20, transparent 70%)` }} />

        {/* Card */}
        <div className="liquid-glass relative h-full rounded-3xl overflow-hidden border group-hover:border-white/10 transition-all duration-500"
          style={{
            background: "rgba(255,255,255,0.018)",
            borderColor: isFocused ? `${service.categoryColor}35` : "rgba(255,255,255,0.05)",
            padding: isFeatured ? "2rem 2.25rem" : "1.75rem",
          }}>
          {/* Spotlight */}
          <motion.div className="absolute inset-0 rounded-3xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ background: spotBg }} />

          {/* Number */}
          <div className="absolute top-5 right-6 font-outfit font-bold text-4xl md:text-5xl pointer-events-none select-none"
            style={{ color: "rgba(255,255,255,0.025)" }}>
            {service.num}
          </div>

          {/* Icon */}
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 relative z-10 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg"
            style={{
              background: `${service.categoryColor}15`,
              border: `1.5px solid ${service.categoryColor}30`,
              color: service.categoryColor,
            }}>
            {service.icon}
          </div>

          {/* Text */}
          <div className="relative z-10 flex flex-col gap-2 flex-1">
            <span className="text-[10px] font-outfit uppercase tracking-widest font-bold"
              style={{ color: service.categoryColor }}>{service.category}</span>
            <h3 className={`font-outfit ${isFeatured ? "text-xl md:text-2xl" : "text-lg"}`}
              style={{ color: "#f0ede8" }}>{service.title}</h3>
            <p className="text-sm font-outfit leading-relaxed" style={{ color: "rgba(240,237,232,0.45)" }}>
              {service.desc}
            </p>
          </div>

          {/* Tags (featured) */}
          {isFeatured && (
            <div className="flex flex-wrap gap-1.5 mt-4 relative z-10">
              {service.tags.slice(0, 4).map((tag, i) => (
                <span key={tag}
                  className="px-2 py-0.5 rounded-full text-[10px] font-outfit uppercase tracking-wider"
                  style={{ background: `${service.tagColors[i] || "#8a857c"}12`, color: service.tagColors[i] || "#8a857c", border: `1px solid ${service.tagColors[i] || "#8a857c"}25` }}>
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Footer */}
          <div className="mt-5 pt-4 border-t flex items-center justify-between relative z-10"
            style={{ borderColor: "rgba(255,255,255,0.05)" }}>
            <span className="text-primary font-outfit text-xs uppercase tracking-wider font-bold opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-2 group-hover:translate-x-0 flex items-center gap-1.5">
              Explorar <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
            <span className="text-xs font-outfit" style={{ color: "rgba(255,255,255,0.2)" }}>
              {service.price.split("\n")[0].length > 22 ? service.price.split("\n")[0].slice(0, 22) + "…" : service.price.split("\n")[0]}
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const ServicesSection = () => {
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

  return (
    <>
      <section id="servicios" className="relative py-24 md:py-32 overflow-hidden border-t"
        style={{ backgroundColor: "#0d0d10", borderColor: "rgba(42,39,36,0.6)" }}>
        {/* Grid bg */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.02]">
          <div className="absolute inset-0"
            style={{
              backgroundImage: "linear-gradient(to right, #f0ede8 1px, transparent 1px), linear-gradient(to bottom, #f0ede8 1px, transparent 1px)",
              backgroundSize: "4rem 4rem",
              maskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, #000 10%, transparent 70%)",
            }} />
        </div>

        <div className="max-w-[1400px] mx-auto px-6 relative z-10">
          {/* Header with SectionLabel + TextReveal */}
          <motion.div
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="mb-16 md:mb-20"
          >
            <SectionLabel text="Catálogo Tecnológico" className="mb-5" />
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <h2 className="text-4xl md:text-6xl lg:text-7xl font-outfit leading-none" style={{ color: "#f0ede8" }}>
                <TextReveal text="Servicios" />
                <br />
                <span className="aurora-text">
                  <TextReveal text="Especializados" delay={0.15} />
                </span>
              </h2>
              <p className="text-sm font-outfit max-w-xs text-right hidden md:block" style={{ color: "rgba(240,237,232,0.4)" }}>
                Haz clic en cualquier servicio para ver detalle completo, tecnologías y precio.
              </p>
            </div>
          </motion.div>

          {/* Bento Grid — with Focus effect */}
          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 auto-rows-auto"
            onMouseLeave={() => setFocusedIndex(null)}
          >
            {services.map((service, index) => (
              <div
                key={index}
                className={service.featured ? "lg:col-span-1 lg:row-span-1" : ""}
                onMouseEnter={() => setFocusedIndex(index)}
              >
                <ServiceCard
                  service={service}
                  index={index}
                  onClick={() => setSelectedService(service)}
                  isFocused={focusedIndex === index}
                  isDimmed={focusedIndex !== null && focusedIndex !== index}
                />
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center mt-14"
          >
            <a
              href="https://wa.me/573229132643?text=Hola%20Ivan%20Zu%C3%B1iga%20%F0%9F%91%8B%2C%20vi%20tu%20portafolio%20y%20quiero%20cotizar%20un%20servicio."
              target="_blank" rel="noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-sora font-semibold text-sm uppercase tracking-wider transition-all hover:scale-105 active:scale-95"
              style={{ border: "1px solid rgba(255,107,43,0.3)", color: "#FF6B2B", background: "rgba(255,107,43,0.06)" }}
            >
              Cotizar servicio personalizado <ArrowUpRight className="w-4 h-4" />
            </a>
          </motion.div>
        </div>
      </section>

      <AnimatePresence>
        {selectedService && (
          <ServiceModal service={selectedService} onClose={() => setSelectedService(null)} />
        )}
      </AnimatePresence>
    </>
  );
};

export default ServicesSection;
