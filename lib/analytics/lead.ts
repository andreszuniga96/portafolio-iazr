/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  TELEMETRÍA DE CONVERSIÓN — PostHog (captura server-side por HTTP).
 *
 *  Registra cada lead válido del formulario de contacto como evento
 *  `lead_submitted` para medir conversión (plan gratuito: 1M eventos/mes).
 *  Mismo patrón que Resend en `app/actions/contact.ts`: fetch directo a la
 *  API de ingesta, sin SDK.
 *
 *  Privacidad por diseño:
 *  · NO se envían datos personales crudos (nombre, correo).
 *  · `distinct_id` es un hash SHA-256 del email en minúsculas → se pueden
 *    contar leads únicos sin almacenar PII en el proveedor.
 *  · `company` es opcional y solo viaja si el visitante la completó.
 *
 *  Best-effort: sin `POSTHOG_KEY` (o si el envío falla) no se lanza y el
 *  formulario nunca se ve afectado — "modo demo", coherente con Resend/Groq.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { createHash } from "node:crypto";
import { budgetLabels, serviceLabels } from "@/lib/validations/contact";

export type LeadEvent = {
  email: string;
  company?: string;
  service: string;
  budget?: string;
};

/** Host de ingesta. Default: nube US de PostHog (us.i.posthog.com). */
const POSTHOG_HOST = process.env.POSTHOG_HOST ?? "https://us.i.posthog.com";

/** Timeout por intento: la telemetría jamás debe colgar el formulario. */
const TIMEOUT_MS = 5_000;
/** Reintentos adicionales tras el primer intento (fallos transitorios de red). */
const RETRIES = 1;

/** Pausa entre reintentos (backoff fijo corto). */
const RETRY_DELAY_MS = 300;

/**
 * Registra un lead en PostHog (evento `lead_submitted`). Nunca lanza:
 * un fallo de telemetría no debe romper el flujo del formulario. Con un
 * timeout acotado + reintento se absorben blips de red transitorios
 * (connect timeouts de DNS/proxy) sin perder el evento.
 */
export async function trackLead(lead: LeadEvent): Promise<void> {
  const apiKey = process.env.POSTHOG_KEY;
  if (!apiKey) return; // modo demo: sin clave no hay telemetría

  const now = new Date();
  const serviceLabel = serviceLabels[lead.service as keyof typeof serviceLabels];
  const budgetLabel = lead.budget
    ? budgetLabels[lead.budget as keyof typeof budgetLabels]
    : undefined;

  const payload = JSON.stringify({
    api_key: apiKey,
    event: "lead_submitted",
    // ID pseudoanónimo: hash del email → contabilidad de únicos sin PII.
    distinct_id: createHash("sha256")
      .update(lead.email.trim().toLowerCase())
      .digest("hex"),
    timestamp: now.toISOString(),
    properties: {
      // Fecha del lead (ISO 8601): el timestamp de PostHog ya lo registra,
      // pero se expone explícito para filtrar/agrupar por día.
      submitted_at: now.toISOString(),
      service: lead.service,
      service_label: serviceLabel,
      budget: lead.budget ?? "indefinido",
      budget_label: budgetLabel,
      ...(lead.company ? { company: lead.company } : {}),
    },
  });

  let lastError: unknown = null;
  for (let attempt = 0; attempt <= RETRIES; attempt++) {
    try {
      const res = await fetch(`${POSTHOG_HOST}/capture/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload,
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });

      if (res.ok) return; // 2xx: evento aceptado por PostHog.
      lastError = `HTTP ${res.status}`;
    } catch (error) {
      lastError = error;
    }

    if (attempt < RETRIES) {
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
    }
  }

  console.error(
    `[IAZR·telemetría] No se pudo registrar el lead tras ${RETRIES + 1} intentos:`,
    lastError
  );
}
