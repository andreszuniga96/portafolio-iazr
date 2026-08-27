# IAZR — Portafolio Digital de Iván Andrés Zúñiga

Portafolio de alcance global para **IAZR · Iván Andrés Zúñiga** — Director
Tecnológico, Full-Stack Developer y Mentor Tech (Ingeniero de Sistemas y
Telecomunicaciones, Magíster en Administración y Especialista en IA — UNIR).

Construido con la pila arquitectónica 2026 especificada en el informe de modernización:

| Capa | Tecnología |
| --- | --- |
| Marco estructural | **Next.js 15** (App Router) + **React 19** (RSC, Server Actions, React Compiler) |
| CSS & tematización | **Tailwind CSS v4** (CSS-first `@theme`, estética Linear, superficie base `#080A0A`) |
| Componentes | **Shadcn UI** (patrón `data-slot`, sin `forwardRef`) + Magic UI (Bento/Marquee) + Aceternity (Beams) |
| Ecosistema cinemático | **Framer Motion** (offscreen pause/INP) + **GSAP ScrollTrigger** (narrativa de scroll) |
| Renderizado 3D | **React Three Fiber** — globo neural procedural, Draco-ready, recuperación `webglcontextlost` |
| Mutaciones | **Server Actions** + **Zod** (formulario de auditoría técnica, sin API REST intermedia) |
| Desplazamiento | **Lenis** (smooth scrolling lineal) |
| Tipografía | **Geist Sans** (fundamento geométrico general) · **JetBrains Mono** (código/datos) vía `next/font` — sistema restringido de 2 familias, subconjunto cero-bloqueo |
| Motor conversacional | **Vercel AI SDK v7** + **Groq** (`llama-3.3-70b-versatile`) — `useChat` (cliente) + `streamText` (ruta `/api/chat`) |

---

## 🚀 Puesta en marcha

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar variables de entorno
cp .env.example .env.local
#    → rellena GROQ_API_KEY (obligatoria para la IA real; sin ella el chat
#      responde en "modo demo" con un mensaje predefinido).

# 3. Desarrollo
npm run dev          # http://localhost:3000

# 4. Producción
npm run build && npm start
```

### Despliegue en Vercel

1. Importa el repositorio en [vercel.com](https://vercel.com).
2. Añade la variable de entorno `GROQ_API_KEY` (y opcionalmente `RESEND_API_KEY`,
   `POSTHOG_KEY`, `NEXT_PUBLIC_POSTHOG_KEY` y `NEXT_PUBLIC_SITE_URL`) en
   **Settings → Environment Variables**.
3. Deploy. El proyecto incluye `next.config.ts` (sin configuraciones pre-v4) y
   `vercel.json` no es necesario: Next 15 se detecta automáticamente.

---

## 🗂️ Arquitectura de archivos

```
app/
├── globals.css              # Sistema de diseño: @theme + paleta Linear #080A0A + keyframes (v4)
├── layout.tsx               # Metadata SEO, tipografía Geist+JetBrains (2 familias), JSON-LD, Providers
├── page.tsx                 # Composición de secciones · experimental_ppr + <Suspense>
├── actions/contact.ts       # Server Action: validación Zod + entrega Resend (o modo demo)
└── api/chat/route.ts        # Motor conversacional: streamText + System Prompt de IAZR

components/
├── providers/               # ThemeProvider (claro/oscuro) + LenisProvider
├── seo/json-ld.tsx          # Inyección de <script type="application/ld+json">
├── ui/                      # Shadcn UI: button, badge, card (data-slot, CVA)
├── hero/                    # HeroSection + BackgroundBeams + BlurIn
├── services/                # ServicesGrid — oferta B2B (Server Component)
├── bento/                   # BentoGrid (Server) + MagicCard (client, luz hover)
├── projects/                # ProjectParallax — narrativa con GSAP ScrollTrigger
├── three/                   # R3F resiliente: globo neural, fallback estático, guardia WebGL,
│                            #   Draco-ready, ErrorBoundary, montaje lazy (ssr:false)
├── contact/                 # ContactSection (Server) + ContactForm (useActionState)
├── chat/                    # TerminalChat (useChat de @ai-sdk/react)
├── marquee.tsx              # Marquesina CSS pura (Server Component)
├── navbar.tsx · footer.tsx · timeline.tsx · section-heading.tsx

