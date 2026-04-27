import { useState } from "react";
import { motion } from "framer-motion";
import { FlipFlow } from "@/components/ui/flipflow";

// ─── IAZR Full tech stack for FlipFlow ───────────────────────────────────────
const iazrStack = [
  { name: "React" }, { name: "Python" }, { name: "LangChain" },
  { name: "Node.js" }, { name: "AWS" }, { name: "Gemini AI" },
  { name: "n8n" }, { name: "Postgres" }, { name: "Linux" },
  { name: "Next.js" }, { name: "Docker" }, { name: "GPT-4o" },
];

// ─── AI Stack groups (from AIStackSection) ───────────────────────────────────
const groups = [
  {
    label: "Modelos de Lenguaje",
    color: "#8B5CF6",
    tools: [
      { name: "GPT-4o", logo: "⊛", color: "#10a37f", mastery: 95, desc: "Agentes, RAG y completions avanzadas" },
      { name: "Gemini 2.5", logo: "✦", color: "#4285F4", mastery: 92, desc: "Multimodal: texto, código e imagen" },
      { name: "Claude 3.5", logo: "◆", color: "#C87137", mastery: 80, desc: "Razonamiento y análisis de documentos" },
      { name: "Llama 3", logo: "◈", color: "#F97316", mastery: 78, desc: "Despliegue on-premise y fine-tuning" },
    ],
  },
  {
    label: "Frameworks & Orquestación",
    color: "#FFFFFF",
    tools: [
      { name: "LangChain", logo: "⬡", color: "#1C7C54", mastery: 96, desc: "Chains, agents y memory management" },
      { name: "n8n", logo: "⟂", color: "#EA4B71", mastery: 94, desc: "Flujos low-code + webhooks" },
      { name: "LlamaIndex", logo: "▲", color: "#F59E0B", mastery: 85, desc: "Indexing y retrieval semántico" },
      { name: "CrewAI", logo: "⚙", color: "#EF4444", mastery: 82, desc: "Equipos de agentes autónomos" },
    ],
  },
  {
    label: "Infraestructura IA",
    color: "#22c55e",
    tools: [
      { name: "Pinecone", logo: "◉", color: "#00C9B1", mastery: 88, desc: "Embeddings y búsqueda semántica" },
      { name: "HuggingFace", logo: "🤗", color: "#FFD21E", mastery: 84, desc: "Fine-tuning y model hub" },
      { name: "AWS Bedrock", logo: "▣", color: "#FF9900", mastery: 80, desc: "Foundation Models en producción" },
      { name: "Vertex AI", logo: "⬤", color: "#4285F4", mastery: 75, desc: "MLOps + Gemini en GCP" },
    ],
  },
];

const certifications = [
  { name: "Google Cloud Developer", color: "#4285F4" },
  { name: "Microsoft Azure AI", color: "#0078D4" },
  { name: "Huawei ICT Academy", color: "#CF0A2C" },
  { name: "UNIR España — IA", color: "#E11D48" },
  { name: "Meta — React Advanced", color: "#0866FF" },
  { name: "DeepLearning.AI", color: "#FF6B6B" },
];

const MasteryBar = ({ pct, color }: { pct: number; color: string }) => (
  <div className="w-full h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
    <motion.div
      className="h-full rounded-full"
      style={{ background: color }}
      initial={{ width: 0 }}
      whileInView={{ width: `${pct}%` }}
      viewport={{ once: true }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
    />
  </div>
);

const SkillsSection = () => {
  const [activeGroup, setActiveGroup] = useState(0);

  return (
    <section
      id="skills"
      className="relative py-24 md:py-32 overflow-hidden border-t border-white/5"
      style={{ background: "linear-gradient(180deg, #050811 0%, #060912 100%)" }}
    >
      {/* Ambient */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 50% 40% at 50% 0%, rgba(255,255,255,0.05), transparent)" }} />

      <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16 relative z-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="text-xs font-poppins uppercase tracking-[0.3em] font-bold block mb-4"
            style={{ color: "var(--primary-color)" }}>
            Stack Técnico
          </span>
          <h2 className="text-4xl md:text-6xl font-sora text-white leading-none">
            Ecosistema de{" "}
            <span className="font-display italic" style={{ color: "#8a857c", fontWeight: 300 }}>herramientas</span>
          </h2>
          <p className="mt-4 text-white/35 font-poppins text-sm max-w-xl mx-auto">
            Pasa el cursor sobre las tarjetas · Selecciona un grupo para ver el detalle
          </p>
        </motion.div>

        {/* FlipFlow — full width showcase */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mb-16"
        >
          <FlipFlow data={iazrStack} />
        </motion.div>

        {/* Group tabs */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {groups.map((g, i) => (
            <button
              key={i}
              onClick={() => setActiveGroup(i)}
              className="px-5 py-2.5 rounded-full text-xs font-poppins font-bold uppercase tracking-wider transition-all duration-200"
              style={{
                background: activeGroup === i ? `${g.color}18` : "rgba(255,255,255,0.03)",
                border: `1px solid ${activeGroup === i ? g.color + "50" : "rgba(255,255,255,0.07)"}`,
                color: activeGroup === i ? g.color : "rgba(240,237,232,0.35)",
              }}
            >
              {g.label}
            </button>
          ))}
        </div>

        {/* Tool cards grid */}
        <motion.div
          key={activeGroup}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-16"
        >
          {groups[activeGroup].tools.map((tool, i) => (
            <motion.div
              key={tool.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              whileHover={{ y: -5 }}
              className="relative p-5 rounded-2xl border overflow-hidden group cursor-default"
              style={{ background: "rgba(255,255,255,0.025)", borderColor: "rgba(255,255,255,0.07)" }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = tool.color + "40")}
              onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)")}
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400"
                style={{ background: `radial-gradient(circle at 50% 0%, ${tool.color}08, transparent 70%)` }} />
              <div className="flex items-center gap-3 mb-4 relative z-10">
                <span className="text-2xl leading-none" style={{ color: tool.color }}>{tool.logo}</span>
                <span className="font-sora font-bold text-white text-sm">{tool.name}</span>
                <span className="ml-auto text-xs font-poppins font-bold" style={{ color: tool.color }}>{tool.mastery}%</span>
              </div>
              <MasteryBar pct={tool.mastery} color={tool.color} />
              <p className="text-xs font-poppins mt-3 leading-relaxed relative z-10" style={{ color: "rgba(240,237,232,0.4)" }}>
                {tool.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Certifications */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-[10px] font-poppins uppercase tracking-[0.3em] text-white/25 font-bold text-center mb-6">
            Certificaciones Destacadas
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {certifications.map((cert, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                whileHover={{ y: -3 }}
                className="p-4 rounded-2xl border text-center transition-all duration-300 cursor-default group"
                style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.07)" }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = cert.color + "40")}
                onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)")}
              >
                <div className="w-2 h-2 rounded-full mx-auto mb-3 group-hover:scale-150 transition-transform duration-300"
                  style={{ background: cert.color }} />
                <p className="text-xs font-poppins leading-tight" style={{ color: "rgba(240,237,232,0.55)" }}>
                  {cert.name}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default SkillsSection;
