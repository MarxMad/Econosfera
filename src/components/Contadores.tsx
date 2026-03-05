"use client";

import { useState } from "react";
import { Calculator, Package, BarChart3, Info } from "lucide-react";
import { SimuladorDepreciacion, SimuladorCostosInventario, SimuladorRazonesFinancieras } from "./simuladores-contadores";
import { useSession } from "next-auth/react";
import { canAccess, getRequiredPlan } from "@/lib/simulatorPlans";
import SimulatorLocked from "./SimulatorLocked";

export default function Contadores() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState<"depreciacion" | "costos" | "razones">("depreciacion");

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-teal-50 to-emerald-50 dark:from-slate-900 dark:to-slate-900 p-8 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 text-teal-500">
          <Calculator className="w-24 h-24" />
        </div>
        <div className="relative z-10">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-3 flex items-center gap-3">
            <Calculator className="w-8 h-8 text-teal-600 dark:text-teal-400" />
            Contadores
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm max-w-2xl italic">
            Depreciación de activos, costos de inventario (FIFO, LIFO, promedio) y razones financieras. Herramientas para contadores y estudiantes de contaduría.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 p-1 bg-slate-200 dark:bg-slate-800/50 rounded-2xl w-fit">
        {[
          { id: "depreciacion" as const, label: "Depreciación", icon: Calculator },
          { id: "costos" as const, label: "Costos e inventario", icon: Package },
          { id: "razones" as const, label: "Razones financieras", icon: BarChart3 },
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
          <SimulatorLocked requiredPlan={getRequiredPlan("contadores", activeTab)!} moduleName="Contadores" />
        )}
        {canAccess(session?.user?.plan, "contadores", activeTab) && activeTab === "depreciacion" && <SimuladorDepreciacion />}
        {canAccess(session?.user?.plan, "contadores", activeTab) && activeTab === "costos" && <SimuladorCostosInventario />}
        {canAccess(session?.user?.plan, "contadores", activeTab) && activeTab === "razones" && <SimuladorRazonesFinancieras />}
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 lg:p-8 border border-slate-200 dark:border-slate-800 shadow-xl">
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
          <Info className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          Conceptos contables
        </h3>
        <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-3">
          <li><strong>Depreciación:</strong> Asignación sistemática del costo de un activo fijo a lo largo de su vida útil. Línea recta distribuye igual cada año; suma de dígitos carga más en los primeros años.</li>
          <li><strong>FIFO / LIFO / Promedio:</strong> Métodos para valuar inventarios y costo de ventas. FIFO asume que lo primero que entra sale primero; LIFO lo último; promedio usa el costo unitario ponderado.</li>
          <li><strong>Razones financieras:</strong> Indicadores de liquidez (capacidad de pago a corto plazo), solvencia (estructura de capital) y rentabilidad (retorno sobre ventas, activos y patrimonio).</li>
        </ul>
      </div>
    </div>
  );
}
