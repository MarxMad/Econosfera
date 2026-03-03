# Verificación de email

La plataforma exige verificación de correo para poder usar créditos de IA, exportar PDF y guardar escenarios. Así se evita el abuso por creación masiva de cuentas.

## Flujo

1. **Registro**: El usuario se registra y recibe un correo con un enlace de verificación (válido 1 hora).
2. **Sin verificar**: Puede iniciar sesión pero verá 0 créditos y no podrá usar análisis IA, exportaciones ni guardar escenarios hasta verificar.
3. **Verificación**: Al hacer clic en el enlace se marca `emailVerified` y se redirige a `/auth/signin?verified=1`.
4. **Tras verificar**: Al iniciar sesión de nuevo, la sesión incluye los créditos reales y todas las funciones se desbloquean.

## Variables de entorno

- **`NEXT_PUBLIC_SITE_URL`**: Debe ser la URL pública de la app (p. ej. `https://econosfera.xyz`) para que el enlace del correo apunte a tu dominio y no a localhost o a la URL de Vercel si quieres usar tu propio dominio.
- **`RESEND_API_KEY`**: Para enviar los correos (Resend). Sin esta variable no se envía el email y el registro sigue funcionando, pero el usuario no recibirá el enlace.
- **`RESEND_FROM`** (opcional): Remitente del correo. Debe usar un email de tu dominio verificado en Resend, p. ej. `Econosfera <noreply@econosfera.xyz>` o `Econosfera <seguridad@econosfera.xyz>`. Por defecto el código usa `Econosfera <noreply@econosfera.xyz>`.

## Rutas y acciones

- **GET `/api/auth/verify?token=...`**: Valida el token, marca el usuario como verificado y redirige a `/auth/signin?verified=1`.
- **`resendVerification()`**: Reenvía el correo (requiere sesión). Usado en el banner “Verifica tu correo”.
- **`resendVerificationByEmail(email)`**: Reenvía el correo solo con el email (sin sesión). Usado en la pantalla de éxito del registro.

## Comprobaciones en servidor

Las acciones que consumen créditos comprueban `emailVerified` antes de descontar:

- `analizarMinutaBanxico` (análisis IA)
- `registrarExportacion` (exportar PDF)
- `saveScenario` (guardar escenario)

Si el usuario no está verificado, devuelven un error indicando que debe verificar su correo.
