"use client";

import { useState, useMemo } from "react";
import { ArrowRightLeft, FileDown, Save } from "lucide-react";
import { paridadUIP } from "@/lib/macro";
import { useSession } from "next-auth/react";
import PricingModal from "../PricingModal";
import { InstruccionesSimulador } from "../InstruccionesSimulador";
import { InputLibre } from "../simuladores-finanzas/InputLibre";

export default function SimuladorParidadUIP() {
  const { data: session } = useSession();
  const [showPricing, setShowPricing] = useState(false);
  const [exportando, setExportando] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [tasaExtranjera, setTasaExtranjera] = useState(5);
  const [depreciacionEsperada, setDepreciacionEsperada] = useState(2);

  const tasaDomestica = useMemo(
    () => paridadUIP(tasaExtranjera, depreciacionEsperada),
    [tasaExtranjera, depreciacionEsperada]
  );

  const handleExport = async () => {
    if ((session?.user?.credits ?? 0) < 1) { setShowPricing(true); return; }
    setExportando(true);
    try {
      await import("@/lib/actions/exportActions").then((m) => m.registrarExportacion("Monetaria Paridad UIP", "PDF"));
      const { exportarUIPPdf } = await import("@/lib/exportarPdf");
      await exportarUIPPdf(tasaExtranjera, depreciacionEsperada, tasaDomestica);
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
        type: "MONETARIA",
        subType: "PARIDAD_UIP",
        name: `Paridad UIP ${new Date().toLocaleDateString()}`,
        variables: { tasaExtranjera, depreciacionEsperada },
        results: { tasaDomestica },
      });
      if (res.success) alert("Escenario guardado");
      else alert(res.error);
    } catch (e) { alert("Error al guardar"); } finally { setGuardando(false); }
  };

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 shadow-lg p-6">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <ArrowRightLeft className="w-5 h-5 text-violet-500" />
          Paridad de tasas descubierta (UIP)
        </h3>
        <div className="flex gap-2">
          <button type="button" onClick={handleExport} disabled={exportando} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-900 dark:bg-slate-700 text-white hover:bg-slate-800 dark:hover:bg-slate-600 transition-all shadow-md active:scale-95 disabled:opacity-50">
            <FileDown className="w-3.5 h-3.5" />
            {exportando ? "Generando..." : "Reporte PDF"}
          </button>
          {session && (
            <button type="button" onClick={handleSave} disabled={guardando} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold bg-violet-600 text-white hover:bg-violet-500 transition-all shadow-md active:scale-95 disabled:opacity-50">
              <Save className="w-3.5 h-3.5" />
              {guardando ? "Guardando..." : "Guardar"}
            </button>
          )}
        </div>
      </div>
      <InstruccionesSimulador>
        <p>La UIP establece que i_dom = i_ext + depreciación esperada. Si se espera depreciación, la tasa doméstica debe ser mayor para compensar.</p>
        <ul className="list-disc list-inside space-y-1 ml-1">
          <li><strong>i_ext:</strong> Tasa de interés extranjera (%).</li>
          <li><strong>Depreciación esperada:</strong> Variación esperada del tipo de cambio (%).</li>
          <li>Si depreciación &gt; 0, la moneda local se debilita → i_dom sube.</li>
        </ul>
      </InstruccionesSimulador>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <InputLibre label="Tasa extranjera (%)" value={tasaExtranjera} onChange={setTasaExtranjera} suffix="%" step="0.25" tooltip="Tasa de interés en el país extranjero." />
          <InputLibre label="Depreciación esperada (%)" value={depreciacionEsperada} onChange={setDepreciacionEsperada} suffix="%" step="0.5" tooltip="Depreciación esperada de la moneda doméstica frente a la extranjera." />
        </div>
        <div className="p-4 rounded-xl border border-violet-200 dark:border-violet-800 bg-violet-50 dark:bg-violet-900/20">
          <p className="text-xs font-bold text-violet-600 uppercase mb-1">Tasa doméstica implícita (%)</p>
          <p className="text-3xl font-black font-mono text-slate-900 dark:text-white">{tasaDomestica.toFixed(2)}%</p>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">i_dom = i_ext + Δe esperada</p>
        </div>
      </div>
      <PricingModal isOpen={showPricing} onClose={() => setShowPricing(false)} />
    </div>
  );
}
