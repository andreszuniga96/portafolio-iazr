import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { jsPDF } from "jspdf";
import {
  X, Send, User, ChevronRight, Mic, MicOff,
  Download, Volume2, VolumeX, Globe, Sparkles,
  Zap, ArrowUpRight, CheckCircle2, Clock, DollarSign,
  Briefcase, Code2, Brain, Shield, BarChart3, BookOpen,
} from "lucide-react";

// ─── Constants ──────────────────────────────────────────────────────────────
const PRIMARY   = "#FF6B2B";
const P_DIM     = "rgba(255,107,43,0.12)";
const P_GLOW    = "rgba(255,107,43,0.28)";
const AMBER     = "#F59E0B";
const BG_CARD   = "rgba(255,255,255,0.032)";
const BG_BORDER = "rgba(255,255,255,0.07)";

// ─── Types ───────────────────────────────────────────────────────────────────
type Lang = "es" | "en";

type Stage =
  | "greeting"
  | "service_select"
  | "qualify_biz"
  | "scope_deep"
  | "budget"
  | "timeline"
  | "proposal"
  | "close"
  | "open";

interface ConvState {
  stage: Stage;
  service: string | null;
  bizType: string | null;
  scope: string | null;
  budget: string | null;
  timeline: string | null;
  sentiment: number;
  lang: Lang;
  msgCount: number;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  isStreaming?: boolean;
  type?: "text" | "proposal" | "chips";
}

interface QuickChip {
  label: string;
  value: string;
  icon?: React.ReactNode;
}

// ─── Services Knowledge Base ─────────────────────────────────────────────────
const KB: Record<string, {
  name: string; nameEn: string; icon: React.ReactNode;
  color: string; basePrice: string; basePriceEn: string;
  tech: string[]; duration: string; durationEn: string; detail: string; detailEn: string;
  arch: string[]; questions: string[]; questionsEn: string[];
}> = {
  web: {
    name: "Desarrollo Web", nameEn: "Web Development",
    icon: <Code2 className="w-4 h-4" />,
    color: "#3B82F6",
    basePrice: "Frontend: $800k–$2.5M COP · Full-Stack: $4M–$6M COP",
    basePriceEn: "Frontend: $400–$1,200 USD · Full-Stack: $2,000–$3,000 USD",
    tech: ["React.js", "Node.js", "PostgreSQL / MongoDB", "Vercel / AWS"],
    duration: "4 – 12 semanas", durationEn: "4 – 12 weeks",
    detail: "Plataforma web moderna, responsiva y de alto rendimiento con diseño UI/UX premium.",
    detailEn: "Modern, responsive, high-performance web platform with premium UI/UX design.",
    arch: ["UI / Frontend (React)", "API Layer (Node.js)", "Database (PostgreSQL)", "Cloud Deploy (Vercel/AWS)"],
    questions: ["¿Es para una empresa o proyecto personal?", "¿Necesitas e-commerce o pagos?", "¿Tienes un diseño o referencias visuales?"],
    questionsEn: ["Is it for a company or personal project?", "Do you need e-commerce or payments?", "Do you have design references?"],
  },
  ia: {
    name: "Automatizacion con IA", nameEn: "AI Automation",
    icon: <Brain className="w-4 h-4" />,
    color: "#8B5CF6",
    basePrice: "Desde $3.500.000 COP",
    basePriceEn: "From $1,700 USD",
    tech: ["Python / LangChain", "OpenAI / Gemini", "n8n / Make", "WhatsApp API"],
    duration: "3 – 8 semanas", durationEn: "3 – 8 weeks",
    detail: "Agentes autonomos, chatbots y flujos que trabajan por ti 24/7 reduciendo costos operativos.",
    detailEn: "Autonomous agents, chatbots and flows working 24/7 reducing your operational costs.",
    arch: ["Input / Trigger", "LLM Model (Gemini/GPT)", "Memory & Context", "Action / Output"],
    questions: ["¿Que proceso quieres automatizar?", "¿Usas WhatsApp, correo u otro canal?", "¿Cuantos usuarios lo usaran?"],
    questionsEn: ["What process do you want to automate?", "Do you use WhatsApp, email or other channels?", "How many users will interact with it?"],
  },
  mentoria: {
    name: "Mentoria 1 a 1", nameEn: "1-on-1 Mentorship",
    icon: <BookOpen className="w-4 h-4" />,
    color: "#F59E0B",
    basePrice: "$60.000 – $80.000 COP / hora",
    basePriceEn: "$30 – $40 USD / hour",
    tech: ["Google Meet", "Plan personalizado", "GitHub", "Proyectos reales"],
    duration: "Sesiones semanales", durationEn: "Weekly sessions",
    detail: "Aprendizaje acelerado con guia experta, proyectos reales y seguimiento personalizado.",
    detailEn: "Accelerated learning with expert guidance, real projects and personalized tracking.",
    arch: ["Diagnostico inicial", "Plan de estudio", "Sesiones semanales (Meet)", "Proyecto final + portafolio"],
    questions: ["¿Que quieres aprender?", "¿Cual es tu nivel actual?", "¿Cuantas horas/semana puedes dedicar?"],
    questionsEn: ["What do you want to learn?", "What is your current level?", "How many hours/week can you dedicate?"],
  },
  auditoria: {
    name: "Auditoria de Seguridad", nameEn: "Security Audit",
    icon: <Shield className="w-4 h-4" />,
    color: "#EF4444",
    basePrice: "Desde $800.000 COP",
    basePriceEn: "From $400 USD",
    tech: ["OWASP Top 10", "Pentest", "Hardening Linux", "Informe tecnico"],
    duration: "5 – 10 dias habiles", durationEn: "5 – 10 business days",
    detail: "Revision profunda de tu plataforma con recomendaciones accionables y hardening.",
    detailEn: "Deep review of your platform with actionable recommendations and hardening.",
    arch: ["Recon & Scanning", "Vulnerability Analysis", "Pentest Execution", "Hardening Report"],
    questions: ["¿Que plataforma tienes?", "¿Ha tenido incidentes de seguridad?", "¿Necesitas informe para clientes?"],
    questionsEn: ["What platform do you have?", "Have you had security incidents?", "Do you need a report for clients?"],
  },
  datos: {
    name: "Analitica de Datos & BI", nameEn: "Data Analytics & BI",
    icon: <BarChart3 className="w-4 h-4" />,
    color: "#10B981",
    basePrice: "A cotizar segun alcance",
    basePriceEn: "Quote based on scope",
    tech: ["Power BI", "Python / Pandas", "SQL", "Scikit-learn"],
    duration: "2 – 6 semanas", durationEn: "2 – 6 weeks",
    detail: "Dashboards ejecutivos, modelos predictivos y reportes de impacto para decisiones basadas en datos.",
    detailEn: "Executive dashboards, predictive models and impact reports for data-driven decisions.",
    arch: ["Data Sources (SQL/API)", "ETL Pipeline (Python)", "Analytics Engine", "Dashboard (Power BI)"],
    questions: ["¿Que datos tienes disponibles?", "¿Para quien son los dashboards?", "¿Necesitas predicciones o solo reportes?"],
    questionsEn: ["What data do you have available?", "Who are the dashboards for?", "Do you need predictions or just reports?"],
  },
};

