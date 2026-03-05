"use client";

import { useMemo, useState } from "react";
import { InputLibre } from "../simuladores-finanzas/InputLibre";
import { InstruccionesSimulador } from "../InstruccionesSimulador";
import { costoProduccion } from "@/lib/contabilidad";

export default function SimuladorCostoProduccion() {
  const [materiaPrima, setMateriaPrima] = useState(50000);
  const [manoObraDirecta, setManoObraDirecta] = useState(30000);
  const [costosIndirectos, setCostosIndirectos] = useState(20000);
  const [unidadesProducidas, setUnidadesProducidas] = useState(1000);

  const { costoTotal, costoUnitario } = useMemo(
    () => costoProduccion(materiaPrima, manoObraDirecta, costosIndirectos, unidadesProducidas),
    [materiaPrima, manoObraDirecta, costosIndirectos, unidadesProducidas]
  );

  const fmt = (n: number) => n.toLocaleString("es-MX", { minimumFractionDigits: 2 });
  const totalBase = materiaPrima + manoObraDirecta + costosIndirectos;
  const pctMP = totalBase > 0 ? (materiaPrima / totalBase) * 100 : 0;
  const pctMOD = totalBase > 0 ? (manoObraDirecta / totalBase) * 100 : 0;
  const pctCIF = totalBase > 0 ? (costosIndirectos / totalBase) * 100 : 0;

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 shadow-lg p-5">
      <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-3">Costo de producción</h3>
      <p className="text-xs text-slate-600 dark:text-slate-400 mb-4">
        MP + MOD + CIF = Costo total. Costo unitario = Costo total / Unidades producidas.
      </p>

      <InstruccionesSimulador>
        <p>Calcula el costo de producción y el costo unitario. Los tres elementos del costo son:</p>
        <ul className="list-disc list-inside space-y-1 ml-1">
          <li><strong>Materia prima (MP):</strong> Materiales directos que se incorporan al producto.</li>
          <li><strong>Mano de obra directa (MOD):</strong> Salarios del personal que transforma el producto.</li>
          <li><strong>Costos indirectos (CIF):</strong> Rentas, depreciación, servicios, supervisión, etc.</li>
        </ul>
        <p>Costo unitario = Costo total ÷ Unidades producidas. Sirve para valuar inventario y costo de ventas.</p>
      </InstruccionesSimulador>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="space-y-4">
          <InputLibre label="Materia prima $" value={materiaPrima} onChange={setMateriaPrima} step="100" tooltip="Costo de materiales directos." />
          <InputLibre label="Mano de obra directa $" value={manoObraDirecta} onChange={setManoObraDirecta} step="100" tooltip="Salarios del personal de producción." />
          <InputLibre label="Costos indirectos (CIF) $" value={costosIndirectos} onChange={setCostosIndirectos} step="100" tooltip="Renta, depreciación, servicios, etc." />
          <InputLibre label="Unidades producidas" value={unidadesProducidas} onChange={setUnidadesProducidas} step="1" tooltip="Cantidad de unidades fabricadas en el periodo." />
        </div>
        <div className="space-y-4">
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/50">
            <p className="text-xs font-bold text-slate-500 uppercase mb-1">Costo total</p>
            <p className="text-2xl font-black text-slate-900 dark:text-white">${fmt(costoTotal)}</p>
          </div>
          <div className="p-4 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20">
            <p className="text-xs font-bold text-emerald-600 uppercase mb-1">Costo unitario</p>
            <p className="text-2xl font-black text-slate-900 dark:text-white">${fmt(costoUnitario)}</p>
          </div>
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-600">
            <p className="text-xs font-bold text-slate-500 uppercase mb-2">Composición del costo</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>MP</span>
                <span>{pctMP.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between">
                <span>MOD</span>
                <span>{pctMOD.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between">
                <span>CIF</span>
                <span>{pctCIF.toFixed(1)}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
