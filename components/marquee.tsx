import { cn } from "@/lib/utils";
import type { StackItem } from "@/lib/data/stack";

/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  MARQUEE — Marquesina de movimiento continuo (Magic UI, versión Server).
 *
 *  La animación es 100% CSS (keyframes `marquee`/`marquee-reverse` declarados
 *  en globals.css): el navegador compone el desplazamiento en el compositor,
 *  sin JavaScript ni frames por segundo → costo de hidratación CERO.
 *
 *  · El track duplica los ítems exactamente una vez y traduce -50%: el loop
 *    es perfectamente continuo (el punto -50% cae entre las dos mitades).
 *  · `--marquee-duration` se inyecta como variable CSS para variar la
 *    velocidad por instancia sin duplicar keyframes.
 *  · `mask-fade-x` desvanece los extremos (utilidad custom de globals.css).
 *
 *  Server Component puro: se pre-renderiza en el cascarón PPR.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export function Marquee({
  items,
  reverse = false,
  className,
  duration = 42,
}: {
  items: StackItem[];
  reverse?: boolean;
  className?: string;
  duration?: number;
}) {
  // Duplicación exacta para el bucle infinito sin salto visible.
  const track = [...items, ...items];

  return (
    <div className={cn("mask-fade-x overflow-hidden", className)}>
      <div
        className={cn(
          "flex w-max items-center gap-4",
          reverse ? "animate-marquee-reverse" : "animate-marquee"
        )}
        style={{ "--marquee-duration": `${duration}s` } as React.CSSProperties}
      >
        {track.map((item, i) => (
          <span key={`${item.name}-${i}`} className="flex items-center gap-4">
            <span className="font-mono text-sm tracking-tight text-muted-foreground transition-colors hover:text-primary sm:text-base">
              {item.name}
            </span>
            {/* Separador técnico entre ítems */}
            <span aria-hidden="true" className="text-[10px] text-primary/50">
              ✦
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
