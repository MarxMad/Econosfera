"use client";

import { useMemo, useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Legend, Area } from "recharts";
import type { VariablesMercado, VariablesElasticidad } from "@/lib/micro";
import { TrendingDown, Download, Ruler, BookOpen } from "lucide-react";
import { calcularMercado, calcularElasticidadArco } from "@/lib/micro";
import { exportarGraficoComoPNG } from "@/lib/exportarGrafico";

const INICIAL_MERCADO: VariablesMercado = {
  demandaIntercepto: 100,
  demandaPendiente: 2,
  ofertaIntercepto: 10,
  ofertaPendiente: 1.5,
};

const INICIAL_ELAST: VariablesElasticidad = {
  precioInicial: 10,
  precioFinal: 12,
  cantidadInicial: 100,
  cantidadFinal: 80,
};

const HINTS: Record<string, string> = {
  demandaIntercepto: "Subir (a) desplaza la demanda hacia arriba → P* y Q* suelen subir.",
  demandaPendiente: "Pendiente (b) más alta = demanda más inclinada → Q* baja.",
  ofertaIntercepto: "Subir (c) desplaza la oferta hacia arriba → P* sube, Q* baja.",
  ofertaPendiente: "Pendiente (d) más alta = oferta más inclinada → P* sube.",
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
  hint,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  hint?: string;
  onChange: (n: number) => void;
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
      <div className="flex justify-between items-center gap-2 flex-wrap">
        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</span>
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
          className="min-w-[5rem] w-20 px-2 py-0.5 text-right text-sm font-mono font-semibold rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 tabular-nums focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label={`${label} (valor manual)`}
        />
      </div>
      <input
        type="range"
        min={rangeMin}
        max={rangeMax}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2.5 rounded-lg appearance-none cursor-pointer bg-slate-200 dark:bg-slate-700 accent-blue-600"
      />
      {hint && <p className="text-xs text-slate-500 dark:text-slate-400">{hint}</p>}
    </div>
  );
}

import { useSession } from "next-auth/react";

import {
  SimuladorTeoriaJuegos,
  SimuladorEstructurasMercado,
  SimuladorElasticidad
} from "./simuladores-micro";

