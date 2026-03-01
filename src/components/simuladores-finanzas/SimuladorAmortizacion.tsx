"use client";

import { useMemo, useState } from "react";
import { FileDown } from "lucide-react";
import { useSession } from "next-auth/react";
import { tablaAmortizacion } from "@/lib/finanzas";
import { InputLibre } from "./InputLibre";
import PricingModal from "../PricingModal";
import { registrarExportacion } from "@/lib/actions/exportActions";
import { exportarFinanzasAPdf } from "@/lib/exportarFinanzasPdf";

export default function SimuladorAmortizacion() {
  const { data: session } = useSession();
  const [showPricing, setShowPricing] = useState(false);
  const [exportando, setExportando] = useState(false);
  const [monto, setMonto] = useState(100000);
  const [tasaPct, setTasaPct] = useState(10);
  const [plazoMeses, setPlazoMeses] = useState(60);

  const tasa = tasaPct / 100;
  const { cuota, filas, totalInteres } = useMemo(
    () => tablaAmortizacion(monto, tasa, Math.max(1, Math.floor(plazoMeses))),
    [monto, tasa, plazoMeses]
  );

  const exportarReporte = async () => {
    if ((session?.user?.credits ?? 0) < 1) {
      setShowPricing(true);
      return;
    }
    setExportando(true);
    try {
      await registrarExportacion("Finanzas Amortización", "PDF");
      await exportarFinanzasAPdf({
        tipo: "Amortizacion",
        titulo: "Amortización de crédito (cuota fija)",
        variables: [
          { label: "Monto del crédito", valor: `$${monto.toLocaleString("es-MX")}` },
          { label: "Tasa anual", valor: `${tasaPct}%` },
          { label: "Plazo (meses)", valor: `${Math.floor(plazoMeses)}` },
        ],
        resultados: [
          { label: "Cuota mensual", valor: `$${cuota.toLocaleString("es-MX", { maximumFractionDigits: 2 })}` },
          { label: "Total intereses", valor: `$${totalInteres.toLocaleString("es-MX", { maximumFractionDigits: 2 })}` },
        ],
        extra: {
          label: "Primeros periodos de la tabla",
          columns: ["Periodo", "Pago", "Interés", "Principal", "Saldo"],
          data: filas.slice(0, 12).map((f) => ({
            Periodo: f.periodo,
            Pago: `$${f.pago.toFixed(2)}`,
            Interés: `$${f.interes.toFixed(2)}`,
            Principal: `$${f.principal.toFixed(2)}`,
            Saldo: `$${f.saldo.toFixed(2)}`,
          })),
        },
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
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">Amortización de un crédito</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400">Cuota fija (sistema francés). Tabla de capital e intereses.</p>
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
          <InputLibre label="Monto del crédito $" value={monto} onChange={setMonto} step="100" />
          <InputLibre label="Tasa anual %" value={tasaPct} onChange={setTasaPct} suffix="%" step="0.01" />
          <InputLibre label="Plazo (meses)" value={plazoMeses} onChange={setPlazoMeses} step="1" />
        </div>
        <div className="space-y-3">
          <div className="rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/30 p-4">
            <p className="text-xs font-semibold uppercase text-emerald-600 dark:text-emerald-400">Cuota mensual</p>
            <p className="text-xl font-bold font-mono text-slate-900 dark:text-slate-100">
              ${cuota.toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/50 p-4">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total a pagar en intereses</p>
            <p className="text-lg font-mono font-bold text-slate-800 dark:text-slate-200">
              ${totalInteres.toLocaleString("es-MX", { maximumFractionDigits: 2 })}
            </p>
          </div>
        </div>
      </div>
      <div className="mt-4 overflow-x-auto max-h-64 overflow-y-auto">
        <table className="w-full text-sm border-collapse">
          <thead className="sticky top-0 bg-slate-100 dark:bg-slate-800">
            <tr className="border-b border-slate-200 dark:border-slate-600">
              <th className="text-left py-1.5 px-2 text-slate-600 dark:text-slate-400">#</th>
              <th className="text-right py-1.5 px-2 text-slate-600 dark:text-slate-400">Pago</th>
              <th className="text-right py-1.5 px-2 text-slate-600 dark:text-slate-400">Interés</th>
              <th className="text-right py-1.5 px-2 text-slate-600 dark:text-slate-400">Principal</th>
              <th className="text-right py-1.5 px-2 text-slate-600 dark:text-slate-400">Saldo</th>
            </tr>
          </thead>
          <tbody>
            {filas.slice(0, 24).map((f) => (
              <tr key={f.periodo} className="border-b border-slate-100 dark:border-slate-700/50">
                <td className="py-1 px-2 font-mono">{f.periodo}</td>
                <td className="text-right font-mono">${f.pago.toFixed(2)}</td>
                <td className="text-right font-mono">${f.interes.toFixed(2)}</td>
                <td className="text-right font-mono">${f.principal.toFixed(2)}</td>
                <td className="text-right font-mono text-slate-600 dark:text-slate-400">${f.saldo.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filas.length > 24 && <p className="text-xs text-slate-500 mt-1">Mostrando primeros 24 periodos de {filas.length}</p>}
      </div>
      <PricingModal isOpen={showPricing} onClose={() => setShowPricing(false)} />
    </div>
  );
}
