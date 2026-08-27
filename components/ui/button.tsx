import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  BUTTON — Shadcn UI (estándar 2026, compatible con Tailwind v4).
 *
 *  Patrón v4: sin forwardRef (React 19 pasa ref por props) y con atributo
 *  `data-slot` para un estilizado ergonómico vía selectores de datos.
 *  `asChild` (Radix Slot) permite renderizar el botón como <a> sin romper
 *  la semántica de anclas del Lenis scroll.
 *  Variante `cyber`: identidad del portafolio (borde degradado animado).
 * ─────────────────────────────────────────────────────────────────────────────
 */

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all outline-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 hover:shadow-md",
        destructive:
          "bg-destructive text-destructive-foreground shadow-xs hover:bg-destructive/90",
        outline:
          "border border-border bg-transparent shadow-xs hover:bg-secondary/60 hover:border-primary/40",
        secondary:
          "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
        ghost: "hover:bg-secondary/60 hover:text-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        /** Variante de marca IAZR: borde degradado cian → violeta animado. */
        cyber:
          "border-gradient-cyber text-foreground shadow-[0_0_24px_-8px_color-mix(in_oklch,var(--primary)_60%,transparent)] hover:shadow-[0_0_34px_-6px_color-mix(in_oklch,var(--primary)_80%,transparent)]",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 gap-1.5 rounded-md px-3 text-xs",
        lg: "h-11 rounded-md px-6 text-base",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
