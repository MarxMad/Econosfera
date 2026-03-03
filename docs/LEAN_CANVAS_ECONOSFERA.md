# Lean Canvas — Econosfera

**Producto:** Econosfera — Terminal de simulación económica y financiera  
**Dominio:** econosfera.xyz  
**Última actualización:** 2025

---

## 1. Problema (top 3)

| # | Problema | Evidencia / contexto |
|---|----------|----------------------|
| 1 | Los estudiantes de economía y finanzas practican con hojas de cálculo o software genérico; no tienen un puente claro entre teoría (Regla de Taylor, IS-LM, oferta y demanda) y práctica cuantitativa (DCF, opciones, minutas). | Tareas en Excel, poco feedback inmediato, materiales dispersos. |
| 2 | Analizar minutas de bancos centrales (ej. Banxico) es manual y lento; no hay herramientas accesibles que extraigan posturas (hawkish/dovish), votos y riesgos de forma automatizada. | Análisis manual por texto, tiempo alto por minuta. |
| 3 | Exportar y compartir escenarios (PDF, reportes) para entregas o comités requiere armar documentos a mano; no hay flujo integrado simulador → reporte profesional. | Copiar/pegar resultados, formatos inconsistentes. |

---

## 2. Segmentos de clientes

| Segmento | Descripción | Dolor principal |
|----------|-------------|------------------|
| **Estudiantes (economía, finanzas, actuaría)** | Universidades como UNAM, ITAM, Tec, Ibero. Necesitan practicar modelos y entregar ejercicios. | Necesitan créditos IA limitados, exportar PDF y guardar escenarios; presupuesto bajo. |
| **Profesores / docentes** | Imparten macro, micro, finanzas o política monetaria. | Material didáctico listo para clase y referencias académicas (glosario, fuentes). |
| **Analistas e investigadores** | Profesionales que modelan escenarios, valuación (DCF, Black-Scholes) o economía blockchain. | Herramientas “Wall Street grade”, más créditos IA, exportación ilimitada, soporte. |

**Early adopters:** Estudiantes de economía y finanzas que ya buscan simuladores en línea y están dispuestos a crear cuenta y verificar correo a cambio de créditos y exportación.

---

## 3. Propuesta única de valor (UVP)

**Una sola frase:**

> El puente entre la teoría económica y el análisis institucional: simuladores profesionales + IA para minutas + reportes listos para entregar o comité.

**Versión corta para landing:**

> El simulador profesional. Modela, proyecta y opera con poder de IA y herramientas de nivel institucional.

---

## 4. Solución (top 3 características)

| # | Solución | Cómo se entrega en Econosfera |
|---|----------|-------------------------------|
| 1 | Simuladores integrados por área (inflación, macro, micro, finanzas, actuaría, estadística, blockchain) con fórmulas visibles y resultados en tiempo real. | Módulos con sliders, fórmulas (P = a − b·Q, Taylor, IS-LM, DCF, etc.), gráficos y comparador de escenarios. |
| 2 | Análisis de minutas con IA: posturas, votos, balance de riesgos y resumen ejecutivo en segundos. | Subida de PDF/TXT de actas; análisis semántico; consumo de créditos (10 por análisis); exportación del reporte a PDF. |
| 3 | Exportación profesional: reportes PDF por módulo, minuta analizada y comparador; flujo “simular → descargar / compartir” sin salir de la plataforma. | Botón “Reporte PDF” en cada módulo; verificación de correo para desbloquear créditos y evitar farmeo. |

**Extras que refuerzan la propuesta:** Glosario de términos económicos, blog premium, citación (APA, Chicago, BibTeX), referencias académicas y fuentes oficiales (Banxico, INEGI).

---

## 5. Canales

| Canal | Uso |
|-------|-----|
| **Producto (econosfera.xyz)** | Landing, registro, verificación de email, simulador, pricing, manual, glosario, blog. |
| **SEO / contenido** | Glosario indexable, manual, blog (política monetaria, macro, finanzas). |
| **Instituciones** | Mensaje tipo “¿Eres alumn@ de UNAM?” y convenios o descuentos con universidades. |
| **Comunidad** | Discord (mencionado en plan gratuito); posible extensión a redes y referidos. |
| **Pagos** | Planes Free / Estudiante Pro ($4.99/mes) / Researcher ($9.99/mes) vía página de pricing y flujo de pago. |

