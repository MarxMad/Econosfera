import type { VariablesSimulacion, ResultadosSimulacion, PoliticaMonetaria } from "./types";

/**
 * Cálculos económicos para el simulador.
 * Tasas en porcentaje (ej: 5.5 = 5.5%).
 */

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

/** Tasa real ex post = tasa nominal - inflación */
export function tasaRealExPost(tasaNominal: number, inflacion: number): number {
  return round2(tasaNominal - inflacion);
}

/** Tasa real ex ante usando inflación subyacente como proxy de esperada */
export function tasaRealExAnte(tasaNominal: number, inflacionSubyacente: number): number {
  return round2(tasaNominal - inflacionSubyacente);
}

/** Brecha de inflación respecto a la meta */
export function brechaInflacion(inflacion: number, meta: number): number {
  return round2(inflacion - meta);
}

/**
 * Regla de Taylor (en niveles):
 * i = r* + π* + α*(π - π*) + β*y
 * con r* tasa real neutral, π* meta inflación, y brecha de producto.
 * Usamos inflación subyacente para π y meta del BC.
 */
export function tasaTaylor(
  metaInflacion: number,
  inflacionSubyacente: number,
  brechaProducto: number,
  tasaRealNeutral: number = 2,
  alpha: number = 0.5,
  beta: number = 0.5
): number {
  const brechaInf = inflacionSubyacente - metaInflacion;
  const i = tasaRealNeutral + metaInflacion + alpha * brechaInf + beta * brechaProducto;
  return round2(i);
}

export function calcularResultados(v: VariablesSimulacion): ResultadosSimulacion {
  const tasaRealExPostVal = tasaRealExPost(v.tasaPolitica, v.inflacion);
  const tasaRealExAnteVal = tasaRealExAnte(v.tasaPolitica, v.inflacionSubyacente);
  const brechaInf = brechaInflacion(v.inflacion, v.metaInflacion);
  const brechaInfSub = brechaInflacion(v.inflacionSubyacente, v.metaInflacion);
  const alpha = v.alphaTaylor ?? 0.5;
  const beta = v.betaTaylor ?? 0.5;
  const tasaTaylorVal = tasaTaylor(v.metaInflacion, v.inflacionSubyacente, v.brechaProducto, 2, alpha, beta);
  const desviacionTaylor = round2(v.tasaPolitica - tasaTaylorVal);

  const descripcionPolitica = describirPolitica(v.tipoPolitica);
  const interpretacion = armarInterpretacion({
    tasaRealExPost: tasaRealExPostVal,
    tasaRealExAnte: tasaRealExAnteVal,
    brechaInflacion: brechaInf,
    brechaInflacionSubyacente: brechaInfSub,
    desviacionTaylor,
    tipoPolitica: v.tipoPolitica,
  });

  return {
    tasaRealExPost: tasaRealExPostVal,
    tasaRealExAnte: tasaRealExAnteVal,
    brechaInflacion: brechaInf,
    brechaInflacionSubyacente: brechaInfSub,
    tasaTaylor: tasaTaylorVal,
    desviacionTaylor,
    interpretacion,
    descripcionPolitica,
  };
}

function describirPolitica(tipo: PoliticaMonetaria): string {
  switch (tipo) {
    case "expansiva":
      return "Política monetaria expansiva: el banco central mantiene o baja la tasa para estimular crédito y actividad.";
    case "restrictiva":
      return "Política monetaria restrictiva: el banco central sube la tasa para enfriar la demanda y anclar expectativas de inflación.";
    case "neutral":
      return "Política monetaria neutral: la tasa está alineada con el estado de la economía e inflación.";
    default:
      return "";
  }
}

function armarInterpretacion(args: {
  tasaRealExPost: number;
  tasaRealExAnte: number;
  brechaInflacion: number;
  brechaInflacionSubyacente: number;
  desviacionTaylor: number;
  tipoPolitica: PoliticaMonetaria;
}): string {
  const lineas: string[] = [];

  if (args.tasaRealExPost > 0) {
    lineas.push(`La tasa real ex post es positiva (${args.tasaRealExPost}%): el costo real del dinero frena demanda.`);
  } else if (args.tasaRealExPost < 0) {
    lineas.push(`La tasa real ex post es negativa (${args.tasaRealExPost}%): estímulo monetario en términos reales.`);
  }

  if (args.brechaInflacion > 0) {
    lineas.push(`La inflación general está por encima de la meta (brecha +${args.brechaInflacion} pp).`);
  } else if (args.brechaInflacion < 0) {
    lineas.push(`La inflación general está por debajo de la meta (brecha ${args.brechaInflacion} pp).`);
  }

  if (args.brechaInflacionSubyacente > 0) {
    lineas.push(`La inflación subyacente también supera la meta (+${args.brechaInflacionSubyacente} pp), señal de presiones persistentes.`);
  }

  if (args.desviacionTaylor > 0.5) {
    lineas.push(`La tasa actual está por encima de lo que sugiere una regla de Taylor típica (postura más restrictiva).`);
  } else if (args.desviacionTaylor < -0.5) {
    lineas.push(`La tasa actual está por debajo de una regla de Taylor típica (postura más expansiva).`);
  }

  if (lineas.length === 0) lineas.push("Ajuste los parámetros para ver el análisis.");
  return lineas.join(" ");
}
