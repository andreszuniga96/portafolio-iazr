"use client";

import { useEffect, type ReactNode } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import Lenis from "lenis";

/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  PROVIDERS — Capa de proveedores de la raíz (Client Components).
 *
 *  · NextThemesProvider (next-themes): gestiona el modo claro/oscuro con la
 *    clase `.dark` en <html> (los tokens OKLCH de globals.css reaccionan al
 *    toggle sin reconstruir CSS).
 *  · Lenis: smooth scrolling lineal sobre el scroll NATIVO (no virtualiza el
 *    DOM). Con `anchors: true` las anclas (#proyectos, #contacto) se resuelven
 *    con interpolación lineal de cámara. `autoRaf` conecta el bucle de
 *    requestAnimationFrame internamente (cero trabajo cuando no hay scroll).
 *
 *  Los Server Components del árbol se pasan como `children` a este wrapper
 *  client: React los serializa en el servidor y los hidrata intactos.
 * ─────────────────────────────────────────────────────────────────────────────
 */

function LenisProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    // Un solo Lenis por documento; se destruye al desmontar (Strict Mode safe).
    const lenis = new Lenis({
      autoRaf: true,
      anchors: true,
      // Duración de la interpolación (ms) — cinematográfica pero sin lentitud.
      duration: 1.1,
      // Suavizado sensitivo al dispositivo de entrada (rueda vs trackpad).
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
    });

    return () => {
      lenis.destroy();
    };
  }, []);

  return children;
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <LenisProvider>{children}</LenisProvider>
    </NextThemesProvider>
  );
}
