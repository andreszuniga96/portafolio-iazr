import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, CalendarCheck, CheckCircle2 } from "lucide-react";

type ServiceType = "frontend" | "fullstack" | "mentorship" | "automation" | "audit" | "mga";

interface ServiceOption {
  id: ServiceType;
  label: string;
  basePrice: string;
  desc: string;
}

const serviceOptions: ServiceOption[] = [
  { id: "frontend", label: "Desarrollo Frontend", basePrice: "Desde $800.000 COP", desc: "Interfaces modernas y responsivas." },
  { id: "fullstack", label: "Desarrollo Full-Stack", basePrice: "Desde $4.000.000 COP", desc: "App completa: frontend + backend + BD." },
  { id: "mentorship", label: "Mentoría 1 a 1", basePrice: "$60.000 – $80.000 /hr", desc: "Sesiones personalizadas vía Google Meet." },
  { id: "automation", label: "Automatización con IA", basePrice: "Desde $3.500.000 COP", desc: "Bots, agentes LLM y flujos automáticos." },
  { id: "audit", label: "Auditoría de Código", basePrice: "Desde $800.000 COP", desc: "Revisión técnica con informe detallado." },
  { id: "mga", label: "Formulación MGA", basePrice: "A cotizar", desc: "Proyectos de inversión pública bajo MGA." },
];

const FULLSTACK_MAX_PAGES = 8;
const FULLSTACK_MAX_PRICE = 6000000;

const calculateTotal = (service: ServiceType, pages: number, needContent: boolean, needSEO: boolean) => {
  switch (service) {
    case "mentorship": return { display: "$60.000 – $80.000 COP / hora", numeric: null, requiresMeeting: false };
    case "automation": return { display: "Desde $3.500.000 COP", numeric: null, requiresMeeting: false };
    case "audit": return { display: "Desde $800.000 COP", numeric: null, requiresMeeting: false };
    case "mga": return { display: "Cotización personalizada", numeric: null, requiresMeeting: true };
    case "frontend": {
      let total = 800000;
      if (pages > 5) total += (pages - 5) * 150000;
      if (needContent) total += pages * 80000;
      if (needSEO) total += pages * 80000;
      const max = 2500000;
      const capped = Math.min(total, max);
      return { display: `$${capped.toLocaleString("es-CO")} COP`, numeric: capped, requiresMeeting: false };
    }
    case "fullstack": {
      if (pages >= FULLSTACK_MAX_PAGES) {
        return { display: `$${FULLSTACK_MAX_PRICE.toLocaleString("es-CO")} COP`, numeric: FULLSTACK_MAX_PRICE, requiresMeeting: true };
      }
      let total = 4000000;
      if (pages > 3) total += (pages - 3) * 350000;
      if (needContent) total += pages * 120000;
      if (needSEO) total += pages * 120000;
      const capped = Math.min(total, FULLSTACK_MAX_PRICE);
      return { display: `$${capped.toLocaleString("es-CO")} COP`, numeric: capped, requiresMeeting: false };
    }
    default: return { display: "Consultar", numeric: null, requiresMeeting: false };
  }
};

const buildWhatsappMessage = (service: ServiceType, pages: number, needContent: boolean, needSEO: boolean) => {
  const svc = serviceOptions.find(s => s.id === service);
  const result = calculateTotal(service, pages, needContent, needSEO);
  let msg = `Hola Ivan 👋, vi tu portafolio y quiero cotizar:\n\n`;
  msg += `📌 *Servicio:* ${svc?.label}\n`;
  if (service === "frontend" || service === "fullstack") {
    msg += `📄 *Páginas/Vistas:* ${pages}\n`;
    if (needContent) msg += `✅ *+ Copywriting* incluido\n`;
    if (needSEO) msg += `✅ *+ SEO Avanzado* incluido\n`;
    if (result.requiresMeeting) msg += `⚠️ *Proyecto extenso* — requiere reunión para definir precio final\n`;
  }
  msg += `💰 *Estimado inicial:* ${result.display}\n\n`;
  msg += `¿Podemos agendar una reunión virtual para confirmar la propuesta de inversión?`;
  return encodeURIComponent(msg);
};

