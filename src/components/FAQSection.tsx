import { useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { MessageSquare, Coins, Globe2, ShieldCheck, Brain, HeartHandshake } from "lucide-react";

const PRIMARY = "#FFFFFF";

const faqs = [
  {
    icon: <MessageSquare className="w-6 h-6" />,
    question: "¿Cuánto tarda en entregarse un proyecto?",
    answer: "Depende del alcance. Una landing page: 5–7 días. Una plataforma web completa: 4–8 semanas. Un agente de IA o automatización: 1–2 semanas. Siempre defino tiempos exactos con hitos claros en la propuesta técnica.",
    color: PRIMARY,
    accent: "rgba(255,255,255,0.10)",
    border: "rgba(255,255,255,0.22)",
    num: "01",
  },
  {
    icon: <Coins className="w-6 h-6" />,
    question: "¿Cómo funciona el proceso de pago?",
    answer: "50% al inicio y 50% en la entrega final. Para proyectos grandes se definen pagos por fases. Acepto Nequi, DaviPlata, transferencia bancaria y PayPal para clientes internacionales.",
    color: "#F59E0B",
    accent: "rgba(245,158,11,0.10)",
    border: "rgba(245,158,11,0.22)",
    num: "02",
  },
  {
    icon: <Globe2 className="w-6 h-6" />,
    question: "¿Trabajas con clientes fuera de Colombia?",
    answer: "Sí. Trabajo con clientes en Latinoamérica, España y EE.UU. Todo es remoto: videollamadas, actualizaciones asíncronas y demos en vivo. Inglés y español sin problema.",
    color: "#4da4ff",
    accent: "rgba(77,164,255,0.10)",
    border: "rgba(77,164,255,0.22)",
    num: "03",
  },
  {
    icon: <ShieldCheck className="w-6 h-6" />,
    question: "¿Qué pasa si no quedo satisfecho?",
    answer: "Incluyo hasta 2 rondas de revisiones sin costo adicional dentro del alcance acordado. Si el problema es técnico, lo soluciono sin cargo. Mi objetivo es superar tus expectativas.",
    color: "#22c55e",
    accent: "rgba(34,197,94,0.10)",
    border: "rgba(34,197,94,0.22)",
    num: "04",
  },
  {
    icon: <Brain className="w-6 h-6" />,
    question: "¿Necesito saber de tecnología para trabajar conmigo?",
    answer: "No. Traduzco tu visión de negocio al lenguaje técnico exacto. Tú me cuentas el problema, yo propongo la solución más eficiente. Solo necesitas saber qué resultado buscas.",
    color: "#a855f7",
    accent: "rgba(168,85,247,0.10)",
    border: "rgba(168,85,247,0.22)",
    num: "05",
  },
  {
    icon: <HeartHandshake className="w-6 h-6" />,
    question: "¿Qué soporte ofreces después de la entrega?",
    answer: "30 días de soporte post-entrega para correcciones sin costo adicional. Después, planes de mantenimiento mensual flexibles. También capacito a tu equipo para gestión autónoma.",
    color: "#ec4899",
    accent: "rgba(236,72,153,0.10)",
    border: "rgba(236,72,153,0.22)",
    num: "06",
  },
];

// Single FAQ Card
const FAQCard = ({ faq, index }: { faq: typeof faqs[0]; index: number }) => {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.07 }}
      className="relative rounded-2xl overflow-hidden cursor-pointer group"
      onClick={() => setOpen(!open)}
      style={{
        background: open
          ? `linear-gradient(135deg, ${faq.accent}, rgba(8,9,14,0.97))`
          : "rgba(255,255,255,0.025)",
        border: `1px solid ${open ? faq.border : "rgba(255,255,255,0.07)"}`,
        transition: "all 0.35s ease",
      }}
    >
      {/* Top shimmer */}
      <div
        className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `linear-gradient(90deg, transparent, ${faq.color}60, transparent)` }}
      />

      {/* Header row */}
      <div className="flex items-center gap-4 p-6">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300"
          style={{
            background: open ? faq.accent : "rgba(255,255,255,0.04)",
            border: `1.5px solid ${open ? faq.border : "rgba(255,255,255,0.08)"}`,
            color: open ? faq.color : "rgba(240,237,232,0.4)",
          }}
        >
          {faq.icon}
        </div>

        <div className="flex-1 min-w-0">
          <span
            className="text-[10px] font-poppins uppercase tracking-[0.3em] font-bold block mb-0.5"
            style={{ color: open ? faq.color + "99" : "rgba(240,237,232,0.2)" }}
          >
            {faq.num} / 06
          </span>
          <h3
            className="font-sora font-bold text-base md:text-lg leading-tight transition-colors duration-300"
            style={{ color: open ? "#f0ede8" : "rgba(240,237,232,0.75)" }}
          >
            {faq.question}
          </h3>
        </div>

        <motion.div
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          className="text-2xl leading-none shrink-0 font-light"
          style={{ color: open ? faq.color : "rgba(240,237,232,0.3)" }}
        >
          +
        </motion.div>
      </div>

      {/* Answer */}
      <motion.div
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
        style={{ overflow: "hidden" }}
      >
        <div
          className="px-6 pb-6 pt-0 border-t"
          style={{ borderColor: `${faq.border}` }}
        >
          <p
            className="font-poppins text-sm leading-relaxed pt-4"
            style={{ color: "rgba(240,237,232,0.55)" }}
          >
            {faq.answer}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

