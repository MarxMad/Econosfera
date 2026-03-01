"use client";

import { useState } from "react";
import { Shield, Heart, Coins, TrendingUp, Info } from "lucide-react";
import { SimuladorMortalidad, SimuladorRuina, CalculadoraPoderAdquisitivo } from "./simuladores-actuaria";

export default function Actuaria() {
    const [activeTab, setActiveTab] = useState<"mortalidad" | "ruina" | "poder">("mortalidad");

    return (
        <div className="space-y-6 animate-in fade-in duration-700">
            {/* Hero */}
            <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-rose-50 to-pink-50 dark:from-slate-900 dark:to-slate-900 p-8 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10 text-rose-500">
                    <Shield className="w-24 h-24" />
                </div>
                <div className="relative z-10">
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-3 flex items-center gap-3">
                        <Heart className="text-rose-500 w-8 h-8" />
                        Actuaría y Riesgos
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400 text-sm max-w-2xl italic">
                        Proyecta el riesgo de arruinarse a largo plazo, visualiza tablas de mortalidad para pensiones y analiza el verdadero poder adquisitivo de tu ahorro tras el impacto inflacionario.
                    </p>
                </div>
            </div>
            <div className="flex flex-wrap gap-2 p-1 bg-slate-200 dark:bg-slate-800/50 rounded-2xl w-fit">
                {[
                    { id: 'mortalidad', label: 'Tablas de Mortalidad', icon: Heart },
                    { id: 'ruina', label: 'Modelo de Ruina', icon: Shield },
                    { id: 'poder', label: 'Poder Adquisitivo', icon: Coins }
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === tab.id
                            ? 'bg-white dark:bg-slate-700 text-rose-600 shadow-sm'
                            : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                            }`}
                    >
                        <tab.icon className="w-3.5 h-3.5" />
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                {activeTab === 'mortalidad' && <SimuladorMortalidad />}
                {activeTab === 'ruina' && <SimuladorRuina />}
                {activeTab === 'poder' && <CalculadoraPoderAdquisitivo />}
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 lg:p-8 border border-slate-200 dark:border-slate-800 shadow-xl">
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
                    <Info className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                    Conceptos Actuariales
                </h3>
                <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-3">
                    <li><strong>Longevidad:</strong> Riesgo de que los pensionados vivan más de lo esperado.</li>
                    <li><strong>Solvencia:</strong> Capacidad de una entidad para cumplir con sus obligaciones a largo plazo.</li>
                    <li><strong>Interés Real vs Nominal:</strong> El rendimiento descontado de la inflación (Ecuación de Fisher).</li>
                </ul>
            </div>
        </div>
    );
}
