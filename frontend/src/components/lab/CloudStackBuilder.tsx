import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cloud, Database, Shield, Globe, Box, Cpu, Zap, Layers, Lock } from "lucide-react";

/**
 * CloudStackBuilder — selecciona necesidades, recibe arquitectura cloud
 * ───────────────────────────────────────────────────────────────────
 * Heurística simple basada en características; genera diagrama animado.
 */

type Need = "users" | "realtime" | "data-heavy" | "global" | "compliance" | "ai";

const NEEDS: { id: Need; label: string; description: string; icon: React.ReactNode }[] = [
  { id: "users",     label: "100K+ usuarios",     description: "Tráfico masivo concurrente", icon: <Globe className="w-4 h-4" /> },
  { id: "realtime",  label: "Tiempo real",         description: "WebSockets, chat, juegos", icon: <Zap className="w-4 h-4" /> },
  { id: "data-heavy",label: "Datos pesados",       description: "TBs de almacenamiento", icon: <Database className="w-4 h-4" /> },
  { id: "global",    label: "Multi-región",        description: "Latencia baja en todo el mundo", icon: <Cloud className="w-4 h-4" /> },
  { id: "compliance",label: "Datos sensibles",     description: "PCI / HIPAA / SOC 2", icon: <Shield className="w-4 h-4" /> },
  { id: "ai",        label: "IA / ML inference",   description: "GPU on-demand, modelos LLM", icon: <Cpu className="w-4 h-4" /> },
];

interface StackBlock {
  layer: "edge" | "compute" | "data" | "security" | "ai";
  name: string;
  vendor: string;
  reason: string;
  icon: React.ReactNode;
}

function buildStack(needs: Set<Need>): StackBlock[] {
  const stack: StackBlock[] = [];

  // EDGE / CDN
  if (needs.has("global") || needs.has("users")) {
    stack.push({ layer: "edge", name: "CDN + Edge", vendor: "Cloudflare", reason: "Caching global y DDoS L7", icon: <Globe className="w-4 h-4" /> });
  } else {
    stack.push({ layer: "edge", name: "CDN", vendor: "Vercel Edge", reason: "Distribución mundial sencilla", icon: <Globe className="w-4 h-4" /> });
  }

  // COMPUTE
  if (needs.has("realtime")) {
    stack.push({ layer: "compute", name: "Compute (long-lived)", vendor: "Fly.io / Railway", reason: "WebSockets persistentes", icon: <Box className="w-4 h-4" /> });
  } else if (needs.has("users")) {
    stack.push({ layer: "compute", name: "Compute serverless", vendor: "AWS Lambda + API GW", reason: "Escalado automático sin ops", icon: <Box className="w-4 h-4" /> });
  } else {
    stack.push({ layer: "compute", name: "Compute", vendor: "Vercel Functions", reason: "Despliegue inmediato", icon: <Box className="w-4 h-4" /> });
  }

  // DATABASE
  if (needs.has("data-heavy") && needs.has("global")) {
    stack.push({ layer: "data", name: "Database", vendor: "PlanetScale (MySQL)", reason: "Multi-región sin sharding manual", icon: <Database className="w-4 h-4" /> });
  } else if (needs.has("realtime")) {
    stack.push({ layer: "data", name: "Database", vendor: "Supabase (Postgres)", reason: "Postgres + realtime channels", icon: <Database className="w-4 h-4" /> });
  } else {
    stack.push({ layer: "data", name: "Database", vendor: "Neon (Postgres serverless)", reason: "Pague por uso, branches", icon: <Database className="w-4 h-4" /> });
  }

  // STORAGE
  if (needs.has("data-heavy")) {
    stack.push({ layer: "data", name: "Object storage", vendor: "AWS S3 + CloudFront", reason: "TBs económicos, lifecycle policies", icon: <Layers className="w-4 h-4" /> });
  }

  // AI / ML
  if (needs.has("ai")) {
    stack.push({ layer: "ai", name: "LLM inference", vendor: "Groq + Gemini fallback", reason: "Sub-200ms · costo controlado", icon: <Cpu className="w-4 h-4" /> });
    stack.push({ layer: "ai", name: "Vector DB",     vendor: "Pinecone / Chroma",     reason: "RAG y semantic search",        icon: <Cpu className="w-4 h-4" /> });
  }

  // SECURITY
  if (needs.has("compliance")) {
    stack.push({ layer: "security", name: "Auth + Audit", vendor: "Auth0 / Clerk", reason: "SOC 2 Type II ready", icon: <Lock className="w-4 h-4" /> });
    stack.push({ layer: "security", name: "Secrets mgmt", vendor: "Doppler / AWS KMS", reason: "Rotación automática", icon: <Shield className="w-4 h-4" /> });
  }

  return stack;
}

