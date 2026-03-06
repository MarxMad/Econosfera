"use client";

import { Scale, TrendingUp, TrendingDown } from "lucide-react";
import { InstruccionesSimulador } from "../InstruccionesSimulador";

const COMPARACION = [
  { concepto: "Tasa de política", restrictiva: "Sube", expansiva: "Baja" },
  { concepto: "Crédito", restrictiva: "Se encarece", expansiva: "Se abarata" },
  { concepto: "Tipo de cambio", restrictiva: "Apreciación", expansiva: "Depreciación" },
  { concepto: "Inflación", restrictiva: "Tiende a bajar", expansiva: "Tiende a subir" },
  { concepto: "Crecimiento", restrictiva: "Se desacelera", expansiva: "Se acelera" },
  { concepto: "Desempleo", restrictiva: "Puede subir", expansiva: "Puede bajar" },
];

export default function SimuladorComparadorPostura() {
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 shadow-lg p-6">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <Scale className="w-5 h-5 text-slate-500" />
          Comparador de postura monetaria
        </h3>
      </div>
      <InstruccionesSimulador>
        <p>Compara los efectos de una política restrictiva vs expansiva. La postura óptima depende de las brechas de inflación y producto.</p>
      </InstruccionesSimulador>

      <div className="grid md:grid-cols-2 gap-6 mt-4">
        <div className="p-4 rounded-xl border-2 border-rose-200 dark:border-rose-800 bg-rose-50 dark:bg-rose-900/20">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-5 h-5 text-rose-600" />
            <h4 className="font-bold text-rose-800 dark:text-rose-200">Restrictiva</h4>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">Subir tasas para enfriar la economía y bajar la inflación.</p>
          <ul className="text-xs space-y-1 text-slate-700 dark:text-slate-300">
            <li>• Sube la tasa de política</li>
            <li>• Menor crédito y demanda</li>
            <li>• Apreciación cambiaria</li>
            <li>• Inflación a la baja</li>
          </ul>
        </div>
        <div className="p-4 rounded-xl border-2 border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20">
          <div className="flex items-center gap-2 mb-3">
            <TrendingDown className="w-5 h-5 text-emerald-600" />
            <h4 className="font-bold text-emerald-800 dark:text-emerald-200">Expansiva</h4>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">Bajar tasas para estimular la economía cuando la inflación está controlada.</p>
          <ul className="text-xs space-y-1 text-slate-700 dark:text-slate-300">
            <li>• Baja la tasa de política</li>
            <li>• Mayor crédito y demanda</li>
            <li>• Depreciación cambiaria</li>
            <li>• Inflación al alza</li>
          </ul>
        </div>
      </div>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-600">
              <th className="text-left py-2 font-bold text-slate-700 dark:text-slate-300">Concepto</th>
              <th className="text-center py-2 font-bold text-rose-600">Restrictiva</th>
              <th className="text-center py-2 font-bold text-emerald-600">Expansiva</th>
            </tr>
          </thead>
          <tbody>
            {COMPARACION.map((r) => (
              <tr key={r.concepto} className="border-b border-slate-100 dark:border-slate-700">
                <td className="py-2 text-slate-700 dark:text-slate-300">{r.concepto}</td>
                <td className="py-2 text-center text-rose-700 dark:text-rose-300">{r.restrictiva}</td>
                <td className="py-2 text-center text-emerald-700 dark:text-emerald-300">{r.expansiva}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 p-4 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-600">
        <p className="text-xs font-bold text-slate-500 uppercase mb-1">Guía rápida (Regla de Taylor)</p>
        <p className="text-sm text-slate-700 dark:text-slate-300">
          Brecha inflación &gt; 0 y producto estable → <span className="font-bold text-rose-600">Restrictiva</span>.
          Brecha inflación &lt; 0 y producto débil → <span className="font-bold text-emerald-600">Expansiva</span>.
        </p>
      </div>
    </div>
  );
}
