"use client";

import { useState } from "react";
import { Shield, Heart } from "lucide-react";
import SimulatorTabs from "./SimulatorTabs";
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
            <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 p-6 shadow-sm">
                <SimulatorTabs
                    tabs={[
                        { id: 'mortalidad', label: 'Tablas de Mortalidad', icon: Heart },
                        { id: 'ruina', label: 'Modelo de Ruina', icon: Shield }
                    ]}
                    activeTab={activeTab}
                    onTabChange={(id) => setActiveTab(id as any)}
                    isLocked={(id) => !canAccess(session?.user?.plan, "actuaria", id)}
                    hint="Elige un simulador actuarial"
                />
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
