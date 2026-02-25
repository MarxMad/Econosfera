"use client";

import { useMemo, useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Legend, Area } from "recharts";
import { Calculator, TrendingUp, BookOpen, FileDown } from "lucide-react";
import { useSession } from "next-auth/react";
import type { VariablesMacro, ResultadosMacro, VariablesISLM, ResultadosISLM } from "@/lib/macro";
import { calcularEquilibrioMacro, calcularISLM, datosGraficoISLM } from "@/lib/macro";

const INICIAL: VariablesMacro = {
  consumoAutonomo: 100,
  propensionMarginalConsumo: 0.6,
  inversion: 80,
  gastoPublico: 120,
  impuestos: 60,
};

const INICIAL_ISLM: VariablesISLM = {
  consumoAutonomo: 100,
  propensionMarginalConsumo: 0.6,
  inversionAutonoma: 80,
  sensibilidadInversionTasa: 50,
  gastoPublico: 120,
  impuestos: 60,
  ofertaRealDinero: 200,
  sensibilidadDemandaDineroRenta: 0.4,
  sensibilidadDemandaDineroTasa: 60,
};

function roundToStep(val: number, step: number): number {
  return Math.round(val / step) * step;
}

function Slider({
  label,
  value,
  min,
  max,
  step,
  onChange,
  suffix = "",
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (n: number) => void;
  suffix?: string;
}) {
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
    <div className="space-y-1">
      <div className="flex justify-between items-center gap-2 text-sm flex-wrap">
        <span className="text-slate-600 dark:text-slate-400">{label}</span>
        <div className="flex items-center gap-1">
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
            className="w-14 px-2 py-0.5 text-right text-sm font-mono font-medium rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 tabular-nums focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label={`${label} (valor manual)`}
          />
          {suffix && <span className="text-slate-500 dark:text-slate-400">{suffix}</span>}
        </div>
      </div>
      <input
        type="range"
        min={rangeMin}
        max={rangeMax}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-slate-200 dark:bg-slate-700 accent-blue-600"
      />
    </div>
  );
}

