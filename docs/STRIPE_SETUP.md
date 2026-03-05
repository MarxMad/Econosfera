# Configuración de Stripe para Econosfera

Guía paso a paso para activar pagos y suscripciones con Stripe.

---

## 1. Claves de API (ya las tienes)

En tu `.env` local y en Vercel → Settings → Environment Variables añade:

```
STRIPE_SECRET_KEY=sk_test_...          # Modo prueba (o sk_live_... en producción)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...   # Modo prueba (o pk_live_... en producción)
```

- **Modo prueba:** Usa `sk_test_` y `pk_test_` para probar sin cobrar de verdad.
- **Producción:** Cambia a `sk_live_` y `pk_live_` cuando estés listo.

---

## 2. Crear productos y precios en Stripe

1. Entra a [Stripe Dashboard](https://dashboard.stripe.com) → **Productos** → **Añadir producto**.
2. Crea dos productos:

### Producto 1: Estudiante Pro
- **Nombre:** Estudiante Pro
- **Descripción:** 50 créditos IA/mes, exportaciones ilimitadas, simuladores avanzados
- **Precio:** Recurrente, mensual, $4.99 USD (o el monto que uses)
- Guarda y copia el **Price ID** (empieza con `price_...`). Ese es `STRIPE_PRICE_PRO`.

### Producto 2: Researcher
- **Nombre:** Researcher
- **Descripción:** 100 créditos IA/mes, todo desbloqueado, soporte prioritario
- **Precio:** Recurrente, mensual, $9.99 USD (o el monto que uses)
- Copia el **Price ID**. Ese es `STRIPE_PRICE_RESEARCHER`.

3. Añade a tu `.env`:

```
STRIPE_PRICE_PRO=price_xxxxxxxxxxxxx
STRIPE_PRICE_RESEARCHER=price_yyyyyyyyyyyyy
```

---

## 3. Customer Portal (galería de pago)

Para que el botón "Gestionar suscripción" funcione:

1. En Stripe Dashboard → **Configuración** → **Billing** → **Customer portal**.
2. Activa el portal y configura qué puede hacer el usuario:
   - Actualizar método de pago
   - Ver facturas
   - Cancelar suscripción
3. Guarda los cambios.

---

## 4. Webhook (para sincronizar plan y créditos)

El webhook recibe eventos de Stripe (pago completado, suscripción cancelada, etc.) y actualiza tu base de datos.

**En local (desarrollo):**

1. Instala Stripe CLI: `brew install stripe/stripe-cli/stripe` (Mac) o [descarga](https://stripe.com/docs/stripe-cli).
2. Login: `stripe login`
3. Escucha eventos: `stripe listen --forward-to localhost:3000/api/stripe/webhook`
4. En la terminal verás un **Webhook signing secret** que empieza con `whsec_...`. Añade a `.env`:

```
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
```

**En producción (Vercel):**

1. Stripe Dashboard → **Developers** → **Webhooks** → **Añadir endpoint**.
2. **URL:** `https://econosfera.xyz/api/stripe/webhook` (o tu dominio).
3. **Eventos a escuchar:**
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.paid`
4. Crea el endpoint y copia el **Signing secret** (`whsec_...`).
5. Añade en Vercel: `STRIPE_WEBHOOK_SECRET=whsec_...`.  
   Usa un secreto distinto para el webhook de producción (el de Stripe CLI es solo para local).

---

## 5. Variables de entorno completas

```env
# Stripe
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_PRICE_PRO=price_...
STRIPE_PRICE_RESEARCHER=price_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Opcional: período de prueba
STRIPE_TRIAL_DAYS=7

# Para URLs de éxito/cancelación y portal
NEXT_PUBLIC_SITE_URL=https://econosfera.xyz
```

---

## 6. Migración de base de datos

Si aún no lo has hecho, ejecuta:

```bash
npx prisma db push
```

o

```bash
npx prisma migrate dev
```

para que la tabla `User` tenga `stripeCustomerId` y `stripeSubscriptionId`.

---

## 7. Probar el flujo

1. Inicia sesión en tu app.
2. Ve a **Pricing** y haz clic en "Estudiante Pro" o "Researcher".
3. Deberías ser redirigido a Stripe Checkout.
4. Usa tarjeta de prueba: `4242 4242 4242 4242`, expiración futura, CVC cualquiera.
5. Tras pagar, vuelves al dashboard y tu plan debería actualizarse.

---

## Resumen de archivos

| Archivo | Función |
|---------|---------|
| `src/lib/stripe.ts` | Cliente Stripe y variables de entorno |
| `src/app/api/stripe/create-checkout-session/route.ts` | Crea sesión de Checkout y redirige a Stripe |
| `src/app/api/stripe/create-portal-session/route.ts` | Abre el portal de facturación (gestionar suscripción) |
| `src/app/api/stripe/webhook/route.ts` | Recibe eventos de Stripe y actualiza plan/créditos |

---

## Troubleshooting

| Problema | Solución |
|----------|----------|
| "Pagos no configurados" | Revisa que `STRIPE_SECRET_KEY` y al menos `STRIPE_PRICE_PRO` o `STRIPE_PRICE_RESEARCHER` estén definidos. |
| "Plan no disponible" | El plan que intentas usa un Price ID que no está configurado. Revisa `STRIPE_PRICE_PRO` y `STRIPE_PRICE_RESEARCHER`. |
| Webhook no firma | `STRIPE_WEBHOOK_SECRET` debe coincidir con el del endpoint en Stripe (o con el de `stripe listen` en local). |
| Usuario no actualiza plan | Revisa el webhook en Stripe Dashboard → Developers → Webhooks → ver logs del endpoint. |
