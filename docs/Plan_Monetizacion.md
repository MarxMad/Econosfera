# Plan de Implementación de Seguridad y Monetización 🚀

## Fase 1: Sellado de Seguridad (Cerrando la Plataforma) ✅
- **Autenticación Obligatoria Universal:** Hemos integrado un Middleware global en la aplicación. Absolutamente todas las rutas de simulación, calculadoras, dashboard y mercado financiero ahora exigen un token de sesión (Google u OAuth). Esto previene que usuarios anónimos (anons) consuman tráfico y datos sin estar registrados en la Base de Datos.
- **Rutas públicas exceptuadas:** Sólo los endpoints de NextAuth (`api/auth/*`) y la pantalla de Login público (`auth/signin`) están libres. Si alguien trata de entrar a `/simulador`, será redirigido inmediatamente.

## Fase 2: Control de IA y Costos de Operación 🤖💰
El diagnóstico actual muestra que el costo base de OpenAI (GPT/Claude) por un análisis de minuta o interpretación económica cuesta en promedio `$0.33 USD` por solicitud (incluyendo tokens de contexto abundantes).
- **Mailing de Cuentas Nuevas (Fuga de Dinero):** A cada usuario nuevo **NO** se le entregarán créditos infinitos de IA. 
- **Tokenomics Propuesto:** 
  1. Los nuevos usuarios recibirán sólo **3 Créditos de IA Gratis** para hacer un "gancho" comercial (Hook).
  2. Si un crédito nos cuesta $0.33 USD, el paquete mínimo que le venderemos a los usuarios de la plataforma debería asegurar que vendamos los análisis al menos al **doble de precio**, es decir `$0.66 USD` hasta `$1.00 USD` por "crédito de análisis en profundidad".
  3. Esto asegura un margen de ganancia de más del 100% sobre los costos de LLM, blindándonos contra abusos de bots o usuarios intentando "vaciarnos el balance".

## Fase 3: Monetización Principal (SaaS Freemium) 💳
La exportación y creación de reportes financieros no nos cuesta directamente, por lo que es **rentabilidad pura** de alto margen. Es ahí donde debemos forzar al cliente a suscribirse.

1. **Stripe Integration & Paywall de Exportación:**
   - La funcionalidad actual de **Exportar a PDF**, Enlaces interactivos o Reportes de Valuación será gratuita **solo para los primeros 2 o 3 exportes del mes** por usuario.
   - El sistema usa créditos: cada exportación PDF consume 1 crédito. FREE: 10 créditos. Pro: 50/mes. Researcher: ilimitadas.
   - Cuando el usuario no tiene créditos (credits < 1), se abre el modal de Pricing para invitar a Pro o Researcher.

2. **Cálculos Avanzados (Tier Empresarial/Analistas):** 
   - A los modelos actuales añadiremos una capa "PRO". El simulador de Valuación tendrá herramientas de **Proyección DCF de 5 a 10 años**, métricas WACC y conexión con APIs Bursátiles en vivo. 
   - Si no tienes la suscripción activa, el acceso a la calculadora de Flujo de Caja Descontado estará visualmente bloqueado (lock icon).

### Próximos Pasos en el Código:
1. Conectar Stripe (o LemonSqueezy) a una nueva página `/pricing`.
2. Actualizar la nueva tabla `User` (el campo `credits`) para descontar saldo duro (-1) cuando se haga un Análisis de Banco Central. 
3. Crear un Paywall en los botones de "Exportar a PDF" dentro de `ExportarCompartir.tsx` y `SimuladorValuacion.tsx` que evalúe si el usuario tiene una suscripción "Pro" activa.
