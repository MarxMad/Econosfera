"use client";

import { BarChart3 } from "lucide-react";
import type { ResultadosSimulacion } from "@/lib/types";

interface ResultadosProps {
  resultados: ResultadosSimulacion;
}

const TOOLTIPS: Record<string, string> = {
  tasaRealExPost: "Tasa nominal − inflación observada.",
  tasaRealExAnte: "Tasa nominal − inflación subyacente (proxy de esperada).",
  brechaInflacion: "Inflación general menos meta del BC.",
  brechaSubyacente: "Inflación subyacente menos meta.",
  tasaTaylor: "Referencia de una regla de Taylor simplificada.",
  desvTaylor: "Tasa actual − tasa Taylor; positivo = más restrictivo.",
};

function Card({
  title,
  value,
  subtitle,
  tooltipKey,
  accent,
}: {
  title: string;
  value: string;
  subtitle?: string;
  tooltipKey?: string;
  accent?: "green" | "amber" | "rose" | "neutral";
}) {
  const tooltip = tooltipKey ? TOOLTIPS[tooltipKey] : null;
  const borderClass =
    accent === "green"
      ? "border-l-emerald-500"
      : accent === "amber"
        ? "border-l-amber-500"
        : accent === "rose"
          ? "border-l-rose-500"
          : "border-l-blue-500";
  return (
    <div
      className={`rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 p-4 shadow border-l-4 ${borderClass} transition-shadow hover:shadow-md`}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {title}
        </p>
        {tooltip && (
          <span
            className="inline-flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full border border-slate-300 bg-slate-100 text-[10px] font-bold text-slate-600 cursor-help dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300"
            title={tooltip}
            aria-label={tooltip}
          >
            i
          </span>
        )}
      </div>
      <p className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-1 font-mono tabular-nums">
        {value}
      </p>
      {subtitle && (
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5">{subtitle}</p>
      )}
    </div>
  );
}

export default function Resultados({ resultados }: ResultadosProps) {
  return (
    <section className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 shadow-lg p-6">
      <div className="flex items-center gap-2 mb-5">
        <BarChart3 className="w-6 h-6 text-slate-600 dark:text-slate-400" aria-hidden />
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
          Resultados del escenario
        </h2>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
        <Card
          title="Tasa real ex post"
          value={`${resultados.tasaRealExPost}%`}
          subtitle="Tasa política − inflación observada"
          tooltipKey="tasaRealExPost"
          accent="neutral"
        />
        <Card
          title="Tasa real ex ante"
          value={`${resultados.tasaRealExAnte}%`}
          subtitle="Tasa política − inflación subyacente"
          tooltipKey="tasaRealExAnte"
          accent="neutral"
        />
        <Card
          title="Brecha inflación"
          value={`${resultados.brechaInflacion > 0 ? "+" : ""}${resultados.brechaInflacion} pp`}
          subtitle="General vs meta"
          tooltipKey="brechaInflacion"
          accent={resultados.brechaInflacion > 0 ? "rose" : "green"}
        />
        <Card
          title="Brecha subyacente"
          value={`${resultados.brechaInflacionSubyacente > 0 ? "+" : ""}${resultados.brechaInflacionSubyacente} pp`}
          subtitle="Subyacente vs meta"
          tooltipKey="brechaSubyacente"
          accent={resultados.brechaInflacionSubyacente > 0 ? "amber" : "neutral"}
        />
        <Card
          title="Tasa Taylor (ref.)"
          value={`${resultados.tasaTaylor}%`}
          subtitle="Regla de Taylor sugerida"
          tooltipKey="tasaTaylor"
          accent="amber"
        />
        <Card
          title="Desv. vs Taylor"
          value={`${resultados.desviacionTaylor > 0 ? "+" : ""}${resultados.desviacionTaylor} pp`}
          subtitle={resultados.desviacionTaylor > 0.5 ? "Más restrictivo" : resultados.desviacionTaylor < -0.5 ? "Más expansivo" : "Cercano"}
          tooltipKey="desvTaylor"
          accent={resultados.desviacionTaylor > 0.5 ? "rose" : resultados.desviacionTaylor < -0.5 ? "green" : "neutral"}
        />
      </div>
      <div className="rounded-xl bg-slate-50 dark:bg-slate-800/50 p-4 space-y-2 border border-slate-200 dark:border-slate-700">
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
          Postura de política
        </p>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          {resultados.descripcionPolitica}
        </p>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          {resultados.interpretacion}
        </p>
      </div>
    </section>
  );
}
