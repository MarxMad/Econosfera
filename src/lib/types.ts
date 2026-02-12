/** Tipos para el simulador de inflación y política monetaria */

export type PoliticaMonetaria = "expansiva" | "neutral" | "restrictiva";

export interface VariablesSimulacion {
  /** Inflación general (anual, %) */
  inflacion: number;
  /** Inflación subyacente / núcleo (anual, %) */
  inflacionSubyacente: number;
  /** Tasa de política monetaria actual (%) */
  tasaPolitica: number;
  /** Meta de inflación del banco central (%) */
  metaInflacion: number;
  /** Tipo de política: expansiva, neutral, restrictiva */
  tipoPolitica: PoliticaMonetaria;
  /** Crecimiento del PIB real esperado (%) - opcional para regla de Taylor */
  crecimientoPIB: number;
  /** Producto potencial / brecha (%) - positivo = por encima del potencial */
  brechaProducto: number;
  /** Peso de la brecha de inflación en la regla de Taylor (α) */
  alphaTaylor?: number;
  /** Peso de la brecha de producto en la regla de Taylor (β) */
  betaTaylor?: number;
}

export interface ResultadosSimulacion {
  /** Tasa real ex post: tasa política - inflación observada */
  tasaRealExPost: number;
  /** Tasa real ex ante (usando inflación esperada/subyacente) */
  tasaRealExAnte: number;
  /** Brecha de inflación: inflación - meta */
  brechaInflacion: number;
  /** Brecha de inflación subyacente */
  brechaInflacionSubyacente: number;
  /** Postura de política según regla de Taylor simplificada */
  tasaTaylor: number;
  /** Diferencia tasa actual vs Taylor (positivo = más restrictivo que Taylor) */
  desviacionTaylor: number;
  /** Interpretación en texto */
  interpretacion: string;
  /** Escenario de política descrito */
  descripcionPolitica: string;
}
