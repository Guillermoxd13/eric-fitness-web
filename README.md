# Eric Fitness

Plataforma SaaS de entrenamientos con suscripciones premium.

**Stack**
- Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS
- Supabase (Auth + Postgres + RLS)
- Stripe (Checkout + Billing Portal + Webhooks)
- Cloudflare Stream (signed URLs, con fallback a YouTube embebido para pruebas)

---

## 1. Primera instalación

```bash
cd eric-fitness
npm install
cp .env.local.example .env.local   # (ya viene creado — rellena los huecos vacíos)
npm run dev
```

El `.env.local` ya trae las llaves de Supabase. Solo faltan:
- `SUPABASE_SERVICE_ROLE_KEY` — Supabase → Project Settings → API → `service_role secret`
- Stripe (cuando las tengas)
- Cloudflare Stream (cuando las tengas)

Mientras no pongas Stripe, el checkout devolverá 500 (esperado).
Mientras no pongas Cloudflare, los vídeos `provider='youtube'` reproducen perfectamente (placeholder).

---

## 2. Migraciones SQL

Abre Supabase → **SQL Editor** → pega el contenido de:

1. `supabase/migrations/0001_init_profiles_videos.sql` — crea/actualiza tablas, RLS y triggers.
2. `supabase/migrations/0002_seed_example_videos.sql` — *opcional*, inserta 4 vídeos de ejemplo (YouTube) para poder ver la UI.

Las migraciones son **idempotentes** (`IF NOT EXISTS`, policies con `DROP` previo). Seguras de re-ejecutar.

### El contrato de seguridad

La tabla `videos` tiene una única política de SELECT:

```sql
is_locked = false
OR (auth.uid() IS NOT NULL AND public.is_active_premium(auth.uid()))
```

Esto significa: **un usuario sin `is_premium = true` activo no puede leer ni una sola fila bloqueada** — ni el `video_id`, ni el título, nada. El filtro es a nivel de Postgres, no de aplicación. Ningún bug en el frontend puede exponerlos.

Además, la tabla `profiles` tiene un trigger que **bloquea** que un usuario autenticado modifique `is_premium`, `stripe_customer_id`, `subscription_status` o `current_period_end` desde el cliente. Solo el `service_role` (el webhook de Stripe) puede tocar esos campos.

---

## 3. Configurar Stripe (modo test)

1. Crea un producto "Eric Fitness Premium" en https://dashboard.stripe.com/test/products con dos precios recurrentes (mensual y anual). Copia los IDs `price_...` en `.env.local`.
2. Copia `sk_test_...` y `pk_test_...` de https://dashboard.stripe.com/test/apikeys.
3. En local, inicia el escuchador del webhook:
   ```bash
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```
   Copia el `whsec_...` que te imprime en `STRIPE_WEBHOOK_SECRET`.
4. En producción, añade el endpoint `https://TU-DOMINIO/api/stripe/webhook` en Stripe Dashboard → Developers → Webhooks. Eventos mínimos:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_failed`

---

## 4. Configurar Cloudflare Stream

1. https://dash.cloudflare.com → Stream → copia el **Account ID** (`CLOUDFLARE_ACCOUNT_ID`).
2. My Profile → API Tokens → Create Token → Permission **Stream: Edit**. Cópialo en `CLOUDFLARE_STREAM_API_TOKEN`.
3. Genera una clave de firma local (más rápida que la API):
   ```bash
   curl -X POST -H "Authorization: Bearer $CF_TOKEN" \
     "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/stream/keys"
   ```
   Guarda el `id` en `CLOUDFLARE_STREAM_SIGNING_KEY_ID` y el `jwk` (completo, JSON como string) en `CLOUDFLARE_STREAM_SIGNING_KEY_JWK`.
4. En la tabla `videos`, inserta filas con `provider='cloudflare'` y `video_id='<UID-de-Cloudflare>'`.

Si no configuras la clave de firma, `lib/cloudflare/stream.ts` usa automáticamente el endpoint REST `/stream/:uid/token` como fallback.

---

## 5. Rutas

| Ruta | Acceso | Qué hace |
|---|---|---|
| `/` | público | Landing |
| `/pricing` | público | Planes + checkout |
| `/login`, `/register` | público | Auth email + contraseña |
| `/auth/callback` | público | Intercambio OAuth / magic link |
| `/dashboard` | autenticado | Grid de vídeos (RLS decide qué se ve) |
| `/watch/[id]` | autenticado | Reproductor + detalles |
| `/account` | autenticado | Estado de suscripción + portal Stripe |
| `/api/video/[id]/signed-url` | autenticado | Devuelve token/embed según provider |
| `/api/stripe/checkout` | autenticado | Crea sesión Stripe Checkout |
| `/api/stripe/portal` | autenticado | Abre el Billing Portal |
| `/api/stripe/webhook` | Stripe | Actualiza `profiles.is_premium` desde eventos |

---

## 6. Añadir un vídeo

Por ahora, desde Supabase → Table Editor → `videos`. Columnas clave:

| Campo | Valor |
|---|---|
| `provider` | `cloudflare` (producción) o `youtube` (placeholder) |
| `video_id` | UID de Cloudflare Stream *o* ID de YouTube |
| `is_locked` | `true` para vídeos que requieren suscripción |
| `thumbnail_url` | Para YouTube: `https://i.ytimg.com/vi/<ID>/maxresdefault.jpg` |
| `position` | Orden en el grid (menor primero) |

Más adelante conviene un panel admin; de momento Supabase Table Editor hace el trabajo sin riesgo.

---

## 7. Deploy

**Vercel** es el camino directo:
1. Push a un repo.
2. Importa en Vercel, añade todas las variables de `.env.local` en Project → Settings → Environment Variables.
3. `NEXT_PUBLIC_SITE_URL` debe apuntar a tu dominio final en prod.
4. Crea el webhook Stripe apuntando a `/api/stripe/webhook` del dominio de Vercel.

---

## Qué quedó fuera del MVP (extensiones naturales)

- Panel admin para subir vídeos sin tocar Supabase directamente.
- Programas / categorías con índice y progreso por usuario.
- OAuth (Google, Apple) — Supabase lo soporta, solo añade el proveedor.
- Tests E2E (Playwright) del flujo checkout→webhook→premium→reproducción.
- Analytics de reproducción (Cloudflare Stream ya expone métricas).
