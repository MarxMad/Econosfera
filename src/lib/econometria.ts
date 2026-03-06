/**
 * Econometría: MCO múltiple, correlaciones, diagnósticos estilo EViews.
 */

/** Multiplica matriz A (m×n) por B (n×p) → C (m×p) */
function matMul(A: number[][], B: number[][]): number[][] {
  const m = A.length, n = A[0].length, p = B[0].length;
  const C: number[][] = Array.from({ length: m }, () => Array(p).fill(0));
  for (let i = 0; i < m; i++)
    for (let j = 0; j < p; j++)
      for (let k = 0; k < n; k++) C[i][j] += A[i][k] * B[k][j];
  return C;
}

/** Transpone matriz */
function transpose(A: number[][]): number[][] {
  const m = A.length, n = A[0].length;
  const B: number[][] = Array.from({ length: n }, () => Array(m).fill(0));
  for (let i = 0; i < m; i++) for (let j = 0; j < n; j++) B[j][i] = A[i][j];
  return B;
}

/** Inversa de matriz 2×2 o 3×3 o 4×4 (Gauss-Jordan) */
function invert(A: number[][]): number[][] {
  const n = A.length;
  const aug = A.map((row, i) => [...row, ...Array(n).fill(0).map((_, j) => (i === j ? 1 : 0))]);
  for (let col = 0; col < n; col++) {
    let pivot = col;
    for (let r = col + 1; r < n; r++) if (Math.abs(aug[r][col]) > Math.abs(aug[pivot][col])) pivot = r;
    [aug[col], aug[pivot]] = [aug[pivot], aug[col]];
    const div = aug[col][col];
    if (Math.abs(div) < 1e-12) throw new Error("Matriz singular");
    for (let j = 0; j < 2 * n; j++) aug[col][j] /= div;
    for (let r = 0; r < n; r++)
      if (r !== col) {
        const fac = aug[r][col];
        for (let j = 0; j < 2 * n; j++) aug[r][j] -= fac * aug[col][j];
      }
  }
  return aug.map((row) => row.slice(n));
}

export interface ResultadoMCO {
  coeficientes: number[];
  nombres: string[];
  erroresEstandar: number[];
  tStats: number[];
  pValores: number[];
  r2: number;
  r2Ajustado: number;
  src: number; // suma residuos al cuadrado
  sec: number; // suma explicada al cuadrado
  stc: number; // suma total al cuadrado
  n: number;
  k: number;
  fStat: number;
  fPValor: number;
  durbinWatson: number;
  residuos: number[];
  yEstimada: number[];
}

/** MCO múltiple: Y = Xβ + ε. X es array de arrays [x1, x2, ...] (cada xi es columna). Se añade constante. */
export function mcoMultiple(
  Y: number[],
  X: number[][]
): ResultadoMCO {
  const n = Y.length;
  const k = X.length + 1; // +1 por constante
  const Xmat = Array.from({ length: n }, (_, i) => [1, ...X.map((col) => col[i])]);
  const Ycol = Y.map((y) => [y]);
  const Xt = transpose(Xmat);
  const XtX = matMul(Xt, Xmat);
  const XtY = matMul(Xt, Ycol);
  const XtXinv = invert(XtX);
  const beta = matMul(XtXinv, XtY).map((r) => r[0]);

  const yEstimada = Xmat.map((row) => row.reduce((s, v, j) => s + v * beta[j], 0));
  const residuos = Y.map((y, i) => y - yEstimada[i]);
  const yMedia = Y.reduce((a, b) => a + b, 0) / n;
  const stc = Y.reduce((s, y) => s + (y - yMedia) ** 2, 0);
  const src = residuos.reduce((s, e) => s + e * e, 0);
  const sec = stc - src;
  const r2 = stc > 1e-12 ? 1 - src / stc : 0;
  const r2Ajustado = n > k ? 1 - (1 - r2) * (n - 1) / (n - k) : r2;
  const sigma2 = n > k ? src / (n - k) : 0;
  const erroresEstandar = XtXinv.map((row, i) => Math.sqrt(Math.max(0, sigma2 * row[i])));
  const tStats = beta.map((b, i) => (erroresEstandar[i] > 1e-12 ? b / erroresEstandar[i] : 0));
  const pValores = tStats.map((t) => pValorT(Math.abs(t), n - k));

  // F: H0 todos los betas (excepto constante) = 0
  const fStat = k > 1 && src > 1e-12 ? (sec / (k - 1)) / (src / (n - k)) : 0;
  const fPValor = pValorF(fStat, k - 1, n - k);

  // Durbin-Watson
  let dwNum = 0, dwDen = 0;
  for (let i = 1; i < n; i++) dwNum += (residuos[i] - residuos[i - 1]) ** 2;
  for (let i = 0; i < n; i++) dwDen += residuos[i] ** 2;
  const durbinWatson = dwDen > 1e-12 ? dwNum / dwDen : 0;

  const nombres = ["C", ...X.map((_, i) => `X${i + 1}`)];

  return {
    coeficientes: beta,
    nombres,
    erroresEstandar,
    tStats,
    pValores,
    r2,
    r2Ajustado,
    src,
    sec,
    stc,
    n,
    k,
    fStat,
    fPValor,
    durbinWatson,
    residuos,
    yEstimada,
  };
}

/** Aproximación p-valor para t (dos colas) usando aproximación normal para df grande */
function pValorT(t: number, df: number): number {
  if (df <= 0) return 1;
  if (t < 0.1) return 1;
  const z = t;
  const pNorm = 2 * (1 - normalCDF(z));
  if (df > 30) return pNorm;
  const pT = 2 * (1 - tCDF(t, df));
  return Math.min(1, Math.max(0, pT));
}

