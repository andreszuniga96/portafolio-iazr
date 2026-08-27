import { NextResponse } from "next/server";

import { getActiveModelConfig } from "@/lib/ai/model-config";

/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  GET /api/chat/model — Telemetría del modelo activo.
 *
 *  El terminal (client island) consulta este endpoint al montar para pintar el
 *  badge "Groq · llama-3.3-70b-versatile" (o "demo · MockLanguageModelV4") sin
 *  duplicar la lógica de resolución: la fuente única vive en lib/ai/model-config.
 *
 *  force-dynamic: el estado (clave presente o no) se evalúa por petición, de
 *  modo que si el operador añade/quita GROQ_API_KEY en producción, el terminal
 *  refleja el cambio sin redeploy del prompt.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(getActiveModelConfig(), {
    headers: {
      // Evita que proxies/el navegador cacen una respuesta que puede cambiar
      // según las variables de entorno del servidor.
      "Cache-Control": "no-store",
    },
  });
}
