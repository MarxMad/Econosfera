/**
 * Cálculos para el módulo Contabilidad:
 * Depreciación (línea recta, suma de dígitos), costos de inventario (FIFO, LIFO, promedio), razones financieras.
 */

// --- Depreciación ---

export interface FilaDepreciacion {
  periodo: number;
  depreciacionAnual: number;
  depreciacionAcumulada: number;
  valorEnLibros: number;
}

/** Depreciación por línea recta: (Costo - Valor residual) / Vida útil (años). */
export function depreciacionLineaRecta(
  costo: number,
  valorResidual: number,
  vidaUtilAnos: number
): FilaDepreciacion[] {
  const depreciacionAnual = (costo - valorResidual) / Math.max(1, vidaUtilAnos);
  const filas: FilaDepreciacion[] = [];
  let acum = 0;
  for (let p = 1; p <= vidaUtilAnos; p++) {
    acum += depreciacionAnual;
    filas.push({
      periodo: p,
      depreciacionAnual,
      depreciacionAcumulada: acum,
      valorEnLibros: Math.max(0, costo - acum),
    });
  }
  return filas;
}

/** Depreciación por suma de dígitos: fracción decreciente. Año 1 = n/S, año 2 = (n-1)/S, ... S = n(n+1)/2. */
export function depreciacionSumaDigitos(
  costo: number,
  valorResidual: number,
  vidaUtilAnos: number
): FilaDepreciacion[] {
  const base = costo - valorResidual;
  const n = Math.max(1, Math.floor(vidaUtilAnos));
  const suma = (n * (n + 1)) / 2;
  const filas: FilaDepreciacion[] = [];
  let acum = 0;
  for (let p = 1; p <= n; p++) {
    const fraccion = (n - p + 1) / suma;
    const dep = base * fraccion;
    acum += dep;
    filas.push({
      periodo: p,
      depreciacionAnual: dep,
      depreciacionAcumulada: acum,
      valorEnLibros: Math.max(0, costo - acum),
    });
  }
  return filas;
}

// --- Costos de inventario ---

export interface MovimientoInventario {
  fecha: string;
  tipo: "entrada" | "salida";
  unidades: number;
  costoUnitario: number;
}

export interface ResultadoInventario {
  metodo: "FIFO" | "LIFO" | "PROMEDIO";
  costoVentas: number;
  inventarioFinal: number;
  unidadesVendidas: number;
  unidadesInventario: number;
}

/** FIFO: primeras entradas, primeras salidas. */
export function costoFIFO(movimientos: MovimientoInventario[]): ResultadoInventario {
  const entradas: { u: number; c: number }[] = [];
  let costoVentas = 0;
  let inventarioFinal = 0;
  let unidadesVendidas = 0;

  for (const m of movimientos) {
    if (m.tipo === "entrada") {
      entradas.push({ u: m.unidades, c: m.costoUnitario });
    } else {
      let restantes = m.unidades;
      unidadesVendidas += m.unidades;
      while (restantes > 0 && entradas.length > 0) {
        const primero = entradas[0];
        const usadas = Math.min(restantes, primero.u);
        costoVentas += usadas * primero.c;
        restantes -= usadas;
        primero.u -= usadas;
        if (primero.u <= 0) entradas.shift();
      }
    }
  }

  for (const e of entradas) inventarioFinal += e.u * e.c;
  const unidadesInv = entradas.reduce((s, e) => s + e.u, 0);

  return {
    metodo: "FIFO",
    costoVentas,
    inventarioFinal,
    unidadesVendidas,
    unidadesInventario: unidadesInv,
  };
}

/** LIFO: últimas entradas, primeras salidas. */
export function costoLIFO(movimientos: MovimientoInventario[]): ResultadoInventario {
  const entradas: { u: number; c: number }[] = [];
  let costoVentas = 0;
  let unidadesVendidas = 0;

  for (const m of movimientos) {
    if (m.tipo === "entrada") {
      entradas.push({ u: m.unidades, c: m.costoUnitario });
    } else {
      let restantes = m.unidades;
      unidadesVendidas += m.unidades;
      while (restantes > 0 && entradas.length > 0) {
        const ultimo = entradas[entradas.length - 1];
        const usadas = Math.min(restantes, ultimo.u);
        costoVentas += usadas * ultimo.c;
        restantes -= usadas;
        ultimo.u -= usadas;
        if (ultimo.u <= 0) entradas.pop();
      }
    }
  }

  let inventarioFinal = 0;
  let unidadesInv = 0;
  for (const e of entradas) {
    inventarioFinal += e.u * e.c;
    unidadesInv += e.u;
  }

  return {
    metodo: "LIFO",
    costoVentas,
    inventarioFinal,
    unidadesVendidas,
    unidadesInventario: unidadesInv,
  };
}

/** Promedio ponderado: costo unitario promedio de todas las entradas disponibles al momento de cada salida. */
export function costoPromedioPonderado(movimientos: MovimientoInventario[]): ResultadoInventario {
  let unidadesTotal = 0;
  let costoTotal = 0;
  let costoVentas = 0;
  let unidadesVendidas = 0;

  for (const m of movimientos) {
    if (m.tipo === "entrada") {
      unidadesTotal += m.unidades;
      costoTotal += m.unidades * m.costoUnitario;
    } else {
      const costoPromedio = unidadesTotal > 0 ? costoTotal / unidadesTotal : 0;
      const usadas = Math.min(m.unidades, unidadesTotal);
      costoVentas += usadas * costoPromedio;
      unidadesVendidas += usadas;
      unidadesTotal -= usadas;
      costoTotal -= usadas * costoPromedio;
    }
  }

  return {
    metodo: "PROMEDIO",
    costoVentas,
    inventarioFinal: costoTotal,
    unidadesVendidas,
    unidadesInventario: unidadesTotal,
  };
}

