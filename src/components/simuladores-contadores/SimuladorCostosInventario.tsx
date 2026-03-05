"use client";

import { useMemo, useState } from "react";
import { InputLibre } from "../simuladores-finanzas/InputLibre";
import { InstruccionesSimulador } from "../InstruccionesSimulador";
import { costoFIFO, costoLIFO, costoPromedioPonderado, type MovimientoInventario } from "@/lib/contabilidad";

export default function SimuladorCostosInventario() {
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

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 shadow-lg p-5">
      <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-3">Costo de ventas e inventario</h3>
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
              <InputLibre label="Entrada 1: unidades" value={e1u} onChange={setE1u} step="1" />
              <InputLibre label="Costo unit." value={e1c} onChange={setE1c} step="0.01" />
            </div>
            <div className="flex gap-3 items-end">
              <InputLibre label="Entrada 2: unidades" value={e2u} onChange={setE2u} step="1" />
              <InputLibre label="Costo unit." value={e2c} onChange={setE2c} step="0.01" />
            </div>
            <div className="flex gap-3 items-end">
              <InputLibre label="Entrada 3: unidades" value={e3u} onChange={setE3u} step="1" />
              <InputLibre label="Costo unit." value={e3c} onChange={setE3c} step="0.01" />
            </div>
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Salidas</p>
          <div className="space-y-3">
            <InputLibre label="Salida 1: unidades" value={s1u} onChange={setS1u} step="1" />
            <InputLibre label="Salida 2: unidades" value={s2u} onChange={setS2u} step="1" />
          </div>
        </div>
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        {[fifo, lifo, prom].map((r) => (
          <div key={r.metodo} className="p-4 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50/50 dark:bg-slate-800/30">
            <p className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-2">{r.metodo}</p>
            <div className="space-y-1 text-sm">
              <p>Costo de ventas: <span className="font-mono font-bold">${r.costoVentas.toLocaleString("es-MX", { minimumFractionDigits: 2 })}</span></p>
              <p>Inventario final: <span className="font-mono font-bold">${r.inventarioFinal.toLocaleString("es-MX", { minimumFractionDigits: 2 })}</span></p>
              <p className="text-slate-500 dark:text-slate-400">Unidades vendidas: {r.unidadesVendidas}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
