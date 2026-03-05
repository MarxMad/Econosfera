"use client";

import { useMemo, useState } from "react";
import { Newspaper, TrendingUp, TrendingDown, Info } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { impactoNoticias } from "@/lib/finanzas";

const TIPOS_EVENTO = [
  { id: "earnings", label: "Earnings (EPS)", unidad: "USD", ejExpectativa: 2.5, ejReal: 2.8 },
  { id: "pib", label: "PIB", unidad: "%", ejExpectativa: 2.5, ejReal: 3.2 },
  { id: "inflacion", label: "Inflación", unidad: "%", ejExpectativa: 4.0, ejReal: 4.5 },
  { id: "tasa", label: "Tasa de interés", unidad: "%", ejExpectativa: 5.25, ejReal: 5.5 },
] as const;

export default function SimuladorImpactoNoticias() {
  const [tipoEvento, setTipoEvento] = useState<(typeof TIPOS_EVENTO)[number]["id"]>("earnings");
  const [precioAnterior, setPrecioAnterior] = useState(100);
  const [expectativa, setExpectativa] = useState(2.5);
  const [resultadoReal, setResultadoReal] = useState(2.8);
  const [sensibilidad, setSensibilidad] = useState(3);

  const tipo = TIPOS_EVENTO.find((t) => t.id === tipoEvento)!;
  const { surprise, impactoPct, precioNuevo } = useMemo(
    () => impactoNoticias(precioAnterior, expectativa, resultadoReal, sensibilidad),
    [precioAnterior, expectativa, resultadoReal, sensibilidad]
  );

  const datosGrafico = useMemo(
    () => [
      { name: "Expectativa", valor: expectativa, fill: "#94a3b8" },
      { name: "Resultado", valor: resultadoReal, fill: surprise >= 0 ? "#22c55e" : "#ef4444" },
    ],
    [expectativa, resultadoReal, surprise]
  );

  const esPositivo = surprise >= 0;

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 shadow-lg p-6">
      <div className="flex items-center gap-2 mb-2">
        <Newspaper className="w-5 h-5 text-amber-500" />
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Impacto de noticias en el precio</h3>
      </div>
      <p className="text-xs text-slate-600 dark:text-slate-400 mb-4">
        El mercado reacciona a la <strong>sorpresa</strong> (resultado real − expectativa). Un beat genera impacto positivo; un miss, negativo.
      </p>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">Tipo de evento</label>
          <select
            value={tipoEvento}
            onChange={(e) => {
              const id = e.target.value as typeof tipoEvento;
              const t = TIPOS_EVENTO.find((x) => x.id === id)!;
              setTipoEvento(id);
              setExpectativa(t.ejExpectativa);
              setResultadoReal(t.ejReal);
            }}
            className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
          >
            {TIPOS_EVENTO.map((t) => (
              <option key={t.id} value={t.id}>{t.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">Precio anterior del activo ($)</label>
          <input
            type="number"
            min="1"
            value={precioAnterior}
            onChange={(e) => setPrecioAnterior(Math.max(1, Number(e.target.value) || 0))}
            className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-mono"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Expectativa del mercado ({tipo.unidad})</label>
          <input
            type="number"
            step="0.1"
            value={expectativa}
            onChange={(e) => setExpectativa(Number(e.target.value) || 0)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-mono"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Resultado real ({tipo.unidad})</label>
          <input
            type="number"
            step="0.1"
            value={resultadoReal}
            onChange={(e) => setResultadoReal(Number(e.target.value) || 0)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-mono"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Sensibilidad (% por unidad surprise)</label>
          <input
            type="number"
            min="0.5"
            max="20"
            step="0.5"
            value={sensibilidad}
            onChange={(e) => setSensibilidad(Math.max(0, Math.min(20, Number(e.target.value) || 0)))}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-mono"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Surprise (resultado − expectativa)</p>
          <p className={`text-2xl font-black flex items-center gap-2 ${esPositivo ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>
            {esPositivo ? <TrendingUp className="w-6 h-6" /> : <TrendingDown className="w-6 h-6" />}
            {surprise >= 0 ? "+" : ""}{surprise.toFixed(2)} {tipo.unidad}
          </p>
        </div>
        <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800">
          <p className="text-xs font-bold text-indigo-700 dark:text-indigo-400 uppercase mb-1">Impacto estimado en precio</p>
          <p className={`text-2xl font-black ${impactoPct >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>
            {impactoPct >= 0 ? "+" : ""}{impactoPct.toFixed(2)}%
          </p>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 mb-6">
        <p className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase mb-1">Precio estimado después de la noticia</p>
        <p className="text-3xl font-black text-slate-900 dark:text-white">${precioNuevo.toFixed(2)}</p>
        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 flex items-center gap-1">
          <Info className="w-3 h-3" />
          Antes: ${precioAnterior.toFixed(2)} → Después: ${precioNuevo.toFixed(2)}
        </p>
      </div>

      <div className="h-48">
        <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">Expectativa vs resultado</p>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={datosGrafico} layout="vertical" margin={{ top: 8, right: 8, left: 60, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-600" />
            <XAxis type="number" tick={{ fontSize: 11 }} />
            <YAxis type="category" dataKey="name" width={55} tick={{ fontSize: 11 }} />
            <Tooltip formatter={(v: number) => [`${v.toFixed(2)} ${tipo.unidad}`, ""]} />
            <Bar dataKey="valor" radius={[0, 4, 4, 0]}>
              {datosGrafico.map((entry, i) => (
                <Cell key={i} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
