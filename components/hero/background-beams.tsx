/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  BACKGROUND BEAMS — Fondo volumétrico estilo Aceternity.
 *
 *  DECISIÓN DE RENDIMIENTO: la versión original de Aceternity anima un canvas
 *  con requestAnimationFrame (JS por frame). Aquí los haces son capas CSS
 *  con `--animate-beam-drift` (keyframes declarados en globals.css): el
 *  navegador los mueve en el COMPOSITOR (GPU), sin tocar el hilo principal →
 *  protege LCP e INP, que es el estándar Core Web Vitals del proyecto.
 *
 *  Composición:
 *   · Rejilla técnica sutil (utilidad custom `bg-grid`).
 *   · 4 haces de gradientes radiales (cian frío + violeta) con blur(80px),
 *     máscaras de desvanecimiento y deriva lenta en direcciones opuestas.
 *   · Halo de pulso bioluminiscente en el centro.
 *
 *  Server-safe: cero JavaScript, cero eventos, cero listeners.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export function BackgroundBeams() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      {/* Rejilla técnica base (blue-print) */}
      <div className="absolute inset-0 bg-grid opacity-[0.5] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,black,transparent)]" />

      {/* Velo ambiental superior (profundidad de campo) */}
      <div
        className="absolute inset-x-0 top-0 h-[40vh]"
        style={{
          background:
            "linear-gradient(to bottom, color-mix(in oklch, var(--background) 55%, transparent), transparent)",
        }}
      />

      {/* Haz 1 — cian eléctrico, entrada superior izquierda */}
      <div
        className="absolute -left-[10%] top-[-20%] h-[60vh] w-[45vw] animate-beam-drift rounded-full"
        style={{
          background:
            "radial-gradient(closest-side, color-mix(in oklch, var(--primary) 34%, transparent), transparent 72%)",
          filter: "blur(80px)",
          willChange: "transform",
        }}
      />

      {/* Haz 2 — violeta, entrada inferior derecha (dirección contraria) */}
      <div
        className="absolute -right-[12%] bottom-[-18%] h-[55vh] w-[40vw] animate-beam-drift rounded-full [animation-direction:reverse] [animation-delay:-8s]"
        style={{
          background:
            "radial-gradient(closest-side, color-mix(in oklch, var(--accent) 26%, transparent), transparent 70%)",
          filter: "blur(90px)",
          willChange: "transform",
        }}
      />

      {/* Haz 3 — cian tenue, lateral derecho medio */}
      <div
        className="absolute right-[8%] top-[8%] h-[38vh] w-[26vw] animate-beam-drift rounded-full [animation-delay:-4s]"
        style={{
          background:
            "radial-gradient(closest-side, color-mix(in oklch, var(--primary) 16%, transparent), transparent 70%)",
          filter: "blur(70px)",
          willChange: "transform",
        }}
      />

      {/* Halo central pulsante (respiración bioluminiscente) */}
      <div
        className="absolute left-1/2 top-[38%] size-[42vw] max-w-[560px] -translate-x-1/2 animate-pulse-glow rounded-full"
        style={{
          background:
            "radial-gradient(circle, color-mix(in oklch, var(--primary) 12%, transparent), transparent 70%)",
        }}
      />
    </div>
  );
}
