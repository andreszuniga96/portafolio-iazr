import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Globe, Server, Bot, BookOpen, ShieldCheck, FileText,
  CheckCircle2, AlertTriangle, CalendarCheck, Zap, Clock, Star
} from "lucide-react";

const PRIMARY = "#FFFFFF";

// ─── Service definitions ──────────────────────────────────────────────────────
const services = [
  {
    id: "web",
    icon: <Globe className="w-6 h-6" />,
    color: "#5B3DF5",
    label: "Página Web Profesional",
    tagline: "Hasta 6 páginas · Diseño premium",
    basePrice: "Desde $1.200.000 COP",
    time: "5–10 días",
    includes: [
      "Diseño responsive (móvil, tablet, desktop)",
      "Hasta 6 páginas/secciones incluidas",
      "Animaciones y microinteracciones",
      "Formulario de contacto funcional",
      "Integración con WhatsApp",
      "Hosting setup + dominio orientado",
    ],
    addons: [
      { label: "Copywriting profesional", price: "+$150.000/pág" },
      { label: "SEO técnico avanzado", price: "+$200.000/pág" },
      { label: "Blog / CMS integrado", price: "+$500.000" },
    ],
    note: null,
    maxPages: 6,
    hasSlider: true,
    baseCalc: (pages: number, copy: boolean, seo: boolean) => {
      let t = 1200000 + (pages - 1) * 180000;
      if (copy) t += pages * 150000;
      if (seo) t += pages * 200000;
      return Math.min(t, 3200000);
    },
  },
  {
    id: "fullstack",
    icon: <Server className="w-6 h-6" />,
    color: PRIMARY,
    label: "Plataforma Full-Stack",
    tagline: "App completa con backend & BD",
    basePrice: "Desde $4.500.000 COP",
    time: "3–8 semanas",
    includes: [
      "Frontend React/Next.js premium",
      "Backend Node.js o Python (API REST)",
      "Base de datos (PostgreSQL / MongoDB)",
      "Autenticación y roles de usuario",
      "Panel de administración",
      "Deploy en AWS / Vercel / Railway",
    ],
    addons: [
      { label: "Módulo de pagos (Wompi/Stripe)", price: "+$800.000" },
      { label: "Integración IA / chatbot", price: "+$1.200.000" },
      { label: "Reportes y analytics", price: "+$600.000" },
    ],
    note: "Para proyectos complejos se define precio exacto en reunión inicial.",
    maxPages: null,
    hasSlider: false,
    baseCalc: () => 4500000,
  },
  {
    id: "ai",
    icon: <Bot className="w-6 h-6" />,
    color: "#7C66FF",
    label: "Automatización con IA",
    tagline: "Agentes LLM, RAG, n8n, pipelines",
    basePrice: "Desde $2.800.000 COP",
    time: "1–3 semanas",
    includes: [
      "Diseño del pipeline de IA",
      "Integración GPT-4 / Gemini / Llama",
      "Flujos automáticos con n8n",
      "Conexión a CRM, Slack, Gmail, WhatsApp",
      "Dashboard de monitoreo",
      "Documentación técnica entregable",
    ],
    addons: [
      { label: "RAG sobre documentos privados", price: "+$900.000" },
      { label: "Fine-tuning de modelo", price: "+$1.500.000" },
      { label: "Mantenimiento mensual", price: "+$400.000/mes" },
    ],
    note: null,
    maxPages: null,
    hasSlider: false,
    baseCalc: () => 2800000,
  },
  {
    id: "mentorship",
    icon: <BookOpen className="w-6 h-6" />,
    color: "#2DD4BF",
    label: "Mentoría 1 a 1",
    tagline: "Sesiones personalizadas por Google Meet",
    basePrice: "$70.000 – $90.000 COP / hora",
    time: "Flexible",
    includes: [
      "Sesiones de 60 o 90 minutos",
      "Revisión de tu código en vivo",
      "Hoja de ruta personalizada de aprendizaje",
      "Recursos y ejercicios a medida",
      "Grabación de la sesión (opcional)",
      "Soporte post-sesión vía WhatsApp (24h)",
    ],
    addons: [
      { label: "Pack 5 sesiones", price: "$320.000 (ahorra $30k)" },
      { label: "Revisión de portafolio/CV", price: "+$50.000" },
    ],
    note: "Pago previo (1 día antes) vía Nequi, DaviPlata o transferencia.",
    maxPages: null,
    hasSlider: false,
    baseCalc: () => 0,
  },
  {
    id: "audit",
    icon: <ShieldCheck className="w-6 h-6" />,
    color: "#EF4444",
    label: "Auditoría de Código",
    tagline: "Revisión técnica + informe detallado",
    basePrice: "Desde $900.000 COP",
    time: "3–7 días",
    includes: [
      "Análisis de frontend, backend y BD",
      "Detección de vulnerabilidades de seguridad",
      "Revisión de rendimiento y escalabilidad",
      "Buenas prácticas y deuda técnica",
      "Informe ejecutivo PDF de 15–20 páginas",
      "Sesión de retroalimentación de 60 min",
    ],
    addons: [
      { label: "Corrección de errores críticos", price: "+$600.000" },
      { label: "Plan de refactorización", price: "+$400.000" },
    ],
    note: null,
    maxPages: null,
    hasSlider: false,
    baseCalc: () => 900000,
  },
  {
    id: "mga",
    icon: <FileText className="w-6 h-6" />,
    color: "#2232A8",
    label: "Formulación MGA",
    tagline: "Proyectos de inversión pública",
    basePrice: "Cotización personalizada",
    time: "A convenir",
    includes: [
      "Diagnóstico situacional y árbol de problemas",
      "Formulación técnica bajo MGA Gov.co",
      "Análisis de viabilidad financiera",
      "Indicadores de gestión BPIN",
      "Documentación para aprobación",
      "Acompañamiento en sustentación",
    ],
    addons: [],
    note: "El costo varía según el tipo y alcance del proyecto de inversión.",
    maxPages: null,
    hasSlider: false,
    baseCalc: () => 0,
  },
];

