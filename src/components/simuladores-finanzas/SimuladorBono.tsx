"use client";

import { useMemo, useState, useEffect } from "react";
import { precioBono } from "@/lib/finanzas";
import { InputLibre } from "./InputLibre";
import { FileDown, Save } from "lucide-react";
import { useSession } from "next-auth/react";
import PricingModal from "../PricingModal";

export default function SimuladorBono({ initialData }: { initialData?: any }) {
  const { data: session } = useSession();
  const [showPricing, setShowPricing] = useState(false);
  const [exportando, setExportando] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [nominal, setNominal] = useState(100);
  const [cuponPct, setCuponPct] = useState(10);
  const [ytmPct, setYtmPct] = useState(12);
  const [anios, setAnios] = useState(10);

  useEffect(() => {
    if (initialData?.data?.nominal) setNominal(initialData.data.nominal);
    if (initialData?.data?.cuponPct) setCuponPct(initialData.data.cuponPct);
    if (initialData?.data?.ytmPct) setYtmPct(initialData.data.ytmPct);
    if (initialData?.data?.anios) setAnios(initialData.data.anios);
  }, [initialData]);

  const { precio, flujos } = useMemo(() => {
    const n = Math.max(0, Math.floor(anios));
    if (n === 0) return { precio: nominal, flujos: [] };
    return precioBono(nominal, cuponPct / 100, ytmPct / 100, n);
  }, [nominal, cuponPct, ytmPct, anios]);

  const exportarReporte = async () => {
    if ((session?.user?.credits ?? 0) < 1) {
      setShowPricing(true);
      return;
    }
    setExportando(true);
    try {
      const { registrarExportacion } = await import("@/lib/actions/exportActions");
      await registrarExportacion("Finanzas Bono", "PDF");

      const { exportarFinanzasAPdf } = await import("@/lib/exportarFinanzasPdf");

      await exportarFinanzasAPdf({
        tipo: 'Bono',
        titulo: 'Valuación de Bonos',
        variables: [
          { label: 'Valor Nominal', valor: `$${nominal}` },
          { label: 'Tasa Cupón', valor: `${cuponPct}%` },
          { label: 'YTM (Rendimiento)', valor: `${ytmPct}%` },
          { label: 'Años al Vencimiento', valor: `${anios}` },
        ],
        resultados: [
          { label: 'Precio Teórico', valor: `$${precio.toFixed(2)}` },
          { label: 'Cupón Anual', valor: `$${(nominal * cuponPct / 100).toFixed(2)}` },
        ],
        extra: {
          label: 'Flujos de Caja y Valor Presente',
          columns: ['Año', 'Cupón', 'Principal', 'VP'],
          data: flujos.map(f => ({
            periodo: f.periodo,
            cupon: `$${f.cupon.toFixed(2)}`,
            principal: f.principal > 0 ? `$${f.principal.toFixed(2)}` : '—',
            vp: `$${f.vp.toFixed(2)}`
          }))
        }
      });
    } catch (e) {
      console.error(e);
      if (String(e).includes("créditos")) setShowPricing(true);
      else alert("Error al exportar reporte");
    } finally {
      setExportando(false);
    }
  };

  const handleSave = async () => {
    setGuardando(true);
    try {
      const { saveScenario } = await import("@/lib/actions/scenarioActions");
      const resSave = await saveScenario({
        type: "FINANZAS",
        subType: "BONO",
        name: `Bono ${new Date().toLocaleDateString()}`,
        variables: { nominal, cuponPct, ytmPct, anios },
        results: { precio },
      });
      if (resSave.success) alert("Escenario guardado");
      else alert(resSave.error);
    } catch (e) {
      alert("Error al guardar");
    } finally {
      setGuardando(false);
    }
  };

  const sobrePar = precio > nominal;
  const bajoPar = precio < nominal;
  const precioValido = Number.isFinite(precio) && !Number.isNaN(precio);

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 shadow-lg p-5">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
        <div>
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 italic">Precio de un bono (valoración)</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400">Precio = VP cupones + VP principal</p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={exportarReporte}
            disabled={exportando}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-900 dark:bg-slate-700 text-white hover:bg-slate-800 dark:hover:bg-slate-600 transition-all shadow-md active:scale-95 disabled:opacity-50"
          >
            <FileDown className="w-3.5 h-3.5" />
            {exportando ? "Generando..." : "Reporte PDF"}
          </button>
          {session && (
            <button
              type="button"
              onClick={handleSave}
              disabled={guardando}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold bg-blue-600 text-white hover:bg-blue-500 transition-all shadow-md active:scale-95 disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              {guardando ? "Guardando..." : "Guardar"}
            </button>
          )}
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <InputLibre label="Valor nominal $" value={nominal} onChange={setNominal} step="0.01" />
          <InputLibre label="Tasa cupón %" value={cuponPct} onChange={setCuponPct} suffix="%" step="0.01" />
          <InputLibre label="YTM (rendimiento) %" value={ytmPct} onChange={setYtmPct} suffix="%" step="0.01" />
          <InputLibre label="Años al vencimiento" value={anios} onChange={setAnios} step="0.1" />
        </div>
        <div className="space-y-3">
          <div className={`rounded-xl border p-4 ${sobrePar ? "border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/30" : bajoPar ? "border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/30" : "border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/50"}`}>
            <p className="text-xs font-semibold uppercase text-slate-600 dark:text-slate-400">Precio teórico del bono</p>
            <p className="text-2xl font-bold font-mono text-slate-900 dark:text-slate-100">
              {precioValido ? `$${precio.toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "—"}
            </p>
            <p className="text-xs mt-1 text-slate-500 dark:text-slate-400">
              {precioValido && (sobrePar ? "Sobre la par" : bajoPar ? "Bajo la par" : "A la par")}
            </p>
          </div>
        </div>
      </div>
      {flujos.length > 0 && (
        <div className="mt-4 overflow-x-auto">
          <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">Flujos y valor presente por periodo</p>
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-600">
                <th className="text-left py-1.5 px-2 text-slate-600 dark:text-slate-400">Año</th>
                <th className="text-right py-1.5 px-2 text-slate-600 dark:text-slate-400">Cupón</th>
                <th className="text-right py-1.5 px-2 text-slate-600 dark:text-slate-400">Principal</th>
                <th className="text-right py-1.5 px-2 text-slate-600 dark:text-slate-400">VP</th>
              </tr>
            </thead>
            <tbody>
              {flujos.map((f) => (
                <tr key={f.periodo} className="border-b border-slate-100 dark:border-slate-700/50">
                  <td className="py-1 px-2 font-mono">{f.periodo}</td>
                  <td className="text-right font-mono">${f.cupon.toFixed(2)}</td>
                  <td className="text-right font-mono">{f.principal > 0 ? `$${f.principal.toFixed(2)}` : "—"}</td>
                  <td className="text-right font-mono text-slate-700 dark:text-slate-300">${f.vp.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <PricingModal isOpen={showPricing} onClose={() => setShowPricing(false)} />
    </div>
  );
}
