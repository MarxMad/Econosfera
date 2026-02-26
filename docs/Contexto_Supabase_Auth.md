# Contexto de Integración: Supabase + NextAuth

Este documento sirve como "memoria" del estado actual de la plataforma Econosfera respecto a su base de datos y sistema de autenticación.

## 1. Base de Datos (Supabase)
- **Proveedor:** PostgreSQL alojado en **Supabase** (tier gratuito).
- **Conexión:** La URL de conexión (Transaction pooler) está configurada en la variable de entorno `DATABASE_URL` dentro del archivo `.env`.
- **Sincronización:** Se utiliza Prisma ORM para gestionar los modelos. El esquema se empuja a Supabase usando `npx prisma db push`.

## 2. Esquema de Usuarios Actualizado (Prisma)
El modelo `User` en `prisma/schema.prisma` ha sido extendido recientemente y actualmente contiene:
- `id`: CUID (String)
- `name`: Nombre(s) (String opcional)
- `lastName`: Apellidos (String opcional)
- `email`: Correo electrónico (String, único)
- `password`: Contraseña hasheada con bcrypt
- `institution`: Institución educativa (String opcional)
- `credits`: Créditos de IA (Entero, por defecto 10)
- `emailVerified`: Fecha de verificación (Para futura integración con Resend)
- Relaciones con `Account`, `Session` y `Scenario`.

## 3. Autenticación (NextAuth)
- **Estrategia:** Se usa NextAuth con la estrategia de **Credentials** (Correo y Contraseña).
- **Registro (`/auth/register`):**
  - Formulario en dos columnas para Nombre y Apellidos.
  - Campo designado para Institución Educativa.
  - Validación dinámica (tiempo real) de contraseña y confirmación de contraseña, previniendo el envío si no coinciden.
  - Lógica procesada en `src/lib/actions/authActions.ts` (hashea contraseña con bcrypt y asigna créditos iniciales).
- **Inicio de Sesión (`/auth/signin`):**
  - Permite ingresar email y contraseña.
  - Implementación de botones ("Eye") para mostrar/ocultar contraseñas.

## 4. Notas Técnicas Importantes
- **Error de Prisma "Unknown argument":** Cuando se actualiza el esquema de Prisma (ej. añadiendo `lastName`), es necesario detener el servidor de Next.js (`npm run dev`), asegurar que se haya corrido `npx prisma db push` o `npx prisma generate`, y volver a iniciar el servidor. Esto limpia la caché del `PrismaClient` global y evita errores al intentar guardar datos nuevos.
