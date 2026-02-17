"use client";

import { useMemo, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { ahorroPeriodicoVF, ahorroEvolucion } from "@/lib/finanzas";
import { InputLibre } from "./InputLibre";

export default function SimuladorAhorro() {
  const [aportacion, setAportacion] = useState(2000);
  const [tasaPct, setTasaPct] = useState(10);
  const [anos, setAnos] = useState(10);

  const tasa = tasaPct / 100;
  const anosSeguro = Math.max(0, Math.min(50, anos));
  const totalMeses = Math.floor(anosSeguro * 12);
  const vf = useMemo(() => ahorroPeriodicoVF(aportacion, tasa, anos), [aportacion, tasa, anos]);
  const datosGrafico = useMemo(() => ahorroEvolucion(aportacion, tasa, anosSeguro), [aportacion, tasa, anosSeguro]);
  const totalAportado = aportacion * 12 * anos;

  const vfValido = Number.isFinite(vf) && !Number.isNaN(vf);

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 shadow-lg p-5">
      <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-3">Ahorro mensual e interés compuesto</h3>
      <p className="text-xs text-slate-600 dark:text-slate-400 mb-4">
        Aportación fija al final de cada mes. VF = A × [((1+r)^n − 1) / r]. Ingresa cualquier valor (sin límites).
      </p>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <InputLibre label="Aportación mensual $" value={aportacion} onChange={setAportacion} step="0.01" />
          <InputLibre label="Tasa anual %" value={tasaPct} onChange={setTasaPct} suffix="%" step="0.01" />
          <InputLibre label="Años" value={anos} onChange={setAnos} step="0.1" />
        </div>
        <div className="space-y-3">
          <div className="rounded-xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-900/30 p-4">
            <p className="text-xs font-semibold uppercase text-indigo-600 dark:text-indigo-400">Monto acumulado (VF)</p>
            <p className="text-2xl font-bold font-mono text-slate-900 dark:text-slate-100">
              {vfValido ? `$${vf.toLocaleString("es-MX", { maximumFractionDigits: 0 })}` : "—"}
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/50 p-4">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total aportado</p>
            <p className="text-lg font-mono font-bold text-slate-800 dark:text-slate-200">
              ${totalAportado.toLocaleString("es-MX", { maximumFractionDigits: 0 })}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {vfValido ? `Interés ganado ≈ $${(vf - totalAportado).toLocaleString("es-MX", { maximumFractionDigits: 0 })}` : ""}
            </p>
          </div>
        </div>
      </div>
      {datosGrafico.length > 0 && (
        <div className="mt-4 h-52">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={datosGrafico} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-600" />
              <XAxis dataKey="periodo" name="Mes" tick={{ fontSize: 10 }} tickFormatter={(v) => (v % 12 === 0 ? `${v / 12}a` : "")} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => (v >= 1000 ? `$${v / 1000}k` : `$${v}`)} />
              <Tooltip formatter={(val: number) => [`$${Number(val).toLocaleString("es-MX", { maximumFractionDigits: 0 })}`, "Acumulado"]} labelFormatter={(l) => `Mes ${l}`} />
              <Line type="monotone" dataKey="acumulado" stroke="#6366f1" strokeWidth={2} dot={false} name="Acumulado" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
