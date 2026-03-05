"use client";

import { useMemo, useState } from "react";
import { HelpCircle, FileDown, Save } from "lucide-react";
import { InputLibre } from "../simuladores-finanzas/InputLibre";
import { InstruccionesSimulador } from "../InstruccionesSimulador";
import { costoFIFO, costoLIFO, costoPromedioPonderado, type MovimientoInventario } from "@/lib/contabilidad";
import { useSession } from "next-auth/react";
import PricingModal from "../PricingModal";

export default function SimuladorCostosInventario() {
  const { data: session } = useSession();
  const [showPricing, setShowPricing] = useState(false);
  const [exportando, setExportando] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [e1u, setE1u] = useState(100);
  const [e1c, setE1c] = useState(10);
  const [e2u, setE2u] = useState(150);
  const [e2c, setE2c] = useState(12);
  const [e3u, setE3u] = useState(80);
  const [e3c, setE3c] = useState(11);
  const [s1u, setS1u] = useState(120);
  const [s2u, setS2u] = useState(100);

  const movimientos: MovimientoInventario[] = useMemo(
    () => [
      { fecha: "01-ene", tipo: "entrada", unidades: e1u, costoUnitario: e1c },
      { fecha: "15-ene", tipo: "entrada", unidades: e2u, costoUnitario: e2c },
      { fecha: "20-ene", tipo: "salida", unidades: s1u, costoUnitario: 0 },
      { fecha: "25-ene", tipo: "entrada", unidades: e3u, costoUnitario: e3c },
      { fecha: "30-ene", tipo: "salida", unidades: s2u, costoUnitario: 0 },
    ],
    [e1u, e1c, e2u, e2c, e3u, e3c, s1u, s2u]
  );

  const fifo = useMemo(() => costoFIFO(movimientos), [movimientos]);
  const lifo = useMemo(() => costoLIFO(movimientos), [movimientos]);
  const prom = useMemo(() => costoPromedioPonderado(movimientos), [movimientos]);

  const handleExport = async () => {
    if ((session?.user?.credits ?? 0) < 1) { setShowPricing(true); return; }
    setExportando(true);
    try {
      await import("@/lib/actions/exportActions").then((m) => m.registrarExportacion("Contabilidad Costos Inventario", "PDF"));
      await import("@/lib/exportarContabilidadPdf").then((m) => m.exportarContabilidadAPdf({
        tipo: "CostosInventario",
        titulo: "Costo de ventas e inventario (FIFO, LIFO, Promedio)",
        variables: [
          { label: "Entrada 1", valor: `${e1u} unid. @ $${e1c}` },
          { label: "Entrada 2", valor: `${e2u} unid. @ $${e2c}` },
          { label: "Entrada 3", valor: `${e3u} unid. @ $${e3c}` },
          { label: "Salida 1", valor: `${s1u} unid.` },
          { label: "Salida 2", valor: `${s2u} unid.` },
        ],
        resultados: [
          { label: "FIFO costo ventas", valor: `$${fifo.costoVentas.toLocaleString("es-MX", { minimumFractionDigits: 2 })}` },
          { label: "LIFO costo ventas", valor: `$${lifo.costoVentas.toLocaleString("es-MX", { minimumFractionDigits: 2 })}` },
          { label: "Promedio costo ventas", valor: `$${prom.costoVentas.toLocaleString("es-MX", { minimumFractionDigits: 2 })}` },
        ],
        extra: {
          label: "Inventario final por método",
          columns: ["Método", "Costo ventas", "Inventario final"],
          data: [fifo, lifo, prom].map(r => [r.metodo, `$${r.costoVentas.toFixed(2)}`, `$${r.inventarioFinal.toFixed(2)}`]),
        },
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
        subType: "COSTOS_INVENTARIO",
        name: `Costos inventario ${new Date().toLocaleDateString()}`,
        variables: { e1u, e1c, e2u, e2c, e3u, e3c, s1u, s2u },
        results: { fifo, lifo, prom },
      });
      if (res.success) alert("Escenario guardado");
      else alert(res.error);
    } catch (e) { alert("Error al guardar"); } finally { setGuardando(false); }
  };

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 shadow-lg p-5">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
        <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">Costo de ventas e inventario</h3>
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
        Compara FIFO, LIFO y promedio ponderado con el mismo flujo de movimientos.
      </p>
      <InstruccionesSimulador>
        <p>Valuación de inventarios y costo de ventas. El método afecta utilidad e inventario final.</p>
        <ul className="list-disc list-inside space-y-1 ml-1">
          <li><strong>FIFO:</strong> Primeras entradas, primeras salidas. Inventario final a costos recientes.</li>
          <li><strong>LIFO:</strong> Últimas entradas, primeras salidas. Costo de ventas a costos recientes.</li>
          <li><strong>Promedio:</strong> Costo unitario ponderado de todas las entradas disponibles.</li>
        </ul>
      </InstruccionesSimulador>
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div>
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Entradas</p>
          <div className="space-y-3">
            <div className="flex gap-3 items-end">
              <InputLibre label="Entrada 1: unidades" value={e1u} onChange={setE1u} step="1" tooltip="Cantidad de unidades que ingresan al inventario en la primera compra." />
              <InputLibre label="Costo unit." value={e1c} onChange={setE1c} step="0.01" tooltip="Costo unitario de la primera compra." />
            </div>
            <div className="flex gap-3 items-end">
              <InputLibre label="Entrada 2: unidades" value={e2u} onChange={setE2u} step="1" tooltip="Cantidad de unidades de la segunda compra." />
              <InputLibre label="Costo unit." value={e2c} onChange={setE2c} step="0.01" tooltip="Costo unitario de la segunda compra." />
            </div>
            <div className="flex gap-3 items-end">
              <InputLibre label="Entrada 3: unidades" value={e3u} onChange={setE3u} step="1" tooltip="Cantidad de unidades de la tercera compra." />
              <InputLibre label="Costo unit." value={e3c} onChange={setE3c} step="0.01" tooltip="Costo unitario de la tercera compra." />
            </div>
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Salidas</p>
          <div className="space-y-3">
            <InputLibre label="Salida 1: unidades" value={s1u} onChange={setS1u} step="1" tooltip="Unidades vendidas o consumidas en la primera salida." />
            <InputLibre label="Salida 2: unidades" value={s2u} onChange={setS2u} step="1" tooltip="Unidades vendidas o consumidas en la segunda salida." />
          </div>
        </div>
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        {[fifo, lifo, prom].map((r) => (
          <div key={r.metodo} className="p-4 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50/50 dark:bg-slate-800/30">
            <p className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-2 flex items-center gap-1">
              {r.metodo}
              <span title={r.metodo === "FIFO" ? "Primeras entradas, primeras salidas." : r.metodo === "LIFO" ? "Últimas entradas, primeras salidas." : "Costo promedio ponderado de entradas."} className="cursor-help"><HelpCircle className="w-3.5 h-3.5 text-slate-400" /></span>
            </p>
            <div className="space-y-1 text-sm">
              <p><span title="Valor de las unidades vendidas según el método." className="cursor-help align-middle"><HelpCircle className="w-3 h-3 text-slate-400 inline mr-0.5" /></span>Costo de ventas: <span className="font-mono font-bold">${r.costoVentas.toLocaleString("es-MX", { minimumFractionDigits: 2 })}</span></p>
              <p><span title="Valor de las unidades que quedan en stock." className="cursor-help align-middle"><HelpCircle className="w-3 h-3 text-slate-400 inline mr-0.5" /></span>Inventario final: <span className="font-mono font-bold">${r.inventarioFinal.toLocaleString("es-MX", { minimumFractionDigits: 2 })}</span></p>
              <p className="text-slate-500 dark:text-slate-400">Unidades vendidas: {r.unidadesVendidas}</p>
            </div>
          </div>
        ))}
      </div>
      <PricingModal isOpen={showPricing} onClose={() => setShowPricing(false)} />
    </div>
  );
}