export default function SimuladorMicro({ initialData }: { initialData?: any }) {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState<"mercado" | "estructuras" | "juegos" | "elasticidad">("mercado");
  const [mercado, setMercado] = useState<VariablesMercado>(INICIAL_MERCADO);
  const [baselineMercado, setBaselineMercado] = useState<VariablesMercado>(INICIAL_MERCADO);
  const [elasticidad, setElasticidad] = useState<VariablesElasticidad>(INICIAL_ELAST);

  useEffect(() => {
    if (initialData?.data?.mercado) setMercado(initialData.data.mercado);
    if (initialData?.data?.elasticidad) setElasticidad(initialData.data.elasticidad);
  }, [initialData]);
  const [exportando, setExportando] = useState(false);

  const resMercado = useMemo(() => calcularMercado(mercado), [mercado]);
  const resMercadoBase = useMemo(() => calcularMercado(baselineMercado), [baselineMercado]);
  const resElast = useMemo(() => calcularElasticidadArco(elasticidad), [elasticidad]);

  const shiftDemanda = mercado.demandaIntercepto !== baselineMercado.demandaIntercepto || mercado.demandaPendiente !== baselineMercado.demandaPendiente;
  const shiftOferta = mercado.ofertaIntercepto !== baselineMercado.ofertaIntercepto || mercado.ofertaPendiente !== baselineMercado.ofertaPendiente;

  const exportarReporte = async () => {
    setExportando(true);
    try {
      const { registrarExportacion } = await import("@/lib/actions/exportActions");
      await registrarExportacion("Simulador Micro", "PDF");

      const { exportarMicroAPdf } = await import("@/lib/exportarMicroPdf");
      const { getGraficoAsDataUrl } = await import("@/lib/exportarGrafico");
      let chartMercado = null;
      try {
        chartMercado = await getGraficoAsDataUrl("grafico-oferta-demanda");
      } catch (e) { }

      await exportarMicroAPdf({
        mercado: { v: mercado, res: resMercado, chart: chartMercado },
        elasticidad: { v: elasticidad, res: resElast }
      });
    } catch (error) {
      console.error("Error al exportar reporte:", error);
      alert("No se pudo exportar el reporte profesional. Intenta de nuevo.");
    } finally {
      setExportando(false);
    }
  };

  const datosCurvas = useMemo(() => {
    if (!resMercado) return [];

    const qMax = Math.max(60, resMercado.cantidadEquilibrio * 2, (mercado.demandaIntercepto / mercado.demandaPendiente) * 0.95);
    const step = qMax / 80;
    const arr = [];
    const qEquilibrio = resMercado.cantidadEquilibrio;
    const pEquilibrio = resMercado.precioEquilibrio;

    for (let q = 0; q <= qMax + step; q += step) {
      const pd = Math.max(0, mercado.demandaIntercepto - mercado.demandaPendiente * q);
      const ps = mercado.ofertaIntercepto + mercado.ofertaPendiente * q;

      const pdBase = Math.max(0, baselineMercado.demandaIntercepto - baselineMercado.demandaPendiente * q);
      const psBase = baselineMercado.ofertaIntercepto + baselineMercado.ofertaPendiente * q;

      const ec = q <= qEquilibrio ? Math.max(0, pd - pEquilibrio) : 0;
      const ep = q <= qEquilibrio ? Math.max(0, pEquilibrio - ps) : 0;

      arr.push({
        q: Math.round(q * 100) / 100,
        pd,
        ps,
        pdBase,
        psBase,
        ec,
        ep,
      });
    }
    return arr;
  }, [mercado, resMercado, baselineMercado]);

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      {/* Hero */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-slate-900 dark:to-slate-900 p-8 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 text-emerald-500">
          <TrendingDown className="w-24 h-24" />
        </div>
        <div className="relative z-10">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-3 flex items-center gap-3">
            <Ruler className="text-emerald-500 w-8 h-8" />
            Microeconomía
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm max-w-2xl italic">
            Analiza el comportamiento de agentes individuales: oferta y demanda, cálculo de elasticidades, comportamiento estratégico con Teoría de Juegos y principales estructuras de mercado.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl w-fit">
        {[
          { id: "mercado", label: "Oferta y Demanda" },
          { id: "estructuras", label: "Estructuras de Mercado" },
          { id: "juegos", label: "Teoría de Juegos" },
          { id: "elasticidad", label: "Elasticidad" },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === t.id
              ? "bg-white dark:bg-slate-700 text-emerald-600 shadow-sm"
              : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === "mercado" && (
        <>
          {/* Mercado: oferta y demanda */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 lg:p-8 border border-slate-200 dark:border-slate-800 shadow-xl">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2 flex items-center gap-2">
              <TrendingDown className="w-5 h-5 text-slate-600 dark:text-slate-400" aria-hidden />
              Oferta y demanda (equilibrio y excedentes)
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
              Mueve los parámetros y observa cómo cambian las curvas y el punto de equilibrio (P*, Q*) en el gráfico.
            </p>

            {/* Explicación intercepto y pendiente */}
            <details className="mb-4 rounded-xl border border-slate-200 dark:border-slate-600 bg-blue-50/50 dark:bg-blue-900/20 overflow-hidden">
              <summary className="px-4 py-3 cursor-pointer font-semibold text-slate-800 dark:text-slate-100 hover:bg-blue-100/50 dark:hover:bg-blue-900/30">
                ¿Qué son “intercepto” y “pendiente”?
              </summary>
              <div className="px-4 pb-4 pt-0 text-sm text-slate-600 dark:text-slate-400 space-y-3">
                <div>
                  <p className="font-semibold text-blue-800 dark:text-blue-300">Intercepto de la demanda (a)</p>
                  <p>Es el <strong>precio máximo</strong> que los consumidores estarían dispuestos a pagar por la primera unidad. En el gráfico es donde la curva de demanda toca el eje vertical (eje de precios). Si subes (a), toda la curva de demanda se mueve hacia arriba.</p>
                </div>
                <div>
                  <p className="font-semibold text-blue-800 dark:text-blue-300">Pendiente de la demanda (b)</p>
                  <p>Es <strong>cuánto baja el precio</strong> por cada unidad adicional que se vende. No es un precio, sino “qué tan inclinada” es la curva: (b) grande = curva muy inclinada (el precio cae rápido al aumentar la cantidad); (b) pequeño = curva más plana (el precio casi no cambia).</p>
                </div>
                <div>
                  <p className="font-semibold text-emerald-800 dark:text-emerald-300">Intercepto de la oferta (c)</p>
                  <p>Es el <strong>precio mínimo</strong> al que los productores venderían la primera unidad. En el gráfico es donde la curva de oferta toca el eje vertical. Si subes (c), toda la oferta se mueve hacia arriba.</p>
                </div>
                <div>
                  <p className="font-semibold text-emerald-800 dark:text-emerald-300">Pendiente de la oferta (d)</p>
                  <p>Es <strong>cuánto sube el precio</strong> por cada unidad adicional que los productores ofrecen. (d) grande = oferta muy inclinada (hay que pagar mucho más para que ofrezcan más); (d) pequeño = oferta más plana.</p>
                </div>
              </div>
            </details>

            {/* Ecuaciones actuales */}
            <div className="mb-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-600">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Ecuaciones con los valores actuales:</p>
              <p className="font-mono text-base text-blue-700 dark:text-blue-300">
                Demanda: P = {mercado.demandaIntercepto} − {mercado.demandaPendiente}·Q &nbsp; <span className="text-xs font-normal text-slate-500">(precio máx − inclinación × Q)</span>
              </p>
              <p className="font-mono text-base text-emerald-700 dark:text-emerald-300 mt-0.5">
                Oferta: P = {mercado.ofertaIntercepto} + {mercado.ofertaPendiente}·Q &nbsp; <span className="text-xs font-normal text-slate-500">(precio mín + inclinación × Q)</span>
              </p>
            </div>

            {/* Gráfico primero para que se vea el efecto al mover */}
            {resMercado && datosCurvas.length > 0 && (
              <div className="mb-6">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-2">
                  <div className="flex items-center gap-3">
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Gráfico: precio vs cantidad</p>
                    <button
                      type="button"
                      onClick={() => setBaselineMercado(mercado)}
                      className="text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                    >
                      Fijar Escenario Base
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={exportarReporte}
                      disabled={exportando}
                      className="px-4 py-2 text-sm font-bold text-white bg-slate-900 dark:bg-slate-700 rounded-xl hover:bg-slate-800 dark:hover:bg-slate-600 transition-all shadow-md active:scale-95 disabled:opacity-50"
                    >
                      {exportando ? "Generando..." : <><Download className="w-4 h-4 inline mr-2" /> Reporte PDF</>}
                    </button>
                    {session && (
                      <button
                        type="button"
                        onClick={async () => {
                          const { saveScenario } = await import("@/lib/actions/scenarioActions");
                          const resSave = await saveScenario({
                            type: "MICRO",
                            name: `Simulación Micro ${new Date().toLocaleDateString()}`,
                            variables: { mercado, elasticidad },
                            results: { resMercado, resElast },
                          });
                          if (resSave.success) alert("Escenario guardado");
                          else alert(resSave.error);
                        }}
                        className="px-4 py-2 text-sm font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-500 transition-all shadow-md active:scale-95"
                      >
                        Guardar
                      </button>
                    )}
                  </div>
                </div>
                <div id="grafico-oferta-demanda" className="h-80 rounded-xl bg-slate-50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-600 p-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={datosCurvas}
                      margin={{ top: 12, right: 12, left: 8, bottom: 8 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-600" />
                      <XAxis
                        dataKey="q"
                        type="number"
                        domain={[0, Math.ceil(Math.max(60, resMercado.cantidadEquilibrio * 2) / 10) * 10]}
                        tick={{ fontSize: 11 }}
                        label={{ value: "Cantidad (Q)", position: "insideBottom", offset: -4, fontSize: 12 }}
                      />
                      <YAxis
                        domain={[0, Math.ceil(Math.max(120, (resMercado?.precioEquilibrio ?? 50) * 1.3, mercado.demandaIntercepto * 1.1) / 20) * 20]}
                        tick={{ fontSize: 11 }}
                        label={{ value: "Precio (P)", angle: -90, position: "insideLeft", fontSize: 12 }}
                      />
                      <Tooltip
                        formatter={(val: number, name: string) => [val.toFixed(2), name.includes("Base") ? `${name} (Base)` : name]}
                        labelFormatter={(q) => `Q = ${Number(q).toFixed(2)}`}
                      />

                      {/* Equilibrio Actual */}
                      <ReferenceLine x={resMercado.cantidadEquilibrio} stroke="#0ea5e9" strokeDasharray="4 4" strokeWidth={2} label={{ value: 'Actual', position: 'top', fontSize: 10, fill: '#0ea5e9' }} />
                      <ReferenceLine y={resMercado.precioEquilibrio} stroke="#0ea5e9" strokeDasharray="4 4" strokeWidth={2} />

                      {/* Líneas Base si hay cambio */}
                      {(shiftDemanda || shiftOferta) && resMercadoBase && (
                        <>
                          <ReferenceLine x={resMercadoBase.cantidadEquilibrio} stroke="#94a3b8" strokeDasharray="2 2" label={{ value: 'Base', position: 'top', fontSize: 10, fill: '#94a3b8' }} />
                          <Line type="monotone" dataKey="pdBase" stroke="#2563eb" strokeWidth={1} strokeDasharray="5 5" dot={false} name="Demanda (Base)" opacity={0.3} />
                          <Line type="monotone" dataKey="psBase" stroke="#16a34a" strokeWidth={1} strokeDasharray="5 5" dot={false} name="Oferta (Base)" opacity={0.3} />
                        </>
                      )}

                      {/* Excedentes */}
                      <Area type="monotone" dataKey="ec" stackId="1" stroke="none" fill="#3b82f6" fillOpacity={0.2} name="Excedente consumidor" />
                      <Area type="monotone" dataKey="ep" stackId="2" stroke="none" fill="#16a34a" fillOpacity={0.2} name="Excedente productor" />

                      <Line type="monotone" dataKey="pd" stroke="#2563eb" strokeWidth={2.5} dot={false} name="Demanda" />
                      <Line type="monotone" dataKey="ps" stroke="#16a34a" strokeWidth={2.5} dot={false} name="Oferta" />
                      <Legend />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <Slider label="Demanda — Intercepto (a)" value={mercado.demandaIntercepto} min={20} max={150} step={5} onChange={(n) => setMercado({ ...mercado, demandaIntercepto: n })} />
                <Slider label="Demanda — Pendiente (b)" value={mercado.demandaPendiente} min={0.5} max={5} step={0.1} onChange={(n) => setMercado({ ...mercado, demandaPendiente: n })} />
                <Slider label="Oferta — Intercepto (c)" value={mercado.ofertaIntercepto} min={0} max={80} step={2} onChange={(n) => setMercado({ ...mercado, ofertaIntercepto: n })} />
                <Slider label="Oferta — Pendiente (d)" value={mercado.ofertaPendiente} min={0.2} max={4} step={0.1} onChange={(n) => setMercado({ ...mercado, ofertaPendiente: n })} />
              </div>
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">Resultados Equilibrio</h3>
                {resMercado && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/30">
                      <p className="text-xs font-bold text-blue-600">P*</p>
                      <p className="text-xl font-black">{resMercado.precioEquilibrio.toFixed(2)}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/30">
                      <p className="text-xs font-bold text-emerald-600">Q*</p>
                      <p className="text-xl font-black">{resMercado.cantidadEquilibrio.toFixed(2)}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Elasticidad arco antigua se queda aqui o como tab aparte.
              Para consistencia la dejamos como tab aparte 'elasticidad' o integrada abajo.
          */}
        </>
      )}

      {activeTab === "estructuras" && <SimuladorEstructurasMercado />}
      {activeTab === "juegos" && <SimuladorTeoriaJuegos />}
      {activeTab === "elasticidad" && (
        <div className="space-y-6">
          <SimuladorElasticidad />
          {/* Conservamos la calculadora de arco original por precision academica */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 lg:p-8 border border-slate-200 dark:border-slate-800 shadow-xl">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
              <Ruler className="w-5 h-5 text-slate-600 dark:text-slate-400" aria-hidden /> Calculadora de Elasticidad Arco
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <Slider label="Precio inicial" value={elasticidad.precioInicial} min={1} max={50} step={1} onChange={(n) => setElasticidad({ ...elasticidad, precioInicial: n })} />
                <Slider label="Precio final" value={elasticidad.precioFinal} min={1} max={50} step={1} onChange={(n) => setElasticidad({ ...elasticidad, precioFinal: n })} />
                <Slider label="Cantidad inicial" value={elasticidad.cantidadInicial} min={10} max={200} step={5} onChange={(n) => setElasticidad({ ...elasticidad, cantidadInicial: n })} />
                <Slider label="Cantidad final" value={elasticidad.cantidadFinal} min={10} max={200} step={5} onChange={(n) => setElasticidad({ ...elasticidad, cantidadFinal: n })} />
              </div>
              <div className="space-y-3">
                <div className="rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/30 p-4">
                  <p className="text-xs font-semibold uppercase text-blue-600 dark:text-blue-400">Elasticidad arco</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 font-mono">{resElast.elasticidadArco}</p>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400">{resElast.interpretacion}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 lg:p-8 border border-slate-200 dark:border-slate-800 shadow-xl">
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-slate-600 dark:text-slate-400" aria-hidden /> Conceptos Fundamentales
        </h3>
        <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-2">
          <li><strong className="text-slate-700 dark:text-slate-300">Eficiencia Paretiana:</strong> Situación donde no se puede mejorar a nadie sin perjudicar a otro. En Monopolio no se cumple por la Pérdida Social.</li>
          <li><strong className="text-slate-700 dark:text-slate-300">Equilibrio de Nash:</strong> Estrategia óptima dada la estrategia de los demás.</li>
          <li><strong className="text-slate-700 dark:text-slate-300">Elasticidad Unitaria:</strong> Punto donde el ingreso total es máximo.</li>
        </ul>
      </div>
    </div>
  );
}
