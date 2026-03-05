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
    comparador: "PRO",
  },
  monetaria: {
    core: "FREE",
    taylor: "PRO",
    ai: "RESEARCHER",
  },
  macro: {
    standard: "FREE",
    solow: "FREE",
    phillips: "PRO",
    mundell: "RESEARCHER",
  },
  micro: {
    mercado: "FREE",
    elasticidad: "FREE",
    estructuras: "PRO",
    juegos: "RESEARCHER",
  },
  finanzas: {
    basico: "FREE",
    mapas: "FREE",
    fundamental: "FREE",
    valuacion: "PRO",
    pro: "PRO",
  },
  actuaria: {
    mortalidad: "FREE",
    poder: "FREE",
    ruina: "PRO",
  },
  estadistica: {
    regresion: "FREE",
    tcl: "PRO",
  },
  contadores: {
    depreciacion: "FREE",
    costos: "FREE",
    razones: "FREE",
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
