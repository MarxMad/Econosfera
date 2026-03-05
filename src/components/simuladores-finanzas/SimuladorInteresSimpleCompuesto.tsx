"use client";

import { useMemo, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { valorFuturo, valorFuturoSimple } from "@/lib/finanzas";

export default function SimuladorInteresSimpleCompuesto() {
  const [monto, setMonto] = useState(10000);
  const [tasaPct, setTasaPct] = useState(8);
  const [anios, setAnios] = useState(10);

  const tasa = tasaPct / 100;
  const datosGrafico = useMemo(() => {
    const out: { ano: number; simple: number; compuesto: number }[] = [];
    for (let n = 0; n <= anios; n++) {
      out.push({
        ano: n,
        simple: Math.round(valorFuturoSimple(monto, tasa, n) * 100) / 100,
        compuesto: Math.round(valorFuturo(monto, tasa, n) * 100) / 100,
      });
    }
    return out;
  }, [monto, tasa, anios]);

  const vfSimple = valorFuturoSimple(monto, tasa, anios);
  const vfCompuesto = valorFuturo(monto, tasa, anios);
  const diferencia = vfCompuesto - vfSimple;

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 shadow-lg p-6">
      <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2">Interés simple vs compuesto</h3>
      <p className="text-xs text-slate-600 dark:text-slate-400 mb-4">
        Simple: VF = VP(1 + r×n). Compuesto: VF = VP(1+r)ⁿ. El interés compuesto genera rendimientos sobre los intereses acumulados.
      </p>
      <div className="grid md:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Monto inicial ($)</label>
          <input
            type="number"
            min="100"
            step="500"
            value={monto}
            onChange={(e) => setMonto(Math.max(100, Number(e.target.value) || 0))}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-mono"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Tasa anual (%)</label>
          <input
            type="number"
            min="0.5"
            max="30"
            step="0.5"
            value={tasaPct}
            onChange={(e) => setTasaPct(Math.max(0, Math.min(30, Number(e.target.value) || 0)))}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-mono"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Años</label>
          <input
            type="number"
            min="1"
            max="50"
            value={anios}
            onChange={(e) => setAnios(Math.max(1, Math.min(50, Number(e.target.value) || 1)))}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-mono"
          />
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Interés simple</p>
          <p className="text-2xl font-black text-slate-900 dark:text-white">${vfSimple.toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        </div>
        <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
          <p className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase mb-1">Interés compuesto</p>
          <p className="text-2xl font-black text-slate-900 dark:text-white">${vfCompuesto.toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        </div>
      </div>
      <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
        Diferencia a favor del compuesto: <strong>${diferencia.toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
      </p>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={datosGrafico} margin={{ top: 8, right: 8, left: 8, bottom: 24 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-600" />
            <XAxis dataKey="ano" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
            <Tooltip formatter={(v: number) => [`$${v.toLocaleString("es-MX", { minimumFractionDigits: 2 })}`, ""]} />
            <Legend />
            <Line type="monotone" dataKey="simple" name="Simple" stroke="#94a3b8" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="compuesto" name="Compuesto" stroke="#3b82f6" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