lib/
├── utils.ts                 # cn() (clsx + tailwind-merge)
├── hooks/use-offscreen-pause.ts  # INP: pausa loops fuera de la ventana gráfica
├── validations/contact.ts   # Esquema Zod del formulario (honeypot + longitudes)
├── data/                    # Fuente única de verdad: site, skills, projects, stack, services, experience
├── seo/json-ld.ts           # Constructores Schema.org (Person · Organization)
└── ai/system-prompt.ts      # Contexto sintético del ingeniero (tipado desde data/)
```

## 🧠 Decisiones arquitectónicas clave

- **Server Components por defecto** — Marquee, BentoGrid, Timeline, Footer, SectionHeading
  y el JSON-LD se pre-renderizan sin JavaScript de cliente. Solo las hojas
  interactivas (`HeroSection`, `MagicCard`, `ProjectParallax`, `TerminalChat`,
  `Navbar`) llevan `"use client"`.
- **PPR-ready** — `app/page.tsx` exporta `experimental_ppr = true` y aísla el único
  agujero dinámico (chat de IA) en `<Suspense>`. En las estables de Next 15
  (15.4/15.5) Vercel bloquea el flag `experimental.ppr` (canary-only); descomenta
  la línea marcada en `next.config.ts` al migrar a canary/Next 16 para activar el
  Partial Prerendering real. Sin el flag, el streaming de Suspense ya entrega el
  cascarón HTML inmediato.
- **OKLCH** — Todos los tokens de color (claro/oscuro) están en el espacio
  perceptualmente uniforme; el acento cian eléctrico vive en `--primary`
  (`oklch(0.82 0.17 200)` en modo oscuro).
- **Rendimiento** — Los haces del hero son capas CSS animadas en el compositor
  (no tocan el hilo principal); la marquesina es CSS puro; el chat hace streaming
  token a token por SSE.
- **Sin hooks de memorización manuales** — el código no usa `useMemo`/`useCallback`
  (requisito de la especificación); el React Compiler de React 19 asume esa
  responsabilidad. El flag `experimental.reactCompiler` de Next 15.5 queda
  documentado en `next.config.ts` (requiere `babel-plugin-react-compiler`;
  estable en Next 16).

## 🧭 Proyectos reales en producción

Los casos de éxito son despliegues reales verificables (capturas en `public/proyectos/`):

| Proyecto | URL |
| --- | --- |
| La Campana | https://lacampana.co/ |
| Emssanar EPS | https://emssanareps.co/ |
| Paisajes Sonoros | https://paisajes-sonoros.vercel.app/ |
| Dozurcol Pasto | https://dozurcol-pasto.vercel.app/ |
| Portafolio Sandra Gómez | https://portafolio-sandra-sst.vercel.app/ |
| Panini 2026 | https://panini26.vercel.app/ |
| Método Sonora | https://metodo-sonora.vercel.app/ |
| Zolaris | https://zolarisweb.vercel.app/ |
| SST MedSys | https://sst-med-sys.vercel.app/dashboard |

El perfil público de GitHub del ingeniero es
**https://github.com/andreszuniga96** (enlazado desde `lib/data/projects.ts`).

## 🔑 Variables de entorno y datos de contacto

| Dato | Dónde | Estado |
| --- | --- | --- |
| `GROQ_API_KEY` | `.env.local` | ✅ configurada localmente — IA real con `llama-3.3-70b-versatile` (sin ella: modo demo con `MockLanguageModelV4` de `ai/test`) |
| `RESEND_API_KEY` | `.env.local` | Opcional — entrega real del formulario de contacto (sin ella: modo demo) |
| `POSTHOG_KEY` | `.env.local` | Opcional — telemetría de conversión del formulario (sin ella: no se registran leads) |
| `NEXT_PUBLIC_POSTHOG_KEY` | `.env.local` | Opcional — telemetría de cliente (pageviews + funnel). Misma Project API Key que `POSTHOG_KEY`, pública por diseño |
| GitHub | `lib/data/site.ts` → `author.github` | ✅ `https://github.com/andreszuniga96` |
| LinkedIn | `lib/data/site.ts` → `author.linkedin` | ✅ `https://www.linkedin.com/in/iazr96/` |
| Email | `lib/data/site.ts` → `author.email` | ✅ `ivanzuiga1996@gmail.com` |
| WhatsApp | `lib/data/site.ts` → `author.whatsapp` | ✅ `https://wa.me/573229132643` |
| `og.png` | `public/og.png` | generado (sustituir por versión con marca) |
| URL producción | `.env.local` → `NEXT_PUBLIC_SITE_URL` | default `portafolio-iazr.vercel.app` |

