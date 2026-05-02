import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ── Tool definitions ──────────────────────────────────────────────────────────
type Category = "llm" | "auto" | "data" | "infra" | "dev";

interface AITool {
  name: string;
  logo: string;          // emoji fallback
  desc: string;
  category: Category;
  level: "Expert" | "Advanced" | "Proficient";
  url: string;
}

const TOOLS: AITool[] = [
  // LLMs & Modelos
  { name: "GPT-4o",       logo: "🤖", desc: "Razonamiento avanzado, function calling, visión multimodal",          category: "llm",   level: "Expert",     url: "https://openai.com" },
  { name: "Gemini 1.5",   logo: "✨", desc: "Contexto 1M tokens, integración Google Cloud y Search",              category: "llm",   level: "Expert",     url: "https://gemini.google.com" },
  { name: "Claude 3.5",   logo: "🧠", desc: "Razonamiento largo, análisis de documentos y código complejo",        category: "llm",   level: "Advanced",   url: "https://anthropic.com" },
  { name: "Llama 3",      logo: "🦙", desc: "Modelos open-source para despliegue local con Ollama",                category: "llm",   level: "Advanced",   url: "https://ollama.com" },
  { name: "Mistral",      logo: "💨", desc: "LLM europeo eficiente para inferencia on-premise",                   category: "llm",   level: "Proficient", url: "https://mistral.ai" },

  // Automatización & Agentes
  { name: "LangChain",    logo: "⛓️", desc: "Orquestación de cadenas LLM, RAG, memory y tool-calling",            category: "auto",  level: "Expert",     url: "https://langchain.com" },
  { name: "n8n",          logo: "🔄", desc: "Automatización visual de workflows con 400+ integraciones",           category: "auto",  level: "Expert",     url: "https://n8n.io" },
  { name: "CrewAI",       logo: "👥", desc: "Orquestación de agentes colaborativos multi-rol",                     category: "auto",  level: "Advanced",   url: "https://crewai.com" },
  { name: "LlamaIndex",   logo: "📚", desc: "Indexación y consulta inteligente de documentos privados (RAG)",      category: "auto",  level: "Advanced",   url: "https://llamaindex.ai" },
  { name: "Flowise",      logo: "🌊", desc: "UI visual para construir flujos LangChain sin código",                category: "auto",  level: "Proficient", url: "https://flowiseai.com" },

  // Data & Vectores
  { name: "Pinecone",     logo: "🌲", desc: "Base de datos vectorial para búsqueda semántica de alta velocidad",   category: "data",  level: "Advanced",   url: "https://pinecone.io" },
  { name: "Supabase pgvector", logo: "🐘", desc: "Embeddings PostgreSQL + full-stack BaaS en un solo lugar",      category: "data",  level: "Expert",     url: "https://supabase.com" },
  { name: "Hugging Face", logo: "🤗", desc: "Hub de modelos, datasets y Spaces para ML en producción",             category: "data",  level: "Advanced",   url: "https://huggingface.co" },
  { name: "LangSmith",    logo: "🔬", desc: "Observabilidad, tracing y evaluación de pipelines LLM",              category: "data",  level: "Proficient", url: "https://smith.langchain.com" },

  // Infraestructura IA
  { name: "Vercel AI SDK",logo: "▲",  desc: "Streaming de respuestas IA en apps Next.js / React",                 category: "infra", level: "Expert",     url: "https://sdk.vercel.ai" },
  { name: "OpenRouter",   logo: "🔀", desc: "API unificada para 50+ LLMs con fallback y cost control",             category: "infra", level: "Advanced",   url: "https://openrouter.ai" },
  { name: "Modal",        logo: "⚡", desc: "Serverless GPU para fine-tuning e inferencia a escala",               category: "infra", level: "Proficient", url: "https://modal.com" },

  // Dev Stack IA
  { name: "Python",       logo: "🐍", desc: "Ecosistema central: FastAPI, Pandas, NumPy, Scikit-learn",            category: "dev",   level: "Expert",     url: "https://python.org" },
  { name: "FastAPI",      logo: "🚀", desc: "APIs REST/WebSocket de alta performance para servicios IA",           category: "dev",   level: "Expert",     url: "https://fastapi.tiangolo.com" },
  { name: "Docker",       logo: "🐳", desc: "Contenedores reproducibles para servicios ML en cualquier nube",      category: "dev",   level: "Advanced",   url: "https://docker.com" },
];

