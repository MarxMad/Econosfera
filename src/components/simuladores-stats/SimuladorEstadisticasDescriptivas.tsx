"use client";

import { useState, useMemo } from "react";
import { BarChart2, FileDown, Save } from "lucide-react";
import { estadisticasDescriptivas } from "@/lib/econometria";
import { useSession } from "next-auth/react";
import PricingModal from "../PricingModal";
import { InstruccionesSimulador } from "../InstruccionesSimulador";

export default function SimuladorEstadisticasDescriptivas() {
  const { data: session } = useSession();
  const [showPricing, setShowPricing] = useState(false);
  const [n, setN] = useState(60);
  const [media, setMedia] = useState(100);
  const [desv, setDesv] = useState(15);

  const datos = useMemo(() => {
    const v1 = Array.from({ length: n }, () => media + (Math.random() - 0.5) * desv * 4);
    const v2 = Array.from({ length: n }, () => media * 1.2 + (Math.random() - 0.5) * desv * 3);
    const v3 = Array.from({ length: n }, () => media * 0.8 + (Math.random() - 0.5) * desv * 5);
    return Array.from({ length: n }, (_, i) => [v1[i], v2[i], v3[i]]);
  }, [n, media, desv]);

  const stats = useMemo(() => estadisticasDescriptivas(datos, ["Variable 1", "Variable 2", "Variable 3"]), [datos]);

  const handleExport = async () => {
    if ((session?.user?.credits ?? 0) < 1) { setShowPricing(true); return; }
    try {
      await import("@/lib/actions/exportActions").then((m) => m.registrarExportacion("Estadística Descriptivas", "PDF"));
      const { exportarEstadisticasDescriptivasPdf } = await import("@/lib/exportarPdf");
      await exportarEstadisticasDescriptivasPdf(stats);
    } catch (e) {
      if (String(e).includes("créditos")) setShowPricing(true);
    }
  };

  const handleSave = async () => {
    if ((session?.user?.credits ?? 0) < 1) { setShowPricing(true); return; }
    try {
      const { saveScenario } = await import("@/lib/actions/scenarioActions");
      const r = await saveScenario({
        type: "ESTADISTICA",
        subType: "DESCRIPTIVAS",
        name: `Estadísticas descriptivas ${new Date().toLocaleDateString()}`,
        variables: { n, media, desv },
        results: { stats },
      });
      if (r.success) alert("Escenario guardado"); else alert(r.error);
    } catch (e) { alert("Error al guardar"); }
  };

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 shadow-lg p-6">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <BarChart2 className="w-5 h-5 text-emerald-500" />
          Estadísticas descriptivas
        </h3>
        <div className="flex gap-2">
          <button type="button" onClick={handleExport} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-900 dark:bg-slate-700 text-white hover:bg-slate-800 dark:hover:bg-slate-600 transition-all shadow-md active:scale-95">
            <FileDown className="w-3.5 h-3.5" />
            Reporte PDF
          </button>
          {session && (
            <button type="button" onClick={handleSave} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-500 transition-all shadow-md active:scale-95">
              <Save className="w-3.5 h-3.5" />
              Guardar
            </button>
          )}
        </div>
      </div>
      <InstruccionesSimulador>
        <p>Resumen por variable: media, mediana, desviación estándar, varianza, min, max, rango. Formato tipo tabla EViews.</p>
      </InstruccionesSimulador>

      <div className="grid md:grid-cols-2 gap-6 mt-4">
        <div className="space-y-4">
          <label className="block text-sm font-medium text-slate-600 dark:text-slate-400">Parámetros de simulación</label>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-500">N observaciones</label>
              <input type="number" value={n} onChange={(e) => setN(Math.max(20, Math.min(500, +e.target.value)))} className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm font-mono" />
            </div>
            <div>
              <label className="text-xs text-slate-500">Media aproximada</label>
              <input type="number" value={media} onChange={(e) => setMedia(+e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm font-mono" />
            </div>
            <div>
              <label className="text-xs text-slate-500">Dispersión</label>
              <input type="number" value={desv} onChange={(e) => setDesv(Math.max(0, +e.target.value))} className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm font-mono" />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <div className="font-mono text-xs bg-slate-900 dark:bg-slate-950 text-slate-100 rounded-xl p-4 overflow-x-auto">
            <div className="text-emerald-400 font-bold mb-3">Descriptive Statistics</div>
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-600">
                  <th className="py-1 pr-4">Variable</th>
                  <th className="py-1 pr-3 text-right">Mean</th>
                  <th className="py-1 pr-3 text-right">Median</th>
                  <th className="py-1 pr-3 text-right">Std. Dev.</th>
                  <th className="py-1 pr-3 text-right">Min</th>
                  <th className="py-1 text-right">Max</th>
                </tr>
              </thead>
              <tbody>
                {stats.map((s) => (
                  <tr key={s.variable} className="border-b border-slate-800">
                    <td className="py-1.5 pr-4">{s.variable}</td>
                    <td className="py-1.5 pr-3 text-right tabular-nums">{s.media.toFixed(2)}</td>
                    <td className="py-1.5 pr-3 text-right tabular-nums">{s.mediana.toFixed(2)}</td>
                    <td className="py-1.5 pr-3 text-right tabular-nums">{s.desvEstandar.toFixed(2)}</td>
                    <td className="py-1.5 pr-3 text-right tabular-nums">{s.min.toFixed(2)}</td>
                    <td className="py-1.5 text-right tabular-nums">{s.max.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <PricingModal isOpen={showPricing} onClose={() => setShowPricing(false)} />
    </div>
  );
}