const FAQSection = () => {
  return (
    <section
      id="faq"
      className="relative py-24 md:py-32 overflow-hidden border-t border-white/5"
      style={{ background: "linear-gradient(180deg, #070a12 0%, #0a0c14 100%)" }}
    >
      {/* Ambient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 60% 50% at 30% 60%, rgba(255,255,255,0.05), transparent)" }}
      />

      <div className="max-w-[900px] mx-auto px-6 md:px-10 relative z-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <span
            className="text-xs font-poppins uppercase tracking-[0.35em] font-bold block mb-4"
            style={{ color: PRIMARY }}
          >
            Preguntas Frecuentes
          </span>
          <h2 className="text-4xl md:text-6xl font-sora leading-none mb-6" style={{ color: "#f0ede8" }}>
            Todo lo que{" "}
            <span className="font-display italic" style={{ color: "#8a857c", fontWeight: 300 }}>
              necesitas saber
            </span>
          </h2>
          <p className="font-poppins text-sm max-w-md mx-auto" style={{ color: "rgba(240,237,232,0.4)" }}>
            Haz clic en cada pregunta para ver la respuesta
          </p>
          <div className="w-16 h-1 mt-6 rounded-full mx-auto" style={{ background: PRIMARY, opacity: 0.4 }} />
        </motion.div>

        {/* Two-column FAQ grid on md+, single on mobile */}
        <div className="grid md:grid-cols-2 gap-3">
          {faqs.map((faq, i) => (
            <FAQCard key={faq.num} faq={faq} index={i} />
          ))}
        </div>

        {/* CTA below */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-12 text-center"
        >
          <p className="font-poppins text-sm mb-5" style={{ color: "rgba(240,237,232,0.35)" }}>
            ¿Tienes una pregunta que no está aquí?
          </p>
          <a
            href="https://wa.me/573229132643?text=Hola%20Ivan%2C%20tengo%20una%20pregunta%20sobre%20tus%20servicios."
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-sora font-bold text-sm uppercase tracking-wider transition-all hover:scale-105 active:scale-95"
            style={{
              background: "rgba(255,255,255,0.12)",
              border: "1px solid rgba(255,255,255,0.3)",
              color: PRIMARY,
            }}
          >
            Contáctame directamente →
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQSection;
