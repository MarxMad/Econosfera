"use client";

import { useState, useMemo } from "react";
import { Globe, FileDown, Save } from "lucide-react";
import { pppTipoCambio } from "@/lib/macro";
import { useSession } from "next-auth/react";
import PricingModal from "../PricingModal";
import { InstruccionesSimulador } from "../InstruccionesSimulador";
import { InputLibre } from "../simuladores-finanzas/InputLibre";

export default function SimuladorPPP() {
  const { data: session } = useSession();
  const [showPricing, setShowPricing] = useState(false);
  const [exportando, setExportando] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [precioDomestico, setPrecioDomestico] = useState(100);
  const [precioExtranjero, setPrecioExtranjero] = useState(5);

  const tipoCambioImplicito = useMemo(
    () => pppTipoCambio(precioDomestico, precioExtranjero),
    [precioDomestico, precioExtranjero]
  );

  const handleExport = async () => {
    if ((session?.user?.credits ?? 0) < 1) { setShowPricing(true); return; }
    setExportando(true);
    try {
      await import("@/lib/actions/exportActions").then((m) => m.registrarExportacion("Macro PPP", "PDF"));
      const { exportarPPPPdf } = await import("@/lib/exportarPdf");
      await exportarPPPPdf(precioDomestico, precioExtranjero, tipoCambioImplicito);
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
        subType: "PPP",
        name: `PPP ${new Date().toLocaleDateString()}`,
        variables: { precioDomestico, precioExtranjero },
        results: { tipoCambioImplicito },
      });
      if (res.success) alert("Escenario guardado");
      else alert(res.error);
    } catch (e) { alert("Error al guardar"); } finally { setGuardando(false); }
  };

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 shadow-lg p-6">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <Globe className="w-5 h-5 text-indigo-500" />
          Paridad de poder adquisitivo (PPP)
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
        <p>La PPP absoluta indica que el tipo de cambio de equilibrio es S = P_dom / P_ext: misma canasta debe costar igual en ambas monedas.</p>
        <ul className="list-disc list-inside space-y-1 ml-1">
          <li><strong>P_dom:</strong> Precio de la canasta en moneda doméstica.</li>
          <li><strong>P_ext:</strong> Precio de la misma canasta en moneda extranjera.</li>
          <li>Si S real &gt; S_PPP, la moneda doméstica está sobrevaluada.</li>
        </ul>
      </InstruccionesSimulador>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <InputLibre label="Precio doméstico (P_dom)" value={precioDomestico} onChange={setPrecioDomestico} step="1" tooltip="Precio de la canasta en moneda local." />
          <InputLibre label="Precio extranjero (P_ext)" value={precioExtranjero} onChange={setPrecioExtranjero} step="0.5" tooltip="Precio de la misma canasta en moneda extranjera." />
        </div>
        <div className="p-4 rounded-xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-900/20">
          <p className="text-xs font-bold text-indigo-600 uppercase mb-1">Tipo de cambio implícito (S)</p>
          <p className="text-3xl font-black font-mono text-slate-900 dark:text-white">{tipoCambioImplicito.toFixed(4)}</p>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">Unidades de moneda doméstica por unidad extranjera</p>
        </div>
      </div>
      <PricingModal isOpen={showPricing} onClose={() => setShowPricing(false)} />
    </div>
  );
}
