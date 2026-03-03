# Tareas: Mejoras e ingresos (basado en Lean Canvas)

Lista de tareas priorizadas para implementar. Marca con `[x]` al completar.

---

## Corto plazo (1–2 semanas) — Producto

### Paywall y conversión
- [ ] **Paywall en momento de valor**: Modal claro al intentar análisis IA o exportar (límite) con mensaje "Necesitas Estudiante Pro" + CTA a pricing. *(PricingModal mejorado.)*
- [ ] **Comparador Free vs Pro en la app**: Tabla en Dashboard (y opcional en simulador) con checkmarks Free / Pro / Researcher y enlace a `/pricing`. *(Componente PlanComparador.)*
- [ ] **Upsell al quedarse sin créditos**: Banner o mensaje destacado en Dashboard cuando créditos === 0: "Sin créditos. Recarga con Pro (50/mes) o Researcher (100/mes)" + botón a pricing.
- [x] **Bloqueo de simuladores por plan**: Free: 2 por categoría (básicos); Pro: 2 por categoría (avanzados); Researcher: todo. Tabs bloqueados muestran candado y `SimulatorLocked` con CTA a `/pricing`. Config en `src/lib/simulatorPlans.ts`.

### Dashboard
- [ ] **Sección "Tu siguiente paso"**: Un solo CTA por visita (ej. "Completa un análisis de minuta" o "Exporta tu primer reporte Macro") con enlace al simulador.

---

## Mediano plazo (1–2 meses) — Producto

- [ ] **Trial 7 días Pro**: Plan "Prueba Pro 7 días gratis" en Stripe; lógica de trial en backend y mensaje en pricing.
- [ ] **Precio anual con descuento**: Opción "Estudiante Pro anual $49 (2 meses gratis)" en página de pricing y en modal.
- [ ] **Onboarding guiado**: 3–4 pasos tras verificación (ej. "Prueba oferta y demanda", "Sube una minuta", "Descarga tu primer PDF"); opcional badge "Primer reporte".
- [ ] **Testimonios en landing y pricing**: 2–3 frases cortas con nombre e institución (con permiso); componente Testimonios.

---

## Largo plazo — Producto

- [ ] **Emails de re-engagement**: Resend: "No has entrado en 7 días" y "Nueva minuta de Banxico — analízala con IA" (solo verificados).
- [ ] **Gamificación ligera**: Insignias "Primera exportación", "Minuta analizada", "5 escenarios guardados" en perfil/dashboard.
- [ ] **Página "Usado en"**: Sección "Nos usan en" con logos o texto UNAM, ITAM, Tec, Ibero.
- [ ] **Rutas por rol**: "Ruta Estudiante" vs "Ruta Analista" con pasos y enlaces a simulador/glosario.
- [ ] **Referidos**: "Invita a un compañero → 5 créditos extra para ambos"; backend (código/link) + UI en Dashboard.

---

## Marketing — Campañas

- [ ] **SEM (Google/Bing)**: Anuncios búsqueda "simulador economía", "análisis minuta Banxico", "DCF", "regla de Taylor"; landing con CTA.
- [ ] **Meta (FB/IG)**: Audiencia 18–28, economía/finanzas/universidades; creativos "Deja de hacer reportes a mano"; retargeting a visitantes de /pricing.
- [ ] **LinkedIn**: Anuncios para profesores/analistas; mensaje "Simuladores + IA para minutas, reportes listos".
- [ ] **SEO**: Artículos en blog + glosario; CTAs "Pruébalo en Econosfera" en cada contenido.
- [ ] **Universidades**: Landing "Para instituciones" con formulario; contacto a coordinadores.
- [ ] **Discord/comunidades**: Retos o sorteos 1 mes Pro; participación útil en canales de economía.

---

## Marketing — Videos

### Cortos (Reels / Shorts / TikTok)
- [ ] "Analizo una minuta de Banxico en 30 segundos" (pantalla de la app).
- [ ] "De Excel a reporte en un clic."
- [ ] "Simulador oferta y demanda para el examen."
- [ ] "Regla de Taylor en 20 segundos."
- [ ] "DCF y Black‑Scholes sin Excel" (Pro).

### Tutoriales (YouTube)
- [ ] "Cómo analizar una minuta de Banxico con IA" (paso a paso).
- [ ] "Simulador de oferta y demanda — tutorial."
- [ ] "De la teoría a la entrega: Regla de Taylor y reporte."
- [ ] "Econosfera en 5 minutos" (tour + planes).

### Conversión
- [ ] Video hero en landing (UVP + CTA).
- [ ] Video en página de pricing ("Qué incluye Pro").
- [ ] Video retargeting 15 s: "¿Dejaste el reporte para el último momento?"

### Testimonios
- [ ] Grabar 1 estudiante, 1 profesor, 1 analista (30–60 s); usar en landing y pricing.

---

## Implementado (sprint actual)

- [x] **Comparador Free vs Pro en Dashboard**: Componente `PlanComparador` con tabla (precio, créditos, exportaciones) y enlace a `/pricing`.
- [x] **Banner 0 créditos en Dashboard**: Mensaje destacado cuando créditos === 0: "Sin créditos. Recarga con Pro (50/mes) o Researcher (100/mes)" + CTA a pricing.
- [x] **Sección "Tu siguiente paso" en Dashboard**: Un CTA claro (ir al simulador; si sin créditos, también "Ver planes Pro").
- [x] **PricingModal**: Copy tipo paywall: "Necesitas Estudiante Pro", $4.99/mes, 50 créditos, exportaciones ilimitadas, DCF/Black-Scholes; opción anual $49 (2 meses gratis).
- [x] **Bloqueo de simuladores por plan**: Free (2/categoría): Inflación core+tasaReal; Macro standard+solow; Micro mercado+elasticidad; Finanzas basico+mapas; Actuaría mortalidad+poder; Estadística regresión; Blockchain halving+cadenabloques. Pro (+2/categoría): taylor+comparador; phillips+mundell; estructuras+juegos; valuacion+pro; ruina; tcl; trading+staking. Researcher: todo (ai; amm, llaves, merkle, consenso, redp2p, smartcontracts en Blockchain). Componente `SimulatorLocked` y `simulatorPlans.ts`.
