"use client";

import { useMemo, useState } from "react";
import { cetesPrecio, cetesRendimiento } from "@/lib/finanzas";
import { InputLibre } from "./InputLibre";

const PLAZOS_RAPIDOS = [28, 91, 182, 364];

export default function SimuladorCetes() {
  const [valorNominal, setValorNominal] = useState(10);
  const [tasaPct, setTasaPct] = useState(11);
  const [plazoDias, setPlazoDias] = useState(91);

  const tasa = tasaPct / 100;
  const precio = useMemo(() => {
    if (plazoDias <= 0) return valorNominal;
    return cetesPrecio(valorNominal, tasa, plazoDias);
  }, [valorNominal, tasa, plazoDias]);

  const todosPlazos = useMemo(() => {
    const plazos = Array.from(new Set([...PLAZOS_RAPIDOS, plazoDias].filter((d) => d > 0))).sort((a, b) => a - b);
    return plazos.slice(0, 8).map((dias) => ({
      dias,
      precio: cetesPrecio(valorNominal, tasa, dias),
      rendimiento: (cetesRendimiento(valorNominal, cetesPrecio(valorNominal, tasa, dias), dias) * 100).toFixed(2),
    }));
  }, [valorNominal, tasa, plazoDias]);

  const precioValido = Number.isFinite(precio) && precio > 0;

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 shadow-lg p-5">
      <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-3">Cetes: precio y rendimiento</h3>
      <p className="text-xs text-slate-600 dark:text-slate-400 mb-4">
        Los Cetes se colocan al descuento. Precio = Valor nominal / (1 + r × días/360). Ingresa cualquier valor nominal, tasa o plazo (días).
      </p>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <InputLibre label="Valor nominal $" value={valorNominal} onChange={setValorNominal} step="0.01" />
          <InputLibre label="Tasa de rendimiento anual %" value={tasaPct} onChange={setTasaPct} suffix="%" step="0.01" />
          <div className="space-y-1">
            <InputLibre label="Plazo (días)" value={plazoDias} onChange={setPlazoDias} step="1" />
            <div className="flex gap-2 flex-wrap pt-1">
              {PLAZOS_RAPIDOS.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setPlazoDias(d)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    plazoDias === d
                      ? "bg-teal-600 text-white"
                      : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600"
                  }`}
                >
                  {d} días
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="space-y-3">
          <div className="rounded-xl border border-teal-200 dark:border-teal-800 bg-teal-50 dark:bg-teal-900/30 p-4">
            <p className="text-xs font-semibold uppercase text-teal-600 dark:text-teal-400">Precio por Cete (valor nominal ${valorNominal})</p>
            <p className="text-2xl font-bold font-mono text-slate-900 dark:text-slate-100">
              {precioValido ? `$${precio.toLocaleString("es-MX", { minimumFractionDigits: 4, maximumFractionDigits: 4 })}` : "—"}
            </p>
            <p className="text-xs mt-1 text-slate-500 dark:text-slate-400">Al vencimiento recibes ${valorNominal}. Ganancia = ${valorNominal} − precio.</p>
          </div>
        </div>
      </div>
      {todosPlazos.length > 0 && (
        <div className="mt-4 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/50 p-4">
          <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">Precio por plazo (misma tasa)</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {todosPlazos.map(({ dias, precio: p, rendimiento }) => (
              <div key={dias} className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600">
                <p className="text-xs text-slate-500 dark:text-slate-400">{dias} días</p>
                <p className="font-mono font-bold text-slate-800 dark:text-slate-200">${Number(p).toFixed(4)}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Rend. {rendimiento}%</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
