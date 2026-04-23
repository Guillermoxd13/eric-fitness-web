# Eric Fitness

Plataforma SaaS de entrenamientos en vídeo de **Erickson Zambrano**. Registro, suscripción y reproducción de rutinas protegidas detrás de un paywall.

🌐 **Producción**: https://eric-fitness-web.vercel.app

## Stack

- **Next.js 15** (App Router) · **React 19** · **TypeScript** · **Tailwind CSS 3**
- **Supabase** — auth + Postgres + Row Level Security
- **Stripe** — Checkout + Billing Portal + Webhooks (modo test)
- **Cloudflare Stream** — URLs firmadas para vídeo protegido (fallback a YouTube embebido para pruebas)
- **Vercel** — hosting y Web Analytics
- **Sonner** — toast notifications
- **Lucide React** — iconos

## Estructura

```
src/
├── app/
│   ├── (auth)/              # /login, /register (redirige a /dashboard si ya logueado)
│   ├── (protected)/         # /dashboard, /watch/[id], /account — middleware gate
│   ├── api/
│   │   ├── account/delete/  # Borra usuario vía service_role
│   │   ├── stripe/          # checkout, portal, webhook
│   │   └── video/[id]/signed-url/  # Firma Cloudflare o embed YouTube
│   ├── auth/callback/       # Intercambio de código OAuth/magic link
│   ├── legal/               # /legal/terminos, /legal/privacidad
│   ├── pricing/             # Planes + checkout
│   ├── icon.tsx             # Favicon generado dinámicamente
│   ├── apple-icon.tsx       # Icono iOS home-screen
│   ├── opengraph-image.tsx  # OG image para redes sociales
│   ├── sitemap.ts           # Sitemap.xml
│   ├── robots.ts            # Robots.txt
│   ├── not-found.tsx        # 404 personalizada
│   ├── error.tsx            # Error boundary global
│   └── page.tsx             # Landing con hero + features + FAQ + CTA
├── components/
│   ├── Navbar.tsx           # Server component, auth-aware
│   ├── MobileMenu.tsx       # Hamburguesa para <md
│   ├── Footer.tsx
│   ├── VideoPlayer.tsx      # Client, pide signed-url al API
│   └── LogoutButton.tsx
├── lib/
│   ├── supabase/            # client, server, middleware (SSR) y service_role
│   ├── stripe/              # Cliente lazy
│   └── cloudflare/stream.ts # Firma JWT local con fallback a REST
└── types/database.ts        # Tipos Profile + Video

supabase/migrations/
├── 0001_init_profiles_videos.sql    # Schema + RLS + triggers
├── 0002_seed_example_videos.sql     # Seed opcional con 4 YouTube dummies
├── 0003_open_video_previews.sql     # Abre SELECT a todos (preview)
├── 0004_seed_real_videos.sql        # Los 6 vídeos reales de Erickson
└── 0005_video_durations.sql         # Plantilla para rellenar duraciones a mano
```

## Modelo de seguridad

Este es el punto más importante del proyecto. Leer con atención.

### RLS permisiva en SELECT, gate real en la API

La tabla `videos` tiene una única policy de SELECT:

```sql
using (true)  -- cualquiera ve las filas (autenticado o anon)
```

Esto es **intencional**: los usuarios no Premium deben *ver* las cards de vídeos bloqueados (thumbnail borrosa + candado dorado + título), no que "no existan". El paywall es comercial, no ocultamiento.

La protección real está en `/api/video/[id]/signed-url`:

```ts
if (video.is_locked) {
  const isPremium = /* profile.is_premium && periodo vigente */;
  if (!isPremium) return 403;
}
```

Sin esa llamada, **el frontend no obtiene URL reproducible**. Para YouTube devuelve un embed URL con el video_id público — para Cloudflare Stream devuelve un token JWT firmado que expira en 4h. En ambos casos: sin pasar por la API no hay reproducción.

### Escritura a `videos` denegada por defecto

No existen policies de INSERT/UPDATE/DELETE para `anon` ni `authenticated`, así que RLS las rechaza. Solo el `service_role` (usado por scripts de admin o futuras migraciones) puede modificar el catálogo.

### Campos sensibles del perfil bloqueados

La tabla `profiles` tiene un trigger `profiles_guard_premium_fields` que revierte cualquier cambio que un usuario autenticado intente hacer a `is_premium`, `stripe_customer_id`, `stripe_subscription_id`, `subscription_status` o `current_period_end`. Solo el `service_role` (usado por el webhook de Stripe) puede escribirlos.

### Auto-creación de perfil

El trigger `on_auth_user_created` en `auth.users` llama a `handle_new_user()` para crear automáticamente la fila en `public.profiles` cuando alguien se registra. Si alguien tiene cuenta sin perfil (edge case), migración 0001 incluye backfill.

## Arrancar en local

```bash
npm install
cp .env.local.example .env.local     # rellena los huecos
npm run dev                           # http://localhost:3000
```

