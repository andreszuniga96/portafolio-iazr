# 🚀 Deploy a Vercel — Resumen de cambios listo para commit

Todo verificado con `npm run typecheck`, `npm run build` (producción OK, 5/5 páginas),
`npm start` (servido local) y **prueba end-to-end real**: pageview → envío del formulario
→ correo Resend → evento `lead_submitted` → `$identify` del funnel.

---

## 0. ⚠️ Estado del repositorio (importante antes de commitear)

El repo git está en `D:/pablo/Escritorio/portfolio-iazr` (proyecto antiguo). El
portafolio actual vive en el subdirectorio **`portafolio-iazr/`** (Next.js 15) y está
**100% sin trackear** — nunca se ha commiteado. Al hacer commit:

- Añade **todo `portafolio-iazr/`** (es el proyecto que Vercel debe desplegar). El
  `.gitignore` interno ya excluye `node_modules/`, `.next/` y `.env*` (verificado:
  `.env.local` NO entra al commit ✅).
- En Vercel, al importar el repo, configura el **Root Directory = `portafolio-iazr`**
  (si no, Vercel tomaría la raíz del repo antiguo y el build fallaría).
- No es necesario commiteear `frontend/`, `backend/`, `src/` ni `dist/` (código de la
  versión anterior); el deploy solo necesita `portafolio-iazr/`.

---

## 1. Perfil actualizado con el CV real (julio 2026) — Colombia · GMT-5

Todos los datos personales se actualizaron con la hoja de vida adjunta:

- **Identidad**: Iván Andrés Zúñiga — **Director Tecnológico · Full-Stack Developer ·
  Mentor Tech**. Ubicación **"Colombia · Remoto global"**, franja **GMT-5 (UTC-5)**
  centralizada en `lib/data/site.ts` (`location`, `timezone`, `timezoneShort`).
- **Educación real** (4 títulos): Especialización en IA (UNIR, en curso), Magíster en
  Administración (U. Mariana), Especialista en Alta Gerencia (U. Mariana), Ingeniero de
  Sistemas y Telecomunicaciones (U. Sergio Arboleda). Se eliminaron los datos previos
  no verificados (UNA Costa Rica, ISTQB, Konrad).
- **Trayectoria real — 13 roles** (todos en el timeline de `/about`): ZOLARIS
  (Director Tecnológico), Talento TECH Regiones 3/2/1 y Monitor Región 3 (UTP, UdeA,
  Cymetria), Mentor Talento Tech 2.0 (IU Training), Profesor de Cátedra (UdeA), Asesor
  ADEL Pasto, Asesor MGA (Guachucal), PRECONTEO Nariño, Parquesoft, Dozurcol, Docencia.
- **11 certificaciones internacionales** (nueva sección en `/about`, agrupadas por
  emisor): Microsoft (3), Huawei HCIA (4), Google (4). También inyectadas en el
  **JSON-LD `hasCredential`** para SEO.
- **Stack real**: React/Next.js/Node.js/Python, PostgreSQL/MongoDB, Power BI/SQL/ML,
  Azure/Huawei Cloud/Vercel/n8n, MGA/PDM/Scrum/CRM/BPM. Se eliminó el stack fabricado
  (Cypress QA, Databricks, Verilog/Tiny Tapeout) y los repos inventados del "informe".
- **Métricas coherentes en todo el sitio**: hero, servicios, chat (system prompt),
  contacto y about usan **7+ años · 11 certificaciones · 13 roles · 3 postgrados ·
  +500 mentorizados** (antes decían "40+ proyectos, 98%").
- Propagar: `lib/data/{site,experience,skills,stack,services}.ts`, hero, about,
  contacto, chat, correos autorespuesta, JSON-LD, sitemap, manifest, README,
  `package.json`, `scripts/adversarial.mjs`.

> ✅ Verificado: **cero referencias a GMT-6/UTC-6** en el código y en el build
> (`.next/server`): solo GMT-5 (UTC-5). Si la web publicada aún muestra GMT-6, es el
> despliegue anterior de Vercel: hace falta un nuevo deploy.

---

## 2. Telemetría de conversión — PostHog (gratis, 1M eventos/mes)

### Servidor (`lib/analytics/lead.ts`)
- Evento **`lead_submitted`** por cada lead válido (fecha, servicio, presupuesto,
  empresa), con `distinct_id` = **hash SHA-256 del correo** (sin PII).
- **Timeout 5s + 1 reintento** (300 ms): los blips de red no pierden eventos.
- Se registra justo después de la validación → mide la demanda aunque falle el correo.

### Cliente (`posthog-js`)
- `components/providers/posthog-provider.tsx` — init con `autocapture: false`,
  `capture_pageview: false` (manual) y `person_profiles: "identified_only"`.
- `components/providers/posthog-pageview.tsx` — **`$pageview`** con URL absoluta,
  envuelto en `<Suspense>` (requisito de prerender de Next.js; sin eso el build falla).
- `components/contact/contact-form.tsx` — al confirmarse el lead llama
  **`posthog.identify(hash(email))`**: los pageviews anónimos y el `lead_submitted`
  quedan en la misma persona → **funnel visita → envío** medible sin PII.

