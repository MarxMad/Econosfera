"use client";

import { useMemo, useState } from "react";
import { FileDown } from "lucide-react";
import { useSession } from "next-auth/react";
import { breakEven } from "@/lib/finanzas";
import { InputLibre } from "./InputLibre";
import PricingModal from "../PricingModal";
import { registrarExportacion } from "@/lib/actions/exportActions";
import { exportarFinanzasAPdf } from "@/lib/exportarFinanzasPdf";

export default function SimuladorBreakEven() {
  const { data: session } = useSession();
  const [showPricing, setShowPricing] = useState(false);
  const [exportando, setExportando] = useState(false);
  const [costosFijos, setCostosFijos] = useState(50000);
  const [precioVenta, setPrecioVenta] = useState(100);
  const [costoVariableUnitario, setCostoVariableUnitario] = useState(40);

  const { cantidad, ventas } = useMemo(
    () => breakEven(costosFijos, precioVenta, costoVariableUnitario),
    [costosFijos, precioVenta, costoVariableUnitario]
  );
  const finito = Number.isFinite(cantidad) && cantidad < 1e10;

  const exportarReporte = async () => {
    if ((session?.user?.credits ?? 0) < 1) {
      setShowPricing(true);
      return;
    }
    setExportando(true);
    try {
      await registrarExportacion("Finanzas Punto de equilibrio", "PDF");
      await exportarFinanzasAPdf({
        tipo: "BreakEven",
        titulo: "Punto de equilibrio (Break-even)",
        variables: [
          { label: "Costos fijos", valor: `$${costosFijos.toLocaleString("es-MX")}` },
          { label: "Precio de venta unitario", valor: `$${precioVenta.toLocaleString("es-MX")}` },
          { label: "Costo variable unitario", valor: `$${costoVariableUnitario.toLocaleString("es-MX")}` },
        ],
        resultados: [
          { label: "Cantidad de equilibrio", valor: finito ? cantidad.toFixed(0) : "N/A" },
          { label: "Ventas en equilibrio", valor: finito ? `$${ventas.toLocaleString("es-MX", { maximumFractionDigits: 0 })}` : "N/A" },
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
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">Punto de equilibrio</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400">Q = CF / (P − CVu). Cantidad donde ingresos = costos.</p>
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
          <InputLibre label="Costos fijos $" value={costosFijos} onChange={setCostosFijos} step="100" />
          <InputLibre label="Precio de venta unitario $" value={precioVenta} onChange={setPrecioVenta} step="0.01" />
          <InputLibre label="Costo variable unitario $" value={costoVariableUnitario} onChange={setCostoVariableUnitario} step="0.01" />
        </div>
        <div className="space-y-3">
          <div className="rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/30 p-4">
            <p className="text-xs font-semibold uppercase text-emerald-600 dark:text-emerald-400">Cantidad de equilibrio</p>
            <p className="text-2xl font-bold font-mono text-slate-900 dark:text-slate-100">
              {finito ? cantidad.toLocaleString("es-MX", { maximumFractionDigits: 0 }) : "—"}
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/50 p-4">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Ventas en equilibrio</p>
            <p className="text-lg font-mono font-bold text-slate-800 dark:text-slate-200">
              {finito ? `$${ventas.toLocaleString("es-MX", { maximumFractionDigits: 0 })}` : "—"}
            </p>
          </div>
        </div>
      </div>
      {precioVenta <= costoVariableUnitario && (
        <p className="mt-3 text-xs text-amber-600 dark:text-amber-400">El precio debe ser mayor que el costo variable para tener punto de equilibrio.</p>
      )}
      <PricingModal isOpen={showPricing} onClose={() => setShowPricing(false)} />
    </div>
  );
}
