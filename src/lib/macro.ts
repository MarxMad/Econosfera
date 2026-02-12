/**
 * Macroeconomía: multiplicadores keynesianos e IS-LM.
 * Y = C + I + G; C = C0 + PMC*(Y-T); multiplicador gasto = 1/(1-PMC).
 * Multiplicador impuestos = -PMC/(1-PMC). Presupuesto equilibrado (ΔG=ΔT): multiplicador = 1.
 * IS-LM: IS tiene I = I0 - b*r; LM: M/P = k*Y - h*r.
 */

export interface VariablesMacro {
  consumoAutonomo: number;
  propensionMarginalConsumo: number;
  inversion: number;
  gastoPublico: number;
  impuestos: number;
}

export interface ResultadosMacro {
  gastoAutonomo: number;
  multiplicadorGasto: number;
  multiplicadorImpuestos: number;
  multiplicadorPresupuestoEquilibrado: number;
  rentaEquilibrio: number;
  consumoEquilibrio: number;
  ahorroPrivado: number;
}

export function calcularEquilibrioMacro(v: VariablesMacro): ResultadosMacro {
  const pmc = Math.max(0.01, Math.min(0.99, v.propensionMarginalConsumo));
  const multGasto = 1 / (1 - pmc);
  const multImpuestos = -pmc / (1 - pmc);
  const gastoAutonomo = v.consumoAutonomo - pmc * v.impuestos + v.inversion + v.gastoPublico;
  const rentaEquilibrio = gastoAutonomo * multGasto;
  const consumoEquilibrio = v.consumoAutonomo + pmc * (rentaEquilibrio - v.impuestos);
  const ahorroPrivado = (rentaEquilibrio - v.impuestos) - consumoEquilibrio;

  return {
    gastoAutonomo: redondear(gastoAutonomo, 2),
    multiplicadorGasto: redondear(multGasto, 2),
    multiplicadorImpuestos: redondear(multImpuestos, 2),
    multiplicadorPresupuestoEquilibrado: 1,
    rentaEquilibrio: redondear(rentaEquilibrio, 2),
    consumoEquilibrio: redondear(consumoEquilibrio, 2),
    ahorroPrivado: redondear(ahorroPrivado, 2),
  };
}

// --- IS-LM ---
// IS: Y = (A - b*r) / (1 - PMC)  con A = C0 - PMC*T + I0 + G  y  I = I0 - b*r
// LM: M/P = k*Y - h*r  =>  r = (k*Y - M/P) / h
// Equilibrio: sustituir r de LM en IS y despejar Y; luego r.

export interface VariablesISLM {
  consumoAutonomo: number;
  propensionMarginalConsumo: number;
  inversionAutonoma: number;   // I0
  sensibilidadInversionTasa: number; // b (I = I0 - b*r)
  gastoPublico: number;
  impuestos: number;
  ofertaRealDinero: number;   // M/P
  sensibilidadDemandaDineroRenta: number;  // k (L = k*Y - h*r)
  sensibilidadDemandaDineroTasa: number;    // h
}

export interface ResultadosISLM {
  rentaEquilibrio: number;
  tasaEquilibrio: number;
  consumoEquilibrio: number;
  inversionEquilibrio: number;
  demandaDinero: number;
}

