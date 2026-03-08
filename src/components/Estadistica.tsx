"use client";

import { useState } from "react";
import { TrendingUp, BarChart, Layers, Activity, Table2, Grid3X3, BarChart2 } from "lucide-react";
import SimulatorTabs from "./SimulatorTabs";
import { SimuladorRegresion, SimuladorTCL, SimuladorRegresionMultiple, SimuladorMatrizCorrelacion, SimuladorEstadisticasDescriptivas } from "./simuladores-stats";
import { useSession } from "next-auth/react";
import { canAccess, getRequiredPlan } from "@/lib/simulatorPlans";
import SimulatorLocked from "./SimulatorLocked";
import BannerCuestionarios from "./BannerCuestionarios";

export default function Estadistica() {
    const { data: session } = useSession();
    const [activeTab, setActiveTab] = useState<"regresion" | "tcl" | "regresionMultiple" | "matrizCorrelacion" | "estadisticasDescriptivas">("regresion");

    return (
        <div className="space-y-6 animate-in fade-in duration-700">
            {/* Hero */}
            <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-indigo-50 to-cyan-50 dark:from-slate-900 dark:to-slate-900 p-8 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10 text-indigo-500">
                    <BarChart className="w-24 h-24" />
                </div>
                <div className="relative z-10">
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-3 flex items-center gap-3">
                        <TrendingUp className="text-indigo-500 w-8 h-8" />
                        Estadística y Econometría
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400 text-sm max-w-2xl italic">
                        Comprende la magia detrás de los datos. Desde la robustez del Teorema del Límite Central (TLC) hasta inferencia probabilística usando estimadores MCO.
                    </p>
                </div>
            </div>
            <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 p-6 shadow-sm">
                <SimulatorTabs
                    tabs={[
                        { id: 'regresion', label: 'Regresión Lineal', icon: Activity },
                        { id: 'tcl', label: 'Teorema Límite Central', icon: Layers },
                        { id: 'regresionMultiple', label: 'Regresión Múltiple (EViews)', icon: Table2 },
                        { id: 'matrizCorrelacion', label: 'Matriz Correlación', icon: Grid3X3 },
                        { id: 'estadisticasDescriptivas', label: 'Estadísticas Descriptivas', icon: BarChart2 },
                    ]}
                    activeTab={activeTab}
                    onTabChange={(id) => setActiveTab(id as any)}
                    isLocked={(id) => !canAccess(session?.user?.plan, "estadistica", id)}
                    hint="Elige un simulador de estadística"
                />
            </div>

            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                {!canAccess(session?.user?.plan, "estadistica", activeTab) && getRequiredPlan("estadistica", activeTab) && (
                    <SimulatorLocked requiredPlan={getRequiredPlan("estadistica", activeTab)!} moduleName="Estadística" />
                )}
                {canAccess(session?.user?.plan, "estadistica", activeTab) && activeTab === 'regresion' && <SimuladorRegresion />}
                {canAccess(session?.user?.plan, "estadistica", activeTab) && activeTab === 'tcl' && <SimuladorTCL />}
                {canAccess(session?.user?.plan, "estadistica", activeTab) && activeTab === 'regresionMultiple' && <SimuladorRegresionMultiple />}
                {canAccess(session?.user?.plan, "estadistica", activeTab) && activeTab === 'matrizCorrelacion' && <SimuladorMatrizCorrelacion />}
                {canAccess(session?.user?.plan, "estadistica", activeTab) && activeTab === 'estadisticasDescriptivas' && <SimuladorEstadisticasDescriptivas />}
            </div>

            <BannerCuestionarios />
        </div>
    );
}
