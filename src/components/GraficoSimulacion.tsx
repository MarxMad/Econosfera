"use client";

import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
} from "recharts";
import { LineChart as LineChartIcon, Download } from "lucide-react";
import type { VariablesSimulacion, ResultadosSimulacion } from "@/lib/types";
import { exportarGraficoComoPNG } from "@/lib/exportarGrafico";

interface GraficoSimulacionProps {
  variables: VariablesSimulacion;
  resultados: ResultadosSimulacion;
}

const COLORS = {
  inflacion: "#0ea5e9",
  subyacente: "#6366f1",
  meta: "#10b981",
  tasaPolitica: "#265a9e",
  taylor: "#d97706",
  tasaReal: "#8b5cf6",
};

export default function GraficoSimulacion({ variables, resultados }: GraficoSimulacionProps) {
  const [exportando, setExportando] = useState(false);

  const datosInflacion = [
    { nombre: "Inflación general", valor: variables.inflacion, fill: COLORS.inflacion },
    { nombre: "Inflación subyacente", valor: variables.inflacionSubyacente, fill: COLORS.subyacente },
    { nombre: "Meta BC", valor: variables.metaInflacion, fill: COLORS.meta },
  ];

  const datosTasas = [
    { nombre: "Tasa política", valor: variables.tasaPolitica, fill: COLORS.tasaPolitica },
    { nombre: "Tasa Taylor (ref.)", valor: resultados.tasaTaylor, fill: COLORS.taylor },
    { nombre: "Tasa real ex post", valor: resultados.tasaRealExPost, fill: COLORS.tasaReal },
  ];

  const exportarGrafico = async (id: string, nombre: string) => {
    setExportando(true);
    try {
      const { registrarExportacion } = await import("@/lib/actions/exportActions");
      await registrarExportacion("Grafico Simulacion", "PNG");
      await exportarGraficoComoPNG(id, nombre);
    } catch (error: any) {
      console.error("Error al exportar gráfico:", error);
      alert(error.message || "No se pudo exportar el gráfico. Intenta de nuevo.");
    } finally {
      setExportando(false);
    }
  };

  return (
    <section className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 shadow-lg p-6 animate-fade-up">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <LineChartIcon className="w-6 h-6 text-slate-600 dark:text-slate-400" aria-hidden />
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
            Visualización del escenario
          </h2>
        </div>
        <button
          type="button"
          onClick={() => exportarGrafico("grafico-inflacion", "inflacion-tasas.png")}
          disabled={exportando}
          className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 disabled:opacity-50 transition-colors"
        >
          {exportando ? "Exportando..." : (
            <>
              <Download className="w-4 h-4" />
              Exportar gráficos
            </>
          )}
        </button>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <div id="grafico-inflacion" className="rounded-xl bg-slate-50 dark:bg-slate-800/30 p-4 border border-slate-200 dark:border-slate-700">
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
            Inflación vs meta (%)
          </p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={datosInflacion} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-600" />
                <XAxis dataKey="nombre" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v: number) => `${v}%`} contentStyle={{ borderRadius: "8px" }} />
                <ReferenceLine
                  y={variables.metaInflacion}
                  stroke={COLORS.meta}
                  strokeDasharray="4 4"
                  strokeWidth={2}
                />
                <Bar dataKey="valor" name="%" radius={[6, 6, 0, 0]}>
                  {datosInflacion.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="rounded-xl bg-slate-50 dark:bg-slate-800/30 p-4 border border-slate-200 dark:border-slate-700">
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
            Tasas de interés (%)
          </p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={datosTasas} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-600" />
                <XAxis dataKey="nombre" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v: number) => `${v}%`} contentStyle={{ borderRadius: "8px" }} />
                <Bar dataKey="valor" name="%" radius={[6, 6, 0, 0]}>
                  {datosTasas.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </section>
  );
}
