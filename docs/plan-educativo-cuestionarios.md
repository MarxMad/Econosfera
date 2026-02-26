# Plan Educativo de Cuestionarios: Econosfera (Simulador Financiero)

Este documento detalla el plan de aprendizaje a través de cuestionarios (gamificación) para reforzar los temas económicos y financieros de la plataforma. El enfoque es llevar al usuario desde conceptos básicos hasta un rigor técnico y matemático avanzado (preguntas difíciles).

## Estructura de Progresión (Gamificación)

Los usuarios ganarán **Puntaje (XP)** y **Insignias (Badges)** dependiendo de su desempeño en los diferentes cuestionarios temáticos.

### Niveles de Dificultad
1. **Básico (Fundamentos):** Conceptos teóricos (10 XP por pregunta correcta).
2. **Intermedio (Aplicación):** Uso de fórmulas y escenarios pequeños (20 XP por pregunta).
3. **Avanzado (Rigor Matemático):** Preguntas "difíciles", casos de estudio con escenarios de estrés (inflación variante, duraciones de bonos, etc) (50 XP por pregunta).

### Sistema de Insignias (Badges)
- 🥉 **"Analista Junior"**: Aprobar cuestionarios básicos.
- 🥈 **"Maestro del Tiempo"**: Aprobar cuestionarios de VP y VF.
- 🥇 **"Trader de Bonos"**: 100% de aciertos en cuestionarios de Renta Fija.
- 🏆 **"Gobernador de Banxico"**: Completar exitosamente la ruta entera con más del 90% de precisión.

---

## Módulos y Cuestionarios Temáticos

### Módulo 1: Macroeconomía y Política Monetaria (Inflación y Tasas)
*Objetivo: Entender la relación directa e inversa entre la tasa de interés de referencia y la inflación.*

**Cuestionario 1: Entendiendo la Inflación (Nivel: Intermedio)**
1. Si la inflación subyacente aumenta sostenidamente por 3 meses, ¿cuál es la medida ortodoxa que tomaría el banco central (Banxico)?
   - *A: Reducir la tasa de interés de referencia.*
   - *B: Aumentar la emisión monetaria.*
   - **C: Aumentar la tasa de interés de referencia para encarecer el crédito.** (Correcta)
   - *D: Comprar bonos soberanos.*
2. ¿Cuál es la diferencia principal entre la inflación general y la inflación subyacente para la toma de decisiones de política monetaria?
   - **A: La subyacente elimina bienes y servicios con alta volatilidad (energéticos y agropecuarios), mostrando la tendencia real.** (Correcta)
   - *B: La inflación general es la única que impacta las tasas de interés reales.*

### Módulo 2: Matemáticas Financieras Universales (Micro/Empresa)
*Objetivo: Dominar el valor del dinero en el tiempo.*

**Cuestionario 2: Valor Presente y Valor Futuro (Nivel: Difícil)**
1. Tienes un proyecto que pagará $100,000 en 3 años. Si la tasa de inflación esperada es del 4% anual y requieres un rendimiento real del 5% anual, ¿qué tasa de descuento nominal aproximada debes usar (Tasa de Fisher) y cuál es el VPN?
   - *A: Tasa 9%, VP = $77,218*
   - **B: Tasa 9.2% ((1.04 * 1.05) - 1), VP = $76,789.50** (Correcta - Nivel Difícil que exige usar la ecuación de Fisher exacta en lugar de suma simple).
   - *C: Tasa 9%, VP = $129,500*
   - *D: Tasa 5%, VP = $86,383*
2. ¿Cómo afecta un aumento de la frecuencia de capitalización (de anual a mensual) al Valor Futuro de una inversión, manteniendo la Tasa Nominal Anual constante?
   - **A: Incrementa el Valor Futuro debido al efecto del interés compuesto acelerado.** (Correcta)
   - *B: Disminuye el Valor Futuro.*

### Módulo 3: Instrumentos de Renta Fija (Bonos y CETES)
*Objetivo: Entender la curva de rendimientos y el mercado de bonos soberanos.*

**Cuestionario 3: Valuación y Sensibilidad de Bonos (Nivel: Avanzado)**
1. Un bono paga cupones semestrales fijos al 8% anual. Si sorpresivamente el Banco Central sube sus tasas al 10%, ¿qué pasará inmediatamente con el **precio limpio** de tu bono en el mercado secundario?
   - *A: Subirá su precio.*
   - **B: Caerá, porque los cupones fijos ahora son menos atractivos que las nuevas emisiones de mercado.** (Correcta)
   - *C: El precio del bono es estático hasta el vencimiento.*
2. El concepto de "Duración de Macaulay" de un bono representa:
   - **A: El tiempo promedio ponderado que se tarda en recuperar el precio del bono a través de todos sus flujos de efectivo (cupones y principal).** (Correcta)
   - *B: El plazo en años que falta exactamente para el vencimiento final.*

---

## Implementación Técnica Propuesta

1. **Ruta Frontend**: Crear una nueva página en `/src/app/cuestionarios/page.tsx` con una galería visual de cuestionarios bloqueados/desbloqueados y `/src/app/cuestionarios/[id]/page.tsx` para responder un cuestionario interactivo.
2. **Dashboard de Usuario**: Actualizar `/src/app/dashboard/page.tsx` para mostrar "Mis Insignias" y rango global (Leaderboard).
3. **Esquema de Base de Datos**: Agregar a Prisma las siguientes tablas:
   - `Quiz`, `Question`, `Option` (Estructura del cuestionario).
   - `QuizAttempt`, `QuizAnswer` (Registro de la partida).
   - `Badge`, `UserBadge` (Logros gamificados).
   - Agregar campo `totalScore / currentStreak` al modelo `User`.

Cualquier cuestionario que finalicen será mandado por Next Actions (Server Actions) y validará la respuesta en un servidor seguro en vez del cliente para evitar trampas.
