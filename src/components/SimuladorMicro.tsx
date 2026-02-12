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
          className="w-14 px-2 py-0.5 text-right text-sm font-mono font-semibold rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 tabular-nums focus:outline-none focus:ring-2 focus:ring-blue-500"
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

export default function SimuladorMicro() {
  const [mercado, setMercado] = useState<VariablesMercado>(INICIAL_MERCADO);
  const [elasticidad, setElasticidad] = useState<VariablesElasticidad>(INICIAL_ELAST);
  const [exportando, setExportando] = useState(false);

  const exportarGrafico = async (id: string, nombre: string) => {
    setExportando(true);
    try {
      await exportarGraficoComoPNG(id, nombre);
    } catch (error) {
      console.error("Error al exportar gráfico:", error);
      alert("No se pudo exportar el gráfico. Intenta de nuevo.");
    } finally {
      setExportando(false);
    }
  };

  const resMercado = useMemo(() => calcularMercado(mercado), [mercado]);
  const resElast = useMemo(() => calcularElasticidadArco(elasticidad), [elasticidad]);

  const datosCurvas = useMemo(() => {
    if (!resMercado) return [];
    const a = mercado.demandaIntercepto;
    const b = mercado.demandaPendiente;
    const c = mercado.ofertaIntercepto;
    const d = mercado.ofertaPendiente;
    const qDemandaCero = a / b;
    const qMax = Math.max(60, resMercado.cantidadEquilibrio * 2, qDemandaCero * 0.95);
    const step = qMax / 80;
    const arr = [];
    const qEquilibrio = resMercado.cantidadEquilibrio;
    const pEquilibrio = resMercado.precioEquilibrio;
    
    for (let q = 0; q <= qMax + step; q += step) {
      const pd = Math.max(0, a - b * q);
      const ps = c + d * q;
      // Para el área del excedente del consumidor: desde q=0 hasta q=Q*, desde P* hasta la demanda
      const excedenteConsumidor = q <= qEquilibrio ? Math.max(0, pd - pEquilibrio) : 0;
      // Para el área del excedente del productor: desde q=0 hasta q=Q*, desde la oferta hasta P*
      const excedenteProductor = q <= qEquilibrio ? Math.max(0, pEquilibrio - ps) : 0;
      arr.push({ 
        q: Math.round(q * 100) / 100, 
        pd, 
        ps,
        ec: excedenteConsumidor,
        ep: excedenteProductor,
      });
    }
    return arr;
  }, [mercado, resMercado]);

  const dominioQ = useMemo(() => {
    if (!resMercado) return [0, 60];
    const qMax = Math.max(60, resMercado.cantidadEquilibrio * 2, (mercado.demandaIntercepto / mercado.demandaPendiente) * 1.05);
    return [0, Math.ceil(qMax / 10) * 10];
  }, [resMercado, mercado]);

  const dominioP = useMemo(() => {
    const pMax = Math.max(120, (resMercado?.precioEquilibrio ?? 50) * 1.3, mercado.demandaIntercepto * 1.1);
    return [0, Math.ceil(pMax / 20) * 20];
  }, [resMercado, mercado]);

  return (
    <div className="space-y-6">
      {/* Mercado: oferta y demanda */}
      <section className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 shadow-lg p-6">
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2 flex items-center gap-2">
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
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Gráfico: precio (eje Y) vs cantidad (eje X)</p>
              <button
                type="button"
                onClick={() => exportarGrafico("grafico-oferta-demanda", "oferta-demanda.png")}
                disabled={exportando}
                className="px-2 py-1 text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 rounded hover:bg-blue-100 dark:hover:bg-blue-900/30 disabled:opacity-50 transition-colors"
              >
                {exportando ? "..." : <><Download className="w-3.5 h-3.5 inline mr-1" /> Exportar</>}
              </button>
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
                    domain={dominioQ}
                    tick={{ fontSize: 11 }}
                    label={{ value: "Cantidad (Q)", position: "insideBottom", offset: -4, fontSize: 12 }}
                  />
                  <YAxis
                    domain={dominioP}
                    tick={{ fontSize: 11 }}
                    label={{ value: "Precio (P)", angle: -90, position: "insideLeft", fontSize: 12 }}
                  />
                  <Tooltip
                    formatter={(val: number, name: string) => [val.toFixed(2), name === "pd" ? "Demanda" : "Oferta"]}
                    labelFormatter={(q) => `Q = ${Number(q).toFixed(2)}`}
                  />
                  <ReferenceLine
                    x={resMercado.cantidadEquilibrio}
                    stroke="#0ea5e9"
                    strokeDasharray="4 4"
                    strokeWidth={2}
                  />
                  <ReferenceLine
                    y={resMercado.precioEquilibrio}
                    stroke="#0ea5e9"
                    strokeDasharray="4 4"
                    strokeWidth={2}
                  />
                  {/* Excedente del consumidor: área bajo demanda y sobre P* */}
                  <Area
                    type="monotone"
                    dataKey="ec"
                    stackId="1"
                    stroke="none"
                    fill="#3b82f6"
                    fillOpacity={0.2}
                    name="Excedente consumidor"
                  />
                  {/* Excedente del productor: área sobre oferta y bajo P* */}
                  <Area
                    type="monotone"
                    dataKey="ep"
                    stackId="2"
                    stroke="none"
                    fill="#16a34a"
                    fillOpacity={0.2}
                    name="Excedente productor"
                  />
                  <Line type="monotone" dataKey="pd" stroke="#2563eb" strokeWidth={2.5} dot={false} name="Demanda" />
                  <Line type="monotone" dataKey="ps" stroke="#16a34a" strokeWidth={2.5} dot={false} name="Oferta" />
                  <Legend />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Las líneas punteadas marcan el equilibrio: P* = {resMercado.precioEquilibrio.toFixed(2)}, Q* = {resMercado.cantidadEquilibrio.toFixed(2)}.
              <br />
              <span className="text-blue-600 dark:text-blue-400">Área azul</span> = Excedente del consumidor. <span className="text-emerald-600 dark:text-emerald-400">Área verde</span> = Excedente del productor.
            </p>
          </div>
        )}

        {!resMercado && (
          <div className="mb-6 p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
            <p className="text-sm text-amber-800 dark:text-amber-200">
              No hay equilibrio con estos valores. El intercepto de demanda (a) debe ser mayor que el de oferta (c). Sube (a) o baja (c) para ver el gráfico.
            </p>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">Controles (mueve y mira el gráfico)</h3>
            <Slider
              label="Demanda — Precio máximo (a)"
              value={mercado.demandaIntercepto}
              min={20}
              max={150}
              step={5}
              hint="Precio máximo que pagarían por la 1ª unidad. Subir (a) = curva demanda hacia arriba."
              onChange={(n) => setMercado({ ...mercado, demandaIntercepto: n })}
            />
            <Slider
              label="Demanda — Inclinación (b)"
              value={mercado.demandaPendiente}
              min={0.5}
              max={5}
              step={0.1}
              hint="Cuánto baja P por cada unidad más. (b) alto = curva más inclinada."
              onChange={(n) => setMercado({ ...mercado, demandaPendiente: n })}
            />
            <Slider
              label="Oferta — Precio mínimo (c)"
              value={mercado.ofertaIntercepto}
              min={0}
              max={80}
              step={2}
              hint="Precio mínimo para vender la 1ª unidad. Subir (c) = curva oferta hacia arriba."
              onChange={(n) => setMercado({ ...mercado, ofertaIntercepto: n })}
            />
            <Slider
              label="Oferta — Inclinación (d)"
              value={mercado.ofertaPendiente}
              min={0.2}
              max={4}
              step={0.1}
              hint="Cuánto sube P por cada unidad más ofrecida. (d) alto = oferta más inclinada."
              onChange={(n) => setMercado({ ...mercado, ofertaPendiente: n })}
            />
          </div>
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">Resultados</h3>
            {resMercado ? (
              <>
                <div className="rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/30 p-4">
                  <p className="text-xs font-semibold uppercase text-blue-600 dark:text-blue-400">P* (precio equilibrio)</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 font-mono">{resMercado.precioEquilibrio.toFixed(2)}</p>
                </div>
                <div className="rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/30 p-4">
                  <p className="text-xs font-semibold uppercase text-blue-600 dark:text-blue-400">Q* (cantidad equilibrio)</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 font-mono">{resMercado.cantidadEquilibrio.toFixed(2)}</p>
                </div>
                <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-4">
                  <p className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">Excedente consumidor</p>
                  <p className="text-xl font-bold text-slate-900 dark:text-slate-100 font-mono">{resMercado.excedenteConsumidor.toFixed(2)}</p>
                </div>
                <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-4">
                  <p className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">Excedente productor</p>
                  <p className="text-xl font-bold text-slate-900 dark:text-slate-100 font-mono">{resMercado.excedenteProductor.toFixed(2)}</p>
                </div>
                <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-4">
                  <p className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">Elasticidad precio demanda (en equilibrio)</p>
                  <p className="text-xl font-bold text-slate-900 dark:text-slate-100 font-mono">{resMercado.elasticidadPrecioDemanda.toFixed(2)}</p>
                </div>
              </>
            ) : (
              <p className="text-sm text-amber-600 dark:text-amber-400">Ajusta los controles para que exista equilibrio (a &gt; c).</p>
            )}
          </div>
        </div>
      </section>

      {/* Elasticidad arco */}
      <section className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 shadow-lg p-6">
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
          <Ruler className="w-5 h-5 text-slate-600 dark:text-slate-400" aria-hidden /> Elasticidad precio de la demanda (arco)
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
          ε = (ΔQ/Q_medio) / (ΔP/P_medio). |ε| &gt; 1 elástica, |ε| &lt; 1 inelástica, |ε| = 1 unitaria.
        </p>
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
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-4">
              <p className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">Tipo</p>
              <p className="text-lg font-bold text-slate-900 dark:text-slate-100 capitalize">{resElast.tipo}</p>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">{resElast.interpretacion}</p>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 shadow-lg p-6">
        <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-2 flex items-center gap-2"><BookOpen className="w-4 h-4 text-slate-600 dark:text-slate-400" aria-hidden /> Conceptos</h3>
        <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-2">
          <li><strong className="text-slate-700 dark:text-slate-300">Excedente del consumidor:</strong> Diferencia entre lo que está dispuesto a pagar y lo que paga (área bajo la demanda y sobre P*).</li>
          <li><strong className="text-slate-700 dark:text-slate-300">Excedente del productor:</strong> Diferencia entre el precio y el coste mínimo al que vendería (área sobre la oferta y bajo P*).</li>
          <li><strong className="text-slate-700 dark:text-slate-300">Elasticidad arco:</strong> (ΔQ/Q_medio)/(ΔP/P_medio). Mide la sensibilidad de la cantidad al precio en un tramo.</li>
        </ul>
        <p className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-600 text-xs text-slate-500 dark:text-slate-400">
          Conceptos basados en Banco de México (Documentos de investigación), CIDE, El Trimestre Económico (FCE), Investigación Económica (UNAM) y manuales de microeconomía. Consulta la sección «Referencias y fuentes para profundizar» al final de esta página.
        </p>
      </section>
    </div>
  );
}
