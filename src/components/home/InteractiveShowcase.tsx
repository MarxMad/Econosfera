"use client";

import { useState } from "react";
import {
    TrendingUp,
    Calculator,
    Activity,
    ShieldCheck,
    PieChart,
    ArrowRight,
    Sparkles,
    UserPlus,
    Lock,
    Coins
} from "lucide-react";
import MiniSimulator from "./MiniSimulator";
import MiniTaylor from "./MiniTaylor";
import MiniMacro from "./MiniMacro";
import MiniValuacion from "./MiniValuacion";
import MiniSimulatorSeguros from "./MiniSimulatorSeguros";
import MiniBlockchain from "./MiniBlockchain";
import { useRouter } from "next/navigation";

const CATEGORIES = [
    { id: "monetaria", label: "Monetaria", icon: Activity, color: "rose", component: MiniTaylor, title: "Regla de Taylor" },
    { id: "macro", label: "Macro", icon: TrendingUp, color: "blue", component: MiniMacro, title: "Multiplicador Keynesiano" },
    { id: "micro", label: "Micro", icon: PieChart, color: "indigo", component: MiniSimulator, title: "Oferta y Demanda" },
    { id: "blockchain", label: "Blockchain", icon: Coins, color: "purple", component: MiniBlockchain, title: "Simulación Halving" },
    { id: "finanzas", label: "Finanzas", icon: Calculator, color: "emerald", component: MiniValuacion, title: "Valuación P/E" },
    { id: "actuaria", label: "Actuaría", icon: ShieldCheck, color: "teal", component: MiniSimulatorSeguros, title: "Cálculo de Prima" },
];

export default function InteractiveShowcase() {
    const [activeId, setActiveId] = useState(CATEGORIES[0].id);
    const router = useRouter();

    const activeCat = CATEGORIES.find(c => c.id === activeId) || CATEGORIES[0];
    const ActiveComponent = activeCat.component;

    return (
        <div className="w-full space-y-12">
            <div className="flex flex-col lg:flex-row gap-12 items-start">
                {/* Left Side: Category Navigator */}
                <div className="w-full lg:w-72 space-y-4">
                    <div className="p-6 rounded-3xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                        <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-6 flex items-center gap-2">
                            <Sparkles className="w-3 h-3" /> Elige un Demo
                        </h3>
                        <div className="grid grid-cols-2 lg:grid-cols-1 gap-2">
                            {CATEGORIES.map((cat) => {
                                const Icon = cat.icon;
                                const isActive = activeId === cat.id;
                                return (
                                    <button
                                        key={cat.id}
                                        onClick={() => setActiveId(cat.id)}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all duration-300 ${isActive
                                            ? `bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xl scale-[1.02] ring-1 ring-slate-200 dark:ring-slate-700`
                                            : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                                            }`}
                                    >
                                        <div className={`p-2 rounded-xl transition-colors ${isActive ? `bg-${cat.color}-500 text-white` : "bg-slate-200 dark:bg-slate-800 text-slate-400"}`}>
                                            <Icon className="w-4 h-4" />
                                        </div>
                                        {cat.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* CTA Info Card */}
                    <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-600 to-blue-700 text-white shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-3xl -mr-16 -mt-16 rounded-full group-hover:bg-white/10 transition-colors" />
                        <div className="relative z-10 space-y-4">
                            <div className="p-3 bg-white/10 rounded-2xl w-fit">
                                <Lock className="w-5 h-5" />
                            </div>
                            <h4 className="font-black text-lg leading-tight">¿Quieres ir más allá?</h4>
                            <p className="text-xs text-blue-100/80 font-medium leading-relaxed">
                                Regístrate gratis para exportar reportes en PDF, guardar tus escenarios y acceder a modelos avanzados.
                            </p>
                            <button
                                onClick={() => router.push("/auth/register")}
                                className="w-full flex items-center justify-center gap-2 py-3.5 bg-white text-blue-600 rounded-2xl font-black text-xs hover:bg-blue-50 transition-all shadow-xl active:scale-95"
                            >
                                <UserPlus className="w-4 h-4" />
                                Crear Cuenta Gratis
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Side: Interactive Area */}
                <div className="flex-1 w-full bg-white dark:bg-slate-950 rounded-[3rem] border border-slate-200 dark:border-slate-800 p-4 sm:p-8 relative">
                    <div className="absolute top-8 right-8 flex items-center gap-2">
                        <span className="hidden sm:inline text-[10px] font-black uppercase tracking-widest text-slate-400">Preview Interactivo</span>
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    </div>

                    <div className="mb-8">
                        <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2">{activeCat.title}</h2>
                        <div className={`h-1.5 w-24 bg-${activeCat.color}-500 rounded-full`} />
                    </div>

                    <div className="animate-in fade-in slide-in-from-right-4 duration-500 max-w-2xl mx-auto">
                        <ActiveComponent />
                    </div>

                    <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-6">
                        <div className="flex -space-x-3">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="w-10 h-10 rounded-full border-4 border-white dark:border-slate-950 bg-slate-200 dark:bg-slate-800 overflow-hidden">
                                    <img src={`https://i.pravatar.cc/150?u=${i + 10}`} alt="User" />
                                </div>
                            ))}
                            <div className="w-10 h-10 rounded-full border-4 border-white dark:border-slate-950 bg-blue-600 flex items-center justify-center text-[10px] font-bold text-white">
                                +2k
                            </div>
                        </div>
                        <p className="text-xs font-bold text-slate-500 text-center sm:text-left">
                            Únete a miles de economistas y financieros <br className="hidden sm:block" /> que ya optimizan sus análisis con Econosfera.
                        </p>
                        <button
                            onClick={() => router.push("/simulador")}
                            className="flex items-center gap-2 text-sm font-black text-blue-600 hover:text-blue-500 transition-colors uppercase tracking-widest group"
                        >
                            Ver galería completa
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Hidden Tailwind support for dynamic colors */}
            <div className="hidden bg-rose-500 bg-blue-500 bg-indigo-500 bg-emerald-500 bg-teal-500 bg-purple-500 text-rose-500 text-blue-500 text-indigo-500 text-emerald-500 text-teal-500 text-purple-500" />
        </div>
    );
}
