import { z } from "zod";

/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  VALIDACIÓN DE CONTACTO — Zod (esquema de datos del lado del servidor).
 *  La fuente de verdad es el SERVIDOR: la Server Action valida con este esquema
 *  antes de cualquier procesamiento (envío de correo / registro en CRM).
 *  Los mensajes son específicos y en español (UX B2B).
 *
 *  Seguridad:
 *  · `website` es un honeypot oculto: si un bot lo rellena, max(0) falla y la
 *    acción se rechaza sin procesar nada.
 *  · Longitudes acotadas (name/company/message) → sin abuso de payload.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export const serviceOptions = [
  "direccion-tecnologica",
  "fullstack",
  "ia-datos",
  "mentoria",
  "otro",
] as const;

export const serviceLabels: Record<(typeof serviceOptions)[number], string> = {
  "direccion-tecnologica": "Dirección Tecnológica / transformación digital",
  fullstack: "Desarrollo Full-Stack",
  "ia-datos": "IA aplicada & Datos",
  mentoria: "Mentoría & formación tech",
  otro: "Otro / aún lo estoy definiendo",
};

export const budgetOptions = [
  "<5k",
  "5k-15k",
  "15k-50k",
  "50k+",
  "indefinido",
] as const;

export const budgetLabels: Record<(typeof budgetOptions)[number], string> = {
  "<5k": "Menos de USD 5k",
  "5k-15k": "USD 5k – 15k",
  "15k-50k": "USD 15k – 50k",
  "50k+": "Más de USD 50k",
  indefinido: "Aún sin definir",
};

export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "El nombre requiere al menos 2 caracteres")
    .max(80, "Nombre demasiado largo (máx. 80 caracteres)"),
  email: z.email("Ingresa un correo electrónico válido"),
  company: z.string().trim().max(120, "Máximo 120 caracteres").optional(),
  service: z.enum(serviceOptions, {
    error: "Selecciona un servicio para orientar la respuesta",
  }),
  budget: z.enum(budgetOptions).optional(),
  message: z
    .string()
    .trim()
    .min(20, "Cuéntanos un poco más (mínimo 20 caracteres)")
    .max(2000, "Máximo 2.000 caracteres"),
  /** Honeypot anti-bots: si aparece contenido, la validación falla. */
  website: z.string().max(0, "Acción no permitida").optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;
