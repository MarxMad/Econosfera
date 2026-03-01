/** Glosario de términos económicos usados en el simulador.
 * Las definiciones se basan en: Banco de México (Documentos de investigación, Programas de política monetaria),
 * CEMLA, El Trimestre Económico (FCE), Investigación Económica (UNAM), CIDE y manuales de referencia. */

export interface TerminoGlosario {
  termino: string;
  definicion: string;
  modulo: "inflacion" | "macro" | "micro" | "finanzas" | "general" | "blockchain" | "actuaria" | "estadistica" | "teorias";
  formula?: string;
  ejemplo?: string;
}

/** Fuentes en las que se basan las definiciones del glosario (autores e instituciones mexicanas y académicas). */
export const FUENTES_CONCEPTOS = [
  { nombre: "Banco de México (Documentos de investigación)", url: "https://www.banxico.org.mx/DIBM/" },
  { nombre: "CEMLA", url: "https://www.cemla.org/publicaciones.html" },
  { nombre: "El Trimestre Económico (FCE)", url: "https://www.scielo.org.mx/scielo.php?lng=es&pid=2448-718X&script=sci_serial" },
  { nombre: "Investigación Económica (UNAM)", url: "https://www.revistas.unam.mx/index.php/rie" },
  { nombre: "CIDE", url: "https://www.cide.edu/division-academica/economia/" },
  { nombre: "Facultad de Economía UNAM", url: "https://www.economia.unam.mx/" },
] as const;

