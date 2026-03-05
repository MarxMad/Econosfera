"use client";

import { useMemo, useState } from "react";
import { InputLibre } from "../simuladores-finanzas/InputLibre";
import { InstruccionesSimulador } from "../InstruccionesSimulador";
import { depreciacionLineaRecta, depreciacionSumaDigitos, depreciacionUnidadesProduccion } from "@/lib/contabilidad";

export default function SimuladorDepreciacion() {
  const [costo, setCosto] = useState(100000);
  const [valorResidual, setValorResidual] = useState(10000);
  const [vidaUtil, setVidaUtil] = useState(5);
  const [metodo, setMetodo] = useState<"linea" | "suma" | "unidades">("linea");
  const [unidadesTotales, setUnidadesTotales] = useState(100000);
  const [unidadesPeriodo, setUnidadesPeriodo] = useState(20000);

  const { filas, depUnidades } = useMemo(() => {
    if (metodo === "linea") return { filas: depreciacionLineaRecta(costo, valorResidual, vidaUtil), depUnidades: null };
    if (metodo === "suma") return { filas: depreciacionSumaDigitos(costo, valorResidual, vidaUtil), depUnidades: null };
    const d = depreciacionUnidadesProduccion(costo, valorResidual, unidadesTotales, unidadesPeriodo);
    return { filas: [], depUnidades: d };
  }, [costo, valorResidual, vidaUtil, metodo, unidadesTotales, unidadesPeriodo]);

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 shadow-lg p-5">
      <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-3">Depreciación de activos fijos</h3>
      <p className="text-xs text-slate-600 dark:text-slate-400 mb-4">
        Métodos contables: línea recta, suma de dígitos y unidades de producción.
      </p>
      <InstruccionesSimulador>
        <p>Asigna el costo del activo a lo largo de su vida útil. Elige el método según la naturaleza del activo.</p>
        <ul className="list-disc list-inside space-y-1 ml-1">
          <li><strong>Línea recta:</strong> Cuota anual constante. (Costo − Residual) / Vida útil.</li>
          <li><strong>Suma de dígitos:</strong> Mayor depreciación en los primeros años.</li>
          <li><strong>Unidades de producción:</strong> Según uso (km, horas, unidades fabricadas).</li>
        </ul>
      </InstruccionesSimulador>
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="space-y-4">
          <InputLibre label="Costo del activo $" value={costo} onChange={setCosto} step="100" />
          <InputLibre label="Valor residual $" value={valorResidual} onChange={setValorResidual} step="100" />
          <InputLibre label="Vida útil (años)" value={vidaUtil} onChange={setVidaUtil} step="1" />
        </div>
        <div className="space-y-3">
          <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">Método</p>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => setMetodo("linea")} className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${metodo === "linea" ? "bg-emerald-600 text-white" : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600"}`}>
              Línea recta
            </button>
            <button type="button" onClick={() => setMetodo("suma")} className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${metodo === "suma" ? "bg-emerald-600 text-white" : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600"}`}>
              Suma de dígitos
            </button>
            <button type="button" onClick={() => setMetodo("unidades")} className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${metodo === "unidades" ? "bg-emerald-600 text-white" : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600"}`}>
              Unidades producción
            </button>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-600">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {metodo === "linea" ? "Cuota anual constante: (Costo - Residual) / Vida útil" : metodo === "suma" ? "Fracción decreciente: año 1 mayor, año n menor" : "(Costo - Residual) × (Unid. periodo / Unid. totales vida útil)"}
            </p>
          </div>
          {metodo === "unidades" && (
            <div className="flex gap-3">
              <InputLibre label="Unidades totales vida útil" value={unidadesTotales} onChange={setUnidadesTotales} step="100" />
              <InputLibre label="Unidades este periodo" value={unidadesPeriodo} onChange={setUnidadesPeriodo} step="100" />
            </div>
          )}
        </div>
      </div>
      {metodo === "unidades" && depUnidades && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 mb-6">
          <p className="text-xs font-bold text-emerald-600 uppercase mb-1">Depreciación del periodo</p>
          <p className="text-2xl font-black text-slate-900 dark:text-white">${depUnidades.depreciacionPeriodo.toLocaleString("es-MX", { minimumFractionDigits: 2 })}</p>
          <p className="text-xs text-slate-500 mt-1">% de vida útil usada: {depUnidades.porcentajeUsado.toFixed(1)}%</p>
        </div>
      )}

      {metodo !== "unidades" && (
      <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-600">
        <table className="w-full text-sm border-collapse min-w-[360px]">
          <thead className="bg-slate-200/90 dark:bg-slate-800/95">
            <tr>
              <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">Año</th>
              <th className="text-right py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">Dep. anual</th>
              <th className="text-right py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">Dep. acum.</th>
              <th className="text-right py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">Valor en libros</th>
            </tr>
          </thead>
          <tbody>
            {filas.map((f, i) => (
              <tr key={f.periodo} className={`border-t border-slate-200 dark:border-slate-700 ${i % 2 === 0 ? "bg-white/60 dark:bg-slate-800/30" : "bg-slate-50/50 dark:bg-slate-800/50"}`}>
                <td className="py-2.5 px-4 font-mono">{f.periodo}</td>
                <td className="text-right py-2.5 px-4 font-mono tabular-nums">${f.depreciacionAnual.toLocaleString("es-MX", { minimumFractionDigits: 2 })}</td>
                <td className="text-right py-2.5 px-4 font-mono tabular-nums">${f.depreciacionAcumulada.toLocaleString("es-MX", { minimumFractionDigits: 2 })}</td>
                <td className="text-right py-2.5 px-4 font-mono tabular-nums text-slate-600 dark:text-slate-400">${f.valorEnLibros.toLocaleString("es-MX", { minimumFractionDigits: 2 })}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      )}
    </div>
  );
}
