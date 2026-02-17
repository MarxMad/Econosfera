/** Preguntas de práctica y autoevaluación por módulo */

export interface Pregunta {
  id: string;
  pregunta: string;
  tipo: "multiple" | "numerica";
  opciones?: string[];
  respuestaCorrecta: string | number;
  explicacion: string;
  modulo: "inflacion" | "macro" | "micro" | "finanzas";
}

export const PREGUNTAS: Pregunta[] = [
  // Inflación
  {
    id: "inf-1",
    pregunta: "Si la tasa de política monetaria es 9% y la inflación observada es 5%, ¿cuál es la tasa real ex post?",
    tipo: "numerica",
    respuestaCorrecta: 4,
    explicacion: "La tasa real ex post = tasa nominal - inflación = 9% - 5% = 4%. Esto significa que el costo real del dinero es del 4% después de descontar la inflación.",
    modulo: "inflacion",
  },
  {
    id: "inf-2",
    pregunta: "Según la regla de Taylor, si la inflación está por encima de la meta y la brecha de producto es positiva, el banco central debería:",
    tipo: "multiple",
    opciones: [
      "Bajar la tasa de interés",
      "Mantener la tasa igual",
      "Subir la tasa de interés",
      "No importa, la regla de Taylor no aplica",
    ],
    respuestaCorrecta: "Subir la tasa de interés",
    explicacion: "Cuando la inflación supera la meta y hay sobrecalentamiento (brecha positiva), la regla de Taylor sugiere subir la tasa para enfriar la demanda y anclar expectativas inflacionarias.",
    modulo: "inflacion",
  },
  {
    id: "inf-3",
    pregunta: "¿Qué diferencia hay entre la tasa real ex post y ex ante?",
    tipo: "multiple",
    opciones: [
      "No hay diferencia, son iguales",
      "Ex post usa inflación observada, ex ante usa inflación esperada",
      "Ex post es siempre mayor que ex ante",
      "Solo existe la tasa real ex post",
    ],
    respuestaCorrecta: "Ex post usa inflación observada, ex ante usa inflación esperada",
    explicacion: "La tasa real ex post se calcula con la inflación ya observada (histórica), mientras que la ex ante usa la inflación esperada (futura). La ex ante es más relevante para decisiones de inversión y consumo.",
    modulo: "inflacion",
  },
  {
    id: "inf-4",
    pregunta: "Si la meta de inflación del banco central es 3% y la inflación actual es 3.5%, la brecha de inflación es:",
    tipo: "numerica",
    respuestaCorrecta: 0.5,
    explicacion: "Brecha de inflación = inflación observada - meta = 3.5% - 3% = 0.5 puntos porcentuales. Una brecha positiva indica que la inflación está por encima del objetivo.",
    modulo: "inflacion",
  },
  {
    id: "inf-5",
    pregunta: "Una postura de política monetaria restrictiva suele asociarse a:",
    tipo: "multiple",
    opciones: [
      "Tasa de política por debajo de la tasa neutral",
      "Tasa de política por encima de la tasa neutral",
      "Tasa de política igual a la tasa neutral",
      "Solo a cambios en el tipo de cambio",
    ],
    respuestaCorrecta: "Tasa de política por encima de la tasa neutral",
    explicacion: "Política restrictiva significa que el banco central sube la tasa de interés por encima del nivel neutral para enfriar la demanda y contener la inflación.",
    modulo: "inflacion",
  },
  {
    id: "inf-6",
    pregunta: "La inflación subyacente se calcula excluyendo principalmente:",
    tipo: "multiple",
    opciones: [
      "Todos los servicios",
      "Productos agropecuarios y precios autorizados por el gobierno",
      "Solo los energéticos",
      "Los bienes importados",
    ],
    respuestaCorrecta: "Productos agropecuarios y precios autorizados por el gobierno",
    explicacion: "La inflación subyacente (o no subyacente) excluye los bienes con alta volatilidad: agropecuarios y precios fijados por el gobierno, para ver mejor la tendencia de precios.",
    modulo: "inflacion",
  },
  {
    id: "inf-7",
    pregunta: "Si la tasa nominal es 11% y la inflación esperada es 4%, la tasa real ex ante es:",
    tipo: "numerica",
    respuestaCorrecta: 7,
    explicacion: "Tasa real ex ante = tasa nominal - inflación esperada = 11% - 4% = 7%. Es la que usan hogares y empresas para planear consumo e inversión.",
    modulo: "inflacion",
  },
  {
    id: "inf-8",
    pregunta: "Cuando la brecha del producto es negativa (PIB por debajo del potencial), la política monetaria típicamente:",
    tipo: "multiple",
    opciones: [
      "Se vuelve más restrictiva",
      "Se mantiene neutral",
      "Puede relajarse para apoyar la actividad",
      "Solo reacciona a la inflación, no a la brecha",
    ],
    respuestaCorrecta: "Puede relajarse para apoyar la actividad",
    explicacion: "Una brecha negativa indica capacidad ociosa. Muchos bancos centrales (como en la regla de Taylor) bajan la tasa para estimular la demanda y cerrar la brecha.",
    modulo: "inflacion",
  },
  {
    id: "inf-9",
    pregunta: "El anclaje de expectativas inflacionarias se refiere a:",
    tipo: "multiple",
    opciones: [
      "Fijar el tipo de cambio",
      "Que el público espere una inflación cercana a la meta del banco central",
      "Congelar precios por ley",
      "Solo a la inflación observada del mes anterior",
    ],
    respuestaCorrecta: "Que el público espere una inflación cercana a la meta del banco central",
    explicacion: "Cuando las expectativas están ancladas a la meta, los precios y salarios se fijan en línea con ella, lo que facilita mantener la inflación estable.",
    modulo: "inflacion",
  },
  {
    id: "inf-10",
    pregunta: "Si la tasa de política es 10.5% y la inflación observada es 4.2%, la tasa real ex post aproximada es:",
    tipo: "numerica",
    respuestaCorrecta: 6.3,
    explicacion: "Tasa real ex post = 10.5% - 4.2% = 6.3%. Representa el costo real del crédito una vez descontada la inflación ya vivida.",
    modulo: "inflacion",
  },
  // Macroeconomía
  {
    id: "macro-1",
    pregunta: "Si la propensión marginal a consumir (PMC) es 0.6, ¿cuál es el multiplicador del gasto público?",
    tipo: "numerica",
    respuestaCorrecta: 2.5,
    explicacion: "El multiplicador del gasto k_G = 1 / (1 - PMC) = 1 / (1 - 0.6) = 1 / 0.4 = 2.5. Esto significa que un aumento de $1 en G aumenta la renta en $2.50.",
    modulo: "macro",
  },
  {
    id: "macro-2",
    pregunta: "En el modelo IS-LM, un aumento de la oferta monetaria desplaza:",
    tipo: "multiple",
    opciones: [
      "Solo la curva IS hacia la derecha",
      "Solo la curva LM hacia la derecha",
      "Ambas curvas hacia la derecha",
      "La curva LM hacia la izquierda",
    ],
    respuestaCorrecta: "Solo la curva LM hacia la derecha",
    explicacion: "Un aumento de la oferta monetaria (M) afecta solo al mercado de dinero, desplazando la curva LM hacia la derecha (abajo). La curva IS depende de variables reales (C, I, G, T) y no se ve afectada directamente por cambios en M.",
    modulo: "macro",
  },
  {
    id: "macro-3",
    pregunta: "Si el multiplicador de impuestos es -1.5 y los impuestos aumentan en $10, ¿cuánto cambia la renta de equilibrio?",
    tipo: "numerica",
    respuestaCorrecta: -15,
    explicacion: "El cambio en la renta = multiplicador × cambio en impuestos = -1.5 × $10 = -$15. La renta disminuye porque los impuestos reducen el ingreso disponible y el consumo.",
    modulo: "macro",
  },
  {
    id: "macro-4",
    pregunta: "En el modelo keynesiano simple (sin sector exterior), el multiplicador del gasto público es mayor cuando:",
    tipo: "multiple",
    opciones: [
      "La propensión marginal a consumir es menor",
      "La propensión marginal a consumir es mayor",
      "Los impuestos son proporcionales al ingreso",
      "No depende de la PMC",
    ],
    respuestaCorrecta: "La propensión marginal a consumir es mayor",
    explicacion: "k_G = 1 / (1 - PMC). Si PMC es mayor, (1 - PMC) es menor y el multiplicador es mayor. Más consumo inducido por cada peso de gasto amplifica el efecto.",
    modulo: "macro",
  },
  {
    id: "macro-5",
    pregunta: "Si la PMC es 0.8, un aumento del gasto público (G) de $20 aumenta la renta de equilibrio en:",
    tipo: "numerica",
    respuestaCorrecta: 100,
    explicacion: "Multiplicador k_G = 1 / (1 - 0.8) = 5. Cambio en Y = 5 × $20 = $100.",
    modulo: "macro",
  },
  {
    id: "macro-6",
    pregunta: "En el equilibrio del modelo keynesiano, la renta es tal que:",
    tipo: "multiple",
    opciones: [
      "El ahorro es cero",
      "El ahorro planeado iguala la inversión planeada",
      "Solo el consumo iguala la renta",
      "Las exportaciones igualan las importaciones",
    ],
    respuestaCorrecta: "El ahorro planeado iguala la inversión planeada",
    explicacion: "En equilibrio, la producción (Y) iguala la demanda (C + I + G). Esto equivale a que el ahorro planeado S = Y - C - G iguale a la inversión planeada I.",
    modulo: "macro",
  },
  {
    id: "macro-7",
    pregunta: "Si el multiplicador del gasto es 2 y el gobierno quiere aumentar la renta en $40, ¿cuánto debe aumentar G?",
    tipo: "numerica",
    respuestaCorrecta: 20,
    explicacion: "ΔY = k_G × ΔG, entonces ΔG = ΔY / k_G = 40 / 2 = $20.",
    modulo: "macro",
  },
  {
    id: "macro-8",
    pregunta: "Un aumento de los impuestos autónomos (T) en el modelo keynesiano simple:",
    tipo: "multiple",
    opciones: [
      "Aumenta la renta por el multiplicador",
      "Reduce la renta (multiplicador de impuestos negativo)",
      "No afecta la renta",
      "Solo afecta al consumo, no a Y",
    ],
    respuestaCorrecta: "Reduce la renta (multiplicador de impuestos negativo)",
    explicacion: "Más impuestos reducen el ingreso disponible y el consumo, lo que disminuye la demanda y la renta. El multiplicador de impuestos es negativo y en valor absoluto menor que el del gasto.",
    modulo: "macro",
  },
  {
    id: "macro-9",
    pregunta: "Si 1/(1 - PMC) = 4 y el gobierno sube G en $15 y T en $15 (presupuesto equilibrado), el cambio en la renta es:",
    tipo: "multiple",
    opciones: [
      "Cero",
      "Aumenta $60",
      "Aumenta $15",
      "Disminuye $15",
    ],
    respuestaCorrecta: "Aumenta $15",
    explicacion: "El multiplicador del presupuesto equilibrado es 1: ΔY = ΔG cuando ΔG = ΔT. El efecto expansivo de G no se compensa totalmente por el efecto contractivo de T porque parte del impuesto recae en el ahorro.",
    modulo: "macro",
  },
  {
    id: "macro-10",
    pregunta: "En la curva LM, un aumento del nivel de precios (P) desplaza la curva:",
    tipo: "multiple",
    opciones: [
      "Hacia la derecha",
      "Hacia la izquierda",
      "No la desplaza",
      "Solo afecta a la curva IS",
    ],
    respuestaCorrecta: "Hacia la izquierda",
    explicacion: "LM depende de M/P (oferta real de dinero). Si P sube, M/P baja; para restablecer el equilibrio en el mercado de dinero hace falta un tipo de interés más alto, por lo que LM se desplaza a la izquierda.",
    modulo: "macro",
  },
  // Microeconomía
  {
    id: "micro-1",
    pregunta: "Si la elasticidad precio de la demanda es -1.5, la demanda es:",
    tipo: "multiple",
    opciones: [
      "Elástica",
      "Inelástica",
      "Unitaria",
      "Perfectamente inelástica",
    ],
    respuestaCorrecta: "Elástica",
    explicacion: "Cuando |ε| > 1, la demanda es elástica. Esto significa que un cambio porcentual en el precio causa un cambio porcentual mayor en la cantidad demandada. En este caso, |−1.5| = 1.5 > 1.",
    modulo: "micro",
  },
  {
    id: "micro-2",
    pregunta: "En el equilibrio de mercado, si el intercepto de la demanda (a) aumenta de 100 a 120 y todo lo demás se mantiene igual, el precio de equilibrio:",
    tipo: "multiple",
    opciones: [
      "Disminuye",
      "Aumenta",
      "Se mantiene igual",
      "No se puede determinar",
    ],
    respuestaCorrecta: "Aumenta",
    explicacion: "Un aumento en el intercepto de la demanda desplaza toda la curva de demanda hacia arriba (a la derecha). Esto aumenta tanto el precio como la cantidad de equilibrio.",
    modulo: "micro",
  },
  {
    id: "micro-3",
    pregunta: "El excedente del consumidor se calcula como el área:",
    tipo: "multiple",
    opciones: [
      "Bajo la curva de oferta y sobre el precio de equilibrio",
      "Bajo la curva de demanda y sobre el precio de equilibrio",
      "Entre las curvas de oferta y demanda",
      "Sobre ambas curvas",
    ],
    respuestaCorrecta: "Bajo la curva de demanda y sobre el precio de equilibrio",
    explicacion: "El excedente del consumidor es la diferencia entre lo que los consumidores están dispuestos a pagar (curva de demanda) y lo que realmente pagan (precio de equilibrio). Se representa como el área triangular bajo la demanda y sobre P*.",
    modulo: "micro",
  },
  {
    id: "micro-4",
    pregunta: "Si la elasticidad precio de la demanda es -0.5, la demanda es:",
    tipo: "multiple",
    opciones: [
      "Elástica",
      "Inelástica",
      "Unitaria",
      "Perfectamente elástica",
    ],
    respuestaCorrecta: "Inelástica",
    explicacion: "Cuando |ε| < 1, la demanda es inelástica. Un cambio porcentual en el precio genera un cambio porcentual menor en la cantidad demandada.",
    modulo: "micro",
  },
  {
    id: "micro-5",
    pregunta: "En un mercado con demanda Q = 100 - 2P y oferta Q = 20 + 2P, el precio de equilibrio es:",
    tipo: "numerica",
    respuestaCorrecta: 20,
    explicacion: "Equilibrio: 100 - 2P = 20 + 2P → 80 = 4P → P = 20. La cantidad de equilibrio es Q = 100 - 40 = 60.",
    modulo: "micro",
  },
  {
    id: "micro-6",
    pregunta: "Un desplazamiento de la curva de oferta hacia la derecha, manteniendo la demanda constante, implica:",
    tipo: "multiple",
    opciones: [
      "Precio y cantidad suben",
      "Precio baja y cantidad sube",
      "Precio sube y cantidad baja",
      "Precio y cantidad bajan",
    ],
    respuestaCorrecta: "Precio baja y cantidad sube",
    explicacion: "Más oferta a cada precio (desplazamiento a la derecha) hace que el nuevo equilibrio tenga un precio menor y una cantidad mayor.",
    modulo: "micro",
  },
  {
    id: "micro-7",
    pregunta: "El excedente del productor se mide como el área:",
    tipo: "multiple",
    opciones: [
      "Bajo la curva de demanda y sobre el precio",
      "Sobre la curva de oferta y bajo el precio de equilibrio",
      "Entre las curvas de oferta y demanda",
      "Bajo la curva de oferta",
    ],
    respuestaCorrecta: "Sobre la curva de oferta y bajo el precio de equilibrio",
    explicacion: "Es la diferencia entre lo que los productores reciben (P*) y su costo marginal (curva de oferta). Área sobre la oferta y bajo P*.",
    modulo: "micro",
  },
  {
    id: "micro-8",
    pregunta: "Si la demanda es perfectamente inelástica (vertical), un impuesto sobre la venta lo paga:",
    tipo: "multiple",
    opciones: [
      "Solo el consumidor",
      "Solo el productor",
      "Totalmente el consumidor",
      "En su totalidad el productor",
    ],
    respuestaCorrecta: "Totalmente el consumidor",
    explicacion: "Con demanda perfectamente inelástica, la cantidad no cambia. Los consumidores aceptan pagar el precio más el impuesto; los productores reciben el mismo precio neto.",
    modulo: "micro",
  },
  {
    id: "micro-9",
    pregunta: "En demanda lineal Q = a - bP, la elasticidad precio en el punto medio de la curva es:",
    tipo: "multiple",
    opciones: [
      "Mayor que 1",
      "Menor que 1",
      "Igual a 1 (unitaria)",
      "Cero",
    ],
    respuestaCorrecta: "Igual a 1 (unitaria)",
    explicacion: "En el punto medio de una demanda lineal, la elasticidad precio es exactamente -1 (unitaria). Por encima de ese punto la demanda es elástica; por debajo, inelástica.",
    modulo: "micro",
  },
  {
    id: "micro-10",
    pregunta: "Si el intercepto de la oferta (c) aumenta y la demanda no cambia, en el nuevo equilibrio:",
    tipo: "multiple",
    opciones: [
      "Precio sube y cantidad sube",
      "Precio baja y cantidad sube",
      "Precio sube y cantidad baja",
      "Precio baja y cantidad baja",
    ],
    respuestaCorrecta: "Precio sube y cantidad baja",
    explicacion: "Un aumento de c (por ejemplo costos) desplaza la oferta hacia la izquierda (arriba), lo que eleva el precio y reduce la cantidad de equilibrio.",
    modulo: "micro",
  },
  // Finanzas
  {
    id: "fin-1",
    pregunta: "Los Cetes son un ejemplo de:",
    tipo: "multiple",
    opciones: [
      "Instrumento de renta variable",
      "Instrumento de deuda gubernamental a corto plazo",
      "Acción de la Bolsa Mexicana de Valores",
      "Derivado financiero",
    ],
    respuestaCorrecta: "Instrumento de deuda gubernamental a corto plazo",
    explicacion: "Los Cetes (Certificados de la Tesorería) son valores de deuda emitidos por el gobierno federal mexicano, a plazos cortos (28 días a 1 año), con tasa descontada.",
    modulo: "finanzas",
  },
  {
    id: "fin-2",
    pregunta: "El mercado donde se negocian por primera vez los valores (emisión) se denomina:",
    tipo: "multiple",
    opciones: [
      "Mercado secundario",
      "Mercado primario",
      "Mercado de derivados",
      "Mercado interbancario",
    ],
    respuestaCorrecta: "Mercado primario",
    explicacion: "En el mercado primario el emisor coloca los valores por primera vez; en el secundario los inversionistas compran y venden entre sí (por ejemplo en la bolsa).",
    modulo: "finanzas",
  },
  {
    id: "fin-3",
    pregunta: "¿Qué tipo de instrumento tiene flujos de pago predecibles (cupones y/o principal)?",
    tipo: "multiple",
    opciones: [
      "Renta variable",
      "Renta fija",
      "Solo acciones",
      "Solo derivados",
    ],
    respuestaCorrecta: "Renta fija",
    explicacion: "Los instrumentos de renta fija (bonos, Cetes, pagarés) tienen flujos definidos; la renta variable (acciones) depende de dividendos y plusvalía.",
    modulo: "finanzas",
  },
  {
    id: "fin-4",
    pregunta: "La intermediación entre ahorradores y demandantes de crédito la realizan principalmente:",
    tipo: "multiple",
    opciones: [
      "Solo el banco central",
      "Los bancos comerciales y las instituciones financieras",
      "Exclusivamente la bolsa de valores",
      "Solo el gobierno",
    ],
    respuestaCorrecta: "Los bancos comerciales y las instituciones financieras",
    explicacion: "Los bancos captan depósitos y otorgan créditos; junto con otros intermediarios canalizan el ahorro hacia la inversión y el consumo.",
    modulo: "finanzas",
  },
  {
    id: "fin-5",
    pregunta: "En México, la supervisión de bancos y casas de bolsa corresponde principalmente a:",
    tipo: "multiple",
    opciones: [
      "Solo Banco de México",
      "CNBV (Comisión Nacional Bancaria y de Valores)",
      "Solo la BMV",
      "Condusef",
    ],
    respuestaCorrecta: "CNBV (Comisión Nacional Bancaria y de Valores)",
    explicacion: "La CNBV regula y supervisa a bancos, casas de bolsa, sofipos y otros intermediarios. Banxico se enfoca en política monetaria y estabilidad del sistema de pagos.",
    modulo: "finanzas",
  },
  {
    id: "fin-6",
    pregunta: "Un título de deuda corporativo que paga cupones periódicos se conoce típicamente como:",
    tipo: "multiple",
    opciones: [
      "Acción preferente",
      "Bono u obligación",
      "Cete",
      "ETF",
    ],
    respuestaCorrecta: "Bono u obligación",
    explicacion: "Los bonos y obligaciones son instrumentos de deuda que pagan cupones (intereses) y devuelven el principal al vencimiento. Las acciones representan capital, no deuda.",
    modulo: "finanzas",
  },
];

export function getPreguntasPorModulo(modulo: "inflacion" | "macro" | "micro" | "finanzas"): Pregunta[] {
  return PREGUNTAS.filter((p) => p.modulo === modulo);
}

export function getPreguntaAleatoria(modulo: "inflacion" | "macro" | "micro" | "finanzas"): Pregunta | null {
  const preguntas = getPreguntasPorModulo(modulo);
  if (preguntas.length === 0) return null;
  return preguntas[Math.floor(Math.random() * preguntas.length)];
}

/** Devuelve 10 preguntas del módulo en orden aleatorio para una sesión. */
function shuffle<T>(arr: T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export function getSesionPreguntas(modulo: "inflacion" | "macro" | "micro" | "finanzas", cantidad = 10): Pregunta[] {
  const todas = getPreguntasPorModulo(modulo);
  return shuffle(todas).slice(0, Math.min(cantidad, todas.length));
}
