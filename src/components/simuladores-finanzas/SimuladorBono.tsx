"use client";

import { useMemo, useState } from "react";
import { precioBono } from "@/lib/finanzas";
import { InputLibre } from "./InputLibre";

export default function SimuladorBono() {
  const [nominal, setNominal] = useState(100);
  const [cuponPct, setCuponPct] = useState(6);
  const [ytmPct, setYtmPct] = useState(7);
  const [anos, setAnos] = useState(5);

  const { precio, flujos } = useMemo(() => {
    const n = Math.max(0, Math.floor(anos));
    if (n === 0) return { precio: nominal, flujos: [] };
    return precioBono(nominal, cuponPct / 100, ytmPct / 100, n);
  }, [nominal, cuponPct, ytmPct, anos]);

  const sobrePar = precio > nominal;
  const bajoPar = precio < nominal;
  const precioValido = Number.isFinite(precio) && !Number.isNaN(precio);

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 shadow-lg p-5">
      <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-3">Precio de un bono (valoración)</h3>
      <p className="text-xs text-slate-600 dark:text-slate-400 mb-4">
        Precio = suma del valor presente de los cupones + VP del principal. Ingresa cualquier valor (sin límites).
      </p>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <InputLibre label="Valor nominal $" value={nominal} onChange={setNominal} step="0.01" />
          <InputLibre label="Tasa cupón %" value={cuponPct} onChange={setCuponPct} suffix="%" step="0.01" />
          <InputLibre label="YTM (rendimiento) %" value={ytmPct} onChange={setYtmPct} suffix="%" step="0.01" />
          <InputLibre label="Años al vencimiento" value={anos} onChange={setAnos} step="0.1" />
        </div>
        <div className="space-y-3">
          <div className={`rounded-xl border p-4 ${sobrePar ? "border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/30" : bajoPar ? "border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/30" : "border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/50"}`}>
            <p className="text-xs font-semibold uppercase text-slate-600 dark:text-slate-400">Precio teórico del bono</p>
            <p className="text-2xl font-bold font-mono text-slate-900 dark:text-slate-100">
              {precioValido ? `$${precio.toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "—"}
            </p>
            <p className="text-xs mt-1 text-slate-500 dark:text-slate-400">
              {precioValido && (sobrePar ? "Sobre la par (cupón &gt; YTM)" : bajoPar ? "Bajo la par (cupón &lt; YTM)" : "A la par (cupón = YTM)")}
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/50 p-3">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Cupón anual</p>
            <p className="text-lg font-mono font-bold text-slate-800 dark:text-slate-200">
              ${(nominal * (cuponPct / 100)).toLocaleString("es-MX", { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>
      </div>
      {flujos.length > 0 && (
        <div className="mt-4 overflow-x-auto">
          <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">Flujos y valor presente por periodo</p>
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-600">
                <th className="text-left py-1.5 px-2 text-slate-600 dark:text-slate-400">Año</th>
                <th className="text-right py-1.5 px-2 text-slate-600 dark:text-slate-400">Cupón</th>
                <th className="text-right py-1.5 px-2 text-slate-600 dark:text-slate-400">Principal</th>
                <th className="text-right py-1.5 px-2 text-slate-600 dark:text-slate-400">VP</th>
              </tr>
            </thead>
            <tbody>
              {flujos.map((f) => (
                <tr key={f.periodo} className="border-b border-slate-100 dark:border-slate-700/50">
                  <td className="py-1 px-2 font-mono">{f.periodo}</td>
                  <td className="text-right font-mono">${f.cupon.toFixed(2)}</td>
                  <td className="text-right font-mono">{f.principal > 0 ? `$${f.principal.toFixed(2)}` : "—"}</td>
                  <td className="text-right font-mono text-slate-700 dark:text-slate-300">${f.vp.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
