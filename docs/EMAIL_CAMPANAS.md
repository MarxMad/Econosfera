# Campañas de Email: Seguimiento a Usuarios

Sistema para enviar correos periódicos a usuarios que aceptan notificaciones: recordatorios de uso, nuevas entradas al blog y promociones/alianzas.

---

## 1. Opt-in del usuario

En el **Dashboard** → **Perfil** hay un interruptor "Notificaciones por correo". Solo los usuarios que lo activan reciben estos correos.

- Campo en DB: `User.emailMarketingOptIn`
- Solo se envían a usuarios con email verificado

---

## 2. Tipos de campaña

| Tipo | Frecuencia | Descripción |
|------|------------|-------------|
| **Recordatorio** | Semanal (lunes 10:00 UTC) | Invita a volver al simulador |
| **Blog** | Manual | Cuando publicas una nueva entrada |
| **Promoción** | Manual | Alianzas con universidades, ofertas, etc. |

---

## 3. Recordatorios automáticos (Cron)

Vercel Cron ejecuta `/api/cron/email-campaigns` cada **lunes a las 10:00 UTC**.

**Configuración en Vercel:**
1. Añade `CRON_SECRET` en Environment Variables (ej: `openssl rand -hex 32`)
2. Vercel enviará `Authorization: Bearer <CRON_SECRET>` automáticamente

**Probar manualmente:**
```bash
curl -H "Authorization: Bearer TU_CRON_SECRET" https://tudominio.com/api/cron/email-campaigns
```

---

## 4. Notificar nueva entrada al blog

Cuando agregues un post en `src/lib/blog.ts`, envía la notificación:

```bash
curl -X POST https://tudominio.com/api/admin/send-blog-email \
  -H "Authorization: Bearer TU_CRON_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"slug": "ejemplo-regla-taylor"}'
```

---

## 5. Enviar promoción o alianza

```bash
curl -X POST https://tudominio.com/api/admin/send-promo-email \
  -H "Authorization: Bearer TU_CRON_SECRET" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Alianza con la UNAM",
    "body": "Estudiantes de la UNAM tienen 20% de descuento en Estudiante Pro.\n\nUsa el código UNAM20 al suscribirte.",
    "ctaText": "Ver oferta",
    "ctaUrl": "https://tudominio.com/pricing?codigo=UNAM20",
    "campaignId": "unam-2025"
  }'
```

- `campaignId`: evita reenviar la misma campaña (opcional)
- `ctaText` y `ctaUrl`: botón opcional en el correo

---

## 6. Archivos

| Archivo | Función |
|---------|---------|
| `src/lib/emailCampaigns.ts` | Lógica de envío y plantillas |
| `src/app/api/cron/email-campaigns/route.ts` | Cron recordatorios |
| `src/app/api/admin/send-blog-email/route.ts` | Notificar nuevo post |
| `src/app/api/admin/send-promo-email/route.ts` | Enviar promoción |
| `vercel.json` | Configuración del cron |
| `prisma/schema.prisma` | `emailMarketingOptIn`, `EmailCampaignLog` |