type ServiceId = "web" | "fullstack" | "ai" | "mentorship" | "audit" | "mga";

export default function PricingCalculator() {
  const [activeId, setActiveId] = useState<ServiceId>("web");
  const [pages, setPages] = useState(3);
  const [addCopy, setAddCopy] = useState(false);
  const [addSEO, setAddSEO] = useState(false);

  const active = services.find(s => s.id === activeId)!;

  const calcPrice = () => {
    if (activeId === "web") return active.baseCalc(pages, addCopy, addSEO);
    return active.baseCalc(0, false, false);
  };

  const numPrice = calcPrice();
  const isQuote = numPrice === 0 || activeId === "mga";
  const isMentorship = activeId === "mentorship";

  const displayPrice = isQuote
    ? isMentorship
      ? "$70.000 – $90.000 / hora"
      : "Cotización personalizada"
    : `$${numPrice.toLocaleString("es-CO")} COP`;

  const buildWA = () => {
    let msg = `Hola Ivan 👋, vi tu portafolio y quiero cotizar:\n\n`;
    msg += `📌 *Servicio:* ${active.label}\n`;
    if (activeId === "web") {
      msg += `📄 *Páginas:* ${pages}\n`;
      if (addCopy) msg += `✅ + Copywriting\n`;
      if (addSEO) msg += `✅ + SEO Avanzado\n`;
      msg += `💰 *Estimado:* ${displayPrice}\n\n`;
    } else {
      msg += `💰 *Referencia:* ${active.basePrice}\n\n`;
    }
    msg += `¿Podemos agendar una reunión virtual para confirmar la propuesta?`;
    return `https://wa.me/573229132643?text=${encodeURIComponent(msg)}`;
  };

  return (
    <section
      id="pricing"
      className="relative py-24 md:py-32 overflow-hidden border-t border-white/5"
      style={{ background: "linear-gradient(180deg, #09090B 0%, #12131A 100%)" }}
    >
      {/* Ambient */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] rounded-full blur-[150px] pointer-events-none"
        style={{ background: "rgba(255,255,255,0.04)" }}
      />

      <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <span className="text-xs font-poppins uppercase tracking-[0.35em] font-bold block mb-4" style={{ color: PRIMARY }}>
            Transparencia Total
          </span>
          <h2 className="text-4xl md:text-6xl font-sora text-white leading-none mb-4">
            Calculadora de{" "}
            <span style={{ color: PRIMARY }}>Inversión</span>
          </h2>
          <p className="text-white/40 max-w-lg mx-auto text-sm font-poppins leading-relaxed">
            Selecciona el servicio y configura tu proyecto para ver el estimado en tiempo real.{" "}
            <strong className="text-white/60">El precio final se confirma en la reunión de kickoff.</strong>
          </p>
        </motion.div>

        {/* Main card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl shadow-black/60"
          style={{ background: "#07090f" }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr_320px]">

            {/* ── Col 1: Service selector ── */}
            <div className="border-b lg:border-b-0 lg:border-r border-white/8 p-6 flex flex-col gap-2">
              <p className="text-[10px] font-poppins uppercase tracking-[0.3em] text-white/25 font-bold mb-3">
                Selecciona un servicio
              </p>
              {services.map(s => (
                <button
                  key={s.id}
                  onClick={() => { setActiveId(s.id as ServiceId); setPages(3); setAddCopy(false); setAddSEO(false); }}
                  className="flex items-center gap-3 p-3 rounded-xl text-left transition-all duration-200 group"
                  style={{
                    background: activeId === s.id ? `${s.color}12` : "transparent",
                    border: `1px solid ${activeId === s.id ? s.color + "35" : "rgba(255,255,255,0.05)"}`,
                  }}
                >
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all duration-200"
                    style={{
                      background: activeId === s.id ? `${s.color}20` : "rgba(255,255,255,0.04)",
                      color: activeId === s.id ? s.color : "rgba(240,237,232,0.3)",
                    }}
                  >
                    {s.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`font-poppins text-sm font-semibold leading-tight truncate transition-colors ${activeId === s.id ? "text-white" : "text-white/50 group-hover:text-white/70"}`}>
                      {s.label}
                    </p>
                    <p className="text-[10px] font-poppins mt-0.5 truncate" style={{ color: activeId === s.id ? s.color + "bb" : "rgba(255,255,255,0.2)" }}>
                      {s.basePrice}
                    </p>
                  </div>
                  {activeId === s.id && <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: s.color }} />}
                </button>
              ))}
            </div>

            {/* ── Col 2: Service detail ── */}
            <div className="border-b lg:border-b-0 lg:border-r border-white/8 p-6 md:p-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeId}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.3 }}
                  className="h-full flex flex-col gap-6"
                >
                  {/* Service header */}
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ background: `${active.color}18`, color: active.color }}
                      >
                        {active.icon}
                      </div>
                      <div>
                        <h3 className="font-sora font-bold text-lg text-white leading-tight">{active.label}</h3>
                        <p className="text-xs font-poppins" style={{ color: active.color + "bb" }}>{active.tagline}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 mt-3">
                      <span className="flex items-center gap-1.5 text-xs font-poppins text-white/40">
                        <Clock className="w-3.5 h-3.5" /> {active.time}
                      </span>
                      <span className="flex items-center gap-1.5 text-xs font-poppins" style={{ color: active.color + "aa" }}>
                        <Star className="w-3.5 h-3.5" /> {active.basePrice}
                      </span>
                    </div>
                  </div>

                  {/* What's included */}
                  <div>
                    <p className="text-[10px] font-poppins uppercase tracking-[0.3em] text-white/25 font-bold mb-3">
                      Qué incluye
                    </p>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {active.includes.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm font-poppins text-white/60">
                          <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: active.color }} />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Page slider — web only */}
                  {active.hasSlider && (
                    <div className="p-5 rounded-2xl border border-white/8" style={{ background: "rgba(255,255,255,0.02)" }}>
                      <div className="flex justify-between items-center mb-3">
                        <p className="text-xs font-poppins uppercase tracking-[0.25em] text-white/35 font-bold">Páginas / Vistas</p>
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-sora font-bold" style={{ color: active.color }}>{pages}</span>
                          <span className="text-xs font-poppins text-white/30">de {active.maxPages}</span>
                        </div>
                      </div>
                      <input
                        type="range"
                        min={1}
                        max={active.maxPages!}
                        value={pages}
                        onChange={e => setPages(Number(e.target.value))}
                        className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                        style={{ accentColor: active.color }}
                      />
                      <div className="flex justify-between mt-2 text-[10px] font-poppins text-white/20">
                        <span>1 pág.</span>
                        <span>{active.maxPages} pág. máx.</span>
                      </div>
                    </div>
                  )}

                  {/* Addons — web only */}
                  {active.hasSlider && (
                    <div className="flex flex-col gap-2">
                      <p className="text-[10px] font-poppins uppercase tracking-[0.3em] text-white/25 font-bold">Adicionales</p>
                      {[
                        { state: addCopy, setter: setAddCopy, label: "Copywriting profesional", price: "+$150k/pág" },
                        { state: addSEO, setter: setAddSEO, label: "SEO técnico avanzado", price: "+$200k/pág" },
                      ].map(({ state, setter, label, price }) => (
                        <button
                          key={label}
                          onClick={() => setter(!state)}
                          className="flex items-center justify-between p-3.5 rounded-xl border transition-all text-left"
                          style={{
                            background: state ? `${active.color}10` : "rgba(255,255,255,0.02)",
                            borderColor: state ? `${active.color}40` : "rgba(255,255,255,0.06)",
                          }}
                        >
                          <div className="flex items-center gap-2.5">
                            <div
                              className="w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-all"
                              style={{
                                borderColor: state ? active.color : "rgba(255,255,255,0.25)",
                                background: state ? active.color : "transparent",
                              }}
                            >
                              {state && <svg className="w-2.5 h-2.5 text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5" /></svg>}
                            </div>
                            <span className="text-sm font-poppins text-white/65">{label}</span>
                          </div>
                          <span className="text-xs font-bold font-poppins" style={{ color: active.color }}>{price}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Addons list — non-web services */}
                  {!active.hasSlider && active.addons.length > 0 && (
                    <div>
                      <p className="text-[10px] font-poppins uppercase tracking-[0.3em] text-white/25 font-bold mb-3">
                        Módulos opcionales
                      </p>
                      <div className="flex flex-col gap-2">
                        {active.addons.map((a, i) => (
                          <div key={i} className="flex justify-between items-center p-3 rounded-xl border border-white/6 bg-white/[0.02]">
                            <span className="text-sm font-poppins text-white/55">{a.label}</span>
                            <span className="text-xs font-bold font-poppins" style={{ color: active.color }}>{a.price}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Note */}
                  {active.note && (
                    <div className="flex items-start gap-2 p-3.5 rounded-xl border border-amber-400/20 bg-amber-400/5">
                      <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <p className="text-xs font-poppins text-amber-400/80">{active.note}</p>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* ── Col 3: Price summary + CTA ── */}
            <div className="p-6 md:p-8 flex flex-col gap-6 relative" style={{ background: "rgba(0,0,0,0.2)" }}>
              <div
                className="absolute inset-0 pointer-events-none"
                style={{ background: `radial-gradient(circle at 30% 30%, ${active.color}08, transparent 60%)` }}
              />

              <div className="relative z-10">
                <p className="text-[10px] font-poppins uppercase tracking-[0.3em] text-white/25 font-bold mb-4">
                  Inversión estimada
                </p>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={displayPrice}
                    initial={{ opacity: 0, scale: 0.95, y: 8 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.25 }}
                    className="p-6 rounded-2xl border text-center mb-4"
                    style={{
                      borderColor: `${active.color}30`,
                      background: `${active.color}08`,
                    }}
                  >
                    <div
                      className="absolute inset-0 rounded-2xl blur-2xl"
                      style={{ background: `${active.color}05` }}
                    />
                    <p
                      className="font-sora font-bold leading-tight relative z-10"
                      style={{ fontSize: isQuote ? "1.1rem" : "1.5rem", color: "#f0ede8" }}
                    >
                      {displayPrice}
                    </p>
                    <div className="flex items-center justify-center gap-1.5 mt-2 relative z-10">
                      <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: active.color }} />
                      <span className="text-[10px] font-poppins uppercase tracking-wider" style={{ color: active.color + "99" }}>
                        {isQuote ? "Requiere reunión virtual" : "Estimado inicial"}
                      </span>
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Timeline + guarantee */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-xs font-poppins text-white/40">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Tiempo estimado: <strong className="text-white/60">{active.time}</strong></span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-poppins text-white/40">
                    <Zap className="w-3.5 h-3.5" />
                    <span>Pago 50% inicio · 50% entrega</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-poppins text-white/40">
                    <CalendarCheck className="w-3.5 h-3.5" />
                    <span>2 rondas de revisión incluidas</span>
                  </div>
                </div>

                {/* Divider */}
                <div className="h-px w-full mb-4" style={{ background: "rgba(255,255,255,0.05)" }} />

                {/* CTA */}
                <a
                  href={buildWA()}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-4 rounded-2xl font-sora font-bold text-sm uppercase tracking-wider transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 mb-2 text-black"
                  style={{
                    background: active.color,
                    boxShadow: `0 0 30px ${active.color}40`,
                  }}
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z" />
                  </svg>
                  Cotizar por WhatsApp
                </a>
                <p className="text-center text-white/20 text-[10px] font-poppins">
                  Sin compromiso · Respuesta en &lt;24 horas
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
