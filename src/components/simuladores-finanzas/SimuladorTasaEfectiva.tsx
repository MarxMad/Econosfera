"use client";

import { useMemo, useState } from "react";
import { HelpCircle, FileDown, Save } from "lucide-react";
import { tasaEfectivaAnual } from "@/lib/finanzas";
import { InstruccionesSimulador, LabelConAyuda } from "../InstruccionesSimulador";
import { useSession } from "next-auth/react";
import PricingModal from "../PricingModal";

const CAPITALIZACIONES = [
  { id: 1, label: "Anual" },
  { id: 2, label: "Semestral" },
  { id: 4, label: "Trimestral" },
  { id: 12, label: "Mensual" },
  { id: 365, label: "Diaria" },
];

export default function SimuladorTasaEfectiva() {
  const { data: session } = useSession();
  const [showPricing, setShowPricing] = useState(false);
  const [exportando, setExportando] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [tasaNominalPct, setTasaNominalPct] = useState(10);
  const [capitalizaciones, setCapitalizaciones] = useState(12);

  const tasaNominal = tasaNominalPct / 100;
  const tasaEfectiva = useMemo(() => tasaEfectivaAnual(tasaNominal, capitalizaciones), [tasaNominal, capitalizaciones]);
  const tasaEfectivaPct = tasaEfectiva * 100;

  const comparativa = useMemo(() => {
    return CAPITALIZACIONES.map((c) => ({
      label: c.label,
      n: c.id,
      efectiva: (tasaEfectivaAnual(tasaNominal, c.id) * 100).toFixed(2),
    }));
  }, [tasaNominal]);

  const handleExport = async () => {
    if ((session?.user?.credits ?? 0) < 1) { setShowPricing(true); return; }
    setExportando(true);
    try {
      await import("@/lib/actions/exportActions").then((m) => m.registrarExportacion("Finanzas Tasa Efectiva", "PDF"));
      await import("@/lib/exportarFinanzasPdf").then((m) => m.exportarFinanzasAPdf({
        tipo: "TasaEfectiva",
        titulo: "Tasa nominal vs efectiva",
        variables: [
          { label: "Tasa nominal", valor: `${tasaNominalPct}%` },
          { label: "Capitalizaciones/año", valor: String(capitalizaciones) },
        ],
        resultados: [{ label: "Tasa efectiva anual", valor: `${tasaEfectivaPct.toFixed(2)}%` }],
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
        subType: "TASA_EFECTIVA",
        name: `Tasa efectiva ${new Date().toLocaleDateString()}`,
        variables: { tasaNominalPct, capitalizaciones },
        results: { tasaEfectivaPct },
      });
      if (res.success) alert("Escenario guardado");
      else alert(res.error);
    } catch (e) { alert("Error al guardar"); } finally { setGuardando(false); }
  };

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 shadow-lg p-6">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Tasa nominal vs efectiva</h3>
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
        Tasa efectiva anual: (1 + i/n)ⁿ − 1. Cuanto más frecuente la capitalización, mayor la tasa efectiva para una misma nominal.
      </p>
      <InstruccionesSimulador>
        <p>Convierte una tasa nominal (la que anuncia el banco) a tasa efectiva anual (lo que realmente ganas o pagas).</p>
        <ul className="list-disc list-inside space-y-1 ml-1">
          <li><strong>Nominal:</strong> Tasa anunciada (ej. 10% anual capitalizable mensualmente).</li>
          <li><strong>Capitalizaciones:</strong> Cuántas veces al año se aplica el interés (mensual=12, trimestral=4).</li>
          <li>Más capitalizaciones = mayor tasa efectiva para la misma nominal.</li>
        </ul>
      </InstruccionesSimulador>
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">
            <LabelConAyuda label="Tasa nominal anual (%)" tooltip="La tasa que anuncia la institución. No incluye el efecto de la capitalización." />
          </label>
          <input
            type="number"
            min="0"
            max="50"
            step="0.5"
            value={tasaNominalPct}
            onChange={(e) => setTasaNominalPct(Math.max(0, Math.min(50, Number(e.target.value) || 0)))}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-mono font-bold text-lg"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">
            <LabelConAyuda label="Capitalizaciones por año" tooltip="Frecuencia con que se aplica el interés: Anual=1, Semestral=2, Trimestral=4, Mensual=12, Diaria=365." />
          </label>
          <select
            value={capitalizaciones}
            onChange={(e) => setCapitalizaciones(Number(e.target.value))}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-mono"
          >
            {CAPITALIZACIONES.map((c) => (
              <option key={c.id} value={c.id}>{c.label}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="p-6 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800">
        <p className="text-xs font-bold text-indigo-700 dark:text-indigo-400 uppercase mb-1 flex items-center gap-1">
          Tasa efectiva anual
          <span title="Lo que realmente ganas o pagas al año, considerando la capitalización." className="cursor-help">
            <HelpCircle className="w-3.5 h-3.5 text-indigo-400" />
          </span>
        </p>
        <p className="text-3xl font-black text-slate-900 dark:text-white">{tasaEfectivaPct.toFixed(2)}%</p>
      </div>
      <div className="mt-6">
        <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">Comparativa por frecuencia</p>
        <div className="space-y-2">
          {comparativa.map((f) => (
            <div key={f.n} className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-700 last:border-0">
              <span className="text-sm text-slate-600 dark:text-slate-400">{f.label}</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white">{f.efectiva}%</span>
            </div>
          ))}
        </div>
      </div>
      <PricingModal isOpen={showPricing} onClose={() => setShowPricing(false)} />
    </div>
  );
}