const CATEGORIES: { id: Category | "all"; label: string; color: string; glow: string }[] = [
  { id: "all",   label: "Todo el Stack",    color: "#A855F7", glow: "rgba(168,85,247,0.25)" },
  { id: "llm",   label: "LLMs & Modelos",  color: "#6366F1", glow: "rgba(99,102,241,0.25)" },
  { id: "auto",  label: "Agentes & Flows", color: "#EC4899", glow: "rgba(236,72,153,0.25)" },
  { id: "data",  label: "Data & Vectores", color: "#22C55E", glow: "rgba(34,197,94,0.25)"  },
  { id: "infra", label: "Infraestructura", color: "#F59E0B", glow: "rgba(245,158,11,0.25)" },
  { id: "dev",   label: "Dev Stack",       color: "#3B82F6", glow: "rgba(59,130,246,0.25)" },
];

const LEVEL_BADGE: Record<AITool["level"], { color: string; bg: string }> = {
  Expert:    { color: "#A855F7", bg: "rgba(168,85,247,0.15)" },
  Advanced:  { color: "#6366F1", bg: "rgba(99,102,241,0.12)" },
  Proficient:{ color: "#64748b", bg: "rgba(100,116,139,0.12)" },
};

// ── Tool Card ─────────────────────────────────────────────────────────────────
const ToolCard = ({ tool, catColor, catGlow }: { tool: AITool; catColor: string; catGlow: string }) => {
  const [hovered, setHovered] = useState(false);
  const badge = LEVEL_BADGE[tool.level];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.92 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="relative rounded-2xl p-5 cursor-default group flex flex-col gap-3 overflow-hidden"
      style={{
        background: hovered
          ? `linear-gradient(135deg, ${catGlow}, rgba(8,9,14,0.97))`
          : "rgba(255,255,255,0.025)",
        border: `1px solid ${hovered ? catColor + "40" : "rgba(255,255,255,0.07)"}`,
        transition: "background 0.3s, border 0.3s, box-shadow 0.3s",
        boxShadow: hovered ? `0 8px 40px ${catGlow}` : "none",
      }}
    >
      {/* Top shimmer */}
      <div
        className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `linear-gradient(90deg, transparent, ${catColor}80, transparent)` }}
      />

      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3">
          <span className="text-2xl leading-none select-none">{tool.logo}</span>
          <div>
            <p className="font-sora font-bold text-sm text-white leading-tight">{tool.name}</p>
            <span
              className="text-[9px] font-poppins font-bold uppercase tracking-widest px-2 py-0.5 rounded-full mt-1 inline-block"
              style={{ color: badge.color, background: badge.bg }}
            >
              {tool.level}
            </span>
          </div>
        </div>
        <a
          href={tool.url}
          target="_blank"
          rel="noopener noreferrer"
          className="opacity-0 group-hover:opacity-60 hover:!opacity-100 transition-opacity text-white text-xs mt-1"
          aria-label={`Sitio oficial de ${tool.name}`}
          onClick={e => e.stopPropagation()}
        >↗</a>
      </div>

      {/* Desc */}
      <p className="text-[11px] font-poppins leading-relaxed" style={{ color: "rgba(240,237,232,0.45)" }}>
        {tool.desc}
      </p>

      {/* Bottom accent bar */}
      <div
        className="h-0.5 w-0 group-hover:w-full rounded-full transition-all duration-500"
        style={{ background: `linear-gradient(90deg, ${catColor}, transparent)` }}
      />
    </motion.div>
  );
};

