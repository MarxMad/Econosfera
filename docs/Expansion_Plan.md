# Plan de Expansión: Econosfera Terminal v2.0

Este documento detalla la hoja de ruta para implementar la suite completa de simuladores académicos y profesionales en Econosfera.

## 1. Estructura de Archivos (Organización)
Para mantener la escalabilidad, se crearán carpetas dedicadas por materia:
- `src/components/simuladores-macro/`: Solow, Phillips, Mundell-Fleming.
- `src/components/simuladores-micro/`: Nash, Monopolios, Elasticidad.
- `src/components/simuladores-finanzas/`: Markowitz, Black-Scholes, Yield Curve.
- `src/components/simuladores-actuaria/`: Mortalidad, Ruina, Pensión.
- `src/components/simuladores-econometria/`: Regresión, Teorema Límite Central.

## 2. Fases de Implementación

### Fase 1: Macroeconomía Avanzada (Académica)
- **Simulador de Crecimiento de Solow:** Modelado de estado estacionario y regla de oro.
- **Curva de Phillips Dinámica:** Relación desempleo-inflación y expectativas.
- **Modelo Mundell-Fleming:** Efectos de política en economía abierta.

### Fase 2: Finanzas Cuantitativas (Profesional)
- **Optimizador de Portafolios (Markowitz):** Frontera eficiente y cálculo de pesos.
- **Calculadora Black-Scholes:** Valuación de opciones y griegas.
- **Yield Curve Builder:** Curva de tipos y predicción de ciclos.

### Fase 3: Vertical Actuarial y Riesgo
- **Visor de Tablas de Mortalidad:** Proyección de esperanza de vida.
- **Simulador de Ruina (Monte Carlo):** Gestión de capital de riesgo.
- **Calculadora de Valor del Dinero en el Tiempo:** Interés real vs Inflación.

### Fase 4: Estrategia y Estadística
- **Simulador de Teoría de Juegos:** Matriz de pagos y Equilibrio de Nash.
- **Laboratorio de Econometría:** Regresión visual y diagnóstico básico.
- **Demostrador del Teorema del Límite Central:** Simulación de distribuciones.

## 3. Integración en el Dashboard
- Actualizar `SimuladorApp.tsx` para incluir las nuevas categorías.
- Expandir el `NavSimuladores.tsx` para navegación fluida.
- Implementar badges de "Nuevo" o "Beta" en las herramientas recién añadidas.

---
**Estado Actual:** Planificación completada. Iniciando Fase 1.
