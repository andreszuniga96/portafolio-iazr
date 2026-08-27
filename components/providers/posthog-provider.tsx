"use client";

import type { ReactNode } from "react";
import posthog from "posthog-js";

/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  POSTHOG PROVIDER — Telemetría de cliente (funnel visita → envío).
 *
 *  Inicializa posthog-js con la Project API Key pública
 *  (`NEXT_PUBLIC_POSTHOG_KEY`, prefijo `phc_` — diseñada para viajar en el
 *  bundle del cliente; es la misma clave que usa el servidor en trackLead).
 *
 *  Privacidad (sin PII):
 *  · `autocapture: false` — NO se capturan clicks ni valores de inputs.
 *  · `capture_pageview: false` — los pageviews se emiten manualmente desde
 *    PostHogPageView (cero duplicados).
 *  · `person_profiles: "identified_only"` — solo se crean personas cuando el
 *    formulario identifica al visitante con el hash SHA-256 de su correo.
 *  · `disable_session_recording: true` — sin grabación de sesión.
 *
 *  La inicialización ocurre en el ámbito de MÓDULO (guard SSR): cualquier
 *  captura posterior (pageviews, identify del formulario) ya encuentra la lib
 *  lista, sin depender del orden de efectos de React (hijos antes que padres).
 * ─────────────────────────────────────────────────────────────────────────────
 */

const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const POSTHOG_HOST =
  process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com";

if (typeof window !== "undefined" && POSTHOG_KEY) {
  posthog.init(POSTHOG_KEY, {
    api_host: POSTHOG_HOST,
    autocapture: false,
    capture_pageview: false,
    disable_session_recording: true,
    person_profiles: "identified_only",
  });
}

export function PostHogProvider({ children }: { children: ReactNode }) {
  return children;
}