### Fricción y abandono (`components/contact/contact-form.tsx`)
| Evento | Cuándo |
| --- | --- |
| `form_started` | Primer campo enfocado (propiedad `first_field`) |
| `form_submit_attempt` | Clic en enviar |
| `form_submit_error` | Intento con error de validación (`field_count`) |
| `form_abandoned` | Salida de la página con el formulario tocado y sin enviar (`pagehide`) |

### Robustez extra (`app/actions/contact.ts`)
- **Timeout 8s** en el fetch a Resend: si Resend cae, el formulario responde en
  segundos (antes podía colgarse 20s+).

---

## 3. Variables de entorno

| Variable | Valor | En Vercel |
| --- | --- | --- |
| `GROQ_API_KEY` | (ya configurada) | ✅ ya está |
| `RESEND_API_KEY` | (en Vercel y `.env.local`, no se expone en el repo) | ✅ ya está |
| `POSTHOG_KEY` | (en Vercel y `.env.local`, no se expone en el repo) | ✅ ya está |
| **`NEXT_PUBLIC_POSTHOG_KEY`** | (mismo valor que `POSTHOG_KEY`) | ⚠️ **FALTA AÑADIR** |
| `NEXT_PUBLIC_POSTHOG_HOST` | *(opcional)* `https://eu.i.posthog.com` si proyecto EU | opcional |
| `NEXT_PUBLIC_SITE_URL` | *(opcional)* `https://portafolio-iazr.vercel.app` | opcional |

`NEXT_PUBLIC_*` se incrustan en el bundle **al compilar** → sin redeploy no surten efecto.
Las claves `phc_` y `re_` son públicas por diseño (cliente/servidor según el caso);
`GROQ_API_KEY` es secreta y solo vive en el servidor.

---

## 4. Pasos para desplegar (todo gratis, sin dominio)

1. **Commit** en el repo: añade `portafolio-iazr/` completo (`.env.local` queda fuera
   por `.gitignore` ✅).
2. **Vercel → Settings → Environment Variables**: añade `NEXT_PUBLIC_POSTHOG_KEY`
   (mismo valor que `POSTHOG_KEY`) en Production y Preview.
3. **Importa/deploya en Vercel** el repo, con **Root Directory = `portafolio-iazr`**
   (Next.js 15 se detecta solo; no hace falta `vercel.json`).
4. La URL pública será **`https://portafolio-iazr.vercel.app`** — sin DNS ni dominio
   comprado (los `*.vercel.app` incluyen HTTPS).
5. **Post-deploy check**:
   - Carga el sitio → en PostHog (Data management → Events) debe aparecer `$pageview`.
   - Envía una solicitud de prueba en el formulario → `lead_submitted` + `$identify`.
   - Arma el funnel `$pageview → lead_submitted` y el embudo de fricción
     `form_started → form_submit_attempt → lead_submitted`.
   - Confirma que la portada ya muestra **GMT-5** (no GMT-6) y el nuevo perfil.

### Correo (Resend, sin DNS)
El remitente por defecto `IAZR Portfolio <onboarding@resend.dev>` solo entrega al
correo registrado en la cuenta Resend → asegúrate de que la cuenta esté registrada
con `ivanzuiga1996@gmail.com` (el destino del formulario). El dominio `iazr.dev`
"pending" en Resend se puede ignorar/eliminar: requiere comprar el dominio para
verificarlo y no hace falta.

---

## 5. Resumen de archivos (portafolio-iazr/)

**Nuevos en la sesión (y pendientes de commit junto con todo el proyecto):**
`lib/analytics/lead.ts` · `components/providers/posthog-provider.tsx` ·
`components/providers/posthog-pageview.tsx` · `DEPLOY.md`

**Modificados (datos del CV + telemetría + robustez):**
`app/layout.tsx` · `app/actions/contact.ts` · `app/api/chat/route.ts` ·
`app/about/page.tsx` · `app/page.tsx` · `components/contact/contact-form.tsx` ·
`components/contact/contact-section.tsx` · `components/footer.tsx` ·
`components/about/about-header.tsx` · `components/about/credentials.tsx` ·
`components/about/contact-direct.tsx` · `components/chat/terminal-chat.tsx` ·
`components/hero/hero-section.tsx` · `components/projects/project-parallax.tsx` ·
`components/three/globe-section.tsx` · `lib/data/site.ts` · `lib/data/experience.ts` ·
`lib/data/skills.ts` · `lib/data/stack.ts` · `lib/data/services.ts` ·
`lib/data/projects.ts` · `lib/ai/system-prompt.ts` · `lib/seo/json-ld.ts` ·
`lib/validations/contact.ts` · `README.md` · `package.json` + `package-lock.json`
(posthog-js ^1.415.1) · `.env.example` · `.env.local` (gitignored) ·
`public/sitemap.xml` · `public/site.webmanifest` · `scripts/adversarial.mjs`

> ⚠️ **Seguridad**: las claves `RESEND_API_KEY` y `POSTHOG_KEY` se compartieron en
> texto plano por chat. Tras confirmar el deploy, considera rotarlas
> (Resend → API Keys, PostHog → Project API Key) y actualizarlas en Vercel y
> `.env.local`.
