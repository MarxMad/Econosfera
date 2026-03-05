"use client";

import { useMemo, useState } from "react";
import { InputLibre } from "../simuladores-finanzas/InputLibre";
import { InstruccionesSimulador } from "../InstruccionesSimulador";

export default function SimuladorEcuacionContable() {
  const [activo, setActivo] = useState(500000);
  const [pasivo, setPasivo] = useState(200000);
  const [capital, setCapital] = useState(300000);

  const { balanceado, diferencia } = useMemo(() => {
    const ladoIzq = activo;
    const ladoDer = pasivo + capital;
    const diff = ladoIzq - ladoDer;
    return { balanceado: Math.abs(diff) < 0.01, diferencia: diff };
  }, [activo, pasivo, capital]);

  const fmt = (n: number) => n.toLocaleString("es-MX", { minimumFractionDigits: 2 });

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 shadow-lg p-5">
      <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-3">Ecuación contable</h3>
      <p className="text-xs text-slate-600 dark:text-slate-400 mb-4">
        Activo = Pasivo + Capital. La ecuación debe cuadrar siempre.
      </p>

      <InstruccionesSimulador>
        <p>La ecuación contable es la base de la contabilidad: todo lo que la empresa tiene (activos) debe estar financiado por deudas (pasivos) o por los dueños (capital).</p>
        <ul className="list-disc list-inside space-y-1 ml-1">
          <li><strong>Activo:</strong> Recursos que posee la empresa (efectivo, inventario, maquinaria, etc.).</li>
          <li><strong>Pasivo:</strong> Obligaciones con terceros (proveedores, préstamos).</li>
          <li><strong>Capital:</strong> Patrimonio de los accionistas (aportaciones + utilidades retenidas).</li>
        </ul>
        <p>Si no cuadra, hay un error en los registros.</p>
      </InstruccionesSimulador>

      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <InputLibre label="Activo $" value={activo} onChange={setActivo} step="1000" tooltip="Total de recursos que posee la empresa." />
        <InputLibre label="Pasivo $" value={pasivo} onChange={setPasivo} step="1000" tooltip="Obligaciones con terceros." />
        <InputLibre label="Capital $" value={capital} onChange={setCapital} step="1000" tooltip="Patrimonio de los accionistas." />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="p-6 rounded-xl border-2 border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/30">
          <p className="text-xs font-bold text-slate-500 uppercase mb-2">Lado izquierdo (Activo)</p>
          <p className="text-2xl font-black text-slate-900 dark:text-white">${fmt(activo)}</p>
        </div>
        <div className="p-6 rounded-xl border-2 border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/30">
          <p className="text-xs font-bold text-slate-500 uppercase mb-2">Lado derecho (Pasivo + Capital)</p>
          <p className="text-2xl font-black text-slate-900 dark:text-white">${fmt(pasivo + capital)}</p>
        </div>
      </div>

      <div className={`mt-6 p-4 rounded-xl ${balanceado ? "bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800" : "bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800"}`}>
        <p className={`${balanceado ? "text-emerald-700 dark:text-emerald-400" : "text-amber-700 dark:text-amber-400"} font-bold flex items-center gap-2`}>
          {balanceado ? "✓ Ecuación balanceada" : "⚠ Diferencia: $" + (diferencia > 0 ? "+" : "") + fmt(diferencia)}
        </p>
        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
          {balanceado ? "Activo = Pasivo + Capital. Los registros cuadran." : "Ajusta Activo, Pasivo o Capital para que la ecuación cuadre."}
        </p>
      </div>
    </div>
  );
}
