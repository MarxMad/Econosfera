# Plan de Mejora: Cuestionarios Academia Econosfera

## Objetivo
Aumentar el contenido de cada cuestionario añadiendo **5 preguntas nuevas** por módulo, manteniendo el diseño actual y la coherencia temática.

## Estado actual

| # | Cuestionario | Módulo | Dificultad | Preguntas actuales |
|---|--------------|--------|-----------|--------------------|
| 1 | Inflación y Política Monetaria | MACRO | BASIC | 2 |
| 2 | Matemáticas Financieras: Valor del Dinero en el Tiempo | MICRO | ADVANCED | 2 |
| 3 | Curva de Rendimiento y Renta Fija | FINANZAS | ADVANCED | 2 |
| 4 | Finanzas Personales: Créditos e Hipotecas | FINANZAS | INTERMEDIATE | 1 |

**Total actual:** 7 preguntas en 4 cuestionarios.

## Meta

| # | Cuestionario | Preguntas nuevas | Total final |
|---|--------------|-----------------|-------------|
| 1 | Inflación y Política Monetaria | +5 | 7 |
| 2 | Matemáticas Financieras | +5 | 7 |
| 3 | Curva de Rendimiento y Renta Fija | +5 | 7 |
| 4 | Finanzas Personales | +5 | 6 |

**Total final:** 27 preguntas.

## Criterios de las preguntas nuevas

1. **Coherencia temática:** Cada pregunta debe reforzar el tema del cuestionario.
2. **Formato:** Opción múltiple con 3 opciones, 1 correcta.
3. **Explicación:** Incluir `explanation` didáctica para reforzar el aprendizaje.
4. **Dificultad progresiva:** Variar entre conceptos directos y aplicación.
5. **Referencia:** Usar `preguntas.ts` y `plan-educativo-cuestionarios.md` como base conceptual.

## Implementación técnica

- **Archivo:** `scripts/seed-quiz-questions-add.js`
- **Estrategia:** Script que localiza cada quiz por título y añade 5 preguntas con `prisma.question.create()` (incluyendo opciones).
- **Idempotencia:** El script puede ejecutarse varias veces; las preguntas se añadirán. Para evitar duplicados, se podría verificar si ya existen N preguntas antes de añadir (opcional).
- **Orden de ejecución:** Empezar por Quiz 1, luego 2, 3 y 4.

## Contenido por cuestionario

### Quiz 1: Inflación y Política Monetaria (+5)
- INPC vs inflación subyacente
- Meta de inflación de Banxico
- Tasa real ex post / ex ante
- Regla de Taylor (concepto)
- Anclaje de expectativas

### Quiz 2: Matemáticas Financieras (+5)
- Ecuación de Fisher (nominal vs real)
- Interés simple vs compuesto
- Valor Futuro con capitalización
- Tasa efectiva anual
- VPN con inflación

### Quiz 3: Curva de Rendimiento y Renta Fija (+5)
- Relación precio–tasa inversa
- Cupón vs rendimiento al vencimiento
- Riesgo de tasa de interés
- Curva de rendimientos (forma)
- Precio sucio vs precio limpio

### Quiz 4: Finanzas Personales (+5)
- Tasa fija vs variable (riesgos)
- CAT (Costo Anual Total)
- Endeudamiento responsable
- Amortización anticipada
- Seguro de vida en hipotecas
