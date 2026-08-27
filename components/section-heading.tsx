import { cn } from "@/lib/utils";

/**
 * Encabezado de sección reutilizable — Server Component puro (sin DOM
 * manipulable): se pre-renderiza en el cascarón PPR.
 * · eyebrow: etiqueta técnica en mono con prefijo de terminal.
 * · title: título principal.
 * · description: soporte textual opcional.
 */

export function SectionHeading({
  eyebrow,
  title,
  description,
  className,
  align = "center",
}: {
  eyebrow: string;
  title: React.ReactNode;
  description?: string;
  className?: string;
  align?: "center" | "left";
}) {
  return (
    <div
      className={cn(
        "mb-14 flex flex-col gap-3",
        align === "center" && "items-center text-center",
        align === "left" && "items-start text-left",
        className
      )}
    >
      <p className="font-mono text-xs uppercase tracking-[0.35em] text-primary">
        <span className="text-muted-foreground">$</span> {eyebrow}
      </p>
      <h2 className="max-w-3xl text-balance text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
        {title}
      </h2>
      {description ? (
        <p className="max-w-2xl text-pretty leading-relaxed text-muted-foreground">
          {description}
        </p>
      ) : null}
    </div>
  );
}
