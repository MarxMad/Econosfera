"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { HelpCircle, FileDown, Save } from "lucide-react";
import { capm } from "@/lib/finanzas";
import { getSlugDeTermino } from "@/lib/glosario";
import { InputLibre } from "./InputLibre";
import { InstruccionesSimulador } from "../InstruccionesSimulador";
import { useSession } from "next-auth/react";
import PricingModal from "../PricingModal";

export default function SimuladorCAPM() {
  const { data: session } = useSession();
  const [showPricing, setShowPricing] = useState(false);
  const [exportando, setExportando] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [rfPct, setRfPct] = useState(5);
  const [rmPct, setRmPct] = useState(10);
  const [beta, setBeta] = useState(1.2);

  const rf = rfPct / 100;
  const rm = rmPct / 100;
  const rendimientoEsperado = useMemo(() => capm(rf, rm, beta), [rf, rm, beta]);
  const primaLibreRiesgo = rf;
  const primaRiesgo = rendimientoEsperado - rf;

  const handleExport = async () => {
    if ((session?.user?.credits ?? 0) < 1) { setShowPricing(true); return; }
    setExportando(true);
    try {
      await import("@/lib/actions/exportActions").then((m) => m.registrarExportacion("Finanzas CAPM", "PDF"));
      await import("@/lib/exportarFinanzasPdf").then((m) => m.exportarFinanzasAPdf({
        tipo: "CAPM",
        titulo: "Modelo de valoración de activos (CAPM)",
        variables: [
          { label: "Tasa libre de riesgo (Rf)", valor: `${rfPct}%` },
          { label: "Rendimiento mercado (Rm)", valor: `${rmPct}%` },
          { label: "Beta (β)", valor: beta.toFixed(2) },
        ],
        resultados: [
          { label: "Rendimiento esperado E[R]", valor: `${(rendimientoEsperado * 100).toFixed(2)}%` },
          { label: "Prima de riesgo", valor: `${(primaRiesgo * 100).toFixed(2)}%` },
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
        subType: "CAPM",
        name: `CAPM ${new Date().toLocaleDateString()}`,
        variables: { rfPct, rmPct, beta },
        results: { rendimientoEsperado: rendimientoEsperado * 100, primaRiesgo: primaRiesgo * 100 },
      });
      if (res.success) alert("Escenario guardado");
      else alert(res.error);
    } catch (e) { alert("Error al guardar"); } finally { setGuardando(false); }
  };

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 shadow-lg p-6">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">CAPM (Capital Asset Pricing Model)</h3>
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
        E[R] = Rf + β(Rm − Rf). El rendimiento esperado depende del riesgo sistemático (beta).
      </p>
      <InstruccionesSimulador>
        <p>El CAPM estima el rendimiento que un inversionista debería exigir a un activo según su riesgo sistemático.</p>
        <ul className="list-disc list-inside space-y-1 ml-1">
          <li><strong>Rf:</strong> Tasa libre de riesgo (ej. CETES a 28 días).</li>
          <li><strong>Rm:</strong> Rendimiento esperado del mercado (ej. índice S&P 500).</li>
          <li><strong>Beta:</strong> Sensibilidad del activo al mercado. β = 1 = mismo riesgo que el mercado; β &gt; 1 = más volátil.</li>
          <li>La prima de riesgo del activo = β × (Rm − Rf).</li>
        </ul>
        {getSlugDeTermino("CAPM") && (
          <p className="pt-2">
            <Link href={`/glosario/${getSlugDeTermino("CAPM")}`} className="text-blue-600 dark:text-blue-400 hover:underline font-medium">Ver definición de CAPM en el glosario</Link>
          </p>
        )}
      </InstruccionesSimulador>
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="space-y-4">
          <InputLibre label="Tasa libre de riesgo (Rf) %" value={rfPct} onChange={setRfPct} suffix="%" step="0.5" tooltip="Rendimiento de activos sin riesgo (ej. CETES, bonos gubernamentales)." />
          <InputLibre label="Rendimiento mercado (Rm) %" value={rmPct} onChange={setRmPct} suffix="%" step="0.5" tooltip="Rendimiento esperado del mercado (ej. índice bursátil)." />
          <InputLibre label="Beta (β)" value={beta} onChange={setBeta} step="0.1" tooltip="Sensibilidad del activo al mercado. β=1 es neutro; β>1 más volátil; β<1 más estable." />
        </div>
        <div className="space-y-4">
          <div className="p-4 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20">
            <p className="text-xs font-bold text-emerald-600 uppercase mb-1 flex items-center gap-1">
              Rendimiento esperado E[R]
              <span title="E[R] = Rf + β(Rm − Rf). Lo que deberías exigir según el riesgo." className="cursor-help"><HelpCircle className="w-3.5 h-3.5 text-emerald-500" /></span>
            </p>
            <p className="text-2xl font-black text-slate-900 dark:text-white">{(rendimientoEsperado * 100).toFixed(2)}%</p>
          </div>
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/50">
            <p className="text-xs font-bold text-slate-500 uppercase mb-1 flex items-center gap-1">
              Prima de riesgo
              <span title="Cuánto extra exiges por el riesgo. E[R] − Rf." className="cursor-help"><HelpCircle className="w-3.5 h-3.5 text-slate-400" /></span>
            </p>
            <p className="text-xl font-bold text-slate-900 dark:text-white">{(primaRiesgo * 100).toFixed(2)}%</p>
          </div>
        </div>
      </div>
      <PricingModal isOpen={showPricing} onClose={() => setShowPricing(false)} />
    </div>
  );
}
