"use client";

import { useMemo, useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { ahorroPeriodicoVF, ahorroEvolucion } from "@/lib/finanzas";
import { InputLibre } from "./InputLibre";
import { FileDown, Save } from "lucide-react";
import { useSession } from "next-auth/react";

import Heatmap from "../common/Heatmap";
import PricingModal from "../PricingModal";

export default function SimuladorAhorro({ initialData }: { initialData?: any }) {
  const { data: session } = useSession();
  const [showPricing, setShowPricing] = useState(false);
  const [exportando, setExportando] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [aportacion, setAportacion] = useState(2000);
  const [tasaPct, setTasaPct] = useState(10);
  const [anos, setAnos] = useState(10);

  useEffect(() => {
    if (initialData?.data?.aportacion) setAportacion(initialData.data.aportacion);
    if (initialData?.data?.tasaPct) setTasaPct(initialData.data.tasaPct);
    if (initialData?.data?.anos) setAnos(initialData.data.anos);
  }, [initialData]);

  const tasa = tasaPct / 100;
  const anosSeguro = Math.max(0, Math.min(50, anos));
  const vf = useMemo(() => ahorroPeriodicoVF(aportacion, tasa, anos), [aportacion, tasa, anos]);
  const datosGrafico = useMemo(() => ahorroEvolucion(aportacion, tasa, anosSeguro), [aportacion, tasa, anosSeguro]);
  const totalAportado = aportacion * 12 * anos;

  const exportarReporte = async () => {
    if ((session?.user?.credits ?? 0) < 1) {
      setShowPricing(true);
      return;
    }
    setExportando(true);
    try {
      const { registrarExportacion } = await import("@/lib/actions/exportActions");
      await registrarExportacion("Finanzas Ahorro", "PDF");

      const { exportarFinanzasAPdf } = await import("@/lib/exportarFinanzasPdf");
      const { getGraficoAsDataUrl } = await import("@/lib/exportarGrafico");
      let chartUrl = null;
      try { chartUrl = await getGraficoAsDataUrl("grafico-ahorro"); } catch (e) { }

      await exportarFinanzasAPdf({
        tipo: 'Ahorro',
        titulo: 'Ahorro e Interés Compuesto',
        variables: [
          { label: 'Aportación Mensual', valor: `$${aportacion}` },
          { label: 'Tasa Anual', valor: `${tasaPct}%` },
          { label: 'Años', valor: `${anos}` },
        ],
        resultados: [
          { label: 'Monto Acumulado (VF)', valor: `$${vf.toLocaleString("es-MX")}` },
          { label: 'Total Aportado', valor: `$${totalAportado.toLocaleString("es-MX")}` },
          { label: 'Interés Ganado', valor: `$${(vf - totalAportado).toLocaleString("es-MX")}` },
        ],
        chart: chartUrl
      });
    } catch (e) {
      console.error(e);
      if (String(e).includes("créditos")) setShowPricing(true);
      else alert("Error al exportar reporte");
    } finally {
      setExportando(false);
    }
  };

  const vfValido = Number.isFinite(vf) && !Number.isNaN(vf);

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 shadow-lg p-5">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
        <div>
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 italic">Ahorro mensual e interés compuesto</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400">VF = A × [((1+r)^n − 1) / r]</p>
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
              onClick={async () => {
                setGuardando(true);
                try {
                  const { saveScenario } = await import("@/lib/actions/scenarioActions");
                  const resSave = await saveScenario({
                    type: "FINANZAS",
                    subType: "AHORRO",
                    name: `Ahorro ${new Date().toLocaleDateString()}`,
                    variables: { aportacion, tasaPct, anos },
                    results: { vf },
                  });
                  if (resSave.success) alert("Escenario guardado");
                  else alert(resSave.error);
                } catch (e) {
                  alert("Error al guardar");
                } finally {
                  setGuardando(false);
                }
              }}
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
          <InputLibre label="Aportación mensual $" value={aportacion} onChange={setAportacion} step="0.01" />
          <InputLibre label="Tasa anual %" value={tasaPct} onChange={setTasaPct} suffix="%" step="0.01" />
          <InputLibre label="Años" value={anos} onChange={setAnos} step="0.1" />
        </div>
        <div className="space-y-3">
          <div className="rounded-xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-900/30 p-4">
            <p className="text-xs font-semibold uppercase text-indigo-600 dark:text-indigo-400">Monto acumulado (VF)</p>
            <p className="text-2xl font-bold font-mono text-slate-900 dark:text-slate-100">
              {vfValido ? `$${vf.toLocaleString("es-MX", { maximumFractionDigits: 0 })}` : "—"}
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/50 p-4">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total aportado</p>
            <p className="text-lg font-mono font-bold text-slate-800 dark:text-slate-200">
              ${totalAportado.toLocaleString("es-MX", { maximumFractionDigits: 0 })}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {vfValido ? `Interés ganado ≈ $${(vf - totalAportado).toLocaleString("es-MX", { maximumFractionDigits: 0 })}` : ""}
            </p>
          </div>
        </div>
      </div>
      {datosGrafico.length > 0 && (
        <div className="space-y-6">
          <div id="grafico-ahorro" className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={datosGrafico} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-600" />
                <XAxis dataKey="periodo" name="Mes" tick={{ fontSize: 10 }} tickFormatter={(v) => (v % 12 === 0 ? `${v / 12}a` : "")} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => (v >= 1000 ? `$${v / 1000}k` : `$${v}`)} />
                <Tooltip formatter={(val: number) => [`$${Number(val).toLocaleString("es-MX", { maximumFractionDigits: 0 })}`, "Acumulado"]} labelFormatter={(l) => `Mes ${l}`} />
                <Line type="monotone" dataKey="acumulado" stroke="#6366f1" strokeWidth={2} dot={false} name="Acumulado" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="pt-2">
            <Heatmap
              title="Matriz de Crecimiento (VF)"
              subtitle="Impacto de la tasa y el tiempo en tu ahorro acumulado"
              xAxisLabel="Años"
              yAxisLabel="Tasa %"
              xValues={[5, 10, 15, 20]}
              yValues={[5, 8, 10, 12, 15]}
              data={[5, 8, 10, 12, 15].map(r =>
                [5, 10, 15, 20].map(y => ahorroPeriodicoVF(aportacion, r / 100, y))
              )}
              formatter={(val) => `$${Math.round(val / 1000)}k`}
            />
          </div>
        </div>
      )}
      <PricingModal isOpen={showPricing} onClose={() => setShowPricing(false)} />
    </div>
  );
}