> ⚠️ **Vercel**: `GROQ_API_KEY` y `RESEND_API_KEY` deben re-añadirse en
> **Settings → Environment Variables** del proyecto (`.env.local` no se sube
> al repositorio por diseño).

### 📧 Envío real del formulario de contacto (Resend)

La Server Action (`app/actions/contact.ts`) ya hace la entrega vía la API de
Resend con `reply_to` hacia el interesado y destino
`ivanzuiga1996@gmail.com`. Solo falta la clave:

1. Crea una cuenta gratis en https://resend.com (registra **con
   ivanzuiga1996@gmail.com** para que el remitente por defecto
   `onboarding@resend.dev` ya pueda enviarte).
2. En **API Keys** crea una clave y pégala en `.env.local`:
   `RESEND_API_KEY=re_…` (y en Vercel → Settings → Environment Variables).
3. (Recomendado en producción) En **Domains** verifica un dominio propio
   (p. ej. `iazr.dev`) con los registros DNS y define
   `RESEND_FROM=IAZR <no-reply@iazr.dev>` en `.env.local`.
4. Prueba: envía el formulario en local y revisa la bandeja; el log de la
   función en Vercel muestra el resultado del envío.

La Server Action envía dos correos: el **lead** para IAZR (con `reply_to` al
interesado) y una **autorespuesta de confirmación** al visitante (gracias + SLA
24 h). La autorespuesta es *best-effort*: con `onboarding@resend.dev` solo puede
llegar al correo registrado de la cuenta; con un dominio verificado
(`RESEND_FROM`) funciona para cualquier visitante. El fetch a la API de Resend
lleva un **timeout de 8s** (`AbortSignal.timeout`): si Resend está caído, el
formulario responde en segundos en lugar de colgarse en el connect timeout por
defecto de Node (10s × 2 correos = 20s+ de espera para el visitante). Sin
`RESEND_API_KEY` el
formulario responde "modo demo" (éxito sin envío).

## 📈 Telemetría de conversión del formulario (PostHog)

Cada lead válido del formulario de contacto se registra como evento
`lead_submitted` en **PostHog** (plan gratuito: 1M eventos/mes) para medir
conversión — qué servicios y presupuestos generan más demanda. Implementado con
fetch directo a la API de ingesta (`lib/analytics/lead.ts`), sin SDK.

1. Crea una cuenta gratis en https://posthog.com y un proyecto.
2. Copia la **Project API Key** (empieza por `phc_…`) desde
   **Project Settings → API Keys** y pégala en `.env.local` (y en Vercel →
   Settings → Environment Variables): `POSTHOG_KEY=phc_…`.
3. (Solo si creaste el proyecto en la región EU) define
   `POSTHOG_HOST=https://eu.i.posthog.com`; por defecto se usa la nube US.
4. El evento llega con `submitted_at` (fecha ISO), `service`/`service_label`,
   `budget`/`budget_label` y `company` (si la completó). Sin PII: el
   `distinct_id` es un hash SHA-256 del correo → puedes contar leads únicos
   sin almacenar datos personales.

### ⏱️ Robustez: timeout + reintento

La captura es *best-effort* y está blindada contra fallos de red transitorios
(blips de DNS/proxy que en la práctica se han visto como `ConnectTimeoutError`
contra AWS/Cloudflare):

- **Timeout de 5s por intento** (`AbortSignal.timeout`): la telemetría nunca
  cuelga el formulario. En éxito, el coste extra es de ~300–500 ms; en el peor
  caso (2 intentos fallidos) ~10,3 s, y el visitante sigue recibiendo su
  respuesta con normalidad.
- **1 reintento** con backoff fijo de 300 ms: un solo fallo aislado ya no
  pierde el evento (el primer intento se registra en el log con el prefijo
  `[IAZR·telemetría]` y se reintenta una vez antes de darse por perdido).
