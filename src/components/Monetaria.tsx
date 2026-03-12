"use client";

import { useState, useEffect } from "react";
import { LineChart, Brain, Calculator, Save, ArrowRightLeft, Zap, Scale } from "lucide-react";
import SimulatorDropdown from "./SimulatorDropdown";
import PanelVariables from "@/components/PanelVariables";
import Resultados from "@/components/Resultados";
import GraficoSimulacion from "@/components/GraficoSimulacion";
import GuiaRapida from "@/components/GuiaRapida";
import AnalisisMinuta from "@/components/AnalisisMinuta";
import ExportarCompartir from "@/components/ExportarCompartir";
import FuentesOficialesMexico from "@/components/FuentesOficialesMexico";
import ReferenciasAcademicas from "@/components/ReferenciasAcademicas";
import SeccionFuentesColapsable from "@/components/SeccionFuentesColapsable";
import BannerCuestionarios from "@/components/BannerCuestionarios";
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

    useEffect(() => {
        if (initialData?.subType) {
            setActiveTab(initialData.subType as any);
        }
    }, [initialData?.subType]);

    const [guardando, setGuardando] = useState(false);
    const handleSave = async () => {
        if ((session?.user?.credits ?? 0) < 1) return alert("No tienes créditos suficientes para guardar.");
        setGuardando(true);
        try {
            const { saveScenario } = await import("@/lib/actions/scenarioActions");
            const resSave = await saveScenario({
                type: "MONETARIA",
                subType: "CORE",
                name: `Simulación Política Monetaria ${new Date().toLocaleDateString()}`,
                variables: { variables, datosAI },
                results: resultados,
            });
            if (resSave.success) alert("Escenario guardado (1 crédito)");
            else alert(resSave.error);
        } catch (e) { alert("Error al guardar"); }
        finally { setGuardando(false); }
    };

    return (
        <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200 dark:border-slate-700 bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 p-8 shadow-sm">
                <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-3">Teoría Monetaria y Política del Banco Central</h2>
                <p className="text-slate-600 dark:text-slate-400 text-sm max-w-2xl">
                    Simula la transmisión de la política monetaria, aplica la regla de Taylor y analiza minutas de Banxico con IA. Entiende cómo el banco central incide en las tasas para controlar la inflación.
                </p>
            </div>

            <div className="sticky top-16 z-20 flex items-center gap-3 py-3 -mx-1 px-1 rounded-xl border border-indigo-200/50 dark:border-indigo-800/50 bg-gradient-to-r from-indigo-50/50 to-transparent dark:from-indigo-950/20 bg-slate-100 dark:bg-slate-950">
                <SimulatorDropdown
                    tabs={[
                        { id: 'core', label: 'Simulador Core', icon: LineChart },
                        { id: 'taylor', label: 'Regla de Taylor', icon: Calculator },
                        { id: 'ai', label: 'Análisis AI Minutas', icon: Brain },
                        { id: 'uip', label: 'Paridad UIP', icon: ArrowRightLeft },
                        { id: 'canalesTransmision', label: 'Canales transmisión', icon: Zap },
                        { id: 'comparadorPostura', label: 'Comparador postura', icon: Scale },
                    ]}
                    activeTab={activeTab}
                    onTabChange={(id) => setActiveTab(id as any)}
                    moduleId="monetaria"
                    isLocked={(id) => !canAccess(session?.user?.plan, "monetaria", id)}
                    placeholder="Elige un simulador de política monetaria"
                />
                <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hidden sm:inline">← Haz clic para cambiar</span>
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
                                    disabled={guardando}
                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold bg-blue-600 text-white hover:bg-blue-500 transition-all shadow-md active:scale-95 disabled:opacity-50"
                                >
                                    <Save className="w-4 h-4" />
                                    {guardando ? "Guardando..." : "Guardar"}
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
