"use client";

import { useEffect, useActionState, useRef, useState, type FocusEvent } from "react";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import posthog from "posthog-js";

import {
  budgetLabels,
  budgetOptions,
  serviceLabels,
  serviceOptions,
} from "@/lib/validations/contact";
import { submitContact } from "@/app/actions/contact";
import { initialContactState } from "@/lib/contact-state";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  CONTACT FORM — Formulario de auditoría técnica (React 19).
 *  · useActionState orquesta la Server Action `submitContact` sin estado
 *    intermedio en el cliente: validación Zod en el servidor, cero API REST.
 *  · Accesibilidad (Radix/Shadcn estándares): labels explícitos, aria-invalid,
 *    aria-describedby para errores y roles de alerta.
 *  · `noValidate`: el servidor es la fuente de verdad; los mensajes de Zod se
 *    mapean 1:1 a los campos.
 * ─────────────────────────────────────────────────────────────────────────────
 */

const inputBase =
  "w-full rounded-lg border border-border bg-secondary/40 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none transition-colors focus-visible:border-primary/60 focus-visible:ring-2 focus-visible:ring-ring/40";

function FieldError({ id, error }: { id: string; error?: string }) {
  if (!error) return null;
  return (
    <p id={id} role="alert" className="mt-1.5 text-xs text-destructive">
      {error}
    </p>
  );
}

/**
 * SHA-256 en hex, con la MISMA normalización que lib/analytics/lead.ts
 * (trim + minúsculas): el ID de identify coincide con el distinct_id del
 * evento lead_submitted → el funnel une pageviews y leads sin PII.
 */
