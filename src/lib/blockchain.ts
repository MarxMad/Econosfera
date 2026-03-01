/**
 * Cálculos para economía blockchain: emisión con halving (estilo Bitcoin)
 * y oferta monetaria en el tiempo.
 */

export interface EraHalving {
  era: number;
  recompensaPorBloque: number;
  bloquesEnEra: number;
  emisionEra: number;
  supplyAcumulada: number;
  inflacionAnual: number; // %
  stockToFlow: number; // Años de producción que se necesitan para alcanzar el stock actual
}

/**
 * Emisión con halving: cada cierto número de bloques la recompensa se reduce a la mitad.
 * Supply acumulada después de n eras = B * R0 * (1 + 1/2 + ... + 1/2^(n-1)) = B*R0*(2 - 2^(1-n)).
 * Máximo teórico (n→∞) = 2 * bloquesPorHalving * recompensaInicial.
 */
export function emisionConHalving(
  recompensaInicial: number,
  bloquesPorHalving: number,
  numHalvings: number,
  minutosPorBloque: number = 10
): { eras: EraHalving[]; supplyMaxima: number } {
  const eras: EraHalving[] = [];
  let supplyAcumulada = 0;
  const supplyMaxima = 2 * bloquesPorHalving * recompensaInicial;

  const bloquesPorAno = (365.25 * 24 * 60) / minutosPorBloque;

  for (let n = 0; n < numHalvings; n++) {
    const recompensa = recompensaInicial / Math.pow(2, n);
    const emisionEra = bloquesPorHalving * recompensa;
    supplyAcumulada += emisionEra;

    // Inflacion Anual = Emisiones Anuales / Supply Total Al Final de la Era (aproximado)
    const emisionAnual = bloquesPorAno * recompensa;
    const inflacionAnual = (emisionAnual / supplyAcumulada) * 100;

    // SF = Stock / Flow
    // Si emisionAnual es muy pequeña, evitamos infinito
    const stockToFlow = emisionAnual > 0 ? supplyAcumulada / emisionAnual : 0;

    eras.push({
      era: n + 1,
      recompensaPorBloque: recompensa,
      bloquesEnEra: bloquesPorHalving,
      emisionEra,
      supplyAcumulada,
      inflacionAnual,
      stockToFlow
    });
  }

  return { eras, supplyMaxima };
}

/**
 * Años aproximados hasta un halving dado: minutos por bloque y bloques por halving.
 * bloquesPorAno = (365.25 * 24 * 60) / minutosPorBloque
 * añosPorHalving = bloquesPorHalving / bloquesPorAno
 */
export function anosPorHalving(minutosPorBloque: number, bloquesPorHalving: number): number {
  const bloquesPorAno = (365.25 * 24 * 60) / minutosPorBloque;
  return bloquesPorHalving / bloquesPorAno;
}

/**
 * Datos para gráfica: supply acumulada al final de cada era (eje X = era o año aproximado).
 */
export function datosGraficoHalving(
  recompensaInicial: number,
  bloquesPorHalving: number,
  minutosPorBloque: number,
  numPuntos: number
): { etiqueta: string; supply: number; anoAprox?: number; inflacionAnual: number; stockToFlow: number }[] {
  const anosPorEra = anosPorHalving(minutosPorBloque, bloquesPorHalving);
  const { eras } = emisionConHalving(recompensaInicial, bloquesPorHalving, numPuntos, minutosPorBloque);
  return eras.map((e, i) => ({
    etiqueta: `Época ${e.era}`,
    supply: e.supplyAcumulada,
    anoAprox: (i + 1) * anosPorEra,
    inflacionAnual: e.inflacionAnual,
    stockToFlow: e.stockToFlow
  }));
}
