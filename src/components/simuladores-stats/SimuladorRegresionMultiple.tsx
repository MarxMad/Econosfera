"use client";

import { useState, useMemo } from "react";
import { Table2, FileDown, Save, Activity } from "lucide-react";
import { mcoMultiple } from "@/lib/econometria";
import { useSession } from "next-auth/react";
import PricingModal from "../PricingModal";
import { InstruccionesSimulador } from "../InstruccionesSimulador";

function useSimulatedData(n: number, b0: number, b1: number, b2: number, noise: number) {
  return useMemo(() => {
    const X1: number[] = [];
    const X2: number[] = [];
    const Y: number[] = [];
    for (let i = 0; i < n; i++) {
      const x1 = i + Math.random() * 2;
      const x2 = Math.sin(i * 0.3) * 5 + Math.random() * 3;
      X1.push(x1);
      X2.push(x2);
      Y.push(b0 + b1 * x1 + b2 * x2 + (Math.random() - 0.5) * noise);
    }
    return { Y, X: [X1, X2] };
  }, [n, b0, b1, b2, noise]);
}

export default function SimuladorRegresionMultiple() {
  const { data: session } = useSession();
  const [showPricing, setShowPricing] = useState(false);
  const [exportando, setExportando] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [n, setN] = useState(50);
  const [b0, setB0] = useState(2);
  const [b1, setB1] = useState(1.5);
  const [b2, setB2] = useState(-0.3);
  const [noise, setNoise] = useState(5);

  const { Y, X } = useSimulatedData(n, b0, b1, b2, noise);
  const res = useMemo(() => mcoMultiple(Y, X), [Y, X]);

  const handleExport = async () => {
    if ((session?.user?.credits ?? 0) < 1) { setShowPricing(true); return; }
    setExportando(true);
    try {
      await import("@/lib/actions/exportActions").then((m) => m.registrarExportacion("Estadística Regresión Múltiple", "PDF"));
      const { exportarRegresionMultiplePdf } = await import("@/lib/exportarPdf");
      await exportarRegresionMultiplePdf({ n, b0, b1, b2, noise, res });
    } catch (e) {
      if (String(e).includes("créditos")) setShowPricing(true);
      else alert("Error al exportar");
    } finally { setExportando(false); }
  };

  const handleSave = async () => {
    if ((session?.user?.credits ?? 0) < 1) { setShowPricing(true); return; }
    setGuardando(true);
    try {
      const { saveScenario } = await import("@/lib/actions/scenarioActions");
      const r = await saveScenario({
        type: "ESTADISTICA",
        subType: "REGRESION_MULTIPLE",
        name: `Regresión Múltiple ${new Date().toLocaleDateString()}`,
        variables: { n, b0, b1, b2, noise },
        results: { r2: res.r2, r2Adj: res.r2Ajustado, dw: res.durbinWatson },
      });
      if (r.success) alert("Escenario guardado"); else alert(r.error);
    } catch (e) { alert("Error al guardar"); } finally { setGuardando(false); }
  };

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 shadow-lg p-6">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <Table2 className="w-5 h-5 text-indigo-500" />
          Regresión Múltiple (MCO) — Estilo EViews
        </h3>
        <div className="flex gap-2">
          <button type="button" onClick={handleExport} disabled={exportando} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-900 dark:bg-slate-700 text-white hover:bg-slate-800 dark:hover:bg-slate-600 transition-all shadow-md active:scale-95 disabled:opacity-50">
            <FileDown className="w-3.5 h-3.5" />
            {exportando ? "Generando..." : "Reporte PDF"}
          </button>
          {session && (
            <button type="button" onClick={handleSave} disabled={guardando} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-500 transition-all shadow-md active:scale-95 disabled:opacity-50">
              <Save className="w-3.5 h-3.5" />
              {guardando ? "Guardando..." : "Guardar"}
            </button>
          )}
        </div>
      </div>
      <InstruccionesSimulador>
        <p>Modelo: Y = β₀ + β₁X₁ + β₂X₂ + u. Se generan datos simulados y se estima por MCO. La tabla reproduce el formato típico de EViews/Stata.</p>
      </InstruccionesSimulador>

      <div className="grid md:grid-cols-2 gap-6 mt-4">
        <div className="space-y-4">
          <label className="block text-sm font-medium text-slate-600 dark:text-slate-400">Parámetros del DGP</label>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-500">N</label>
              <input type="number" value={n} onChange={(e) => setN(Math.max(10, Math.min(200, +e.target.value)))} className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm font-mono" />
            </div>
            <div>
              <label className="text-xs text-slate-500">Ruido</label>
              <input type="number" value={noise} onChange={(e) => setNoise(Math.max(0, +e.target.value))} className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm font-mono" />
            </div>
            <div>
              <label className="text-xs text-slate-500">β₀</label>
              <input type="number" step="0.1" value={b0} onChange={(e) => setB0(+e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm font-mono" />
            </div>
            <div>
              <label className="text-xs text-slate-500">β₁</label>
              <input type="number" step="0.1" value={b1} onChange={(e) => setB1(+e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm font-mono" />
            </div>
            <div>
              <label className="text-xs text-slate-500">β₂</label>
              <input type="number" step="0.1" value={b2} onChange={(e) => setB2(+e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm font-mono" />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <div className="font-mono text-xs bg-slate-900 dark:bg-slate-950 text-slate-100 rounded-xl p-4 overflow-x-auto">
            <div className="text-indigo-400 font-bold mb-3">Dependent Variable: Y | Method: Least Squares (MCO)</div>
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-600">
                  <th className="py-1 pr-4">Variable</th>
                  <th className="py-1 pr-4 text-right">Coefficient</th>
                  <th className="py-1 pr-4 text-right">Std. Error</th>
                  <th className="py-1 pr-4 text-right">t-Statistic</th>
                  <th className="py-1 text-right">Prob.</th>
                </tr>
              </thead>
              <tbody>
                {res.nombres.map((nom, i) => (
                  <tr key={nom} className="border-b border-slate-800">
                    <td className="py-1.5 pr-4">{nom}</td>
                    <td className="py-1.5 pr-4 text-right tabular-nums">{res.coeficientes[i].toFixed(4)}</td>
                    <td className="py-1.5 pr-4 text-right tabular-nums">{res.erroresEstandar[i].toFixed(4)}</td>
                    <td className="py-1.5 pr-4 text-right tabular-nums">{res.tStats[i].toFixed(3)}</td>
                    <td className="py-1.5 text-right tabular-nums">{res.pValores[i].toFixed(4)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-4 space-y-1 text-slate-400">
              <div>R-squared: <span className="text-emerald-400">{res.r2.toFixed(4)}</span> | Adjusted R²: <span className="text-emerald-400">{res.r2Ajustado.toFixed(4)}</span></div>
              <div>S.E. of regression: <span className="tabular-nums">{Math.sqrt(res.src / (res.n - res.k)).toFixed(4)}</span></div>
              <div>F-statistic: <span className="text-amber-400">{res.fStat.toFixed(2)}</span> | Prob(F): <span className="tabular-nums">{res.fPValor.toFixed(4)}</span></div>
              <div>Durbin-Watson: <span className="text-cyan-400">{res.durbinWatson.toFixed(4)}</span> (≈2 = no autocorr.)</div>
            </div>
          </div>
        </div>
      </div>
      <PricingModal isOpen={showPricing} onClose={() => setShowPricing(false)} />
    </div>
  );
}
