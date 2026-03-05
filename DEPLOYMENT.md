# 🚢 Guía de Despliegue Econosfera

Sigue estos pasos para lanzar la terminal Econosfera al mundo.

## 1. Base de Datos (Supabase / Postgres)
1. Crea un proyecto en [Supabase](https://supabase.com).
2. Obtén la `DATABASE_URL` y la `DIRECT_URL`.
3. **Sincroniza el esquema con la base de producción** (obligatorio antes de usar registro/login en prod):
   ```bash
   # Con las variables de producción en .env (o exportándolas):
   npx prisma db push
   ```
   Usa `DIRECT_URL` para la conexión (Supabase suele usar pooling en DATABASE_URL; para cambios de esquema hace falta la conexión directa). Si en producción falla con "The column User.phone does not exist", es que la base de prod no tiene las columnas actuales: ejecuta este comando apuntando a prod para crear las columnas que faltan.
4. **Seguridad (RLS):** Supabase avisa si Row Level Security no está habilitado. Desde el proyecto (con `.env` con `DIRECT_URL` o `DATABASE_URL`) ejecuta una vez: `npm run db:rls`. Ese script usa Prisma para aplicar RLS en todas las tablas; tu app sigue funcionando porque Prisma se conecta con usuario que hace bypass RLS. Alternativamente puedes pegar y ejecutar `scripts/supabase-enable-rls.sql` en el SQL Editor de Supabase.

## 2. Autenticación (Google Cloud)
1. En [Google Cloud Console](https://console.cloud.google.com), crea un proyecto.
2. Configura la pantalla de consentimiento OAuth.
3. Crea credenciales de "ID de cliente de OAuth 2.0" (Aplicación Web).
4. Añade las URI de redireccionamiento autorizadas:
   - `http://localhost:3000/api/auth/callback/google` (Dev)
   - `https://econosfera.xyz/api/auth/callback/google` (Prod, dominio propio)
   - `https://tusitio.vercel.app/api/auth/callback/google` (si usas subdominio Vercel)
5. Obtén `GOOGLE_CLIENT_ID` y `GOOGLE_CLIENT_SECRET`.
6. **Guía detallada:** Ver [docs/GOOGLE_OAUTH_SETUP.md](docs/GOOGLE_OAUTH_SETUP.md) para paso a paso y solución de errores (redirect_uri_mismatch, etc.).
7. Cuando esté listo, pon `NEXT_PUBLIC_GOOGLE_OAUTH_ENABLED=true` en Vercel para mostrar el botón de Google.

## 3. Email (Resend)
1. Regístrate en [Resend](https://resend.com).
2. Verifica tu dominio en la sección "Domains".
3. Genera una API Key y guárdala como `RESEND_API_KEY`.

## 4. Pagos (Stripe)
1. Entra al Dashboard de [Stripe](https://stripe.com).
2. Crea tus productos (Estudiante Pro, etc.) como suscripciones recurrentes.
3. Obtén las claves de API `STRIPE_SECRET_KEY` y `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`.

## 5. Hosting (Vercel)
1. Conecta tu repositorio de GitHub a Vercel.
2. **Dominio:** Configura tu dominio (ej. **econosfera.xyz**) en Vercel → Project → Settings → Domains.
3. Configura las siguientes variables de entorno (para **Production** y, si quieres, Preview):
   - `DATABASE_URL`
   - `DIRECT_URL`
   - `NEXTAUTH_SECRET` **(obligatorio)** — Genera una con `openssl rand -base64 32`. Sin ella, el login devuelve "Server error / problem with server configuration".
   - `NEXTAUTH_URL` **(obligatorio en producción)** — URL pública de la app, **sin barra final**. Ejemplos:
     - `https://econosfera.xyz` (dominio propio)
     - `https://econosfera.vercel.app` (subdominio Vercel)
   - `NEXT_PUBLIC_SITE_URL` — Misma URL que uses en `NEXTAUTH_URL` (ej. `https://econosfera.xyz`).
   - `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` (si usas login con Google).
   - `NEXT_PUBLIC_GOOGLE_OAUTH_ENABLED="true"` — Solo cuando tengas Google OAuth listo; si no, el botón de Google permanece oculto.
   - `OPENAI_API_KEY`
   - `RESEND_API_KEY`
   - `STRIPE_SECRET_KEY`

## 6. Siguiente Nivel (Producción Real)
- **Monitoreo**: Instala Sentry para capturar errores de usuarios reales.
- **Analytics**: Añade Vercel Analytics o Google Analytics.
- **SEO**: Revisa el archivo `sitemap.ts` generado para asegurar que todas las rutas sean rastreables.

¡Listo para el despegue! 🚀
