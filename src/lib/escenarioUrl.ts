/**
 * Serialización del escenario (variables) en query string para compartir enlace.
 * Formato: ?inf=5&isub=4.5&tasa=9&meta=3&tipo=restrictiva&pib=2&brecha=0.5&alpha=0.5&beta=0.5
 */

import type { VariablesSimulacion, PoliticaMonetaria } from "./types";

const TIPOS: PoliticaMonetaria[] = ["expansiva", "neutral", "restrictiva"];

export function variablesToParams(v: VariablesSimulacion): URLSearchParams {
  const p = new URLSearchParams();
  p.set("inf", String(v.inflacion));
  p.set("isub", String(v.inflacionSubyacente));
  p.set("tasa", String(v.tasaPolitica));
  p.set("meta", String(v.metaInflacion));
  p.set("tipo", v.tipoPolitica);
  p.set("pib", String(v.crecimientoPIB));
  p.set("brecha", String(v.brechaProducto));
  p.set("alpha", String(v.alphaTaylor ?? 0.5));
  p.set("beta", String(v.betaTaylor ?? 0.5));
  return p;
}

export function paramsToVariables(searchParams: Readonly<URLSearchParams>): VariablesSimulacion | null {
  const inf = parseFloat(searchParams.get("inf") ?? "");
  const isub = parseFloat(searchParams.get("isub") ?? "");
  const tasa = parseFloat(searchParams.get("tasa") ?? "");
  const meta = parseFloat(searchParams.get("meta") ?? "");
  const tipo = searchParams.get("tipo") ?? "neutral";
  const pib = parseFloat(searchParams.get("pib") ?? "");
  const brecha = parseFloat(searchParams.get("brecha") ?? "");
  const alpha = parseFloat(searchParams.get("alpha") ?? "");
  const beta = parseFloat(searchParams.get("beta") ?? "");

  if (
    Number.isNaN(inf) || Number.isNaN(isub) || Number.isNaN(tasa) || Number.isNaN(meta) ||
    Number.isNaN(pib) || Number.isNaN(brecha) || Number.isNaN(alpha) || Number.isNaN(beta)
  ) {
    return null;
  }
  if (!TIPOS.includes(tipo as PoliticaMonetaria)) return null;

  return {
    inflacion: inf,
    inflacionSubyacente: isub,
    tasaPolitica: tasa,
    metaInflacion: meta,
    tipoPolitica: tipo as PoliticaMonetaria,
    crecimientoPIB: pib,
    brechaProducto: brecha,
    alphaTaylor: alpha,
    betaTaylor: beta,
  };
}

export function buildEscenarioUrl(pathname: string, variables: VariablesSimulacion): string {
  const params = variablesToParams(variables);
  const q = params.toString();
  return q ? `${pathname}?${q}` : pathname;
}
