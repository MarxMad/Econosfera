"use client";

import { useMemo, useState } from "react";
import { HelpCircle, FileDown, Save } from "lucide-react";
import { InputLibre } from "../simuladores-finanzas/InputLibre";
import { InstruccionesSimulador } from "../InstruccionesSimulador";
import { calcularRazones } from "@/lib/contabilidad";
import { useSession } from "next-auth/react";
import PricingModal from "../PricingModal";

export default function SimuladorRazonesFinancieras() {
  const { data: session } = useSession();
  const [showPricing, setShowPricing] = useState(false);
  const [exportando, setExportando] = useState(false);
  const [guardando, setGuardando] = useState(false);
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

  const handleExport = async () => {
    if ((session?.user?.credits ?? 0) < 1) { setShowPricing(true); return; }
    setExportando(true);
    try {
      await import("@/lib/actions/exportActions").then((m) => m.registrarExportacion("Contabilidad Razones Financieras", "PDF"));
      await import("@/lib/exportarContabilidadPdf").then((m) => m.exportarContabilidadAPdf({
        tipo: "RazonesFinancieras",
        titulo: "Razones financieras",
        variables: [
          { label: "Activo corriente", valor: `$${activoCorriente.toLocaleString("es-MX")}` },
          { label: "Activo total", valor: `$${activoTotal.toLocaleString("es-MX")}` },
          { label: "Ventas", valor: `$${ventas.toLocaleString("es-MX")}` },
        ],
        resultados: items.map(i => ({ label: i.label, valor: i.valor >= 1 ? i.valor.toFixed(2) : (i.valor * 100).toFixed(2) + "%" })),
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
        subType: "RAZONES_FINANCIERAS",
        name: `Razones financieras ${new Date().toLocaleDateString()}`,
        variables: { activoCorriente, inventario, pasivoCorriente, activoTotal, pasivoTotal, patrimonio, ventas, costoVentas, utilidadNeta },
        results: razones,
      });
      if (res.success) alert("Escenario guardado");
      else alert(res.error);
    } catch (e) { alert("Error al guardar"); } finally { setGuardando(false); }
  };

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 shadow-lg p-5">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
        <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">Razones financieras</h3>
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
        Liquidez, solvencia y rentabilidad a partir de estados financieros simplificados.
      </p>
      <InstruccionesSimulador>
        <p>Indicadores para analizar la salud financiera de una empresa.</p>
        <ul className="list-disc list-inside space-y-1 ml-1">
          <li><strong>Liquidez:</strong> Capacidad de pago a corto plazo. Liquidez corriente, prueba ácida.</li>
          <li><strong>Solvencia:</strong> Estructura de capital. Endeudamiento = Pasivo / Activo.</li>
          <li><strong>Rentabilidad:</strong> Retorno sobre ventas, activos y patrimonio.</li>
        </ul>
      </InstruccionesSimulador>
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div>
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Balance (simplificado)</p>
          <div className="space-y-2">
            <InputLibre label="Activo corriente $" value={activoCorriente} onChange={setActivoCorriente} step="1000" tooltip="Activos que se convertirán en efectivo en menos de un año." />
            <InputLibre label="Inventario $" value={inventario} onChange={setInventario} step="1000" tooltip="Valor del inventario de mercancías (incluido en activo corriente)." />
            <InputLibre label="Pasivo corriente $" value={pasivoCorriente} onChange={setPasivoCorriente} step="1000" tooltip="Obligaciones que vencen en menos de un año." />
            <InputLibre label="Activo total $" value={activoTotal} onChange={setActivoTotal} step="1000" tooltip="Suma de todos los activos de la empresa." />
            <InputLibre label="Pasivo total $" value={pasivoTotal} onChange={setPasivoTotal} step="1000" tooltip="Suma de todas las obligaciones." />
            <InputLibre label="Patrimonio $" value={patrimonio} onChange={setPatrimonio} step="1000" tooltip="Capital contable: activos menos pasivos." />
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Estado de resultados</p>
          <div className="space-y-2">
            <InputLibre label="Ventas $" value={ventas} onChange={setVentas} step="1000" tooltip="Ingresos por ventas del periodo." />
            <InputLibre label="Costo de ventas $" value={costoVentas} onChange={setCostoVentas} step="1000" tooltip="Costo de la mercancía vendida." />
            <InputLibre label="Utilidad neta $" value={utilidadNeta} onChange={setUtilidadNeta} step="1000" tooltip="Utilidad después de impuestos y gastos." />
          </div>
        </div>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((i) => (
          <div key={i.label} className="p-4 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50/50 dark:bg-slate-800/30">
            <p className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1">
              {i.label}
              <span title={i.desc} className="cursor-help"><HelpCircle className="w-3.5 h-3.5 text-slate-400" /></span>
            </p>
            <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1 tabular-nums">
              {i.valor >= 1 ? i.valor.toFixed(2) : (i.valor * 100).toFixed(2) + "%"}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{i.desc}</p>
          </div>
        ))}
      </div>
      <PricingModal isOpen={showPricing} onClose={() => setShowPricing(false)} />
    </div>
  );
}
