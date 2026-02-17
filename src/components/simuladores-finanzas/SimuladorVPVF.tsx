"use client";

import { useMemo, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { valorFuturo, valorPresente, evolucionVF } from "@/lib/finanzas";
import { InputLibre } from "./InputLibre";

export default function SimuladorVPVF() {
  const [monto, setMonto] = useState(10000);
  const [tasaPct, setTasaPct] = useState(8);
  const [anos, setAnos] = useState(5);

  const tasa = tasaPct / 100;
  const anosSeguro = Math.max(0, Math.min(100, anos));
  const vf = useMemo(() => (anos >= 0 ? valorFuturo(monto, tasa, anos) : monto), [monto, tasa, anos]);
  const vpDe10k = useMemo(() => (anos >= 0 ? valorPresente(10000, tasa, anos) : 10000), [tasa, anos]);
  const datosGrafico = useMemo(() => evolucionVF(monto, tasa, anosSeguro), [monto, tasa, anosSeguro]);

  const vfValido = Number.isFinite(vf) && !Number.isNaN(vf);
  const vpValido = Number.isFinite(vpDe10k) && !Number.isNaN(vpDe10k);

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 shadow-lg p-5">
      <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-3">Valor presente y valor futuro</h3>
      <p className="text-xs text-slate-600 dark:text-slate-400 mb-4">
        VF = VP × (1 + r)ⁿ &nbsp; &nbsp; VP = VF / (1 + r)ⁿ. Ingresa cualquier valor (sin límites).
      </p>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <InputLibre label="Monto inicial (VP) $" value={monto} onChange={setMonto} />
          <InputLibre label="Tasa de interés anual %" value={tasaPct} onChange={setTasaPct} suffix="%" step="0.01" />
          <InputLibre label="Años" value={anos} onChange={setAnos} step="0.1" />
        </div>
        <div className="space-y-3">
          <div className="rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/30 p-4">
            <p className="text-xs font-semibold uppercase text-emerald-600 dark:text-emerald-400">Valor futuro (VF)</p>
            <p className="text-xl font-bold font-mono text-slate-900 dark:text-slate-100">
              {vfValido ? `$${vf.toLocaleString("es-MX", { maximumFractionDigits: 0 })}` : "—"}
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/50 p-4">
            <p className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">VP de $10,000 recibidos en {anos} años</p>
            <p className="text-lg font-bold font-mono text-slate-900 dark:text-slate-100">
              {vpValido ? `$${vpDe10k.toLocaleString("es-MX", { maximumFractionDigits: 2 })}` : "—"}
            </p>
          </div>
        </div>
      </div>
      {datosGrafico.length > 0 && (
        <>
          <div className="mt-4 h-52">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={datosGrafico} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-600" />
                <XAxis dataKey="ano" name="Año" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => (v >= 1000 ? `$${v / 1000}k` : `$${v}`)} />
                <Tooltip formatter={(val: number) => [`$${Number(val).toLocaleString("es-MX", { maximumFractionDigits: 0 })}`, "Valor"]} labelFormatter={(l) => `Año ${l}`} />
                <Line type="monotone" dataKey="valor" stroke="#059669" strokeWidth={2} dot={datosGrafico.length <= 30 ? { r: 2 } : false} name="Valor" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Crecimiento del monto inicial (gráfica hasta {anosSeguro} años).</p>
        </>
      )}
    </div>
  );
}