export function calcularISLM(v: VariablesISLM): ResultadosISLM | null {
  const pmc = Math.max(0.01, Math.min(0.99, v.propensionMarginalConsumo));
  const b = Math.max(1, v.sensibilidadInversionTasa);
  const k = Math.max(0.01, v.sensibilidadDemandaDineroRenta);
  const h = Math.max(1, v.sensibilidadDemandaDineroTasa);
  const A = v.consumoAutonomo - pmc * v.impuestos + v.inversionAutonoma + v.gastoPublico;
  const M_P = v.ofertaRealDinero;

  // Y = (A - b*r)/(1-PMC);  r = (k*Y - M/P)/h
  // r = (k*Y - M_P)/h  =>  Y = (A - b*(k*Y - M_P)/h)/(1-PMC)
  // Y*(1-PMC) = A - b*k*Y/h + b*M_P/h  =>  Y*(1-PMC + b*k/h) = A + b*M_P/h
  const denom = (1 - pmc) + (b * k) / h;
  if (denom <= 0) return null;
  const Y = (A + (b * M_P) / h) / denom;
  const r = (k * Y - M_P) / h;
  if (r < 0 || Y < 0) return null;

  const C = v.consumoAutonomo + pmc * (Y - v.impuestos);
  const I = v.inversionAutonoma - b * r;
  const L = k * Y - h * r;

  return {
    rentaEquilibrio: redondear(Y, 2),
    tasaEquilibrio: redondear(r, 2),
    consumoEquilibrio: redondear(C, 2),
    inversionEquilibrio: redondear(I, 2),
    demandaDinero: redondear(L, 2),
  };
}

/** Genera puntos (r, Y) para la curva IS: Y = (A - b*r)/(1-PMC) */
export function puntosIS(v: VariablesISLM, rMin: number, rMax: number, n: number): { r: number; Y: number }[] {
  const pmc = Math.max(0.01, Math.min(0.99, v.propensionMarginalConsumo));
  const b = Math.max(1, v.sensibilidadInversionTasa);
  const A = v.consumoAutonomo - pmc * v.impuestos + v.inversionAutonoma + v.gastoPublico;
  const out: { r: number; Y: number }[] = [];
  for (let i = 0; i <= n; i++) {
    const r = rMin + (i / n) * (rMax - rMin);
    const Y = (A - b * r) / (1 - pmc);
    if (Y > 0) out.push({ r: redondear(r, 2), Y: redondear(Y, 2) });
  }
  return out;
}

/** Genera puntos (r, Y) para la curva LM: r = (k*Y - M/P)/h */
export function puntosLM(v: VariablesISLM, YMin: number, YMax: number, n: number): { r: number; Y: number }[] {
  const k = Math.max(0.01, v.sensibilidadDemandaDineroRenta);
  const h = Math.max(1, v.sensibilidadDemandaDineroTasa);
  const M_P = v.ofertaRealDinero;
  const out: { r: number; Y: number }[] = [];
  for (let i = 0; i <= n; i++) {
    const Y = YMin + (i / n) * (YMax - YMin);
    const r = (k * Y - M_P) / h;
    if (r >= 0) out.push({ r: redondear(r, 2), Y: redondear(Y, 2) });
  }
  return out;
}

/** Para gráfico único: array con Y, rIS, rLM. IS: r = (A - Y*(1-PMC))/b; LM: r = (k*Y - M/P)/h */
export function datosGraficoISLM(v: VariablesISLM, YMax: number, n: number): { Y: number; rIS: number; rLM: number }[] {
  const pmc = Math.max(0.01, Math.min(0.99, v.propensionMarginalConsumo));
  const b = Math.max(1, v.sensibilidadInversionTasa);
  const k = Math.max(0.01, v.sensibilidadDemandaDineroRenta);
  const h = Math.max(1, v.sensibilidadDemandaDineroTasa);
  const A = v.consumoAutonomo - pmc * v.impuestos + v.inversionAutonoma + v.gastoPublico;
  const M_P = v.ofertaRealDinero;
  const YMaxIS = A / (1 - pmc);
  const out: { Y: number; rIS: number; rLM: number }[] = [];
  for (let i = 0; i <= n; i++) {
    const Y = (i / n) * YMax;
    const rIS = (A - Y * (1 - pmc)) / b;
    const rLM = (k * Y - M_P) / h;
    out.push({ Y: redondear(Y, 2), rIS: redondear(rIS, 2), rLM: redondear(rLM, 2) });
  }
  return out;
}

function redondear(n: number, d: number): number {
  const f = 10 ** d;
  return Math.round(n * f) / f;
}
