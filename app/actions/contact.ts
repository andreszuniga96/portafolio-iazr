"use server";

import { contactSchema, serviceLabels } from "@/lib/validations/contact";
import type { ContactState } from "@/lib/contact-state";
import { siteConfig } from "@/lib/data/site";
import { trackLead } from "@/lib/analytics/lead";

/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  SERVER ACTION — submitContact (React 19, 'use server').
 *
 *  Mutación sin API REST intermedia (superficie de ataque mínima):
 *  1. Validación estricta del esquema con Zod (fuente de verdad en servidor).
 *  2. Guardia honeypot + throttle básico en memoria.
 *  3. Entrega del lead:
 *     · Con `RESEND_API_KEY` → correo transaccional vía Resend (fetch directo)
 *       hacia el email de IAZR (siteConfig.author.email), con reply_to al
 *       interesado para responderle con un clic.
 *     · Sin clave → "modo demo": respuesta de éxito sin envío (coherente con el
 *       chat del sitio, que también tiene modo demo). El estado devuelto es el
 *       mismo en ambos casos → la UI no conoce la diferencia.
 *  4. Autorespuesta de confirmación al interesado (best-effort): el lead es lo
 *     crítico y jamás se bloquea por un fallo de la confirmación. Con el
 *     remitente por defecto (onboarding@resend.dev) Resend solo entrega al
 *     correo registrado de la cuenta; con un dominio verificado (RESEND_FROM)
 *     la confirmación funciona para cualquier visitante.
 *  5. Telemetría de conversión (best-effort): cada lead válido se registra en
 *     PostHog (evento `lead_submitted` — fecha, servicio, presupuesto) sin
 *     PII; un fallo aquí jamás afecta la entrega ni la respuesta al visitante.
 *
 *  Retorna un objeto serializable (requisito de useActionState): jamás se
 *  exponen internals ni credenciales al cliente.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** Remitente por defecto: solo puede enviar al correo registrado en la cuenta. */
const DEFAULT_FROM = "IAZR Portfolio <onboarding@resend.dev>";

/**
 * Envío transaccional vía API de Resend (sin dependencias externas).
 * Lanza si Resend no acepta el correo (estatus ≠ 2xx).
 */
async function sendEmail({
  from,
  to,
  replyTo,
  subject,
  text,
}: {
  from: string;
  to: string;
  replyTo?: string;
  subject: string;
  text: string;
}) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
    },
    // Timeout acotado: si Resend está caído, el formulario responde en segundos
    // en lugar de colgarse en el connect timeout por defecto de Node (10s × 2
    // correos = 20s+ de espera para el visitante).
    signal: AbortSignal.timeout(8_000),
    body: JSON.stringify({
      from,
      to: [to],
      // reply_to solo si existe: evita campos vacíos en la petición.
      ...(replyTo ? { reply_to: replyTo } : {}),
      subject,
      text,
    }),
  });

  if (!res.ok) {
    throw new Error(`Resend responded ${res.status}`);
  }
}

/** Throttle en memoria (por instancia serverless): evita spam de fuerza bruta. */
let lastSubmitAt = 0;
const THROTTLE_MS = 10_000;

export async function submitContact(
  _prevState: ContactState,
  formData: FormData
): Promise<ContactState> {
  // Los campos opcionales vacíos (selects sin selección) se normalizan a
  // `undefined` para que Zod los trate como ausentes, no como cadenas inválidas.
  const raw = {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    company: String(formData.get("company") ?? "") || undefined,
    service: String(formData.get("service") ?? ""),
    budget: String(formData.get("budget") ?? "") || undefined,
    message: String(formData.get("message") ?? ""),
    website: String(formData.get("website") ?? ""),
  };

  const parsed = contactSchema.safeParse(raw);

  if (!parsed.success) {
    return {
      status: "error",
      message: "Corrige los campos señalados e inténtalo de nuevo.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const now = Date.now();
  if (now - lastSubmitAt < THROTTLE_MS) {
    return {
      status: "error",
      message: "Demasiadas solicitudes seguidas. Espera unos segundos.",
      fieldErrors: null,
    };
  }
  lastSubmitAt = now;

  const data = parsed.data;

  // Doble guardia honeypot (el esquema ya lo rechaza; esto es fail-closed).
  if (data.website) {
    return { status: "error", message: "Acción no permitida.", fieldErrors: null };
  }

  // ── TELEMETRÍA: se registra el lead (fecha, servicio, presupuesto) apenas
  // supera la validación, aunque luego falle el correo → mide la demanda real
  // del formulario. Best-effort: trackLead nunca lanza.
  await trackLead(data);

  const apiKey = process.env.RESEND_API_KEY;

  if (apiKey) {
    // Remitente configurable vía RESEND_FROM. Default onboarding@resend.dev
    // (solo envía a la dirección con la que registraste la cuenta en Resend);
    // al verificar un dominio propio, usa "IAZR <no-reply@tudominio.com>".
    const from = process.env.RESEND_FROM ?? DEFAULT_FROM;

    try {
      const service = serviceLabels[data.service];

      // ── 1) LEAD: el correo crítico para IAZR (con reply_to al interesado).
      await sendEmail({
        from,
        to: siteConfig.author.email,
        replyTo: data.email,
        subject: `[IAZR] Solicitud: ${service} — ${data.name}`,
        text: [
          `Nombre: ${data.name}`,
          `Correo: ${data.email}`,
          `Empresa: ${data.company ?? "—"}`,
          `Servicio: ${service}`,
          `Presupuesto: ${data.budget ?? "Sin definir"}`,
          "",
          data.message,
        ].join("\n"),
      });
    } catch (error) {
      console.error("[IAZR·contacto] Error de envío:", error);
      return {
        status: "error",
        message:
          "No se pudo entregar el mensaje ahora. Escríbenos directamente a " +
          siteConfig.author.email,
        fieldErrors: null,
      };
    }

    // ── 2) AUTORESPUESTA al interesado (best-effort, nunca bloquea el lead).
    // Con el remitente por defecto (onboarding@resend.dev) solo es posible
    // cuando el visitante ES el correo registrado de la cuenta; con dominio
    // verificado (RESEND_FROM) funciona para cualquier visitante.
    const canAutoReply =
      process.env.RESEND_FROM !== undefined || data.email === siteConfig.author.email;

    if (canAutoReply) {
      try {
        const service = serviceLabels[data.service];
        await sendEmail({
          from,
          to: data.email,
          subject: "✓ Solicitud recibida — IAZR",
          text: [
            `Hola ${data.name}:`,
            "",
            `He recibido tu solicitud de auditoría (${service}) y te agradezco el interés en trabajar con IAZR.`,
            "",
            "La revisaré y te responderé con un plan de acción concreto en menos de 24 horas hábiles (franja GMT-5, Colombia).",
            "",
            `Si tu caso es urgente, escríbeme directo a ${siteConfig.author.email} o por WhatsApp ${siteConfig.author.whatsappDisplay}.`,
            "",
            "Saludos,",
            `${siteConfig.author.name} — Director Tecnológico · Full-Stack Developer`,
          ].join("\n"),
        });
      } catch (error) {
        // El lead ya se entregó; la confirmación es un extra. Se loguea para
        // diagnóstico pero NO se convierte en error para el visitante.
        console.error(
          "[IAZR·contacto] Autorespuesta no enviada (¿remitente sin dominio verificado?):",
          error
        );
      }
    }
  }

  return {
    status: "success",
    message:
      "Solicitud recibida. Te responderé en menos de 24h hábiles (franja GMT-5).",
    fieldErrors: null,
  };
}