export default function PricingCalculator() {
  const [service, setService] = useState<ServiceType>("frontend");
  const [pages, setPages] = useState<number[]>([5]);
  const [needContent, setNeedContent] = useState(false);
  const [needSEO, setNeedSEO] = useState(false);

  const result = calculateTotal(service, pages[0], needContent, needSEO);
  const showPageSlider = service === "frontend" || service === "fullstack";
  const isFullstack = service === "fullstack";
  const maxPages = isFullstack ? FULLSTACK_MAX_PAGES : 30;
  const waMsg = buildWhatsappMessage(service, pages[0], needContent, needSEO);

  return (
    <section id="pricing" className="relative bg-[#03050a] py-24 md:py-32 px-6 md:px-16 overflow-hidden border-t border-white/5">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-primary/5 blur-[130px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto z-10 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-xs uppercase tracking-[0.3em] text-primary mb-3 font-poppins">Transparencia total</p>
          <h2 className="text-4xl md:text-6xl font-sora text-white">Calculadora de Inversión</h2>
          <p className="text-white/40 max-w-lg mx-auto mt-4 text-sm font-poppins leading-relaxed">
            Selecciona el servicio para ver el estimado en tiempo real. <strong className="text-white/60">Todos los valores se confirman en la reunión virtual inicial.</strong>
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl shadow-green-900/10">
          {/* Form Side */}
          <div className="bg-[#080b0f] p-8 md:p-12 space-y-8">
            <div>
              <h3 className="text-base text-white/60 font-poppins uppercase tracking-widest mb-6">¿Qué necesitas?</h3>
              <div className="flex flex-col gap-3">
                {serviceOptions.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => { setService(opt.id); setPages([isFullstack && opt.id === "fullstack" ? Math.min(pages[0], FULLSTACK_MAX_PAGES) : pages[0]]); }}
                    className={`flex items-start gap-4 cursor-pointer p-4 rounded-2xl border transition-all duration-300 text-left ${
                      service === opt.id
                        ? "border-primary/60 bg-primary/10 shadow-[0_0_20px_rgba(0,255,65,0.1)]"
                        : "border-white/5 hover:border-white/20 bg-white/[0.02] hover:bg-white/[0.04]"
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5 flex items-center justify-center transition-all ${
                      service === opt.id ? "border-primary" : "border-white/20"
                    }`}>
                      {service === opt.id && <div className="w-2.5 h-2.5 bg-primary rounded-full" />}
                    </div>
                    <div className="flex-1">
                      <span className={`font-poppins text-sm font-semibold block transition-colors ${service === opt.id ? "text-white" : "text-white/60"}`}>
                        {opt.label}
                      </span>
                      <span className="font-poppins text-[11px] text-white/30 mt-0.5 block">{opt.basePrice}</span>
                    </div>
                    {service === opt.id && <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />}
                  </button>
                ))}
              </div>
            </div>

            <AnimatePresence mode="wait">
              {showPageSlider && (
                <motion.div key="slider" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                  <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-xs text-white/50 font-poppins uppercase tracking-widest">Vistas / Páginas</h3>
                      <div className="flex items-center gap-2">
                        <span className="text-primary font-bold text-2xl font-sora">{pages[0]}</span>
                        {isFullstack && pages[0] >= FULLSTACK_MAX_PAGES && (
                          <span className="text-[10px] text-amber-400 font-poppins uppercase tracking-wider bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20">Máx.</span>
                        )}
                      </div>
                    </div>
                    <Slider
                      min={1}
                      max={maxPages}
                      step={1}
                      value={pages}
                      onValueChange={setPages}
                    />
                    <div className="flex justify-between items-center text-[11px] font-poppins">
                      <span className="text-white/30">1 página</span>
                      {isFullstack ? (
                        <span className="text-amber-400/70 text-center flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Más de {FULLSTACK_MAX_PAGES} pág. → reunión virtual</span>
                      ) : (
                        <span className="text-white/30">30 páginas</span>
                      )}
                    </div>
                  </div>

                  <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3 mt-4">
                    <h3 className="text-xs text-white/50 font-poppins uppercase tracking-widest mb-3">Adicionales</h3>
                    {[
                      { state: needContent, setter: setNeedContent, label: "Gestión de Contenido (Copywriting)", price: "+$80k/pág" },
                      { state: needSEO, setter: setNeedSEO, label: "Optimización SEO Avanzada", price: "+$80k/pág" }
                    ].map(({ state, setter, label, price }) => (
                      <button key={label} onClick={() => setter(!state)}
                        className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all text-left ${
                          state ? "border-primary/50 bg-primary/10" : "border-white/10 hover:border-white/20 bg-white/[0.02]"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${state ? "border-primary bg-primary" : "border-white/30"}`}>
                            {state && <svg className="w-3 h-3 text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5" /></svg>}
                          </div>
                          <span className="text-white/70 font-poppins text-sm">{label}</span>
                        </div>
                        <span className="text-primary text-[11px] font-bold font-poppins">{price}</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {service === "mentorship" && (
                <motion.div key="mentorship" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="p-6 rounded-2xl bg-primary/5 border border-primary/20 text-white/60 text-sm font-poppins space-y-3">
                  <p className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" /> Sesiones 100% online vía <strong className="text-white">Google Meet</strong></p>
                  <p className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" /> Pago previo (1 día antes): <strong className="text-white">Nequi, DaviPlata o Llave</strong></p>
                  <p className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" /> Duración flexible: 60 – 120 minutos</p>
                </motion.div>
              )}

              {service === "audit" && (
                <motion.div key="audit" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="p-6 rounded-2xl bg-primary/5 border border-primary/20 text-white/60 text-sm font-poppins space-y-3">
                  <p className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" /> Revisión de <strong className="text-white">Frontend + Backend</strong></p>
                  <p className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" /> Seguridad, escalabilidad y buenas prácticas</p>
                  <p className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" /> Informe técnico + sesión de retroalimentación</p>
                </motion.div>
              )}

              {service === "mga" && (
                <motion.div key="mga" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="p-6 rounded-2xl bg-primary/5 border border-primary/20 text-white/60 text-sm font-poppins space-y-3">
                  <p className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" /> Formulación bajo Metodología General Ajustada</p>
                  <p className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" /> Análisis de viabilidad técnica y financiera</p>
                  <p className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" /> El costo varía según el alcance del proyecto</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Result Side */}
          <div className="bg-[#030508] p-8 md:p-12 flex flex-col justify-between relative overflow-hidden gap-8">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-transparent to-transparent pointer-events-none" />

            <div className="relative z-10 space-y-2">
              <h3 className="text-2xl text-white font-sora">Inversión Estimada</h3>
              <p className="text-white/40 text-sm font-poppins leading-relaxed">
                Referencia basada en tu selección. <strong className="text-amber-400/80">El valor final siempre se confirma en la reunión virtual de kickoff.</strong>
              </p>
            </div>

            <motion.div
              key={result.display + pages[0]}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="relative z-10 p-8 rounded-2xl border overflow-hidden"
              style={{ borderColor: result.requiresMeeting ? "rgba(251,191,36,0.3)" : "rgba(0,255,65,0.3)", background: result.requiresMeeting ? "rgba(251,191,36,0.05)" : "rgba(0,255,65,0.05)" }}
            >
              <div className="absolute inset-0 blur-2xl" style={{ background: result.requiresMeeting ? "rgba(251,191,36,0.05)" : "rgba(0,255,65,0.05)" }} />
              <div className="relative z-10 flex flex-col items-center text-center gap-3">
                <p className="text-3xl md:text-4xl font-bold text-white tracking-tight leading-tight">{result.display}</p>

                {result.requiresMeeting ? (
                  <div className="flex items-center gap-2 bg-amber-400/10 px-4 py-2 rounded-full border border-amber-400/20">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                    <p className="text-amber-400 font-poppins uppercase tracking-widest text-[10px] font-bold">Requiere Reunión Virtual para confirmar</p>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    <p className="text-primary font-poppins uppercase tracking-widest text-[10px] font-bold">Estimado inicial · Se confirma en reunión virtual</p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Notice about confirmation */}
            <div className="relative z-10 flex items-start gap-3 p-4 rounded-xl bg-white/[0.03] border border-white/10">
              <CalendarCheck className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <p className="text-white/50 text-xs font-poppins leading-relaxed">
                <strong className="text-white/70">Todas las propuestas de inversión se formalizan</strong> en una reunión virtual de diagnóstico. La agendaremos por WhatsApp en menos de 24 horas.
              </p>
            </div>

            <div className="relative z-10 space-y-3">
              <a
                href={`https://wa.me/573229132643?text=${waMsg}`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-5 bg-white hover:bg-primary text-black font-bold uppercase tracking-widest text-sm rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(0,255,65,0.4)]"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z"/></svg>
                Agendar Reunión por WhatsApp
              </a>
              <p className="text-center text-white/25 text-[11px] font-poppins">Sin compromiso · Respuesta en menos de 24 horas</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
