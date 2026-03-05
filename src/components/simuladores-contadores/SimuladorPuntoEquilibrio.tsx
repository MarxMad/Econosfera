"use client";

import { useMemo, useState } from "react";
import { HelpCircle, FileDown, Save } from "lucide-react";
import { InputLibre } from "../simuladores-finanzas/InputLibre";
import { InstruccionesSimulador } from "../InstruccionesSimulador";
import { breakEven } from "@/lib/finanzas";
import { useSession } from "next-auth/react";
import PricingModal from "../PricingModal";

export default function SimuladorPuntoEquilibrio() {
  const { data: session } = useSession();
  const [showPricing, setShowPricing] = useState(false);
  const [exportando, setExportando] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [costosFijos, setCostosFijos] = useState(50000);
  const [precioVenta, setPrecioVenta] = useState(100);
  const [costoVariableUnitario, setCostoVariableUnitario] = useState(40);

  const { cantidad, ventas } = useMemo(
    () => breakEven(costosFijos, precioVenta, costoVariableUnitario),
    [costosFijos, precioVenta, costoVariableUnitario]
  );
  const finito = Number.isFinite(cantidad) && cantidad < 1e10;
  const margenContribucion = precioVenta - costoVariableUnitario;

  const handleExport = async () => {
    if ((session?.user?.credits ?? 0) < 1) { setShowPricing(true); return; }
    setExportando(true);
    try {
      await import("@/lib/actions/exportActions").then((m) => m.registrarExportacion("Contabilidad Punto Equilibrio", "PDF"));
      await import("@/lib/exportarContabilidadPdf").then((m) => m.exportarContabilidadAPdf({
        tipo: "PuntoEquilibrio",
        titulo: "Punto de equilibrio",
        variables: [
          { label: "Costos fijos", valor: `$${costosFijos.toLocaleString("es-MX")}` },
          { label: "Precio venta", valor: `$${precioVenta.toFixed(2)}` },
          { label: "Costo variable unit.", valor: `$${costoVariableUnitario.toFixed(2)}` },
        ],
        resultados: [
          { label: "Cantidad equilibrio", valor: finito ? cantidad.toLocaleString("es-MX", { maximumFractionDigits: 0 }) : "—" },
          { label: "Ventas equilibrio", valor: finito ? `$${ventas.toLocaleString("es-MX", { maximumFractionDigits: 0 })}` : "—" },
          { label: "Margen contribución", valor: `$${margenContribucion.toFixed(2)}/unid` },
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
        type: "CONTABILIDAD",
        subType: "PUNTO_EQUILIBRIO",
        name: `Punto equilibrio ${new Date().toLocaleDateString()}`,
        variables: { costosFijos, precioVenta, costoVariableUnitario },
        results: { cantidad, ventas, margenContribucion },
      });
      if (res.success) alert("Escenario guardado");
      else alert(res.error);
    } catch (e) { alert("Error al guardar"); } finally { setGuardando(false); }
  };

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 shadow-lg p-5">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
        <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">Punto de equilibrio</h3>
        <div className="flex gap-2">
          <button type="button" onClick={handleExport} disabled={exportando} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-900 dark:bg-slate-700 text-white hover:bg-slate-800 dark:hover:bg-slate-600 transition-all shadow-md active:scale-95 disabled:opacity-50">
            <FileDown className="w-3.5 h-3.5" />
            {exportando ? "Generando..." : "Reporte PDF"}
          </button>
          {session && (
            <button type="button" onClick={handleSave} disabled={guardando} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold bg-teal-600 text-white hover:bg-teal-500 transition-all shadow-md active:scale-95 disabled:opacity-50">
              <Save className="w-3.5 h-3.5" />
              {guardando ? "Guardando..." : "Guardar"}
            </button>
          )}
        </div>
      </div>
      <p className="text-xs text-slate-600 dark:text-slate-400 mb-4">
        Q = CF / (P − CVu). Cantidad donde ingresos = costos totales.
      </p>

      <InstruccionesSimulador>
        <p>Calcula cuántas unidades debes vender para no ganar ni perder. Útil para planeación y análisis costo-volumen-utilidad.</p>
        <ul className="list-disc list-inside space-y-1 ml-1">
          <li><strong>Costos fijos:</strong> No cambian con el volumen (renta, salarios, depreciación).</li>
          <li><strong>Precio de venta:</strong> Precio unitario que cobras.</li>
          <li><strong>Costo variable unitario:</strong> Costo por unidad que varía con la producción.</li>
        </ul>
        <p>Margen de contribución = P − CVu. Debe ser positivo para tener punto de equilibrio.</p>
      </InstruccionesSimulador>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="space-y-4">
          <InputLibre label="Costos fijos $" value={costosFijos} onChange={setCostosFijos} step="100" tooltip="Gastos que no dependen del volumen." />
          <InputLibre label="Precio de venta unitario $" value={precioVenta} onChange={setPrecioVenta} step="0.01" tooltip="Precio que cobras por unidad." />
          <InputLibre label="Costo variable unitario $" value={costoVariableUnitario} onChange={setCostoVariableUnitario} step="0.01" tooltip="Costo por unidad que varía con la producción." />
        </div>
        <div className="space-y-4">
          <div className="p-4 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20">
            <p className="text-xs font-bold text-emerald-600 uppercase mb-1 flex items-center gap-1">Cantidad de equilibrio<span title="CF / (P − CVu). Unidades donde ingresos = costos." className="cursor-help"><HelpCircle className="w-3.5 h-3.5 text-emerald-500" /></span></p>
            <p className="text-2xl font-black text-slate-900 dark:text-white">{finito ? cantidad.toLocaleString("es-MX", { maximumFractionDigits: 0 }) : "—"}</p>
          </div>
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/50">
            <p className="text-xs font-bold text-slate-500 uppercase mb-1 flex items-center gap-1">Ventas en equilibrio<span title="Cantidad × Precio de venta." className="cursor-help"><HelpCircle className="w-3.5 h-3.5 text-slate-400" /></span></p>
            <p className="text-xl font-bold text-slate-900 dark:text-white">{finito ? `$${ventas.toLocaleString("es-MX", { maximumFractionDigits: 0 })}` : "—"}</p>
          </div>
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-600">
            <p className="text-xs font-bold text-slate-500 uppercase mb-1 flex items-center gap-1">Margen de contribución<span title="P − CVu. Debe ser positivo para equilibrio." className="cursor-help"><HelpCircle className="w-3.5 h-3.5 text-slate-400" /></span></p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">${margenContribucion.toFixed(2)} / unidad</p>
          </div>
        </div>
      </div>
      {precioVenta <= costoVariableUnitario && (
        <p className="text-xs text-amber-600 dark:text-amber-400">El precio debe ser mayor que el costo variable para tener punto de equilibrio.</p>
      )}
      <PricingModal isOpen={showPricing} onClose={() => setShowPricing(false)} />
    </div>
  );
}