export const TERMINOS: TerminoGlosario[] = [
  // Inflación y política monetaria
  {
    termino: "Inflación subyacente",
    definicion: "Indicador de precios que excluye los componentes más volátiles del INPC: alimentos no elaborados, energéticos y tarifas autorizadas por el gobierno. Permite al banco central identificar la tendencia de mediano plazo de la inflación, libre de choques temporales, y es la referencia para la meta de inflación en muchos países, incluido México.",
    modulo: "inflacion",
  },
  {
    termino: "Tasa real ex post",
    definicion: "Resultado de restar la inflación ya observada a la tasa de interés nominal. Refleja el costo real del dinero una vez ocurrida la inflación y sirve para evaluar rendimientos pasados de bonos o créditos. Si la inflación supera a la tasa nominal, la tasa real ex post es negativa y el poder adquisitivo del ahorrador se erosiona.",
    modulo: "inflacion",
    formula: "r_ex_post = i - π",
    ejemplo: "Si la tasa nominal es 9% y la inflación fue 5%, la tasa real ex post es 4%.",
  },
  {
    termino: "Tasa real ex ante",
    definicion: "Tasa nominal menos la inflación esperada para el periodo relevante; en la práctica suele usarse la inflación subyacente como proxy. Es la variable que guía las decisiones de inversión, consumo y ahorro de familias y empresas, y la que el banco central considera al fijar la tasa de política para anclar expectativas.",
    modulo: "inflacion",
    formula: "r_ex_ante = i - π_esperada",
    ejemplo: "Si la tasa nominal es 9% y la inflación esperada es 4%, la tasa real ex ante es 5%.",
  },
  {
    termino: "Regla de Taylor",
    definicion: "Fórmula que indica cómo debería ajustarse la tasa de política monetaria ante desviaciones de la inflación respecto a su meta y de la brecha de producto. Sirve como referencia teórica y de comunicación para los bancos centrales; no se aplica de forma mecánica porque la economía es incierta y existen rezagos. Los coeficientes α y β ponderan la importancia de estabilizar inflación y producto.",
    modulo: "inflacion",
    formula: "i = r* + π* + α(π - π*) + β(y - y*)",
    ejemplo: "Con r*=2%, π*=3%, α=0.5, β=0.5, si π=5% y brecha=+1%, entonces i ≈ 6.5%.",
  },
  {
    termino: "Brecha de producto",
    definicion: "Diferencia porcentual entre el PIB observado y el PIB potencial. Cuando es positiva la economía opera por encima de su capacidad y suelen aparecer presiones inflacionarias; cuando es negativa hay holgura y el banco central puede mantener o bajar la tasa. Se estima con filtros estadísticos o modelos de producción y es un insumo clave de la Regla de Taylor.",
    modulo: "inflacion",
    formula: "brecha = (Y - Y*) / Y* × 100",
  },
  {
    termino: "Brecha de inflación",
    definicion: "Diferencia entre la inflación observada (o esperada) y la meta que el banco central se ha fijado. Una brecha positiva indica que la inflación está por encima del objetivo y suele justificar una subida de la tasa de política; una negativa indica que hay margen para mantener o bajar la tasa. Es uno de los argumentos de la Regla de Taylor.",
    modulo: "inflacion",
    formula: "brecha_inflacion = π - π*",
  },
  {
    termino: "Meta de inflación",
    definicion: "Objetivo numérico de inflación que el banco central anuncia y se compromete a alcanzar en el mediano plazo; en México es 3% con un intervalo de ±1%. Ancla las expectativas del público y da transparencia a la política monetaria. Permite evaluar el desempeño del banco central y reduce la incertidumbre para inversionistas y hogares.",
    modulo: "inflacion",
  },
  {
    termino: "Política expansiva",
    definicion: "Postura del banco central consistente en bajar o mantener baja la tasa de interés de política para estimular el crédito, el consumo y la inversión. Se usa cuando la inflación está controlada y existe holgura en la economía o riesgo recesivo. Los canales de transmisión incluyen el costo del crédito, el tipo de cambio y el valor de los activos.",
    modulo: "inflacion",
  },
  {
    termino: "Política restrictiva",
    definicion: "Postura del banco central que sube la tasa de interés para enfriar la demanda agregada y anclar las expectativas de inflación. Se aplica cuando la inflación está por encima de la meta o la economía está sobrecalentada. Reduce el incentivo a endeudarse y a gastar, lo que con rezago contribuye a bajar la inflación.",
    modulo: "inflacion",
  },
  {
    termino: "Tasa de política monetaria",
    definicion: "Tasa de interés que el banco central fija como referencia para el mercado interbancario; en México corresponde a la tasa de fondeo a un día. Es el principal instrumento de política monetaria: su nivel influye en las tasas de crédito, depósitos y bonos, y por tanto en el gasto y la inflación. Se anuncia en las decisiones de política monetaria (Banxico).",
    modulo: "inflacion",
  },
  // Macroeconomía
  {
    termino: "Multiplicador del gasto",
    definicion: "Coeficiente que mide cuánto aumenta la renta o producto de equilibrio cuando el gasto público aumenta en una unidad. En el modelo keynesiano simple depende de la propensión marginal a consumir: cuanto mayor es la PMC, mayor es el multiplicador. Refleja los rounds de gasto inducido (el gasto de unos es ingreso de otros). Se usa para evaluar el impacto de la política fiscal sobre el producto.",
    modulo: "macro",
    formula: "k_G = 1 / (1 - PMC)",
    ejemplo: "Si PMC = 0.6, entonces k_G = 1 / 0.4 = 2.5. Un aumento de G en $10 aumenta Y en $25.",
  },
  {
    termino: "Multiplicador de impuestos",
    definicion: "Coeficiente que mide cuánto cambia la renta de equilibrio cuando cambian los impuestos en una unidad. Es negativo porque un aumento de impuestos reduce la renta disponible y el consumo, lo que a su vez reduce la demanda agregada y el producto. En valor absoluto suele ser menor que el multiplicador del gasto porque el impuesto afecta solo la parte del ingreso que se consume (PMC).",
    modulo: "macro",
    formula: "k_T = -PMC / (1 - PMC)",
    ejemplo: "Si PMC = 0.6, entonces k_T = -0.6 / 0.4 = -1.5. Un aumento de T en $10 reduce Y en $15.",
  },
  {
    termino: "Multiplicador de presupuesto equilibrado",
    definicion: "Cuando el gasto público y los impuestos aumentan en la misma cantidad (presupuesto equilibrado), el efecto neto sobre la renta de equilibrio es positivo e igual a uno: el producto aumenta en la cuantía del aumento de G. El efecto expansivo del gasto supera el efecto contractivo de los impuestos porque solo una fracción del ingreso (PMC) se dedica a consumo. Es un resultado clave del modelo 45° keynesiano.",
    modulo: "macro",
    formula: "k_equilibrado = 1",
    ejemplo: "Si G y T aumentan ambos en $10, Y aumenta en $10.",
  },
  {
    termino: "Propensión marginal a consumir (PMC)",
    definicion: "Proporción del ingreso adicional (o disponible) que los hogares destinan a consumo; está entre 0 y 1. Es el parámetro central del multiplicador del gasto y del de impuestos: una PMC más alta implica un multiplicador mayor y mayor sensibilidad del producto al gasto público. Se estima con datos de consumo e ingreso y suele ser estable en el corto plazo.",
    modulo: "macro",
    formula: "PMC = ΔC / ΔYd",
    ejemplo: "Si el ingreso disponible aumenta $100 y el consumo aumenta $60, PMC = 0.6.",
  },
  {
    termino: "Renta de equilibrio",
    definicion: "Nivel de producción (o renta) en el que la demanda agregada iguala a la oferta agregada, de modo que no hay acumulación ni desacumulación no deseada de inventarios. En el modelo keynesiano simple se obtiene igualando Y = C + I + G y depende del gasto autónomo y de la PMC. Es el nivel de producto que el modelo predice cuando el mercado de bienes está en equilibrio.",
    modulo: "macro",
    formula: "Y* = (C₀ + I + G - PMC × T) / (1 - PMC)",
  },
  {
    termino: "Curva IS",
    definicion: "Lugar geométrico de combinaciones de renta (Y) y tasa de interés (r) para las cuales el mercado de bienes está en equilibrio (ahorro planeado igual inversión planeada, o demanda agregada igual producto). Tiene pendiente negativa: una tasa más alta reduce la inversión y por tanto la demanda y el producto. Se desplaza con cambios en G, T o expectativas que afecten C o I.",
    modulo: "macro",
    formula: "Y = [C₀ + I₀ - b×r + G - PMC×T] / (1 - PMC)",
  },
  {
    termino: "Curva LM",
    definicion: "Lugar geométrico de combinaciones de renta (Y) y tasa de interés (r) para las cuales el mercado de dinero está en equilibrio (oferta real de dinero igual a demanda de saldos reales). Tiene pendiente positiva: mayor renta aumenta la demanda de dinero y para mantener el equilibrio la tasa debe subir. Se desplaza con cambios en la oferta monetaria nominal o en el nivel de precios.",
    modulo: "macro",
    formula: "M/P = k×Y - h×r",
  },
  {
    termino: "Equilibrio IS-LM",
    definicion: "Punto donde se cortan las curvas IS y LM; determina de forma simultánea la renta y la tasa de interés de equilibrio en el modelo de dos mercados (bienes y dinero). Permite analizar los efectos de la política fiscal (que desplaza IS) y de la política monetaria (que desplaza LM) sobre el producto y el tipo de interés. Es la base del modelo Mundell-Fleming en economía abierta.",
    modulo: "macro",
  },
  // Microeconomía
  {
    termino: "Intercepto de demanda (a)",
    definicion: "En la función lineal Qd = a - b×P, el parámetro a es el precio máximo al que la cantidad demandada sería cero; representa la ordenada en el origen cuando se expresa P en función de Q. Determina dónde la curva de demanda corta el eje de precios y refleja la disposición máxima a pagar por la primera unidad. Con la pendiente b define por completo la demanda en el modelo lineal.",
    modulo: "micro",
    formula: "Qd = a - b×P",
  },
  {
    termino: "Pendiente de demanda (b)",
    definicion: "En Qd = a - b×P, el coeficiente b mide cuánto disminuye la cantidad demandada cuando el precio sube una unidad; la pendiente de la curva en el plano (P, Q) es -1/b. Cuanto mayor es b, más sensible (elástica) es la demanda al precio en torno a un punto. Determina junto con el intercepto a el precio y la cantidad de equilibrio y el excedente del consumidor.",
    modulo: "micro",
    formula: "Qd = a - b×P",
  },
  {
    termino: "Intercepto de oferta (c)",
    definicion: "En la función lineal Qs = c + d×P, el parámetro c puede interpretarse como la cantidad ofrecida a precio cero (si c > 0) o como el precio mínimo de oferta cuando c se expresa en unidades de precio. En la forma estándar determina dónde la curva de oferta corta el eje de cantidades. Con la pendiente d define la oferta y participa en el cálculo del equilibrio y del excedente del productor.",
    modulo: "micro",
    formula: "Qs = c + d×P",
  },
  {
    termino: "Pendiente de oferta (d)",
    definicion: "En Qs = c + d×P, el coeficiente d mide cuánto aumenta la cantidad ofrecida cuando el precio sube una unidad; la pendiente de la curva de oferta en el plano (P, Q) es 1/d. Refleja la sensibilidad de los productores al precio (costos marginales crecientes típicamente implican d finito). Con el intercepto c determina el precio y la cantidad de equilibrio y el excedente del productor.",
    modulo: "micro",
    formula: "Qs = c + d×P",
  },
  {
    termino: "Precio de equilibrio",
    definicion: "Precio en el que la cantidad demandada iguala a la cantidad ofrecida (Qd = Qs), de modo que no hay exceso de demanda ni de oferta y el mercado se vacía. En el modelo lineal se obtiene igualando a - b×P = c + d×P. Es el precio que prevalece en competencia perfecta sin intervención; sirve como referencia para evaluar impuestos, precios máximos o mínimos y bienestar.",
    modulo: "micro",
    formula: "P* = (a - c) / (b + d)",
  },
  {
    termino: "Cantidad de equilibrio",
    definicion: "Cantidad intercambiada en el punto donde la demanda y la oferta se igualan; en el modelo lineal Q* = (a×d + b×c)/(b + d). Representa el volumen de transacciones en equilibrio competitivo. Se usa junto con el precio de equilibrio para calcular excedentes del consumidor y del productor y para analizar el impacto de impuestos o controles de precios sobre la cantidad asignada.",
    modulo: "micro",
    formula: "Q* = (a×d + b×c) / (b + d)",
  },
  {
    termino: "Excedente del consumidor",
    definicion: "Diferencia entre la disposición máxima a pagar de los consumidores (área bajo la curva de demanda) y lo que efectivamente pagan (precio de equilibrio × cantidad). En el modelo lineal con demanda Qd = a - b×P corresponde al área del triángulo sobre el precio y bajo la demanda. Mide el bienestar que el mercado reporta a los compradores y se usa en análisis de eficiencia y política pública.",
    modulo: "micro",
    formula: "EC = (1/2) × (a - P*) × Q*",
  },
  {
    termino: "Excedente del productor",
    definicion: "Diferencia entre lo que los productores reciben por las unidades vendidas (precio × cantidad) y el costo mínimo al que estarían dispuestos a ofrecerlas (área bajo la curva de oferta). En el modelo lineal con Qs = c + d×P es el área del triángulo bajo el precio y sobre la oferta. Mide el beneficio neto de los vendedores en el mercado y se combina con el excedente del consumidor para evaluar el bienestar total.",
    modulo: "micro",
    formula: "EP = (1/2) × (P* - c) × Q*",
  },
  {
    termino: "Elasticidad precio de la demanda (arco)",
    definicion: "Medida de la sensibilidad porcentual de la cantidad demandada ante un cambio porcentual en el precio, calculada entre dos puntos usando el promedio de precios y cantidades como base para evitar asimetría. Si |ε| > 1 la demanda es elástica (el ingreso total cae cuando sube el precio); si |ε| < 1 es inelástica. Se usa en política de precios, imposición y análisis de bienestar.",
    modulo: "micro",
    formula: "ε = [(Q₂ - Q₁) / ((Q₁ + Q₂)/2)] / [(P₂ - P₁) / ((P₁ + P₂)/2)]",
    ejemplo: "Si el precio sube de $10 a $12 y la cantidad baja de 100 a 80, ε ≈ -1.11 (elástica).",
  },
  {
    termino: "Demanda elástica",
    definicion: "Cuando el valor absoluto de la elasticidad precio de la demanda es mayor que 1: un aumento de 1% en el precio reduce la cantidad en más de 1%. El ingreso total del vendedor disminuye al subir el precio. Es típico de bienes con sustitutos cercanos o de gasto relevante en el presupuesto. Relevante para estrategias de precios y para la incidencia de impuestos (los consumidores absorben menos en términos relativos cuando la demanda es elástica).",
    modulo: "micro",
  },
  {
    termino: "Demanda inelástica",
    definicion: "Cuando el valor absoluto de la elasticidad precio de la demanda es menor que 1: un aumento de 1% en el precio reduce la cantidad en menos de 1%. El ingreso total del vendedor aumenta al subir el precio. Es típico de bienes necesarios o con pocos sustitutos. Los impuestos sobre bienes de demanda inelástica recaen más en los compradores y generan menor pérdida de cantidad transada.",
    modulo: "micro",
  },
  {
    termino: "Demanda unitaria",
    definicion: "Cuando la elasticidad precio de la demanda en valor absoluto es igual a 1: un cambio de 1% en el precio genera un cambio de 1% en la cantidad en sentido contrario. El ingreso total del vendedor no cambia ante pequeñas variaciones del precio. Es el caso frontera entre demanda elástica e inelástica y sirve como referencia en teoría de monopolio (el ingreso marginal es cero cuando la demanda es unitaria).",
    modulo: "micro",
  },
  // Finanzas: bancos, instrumentos, deuda y bursátil
  {
    termino: "Banco comercial",
    definicion: "Institución financiera que capta depósitos del público y otorga créditos, realizando intermediación entre ahorradores y prestatarios. Ofrece servicios de pagos, cuentas de cheques, tarjetas y custodia. Está regulada por la autoridad bancaria (en México la CNBV y el Banco de México); su solvencia y liquidez son supervisadas. Es el núcleo del sistema de pagos y del canal de transmisión de la política monetaria al sector privado.",
    modulo: "finanzas",
  },
  {
    termino: "Instrumento financiero",
    definicion: "Contrato que da origen a un activo financiero para una parte y un pasivo o instrumento de patrimonio para otra. Incluye instrumentos de deuda (bonos, Cetes, pagarés), acciones, derivados y participaciones en fondos. Se emiten en mercado primario y se negocian en secundario. Su valoración y regulación dependen del tipo; las autoridades (CNBV, Banxico) exigen disclosure y cumplimiento de normas para proteger a inversionistas.",
    modulo: "finanzas",
  },
  {
    termino: "Instrumento de deuda",
    definicion: "Valor por el que el emisor se compromete a pagar principal e intereses (cupones) en fechas predeterminadas; representa un crédito del tenedor frente al emisor. Ejemplos: Cetes, bonos gubernamentales o corporativos, pagarés. El riesgo principal es el de incumplimiento (crediticio) y el de tasa de interés (el precio del bono varía cuando cambian las tasas). Se valora descontando los flujos futuros a la tasa de rendimiento requerida.",
    modulo: "finanzas",
  },
  {
    termino: "Título de deuda",
    definicion: "Documento o registro que representa un crédito frente al emisor (gobierno o empresa). Se coloca en el mercado primario y luego se negocia en el secundario; el precio refleja las tasas de interés, el plazo y la calidad crediticia. En México los emiten el gobierno federal (Cetes, Bondes), desarrollos y empresas; la regulación exige prospectos y calificación para proteger a los inversionistas. La duration y convexidad miden su sensibilidad al tipo de interés.",
    modulo: "finanzas",
  },
  {
    termino: "Cetes",
    definicion: "Certificados de la Tesorería de la Federación: instrumento de deuda gubernamental mexicano a corto plazo (28, 91, 182 o 364 días), emitido a descuento (sin cupones) y con liquidez en el mercado secundario. Son el referente de tasa libre de riesgo en pesos y sirven de base para la curva de rendimientos. Los subasta el Banco de México; inversionistas institucionales y personas físicas pueden adquirirlos a través de casas de bolsa o el sistema de banca múltiple.",
    modulo: "finanzas",
  },
  {
    termino: "Mercado bursátil",
    definicion: "Mercado organizado y regulado donde se emiten (mercado primario) y negocian (mercado secundario) acciones, títulos de deuda, ETFs y otros valores. Proporciona liquidez, formación de precios y canal de financiamiento para empresas y gobierno. En México la Bolsa Mexicana de Valores (BMV) es el principal; la CNBV supervisa. Los inversionistas acceden mediante casas de bolsa. La transparencia y las reglas de operación reducen el riesgo de contraparte y facilitan la valoración.",
    modulo: "finanzas",
  },
  {
    termino: "Renta fija",
    definicion: "Clase de instrumentos cuyos flujos son predecibles en monto y calendario: cupones y reembolso del principal. Incluye bonos gubernamentales, corporativos, Cetes y pagarés. El riesgo principal es el tipo de interés (el precio del bono baja cuando suben las tasas) y el crédito (incumplimiento). Se usa para preservar capital, generar ingresos recurrentes y diversificar frente a la renta variable. La duration mide la sensibilidad del precio a cambios en la tasa.",
    modulo: "finanzas",
  },
  {
    termino: "Renta variable",
    definicion: "Instrumentos cuyo rendimiento no está garantizado y depende de resultados de la empresa y del mercado: principalmente acciones (dividendos y plusvalía). Ofrece mayor potencial de ganancia y mayor riesgo que la renta fija; su valoración se basa en flujos esperados (DCF), múltiplos (P/E) y modelos como el CAPM. Es la base del mercado de capitales para financiar empresas en crecimiento; los índices bursátiles reflejan el desempeño de carteras representativas de renta variable.",
    modulo: "finanzas",
  },
  {
    termino: "UPA / EPS (Utilidad por Acción)",
    definicion: "Beneficio neto atribuible a los accionistas comunes dividido entre el número de acciones en circulación; mide la porción de utilidad que corresponde a cada acción. Es el denominador del múltiplo P/E y sirve para comparar rentabilidad entre empresas y en el tiempo. Se calcula con utilidad neta ajustada por elementos extraordinarios y acciones dilutivas cuando aplica. Las expectativas de analistas sobre el EPS futuro influyen en la valoración de la acción.",
    modulo: "finanzas",
    formula: "EPS = Utilidad Neta / Acciones en Circulación"
  },
  {
    termino: "P/E Ratio (Price-to-Earnings)",
    definicion: "Múltiplo que resulta de dividir el precio de la acción entre la utilidad por acción (EPS); indica cuántas veces el mercado está pagando la ganancia anual. Un P/E alto puede reflejar expectativas de crecimiento o sobrevaloración; uno bajo, valoración conservadora o problemas esperados. Se usa para comparar empresas del mismo sector y con el histórico; debe complementarse con análisis de crecimiento, ROE y flujos de caja. No aplica bien cuando la utilidad es negativa o muy volátil.",
    modulo: "finanzas",
    formula: "P/E = Precio por Acción / EPS"
  },
  {
    termino: "ROE (Return on Equity)",
    definicion: "Rentabilidad del capital contable: utilidad neta dividida entre el capital aportado por los accionistas (patrimonio), expresada en porcentaje. Mide la eficiencia con la que la empresa genera ganancias con el capital propio; un ROE sostenible y superior al costo del capital crea valor. Se descompone en el análisis DuPont (margen × rotación × apalancamiento). Es un indicador clave para comparar empresas y evaluar la calidad de la gestión; se relaciona con la tasa de descuento en valoración por DCF.",
    modulo: "finanzas",
    formula: "ROE = (Utilidad Neta / Capital Contable) * 100"
  },
  // Blockchain y Criptomonedas
  {
    termino: "Blockchain (Cadena de bloques)",
    definicion: "Libro mayor distribuido y descentralizado que registra transacciones en bloques encadenados criptográficamente, de modo que modificar un registro pasado requeriría alterar toda la cadena posterior y el consenso de la red. Elimina la necesidad de un intermediario central para validar y custodiar la información. Se usa en criptomonedas (Bitcoin, Ethereum), contratos inteligentes, trazabilidad y registros inmutables. La integridad se asegura por consenso (PoW, PoS) y estructuras como el árbol de Merkle.",
    modulo: "general",
  },
  {
    termino: "Halving",
    definicion: "Evento programado en el protocolo de Bitcoin (y en otras redes) que reduce a la mitad la recompensa que reciben los mineros por cada bloque minado válido. Ocurre aproximadamente cada cuatro años; limita la emisión nueva y, en teoría, refuerza la escasez del activo. Afecta la rentabilidad de la minería y suele asociarse a movimientos de precio por expectativas de oferta. Es un ejemplo de política monetaria predeterminada y no discrecional en una criptomoneda.",
    modulo: "general",
  },
  {
    termino: "Proof of Work (PoW)",
    definicion: "Algoritmo de consenso por el que los mineros compiten resolviendo problemas criptográficos costosos en cómputo y energía; el primero en resolver obtiene el derecho a proponer el siguiente bloque y recibe una recompensa. La dificultad se ajusta para mantener un ritmo de bloques estable. Usado por Bitcoin; ofrece seguridad alta pero consume mucha energía. La alternativa Proof of Stake (PoS) reduce el consumo al reemplazar el trabajo computacional por garantías en forma de tokens bloqueados.",
    modulo: "general",
  },
  {
    termino: "Proof of Stake (PoS)",
    definicion: "Algoritmo de consenso en el que los validadores son elegidos en función de la cantidad de tokens que han bloqueado (stake) como garantía; no compiten por poder de cómputo. Quien actúa de forma deshonesta puede perder su stake. Reduce el consumo energético frente a Proof of Work y permite mayor throughput; Ethereum migró a PoS (The Merge). La descentralización depende de la distribución del stake y de los requisitos mínimos para ser validador.",
    modulo: "general",
  },
  {
    termino: "DeFi (Finanzas Descentralizadas)",
    definicion: "Conjunto de aplicaciones financieras (préstamos, intercambios, emisión de activos, derivados) construidas sobre blockchain y ejecutadas mediante contratos inteligentes, sin intermediarios centralizados como bancos o bolsas. Los usuarios interactúan con protocolos mediante wallets; la liquidez proviene de proveedores que reciben tokens o rendimientos. Ofrece inclusión y transparencia on-chain, pero con riesgos de smart contracts, volatilidad y marcos regulatorios aún en desarrollo. Ejemplos: Uniswap, Aave, Maker.",
    modulo: "general",
  },
  { termino: "INPC", definicion: "Índice Nacional de Precios al Consumidor: indicador que mide la evolución de los precios de una canasta fija de bienes y servicios representativa del consumo de los hogares en México. Lo elabora y publica el INEGI con periodicidad quincenal y mensual. Es la base para calcular la inflación general y la subyacente; el Banco de México y el gobierno lo usan para evaluar el cumplimiento de la meta de inflación y para indexar contratos y salarios.", modulo: "inflacion" },
  { termino: "Inflación general", definicion: "Variación porcentual del INPC en un periodo dado (mensual o anual). Incluye todos los bienes y servicios de la canasta, por lo que refleja choques en alimentos no elaborados, energéticos y tarifas reguladas. Es el indicador más citado por medios y hogares; el banco central la monitorea junto con la inflación subyacente para distinguir presiones persistentes de movimientos volátiles.", modulo: "inflacion" },
  { termino: "Choque de oferta", definicion: "Evento que altera los costos de producción o la capacidad productiva de la economía (por ejemplo alza de energéticos, sequía, desabasto o perturbaciones en cadenas globales). Puede elevar la inflación y al mismo tiempo reducir la actividad económica. Genera un dilema de política: subir la tasa para anclar expectativas puede profundizar la caída del producto; no hacerlo puede desanclar la inflación.", modulo: "inflacion" },
  { termino: "Choque de demanda", definicion: "Cambio en el gasto agregado (consumo, inversión, gasto público o saldo externo) que desplaza la curva de demanda agregada y afecta el nivel de precios y el producto. Un shock positivo aumenta la demanda y suele presionar al alza tanto la actividad como la inflación; uno negativo reduce ambos. La política monetaria puede contrarrestar choques de demanda ajustando la tasa de interés.", modulo: "inflacion" },
  { termino: "Expectativas adaptativas", definicion: "Hipótesis según la cual los agentes forman su expectativa de inflación futura basándose principalmente en la inflación observada en el pasado reciente (por ejemplo un promedio móvil). Es un supuesto de aprendizaje backward-looking: no incorporan de forma plena el anuncio de meta del banco central. En modelos con curva de Phillips permite un trade-off inflación-desempleo en el corto plazo.", modulo: "inflacion" },
  { termino: "Expectativas racionales", definicion: "Hipótesis según la cual los agentes usan toda la información disponible (incluida la política monetaria y la meta de inflación) para formar sus expectativas; los errores de predicción son impredecibles y en promedio cero. Reduce el trade-off permanente entre inflación y desempleo y subraya la importancia de la credibilidad del banco central. Es el benchmark en muchos modelos macroeconómicos.", modulo: "inflacion" },
  { termino: "Anclaje de expectativas", definicion: "Situación en que las expectativas de inflación del público están alineadas con la meta anunciada por el banco central. Cuando las expectativas están ancladas, un choque temporal de precios tiene menos efecto sobre la inflación futura porque los agentes confían en que el banco actuará para volver a la meta. La credibilidad y la comunicación clara favorecen el anclaje.", modulo: "inflacion" },
  { termino: "NAIRU", definicion: "Tasa de desempleo no aceleradora de la inflación: nivel de desempleo por debajo del cual la inflación tiende a acelerarse y por encima del cual tiende a bajar. Refleja restricciones del mercado laboral y de capacidad productiva. En la curva de Phillips de largo plazo la economía converge al NAIRU sin trade-off permanente inflación-desempleo. Se estima con modelos econométricos y no es observable directamente.", modulo: "inflacion" },
  { termino: "Tasa neutral", definicion: "Tasa de interés real (ajustada por inflación) que mantendría la economía en equilibrio con el producto en su potencial y la inflación estable. Por encima de ella la política es restrictiva; por debajo, expansiva. Los bancos centrales la usan como referencia para diagnosticar la postura monetaria. No es observable directamente y se estima con modelos (ej. Laubach-Williams).", modulo: "inflacion" },
  { termino: "Deflación", definicion: "Caída sostenida y generalizada del nivel de precios (inflación negativa). Puede generar expectativas de precios aún más bajos y posponer el consumo y la inversión, debilitando la actividad. Aumenta el valor real de la deuda y complica la política monetaria si las tasas nominales ya están cerca de cero. Suele asociarse a recesiones profundas o crisis financieras.", modulo: "inflacion" },
  { termino: "Estanflación", definicion: "Combinación de estancamiento o recesión (crecimiento bajo o negativo del PIB y alto desempleo) con alta inflación. Suele surgir tras choques de oferta que elevan precios y reducen la actividad. Plantea un dilema: subir la tasa para combatir la inflación puede agravar el desempleo; bajar la tasa para reactivar puede alimentar más inflación. Los años setenta son un ejemplo histórico.", modulo: "inflacion" },
  { termino: "Transmisión monetaria", definicion: "Mecanismos por los que un cambio en la tasa de política monetaria afecta la inflación y el producto. Incluyen el canal de tasas de interés (crédito más caro o más barato), el canal del tipo de cambio (apreciación o depreciación) y el canal de precios de activos (riqueza y colateral). Los efectos operan con rezagos, por lo que el banco central debe actuar con anticipación.", modulo: "inflacion" },
  { termino: "Curva de Phillips corto plazo", definicion: "Relación inversa entre desempleo e inflación en el corto plazo cuando las expectativas de inflación están dadas: menor desempleo se asocia a mayor inflación porque las empresas suben precios y los trabajadores negocian salarios más altos. Permite un trade-off entre inflación y desempleo que la política monetaria puede explotar temporalmente. La pendiente depende de cómo se formen las expectativas y de la rigidez de precios y salarios.", modulo: "macro" },
  { termino: "Curva de Phillips largo plazo", definicion: "Con expectativas de inflación totalmente ajustadas, la curva de Phillips es vertical al nivel del NAIRU: no existe trade-off permanente entre inflación y desempleo. Cualquier tasa de inflación puede ser compatible con el desempleo natural; la política monetaria no puede mantener el desempleo por debajo del NAIRU sin acelerar la inflación. Refuerza el papel del anclaje de expectativas.", modulo: "macro" },
  { termino: "Modelo de Solow", definicion: "Modelo de crecimiento a largo plazo en el que el producto depende del capital, el trabajo y la productividad total de factores (PTF): Y = A × K^α × L^(1-α). El crecimiento sostenido del ingreso per cápita proviene del progreso técnico (crecimiento de A), no solo de la acumulación de capital, que tiene rendimientos decrecientes. Es la referencia para analizar convergencia entre países y políticas de crecimiento.", modulo: "macro" },
  { termino: "Estado estacionario", definicion: "En el modelo de Solow, situación en la que el capital por trabajador y el producto por trabajador ya no cambian: la inversión iguala a la depreciación y no hay acumulación neta de capital per cápita. El producto crece solo al ritmo del crecimiento de la población o de la productividad. Sirve para caracterizar el nivel de largo plazo hacia el que converge la economía.", modulo: "macro" },
  { termino: "PTF (Productividad total factores)", definicion: "Parte del crecimiento del producto no explicada por aumentos en las cantidades de capital o trabajo; refleja eficiencia, progreso técnico e innovación. Se calcula como residuo en la función de producción (residuo de Solow). Es clave para el crecimiento a largo plazo y para comparar la eficiencia entre países o sectores. Mejoras en instituciones, educación e I+D la elevan.", modulo: "macro" },
  { termino: "Mundell-Fleming", definicion: "Extensión del modelo IS-LM a una economía abierta con movilidad de capital. La efectividad de la política fiscal y monetaria depende del régimen cambiario: con tipo de cambio flexible la política monetaria es poderosa y la fiscal se diluye por apreciación; con tipo de cambio fijo ocurre lo contrario. Es la referencia para analizar políticas en economías pequeñas y abiertas y para el trilema de Mundell.", modulo: "macro" },
  { termino: "Trilema de Mundell", definicion: "Solo dos de tres objetivos son compatibles de forma simultánea: movilidad de capital, tipo de cambio fijo y política monetaria autónoma. Por ejemplo, con movilidad de capital y tipo de cambio fijo el banco central no puede fijar la tasa de interés a su gusto. Obliga a elegir entre anclar el tipo de cambio o conservar el instrumento monetario; las crisis de tipos fijos ilustran este conflicto.", modulo: "macro" },
  { termino: "Oferta agregada", definicion: "Relación entre el nivel de precios y la cantidad total de producto que las empresas están dispuestas a ofrecer. En el corto plazo puede tener pendiente positiva (más producción implica más presión sobre costos y precios); en el largo plazo suele modelarse vertical al nivel del producto potencial. Los choques de oferta desplazan esta curva y afectan inflación y producto.", modulo: "macro" },
  { termino: "Demanda agregada", definicion: "Relación entre el nivel de precios y la cantidad total de bienes y servicios demandados (C + I + G + X - M). Tiene pendiente negativa por el efecto riqueza, el efecto tipo de interés y el efecto tipo de cambio. La política fiscal y monetaria desplazan la demanda agregada. El cruce con la oferta agregada determina el nivel de precios y el producto de equilibrio en el modelo OA-DA.", modulo: "macro" },
  { termino: "PIB real", definicion: "Producto Interior Bruto medido a precios constantes (de un año base); elimina el efecto de la inflación para captar el crecimiento real del volumen de producción. Es el indicador estándar del crecimiento económico y del ciclo. Lo publican las oficinas de estadística (en México el INEGI) en series trimestrales y anuales; se usa para definir recesiones y brechas de producto.", modulo: "macro" },
  { termino: "PIB nominal", definicion: "Producto Interior Bruto valorado a precios corrientes del periodo; incluye el efecto de la inflación. La diferencia entre crecimiento del PIB nominal y del PIB real aproxima la inflación del PIB. Se usa en comparaciones de valor (por ejemplo participación del gasto público en el PIB) y para derivar deflactores; para análisis de crecimiento se prefiere el PIB real.", modulo: "macro" },
  { termino: "PIB potencial", definicion: "Nivel máximo de producto que la economía puede sostener en el mediano plazo sin generar presiones inflacionarias insostenibles; refleja la capacidad productiva (capital, trabajo, tecnología) y la NAIRU. Se estima con filtros estadísticos o modelos de producción. La brecha entre PIB observado y potencial es un insumo clave para la política monetaria y la Regla de Taylor.", modulo: "macro" },
  { termino: "Recesión", definicion: "Caída del PIB real durante al menos dos trimestres consecutivos; indicador estándar de fase contractiva del ciclo económico. Suele ir acompañada de aumento del desempleo y menor utilización de capacidad. Los bancos centrales y gobiernos suelen relajar política monetaria y fiscal en recesiones. En algunos países (ej. EE.UU.) se define de forma más amplia por un comité de fechado del ciclo.", modulo: "macro" },
  { termino: "Utilidad marginal", definicion: "Incremento de utilidad que reporta al consumidor una unidad adicional de un bien; en la teoría neoclásica suele suponerse decreciente (ley de utilidad marginal decreciente). La condición de maximización de utilidad sujeto a la restricción presupuestaria implica que la relación de utilidades marginales entre dos bienes iguale la relación de precios. Es la base para derivar la curva de demanda y para el análisis de excedente del consumidor.", modulo: "micro" },
  { termino: "Curva de indiferencia", definicion: "Lugar geométrico de combinaciones de dos bienes que reportan al consumidor la misma utilidad; el consumidor está indiferente entre cualquier punto de la curva. Suele representarse convexa al origen por la sustituibilidad imperfecta entre bienes. Las curvas más alejadas del origen representan mayor nivel de utilidad. La pendiente (tasa marginal de sustitución) en un punto indica cuánto está dispuesto a ceder de un bien por una unidad más del otro.", modulo: "micro" },
  { termino: "Costo marginal", definicion: "Incremento del costo total cuando se produce una unidad adicional de output. En competencia perfecta la empresa maximiza beneficio produciendo hasta que P = CMg; si el precio está por debajo del costo marginal conviene reducir la producción. En monopolio la condición es IMg = CMg. El costo marginal suele ser creciente a corto plazo por rendimientos decrecientes; es central para la curva de oferta y el análisis de eficiencia.", modulo: "micro" },
  { termino: "Ingreso marginal", definicion: "Incremento del ingreso total cuando se vende una unidad adicional. En competencia perfecta el ingreso marginal coincide con el precio (la empresa es precio-aceptante). En monopolio el IMg es menor que el precio porque para vender más hay que bajar el precio en todas las unidades; la condición de maximización de beneficio es IMg = CMg. La elasticidad de la demanda determina la relación entre IMg y P.", modulo: "micro" },
  { termino: "Competencia perfecta", definicion: "Estructura de mercado con muchos compradores y vendedores, producto homogéneo, información completa y libre entrada y salida. Las empresas son precio-aceptantes y maximizan beneficio igualando precio al costo marginal. En equilibrio a largo plazo el beneficio económico es cero y el precio iguala al costo total medio mínimo. Sirve como benchmark de eficiencia: la asignación competitiva maximiza el excedente total en ausencia de fallos de mercado.", modulo: "micro" },
  { termino: "Monopolio", definicion: "Estructura de mercado con un solo vendedor que enfrenta la demanda del mercado. El monopolista maximiza beneficio produciendo donde el ingreso marginal iguala al costo marginal; fija un precio por encima del costo marginal y genera pérdida irrecuperable de eficiencia. Las barreras a la entrada (patentes, costos hundidos, control de recursos) permiten que el poder de mercado se mantenga. La regulación o la competencia pueden limitar el abuso de poder de mercado.", modulo: "micro" },
  { termino: "Oligopolio", definicion: "Estructura de mercado con pocos vendedores cuyas decisiones de producción o precios son interdependientes: la reacción de los rivales afecta el resultado de cada uno. No hay una única teoría; se estudian modelos de Cournot, Bertrand, Stackelberg y teoría de juegos. Puede dar lugar a precios por encima del costo marginal (poder de mercado) y a colusión tácita o explícita. Es típico en industrias con altos costos fijos o diferenciación de producto.", modulo: "micro" },
  { termino: "Fallo de mercado", definicion: "Situación en la que el mercado asigna los recursos de forma ineficiente sin intervención. Incluye externalidades (costos o beneficios no internalizados), bienes públicos (no rivales y no excluibles), poder de mercado (monopolio, oligopolio) e información asimétrica. La economía del bienestar muestra que en competencia perfecta y sin fallos el equilibrio es eficiente en el sentido de Pareto; los fallos justifican políticas correctivas o provisión pública.", modulo: "micro" },
  { termino: "Externalidad", definicion: "Efecto de una actividad económica sobre el bienestar de terceros que no se refleja en el precio del mercado. Si es negativa (contaminación), el costo social supera el privado y se produce en exceso; si es positiva (investigación, vacunas), el beneficio social supera el privado y se produce de menos. Soluciones incluyen impuestos o subsidios pigouvianos, permisos negociables, regulación e internalización. Es una de las causas clásicas de fallo de mercado.", modulo: "micro" },
  { termino: "Bien público", definicion: "Bien que es no rival (el consumo por uno no reduce el disponible para otros) y no excluible (no se puede impedir el consumo a quien no pague). Ejemplos: defensa nacional, faros, conocimiento puro. El mercado tiende a subproveerlos porque los usuarios tienen incentivo a no pagar (free rider). Suele justificar la provisión o financiación pública. Los bienes pueden ser solo no rivales o solo no excluibles (bienes de club, recursos comunes).", modulo: "micro" },
  { termino: "Elasticidad ingreso", definicion: "Medida de la sensibilidad porcentual de la cantidad demandada de un bien ante un cambio porcentual en el ingreso del consumidor: η = (ΔQ/Q)/(ΔY/Y). Si η > 0 el bien es normal; si η < 0 es inferior; si η > 1 es de lujo. Sirve para clasificar bienes y prever cómo cambia la estructura de consumo cuando crece la renta; es relevante para política tributaria y para proyecciones de demanda por sectores.", modulo: "micro" },
  { termino: "Elasticidad cruzada", definicion: "Medida de la sensibilidad porcentual de la cantidad demandada de un bien ante un cambio porcentual en el precio de otro bien: ε_xy = (ΔQ_x/Q_x)/(ΔP_y/P_y). Si es positiva los bienes son sustitutos (sube el precio de y, aumenta la demanda de x); si es negativa son complementarios. Si es cero son independientes. Se usa para definir mercados (sustituibilidad), análisis de competencia y efectos de impuestos sobre bienes relacionados.", modulo: "micro" },
  { termino: "DCF", definicion: "Valoración por descuento de flujos de caja: el valor de un activo o empresa es el valor presente de los flujos de caja libres futuros esperados, descontados a una tasa que refleje el riesgo (por ejemplo el WACC). Fórmula base: V = Σ FCF_t / (1 + r)^t más el valor terminal. Es el método teórico de referencia en finanzas corporativas; requiere proyectar flujos, estimar la tasa de descuento y el valor terminal. Se usa para valorar acciones, proyectos y fusiones y adquisiciones.", modulo: "finanzas" },
  { termino: "VPN", definicion: "Valor presente neto: diferencia entre el valor presente de las entradas de efectivo y el valor presente de las salidas de un proyecto o inversión. Un proyecto es viable si VPN > 0; se elige entre alternativas por el VPN mayor. La tasa de descuento suele ser el costo de capital (WACC) o la tasa de oportunidad. Incorpora el valor del dinero en el tiempo y todos los flujos del proyecto; es consistente con la maximización del valor para el accionista.", modulo: "finanzas" },
  { termino: "TIR", definicion: "Tasa interna de retorno: tasa de descuento que iguala el valor presente de los flujos futuros con la inversión inicial (VPN = 0). Se compara con el costo de capital o la tasa mínima requerida: si TIR > costo de capital el proyecto crea valor. Puede haber múltiples TIR en flujos no convencionales; no mide la magnitud del valor creado (para eso se usa el VPN). Es muy usada en evaluación de proyectos y en renta fija para expresar el rendimiento al vencimiento.", modulo: "finanzas" },
  { termino: "WACC", definicion: "Costo promedio ponderado del capital: tasa de descuento que refleja el costo de financiar la empresa con deuda y capital propio, ponderado por la proporción de cada uno en la estructura de capital. Fórmula: WACC = (E/V)×r_e + (D/V)×r_d×(1-T), donde E y D son valor de mercado de equity y deuda, T es tasa impositiva. Se usa para descontar flujos de caja libres en valoración DCF y para evaluar inversiones; el costo del equity suele estimarse con CAPM.", modulo: "finanzas" },
  { termino: "Beta", definicion: "Coeficiente que mide la sensibilidad del rendimiento de un activo (o cartera) al rendimiento del mercado; representa el riesgo sistemático no diversificable. β = 1 implica volatilidad similar al mercado; β > 1 más volátil; β < 1 menos. Se estima por regresión histórica (rendimiento del activo sobre rendimiento del índice). Es el insumo clave del CAPM para calcular el rendimiento esperado y el costo del capital propio; las betas se publican en servicios de análisis.", modulo: "finanzas" },
  { termino: "CAPM", definicion: "Modelo de valoración de activos de capital: el rendimiento esperado de un activo es la tasa libre de riesgo más una prima proporcional al riesgo sistemático (beta). Fórmula: E(R) = R_f + β(R_m - R_f). La prima de riesgo del mercado (R_m - R_f) se estima con datos históricos. Se usa para determinar el costo del capital propio en el WACC, para valorar activos y para evaluar rendimientos ajustados por riesgo. Supone mercados eficientes y diversificación.", modulo: "finanzas" },
  { termino: "Flujo de caja libre", definicion: "Efectivo generado por la operación después de impuestos, menos las inversiones en capital de trabajo y activos fijos necesarios para mantener o expandir el negocio. Es el flujo disponible para acreedores y accionistas (devolución de deuda, dividendos, recompra de acciones). Es la base del DCF para valorar empresas; debe ser consistente con la definición de inversiones (mantenimiento vs crecimiento). Se calcula a partir del estado de flujos o como EBIT×(1-T) + depreciación - CapEx - Δ capital de trabajo.", modulo: "finanzas" },
  { termino: "Valor terminal", definicion: "Valor presente de los flujos de caja más allá del horizonte explícito de proyección en un modelo DCF. Suele calcularse con crecimiento perpetuo: VT = FCF_{n+1} / (r - g), donde r es la tasa de descuento y g la tasa de crecimiento a largo plazo. Representa la mayor parte del valor cuando el horizonte es corto; la hipótesis de g debe ser conservadora (no superior al crecimiento de la economía). Alternativas: múltiplo de salida o valoración por liquidez.", modulo: "finanzas" },
  { termino: "Duration", definicion: "Medida de la sensibilidad del precio de un bono a cambios en la tasa de interés; aproxima la variación porcentual del precio ante un cambio de 1% en el rendimiento. La duration de Macaulay es el promedio ponderado de los tiempos hasta cada flujo, ponderado por el valor presente del flujo. A mayor plazo y menor cupón, mayor duration. Se usa para inmunización de carteras, gestión del riesgo de tasa y comparación de bonos; la duration modificada permite estimar directamente el cambio de precio.", modulo: "finanzas" },
  { termino: "Convexidad", definicion: "Ajuste de segundo orden a la sensibilidad del precio del bono ante cambios en la tasa de interés. La duration alone subestima la subida del precio cuando las tasas bajan y sobrestima la caída cuando suben; la convexidad captura la curvatura de la relación precio-rendimiento y mejora la aproximación. Es positiva para bonos sin opciones; los bonos callable pueden tener convexidad negativa. Se usa junto con la duration en gestión de carteras de renta fija y en valoración de riesgo.", modulo: "finanzas" },
  { termino: "Tasa libre de riesgo", definicion: "Rendimiento de un activo sin riesgo de incumplimiento y con horizonte comparable; en la práctica se usan los rendimientos de bonos gubernamentales (en México los Cetes o bonos del gobierno). Es la base del CAPM (E(R) = R_f + β(R_m - R_f)) y del descuento en valoración; representa el costo de oportunidad del tiempo sin asumir riesgo crediticio. Para proyectos en dólares suele usarse el rendimiento de Treasury de EE.UU.; el plazo debe coincidir con el horizonte de la inversión.", modulo: "finanzas" },
  { termino: "Prima de riesgo", definicion: "Rendimiento adicional que exige el inversionista por asumir riesgo respecto a la tasa libre de riesgo. En el CAPM la prima de riesgo del mercado es (R_m - R_f); la prima de un activo es β(R_m - R_f). Para deuda corporativa la prima refleja el riesgo de incumplimiento (spread sobre el bono gubernamental). Se usa en valoración (costo de capital), en expectativas de rendimiento y en análisis de mercados; las primas varían en el tiempo con el ciclo y la aversión al riesgo.", modulo: "finanzas" },
  { termino: "PIB", definicion: "Producto Interior Bruto: valor de mercado de todos los bienes y servicios finales producidos en un país durante un periodo (trimestre o año). Se mide por el lado del gasto (C + I + G + X - M), del ingreso o del valor agregado. Es el indicador principal de la actividad económica y del nivel de vida; el INEGI y los institutos de estadística lo publican en forma nominal y real. Se usa para comparar países, definir recesiones y evaluar políticas; no incluye economía informal ni bienestar no monetario.", modulo: "general" },
  { termino: "Desempleo friccional", definicion: "Desempleo que existe porque las personas tardan tiempo en encontrar un empleo que se ajuste a sus preferencias y calificaciones, o porque hay desajustes temporales entre vacantes y buscadores. Es parte del desempleo natural y no indica debilidad estructural del mercado laboral. Políticas que reducen el costo de búsqueda (información de vacantes, intermediación laboral) pueden acortar su duración; cierto nivel es inevitable en una economía dinámica con movilidad laboral.", modulo: "general" },
  { termino: "Desempleo estructural", definicion: "Desempleo causado por un desajuste persistente entre las habilidades y la ubicación de los trabajadores y los requisitos y la localización de los puestos vacantes. Cambios tecnológicos, desindustrialización o desajustes geográficos lo generan. No se resuelve solo con estímulo de demanda; requiere formación, reconversión laboral y políticas activas de empleo. Contribuye al desempleo natural y a la NAIRU; su estimación es relevante para la política monetaria y la política de empleo.", modulo: "general" },
  { termino: "Desempleo cíclico", definicion: "Componente del desempleo asociado a la fase recesiva del ciclo económico: cuando el PIB cae, las empresas reducen plantilla y el desempleo aumenta por encima del nivel natural. Desaparece o se reduce cuando la actividad se recupera y se acerca al pleno empleo. La política monetaria y fiscal expansivas pueden reducirlo estimulando la demanda; su medición (brecha entre desempleo observado y NAIRU) es un insumo para diagnosticar la holgura del mercado laboral.", modulo: "general" },
  { termino: "Tipo de cambio nominal", definicion: "Precio de una moneda expresado en términos de otra; por ejemplo cuántos pesos se pagan por un dólar. Lo determina el mercado (régimen flexible) o el banco central (régimen fijo). Afecta el costo de las importaciones y el valor en moneda local de las exportaciones; las expectativas y los flujos de capital lo influyen. En México es flotante; el Banco de México puede intervenir en episodios de volatilidad extrema. Se publica tipo de cambio fix y cotizaciones interbancarias.", modulo: "general" },
  { termino: "Tipo de cambio real", definicion: "Tipo de cambio nominal ajustado por el nivel de precios (nacional y extranjero) para medir la competitividad: cuántos bienes y servicios nacionales se intercambian por bienes y servicios del resto del mundo. Fórmula típica: TCR = (e × P*)/P, donde e es el nominal, P* precios externos, P precios internos. Una depreciación real abarata los productos nacionales y suele mejorar la cuenta corriente; los bancos centrales lo monitorean para evaluar presiones inflacionarias y competitividad.", modulo: "general" },
  { termino: "Balanza de pagos", definicion: "Registro contable de todas las transacciones económicas entre los residentes de un país y el resto del mundo en un periodo. Incluye la cuenta corriente (bienes, servicios, rentas y transferencias), la cuenta de capital y la cuenta financiera (inversiones, préstamos, reservas). Por identidad contable la suma de los saldos es cero; un déficit en cuenta corriente se financia con entrada de capital o reducción de reservas. El Banco de México y el FMI publican la balanza de pagos; es clave para análisis de sostenibilidad externa.", modulo: "general" },
  { termino: "Cuenta corriente", definicion: "Parte de la balanza de pagos que registra las transacciones de bienes (exportaciones menos importaciones), servicios, rentas primarias y secundarias (transferencias) con el exterior. Un déficit en cuenta corriente implica que el país consume e invierte más de lo que produce y se financia con deuda o entrada de capital; un superávit indica lo contrario. Es un indicador de desequilibrio externo y de competitividad; su sostenibilidad depende del tipo de financiamiento y del nivel de deuda externa.", modulo: "general" },
  { termino: "Banco central", definicion: "Institución pública que ejecuta la política monetaria (fijar la tasa de interés de referencia, metas de inflación), emite la moneda de curso legal y actúa como prestamista de última instancia para el sistema bancario. Supervisa el sistema de pagos y suele custodiar las reservas internacionales. En México es el Banco de México (Banxico), autónomo desde 1994. Su independencia y credibilidad son esenciales para anclar expectativas de inflación; publica informes, minutas y estadísticas monetarias y financieras.", modulo: "general" },
  { termino: "Agregados monetarios", definicion: "Medidas del stock de dinero en la economía según su liquidez. La base monetaria es el efectivo en circulación más las reservas bancarias en el banco central. M1 incluye efectivo y depósitos a la vista; M2 añade depósitos a plazo y instrumentos de ahorro de alta liquidez. El banco central los publica y los usa para analizar condiciones monetarias y la transmisión de la política; la relación entre agregados y PIB o inflación se estudia en la teoría cuantitativa del dinero.", modulo: "general" },
  { termino: "Smart contract", definicion: "Programa informático almacenado en una blockchain que ejecuta automáticamente las cláusulas de un acuerdo cuando se cumplen condiciones predefinidas, sin necesidad de intermediarios. Se usan en DeFi (préstamos, swaps), tokens, gobernanza y registros. Reducen costos de verificación y de cumplimiento pero el código es inmutable una vez desplegado y los bugs pueden explotarse; la regulación sobre su validez jurídica sigue en evolución. Plataformas como Ethereum permiten su programación en lenguajes como Solidity.", modulo: "general" },
  { termino: "Criptomoneda", definicion: "Activo digital que usa criptografía para asegurar transacciones y controlar la creación de nuevas unidades, y que opera sobre una red descentralizada (blockchain o similar). Ejemplos: Bitcoin, Ethereum. Permite transferencias peer-to-peer sin banco central ni intermediario único; la oferta y las reglas suelen estar definidas por protocolo. Se usan como medio de pago, reserva de valor o activo especulativo; están sujetas a alta volatilidad y a marcos regulatorios variables por país (activo, valor, mercancía).", modulo: "general" },
  { termino: "Stablecoin", definicion: "Criptoactivo diseñado para mantener un valor estable respecto a un activo de referencia, generalmente una moneda fiat como el dólar. Puede estar respaldado por reservas (colateralizado), por algoritmos que ajustan oferta y demanda, o por una combinación. Reduce la volatilidad típica de las criptomonedas y facilita pagos y liquidez en DeFi. Los riesgos incluyen la calidad del colateral, la gobernanza del emisor y la regulación; ejemplos son USDT, USDC y DAI.", modulo: "general" },
  { termino: "Minería (blockchain)", definicion: "Proceso por el que los nodos (mineros) compiten para validar transacciones pendientes, agruparlas en un bloque y añadirlo a la cadena resolviendo un problema criptográfico (en Proof of Work) o siendo elegidos por su stake (en Proof of Stake). Quien logra proponer el bloque válido recibe una recompensa en la criptomoneda nativa y comisiones. Garantiza la seguridad y la descentralización del libro mayor; el consenso entre nodos evita el doble gasto y asegura la inmutabilidad de los bloques ya confirmados.", modulo: "blockchain" },
  { termino: "Nodo", definicion: "Computadora o dispositivo que mantiene una copia actualizada del libro mayor (blockchain) y participa en la red peer-to-peer transmitiendo y validando transacciones y bloques. Los nodos completos almacenan toda la historia; los de solo validación pueden ser más ligeros. Son la infraestructura descentralizada que sustituye al servidor central; cuantos más nodos independientes, mayor resistencia a la censura y a fallos. En redes PoS los nodos validadores requieren stake y cumplir reglas del protocolo.", modulo: "blockchain" },
  { termino: "Árbol de Merkle", definicion: "Estructura de datos jerárquica que resume todas las transacciones de un bloque en un único hash raíz (Merkle root): cada hoja es el hash de una transacción, los nodos superiores son hashes de la concatenación de sus hijos. Permite verificar si una transacción pertenece al bloque sin descargar todo el bloque; es la base de clientes ligeros (SPV) y de pruebas de inclusión. Garantiza la integridad del bloque: cualquier cambio en una transacción altera la raíz y se detecta al validar la cadena.", modulo: "blockchain" },
  { termino: "AMM", definicion: "Automated Market Maker: protocolo descentralizado que proporciona liquidez mediante fórmulas matemáticas (por ejemplo x×y=k) en lugar de un libro de órdenes. Los proveedores de liquidez depositan pares de activos en un pool y reciben tokens que representan su participación; los traders intercambian contra el pool y el precio se ajusta según la relación de cantidades. Es la base de DEX como Uniswap y permite intercambios sin intermediario centralizado; el riesgo para los proveedores incluye la pérdida impermanente.", modulo: "blockchain" },
  { termino: "Staking", definicion: "Acción de bloquear criptoactivos en un contrato o protocolo para participar en el mecanismo de consenso (por ejemplo Proof of Stake), en la gobernanza o en la provisión de seguridad de una red. A cambio se suelen recibir recompensas en la misma criptomoneda o en tokens. En redes como Ethereum los validadores deben hacer staking para proponer y validar bloques; el stake puede perderse (slashing) si se comportan de forma maliciosa. También se usa en DeFi para obtener rendimientos por bloquear activos.", modulo: "blockchain" },
  { termino: "Consenso (blockchain)", definicion: "Mecanismo por el que los nodos de una red descentralizada acuerdan cuál es el estado válido del libro mayor (el siguiente bloque y la cadena aceptada). Evita que actores deshonestos impongan transacciones falsas o doble gasto. Los más usados son Proof of Work (PoW), donde se compite por poder de cómputo, y Proof of Stake (PoS), donde el derecho a validar depende del stake bloqueado. El consenso determina la seguridad, la descentralización y el costo operativo de la red.", modulo: "blockchain" },
  { termino: "Red P2P", definicion: "Red peer-to-peer en la que los participantes (nodos) se comunican entre sí directamente sin depender de un servidor central. Cada nodo puede actuar como cliente y como servidor; la información (transacciones, bloques) se propaga por la red mediante el protocolo de la blockchain. La ausencia de un punto único de fallo refuerza la resistencia a la censura y los ataques; la descentralización es un pilar de las criptomonedas y de los sistemas basados en blockchain.", modulo: "blockchain" },
  { termino: "Stock-to-Flow", definicion: "Ratio entre el stock existente de un activo (cantidad ya emitida o en circulación) y el flujo anual de producción (emisión nueva). Mide la escasez relativa: un ratio alto indica que la oferta nueva es pequeña respecto al inventario acumulado, lo que en teoría podría soportar el valor. Se popularizó en el ecosistema Bitcoin para análisis de precio; es un indicador de flujo, no un modelo causal probado. No incorpora demanda ni expectativas; se usa junto con otros análisis.", modulo: "blockchain" },
  { termino: "Token", definicion: "Unidad de valor o derecho registrada en una blockchain; puede ser fungible (intercambiable, como una criptomoneda o un token ERC-20) o no fungible (NFT, único e identificable). Los tokens representan activos, derechos de gobernanza, acceso a protocolos o participación en liquidez; se emiten y transfieren mediante contratos inteligentes. La economía de muchos protocolos DeFi y de redes como Ethereum se basa en tokens nativos y en tokens de aplicación; la regulación los clasifica según su función (utilidad, valor, seguridad).", modulo: "blockchain" },
  { termino: "Tabla de mortalidad", definicion: "Tabla que resume, por edad o cohorte, las probabilidades de muerte, supervivencia y otras funciones biométricas (expectativa de vida, etc.) a partir de datos demográficos o experiencia de siniestralidad. Es la base para el cálculo de primas de seguros de vida, reservas actuariales y pensiones: las obligaciones futuras dependen de la probabilidad de que el asegurado o pensionado viva o fallezca en cada periodo. Las tablas se actualizan periódicamente (por ejemplo por el CONAPO o por el regulador) para reflejar mejoras en longevidad.", modulo: "actuaria" },
  { termino: "Esperanza de vida", definicion: "Número medio de años que se espera que viva una persona desde una edad dada, según una tabla de mortalidad específica. Se calcula a partir de las probabilidades de supervivencia; a edad 0 es la esperanza de vida al nacer. Se usa en seguros y pensiones para valorar obligaciones de largo plazo, en salud pública para comparar poblaciones y en análisis del riesgo de longevidad. Aumentos no previstos en la esperanza de vida elevan el costo de las pensiones y los seguros de vida.", modulo: "actuaria" },
  { termino: "Modelo de ruina del jugador", definicion: "Modelo probabilístico que estudia la evolución del capital de un jugador (o asegurador) que realiza apuestas repetidas con probabilidades conocidas de ganar o perder; la ruina es el evento en que el capital llega a cero antes de alcanzar un objetivo. En actuaría se adapta para modelar el riesgo de que las reclamaciones y los gastos superen las primas y reservas, llevando a la insolvencia. Permite estimar probabilidades de ruina y dimensionar capital o cargos por riesgo; es la base de la teoría del riesgo colectivo.", modulo: "actuaria" },
  { termino: "Poder adquisitivo", definicion: "Cantidad de bienes y servicios que puede comprar una unidad de dinero (o un ingreso fijo) en un momento dado. La inflación erosiona el poder adquisitivo: el mismo nominal compra menos con el tiempo. En seguros y pensiones es central para diseñar rentas indexadas a inflación y para evaluar el valor real de las prestaciones futuras. La ecuación de Fisher relaciona tasa nominal, tasa real y inflación: (1+i) = (1+r)(1+π); la tasa real refleja el rendimiento en términos de poder adquisitivo.", modulo: "actuaria" },
  { termino: "Prima (actuaría)", definicion: "Pago que realiza el asegurado a la aseguradora a cambio de la cobertura del riesgo (vida, salud, daños, etc.). La prima debe cubrir el valor esperado de las indemnizaciones (siniestros esperados), los costes de gestión y adquisición, y un margen por riesgo y beneficio. Se calcula con modelos actuariales que usan tablas de mortalidad o de siniestralidad y supuestos financieros. En seguros de vida se distingue entre prima natural, prima nivelada y prima única; la regulación (Solvencia II) exige que las primas sean suficientes y que las reservas estén provisionadas.", modulo: "actuaria" },
  { termino: "Reserva actuarial", definicion: "Provisión contable que refleja el valor presente de las obligaciones futuras de la aseguradora derivadas de las pólizas ya emitidas y aún en vigor. En seguros de vida corresponde al valor actual de los beneficios futuros menos el valor actual de las primas futuras; en pensiones, al valor de las pensiones prometidas. Debe coincidir con los activos destinados a cubrir esas obligaciones. La normativa (Solvencia II en la UE y marcos locales) exige métodos de valoración y pruebas de suficiencia de capital; las reservas se revisan con tablas de mortalidad y tasas de descuento actualizadas.", modulo: "actuaria" },
  { termino: "Riesgo de longevidad", definicion: "Riesgo de que los pensionados o asegurados vivan más de lo previsto en las tablas de mortalidad utilizadas, aumentando el valor de las obligaciones (pensiones, rentas vitalicias) por encima de lo provisionado. Afecta a fondos de pensiones, aseguradoras y Estados que pagan pensiones. Se mitiga con tablas actualizadas, índices de longevidad, productos de transferencia de riesgo (reaseguro, bonos de longevidad) y margen de solvencia. Es un riesgo sistemático difícil de diversificar y de creciente relevancia ante el envejecimiento poblacional.", modulo: "actuaria" },
  { termino: "Solvencia", definicion: "Capacidad de una entidad (aseguradora, fondo de pensiones, banco) para cumplir sus compromisos a largo plazo con los asegurados, acreedores o beneficiarios. En el sector asegurador europeo el marco Solvencia II exige mantener un nivel de capital (recursos propios y elegibles) que cubra el valor de las obligaciones más una carga por riesgo; se realizan pruebas de estrés y valoración de activos y pasivos con criterios homogéneos. La solvencia es supervisada por las autoridades para proteger a los tomadores de pólizas y la estabilidad del sistema.", modulo: "actuaria" },
  { termino: "Ecuación de Fisher", definicion: "Relación entre la tasa de interés nominal (i), la tasa real (r) y la inflación esperada (π): (1+i) = (1+r)(1+π). Aproximadamente i ≈ r + π. Permite pasar de rendimientos nominales a rendimientos en términos de poder adquisitivo y es fundamental en valoración actuarial de rentas y en política monetaria. En seguros y pensiones se usa para fijar tasas de descuento reales al valorar obligaciones indexadas y para analizar el efecto de la inflación sobre primas y reservas.", modulo: "actuaria" },
  { termino: "Tendencia central", definicion: "Conjunto de medidas que resumen la posición central o típica de una distribución de datos. Las más usadas son la media aritmética, la mediana y la moda. La media es sensible a valores extremos; la mediana y la moda son más robustas cuando hay asimetría o outliers. Se usan en descripción de datos, reportes (ingresos, precios, rendimientos) y como primer paso antes de análisis inferencial o modelado. Elegir una u otra depende del tipo de variable y de la forma de la distribución.", modulo: "estadistica" },
  { termino: "Media (media aritmética)", definicion: "Suma de todas las observaciones dividida entre el número de observaciones. Fórmula: x̄ = Σx_i / n. Es la medida de tendencia central más usada; representa el «centro de gravedad» de los datos. Se interpreta como el valor promedio y es la base del Teorema del Límite Central y de muchos estimadores (por ejemplo MCO). Es sensible a valores extremos: un solo outlier puede desplazarla mucho; en distribuciones muy asimétricas suele reportarse junto con la mediana.", modulo: "estadistica", formula: "x̄ = (x₁ + x₂ + … + xₙ) / n" },
  { termino: "Mediana", definicion: "Valor que queda en el centro cuando los datos se ordenan de menor a mayor; deja el 50% de las observaciones por debajo y el 50% por encima. Si n es par, se toma el promedio de los dos valores centrales. No se ve afectada por valores extremos (outliers), por lo que es preferible a la media para distribuciones asimétricas o con colas pesadas (por ejemplo ingresos, precios de activos). Es un cuantil (el percentil 50) y se usa también en definiciones de dispersión como el rango intercuartílico.", modulo: "estadistica", formula: "Mediana = valor central de la muestra ordenada" },
  { termino: "Moda", definicion: "Valor o categoría que aparece con mayor frecuencia en un conjunto de datos. En variables discretas o cualitativas es la única medida de tendencia central aplicable; en variables continuas se suele definir la clase modal (el intervalo con mayor frecuencia). Puede haber más de una moda (distribución bimodal o multimodal) o ninguna si todos los valores tienen la misma frecuencia. Se usa en encuestas (respuesta más común), en datos categóricos y para describir picos en histogramas.", modulo: "estadistica" },
  { termino: "Rango", definicion: "Diferencia entre el valor máximo y el valor mínimo de una muestra: R = x_max − x_min. Mide la dispersión total de los datos en la escala original. Es fácil de calcular e interpretar pero muy sensible a outliers: un solo valor extremo puede inflar el rango. Se usa en reportes sencillos y en control de calidad (rangos de tolerancia). Para una descripción más robusta de la dispersión suelen usarse el rango intercuartílico o la desviación estándar.", modulo: "estadistica", formula: "R = máximo − mínimo" },
  { termino: "Desviación estándar", definicion: "Raíz cuadrada de la varianza; mide la dispersión de los datos en las mismas unidades que la variable. Fórmula muestral: s = √[Σ(x_i − x̄)²/(n−1)]. Cuanto mayor es s, más dispersas están las observaciones alrededor de la media. Se usa en intervalos de confianza, tests de hipótesis, normalización de variables y en finanzas (volatilidad de rendimientos). Junto con la media resume la ubicación y la dispersión de una distribución; bajo normalidad aproximadamente el 68% de los datos caen en x̄ ± s.", modulo: "estadistica", formula: "s = √[Σ(x_i − x̄)²/(n−1)]" },
  { termino: "Cuartiles", definicion: "Valores que dividen la muestra ordenada en cuatro partes de igual frecuencia. El primer cuartil Q₁ deja el 25% de los datos por debajo; el segundo cuartil Q₂ coincide con la mediana (50%); el tercero Q₃ deja el 75% por debajo. Se usan para describir la forma de la distribución y para construir el rango intercuartílico IQR = Q₃ − Q₁, una medida de dispersión robusta a outliers. Los percentiles generalizan la idea (por ejemplo el percentil 90); los cuartiles son los percentiles 25, 50 y 75.", modulo: "estadistica" },
  { termino: "Frecuencia", definicion: "Número de veces que aparece un valor (o un intervalo de valores) en un conjunto de datos. La frecuencia absoluta es el conteo; la frecuencia relativa es la proporción respecto al total (porcentaje si se multiplica por 100). Las frecuencias son la base de tablas de distribución, histogramas y gráficos de barras; la suma de frecuencias relativas es 1. En inferencia, las frecuencias muestrales estiman probabilidades poblacionales. La moda es el valor con mayor frecuencia; las frecuencias acumuladas sirven para calcular cuartiles y percentiles.", modulo: "estadistica" },
  { termino: "Regresión lineal", definicion: "Modelo estadístico que relaciona una variable dependiente Y con una o varias variables independientes X mediante una ecuación lineal: Y = β₀ + β₁X + u, donde u es el término de error. Los coeficientes β miden el efecto parcial de X sobre Y (ceteris paribus). Se usa para predicción, inferencia causal (con las debidas cautelas) y contrastes de hipótesis. Bajo los supuestos de Gauss-Markov, el estimador MCO es el mejor lineal insesgado (MELI); la violación de supuestos (heterocedasticidad, autocorrelación, endogeneidad) exige correcciones o métodos alternativos.", modulo: "estadistica" },
  { termino: "MCO", definicion: "Mínimos cuadrados ordinarios: método de estimación que obtiene los coeficientes de la regresión lineal minimizando la suma de los residuos al cuadrado. Bajo los supuestos de Gauss-Markov (linealidad, media cero del error, homocedasticidad, no autocorrelación, regresores fijos o exógenos), el estimador MCO es insesgado, consistente y el de menor varianza entre los lineales insesgados (MELI/BLUE). Es la base de la econometría lineal; cuando los supuestos fallan se usan MCO robustos, MCG o variables instrumentales.", modulo: "estadistica" },
  { termino: "Teorema del Límite Central", definicion: "Resultado fundamental según el cual, bajo condiciones generales, la distribución de la media muestral (o de sumas de variables aleatorias independientes) converge a una distribución normal cuando el tamaño de la muestra n crece, cualquiera que sea la distribución de las observaciones originales (si tienen varianza finita). Permite justificar intervalos de confianza y contrastes basados en la normal para medias y para estimadores que son promedios (como MCO bajo condiciones de regularidad); es la base de la inferencia asintótica en estadística y econometría.", modulo: "estadistica" },
  { termino: "Insesgadez", definicion: "Propiedad de un estimador según la cual su esperanza es igual al verdadero valor del parámetro que se estima: E(β̂) = β. Un estimador insesgado no comete error sistemático en muestras repetidas; no implica que una realización concreta esté cerca del parámetro (eso depende también de la varianza). MCO es insesgado bajo los supuestos de Gauss-Markov (en particular exogeneidad de los regresores). La insesgadez se evalúa en muestras finitas; la consistencia es la propiedad análoga cuando n tiende a infinito.", modulo: "estadistica" },
  { termino: "MELI", definicion: "Mejor Estimador Lineal Insesgado (en inglés BLUE): entre todos los estimadores lineales e insesgados del parámetro, aquel que tiene la menor varianza. Bajo los supuestos de Gauss-Markov, el estimador MCO es el MELI para los coeficientes de la regresión lineal; es decir, MCO es eficiente en la clase de estimadores lineales insesgados. Si se relaja la linealidad o el supuesto de homocedasticidad (por ejemplo), pueden existir estimadores más eficientes (MCG cuando se conoce la matriz de varianzas-covarianzas del error).", modulo: "estadistica" },
  { termino: "Hipótesis de Gauss-Markov", definicion: "Conjunto de supuestos bajo los cuales el estimador MCO es el mejor lineal insesgado (MELI): el modelo es lineal en parámetros, la esperanza del error condicional a las X es cero (exogeneidad), la varianza del error es constante (homocedasticidad), no hay autocorrelación y los regresores son fijos o se trata de muestreo repetido. No se exige normalidad del error; con normalidad, MCO coincide con el estimador máximo verosímil y los estadísticos t y F tienen distribución exacta. La violación de estos supuestos afecta las propiedades del MCO y la inferencia.", modulo: "estadistica" },
  { termino: "p-valor", definicion: "Probabilidad de obtener un valor del estadístico de contraste tan extremo o más que el observado en la muestra, suponiendo que la hipótesis nula H₀ es cierta. Un p-valor pequeño indica que los datos son poco compatibles con H₀ y lleva a rechazarla si p < α (nivel de significación elegido). No es la probabilidad de que H₀ sea cierta ni mide el tamaño del efecto; solo cuantifica la evidencia contra H₀. Es estándar en tests de significación y en publicación de resultados empíricos; su interpretación debe ir acompañada de intervalos de confianza y de relevancia económica.", modulo: "estadistica" },
  { termino: "Hipótesis nula", definicion: "Hipótesis que se contrasta en un test estadístico (por ejemplo H₀: β = 0 en una regresión, o igualdad de medias). El test evalúa si los datos aportan evidencia suficiente para rechazar H₀ en favor de la hipótesis alternativa H₁. Se rechaza H₀ si el estadístico de prueba cae en la región crítica o si el p-valor es menor que el nivel de significación α. No rechazar H₀ no implica que sea verdadera; solo que no hay evidencia estadística suficiente contra ella. La elección de H₀ y H₁ depende del objetivo del contraste.", modulo: "estadistica" },
  { termino: "Varianza muestral", definicion: "Medida de dispersión de una muestra: s² = Σ(x_i - x̄)²/(n-1), donde x̄ es la media muestral. El denominador n-1 (en lugar de n) hace que s² sea un estimador insesgado de la varianza poblacional σ² bajo muestreo aleatorio simple. La raíz cuadrada s es la desviación típica muestral. Se usa en intervalos de confianza para la media (con la distribución t cuando la población es normal), en contrastes de hipótesis y como insumo en regresión (errores estándar, R², tests).", modulo: "estadistica" },
  { termino: "Normalidad asintótica", definicion: "Propiedad por la cual la distribución del estimador (normalizado por su error estándar) converge a una distribución normal estándar cuando el tamaño de la muestra n tiende a infinito. Muchos estimadores (MCO, máxima verosimilitud, GMM) son asintóticamente normales bajo condiciones de regularidad; ello permite construir intervalos de confianza y tests (t, Wald) aproximados en muestras grandes aunque la distribución exacta sea desconocida. Es la base de la inferencia asintótica en econometría cuando no se puede asumir normalidad exacta del error.", modulo: "estadistica" },
];

