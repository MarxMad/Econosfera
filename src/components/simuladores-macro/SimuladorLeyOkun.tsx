"use client";

import { useState, useMemo } from "react";
import { Activity, FileDown, Save } from "lucide-react";
import { leyOkun } from "@/lib/macro";
import { useSession } from "next-auth/react";
import PricingModal from "../PricingModal";
import { InstruccionesSimulador } from "../InstruccionesSimulador";
import { InputLibre } from "../simuladores-finanzas/InputLibre";

export default function SimuladorLeyOkun() {
  const { data: session } = useSession();
  const [showPricing, setShowPricing] = useState(false);
  const [exportando, setExportando] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [crecimientoPIB, setCrecimientoPIB] = useState(3);
  const [crecimientoPotencial, setCrecimientoPotencial] = useState(2.5);
  const [beta, setBeta] = useState(0.5);

  const { cambioDesempleo, interpretacion } = useMemo(
    () => leyOkun(crecimientoPIB, crecimientoPotencial, beta),
    [crecimientoPIB, crecimientoPotencial, beta]
  );

  const handleExport = async () => {
    if ((session?.user?.credits ?? 0) < 1) { setShowPricing(true); return; }
    setExportando(true);
    try {
      await import("@/lib/actions/exportActions").then((m) => m.registrarExportacion("Macro Ley Okun", "PDF"));
      const { exportarOkunPdf } = await import("@/lib/exportarPdf");
      await exportarOkunPdf(crecimientoPIB, crecimientoPotencial, beta, cambioDesempleo);
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
        subType: "LEY_OKUN",
        name: `Ley Okun ${new Date().toLocaleDateString()}`,
        variables: { crecimientoPIB, crecimientoPotencial, beta },
        results: { cambioDesempleo },
      });
      if (res.success) alert("Escenario guardado");
      else alert(res.error);
    } catch (e) { alert("Error al guardar"); } finally { setGuardando(false); }
  };

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 shadow-lg p-6">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <Activity className="w-5 h-5 text-blue-500" />
          Ley de Okun
        </h3>
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
      <InstruccionesSimulador>
        <p>La Ley de Okun relaciona el crecimiento del PIB con el cambio en el desempleo: Δu ≈ −β × (crecimiento − potencial).</p>
        <ul className="list-disc list-inside space-y-1 ml-1">
          <li><strong>β:</strong> Coeficiente típico 0.4–0.5. Mide la sensibilidad del desempleo al ciclo.</li>
          <li>Si el PIB crece más que el potencial, el desempleo baja.</li>
          <li>Si crece menos, el desempleo sube.</li>
        </ul>
      </InstruccionesSimulador>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <InputLibre label="Crecimiento PIB (%)" value={crecimientoPIB} onChange={setCrecimientoPIB} suffix="%" step="0.5" tooltip="Tasa de crecimiento anual del PIB real." />
          <InputLibre label="Crecimiento potencial (%)" value={crecimientoPotencial} onChange={setCrecimientoPotencial} suffix="%" step="0.25" tooltip="Tasa de crecimiento de largo plazo sin presiones inflacionarias." />
          <InputLibre label="Beta (β)" value={beta} onChange={setBeta} step="0.1" tooltip="Coeficiente de Okun. Típico: 0.4–0.5." />
        </div>
        <div className="p-4 rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20">
          <p className="text-xs font-bold text-blue-600 uppercase mb-1">Cambio en desempleo (pp)</p>
          <p className={`text-3xl font-black font-mono ${cambioDesempleo < 0 ? "text-emerald-600" : cambioDesempleo > 0 ? "text-rose-600" : "text-slate-600"}`}>
            {cambioDesempleo > 0 ? "+" : ""}{cambioDesempleo.toFixed(2)} pp
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">{interpretacion}</p>
        </div>
      </div>
      <PricingModal isOpen={showPricing} onClose={() => setShowPricing(false)} />
    </div>
  );
}
