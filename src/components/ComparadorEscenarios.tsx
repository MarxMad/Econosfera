"use client";

import { useState, useMemo } from "react";
import { GitCompare, Copy, ArrowLeftRight } from "lucide-react";
import type { VariablesSimulacion } from "@/lib/types";
import { calcularResultados } from "@/lib/calculos";
import Resultados from "@/components/Resultados";
import PanelVariables from "@/components/PanelVariables";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const COLOR_A = "#2563eb";
const COLOR_B = "#dc2626";

interface ComparadorEscenariosProps {
  /** Escenario actual del simulador principal (para "Copiar a A/B") */
  escenarioActual: VariablesSimulacion;
  onCargarEnPrincipal?: (v: VariablesSimulacion) => void;
}

function clonarVariables(v: VariablesSimulacion): VariablesSimulacion {
  return { ...v };
}

export default function ComparadorEscenarios({
  escenarioActual,
  onCargarEnPrincipal,
}: ComparadorEscenariosProps) {
  const [variablesA, setVariablesA] = useState<VariablesSimulacion>(() => clonarVariables(escenarioActual));
  const [variablesB, setVariablesB] = useState<VariablesSimulacion>(() => {
    const b = clonarVariables(escenarioActual);
    b.tasaPolitica = Math.min(20, b.tasaPolitica + 1);
    b.inflacion = Math.min(15, b.inflacion + 0.5);
    return b;
  });
  const [mostrarPanelCompleto, setMostrarPanelCompleto] = useState<"ninguno" | "A" | "B">("ninguno");

  const resultadosA = useMemo(() => calcularResultados(variablesA), [variablesA]);
  const resultadosB = useMemo(() => calcularResultados(variablesB), [variablesB]);

  const copiarActualA = () => setVariablesA(clonarVariables(escenarioActual));
  const copiarActualB = () => setVariablesB(clonarVariables(escenarioActual));
  const intercambiar = () => {
    const tmp = clonarVariables(variablesA);
    setVariablesA(clonarVariables(variablesB));
    setVariablesB(tmp);
  };

  const datosComparacion = useMemo(() => {
    return [
      { nombre: "Inflación", A: variablesA.inflacion, B: variablesB.inflacion },
      { nombre: "Inflación subyacente", A: variablesA.inflacionSubyacente, B: variablesB.inflacionSubyacente },
      { nombre: "Tasa política", A: variablesA.tasaPolitica, B: variablesB.tasaPolitica },
      { nombre: "Meta inflación", A: variablesA.metaInflacion, B: variablesB.metaInflacion },
      { nombre: "Tasa real ex post", A: resultadosA.tasaRealExPost, B: resultadosB.tasaRealExPost },
      { nombre: "Tasa Taylor", A: resultadosA.tasaTaylor, B: resultadosB.tasaTaylor },
      { nombre: "Brecha producto", A: variablesA.brechaProducto, B: variablesB.brechaProducto },
    ];
  }, [variablesA, variablesB, resultadosA, resultadosB]);

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 shadow-lg overflow-hidden">
      <div className="p-5 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-slate-800">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <GitCompare className="w-6 h-6 text-slate-600 dark:text-slate-400" aria-hidden />
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Comparar escenarios</h2>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={copiarActualA}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
            >
              <Copy className="w-4 h-4" />
              Usar escenario actual como A
            </button>
            <button
              type="button"
              onClick={copiarActualB}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
            >
              <Copy className="w-4 h-4" />
              Usar escenario actual como B
            </button>
            <button
              type="button"
              onClick={intercambiar}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/30 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
            >
              <ArrowLeftRight className="w-4 h-4" />
              Intercambiar A y B
            </button>
          </div>
        </div>
      </div>

      <div className="p-5 space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100" style={{ color: COLOR_A }}>
                Escenario A
              </h3>
              <div className="flex gap-2">
                {onCargarEnPrincipal && (
                  <button
                    type="button"
                    onClick={() => onCargarEnPrincipal(variablesA)}
                    className="text-xs px-2 py-1 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600"
                  >
                    Cargar en simulador
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setMostrarPanelCompleto(mostrarPanelCompleto === "A" ? "ninguno" : "A")}
                  className="text-xs px-2 py-1 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600"
                >
                  {mostrarPanelCompleto === "A" ? "Ocultar variables" : "Editar todas las variables"}
                </button>
              </div>
            </div>
            {mostrarPanelCompleto === "A" ? (
              <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-4 bg-slate-50 dark:bg-slate-800/30">
                <PanelVariables variables={variablesA} onChange={setVariablesA} />
              </div>
            ) : (
              <ResumenVariables variables={variablesA} onChange={setVariablesA} />
            )}
            <Resultados resultados={resultadosA} />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100" style={{ color: COLOR_B }}>
                Escenario B
              </h3>
              <div className="flex gap-2">
                {onCargarEnPrincipal && (
                  <button
                    type="button"
                    onClick={() => onCargarEnPrincipal(variablesB)}
                    className="text-xs px-2 py-1 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600"
                  >
                    Cargar en simulador
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setMostrarPanelCompleto(mostrarPanelCompleto === "B" ? "ninguno" : "B")}
                  className="text-xs px-2 py-1 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600"
                >
                  {mostrarPanelCompleto === "B" ? "Ocultar variables" : "Editar todas las variables"}
                </button>
              </div>
            </div>
            {mostrarPanelCompleto === "B" ? (
              <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-4 bg-slate-50 dark:bg-slate-800/30">
                <PanelVariables variables={variablesB} onChange={setVariablesB} />
              </div>
            ) : (
              <ResumenVariables variables={variablesB} onChange={setVariablesB} />
            )}
            <Resultados resultados={resultadosB} />
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/30 p-4">
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Comparación A vs B (%)</p>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={datosComparacion} margin={{ top: 8, right: 24, left: 8, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-600" />
                <XAxis dataKey="nombre" tick={{ fontSize: 10 }} angle={-25} textAnchor="end" height={60} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v: number) => `${v}%`} contentStyle={{ borderRadius: "8px" }} />
                <Legend />
                <Bar dataKey="A" name="Escenario A" fill={COLOR_A} radius={[4, 4, 0, 0]} />
                <Bar dataKey="B" name="Escenario B" fill={COLOR_B} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

function ResumenVariables({
  variables,
  onChange,
}: {
  variables: VariablesSimulacion;
  onChange: (v: VariablesSimulacion) => void;
}) {
  const set = (key: keyof VariablesSimulacion, value: number) =>
    onChange({ ...variables, [key]: value });

  const items: { key: keyof VariablesSimulacion; label: string; suffix: string }[] = [
    { key: "inflacion", label: "Inflación general", suffix: "%" },
    { key: "inflacionSubyacente", label: "Inflación subyacente", suffix: "%" },
    { key: "tasaPolitica", label: "Tasa de política", suffix: "%" },
    { key: "metaInflacion", label: "Meta inflación", suffix: "%" },
    { key: "brechaProducto", label: "Brecha producto", suffix: " pp" },
    { key: "crecimientoPIB", label: "Crecimiento PIB", suffix: "%" },
  ];

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/30 p-4">
      <div className="space-y-2">
        {items.map(({ key, label, suffix }) => (
          <div key={key} className="flex items-center justify-between gap-2">
            <span className="text-xs text-slate-600 dark:text-slate-400 truncate">{label}</span>
            <span className="flex items-center gap-0.5">
              <input
                type="number"
                value={variables[key] as number}
                onChange={(e) => set(key, parseFloat(e.target.value) || 0)}
                step="0.25"
                className="w-14 px-2 py-1 text-right text-sm font-mono rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
              />
              <span className="text-xs text-slate-500">{suffix}</span>
            </span>
          </div>
        ))}
      </div>
      <div className="mt-2 pt-2 border-t border-slate-200 dark:border-slate-700">
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Postura</p>
        <div className="flex gap-1">
          {(["expansiva", "neutral", "restrictiva"] as const).map((tipo) => (
            <button
              key={tipo}
              type="button"
              onClick={() => onChange({ ...variables, tipoPolitica: tipo })}
              className={`px-2 py-1 rounded text-xs font-medium ${
                variables.tipoPolitica === tipo
                  ? "bg-blue-600 text-white"
                  : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400"
              }`}
            >
              {tipo === "expansiva" ? "Expansiva" : tipo === "restrictiva" ? "Restrictiva" : "Neutral"}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