---

## 6. Flujo de ingresos

| Fuente | Modelo | Precio |
|--------|--------|--------|
| **Plan Gratuito** | Freemium: valor de captación y uso básico. | $0 |
| **Estudiante Pro** | Suscripción mensual: más créditos IA, exportaciones ilimitadas, modelos Pro (DCF, Black-Scholes, Merkle). | $4.99/mes |
| **Researcher** | Suscripción mensual: máximo créditos, simuladores full (Smart Contracts, P2P), soporte prioritario. | $9.99/mes |

**Métricas de ingresos:** MRR, conversión Free → Pro/Researcher, LTV por plan, uso de créditos por usuario.

---

## 7. Estructura de costos

| Concepto | Tipo | Notas |
|----------|------|--------|
| **Hosting / infra** | Fijo | Vercel (dominio + hosting), base de datos (PostgreSQL). |
| **APIs externas** | Variable | OpenAI (análisis de minutas), Resend (emails de verificación). |
| **Almacenamiento** | Variable | Supabase u otro para avatares y datos si aplica. |
| **Pagos** | Variable | Comisión por transacción (Stripe o similar). |
| **Tiempo / desarrollo** | Fijo | Mantenimiento, nuevas funcionalidades, soporte. |

**Control de abuso:** Verificación de email obligatoria para usar créditos y exportar; límite de créditos por plan para acotar coste variable de IA.

---

## 8. Métricas clave

| Métrica | Objetivo / uso |
|---------|-----------------|
| **Usuarios registrados** | Crecimiento y base para conversión. |
| **Cuentas verificadas (email)** | Porcentaje que desbloquea créditos y exportación. |
| **Uso de créditos IA** | Consumo por usuario/plan; indicador de valor percibido. |
| **Exportaciones PDF** | Uso de la funcionalidad “reporte profesional”. |
| **Conversión Free → Pro / Researcher** | Eficacia del modelo de precios y del onboarding. |
| **Retención (mensual)** | Churn de suscriptores; mejora de contenido y UX. |
| **Tiempo en simulador / sesiones** | Engagement y utilidad percibida. |

---

## 9. Ventaja injusta (difícil de copiar)

| Elemento | Descripción |
|----------|-------------|
| **Contenido académico integrado** | Glosario, referencias (Banxico, CEMLA, UNAM, CIDE), fórmulas y manual alineados con programas de economía en México y Latinoamérica. |
| **Stack único** | Combinación simuladores (inflación, macro, micro, finanzas, actuaría, estadística, blockchain) + IA para minutas + exportación PDF + verificación de correo y créditos, en una sola plataforma. |
| **Confianza institucional** | Mensaje dirigido a alumnos de UNAM, ITAM, Tec, Ibero; posibilidad de convenios y uso en clase. |
| **Citar la herramienta** | APA, Chicago, BibTeX con URL canónica (econosfera.xyz); refuerza uso académico y credibilidad. |

---

## Resumen visual (una línea por bloque)

```
Problema          → Teoría desconectada de la práctica; análisis manual de minutas; reportes hechos a mano.
Clientes          → Estudiantes, docentes, analistas (México / LATAM).
UVP               → Simulador profesional + IA para minutas + reportes listos para entregar.
Solución          → Módulos integrados + análisis IA + exportación PDF y verificación de correo.
Canales           → Web, SEO, instituciones, comunidad, pricing/pagos.
Ingresos          → Free + Pro $4.99/mes + Researcher $9.99/mes.
Costos            → Hosting, APIs (OpenAI, Resend), pagos, tiempo.
Métricas          → Registros, verificados, créditos, exportaciones, conversión, retención.
Ventaja injusta   → Contenido académico + stack integrado + enfoque institucional + citación.
```

---

*Metodología: Lean Canvas (Ash Maurya), adaptado para producto digital B2C/B2B educativo.*
