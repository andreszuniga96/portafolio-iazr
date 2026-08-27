/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  CONTACT STATE — Estado compartido de la Server Action.
 *  Vive en un módulo SIN "use server": un archivo con esa directiva solo puede
 *  exportar funciones async (regla de Next.js). Desde aquí lo importan tanto la
 *  acción (app/actions/contact.ts) como el formulario client
 *  (components/contact/contact-form.tsx) sin violar la frontera.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export type ContactState = {
  status: "idle" | "success" | "error";
  message: string | null;
  /** Errores por campo provenientes de Zod (clave = nombre del campo). */
  fieldErrors: Record<string, string[] | undefined> | null;
};

export const initialContactState: ContactState = {
  status: "idle",
  message: null,
  fieldErrors: null,
};
