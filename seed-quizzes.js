const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log("Seeding gamification data...");

    // 1. Crear Badges
    const badgeJunior = await prisma.badge.upsert({
        where: { name: 'Analista Junior' },
        update: {},
        create: {
            name: 'Analista Junior',
            description: 'Aprobaste exitosamente los fundamentos de Macroeconomía.',
            criteria: 'COMPLETE_ROOKIE',
            imageUrl: '🥉'
        }
    });

    const badgeTiempo = await prisma.badge.upsert({
        where: { name: 'Maestro del Tiempo' },
        update: {},
        create: {
            name: 'Maestro del Tiempo',
            description: 'Dominaste los cálculos de Valor Presente y Futuro.',
            criteria: 'MICRO_MASTER',
            imageUrl: '🥈'
        }
    });

    // 2. Crear Quizzes (si no existen)
    const q1 = await prisma.quiz.create({
        data: {
            title: 'Inflación y Política Monetaria',
            description: 'Conceptos básicos sobre Banxico, el INPC y control de precios.',
            difficulty: 'BASIC',
            module: 'MACRO',
            xpReward: 20,
            questions: {
                create: [
                    {
                        text: '¿Cuál es la medida ortodoxa que tomaría Banxico si la inflación se sale del rango objetivo?',
                        explanation: 'Aumentar la tasa de interés encarece el crédito y enfría el consumo, reduciendo presiones inflacionarias.',
                        options: {
                            create: [
                                { text: 'Aumentar la tasa de interés de referencia', isCorrect: true },
                                { text: 'Imprimir más billetes', isCorrect: false },
                                { text: 'Reducir la tasa de interés para dar crédito', isCorrect: false },
                            ]
                        }
                    },
                    {
                        text: '¿Qué es la inflación subyacente?',
                        explanation: 'Elimina los productos más volátiles para dar una imagen más limpia de la tendencia a mediano plazo.',
                        options: {
                            create: [
                                { text: 'La parte del índice que registra los productos de alta volatilidad.', isCorrect: false },
                                { text: 'El índice que excluye agropecuarios y energéticos para mostrar la tendencia.', isCorrect: true },
                                { text: 'La diferencia entre salarios y precios.', isCorrect: false },
                            ]
                        }
                    }
                ]
            }
        }
    }).catch(e => console.log('Quiz 1 exists or error'));

    const q2 = await prisma.quiz.create({
        data: {
            title: 'Matemáticas Financieras: Valor del Dinero en el Tiempo',
            description: 'Resolver escenarios aplicando inflación y el efecto compuesto.',
            difficulty: 'ADVANCED',
            module: 'MICRO',
            xpReward: 50,
            questions: {
                create: [
                    {
                        text: 'Tienes una obligación de $100,000 MXN en 3 años. Si la inflación esperada es 4% y quieres un 5% real, ¿cuál es tu Valor Presente?',
                        explanation: 'Aplicando Fischer exacta: Nominal = (1.04 * 1.05) - 1 = 9.2%. VP = 100,000 / (1.092)^3 = $76,789.50',
                        options: {
                            create: [
                                { text: '$77,218.00', isCorrect: false },
                                { text: '$76,789.50', isCorrect: true },
                                { text: '$86,383.00', isCorrect: false },
                            ]
                        }
                    },
                    {
                        text: '¿Cómo afecta pasar el capital de "anual" a "mensual" manteniendo la Tasa Nominal constante?',
                        explanation: 'Capitalizar más frecuencias en el año incrementa la tasa efectiva final (Efecto compuesto).',
                        options: {
                            create: [
                                { text: 'El Valor Futuro crece.', isCorrect: true },
                                { text: 'El Valor Futuro disminuye.', isCorrect: false },
                                { text: 'El Valor Futuro se mantiene estático.', isCorrect: false },
                            ]
                        }
                    }
                ]
            }
        }
    }).catch(e => console.log('Quiz 2 exists or error'));

    const q3 = await prisma.quiz.create({
        data: {
            title: 'Curva de Rendimiento y Renta Fija',
            description: 'Demuestra que entiendes el mercado secundario y los precios limpios.',
            difficulty: 'ADVANCED',
            module: 'FINANZAS',
            xpReward: 50,
            questions: {
                create: [
                    {
                        text: 'Si el Banco Central sorpresivamente sube tasas al 10%, ¿qué pasará con tu bono a tasa fija recién emitido (al 8%)?',
                        explanation: 'Existe una relación inversa entre la Tasa de Interés y el precio del bono en mercado secundario.',
                        options: {
                            create: [
                                { text: 'Subirá de precio.', isCorrect: false },
                                { text: 'Caerá de precio porque pierde atractivo.', isCorrect: true },
                                { text: 'Se mantendrá igual hasta vencimiento.', isCorrect: false },
                            ]
                        }
                    },
                    {
                        text: 'La Duración de Macaulay calcula:',
                        explanation: 'Es una medida de riesgo de cuánto tardas en promedio en recibir tu flujo.',
                        options: {
                            create: [
                                { text: 'El tiempo exacto en días que falta para el pago final.', isCorrect: false },
                                { text: 'El periodo en que el rendimiento se hace cero.', isCorrect: false },
                                { text: 'Tiempo promedio que tardas en recuperar tu inversión.', isCorrect: true },
                            ]
                        }
                    }
                ]
            }
        }
    }).catch(e => console.log('Quiz 3 exists or error'));

    const q4 = await prisma.quiz.create({
        data: {
            title: 'Finanzas Personales: Créditos e Hipotecas',
            description: '¿Conviene tasa variable o tasa fija? Identifica los riesgos sistemáticos.',
            difficulty: 'INTERMEDIATE',
            module: 'FINANZAS',
            xpReward: 30,
            questions: {
                create: [
                    {
                        text: 'En un entorno de política monetaria restrictiva (tasas de referencia al alza), ¿qué tipo de crédito resulta ser la peor decisión de liquidez para un individuo?',
                        explanation: 'La Tasa Variable (TIIE) aumentará la cuota con cada ajuste de Banxico. Una fija da certeza del flujo.',
                        options: {
                            create: [
                                { text: 'Crédito a Tasa Fija.', isCorrect: false },
                                { text: 'Crédito a Tasa Variable (Ligado a TIIE).', isCorrect: true },
                                { text: 'Crédito revolvente bancario con meses sin intereses.', isCorrect: false },
                            ]
                        }
                    }
                ]
            }
        }
    }).catch(e => console.log('Quiz 4 exists or error'));

    console.log("Seeding complete!");
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
