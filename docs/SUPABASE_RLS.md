# Row Level Security (RLS) en Supabase

El Security Advisor marca tablas en `public` sin RLS como vulnerables: cualquier acceso vía PostgREST (clave `anon` / sesión `authenticated`) podría exponer datos si existieran políticas permisivas.

Las tablas **solo usadas desde el servidor** con Prisma (`RateLimit`, `EmailCampaignLog`, `CookieConsentLog`, `PasswordResetToken`, `StripeWebhookEvent`) tienen:

1. `ENABLE ROW LEVEL SECURITY`
2. Políticas que **deniegan** explícitamente a los roles `anon` y `authenticated`

El backend sigue funcionando porque la conexión de Prisma usa el rol de base de datos del proyecto (normalmente dueño de las tablas o con permisos que **no** están sujetos a las mismas restricciones que el cliente Supabase).

## Aplicar en un proyecto ya desplegado

Si la migración Prisma aún no se ha aplicado en Supabase:

```bash
npx prisma migrate deploy
```

O ejecuta el SQL de `prisma/migrations/20260331180000_enable_rls_backend_only_tables/migration.sql` en el **SQL Editor** del panel de Supabase.

## Comprobar

- Security Advisor: los avisos “RLS Disabled in Public” para esas tablas deben desaparecer tras aplicar la migración.
- La app: login, rate limit, webhooks Stripe, cookies y campañas por correo deben seguir igual (todo vía API/Prisma).

Si en algún momento usas el **cliente** Supabase en el navegador para leer una de estas tablas (no recomendado), tendrías que añadir políticas `USING (...)` que permitan solo lo necesario, en lugar de solo denegar.
