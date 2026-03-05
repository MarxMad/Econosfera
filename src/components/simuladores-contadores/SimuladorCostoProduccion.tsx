"use client";

import { useMemo, useState } from "react";
import { HelpCircle, FileDown, Save } from "lucide-react";
import { InputLibre } from "../simuladores-finanzas/InputLibre";
import { InstruccionesSimulador } from "../InstruccionesSimulador";
import { costoProduccion } from "@/lib/contabilidad";
import { useSession } from "next-auth/react";
import PricingModal from "../PricingModal";

export default function SimuladorCostoProduccion() {
  const { data: session } = useSession();
  const [showPricing, setShowPricing] = useState(false);
  const [exportando, setExportando] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [materiaPrima, setMateriaPrima] = useState(50000);
  const [manoObraDirecta, setManoObraDirecta] = useState(30000);
  const [costosIndirectos, setCostosIndirectos] = useState(20000);
  const [unidadesProducidas, setUnidadesProducidas] = useState(1000);

  const { costoTotal, costoUnitario } = useMemo(
    () => costoProduccion(materiaPrima, manoObraDirecta, costosIndirectos, unidadesProducidas),
    [materiaPrima, manoObraDirecta, costosIndirectos, unidadesProducidas]
  );

  const fmt = (n: number) => n.toLocaleString("es-MX", { minimumFractionDigits: 2 });
  const totalBase = materiaPrima + manoObraDirecta + costosIndirectos;
  const pctMP = totalBase > 0 ? (materiaPrima / totalBase) * 100 : 0;
  const pctMOD = totalBase > 0 ? (manoObraDirecta / totalBase) * 100 : 0;
  const pctCIF = totalBase > 0 ? (costosIndirectos / totalBase) * 100 : 0;

  const handleExport = async () => {
    if ((session?.user?.credits ?? 0) < 1) { setShowPricing(true); return; }
    setExportando(true);
    try {
      await import("@/lib/actions/exportActions").then((m) => m.registrarExportacion("Contabilidad Costo Producción", "PDF"));
      await import("@/lib/exportarContabilidadPdf").then((m) => m.exportarContabilidadAPdf({
        tipo: "CostoProduccion",
        titulo: "Costo de producción",
        variables: [
          { label: "Materia prima", valor: `$${fmt(materiaPrima)}` },
          { label: "Mano de obra directa", valor: `$${fmt(manoObraDirecta)}` },
          { label: "Costos indirectos", valor: `$${fmt(costosIndirectos)}` },
          { label: "Unidades producidas", valor: String(unidadesProducidas) },
        ],
        resultados: [
          { label: "Costo total", valor: `$${fmt(costoTotal)}` },
          { label: "Costo unitario", valor: `$${fmt(costoUnitario)}` },
          { label: "MP %", valor: `${pctMP.toFixed(1)}%` },
          { label: "MOD %", valor: `${pctMOD.toFixed(1)}%` },
          { label: "CIF %", valor: `${pctCIF.toFixed(1)}%` },
        ],
      }));
    } catch (e) {
      if (String(e).includes("créditos")) setShowPricing(true);
      else alert("Error al exportar reporte");
    } finally { setExportando(false); }
  };

  const handleSave = async () => {
    if ((session?.user?.credits ?? 0) < 1) { setShowPricing(true); return; }
    setGuardando(true);
    try {
      const { saveScenario } = await import("@/lib/actions/scenarioActions");
      const res = await saveScenario({
        type: "CONTABILIDAD",
        subType: "COSTO_PRODUCCION",
        name: `Costo producción ${new Date().toLocaleDateString()}`,
        variables: { materiaPrima, manoObraDirecta, costosIndirectos, unidadesProducidas },
        results: { costoTotal, costoUnitario },
      });
      if (res.success) alert("Escenario guardado");
      else alert(res.error);
    } catch (e) { alert("Error al guardar"); } finally { setGuardando(false); }
  };

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 shadow-lg p-5">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
        <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">Costo de producción</h3>
        <div className="flex gap-2">
          <button type="button" onClick={handleExport} disabled={exportando} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-900 dark:bg-slate-700 text-white hover:bg-slate-800 dark:hover:bg-slate-600 transition-all shadow-md active:scale-95 disabled:opacity-50">
            <FileDown className="w-3.5 h-3.5" />
            {exportando ? "Generando..." : "Reporte PDF"}
          </button>
          {session && (
            <button type="button" onClick={handleSave} disabled={guardando} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold bg-teal-600 text-white hover:bg-teal-500 transition-all shadow-md active:scale-95 disabled:opacity-50">
              <Save className="w-3.5 h-3.5" />
              {guardando ? "Guardando..." : "Guardar"}
            </button>
          )}
        </div>
      </div>
      <p className="text-xs text-slate-600 dark:text-slate-400 mb-4">
        MP + MOD + CIF = Costo total. Costo unitario = Costo total / Unidades producidas.
      </p>

      <InstruccionesSimulador>
        <p>Calcula el costo de producción y el costo unitario. Los tres elementos del costo son:</p>
        <ul className="list-disc list-inside space-y-1 ml-1">
          <li><strong>Materia prima (MP):</strong> Materiales directos que se incorporan al producto.</li>
          <li><strong>Mano de obra directa (MOD):</strong> Salarios del personal que transforma el producto.</li>
          <li><strong>Costos indirectos (CIF):</strong> Rentas, depreciación, servicios, supervisión, etc.</li>
        </ul>
        <p>Costo unitario = Costo total ÷ Unidades producidas. Sirve para valuar inventario y costo de ventas.</p>
      </InstruccionesSimulador>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="space-y-4">
          <InputLibre label="Materia prima $" value={materiaPrima} onChange={setMateriaPrima} step="100" tooltip="Costo de materiales directos." />
          <InputLibre label="Mano de obra directa $" value={manoObraDirecta} onChange={setManoObraDirecta} step="100" tooltip="Salarios del personal de producción." />
          <InputLibre label="Costos indirectos (CIF) $" value={costosIndirectos} onChange={setCostosIndirectos} step="100" tooltip="Renta, depreciación, servicios, etc." />
          <InputLibre label="Unidades producidas" value={unidadesProducidas} onChange={setUnidadesProducidas} step="1" tooltip="Cantidad de unidades fabricadas en el periodo." />
        </div>
        <div className="space-y-4">
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/50">
            <p className="text-xs font-bold text-slate-500 uppercase mb-1 flex items-center gap-1">Costo total<span title="MP + MOD + CIF." className="cursor-help"><HelpCircle className="w-3.5 h-3.5 text-slate-400" /></span></p>
            <p className="text-2xl font-black text-slate-900 dark:text-white">${fmt(costoTotal)}</p>
          </div>
          <div className="p-4 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20">
            <p className="text-xs font-bold text-emerald-600 uppercase mb-1 flex items-center gap-1">Costo unitario<span title="Costo total ÷ Unidades producidas." className="cursor-help"><HelpCircle className="w-3.5 h-3.5 text-emerald-500" /></span></p>
            <p className="text-2xl font-black text-slate-900 dark:text-white">${fmt(costoUnitario)}</p>
          </div>
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-600">
            <p className="text-xs font-bold text-slate-500 uppercase mb-2">Composición del costo</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>MP</span>
                <span>{pctMP.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between">
                <span>MOD</span>
                <span>{pctMOD.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between">
                <span>CIF</span>
                <span>{pctCIF.toFixed(1)}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <PricingModal isOpen={showPricing} onClose={() => setShowPricing(false)} />
    </div>
  );
}