/** Normaliza el nombre del término a un slug URL-friendly (minúsculas, sin acentos, espacios → guiones). */
export function terminoToSlug(termino: string): string {
  let s = termino.trim().toLowerCase();
  const acentos: Record<string, string> = { á: "a", é: "e", í: "i", ó: "o", ú: "u", ñ: "n" };
  for (const [a, b] of Object.entries(acentos)) s = s.replace(new RegExp(a, "g"), b);
  s = s.replace(/\s*\([^)]*\)\s*/g, " ").trim();
  s = s.replace(/[^a-z0-9\s-]/g, " ");
  s = s.replace(/\s+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
  return s || "termino";
}

/** Mapa slug → término para resolución única (slugs duplicados llevan sufijo -2, -3, ...). */
const MAP_SLUG_TO_TERMINO = (() => {
  const map = new Map<string, TerminoGlosario>();
  const seen = new Map<string, number>();
  for (const t of TERMINOS) {
    let slug = terminoToSlug(t.termino);
    const count = (seen.get(slug) ?? 0) + 1;
    seen.set(slug, count);
    if (count > 1) slug = `${slug}-${count}`;
    map.set(slug, t);
  }
  return map;
})();

/** Mapa término (nombre exacto) → slug, para enlaces desde el listado. */
export const MAP_TERMINO_TO_SLUG = (() => {
  const map = new Map<string, string>();
  const seen = new Map<string, number>();
  for (const t of TERMINOS) {
    let slug = terminoToSlug(t.termino);
    const count = (seen.get(slug) ?? 0) + 1;
    seen.set(slug, count);
    if (count > 1) slug = `${slug}-${count}`;
    map.set(t.termino, slug);
  }
  return map;
})();

export function getTerminoBySlug(slug: string): TerminoGlosario | null {
  return MAP_SLUG_TO_TERMINO.get(slug) ?? null;
}

export function getTodosLosSlugs(): string[] {
  return Array.from(MAP_SLUG_TO_TERMINO.keys());
}

/** Devuelve el slug del término para enlazar a /glosario/[slug]. */
export function getSlugDeTermino(termino: string): string | null {
  return MAP_TERMINO_TO_SLUG.get(termino) ?? null;
}

export function buscarTerminos(query: string): TerminoGlosario[] {
  const q = query.toLowerCase().trim();
  if (!q) return TERMINOS;
  return TERMINOS.filter(
    (t) =>
      t.termino.toLowerCase().includes(q) ||
      t.definicion.toLowerCase().includes(q) ||
      (t.formula && t.formula.toLowerCase().includes(q)) ||
      (t.ejemplo && t.ejemplo.toLowerCase().includes(q)) ||
      t.modulo === q
  );
}

export function getTerminosPorModulo(modulo: TerminoGlosario["modulo"]): TerminoGlosario[] {
  return TERMINOS.filter((t) => t.modulo === modulo);
}
