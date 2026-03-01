# Plan Maestro de Revisión, Debugging y Estandarización: Econosfera 🚀

Este plan sirve como guía para auditar, estandarizar y blindar contra errores cada rincón de la plataforma. El objetivo es que Econosfera se sienta como un producto **Premium**, coherente y libre de bugs matemáticos o visuales.

---

## 1. Los 5 Mandamientos de Estandarización (CHECKLIST)

Para cada simulador en el código, debemos verificar que se cumplan estos puntos obligatoriamente:

1.  **UI Coherente (The "Cool Design")**:
    *   **Headers**: Título `font-black`, subtítulo `text-slate-500` e íconos con opacidad `opacity-10`.
    *   **Colores**: Macro (Blue), Micro (Emerald/Teal), Finanzas (Amber/Blue), Blockchain (Violet/Indigo).
    *   **Gradients**: Usar `linearGradients` en los gráficos de Recharts.
2.  **Inputs Inteligentes**:
    *   Sustituir inputs nativos por el componente `<InputLibre />` o un `Slider` personalizado que maneje estados de edición y redondeo.
3.  **Matemática Robusta**:
    *   Memoización de cálculos pesados con `useMemo`.
    *   Manejo de divisiones por cero o valores negativos en logaritmos (especialmente en Black-Scholes y DCF).
4.  **Funcionalidades de Exportación**:
    *   Botón de "Reporte PDF" siempre presente y funcional.
    *   Integración con `registrarExportacion` para analíticas y créditos.
5.  **Persistencia (Db & Auth)**:
    *   Botón "Guardar Escenario" para usuarios logueados.
    *   Validación de `isPro` o `isResearcher` para bloquear funciones avanzadas.

---

## 2. Inventario de Auditoría (Fase por Fase)

### Fase A: Macroeconomía 🌎
Ubicación: `src/components/SimuladorMacro.tsx` y `src/components/simuladores-macro/`
- [ ] **Multiplicador Keynesiano**: Revisar gráficos 45° y multiplicadores.
- [ ] **Modelo IS-LM**: Validar punto de equilibrio r-Y.
- [ ] **Crecimiento (Solow)**: Verificar dinámica de acumulación de capital.
- [ ] **Curva de Phillips**: Revisar relación inflación-desempleo.
- [ ] **Mundell-Fleming (IS-LM-BP)**: Verificar equilibrio en economía abierta.

### Fase B: Microeconomía 🔬
Ubicación: `src/components/SimuladorMicro.tsx` y `src/components/simuladores-micro/`
- [ ] **Oferta y Demanda**: Revisar excedentes y equilibrio.
- [ ] **Elasticidad (Arco/Punto)**: Validar fórmulas e interpretaciones.
- [ ] **Estructuras de Mercado**: Competencia perfecta, Monopolio, Oligopolio.
- [ ] **Teoría de Juegos**: Verificar matrices de pagos y equilibrio de Nash.

### Fase C: Finanzas Clásicas 💰
Ubicación: `src/components/simuladores-finanzas/`
- [ ] **Valuación VPVF**: Revisar interés compuesto y tasas efectivas.
- [ ] **Valuación de Bonos**: Auditoría de flujos y sensibilidad YTM.
- [ ] **Inversión Cetes**: Validar impuestos y rendimientos reales.
- [ ] **Proyección de Ahorro**: Revisar interés compuesto a largo plazo.
- [ ] **Valuación DCF**: **CRÍTICO**. Evaluar WACC y Valor Terminal.
- [ ] **Black-Scholes**: Verificar primas Call/Put y Griegas.
- [ ] **Markowitz (Frontera Eficiente)**: Optimización de portafolios.
- [ ] **Yield Curve (Estructura Temporal)**: Visualización de tasas.

### Fase D: Blockchain & Cripto ⛓️
Ubicación: `src/components/BlockchainEcon.tsx` y `src/components/simuladores-finanzas/`
- [ ] **Halving (Emisión)**: Escasez digital y Stock-to-Flow.
- [ ] **Simulador de Trading**: Gestión de balance y órdenes.
- [ ] **AMM (Liquidez)**: Curva x*y=k y slippage.
- [ ] **Staking**: Rendimiento por participación.
- [ ] **Cadena de Bloques**: Visualización de hashes y bloques.
- [ ] **Algoritmos de Consenso**: PoW vs PoS.
- [ ] **Smart Contracts**: Ejecución lógica simulada.
- [ ] **Red P2P**: Nodos y propagación.
- [ ] **Árbol de Merkle**: Integridad de datos.
- [ ] **Llaves y Firmas**: Criptografía asimétrica.

### Fase E: Estadística & Actuaria 📊
Ubicación: `src/components/simuladores-stats/` y `src/components/simuladores-actuaria/`
- [ ] **Regresión Lineal**: Ajuste de mínimos cuadrados.
- [ ] **Teorema del Límite Central**: Simulación de distribuciones.
- [ ] **Mortalidad (Tablas Vida)**: Esperanza de vida y pagos.
- [ ] **Ruina del Asegurador**: Probabilidad de solvencia.
- [ ] **Poder Adquisitivo**: Inflación vs Salario.

### Fase F: Herramientas Premium y Especializadas 🎯
Ubicación: `src/components/`
- [ ] **Análisis de Minutas (AI)**: Exportar reporte de analista AI.
- [ ] **Regla de Taylor (TaylorSolver)**: Comparar tasa real vs sugerida.
- [ ] **Inflación México**: Datos históricos y proyecciones.
- [ ] **Comparador de Escenarios**: Mezclar variables de distintos modelos.

---

## 3. Metodología de Debugging "Botón por Botón"

Para cada archivo, seguiremos este flujo de trabajo:

1.  **Modo Inspección**: Abrir el simulador en `localhost:3000`.
2.  **Stress Test**: Mover todos los sliders al máximo y al mínimo.
    *   *¿Se rompe el layout?* -> Reparar Responsive.
    *   *¿El gráfico muestra valores NaN?* -> Reparar Lógica.
3.  **Auditoría de Botones**:
    *   Clic en **Exportar**: ¿El PDF tiene el diseño correcto?
    *   Clic en **Guardar**: ¿Se guarda en la DB sin errores 500?
    *   Clic en **IA Analyst**: ¿Consumió los 10 créditos correctamente?
4.  **Limpieza de Consola**: Eliminar todos los `console.log` y `warnings` de React (useEffect dependencies).

---

## 4. Próximos Pasos (Inmediato)

*   [ ] Revisar `InputLibre.tsx` para que soporte prefijos ($) y sufijos (%) de forma automática.
*   [ ] Empezar la revisión con el **Simulador DCF**, ya que es el componente más complejo financieramente.

---
*Plan generado por Antigravity AI - Econosfera Maintenance Suite 1.1*
