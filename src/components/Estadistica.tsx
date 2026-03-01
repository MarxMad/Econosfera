"use client";

import { useState } from "react";
import { TrendingUp, BarChart, Info, BookOpen, Layers, Activity } from "lucide-react";
import { SimuladorRegresion, SimuladorTCL } from "./simuladores-stats";

export default function Estadistica() {
    const [activeTab, setActiveTab] = useState<"regresion" | "tcl">("regresion");

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
            <div className="flex flex-wrap gap-2 p-1 bg-slate-200 dark:bg-slate-800/50 rounded-2xl w-fit">
                {[
                    { id: 'regresion', label: 'Regresión Lineal', icon: Activity },
                    { id: 'tcl', label: 'Teorema Límite Central', icon: Layers },
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
                {activeTab === 'regresion' && <SimuladorRegresion />}
                {activeTab === 'tcl' && <SimuladorTCL />}
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 lg:p-8 border border-slate-200 dark:border-slate-800 shadow-xl">
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                    Conceptos Econométricos
                </h3>
                <div className="grid md:grid-cols-2 gap-8 text-sm text-slate-600 dark:text-slate-400">
                    <div className="space-y-3">
                        <p><strong>Insesgadez (Unbiasedness):</strong> Un estimador es insesgado si su valor esperado es igual al parámetro poblacional real. En MCO, esto requiere que el error no sea correlacionado con X.</p>
                        <p><strong>Hipótesis de Gauss-Markov:</strong> Bajo ciertas condiciones, MCO es el Mejor Estimador Lineal Insesgado (MELI / BLUE).</p>
                    </div>
                    <div className="space-y-3">
                        <p><strong>Convergencia:</strong> A medida que aumenta la muestra, los estimadores deberían acercarse al valor real (Consistencia).</p>
                        <p><strong>Normalidad Asintótica:</strong> La mayoría de los fenómenos agregados siguen la curva de Gauss gracias al TLC.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
