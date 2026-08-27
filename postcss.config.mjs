/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  POSTCSS CONFIG — Tailwind CSS v4 (motor Lightning CSS, escrito en Rust).
 *
 *  En v4 ya NO existe tailwind.config.js ni @tailwind base/components/utilities:
 *  basta con el plugin `@tailwindcss/postcss` y la directiva CSS-first
 *  `@import "tailwindcss"` dentro de app/globals.css. El motor detecta los
 *  tokens de `@theme` y compone solo las utilidades usadas (tree-shaking nativo).
 * ─────────────────────────────────────────────────────────────────────────────
 */
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
