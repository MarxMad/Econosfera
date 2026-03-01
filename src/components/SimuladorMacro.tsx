"use client";

import { useMemo, useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Legend, Area } from "recharts";
import {
  Calculator, TrendingUp, Info, ArrowRight, Download, Save, FileDown, Activity, BookOpen
} from "lucide-react";
import { useSession } from "next-auth/react";
import { registrarExportacion } from "@/lib/actions/exportActions";
import { exportarMacroAPdf } from "@/lib/exportarMacroPdf";
import { saveScenario } from "@/lib/actions/scenarioActions";
import type { VariablesMacro, ResultadosMacro, VariablesISLM, ResultadosISLM } from "@/lib/macro";
import { calcularEquilibrioMacro, calcularISLM, datosGraficoISLM } from "@/lib/macro";
import { InputPremium } from "./common/InputPremium";

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


import { SimuladorSolow, SimuladorPhillips, SimuladorISLMBP } from "@/components/simuladores-macro";

export default function SimuladorMacro({ initialData }: { initialData?: any }) {
  const { data: session } = useSession();
  const isPro = session?.user?.plan === 'PRO' || session?.user?.plan === 'RESEARCHER';
  const [activeTab, setActiveTab] = useState<"standard" | "solow" | "phillips" | "mundell">("standard");
  const [v, setV] = useState<VariablesMacro>(INICIAL);
  const [vISLM, setVISLM] = useState<VariablesISLM>(INICIAL_ISLM);
  const [baselineISLM, setBaselineISLM] = useState<VariablesISLM>(INICIAL_ISLM);

  useEffect(() => {
    if (initialData?.data?.v) setV(initialData.data.v);
    if (initialData?.data?.vISLM) setVISLM(initialData.data.vISLM);
  }, [initialData]);

  const res = useMemo(() => calcularEquilibrioMacro(v), [v]);
  const resISLM = useMemo(() => calcularISLM(vISLM), [vISLM]);

  const handleExportMacro = async (tipo: 'multiplier' | 'islm') => {
    try {
      await registrarExportacion(`Macro ${tipo}`);
      const { getGraficoAsDataUrl } = await import("@/lib/exportarGrafico");
      let chartUrl: string | null = null;
      try {
        if (tipo === 'multiplier') {
          chartUrl = await getGraficoAsDataUrl("grafico-multiplicador");
        } else {
          chartUrl = await getGraficoAsDataUrl("grafico-islm");
        }
      } catch (_) {}
      if (tipo === 'multiplier') {
        exportarMacroAPdf({ multiplier: { v: v, res: res, chart: chartUrl } });
      } else {
        exportarMacroAPdf({ islm: { v: vISLM, res: resISLM, chart: chartUrl } });
      }
    } catch (e: any) {
      alert(e.message);
    }
  };

  const handleSaveMacro = async (tipo: 'multiplier' | 'islm') => {
    try {
      const resScenario = await saveScenario({
        type: "MACRO",
        subType: tipo.toUpperCase(),
        name: `Macro ${tipo} ${new Date().toLocaleDateString()}`,
        variables: tipo === 'multiplier' ? v : vISLM,
        results: tipo === 'multiplier' ? res : resISLM
      });
      if (resScenario.success) alert(`Escenario ${tipo} guardado (1 crédito)`);
      else alert(resScenario.error);
    } catch (e: any) {
      alert("Error al guardar");
    }
  };
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
    <div className="space-y-6 animate-in fade-in duration-700">
      {/* Hero */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-900 p-8 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 text-blue-500">
          <TrendingUp className="w-24 h-24" />
        </div>
        <div className="relative z-10">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-3 flex items-center gap-3">
            <Calculator className="text-blue-500 w-8 h-8" />
            Modelos Macroeconómicos
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm max-w-2xl italic">
            Explora el equilibrio general, política fiscal y monetaria, modelos IS-LM, crecimiento de Solow, Curva de Phillips y más.
          </p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 p-1 bg-slate-200 dark:bg-slate-800/50 rounded-2xl w-fit">
        {[
          { id: 'standard', label: 'Modelos Básicos' },
          { id: 'solow', label: 'Crecimiento (Solow)' },
          { id: 'phillips', label: 'Curva Phillips' },
          { id: 'mundell', label: 'Mundell-Fleming' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === tab.id
              ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-sm'
              : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'solow' && <SimuladorSolow />}
      {activeTab === 'phillips' && <SimuladorPhillips />}
      {activeTab === 'mundell' && <SimuladorISLMBP />}

      {activeTab === 'standard' && (
        <>
          {/* Multiplicador keynesiano */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 lg:p-8 border border-slate-200 dark:border-slate-800 shadow-xl">
            <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <Calculator className="w-5 h-5 text-slate-600 dark:text-slate-400" aria-hidden />
                Multiplicador keynesiano (Modelo 45°)
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={() => handleExportMacro('multiplier')}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center gap-2 shadow-lg active:scale-95"
                >
                  <Download className="w-3 h-3" />
                  Reporte PDF
                </button>
                {session && (
                  <button
                    onClick={() => handleSaveMacro('multiplier')}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center gap-2 shadow-lg active:scale-95"
                  >
                    <Save className="w-3 h-3" />
                    Guardar
                  </button>
                )}
              </div>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
              Y = C + I + G. Equilibrio cuando gasto planeado = renta. Cambia C₀, PMC, I, G o T y observa el nuevo Y*.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <InputPremium label="Consumo autónomo (C₀)" value={v.consumoAutonomo} min={0} max={500} step={5} onChange={(n) => setV({ ...v, consumoAutonomo: n })} color="blue" />
                <InputPremium label="PMC (Propensión Marginal)" value={v.propensionMarginalConsumo} min={0.1} max={0.99} step={0.01} onChange={(n) => setV({ ...v, propensionMarginalConsumo: n })} color="indigo" />
                <InputPremium label="Inversión Planeada (I)" value={v.inversion} min={0} max={500} step={5} onChange={(n) => setV({ ...v, inversion: n })} color="emerald" />
                <InputPremium label="Gasto Público (G)" value={v.gastoPublico} min={0} max={500} step={5} onChange={(n) => setV({ ...v, gastoPublico: n })} color="amber" />
                <InputPremium label="Impuestos (T)" value={v.impuestos} min={0} max={300} step={5} onChange={(n) => setV({ ...v, impuestos: n })} color="rose" />
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

            {datosGrafico.length > 0 && (
              <div className="mt-6">
                <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">Modelo 45° (Gasto planeado vs Renta)</h3>
                <div id="grafico-multiplicador" className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={datosGrafico} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-600" />
                      <XAxis type="number" dataKey="Y" domain={["auto", "auto"]} tick={{ fontSize: 11 }} />
                      <YAxis type="number" domain={["auto", "auto"]} tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <ReferenceLine x={res.rentaEquilibrio} stroke="#0ea5e9" strokeDasharray="4 4" label={{ value: "Y*", position: "top", fontSize: 10, fill: "#0ea5e9" }} />
                      <Line type="monotone" dataKey="GA" stroke="#2563eb" strokeWidth={2} dot={false} name="Gasto planeado" />
                      <Line type="monotone" dataKey="C45" stroke="#94a3b8" strokeWidth={1} strokeDasharray="5 5" dot={false} name="45°" />
                      <Legend />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </div>

          {/* IS-LM */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 lg:p-8 border border-slate-200 dark:border-slate-800 shadow-xl">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-slate-600 dark:text-slate-400" aria-hidden />
                Modelo IS-LM
              </h2>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleExportMacro('islm')}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold bg-slate-900 dark:bg-slate-700 text-white hover:bg-slate-800 dark:hover:bg-slate-600 transition-all shadow-md active:scale-95"
                >
                  <FileDown className="w-4 h-4" />
                  Reporte PDF
                </button>

                {session && (
                  <button
                    type="button"
                    onClick={() => handleSaveMacro('islm')}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold bg-blue-600 text-white hover:bg-blue-500 transition-all shadow-md active:scale-95"
                  >
                    <Save className="w-4 h-4" />
                    Guardar
                  </button>
                )}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <InputPremium label="Gasto Público (G)" value={vISLM.gastoPublico} min={0} max={500} step={5} onChange={(n) => setVISLM({ ...vISLM, gastoPublico: n })} color="amber" />
                <InputPremium label="Oferta Real Dinero (M/P)" value={vISLM.ofertaRealDinero} min={50} max={500} step={10} onChange={(n) => setVISLM({ ...vISLM, ofertaRealDinero: n })} color="emerald" />
                <InputPremium label="Sens. Inversión (b)" value={vISLM.sensibilidadInversionTasa} min={10} max={200} step={5} onChange={(n) => setVISLM({ ...vISLM, sensibilidadInversionTasa: n })} color="violet" />
                <InputPremium label="Sens. Demanda Dinero (h)" value={vISLM.sensibilidadDemandaDineroTasa} min={10} max={200} step={5} onChange={(n) => setVISLM({ ...vISLM, sensibilidadDemandaDineroTasa: n })} color="indigo" />
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
          </div>

          {/* Conceptos */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 lg:p-8 border border-slate-200 dark:border-slate-800 shadow-xl">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              Conceptos Clave
            </h3>
            <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-3">
              <li><strong>Curva IS:</strong> Equilibrio mercado de bienes. R↑ → I↓ → Y↓.</li>
              <li><strong>Curva LM:</strong> Equilibrio mercado de dinero. Y↑ → Md↑ → r↑.</li>
              <li><strong>Política Fiscal (G↑):</strong> Desplaza IS a la derecha. Y↑, r↑.</li>
              <li><strong>Política Monetaria (M/P↑):</strong> Desplaza LM a la derecha. r↓, Y↑.</li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
