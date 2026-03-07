/**
 * Añade 5 preguntas nuevas a cada cuestionario existente.
 * Ejecutar: node scripts/seed-quiz-questions-add.js
 * Requiere: DATABASE_URL en .env
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const QUIZ_1_QUESTIONS = [
  {
    text: '¿Qué mide el INPC (Índice Nacional de Precios al Consumidor)?',
    explanation: 'El INPC es el indicador oficial de inflación en México. Mide la evolución promedio de los precios de una canasta de bienes y servicios representativa del consumo de los hogares.',
    options: [
      { text: 'El nivel de empleo en el sector formal.', isCorrect: false },
      { text: 'La evolución de los precios de una canasta de consumo representativa.', isCorrect: true },
      { text: 'El tipo de cambio peso-dólar.', isCorrect: false },
    ],
  },
  {
    text: '¿Cuál es la meta de inflación de Banxico (rango objetivo)?',
    explanation: 'Banxico tiene un objetivo de inflación del 3% con un intervalo de tolerancia de ±1 punto porcentual, es decir, entre 2% y 4%.',
    options: [
      { text: 'Entre 1% y 2% anual.', isCorrect: false },
      { text: '3% con un intervalo de ±1 punto (2% a 4%).', isCorrect: true },
      { text: 'Entre 5% y 7% anual.', isCorrect: false },
    ],
  },
  {
    text: 'Si la tasa nominal es 11% y la inflación observada es 4%, ¿cuál es la tasa real ex post?',
    explanation: 'Tasa real ex post = tasa nominal - inflación observada = 11% - 4% = 7%. Representa el costo real del dinero después de descontar la inflación.',
    options: [
      { text: '15%', isCorrect: false },
      { text: '7%', isCorrect: true },
      { text: '4%', isCorrect: false },
    ],
  },
  {
    text: 'Según la regla de Taylor, si la inflación está por encima de la meta, el banco central debería:',
    explanation: 'La regla de Taylor sugiere subir la tasa de interés cuando la inflación supera la meta, para enfriar la demanda y anclar expectativas.',
    options: [
      { text: 'Bajar la tasa de interés.', isCorrect: false },
      { text: 'Subir la tasa de interés.', isCorrect: true },
      { text: 'Mantener la tasa sin cambios.', isCorrect: false },
    ],
  },
  {
    text: 'El anclaje de expectativas inflacionarias se refiere a:',
    explanation: 'Cuando el público espera una inflación cercana a la meta del banco central, los precios y salarios se fijan en línea con ella, facilitando la estabilidad.',
    options: [
      { text: 'Congelar precios por decreto.', isCorrect: false },
      { text: 'Que el público espere una inflación cercana a la meta del banco central.', isCorrect: true },
      { text: 'Fijar el tipo de cambio nominal.', isCorrect: false },
    ],
  },
];

const QUIZ_2_QUESTIONS = [
  {
    text: 'La ecuación de Fisher relaciona la tasa nominal con la tasa real y la inflación. ¿Cuál es la fórmula aproximada?',
    explanation: 'Fisher aproximada: i ≈ r + π. La tasa nominal (i) es aproximadamente la tasa real (r) más la inflación esperada (π).',
    options: [
      { text: 'i = r - π', isCorrect: false },
      { text: 'i ≈ r + π (tasa real + inflación esperada)', isCorrect: true },
      { text: 'i = r × π', isCorrect: false },
    ],
  },
  {
    text: '¿Cuál es la diferencia clave entre interés simple e interés compuesto?',
    explanation: 'En interés simple solo se capitaliza el principal. En compuesto, los intereses generados se reinvierten y generan más intereses (efecto bola de nieve).',
    options: [
      { text: 'El simple da más rendimiento a largo plazo.', isCorrect: false },
      { text: 'El compuesto capitaliza los intereses sobre intereses.', isCorrect: true },
      { text: 'No hay diferencia práctica.', isCorrect: false },
    ],
  },
  {
    text: 'Si inviertes $10,000 al 12% anual capitalizable mensualmente, ¿qué pasa con el Valor Futuro a 1 año respecto a capitalización anual?',
    explanation: 'Más frecuencias de capitalización (mensual vs anual) con la misma tasa nominal generan mayor tasa efectiva y por tanto mayor Valor Futuro.',
    options: [
      { text: 'El VF es menor con capitalización mensual.', isCorrect: false },
      { text: 'El VF es mayor con capitalización mensual (efecto compuesto).', isCorrect: true },
      { text: 'El VF es igual en ambos casos.', isCorrect: false },
    ],
  },
  {
    text: '¿Qué es la Tasa Efectiva Anual (TEA)?',
    explanation: 'La TEA es el rendimiento real que obtienes en un año considerando la capitalización. Si la nominal es 12% capitalizable mensualmente, la TEA es mayor (~12.68%).',
    options: [
      { text: 'La misma que la tasa nominal anunciada.', isCorrect: false },
      { text: 'El rendimiento real anual considerando la capitalización.', isCorrect: true },
      { text: 'La tasa de inflación esperada.', isCorrect: false },
    ],
  },
  {
    text: 'Para descontar flujos futuros en un entorno inflacionario, ¿qué tasa debes usar en el VPN?',
    explanation: 'Se usa la tasa nominal que incorpora inflación y premio al riesgo. Alternativamente, se pueden usar flujos reales con tasa real.',
    options: [
      { text: 'Solo la tasa de inflación.', isCorrect: false },
      { text: 'Una tasa nominal que refleje inflación y rendimiento requerido.', isCorrect: true },
      { text: 'La tasa de CETES a 28 días sin ajuste.', isCorrect: false },
    ],
  },
];

const QUIZ_3_QUESTIONS = [
  {
    text: '¿Por qué existe una relación inversa entre el precio de un bono y las tasas de interés?',
    explanation: 'Cuando suben las tasas, los cupones fijos del bono pierden atractivo frente a nuevas emisiones. El precio debe bajar para que el rendimiento se equipare al mercado.',
    options: [
      { text: 'Porque los bonos se emiten a descuento.', isCorrect: false },
      { text: 'Los cupones fijos compiten con nuevas tasas; el precio se ajusta para igualar rendimientos.', isCorrect: true },
      { text: 'No existe tal relación inversa.', isCorrect: false },
    ],
  },
  {
    text: 'Si un bono se cotiza "sobre la par" (above par), significa que:',
    explanation: 'Cotizar sobre la par indica que el precio es mayor a 100 (o al valor nominal). Ocurre cuando la tasa de cupón es mayor que el rendimiento exigido por el mercado.',
    options: [
      { text: 'Su precio es menor al valor nominal.', isCorrect: false },
      { text: 'Su precio es mayor al valor nominal (cupón > rendimiento de mercado).', isCorrect: true },
      { text: 'El bono está en default.', isCorrect: false },
    ],
  },
  {
    text: '¿Qué mide el riesgo de tasa de interés en un portafolio de bonos?',
    explanation: 'El riesgo de tasa de interés es la sensibilidad del precio del bono a cambios en las tasas. La duración es una medida aproximada de esta sensibilidad.',
    options: [
      { text: 'El riesgo de que el emisor no pague.', isCorrect: false },
      { text: 'La sensibilidad del precio del bono a cambios en las tasas de interés.', isCorrect: true },
      { text: 'El riesgo de liquidez del mercado.', isCorrect: false },
    ],
  },
  {
    text: 'Una curva de rendimientos invertida (corto plazo > largo plazo) suele interpretarse como:',
    explanation: 'Históricamente, una curva invertida ha precedido recesiones. Los inversionistas exigen más rendimiento a corto plazo por expectativas de menor crecimiento.',
    options: [
      { text: 'Señal de expansión económica fuerte.', isCorrect: false },
      { text: 'Posible señal de recesión futura (expectativas de bajada de tasas).', isCorrect: true },
      { text: 'Que la inflación va a subir mucho.', isCorrect: false },
    ],
  },
  {
    text: 'El precio "sucio" de un bono incluye:',
    explanation: 'Precio sucio = precio limpio + intereses acumulados (cupón corrido). Es el monto total que paga el comprador en una operación en el mercado secundario.',
    options: [
      { text: 'Solo el valor nominal del bono.', isCorrect: false },
      { text: 'Precio limpio más los intereses acumulados (cupón corrido).', isCorrect: true },
      { text: 'El precio de emisión original.', isCorrect: false },
    ],
  },
];

const QUIZ_4_QUESTIONS = [
  {
    text: '¿Cuál es el principal riesgo de un crédito hipotecario a tasa variable?',
    explanation: 'Con tasa variable (ej. ligada a TIIE), las mensualidades suben cuando Banxico sube tasas. En ciclos restrictivos, el costo puede aumentar significativamente.',
    options: [
      { text: 'Que la tasa baje y pagues menos.', isCorrect: false },
      { text: 'Que las tasas suban y aumente tu mensualidad.', isCorrect: true },
      { text: 'Que el plazo se acorte automáticamente.', isCorrect: false },
    ],
  },
  {
    text: '¿Qué representa el CAT (Costo Anual Total) en un crédito?',
    explanation: 'El CAT incluye tasa de interés, comisiones, seguros y otros costos en una sola cifra anual, permitiendo comparar ofertas de diferentes instituciones.',
    options: [
      { text: 'Solo la tasa de interés nominal.', isCorrect: false },
      { text: 'El costo total anual del crédito (interés + comisiones + seguros).', isCorrect: true },
      { text: 'El monto total que pagarás al final del crédito.', isCorrect: false },
    ],
  },
  {
    text: '¿Cuándo conviene hacer un pago anticipado a capital en una hipoteca?',
    explanation: 'Conviene cuando tienes liquidez sobrante y la tasa del crédito es mayor que el rendimiento que obtendrías invirtiendo ese dinero. Reduces intereses futuros.',
    options: [
      { text: 'Nunca conviene, siempre es mejor invertir.', isCorrect: false },
      { text: 'Cuando la tasa del crédito supera tu rendimiento alternativo y tienes liquidez.', isCorrect: true },
      { text: 'Solo en el último año del crédito.', isCorrect: false },
    ],
  },
  {
    text: 'Un nivel de endeudamiento saludable (relación deuda/ingreso) suele recomendarse que sea:',
    explanation: 'Se recomienda que los pagos de deuda no superen 30-35% del ingreso neto. Más allá de eso, la vulnerabilidad ante shocks aumenta.',
    options: [
      { text: 'Por encima del 50% del ingreso.', isCorrect: false },
      { text: 'Por debajo del 30-35% del ingreso (pagos de deuda).', isCorrect: true },
      { text: 'No importa el nivel mientras se pague a tiempo.', isCorrect: false },
    ],
  },
  {
    text: '¿Para qué sirve el seguro de vida en una hipoteca?',
    explanation: 'Protege a la familia: si el deudor fallece, el seguro paga el saldo del crédito y los beneficiarios conservan la vivienda sin esa carga.',
    options: [
      { text: 'Para asegurar el valor de la propiedad.', isCorrect: false },
      { text: 'Para que, si falleces, el saldo del crédito se pague y tu familia conserve la casa.', isCorrect: true },
      { text: 'Es obligatorio pero no tiene beneficio real.', isCorrect: false },
    ],
  },
];

async function addQuestionsToQuiz(quizTitle, questions) {
  const quiz = await prisma.quiz.findFirst({ where: { title: quizTitle } });
  if (!quiz) {
    console.log(`  ⚠ Quiz no encontrado: "${quizTitle}"`);
    return 0;
  }
  const existing = await prisma.question.count({ where: { quizId: quiz.id } });
  if (existing >= 7) {
    console.log(`  ⏭ "${quizTitle}" ya tiene ${existing} preguntas. Saltando.`);
    return 0;
  }
  let added = 0;
  for (const q of questions) {
    await prisma.question.create({
      data: {
        quizId: quiz.id,
        text: q.text,
        explanation: q.explanation,
        options: { create: q.options },
      },
    });
    added++;
  }
  return added;
}

async function main() {
  console.log('Añadiendo preguntas a los cuestionarios...\n');

  const r1 = await addQuestionsToQuiz('Inflación y Política Monetaria', QUIZ_1_QUESTIONS);
  console.log(`Quiz 1 (Inflación): +${r1} preguntas`);

  const r2 = await addQuestionsToQuiz('Matemáticas Financieras: Valor del Dinero en el Tiempo', QUIZ_2_QUESTIONS);
  console.log(`Quiz 2 (Matemáticas Financieras): +${r2} preguntas`);

  const r3 = await addQuestionsToQuiz('Curva de Rendimiento y Renta Fija', QUIZ_3_QUESTIONS);
  console.log(`Quiz 3 (Renta Fija): +${r3} preguntas`);

  const r4 = await addQuestionsToQuiz('Finanzas Personales: Créditos e Hipotecas', QUIZ_4_QUESTIONS);
  console.log(`Quiz 4 (Finanzas Personales): +${r4} preguntas`);

  console.log(`\n✅ Total: +${r1 + r2 + r3 + r4} preguntas añadidas.`);
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