export default function SimuladorMacro({ initialData }: { initialData?: any }) {
  const { data: session } = useSession();
  const [v, setV] = useState<VariablesMacro>(INICIAL);
  const [vISLM, setVISLM] = useState<VariablesISLM>(INICIAL_ISLM);
  const [baselineISLM, setBaselineISLM] = useState<VariablesISLM>(INICIAL_ISLM);

  useEffect(() => {
    if (initialData?.data?.v) setV(initialData.data.v);
    if (initialData?.data?.vISLM) setVISLM(initialData.data.vISLM);
  }, [initialData]);

  const res = useMemo(() => calcularEquilibrioMacro(v), [v]);
  const resISLM = useMemo(() => calcularISLM(vISLM), [vISLM]);
  const resISLMBase = useMemo(() => calcularISLM(baselineISLM), [baselineISLM]);

  const shiftIS = vISLM.gastoPublico !== baselineISLM.gastoPublico || vISLM.impuestos !== baselineISLM.impuestos;
  const shiftLM = vISLM.ofertaRealDinero !== baselineISLM.ofertaRealDinero;

  const datosGrafico = useMemo(() => {
    const arr = [];
    const step = Math.max(10, Math.ceil(res.rentaEquilibrio * 1.2 / 15));
    for (let Y = 0; Y <= res.rentaEquilibrio * 1.5; Y += step) {
      const Yd = Y - v.impuestos;
      const C = v.consumoAutonomo + v.propensionMarginalConsumo * Yd;
      const GA = C + v.inversion + v.gastoPublico;
      arr.push({ Y, GA, C45: Y });
    }
    return arr;
  }, [v, res.rentaEquilibrio]);

  const datosGraficoISLMCombined = useMemo(() => {
    const YMax = resISLM ? Math.max(600, resISLM.rentaEquilibrio * 1.6) : 500;
    const current = datosGraficoISLM(vISLM, YMax, 50);
    const baseline = datosGraficoISLM(baselineISLM, YMax, 50);

    return current.map((d, i) => ({
      ...d,
      rISBase: baseline[i]?.rIS,
      rLMBase: baseline[i]?.rLM,
    }));
  }, [vISLM, resISLM, baselineISLM]);

  return (
    <div className="space-y-6">
      {/* Multiplicador keynesiano */}
      <section className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 shadow-lg p-6">
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
          <Calculator className="w-5 h-5 text-slate-600 dark:text-slate-400" aria-hidden />
          Multiplicador keynesiano
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
          Y = C + I + G. Equilibrio cuando gasto planeado = renta. Cambia C₀, PMC, I, G o T y observa el nuevo Y*.
        </p>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <Slider label="Consumo autónomo (C₀)" value={v.consumoAutonomo} min={0} max={300} step={5} onChange={(n) => setV({ ...v, consumoAutonomo: n })} />
            <Slider label="PMC (propensión marginal a consumir)" value={v.propensionMarginalConsumo} min={0.1} max={0.95} step={0.05} onChange={(n) => setV({ ...v, propensionMarginalConsumo: n })} />
            <Slider label="Inversión (I)" value={v.inversion} min={0} max={200} step={5} onChange={(n) => setV({ ...v, inversion: n })} />
            <Slider label="Gasto público (G)" value={v.gastoPublico} min={0} max={300} step={5} onChange={(n) => setV({ ...v, gastoPublico: n })} />
            <Slider label="Impuestos (T)" value={v.impuestos} min={0} max={150} step={5} onChange={(n) => setV({ ...v, impuestos: n })} />
          </div>
          <div className="space-y-3">
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-4">
              <p className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">Gasto autónomo</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 font-mono">{res.gastoAutonomo}</p>
            </div>
            <div className="rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/30 p-4">
              <p className="text-xs font-semibold uppercase text-blue-600 dark:text-blue-400">Renta de equilibrio Y*</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 font-mono">{res.rentaEquilibrio}</p>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-600">
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-3">Los tres multiplicadores</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600">
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Gasto o Inversión</p>
              <p className="text-lg font-bold font-mono text-slate-900 dark:text-slate-100">{res.multiplicadorGasto}</p>
            </div>
            <div className="p-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600">
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Impuestos</p>
              <p className="text-lg font-bold font-mono text-slate-900 dark:text-slate-100">{res.multiplicadorImpuestos}</p>
            </div>
            <div className="p-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600">
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">P. Equilibrado</p>
              <p className="text-lg font-bold font-mono text-slate-900 dark:text-slate-100 font-mono">{res.multiplicadorPresupuestoEquilibrado}</p>
            </div>
          </div>
        </div>
      </section>

      {/* IS-LM */}
      <section className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 shadow-lg p-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-slate-600 dark:text-slate-400" aria-hidden />
            Modelo IS-LM
          </h2>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={async () => {
                const { exportarMacroAPdf } = await import("@/lib/exportarMacroPdf");
                const { getGraficoAsDataUrl } = await import("@/lib/exportarGrafico");
                let chartMult = null;
                let chartIslm = null;
                try { chartMult = await getGraficoAsDataUrl("grafico-multiplicador"); } catch (e) { }
                try { chartIslm = await getGraficoAsDataUrl("grafico-islm"); } catch (e) { }

                await exportarMacroAPdf({
                  multiplier: { v, res, chart: chartMult },
                  islm: { v: vISLM, res: resISLM, chart: chartIslm }
                });
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold bg-slate-900 dark:bg-slate-700 text-white hover:bg-slate-800 dark:hover:bg-slate-600 transition-all shadow-md active:scale-95"
            >
              <FileDown className="w-4 h-4" />
              Exportar
            </button>

            {session && (
              <button
                type="button"
                onClick={async () => {
                  const { saveScenario } = await import("@/lib/actions/scenarioActions");
                  const resSave = await saveScenario({
                    type: "MACRO",
                    subType: "ISLM",
                    name: `Simulación Macro ${new Date().toLocaleDateString()}`,
                    variables: { v, vISLM },
                    results: { res, resISLM },
                  });
                  if (resSave.success) alert("Escenario guardado");
                  else alert(resSave.error);
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold bg-blue-600 text-white hover:bg-blue-500 transition-all shadow-md active:scale-95"
              >
                Guardar
              </button>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <Slider label="Gasto público (G)" value={vISLM.gastoPublico} min={0} max={300} step={5} onChange={(n) => setVISLM({ ...vISLM, gastoPublico: n })} />
            <Slider label="Oferta real de dinero (M/P)" value={vISLM.ofertaRealDinero} min={50} max={400} step={10} onChange={(n) => setVISLM({ ...vISLM, ofertaRealDinero: n })} />
            <Slider label="Sens. inversión a r (b)" value={vISLM.sensibilidadInversionTasa} min={10} max={120} step={5} onChange={(n) => setVISLM({ ...vISLM, sensibilidadInversionTasa: n })} />
            <Slider label="Sens. demanda dinero a r (h)" value={vISLM.sensibilidadDemandaDineroTasa} min={20} max={150} step={5} onChange={(n) => setVISLM({ ...vISLM, sensibilidadDemandaDineroTasa: n })} />
          </div>
          <div className="space-y-3">
            {resISLM ? (
              <>
                <div className="rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/30 p-4">
                  <p className="text-xs font-semibold uppercase text-blue-600 dark:text-blue-400">Renta equilibrio Y*</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 font-mono">{resISLM.rentaEquilibrio}</p>
                </div>
                <div className="rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/30 p-4">
                  <p className="text-xs font-semibold uppercase text-blue-600 dark:text-blue-400">Tasa de interés r* (%)</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 font-mono">{resISLM.tasaEquilibrio}%</p>
                </div>
              </>
            ) : (
              <p className="text-sm text-amber-600 dark:text-amber-400">Ajusta parámetros para obtener equilibrio r &gt; 0.</p>
            )}
          </div>
        </div>

        {resISLM && datosGraficoISLMCombined.length > 0 && (
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200">Gráfico IS-LM</h3>
              <button
                type="button"
                onClick={() => setBaselineISLM(vISLM)}
                className="text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
              >
                Fijar Escenario Base
              </button>
            </div>
            <div id="grafico-islm" className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={datosGraficoISLMCombined} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-600" />
                  <XAxis type="number" dataKey="Y" domain={["auto", "auto"]} tick={{ fontSize: 11 }} />
                  <YAxis type="number" domain={["auto", "auto"]} tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(val: number) => [val?.toFixed(2) + "%", ""]} />
                  <ReferenceLine x={resISLM.rentaEquilibrio} stroke="#0ea5e9" strokeDasharray="4 4" label={{ value: 'Actual', position: 'top', fontSize: 10, fill: '#0ea5e9' }} />
                  <ReferenceLine y={resISLM.tasaEquilibrio} stroke="#0ea5e9" strokeDasharray="4 4" />
                  {(shiftIS || shiftLM) && resISLMBase && (
                    <>
                      <ReferenceLine x={resISLMBase.rentaEquilibrio} stroke="#94a3b8" strokeDasharray="2 2" label={{ value: 'Base', position: 'top', fontSize: 10, fill: '#94a3b8' }} />
                      <Line type="monotone" dataKey="rISBase" stroke="#2563eb" strokeWidth={1} strokeDasharray="5 5" dot={false} name="IS (Base)" opacity={0.4} />
                      <Line type="monotone" dataKey="rLMBase" stroke="#16a34a" strokeWidth={1} strokeDasharray="5 5" dot={false} name="LM (Base)" opacity={0.4} />
                    </>
                  )}
                  <Line type="monotone" dataKey="rIS" stroke="#2563eb" strokeWidth={2} dot={false} name="IS" />
                  <Line type="monotone" dataKey="rLM" stroke="#16a34a" strokeWidth={2} dot={false} name="LM" />
                  <Legend />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </section>

      {/* Conceptos */}
      <section className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 shadow-lg p-6">
        <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-2 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-slate-600 dark:text-slate-400" />
          Conceptos
        </h3>
        <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-2">
          <li><strong>Curva IS:</strong> Equilibrio mercado de bienes. R↑ → I↓ → Y↓.</li>
          <li><strong>Curva LM:</strong> Equilibrio mercado de dinero. Y↑ → Md↑ → r↑.</li>
          <li><strong>Política Fiscal (G↑):</strong> Desplaza IS a la derecha. Y↑, r↑.</li>
          <li><strong>Política Monetaria (M/P↑):</strong> Desplaza LM a la derecha. r↓, Y↑.</li>
        </ul>
      </section>
    </div>
  );
}
