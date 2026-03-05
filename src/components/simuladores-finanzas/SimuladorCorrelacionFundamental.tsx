"use client";

import { useMemo, useState } from "react";
import { HelpCircle, FileDown, Save } from "lucide-react";
import { InstruccionesSimulador, LabelConAyuda } from "../InstruccionesSimulador";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ZAxis, LineChart, Line } from "recharts";
import { correlacionPearson, serieFundamental, seriePrecioCorrelacionada } from "@/lib/finanzas";
import { useSession } from "next-auth/react";
import PricingModal from "../PricingModal";

export default function SimuladorCorrelacionFundamental() {
  const { data: session } = useSession();
  const [showPricing, setShowPricing] = useState(false);
  const [exportando, setExportando] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [baseFundamental, setBaseFundamental] = useState(100);
  const [crecimientoPct, setCrecimientoPct] = useState(8);
  const [ruidoFundamental, setRuidoFundamental] = useState(5);
  const [precioBase, setPrecioBase] = useState(50);
  const [correlacion, setCorrelacion] = useState(0.7);
  const [ruidoPrecio, setRuidoPrecio] = useState(10);
  const [periodos, setPeriodos] = useState(24);

  const { fundamental, precios, r, datosScatter, datosSerie } = useMemo(() => {
    const f = serieFundamental(baseFundamental, crecimientoPct, ruidoFundamental, periodos);
    const p = seriePrecioCorrelacionada(f, precioBase, correlacion, ruidoPrecio);
    const r = correlacionPearson(f, p);
    const datosScatter = f.map((fund, i) => ({ fundamental: Math.round(fund * 100) / 100, precio: Math.round(p[i] * 100) / 100 }));
    const fMin = Math.min(...f), fMax = Math.max(...f), fR = fMax - fMin || 1;
    const pMin = Math.min(...p), pMax = Math.max(...p), pR = pMax - pMin || 1;
    const datosSerie = f.map((fund, i) => ({
      periodo: i + 1,
      fundamental: Math.round(fund * 100) / 100,
      precio: Math.round(p[i] * 100) / 100,
      fundamentalNorm: ((fund - fMin) / fR) * 100,
      precioNorm: ((p[i] - pMin) / pR) * 100,
    }));
    return { fundamental: f, precios: p, r, datosScatter, datosSerie };
  }, [baseFundamental, crecimientoPct, ruidoFundamental, precioBase, correlacion, ruidoPrecio, periodos]);

  const interpretacion =
    r >= 0.8
      ? "Correlación muy fuerte. El precio sigue de cerca al fundamental."
      : r >= 0.5
        ? "Correlación moderada. El precio refleja parcialmente el fundamental."
        : r >= 0.2
          ? "Correlación débil. Otros factores influyen más."
          : "Correlación muy baja o nula. El precio no parece seguir al fundamental.";

  const handleExport = async () => {
    if ((session?.user?.credits ?? 0) < 1) { setShowPricing(true); return; }
    setExportando(true);
    try {
      await import("@/lib/actions/exportActions").then((m) => m.registrarExportacion("Finanzas Correlación Fundamental", "PDF"));
      let chartUrl: string | null = null;
      try { chartUrl = await import("@/lib/exportarGrafico").then((m) => m.getGraficoAsDataUrl("grafico-correlacion-fundamental")); } catch (_) {}
      await import("@/lib/exportarFinanzasPdf").then((m) => m.exportarFinanzasAPdf({
        tipo: "CorrelacionFundamental",
        titulo: "Correlación fundamental–precio",
        variables: [
          { label: "Base fundamental", valor: String(baseFundamental) },
          { label: "Crecimiento %", valor: `${crecimientoPct}%` },
          { label: "Precio base", valor: String(precioBase) },
          { label: "Correlación", valor: correlacion.toFixed(2) },
          { label: "Periodos", valor: String(periodos) },
        ],
        resultados: [
          { label: "Coef. Pearson", valor: r.toFixed(3) },
          { label: "Interpretación", valor: interpretacion },
        ],
        chart: chartUrl ?? undefined,
      }));
    } catch (e) {
      if (String(e).includes("créditos")) setShowPricing(true);
      else alert("Error al exportar reporte");
    } finally { setExportando(false); }
  };

  const handleSave = async () => {
    if ((session?.user?.credits ?? 0) < 1) { setShowPricing(true); return; }
    setGuardando(true);
    try {
      const { saveScenario } = await import("@/lib/actions/scenarioActions");
      const res = await saveScenario({
        type: "FINANZAS",
        subType: "CORRELACION_FUNDAMENTAL",
        name: `Correlación fundamental ${new Date().toLocaleDateString()}`,
        variables: { baseFundamental, crecimientoPct, ruidoFundamental, precioBase, correlacion, ruidoPrecio, periodos },
        results: { r, interpretacion },
      });
      if (res.success) alert("Escenario guardado");
      else alert(res.error);
    } catch (e) { alert("Error al guardar"); } finally { setGuardando(false); }
  };

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 shadow-lg p-6">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Correlación fundamental–precio</h3>
        <div className="flex gap-2">
          <button type="button" onClick={handleExport} disabled={exportando} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-900 dark:bg-slate-700 text-white hover:bg-slate-800 dark:hover:bg-slate-600 transition-all shadow-md active:scale-95 disabled:opacity-50">
            <FileDown className="w-3.5 h-3.5" />
            {exportando ? "Generando..." : "Reporte PDF"}
          </button>
          {session && (
            <button type="button" onClick={handleSave} disabled={guardando} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold bg-blue-600 text-white hover:bg-blue-500 transition-all shadow-md active:scale-95 disabled:opacity-50">
              <Save className="w-3.5 h-3.5" />
              {guardando ? "Guardando..." : "Guardar"}
            </button>
          )}
        </div>
      </div>
      <p className="text-xs text-slate-600 dark:text-slate-400 mb-4">
        Genera una serie de fundamental (ej. utilidades) y otra de precios. Observa si el precio &quot;sigue&quot; al fundamental según la correlación.
      </p>

      <InstruccionesSimulador>
        <p>Este simulador genera datos sintéticos para explorar la relación entre un indicador fundamental (ej. utilidades, ventas) y el precio de un activo.</p>
        <ul className="list-disc list-inside space-y-1 ml-1">
          <li><strong>Base fundamental:</strong> Valor inicial del indicador (ej. 100 millones de utilidad).</li>
          <li><strong>Crecimiento %:</strong> Tasa de crecimiento anual del fundamental.</li>
          <li><strong>Ruido:</strong> Variación aleatoria que simula la realidad (no todo es predecible).</li>
          <li><strong>Correlación:</strong> Qué tan ligado está el precio al fundamental. 1 = sigue perfectamente; 0 = no hay relación.</li>
        </ul>
        <p>El <strong>gráfico de dispersión</strong> muestra cada punto (fundamental, precio). Si hay correlación alta, los puntos forman una nube alargada. El <strong>gráfico de evolución</strong> compara ambas series en el tiempo (normalizadas 0–100).</p>
      </InstruccionesSimulador>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div>
          <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">
            <LabelConAyuda label="Base fundamental" tooltip="Valor inicial del indicador fundamental (ej. utilidad neta, ventas). Representa el nivel de partida en el periodo 0." />
          </label>
          <input
            type="number"
            min="10"
            value={baseFundamental}
            onChange={(e) => setBaseFundamental(Math.max(10, Number(e.target.value) || 0))}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-mono text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">
            <LabelConAyuda label="Crecimiento % anual" tooltip="Tasa de crecimiento anual del fundamental. Positivo = la empresa crece; negativo = decrece. Valores típicos: 5–15%." />
          </label>
          <input
            type="number"
            min="-20"
            max="50"
            step="1"
            value={crecimientoPct}
            onChange={(e) => setCrecimientoPct(Number(e.target.value) || 0)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-mono text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">
            <LabelConAyuda label="Ruido fundamental %" tooltip="Variación aleatoria añadida al fundamental. Simula eventos impredecibles (crisis, estacionalidad). 0 = perfectamente predecible; 10–20% = realista." />
          </label>
          <input
            type="number"
            min="0"
            max="30"
            step="1"
            value={ruidoFundamental}
            onChange={(e) => setRuidoFundamental(Math.max(0, Math.min(30, Number(e.target.value) || 0)))}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-mono text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">
            <LabelConAyuda label="Precio base" tooltip="Precio inicial del activo en el periodo 0. Es el punto de partida de la serie de precios." />
          </label>
          <input
            type="number"
            min="1"
            value={precioBase}
            onChange={(e) => setPrecioBase(Math.max(1, Number(e.target.value) || 0))}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-mono text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">
            <LabelConAyuda label="Correlación (0–1)" tooltip="Grado de relación entre fundamental y precio. 1 = el precio sigue al fundamental casi perfectamente; 0 = no hay relación (precio aleatorio). Valores típicos: 0.5–0.8." />
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={correlacion}
            onChange={(e) => setCorrelacion(Number(e.target.value))}
            className="w-full"
          />
          <p className="text-xs text-slate-500 mt-0.5">{correlacion.toFixed(2)}</p>
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">
            <LabelConAyuda label="Ruido precio %" tooltip="Variación aleatoria del precio no explicada por el fundamental. Simula rumores, liquidez, sentimiento. Mayor ruido = menor correlación observable." />
          </label>
          <input
            type="number"
            min="0"
            max="30"
            step="1"
            value={ruidoPrecio}
            onChange={(e) => setRuidoPrecio(Math.max(0, Math.min(30, Number(e.target.value) || 0)))}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-mono text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">
            <LabelConAyuda label="Periodos" tooltip="Número de observaciones en el tiempo (ej. 24 = 2 años de datos mensuales). Más periodos dan una correlación más estable." />
          </label>
          <input
            type="number"
            min="6"
            max="60"
            value={periodos}
            onChange={(e) => setPeriodos(Math.max(6, Math.min(60, Number(e.target.value) || 6)))}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-mono text-sm"
          />
        </div>
      </div>

      <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 mb-6">
        <p className="text-xs font-bold text-indigo-700 dark:text-indigo-400 uppercase mb-1 flex items-center gap-1">
          Coeficiente de correlación de Pearson
          <span title="Mide la relación lineal entre fundamental y precio. Va de -1 (inversa) a +1 (directa). 0 = sin relación." className="cursor-help">
            <HelpCircle className="w-3.5 h-3.5 text-indigo-400" />
          </span>
        </p>
        <p className="text-3xl font-black text-slate-900 dark:text-white">{r.toFixed(3)}</p>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">{interpretacion}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2 flex items-center gap-1">
            Dispersión: fundamental vs precio
            <span title="Cada punto es un periodo. Si hay correlación, los puntos forman una nube alargada (no circular)." className="cursor-help">
              <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
            </span>
          </p>
          <div id="grafico-correlacion-fundamental" className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 8, right: 8, left: 8, bottom: 24 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-600" />
                <XAxis type="number" dataKey="fundamental" name="Fundamental" tick={{ fontSize: 10 }} />
                <YAxis type="number" dataKey="precio" name="Precio" tick={{ fontSize: 10 }} />
                <ZAxis range={[50, 200]} />
                <Tooltip cursor={{ strokeDasharray: "3 3" }} formatter={(v: number) => [`${v.toFixed(2)}`, ""]} />
                <Scatter data={datosScatter} fill="#3b82f6" fillOpacity={0.6} />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div>
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2 flex items-center gap-1">
            Evolución (normalizado 0–100)
            <span title="Ambas series escaladas a 0–100 para comparar la forma. Si se mueven juntas, hay correlación." className="cursor-help">
              <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
            </span>
          </p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={datosSerie} margin={{ top: 8, right: 8, left: 8, bottom: 24 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-600" />
                <XAxis dataKey="periodo" tick={{ fontSize: 10 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
                <Tooltip formatter={(v: number) => [v.toFixed(1), ""]} />
                <Line type="monotone" dataKey="fundamentalNorm" name="Fundamental" stroke="#94a3b8" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="precioNorm" name="Precio" stroke="#3b82f6" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      <PricingModal isOpen={showPricing} onClose={() => setShowPricing(false)} />
    </div>
  );
}
