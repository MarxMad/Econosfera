"use client";

import { useState, useMemo } from "react";
import { Percent, FileDown, Save } from "lucide-react";
import { useSession } from "next-auth/react";
import PricingModal from "../PricingModal";
import { InstruccionesSimulador } from "../InstruccionesSimulador";

export default function SimuladorTasaRealExPost() {
  const { data: session } = useSession();
  const [showPricing, setShowPricing] = useState(false);
  const [exportando, setExportando] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [tasaNominal, setTasaNominal] = useState(11);
  const [inflacionObservada, setInflacionObservada] = useState(4.5);

  const tasaRealExPost = useMemo(() => tasaNominal - inflacionObservada, [tasaNominal, inflacionObservada]);

  const handleExport = async () => {
    if ((session?.user?.credits ?? 0) < 1) {
      setShowPricing(true);
      return;
    }
    setExportando(true);
    try {
      await import("@/lib/actions/exportActions").then((m) => m.registrarExportacion("Inflación Tasa Real Ex Post", "PDF"));
      const { exportarTasaRealExPostPdf } = await import("@/lib/exportarPdf");
      await exportarTasaRealExPostPdf(tasaNominal, inflacionObservada, tasaRealExPost);
    } catch (e) {
      if (String(e).includes("créditos")) setShowPricing(true);
      else alert("Error al exportar reporte");
    } finally {
      setExportando(false);
    }
  };

  const handleSave = async () => {
    if ((session?.user?.credits ?? 0) < 1) {
      setShowPricing(true);
      return;
    }
    setGuardando(true);
    try {
      const { saveScenario } = await import("@/lib/actions/scenarioActions");
      const res = await saveScenario({
        type: "INFLACION",
        subType: "TASA_REAL_EX_POST",
        name: `Tasa real ex post ${new Date().toLocaleDateString()}`,
        variables: { tasaNominal, inflacionObservada },
        results: { tasaRealExPost },
      });
      if (res.success) alert("Escenario guardado");
      else alert(res.error);
    } catch (e) {
      alert("Error al guardar");
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 shadow-lg p-6">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <Percent className="w-5 h-5 text-indigo-500" />
          Tasa real ex post
        </h3>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleExport}
            disabled={exportando}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-900 dark:bg-slate-700 text-white hover:bg-slate-800 dark:hover:bg-slate-600 transition-all shadow-md active:scale-95 disabled:opacity-50"
          >
            <FileDown className="w-3.5 h-3.5" />
            {exportando ? "Generando..." : "Reporte PDF"}
          </button>
          {session && (
            <button
              type="button"
              onClick={handleSave}
              disabled={guardando}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-500 transition-all shadow-md active:scale-95 disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              {guardando ? "Guardando..." : "Guardar"}
            </button>
          )}
        </div>
      </div>

      <InstruccionesSimulador>
        <p>La tasa real ex post usa la inflación ya observada (no la esperada). Sirve para evaluar rendimientos pasados.</p>
        <ul className="list-disc list-inside space-y-1 ml-1">
          <li><strong>Fórmula:</strong> r_ex_post = i − π_observada</li>
          <li>Si la inflación supera la tasa nominal, la tasa real es negativa: pierdes poder adquisitivo.</li>
          <li>Útil para evaluar bonos, depósitos o créditos ya liquidados.</li>
        </ul>
      </InstruccionesSimulador>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Tasa nominal (i) %</label>
            <input
              type="number"
              step="0.25"
              min="0"
              max="30"
              value={tasaNominal}
              onChange={(e) => setTasaNominal(parseFloat(e.target.value) || 0)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-mono font-bold"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Inflación observada (π) %</label>
            <input
              type="number"
              step="0.1"
              min="-5"
              max="25"
              value={inflacionObservada}
              onChange={(e) => setInflacionObservada(parseFloat(e.target.value) || 0)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-mono font-bold"
            />
          </div>
        </div>
        <div className="p-4 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20">
          <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase mb-1">Tasa real ex post</p>
          <p className={`text-3xl font-black font-mono ${tasaRealExPost >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
            {tasaRealExPost.toFixed(2)}%
          </p>
        </div>
      </div>

      <PricingModal isOpen={showPricing} onClose={() => setShowPricing(false)} />
    </div>
  );
}
