"use client";

import { useMemo, useState } from "react";
import { InputLibre } from "../simuladores-finanzas/InputLibre";
import { InstruccionesSimulador } from "../InstruccionesSimulador";
import { calcularEstadoResultados } from "@/lib/contabilidad";

export default function SimuladorEstadoResultados() {
  const [ventasNetas, setVentasNetas] = useState(1000000);
  const [costoVentas, setCostoVentas] = useState(500000);
  const [gastosOperacion, setGastosOperacion] = useState(200000);
  const [otrosGastos, setOtrosGastos] = useState(30000);
  const [tasaImpuestos, setTasaImpuestos] = useState(0.3);

  const er = useMemo(
    () => calcularEstadoResultados(ventasNetas, costoVentas, gastosOperacion, otrosGastos, tasaImpuestos),
    [ventasNetas, costoVentas, gastosOperacion, otrosGastos, tasaImpuestos]
  );

  const fmt = (n: number) => n.toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const pct = (n: number) => (n * 100).toFixed(1) + "%";

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 shadow-lg p-5">
      <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-3">Estado de resultados</h3>
      <p className="text-xs text-slate-600 dark:text-slate-400 mb-4">
        Estructura básica: Ventas − Costo ventas = Utilidad bruta − Gastos = Utilidad neta.
      </p>

      <InstruccionesSimulador>
        <p>Construye un estado de resultados (estado de pérdidas y ganancias) paso a paso.</p>
        <ul className="list-disc list-inside space-y-1 ml-1">
          <li><strong>Ventas netas:</strong> Ingresos por ventas menos devoluciones y descuentos.</li>
          <li><strong>Costo de ventas:</strong> Costo de lo vendido (inventario inicial + compras − inventario final).</li>
          <li><strong>Gastos de operación:</strong> Administrativos, ventas, etc.</li>
          <li><strong>Otros gastos:</strong> Intereses, pérdidas no operativas.</li>
          <li><strong>Tasa impuestos:</strong> Porcentaje sobre utilidad antes de impuestos (ej. 0.30 = 30%).</li>
        </ul>
      </InstruccionesSimulador>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="space-y-4">
          <InputLibre label="Ventas netas $" value={ventasNetas} onChange={setVentasNetas} step="1000" tooltip="Ingresos por ventas menos devoluciones y descuentos." />
          <InputLibre label="Costo de ventas $" value={costoVentas} onChange={setCostoVentas} step="1000" tooltip="Costo de la mercancía vendida." />
          <InputLibre label="Gastos de operación $" value={gastosOperacion} onChange={setGastosOperacion} step="1000" tooltip="Gastos administrativos, ventas, etc." />
          <InputLibre label="Otros gastos $" value={otrosGastos} onChange={setOtrosGastos} step="1000" tooltip="Intereses, pérdidas no operativas." />
          <InputLibre label="Tasa impuestos (0-1)" value={tasaImpuestos} onChange={setTasaImpuestos} step="0.01" tooltip="Ej: 0.30 = 30% de ISR." />
        </div>
        <div className="rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/50 p-4 font-mono text-sm">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Ventas netas</span>
              <span className="font-bold">${fmt(er.ventasNetas)}</span>
            </div>
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>− Costo de ventas</span>
              <span>(${fmt(er.costoVentas)})</span>
            </div>
            <div className="flex justify-between border-t border-slate-200 dark:border-slate-600 pt-2">
              <span className="font-semibold">Utilidad bruta</span>
              <span className="font-bold text-emerald-600">${fmt(er.utilidadBruta)}</span>
            </div>
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>− Gastos operación</span>
              <span>(${fmt(er.gastosOperacion)})</span>
            </div>
            <div className="flex justify-between border-t border-slate-200 dark:border-slate-600 pt-2">
              <span className="font-semibold">Utilidad operación</span>
              <span className="font-bold">${fmt(er.utilidadOperacion)}</span>
            </div>
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>− Otros gastos</span>
              <span>(${fmt(er.otrosGastos)})</span>
            </div>
            <div className="flex justify-between">
              <span>Utilidad antes impuestos</span>
              <span>${fmt(er.utilidadAntesImpuestos)}</span>
            </div>
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>− Impuestos</span>
              <span>(${fmt(er.impuestos)})</span>
            </div>
            <div className="flex justify-between border-t-2 border-emerald-500 pt-2">
              <span className="font-bold">Utilidad neta</span>
              <span className="font-black text-emerald-600">${fmt(er.utilidadNeta)}</span>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-600 grid grid-cols-3 gap-2 text-xs">
            <div><span className="text-slate-500">Margen bruto</span><p className="font-bold">{pct(er.margenBruto)}</p></div>
            <div><span className="text-slate-500">Margen operativo</span><p className="font-bold">{pct(er.margenOperativo)}</p></div>
            <div><span className="text-slate-500">Margen neto</span><p className="font-bold">{pct(er.margenNeto)}</p></div>
          </div>
        </div>
      </div>
    </div>
  );
}
