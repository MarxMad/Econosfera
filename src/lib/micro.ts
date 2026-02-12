/**
 * Microeconomía: oferta y demanda lineales, equilibrio, excedentes, elasticidad.
 * Demanda: P = a - b*Q  =>  Qd = (a - P) / b
 * Oferta: P = c + d*Q  =>  Qs = (P - c) / d
 * Equilibrio: a - b*Q = c + d*Q  =>  Q* = (a - c) / (b + d), P* = a - b*Q*
 * Excedente consumidor: área triángulo bajo demanda y sobre P* = (a - P*) * Q* / 2
 * Excedente productor: área triángulo sobre oferta y bajo P* = (P* - c) * Q* / 2
 * Elasticidad precio demanda (punto): (dQ/Q) / (dP/P) = (dQ/dP) * (P/Q) = -b * (P/Q)
 */

export interface VariablesMercado {
  demandaIntercepto: number;   // a (P cuando Q=0)
  demandaPendiente: number;    // b (positiva, P = a - b*Q)
  ofertaIntercepto: number;    // c (P cuando Q=0)
  ofertaPendiente: number;    // d (positiva, P = c + d*Q)
}

export interface ResultadosMercado {
  precioEquilibrio: number;
  cantidadEquilibrio: number;
  excedenteConsumidor: number;
  excedenteProductor: number;
  excedenteTotal: number;
  elasticidadPrecioDemanda: number;
}

export function calcularMercado(v: VariablesMercado): ResultadosMercado | null {
  const b = Math.max(0.01, v.demandaPendiente);
  const d = Math.max(0.01, v.ofertaPendiente);
  const a = v.demandaIntercepto;
  const c = v.ofertaIntercepto;
  if (a <= c) return null; // sin equilibrio con Q>0
  const q = (a - c) / (b + d);
  const p = a - b * q;
  if (q <= 0 || p <= 0) return null;
  const ec = ((a - p) * q) / 2;
  const ep = ((p - c) * q) / 2;
  const elasticidad = -b * (p / q);

  return {
    precioEquilibrio: redondear(p, 2),
    cantidadEquilibrio: redondear(q, 2),
    excedenteConsumidor: redondear(ec, 2),
    excedenteProductor: redondear(ep, 2),
    excedenteTotal: redondear(ec + ep, 2),
    elasticidadPrecioDemanda: redondear(elasticidad, 2),
  };
}

export interface VariablesElasticidad {
  precioInicial: number;
  precioFinal: number;
  cantidadInicial: number;
  cantidadFinal: number;
}

export interface ResultadosElasticidad {
  elasticidadArco: number;
  tipo: "elastica" | "inelastica" | "unitaria";
  interpretacion: string;
}

export function calcularElasticidadArco(v: VariablesElasticidad): ResultadosElasticidad {
  const dP = v.precioFinal - v.precioInicial;
  const dQ = v.cantidadFinal - v.cantidadInicial;
  const pMedio = (v.precioInicial + v.precioFinal) / 2;
  const qMedio = (v.cantidadInicial + v.cantidadFinal) / 2;
  if (pMedio === 0 || qMedio === 0) {
    return { elasticidadArco: 0, tipo: "inelastica", interpretacion: "Precio o cantidad media nula." };
  }
  const elasticidadArco = (dQ / qMedio) / (dP / pMedio);
  const tipo = Math.abs(elasticidadArco) > 1 ? "elastica" : Math.abs(elasticidadArco) < 1 ? "inelastica" : "unitaria";
  const interpretacion =
    tipo === "elastica"
      ? "Demanda elástica: la cantidad responde más que proporcionalmente al precio."
      : tipo === "inelastica"
        ? "Demanda inelástica: la cantidad responde menos que proporcionalmente al precio."
        : "Elasticidad unitaria: variaciones proporcionales de P y Q.";

  return {
    elasticidadArco: redondear(elasticidadArco, 2),
    tipo,
    interpretacion,
  };
}

function redondear(n: number, d: number): number {
  const f = 10 ** d;
  return Math.round(n * f) / f;
}
