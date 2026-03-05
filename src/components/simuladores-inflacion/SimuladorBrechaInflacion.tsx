"use client";

import { useState, useMemo } from "react";
import { Target, FileDown, Save } from "lucide-react";
import { useSession } from "next-auth/react";
import PricingModal from "../PricingModal";
import { InstruccionesSimulador } from "../InstruccionesSimulador";

export default function SimuladorBrechaInflacion() {
  const { data: session } = useSession();
  const [showPricing, setShowPricing] = useState(false);
  const [exportando, setExportando] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [inflacionObservada, setInflacionObservada] = useState(4.5);
  const [metaInflacion, setMetaInflacion] = useState(3);

  const brecha = useMemo(() => inflacionObservada - metaInflacion, [inflacionObservada, metaInflacion]);
  const porEncima = brecha > 0;

  const handleExport = async () => {
    if ((session?.user?.credits ?? 0) < 1) {
      setShowPricing(true);
      return;
    }
    setExportando(true);
    try {
      await import("@/lib/actions/exportActions").then((m) => m.registrarExportacion("Inflación Brecha", "PDF"));
      const { exportarBrechaInflacionPdf } = await import("@/lib/exportarPdf");
      await exportarBrechaInflacionPdf(inflacionObservada, metaInflacion, brecha);
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
        subType: "BRECHA_INFLACION",
        name: `Brecha inflación ${new Date().toLocaleDateString()}`,
        variables: { inflacionObservada, metaInflacion },
        results: { brecha },
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
          <Target className="w-5 h-5 text-amber-500" />
          Brecha de inflación
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
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-600 text-white hover:bg-amber-500 transition-all shadow-md active:scale-95 disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              {guardando ? "Guardando..." : "Guardar"}
            </button>
          )}
        </div>
      </div>

      <InstruccionesSimulador>
        <p>La brecha de inflación es la diferencia entre la inflación observada y la meta del banco central.</p>
        <ul className="list-disc list-inside space-y-1 ml-1">
          <li><strong>Brecha positiva:</strong> Inflación por encima de la meta → presión para subir tasas.</li>
          <li><strong>Brecha negativa:</strong> Inflación por debajo de la meta → margen para bajar tasas.</li>
          <li>En México la meta es 3% con intervalo de ±1%.</li>
        </ul>
      </InstruccionesSimulador>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Inflación observada (%)</label>
            <input
              type="number"
              step="0.1"
              min="-5"
              max="30"
              value={inflacionObservada}
              onChange={(e) => setInflacionObservada(parseFloat(e.target.value) || 0)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-mono font-bold"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Meta de inflación (%)</label>
            <input
              type="number"
              step="0.25"
              min="0"
              max="10"
              value={metaInflacion}
              onChange={(e) => setMetaInflacion(parseFloat(e.target.value) || 0)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-mono font-bold"
            />
          </div>
        </div>
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/50">
          <p className="text-xs font-bold text-slate-500 uppercase mb-1">Brecha (pp)</p>
          <p className={`text-3xl font-black font-mono ${porEncima ? "text-rose-600" : "text-emerald-600"}`}>
            {brecha > 0 ? "+" : ""}{brecha.toFixed(2)} pp
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            {porEncima ? "Inflación por encima de la meta" : "Inflación por debajo de la meta"}
          </p>
        </div>
      </div>

      <PricingModal isOpen={showPricing} onClose={() => setShowPricing(false)} />
    </div>
  );
}
