/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  AI / MODEL-CONFIG — Resolución del modelo activo (fuente única).
 *
 *  Tanto la ruta POST /api/chat (streaming) como la GET /api/chat/model
 *  (telemetría para el terminal) deben resolver el MISMO modelo. Este helper
 *  centraliza la decisión:
 *
 *   · GROQ_API_KEY presente  → proveedor "groq", modelo GROQ_MODEL o el
 *     default openai/gpt-oss-20b (demo: false).
 *   · Sin clave              → proveedor "demo" (MockLanguageModelV4 de
 *     ai/test), para que la UI muestre el estado real y honesto.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export type ModelConfig = {
  /** Proveedor efectivo del stream. */
  provider: "groq" | "demo";
  /** Nombre del modelo que responderá (o del mock en modo demo). */
  model: string;
  /** true si el chat usa la respuesta predefinida (sin clave configurada). */
  demo: boolean;
};

/** Modelo por defecto de Groq disponible en la cuenta actual. */
const DEFAULT_GROQ_MODEL = "openai/gpt-oss-20b";

export function getActiveModelConfig(): ModelConfig {
  const apiKey = process.env.GROQ_API_KEY;

  if (apiKey) {
    return {
      provider: "groq",
      model: process.env.GROQ_MODEL ?? DEFAULT_GROQ_MODEL,
      demo: false,
    };
  }

  return {
    provider: "demo",
    model: "MockLanguageModelV4 (ai/test)",
    demo: true,
  };
}
