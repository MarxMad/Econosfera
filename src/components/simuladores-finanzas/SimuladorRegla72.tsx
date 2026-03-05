"use client";

import { useMemo, useState } from "react";
import { HelpCircle } from "lucide-react";
import { regla72 } from "@/lib/finanzas";
import { InstruccionesSimulador, LabelConAyuda } from "../InstruccionesSimulador";

export default function SimuladorRegla72() {
  const [tasaPct, setTasaPct] = useState(8);

  const aniosDuplicar = useMemo(() => regla72(tasaPct), [tasaPct]);
  const tabla = useMemo(() => {
    return [4, 6, 8, 10, 12, 15, 20].map((t) => ({
      tasa: t,
      anios: regla72(t),
    }));
  }, []);

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 shadow-lg p-6">
      <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2">Regla del 72</h3>
      <p className="text-xs text-slate-600 dark:text-slate-400 mb-4">
        Años aproximados para duplicar tu dinero: <strong>72 ÷ tasa anual (%)</strong>. Útil para estimar rápido el efecto del interés compuesto.
      </p>
      <InstruccionesSimulador>
        <p>La regla del 72 es una aproximación rápida: divide 72 entre tu tasa de rendimiento anual para saber en cuántos años duplicarás tu capital.</p>
        <ul className="list-disc list-inside space-y-1 ml-1">
          <li><strong>Tasa anual:</strong> Tu rendimiento esperado (ej. 8% → 72/8 ≈ 9 años para duplicar).</li>
          <li>Ejemplos: 6% → 12 años | 10% → 7.2 años | 12% → 6 años.</li>
        </ul>
      </InstruccionesSimulador>
      <div className="mb-6">
        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">
          <LabelConAyuda label="Tasa anual (%)" tooltip="Rendimiento anual esperado. A mayor tasa, menos años para duplicar." />
        </label>
        <input
          type="range"
          min="1"
          max="25"
          step="0.5"
          value={tasaPct}
          onChange={(e) => setTasaPct(Number(e.target.value))}
          className="w-full mb-2"
        />
        <div className="flex justify-between text-sm text-slate-500">
          <span>1%</span>
          <span className="font-bold text-slate-900 dark:text-white">{tasaPct}%</span>
          <span>25%</span>
        </div>
      </div>
      <div className="p-6 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-center">
        <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase mb-1 flex items-center justify-center gap-1">
          Años para duplicar
          <span title="Aproximación: 72 ÷ tasa. No es exacto pero muy útil para estimaciones rápidas." className="cursor-help">
            <HelpCircle className="w-3.5 h-3.5 text-emerald-500" />
          </span>
        </p>
        <p className="text-4xl font-black text-slate-900 dark:text-white">{aniosDuplicar.toFixed(1)} años</p>
      </div>
      <div className="mt-6">
        <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">Referencia rápida</p>
        <div className="flex flex-wrap gap-2">
          {tabla.map(({ tasa, anios }) => (
            <div
              key={tasa}
              className="px-3 py-2 rounded-xl text-sm font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
            >
              {tasa}% → {anios} años
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
