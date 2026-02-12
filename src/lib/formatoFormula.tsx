/**
 * Muestra fórmulas con símbolos matemáticos en formato bonito.
 * Reemplazos: π, α, β, ε, ×, subíndices y fracciones básicas.
 */

import React from "react";

const REEMPLAZOS: [RegExp | string, string][] = [
  ["\\pi^*", "π*"],
  ["\\pi_e", "πₑ"],
  ["\\pi", "π"],
  ["\\alpha", "α"],
  ["\\beta", "β"],
  ["\\varepsilon", "ε"],
  ["\\times", "×"],
  ["\\cdot", "·"],
  ["\\Delta", "Δ"],
];

/** Convierte notación tipo LaTeX a texto con Unicode para mostrar */
export function formulaATexto(formula: string): string {
  let s = formula;
  for (const [buscar, reemplazar] of REEMPLAZOS) {
    s = s.split(buscar).join(reemplazar);
  }
  // Subíndices _{ex-post} → _ex-post para que se lea bien
  s = s.replace(/\_{([^}]+)}/g, "_$1");
  // Superíndice ^{*} → *
  s = s.replace(/\^{*}/g, "*");
  // \frac{a}{b} → (a)/(b); varias pasadas por si hay fracciones anidadas
  for (let i = 0; i < 4; i++) {
    const prev = s;
    s = s.replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, "($1)/($2)");
    if (s === prev) break;
  }
  return s;
}

/** Caja con la fórmula centrada y tipografía elegante */
export function FormulaDisplay({ formula, className = "" }: { formula: string; className?: string }) {
  const texto = formulaATexto(formula);
  return (
    <div
      className={`font-serif text-xl sm:text-2xl text-slate-800 dark:text-slate-100 text-center py-5 px-6 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 border border-slate-200 dark:border-slate-600 shadow-sm ${className}`}
      style={{ fontVariantNumeric: "tabular-nums" }}
    >
      <span className="tracking-tight">{texto}</span>
    </div>
  );
}
