"use client";

import { useState } from "react";
import { Calculator, Package, BarChart3, FileText, Scale, PieChart, Target } from "lucide-react";
import SimulatorTabs from "./SimulatorTabs";
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
import BannerCuestionarios from "./BannerCuestionarios";

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

      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 p-6 shadow-sm">
        <SimulatorTabs
          tabs={[
            { id: "depreciacion", label: "Depreciación", icon: Calculator },
            { id: "costos", label: "Inventario (FIFO/LIFO)", icon: Package },
            { id: "razones", label: "Razones financieras", icon: BarChart3 },
            { id: "estadoResultados", label: "Estado de resultados", icon: FileText },
            { id: "ecuacion", label: "Ecuación contable", icon: Scale },
            { id: "prorrateo", label: "Prorrateo", icon: PieChart },
            { id: "costoProduccion", label: "Costo producción", icon: Package },
            { id: "puntoEquilibrio", label: "Punto equilibrio", icon: Target },
          ]}
          activeTab={activeTab}
          onTabChange={(id) => setActiveTab(id as TabContadores)}
          isLocked={(id) => !canAccess(session?.user?.plan, "contadores", id)}
          hint="Elige una herramienta de contabilidad"
        />
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

      <BannerCuestionarios />
    </div>
  );
}
