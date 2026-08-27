"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Menu, Moon, Sun, X } from "lucide-react";

import { siteConfig } from "@/lib/data/site";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { GitHubIcon } from "@/components/icons";

/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  NAVBAR — Navegación sticky con retroalimentación de scroll.
 *  Client Component: requiere listeners de scroll y estado del menú móvil.
 *  · Fondo translúcido + blur solo tras desplazarse (sin degradar el hero).
 *  · Toggle de tema claro/oscuro (next-themes) sobre la paleta OKLCH.
 *  · Las anclas se resuelven suavemente gracias a Lenis (anchors: true).
 * ─────────────────────────────────────────────────────────────────────────────
 */

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  // Ruta actual (App Router): alimenta el estado "activo" de la navegación.
  const pathname = usePathname();

  /**
   * Estado activo por ítem:
   *  · "/about"  → activo solo en la ruta /about.
   *  · "#inicio" → activo en la portada (estás en el inicio).
   *  · El resto de anclas (#capacidades, #proyectos…) requeriría un
   *    scroll-spy; no se marcan para no pintar todo el menú activo en la home.
   */
  const isActive = (href: string) => {
    if (href === "/about") return pathname === "/about";
    if (href === "#inicio") return pathname === "/";
    return false;
  };

  /**
   * Resolución de anclas entre páginas: en la portada se dejan como "#seccion"
   * para que Lenis (anchors: true) haga el smooth scroll; fuera de ella se
   * antepone "/" para que la ancla navegue a la sección de la portada.
   */
  const resolveHref = (href: string) =>
    href.startsWith("#") && pathname !== "/" ? `/${href}` : href;

  // Evita destello de icono equivocado durante la hidratación de next-themes:
  // el tema real solo se conoce tras montar en el cliente.
  useEffect(() => setMounted(true), []);

  // Activa el fondo del navbar solo al superar ~24px de scroll.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      data-slot="navbar"
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled || open
          ? "border-b border-border/70 bg-background/80 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      )}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        {/* Marca — Sora 700 (solidez geométrica de la identidad) */}
        <a
          href="/#inicio"
          className="font-display text-lg font-bold tracking-tight text-foreground"
        >
          IAZR
          <span className="caret-blink ml-0.5 text-primary">_</span>
        </a>

        {/* Enlaces de escritorio — Sora 500 (navegación per la especificación) */}
        <div className="hidden items-center gap-7 md:flex">
          {siteConfig.nav.map((item) => {
            const active = isActive(item.href);
            return (
              <a
                key={item.href}
                href={resolveHref(item.href)}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative font-display text-sm font-medium transition-colors hover:text-primary",
                  active ? "text-primary" : "text-muted-foreground",
                  // Subrayado luminoso bajo el ítem activo
                  active &&
                    "after:absolute after:-bottom-1 after:left-0 after:h-px after:w-full after:bg-primary after:shadow-[0_0_6px_var(--primary)]"
                )}
              >
                {item.label}
              </a>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          {/* Toggle de tema claro/oscuro */}
          <button
            type="button"
            aria-label="Cambiar tema"
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            className="inline-flex size-9 items-center justify-center rounded-md border border-border/70 text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
          >
            {mounted && resolvedTheme === "dark" ? (
              <Sun className="size-4" />
            ) : (
              <Moon className="size-4" />
            )}
          </button>

          <Button asChild className="hidden md:inline-flex" size="sm">
            <a href="#contacto">Auditoría</a>
          </Button>

          {/* Botón de menú móvil */}
          <button
            type="button"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="inline-flex size-9 items-center justify-center rounded-md border border-border/70 text-foreground md:hidden"
          >
            {open ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </nav>

      {/* Menú móvil desplegable */}
      {open ? (
        <div className="border-t border-border/70 bg-background/95 px-6 py-4 backdrop-blur-md md:hidden">
          <div className="flex flex-col gap-3">
            {siteConfig.nav.map((item) => {
              const active = isActive(item.href);
              return (
                <a
                  key={item.href}
                  href={resolveHref(item.href)}
                  onClick={() => setOpen(false)}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "py-1 font-display text-sm font-medium transition-colors hover:text-primary",
                    active ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  {item.label}
                </a>
              );
            })}
            <a
              href={siteConfig.author.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 py-1 text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              <GitHubIcon className="size-4" />
              GitHub / andreszuniga96
            </a>
          </div>
        </div>
      ) : null}
    </header>
  );
}
