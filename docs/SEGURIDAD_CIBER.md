# Plan de Seguridad Cibernética

Implementaciones realizadas para proteger la aplicación, especialmente en el manejo de pagos.

---

## 1. Idempotencia en Webhook Stripe

**Problema:** Stripe puede reenviar el mismo evento varias veces. Sin idempotencia, un usuario podría recibir créditos duplicados.

**Solución:** Tabla `StripeWebhookEvent` que almacena `eventId` (único). Antes de procesar cualquier evento, se verifica si ya fue procesado. Si existe, se retorna 200 sin hacer nada.

- **Archivos:** `prisma/schema.prisma`, `src/app/api/stripe/webhook/route.ts`
- **Migración:** `npx prisma db push` (ya aplicada)

---

## 2. Validación del plan desde Stripe

**Problema:** En `invoice.paid` se usaba `user.plan` de la base de datos. Si alguien modificara el plan manualmente, podría recibir créditos incorrectos.

**Solución:** El plan se obtiene ahora de `sub.metadata.plan` de la suscripción de Stripe, fuente de verdad.

---

## 3. Rate Limiting

**Problema:** Endpoints de auth y pago sin límite de intentos → vulnerables a fuerza bruta y abuso.

**Solución:** Rate limiting usando **Supabase/PostgreSQL** (la misma base de datos del proyecto). Sin servicios externos.

| Endpoint | Límite |
|----------|--------|
| Login (NextAuth POST) | 5 intentos / minuto por IP |
| Forgot password | 5 intentos / minuto por IP |
| Reset password | 5 intentos / minuto por IP |
| Stripe checkout/portal | 10 solicitudes / minuto por IP |

Tabla `RateLimit` en Prisma. No requiere configuración adicional.

---

## 4. Headers de Seguridad

Añadidos en `next.config.js` para todas las respuestas:

| Header | Valor | Propósito |
|--------|-------|-----------|
| X-Frame-Options | DENY | Evitar clickjacking |
| X-Content-Type-Options | nosniff | Evitar MIME sniffing |
| Referrer-Policy | strict-origin-when-cross-origin | Controlar referrer |
| Strict-Transport-Security | max-age=31536000 | Forzar HTTPS |

---

## Checklist de Producción

- [ ] Usar claves Stripe **live** (`sk_live_`, `pk_live_`)
- [ ] Webhook de producción con su propio `STRIPE_WEBHOOK_SECRET`
- [ ] Verificar que `NEXTAUTH_SECRET` esté definido
- [ ] Revisar en Stripe Dashboard los eventos de webhook fallidos
