/** Fórmulas económicas organizadas por módulo */

export interface Formula {
  nombre: string;
  formula: string;
  descripcion: string;
  variables: { simbolo: string; descripcion: string }[];
  ejemplo?: string;
}

export interface ModuloFormulas {
  modulo: "inflacion" | "macro" | "micro";
  titulo: string;
  formulas: Formula[];
}

export const FORMULAS: ModuloFormulas[] = [
  {
    modulo: "inflacion",
    titulo: "Inflación y Política Monetaria",
    formulas: [
      {
        nombre: "Tasa real ex post",
        formula: "r_{ex-post} = i - \\pi",
        descripcion: "Tasa de interés real calculada usando la inflación ya observada.",
        variables: [
          { simbolo: "r_{ex-post}", descripcion: "Tasa real ex post (%)" },
          { simbolo: "i", descripcion: "Tasa nominal (%)" },
          { simbolo: "\\pi", descripcion: "Inflación observada (%)" },
        ],
        ejemplo: "Si i = 9% y π = 5%, entonces r_ex-post = 4%",
      },
      {
        nombre: "Tasa real ex ante",
        formula: "r_{ex-ante} = i - \\pi_e",
        descripcion: "Tasa de interés real usando la inflación esperada.",
        variables: [
          { simbolo: "r_{ex-ante}", descripcion: "Tasa real ex ante (%)" },
          { simbolo: "i", descripcion: "Tasa nominal (%)" },
          { simbolo: "\\pi_e", descripcion: "Inflación esperada (%)" },
        ],
      },
      {
        nombre: "Brecha de inflación",
        formula: "brecha_\\pi = \\pi - \\pi^*",
        descripcion: "Diferencia entre la inflación observada y la meta del banco central.",
        variables: [
          { simbolo: "brecha_\\pi", descripcion: "Brecha de inflación (p.p.)" },
          { simbolo: "\\pi", descripcion: "Inflación observada (%)" },
          { simbolo: "\\pi^*", descripcion: "Meta de inflación (%)" },
        ],
      },
      {
        nombre: "Brecha de producto",
        formula: "brecha_Y = \\frac{Y - Y^*}{Y^*} \\times 100",
        descripcion: "Diferencia porcentual entre el PIB observado y el potencial.",
        variables: [
          { simbolo: "brecha_Y", descripcion: "Brecha de producto (%)" },
          { simbolo: "Y", descripcion: "PIB observado" },
          { simbolo: "Y^*", descripcion: "PIB potencial" },
        ],
      },
      {
        nombre: "Regla de Taylor",
        formula: "i = r^* + \\pi^* + \\alpha(\\pi - \\pi^*) + \\beta(y - y^*)",
        descripcion: "Fórmula que sugiere la tasa de política según brechas de inflación y producto.",
        variables: [
          { simbolo: "i", descripcion: "Tasa de política sugerida (%)" },
          { simbolo: "r^*", descripcion: "Tasa real neutral (≈ 2%)" },
          { simbolo: "\\pi^*", descripcion: "Meta de inflación (%)" },
          { simbolo: "\\alpha", descripcion: "Peso de la brecha de inflación (típico: 0.5)" },
          { simbolo: "\\beta", descripcion: "Peso de la brecha de producto (típico: 0.5)" },
          { simbolo: "\\pi", descripcion: "Inflación observada (%)" },
          { simbolo: "y - y^*", descripcion: "Brecha de producto (%)" },
        ],
        ejemplo: "Con r*=2%, π*=3%, α=0.5, β=0.5, π=5%, brecha=+1%: i = 2 + 3 + 0.5(2) + 0.5(1) = 6.5%",
      },
    ],
  },
  {
    modulo: "macro",
    titulo: "Macroeconomía",
    formulas: [
      {
        nombre: "Renta de equilibrio (modelo simple)",
        formula: "Y^* = \\frac{C_0 + I + G - PMC \\times T}{1 - PMC}",
        descripcion: "Nivel de producción donde la demanda agregada iguala a la oferta.",
        variables: [
          { simbolo: "Y^*", descripcion: "Renta de equilibrio" },
          { simbolo: "C_0", descripcion: "Consumo autónomo" },
          { simbolo: "I", descripcion: "Inversión" },
          { simbolo: "G", descripcion: "Gasto público" },
          { simbolo: "PMC", descripcion: "Propensión marginal a consumir" },
          { simbolo: "T", descripcion: "Impuestos" },
        ],
      },
      {
        nombre: "Multiplicador del gasto público",
        formula: "k_G = \\frac{1}{1 - PMC}",
        descripcion: "Mide cuánto aumenta Y cuando aumenta G en una unidad.",
        variables: [
          { simbolo: "k_G", descripcion: "Multiplicador del gasto" },
          { simbolo: "PMC", descripcion: "Propensión marginal a consumir" },
        ],
        ejemplo: "Si PMC = 0.6, entonces k_G = 1 / 0.4 = 2.5",
      },
      {
        nombre: "Multiplicador de impuestos",
        formula: "k_T = -\\frac{PMC}{1 - PMC}",
        descripcion: "Mide cuánto cambia Y cuando cambian los impuestos.",
        variables: [
          { simbolo: "k_T", descripcion: "Multiplicador de impuestos" },
          { simbolo: "PMC", descripcion: "Propensión marginal a consumir" },
        ],
        ejemplo: "Si PMC = 0.6, entonces k_T = -0.6 / 0.4 = -1.5",
      },
      {
        nombre: "Multiplicador de presupuesto equilibrado",
        formula: "k_{equilibrado} = 1",
        descripcion: "Cuando ΔG = ΔT, el efecto neto sobre Y es igual al cambio en G.",
        variables: [],
        ejemplo: "Si G y T aumentan ambos en $10, Y aumenta en $10",
      },
      {
        nombre: "Curva IS",
        formula: "Y = \\frac{C_0 + I_0 - b \\times r + G - PMC \\times T}{1 - PMC}",
        descripcion: "Relación entre renta (Y) y tasa de interés (r) en equilibrio del mercado de bienes.",
        variables: [
          { simbolo: "Y", descripcion: "Renta" },
          { simbolo: "r", descripcion: "Tasa de interés (%)" },
          { simbolo: "b", descripcion: "Sensibilidad de la inversión a la tasa" },
          { simbolo: "I_0", descripcion: "Inversión autónoma" },
        ],
      },
      {
        nombre: "Curva LM",
        formula: "\\frac{M}{P} = k \\times Y - h \\times r",
        descripcion: "Relación entre renta (Y) y tasa de interés (r) en equilibrio del mercado de dinero.",
        variables: [
          { simbolo: "M/P", descripcion: "Oferta real de dinero" },
          { simbolo: "k", descripcion: "Sensibilidad de demanda de dinero a la renta" },
          { simbolo: "h", descripcion: "Sensibilidad de demanda de dinero a la tasa" },
        ],
      },
      {
        nombre: "Equilibrio IS-LM",
        formula: "Y^* = \\frac{(C_0 + I_0 + G - PMC \\times T) \\times h + b \\times \\frac{M}{P}}{h(1 - PMC) + b \\times k}",
        descripcion: "Renta de equilibrio cuando se resuelven simultáneamente IS y LM.",
        variables: [],
      },
    ],
  },
  {
    modulo: "micro",
    titulo: "Microeconomía",
    formulas: [
      {
        nombre: "Función de demanda",
        formula: "Q_d = a - b \\times P",
        descripcion: "Relación inversa entre precio y cantidad demandada.",
        variables: [
          { simbolo: "Q_d", descripcion: "Cantidad demandada" },
          { simbolo: "a", descripcion: "Intercepto (precio máximo)" },
          { simbolo: "b", descripcion: "Pendiente (sensibilidad al precio)" },
          { simbolo: "P", descripcion: "Precio" },
        ],
      },
      {
        nombre: "Función de oferta",
        formula: "Q_s = c + d \\times P",
        descripcion: "Relación directa entre precio y cantidad ofrecida.",
        variables: [
          { simbolo: "Q_s", descripcion: "Cantidad ofrecida" },
          { simbolo: "c", descripcion: "Intercepto (precio mínimo)" },
          { simbolo: "d", descripcion: "Pendiente (sensibilidad al precio)" },
        ],
      },
      {
        nombre: "Precio de equilibrio",
        formula: "P^* = \\frac{a - c}{b + d}",
        descripcion: "Precio donde Qd = Qs.",
        variables: [
          { simbolo: "P^*", descripcion: "Precio de equilibrio" },
        ],
      },
      {
        nombre: "Cantidad de equilibrio",
        formula: "Q^* = \\frac{a \\times d + b \\times c}{b + d}",
        descripcion: "Cantidad intercambiada en equilibrio.",
        variables: [
          { simbolo: "Q^*", descripcion: "Cantidad de equilibrio" },
        ],
      },
      {
        nombre: "Excedente del consumidor",
        formula: "EC = \\frac{1}{2} \\times (a - P^*) \\times Q^*",
        descripcion: "Área bajo la curva de demanda y sobre el precio de equilibrio.",
        variables: [
          { simbolo: "EC", descripcion: "Excedente del consumidor" },
        ],
      },
      {
        nombre: "Excedente del productor",
        formula: "EP = \\frac{1}{2} \\times (P^* - c) \\times Q^*",
        descripcion: "Área sobre la curva de oferta y bajo el precio de equilibrio.",
        variables: [
          { simbolo: "EP", descripcion: "Excedente del productor" },
        ],
      },
      {
        nombre: "Elasticidad precio de la demanda (arco)",
        formula: "\\varepsilon = \\frac{\\frac{Q_2 - Q_1}{(Q_1 + Q_2)/2}}{\\frac{P_2 - P_1}{(P_1 + P_2)/2}}",
        descripcion: "Mide la sensibilidad porcentual de la cantidad ante cambios en el precio.",
        variables: [
          { simbolo: "\\varepsilon", descripcion: "Elasticidad precio" },
          { simbolo: "Q_1, Q_2", descripcion: "Cantidades inicial y final" },
          { simbolo: "P_1, P_2", descripcion: "Precios inicial y final" },
        ],
        ejemplo: "Si P sube de $10 a $12 y Q baja de 100 a 80: ε ≈ -1.11 (elástica)",
      },
    ],
  },
];

export function getFormulasPorModulo(modulo: "inflacion" | "macro" | "micro"): Formula[] {
  const mod = FORMULAS.find((m) => m.modulo === modulo);
  return mod?.formulas || [];
}
