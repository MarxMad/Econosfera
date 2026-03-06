"use client";

import { useState, useMemo } from "react";
import { Percent, FileDown, Save } from "lucide-react";
import { multiplicadorTransferencias } from "@/lib/macro";
import { useSession } from "next-auth/react";
import PricingModal from "../PricingModal";
import { InstruccionesSimulador } from "../InstruccionesSimulador";
import { InputLibre } from "../simuladores-finanzas/InputLibre";

export default function SimuladorMultiplicadorTransferencias() {
  const { data: session } = useSession();
  const [showPricing, setShowPricing] = useState(false);
  const [exportando, setExportando] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [pmc, setPmc] = useState(0.6);

  const multiplicador = useMemo(() => multiplicadorTransferencias(pmc), [pmc]);
  const impactoTransferencia100 = multiplicador * 100;

  const handleExport = async () => {
    if ((session?.user?.credits ?? 0) < 1) { setShowPricing(true); return; }
    setExportando(true);
    try {
      await import("@/lib/actions/exportActions").then((m) => m.registrarExportacion("Macro Mult. Transferencias", "PDF"));
      const { exportarMultTransferenciasPdf } = await import("@/lib/exportarPdf");
      await exportarMultTransferenciasPdf(pmc, multiplicador);
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
      const res = await saveScenario({
        type: "MACRO",
        subType: "MULT_TRANSFERENCIAS",
        name: `Mult. Transferencias ${new Date().toLocaleDateString()}`,
        variables: { pmc },
        results: { multiplicador },
      });
      if (res.success) alert("Escenario guardado");
      else alert(res.error);
    } catch (e) { alert("Error al guardar"); } finally { setGuardando(false); }
  };

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 shadow-lg p-6">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <Percent className="w-5 h-5 text-amber-500" />
          Multiplicador de transferencias
        </h3>
        <div className="flex gap-2">
          <button type="button" onClick={handleExport} disabled={exportando} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-900 dark:bg-slate-700 text-white hover:bg-slate-800 dark:hover:bg-slate-600 transition-all shadow-md active:scale-95 disabled:opacity-50">
            <FileDown className="w-3.5 h-3.5" />
            {exportando ? "Generando..." : "Reporte PDF"}
          </button>
          {session && (
            <button type="button" onClick={handleSave} disabled={guardando} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-600 text-white hover:bg-amber-500 transition-all shadow-md active:scale-95 disabled:opacity-50">
              <Save className="w-3.5 h-3.5" />
              {guardando ? "Guardando..." : "Guardar"}
            </button>
          )}
        </div>
      </div>
      <InstruccionesSimulador>
        <p>El multiplicador de transferencias es k_T = PMC / (1 − PMC). Una transferencia de $1 aumenta el PIB en k_T.</p>
        <ul className="list-disc list-inside space-y-1 ml-1">
          <li>Diferente al multiplicador de impuestos (negativo) o gasto (mayor).</li>
          <li>A mayor PMC, mayor impacto de las transferencias en el producto.</li>
        </ul>
      </InstruccionesSimulador>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <InputLibre label="PMC (Propensión marginal a consumir)" value={pmc} onChange={setPmc} step="0.05" tooltip="Entre 0 y 1. Proporción del ingreso adicional que se consume." />
        </div>
        <div className="space-y-4">
          <div className="p-4 rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20">
            <p className="text-xs font-bold text-amber-600 uppercase mb-1">Multiplicador (k_T)</p>
            <p className="text-3xl font-black font-mono text-slate-900 dark:text-white">{multiplicador.toFixed(2)}</p>
          </div>
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-600">
            <p className="text-xs font-bold text-slate-500 uppercase mb-1">Impacto de $100 transferencia</p>
            <p className="text-xl font-bold text-slate-900 dark:text-white">+${impactoTransferencia100.toFixed(0)} en PIB</p>
          </div>
        </div>
      </div>
      <PricingModal isOpen={showPricing} onClose={() => setShowPricing(false)} />
    </div>
  );
}
