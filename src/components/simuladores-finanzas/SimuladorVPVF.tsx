"use client";

import { useMemo, useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { valorFuturo, valorPresente, evolucionVF } from "@/lib/finanzas";
import { InputLibre } from "./InputLibre";
import { FileDown, Save } from "lucide-react";
import { useSession } from "next-auth/react";
import Heatmap from "../common/Heatmap";

export default function SimuladorVPVF({ initialData }: { initialData?: any }) {
  const { data: session } = useSession();
  const [exportando, setExportando] = useState(false);
  const [monto, setMonto] = useState(10000);
  const [tasa, setTasa] = useState(8);
  const [anios, setAnios] = useState(5);

  useEffect(() => {
    if (initialData?.data?.monto) setMonto(initialData.data.monto);
    if (initialData?.data?.tasa) setTasa(initialData.data.tasa);
    if (initialData?.data?.anios) setAnios(initialData.data.anios);
  }, [initialData]);

  const tasaDecimal = tasa / 100;
  const aniosSeguro = Math.max(0, Math.min(100, anios));

  const res = useMemo(() => ({
    vf: valorFuturo(monto, tasaDecimal, anios),
    vp: valorPresente(10000, tasaDecimal, anios)
  }), [monto, tasaDecimal, anios]);

  const datosGrafico = useMemo(() => evolucionVF(monto, tasaDecimal, aniosSeguro), [monto, tasaDecimal, aniosSeguro]);

  const exportarReporte = async () => {
    setExportando(true);
    try {
      const { exportarFinanzasAPdf } = await import("@/lib/exportarFinanzasPdf");
      const { getGraficoAsDataUrl } = await import("@/lib/exportarGrafico");
      let chartUrl = null;
      try { chartUrl = await getGraficoAsDataUrl("grafico-vp-vf"); } catch (e) { }

      await exportarFinanzasAPdf({
        tipo: 'VPVF',
        titulo: 'Valor Presente y Valor Futuro',
        variables: [
          { label: 'Monto Inicial (VP)', valor: `$${monto}` },
          { label: 'Tasa Anual', valor: `${tasa}%` },
          { label: 'Años', valor: `${anios}` },
        ],
        resultados: [
          { label: 'Valor Futuro (VF)', valor: `$${res.vf.toLocaleString("es-MX")}` },
          { label: 'VP de $10,000 extra', valor: `$${res.vp.toLocaleString("es-MX")}` },
        ],
        chart: chartUrl
      });
    } catch (e) {
      console.error(e);
      alert("Error al exportar reporte");
    } finally {
      setExportando(false);
    }
  };

  const handleSave = async () => {
    try {
      const { saveScenario } = await import("@/lib/actions/scenarioActions");
      const resSave = await saveScenario({
        type: "FINANZAS",
        subType: "VPVF",
        name: `VP/VF ${new Date().toLocaleDateString()}`,
        variables: { monto, tasa, anios },
        results: res,
      });
      if (resSave.success) alert("Escenario guardado");
      else alert(resSave.error);
    } catch (e) {
      alert("Error al guardar");
    }
  };

  const vfValido = Number.isFinite(res.vf) && !Number.isNaN(res.vf);
  const vpValido = Number.isFinite(res.vp) && !Number.isNaN(res.vp);

  return (
    <div id="vpvf-container" className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 shadow-lg p-5">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
        <div>
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 italic">Valor presente y valor futuro</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400">VF = VP × (1 + r)ⁿ | VP = VF / (1 + r)ⁿ</p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={exportarReporte}
            disabled={exportando}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-900 dark:bg-slate-700 text-white hover:bg-slate-800 dark:hover:bg-slate-600 transition-all shadow-md active:scale-95 disabled:opacity-50"
          >
            <FileDown className="w-3.5 h-3.5" />
            {exportando ? "Generando..." : "Reporte"}
          </button>
          {session && (
            <button
              type="button"
              onClick={handleSave}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold bg-blue-600 text-white hover:bg-blue-500 transition-all shadow-md active:scale-95"
            >
              <Save className="w-3.5 h-3.5" />
              Guardar
            </button>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <InputLibre label="Monto inicial (VP) $" value={monto} onChange={setMonto} />
          <InputLibre label="Tasa de interés anual %" value={tasa} onChange={setTasa} suffix="%" step="0.01" />
          <InputLibre label="Años" value={anios} onChange={setAnios} step="0.1" />
        </div>
        <div className="space-y-3">
          <div className="rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/30 p-4">
            <p className="text-xs font-semibold uppercase text-emerald-600 dark:text-emerald-400">Valor futuro (VF)</p>
            <p className="text-xl font-bold font-mono text-slate-900 dark:text-slate-100">
              {vfValido ? `$${res.vf.toLocaleString("es-MX", { maximumFractionDigits: 0 })}` : "—"}
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/50 p-4">
            <p className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">VP de $10,000 recibidos en {anios} años</p>
            <p className="text-lg font-bold font-mono text-slate-900 dark:text-slate-100">
              {vpValido ? `$${res.vp.toLocaleString("es-MX", { maximumFractionDigits: 2 })}` : "—"}
            </p>
          </div>
        </div>
      </div>
      {datosGrafico.length > 0 && (
        <div className="space-y-6">
          <div id="grafico-vp-vf" className="mt-4 h-52">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={datosGrafico} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-600" />
                <XAxis dataKey="ano" name="Año" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => (v >= 1000 ? `$${v / 1000}k` : `$${v}`)} />
                <Tooltip formatter={(val: number) => [`$${Number(val).toLocaleString("es-MX", { maximumFractionDigits: 0 })}`, "Valor"]} labelFormatter={(l) => `Año ${l}`} />
                <Line type="monotone" dataKey="valor" stroke="#059669" strokeWidth={2} dot={datosGrafico.length <= 30 ? { r: 2 } : false} name="Valor" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="pt-2">
            <Heatmap
              title="Sensibilidad de Inversión (VF)"
              subtitle="Cómo cambia tu dinero futuro según el tiempo y el rendimiento"
              xAxisLabel="Años"
              yAxisLabel="Tasa %"
              xValues={[1, 5, 10, 20]}
              yValues={[5, 8, 10, 12, 15]}
              data={[5, 8, 10, 12, 15].map(r =>
                [1, 5, 10, 20].map(y => valorFuturo(monto, r / 100, y))
              )}
              formatter={(val) => `$${Math.round(val / 1000)}k`}
            />
          </div>
        </div>
      )}
    </div>
  );
}
