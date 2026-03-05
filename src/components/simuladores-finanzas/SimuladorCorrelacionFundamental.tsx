"use client";

import { useMemo, useState } from "react";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ZAxis, LineChart, Line } from "recharts";
import { correlacionPearson, serieFundamental, seriePrecioCorrelacionada } from "@/lib/finanzas";

export default function SimuladorCorrelacionFundamental() {
  const [baseFundamental, setBaseFundamental] = useState(100);
  const [crecimientoPct, setCrecimientoPct] = useState(8);
  const [ruidoFundamental, setRuidoFundamental] = useState(5);
  const [precioBase, setPrecioBase] = useState(50);
  const [correlacion, setCorrelacion] = useState(0.7);
  const [ruidoPrecio, setRuidoPrecio] = useState(10);
  const [periodos, setPeriodos] = useState(24);

  const { fundamental, precios, r, datosScatter, datosSerie } = useMemo(() => {
    const f = serieFundamental(baseFundamental, crecimientoPct, ruidoFundamental, periodos);
    const p = seriePrecioCorrelacionada(f, precioBase, correlacion, ruidoPrecio);
    const r = correlacionPearson(f, p);
    const datosScatter = f.map((fund, i) => ({ fundamental: Math.round(fund * 100) / 100, precio: Math.round(p[i] * 100) / 100 }));
    const fMin = Math.min(...f), fMax = Math.max(...f), fR = fMax - fMin || 1;
    const pMin = Math.min(...p), pMax = Math.max(...p), pR = pMax - pMin || 1;
    const datosSerie = f.map((fund, i) => ({
      periodo: i + 1,
      fundamental: Math.round(fund * 100) / 100,
      precio: Math.round(p[i] * 100) / 100,
      fundamentalNorm: ((fund - fMin) / fR) * 100,
      precioNorm: ((p[i] - pMin) / pR) * 100,
    }));
    return { fundamental: f, precios: p, r, datosScatter, datosSerie };
  }, [baseFundamental, crecimientoPct, ruidoFundamental, precioBase, correlacion, ruidoPrecio, periodos]);

  const interpretacion =
    r >= 0.8
      ? "Correlación muy fuerte. El precio sigue de cerca al fundamental."
      : r >= 0.5
        ? "Correlación moderada. El precio refleja parcialmente el fundamental."
        : r >= 0.2
          ? "Correlación débil. Otros factores influyen más."
          : "Correlación muy baja o nula. El precio no parece seguir al fundamental.";

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 shadow-lg p-6">
      <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2">Correlación fundamental–precio</h3>
      <p className="text-xs text-slate-600 dark:text-slate-400 mb-4">
        Genera una serie de fundamental (ej. utilidades) y otra de precios. Observa si el precio &quot;sigue&quot; al fundamental según la correlación.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div>
          <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Base fundamental</label>
          <input
            type="number"
            min="10"
            value={baseFundamental}
            onChange={(e) => setBaseFundamental(Math.max(10, Number(e.target.value) || 0))}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-mono text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Crecimiento % anual</label>
          <input
            type="number"
            min="-20"
            max="50"
            step="1"
            value={crecimientoPct}
            onChange={(e) => setCrecimientoPct(Number(e.target.value) || 0)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-mono text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Ruido fundamental %</label>
          <input
            type="number"
            min="0"
            max="30"
            step="1"
            value={ruidoFundamental}
            onChange={(e) => setRuidoFundamental(Math.max(0, Math.min(30, Number(e.target.value) || 0)))}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-mono text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Precio base</label>
          <input
            type="number"
            min="1"
            value={precioBase}
            onChange={(e) => setPrecioBase(Math.max(1, Number(e.target.value) || 0))}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-mono text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Correlación (0–1)</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={correlacion}
            onChange={(e) => setCorrelacion(Number(e.target.value))}
            className="w-full"
          />
          <p className="text-xs text-slate-500 mt-0.5">{correlacion.toFixed(2)}</p>
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Ruido precio %</label>
          <input
            type="number"
            min="0"
            max="30"
            step="1"
            value={ruidoPrecio}
            onChange={(e) => setRuidoPrecio(Math.max(0, Math.min(30, Number(e.target.value) || 0)))}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-mono text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Periodos</label>
          <input
            type="number"
            min="6"
            max="60"
            value={periodos}
            onChange={(e) => setPeriodos(Math.max(6, Math.min(60, Number(e.target.value) || 6)))}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-mono text-sm"
          />
        </div>
      </div>

      <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 mb-6">
        <p className="text-xs font-bold text-indigo-700 dark:text-indigo-400 uppercase mb-1">Coeficiente de correlación de Pearson</p>
        <p className="text-3xl font-black text-slate-900 dark:text-white">{r.toFixed(3)}</p>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">{interpretacion}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">Dispersión: fundamental vs precio</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 8, right: 8, left: 8, bottom: 24 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-600" />
                <XAxis type="number" dataKey="fundamental" name="Fundamental" tick={{ fontSize: 10 }} />
                <YAxis type="number" dataKey="precio" name="Precio" tick={{ fontSize: 10 }} />
                <ZAxis range={[50, 200]} />
                <Tooltip cursor={{ strokeDasharray: "3 3" }} formatter={(v: number) => [`${v.toFixed(2)}`, ""]} />
                <Scatter data={datosScatter} fill="#3b82f6" fillOpacity={0.6} />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div>
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">Evolución (normalizado 0–100)</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={datosSerie} margin={{ top: 8, right: 8, left: 8, bottom: 24 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-600" />
                <XAxis dataKey="periodo" tick={{ fontSize: 10 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
                <Tooltip formatter={(v: number) => [v.toFixed(1), ""]} />
                <Line type="monotone" dataKey="fundamentalNorm" name="Fundamental" stroke="#94a3b8" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="precioNorm" name="Precio" stroke="#3b82f6" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
