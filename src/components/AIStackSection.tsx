import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";

// ─── AI Stack Data ────────────────────────────────────────────────────────────
interface AITool {
  name: string;
  category: string;
  logo: string;       // Emoji / text logo
  color: string;
  mastery: number;    // 0-100
  projects: number;
  desc: string;
}

const AI_STACK: { group: string; color: string; tools: AITool[] }[] = [
  {
    group: "Modelos de Lenguaje",
    color: "#8B5CF6",
    tools: [
      { name: "GPT-4o", category: "LLM", logo: "⊛", color: "#10a37f", mastery: 95, projects: 8, desc: "Agentes, RAG y completions avanzadas" },
      { name: "Gemini 2.5", category: "LLM", logo: "✦", color: "#4285F4", mastery: 92, projects: 6, desc: "Multimodal: texto, código e imagen" },
      { name: "Llama 3", category: "LLM", logo: "◈", color: "#F97316", mastery: 78, projects: 4, desc: "Despliegue on-premise y fine-tuning" },
      { name: "Claude 3.5", category: "LLM", logo: "◆", color: "#C87137", mastery: 80, projects: 3, desc: "Razonamiento y análisis de documentos" },
    ],
  },
  {
    group: "Frameworks & Orquestación",
    color: "#FF6B2B",
    tools: [
      { name: "LangChain", category: "Framework", logo: "⬡", color: "#1C7C54", mastery: 96, projects: 12, desc: "Chains, agents y memory management" },
      { name: "LlamaIndex", category: "RAG", logo: "▲", color: "#F59E0B", mastery: 85, projects: 7, desc: "Indexing y retrieval semántico" },
      { name: "CrewAI", category: "Agentes", logo: "⚙", color: "#EF4444", mastery: 82, projects: 5, desc: "Equipos de agentes autónomos" },
      { name: "n8n", category: "Automatización", logo: "⟂", color: "#EA4B71", mastery: 94, projects: 15, desc: "Flujos low-code + webhooks" },
    ],
  },
  {
    group: "Infraestructura IA",
    color: "#22c55e",
    tools: [
      { name: "AWS Bedrock", category: "Cloud IA", logo: "▣", color: "#FF9900", mastery: 80, projects: 5, desc: "Foundation Models en producción" },
      { name: "Vertex AI", category: "Cloud IA", logo: "⬤", color: "#4285F4", mastery: 75, projects: 4, desc: "MLOps + Gemini en GCP" },
      { name: "Pinecone", category: "Vector DB", logo: "◉", color: "#00C9B1", mastery: 88, projects: 8, desc: "Embeddings y búsqueda semántica" },
      { name: "HuggingFace", category: "Modelos", logo: "🤗", color: "#FFD21E", mastery: 84, projects: 6, desc: "Fine-tuning y model hub" },
    ],
  },
];

// ─── Tool Card ────────────────────────────────────────────────────────────────
const ToolCard = ({ tool, groupColor, index }: { tool: AITool; groupColor: string; index: number }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.94 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{ duration: 0.5, delay: index * 0.06 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="ai-stack-card group cursor-default"
      style={{
        borderColor: hovered ? `${tool.color}35` : "rgba(255,255,255,0.05)",
        boxShadow: hovered ? `0 8px 30px ${tool.color}12` : "none",
      }}
    >
      {/* Top glow on hover */}
      <div className="absolute top-0 left-0 right-0 h-px transition-opacity duration-300 rounded-t-xl"
        style={{ background: `linear-gradient(90deg, transparent, ${tool.color}50, transparent)`, opacity: hovered ? 1 : 0 }} />

      {/* Logo + Name */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg font-bold flex-shrink-0"
            style={{ background: `${tool.color}15`, color: tool.color, border: `1px solid ${tool.color}25` }}>
            {tool.logo}
          </div>
          <div>
            <p className="text-sm font-sora font-semibold" style={{ color: "#f0ede8" }}>{tool.name}</p>
            <p className="text-[9px] font-poppins uppercase tracking-widest" style={{ color: groupColor + "aa" }}>{tool.category}</p>
          </div>
        </div>
        <div className="text-[10px] font-poppins font-bold tabular-nums px-2 py-0.5 rounded-full"
          style={{ background: `${tool.color}12`, color: tool.color, border: `1px solid ${tool.color}25` }}>
          {tool.projects} proyectos
        </div>
      </div>

      {/* Description */}
      <p className="text-[11px] font-poppins mb-3 leading-relaxed" style={{ color: "rgba(240,237,232,0.4)" }}>{tool.desc}</p>

      {/* Mastery bar */}
      <div className="space-y-1">
        <div className="flex justify-between">
          <span className="text-[9px] font-poppins uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.2)" }}>Dominio</span>
          <span className="text-[9px] font-sora font-bold" style={{ color: tool.color }}>{tool.mastery}%</span>
        </div>
        <div className="h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: `${tool.mastery}%` }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.3 + index * 0.05, ease: "easeOut" }}
            className="h-full rounded-full"
            style={{ background: `linear-gradient(90deg, ${tool.color}aa, ${tool.color})` }}
          />
        </div>
      </div>
    </motion.div>
  );
};