// --- Razones financieras ---

export interface EstadosFinancieros {
  activoCorriente: number;
  inventario: number;
  pasivoCorriente: number;
  activoTotal: number;
  pasivoTotal: number;
  patrimonio: number;
  ventas: number;
  costoVentas: number;
  utilidadNeta: number;
  ebitda?: number;
}

export interface RazonesFinancieras {
  liquidezCorriente: number;
  pruebaAcida: number;
  endeudamiento: number;
  rentabilidadVentas: number;
  rentabilidadActivos: number;
  rentabilidadPatrimonio: number;
}

/** Depreciación por unidades de producción: (Costo - Residual) × (Unidades periodo / Unidades totales vida útil). */
export function depreciacionUnidadesProduccion(
  costo: number,
  valorResidual: number,
  unidadesTotalesVidaUtil: number,
  unidadesPeriodo: number
): { depreciacionPeriodo: number; porcentajeUsado: number } {
  const base = costo - valorResidual;
  if (unidadesTotalesVidaUtil <= 0) return { depreciacionPeriodo: 0, porcentajeUsado: 0 };
  const depreciacionPeriodo = base * (unidadesPeriodo / unidadesTotalesVidaUtil);
  const porcentajeUsado = (unidadesPeriodo / unidadesTotalesVidaUtil) * 100;
  return { depreciacionPeriodo, porcentajeUsado };
}

/** Estado de resultados: estructura básica. */
export interface EstadoResultados {
  ventasNetas: number;
  costoVentas: number;
  utilidadBruta: number;
  gastosOperacion: number;
  utilidadOperacion: number;
  otrosGastos: number;
  utilidadAntesImpuestos: number;
  impuestos: number;
  utilidadNeta: number;
  margenBruto: number;
  margenOperativo: number;
  margenNeto: number;
}

export function calcularEstadoResultados(
  ventasNetas: number,
  costoVentas: number,
  gastosOperacion: number,
  otrosGastos: number,
  tasaImpuestos: number
): EstadoResultados {
  const utilidadBruta = ventasNetas - costoVentas;
  const utilidadOperacion = utilidadBruta - gastosOperacion;
  const utilidadAntesImpuestos = utilidadOperacion - otrosGastos;
  const impuestos = Math.max(0, utilidadAntesImpuestos * tasaImpuestos);
  const utilidadNeta = utilidadAntesImpuestos - impuestos;
  return {
    ventasNetas,
    costoVentas,
    utilidadBruta,
    gastosOperacion,
    utilidadOperacion,
    otrosGastos,
    utilidadAntesImpuestos,
    impuestos,
    utilidadNeta,
    margenBruto: ventasNetas > 0 ? utilidadBruta / ventasNetas : 0,
    margenOperativo: ventasNetas > 0 ? utilidadOperacion / ventasNetas : 0,
    margenNeto: ventasNetas > 0 ? utilidadNeta / ventasNetas : 0,
  };
}

/** Prorrateo de gastos: distribuir costos indirectos según base (horas, unidades, etc.). */
export function prorrateoGastos(
  costoTotal: number,
  bases: number[]
): { asignado: number[]; porcentaje: number[] } {
  const totalBase = bases.reduce((s, b) => s + b, 0);
  if (totalBase <= 0) return { asignado: bases.map(() => 0), porcentaje: bases.map(() => 0) };
  const asignado = bases.map((b) => (b / totalBase) * costoTotal);
  const porcentaje = bases.map((b) => (b / totalBase) * 100);
  return { asignado, porcentaje };
}

/** Costo de producción: MP + MOD + CIF. Costo unitario = Costo total / Unidades producidas. */
export function costoProduccion(
  materiaPrima: number,
  manoObraDirecta: number,
  costosIndirectos: number,
  unidadesProducidas: number
): { costoTotal: number; costoUnitario: number } {
  const costoTotal = materiaPrima + manoObraDirecta + costosIndirectos;
  const costoUnitario = unidadesProducidas > 0 ? costoTotal / unidadesProducidas : 0;
  return { costoTotal, costoUnitario };
}

/** Calcula razones financieras básicas a partir de estados simplificados. */
export function calcularRazones(ef: EstadosFinancieros): RazonesFinancieras {
  const activoCorriente = ef.activoCorriente || 0;
  const inventario = ef.inventario ?? 0;
  const pasivoCorriente = ef.pasivoCorriente || 0;
  return {
    liquidezCorriente: pasivoCorriente > 0 ? activoCorriente / pasivoCorriente : 0,
    pruebaAcida: pasivoCorriente > 0 ? (activoCorriente - inventario) / pasivoCorriente : 0,
    endeudamiento: (ef.activoTotal || 0) > 0 ? (ef.pasivoTotal || 0) / ef.activoTotal : 0,
    rentabilidadVentas: (ef.ventas || 0) > 0 ? (ef.utilidadNeta || 0) / ef.ventas : 0,
    rentabilidadActivos: (ef.activoTotal || 0) > 0 ? (ef.utilidadNeta || 0) / ef.activoTotal : 0,
    rentabilidadPatrimonio: (ef.patrimonio || 0) > 0 ? (ef.utilidadNeta || 0) / ef.patrimonio : 0,
  };
}
