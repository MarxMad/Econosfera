/** Glosario de términos económicos usados en el simulador.
 * Las definiciones se basan en: Banco de México (Documentos de investigación, Programas de política monetaria),
 * CEMLA, El Trimestre Económico (FCE), Investigación Económica (UNAM), CIDE y manuales de referencia. */

export interface TerminoGlosario {
  termino: string;
  definicion: string;
  modulo: "inflacion" | "macro" | "micro" | "general";
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
    definicion: "Indicador que excluye componentes volátiles (alimentos no elaborados, combustibles, tarifas reguladas) para captar la tendencia de mediano plazo de los precios.",
    modulo: "inflacion",
  },
  {
    termino: "Tasa real ex post",
    definicion: "Tasa de interés nominal menos la inflación ya observada. Mide el costo real del dinero después de que ocurrió la inflación.",
    modulo: "inflacion",
    formula: "r_ex_post = i - π",
    ejemplo: "Si la tasa nominal es 9% y la inflación fue 5%, la tasa real ex post es 4%.",
  },
  {
    termino: "Tasa real ex ante",
    definicion: "Tasa nominal menos la inflación esperada (aquí usamos la subyacente como proxy). Relevante para decisiones de inversión y consumo.",
    modulo: "inflacion",
    formula: "r_ex_ante = i - π_esperada",
    ejemplo: "Si la tasa nominal es 9% y la inflación esperada es 4%, la tasa real ex ante es 5%.",
  },
  {
    termino: "Regla de Taylor",
    definicion: "Fórmula que sugiere cómo debería moverse la tasa de política según la brecha de inflación (π − π*) y la brecha de producto. Referencia teórica, no una receta mecánica.",
    modulo: "inflacion",
    formula: "i = r* + π* + α(π - π*) + β(y - y*)",
    ejemplo: "Con r*=2%, π*=3%, α=0.5, β=0.5, si π=5% y brecha=+1%, entonces i ≈ 6.5%.",
  },
  {
    termino: "Brecha de producto",
    definicion: "Diferencia entre el PIB observado y el PIB potencial (en %). Positiva = economía sobrecalentada; negativa = holgura.",
    modulo: "inflacion",
    formula: "brecha = (Y - Y*) / Y* × 100",
  },
  {
    termino: "Brecha de inflación",
    definicion: "Diferencia entre la inflación observada y la meta del banco central.",
    modulo: "inflacion",
    formula: "brecha_inflacion = π - π*",
  },
  {
    termino: "Meta de inflación",
    definicion: "Objetivo de inflación que el banco central se compromete a alcanzar (ej: 3% ± 1% en México).",
    modulo: "inflacion",
  },
  {
    termino: "Política expansiva",
    definicion: "El banco central baja (o mantiene baja) la tasa para estimular crédito y actividad económica.",
    modulo: "inflacion",
  },
  {
    termino: "Política restrictiva",
    definicion: "El banco central sube la tasa para enfriar la demanda y anclar expectativas de inflación.",
    modulo: "inflacion",
  },
  {
    termino: "Tasa de política monetaria",
    definicion: "Tasa de interés que el banco central fija para influir en la economía (ej: tasa de fondeo bancario en México).",
    modulo: "inflacion",
  },
  // Macroeconomía
  {
    termino: "Multiplicador del gasto",
    definicion: "Mide cuánto aumenta la renta de equilibrio cuando aumenta el gasto público en una unidad.",
    modulo: "macro",
    formula: "k_G = 1 / (1 - PMC)",
    ejemplo: "Si PMC = 0.6, entonces k_G = 1 / 0.4 = 2.5. Un aumento de G en $10 aumenta Y en $25.",
  },
  {
    termino: "Multiplicador de impuestos",
    definicion: "Mide cuánto cambia la renta cuando cambian los impuestos. Es negativo porque los impuestos reducen el consumo.",
    modulo: "macro",
    formula: "k_T = -PMC / (1 - PMC)",
    ejemplo: "Si PMC = 0.6, entonces k_T = -0.6 / 0.4 = -1.5. Un aumento de T en $10 reduce Y en $15.",
  },
  {
    termino: "Multiplicador de presupuesto equilibrado",
    definicion: "Cuando G y T aumentan en la misma cantidad, el efecto neto sobre Y es positivo e igual a 1.",
    modulo: "macro",
    formula: "k_equilibrado = 1",
    ejemplo: "Si G y T aumentan ambos en $10, Y aumenta en $10.",
  },
  {
    termino: "Propensión marginal a consumir (PMC)",
    definicion: "Proporción del ingreso adicional que se destina al consumo. Entre 0 y 1.",
    modulo: "macro",
    formula: "PMC = ΔC / ΔYd",
    ejemplo: "Si el ingreso disponible aumenta $100 y el consumo aumenta $60, PMC = 0.6.",
  },
  {
    termino: "Renta de equilibrio",
    definicion: "Nivel de producción donde la demanda agregada iguala a la oferta agregada (Y = DA).",
    modulo: "macro",
    formula: "Y* = (C₀ + I + G - PMC × T) / (1 - PMC)",
  },
  {
    termino: "Curva IS",
    definicion: "Combinaciones de renta (Y) y tasa de interés (r) donde el mercado de bienes está en equilibrio.",
    modulo: "macro",
    formula: "Y = [C₀ + I₀ - b×r + G - PMC×T] / (1 - PMC)",
  },
  {
    termino: "Curva LM",
    definicion: "Combinaciones de renta (Y) y tasa de interés (r) donde el mercado de dinero está en equilibrio.",
    modulo: "macro",
    formula: "M/P = k×Y - h×r",
  },
  {
    termino: "Equilibrio IS-LM",
    definicion: "Punto donde se cruzan las curvas IS y LM, determinando la renta y tasa de interés de equilibrio simultáneo.",
    modulo: "macro",
  },
  // Microeconomía
  {
    termino: "Intercepto de demanda (a)",
    definicion: "Precio máximo que los consumidores están dispuestos a pagar cuando la cantidad es cero. Determina dónde la curva corta el eje de precios.",
    modulo: "micro",
    formula: "Qd = a - b×P",
  },
  {
    termino: "Pendiente de demanda (b)",
    definicion: "Mide qué tan sensible es la cantidad demandada ante cambios en el precio. Pendiente negativa (b > 0 en Qd = a - b×P).",
    modulo: "micro",
    formula: "Qd = a - b×P",
  },
  {
    termino: "Intercepto de oferta (c)",
    definicion: "Precio mínimo que los productores requieren para ofrecer cualquier cantidad. Determina dónde la curva corta el eje de precios.",
    modulo: "micro",
    formula: "Qs = c + d×P",
  },
  {
    termino: "Pendiente de oferta (d)",
    definicion: "Mide qué tan sensible es la cantidad ofrecida ante cambios en el precio. Pendiente positiva (d > 0 en Qs = c + d×P).",
    modulo: "micro",
    formula: "Qs = c + d×P",
  },
  {
    termino: "Precio de equilibrio",
    definicion: "Precio donde la cantidad demandada iguala a la cantidad ofrecida (Qd = Qs).",
    modulo: "micro",
    formula: "P* = (a - c) / (b + d)",
  },
  {
    termino: "Cantidad de equilibrio",
    definicion: "Cantidad intercambiada cuando el mercado está en equilibrio (Qd = Qs = Q*).",
    modulo: "micro",
    formula: "Q* = (a×d + b×c) / (b + d)",
  },
  {
    termino: "Excedente del consumidor",
    definicion: "Diferencia entre lo que los consumidores están dispuestos a pagar y lo que realmente pagan. Área bajo la curva de demanda y sobre el precio de equilibrio.",
    modulo: "micro",
    formula: "EC = (1/2) × (a - P*) × Q*",
  },
  {
    termino: "Excedente del productor",
    definicion: "Diferencia entre lo que los productores reciben y su precio mínimo de oferta. Área sobre la curva de oferta y bajo el precio de equilibrio.",
    modulo: "micro",
    formula: "EP = (1/2) × (P* - c) × Q*",
  },
  {
    termino: "Elasticidad precio de la demanda (arco)",
    definicion: "Mide la sensibilidad porcentual de la cantidad demandada ante un cambio porcentual en el precio, usando el promedio de precios y cantidades.",
    modulo: "micro",
    formula: "ε = [(Q₂ - Q₁) / ((Q₁ + Q₂)/2)] / [(P₂ - P₁) / ((P₁ + P₂)/2)]",
    ejemplo: "Si el precio sube de $10 a $12 y la cantidad baja de 100 a 80, ε ≈ -1.11 (elástica).",
  },
  {
    termino: "Demanda elástica",
    definicion: "Cuando |ε| > 1. Un cambio porcentual en el precio causa un cambio porcentual mayor en la cantidad.",
    modulo: "micro",
  },
  {
    termino: "Demanda inelástica",
    definicion: "Cuando |ε| < 1. Un cambio porcentual en el precio causa un cambio porcentual menor en la cantidad.",
    modulo: "micro",
  },
  {
    termino: "Demanda unitaria",
    definicion: "Cuando |ε| = 1. El cambio porcentual en precio y cantidad son iguales.",
    modulo: "micro",
  },
];

export function buscarTerminos(query: string): TerminoGlosario[] {
  const q = query.toLowerCase().trim();
  if (!q) return TERMINOS;
  return TERMINOS.filter(
    (t) =>
      t.termino.toLowerCase().includes(q) ||
      t.definicion.toLowerCase().includes(q) ||
      t.modulo === q
  );
}

export function getTerminosPorModulo(modulo: "inflacion" | "macro" | "micro" | "general"): TerminoGlosario[] {
  return TERMINOS.filter((t) => t.modulo === modulo);
}
