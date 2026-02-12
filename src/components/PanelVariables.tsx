"use client";

import { useState, useEffect } from "react";
import { SlidersHorizontal } from "lucide-react";
import type { VariablesSimulacion, PoliticaMonetaria } from "@/lib/types";

function roundToStep(val: number, step: number): number {
  return Math.round(val / step) * step;
}

interface PanelVariablesProps {
  variables: VariablesSimulacion;
  onChange: (v: VariablesSimulacion) => void;
}

const POLITICA_OPTS: { value: PoliticaMonetaria; label: string; hint: string }[] = [
  { value: "expansiva", label: "Expansiva", hint: "Estímulo al crédito y actividad" },
  { value: "neutral", label: "Neutral", hint: "Alineada con el ciclo" },
  { value: "restrictiva", label: "Restrictiva", hint: "Enfriar demanda e inflación" },
];

const TOOLTIPS: Record<string, string> = {
  inflacion: "Variación anual del IPC (nivel general de precios).",
  inflacionSubyacente: "Inflación sin componentes volátiles; indica la tendencia de mediano plazo.",
  tasaPolitica: "Tasa de referencia que fija el banco central (ej. tasa de fondos federales o de política).",
  metaInflacion: "Objetivo de inflación del banco central (habitualmente 2% o 3%).",
  brechaProducto: "Diferencia entre PIB observado y PIB potencial. Positiva = sobrecalentamiento.",
  crecimientoPIB: "Crecimiento esperado del PIB real (ajustado por inflación).",
  alphaTaylor: "Peso de la brecha de inflación en la regla de Taylor. Valores típicos: 0.5-1.0.",
  betaTaylor: "Peso de la brecha de producto en la regla de Taylor. Valores típicos: 0.5-1.0.",
};

function Slider({
  label,
  value,
  min,
  max,
  step,
  suffix = "%",
  tooltipKey,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  suffix?: string;
  tooltipKey?: string;
  onChange: (n: number) => void;
}) {
  const tooltip = tooltipKey ? TOOLTIPS[tooltipKey] : null;
  const [inputStr, setInputStr] = useState(String(value));
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (!editing) setInputStr(String(value));
  }, [value, editing]);

  const commitInput = () => {
    const num = parseFloat(inputStr.replace(",", "."));
    if (!Number.isNaN(num)) {
      const rounded = roundToStep(num, step);
      onChange(rounded);
      setInputStr(String(rounded));
    } else {
      setInputStr(String(value));
    }
    setEditing(false);
  };

  const rangeMin = Math.min(min, value);
  const rangeMax = Math.max(max, value);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">
            {label}
          </span>
          {tooltip && (
            <span
              className="inline-flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full border border-slate-300 bg-slate-100 text-[10px] font-bold text-slate-600 cursor-help dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300 flex-shrink-0"
              title={tooltip}
              aria-label={tooltip}
            >
              i
            </span>
          )}
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          <input
            type="text"
            inputMode="decimal"
            value={inputStr}
            onChange={(e) => {
              setEditing(true);
              setInputStr(e.target.value);
            }}
            onFocus={() => setEditing(true)}
            onBlur={commitInput}
            onKeyDown={(e) => e.key === "Enter" && commitInput()}
            className="w-16 px-2 py-1 text-right text-sm font-mono font-semibold rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 tabular-nums focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            aria-label={`${label} (valor manual)`}
          />
          <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{suffix}</span>
        </div>
      </div>
      <input
        type="range"
        min={rangeMin}
        max={rangeMax}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full"
        aria-label={label}
      />
    </div>
  );
}

export default function PanelVariables({ variables, onChange }: PanelVariablesProps) {
  const set = <K extends keyof VariablesSimulacion>(key: K, value: VariablesSimulacion[K]) => {
    onChange({ ...variables, [key]: value });
  };

  return (
    <section className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 shadow-lg p-6">
      <div className="flex items-center gap-2 mb-5">
        <SlidersHorizontal className="w-6 h-6 text-slate-600 dark:text-slate-400" aria-hidden />
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
          Variables del escenario
        </h2>
      </div>
      <div className="space-y-6">
        <Slider
          label="Inflación general (anual)"
          value={variables.inflacion}
          min={0}
          max={20}
          step={0.25}
          tooltipKey="inflacion"
          onChange={(n) => set("inflacion", n)}
        />
        <Slider
          label="Inflación subyacente (anual)"
          value={variables.inflacionSubyacente}
          min={0}
          max={20}
          step={0.25}
          tooltipKey="inflacionSubyacente"
          onChange={(n) => set("inflacionSubyacente", n)}
        />
        <Slider
          label="Tasa de política monetaria"
          value={variables.tasaPolitica}
          min={0}
          max={25}
          step={0.25}
          tooltipKey="tasaPolitica"
          onChange={(n) => set("tasaPolitica", n)}
        />
        <Slider
          label="Meta de inflación (BC)"
          value={variables.metaInflacion}
          min={1}
          max={6}
          step={0.25}
          tooltipKey="metaInflacion"
          onChange={(n) => set("metaInflacion", n)}
        />
        <Slider
          label="Brecha de producto"
          value={variables.brechaProducto}
          min={-5}
          max={5}
          step={0.25}
          suffix=" pp"
          tooltipKey="brechaProducto"
          onChange={(n) => set("brechaProducto", n)}
        />
        <Slider
          label="Crecimiento PIB real esperado"
          value={variables.crecimientoPIB}
          min={-3}
          max={8}
          step={0.25}
          tooltipKey="crecimientoPIB"
          onChange={(n) => set("crecimientoPIB", n)}
        />
        <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-3">
            Parámetros de la regla de Taylor
          </p>
          <Slider
            label="α (peso brecha inflación)"
            value={variables.alphaTaylor ?? 0.5}
            min={0}
            max={2}
            step={0.1}
            tooltipKey="alphaTaylor"
            onChange={(n) => set("alphaTaylor", n)}
          />
          <Slider
            label="β (peso brecha producto)"
            value={variables.betaTaylor ?? 0.5}
            min={0}
            max={2}
            step={0.1}
            tooltipKey="betaTaylor"
            onChange={(n) => set("betaTaylor", n)}
          />
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            Valores típicos: α = 0.5, β = 0.5. Valores más altos = respuesta más agresiva del BC.
          </p>
        </div>
        <div>
          <p className="text-sm font-medium text-slate-800 dark:text-slate-200 mb-2">
            Postura de política
          </p>
          <div className="flex gap-2 flex-wrap">
            {POLITICA_OPTS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => set("tipoPolitica", opt.value)}
                title={opt.hint}
                className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  variables.tipoPolitica === opt.value
                    ? opt.value === "expansiva"
                      ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/25"
                      : opt.value === "restrictiva"
                        ? "bg-rose-500 text-white shadow-md shadow-rose-500/25"
                        : "bg-blue-600 text-white shadow-md shadow-blue-500/25"
                    : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
