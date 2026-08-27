"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import posthog from "posthog-js";

/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  POSTHOG PAGE VIEW — Emisión manual de `$pageview`.
 *
 *  Con `capture_pageview: false` en la init, este componente es la ÚNICA
 *  fuente de pageviews: captura el evento en el montaje y en cada cambio de
 *  ruta (SPA) con la URL absoluta completa (origin + pathname + query).
 *  El provider (módulo de la raíz) ya inicializó posthog antes de que corra
 *  este efecto → sin colas ni eventos perdidos.
 * ─────────────────────────────────────────────────────────────────────────────
 */

const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;

export function PostHogPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!POSTHOG_KEY || !pathname) return;

    const url =
      window.origin +
      pathname +
      (searchParams.toString() ? `?${searchParams.toString()}` : "");

    posthog.capture("$pageview", { $current_url: url });
  }, [pathname, searchParams]);

  return null;
}