const TIMELINES: Record<string, { phase: string; weeks: string; color: string }[]> = {
  web: [
    { phase: "Diseño & Wireframes", weeks: "Sem 1-2", color: "#3B82F6" },
    { phase: "Desarrollo Frontend", weeks: "Sem 3-6", color: "#8B5CF6" },
    { phase: "Backend & APIs", weeks: "Sem 5-9", color: PRIMARY },
    { phase: "Testing & QA", weeks: "Sem 9-11", color: AMBER },
    { phase: "Deploy & Launch", weeks: "Sem 12", color: "#10B981" },
  ],
  ia: [
    { phase: "Analisis de flujo", weeks: "Sem 1", color: "#8B5CF6" },
    { phase: "Prototipo del modelo", weeks: "Sem 2-3", color: PRIMARY },
    { phase: "Integracion & APIs", weeks: "Sem 3-5", color: AMBER },
    { phase: "Entrenamiento & tuning", weeks: "Sem 5-7", color: "#10B981" },
    { phase: "Produccion", weeks: "Sem 8", color: "#22c55e" },
  ],
  mentoria: [
    { phase: "Diagnostico & plan", weeks: "Sem 1", color: AMBER },
    { phase: "Fundamentos", weeks: "Sem 2-4", color: "#3B82F6" },
    { phase: "Proyectos practicos", weeks: "Sem 5-8", color: PRIMARY },
    { phase: "Portafolio & deploy", weeks: "Sem 9-12", color: "#10B981" },
  ],
  auditoria: [
    { phase: "Recon & Scanning", weeks: "Dia 1-2", color: "#EF4444" },
    { phase: "Analisis de vulnerabilidades", weeks: "Dia 3-5", color: AMBER },
    { phase: "Pentest & explotacion", weeks: "Dia 6-8", color: PRIMARY },
    { phase: "Informe & Hardening", weeks: "Dia 9-10", color: "#10B981" },
  ],
  datos: [
    { phase: "Exploracion de datos", weeks: "Sem 1", color: "#10B981" },
    { phase: "ETL & limpieza", weeks: "Sem 2-3", color: "#3B82F6" },
    { phase: "Modelos & analisis", weeks: "Sem 3-5", color: PRIMARY },
    { phase: "Dashboard & entrega", weeks: "Sem 6", color: AMBER },
  ],
};

// ─── Util helpers ─────────────────────────────────────────────────────────────
const detectLang = (t: string): Lang =>
  /\b(hello|hi|what|how|need|want|can|please|project|website|app|price|cost|i\s)/i.test(t) ? "en" : "es";

const detectService = (t: string): string | null => {
  const s = t.toLowerCase();
  if (/web|pagina|pagina|sitio|landing|tienda|ecommerce|app\b|aplicacion|website|frontend|full.?stack/.test(s)) return "web";
  if (/ia\b|bot|chatbot|automat|llm|inteligencia|ai\b|agent|n8n|gemini|openai/.test(s)) return "ia";
  if (/mentor|aprender|estudiar|curso|clases|learn|teach|programar|programaci/.test(s)) return "mentoria";
  if (/auditor|seguridad|hack|vulnerab|pentest|owasp|security/.test(s)) return "auditoria";
  if (/datos|analytics|dashboard|power.?bi|reporting|predicci|data|bi\b/.test(s)) return "datos";
  return null;
};

const calcSentiment = (t: string, cur: number): number => {
  const s = t.toLowerCase();
  let d = 0;
  if (/interesa|quiero|necesito|want|need|interested/.test(s)) d += 12;
  if (/cuanto|precio|costo|presupuesto|price|cost|budget/.test(s)) d += 18;
  if (/cuando|urgente|pronto|asap|soon|when/.test(s)) d += 22;
  if (/si|si\b|claro|perfecto|ok|yes|sure|adelante/.test(s)) d += 28;
  if (/no se|maybe|quizas|tal vez|duda/.test(s)) d -= 5;
  return Math.min(100, Math.max(0, cur + d));
};

// ─── PDF Generator ────────────────────────────────────────────────────────────
const generatePDF = (state: ConvState) => {
  const kb = state.service ? KB[state.service] : null;
  const isEn = state.lang === "en";
  const date = new Date().toLocaleDateString(isEn ? "en-US" : "es-CO", {
    year: "numeric", month: "long", day: "numeric",
  });

  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const W = doc.internal.pageSize.getWidth();
  const H = doc.internal.pageSize.getHeight();
  const margin = 18;
  let y = margin;

  const line = (text: string, size: number, bold = false, rgb: [number,number,number] = [220,215,210]) => {
    doc.setFontSize(size);
    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.setTextColor(...rgb);
    const lines = doc.splitTextToSize(text, W - margin * 2);
    doc.text(lines, margin, y);
    y += size * 0.38 * lines.length + 2.5;
  };
  const sp = (h = 5) => { y += h; };
  const rule = (rgb: [number,number,number] = [255,107,43]) => {
    doc.setDrawColor(...rgb);
    doc.setLineWidth(0.35);
    doc.line(margin, y, W - margin, y);
    sp(4);
  };

  // Background
  doc.setFillColor(8, 9, 14);
  doc.rect(0, 0, W, H, "F");

  // Header band
  doc.setFillColor(255, 107, 43);
  doc.rect(0, 0, W, 24, "F");
  doc.setFontSize(14); doc.setFont("helvetica", "bold"); doc.setTextColor(0, 0, 0);
  doc.text("IAZR · Ivan Zuñiga — Propuesta Tecnica", margin, 15);
  doc.setFontSize(8); doc.setFont("helvetica", "normal");
  doc.text(date, W - margin, 15, { align: "right" });

  y = 34;

  if (kb) {
    line(isEn ? kb.nameEn : kb.name, 20, true, [255, 107, 43]);
    sp(2); rule();
    line(isEn ? "Proposed solution" : "Solucion propuesta", 9, true, [255,107,43]);
    line(isEn ? kb.detailEn : kb.detail, 9, false, [180,175,168]);
    sp(4);
    line(isEn ? "Tech Stack" : "Stack tecnologico", 9, true, [255,107,43]);
    kb.tech.forEach(t => line(`  •  ${t}`, 9, false, [180,175,168]));
    sp(4);
    line(isEn ? "Estimated time" : "Tiempo estimado", 9, true, [255,107,43]);
    line(isEn ? kb.durationEn : kb.duration, 9, false, [180,175,168]);
    sp(4);
    line(isEn ? "Reference investment" : "Inversion de referencia", 9, true, [255,107,43]);
    line(isEn ? kb.basePriceEn : kb.basePrice, 9, false, [180,175,168]);
    line(isEn ? "(Exact value confirmed in virtual meeting)" : "(Valor exacto confirmado en reunion virtual)", 7, false, [100,95,90]);
    sp(6); rule([60,55,50]);
  }

  if (state.scope) {
    line(isEn ? "Project scope" : "Alcance del proyecto", 9, true, [255,107,43]);
    line(state.scope, 9, false, [180,175,168]);
    sp(4);
  }
  if (state.budget) {
    line(isEn ? "Budget range" : "Rango de inversion", 9, true, [255,107,43]);
    line(state.budget, 9, false, [180,175,168]);
    sp(4);
  }
  if (state.timeline) {
    line(isEn ? "Delivery timeline" : "Plazo de entrega", 9, true, [255,107,43]);
    line(state.timeline, 9, false, [180,175,168]);
    sp(6);
  }

  line(isEn ? "Roadmap" : "Roadmap del proyecto", 9, true, [255,107,43]);
  const tl = TIMELINES[state.service || "web"] || TIMELINES.web;
  tl.forEach(t => line(`  ·  ${t.weeks}  —  ${t.phase}`, 9, false, [180,175,168]));

  sp(8); rule();
  line(isEn ? "Next steps" : "Proximos pasos", 9, true, [255,107,43]);
  [
    isEn ? "1. Schedule virtual meeting via WhatsApp" : "1. Agendar reunion virtual via WhatsApp",
    isEn ? "2. Define exact scope (30 min)" : "2. Definir alcance exacto (30 min)",
    isEn ? "3. Receive formal proposal in 24h" : "3. Recibir propuesta formal en 24h",
  ].forEach(s => line(s, 9, false, [180,175,168]));

  sp(8); rule();
  line("Contacto", 9, true, [255,107,43]);
  ["WhatsApp: +57 322 913 2643", "Email: ivan@iazr.dev", "LinkedIn: linkedin.com/in/iazr96", "Web: iazr.dev"].forEach(s =>
    line(s, 9, false, [180,175,168])
  );

  // Footer
  doc.setFontSize(6.5); doc.setFont("helvetica", "italic"); doc.setTextColor(70,65,60);
  doc.text(`© ${new Date().getFullYear()} Ivan Zuñiga · IAZR · Colombia — Generado por Nova AI`, W / 2, H - 9, { align: "center" });

  doc.save(`propuesta-iazr-${Date.now()}.pdf`);
};

