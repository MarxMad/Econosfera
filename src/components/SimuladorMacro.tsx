"use client";

import { useMemo, useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Legend } from "recharts";
import { Calculator, TrendingUp, BookOpen } from "lucide-react";
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

export default function SimuladorMacro() {
  const [v, setV] = useState<VariablesMacro>(INICIAL);
  const [vISLM, setVISLM] = useState<VariablesISLM>(INICIAL_ISLM);

  const res = useMemo(() => calcularEquilibrioMacro(v), [v]);
  const resISLM = useMemo(() => calcularISLM(vISLM), [vISLM]);

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
    return datosGraficoISLM(vISLM, YMax, 50);
  }, [vISLM, resISLM]);

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
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-4">
              <p className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">Consumo en equilibrio</p>
              <p className="text-xl font-bold text-slate-900 dark:text-slate-100 font-mono">{res.consumoEquilibrio}</p>
            </div>
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-4">
              <p className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">Ahorro privado (S = Y − T − C)</p>
              <p className="text-xl font-bold text-slate-900 dark:text-slate-100 font-mono">{res.ahorroPrivado}</p>
            </div>
          </div>
        </div>

        {/* Panel multiplicadores */}
        <div className="mt-6 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-600">
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-3">Los tres multiplicadores</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600">
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Multiplicador del gasto (ΔG o ΔI)</p>
              <p className="text-lg font-bold font-mono text-slate-900 dark:text-slate-100">{res.multiplicadorGasto}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">1/(1−PMC). ΔY = multiplicador × ΔG.</p>
            </div>
            <div className="p-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600">
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Multiplicador de impuestos (ΔT)</p>
              <p className="text-lg font-bold font-mono text-slate-900 dark:text-slate-100">{res.multiplicadorImpuestos}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">−PMC/(1−PMC). Subir T reduce Y.</p>
            </div>
            <div className="p-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600">
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Presupuesto equilibrado (ΔG = ΔT)</p>
              <p className="text-lg font-bold font-mono text-slate-900 dark:text-slate-100">{res.multiplicadorPresupuestoEquilibrado}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">ΔY = ΔG (multiplicador 1).</p>
            </div>
          </div>
        </div>
      </section>

      {/* Gráfico 45° */}
      <section className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 shadow-lg p-6">
        <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-3">Gasto agregado vs renta (45°)</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={datosGrafico} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-600" />
              <XAxis dataKey="Y" name="Y" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip formatter={(val: number) => [val, "Valor"]} />
              <ReferenceLine x={res.rentaEquilibrio} stroke="#0ea5e9" strokeDasharray="4 4" />
              <Line type="monotone" dataKey="C45" stroke="#94a3b8" strokeDasharray="4 4" dot={false} name="Y=GA (45°)" />
              <Line type="monotone" dataKey="GA" stroke="#2563eb" strokeWidth={2} dot={false} name="Gasto agregado" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Corte con la recta de 45° = equilibrio Y*.</p>
      </section>

      {/* IS-LM */}
      <section className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 shadow-lg p-6">
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-slate-600 dark:text-slate-400" aria-hidden />
          Modelo IS-LM (mercado de bienes y mercado de dinero)
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
          IS: equilibrio en el mercado de bienes (Y depende de r vía la inversión). LM: equilibrio en el mercado de dinero (M/P = demanda de dinero L(Y,r)). El cruce determina Y* y r*; a mayor Y*, mayor demanda de trabajo y empleo (en el corto plazo keynesiano).
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200">Parámetros IS-LM</h3>
            <Slider label="Gasto público (G)" value={vISLM.gastoPublico} min={0} max={300} step={5} onChange={(n) => setVISLM({ ...vISLM, gastoPublico: n })} />
            <Slider label="Impuestos (T)" value={vISLM.impuestos} min={0} max={150} step={5} onChange={(n) => setVISLM({ ...vISLM, impuestos: n })} />
            <Slider label="Oferta real de dinero (M/P)" value={vISLM.ofertaRealDinero} min={50} max={400} step={10} onChange={(n) => setVISLM({ ...vISLM, ofertaRealDinero: n })} />
            <Slider label="Sens. inversión a r (b)" value={vISLM.sensibilidadInversionTasa} min={10} max={120} step={5} onChange={(n) => setVISLM({ ...vISLM, sensibilidadInversionTasa: n })} />
            <Slider label="Sens. demanda dinero a Y (k)" value={vISLM.sensibilidadDemandaDineroRenta} min={0.1} max={1} step={0.05} onChange={(n) => setVISLM({ ...vISLM, sensibilidadDemandaDineroRenta: n })} />
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
                  <p className="text-xs font-semibold uppercase text-blue-600 dark:text-blue-400">Tasa de interés equilibrio r* (%)</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 font-mono">{resISLM.tasaEquilibrio}%</p>
                </div>
                <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-4">
                  <p className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">Inversión en equilibrio</p>
                  <p className="text-xl font-bold text-slate-900 dark:text-slate-100 font-mono">{resISLM.inversionEquilibrio}</p>
                </div>
                <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-4">
                  <p className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">Demanda de dinero (L)</p>
                  <p className="text-xl font-bold text-slate-900 dark:text-slate-100 font-mono">{resISLM.demandaDinero}</p>
                </div>
                <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                  <p className="text-xs font-semibold text-amber-800 dark:text-amber-200">Empleo</p>
                  <p className="text-sm text-slate-700 dark:text-slate-300">En el corto plazo keynesiano, un mayor Y* implica mayor producción y mayor demanda de trabajo; el empleo se mueve en la misma dirección que la renta de equilibrio.</p>
                </div>
              </>
            ) : (
              <p className="text-sm text-amber-600 dark:text-amber-400">Ajusta parámetros (por ejemplo sube M/P o baja h) para obtener un equilibrio con r &gt; 0.</p>
            )}
          </div>
        </div>

        {resISLM && datosGraficoISLMCombined.length > 0 && (
          <div className="mt-4">
            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">Gráfico IS-LM (eje X: Y, eje Y: r)</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={datosGraficoISLMCombined} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-600" />
                  <XAxis type="number" dataKey="Y" domain={["auto", "auto"]} tick={{ fontSize: 11 }} name="Y" />
                  <YAxis type="number" domain={["auto", "auto"]} tick={{ fontSize: 11 }} name="r (%)" />
                  <Tooltip formatter={(val: number) => [val?.toFixed(2) + "%", ""]} />
                  <ReferenceLine x={resISLM.rentaEquilibrio} stroke="#0ea5e9" strokeDasharray="4 4" />
                  <ReferenceLine y={resISLM.tasaEquilibrio} stroke="#0ea5e9" strokeDasharray="4 4" />
                  <Line type="monotone" dataKey="rIS" stroke="#2563eb" strokeWidth={2} dot={false} name="IS" />
                  <Line type="monotone" dataKey="rLM" stroke="#16a34a" strokeWidth={2} dot={false} name="LM" />
                  <Legend />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Cruce IS-LM: Y* = {resISLM.rentaEquilibrio}, r* = {resISLM.tasaEquilibrio}%.</p>
          </div>
        )}
      </section>

      {/* Conceptos */}
      <section className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 shadow-lg p-6">
        <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-2 flex items-center gap-2"><BookOpen className="w-4 h-4 text-slate-600 dark:text-slate-400" aria-hidden /> Conceptos</h3>
        <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-2">
          <li><strong className="text-slate-700 dark:text-slate-300">PMC:</strong> Propensión marginal a consumir; fracción del ingreso adicional que se consume.</li>
          <li><strong className="text-slate-700 dark:text-slate-300">Multiplicador del gasto:</strong> 1/(1−PMC). Un aumento de G o I eleva Y en esa proporción.</li>
          <li><strong className="text-slate-700 dark:text-slate-300">Multiplicador de impuestos:</strong> −PMC/(1−PMC). Un aumento de T reduce Y (efecto menor que el de ΔG en valor absoluto).</li>
          <li><strong className="text-slate-700 dark:text-slate-300">Presupuesto equilibrado:</strong> Si ΔG = ΔT, el efecto neto sobre Y es ΔG (multiplicador 1).</li>
          <li><strong className="text-slate-700 dark:text-slate-300">Curva IS:</strong> Combinaciones (Y, r) que equilibran el mercado de bienes. A mayor r, menor I y menor Y.</li>
          <li><strong className="text-slate-700 dark:text-slate-300">Curva LM:</strong> Combinaciones (Y, r) que equilibran el mercado de dinero (M/P = L(Y,r)). A mayor Y, mayor demanda de dinero y mayor r.</li>
          <li><strong className="text-slate-700 dark:text-slate-300">Mercado de dinero y empleo:</strong> Política monetaria (M↑) desplaza LM a la derecha: r baja, Y sube, más empleo. Política fiscal (G↑) desplaza IS a la derecha: Y sube, r sube.</li>
        </ul>
        <p className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-600 text-xs text-slate-500 dark:text-slate-400">
          Conceptos basados en Banco de México (Documentos de investigación), CIDE, El Trimestre Económico (FCE), Investigación Económica (UNAM) y manuales de macroeconomía. Consulta la sección «Referencias y fuentes para profundizar» al final de esta página.
        </p>
      </section>
    </div>
  );
}
