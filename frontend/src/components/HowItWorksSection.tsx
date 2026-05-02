import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Calendar, FileCheck, Rocket, MessageSquareHeart } from "lucide-react";

const PRIMARY = "#FFFFFF";

const steps = [
  {
    number: "01",
    icon: <MessageSquareHeart className="w-7 h-7" />,
    title: "Cuentame tu idea",
    desc: "Contactame por WhatsApp o usa Nova AI. No necesitas saber de tecnologia â€” yo traduzco tu vision al lenguaje de codigo.",
    color: PRIMARY,
    accent: "rgba(255,255,255,0.10)",
    border: "rgba(255,255,255,0.22)",
    tag: "Paso 01",
  },
  {
    number: "02",
    icon: <Calendar className="w-7 h-7" />,
    title: "Reunion virtual (30 min)",
    desc: "Agendamos una videollamada de diagnostico gratuita. Definimos el alcance, las tecnologias y la inversion exacta. Sin compromisos.",
    color: "#4da4ff",
    accent: "rgba(77,164,255,0.08)",
    border: "rgba(77,164,255,0.22)",
    tag: "Paso 02",
  },
  {
    number: "03",
    icon: <FileCheck className="w-7 h-7" />,
    title: "Propuesta formal",
    desc: "Recibes en 24 horas una propuesta tecnica y economica detallada con fases, entregables, tiempos y garantias.",
    color: "#f59e0b",
    accent: "rgba(245,158,11,0.08)",
    border: "rgba(245,158,11,0.22)",
    tag: "Paso 03",
  },
  {
    number: "04",
    icon: <Rocket className="w-7 h-7" />,
    title: "Â¡Construimos juntos!",
    desc: "Inicio del proyecto con seguimiento continuo, reportes semanales y demos en vivo hasta la entrega final y despliegue.",
    color: "#a855f7",
    accent: "rgba(168,85,247,0.08)",
    border: "rgba(168,85,247,0.22)",
    tag: "Paso 04",
  },
];

// â”€â”€â”€ Single card â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const StepCard = ({
  step,
  index,
  isLast,
}: {
  step: (typeof steps)[0];
  index: number;
  isLast: boolean;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <div ref={ref} className="relative flex gap-6 md:gap-10">
      {/* Left: number + connector line */}
      <div className="flex flex-col items-center flex-shrink-0">
        {/* Number circle */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={inView ? { scale: 1, opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="w-12 h-12 rounded-full flex items-center justify-center font-sora font-black text-base flex-shrink-0 z-10"
          style={{
            background: `linear-gradient(135deg, ${step.accent}, rgba(8,9,14,0.9))`,
            border: `2px solid ${step.border}`,
            color: step.color,
            boxShadow: `0 0 24px ${step.color}20`,
          }}
        >
          {step.number}
        </motion.div>

        {/* Vertical connector */}
        {!isLast && (
          <motion.div
            initial={{ scaleY: 0, opacity: 0 }}
            animate={inView ? { scaleY: 1, opacity: 1 } : {}}
            transition={{ duration: 0.7, delay: index * 0.15 + 0.3, ease: "easeOut" }}
            className="flex-1 w-px mt-3 origin-top"
            style={{
              background: `linear-gradient(to bottom, ${step.color}40, transparent)`,
              minHeight: "2.5rem",
            }}
          />
        )}
      </div>

      {/* Right: card content */}
      <motion.div
        initial={{ opacity: 0, x: 32 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.65, delay: index * 0.15 + 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="flex-1 mb-10"
      >
        <div
          className="relative rounded-2xl overflow-hidden p-7 md:p-9 group"
          style={{
            background: `linear-gradient(135deg, ${step.accent}, rgba(8,9,14,0.92))`,
            border: `1px solid ${step.border}`,
            boxShadow: `0 20px 60px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.05)`,
          }}
        >
          {/* Ghost number background */}
          <div
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[100px] md:text-[130px] font-sora font-black leading-none select-none pointer-events-none"
            style={{ color: step.color + "07" }}
            aria-hidden
          >
            {step.number}
          </div>

          {/* Inner glow */}
          <div
            className="absolute top-0 right-0 w-64 h-64 pointer-events-none"
            style={{
              background: `radial-gradient(circle at 80% 20%, ${step.color}12, transparent 70%)`,
            }}
          />

          {/* Hover top shimmer */}
          <div
            className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{
              background: `linear-gradient(90deg, transparent, ${step.color}60, transparent)`,
            }}
          />

          <div className="relative z-10">
            {/* Icon + tag row */}
            <div className="flex items-center gap-3 mb-5">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{
                  background: step.accent,
                  border: `1.5px solid ${step.border}`,
                  color: step.color,
                  boxShadow: `0 0 20px ${step.color}20`,
                }}
              >
                {step.icon}
              </div>
              <span
                className="text-[10px] font-poppins uppercase tracking-[0.35em] font-bold"
                style={{ color: step.color + "bb" }}
              >
                {step.tag} / 04
              </span>
            </div>

            {/* Title */}
            <h3
              className="text-2xl md:text-3xl font-sora text-white font-bold mb-3 leading-[1.2]"
            >
              {step.title}
            </h3>

            {/* Desc */}
            <p className="font-poppins text-white/55 text-base leading-relaxed max-w-lg">
              {step.desc}
            </p>

            {/* CTA on last step */}
            {isLast && (
              <a
                href="https://wa.me/573229132643?text=Hola%20IAZR%20%F0%9F%91%8B%2C%20quiero%20agendar%20la%20reuni%C3%B3n%20virtual%20de%20diagn%C3%B3stico%20gratuita."
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-3 mt-7 px-7 py-4 rounded-full font-sora font-bold text-sm uppercase tracking-wider transition-all hover:scale-105 active:scale-95 text-black"
                style={{
                  background: PRIMARY,
                  boxShadow: `0 0 32px rgba(255,255,255,0.35)`,
                }}
              >
                <Calendar className="w-4 h-4" />
                Agendar Reunion Gratuita
              </a>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// â”€â”€â”€ Section â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const HowItWorksSection = () => {
  return (
    <section
      id="proceso"
      className="relative py-20 md:py-28 border-t border-white/5"
      style={{ background: "transparent" }}
    >
      {/* Background grain */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "200px",
        }}
      />

      <div className="max-w-[760px] mx-auto px-6 md:px-10 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span
            className="text-xs font-poppins uppercase tracking-[0.3em] font-bold block mb-4"
            style={{ color: PRIMARY }}
          >
            Proceso Transparente
          </span>
          <h2 className="text-4xl md:text-5xl font-sora text-white">
            Â¿Como trabajamos{" "}
            <span style={{ color: PRIMARY }}>juntos?</span>
          </h2>
          <div
            className="w-16 h-1 mx-auto mt-6 rounded-full"
            style={{ background: PRIMARY, opacity: 0.4 }}
          />
        </motion.div>

        {/* Steps */}
        <div>
          {steps.map((step, i) => (
            <StepCard
              key={i}
              step={step}
              index={i}
              isLast={i === steps.length - 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
