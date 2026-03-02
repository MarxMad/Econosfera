# Configurar inicio de sesión con Google (OAuth)

Para que **“Iniciar sesión con Google”** y **“Continuar con Google”** funcionen en Econosfera, hay que configurar unas credenciales en Google Cloud y las variables de entorno en tu app.

---

## 1. Crear proyecto y credenciales en Google Cloud

1. Entra en **[Google Cloud Console](https://console.cloud.google.com/)** e inicia sesión con tu cuenta de Google.

2. **Crear o elegir proyecto**
   - Arriba, junto a “Google Cloud”, abre el selector de proyectos.
   - “Nuevo proyecto” → nombre (ej. “Econosfera”) → Crear.
   - O elige un proyecto existente.

3. **Pantalla de consentimiento OAuth**
   - Menú ☰ → **APIs y servicios** → **Pantalla de consentimiento de OAuth**.
   - Si es la primera vez, elige **Externo** (para que cualquier cuenta de Google pueda iniciar sesión) → Crear.
   - Rellena:
     - **Nombre de la aplicación:** Econosfera
     - **Correo de asistencia:** tu email
     - **Dominios autorizados** (en producción): tu dominio, ej. `econosfera.vercel.app`
   - Guarda. No hace falta añadir “ámbitos” extra para login básico (email y perfil).

4. **Crear credenciales OAuth 2.0**
   - Menú ☰ → **APIs y servicios** → **Credenciales**.
   - **+ Crear credenciales** → **ID de cliente de OAuth 2.0**.
   - **Tipo de aplicación:** “Aplicación web”.
   - **Nombre:** por ejemplo “Econosfera Web”.
   - **URIs de redirección autorizados** (muy importante):
     - Desarrollo local:
       ```text
       http://localhost:3000/api/auth/callback/google
       ```
     - Producción (sustituye por tu dominio):
       ```text
       https://tu-dominio.vercel.app/api/auth/callback/google
       ```
       Si tienes dominio propio:
       ```text
       https://econosfera.com/api/auth/callback/google
       ```
   - Añade **todas** las URLs donde vayas a usar el login (localhost y cada dominio de producción).
   - **Crear**.
   - Copia el **ID de cliente** (ej. `xxxxx.apps.googleusercontent.com`) y el **Secreto del cliente**.

---

## 2. Variables de entorno en tu app

En tu archivo **`.env`** (local) o en **Vercel → Settings → Environment Variables** (producción), define:

```env
# Obligatorias para Google
GOOGLE_CLIENT_ID="tu-id-de-cliente.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="tu-secreto-del-cliente"

# NextAuth (necesarias para que el callback funcione)
NEXTAUTH_URL="http://localhost:3000"   # En producción: https://tu-dominio.com
NEXTAUTH_SECRET="genera-uno-con-openssl-rand-base64-32"
```

- **En local:** `NEXTAUTH_URL` debe ser `http://localhost:3000` (o el puerto que uses).
- **En producción:** `NEXTAUTH_URL` debe ser **exactamente** la URL pública de la app (sin barra final), y esa misma base debe estar en “URIs de redirección autorizados” en Google.

---

## 3. Comprobar que funciona

1. Reinicia el servidor de desarrollo (`npm run dev`) o haz un nuevo deploy en Vercel.
2. Entra en **Iniciar sesión** o **Registrarse** y haz clic en **Google**.
3. Deberías ir a la pantalla de Google, iniciar sesión y volver a tu app ya autenticado.

---

## Errores frecuentes

| Síntoma | Causa | Solución |
|--------|--------|----------|
| “redirect_uri_mismatch” | La URL de callback no está en Google Console. | Añade en “URIs de redirección autorizados” exactamente: `NEXTAUTH_URL/api/auth/callback/google` (ej. `https://tu-dominio.com/api/auth/callback/google`). |
| “Error 400: redirect_uri_mismatch” | En producción usas otra URL (preview, otro dominio). | Añade esa URL en Google Console o usa siempre la misma `NEXTAUTH_URL` que en producción. |
| No pasa nada / error genérico | `GOOGLE_CLIENT_ID` o `GOOGLE_CLIENT_SECRET` vacíos o incorrectos. | Revisa que estén bien copiados en `.env` o en Vercel, sin espacios. |
| “Server error” al volver de Google | Falta `NEXTAUTH_SECRET` o fallo de base de datos. | Revisa `NEXTAUTH_SECRET` y `DATABASE_URL` en el entorno donde falla (ver [DEPLOYMENT.md](../DEPLOYMENT.md)). |

---

## Resumen

1. **Google Cloud Console:** Crear proyecto → Pantalla de consentimiento OAuth → Credenciales → ID de cliente OAuth 2.0 (tipo “Aplicación web”) con **URIs de redirección** = `{NEXTAUTH_URL}/api/auth/callback/google` para cada entorno.
2. **App:** Definir `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `NEXTAUTH_URL` y `NEXTAUTH_SECRET`.
3. En producción, la URL de redirección en Google debe coincidir con la `NEXTAUTH_URL` que uses en ese entorno.
