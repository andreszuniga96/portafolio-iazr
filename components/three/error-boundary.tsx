"use client";

import { Component, type ReactNode } from "react";

/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  ERROR BOUNDARY — Programación defensiva 3D.
 *  Captura errores de render dentro del lienzo R3F (por ejemplo, un activo
 *  GLTF que falla al decodificar o una malla corrupta) y conmuta a un respaldo
 *  de escena en lugar de tumbar el árbol de React completo.
 * ─────────────────────────────────────────────────────────────────────────────
 */
type Props = {
  /** Escena/respaldo que se renderiza si un hijo lanza un error. */
  fallback: ReactNode;
  children: ReactNode;
};

type State = {
  hasError: boolean;
};

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: unknown): void {
    // El respaldo visual ya está servido; registramos la causa para telemetría
    // sin interrumpir la experiencia (fail-closed, no fail-loud).
    console.error("[IAZR·3D] Escena degradada al respaldo:", error);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}
