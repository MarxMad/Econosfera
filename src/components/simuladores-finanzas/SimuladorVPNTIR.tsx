"use client";

import { useMemo, useState } from "react";
import { FileDown } from "lucide-react";
import { useSession } from "next-auth/react";
import { vpn, tir } from "@/lib/finanzas";
import { InputLibre } from "./InputLibre";
import PricingModal from "../PricingModal";
import { registrarExportacion } from "@/lib/actions/exportActions";
import { exportarFinanzasAPdf } from "@/lib/exportarFinanzasPdf";

const FLUJOS_INICIALES = [-10000, 3000, 3500, 4000, 4500];

export default function SimuladorVPNTIR() {
  const { data: session } = useSession();
  const [showPricing, setShowPricing] = useState(false);
  const [exportando, setExportando] = useState(false);
  const [tasaDescuentoPct, setTasaDescuentoPct] = useState(12);
  const [flujosStr, setFlujosStr] = useState(FLUJOS_INICIALES.join(", "));

  const flujos = useMemo(() => {
    const arr = flujosStr.split(/[,;\s]+/).map((s) => parseFloat(s.trim())).filter((n) => !Number.isNaN(n));
    return arr.length > 0 ? arr : [0];
  }, [flujosStr]);

  const tasaDescuento = tasaDescuentoPct / 100;
  const vpnVal = useMemo(() => vpn(tasaDescuento, flujos), [tasaDescuento, flujos]);
  const tirVal = useMemo(() => tir(flujos), [flujos]);

  const exportarReporte = async () => {
    if ((session?.user?.credits ?? 0) < 1) {
      setShowPricing(true);
      return;
    }
    setExportando(true);
    try {
      await registrarExportacion("Finanzas VPN/TIR", "PDF");
      await exportarFinanzasAPdf({
        tipo: "VPNTIR",
        titulo: "VPN y TIR de un proyecto",
        variables: [
          { label: "Tasa de descuento", valor: `${tasaDescuentoPct}%` },
          { label: "Flujos (años 0..n)", valor: flujos.map((f) => `$${f}`).join(", ") },
        ],
        resultados: [
          { label: "VPN", valor: `$${vpnVal.toLocaleString("es-MX", { maximumFractionDigits: 2 })}` },
          { label: "TIR (aprox.)", valor: tirVal != null ? `${(tirVal * 100).toFixed(2)}%` : "N/A" },
        ],
        extra: {
          label: "Flujos por periodo",
          columns: ["Año", "Flujo"],
          data: flujos.map((f, i) => ({ Año: i, Flujo: `$${f.toLocaleString("es-MX")}` })),
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
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">VPN y TIR</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400">Valor presente neto y tasa interna de retorno. Flujo 0 = inversión inicial (negativo).</p>
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
          <InputLibre label="Tasa de descuento %" value={tasaDescuentoPct} onChange={setTasaDescuentoPct} suffix="%" step="0.1" />
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Flujos de caja (separados por coma; año 0 = inversión)</label>
            <input
              type="text"
              value={flujosStr}
              onChange={(e) => setFlujosStr(e.target.value)}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm font-mono"
              placeholder="-10000, 3000, 3500, 4000"
            />
          </div>
        </div>
        <div className="space-y-3">
          <div className="rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/30 p-4">
            <p className="text-xs font-semibold uppercase text-emerald-600 dark:text-emerald-400">VPN</p>
            <p className="text-xl font-bold font-mono text-slate-900 dark:text-slate-100">
              ${vpnVal.toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
          <div className="rounded-xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-900/30 p-4">
            <p className="text-xs font-semibold uppercase text-indigo-600 dark:text-indigo-400">TIR (aprox.)</p>
            <p className="text-xl font-bold font-mono text-slate-900 dark:text-slate-100">
              {tirVal != null ? `${(tirVal * 100).toFixed(2)}%` : "—"}
            </p>
          </div>
        </div>
      </div>
      <PricingModal isOpen={showPricing} onClose={() => setShowPricing(false)} />
    </div>
  );
}
