"use client";

import { useState } from "react";
import { Percent, Scale, Wallet, Info, Lock } from "lucide-react";
import ComparadorEscenarios from "@/components/ComparadorEscenarios";
import FuentesOficialesMexico from "@/components/FuentesOficialesMexico";
import ReferenciasAcademicas from "@/components/ReferenciasAcademicas";
import SeccionFuentesColapsable from "@/components/SeccionFuentesColapsable";
import { SimuladorTasaRealNominal, SimuladorPoderAdquisitivo } from "@/components/simuladores-inflacion";
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
    const [activeTab, setActiveTab] = useState<"tasaReal" | "comparador" | "poderAdquisitivo">("tasaReal");

    return (
        <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200 dark:border-slate-700 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-slate-900 dark:to-slate-800 p-8 shadow-sm">
                <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-3">Inflación</h2>
                <p className="text-slate-600 dark:text-slate-400 text-sm max-w-2xl">
                    Analiza la inflación, el poder adquisitivo del dinero y la relación entre tasas reales y nominales. Compara escenarios y entiende cómo la inflación erosiona el valor del dinero en el tiempo.
                </p>
            </div>

            <div className="flex flex-wrap gap-2 p-1 bg-slate-200 dark:bg-slate-800/50 rounded-2xl w-fit">
                {[
                    { id: 'tasaReal', label: 'Tasa real vs nominal', icon: Percent },
                    { id: 'poderAdquisitivo', label: 'Poder adquisitivo', icon: Wallet },
                    { id: 'comparador', label: 'Comparar escenarios', icon: Scale },
                ].map((tab) => {
                    const locked = !canAccess(session?.user?.plan, "inflacion", tab.id);
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === tab.id
                                ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-sm'
                                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                                } ${locked ? 'opacity-80' : ''}`}
                        >
                            {locked && <Lock className="w-3 h-3" />}
                            <tab.icon className="w-3.5 h-3.5" />
                            {tab.label}
                        </button>
                    );
                })}
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

            <section className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 p-6">
                <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-2 flex items-center gap-2">
                    <Info className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                    Conceptos de inflación
                </h3>
                <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-2">
                    <li><strong>Inflación general:</strong> Aumento sostenido y generalizado de precios, medido por el INPC.</li>
                    <li><strong>Inflación subyacente:</strong> Excluye componentes volátiles (agropecuarios, energéticos); indica la tendencia de mediano plazo.</li>
                    <li><strong>Poder adquisitivo:</strong> Cantidad de bienes y servicios que una unidad monetaria puede comprar; la inflación lo reduce con el tiempo.</li>
                </ul>
            </section>

            <div className="mt-6">
                <SeccionFuentesColapsable titulo="Fuentes oficiales y referencias" defaultAbierto={false}>
                    <FuentesOficialesMexico />
                    <ReferenciasAcademicas modulo="inflacion" />
                </SeccionFuentesColapsable>
            </div>
        </div>
    );
}