// ─── Main Component ────────────────────────────────────────────────────────────
const AIStackSection = () => {
  const [activeGroup, setActiveGroup] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  const filtered = activeGroup
    ? AI_STACK.filter((g) => g.group === activeGroup)
    : AI_STACK;

  return (
    <section
      id="ai-stack"
      ref={ref}
      className="relative py-24 md:py-32 overflow-hidden border-t"
      style={{ backgroundColor: "#0a0c11", borderColor: "rgba(30,34,41,0.8)" }}
    >
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/4 w-[500px] h-[500px] rounded-full blur-[150px]"
          style={{ background: "rgba(139,92,246,0.04)", transform: "translate(-50%,-50%)" }} />
        <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] rounded-full blur-[130px]"
          style={{ background: "rgba(255,107,43,0.04)" }} />
      </div>

      {/* Dot grid */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }}
          className="mb-14"
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <span className="text-xs font-poppins text-primary uppercase tracking-[0.3em] font-bold block mb-3">
                Arsenal Tecnológico · IA
              </span>
              <h2 className="text-4xl md:text-6xl font-sora leading-tight" style={{ color: "#f0ede8" }}>
                Las herramientas con las
                <br />
                <span className="aurora-text">que construyo el futuro</span>
              </h2>
            </div>
            <a
              href="#ai-terminal"
              className="hidden md:flex items-center gap-2 text-xs font-poppins uppercase tracking-widest px-5 py-2.5 rounded-full transition-all hover:scale-105"
              style={{ color: "#FF6B2B", border: "1px solid rgba(255,107,43,0.25)", background: "rgba(255,107,43,0.06)" }}
            >
              Ver en acción <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </motion.div>

        {/* Group filter */}
        <div className="flex flex-wrap gap-2 mb-10">
          <button
            onClick={() => setActiveGroup(null)}
            className="px-4 py-2 rounded-full text-[11px] font-poppins uppercase tracking-wider transition-all"
            style={{
              background: !activeGroup ? "rgba(255,107,43,0.15)" : "rgba(255,255,255,0.03)",
              border: `1px solid ${!activeGroup ? "rgba(255,107,43,0.4)" : "rgba(255,255,255,0.06)"}`,
              color: !activeGroup ? "#FF6B2B" : "rgba(255,255,255,0.4)",
            }}
          >
            Todo el arsenal
          </button>
          {AI_STACK.map((g) => (
            <button
              key={g.group}
              onClick={() => setActiveGroup(activeGroup === g.group ? null : g.group)}
              className="px-4 py-2 rounded-full text-[11px] font-poppins uppercase tracking-wider transition-all"
              style={{
                background: activeGroup === g.group ? `${g.color}15` : "rgba(255,255,255,0.03)",
                border: `1px solid ${activeGroup === g.group ? `${g.color}40` : "rgba(255,255,255,0.06)"}`,
                color: activeGroup === g.group ? g.color : "rgba(255,255,255,0.4)",
              }}
            >
              {g.group}
            </button>
          ))}
        </div>

        {/* Stack grid */}
        <div className="space-y-12">
          {filtered.map((group) => (
            <div key={group.group}>
              {/* Group label */}
              <div className="flex items-center gap-3 mb-5">
                <div className="h-px flex-1" style={{ background: `linear-gradient(90deg, ${group.color}40, transparent)` }} />
                <span className="text-[10px] font-poppins uppercase tracking-widest font-bold" style={{ color: group.color }}>
                  {group.group}
                </span>
                <div className="h-px flex-1" style={{ background: `linear-gradient(90deg, transparent, ${group.color}40)` }} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {group.tools.map((tool, i) => (
                  <ToolCard key={tool.name} tool={tool} groupColor={group.color} index={i} />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom stat */}
        <motion.div
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          className="mt-16 p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4"
          style={{ background: "rgba(255,107,43,0.05)", border: "1px solid rgba(255,107,43,0.15)" }}
        >
          <p className="font-sora text-lg text-center md:text-left" style={{ color: "#f0ede8" }}>
            <span className="aurora-text font-bold">12+ herramientas IA</span> dominadas · deployadas en producción para clientes reales
          </p>
          <a
            href="https://wa.me/573229132643?text=Hola%20Ivan%2C%20quiero%20saber%20qu%C3%A9%20herramientas%20de%20IA%20aplicar%20a%20mi%20negocio."
            target="_blank" rel="noreferrer"
            className="flex-shrink-0 px-6 py-3 rounded-full bg-primary text-black font-sora font-bold text-sm uppercase tracking-wider hover:brightness-110 hover:scale-105 active:scale-95 transition-all whitespace-nowrap"
          >
            ¿Cuál necesitas? →
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default AIStackSection;