const LAYER_META: Record<string, { color: string; label: string }> = {
  edge:     { color: "#60a5fa", label: "Edge / CDN" },
  compute:  { color: "#C7D2FE", label: "Compute" },
  data:     { color: "#a78bfa", label: "Data" },
  ai:       { color: "#34d399", label: "IA / ML" },
  security: { color: "#fbbf24", label: "Security" },
};

const CloudStackBuilder = () => {
  const [selected, setSelected] = useState<Set<Need>>(new Set(["users", "ai"]));
  const stack = useMemo(() => buildStack(selected), [selected]);

  const toggle = (n: Need) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(n)) next.delete(n);
      else next.add(n);
      return next;
    });
  };

  const grouped = useMemo(() => {
    const g: Record<string, StackBlock[]> = {};
    stack.forEach((b) => {
      if (!g[b.layer]) g[b.layer] = [];
      g[b.layer].push(b);
    });
    return g;
  }, [stack]);

  return (
    <div className="relative">
      <div className="mb-4">
        <p className="font-poppins text-[11px] uppercase tracking-[0.3em] text-[#C7D2FE]/70 mb-1">
          Cloud architecture lab
        </p>
        <h4 className="font-sora text-2xl md:text-3xl text-white font-semibold">Constructor de stack</h4>
        <p className="font-poppins text-sm text-white/50 mt-1">
          Selecciona las necesidades de tu producto y recibe una arquitectura cloud recomendada al instante.
        </p>
      </div>

      {/* Needs picker */}
      <div className="flex flex-wrap gap-2 mb-6">
        {NEEDS.map((n) => {
          const active = selected.has(n.id);
          return (
            <button
              key={n.id}
              onClick={() => toggle(n.id)}
              className="group inline-flex items-center gap-2 px-3.5 py-2 rounded-full font-poppins text-xs transition-all"
              style={{
                background: active ? "rgba(199,210,254,0.14)" : "rgba(255,255,255,0.025)",
                border: `1px solid ${active ? "rgba(199,210,254,0.50)" : "rgba(255,255,255,0.10)"}`,
                color: active ? "#C7D2FE" : "rgba(255,255,255,0.65)",
              }}
            >
              <span style={{ color: active ? "#C7D2FE" : "rgba(255,255,255,0.45)" }}>{n.icon}</span>
              {n.label}
            </button>
          );
        })}
      </div>

      {/* Architecture diagram */}
      <div className="rounded-2xl border border-[#C7D2FE]/12 bg-black/35 p-5 md:p-6 min-h-[340px]">
        <AnimatePresence mode="popLayout">
          {Object.entries(grouped).map(([layer, blocks]) => {
            const meta = LAYER_META[layer];
            return (
              <motion.div
                key={layer}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35 }}
                className="mb-5 last:mb-0"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: meta.color }} />
                  <p className="font-poppins text-[10px] uppercase tracking-[0.3em]" style={{ color: meta.color }}>{meta.label}</p>
                  <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg, ${meta.color}33, transparent)` }} />
                </div>
                <div className="flex flex-wrap gap-2">
                  {blocks.map((b, i) => (
                    <motion.div
                      key={`${b.vendor}-${i}`}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.04 }}
                      className="px-4 py-2.5 rounded-xl flex items-center gap-3"
                      style={{
                        background: "rgba(255,255,255,0.025)",
                        border: `1px solid ${meta.color}33`,
                      }}
                    >
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${meta.color}1f`, color: meta.color }}>
                        {b.icon}
                      </div>
                      <div>
                        <p className="font-sora text-sm text-white font-medium leading-tight">{b.vendor}</p>
                        <p className="font-poppins text-[11px] text-white/45 leading-tight mt-0.5">{b.reason}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        {stack.length === 0 && (
          <p className="text-sm text-white/40 font-poppins text-center py-12">
            Selecciona al menos una necesidad para ver la arquitectura recomendada.
          </p>
        )}
      </div>
    </div>
  );
};

export default CloudStackBuilder;
