"use client";

import { useMemo, useState } from "react";
import { HelpCircle } from "lucide-react";
import { tasaEfectivaAnual } from "@/lib/finanzas";
import { InstruccionesSimulador, LabelConAyuda } from "../InstruccionesSimulador";

const CAPITALIZACIONES = [
  { id: 1, label: "Anual" },
  { id: 2, label: "Semestral" },
  { id: 4, label: "Trimestral" },
  { id: 12, label: "Mensual" },
  { id: 365, label: "Diaria" },
];

export default function SimuladorTasaEfectiva() {
  const [tasaNominalPct, setTasaNominalPct] = useState(10);
  const [capitalizaciones, setCapitalizaciones] = useState(12);

  const tasaNominal = tasaNominalPct / 100;
  const tasaEfectiva = useMemo(() => tasaEfectivaAnual(tasaNominal, capitalizaciones), [tasaNominal, capitalizaciones]);
  const tasaEfectivaPct = tasaEfectiva * 100;

  const comparativa = useMemo(() => {
    return CAPITALIZACIONES.map((c) => ({
      label: c.label,
      n: c.id,
      efectiva: (tasaEfectivaAnual(tasaNominal, c.id) * 100).toFixed(2),
    }));
  }, [tasaNominal]);

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 shadow-lg p-6">
      <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2">Tasa nominal vs efectiva</h3>
      <p className="text-xs text-slate-600 dark:text-slate-400 mb-4">
        Tasa efectiva anual: (1 + i/n)ⁿ − 1. Cuanto más frecuente la capitalización, mayor la tasa efectiva para una misma nominal.
      </p>
      <InstruccionesSimulador>
        <p>Convierte una tasa nominal (la que anuncia el banco) a tasa efectiva anual (lo que realmente ganas o pagas).</p>
        <ul className="list-disc list-inside space-y-1 ml-1">
          <li><strong>Nominal:</strong> Tasa anunciada (ej. 10% anual capitalizable mensualmente).</li>
          <li><strong>Capitalizaciones:</strong> Cuántas veces al año se aplica el interés (mensual=12, trimestral=4).</li>
          <li>Más capitalizaciones = mayor tasa efectiva para la misma nominal.</li>
        </ul>
      </InstruccionesSimulador>
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">
            <LabelConAyuda label="Tasa nominal anual (%)" tooltip="La tasa que anuncia la institución. No incluye el efecto de la capitalización." />
          </label>
          <input
            type="number"
            min="0"
            max="50"
            step="0.5"
            value={tasaNominalPct}
            onChange={(e) => setTasaNominalPct(Math.max(0, Math.min(50, Number(e.target.value) || 0)))}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-mono font-bold text-lg"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">
            <LabelConAyuda label="Capitalizaciones por año" tooltip="Frecuencia con que se aplica el interés: Anual=1, Semestral=2, Trimestral=4, Mensual=12, Diaria=365." />
          </label>
          <select
            value={capitalizaciones}
            onChange={(e) => setCapitalizaciones(Number(e.target.value))}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-mono"
          >
            {CAPITALIZACIONES.map((c) => (
              <option key={c.id} value={c.id}>{c.label}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="p-6 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800">
        <p className="text-xs font-bold text-indigo-700 dark:text-indigo-400 uppercase mb-1 flex items-center gap-1">
          Tasa efectiva anual
          <span title="Lo que realmente ganas o pagas al año, considerando la capitalización." className="cursor-help">
            <HelpCircle className="w-3.5 h-3.5 text-indigo-400" />
          </span>
        </p>
        <p className="text-3xl font-black text-slate-900 dark:text-white">{tasaEfectivaPct.toFixed(2)}%</p>
      </div>
      <div className="mt-6">
        <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">Comparativa por frecuencia</p>
        <div className="space-y-2">
          {comparativa.map((f) => (
            <div key={f.n} className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-700 last:border-0">
              <span className="text-sm text-slate-600 dark:text-slate-400">{f.label}</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white">{f.efectiva}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
