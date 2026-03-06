/**
 * Desbloqueo de simuladores por plan.
 * FREE: 2 por categoría (básicos).
 * PRO: 2 por categoría (diferentes, más avanzados).
 * RESEARCHER: todo desbloqueado.
 */

export type PlanLevel = "FREE" | "PRO" | "RESEARCHER";

export const PLAN_ORDER: Record<PlanLevel, number> = {
  FREE: 0,
  PRO: 1,
  RESEARCHER: 2,
};

/** Módulo -> tabId -> plan mínimo requerido */
export const SIMULATOR_ACCESS: Record<string, Record<string, PlanLevel>> = {
  inflacion: {
    tasaReal: "FREE",
    poderAdquisitivo: "FREE",
    brecha: "FREE",
    tasaRealExPost: "FREE",
    comparador: "PRO",
  },
  monetaria: {
    core: "FREE",
    taylor: "PRO",
    ai: "RESEARCHER",
    uip: "FREE",
    canalesTransmision: "FREE",
    comparadorPostura: "PRO",
  },
  macro: {
    multiplier: "FREE",
    islm: "FREE",
    solow: "FREE",
    phillips: "PRO",
    mundell: "RESEARCHER",
    okun: "FREE",
    ppp: "FREE",
    harrodDomar: "FREE",
    multTransferencias: "PRO",
  },
  micro: {
    mercado: "FREE",
    elasticidad: "FREE",
    elasticidadArco: "FREE",
    estructuras: "PRO",
    juegos: "RESEARCHER",
  },
  finanzas: {
    vpvf: "FREE",
    amortizacion: "FREE",
    anualidad: "FREE",
    interesSimpleCompuesto: "FREE",
    regla72: "FREE",
    tasaEfectiva: "FREE",
    bono: "FREE",
    cetes: "FREE",
    ahorro: "FREE",
    impactoNoticias: "FREE",
    correlacionFundamental: "FREE",
    capm: "FREE",
    valuacion: "PRO",
    dcf: "PRO",
    vpntir: "PRO",
    wacc: "PRO",
    duracionBono: "PRO",
    markowitz: "PRO",
    portafolio2: "PRO",
    blackScholes: "PRO",
    yieldCurve: "PRO",
    forward: "PRO",
    breakEven: "PRO",
    flujoFinanciero: "FREE",
    mapaInstrumentos: "FREE",
    mapaEstructuraCapital: "FREE",
  },
  actuaria: {
    mortalidad: "FREE",
    ruina: "PRO",
  },
  estadistica: {
    regresion: "FREE",
    tcl: "PRO",
    regresionMultiple: "FREE",
    matrizCorrelacion: "FREE",
    estadisticasDescriptivas: "PRO",
  },
  contadores: {
    depreciacion: "FREE",
    costos: "FREE",
    razones: "FREE",
    estadoResultados: "FREE",
    ecuacion: "FREE",
    prorrateo: "FREE",
    costoProduccion: "FREE",
    puntoEquilibrio: "FREE",
  },
  blockchain: {
    halving: "FREE",
    cadenabloques: "FREE",
    trading: "PRO",
    staking: "PRO",
    amm: "RESEARCHER",
    llaves: "RESEARCHER",
    merkle: "RESEARCHER",
    consenso: "RESEARCHER",
    redp2p: "RESEARCHER",
    smartcontracts: "RESEARCHER",
  },
};

export function canAccess(userPlan: string | undefined, moduleId: string, tabId: string): boolean {
  const plan = (userPlan ?? "FREE").toUpperCase() as PlanLevel;
  const required = SIMULATOR_ACCESS[moduleId]?.[tabId];
  if (!required) return true;
  return PLAN_ORDER[plan] >= PLAN_ORDER[required];
}

export function getRequiredPlan(moduleId: string, tabId: string): PlanLevel | null {
  return SIMULATOR_ACCESS[moduleId]?.[tabId] ?? null;
}

/** Primer tab desbloqueado para el plan en el módulo (para redirigir si el actual está bloqueado). */
export function getFirstUnlockedTab(moduleId: string, userPlan: string | undefined): string | null {
  const tabs = SIMULATOR_ACCESS[moduleId];
  if (!tabs) return null;
  const plan = (userPlan ?? "FREE").toUpperCase() as PlanLevel;
  for (const [tabId, required] of Object.entries(tabs)) {
    if (PLAN_ORDER[plan] >= PLAN_ORDER[required as PlanLevel]) return tabId;
  }
  return null;
}
