"use client";

import { useState } from "react";
import { Percent, Scale, Wallet, Target, History } from "lucide-react";
import SimulatorTabs from "./SimulatorTabs";
import ComparadorEscenarios from "@/components/ComparadorEscenarios";
import FuentesOficialesMexico from "@/components/FuentesOficialesMexico";
import ReferenciasAcademicas from "@/components/ReferenciasAcademicas";
import SeccionFuentesColapsable from "@/components/SeccionFuentesColapsable";
import BannerCuestionarios from "@/components/BannerCuestionarios";
import { SimuladorTasaRealNominal, SimuladorPoderAdquisitivo, SimuladorBrechaInflacion, SimuladorTasaRealExPost } from "@/components/simuladores-inflacion";
import { useSession } from "next-auth/react";
import { canAccess, getRequiredPlan } from "@/lib/simulatorPlans";
import SimulatorLocked from "@/components/SimulatorLocked";

export default function Inflacion({
    variables,
    setVariables,
}: {
    variables: any;
    setVariables: any;
}) {
    const { data: session } = useSession();
    const [activeTab, setActiveTab] = useState<"tasaReal" | "poderAdquisitivo" | "brecha" | "tasaRealExPost" | "comparador">("tasaReal");

    return (
        <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200 dark:border-slate-700 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-slate-900 dark:to-slate-800 p-8 shadow-sm">
                <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-3">Inflación</h2>
                <p className="text-slate-600 dark:text-slate-400 text-sm max-w-2xl">
                    Analiza la inflación, el poder adquisitivo del dinero y la relación entre tasas reales y nominales. Compara escenarios y entiende cómo la inflación erosiona el valor del dinero en el tiempo.
                </p>
            </div>

            <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 p-6 shadow-sm">
                <SimulatorTabs
                    tabs={[
                        { id: 'tasaReal', label: 'Tasa real vs nominal', icon: Percent },
                        { id: 'poderAdquisitivo', label: 'Poder adquisitivo', icon: Wallet },
                        { id: 'brecha', label: 'Brecha de inflación', icon: Target },
                        { id: 'tasaRealExPost', label: 'Tasa real ex post', icon: History },
                        { id: 'comparador', label: 'Comparar escenarios', icon: Scale },
                    ]}
                    activeTab={activeTab}
                    onTabChange={(id) => setActiveTab(id as any)}
                    moduleId="inflacion"
                    isLocked={(id) => !canAccess(session?.user?.plan, "inflacion", id)}
                    hint="Elige un simulador para analizar la inflación"
                />
            </div>

            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                {!canAccess(session?.user?.plan, "inflacion", activeTab) && getRequiredPlan("inflacion", activeTab) && (
                    <SimulatorLocked requiredPlan={getRequiredPlan("inflacion", activeTab)!} moduleName="Inflación" />
                )}
                {canAccess(session?.user?.plan, "inflacion", activeTab) && activeTab === 'tasaReal' && (
                    <SimuladorTasaRealNominal />
                )}
                {canAccess(session?.user?.plan, "inflacion", activeTab) && activeTab === 'poderAdquisitivo' && (
                    <SimuladorPoderAdquisitivo />
                )}
                {canAccess(session?.user?.plan, "inflacion", activeTab) && activeTab === 'brecha' && (
                    <SimuladorBrechaInflacion />
                )}
                {canAccess(session?.user?.plan, "inflacion", activeTab) && activeTab === 'tasaRealExPost' && (
                    <SimuladorTasaRealExPost />
                )}
                {canAccess(session?.user?.plan, "inflacion", activeTab) && activeTab === 'comparador' && (
                    <div className="space-y-6">
                        <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 shadow-lg p-6">
                            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-2">
                                <Scale className="w-5 h-5 text-blue-600" />
                                Comparativa de escenarios de inflación
                            </h3>
                            <ComparadorEscenarios escenarioActual={variables} onCargarEnPrincipal={setVariables} />
                        </div>
                    </div>
                )}
            </div>

            <BannerCuestionarios />

            <div className="mt-6">
                <SeccionFuentesColapsable titulo="Fuentes oficiales y referencias" defaultAbierto={false}>
                    <FuentesOficialesMexico />
                    <ReferenciasAcademicas modulo="inflacion" />
                </SeccionFuentesColapsable>
            </div>
        </div>
    );
}
