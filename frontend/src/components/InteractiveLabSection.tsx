import { useState, lazy, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Cloud, Coins, BarChart3 } from "lucide-react";

const LiveThreatMap     = lazy(() => import("./lab/LiveThreatMap"));
const CloudStackBuilder = lazy(() => import("./lab/CloudStackBuilder"));
const BlockchainPulse   = lazy(() => import("./lab/BlockchainPulse"));
const DataSentimentLab  = lazy(() => import("./lab/DataSentimentLab"));

type Tab = "threat" | "cloud" | "chain" | "sentiment";

const TABS: { id: Tab; label: string; sub: string; icon: React.ReactNode }[] = [
  { id: "threat",    label: "Threat Map",      sub: "Ciberseguridad",     icon: <Shield className="w-4 h-4" /> },
  { id: "cloud",     label: "Cloud Builder",   sub: "Arquitectura cloud", icon: <Cloud className="w-4 h-4" /> },
  { id: "chain",     label: "Blockchain Pulse",sub: "Polygon en vivo",    icon: <Coins className="w-4 h-4" /> },
  { id: "sentiment", label: "Sentiment Lab",   sub: "Análisis de datos",  icon: <BarChart3 className="w-4 h-4" /> },
];

const InteractiveLabSection = () => {
  const [tab, setTab] = useState<Tab>("chain");

  return (
    <section id="lab" className="relative py-24 md:py-32 overflow-hidden">
      <div className="max-w-[1240px] mx-auto px-6 md:px-10 lg:px-16 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4" style={{ background: "rgba(199,210,254,0.06)", border: "1px solid rgba(199,210,254,0.20)" }}>
            <span className="w-1.5 h-1.5 rounded-full bg-[#C7D2FE] animate-pulse" />
            <span className="font-poppins text-[10px] uppercase tracking-[0.3em] text-[#C7D2FE]">Live Lab · Interactivo</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-sora font-semibold leading-[1.05] text-white mb-5">
            No te lo cuento.{" "}
            <span className="font-display italic font-light text-[#C7D2FE]">Te lo muestro funcionando.</span>
          </h2>
          <p className="font-poppins text-base md:text-lg text-white/55 leading-relaxed max-w-2xl">
            Cuatro demos en tiempo real con las tecnologías que entrego en proyectos reales:
            ciberseguridad, cloud, blockchain y análisis de datos. Tócalas, modifícalas, ve cómo responden.
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {TABS.map((t) => {
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className="group relative px-4 md:px-5 py-3 rounded-xl flex items-center gap-3 transition-all"
                style={{
                  background: active ? "rgba(199,210,254,0.10)" : "rgba(255,255,255,0.025)",
                  border: `1px solid ${active ? "rgba(199,210,254,0.45)" : "rgba(255,255,255,0.08)"}`,
                }}
              >
                <span
                  className="w-9 h-9 rounded-lg flex items-center justify-center"
                  style={{
                    background: active ? "rgba(199,210,254,0.15)" : "rgba(255,255,255,0.04)",
                    color: active ? "#C7D2FE" : "rgba(255,255,255,0.55)",
                  }}
                >
                  {t.icon}
                </span>
                <div className="text-left">
                  <p className="font-sora text-sm font-semibold leading-tight" style={{ color: active ? "#FFFFFF" : "rgba(255,255,255,0.85)" }}>
                    {t.label}
                  </p>
                  <p className="font-poppins text-[10px] uppercase tracking-[0.2em] mt-0.5" style={{ color: active ? "#C7D2FE" : "rgba(255,255,255,0.35)" }}>
                    {t.sub}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Active panel */}
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.35 }}
            >
              <Suspense fallback={
                <div className="w-full h-[420px] rounded-2xl border border-white/8 bg-black/40 flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full border-2 border-white/15 border-t-[#C7D2FE] animate-spin" />
                </div>
              }>
                {tab === "threat"    && <LiveThreatMap />}
                {tab === "cloud"     && <CloudStackBuilder />}
                {tab === "chain"     && <BlockchainPulse />}
                {tab === "sentiment" && <DataSentimentLab />}
              </Suspense>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default InteractiveLabSection;
