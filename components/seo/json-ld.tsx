/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  JSON-LD — Componente Server que inyecta datos estructurados Schema.org.
 *
 *  ¿Por qué un Server Component y no useEffect?
 *  · Las arañas de Googlebot leen el HTML crudo de la primera pasada: el JSON-LD
 *    debe estar embebido en el documento servido, jamás esperar a JavaScript.
 *  · Se inyecta con dangerouslySetInnerHTML por diseño (es un bloque <script>);
 *    la mitigación XSS es escapar `<` como \u003c antes de serializar (patrón
 *    oficial de Next.js para JSON-LD).
 * ─────────────────────────────────────────────────────────────────────────────
 */

export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // Escapar `<` evita que un valor con HTML cierre el <script> prematuramente.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
