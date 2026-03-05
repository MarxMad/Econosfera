"use client";

import { useMemo, useState } from "react";
import { InputLibre } from "../simuladores-finanzas/InputLibre";
import { calcularRazones } from "@/lib/contabilidad";

export default function SimuladorRazonesFinancieras() {
  const [activoCorriente, setActivoCorriente] = useState(500000);
  const [inventario, setInventario] = useState(150000);
  const [pasivoCorriente, setPasivoCorriente] = useState(200000);
  const [activoTotal, setActivoTotal] = useState(1200000);
  const [pasivoTotal, setPasivoTotal] = useState(600000);
  const [patrimonio, setPatrimonio] = useState(600000);
  const [ventas, setVentas] = useState(800000);
  const [costoVentas, setCostoVentas] = useState(400000);
  const [utilidadNeta, setUtilidadNeta] = useState(120000);

  const razones = useMemo(
    () =>
      calcularRazones({
        activoCorriente,
        inventario,
        pasivoCorriente,
        activoTotal,
        pasivoTotal,
        patrimonio,
        ventas,
        costoVentas,
        utilidadNeta,
      }),
    [
      activoCorriente,
      inventario,
      pasivoCorriente,
      activoTotal,
      pasivoTotal,
      patrimonio,
      ventas,
      costoVentas,
      utilidadNeta,
    ]
  );

  const items = [
    { label: "Liquidez corriente", valor: razones.liquidezCorriente, desc: "Activo corriente / Pasivo corriente" },
    { label: "Prueba ácida", valor: razones.pruebaAcida, desc: "(Act. corr. - Inventario) / Pas. corr." },
    { label: "Endeudamiento", valor: razones.endeudamiento, desc: "Pasivo total / Activo total" },
    { label: "Rentabilidad sobre ventas", valor: razones.rentabilidadVentas, desc: "Utilidad neta / Ventas" },
    { label: "Rentabilidad sobre activos", valor: razones.rentabilidadActivos, desc: "Utilidad neta / Activo total" },
    { label: "Rentabilidad sobre patrimonio", valor: razones.rentabilidadPatrimonio, desc: "Utilidad neta / Patrimonio" },
  ];

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 shadow-lg p-5">
      <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-3">Razones financieras</h3>
      <p className="text-xs text-slate-600 dark:text-slate-400 mb-4">
        Liquidez, solvencia y rentabilidad a partir de estados financieros simplificados.
      </p>
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div>
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Balance (simplificado)</p>
          <div className="space-y-2">
            <InputLibre label="Activo corriente $" value={activoCorriente} onChange={setActivoCorriente} step="1000" />
            <InputLibre label="Inventario $" value={inventario} onChange={setInventario} step="1000" />
            <InputLibre label="Pasivo corriente $" value={pasivoCorriente} onChange={setPasivoCorriente} step="1000" />
            <InputLibre label="Activo total $" value={activoTotal} onChange={setActivoTotal} step="1000" />
            <InputLibre label="Pasivo total $" value={pasivoTotal} onChange={setPasivoTotal} step="1000" />
            <InputLibre label="Patrimonio $" value={patrimonio} onChange={setPatrimonio} step="1000" />
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Estado de resultados</p>
          <div className="space-y-2">
            <InputLibre label="Ventas $" value={ventas} onChange={setVentas} step="1000" />
            <InputLibre label="Costo de ventas $" value={costoVentas} onChange={setCostoVentas} step="1000" />
            <InputLibre label="Utilidad neta $" value={utilidadNeta} onChange={setUtilidadNeta} step="1000" />
          </div>
        </div>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((i) => (
          <div key={i.label} className="p-4 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50/50 dark:bg-slate-800/30">
            <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{i.label}</p>
            <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1 tabular-nums">
              {i.valor >= 1 ? i.valor.toFixed(2) : (i.valor * 100).toFixed(2) + "%"}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{i.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
