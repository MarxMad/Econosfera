# Plan de Implementación: Resend y Stripe (Suscripciones)

Este documento detalla los pasos técnicos y lógicos para integrar validación de correos electrónicos con Resend y la pasarela de pagos con Stripe para manejar los planes de suscripción de Econosfera.

## 1. Verificación de Correo con Resend (Antispam)
**Requisito previo:** Tener un dominio propio (ej. `econosfera.com`) verificado en Resend.

### Pasos:
1. **Configurar Resend:**
   - Crear cuenta en Resend.com.
   - Añadir y verificar el dominio mediante registros DNS (TXT/MX).
   - Generar API Key (`RESEND_API_KEY`).
2. **Actualizar Prisma Schema:**
   - Añadir modelo `VerificationToken` (si no existe) para almacenar los tokens de verificación temporal.
   - Añadir campo `emailVerified: DateTime?` al modelo `User`.
3. **Integración Backend (NextAuth & Acciones):**
   - Instalar SDK: `npm install resend`
   - Configurar NextAuth para que al detectar un registro por email, genere un token de verificación y lo guarde en Prisma.
   - Crear una función en `/lib/email.ts` que utilice Resend para enviar un correo con diseño (HTML o React-Email) conteniendo el enlace: `https://econosfera.com/auth/verify?token=XYZ...`
4. **Endpoint de Verificación:**
   - Crear la ruta `/app/auth/verify/route.ts` que reciba el `token`, busque en la base de datos, marque al usuario como verificado (`emailVerified: new Date()`) y borre el token.
5. **UI (Frontend):**
   - Bloquear acceso a funciones avanzadas o mostrar el "Banner Naranja" en el dashboard hasta que `session.user.emailVerified` sea válido.

## 2. Pasarela de Pagos (Stripe) y Lógica de Suscripciones

### Definición de Planes & Límites:
- **Plan Gratuito:** 2 análisis de IA y 1 exportación a PDF en toda la vida útil de la cuenta (o por mes, según se defina la renovación).
- **Plan Estudiante ($4.99 USD/mes):** 10 análisis de IA mensuales, exportaciones a PDF ilimitadas.
- **Plan Pro ($9.99 USD/mes):** Análisis de IA ilimitados (o límite alto), PDF ilimitados, acceso a recursos premium y exámenes.

### Pasos:
1. **Configurar Stripe (Dashboard):**
   - Crear cuenta en Stripe.
   - En sección "Productos", crear 2 productos recurrentes: "Plan Estudiante" (precio $4.99) y "Plan Pro" (precio $9.99).
   - Obtener claves: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`.
2. **Actualizar Prisma Schema:**
   - Añadir campos al modelo `User`:
     - `stripeCustomerId: String?`
     - `stripeSubscriptionId: String?`
     - `stripePriceId: String?`
     - `stripeCurrentPeriodEnd: DateTime?`
     - `plan: String @default("FREE")` // FREE, STUDENT, PRO
     - `pdfExportsUsed: Int @default(0)`
3. **Endpoints de Checkout (Backend):**
   - Instalar SDK: `npm install stripe`
   - Crear un Server Action o API Route (`/api/stripe/checkout`) que reciba el identificador del plan que el usuario eligió.
   - Generar una sesión de Checkout (`stripe.checkout.sessions.create`) vinculada al `userId`, que redirija a Stripe para procesar el pago y luego regrese al Dashboard.
4. **Webhooks (El "Listener"):**
   - Crear el endpoint `/api/webhook/stripe/route.ts` para escuchar eventos enviados por Stripe (ej. `checkout.session.completed`, `invoice.payment_succeeded`, `customer.subscription.deleted`).
   - Al recibir pago exitoso, actualizar en la base de datos: el plan del usuario, resetear su conteo de créditos/PDFs y extender su vigencia.
5. **Controlador Lógico (En los simuladores):**
   - **Para Inteligencia Artificial:** Antes de procesar el prompt de OpenAI, checar el plan. Si es `FREE`, confirmar que `credits > 0`. Si gastó sus 2, retornar error: "Alcanzaste tu límite gratuito. Mejora tu plan."
   - **Para Exportar PDF:** Al dar clic al botón, llamar a un Server Action que valide: Si plan == FREE, checar `pdfExportsUsed < 1`. Si ya lo usó, mostrar modal bloqueando la exportación y ofreciendo el plan Estudiante. Si tiene plan pagado, permitir directamente. Incrementarlo si se usó exitosamente.
6. **Portal de Facturación (Opcional pero Recomendado):**
   - Configurar "Customer Portal" de Stripe para que el usuario, desde su Dashboard, dé clic en "Gestionar Suscripción" y pueda cancelar o actualizar sus datos de tarjeta directamente en la interfaz segura de Stripe.
