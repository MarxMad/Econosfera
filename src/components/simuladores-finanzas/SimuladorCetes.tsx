"use client";

import { useMemo, useState, useEffect } from "react";
import { cetesPrecio, cetesRendimiento } from "@/lib/finanzas";
import { InputLibre } from "./InputLibre";
import { FileDown, Save } from "lucide-react";
import { useSession } from "next-auth/react";
import PricingModal from "../PricingModal";

const PLAZOS_RAPIDOS = [28, 91, 182, 364];

export default function SimuladorCetes({ initialData }: { initialData?: any }) {
  const { data: session } = useSession();
  const [showPricing, setShowPricing] = useState(false);
  const [exportando, setExportando] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [nominal, setNominal] = useState(10);
  const [tasaPct, setTasaPct] = useState(11);
  const [dias, setDias] = useState(91);

  useEffect(() => {
    if (initialData?.data?.nominal) setNominal(initialData.data.nominal);
    if (initialData?.data?.tasaPct) setTasaPct(initialData.data.tasaPct);
    if (initialData?.data?.dias) setDias(initialData.data.dias);
  }, [initialData]);

  const tasa = tasaPct / 100;
  const precio = useMemo(() => {
    if (dias <= 0) return nominal;
    return cetesPrecio(nominal, tasa, dias);
  }, [nominal, tasa, dias]);

  const todosPlazos = useMemo(() => {
    const plazos = Array.from(new Set([...PLAZOS_RAPIDOS, dias].filter((d) => d > 0))).sort((a, b) => a - b);
    return plazos.slice(0, 8).map((d) => ({
      dias: d,
      precio: cetesPrecio(nominal, tasa, d),
      rendimiento: (cetesRendimiento(nominal, cetesPrecio(nominal, tasa, d), d) * 100).toFixed(2),
    }));
  }, [nominal, tasa, dias]);

  const exportarReporte = async () => {
    if ((session?.user?.credits ?? 0) < 1) {
      setShowPricing(true);
      return;
    }
    setExportando(true);
    try {
      const { registrarExportacion } = await import("@/lib/actions/exportActions");
      await registrarExportacion("Finanzas Cetes", "PDF");

      const { exportarFinanzasAPdf } = await import("@/lib/exportarFinanzasPdf");

      await exportarFinanzasAPdf({
        tipo: 'Cetes',
        titulo: 'Análisis de Cetes',
        variables: [
          { label: 'Valor Nominal', valor: `$${nominal}` },
          { label: 'Tasa Rendimiento', valor: `${tasaPct}%` },
          { label: 'Plazo (Días)', valor: `${dias}` },
        ],
        resultados: [
          { label: 'Precio Actual', valor: `$${precio.toFixed(4)}` },
          { label: 'Ganancia por Cete', valor: `$${(nominal - precio).toFixed(4)}` },
        ],
        extra: {
          label: 'Precios por Plazo (Misma Tasa)',
          columns: ['Días', 'Precio', 'Rendimiento'],
          data: todosPlazos.map(p => ({
            dias: `${p.dias} días`,
            precio: `$${p.precio.toFixed(4)}`,
            rendimiento: `${p.rendimiento}%`
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
        subType: "CETES",
        name: `Cetes ${new Date().toLocaleDateString()}`,
        variables: { nominal, tasaPct, dias },
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

  const precioValido = Number.isFinite(precio) && precio > 0;

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 shadow-lg p-5">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
        <div>
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 italic">Cetes: precio y rendimiento</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400">P = VN / (1 + r × días/360)</p>
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
          <InputLibre label="Tasa de rendimiento anual %" value={tasaPct} onChange={setTasaPct} suffix="%" step="0.01" />
          <div className="space-y-1">
            <InputLibre label="Plazo (días)" value={dias} onChange={setDias} step="1" />
            <div className="flex gap-2 flex-wrap pt-1">
              {PLAZOS_RAPIDOS.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDias(d)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${dias === d
                    ? "bg-teal-600 text-white"
                    : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600"
                    }`}
                >
                  {d} días
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="space-y-3">
          <div className="rounded-xl border border-teal-200 dark:border-teal-800 bg-teal-50 dark:bg-teal-900/30 p-4">
            <p className="text-xs font-semibold uppercase text-teal-600 dark:text-teal-400">Precio por Cete (valor nominal ${nominal})</p>
            <p className="text-2xl font-bold font-mono text-slate-900 dark:text-slate-100">
              {precioValido ? `$${precio.toLocaleString("es-MX", { minimumFractionDigits: 4, maximumFractionDigits: 4 })}` : "—"}
            </p>
            <p className="text-xs mt-1 text-slate-500 dark:text-slate-400">Ganancia = ${(nominal - precio).toFixed(4)}</p>
          </div>
        </div>
      </div>
      {todosPlazos.length > 0 && (
        <div className="mt-4 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/50 p-4">
          <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">Precio por plazo (misma tasa)</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {todosPlazos.map(({ dias: d, precio: p, rendimiento }) => (
              <div key={d} className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600">
                <p className="text-xs text-slate-500 dark:text-slate-400">{d} días</p>
                <p className="font-mono font-bold text-slate-800 dark:text-slate-200">${Number(p).toFixed(4)}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Rend. {rendimiento}%</p>
              </div>
            ))}
          </div>
        </div>
      )}
      <PricingModal isOpen={showPricing} onClose={() => setShowPricing(false)} />
    </div>
  );
}
