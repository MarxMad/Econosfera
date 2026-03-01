"use client";

import { useState } from "react";
import { LineChart, BarChart2, Brain, Scale, Save, Info, Calculator, Percent } from "lucide-react";
import PanelVariables from "@/components/PanelVariables";
import Resultados from "@/components/Resultados";
import GraficoSimulacion from "@/components/GraficoSimulacion";
import GuiaRapida from "@/components/GuiaRapida";
import AnalisisMinuta from "@/components/AnalisisMinuta";
import ComparadorEscenarios from "@/components/ComparadorEscenarios";
import ExportarCompartir from "@/components/ExportarCompartir";
import FuentesOficialesMexico from "@/components/FuentesOficialesMexico";
import ReferenciasAcademicas from "@/components/ReferenciasAcademicas";
import SeccionFuentesColapsable from "@/components/SeccionFuentesColapsable";
import TaylorSolver from "@/components/TaylorSolver";
import { SimuladorTasaRealNominal } from "@/components/simuladores-inflacion";
import { useSession } from "next-auth/react";

export default function Inflacion({
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
    const [activeTab, setActiveTab] = useState<"ai" | "core" | "comparador" | "taylor" | "tasaReal">("core");

    const handleSave = async () => {
        const { saveScenario } = await import("@/lib/actions/scenarioActions");
        const resSave = await saveScenario({
            type: "INFLACION",
            name: `Simulación Inflación ${new Date().toLocaleDateString()}`,
            variables: { variables, datosAI },
            results: resultados,
        });
        if (resSave.success) alert("Escenario guardado");
        else alert(resSave.error);
    };

    return (
        <div className="space-y-6">
            {/* Hero */}
            <div className="rounded-3xl border border-slate-200 dark:border-slate-700 bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 p-8 shadow-sm">
                <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-3">Modelado de Inflación y Tasa de Interés</h2>
                <p className="text-slate-600 dark:text-slate-400 text-sm max-w-2xl">
                    Analiza el impacto de los choques macroeconómicos, simula la transmisión de política monetaria y utiliza Inteligencia Artificial para el análisis semántico de Minutas de Banxico.
                </p>
            </div>

            {/* Standard Tabbed Menu */}
            <div className="flex flex-wrap gap-2 p-1 bg-slate-200 dark:bg-slate-800/50 rounded-2xl w-fit">
                {[
                    { id: 'core', label: 'Simulador Core', icon: LineChart },
                    { id: 'ai', label: 'Análisis AI Minutas', icon: Brain },
                    { id: 'comparador', label: 'Comparar Escenarios', icon: Scale },
                    { id: 'taylor', label: 'Matemáticas Taylor', icon: Calculator },
                    { id: 'tasaReal', label: 'Tasa real vs nominal', icon: Percent },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === tab.id
                            ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-sm'
                            : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                            }`}
                    >
                        <tab.icon className="w-3.5 h-3.5" />
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                {activeTab === 'ai' && (
                    <div className="space-y-6">
                        <AnalisisMinuta
                            onAnalisisComplete={setDatosAI}
                            initialData={datosAI || initialData?.datosAI}
                        />
                    </div>
                )}

                {activeTab === 'core' && (
                    <div className="space-y-6">
                        <GuiaRapida />

                        <div className="flex flex-wrap items-center justify-end gap-2">
                            <ExportarCompartir
                                variables={variables}
                                resultados={resultados}
                                idGrafico="grafico-inflacion"
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

                {activeTab === 'comparador' && (
                    <div className="space-y-6">
                        <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 shadow-lg p-6">
                            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-2">
                                <Scale className="w-5 h-5 text-blue-600" />
                                Comparativa de Sensibilidad
                            </h3>
                            <ComparadorEscenarios escenarioActual={variables} onCargarEnPrincipal={setVariables} />
                        </div>
                    </div>
                )}

                {activeTab === 'taylor' && (
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                        <TaylorSolver />
                    </div>
                )}

                {activeTab === 'tasaReal' && (
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                        <SimuladorTasaRealNominal />
                    </div>
                )}
            </div>

            {/* Knowledge Section */}
            <section className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 p-6">
                <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-2 flex items-center gap-2">
                    <Info className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                    Conceptos Macroecómicos
                </h3>
                <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-2">
                    <li><strong>Inflación General:</strong> Aumento sostenido y generalizado de precios, medido por el INPC.</li>
                    <li><strong>Política Monetaria:</strong> Instrumento mediante el cual el banco central (Ej. Banxico) incide en las tasas para controlar la inflación.</li>
                    <li><strong>Choque de Oferta:</strong> Eventos que alteran los costos de producción, requiriendo respuestas ágiles en la tasa objetivo.</li>
                </ul>
            </section>

            <div className="mt-6">
                <SeccionFuentesColapsable titulo="Fuentes oficiales y referencias para profundizar" defaultAbierto={false}>
                    <FuentesOficialesMexico />
                    <ReferenciasAcademicas modulo="inflacion" />
                </SeccionFuentesColapsable>
            </div>
        </div>
    );
}
