"use client";

import { useMemo, useState } from "react";
import { InputLibre } from "../simuladores-finanzas/InputLibre";
import { InstruccionesSimulador } from "../InstruccionesSimulador";
import { breakEven } from "@/lib/finanzas";

export default function SimuladorPuntoEquilibrio() {
  const [costosFijos, setCostosFijos] = useState(50000);
  const [precioVenta, setPrecioVenta] = useState(100);
  const [costoVariableUnitario, setCostoVariableUnitario] = useState(40);

  const { cantidad, ventas } = useMemo(
    () => breakEven(costosFijos, precioVenta, costoVariableUnitario),
    [costosFijos, precioVenta, costoVariableUnitario]
  );
  const finito = Number.isFinite(cantidad) && cantidad < 1e10;
  const margenContribucion = precioVenta - costoVariableUnitario;

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 shadow-lg p-5">
      <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-3">Punto de equilibrio</h3>
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
            <p className="text-xs font-bold text-emerald-600 uppercase mb-1">Cantidad de equilibrio</p>
            <p className="text-2xl font-black text-slate-900 dark:text-white">{finito ? cantidad.toLocaleString("es-MX", { maximumFractionDigits: 0 }) : "—"}</p>
          </div>
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/50">
            <p className="text-xs font-bold text-slate-500 uppercase mb-1">Ventas en equilibrio</p>
            <p className="text-xl font-bold text-slate-900 dark:text-white">{finito ? `$${ventas.toLocaleString("es-MX", { maximumFractionDigits: 0 })}` : "—"}</p>
          </div>
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-600">
            <p className="text-xs font-bold text-slate-500 uppercase mb-1">Margen de contribución</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">${margenContribucion.toFixed(2)} / unidad</p>
          </div>
        </div>
      </div>
      {precioVenta <= costoVariableUnitario && (
        <p className="text-xs text-amber-600 dark:text-amber-400">El precio debe ser mayor que el costo variable para tener punto de equilibrio.</p>
      )}
    </div>
  );
}
