"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Award, AlertTriangle, BookMarked, ArrowRight, History } from "lucide-react";
import { getLineaTiempoCompleta } from "@/lib/teoriasEconomicas";

export default function TimelineLanding() {
    const router = useRouter();
    const [activeType, setActiveType] = useState<"crises" | "teorias" | "nobel">("crises");

    const lineaTiempo = useMemo(() => getLineaTiempoCompleta(), []);

    const filteredEvents = useMemo(() => {
        return lineaTiempo
            .filter((e) => {
                if (activeType === "teorias") return e.tipo === "teoria";
                if (activeType === "crises") return e.tipo === "crisis";
                return e.tipo === "nobel";
            })
            .slice(-6);
    }, [lineaTiempo, activeType]);

    const handleVerMas = () => {
        router.push(`/simulador?modulo=glosario&filtro=${activeType}`);
    };

    return (
        <section className="py-24 bg-white dark:bg-slate-950 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                    <div className="max-w-2xl space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-widest border border-indigo-100 dark:border-indigo-800">
                            <History className="w-3 h-3" />
                            Cronología Económica
                        </div>
                        <h2 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tight">
                            La historia escrita en <span className="text-blue-600 underline decoration-blue-500/30">datos</span>
                        </h2>
                        <p className="text-lg text-slate-500 dark:text-slate-400">
                            Explora los hitos que definieron el mundo moderno. Desde el colapso de los tulipanes hasta la era del blockchain.
                        </p>
                    </div>

                    <div className="flex p-1 bg-slate-100 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                        {[
                            { id: "crises", label: "Crisis", icon: AlertTriangle, color: "rose" },
                            { id: "teorias", label: "Teorías", icon: BookMarked, color: "indigo" },
                            { id: "nobel", label: "Nobels", icon: Award, color: "amber" },
                        ].map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeType === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveType(tab.id as any)}
                                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${isActive
                                        ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm"
                                        : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                                        }`}
                                >
                                    <Icon className={`w-4 h-4 ${isActive ? `text-${tab.color}-500` : ""}`} />
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Timeline Grid */}
                <div className="relative">
                    {/* Horizontal Line for desktop */}
                    <div className="absolute top-1/2 left-0 w-full h-px bg-slate-200 dark:bg-slate-800 hidden lg:block -translate-y-1/2" />

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
                        {filteredEvents.map((evento, idx) => (
                            <div
                                key={idx}
                                className="group p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-500 dark:hover:border-blue-500/50 transition-all hover:shadow-2xl hover:-translate-y-2"
                            >
                                <div className="flex items-center justify-between mb-6">
                                    <div className={`p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 group-hover:scale-110 transition-transform`}>
                                        {evento.tipo === "crisis" && <AlertTriangle className="w-6 h-6 text-rose-500" />}
                                        {evento.tipo === "teoria" && <BookMarked className="w-6 h-6 text-indigo-500" />}
                                        {evento.tipo === "nobel" && <Award className="w-6 h-6 text-amber-500" />}
                                    </div>
                                    <span className="text-2xl font-black text-slate-300 dark:text-slate-700 group-hover:text-blue-500/50 transition-colors">
                                        {evento.year}
                                    </span>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white leading-tight">
                                        {evento.nombre}
                                    </h3>
                                    <p className="text-sm font-bold text-blue-600 dark:text-blue-400 uppercase tracking-tighter">
                                        {evento.autor}
                                    </p>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed">
                                        {evento.descripcion}
                                    </p>
                                </div>
                            </div>
                        ))}

                        {/* View More Card */}
                        <button
                            onClick={handleVerMas}
                            className="group p-8 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center text-center gap-4 hover:border-blue-500 dark:hover:border-blue-500/50 hover:bg-blue-50/10 transition-all"
                        >
                            <div className="p-4 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                                <ArrowRight className="w-8 h-8" />
                            </div>
                            <div>
                                <h4 className="text-lg font-bold text-slate-900 dark:text-white">Ver cronología completa</h4>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Más de 200 hitos históricos registrados</p>
                            </div>
                        </button>
                    </div>
                </div>

                {/* Footer Link */}
                <div className="mt-16 text-center lg:text-left">
                    <button
                        onClick={handleVerMas}
                        className="text-slate-500 dark:text-slate-400 text-sm font-medium hover:text-blue-500 transition-colors inline-flex items-center gap-2 group"
                    >
                        Saber más sobre el pensamiento económico
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>
        </section>
    );
}