async function hashEmail(email: string): Promise<string> {
  const data = new TextEncoder().encode(email.trim().toLowerCase());
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function ContactForm() {
  const [state, formAction, pending] = useActionState(
    submitContact,
    initialContactState
  );

  const errors = state.fieldErrors ?? {};

  // ── Funnel PostHog: al confirmarse el lead se identifica al visitante con
  // el hash SHA-256 de su correo (mismo ID que trackLead en el servidor) para
  // unir los pageviews anónimos con el evento lead_submitted. Sin PII.
  const [emailValue, setEmailValue] = useState("");
  const postHogEnabled = Boolean(process.env.NEXT_PUBLIC_POSTHOG_KEY);

  useEffect(() => {
    if (!postHogEnabled || state.status !== "success" || !emailValue) return;
    hashEmail(emailValue).then((id) => posthog.identify(id));
  }, [state.status, emailValue, postHogEnabled]);

  // ── Fricción y abandono (PostHog): eventos de interacción SIN PII.
  // · form_started     — primer campo enfocado (engagement con el formulario).
  // · form_submit_attempt — clic en enviar (antes de la respuesta del server).
  // · form_submit_error   — intento que terminó en error de validación (fricción).
  // · form_abandoned   — se tocó el formulario pero nunca se envió (pagehide).
  const startedRef = useRef(false);
  const submittedRef = useRef(false);
  const prevPendingRef = useRef(false);

  function handleFormFocus(e: FocusEvent<HTMLFormElement>) {
    if (!postHogEnabled || startedRef.current) return;
    startedRef.current = true;
    const el = e.target as HTMLElement;
    posthog.capture("form_started", {
      first_field: el.getAttribute("name") ?? el.id ?? el.tagName.toLowerCase(),
    });
  }

  function handleFormSubmit() {
    submittedRef.current = true;
    if (postHogEnabled) posthog.capture("form_submit_attempt");
  }

  // Intento terminado (pending true → false): si terminó en error, se registra
  // la fricción de validación (nº de campos con error). Cada intento cuenta.
  useEffect(() => {
    const wasPending = prevPendingRef.current;
    prevPendingRef.current = pending;
    if (!postHogEnabled || !wasPending || pending) return;
    if (state.status === "error") {
      posthog.capture("form_submit_error", {
        field_count: Object.keys(state.fieldErrors ?? {}).length,
      });
    }
  }, [pending, state.status, state.fieldErrors, postHogEnabled]);

  // Abandono: se tocó el formulario pero jamás se envió → se registra al salir
  // de la página (pagehide es más fiable que unload en móvil/navegadores).
  useEffect(() => {
    if (!postHogEnabled) return;
    const onPageHide = () => {
      if (startedRef.current && !submittedRef.current) {
        posthog.capture("form_abandoned");
      }
    };
    window.addEventListener("pagehide", onPageHide);
    return () => window.removeEventListener("pagehide", onPageHide);
  }, [postHogEnabled]);

  if (state.status === "success") {
    return (
      <div
        role="status"
        className="flex h-full min-h-72 flex-col items-center justify-center gap-4 rounded-xl border border-success/30 bg-success/5 px-6 py-14 text-center"
      >
        <span className="inline-flex size-12 items-center justify-center rounded-full border border-success/40 bg-success/10">
          <CheckCircle2 className="size-6 text-success" aria-hidden="true" />
        </span>
        <p className="font-mono text-sm text-success">// lead_received ✓</p>
        <h3 className="font-display text-xl font-semibold">Mensaje registrado</h3>
        <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
          {state.message}
        </p>
      </div>
    );
  }

  return (
    <form
      action={formAction}
      noValidate
      onFocus={handleFormFocus}
      onSubmit={handleFormSubmit}
      className="flex h-full flex-col gap-5"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className="mb-1.5 block text-sm font-medium">
            Nombre *
          </label>
          <input
            id="contact-name"
            name="name"
            type="text"
            autoComplete="name"
            required
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "contact-name-error" : undefined}
            placeholder="Iván Andrés Zúñiga"
            className={cn(inputBase, errors.name && "border-destructive/70")}
          />
          <FieldError id="contact-name-error" error={errors.name?.[0]} />
        </div>

        <div>
          <label htmlFor="contact-email" className="mb-1.5 block text-sm font-medium">
            Correo corporativo *
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            autoComplete="email"
            onChange={(e) => setEmailValue(e.target.value)}
            required
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "contact-email-error" : undefined}
            placeholder="direccion@empresa.com"
            className={cn(inputBase, errors.email && "border-destructive/70")}
          />
          <FieldError id="contact-email-error" error={errors.email?.[0]} />
        </div>
      </div>

      <div>
        <label htmlFor="contact-company" className="mb-1.5 block text-sm font-medium">
          Empresa <span className="text-muted-foreground">(opcional)</span>
        </label>
        <input
          id="contact-company"
          name="company"
          type="text"
          autoComplete="organization"
          aria-invalid={Boolean(errors.company)}
          aria-describedby={errors.company ? "contact-company-error" : undefined}
          placeholder="Nombre de tu organización"
          className={cn(inputBase, errors.company && "border-destructive/70")}
        />
        <FieldError id="contact-company-error" error={errors.company?.[0]} />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-service" className="mb-1.5 block text-sm font-medium">
            Servicio *
          </label>
          <select
            id="contact-service"
            name="service"
            required
            defaultValue=""
            aria-invalid={Boolean(errors.service)}
            aria-describedby={errors.service ? "contact-service-error" : undefined}
            className={cn(inputBase, "appearance-none", errors.service && "border-destructive/70")}
          >
            <option value="" disabled>
              Selecciona…
            </option>
            {serviceOptions.map((value) => (
              <option key={value} value={value}>
                {serviceLabels[value]}
              </option>
            ))}
          </select>
          <FieldError id="contact-service-error" error={errors.service?.[0]} />
        </div>

        <div>
          <label htmlFor="contact-budget" className="mb-1.5 block text-sm font-medium">
            Presupuesto <span className="text-muted-foreground">(opcional)</span>
          </label>
          <select
            id="contact-budget"
            name="budget"
            defaultValue=""
            aria-invalid={Boolean(errors.budget)}
            aria-describedby={errors.budget ? "contact-budget-error" : undefined}
            className={cn(inputBase, "appearance-none")}
          >
            <option value="" disabled>
              Selecciona…
            </option>
            {budgetOptions.map((value) => (
              <option key={value} value={value}>
                {budgetLabels[value]}
              </option>
            ))}
          </select>
          <FieldError id="contact-budget-error" error={errors.budget?.[0]} />
        </div>
      </div>

      <div className="flex-1">
        <label htmlFor="contact-message" className="mb-1.5 block text-sm font-medium">
          ¿Qué necesitas auditar o construir? *
        </label>
        <textarea
          id="contact-message"
          name="message"
          rows={5}
          required
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "contact-message-error" : undefined}
          placeholder="Describe el contexto: proyecto, equipo, objetivo de negocio, plazos…"
          className={cn(
            inputBase,
            "min-h-32 resize-y",
            errors.message && "border-destructive/70"
          )}
        />
        <FieldError id="contact-message-error" error={errors.message?.[0]} />
      </div>

      {/* Honeypot: oculto para humanos, visible para bots */}
      <div className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
        <label htmlFor="contact-website">No rellenes este campo</label>
        <input id="contact-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {state.status === "error" && state.message ? (
        <p
          role="alert"
          className="rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive"
        >
          {state.message}
        </p>
      ) : null}

      <Button type="submit" size="lg" variant="cyber" disabled={pending} className="w-full sm:w-auto">
        {pending ? (
          <>
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            Enviando solicitud…
          </>
        ) : (
          <>
            <Send className="size-4" aria-hidden="true" />
            Enviar solicitud de auditoría
          </>
        )}
      </Button>

      <p className="text-xs leading-relaxed text-muted-foreground">
        Respuesta en &lt;24h hábiles · franja GMT-5 · los datos se usan solo para
        responder tu solicitud.
      </p>
    </form>
  );
}
