# Plan: Consolidación de simuladores de Finanzas

## Análisis de redundancia

### Simuladores con estructura similar (monto + tasa + periodo)

| Simulador | Monto | Tasa | Periodo | Salida principal |
|-----------|-------|------|---------|------------------|
| **VP/VF** | monto inicial | tasa anual | años | VF, VP |
| **Interés simple/compuesto** | monto inicial | tasa anual | años | VF simple, VF compuesto |
| **Ahorro** | aportación mensual | tasa anual | años | VF acumulado |
| **Anualidad** | pago periódico | tasa anual | años | VP, VF anualidad |
| **Amortización** | monto crédito | tasa anual | meses | cuota, tabla |
| **Regla 72** | — | tasa anual | — | años para duplicar |
| **Tasa efectiva** | — | tasa nominal + capitalizaciones | — | tasa efectiva anual |

### Simuladores de renta fija (estructura cercana)

| Simulador | Monto/Nominal | Tasa(s) | Periodo | Salida |
|-----------|---------------|---------|---------|--------|
| **Bono** | valor nominal | cupón, YTM | años | precio, flujos |
| **CETES** | valor nominal | rendimiento | días | precio |

---

## Propuesta: Simulador financiero unificado (fusionado)

### Mega-simulador: un solo formulario, todos los resultados

Un único simulador **fusionado** con un solo conjunto de inputs que genera todos los resultados a la vez:

**Inputs (un solo formulario):**
- Monto principal (VP)
- Tasa anual (%)
- Años
- Pago mensual (para anualidad y ahorro)
- Capitalizaciones/año (para tasa efectiva)

**Outputs (todos en una sola vista):**
1. **VP/VF** – Valor futuro del monto, VP de $10k
2. **Interés simple vs compuesto** – VF simple, VF compuesto, diferencia
3. **Regla 72** – Años para duplicar
4. **Tasa efectiva** – Con capitalización seleccionada
5. **Anualidad** – VP y VF (con pago mensual)
6. **Ahorro periódico** – VF acumulado, total aportado, interés ganado
7. **Amortización** – Cuota mensual, total intereses (monto como crédito)

**Ventajas:**
- Un solo lugar para todos los cálculos básicos
- Un solo formulario: monto, tasa, periodo
- Todos los resultados visibles a la vez
- Menos redundancia, experiencia más coherente

### Fase 2: Renta fija (opcional)

- **Bono + CETES** podrían unificarse en "Renta fija" con subpestañas (Bono / CETES), ya que ambos valoran instrumentos de deuda con tasa y plazo.

---

## Cambios en el menú de Finanzas

### Antes (27 opciones)
- VP/VF, Amortización, Anualidad, Interés simple/compuesto, Regla 72, Tasa efectiva
- Bono, CETES, Duración bono
- Valuación, DCF, VPN/TIR, WACC, CAPM
- Markowitz, Portafolio
- Black-Scholes, Yield Curve, Forward
- Break-even, Ahorro
- Impacto noticias, Correlación
- Flujo sistema, Mapa instrumentos, Mapa estructura

### Después (21 opciones)
- **Calculadora financiera** (nuevo, unifica 7 simuladores básicos)
- Bono, CETES, Duración bono
- Valuación, DCF, VPN/TIR, WACC, CAPM
- Markowitz, Portafolio
- Black-Scholes, Yield Curve, Forward
- Break-even
- Impacto noticias, Correlación
- Flujo sistema, Mapa instrumentos, Mapa estructura

**Eliminados del dropdown** (absorbidos por Calculadora financiera):
- VP/VF, Amortización, Anualidad, Interés simple/compuesto, Regla 72, Tasa efectiva, Ahorro

---

## Implementación técnica

1. Crear `SimuladorCalculadoraFinanciera.tsx` con pestañas internas (tabs).
2. Reutilizar la lógica existente de cada simulador (componentes o funciones de `lib/finanzas`).
3. Añadir tab "Calculadora financiera" en `TABS_FINANZAS` de `Finanzas.tsx`.
4. Mantener los simuladores individuales como componentes internos o eliminarlos si la calculadora los cubre por completo.
5. Actualizar `simulatorPlans` si aplica restricciones por plan.