// ─── Nova Avatar — Small (in messages) ───────────────────────────────────────
const NovaAvatarSmall = () => (
  <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
    style={{ background: "linear-gradient(135deg, #FF6B2B, #c94d14)", boxShadow: `0 0 12px ${P_GLOW}` }}>
    <svg viewBox="0 0 20 20" width={14} height={14} fill="none">
      <circle cx="7" cy="9" r="2" fill="white" opacity={0.9} />
      <circle cx="13" cy="9" r="2" fill="white" opacity={0.9} />
      <path d="M6 13 Q10 16 14 13" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity={0.7} />
    </svg>
  </div>
);

// ─── Nova Avatar — Large (header) ────────────────────────────────────────────
const NovaAvatarLarge = () => (
  <div className="relative w-11 h-11 flex-shrink-0" style={{ overflow: "visible" }}>
    {/* Ping ring */}
    <div style={{
      position: "absolute", inset: -5, borderRadius: "50%",
      border: "1.5px solid rgba(255,107,43,0.3)",
      animation: "badge-ping 3s ease-out infinite",
      pointerEvents: "none",
    }} />
    {/* Core */}
    <div style={{
      position: "absolute", inset: 0, borderRadius: "50%",
      background: "linear-gradient(135deg, #FF6B2B 0%, #c94d14 100%)",
      boxShadow: `0 0 20px ${P_GLOW}`,
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <svg viewBox="0 0 24 24" width={20} height={20} fill="none">
        <circle cx="8.5" cy="11" r="2.5" fill="white" opacity={0.95} />
        <circle cx="15.5" cy="11" r="2.5" fill="white" opacity={0.95} />
        <path d="M7 15.5 Q12 19 17 15.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" fill="none" opacity={0.8} />
        <path d="M12 4 L12 6.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity={0.5} />
        <path d="M8 4.5 L9 6.7" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity={0.4} />
        <path d="M16 4.5 L15 6.7" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity={0.4} />
      </svg>
    </div>
  </div>
);

// ─── Sentiment Pill ───────────────────────────────────────────────────────────
const SentimentPill = ({ value }: { value: number }) => {
  const cfg =
    value < 25 ? { label: "Explorando", color: "#8a857c" } :
    value < 50 ? { label: "Interesado", color: AMBER } :
    value < 75 ? { label: "Evaluando", color: "#22c55e" } :
                 { label: "Listo ✓", color: PRIMARY };
  return (
    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full"
      style={{ background: `${cfg.color}15`, border: `1px solid ${cfg.color}30` }}>
      <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: cfg.color }} />
      <span className="text-[9px] font-poppins font-semibold" style={{ color: cfg.color }}>{cfg.label}</span>
    </div>
  );
};