/** Aproximación CDF normal estándar */
function normalCDF(z: number): number {
  const a1 = 0.254829592, a2 = -0.284496736, a3 = 1.421413741, a4 = -1.453152027, a5 = 1.061405429;
  const p = 0.3275911;
  const t = 1 / (1 + p * Math.abs(z));
  const y = 1 - ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-z * z / 2);
  return z >= 0 ? y : 1 - y;
}

/** Aproximación CDF t de Student (Wilson-Hilferty) */
function tCDF(t: number, df: number): number {
  const x = df / (df + t * t);
  return 1 - 0.5 * incompleteBeta(x, df / 2, 0.5);
}

function incompleteBeta(x: number, a: number, b: number): number {
  if (x <= 0) return 0;
  if (x >= 1) return 1;
  const bt = Math.exp(
    logGamma(a + b) - logGamma(a) - logGamma(b) + a * Math.log(x) + b * Math.log(1 - x)
  );
  if (x < (a + 1) / (a + b + 2)) return (bt * betaContinuedFraction(x, a, b)) / a;
  return 1 - (bt * betaContinuedFraction(1 - x, b, a)) / b;
}

function logGamma(z: number): number {
  if (z < 0.5) return Math.log(Math.PI / Math.sin(Math.PI * z)) - logGamma(1 - z);
  z -= 1;
  let x = 0.99999999999980993;
  const cof = [
    676.5203681218851, -1259.1392167224028, 771.32342877765313, -176.61502916214059,
    12.507343278686905, -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7,
  ];
  for (let i = 0; i < 8; i++) x += cof[i] / (z + i + 1);
  return 0.5 * Math.log(2 * Math.PI) + (z + 0.5) * Math.log(z + 7.5) - (z + 7.5) + Math.log(x);
}

function betaContinuedFraction(x: number, a: number, b: number): number {
  const maxIter = 200;
  let m = 1, aa: number, del: number;
  let qab = a + b, qap = a + 1, qam = a - 1;
  let c = 1, d = 1 - (qab * x) / qap;
  if (Math.abs(d) < 1e-30) d = 1e-30;
  d = 1 / d;
  let h = d;
  for (let i = 1; i <= maxIter; i++) {
    const m2 = 2 * m;
    aa = (m * (b - m) * x) / ((qam + m2) * (a + m2));
    d = 1 + aa * d;
    if (Math.abs(d) < 1e-30) d = 1e-30;
    c = 1 + aa / c;
    if (Math.abs(c) < 1e-30) c = 1e-30;
    d = 1 / d;
    h *= d * c;
    aa = (-(a + m) * (qab + m) * x) / ((a + m2) * (qap + m2));
    d = 1 + aa * d;
    if (Math.abs(d) < 1e-30) d = 1e-30;
    c = 1 + aa / c;
    if (Math.abs(c) < 1e-30) c = 1e-30;
    d = 1 / d;
    del = d * c;
    h *= del;
    if (Math.abs(del - 1) < 3e-7) break;
    m++;
  }
  return h;
}

function pValorF(f: number, df1: number, df2: number): number {
  if (f <= 0 || df2 <= 0) return 1;
  const x = df2 / (df2 + df1 * f);
  return 1 - incompleteBeta(x, df2 / 2, df1 / 2);
}

/** Matriz de correlación de Pearson entre columnas */
export function matrizCorrelacion(datos: number[][]): number[][] {
  const n = datos.length;
  const cols = datos[0]?.length ?? 0;
  const corr: number[][] = Array.from({ length: cols }, () => Array(cols).fill(0));
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < cols; j++) {
      const xi = datos.map((r) => r[i]);
      const xj = datos.map((r) => r[j]);
      const meanI = xi.reduce((a, b) => a + b, 0) / n;
      const meanJ = xj.reduce((a, b) => a + b, 0) / n;
      let num = 0, denI = 0, denJ = 0;
      for (let k = 0; k < n; k++) {
        const di = xi[k] - meanI, dj = xj[k] - meanJ;
        num += di * dj;
        denI += di * di;
        denJ += dj * dj;
      }
      const den = Math.sqrt(denI * denJ);
      corr[i][j] = den > 1e-12 ? num / den : i === j ? 1 : 0;
    }
  }
  return corr;
}

export interface EstadisticasDescriptivas {
  variable: string;
  media: number;
  mediana: number;
  desvEstandar: number;
  varianza: number;
  min: number;
  max: number;
  rango: number;
  n: number;
}

/** Estadísticas descriptivas por columna */
export function estadisticasDescriptivas(datos: number[][], nombres?: string[]): EstadisticasDescriptivas[] {
  const cols = datos[0]?.length ?? 0;
  return Array.from({ length: cols }, (_, c) => {
    const arr = datos.map((r) => r[c]).filter((v) => !Number.isNaN(v));
    const n = arr.length;
    if (n === 0) {
      return { variable: nombres?.[c] ?? `V${c + 1}`, media: 0, mediana: 0, desvEstandar: 0, varianza: 0, min: 0, max: 0, rango: 0, n: 0 };
    }
    const sorted = [...arr].sort((a, b) => a - b);
    const media = arr.reduce((a, b) => a + b, 0) / n;
    const mediana = n % 2 === 1 ? sorted[(n - 1) / 2] : (sorted[n / 2 - 1] + sorted[n / 2]) / 2;
    const varianza = arr.reduce((s, v) => s + (v - media) ** 2, 0) / (n - 1 || 1);
    const desvEstandar = Math.sqrt(varianza);
    const min = sorted[0], max = sorted[n - 1];
    return {
      variable: nombres?.[c] ?? `V${c + 1}`,
      media,
      mediana,
      desvEstandar,
      varianza,
      min,
      max,
      rango: max - min,
      n,
    };
  });
}
