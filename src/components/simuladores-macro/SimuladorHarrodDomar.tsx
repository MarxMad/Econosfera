"use client";

import { useState, useMemo } from "react";
import { TrendingUp, FileDown, Save } from "lucide-react";
import { harrodDomar } from "@/lib/macro";
import { useSession } from "next-auth/react";
import PricingModal from "../PricingModal";
import { InstruccionesSimulador } from "../InstruccionesSimulador";
import { InputLibre } from "../simuladores-finanzas/InputLibre";

export default function SimuladorHarrodDomar() {
  const { data: session } = useSession();
  const [showPricing, setShowPricing] = useState(false);
  const [exportando, setExportando] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [tasaAhorro, setTasaAhorro] = useState(20);
  const [relacionCapitalProducto, setRelacionCapitalProducto] = useState(3);

  const tasaCrecimiento = useMemo(
    () => harrodDomar(tasaAhorro, relacionCapitalProducto),
    [tasaAhorro, relacionCapitalProducto]
  );

  const handleExport = async () => {
    if ((session?.user?.credits ?? 0) < 1) { setShowPricing(true); return; }
    setExportando(true);
    try {
      await import("@/lib/actions/exportActions").then((m) => m.registrarExportacion("Macro Harrod-Domar", "PDF"));
      const { exportarHarrodDomarPdf } = await import("@/lib/exportarPdf");
      await exportarHarrodDomarPdf(tasaAhorro, relacionCapitalProducto, tasaCrecimiento);
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
        subType: "HARROD_DOMAR",
        name: `Harrod-Domar ${new Date().toLocaleDateString()}`,
        variables: { tasaAhorro, relacionCapitalProducto },
        results: { tasaCrecimiento },
      });
      if (res.success) alert("Escenario guardado");
      else alert(res.error);
    } catch (e) { alert("Error al guardar"); } finally { setGuardando(false); }
  };

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 shadow-lg p-6">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-emerald-500" />
          Modelo Harrod-Domar
        </h3>
        <div className="flex gap-2">
          <button type="button" onClick={handleExport} disabled={exportando} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-900 dark:bg-slate-700 text-white hover:bg-slate-800 dark:hover:bg-slate-600 transition-all shadow-md active:scale-95 disabled:opacity-50">
            <FileDown className="w-3.5 h-3.5" />
            {exportando ? "Generando..." : "Reporte PDF"}
          </button>
          {session && (
            <button type="button" onClick={handleSave} disabled={guardando} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-500 transition-all shadow-md active:scale-95 disabled:opacity-50">
              <Save className="w-3.5 h-3.5" />
              {guardando ? "Guardando..." : "Guardar"}
            </button>
          )}
        </div>
      </div>
      <InstruccionesSimulador>
        <p>El modelo Harrod-Domar relaciona el ahorro con el crecimiento: g = s/v. Más ahorro o menor relación capital-producto implican mayor crecimiento.</p>
        <ul className="list-disc list-inside space-y-1 ml-1">
          <li><strong>s:</strong> Tasa de ahorro (%).</li>
          <li><strong>v:</strong> Relación capital-producto (K/Y). Cuánto capital se necesita por unidad de producto.</li>
          <li>g = s/v es la tasa de crecimiento de equilibrio.</li>
        </ul>
      </InstruccionesSimulador>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <InputLibre label="Tasa de ahorro (%)" value={tasaAhorro} onChange={setTasaAhorro} suffix="%" step="1" tooltip="Proporción del ingreso que se ahorra." />
          <InputLibre label="Relación capital-producto (v)" value={relacionCapitalProducto} onChange={setRelacionCapitalProducto} step="0.5" tooltip="K/Y. Típico: 2–4." />
        </div>
        <div className="p-4 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20">
          <p className="text-xs font-bold text-emerald-600 uppercase mb-1">Tasa de crecimiento (%)</p>
          <p className="text-3xl font-black font-mono text-slate-900 dark:text-white">{tasaCrecimiento.toFixed(2)}%</p>
        </div>
      </div>
      <PricingModal isOpen={showPricing} onClose={() => setShowPricing(false)} />
    </div>
  );
}