// ─── Thinking Indicator ───────────────────────────────────────────────────────
const THINKING = ["Analizando...", "Procesando...", "Generando respuesta...", "Estructurando propuesta..."];
const ThinkingBubble = () => {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx(p => (p + 1) % THINKING.length), 1200);
    return () => clearInterval(t);
  }, []);
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
      className="flex items-end gap-3">
      <NovaAvatarSmall />
      <div className="px-4 py-3 rounded-2xl rounded-bl-none flex items-center gap-3"
        style={{ background: BG_CARD, border: `1px solid ${PRIMARY}20` }}>
        <div className="flex gap-0.5 items-end">
          {[0,1,2,3].map(i => (
            <motion.span key={i} className="w-1 rounded-full" style={{ backgroundColor: PRIMARY, height: 12 }}
              animate={{ scaleY: [0.3, 1.2, 0.3] }}
              transition={{ duration: 0.85, delay: i * 0.1, repeat: Infinity, ease: "easeInOut" }} />
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.span key={idx} initial={{ opacity: 0, y: 3 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -3 }}
            transition={{ duration: 0.2 }} className="text-[11px] font-poppins" style={{ color: `${PRIMARY}99` }}>
            {THINKING[idx]}
          </motion.span>
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

// ─── Proposal Card ────────────────────────────────────────────────────────────
const ProposalCard = ({ state }: { state: ConvState }) => {
  const kb = state.service ? KB[state.service] : null;
  const tl = TIMELINES[state.service || "web"] || TIMELINES.web;
  const isEn = state.lang === "en";
  if (!kb) return null;
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl overflow-hidden my-2" style={{ border: `1px solid ${kb.color}30` }}>
      {/* Header */}
      <div className="px-4 py-3 flex items-center gap-3"
        style={{ background: `${kb.color}15`, borderBottom: `1px solid ${kb.color}20` }}>
        <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: `${kb.color}20`, color: kb.color }}>
          {kb.icon}
        </div>
        <div>
          <p className="text-xs font-sora font-bold text-white">{isEn ? kb.nameEn : kb.name}</p>
          <p className="text-[10px] font-poppins" style={{ color: `${kb.color}cc` }}>
            {isEn ? "Initial Technical Proposal" : "Propuesta Tecnica Inicial"}
          </p>
        </div>
        <div className="ml-auto">
          <div className="px-2 py-1 rounded-full text-[9px] font-poppins font-bold uppercase"
            style={{ background: `${kb.color}20`, color: kb.color, border: `1px solid ${kb.color}30` }}>
            ✓ {isEn ? "Ready" : "Lista"}
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4" style={{ background: "rgba(0,0,0,0.3)" }}>
        {/* Detail */}
        <p className="text-[12px] font-poppins leading-relaxed" style={{ color: "rgba(240,237,232,0.65)" }}>
          {isEn ? kb.detailEn : kb.detail}
        </p>

        {/* Tech Stack */}
        <div>
          <p className="text-[9px] font-poppins uppercase tracking-widest mb-2" style={{ color: `${kb.color}99` }}>
            {isEn ? "Tech Stack" : "Stack tecnologico"}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {kb.tech.map((t, i) => (
              <span key={i} className="px-2 py-0.5 rounded-full text-[10px] font-poppins"
                style={{ background: `${kb.color}12`, border: `1px solid ${kb.color}25`, color: `${kb.color}cc` }}>
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Arch layers */}
        <div>
          <p className="text-[9px] font-poppins uppercase tracking-widest mb-2" style={{ color: `${PRIMARY}80` }}>
            {isEn ? "Architecture" : "Arquitectura"}
          </p>
          <div className="space-y-1.5">
            {kb.arch.map((layer, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.07 }}
                className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-md flex items-center justify-center text-[9px] font-bold flex-shrink-0"
                  style={{ background: `${kb.color}20`, color: kb.color, border: `1px solid ${kb.color}35` }}>
                  {i + 1}
                </div>
                <div className="flex-1 h-7 rounded-md flex items-center px-2 text-[10px] font-poppins"
                  style={{ background: `${kb.color}08`, border: `1px solid ${kb.color}18`, color: "rgba(240,237,232,0.7)" }}>
                  {layer}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Roadmap */}
        <div>
          <p className="text-[9px] font-poppins uppercase tracking-widest mb-2" style={{ color: `${AMBER}80` }}>
            Roadmap
          </p>
          <div className="space-y-1.5">
            {tl.map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.07 }}
                className="flex items-center gap-2">
                <span className="text-[9px] font-poppins w-14 flex-shrink-0 tabular-nums"
                  style={{ color: "rgba(255,255,255,0.3)" }}>
                  {item.weeks}
                </span>
                <div className="h-6 flex-1 rounded-md flex items-center px-2 text-[10px] font-poppins"
                  style={{ background: `${item.color}10`, borderLeft: `2.5px solid ${item.color}`, color: "rgba(240,237,232,0.65)" }}>
                  {item.phase}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Price + duration */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <div className="rounded-xl p-3" style={{ background: `${PRIMARY}10`, border: `1px solid ${PRIMARY}20` }}>
            <div className="flex items-center gap-1.5 mb-1">
              <DollarSign className="w-3 h-3" style={{ color: PRIMARY }} />
              <span className="text-[9px] font-poppins uppercase tracking-wider" style={{ color: `${PRIMARY}80` }}>
                {isEn ? "Investment" : "Inversion"}
              </span>
            </div>
            <p className="text-[11px] font-sora font-bold text-white leading-tight">
              {isEn ? kb.basePriceEn : kb.basePrice}
            </p>
          </div>
          <div className="rounded-xl p-3" style={{ background: `${AMBER}10`, border: `1px solid ${AMBER}20` }}>
            <div className="flex items-center gap-1.5 mb-1">
              <Clock className="w-3 h-3" style={{ color: AMBER }} />
              <span className="text-[9px] font-poppins uppercase tracking-wider" style={{ color: `${AMBER}80` }}>
                {isEn ? "Timeline" : "Tiempo"}
              </span>
            </div>
            <p className="text-[11px] font-sora font-bold text-white leading-tight">
              {isEn ? kb.durationEn : kb.duration}
            </p>
          </div>
        </div>

        {/* Next steps */}
        <div className="rounded-xl p-3" style={{ background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.15)" }}>
          <p className="text-[9px] font-poppins uppercase tracking-widest mb-2" style={{ color: "#22c55e99" }}>
            {isEn ? "Next steps" : "Proximos pasos"}
          </p>
          {[
            isEn ? "Schedule free 30-min virtual meeting" : "Agendar reunion virtual gratuita de 30 min",
            isEn ? "Define exact scope together" : "Definir alcance exacto juntos",
            isEn ? "Receive formal proposal in 24h" : "Recibir propuesta formal en 24h",
          ].map((s, i) => (
            <div key={i} className="flex items-center gap-2 mb-1.5">
              <CheckCircle2 className="w-3 h-3 flex-shrink-0" style={{ color: "#22c55e" }} />
              <span className="text-[10px] font-poppins" style={{ color: "rgba(240,237,232,0.65)" }}>{s}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

// ─── Message content renderer ─────────────────────────────────────────────────
const renderContent = (text: string) => {
  const lines = text.split("\n");
  return lines.map((line, i) => {
    if (i === 0 && line.trim() && !line.startsWith("·") && !line.startsWith("  "))
      return <p key={i} className="text-white text-[13px] font-sora font-semibold mb-2 leading-snug">{line}</p>;
    if (/^\s{2,}\d+\.\s/.test(line)) {
      const num = line.match(/\d+/)?.[0];
      const content = line.replace(/^\s+\d+\.\s*/, "");
      return (
        <div key={i} className="flex gap-2 mb-1.5">
          <span className="text-[12px] font-bold flex-shrink-0 mt-0.5" style={{ color: PRIMARY }}>{num}.</span>
          <span className="text-white/70 text-[12px] leading-relaxed">{content}</span>
        </div>
      );
    }
    if (/^\s{2,}[·•]\s/.test(line)) {
      const content = line.replace(/^\s+[·•]\s*/, "");
      return (
        <div key={i} className="flex gap-2 mb-1">
          <span className="text-[11px] flex-shrink-0 mt-0.5" style={{ color: PRIMARY }}>›</span>
          <span className="text-white/70 text-[12px] leading-relaxed">{content}</span>
        </div>
      );
    }
    if (line.trim() === "") return <div key={i} className="h-1.5" />;
    return <p key={i} className="text-white/70 text-[12px] leading-relaxed mb-1">{line}</p>;
  });
};

// ─── Message Bubble ───────────────────────────────────────────────────────────
const MessageBubble = ({ message, convState }: { message: Message; convState: ConvState }) => {
  const isBot = message.role === "assistant";
  const isProposal = message.type === "proposal";
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
      className={`flex gap-3 ${isBot ? "items-start" : "flex-row-reverse items-end"}`}>
      {isBot
        ? <div className="mt-1"><NovaAvatarSmall /></div>
        : <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center"
            style={{ background: "linear-gradient(135deg,#f0ede8,#d4d0cb)" }}>
            <User className="w-4 h-4 text-gray-700" />
          </div>
      }
      <div className={`min-w-0 ${isBot ? "max-w-[90%]" : "max-w-[80%] flex flex-col items-end"}`}>
        {isBot && <span className="text-[9px] font-poppins mb-1" style={{ color: `${PRIMARY}55` }}>Nova · IA de Ivan Zuñiga</span>}
        {isProposal
          ? <ProposalCard state={convState} />
          : (
            <div className={`px-4 py-3.5 rounded-2xl leading-relaxed ${isBot ? "rounded-tl-none" : "rounded-tr-none"}`}
              style={isBot
                ? { background: BG_CARD, border: `1px solid ${BG_BORDER}`, boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)" }
                : { background: "#f0ede8", color: "#0c0c0e" }}>
              {isBot ? renderContent(message.content) : (
                <span className="text-[13px] font-poppins font-medium">{message.content}</span>
              )}
              {message.isStreaming && (
                <motion.span className="inline-block w-0.5 h-3 ml-1 align-middle rounded-sm"
                  style={{ backgroundColor: PRIMARY }}
                  animate={{ opacity: [1, 0] }} transition={{ duration: 0.6, repeat: Infinity }} />
              )}
            </div>
          )
        }
        <span className="text-[9px] font-poppins mt-1 px-1" style={{ color: "rgba(255,255,255,0.15)" }}>
          {new Date().toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" })}
        </span>
      </div>
    </motion.div>
  );
};

// ─── Quick Chip ───────────────────────────────────────────────────────────────
const Chip = ({ chip, onClick }: { chip: QuickChip; onClick: (v: string) => void }) => (
  <motion.button
    initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
    whileHover={{ scale: 1.04, y: -1 }} whileTap={{ scale: 0.95 }}
    onClick={() => onClick(chip.value)}
    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-poppins whitespace-nowrap"
    style={{ background: P_DIM, border: `1px solid ${PRIMARY}30`, color: `${PRIMARY}dd` }}>
    {chip.icon && <span className="opacity-80">{chip.icon}</span>}
    {chip.label}
  </motion.button>
);

// ─── Conversation Engine ──────────────────────────────────────────────────────
const getResponse = (userText: string, state: ConvState, setState: (s: ConvState) => void): {
  text: string; type?: Message["type"]; chips?: QuickChip[]; newState: ConvState;
} => {
  const t = userText.toLowerCase();
  const isEn = state.lang === "en";
  const svc = detectService(userText);
  const sentiment = calcSentiment(userText, state.sentiment);
  let ns: ConvState = { ...state, sentiment, msgCount: state.msgCount + 1 };

  // ── 1. SERVICE SELECT ──
  if (state.stage === "greeting" || state.stage === "service_select" || state.stage === "open") {
    if (svc) {
      const kb = KB[svc];
      ns = { ...ns, stage: "qualify_biz", service: svc };
      setState(ns);
      return {
        newState: ns,
        text: isEn
          ? `Perfect! ${kb.nameEn} is one of Ivan's top specialties.\n\n  · ${kb.tech.join("\n  · ")}\n\nTell me more:\n  1. Is this for a company or personal project?\n  2. Do you have an existing site/system?\n  3. Any references or inspiration?`
          : `Excelente eleccion. ${kb.name} es una de las especialidades principales de Ivan.\n\n  · ${kb.tech.join("\n  · ")}\n\nCuentame mas:\n  1. ¿Es para empresa o proyecto personal?\n  2. ¿Tienes un sitio/sistema actual?\n  3. ¿Tienes referencias visuales o de funcionalidad?`,
        chips: isEn
          ? [{ label: "Company", value: "Es para una empresa" }, { label: "Personal", value: "Es un proyecto personal" }, { label: "Startup", value: "Es una startup" }]
          : [{ label: "Empresa", value: "Es para una empresa" }, { label: "Personal", value: "Es un proyecto personal" }, { label: "Startup / Emprendimiento", value: "Es una startup" }],
      };
    }
    if (/hola|buenas|buenos|hey|hi\b|hello|inicio|empez/.test(t)) {
      ns = { ...ns, stage: "service_select" };
      setState(ns);
      return {
        newState: ns,
        text: isEn
          ? `Hi! I'm Nova, Ivan Zuñiga's AI assistant.\n\nI'll help you:\n  · Define your project requirements\n  · Get an investment estimate\n  · Generate a technical proposal\n  · Connect with Ivan on WhatsApp\n\nWhat do you need?`
          : `¡Hola! Soy Nova, la IA de Ivan Zuñiga — Ingeniero Full-Stack con +6 años de experiencia.\n\nTe ayudare a:\n  · Definir los requerimientos de tu proyecto\n  · Obtener una estimacion de inversion\n  · Generar una propuesta tecnica\n  · Conectarte con Ivan por WhatsApp\n\n¿Que necesitas?`,
        chips: isEn
          ? [
              { label: "Website / App", value: "Necesito una pagina web o aplicacion", icon: <Code2 className="w-3 h-3" /> },
              { label: "AI Automation", value: "Quiero automatizar con IA", icon: <Brain className="w-3 h-3" /> },
              { label: "Mentorship", value: "Quiero mentoria en programacion", icon: <BookOpen className="w-3 h-3" /> },
              { label: "Security", value: "Necesito auditoria de seguridad", icon: <Shield className="w-3 h-3" /> },
              { label: "Pricing", value: "¿Cuanto cobras?", icon: <DollarSign className="w-3 h-3" /> },
            ]
          : [
              { label: "Web / App", value: "Necesito una pagina web o aplicacion", icon: <Code2 className="w-3 h-3" /> },
              { label: "IA / Automatizacion", value: "Quiero automatizar con IA", icon: <Brain className="w-3 h-3" /> },
              { label: "Mentoria", value: "Quiero mentoria en programacion", icon: <BookOpen className="w-3 h-3" /> },
              { label: "Seguridad", value: "Necesito auditoria de seguridad", icon: <Shield className="w-3 h-3" /> },
              { label: "Ver Precios", value: "¿Cuanto cobras?", icon: <DollarSign className="w-3 h-3" /> },
            ],
      };
    }
    if (/precio|costo|cuanto|cuanto|cobr|tarifa|price|cost|how much/.test(t)) {
      ns = { ...ns, stage: "service_select" };
      setState(ns);
      return {
        newState: ns,
        text: isEn
          ? `Here's a summary of prices:\n\n  · Web Development: $400–$3,000 USD\n  · AI Automation: from $1,700 USD\n  · 1-on-1 Mentorship: $30–$40 USD/hr\n  · Security Audit: from $400 USD\n  · Data Analytics: quote based on scope\n\nAll values are estimates — the exact investment is defined in a free 30-min virtual meeting.\n\nWhich service interests you the most?`
          : `Aqui un resumen de precios:\n\n  · Desarrollo Web: $800k–$6M COP\n  · Automatizacion con IA: desde $3.5M COP\n  · Mentoria 1 a 1: $60k–$80k COP/hora\n  · Auditoria de Seguridad: desde $800k COP\n  · Analitica de Datos: a cotizar\n\nTodos son estimados — la inversion exacta se define en una reunion virtual gratuita de 30 min.\n\n¿Cual te interesa mas?`,
        chips: isEn
          ? [
              { label: "Web / App", value: "Necesito una pagina web", icon: <Code2 className="w-3 h-3" /> },
              { label: "AI Bot", value: "Quiero un bot con IA", icon: <Brain className="w-3 h-3" /> },
              { label: "Mentorship", value: "Quiero mentoria", icon: <BookOpen className="w-3 h-3" /> },
            ]
          : [
              { label: "Web / App", value: "Necesito una pagina web", icon: <Code2 className="w-3 h-3" /> },
              { label: "Bot con IA", value: "Quiero un bot con IA", icon: <Brain className="w-3 h-3" /> },
              { label: "Mentoria", value: "Quiero mentoria", icon: <BookOpen className="w-3 h-3" /> },
            ],
      };
    }
    // fallback
    ns = { ...ns, stage: "service_select" };
    setState(ns);
    return {
      newState: ns,
      text: isEn
        ? `Interesting! To help you better, what type of solution are you looking for?`
        : `Interesante. Para orientarte mejor, ¿que tipo de solucion buscas?`,
      chips: isEn
        ? [
            { label: "Website", value: "Necesito una pagina web", icon: <Code2 className="w-3 h-3" /> },
            { label: "AI Automation", value: "Quiero automatizar con IA", icon: <Brain className="w-3 h-3" /> },
            { label: "Mentorship", value: "Quiero mentoria", icon: <BookOpen className="w-3 h-3" /> },
            { label: "Security", value: "Necesito auditoria de seguridad", icon: <Shield className="w-3 h-3" /> },
            { label: "Data Analytics", value: "Necesito analitica de datos", icon: <BarChart3 className="w-3 h-3" /> },
          ]
        : [
            { label: "Pagina web", value: "Necesito una pagina web", icon: <Code2 className="w-3 h-3" /> },
            { label: "IA / Bot", value: "Quiero automatizar con IA", icon: <Brain className="w-3 h-3" /> },
            { label: "Mentoria", value: "Quiero mentoria", icon: <BookOpen className="w-3 h-3" /> },
            { label: "Seguridad", value: "Necesito auditoria de seguridad", icon: <Shield className="w-3 h-3" /> },
            { label: "Analitica", value: "Necesito analitica de datos", icon: <BarChart3 className="w-3 h-3" /> },
          ],
    };
  }

  // ── 2. QUALIFY BIZ ──
  if (state.stage === "qualify_biz") {
    ns = { ...ns, stage: "scope_deep", bizType: userText };
    setState(ns);
    const kb = KB[state.service || "web"];
    return {
      newState: ns,
      text: isEn
        ? `Got it! Let me ask a few more questions to tailor the proposal:\n\n  1. ${kb.questionsEn[0]}\n  2. ${kb.questionsEn[1]}\n  3. ${kb.questionsEn[2]}\n\nAnswer what you can — the rest we'll define together.`
        : `¡Entendido! Unas preguntas clave para ajustar la propuesta:\n\n  1. ${kb.questions[0]}\n  2. ${kb.questions[1]}\n  3. ${kb.questions[2]}\n\nResponde lo que puedas — el resto lo definimos juntos.`,
    };
  }

  // ── 3. SCOPE DEEP ──
  if (state.stage === "scope_deep") {
    ns = { ...ns, stage: "budget", scope: userText };
    setState(ns);
    return {
      newState: ns,
      text: isEn
        ? `Perfect, that's very helpful.\n\nNow, regarding the investment — do you have an approximate budget in mind?\n\n  · Under $500 USD\n  · $500 – $2,000 USD\n  · $2,000 – $5,000 USD\n  · Over $5,000 USD\n  · Not defined yet\n\nNo pressure — any range is fine.`
        : `Perfecto, eso me ayuda mucho.\n\nAhora, sobre la inversion — ¿tienes un presupuesto aproximado en mente?\n\n  · Menos de $1.000.000 COP\n  · Entre $1M – $4M COP\n  · Entre $4M – $8M COP\n  · Mas de $8M COP\n  · Aun no lo se\n\nNo hay presion — cualquier rango esta bien.`,
      chips: isEn
        ? [
            { label: "Under $500", value: "Menos de $500 USD" },
            { label: "$500 – $2K", value: "Entre $500 y $2.000 USD" },
            { label: "$2K – $5K", value: "Entre $2.000 y $5.000 USD" },
            { label: "Not defined", value: "Aun no lo tengo definido" },
          ]
        : [
            { label: "< $1M COP", value: "Menos de $1.000.000 COP" },
            { label: "$1M – $4M", value: "Entre $1M y $4M COP" },
            { label: "$4M – $8M", value: "Entre $4M y $8M COP" },
            { label: "No definido", value: "Aun no lo tengo definido" },
          ],
    };
  }

  // ── 4. BUDGET ──
  if (state.stage === "budget") {
    ns = { ...ns, stage: "timeline", budget: userText };
    setState(ns);
    return {
      newState: ns,
      text: isEn
        ? `Got it! Last question — when do you need the project ready?\n\n  · ASAP (1–2 months)\n  · 2–4 months\n  · 4–6 months\n  · Flexible / not urgent`
        : `¡Anotado! Ultima pregunta — ¿cuando necesitas el proyecto listo?\n\n  · Lo antes posible (1–2 meses)\n  · 2–4 meses\n  · 4–6 meses\n  · Flexible / sin urgencia`,
      chips: isEn
        ? [
            { label: "ASAP", value: "Lo antes posible", icon: <Zap className="w-3 h-3" /> },
            { label: "2–4 months", value: "En 2 a 4 meses" },
            { label: "4–6 months", value: "En 4 a 6 meses" },
            { label: "Flexible", value: "Flexible, sin urgencia" },
          ]
        : [
            { label: "ASAP", value: "Lo antes posible", icon: <Zap className="w-3 h-3" /> },
            { label: "2–4 meses", value: "En 2 a 4 meses" },
            { label: "4–6 meses", value: "En 4 a 6 meses" },
            { label: "Flexible", value: "Flexible, sin urgencia" },
          ],
    };
  }

  // ── 5. TIMELINE → PROPOSAL ──
  if (state.stage === "timeline") {
    ns = { ...ns, stage: "proposal", timeline: userText, sentiment: Math.min(100, sentiment + 30) };
    setState(ns);
    return {
      newState: ns,
      type: "proposal",
      text: "",
      chips: isEn
        ? [
            { label: "Download PDF", value: "__download__", icon: <Download className="w-3 h-3" /> },
            { label: "Send to WhatsApp", value: "__whatsapp__", icon: <ArrowUpRight className="w-3 h-3" /> },
            { label: "I have questions", value: "Tengo algunas dudas adicionales" },
          ]
        : [
            { label: "Descargar PDF", value: "__download__", icon: <Download className="w-3 h-3" /> },
            { label: "Enviar a WhatsApp", value: "__whatsapp__", icon: <ArrowUpRight className="w-3 h-3" /> },
            { label: "Tengo dudas", value: "Tengo algunas dudas adicionales" },
          ],
    };
  }

  // ── 6. POST PROPOSAL (CLOSE) ──
  if (state.stage === "proposal") {
    if (/si|si\b|claro|perfecto|ok|yes|sure|adelante|agenda|reuni|whatsapp/.test(t)) {
      ns = { ...ns, stage: "close", sentiment: 100 };
      setState(ns);
      return {
        newState: ns,
        text: isEn
          ? `Excellent! 🎉 I've pre-filled your project details in the WhatsApp message.\n\nJust press "Confirm with Ivan" below — Ivan will confirm the virtual meeting within a few hours.\n\nSee you soon!`
          : `¡Excelente! 🎉 He preparado el mensaje de WhatsApp con todos los detalles de tu proyecto.\n\nPresiona "Confirmar con Ivan" abajo — Ivan confirmara la reunion virtual en pocas horas.\n\n¡Nos vemos pronto!`,
        chips: [],
      };
    }
    ns = { ...ns, stage: "close" };
    setState(ns);
    return {
      newState: ns,
      text: isEn
        ? `No worries! The proposal I shared is a solid starting point.\n\nFor the exact investment and custom scope, Ivan does a free 30-min virtual diagnostic — zero commitment.\n\nShall we schedule it?`
        : `¡Sin problema! La propuesta es un punto de partida solido.\n\nPara la inversion exacta y el alcance personalizado, Ivan hace un diagnostico virtual gratuito de 30 min — cero compromiso.\n\n¿Agendamos?`,
    };
  }

  // ── FALLBACK (close stage) ──
  ns = { ...ns, stage: "close" };
  setState(ns);
  return {
    newState: ns,
    text: isEn
      ? `For any additional questions, Ivan is just one message away on WhatsApp. Would you like to connect now?`
      : `Para cualquier duda adicional, Ivan esta a un mensaje de distancia en WhatsApp. ¿Conectamos ahora?`,
  };
};

// ─── Main Widget ──────────────────────────────────────────────────────────────
const ChatbotWidget = () => {
  const [isOpen,      setIsOpen]      = useState(false);
  const [messages,    setMessages]    = useState<Message[]>([{
    id: "init", role: "assistant", type: "text",
    content: "¡Bienvenido! Soy Nova, la IA de Ivan Zuñiga.\n\nEstoy aqui para orientarte, estructurar tu proyecto y generarte una propuesta de inversion personalizada.\n\n¿Que proyecto tienes en mente? Cuentame todo.",
  }]);
  const [input,        setInput]       = useState("");
  const [isThinking,   setIsThinking]  = useState(false);
  const [hasUnread,    setHasUnread]   = useState(false);
  const [isListening,  setIsListening] = useState(false);
  const [isSpeaking,   setIsSpeaking]  = useState(false);
  const [currentChips, setCurrentChips] = useState<QuickChip[]>([
    { label: "Pagina web", value: "Necesito una pagina web", icon: <Code2 className="w-3 h-3" /> },
    { label: "IA / Bot", value: "Quiero automatizar con IA", icon: <Brain className="w-3 h-3" /> },
    { label: "Mentoria", value: "Quiero mentoria", icon: <BookOpen className="w-3 h-3" /> },
    { label: "Ver precios", value: "¿Cuanto cobras?", icon: <DollarSign className="w-3 h-3" /> },
  ]);
  const [convState, setConvState] = useState<ConvState>({
    stage: "greeting", service: null, bizType: null, scope: null,
    budget: null, timeline: null, sentiment: 0, lang: "es", msgCount: 0,
  });

  const endRef     = useRef<HTMLDivElement>(null);
  const inputRef   = useRef<HTMLInputElement>(null);
  const idRef      = useRef(0);
  const synth      = useRef<SpeechSynthesis | null>(null);
  const speechRef  = useRef<SpeechRecognition | null>(null);

  const genId = () => `m-${Date.now()}-${++idRef.current}`;
  const scrollDown = useCallback(() => {
    setTimeout(() => endRef.current?.scrollIntoView({ behavior: "smooth" }), 60);
  }, []);

  useEffect(() => { scrollDown(); }, [messages, isThinking]);
  useEffect(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) synth.current = window.speechSynthesis;
  }, []);
  useEffect(() => {
    if (isOpen) { setTimeout(() => inputRef.current?.focus(), 350); setHasUnread(false); }
  }, [isOpen]);

  // ── WhatsApp message ──
  const buildWaMsg = useCallback(() => {
    const kb = convState.service ? KB[convState.service] : null;
    let msg = `Hola Ivan Zuñiga 👋, acabo de hablar con Nova (IA) en tu portafolio:\n\n`;
    if (kb) {
      msg += `📋 *Servicio de interes:* ${convState.lang === "en" ? kb.nameEn : kb.name}\n`;
      if (convState.scope) msg += `📝 *Mi proyecto:* ${convState.scope}\n`;
      if (convState.budget) msg += `💰 *Presupuesto:* ${convState.budget}\n`;
      if (convState.timeline) msg += `⏱ *Plazo:* ${convState.timeline}\n`;
      msg += `⚙️ *Stack propuesto:* ${kb.tech.join(" · ")}\n`;
      msg += `💵 *Inversion ref.:* ${convState.lang === "en" ? kb.basePriceEn : kb.basePrice}\n`;
    }
    msg += `\n¿Podemos agendar la reunion virtual de 30 min para confirmar el alcance exacto?`;
    return encodeURIComponent(msg);
  }, [convState]);

  // ── Stream text ──
  const streamText = useCallback((text: string, msgId: string, cb?: () => void) => {
    const chars = text.split("");
    let i = 0;
    const tick = () => {
      if (i >= chars.length) {
        setMessages(prev => prev.map(m => m.id === msgId ? { ...m, isStreaming: false } : m));
        cb?.();
        return;
      }
      const ch = chars[i];
      const pause = ch === "." || ch === "\n" ? 60 : ch === "," || ch === "?" ? 25 : 7;
      const chunk = Math.min(i + 3, chars.length);
      setMessages(prev => prev.map(m => m.id === msgId ? { ...m, content: chars.slice(0, chunk).join("") } : m));
      i = chunk;
      scrollDown();
      setTimeout(tick, pause);
    };
    tick();
  }, [scrollDown]);

  // ── Handle special chip actions ──
  const handleChipAction = useCallback((value: string) => {
    if (value === "__download__") {
      generatePDF(convState);
      return;
    }
    if (value === "__whatsapp__") {
      window.open(`https://wa.me/573229132643?text=${buildWaMsg()}`, "_blank");
      return;
    }
    handleSend(value);
  }, [convState, buildWaMsg]);

  // ── Handle send ──
  const handleSend = useCallback(async (text?: string) => {
    const userText = (text ?? input).trim();
    if (!userText || isThinking) return;
    setInput("");
    setCurrentChips([]);

    const lang = detectLang(userText);
    const userMsg: Message = { id: genId(), role: "user", content: userText };
    setMessages(prev => [...prev, userMsg]);
    setIsThinking(true);

    const ns = { ...convState, lang };
    let nextState: ConvState = ns;

    const { text: botText, type, chips: nextChips, newState } = getResponse(userText, ns, s => { nextState = s; });

    // Simulate think delay
    const delay = 900 + Math.min(botText.length * 8, 2000);
    await new Promise(r => setTimeout(r, delay));
    setIsThinking(false);

    if (type === "proposal") {
      // Add proposal card message
      const propId = genId();
      setMessages(prev => [...prev, { id: propId, role: "assistant", type: "proposal", content: "" }]);
      // Add follow-up text after a delay
      setTimeout(() => {
        const followId = genId();
        setMessages(prev => [...prev, { id: followId, role: "assistant", content: "", isStreaming: true }]);
        const followText = convState.lang === "en"
          ? "Here's your personalized proposal! 👆\n\nYou can download it as PDF or send it directly to Ivan via WhatsApp. What would you prefer?"
          : "¡Aqui esta tu propuesta personalizada! 👆\n\nPuedes descargarla en PDF o enviarla directamente a Ivan por WhatsApp. ¿Que prefieres?";
        streamText(followText, followId);
        if (!isOpen) setHasUnread(true);
      }, 600);
    } else {
      const botId = genId();
      setMessages(prev => [...prev, { id: botId, role: "assistant", content: "", isStreaming: true }]);
      streamText(botText, botId);
      if (!isOpen) setHasUnread(true);
    }

    if (nextChips && nextChips.length > 0) {
      setTimeout(() => setCurrentChips(nextChips), 500);
    }
    setConvState(nextState);
  }, [input, isThinking, convState, isOpen, streamText]);

  // ── Voice input ──
  const startListen = useCallback(() => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return;
    const rec = new SR();
    rec.lang = convState.lang === "en" ? "en-US" : "es-CO";
    rec.onresult = (e: any) => { setInput(e.results[0][0].transcript); setIsListening(false); };
    rec.onerror = () => setIsListening(false);
    rec.onend = () => setIsListening(false);
    speechRef.current = rec;
    rec.start();
    setIsListening(true);
  }, [convState.lang]);

  const stopListen = useCallback(() => { speechRef.current?.stop(); setIsListening(false); }, []);

  // ── TTS ──
  const speakLast = useCallback(() => {
    if (!synth.current) return;
    if (isSpeaking) { synth.current.cancel(); setIsSpeaking(false); return; }
    const last = [...messages].reverse().find(m => m.role === "assistant" && m.content);
    if (!last) return;
    const plain = last.content.replace(/[·•\n]/g, " ").replace(/\s+/g, " ").slice(0, 250);
    const utt = new SpeechSynthesisUtterance(plain);
    utt.lang = convState.lang === "en" ? "en-US" : "es-CO";
    utt.onstart = () => setIsSpeaking(true);
    utt.onend = () => setIsSpeaking(false);
    synth.current.speak(utt);
  }, [messages, convState.lang, isSpeaking]);

  const hour = new Date().getHours();
  const isAvail = hour >= 8 && hour < 22;

  return (
    <>
      {/* ── Floating trigger button ── */}
      <motion.button
        onClick={() => setIsOpen(v => !v)}
        className="fixed bottom-20 right-4 z-40 md:bottom-10 md:right-10"
        whileHover={{ scale: 1.08, y: -2 }}
        whileTap={{ scale: 0.93 }}
        aria-label={isOpen ? "Cerrar Nova AI" : "Abrir Nova AI, asistente de Ivan Zuñiga"}
        aria-expanded={isOpen}
        aria-haspopup="dialog">
        <AnimatePresence mode="wait">
          {isOpen
            ? <motion.div key="c" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}
                className="w-14 h-14 rounded-2xl flex items-center justify-center"
                style={{ background: "linear-gradient(135deg,#1a1c22,#0e0f13)", border: `1.5px solid ${PRIMARY}45`, boxShadow: `0 0 24px ${P_GLOW}` }}>
                <X className="w-5 h-5 text-white/70" />
              </motion.div>
            : <motion.div key="o" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}
                className="relative w-14 h-14 rounded-2xl flex items-center justify-center"
                style={{ background: "linear-gradient(135deg,#1e1108,#150f06)", border: `1.5px solid ${PRIMARY}50`, boxShadow: `0 0 20px ${P_GLOW}, 0 8px 32px rgba(0,0,0,0.6)` }}>
                <div className="nova-trigger-ring" />
                {/* Robot icon */}
                <svg viewBox="0 0 24 24" className="w-6 h-6 relative z-10" fill="none" stroke={PRIMARY} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="8" width="18" height="12" rx="3" />
                  <path d="M9 8V6a3 3 0 016 0v2" />
                  <circle cx="9" cy="14" r="1.5" fill={PRIMARY} stroke="none" />
                  <circle cx="15" cy="14" r="1.5" fill={PRIMARY} stroke="none" />
                  <path d="M9 18h6" strokeWidth="1.5" />
                  <path d="M12 2v2" />
                </svg>
                {/* Online dot */}
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2" style={{ borderColor: "#0e0f13" }}>
                  <div className="w-full h-full rounded-full bg-green-400 animate-ping opacity-60" />
                </div>
              </motion.div>
          }
        </AnimatePresence>
        {/* Tooltip */}
        <motion.span
          initial={{ opacity: 0, x: 6 }} whileHover={{ opacity: 1, x: 0 }}
          className="absolute right-16 top-1/2 -translate-y-1/2 pointer-events-none whitespace-nowrap text-xs font-poppins px-3 py-1.5 rounded-full"
          style={{ background: "rgba(12,12,14,0.95)", border: "1px solid rgba(255,255,255,0.07)", color: "rgba(240,237,232,0.6)" }}>
          Nova · IA de IAZR
        </motion.span>
        {/* Unread badge */}
        <AnimatePresence>
          {hasUnread && (
            <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
              className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center"
              style={{ background: PRIMARY, boxShadow: `0 0 12px ${PRIMARY}` }}>
              <Sparkles className="w-2.5 h-2.5 text-black" />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      {/* ── Chat Panel ── */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Mobile overlay */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 md:hidden" />

            <motion.div
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 30, stiffness: 260 }}
              className="fixed top-0 right-0 h-full w-full md:w-[500px] z-[60] flex flex-col"
              style={{ background: "linear-gradient(160deg,#0f0e0c 0%,#0c0c0e 60%,#080808 100%)", borderLeft: "1px solid rgba(255,255,255,0.04)" }}>

              {/* ── Header ── */}
              <div className="flex items-center justify-between px-5 py-3.5 flex-shrink-0"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", background: `${PRIMARY}06` }}>
                <div className="flex items-center gap-3 min-w-0">
                  <NovaAvatarLarge />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-sora text-white text-sm font-bold tracking-wide">Nova</h3>
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-poppins font-bold uppercase tracking-wider flex-shrink-0"
                        style={{ background: `${PRIMARY}18`, color: PRIMARY, border: `1px solid ${PRIMARY}30` }}>
                        <Zap className="w-2.5 h-2.5" /> En linea
                      </span>
                      <SentimentPill value={convState.sentiment} />
                    </div>
                    <p className="text-[10px] font-poppins mt-0.5 truncate" style={{ color: "rgba(255,255,255,0.28)" }}>
                      IA de Ivan Zuñiga · {isAvail ? "Ivan disponible ahora" : "Responde en ~2h"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
                  {/* Lang toggle */}
                  <button onClick={() => setConvState(p => ({ ...p, lang: p.lang === "es" ? "en" : "es" }))}
                    className="p-2 rounded-xl transition-all"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.45)" }}
                    aria-label={convState.lang === "es" ? "Switch to English" : "Cambiar a Español"}
                    title={convState.lang === "es" ? "Switch to English" : "Cambiar a Español"}>
                    <Globe className="w-3.5 h-3.5" />
                  </button>
                  {/* Download */}
                  {convState.stage === "proposal" || convState.stage === "close" ? (
                    <button onClick={() => generatePDF(convState)}
                      className="p-2 rounded-xl transition-all"
                      style={{ background: `${PRIMARY}12`, border: `1px solid ${PRIMARY}25`, color: PRIMARY }}
                      aria-label="Descargar propuesta como PDF"
                      title="Descargar PDF">
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  ) : null}
                  {/* WhatsApp */}
                  <a href={`https://wa.me/573229132643?text=${buildWaMsg()}`} target="_blank" rel="noreferrer"
                    className="p-2 rounded-xl text-xs font-poppins flex items-center gap-1.5 transition-colors"
                    style={{ background: `${PRIMARY}10`, border: `1px solid ${PRIMARY}25`, color: `${PRIMARY}cc` }}>
                    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z"/>
                    </svg>
                    <span className="hidden sm:block text-xs">WhatsApp</span>
                  </a>
                  <button onClick={() => setIsOpen(false)}
                    className="p-2 rounded-xl transition-colors"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.3)" }}
                    aria-label="Cerrar chat Nova AI">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* ── Messages ── */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4 min-h-0"
                style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(255,255,255,0.05) transparent" }}>
                {messages.map(msg => <MessageBubble key={msg.id} message={msg} convState={convState} />)}

                <AnimatePresence>{isThinking && <ThinkingBubble />}</AnimatePresence>

                {/* Current chips */}
                <AnimatePresence>
                  {!isThinking && currentChips.length > 0 && (
                    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      className="flex flex-wrap gap-2 pl-11 pt-1">
                      {currentChips.map(chip => (
                        <Chip key={chip.value} chip={chip} onClick={handleChipAction} />
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

                <div ref={endRef} />
              </div>

              {/* ── Footer ── */}
              <div className="flex-shrink-0" style={{ borderTop: "1px solid rgba(255,255,255,0.05)", background: "rgba(0,0,0,0.25)" }}>
                {/* WhatsApp CTA (pulsing when proposal ready) */}
                <div className="px-4 pt-3 pb-2">
                  <motion.a
                    href={`https://wa.me/573229132643?text=${buildWaMsg()}`}
                    target="_blank" rel="noreferrer"
                    whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                    className="w-full py-3 rounded-xl flex items-center justify-center gap-2 text-xs font-poppins font-semibold group"
                    style={{
                      background: convState.sentiment >= 60 ? `${PRIMARY}18` : `${PRIMARY}08`,
                      border: `1px solid ${convState.sentiment >= 60 ? PRIMARY + "50" : PRIMARY + "20"}`,
                      color: PRIMARY,
                      boxShadow: convState.sentiment >= 60 ? `0 0 20px ${PRIMARY}18` : "none",
                    }}>
                    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z"/>
                    </svg>
                    Confirmar con Ivan · WhatsApp
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100 transition-opacity" />
                  </motion.a>
                </div>

                {/* Input row */}
                <form onSubmit={e => { e.preventDefault(); handleSend(); }}
                  className="flex items-center gap-2 px-4 pb-3">
                  {/* TTS */}
                  <button type="button" onClick={speakLast}
                    className="w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center transition-all hidden sm:flex"
                    style={{ background: isSpeaking ? `${PRIMARY}20` : "rgba(255,255,255,0.05)", border: `1px solid ${isSpeaking ? PRIMARY : "rgba(255,255,255,0.07)"}`, color: isSpeaking ? PRIMARY : "rgba(255,255,255,0.35)" }}>
                    {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>

                  {/* Input */}
                  <div className="flex-1 relative">
                    <input
                      ref={inputRef}
                      type="text"
                      value={input}
                      onChange={e => setInput(e.target.value)}
                      placeholder={isListening ? "🎙️ Escuchando..." : isThinking ? "Nova está pensando..." : "Cuéntame sobre tu proyecto..."}
                      disabled={isThinking || isListening}
                      aria-label="Escribe tu mensaje para Nova AI"
                      className="w-full rounded-2xl py-4 pl-5 pr-14 text-sm font-outfit focus:outline-none transition-all"
                      style={{
                        background: "rgba(255,255,255,0.035)",
                        border: `1px solid ${input.trim() ? `${PRIMARY}55` : "rgba(255,255,255,0.07)"}`,
                        color: "#f0ede8",
                      }} />
                    {/* Mic */}
                    <button type="button" onClick={isListening ? stopListen : startListen}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-xl flex items-center justify-center transition-all"
                      style={{ background: isListening ? `${PRIMARY}25` : "transparent", color: isListening ? PRIMARY : "rgba(255,255,255,0.3)" }}
                      aria-label={isListening ? "Detener grabación de voz" : "Activar entrada de voz"}>
                      {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Send */}
                  <motion.button type="submit" disabled={!input.trim() || isThinking}
                    whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.94 }}
                    className="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center transition-all disabled:opacity-20"
                    style={{ background: input.trim() && !isThinking ? PRIMARY : "rgba(255,255,255,0.08)", color: input.trim() && !isThinking ? "#000" : "#fff" }}
                    aria-label="Enviar mensaje">
                    <Send className="w-4 h-4" />
                  </motion.button>
                </form>

                <p className="text-center text-[9px] font-poppins pb-2" style={{ color: "rgba(255,255,255,0.1)" }}>
                  Nova AI · Asistente de Ivan Zuñiga (IAZR)
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatbotWidget;
