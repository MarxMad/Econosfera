"use client";

import { useState } from "react";
import { Calculator, Package, BarChart3, Info, FileText, Scale, PieChart, Target } from "lucide-react";
import {
  SimuladorDepreciacion,
  SimuladorCostosInventario,
  SimuladorRazonesFinancieras,
  SimuladorEstadoResultados,
  SimuladorEcuacionContable,
  SimuladorProrrateo,
  SimuladorCostoProduccion,
  SimuladorPuntoEquilibrio,
} from "./simuladores-contadores";
import { useSession } from "next-auth/react";
import { canAccess, getRequiredPlan } from "@/lib/simulatorPlans";
import SimulatorLocked from "./SimulatorLocked";

type TabContadores = "depreciacion" | "costos" | "razones" | "estadoResultados" | "ecuacion" | "prorrateo" | "costoProduccion" | "puntoEquilibrio";

export default function Contadores() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState<TabContadores>("depreciacion");

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-teal-50 to-emerald-50 dark:from-slate-900 dark:to-slate-900 p-8 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 text-teal-500">
          <Calculator className="w-24 h-24" />
        </div>
        <div className="relative z-10">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-3 flex items-center gap-3">
            <Calculator className="w-8 h-8 text-teal-600 dark:text-teal-400" />
            Contabilidad
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm max-w-2xl italic">
            Depreciación, inventarios, razones financieras, estado de resultados, ecuación contable, prorrateo, costo de producción y punto de equilibrio. Herramientas para contadores y estudiantes de contaduría.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 p-1 bg-slate-200 dark:bg-slate-800/50 rounded-2xl">
        {[
          { id: "depreciacion" as const, label: "Depreciación", icon: Calculator },
          { id: "costos" as const, label: "Inventario (FIFO/LIFO)", icon: Package },
          { id: "razones" as const, label: "Razones financieras", icon: BarChart3 },
          { id: "estadoResultados" as const, label: "Estado de resultados", icon: FileText },
          { id: "ecuacion" as const, label: "Ecuación contable", icon: Scale },
          { id: "prorrateo" as const, label: "Prorrateo", icon: PieChart },
          { id: "costoProduccion" as const, label: "Costo producción", icon: Package },
          { id: "puntoEquilibrio" as const, label: "Punto equilibrio", icon: Target },
        ].map((tab) => {
          const locked = !canAccess(session?.user?.plan, "contadores", tab.id);
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === tab.id
                  ? "bg-white dark:bg-slate-700 text-teal-600 dark:text-teal-400 shadow-sm"
                  : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              } ${locked ? "opacity-80" : ""}`}
            >
              <tab.icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
        {!canAccess(session?.user?.plan, "contadores", activeTab) && getRequiredPlan("contadores", activeTab) && (
          <SimulatorLocked requiredPlan={getRequiredPlan("contadores", activeTab)!} moduleName="Contabilidad" />
        )}
        {canAccess(session?.user?.plan, "contadores", activeTab) && activeTab === "depreciacion" && <SimuladorDepreciacion />}
        {canAccess(session?.user?.plan, "contadores", activeTab) && activeTab === "costos" && <SimuladorCostosInventario />}
        {canAccess(session?.user?.plan, "contadores", activeTab) && activeTab === "razones" && <SimuladorRazonesFinancieras />}
        {canAccess(session?.user?.plan, "contadores", activeTab) && activeTab === "estadoResultados" && <SimuladorEstadoResultados />}
        {canAccess(session?.user?.plan, "contadores", activeTab) && activeTab === "ecuacion" && <SimuladorEcuacionContable />}
        {canAccess(session?.user?.plan, "contadores", activeTab) && activeTab === "prorrateo" && <SimuladorProrrateo />}
        {canAccess(session?.user?.plan, "contadores", activeTab) && activeTab === "costoProduccion" && <SimuladorCostoProduccion />}
        {canAccess(session?.user?.plan, "contadores", activeTab) && activeTab === "puntoEquilibrio" && <SimuladorPuntoEquilibrio />}
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 lg:p-8 border border-slate-200 dark:border-slate-800 shadow-xl">
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
          <Info className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          Conceptos contables
        </h3>
        <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-3">
          <li><strong>Depreciación:</strong> Línea recta, suma de dígitos o unidades de producción. Asignación del costo del activo a lo largo de su vida útil.</li>
          <li><strong>FIFO / LIFO / Promedio:</strong> Métodos para valuar inventarios y costo de ventas.</li>
          <li><strong>Razones financieras:</strong> Liquidez, solvencia y rentabilidad a partir del balance y estado de resultados.</li>
          <li><strong>Estado de resultados:</strong> Ventas − Costo ventas = Utilidad bruta − Gastos = Utilidad neta.</li>
          <li><strong>Ecuación contable:</strong> Activo = Pasivo + Capital. Base de la partida doble.</li>
          <li><strong>Prorrateo:</strong> Distribución de costos indirectos entre departamentos según base (horas, unidades).</li>
          <li><strong>Costo de producción:</strong> MP + MOD + CIF. Costo unitario = Costo total / Unidades.</li>
          <li><strong>Punto de equilibrio:</strong> Cantidad donde ingresos = costos. Q = CF / (P − CVu).</li>
        </ul>
      </div>
    </div>
  );
}
