"use client";

import { useState } from "react";
import { Calculator } from "lucide-react";
import { FORMULAS } from "@/lib/formulas";
import { FormulaDisplay, formulaATexto } from "@/lib/formatoFormula";
import type { ModuloSimulador } from "./NavSimuladores";

interface FormulasProps {
  moduloActivo?: ModuloSimulador;
  onIrAModulo?: (modulo: ModuloSimulador) => void;
}

function toModuloFormula(m: ModuloSimulador | undefined): "inflacion" | "macro" | "micro" | "todos" {
  if (m === "inflacion" || m === "macro" || m === "micro") return m;
  return "todos";
}

export default function Formulas({ moduloActivo, onIrAModulo }: FormulasProps) {
  const [moduloSeleccionado, setModuloSeleccionado] = useState<"inflacion" | "macro" | "micro" | "todos">(
    toModuloFormula(moduloActivo)
  );

  const modulosMostrar = moduloSeleccionado === "todos" ? FORMULAS : FORMULAS.filter((m) => m.modulo === moduloSeleccionado);

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-slate-900 dark:to-slate-900 p-8 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 text-purple-500">
          <Calculator className="w-24 h-24" />
        </div>
        <div className="relative z-10">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-3 flex items-center gap-3">
            <Calculator className="text-purple-500 w-8 h-8" />
            Fórmulas económicas
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm max-w-2xl italic mb-6">
            Colección de las ecuaciones más importantes utilizadas en economía y finanzas.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 p-1 bg-slate-200 dark:bg-slate-800/50 rounded-2xl w-fit">
        {[
          { id: "todos" as const, label: "Todas" },
          { id: "inflacion" as const, label: "Inflación" },
          { id: "macro" as const, label: "Macro" },
          { id: "micro" as const, label: "Micro" },
        ].map((mod) => (
          <button
            key={mod.id}
            type="button"
            onClick={() => setModuloSeleccionado(mod.id)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${moduloSeleccionado === mod.id
                ? "bg-purple-600 text-white shadow"
                : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"
              }`}
          >
            {mod.label}
          </button>
        ))}
      </div>

      <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl max-h-[600px] overflow-y-auto">
        {modulosMostrar.map((modulo) => (
          <div key={modulo.modulo} className="mb-6 last:mb-0">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
              {modulo.titulo}
              {onIrAModulo && modulo.modulo !== moduloActivo && (
                <button
                  type="button"
                  onClick={() => onIrAModulo(modulo.modulo)}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Ir al simulador →
                </button>
              )}
            </h3>
            <div className="space-y-5">
              {modulo.formulas.map((formula, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-800/40 shadow-sm hover:shadow-md transition-shadow"
                >
                  <h4 className="font-bold text-slate-800 dark:text-slate-100 mb-2 text-lg">{formula.nombre}</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">{formula.descripcion}</p>
                  <div className="mb-4">
                    <FormulaDisplay formula={formula.formula} />
                  </div>
                  {formula.variables.length > 0 && (
                    <div className="mb-3 p-3 rounded-xl bg-white/60 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-600">
                      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider">Variables</p>
                      <ul className="space-y-1.5 text-sm text-slate-600 dark:text-slate-400">
                        {formula.variables.map((v, vIdx) => (
                          <li key={vIdx} className="flex gap-2 items-baseline">
                            <span className="font-mono text-slate-800 dark:text-slate-200 font-medium min-w-[6rem]">{formulaATexto(v.simbolo)}</span>
                            <span>{v.descripcion}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {formula.ejemplo && (
                    <p className="text-sm text-slate-500 dark:text-slate-400 italic pl-1 border-l-2 border-amber-300 dark:border-amber-600">
                      <strong className="text-slate-600 dark:text-slate-300 not-italic">Ejemplo:</strong> {formula.ejemplo}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
