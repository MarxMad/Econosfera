"use client";

import { useMemo, useState } from "react";
import { HelpCircle, FileDown, Save } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { valorFuturo, valorFuturoSimple } from "@/lib/finanzas";
import { InstruccionesSimulador, LabelConAyuda } from "../InstruccionesSimulador";
import { useSession } from "next-auth/react";
import PricingModal from "../PricingModal";

export default function SimuladorInteresSimpleCompuesto() {
  const { data: session } = useSession();
  const [showPricing, setShowPricing] = useState(false);
  const [exportando, setExportando] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [monto, setMonto] = useState(10000);
  const [tasaPct, setTasaPct] = useState(8);
  const [anios, setAnios] = useState(10);

  const tasa = tasaPct / 100;
  const datosGrafico = useMemo(() => {
    const out: { ano: number; simple: number; compuesto: number }[] = [];
    for (let n = 0; n <= anios; n++) {
      out.push({
        ano: n,
        simple: Math.round(valorFuturoSimple(monto, tasa, n) * 100) / 100,
        compuesto: Math.round(valorFuturo(monto, tasa, n) * 100) / 100,
      });
    }
    return out;
  }, [monto, tasa, anios]);

  const vfSimple = valorFuturoSimple(monto, tasa, anios);
  const vfCompuesto = valorFuturo(monto, tasa, anios);
  const diferencia = vfCompuesto - vfSimple;

  const handleExport = async () => {
    if ((session?.user?.credits ?? 0) < 1) { setShowPricing(true); return; }
    setExportando(true);
    try {
      await import("@/lib/actions/exportActions").then((m) => m.registrarExportacion("Finanzas Interés Simple/Compuesto", "PDF"));
      let chartUrl: string | null = null;
      try { chartUrl = await import("@/lib/exportarGrafico").then((m) => m.getGraficoAsDataUrl("grafico-interes-simple")); } catch (_) {}
      await import("@/lib/exportarFinanzasPdf").then((m) => m.exportarFinanzasAPdf({
        tipo: "InteresSimpleCompuesto",
        titulo: "Interés simple vs compuesto",
        variables: [
          { label: "Monto inicial", valor: `$${monto.toLocaleString("es-MX")}` },
          { label: "Tasa anual", valor: `${tasaPct}%` },
          { label: "Años", valor: String(anios) },
        ],
        resultados: [
          { label: "VF Simple", valor: `$${vfSimple.toLocaleString("es-MX", { minimumFractionDigits: 2 })}` },
          { label: "VF Compuesto", valor: `$${vfCompuesto.toLocaleString("es-MX", { minimumFractionDigits: 2 })}` },
          { label: "Diferencia", valor: `$${diferencia.toLocaleString("es-MX", { minimumFractionDigits: 2 })}` },
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
        subType: "INTERES_SIMPLE_COMPUESTO",
        name: `Interés simple/compuesto ${new Date().toLocaleDateString()}`,
        variables: { monto, tasaPct, anios },
        results: { vfSimple, vfCompuesto, diferencia },
      });
      if (res.success) alert("Escenario guardado");
      else alert(res.error);
    } catch (e) { alert("Error al guardar"); } finally { setGuardando(false); }
  };

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 shadow-lg p-6">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Interés simple vs compuesto</h3>
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
        Simple: VF = VP(1 + r×n). Compuesto: VF = VP(1+r)ⁿ. El interés compuesto genera rendimientos sobre los intereses acumulados.
      </p>
      <InstruccionesSimulador>
        <p>Compara el interés simple (solo sobre el capital inicial) vs compuesto (sobre capital + intereses acumulados).</p>
        <ul className="list-disc list-inside space-y-1 ml-1">
          <li><strong>Monto inicial:</strong> Capital que inviertes.</li>
          <li><strong>Tasa anual:</strong> Rendimiento por año (%).</li>
          <li><strong>Años:</strong> Plazo. A mayor plazo, mayor diferencia entre simple y compuesto.</li>
        </ul>
      </InstruccionesSimulador>
      <div className="grid md:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">
            <LabelConAyuda label="Monto inicial ($)" tooltip="Capital inicial que inviertes. Es la base para calcular ambos tipos de interés." />
          </label>
          <input
            type="number"
            min="100"
            step="500"
            value={monto}
            onChange={(e) => setMonto(Math.max(100, Number(e.target.value) || 0))}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-mono"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">
            <LabelConAyuda label="Tasa anual (%)" tooltip="Rendimiento anual en porcentaje. Ej: 8% significa que ganas 8% cada año." />
          </label>
          <input
            type="number"
            min="0.5"
            max="30"
            step="0.5"
            value={tasaPct}
            onChange={(e) => setTasaPct(Math.max(0, Math.min(30, Number(e.target.value) || 0)))}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-mono"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">
            <LabelConAyuda label="Años" tooltip="Plazo de la inversión. La diferencia entre simple y compuesto crece con el tiempo." />
          </label>
          <input
            type="number"
            min="1"
            max="50"
            value={anios}
            onChange={(e) => setAnios(Math.max(1, Math.min(50, Number(e.target.value) || 1)))}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-mono"
          />
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Interés simple</p>
          <p className="text-2xl font-black text-slate-900 dark:text-white">${vfSimple.toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        </div>
        <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
          <p className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase mb-1">Interés compuesto</p>
          <p className="text-2xl font-black text-slate-900 dark:text-white">${vfCompuesto.toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        </div>
      </div>
      <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
        Diferencia a favor del compuesto: <strong>${diferencia.toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
      </p>
      <div id="grafico-interes-simple" className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={datosGrafico} margin={{ top: 8, right: 8, left: 8, bottom: 24 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-600" />
            <XAxis dataKey="ano" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
            <Tooltip formatter={(v: number) => [`$${v.toLocaleString("es-MX", { minimumFractionDigits: 2 })}`, ""]} />
            <Legend />
            <Line type="monotone" dataKey="simple" name="Simple" stroke="#94a3b8" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="compuesto" name="Compuesto" stroke="#3b82f6" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <PricingModal isOpen={showPricing} onClose={() => setShowPricing(false)} />
    </div>
  );
}
