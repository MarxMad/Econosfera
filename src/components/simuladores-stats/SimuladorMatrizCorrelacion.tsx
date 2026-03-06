"use client";

import { useState, useMemo } from "react";
import { Grid3X3, FileDown, Save } from "lucide-react";
import { matrizCorrelacion } from "@/lib/econometria";
import { useSession } from "next-auth/react";
import PricingModal from "../PricingModal";
import { InstruccionesSimulador } from "../InstruccionesSimulador";

export default function SimuladorMatrizCorrelacion() {
  const { data: session } = useSession();
  const [showPricing, setShowPricing] = useState(false);
  const [n, setN] = useState(80);
  const [corr12, setCorr12] = useState(0.6);
  const [corr13, setCorr13] = useState(0.3);
  const [corr23, setCorr23] = useState(0.2);

  const datos = useMemo(() => {
    const v1 = Array.from({ length: n }, () => (Math.random() - 0.5) * 10);
    const v2 = v1.map((x) => Math.min(1, Math.max(-1, corr12)) * x + (1 - Math.abs(corr12)) * (Math.random() - 0.5) * 10);
    const v3 = v1.map((x, i) => Math.min(1, Math.max(-1, corr13)) * x * 0.5 + Math.min(1, Math.max(-1, corr23)) * v2[i] * 0.5 + (Math.random() - 0.5) * 8);
    return Array.from({ length: n }, (_, i) => [v1[i], v2[i], v3[i]]);
  }, [n, corr12, corr13, corr23]);

  const corr = useMemo(() => matrizCorrelacion(datos), [datos]);
  const nombres = ["X₁", "X₂", "X₃"];

  const handleExport = async () => {
    if ((session?.user?.credits ?? 0) < 1) { setShowPricing(true); return; }
    try {
      await import("@/lib/actions/exportActions").then((m) => m.registrarExportacion("Estadística Matriz Correlación", "PDF"));
      const { exportarMatrizCorrelacionPdf } = await import("@/lib/exportarPdf");
      await exportarMatrizCorrelacionPdf(nombres, corr);
    } catch (e) {
      if (String(e).includes("créditos")) setShowPricing(true);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 shadow-lg p-6">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <Grid3X3 className="w-5 h-5 text-cyan-500" />
          Matriz de correlación
        </h3>
        <button type="button" onClick={handleExport} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-900 dark:bg-slate-700 text-white hover:bg-slate-800 dark:hover:bg-slate-600 transition-all shadow-md active:scale-95">
          <FileDown className="w-3.5 h-3.5" />
          Reporte PDF
        </button>
      </div>
      <InstruccionesSimulador>
        <p>Correlación de Pearson entre variables. Valores entre -1 y 1. Cerca de 1: relación positiva; -1: negativa; 0: sin relación lineal.</p>
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
              <label className="text-xs text-slate-500">Corr(X₁,X₂) objetivo</label>
              <input type="number" step="0.1" min="-1" max="1" value={corr12} onChange={(e) => setCorr12(Math.max(-1, Math.min(1, +e.target.value)))} className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm font-mono" />
            </div>
            <div>
              <label className="text-xs text-slate-500">Corr(X₁,X₃)</label>
              <input type="number" step="0.1" min="-1" max="1" value={corr13} onChange={(e) => setCorr13(Math.max(-1, Math.min(1, +e.target.value)))} className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm font-mono" />
            </div>
            <div>
              <label className="text-xs text-slate-500">Corr(X₂,X₃)</label>
              <input type="number" step="0.1" min="-1" max="1" value={corr23} onChange={(e) => setCorr23(Math.max(-1, Math.min(1, +e.target.value)))} className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm font-mono" />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <div className="font-mono text-sm">
            <table className="w-full border border-slate-200 dark:border-slate-600 rounded-xl overflow-hidden">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-800">
                  <th className="p-2 text-left font-bold"></th>
                  {nombres.map((n) => <th key={n} className="p-2 text-center font-bold">{n}</th>)}
                </tr>
              </thead>
              <tbody>
                {corr.map((row, i) => (
                  <tr key={i} className="border-t border-slate-200 dark:border-slate-600">
                    <td className="p-2 font-bold bg-slate-50 dark:bg-slate-800/50">{nombres[i]}</td>
                    {row.map((v, j) => {
                      const intensity = Math.abs(v);
                      const bg = v > 0 ? `rgba(34,197,94,${0.2 + intensity * 0.6})` : `rgba(239,68,68,${0.2 + intensity * 0.6})`;
                      return (
                        <td key={j} className="p-2 text-center" style={{ backgroundColor: i === j ? "transparent" : bg }}>
                          <span className="font-bold tabular-nums">{v.toFixed(3)}</span>
                        </td>
                      );
                    })}
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
