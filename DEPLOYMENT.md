# 🚢 Guía de Despliegue Econosfera

Sigue estos pasos para lanzar la terminal Econosfera al mundo.

## 1. Base de Datos (Supabase / Postgres)
1. Crea un proyecto en [Supabase](https://supabase.com).
2. Obtén la `DATABASE_URL` y la `DIRECT_URL`.
3. Ejecuta las migraciones localmente apuntando a prod:
   ```bash
   npx prisma db push
   ```

## 2. Autenticación (Google Cloud)
1. En [Google Cloud Console](https://console.cloud.google.com), crea un proyecto.
2. Configura la pantalla de consentimiento OAuth.
3. Crea credenciales de "ID de cliente de OAuth 2.0" (Aplicación Web).
4. Añade las URI de redireccionamiento autorizadas:
   - `http://localhost:3000/api/auth/callback/google` (Dev)
   - `https://tusitio.vercel.app/api/auth/callback/google` (Prod)
5. Obtén `GOOGLE_CLIENT_ID` y `GOOGLE_CLIENT_SECRET`.

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
2. Configura las siguientes variables de entorno:
   - `DATABASE_URL`
   - `DIRECT_URL`
   - `NEXTAUTH_SECRET` (Genera una con `openssl rand -base64 32`)
   - `NEXTAUTH_URL` (Tu URL de producción)
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `OPENAI_API_KEY`
   - `RESEND_API_KEY`
   - `NEXT_PUBLIC_SITE_URL` (Ej: https://econosfera.com)
   - `STRIPE_SECRET_KEY`

## 6. Siguiente Nivel (Producción Real)
- **Monitoreo**: Instala Sentry para capturar errores de usuarios reales.
- **Analytics**: Añade Vercel Analytics o Google Analytics.
- **SEO**: Revisa el archivo `sitemap.ts` generado para asegurar que todas las rutas sean rastreables.

¡Listo para el despegue! 🚀
