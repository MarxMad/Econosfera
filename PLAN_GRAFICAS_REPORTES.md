# Plan de acción: Gráficas en reportes PDF

Objetivo: Revisar cada página y simulador para que los reportes exportados incluyan las gráficas correspondientes.

---

## Resumen por módulo

| Módulo | Página/Simulador | ¿PDF tiene gráfica? | ID del gráfico | Acción |
|--------|------------------|----------------------|----------------|--------|
| **Inflación** | Simulador Core | ✅ Sí | `grafico-inflacion` | OK |
| **Inflación** | Comparar Escenarios | ✅ Sí | `grafico-comparador` | OK – añadido |
| **Macro** | Multiplicador keynesiano | ✅ Sí | `grafico-multiplicador` | OK – gráfico 45° + chart en PDF |
| **Macro** | IS-LM | ✅ Sí | `grafico-islm` | OK – chart pasado a exportarMacroAPdf |
| **Micro** | Oferta-Demanda | ✅ Sí | `grafico-oferta-demanda` | OK |
| **Finanzas** | VP/VF, Ahorro | ✅ Sí | `grafico-vp-vf`, `grafico-ahorro` | OK |
| **Finanzas** | DCF, Black-Scholes | ✅ Sí | `grafico-dcf`, `grafico-blackscholes` | OK – añadido |
| **Blockchain** | Halving, Trading, Staking | ✅ Sí | `grafico-halving`, `grafico-trading`, `grafico-staking` | OK – exportarBlockchainPdf usa chart |
| **Actuaría** | Mortalidad, Ruina, Poder Adquisitivo | ✅ Sí | `grafico-mortalidad`, `grafico-ruina`, `grafico-poder-adquisitivo` | OK |
| **Estadística** | Regresión, TCL | ✅ Sí | `grafico-regresion`, `grafico-tcl` | OK |
| **Minutas** | Análisis Minuta | — | — | Reporte solo texto; sin gráfico en UI |

---

## Pasos de revisión (orden sugerido)

### Paso 1 — Inflación y política monetaria
- [x] **1.1** Simulador Core (ExportarCompartir): Confirmar que `getGraficoAsDataUrl("grafico-inflacion")` se llama y que `exportarEscenarioPdf` recibe e inserta la imagen.
- [x] **1.2** Comparar Escenarios: Añadir `id="grafico-comparador"` al contenedor del BarChart. En `exportarComparadorEscenariosPdf`, aceptar parámetro opcional `graficoDataUrl` e insertar imagen en el PDF. En el handler de Reporte PDF, llamar `getGraficoAsDataUrl("grafico-comparador")` y pasarlo.

### Paso 2 — Macroeconomía
- [x] **2.1** SimuladorMacro – IS-LM: En `handleExportMacro('islm')`, obtener `getGraficoAsDataUrl("grafico-islm")` y pasar `islm: { v, res, chart }`.
- [x] **2.2** SimuladorMacro – Multiplicador: Añadido gráfico modelo 45° con id `grafico-multiplicador` y paso de chart al PDF.

### Paso 3 — Microeconomía
- [x] **3.1** SimuladorMicro: Ya pasa `chart` desde `grafico-oferta-demanda`. exportarMicroPdf inserta la imagen.

### Paso 4 — Finanzas (simuladores con Reporte PDF)
- [x] **4.1** VPVF, Ahorro: Ya envían chart.
- [x] **4.2** Bono, Cetes: Sin gráfico en UI; reporte solo tablas.
- [x] **4.3** DCF, BlackScholes: Añadidos id `grafico-dcf` y `grafico-blackscholes`, captura y paso de `chart` a exportarFinanzasAPdf.

### Paso 5 — Blockchain
- [x] **5.1** exportarBlockchainPdf: Añadido soporte para `data.chart` (insertar imagen en el PDF).
- [x] **5.2** Halving: id `grafico-halving` y paso de chart al exportar.
- [x] **5.3** Trading, Staking: id `grafico-trading` y `grafico-staking`, paso de chart. AMM sin gráfico en UI.

### Paso 6 — Actuaría
- [x] **6.1** Mortalidad, Poder Adquisitivo: Ya pasan chart.
- [x] **6.2** Ruina: Ya pasa getGraficoAsDataUrl("grafico-ruina") a exportarActuariaAPdf.

### Paso 7 — Estadística
- [x] **7.1** Regresión: Ya pasa chart.
- [x] **7.2** TCL: Ya obtiene y pasa chart desde "grafico-tcl".

### Paso 8 — Minutas / otros
- [x] **8.1** AnalisisMinuta / exportarMinutaAPdf: Reporte solo texto; no hay gráfico en la UI de análisis de minuta.

---

## Notas técnicas

- **Captura de gráficos**: Recharts renderiza SVG; `getGraficoAsDataUrl(id)` en `exportarGrafico.ts` busca un elemento con ese `id`, toma el primer `svg` interno y lo convierte a PNG data URL. El contenedor del gráfico debe tener `id="grafico-xxx"` y el SVG debe estar dentro (p. ej. `<div id="grafico-xxx"><ResponsiveContainer><LineChart>...</LineChart></ResponsiveContainer></div>`). ResponsiveContainer/Recharts generan el SVG dentro de ese div.
- **Orden en el PDF**: En la mayoría de exportadores, la imagen se inserta después de tablas de variables/resultados; si `currentY > 180` se suele añadir nueva página antes de la imagen.
- **Módulo en registrarExportacion**: No cambia; solo se asegura que la imagen se capture y se pase al generador de PDF correspondiente.

---

## Criterio de “listo”

Para cada simulador con botón “Reporte PDF”:
1. Si en la pantalla hay al menos una gráfica relevante, el PDF debe incluir esa gráfica (o la principal).
2. Si en la pantalla no hay gráfica, se deja como está (solo tablas/texto) salvo que se decida añadir una gráfica nueva en la UI y en el PDF.

Cuando termines un paso, márcalo en la checklist y sigue con el siguiente.
