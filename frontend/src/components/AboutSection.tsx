import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import ProfileCard from "@/components/ProfileCard";

// ── Stats ─────────────────────────────────────────────────────────────────────
const stats = [
  { value: 40,   suffix: "+", label: "Proyectos" },
  { value: 98,   suffix: "%", label: "Satisfacción" },
  { value: 6,    suffix: "+", label: "Años" },
  { value: 1200, suffix: "+", label: "Estudiantes" },
  { value: 25,   suffix: "+", label: "Certificaciones" },
  { value: 4,    suffix: "+", label: "Universidades" },
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
  return (
    <section
      id="about"
      className="relative py-24 md:py-32 overflow-hidden border-t border-white/5"
      style={{ background: "transparent" }}
    >
      {/* Ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 60% 60% at 80% 40%, rgba(124,58,237,0.07), transparent)" }}
      />

      <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16 relative z-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <span
            className="text-xs font-poppins uppercase tracking-[0.3em] font-bold block mb-4"
            style={{ color: "var(--primary-color)" }}
          >
            El Perfil detrás de IAZR
          </span>
          <h2 className="text-4xl md:text-6xl font-sora text-white leading-tight mb-6">
            Arquitecto de Soluciones.{" "}
            <span className="aurora-text" style={{ fontStyle: "normal" }}>
              Director de Innovación.
            </span>
          </h2>
          <p className="max-w-2xl font-outfit text-base md:text-lg leading-relaxed" style={{ color: "rgba(240,237,232,0.5)" }}>
            IAZR combina más de 6 años de ingeniería de software con visión estratégica de negocio.
            Docente universitario, mentor tecnológico y CTO activo — no solo construimos: transformamos.
          </p>
        </motion.div>

        {/* ── ProfileCard centrada ── */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center justify-center mb-20"
        >
          <ProfileCard
            name="IAZR"
            title="CTO & Arquitecto de Soluciones · AI & Data Strategist"
            handle="iazr"
            status="Director en Zolaris ✓"
            contactText="Contactar"
            onContactClick={() => window.open("https://wa.me/573229132643", "_blank")}
          />
        </motion.div>

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
                <p
                  className="text-2xl md:text-3xl font-sora font-bold"
                  style={{ color: "var(--primary-color)" }}
                >
                  <Counter value={s.value} suffix={s.suffix} />
                </p>
                <p
                  className="text-[10px] font-poppins mt-1 leading-tight"
                  style={{ color: "rgba(240,237,232,0.35)" }}
                >
                  {s.label}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Clients grid — removed: now lives in BrandSection */}
      </div>
    </section>
  );
};

export default AboutSection;