// ── Main Section ──────────────────────────────────────────────────────────────
const AIToolsSection = () => {
  const [activeCategory, setActiveCategory] = useState<Category | "all">("all");

  const filtered = activeCategory === "all"
    ? TOOLS
    : TOOLS.filter(t => t.category === activeCategory);

  const activeCat = CATEGORIES.find(c => c.id === activeCategory)!;

  return (
    <section
      id="ai-tools"
      className="relative py-24 md:py-32 overflow-hidden border-t border-white/5"
      style={{ background: "linear-gradient(180deg, #090a12 0%, #0a0b14 100%)" }}
    >
      {/* Ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none transition-all duration-700"
        style={{ background: `radial-gradient(ellipse 55% 50% at 70% 30%, ${activeCat.glow}, transparent)` }}
      />

      <div className="max-w-[1300px] mx-auto px-6 md:px-10 lg:px-16 relative z-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-14"
        >
          <span
            className="text-xs font-poppins uppercase tracking-[0.35em] font-bold block mb-4"
            style={{ color: "#A855F7" }}
          >
            Arsenal Tecnológico
          </span>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <h2 className="text-4xl md:text-6xl font-sora text-white leading-none mb-4">
                El Stack de{" "}
                <span className="aurora-text font-bold">IA que usamos</span>
              </h2>
              <p className="max-w-xl font-outfit text-base leading-relaxed" style={{ color: "rgba(240,237,232,0.45)" }}>
                Herramientas productivas, modelos de frontera y frameworks de orquestación
                que integra IAZR en cada proyecto de automatización e inteligencia artificial.
              </p>
            </div>
            {/* Stats pill */}
            <div
              className="flex items-center gap-6 px-6 py-4 rounded-2xl flex-shrink-0 self-start md:self-auto"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
            >
              <div className="text-center">
                <p className="text-2xl font-sora font-bold text-white">{TOOLS.length}+</p>
                <p className="text-[10px] font-poppins uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.3)" }}>
                  Herramientas
                </p>
              </div>
              <div className="w-px h-10 bg-white/8" />
              <div className="text-center">
                <p className="text-2xl font-sora font-bold" style={{ color: "#A855F7" }}>8+</p>
                <p className="text-[10px] font-poppins uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.3)" }}>
                  Años activo
                </p>
              </div>
              <div className="w-px h-10 bg-white/8" />
              <div className="text-center">
                <p className="text-2xl font-sora font-bold" style={{ color: "#22C55E" }}>40+</p>
                <p className="text-[10px] font-poppins uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.3)" }}>
                  Proyectos IA
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Category filter pills */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="flex flex-wrap gap-2 mb-10"
        >
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className="px-4 py-2 rounded-full text-xs font-poppins font-semibold uppercase tracking-wider transition-all duration-300"
              style={{
                background: activeCategory === cat.id ? cat.color + "22" : "rgba(255,255,255,0.04)",
                border: `1px solid ${activeCategory === cat.id ? cat.color + "60" : "rgba(255,255,255,0.08)"}`,
                color: activeCategory === cat.id ? cat.color : "rgba(255,255,255,0.45)",
                boxShadow: activeCategory === cat.id ? `0 0 20px ${cat.glow}` : "none",
              }}
            >
              {cat.label}
            </button>
          ))}
        </motion.div>

        {/* Tool grid */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <AnimatePresence mode="popLayout">
            {filtered.map(tool => (
              <ToolCard
                key={tool.name}
                tool={tool}
                catColor={activeCat.color}
                catGlow={activeCat.glow}
              />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 flex flex-col sm:flex-row items-center justify-between gap-6 p-6 md:p-8 rounded-3xl"
          style={{ background: "rgba(168,85,247,0.06)", border: "1px solid rgba(168,85,247,0.15)" }}
        >
          <div>
            <p className="font-sora font-bold text-white text-lg mb-1">
              ¿Quieres integrar IA en tu negocio?
            </p>
            <p className="font-poppins text-sm" style={{ color: "rgba(240,237,232,0.45)" }}>
              Seleccionamos el stack óptimo según tu caso de uso, presupuesto y escala.
            </p>
          </div>
          <a
            href="https://wa.me/573229132643?text=Hola%20IAZR%20%F0%9F%91%8B%2C%20quiero%20integrar%20IA%20en%20mi%20negocio%20y%20necesito%20una%20consultor%C3%ADa."
            target="_blank"
            rel="noreferrer"
            className="flex-shrink-0 inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full font-outfit font-bold text-sm uppercase tracking-wider transition-all hover:scale-105 active:scale-95"
            style={{ background: "#A855F7", color: "#fff" }}
          >
            Consultoría IA gratuita
            <span>↗</span>
          </a>
        </motion.div>

      </div>
    </section>
  );
};

export default AIToolsSection;