Variables imprescindibles en `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Variables opcionales según feature:

| Variable | Para qué | Sin ella... |
|---|---|---|
| `SUPABASE_SERVICE_ROLE_KEY` | Webhook Stripe + `/api/account/delete` | Delete de cuenta devuelve 503 |
| `STRIPE_SECRET_KEY` | Checkout y portal | El botón "Hazte Premium" falla |
| `STRIPE_WEBHOOK_SECRET` | Validar firma del webhook | Pagos no se propagan a `is_premium` |
| `STRIPE_PRICE_MONTHLY` / `STRIPE_PRICE_YEARLY` | IDs de Stripe | Checkout 500 |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Solo referencia cliente | No bloquea (no se usa aún) |
| `CLOUDFLARE_ACCOUNT_ID` / `CLOUDFLARE_STREAM_API_TOKEN` | Vídeos protegidos | Solo van los vídeos con `provider='youtube'` |
| `CLOUDFLARE_STREAM_SIGNING_KEY_ID` / `_JWK` | Firma JWT local (más rápida) | Falla al REST API si no se configuran |

## Aplicar migraciones SQL

En Supabase → **SQL Editor**, pegar **en orden**:

1. `0001_init_profiles_videos.sql` — schema + RLS + triggers. Seguro re-ejecutar.
2. `0002_seed_example_videos.sql` — *opcional*, 4 vídeos de ejemplo.
3. `0003_open_video_previews.sql` — abre SELECT para el patrón preview + candado.
4. `0004_seed_real_videos.sql` — 6 vídeos reales del canal de Erickson Zambrano.
5. `0005_video_durations.sql` — plantilla editable para meter duraciones manualmente.

Todas son idempotentes.

## Configurar Stripe (modo test)

1. **Productos**: en https://dashboard.stripe.com/test/products crea "Eric Fitness Premium" con dos precios recurrentes (`€19/mes` y `€149/año`). Copia los `price_...` en `.env.local`.
2. **Claves**: `sk_test_...` y `pk_test_...` en https://dashboard.stripe.com/test/apikeys.
3. **Webhook local** (para desarrollo):
   ```bash
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```
   Copia el `whsec_...` en `STRIPE_WEBHOOK_SECRET`.
4. **Webhook producción**: Stripe Dashboard → Developers → Webhooks → Add endpoint apuntando a `https://eric-fitness-web.vercel.app/api/stripe/webhook`. Eventos requeridos:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_failed`

## Configurar Cloudflare Stream (opcional)

1. https://dash.cloudflare.com → Stream → copia **Account ID**.
2. My Profile → API Tokens → Create → permiso **Stream: Edit** → copia el token.
3. Genera una clave de firma local:
   ```bash
   curl -X POST -H "Authorization: Bearer $CF_TOKEN" \
     "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/stream/keys"
   ```
   Guarda el `id` y el `jwk` (JSON completo como string) en las env vars.
4. Inserta vídeos con `provider='cloudflare'` y `video_id='<Cloudflare-UID>'`.

Si no configuras la clave de firma, [src/lib/cloudflare/stream.ts](src/lib/cloudflare/stream.ts) hace fallback al endpoint REST `/stream/:uid/token`.

## Rutas

| Ruta | Acceso | Qué hace |
|---|---|---|
| `/` | público | Landing: hero, features, cómo funciona, FAQ, CTA |
| `/pricing` | público | Planes mensual/anual, FAQ de pago |
| `/login`, `/register` | público (redirige si ya logueado) | Auth email + contraseña |
| `/auth/callback` | público | Intercambio OAuth / magic link |
| `/legal/terminos`, `/legal/privacidad` | público | Placeholders legales |
| `/dashboard` | autenticado | Grid con filtro por categoría |
| `/watch/[id]` | autenticado | Reproductor o preview de pago |
| `/account` | autenticado | Editar nombre, cambiar password, borrar cuenta, portal Stripe |
| `/api/video/[id]/signed-url` | autenticado | Token/embed + gate premium |
| `/api/stripe/checkout` | autenticado | Crea sesión Checkout |
| `/api/stripe/portal` | autenticado premium | Abre Billing Portal |
| `/api/stripe/webhook` | Stripe (firma) | Propaga estado de suscripción a `profiles` |
| `/api/account/delete` | autenticado | Borra auth user (requiere service_role) |

## Añadir vídeos

Mientras no exista panel admin, usar Supabase → Table Editor → `videos`. Columnas clave:

| Campo | Valor |
|---|---|
| `provider` | `youtube` (placeholder) o `cloudflare` (producción) |
| `video_id` | ID de YouTube (ej. `dQw4w9WgXcQ`) o UID de Cloudflare Stream |
| `thumbnail_url` | YouTube: `https://i.ytimg.com/vi/<ID>/maxresdefault.jpg` |
| `is_locked` | `true` = Premium · `false` = gratuito |
| `category` | Texto libre: `Pecho`, `Piernas`, `HIIT`, etc. Genera chip automático en el filtro |
| `position` | Orden en el grid (menor primero) |
| `duration_seconds` | Opcional. Si está null, la card no muestra badge de duración |

## Desplegar

El proyecto está conectado a Vercel con auto-deploy desde `main`. Cada `git push origin main` redespliega en ~90s.

Para un fork desde cero:

1. **GitHub** → crear repo vacío privado.
2. `git remote add origin <url>` · `git push -u origin main`.
3. **Vercel** → Add New Project → importar el repo → pegar env vars en "Environment Variables" antes de deploy.
4. Primer deploy te da la URL `eric-fitness-web.vercel.app`.
5. **Supabase** → Authentication → URL Configuration → añadir URL de Vercel como Site URL y `https://<url>/**` en Redirect URLs.
6. Configurar webhook de Stripe apuntando al dominio de Vercel (ver sección Stripe).

## Lo que queda fuera del MVP

- Panel admin para subir vídeos sin tocar Supabase directamente.
- Programas estructurados (semanas, rutinas encadenadas, progreso del usuario).
- OAuth Google/Apple (Supabase lo soporta, solo falta activar en su dashboard).
- Tests E2E (Playwright) del flujo checkout → webhook → premium → reproducción.
- Dominio propio (actualmente en `*.vercel.app`).
- Emails transaccionales custom (welcome, reminders) vía Resend o similar.

## Licencia

Propietario — Erickson Zambrano. Ver [/legal/terminos](src/app/legal/terminos/page.tsx).
