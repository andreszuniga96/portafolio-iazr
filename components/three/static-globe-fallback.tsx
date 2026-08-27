import { cn } from "@/lib/utils";

/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  STATIC GLOBE FALLBACK — Respaldo estático elegante (Server-safe).
 *  Puro SVG/CSS: sin JavaScript, sin WebGL, cero coste de hidratación.
 *  Se usa en tres situaciones defensivas:
 *   1. SSR inicial: se sirve en el HTML hasta que el chunk de three.js hidrata.
 *   2. Sin soporte WebGL (GPU ausente/bloqueada).
 *   3. Pérdida de contexto WebGL ('webglcontextlost') por presión de GPU móvil.
 *  El `aspect-ratio` del contenedor padre queda reservado → CLS ≈ 0.
 * ─────────────────────────────────────────────────────────────────────────────
 */
export function StaticGlobeFallback({
  label = "Red neuronal global de IAZR",
  className,
}: {
  label?: string;
  className?: string;
}) {
  return (
    <div
      role="img"
      aria-label={label}
      className={cn("relative flex h-full w-full items-center justify-center overflow-hidden", className)}
    >
      {/* Halo bioluminiscente frío (CSS puro, compositor) */}
      <div
        aria-hidden="true"
        className="absolute size-[min(75%,380px)] animate-pulse-glow rounded-full"
        style={{
          background:
            "radial-gradient(circle, color-mix(in oklch, var(--primary) 20%, transparent), transparent 72%)",
        }}
      />

      <svg
        viewBox="0 0 400 400"
        aria-hidden="true"
        className="relative h-[min(72%,360px)] w-auto text-primary"
        fill="none"
      >
        {/* Esfera base */}
        <circle cx="200" cy="200" r="150" fill="url(#globe-core)" stroke="currentColor" strokeOpacity="0.28" strokeWidth="1" />
        {/* Meridianos */}
        <ellipse cx="200" cy="200" rx="150" ry="62" stroke="currentColor" strokeOpacity="0.16" strokeWidth="1" />
        <ellipse cx="200" cy="200" rx="150" ry="24" stroke="currentColor" strokeOpacity="0.1" strokeWidth="1" />
        <line x1="50" y1="200" x2="350" y2="200" stroke="currentColor" strokeOpacity="0.16" strokeWidth="1" />
        {/* Arcos de conexión (red neuronal) */}
        <path d="M90 120 C 150 60, 260 80, 320 150" stroke="currentColor" strokeOpacity="0.35" strokeWidth="1.2" strokeDasharray="4 5" />
        <path d="M80 250 C 150 320, 280 300, 330 240" stroke="currentColor" strokeOpacity="0.25" strokeWidth="1.2" strokeDasharray="4 5" />
        <path d="M140 70 C 200 130, 240 290, 300 330" stroke="currentColor" strokeOpacity="0.18" strokeWidth="1.2" strokeDasharray="4 5" />
        {/* Nodos */}
        <circle cx="90" cy="120" r="3" fill="currentColor" opacity="0.9" />
        <circle cx="320" cy="150" r="3" fill="currentColor" opacity="0.9" />
        <circle cx="80" cy="250" r="3" fill="currentColor" opacity="0.8" />
        <circle cx="330" cy="240" r="3" fill="currentColor" opacity="0.8" />
        <circle cx="140" cy="70" r="3" fill="currentColor" opacity="0.8" />
        <circle cx="300" cy="330" r="3" fill="currentColor" opacity="0.8" />
        <circle cx="200" cy="200" r="3.5" fill="currentColor" opacity="1" />
        {/* Anillos orbitales */}
        <circle cx="200" cy="200" r="180" stroke="currentColor" strokeOpacity="0.12" strokeWidth="1" strokeDasharray="2 8" />
        <circle cx="200" cy="200" r="205" stroke="currentColor" strokeOpacity="0.07" strokeWidth="1" strokeDasharray="1 10" />
        {/* Degradados */}
        <defs>
          <radialGradient id="globe-core" cx="38%" cy="32%" r="75%">
            <stop offset="0%" stopColor="#121616" />
            <stop offset="100%" stopColor="#050607" />
          </radialGradient>
        </defs>
      </svg>
    </div>
  );
}
