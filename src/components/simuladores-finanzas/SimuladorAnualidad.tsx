"use client";

import { useMemo, useState } from "react";
import { HelpCircle, FileDown, Save } from "lucide-react";
import { vpAnualidad, vfAnualidad } from "@/lib/finanzas";
import { InputLibre } from "./InputLibre";
import { InstruccionesSimulador } from "../InstruccionesSimulador";
import { useSession } from "next-auth/react";
import PricingModal from "../PricingModal";

export default function SimuladorAnualidad() {
  const { data: session } = useSession();
  const [showPricing, setShowPricing] = useState(false);
  const [exportando, setExportando] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [pago, setPago] = useState(1000);
  const [tasaPct, setTasaPct] = useState(8);
  const [anios, setAnios] = useState(10);

  const tasaAnual = tasaPct / 100;
  const { vp, vf } = useMemo(() => ({
    vp: vpAnualidad(pago, tasaAnual, anios),
    vf: vfAnualidad(pago, tasaAnual, anios),
  }), [pago, tasaAnual, anios]);

  const handleExport = async () => {
    if ((session?.user?.credits ?? 0) < 1) { setShowPricing(true); return; }
    setExportando(true);
    try {
      await import("@/lib/actions/exportActions").then((m) => m.registrarExportacion("Finanzas Anualidad", "PDF"));
      await import("@/lib/exportarFinanzasPdf").then((m) => m.exportarFinanzasAPdf({
        tipo: "Anualidad",
        titulo: "Valor presente y futuro de una anualidad",
        variables: [
          { label: "Pago periódico", valor: `$${pago.toLocaleString("es-MX")}` },
          { label: "Tasa anual", valor: `${tasaPct}%` },
          { label: "Años", valor: String(anios) },
        ],
        resultados: [
          { label: "VP anualidad", valor: `$${vp.toLocaleString("es-MX", { minimumFractionDigits: 2 })}` },
          { label: "VF anualidad", valor: `$${vf.toLocaleString("es-MX", { minimumFractionDigits: 2 })}` },
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
        type: "FINANZAS",
        subType: "ANUALIDAD",
        name: `Anualidad ${new Date().toLocaleDateString()}`,
        variables: { pago, tasaPct, anios },
        results: { vp, vf },
      });
      if (res.success) alert("Escenario guardado");
      else alert(res.error);
    } catch (e) { alert("Error al guardar"); } finally { setGuardando(false); }
  };

  const fmt = (n: number) => n.toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 shadow-lg p-6">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Anualidad (renta fija periódica)</h3>
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
      <p className="text-xs text-slate-600 dark:text-slate-400 mb-4">
        VP = A × [1 − (1+r)⁻ⁿ] / r. VF = A × [(1+r)ⁿ − 1] / r. Pagos al final de cada periodo.
      </p>
      <InstruccionesSimulador>
        <p>Calcula el valor presente o futuro de una serie de pagos iguales (anualidad ordinaria).</p>
        <ul className="list-disc list-inside space-y-1 ml-1">
          <li><strong>Pago periódico:</strong> Cantidad que pagas o recibes al final de cada periodo (mes, año).</li>
          <li><strong>Tasa anual:</strong> Tasa de descuento o capitalización (en %).</li>
          <li><strong>VP:</strong> Cuánto vale hoy esa serie de pagos futuros.</li>
          <li><strong>VF:</strong> Cuánto tendrás acumulado si inviertes cada pago al final del periodo.</li>
        </ul>
      </InstruccionesSimulador>
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="space-y-4">
          <InputLibre label="Pago periódico $" value={pago} onChange={setPago} step="100" tooltip="Cantidad fija que pagas o recibes al final de cada periodo (mes o año)." />
          <InputLibre label="Tasa anual %" value={tasaPct} onChange={setTasaPct} suffix="%" step="0.5" tooltip="Tasa de interés anual para descontar (VP) o capitalizar (VF)." />
          <InputLibre label="Años" value={anios} onChange={setAnios} step="1" tooltip="Número de años (o periodos) de la anualidad." />
        </div>
        <div className="space-y-4">
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/50">
            <p className="text-xs font-bold text-slate-500 uppercase mb-1 flex items-center gap-1">
              Valor presente
              <span title="Cuánto vale hoy una serie de pagos futuros. VP = A × [1 − (1+r)⁻ⁿ] / r." className="cursor-help"><HelpCircle className="w-3.5 h-3.5 text-slate-400" /></span>
            </p>
            <p className="text-2xl font-black text-slate-900 dark:text-white">${fmt(vp)}</p>
          </div>
          <div className="p-4 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20">
            <p className="text-xs font-bold text-emerald-600 uppercase mb-1 flex items-center gap-1">
              Valor futuro
              <span title="Cuánto acumularás si inviertes cada pago al final del periodo. VF = A × [(1+r)ⁿ − 1] / r." className="cursor-help"><HelpCircle className="w-3.5 h-3.5 text-emerald-500" /></span>
            </p>
            <p className="text-2xl font-black text-slate-900 dark:text-white">${fmt(vf)}</p>
          </div>
        </div>
      </div>
      <PricingModal isOpen={showPricing} onClose={() => setShowPricing(false)} />
    </div>
  );
}
