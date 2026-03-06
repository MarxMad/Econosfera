"use client";

import { useState } from "react";
import { Shield, Heart, Lock } from "lucide-react";
import { SimuladorMortalidad, SimuladorRuina } from "./simuladores-actuaria";
import { useSession } from "next-auth/react";
import { canAccess, getRequiredPlan } from "@/lib/simulatorPlans";
import SimulatorLocked from "./SimulatorLocked";
import BannerCuestionarios from "./BannerCuestionarios";

export default function Actuaria() {
    const { data: session } = useSession();
    const [activeTab, setActiveTab] = useState<"mortalidad" | "ruina">("mortalidad");

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
                        Proyecta el riesgo de arruinarse a largo plazo y visualiza tablas de mortalidad para pensiones.
                    </p>
                </div>
            </div>
            <div className="flex flex-wrap gap-2 p-1 bg-slate-200 dark:bg-slate-800/50 rounded-2xl w-fit">
                {[
                    { id: 'mortalidad', label: 'Tablas de Mortalidad', icon: Heart },
                    { id: 'ruina', label: 'Modelo de Ruina', icon: Shield }
                ].map((tab) => {
                    const locked = !canAccess(session?.user?.plan, "actuaria", tab.id);
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === tab.id
                                ? 'bg-white dark:bg-slate-700 text-rose-600 shadow-sm'
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
                {!canAccess(session?.user?.plan, "actuaria", activeTab) && getRequiredPlan("actuaria", activeTab) && (
                    <SimulatorLocked requiredPlan={getRequiredPlan("actuaria", activeTab)!} moduleName="Actuaría" />
                )}
                {canAccess(session?.user?.plan, "actuaria", activeTab) && activeTab === 'mortalidad' && <SimuladorMortalidad />}
                {canAccess(session?.user?.plan, "actuaria", activeTab) && activeTab === 'ruina' && <SimuladorRuina />}
            </div>

            <BannerCuestionarios />
        </div>
    );
}
