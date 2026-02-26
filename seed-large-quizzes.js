const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log("Seeding massive gamification data...");

    // Helper to generate 10 questions for a topic
    const generateQuestions = (topic, optionsArray) => {
        return optionsArray.map((q, i) => ({
            text: q.text,
            explanation: q.explanation || 'Explicación detallada para reforzar el concepto.',
            options: {
                create: q.options.map(o => ({
                    text: o.text,
                    isCorrect: o.isCorrect
                }))
            }
        }));
    };

    const quizzesToCreate = [
        {
            title: 'Análisis Macroeconómico Avanzado',
            description: 'Explora a fondo los indicadores de inflación, PIB y tasas de interés a nivel global.',
            difficulty: 'ADVANCED',
            module: 'MACRO',
            xpReward: 100,
            questions: {
                create: generateQuestions('Macro', [
                    { text: '¿Qué mide el Producto Interno Bruto (PIB)?', options: [{ text: 'El valor de los bienes y servicios producidos en un país.', isCorrect: true }, { text: 'La cantidad de dinero impreso.', isCorrect: false }, { text: 'El nivel de deuda externa.', isCorrect: false }] },
                    { text: '¿Qué es la estanflación?', options: [{ text: 'Inflación alta con crecimiento económico estancado.', isCorrect: true }, { text: 'Deflación constante.', isCorrect: false }, { text: 'Crecimiento rápido sin inflación.', isCorrect: false }] },
                    { text: 'Si la curva de Phillips es válida en el corto plazo, ¿qué relación existe entre inflación y desempleo?', options: [{ text: 'Inversa: a más inflación, menos desempleo.', isCorrect: true }, { text: 'Directa: a más inflación, más desempleo.', isCorrect: false }, { text: 'Ninguna relación.', isCorrect: false }] },
                    { text: '¿Qué es la política fiscal expansiva?', options: [{ text: 'Reducción de impuestos o aumento del gasto público.', isCorrect: true }, { text: 'Aumento de tasas de interés.', isCorrect: false }, { text: 'Aumento del encaje legal bancario.', isCorrect: false }] },
                    { text: 'En una economía abierta, un aumento en la tasa de interés local tiende a:', options: [{ text: 'Apreciar la moneda local.', isCorrect: true }, { text: 'Depreciar la moneda local.', isCorrect: false }, { text: 'No afectar el tipo de cambio.', isCorrect: false }] },
                    { text: '¿Qué es el índice Gini?', options: [{ text: 'Medida de desigualdad en la distribución del ingreso.', isCorrect: true }, { text: 'Índice de precios al consumidor.', isCorrect: false }, { text: 'Volatilidad del mercado accionario.', isCorrect: false }] },
                    { text: 'La balanza de pagos se divide principalmente en:', options: [{ text: 'Cuenta corriente y cuenta de capital/financiera.', isCorrect: true }, { text: 'Activos y Pasivos.', isेक्ट: false }, { text: 'Ingresos y Gastos de gobierno.', isCorrect: false }] },
                    { text: '¿Qué significa "Quantitative Easing" (Expansión Cuantitativa)?', options: [{ text: 'Compra masiva de bonos por el banco central para inyectar liquidez.', isCorrect: true }, { text: 'Aumento drástico de los impuestos corporativos.', isCorrect: false }, { text: 'Impresión de billetes para pagar deuda directamente.', isCorrect: false }] },
                    { text: 'Una ventaja del tipo de cambio flotante es:', options: [{ text: 'Actúa como amortiguador de shocks externos.', isCorrect: true }, { text: 'Elimina la inflación por completo.', isCorrect: false }, { text: 'Asegura paridad 1:1 con el dólar.', isCorrect: false }] },
                    { text: '¿Cuál es el principal objetivo de un Banco Central con mandato único (como Banxico)?', options: [{ text: 'Controlar la inflación y preservar el valor de la moneda.', isCorrect: true }, { text: 'Maximizar el empleo.', isCorrect: false }, { text: 'Generar ganancias bursátiles para el gobierno.', isCorrect: false }] }
                ])
            }
        },
        {
            title: 'Microeconomía: Comportamiento del Consumidor',
            description: 'Elasticidades, curvas de indiferencia y toma de decisiones.',
            difficulty: 'INTERMEDIATE',
            module: 'MICRO',
            xpReward: 80,
            questions: {
                create: generateQuestions('Micro', [
                    { text: 'La elasticidad precio de la demanda mide:', options: [{ text: 'Qué tan sensible es la cantidad demandada ante un cambio en el precio.', isCorrect: true }, { text: 'La oferta total de un bien.', isCorrect: false }, { text: 'El costo de producción.', isCorrect: false }] },
                    { text: 'Un bien Giffen se caracteriza porque:', options: [{ text: 'Si aumenta su precio, aumenta su demanda (efecto renta domina).', isCorrect: true }, { text: 'Es un bien de lujo supremo.', isCorrect: false }, { text: 'No tiene sustitutos.', isCorrect: false }] },
                    { text: 'La utilidad marginal decreciente establece que:', options: [{ text: 'Cada unidad adicional consumida aporta menos satisfacción que la anterior.', isCorrect: true }, { text: 'El costo marginal siempre es decreciente.', isCorrect: false }, { text: 'Los precios bajan con el tiempo.', isCorrect: false }] },
                    { text: 'Una curva de indiferencia representa:', options: [{ text: 'Combinaciones de dos bienes que dan el mismo nivel de utilidad.', isCorrect: true }, { text: 'La frontera de posibilidades de producción.', isCorrect: false }, { text: 'El punto de equilibrio del mercado.', isCorrect: false }] },
                    { text: 'En competencia perfecta, una empresa maximiza sus beneficios cuando:', options: [{ text: 'El Ingreso Marginal es igual al Costo Marginal (IMg = CMg).', isCorrect: true }, { text: 'Vende la mayor cantidad posible.', isCorrect: false }, { text: 'Reduce sus precios al mínimo.', isCorrect: false }] },
                    { text: 'El costo de oportunidad es:', options: [{ text: 'El valor de la mejor alternativa a la que se renuncia.', isCorrect: true }, { text: 'El costo contable explícito.', isCorrect: false }, { text: 'El gasto en publicidad.', isCorrect: false }] },
                    { text: 'Un monopolio natural se da cuando:', options: [{ text: 'Una sola empresa puede abastecer al mercado con menores costos que dos o más.', isCorrect: true }, { text: 'El gobierno concede patente exclusiva.', isCorrect: false }, { text: 'Controla el suministro mundial de agua.', isCorrect: false }] },
                    { text: 'Si dos bienes son complementarios, la elasticidad cruzada de la demanda será:', options: [{ text: 'Negativa (sube precio A, baja demanda B).', isCorrect: true }, { text: 'Positiva.', isCorrect: false }, { text: 'Cero.', isCorrect: false }] },
                    { text: 'La Relación Marginal de Sustitución técnica se refiere a:', options: [{ text: 'Intercambio de factores productivos (como capital y trabajo) manteniendo la misma producción.', isCorrect: true }, { text: 'Cambiar un bien por otro en el consumo.', isCorrect: false }, { text: 'Tasa de inflación frente al desempleo.', isCorrect: false }] },
                    { text: '¿Qué es el excedente del consumidor?', options: [{ text: 'La diferencia entre la disposición a pagar y el precio que realmente se paga.', isCorrect: true }, { text: 'Los productos que sobran en inventario.', isCorrect: false }, { text: 'El impuesto al consumo.', isCorrect: false }] }
                ])
            }
        },
        {
            title: 'Modelos Financieros: Valuación Corporativa',
            description: 'DCF, Costo de Capital (WACC), y métricas de desempeño.',
            difficulty: 'ADVANCED',
            module: 'FINANZAS',
            xpReward: 120,
            questions: {
                create: generateQuestions('Valuacion', [
                    { text: '¿Qué representa el WACC (Weighted Average Cost of Capital)?', options: [{ text: 'El costo promedio de las fuentes de financiamiento de una empresa.', isCorrect: true }, { text: 'El margen de ganancia operativa.', isCorrect: false }, { text: 'El costo de la deuda antes de impuestos.', isCorrect: false }] },
                    { text: 'En un modelo DCF, la tasa de descuento utilizada para los Flujos de Caja Libres es típicamente:', options: [{ text: 'El WACC.', isCorrect: true }, { text: 'La tasa libre de riesgo.', isCorrect: false }, { text: 'La tasa de inflación.', isCorrect: false }] },
                    { text: '¿Qué formula corresponde al CAPM (Capital Asset Pricing Model)?', options: [{ text: 'E(R) = Rf + Beta(Rm - Rf)', isCorrect: true }, { text: 'E(R) = WACC - g', isCorrect: false }, { text: 'E(R) = ROE * Equity', isCorrect: false }] },
                    { text: 'El valor terminal en el cálculo del DCF representa:', options: [{ text: 'El valor presente de todos los flujos futuros más allá del horizonte de proyección.', isCorrect: true }, { text: 'El valor de liquidación de los activos en el año fiscal en curso.', isCorrect: false }, { text: 'La deuda residual del proyecto.', isCorrect: false }] },
                    { text: 'Un Beta > 1 implica que la acción es:', options: [{ text: 'Más volátil que el mercado general.', isCorrect: true }, { text: 'Menos volátil que el mercado general.', isCorrect: false }, { text: 'Se mueve en dirección opuesta al mercado.', isCorrect: false }] },
                    { text: 'La principal ventaja del escudo fiscal (tax shield) es:', options: [{ text: 'Los intereses pagados por deuda son deducibles de impuestos.', isCorrect: true }, { text: 'Los dividendos están libres de impuestos para la empresa.', isCorrect: false }, { text: 'El gobierno subsidia a la empresa.', isCorrect: false }] },
                    { text: 'El Ratio P/E (Price-to-Earnings) indica:', options: [{ text: 'Cuánto pagan los inversores por cada dólar de beneficio generado.', isCorrect: true }, { text: 'El apalancamiento relativo de la empresa.', isCorrect: false }, { text: 'El flujo de efectivo libre ajustado.', isCorrect: false }] },
                    { text: 'ROE vs ROA: ¿Qué significa si el ROE es sustancialmente mayor que el ROA?', options: [{ text: 'La empresa está utilizando un alto nivel de apalancamiento financiero (Deuda).', isCorrect: true }, { text: 'La empresa no tiene deuda.', isCorrect: false }, { text: 'La empresa está en bancarrota.', isCorrect: false }] },
                    { text: 'El Enterprise Value (Valor de Empresa) se calcula típicamente como:', options: [{ text: 'Market Cap + Deuda Total - Efectivo', isCorrect: true }, { text: 'Activos Totales - Pasivos Totales', isCorrect: false }, { text: 'Precio por acción / Utilidad por acción', isCorrect: false }] },
                    { text: 'Una Tasa Interna de Retorno (TIR) superior al costo de capital implica que:', options: [{ text: 'El proyecto generará valor para los accionistas.', isCorrect: true }, { text: 'El proyecto destruirá valor pcial.', isCorrect: false }, { text: 'El VPN es negativo.', isCorrect: false }] }
                ])
            }
        },
        {
            title: 'Mercados de Derivados y Coberturas',
            description: 'Futuros, Opciones, Forwards y Swaps. Gestionando el riesgo corporativo.',
            difficulty: 'ADVANCED',
            module: 'FINANZAS',
            xpReward: 150,
            questions: {
                create: generateQuestions('Derivados', [
                    { text: 'Una opción CALL otorga a su comprador:', options: [{ text: 'El derecho, pero no la obligación, de comprar el activo subyacente.', isCorrect: true }, { text: 'La obligación de comprar el activo subyacente.', isCorrect: false }, { text: 'El derecho de vender el activo.', isCorrect: false }] },
                    { text: '¿Cual es la diferencia principal entre un Futuro y un Forward?', options: [{ text: 'Los futuros son estandarizados y transados en bolsa, los forwards son OTC (Over the counter).', isCorrect: true }, { text: 'Los futuros no tienen fecha de vencimiento.', isCorrect: false }, { text: 'Los forwards no tienen riesgo de contraparte.', isCorrect: false }] },
                    { text: 'Un importador en México que debe pagar en Dólares en 6 meses puede cubrirse (hedge) comprando un:', options: [{ text: 'Forward de tipo de cambio USD/MXN Largo.', isCorrect: true }, { text: 'Forward Corto.', isCorrect: false }, { text: 'Bono local a tasa fija.', isCorrect: false }] },
                    { text: 'Si tienes una opción PUT y el precio del subyacente cae fuertemente:', options: [{ text: 'El valor de tu opción aumenta.', isCorrect: true }, { text: 'El valor de tu opción disminuye drásticamente.', isCorrect: false }, { text: 'El valor se mantiene inalterado.', isCorrect: false }] },
                    { text: 'Un Swap de Tasa de Interés (IRS) típico intercambia:', options: [{ text: 'Flujos a tasa fija por flujos a tasa variable.', isCorrect: true }, { text: 'Acciones por bonos.', isCorrect: false }, { text: 'Una divisa por otra única y exclusivamente al final.', isCorrect: false }] },
                    { text: 'En la fórmula de Black-Scholes para opciones, el parámetro de mayor sensibilidad e incertidumbre es:', options: [{ text: 'La Volatilidad Implícita.', isCorrect: true }, { text: 'El tiempo al vencimiento.', isCorrect: false }, { text: 'La tasa libre de riesgo.', isCorrect: false }] },
                    { text: 'Exposición \'Delta\' en una opción refleja:', options: [{ text: 'La sensibilidad del precio de la opción ante un movimiento de $1 en el activo subyacente.', isCorrect: true }, { text: 'El paso del tiempo (Theta).', isCorrect: false }, { text: 'El cambio en la volatilidad implicita (Vega).', isCorrect: false }] },
                    { text: '¿Qué es el margen inicial en un contrato de Futuros?', options: [{ text: 'Es el depósito de garantía que exige la bolsa para cubrir variaciones diarias de pérdida/ganancia.', isCorrect: true }, { text: 'La comisión del broker.', isCorrect: false }, { text: 'El costo inicial de producción del activo.', isCorrect: false }] },
                    { text: 'Estar "In-The-Money" (ITM) en una opción CALL significa que si se ejerciera en ese momento:', options: [{ text: 'Se obtendría un flujo de efectivo positivo (el precio spot es mayor al strike).', isCorrect: true }, { text: 'Se perdería el valor de la prima.', isCorrect: false }, { text: 'El strike es exactamente el valor spot.', isCorrect: false }] },
                    { text: 'El principal propósito de la cámara de compensación (Clearinghouse) es:', options: [{ text: 'Eliminar el riesgo de contraparte garantizando el cumplimiento de los contratos de futuros.', isCorrect: true }, { text: 'Determinar el precio de las acciones en NYSE.', isCorrect: false }, { text: 'Asegurar que los especuladores no participen.', isCorrect: false }] }
                ])
            }
        },
        {
            title: 'Tratados Internacionales y Comercio',
            description: 'Conceptos de aranceles, T-MEC y economía abierta.',
            difficulty: 'INTERMEDIATE',
            module: 'MACRO',
            xpReward: 90,
            questions: {
                create: generateQuestions('Comercio', [
                    { text: 'La ventaja comparativa (David Ricardo) establece que los países deben especializarse en:', options: [{ text: 'La producción de bienes en los que tienen el menor costo de oportunidad.', isCorrect: true }, { text: 'Producir absolutamente todo internamente.', isCorrect: false }, { text: 'Importar solamente bienes suntuarios.', isCorrect: false }] },
                    { text: 'Un arancel es:', options: [{ text: 'Un impuesto gravado directamente al valor de los bienes importados.', isCorrect: true }, { text: 'Un subsidio otorgado a los exportadores locales.', isCorrect: false }, { text: 'Una cuota de cantidad límite de exportación.', isCorrect: false }] },
                    { text: 'El Dumping (competencia desleal) ocurre cuando:', options: [{ text: 'Un producto se exporta a un precio inferior a su costo de producción o a su valor en su mercado interno.', isCorrect: true }, { text: 'Se regalan productos en las fronteras.', isCorrect: false }, { text: 'Un país cierra por completo sus aduanas.', isCorrect: false }] },
                    { text: 'El T-MEC establece ciertas reglas de origen estrictas. ¿Qué buscan estas reglas?', options: [{ text: 'Asegurar que un alto porcentaje del valor del producto proviene de los países miembros para gozar de aranceles cero.', isCorrect: true }, { text: 'Garantizar que no haya exportaciones fuera de América del Norte.', isCorrect: false }, { text: 'Prohibir la inversión extranjera.', isCorrect: false }] },
                    { text: 'Apreciación de la moneda local respecto a socios comerciales tiende a:', options: [{ text: 'Encarecer las exportaciones y abaratar las importaciones.', isCorrect: true }, { text: 'Abaratar exportaciones y encarecer importaciones.', isCorrect: false }, { text: 'Generar inflación hiper-acelerada localmente.', isCorrect: false }] },
                    { text: 'La Organización Mundial del Comercio (OMC) tiene la función principal de:', options: [{ text: 'Supervisar las reglas comerciales globales y resolver disputas comerciales.', isCorrect: true }, { text: 'Prestar dinero a los países para rescates macroeconómicos.', isCorrect: false }, { text: 'Poner precio máximo al petróleo.', isCorrect: false }] },
                    { text: 'Una barrera no arancelaria clásica es:', options: [{ text: 'Requisitos técnicos, sanitarios o cuotas de importación muy estrictas.', isCorrect: true }, { text: 'El pago de un impuesto del 5% al gobierno de la aduana.', isCorrect: false }, { text: 'El tratado de libre comercio bilateral.', isCorrect: false }] },
                    { text: 'La cuenta corriente deficitaria significa que un país:', options: [{ text: 'Importa bienes y servicios de mayor valor de los que exporta (necesita financiarse desde fuera).', isCorrect: true }, { text: 'Aumentó sus reservas internacionales estrepitosamente.', isCorrect: false }, { text: 'Tiene un superávit de presupuesto en su gobierno interno.', isCorrect: false }] },
                    { text: 'Nearshoring en México hace referencia principalmente a:', options: [{ text: 'Relocalizar operaciones y fábricas desde lugares lejanos (ej. Asia) cerca del mercado final (USA).', isCorrect: true }, { text: 'Contratar exclusivamente personal para trabajar de forma remota (Home Office).', isCorrect: false }, { text: 'Invertir en la costa para turismo.', isCorrect: false }] },
                    { text: '¿Qué es el "término de intercambio"?', options: [{ text: 'Relación entre el precio medio de las exportaciones y el precio medio de las importaciones de un país.', isCorrect: true }, { text: 'El tiempo que tarda la aduana en aprobar un cargamento.', isCorrect: false }, { text: 'La duración promedio de un tratado comercial.', isCorrect: false }] }
                ])
            }
        }
    ];

    for (let quiz of quizzesToCreate) {
        await prisma.quiz.create({
            data: quiz
        });
    }

    console.log("Seeding massive gamification data complete!");
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
