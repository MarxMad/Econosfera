"use client";

import { useState } from "react";
import { LineChart, Brain, Calculator, Save, Lock, ArrowRightLeft, Zap, Scale } from "lucide-react";
import PanelVariables from "@/components/PanelVariables";
import Resultados from "@/components/Resultados";
import GraficoSimulacion from "@/components/GraficoSimulacion";
import GuiaRapida from "@/components/GuiaRapida";
import AnalisisMinuta from "@/components/AnalisisMinuta";
import ExportarCompartir from "@/components/ExportarCompartir";
import FuentesOficialesMexico from "@/components/FuentesOficialesMexico";
import ReferenciasAcademicas from "@/components/ReferenciasAcademicas";
import SeccionFuentesColapsable from "@/components/SeccionFuentesColapsable";
import TaylorSolver from "@/components/TaylorSolver";
import { SimuladorParidadUIP, SimuladorCanalesTransmision, SimuladorComparadorPostura } from "@/components/simuladores-monetaria";
import { useSession } from "next-auth/react";
import { canAccess, getRequiredPlan } from "@/lib/simulatorPlans";
import SimulatorLocked from "@/components/SimulatorLocked";

export default function Monetaria({
    variables,
    setVariables,
    resultados,
    datosAI,
    setDatosAI,
    initialData
}: {
    variables: any;
    setVariables: any;
    resultados: any;
    datosAI: any;
    setDatosAI: any;
    initialData?: any;
}) {
    const { data: session } = useSession();
    const [activeTab, setActiveTab] = useState<"core" | "taylor" | "ai" | "uip" | "canalesTransmision" | "comparadorPostura">("core");

    const handleSave = async () => {
        const { saveScenario } = await import("@/lib/actions/scenarioActions");
        const resSave = await saveScenario({
            type: "INFLACION",
            name: `Simulación Política Monetaria ${new Date().toLocaleDateString()}`,
            variables: { variables, datosAI },
            results: resultados,
        });
        if (resSave.success) alert("Escenario guardado");
        else alert(resSave.error);
    };

    return (
        <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200 dark:border-slate-700 bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 p-8 shadow-sm">
                <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-3">Teoría Monetaria y Política del Banco Central</h2>
                <p className="text-slate-600 dark:text-slate-400 text-sm max-w-2xl">
                    Simula la transmisión de la política monetaria, aplica la regla de Taylor y analiza minutas de Banxico con IA. Entiende cómo el banco central incide en las tasas para controlar la inflación.
                </p>
            </div>

            <div className="flex flex-wrap gap-2 p-1 bg-slate-200 dark:bg-slate-800/50 rounded-2xl w-fit">
                {[
                    { id: 'core', label: 'Simulador Core', icon: LineChart },
                    { id: 'taylor', label: 'Regla de Taylor', icon: Calculator },
                    { id: 'ai', label: 'Análisis AI Minutas', icon: Brain },
                    { id: 'uip', label: 'Paridad UIP', icon: ArrowRightLeft },
                    { id: 'canalesTransmision', label: 'Canales transmisión', icon: Zap },
                    { id: 'comparadorPostura', label: 'Comparador postura', icon: Scale },
                ].map((tab) => {
                    const locked = !canAccess(session?.user?.plan, "monetaria", tab.id);
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
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                {!canAccess(session?.user?.plan, "monetaria", activeTab) && getRequiredPlan("monetaria", activeTab) && (
                    <SimulatorLocked requiredPlan={getRequiredPlan("monetaria", activeTab)!} moduleName="Teoría Monetaria" />
                )}
                {canAccess(session?.user?.plan, "monetaria", activeTab) && activeTab === 'ai' && (
                    <div className="space-y-6">
                        <AnalisisMinuta
                            onAnalisisComplete={setDatosAI}
                            initialData={datosAI || initialData?.datosAI}
                        />
                    </div>
                )}

                {canAccess(session?.user?.plan, "monetaria", activeTab) && activeTab === 'core' && (
                    <div className="space-y-6">
                        <GuiaRapida />
                        <div className="flex flex-wrap items-center justify-end gap-2">
                            <ExportarCompartir
                                variables={variables}
                                resultados={resultados}
                                idGrafico="grafico-monetaria"
                                datosAI={datosAI}
                            />
                            {session && (
                                <button
                                    type="button"
                                    onClick={handleSave}
                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold bg-blue-600 text-white hover:bg-blue-500 transition-all shadow-md active:scale-95"
                                >
                                    <Save className="w-4 h-4" />
                                    Guardar
                                </button>
                            )}
                        </div>
                        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
                            <div className="lg:col-span-1">
                                <PanelVariables variables={variables} onChange={setVariables} />
                            </div>
                            <div className="lg:col-span-2 space-y-6">
                                <Resultados resultados={resultados} />
                                <GraficoSimulacion variables={variables} resultados={resultados} />
                            </div>
                        </div>
                    </div>
                )}

                {canAccess(session?.user?.plan, "monetaria", activeTab) && activeTab === 'taylor' && (
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                        <TaylorSolver />
                    </div>
                )}
                {canAccess(session?.user?.plan, "monetaria", activeTab) && activeTab === 'uip' && <SimuladorParidadUIP />}
                {canAccess(session?.user?.plan, "monetaria", activeTab) && activeTab === 'canalesTransmision' && <SimuladorCanalesTransmision />}
                {canAccess(session?.user?.plan, "monetaria", activeTab) && activeTab === 'comparadorPostura' && <SimuladorComparadorPostura />}
            </div>

            <section className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 p-6">
                <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-2">Conceptos de política monetaria</h3>
                <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-2">
                    <li><strong>Tasa de política:</strong> Referencia que fija el banco central para el mercado interbancario.</li>
                    <li><strong>Regla de Taylor:</strong> Fórmula que sugiere la tasa óptima según brechas de inflación y producto.</li>
                    <li><strong>Transmisión:</strong> Canales por los que la tasa afecta crédito, tipo de cambio y demanda.</li>
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
