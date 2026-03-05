"use client";

import { useMemo, useState } from "react";
import { Newspaper, TrendingUp, TrendingDown, HelpCircle, Info, FileDown, Save } from "lucide-react";
import { InstruccionesSimulador, LabelConAyuda } from "../InstruccionesSimulador";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { impactoNoticias } from "@/lib/finanzas";
import { useSession } from "next-auth/react";
import PricingModal from "../PricingModal";

const TIPOS_EVENTO = [
  { id: "earnings", label: "Earnings (EPS)", unidad: "USD", ejExpectativa: 2.5, ejReal: 2.8 },
  { id: "pib", label: "PIB", unidad: "%", ejExpectativa: 2.5, ejReal: 3.2 },
  { id: "inflacion", label: "Inflación", unidad: "%", ejExpectativa: 4.0, ejReal: 4.5 },
  { id: "tasa", label: "Tasa de interés", unidad: "%", ejExpectativa: 5.25, ejReal: 5.5 },
] as const;

export default function SimuladorImpactoNoticias() {
  const { data: session } = useSession();
  const [showPricing, setShowPricing] = useState(false);
  const [exportando, setExportando] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [tipoEvento, setTipoEvento] = useState<(typeof TIPOS_EVENTO)[number]["id"]>("earnings");
  const [precioAnterior, setPrecioAnterior] = useState(100);
  const [expectativa, setExpectativa] = useState(2.5);
  const [resultadoReal, setResultadoReal] = useState(2.8);
  const [sensibilidad, setSensibilidad] = useState(3);

  const tipo = TIPOS_EVENTO.find((t) => t.id === tipoEvento)!;
  const { surprise, impactoPct, precioNuevo } = useMemo(
    () => impactoNoticias(precioAnterior, expectativa, resultadoReal, sensibilidad),
    [precioAnterior, expectativa, resultadoReal, sensibilidad]
  );

  const datosGrafico = useMemo(
    () => [
      { name: "Expectativa", valor: expectativa, fill: "#94a3b8" },
      { name: "Resultado", valor: resultadoReal, fill: surprise >= 0 ? "#22c55e" : "#ef4444" },
    ],
    [expectativa, resultadoReal, surprise]
  );

  const esPositivo = surprise >= 0;

  const handleExport = async () => {
    if ((session?.user?.credits ?? 0) < 1) { setShowPricing(true); return; }
    setExportando(true);
    try {
      await import("@/lib/actions/exportActions").then((m) => m.registrarExportacion("Finanzas Impacto Noticias", "PDF"));
      let chartUrl: string | null = null;
      try { chartUrl = await import("@/lib/exportarGrafico").then((m) => m.getGraficoAsDataUrl("grafico-impacto-noticias")); } catch (_) {}
      await import("@/lib/exportarFinanzasPdf").then((m) => m.exportarFinanzasAPdf({
        tipo: "ImpactoNoticias",
        titulo: "Impacto de noticias en el precio",
        variables: [
          { label: "Tipo evento", valor: tipo.label },
          { label: "Precio anterior", valor: `$${precioAnterior}` },
          { label: "Expectativa", valor: `${expectativa} ${tipo.unidad}` },
          { label: "Resultado real", valor: `${resultadoReal} ${tipo.unidad}` },
          { label: "Sensibilidad", valor: `${sensibilidad}%` },
        ],
        resultados: [
          { label: "Surprise", valor: `${surprise >= 0 ? "+" : ""}${surprise.toFixed(2)} ${tipo.unidad}` },
          { label: "Impacto %", valor: `${impactoPct >= 0 ? "+" : ""}${impactoPct.toFixed(2)}%` },
          { label: "Precio nuevo", valor: `$${precioNuevo.toFixed(2)}` },
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
        subType: "IMPACTO_NOTICIAS",
        name: `Impacto noticias ${new Date().toLocaleDateString()}`,
        variables: { tipoEvento, precioAnterior, expectativa, resultadoReal, sensibilidad },
        results: { surprise, impactoPct, precioNuevo },
      });
      if (res.success) alert("Escenario guardado");
      else alert(res.error);
    } catch (e) { alert("Error al guardar"); } finally { setGuardando(false); }
  };

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 shadow-lg p-6">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
        <div className="flex items-center gap-2">
          <Newspaper className="w-5 h-5 text-amber-500" />
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Impacto de noticias en el precio</h3>
        </div>
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
        El mercado reacciona a la <strong>sorpresa</strong> (resultado real − expectativa). Un beat genera impacto positivo; un miss, negativo.
      </p>

      <InstruccionesSimulador>
        <p>Este simulador te ayuda a entender cómo las noticias económicas y financieras afectan el precio de los activos.</p>
        <ul className="list-disc list-inside space-y-1 ml-1">
          <li><strong>Paso 1:</strong> Elige el tipo de evento (earnings, PIB, inflación o tasa de interés).</li>
          <li><strong>Paso 2:</strong> Ingresa el precio del activo antes de que se conozca la noticia.</li>
          <li><strong>Paso 3:</strong> Define la expectativa del mercado (consenso de analistas o encuestas).</li>
          <li><strong>Paso 4:</strong> Ingresa el resultado real publicado.</li>
          <li><strong>Paso 5:</strong> Ajusta la sensibilidad según el activo (acciones suelen ser más sensibles que bonos).</li>
        </ul>
        <p>El mercado reacciona a la <strong>sorpresa</strong>: si el resultado supera la expectativa (beat), el precio suele subir; si no la alcanza (miss), baja.</p>
      </InstruccionesSimulador>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">
            <LabelConAyuda
              label="Tipo de evento"
              tooltip="Elige el indicador que se publicó: Earnings (utilidad por acción), PIB (crecimiento económico), Inflación o Tasa de interés del banco central."
            />
          </label>
          <select
            value={tipoEvento}
            onChange={(e) => {
              const id = e.target.value as typeof tipoEvento;
              const t = TIPOS_EVENTO.find((x) => x.id === id)!;
              setTipoEvento(id);
              setExpectativa(t.ejExpectativa);
              setResultadoReal(t.ejReal);
            }}
            className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
          >
            {TIPOS_EVENTO.map((t) => (
              <option key={t.id} value={t.id}>{t.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">
            <LabelConAyuda
              label="Precio anterior del activo ($)"
              tooltip="El precio de la acción, bono o activo justo antes de que se publique la noticia. Es el punto de referencia para medir el impacto."
            />
          </label>
          <input
            type="number"
            min="1"
            value={precioAnterior}
            onChange={(e) => setPrecioAnterior(Math.max(1, Number(e.target.value) || 0))}
            className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-mono"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">
            <LabelConAyuda
              label={`Expectativa del mercado (${tipo.unidad})`}
              tooltip="El consenso o pronóstico que tenían los analistas antes del anuncio. Se obtiene de encuestas (ej. Bloomberg, Reuters) o estimaciones promedio."
            />
          </label>
          <input
            type="number"
            step="0.1"
            value={expectativa}
            onChange={(e) => setExpectativa(Number(e.target.value) || 0)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-mono"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">
            <LabelConAyuda
              label={`Resultado real (${tipo.unidad})`}
              tooltip="El dato que realmente se publicó. Si es mayor que la expectativa = sorpresa positiva (beat). Si es menor = sorpresa negativa (miss)."
            />
          </label>
          <input
            type="number"
            step="0.1"
            value={resultadoReal}
            onChange={(e) => setResultadoReal(Number(e.target.value) || 0)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-mono"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">
            <LabelConAyuda
              label="Sensibilidad (% por unidad surprise)"
              tooltip="Cuántos puntos porcentuales cambia el precio por cada unidad de sorpresa. Acciones de crecimiento: 2-5%. Bonos: 0.5-2%. Valores típicos: 2-4%."
            />
          </label>
          <input
            type="number"
            min="0.5"
            max="20"
            step="0.5"
            value={sensibilidad}
            onChange={(e) => setSensibilidad(Math.max(0, Math.min(20, Number(e.target.value) || 0)))}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-mono"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1 flex items-center gap-1">
            Surprise (resultado − expectativa)
            <span title="La diferencia entre lo que se esperaba y lo que ocurrió. Positivo = beat, negativo = miss." className="cursor-help">
              <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
            </span>
          </p>
          <p className={`text-2xl font-black flex items-center gap-2 ${esPositivo ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>
            {esPositivo ? <TrendingUp className="w-6 h-6" /> : <TrendingDown className="w-6 h-6" />}
            {surprise >= 0 ? "+" : ""}{surprise.toFixed(2)} {tipo.unidad}
          </p>
        </div>
        <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800">
          <p className="text-xs font-bold text-indigo-700 dark:text-indigo-400 uppercase mb-1 flex items-center gap-1">
            Impacto estimado en precio
            <span title="Variación porcentual estimada del precio. Se calcula como: sensibilidad × surprise." className="cursor-help">
              <HelpCircle className="w-3.5 h-3.5 text-indigo-400" />
            </span>
          </p>
          <p className={`text-2xl font-black ${impactoPct >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>
            {impactoPct >= 0 ? "+" : ""}{impactoPct.toFixed(2)}%
          </p>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 mb-6">
        <p className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase mb-1 flex items-center gap-1">
          Precio estimado después de la noticia
          <span title="Precio anterior × (1 + impacto%). Es una estimación; en la práctica hay más factores." className="cursor-help">
            <HelpCircle className="w-3.5 h-3.5 text-amber-500" />
          </span>
        </p>
        <p className="text-3xl font-black text-slate-900 dark:text-white">${precioNuevo.toFixed(2)}</p>
        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 flex items-center gap-1">
          <Info className="w-3 h-3" />
          Antes: ${precioAnterior.toFixed(2)} → Después: ${precioNuevo.toFixed(2)}
        </p>
      </div>

      <div id="grafico-impacto-noticias" className="h-48">
        <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2 flex items-center gap-1">
          Expectativa vs resultado
          <span title="Comparación visual: la barra gris es lo esperado, la verde/roja es lo real. La diferencia es la sorpresa." className="cursor-help">
            <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
          </span>
        </p>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={datosGrafico} layout="vertical" margin={{ top: 8, right: 8, left: 60, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-600" />
            <XAxis type="number" tick={{ fontSize: 11 }} />
            <YAxis type="category" dataKey="name" width={55} tick={{ fontSize: 11 }} />
            <Tooltip formatter={(v: number) => [`${v.toFixed(2)} ${tipo.unidad}`, ""]} />
            <Bar dataKey="valor" radius={[0, 4, 4, 0]}>
              {datosGrafico.map((entry, i) => (
                <Cell key={i} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <PricingModal isOpen={showPricing} onClose={() => setShowPricing(false)} />
    </div>
  );
}