- **Orden deliberado**: el lead se registra **justo después de la validación**
  y **antes** del envío del correo → mides la demanda real del formulario
  aunque la entrega del email falle por cualquier motivo.
- **Sin `POSTHOG_KEY`** (o si PostHog está caído) el formulario funciona igual
  y simplemente no se registra nada: la telemetría nunca rompe el flujo.

### 🌐 Tracking de cliente — funnel visita → envío

Además del evento server-side, `posthog-js` (cliente) mide el **pageview**
(`$pageview` con URL absoluta, emitido manualmente en cada ruta desde
`components/providers/posthog-pageview.tsx`) para completar el funnel
**visita → envío del formulario**:

- `PostHogProvider` (`components/providers/posthog-provider.tsx`) inicializa
  la lib a nivel de módulo (guard SSR) con `NEXT_PUBLIC_POSTHOG_KEY` — la
  MISMA Project API Key que `POSTHOG_KEY` (las `phc_…` son públicas por
  diseño, viajan en el bundle del cliente). Host por defecto: nube US
  (`NEXT_PUBLIC_POSTHOG_HOST` para EU).
- **Privacidad**: `autocapture: false` (cero clicks/inputs capturados),
  `capture_pageview: false` (sin duplicados) y
  `person_profiles: "identified_only"` (solo se crean personas al identificar).
- **Unión del funnel sin PII**: al confirmarse el lead, el formulario llama
  `posthog.identify(hashSHA256(email))` — el MISMO hash que usa `trackLead`
  como `distinct_id`. Los pageviews anónimos de ese visitante y su
  `lead_submitted` quedan en la misma persona: el funnel visita → envío se
  mide de extremo a extremo sin almacenar datos personales.

En PostHog construye el funnel con los pasos `$pageview` → `lead_submitted`
(o insights de leads por día, por servicio o por presupuesto). Recuerda añadir
`NEXT_PUBLIC_POSTHOG_KEY` en Vercel → Environment Variables y redeployar
(los `NEXT_PUBLIC_` se incrustan en el bundle al compilar).

### 📉 Fricción y abandono del formulario

Para medir dónde se pierde la conversión, el formulario emite eventos de
interacción (sin PII, solo nombres de campo):

| Evento | Cuándo | Qué mide |
| --- | --- | --- |
| `form_started` | Primer campo enfocado (una vez por instancia) | Engagement: cuántos visitantes comienzan a llenar el formulario (propiedad `first_field`) |
| `form_submit_attempt` | Clic en "Enviar solicitud" | Intentos reales de conversión |
| `form_submit_error` | Intento que terminó en error de validación | Fricción de validación (`field_count` = campos con error) |
| `form_abandoned` | Salida de la página con el formulario tocado y sin enviar (`pagehide`) | Abandono: tocaron campos pero nunca enviaron |

Con esto puedes calcular el embudo de fricción completo en PostHog:
`form_started` → `form_submit_attempt` → `lead_submitted` (y el abandono como
brecha entre `form_started` y `form_submit_attempt`). Los eventos usan el mismo
`distinct_id` (anónimo o hash de correo tras el lead), así que se unen al funnel
sin duplicar personas.

## 📦 Scripts

```bash
npm run dev        # servidor de desarrollo
npm run build      # build de producción
npm start          # sirve el build
npm run typecheck  # tsc --noEmit
npm run test:adversarial # batería de seguridad del chat (requiere server + GROQ_API_KEY)
```

### 🔒 Batería adversarial del chat

`scripts/adversarial.mjs` lanza 10 preguntas adversariales (jailbreak, datos
inventados, cifras, secretos) contra `/api/chat` y falla si alguna respuesta no
contiene el rechazo esperado (o filtra un patrón prohibido, p. ej. una API key):

```bash
node scripts/adversarial.mjs                        # contra http://localhost:3000
node scripts/adversarial.mjs --base=http://localhost:57085
```

Requiere el server corriendo y `GROQ_API_KEY` configurada (sin clave el chat
responde en modo demo y el script aborta con exit code 2). Los patrones de
rechazo viven en la cabecera del script: ajustarlos si cambia el system prompt.
