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

// --- Amortización, VPN/TIR, WACC, Forward, Break-even, Portafolio 2 ---

export interface FilaAmortizacion {
  periodo: number;
  pago: number;
  interes: number;
  principal: number;
  saldo: number;
}

/** Tabla de amortización: cuota fija (francés). tasaAnual en decimal, plazo en meses. */
export function tablaAmortizacion(
  monto: number,
  tasaAnual: number,
  plazoMeses: number
): { cuota: number; filas: FilaAmortizacion[]; totalInteres: number } {
  const r = tasaAnual / 12;
  let cuota: number;
  if (r < 1e-10) cuota = monto / plazoMeses;
  else cuota = (monto * r * Math.pow(1 + r, plazoMeses)) / (Math.pow(1 + r, plazoMeses) - 1);

  const filas: FilaAmortizacion[] = [];
  let saldo = monto;
  let totalInteres = 0;
  for (let p = 1; p <= plazoMeses; p++) {
    const interes = saldo * r;
    const principal = cuota - interes;
    saldo = Math.max(0, saldo - principal);
    totalInteres += interes;
    filas.push({ periodo: p, pago: cuota, interes, principal, saldo });
  }
  return { cuota, filas, totalInteres };
}

/** VPN: suma de VP de flujos. flujos[0] = inversión inicial (negativa), flujos[1..] = flujos de cada año. */
export function vpn(tasaDescuento: number, flujos: number[]): number {
  return flujos.reduce((acc, f, t) => acc + f / Math.pow(1 + tasaDescuento, t), 0);
}

/** TIR aproximada por Newton-Raphson (máx 100 iteraciones). */
export function tir(flujos: number[], guess = 0.1): number | null {
  const maxIter = 100;
  let r = guess;
  for (let i = 0; i < maxIter; i++) {
    const npv = flujos.reduce((acc, f, t) => acc + f / Math.pow(1 + r, t), 0);
    const dnpv = flujos.reduce((acc, f, t) => acc - (t * f) / Math.pow(1 + r, t + 1), 0);
    if (Math.abs(npv) < 1e-6) return r;
    if (Math.abs(dnpv) < 1e-10) break;
    r = r - npv / dnpv;
    if (r <= -0.99 || r >= 10) break;
  }
  return null;
}

/** WACC = (E/V)*Re + (D/V)*Rd*(1-Tc). E=equity, D=debt, V=E+D, Re=costo capital, Rd=costo deuda, Tc=tasa impuestos (0-1). */
export function wacc(
  valorEquity: number,
  valorDeuda: number,
  costoEquity: number,
  costoDeuda: number,
  tasaImpuestos: number
): number {
  const v = valorEquity + valorDeuda;
  if (v <= 0) return 0;
  return (valorEquity / v) * costoEquity + (valorDeuda / v) * costoDeuda * (1 - tasaImpuestos);
}

/** Precio forward teórico (sin dividendos): F = S * (1 + r)^T o F = S * e^(r*T). */
export function forwardPrecio(spot: number, tasaAnual: number, anos: number, continuo = false): number {
  if (continuo) return spot * Math.exp(tasaAnual * anos);
  return spot * Math.pow(1 + tasaAnual, anos);
}

/** Punto de equilibrio: Q = CF / (P - CVu). Retorna cantidad y ventas = Q*P. */
export function breakEven(costosFijos: number, precioVenta: number, costoVariableUnitario: number): { cantidad: number; ventas: number } {
  const margen = precioVenta - costoVariableUnitario;
  if (margen <= 0) return { cantidad: Infinity, ventas: Infinity };
  const cantidad = costosFijos / margen;
  return { cantidad, ventas: cantidad * precioVenta };
}

/** Portafolio 2 activos: retorno y volatilidad. w1=peso activo 1, r1/s1 y r2/s2 retorno y desv estándar, rho=correlación. */
export function portafolio2(
  w1: number,
  r1: number,
  s1: number,
  r2: number,
  s2: number,
  rho: number
): { retorno: number; volatilidad: number } {
  const w2 = 1 - w1;
  const retorno = w1 * r1 + w2 * r2;
  const varianza = w1 * w1 * s1 * s1 + w2 * w2 * s2 * s2 + 2 * w1 * w2 * s1 * s2 * rho;
  const volatilidad = Math.sqrt(Math.max(0, varianza));
  return { retorno, volatilidad };
}
