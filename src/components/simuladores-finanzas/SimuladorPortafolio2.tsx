"use client";

import { useMemo, useState } from "react";
import { FileDown } from "lucide-react";
import { useSession } from "next-auth/react";
import { portafolio2 } from "@/lib/finanzas";
import { InputLibre } from "./InputLibre";
import PricingModal from "../PricingModal";
import { registrarExportacion } from "@/lib/actions/exportActions";
import { exportarFinanzasAPdf } from "@/lib/exportarFinanzasPdf";

export default function SimuladorPortafolio2() {
  const { data: session } = useSession();
  const [showPricing, setShowPricing] = useState(false);
  const [exportando, setExportando] = useState(false);
  const [w1, setW1] = useState(0.6);
  const [r1Pct, setR1Pct] = useState(10);
  const [s1Pct, setS1Pct] = useState(15);
  const [r2Pct, setR2Pct] = useState(6);
  const [s2Pct, setS2Pct] = useState(8);
  const [rho, setRho] = useState(0.3);

  const r1 = r1Pct / 100;
  const s1 = s1Pct / 100;
  const r2 = r2Pct / 100;
  const s2 = s2Pct / 100;
  const rhoClamp = Math.max(-1, Math.min(1, rho));
  const { retorno, volatilidad } = useMemo(
    () => portafolio2(w1, r1, s1, r2, s2, rhoClamp),
    [w1, r1, s1, r2, s2, rhoClamp]
  );

  const exportarReporte = async () => {
    if ((session?.user?.credits ?? 0) < 1) {
      setShowPricing(true);
      return;
    }
    setExportando(true);
    try {
      await registrarExportacion("Finanzas Portafolio 2 activos", "PDF");
      await exportarFinanzasAPdf({
        tipo: "Portafolio2",
        titulo: "Portafolio de dos activos (retorno y volatilidad)",
        variables: [
          { label: "Peso Activo 1", valor: `${(w1 * 100).toFixed(1)}%` },
          { label: "Retorno Activo 1", valor: `${r1Pct}%` },
          { label: "Volatilidad Activo 1", valor: `${s1Pct}%` },
          { label: "Retorno Activo 2", valor: `${r2Pct}%` },
          { label: "Volatilidad Activo 2", valor: `${s2Pct}%` },
          { label: "Correlación ρ", valor: rhoClamp.toFixed(2) },
        ],
        resultados: [
          { label: "Retorno portafolio", valor: `${(retorno * 100).toFixed(2)}%` },
          { label: "Volatilidad portafolio", valor: `${(volatilidad * 100).toFixed(2)}%` },
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
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">Portafolio 2 activos</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400">Retorno y volatilidad dado peso, retornos, desviaciones y correlación.</p>
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
          <InputLibre label="Peso Activo 1 (0-1)" value={w1} onChange={setW1} step="0.05" />
          <InputLibre label="Retorno Activo 1 %" value={r1Pct} onChange={setR1Pct} suffix="%" step="0.1" />
          <InputLibre label="Volatilidad Activo 1 %" value={s1Pct} onChange={setS1Pct} suffix="%" step="0.1" />
          <InputLibre label="Retorno Activo 2 %" value={r2Pct} onChange={setR2Pct} suffix="%" step="0.1" />
          <InputLibre label="Volatilidad Activo 2 %" value={s2Pct} onChange={setS2Pct} suffix="%" step="0.1" />
          <InputLibre label="Correlación ρ (-1 a 1)" value={rho} onChange={setRho} step="0.05" />
        </div>
        <div className="space-y-3">
          <div className="rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/30 p-4">
            <p className="text-xs font-semibold uppercase text-emerald-600 dark:text-emerald-400">Retorno esperado</p>
            <p className="text-2xl font-bold font-mono text-slate-900 dark:text-slate-100">
              {(retorno * 100).toFixed(2)}%
            </p>
          </div>
          <div className="rounded-xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-900/30 p-4">
            <p className="text-xs font-semibold uppercase text-indigo-600 dark:text-indigo-400">Volatilidad (σ)</p>
            <p className="text-2xl font-bold font-mono text-slate-900 dark:text-slate-100">
              {(volatilidad * 100).toFixed(2)}%
            </p>
          </div>
        </div>
      </div>
      <PricingModal isOpen={showPricing} onClose={() => setShowPricing(false)} />
    </div>
  );
}
