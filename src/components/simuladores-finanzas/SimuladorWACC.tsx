"use client";

import { useMemo, useState } from "react";
import { FileDown } from "lucide-react";
import { useSession } from "next-auth/react";
import { wacc } from "@/lib/finanzas";
import { InputLibre } from "./InputLibre";
import PricingModal from "../PricingModal";
import { registrarExportacion } from "@/lib/actions/exportActions";
import { exportarFinanzasAPdf } from "@/lib/exportarFinanzasPdf";

export default function SimuladorWACC() {
  const { data: session } = useSession();
  const [showPricing, setShowPricing] = useState(false);
  const [exportando, setExportando] = useState(false);
  const [valorEquity, setValorEquity] = useState(600);
  const [valorDeuda, setValorDeuda] = useState(400);
  const [costoEquityPct, setCostoEquityPct] = useState(15);
  const [costoDeudaPct, setCostoDeudaPct] = useState(8);
  const [tasaImpuestosPct, setTasaImpuestosPct] = useState(30);

  const costoEquity = costoEquityPct / 100;
  const costoDeuda = costoDeudaPct / 100;
  const tasaImpuestos = tasaImpuestosPct / 100;
  const waccVal = useMemo(
    () => wacc(valorEquity, valorDeuda, costoEquity, costoDeuda, tasaImpuestos),
    [valorEquity, valorDeuda, costoEquity, costoDeuda, tasaImpuestos]
  );

  const exportarReporte = async () => {
    if ((session?.user?.credits ?? 0) < 1) {
      setShowPricing(true);
      return;
    }
    setExportando(true);
    try {
      await registrarExportacion("Finanzas WACC", "PDF");
      await exportarFinanzasAPdf({
        tipo: "WACC",
        titulo: "Costo promedio ponderado de capital (WACC)",
        variables: [
          { label: "Valor Equity", valor: `$${valorEquity.toLocaleString("es-MX")}` },
          { label: "Valor Deuda", valor: `$${valorDeuda.toLocaleString("es-MX")}` },
          { label: "Costo Equity", valor: `${costoEquityPct}%` },
          { label: "Costo Deuda", valor: `${costoDeudaPct}%` },
          { label: "Tasa impuestos", valor: `${tasaImpuestosPct}%` },
        ],
        resultados: [
          { label: "WACC", valor: `${(waccVal * 100).toFixed(2)}%` },
          { label: "Peso Equity", valor: `${((valorEquity / (valorEquity + valorDeuda)) * 100).toFixed(1)}%` },
          { label: "Peso Deuda", valor: `${((valorDeuda / (valorEquity + valorDeuda)) * 100).toFixed(1)}%` },
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
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">WACC</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400">Costo promedio ponderado de capital: (E/V)×Re + (D/V)×Rd×(1-Tc).</p>
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
          <InputLibre label="Valor Equity $" value={valorEquity} onChange={setValorEquity} step="10" />
          <InputLibre label="Valor Deuda $" value={valorDeuda} onChange={setValorDeuda} step="10" />
          <InputLibre label="Costo Equity %" value={costoEquityPct} onChange={setCostoEquityPct} suffix="%" step="0.1" />
          <InputLibre label="Costo Deuda %" value={costoDeudaPct} onChange={setCostoDeudaPct} suffix="%" step="0.1" />
          <InputLibre label="Tasa impuestos %" value={tasaImpuestosPct} onChange={setTasaImpuestosPct} suffix="%" step="0.1" />
        </div>
        <div className="space-y-3">
          <div className="rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/30 p-4">
            <p className="text-xs font-semibold uppercase text-emerald-600 dark:text-emerald-400">WACC</p>
            <p className="text-2xl font-bold font-mono text-slate-900 dark:text-slate-100">
              {(waccVal * 100).toFixed(2)}%
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/50 p-4">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Peso Equity / Deuda</p>
            <p className="text-lg font-mono text-slate-800 dark:text-slate-200">
              {valorEquity + valorDeuda > 0
                ? `${((valorEquity / (valorEquity + valorDeuda)) * 100).toFixed(1)}% / ${((valorDeuda / (valorEquity + valorDeuda)) * 100).toFixed(1)}%`
                : "—"}
            </p>
          </div>
        </div>
      </div>
      <PricingModal isOpen={showPricing} onClose={() => setShowPricing(false)} />
    </div>
  );
}
