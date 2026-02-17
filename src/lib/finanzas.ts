/**
 * Cálculos para simuladores del módulo Finanzas:
 * Valor presente/futuro, precio de bono, Cetes, ahorro con interés compuesto.
 */

/** Valor futuro: VF = VP (1 + r)^n (tasa r en decimal, n periodos) */
export function valorFuturo(VP: number, tasaAnualDecimal: number, anos: number): number {
  return VP * Math.pow(1 + tasaAnualDecimal, anos);
}

/** Valor presente: VP = VF / (1 + r)^n */
export function valorPresente(VF: number, tasaAnualDecimal: number, anos: number): number {
  return VF / Math.pow(1 + tasaAnualDecimal, anos);
}

/** Precio de un bono (cupón anual): suma del VP de cupones + VP del principal.
 * cuponAnual y ytm en decimal (ej. 0.05 = 5%). */
export function precioBono(
  valorNominal: number,
  tasaCuponAnual: number,
  ytmAnual: number,
  anosAlVencimiento: number
): { precio: number; flujos: { periodo: number; cupon: number; principal: number; vp: number }[] } {
  const cuponAnual = valorNominal * tasaCuponAnual;
  const flujos: { periodo: number; cupon: number; principal: number; vp: number }[] = [];
  let precio = 0;
  for (let t = 1; t <= anosAlVencimiento; t++) {
    const principal = t === anosAlVencimiento ? valorNominal : 0;
    const flujo = cuponAnual + principal;
    const vp = flujo / Math.pow(1 + ytmAnual, t);
    precio += vp;
    flujos.push({ periodo: t, cupon: cuponAnual, principal, vp });
  }
  return { precio, flujos };
}

/** Cetes: se colocan al descuento. Valor nominal típico 10 pesos.
 * rendimientoAnual en decimal (ej. 0.11 = 11%).
 * Precio = Valor nominal / (1 + r * (días/360))  (convención 360). */
export function cetesPrecio(valorNominal: number, rendimientoAnual: number, dias: number): number {
  const r = rendimientoAnual * (dias / 360);
  return valorNominal / (1 + r);
}

/** Dado precio y días, rendimiento anualizado (decimal). */
export function cetesRendimiento(valorNominal: number, precio: number, dias: number): number {
  if (precio <= 0) return 0;
  const r = (valorNominal / precio - 1) * (360 / dias);
  return r;
}

/** Ahorro periódico (aportación al final de cada periodo) con interés compuesto.
 * Formula: VF = A * [ ((1+r)^n - 1) / r ]. A = aportación, r = tasa por periodo, n = número de periodos. */
export function ahorroPeriodicoVF(aportacion: number, tasaAnualDecimal: number, anos: number, periodosPorAno: number = 12): number {
  const n = anos * periodosPorAno;
  const r = tasaAnualDecimal / periodosPorAno;
  if (Math.abs(r) < 1e-10) return aportacion * n;
  return aportacion * (Math.pow(1 + r, n) - 1) / r;
}

/** Evolución del ahorro periodo a periodo (para gráfica). */
export function ahorroEvolucion(
  aportacion: number,
  tasaAnualDecimal: number,
  anos: number,
  periodosPorAno: number = 12
): { periodo: number; acumulado: number }[] {
  const r = tasaAnualDecimal / periodosPorAno;
  const out: { periodo: number; acumulado: number }[] = [{ periodo: 0, acumulado: 0 }];
  let acum = 0;
  const totalPeriodos = anos * periodosPorAno;
  for (let i = 1; i <= totalPeriodos; i++) {
    acum = acum * (1 + r) + aportacion;
    out.push({ periodo: i, acumulado: acum });
  }
  return out;
}

/** Evolución VP a VF por año (para gráfica VP/VF). */
export function evolucionVF(VP: number, tasaAnualDecimal: number, anos: number): { ano: number; valor: number }[] {
  const out: { ano: number; valor: number }[] = [];
  for (let n = 0; n <= anos; n++) {
    out.push({ ano: n, valor: valorFuturo(VP, tasaAnualDecimal, n) });
  }
  return out;
}
