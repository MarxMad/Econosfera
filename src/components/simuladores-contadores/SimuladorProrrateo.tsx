"use client";

import { useMemo, useState } from "react";
import { InputLibre } from "../simuladores-finanzas/InputLibre";
import { InstruccionesSimulador } from "../InstruccionesSimulador";
import { prorrateoGastos } from "@/lib/contabilidad";

export default function SimuladorProrrateo() {
  const [costoTotal, setCostoTotal] = useState(10000);
  const [bases, setBases] = useState([500, 300, 200]);
  const [nombres, setNombres] = useState(["Producción A", "Producción B", "Producción C"]);

  const { asignado, porcentaje } = useMemo(() => prorrateoGastos(costoTotal, bases), [costoTotal, bases]);

  const totalBase = bases.reduce((s, b) => s + b, 0);
  const fmt = (n: number) => n.toLocaleString("es-MX", { minimumFractionDigits: 2 });

  const agregarDepto = () => {
    setBases([...bases, 100]);
    setNombres([...nombres, `Depto ${nombres.length + 1}`]);
  };

  const quitarDepto = (i: number) => {
    if (bases.length <= 2) return;
    setBases(bases.filter((_, j) => j !== i));
    setNombres(nombres.filter((_, j) => j !== i));
  };

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 shadow-lg p-5">
      <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-3">Prorrateo de gastos indirectos</h3>
      <p className="text-xs text-slate-600 dark:text-slate-400 mb-4">
        Distribuye costos indirectos entre departamentos o productos según una base (horas, unidades, etc.).
      </p>

      <InstruccionesSimulador>
        <p>Asigna costos indirectos (renta, luz, supervisión) a cada departamento o producto según su participación en la base.</p>
        <ul className="list-disc list-inside space-y-1 ml-1">
          <li><strong>Costo total:</strong> Costo indirecto a distribuir (ej. renta $10,000).</li>
          <li><strong>Base:</strong> Horas de mano de obra, unidades producidas, metros cuadrados, etc. por departamento.</li>
          <li>Asignado = (Base del depto / Total bases) × Costo total.</li>
        </ul>
      </InstruccionesSimulador>

      <div className="mb-6">
        <InputLibre label="Costo total a prorratear $" value={costoTotal} onChange={setCostoTotal} step="100" tooltip="Costo indirecto a distribuir entre departamentos." />
      </div>

      <div className="space-y-3 mb-6">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Departamentos / bases</p>
          <button
            type="button"
            onClick={agregarDepto}
            className="text-xs font-bold text-teal-600 hover:text-teal-500"
          >
            + Agregar
          </button>
        </div>
        {bases.map((base, i) => (
          <div key={i} className="flex gap-3 items-end">
            <div className="flex-1">
              <label className="block text-sm text-slate-600 dark:text-slate-400 mb-1">Nombre</label>
              <input
                type="text"
                value={nombres[i] ?? ""}
                onChange={(e) => {
                  const n = [...nombres];
                  n[i] = e.target.value;
                  setNombres(n);
                }}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                placeholder="Depto 1"
              />
            </div>
            <div className="w-28">
              <InputLibre label="Base" value={base} onChange={(v) => {
                const b = [...bases];
                b[i] = v;
                setBases(b);
              }} step="1" tooltip="Horas, unidades, m², etc." />
            </div>
            {bases.length > 2 && (
              <button type="button" onClick={() => quitarDepto(i)} className="text-red-500 hover:text-red-400 text-sm p-2">
                ✕
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-600">
        <table className="w-full text-sm border-collapse min-w-[360px]">
          <thead className="bg-slate-200/90 dark:bg-slate-800/95">
            <tr>
              <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">Departamento</th>
              <th className="text-right py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">Base</th>
              <th className="text-right py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">%</th>
              <th className="text-right py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">Asignado</th>
            </tr>
          </thead>
          <tbody>
            {asignado.map((a, i) => (
              <tr key={i} className={`border-t border-slate-200 dark:border-slate-700 ${i % 2 === 0 ? "bg-white/60" : "bg-slate-50/50 dark:bg-slate-800/30"}`}>
                <td className="py-2.5 px-4">{nombres[i] ?? `Depto ${i + 1}`}</td>
                <td className="text-right py-2.5 px-4 font-mono">{bases[i]}</td>
                <td className="text-right py-2.5 px-4 font-mono">{porcentaje[i].toFixed(1)}%</td>
                <td className="text-right py-2.5 px-4 font-mono font-bold">${fmt(a)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-slate-100 dark:bg-slate-800/80 border-t-2 border-slate-300 dark:border-slate-600">
            <tr>
              <td className="py-2.5 px-4 font-bold">Total</td>
              <td className="text-right py-2.5 px-4 font-mono font-bold">{totalBase}</td>
              <td className="text-right py-2.5 px-4 font-mono font-bold">100%</td>
              <td className="text-right py-2.5 px-4 font-mono font-bold">${fmt(asignado.reduce((s, a) => s + a, 0))}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
