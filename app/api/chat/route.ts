import type { LanguageModelV4StreamPart } from "@ai-sdk/provider";
import { createGroq } from "@ai-sdk/groq";
import { streamText, convertToModelMessages, type UIMessage } from "ai";
import { MockLanguageModelV4, simulateReadableStream } from "ai/test";

import { buildSystemPrompt } from "@/lib/ai/system-prompt";
import { getActiveModelConfig } from "@/lib/ai/model-config";

// Identificador estable del "parte de texto" del stream simulado.
const DEMO_TEXT_ID = "demo-text-1";

/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  ROUTE HANDLER — /api/chat (Motor conversacional, Vercel AI SDK).
 *
 *  · streamText: genera un flujo de respuestas token a token (SSE). El cliente
 *    (useChat) consume cada delta en tiempo real → "latencia nula" percibida.
 *  · System Prompt: se construye desde lib/ai/system-prompt.ts (contexto
 *    sintético del ingeniero inyectado al modelo subyacente).
 *  · Proveedor: GROQ (createGroq) con llama3-70b-8192 por defecto
 *    (modelo configurable vía GROQ_MODEL). Groq entrega latencias de inferencia
 *    extremadamente bajas → streaming casi instantáneo para el usuario.
 *  · Modo demo (sin GROQ_API_KEY): se usa MockLanguageModelV4 + simulateReadableStream
 *    (subpath oficial "ai/test") para devolver un stream predefinido con el
 *    MISMO protocolo de streaming → la UI no conoce la diferencia.
 *
 *  NOTA: streamText convierte internamente los mensajes UI del cliente al
 *  formato del modelo; el contenido de `messages` nunca se interpola en el
 *  system prompt (sin riesgo de prompt injection en las instrucciones).
 * ─────────────────────────────────────────────────────────────────────────────
 */

export const runtime = "nodejs";
// Evita que Next intente cachear el streaming de IA (siempre dinámico).
export const dynamic = "force-dynamic";

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
});

/** Respuesta de "modo demo" cuando no hay clave configurada. */
const DEMO_REPLY = [
  "  // modo_demo: sin GROQ_API_KEY el asistente usa una respuesta predefinida.\n\n",
  "Hola, soy el asistente de IAZR — Iván Andrés Zúñiga. 👋\n\n",
  "Con mi contexto verificado puedo orientarte sobre desarrollo Full-Stack (React, Next.js, Node.js, Python), datos e IA (Power BI, SQL, Machine Learning), dirección tecnológica y mentoría tech. Trabajo remoto global, franja GMT-5 (Colombia), con proyectos arrancando en 1–2 semanas.\n\n",
  "Revisa la sección de proyectos para ver 9 despliegues en producción o escríbeme por el formulario de contacto para empezar. 🔧",
].join("");

/**
 * Construye un modelo simulado que emite la respuesta demo en fragmentos.
 *
 * Los chunks respetan la especificación LanguageModelV4StreamPart (ai/test):
 *  · "stream-start" → señala el inicio del flujo.
 *  · "text-start" / "text-delta" / "text-end" → emiten el texto con un id
 *    compartido (streamText los agrupa en el parte de texto final).
 *  · "finish" → cierra con reason "stop" y el uso de tokens (formato v4:
 *    inputTokens/outputTokens).
 *
 * simulateReadableStream añade un pequeño retardo entre chunks para que el
 * efecto de "streaming" se perciba igual que con el modelo real.
 */
function buildDemoModel() {
  // Los chunks se tipan explícitamente como LanguageModelV4StreamPart para que
  // el literal no amplíe "stop" a string ni omita campos del usage (v4 exige
  // inputTokens/outputTokens con cacheRead/cacheWrite).
  const chunks: LanguageModelV4StreamPart[] = [
    { type: "stream-start", warnings: [] },
    { type: "text-start", id: DEMO_TEXT_ID },
    { type: "text-delta", id: DEMO_TEXT_ID, delta: DEMO_REPLY },
    { type: "text-end", id: DEMO_TEXT_ID },
    {
      type: "finish",
      // v4 exige el objeto completo: reason unificado + raw del proveedor.
      finishReason: { unified: "stop", raw: "stop" },
      usage: {
        inputTokens: { total: 8, noCache: 8, cacheRead: 0, cacheWrite: 0 },
        outputTokens: {
          total: Math.max(1, Math.round(DEMO_REPLY.length / 4)),
          text: Math.max(1, Math.round(DEMO_REPLY.length / 4)),
          reasoning: 0,
        },
      },
    },
  ];

  return new MockLanguageModelV4({
    doStream: async () => ({
      stream: simulateReadableStream({
        chunks,
        chunkDelayInMs: 24,
      }),
    }),
  });
}

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const system = buildSystemPrompt();
  // Fuente única de resolución (lib/ai/model-config): la misma que expone
  // GET /api/chat/model para que el terminal pinte el badge del modelo real.
  const { provider, model: modelId } = getActiveModelConfig();

  // Pre-validación liviana: si hay clave de Groq, verificamos que el modelo
  // exista ANTES de abrir el stream SSE. Así el error es sincrónico y el
  // try/catch lo captura antes de que el AI SDK emita nada al cliente.
  if (provider === "groq") {
    try {
      const checkRes = await fetch(
        `https://api.groq.com/openai/v1/models/${modelId}`,
        { headers: { Authorization: `Bearer ${process.env.GROQ_API_KEY}` } }
      );
      if (!checkRes.ok) {
        console.warn(
          `[/api/chat] Modelo Groq "${modelId}" no disponible (${checkRes.status}) — modo demo.`
        );
        const fallback = streamText({
          model: buildDemoModel(),
          system,
          messages: await convertToModelMessages(messages),
        });
        return fallback.toUIMessageStreamResponse();
      }
    } catch {
      // Red caída u otro error de fetch: fallback demo silencioso.
      console.warn("[/api/chat] No se pudo verificar el modelo Groq — modo demo.");
      const fallback = streamText({
        model: buildDemoModel(),
        system,
        messages: await convertToModelMessages(messages),
      });
      return fallback.toUIMessageStreamResponse();
    }
  }

  try {
    const result = streamText({
      // Con clave → modelo real de Groq; sin clave → stream demo predefinido.
      model: provider === "groq" ? groq(modelId) : buildDemoModel(),
      system,
      // convertToModelMessages normaliza el formato UI (partes) al formato de
      // mensajes del proveedor; así el cliente puede enviar attachments etc.
      messages: await convertToModelMessages(messages),
      temperature: 0.6,
      maxOutputTokens: 1024,
      // onError: captura errores que el SDK propaga dentro del stream SSE
      // (e.g. el proveedor rechaza la solicitud tras haber iniciado la conexión).
      onError: ({ error: streamError }) => {
        console.warn("[/api/chat] Error dentro del stream:", streamError);
      },
    });

    // toUIMessageStreamResponse serializa el stream en SSE (`data: {json}\n\n`)
    // exactamente como lo parsea useChat en el cliente.
    return result.toUIMessageStreamResponse();
  } catch (error: unknown) {
    // Errores sincrónicos inesperados (no capturados por la pre-validación).
    console.error("[/api/chat] Error inesperado:", error);
    const fallback = streamText({
      model: buildDemoModel(),
      system,
      messages: await convertToModelMessages(messages),
    });
    return fallback.toUIMessageStreamResponse();
  }
}
