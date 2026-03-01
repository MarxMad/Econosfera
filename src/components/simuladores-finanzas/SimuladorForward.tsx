"use client";

import { useMemo, useState } from "react";
import { FileDown } from "lucide-react";
import { useSession } from "next-auth/react";
import { forwardPrecio } from "@/lib/finanzas";
import { InputLibre } from "./InputLibre";
import PricingModal from "../PricingModal";
import { registrarExportacion } from "@/lib/actions/exportActions";
import { exportarFinanzasAPdf } from "@/lib/exportarFinanzasPdf";

export default function SimuladorForward() {
  const { data: session } = useSession();
  const [showPricing, setShowPricing] = useState(false);
  const [exportando, setExportando] = useState(false);
  const [spot, setSpot] = useState(100);
  const [tasaPct, setTasaPct] = useState(5);
  const [anos, setAnos] = useState(1);
  const [continuo, setContinuo] = useState(false);

  const tasa = tasaPct / 100;
  const fwd = useMemo(() => forwardPrecio(spot, tasa, anos, continuo), [spot, tasa, anos, continuo]);

  const exportarReporte = async () => {
    if ((session?.user?.credits ?? 0) < 1) {
      setShowPricing(true);
      return;
    }
    setExportando(true);
    try {
      await registrarExportacion("Finanzas Forward", "PDF");
      await exportarFinanzasAPdf({
        tipo: "Forward",
        titulo: "Precio teórico de un contrato forward",
        variables: [
          { label: "Precio spot", valor: `$${spot.toLocaleString("es-MX")}` },
          { label: "Tasa libre de riesgo anual", valor: `${tasaPct}%` },
          { label: "Plazo (años)", valor: `${anos}` },
          { label: "Capitalización", valor: continuo ? "Continua (e^rt)" : "Anual ((1+r)^t)" },
        ],
        resultados: [
          { label: "Precio forward", valor: `$${fwd.toLocaleString("es-MX", { maximumFractionDigits: 2 })}` },
        ],
      });
    } catch (e) {
      console.error(e);
      if (String(e).includes("créditos")) setShowPricing(true);
      else alert("Error al exportar reporte");
    } finally {
      setExportando(false);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 shadow-lg p-5">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
        <div>
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">Precio forward</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400">F = S×(1+r)^T o F = S×e^(rT). Sin dividendos.</p>
        </div>
        <button
          type="button"
          onClick={exportarReporte}
          disabled={exportando}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-900 dark:bg-slate-700 text-white hover:bg-slate-800 dark:hover:bg-slate-600 transition-all shadow-md active:scale-95 disabled:opacity-50"
        >
          <FileDown className="w-3.5 h-3.5" />
          {exportando ? "Generando..." : "Reporte PDF"}
        </button>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <InputLibre label="Precio spot $" value={spot} onChange={setSpot} step="0.01" />
          <InputLibre label="Tasa anual %" value={tasaPct} onChange={setTasaPct} suffix="%" step="0.01" />
          <InputLibre label="Plazo (años)" value={anos} onChange={setAnos} step="0.1" />
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={continuo} onChange={(e) => setContinuo(e.target.checked)} className="rounded" />
            <span className="text-sm text-slate-600 dark:text-slate-400">Capitalización continua (e^rt)</span>
          </label>
        </div>
        <div className="space-y-3">
          <div className="rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/30 p-4">
            <p className="text-xs font-semibold uppercase text-emerald-600 dark:text-emerald-400">Precio forward</p>
            <p className="text-2xl font-bold font-mono text-slate-900 dark:text-slate-100">
              ${fwd.toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
        </div>
      </div>
      <PricingModal isOpen={showPricing} onClose={() => setShowPricing(false)} />
    </div>
  );
}
