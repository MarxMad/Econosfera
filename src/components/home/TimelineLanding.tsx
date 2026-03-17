"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Award, AlertTriangle, BookMarked, ArrowRight, History, Sparkles } from "lucide-react";
import { getLineaTiempoCompleta } from "@/lib/teoriasEconomicas";

export default function TimelineLanding() {
    const router = useRouter();
    const [activeType, setActiveType] = useState<"crises" | "teorias" | "nobel">("crises");
    const [accentColor, setAccentColor] = useState("rose");

    const lineaTiempo = useMemo(() => getLineaTiempoCompleta(), []);

    const filteredEvents = useMemo(() => {
        const events = lineaTiempo.filter((e) => {
            if (activeType === "teorias") return e.tipo === "teoria";
            if (activeType === "crises") return e.tipo === "crisis";
            return e.tipo === "nobel";
        });
        return events.slice(-6).reverse(); // Mostrar los más recientes primero para impacto
    }, [lineaTiempo, activeType]);

    useEffect(() => {
        if (activeType === "crises") setAccentColor("rose");
        else if (activeType === "teorias") setAccentColor("indigo");
        else setAccentColor("amber");
    }, [activeType]);

    const handleVerMas = () => {
        router.push(`/glosario?filtro=${activeType}`);
    };

    return (
        <section className="py-24 bg-white dark:bg-slate-950 overflow-hidden relative">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/5 blur-[120px] rounded-full pointer-events-none" />

            {/* Marquee Header - Absolute dynamism */}
            <div className="w-full overflow-hidden bg-slate-50/50 dark:bg-slate-900/30 border-y border-slate-100 dark:border-slate-800 py-3 mb-16">
                <div className="flex w-max animate-marquee gap-10">
                    {lineaTiempo.slice(0, 30).map((e, i) => (
                        <div key={i} className="flex items-center gap-3">
                            <span className="text-xs font-black text-slate-400 dark:text-slate-600">{e.year}</span>
                            <span className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-tighter">{e.nombre}</span>
                            <div className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700" />
                        </div>
                    ))}
                    {/* Duplicate for infinite effect */}
                    {lineaTiempo.slice(0, 30).map((e, i) => (
                        <div key={`dup-${i}`} className="flex items-center gap-3">
                            <span className="text-xs font-black text-slate-400 dark:text-slate-600">{e.year}</span>
                            <span className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-tighter">{e.nombre}</span>
                            <div className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700" />
                        </div>
                    ))}
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 relative z-10">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                    <div className="max-w-2xl space-y-4 animate-in slide-in-from-left duration-700">
                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-${accentColor}-50 dark:bg-${accentColor}-900/30 text-${accentColor}-600 dark:text-${accentColor}-400 text-xs font-bold uppercase tracking-widest border border-${accentColor}-100 dark:border-${accentColor}-800 transition-colors`}>
                            <Sparkles className="w-3 h-3" />
                            Cronología Maestra
                        </div>
                        <h2 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                            Hitos que movieron <br /><span className={`text-${accentColor}-600 transition-colors`}>al mundo</span>
                        </h2>
                        <p className="text-lg text-slate-500 dark:text-slate-400 max-w-xl">
                            Explora la evolución del pensamiento y la economía global a través de sus momentos más críticos y brillantes.
                        </p>
                    </div>

                    <div className="flex p-1.5 bg-slate-100 dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-inner">
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
                                    className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-black transition-all ${isActive
                                        ? `bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xl scale-105 ring-1 ring-slate-200 dark:ring-slate-700`
                                        : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                                        }`}
                                >
                                    <Icon className={`w-4 h-4 transition-colors ${isActive ? `text-${tab.color}-500` : ""}`} />
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Carrusel horizontal: hitos (mismo estilo que "No sabes por dónde empezar") */}
                <div key={activeType} className="relative -mx-2 sm:-mx-4">
                    <div className="overflow-x-auto overflow-y-hidden scroll-smooth snap-x snap-mandatory pb-2" style={{ width: "100%" }}>
                        <div className="flex gap-6 min-w-0 px-1" style={{ width: "max-content" }}>
                            {filteredEvents.map((evento, idx) => (
                                <div
                                    key={idx}
                                    className="group relative flex-shrink-0 w-[300px] sm:w-[340px] snap-center p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-500 dark:hover:border-blue-500/50 transition-all duration-500 hover:shadow-[0_20px_50px_-15px_rgba(59,130,246,0.15)] overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 dark:bg-slate-800/50 rounded-bl-[5rem] -mr-10 -mt-10 group-hover:scale-125 group-hover:-rotate-12 transition-transform duration-700" />

                                    <div className={`absolute inset-0 bg-gradient-to-br from-${accentColor}-500/0 to-${accentColor}-500/0 group-hover:from-${accentColor}-500/5 group-hover:to-transparent transition-all duration-700`} />

                                    <div className="relative z-10">
                                        <div className="flex items-center justify-between mb-8">
                                            <div className={`p-4 rounded-[1.5rem] bg-${accentColor}-50 dark:bg-${accentColor}-900/20 group-hover:rotate-12 group-hover:scale-110 transition-all duration-500`}>
                                                {evento.tipo === "crisis" && <AlertTriangle className="w-7 h-7 text-rose-500" />}
                                                {evento.tipo === "teoria" && <BookMarked className="w-7 h-7 text-indigo-500" />}
                                                {evento.tipo === "nobel" && <Award className="w-7 h-7 text-amber-500" />}
                                            </div>
                                            <span className={`text-3xl font-black text-slate-200 dark:text-slate-800 group-hover:text-${accentColor}-500/40 transition-colors duration-500`}>
                                                {evento.year}
                                            </span>
                                        </div>

                                        <div className="space-y-4">
                                            <h3 className="text-2xl font-black text-slate-900 dark:text-white leading-tight mt-2 min-h-[3rem] group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                                {evento.nombre}
                                            </h3>
                                            <div className="flex items-center gap-2">
                                                <div className={`w-1 h-4 bg-${accentColor}-500 rounded-full group-hover:h-6 transition-all duration-500`} />
                                                <p className="text-xs font-black text-slate-900 dark:text-slate-100 uppercase tracking-widest">
                                                    {evento.autor}
                                                </p>
                                            </div>
                                            <p className="text-[13px] text-slate-500 dark:text-slate-400 leading-relaxed font-medium line-clamp-4 group-hover:line-clamp-none transition-all duration-500">
                                                {evento.descripcion}
                                            </p>
                                        </div>

                                        <div className="pt-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                            <button
                                                onClick={() => router.push(`/glosario?filtro=${activeType}`)}
                                                className={`flex items-center gap-2 text-xs font-black text-${accentColor}-600 uppercase tracking-widest`}
                                            >
                                                Leer más en Glosario
                                                <ArrowRight className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* CTA card dentro del carrusel */}
                            <div className="flex-shrink-0 w-[300px] sm:w-[340px] snap-center p-1">
                                <div className="relative h-full min-h-[320px] w-full rounded-[2.5rem] bg-gradient-to-br from-blue-600 via-indigo-600 to-indigo-700 p-8 flex flex-col justify-between items-start text-white overflow-hidden shadow-2xl">
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-3xl -mr-20 -mt-20 rounded-full" />

                                    <div className="relative z-10 w-full">
                                        <div className="p-3 rounded-2xl bg-white/20 w-fit mb-6">
                                            <History className="w-8 h-8 text-white" />
                                        </div>
                                        <h3 className="text-2xl font-black mb-2">Descubre todo el Glosario</h3>
                                        <p className="text-sm text-blue-100/80 font-medium">
                                            Más de 300 términos, teorías y biografías de ganadores del Nobel organizados cronológicamente.
                                        </p>
                                    </div>

                                    <button
                                        onClick={handleVerMas}
                                        className="mt-8 relative z-10 px-8 py-4 bg-white text-blue-600 rounded-2xl font-black text-sm hover:bg-blue-50 transition-all flex items-center gap-2 group/btn shadow-xl shadow-blue-900/20 active:scale-95"
                                    >
                                        Explorar Glosario Completo
                                        <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Gradiente a la derecha para indicar más contenido */}
                    <div className="absolute top-0 right-0 bottom-2 w-12 sm:w-20 bg-gradient-to-l from-white dark:from-slate-950 to-transparent pointer-events-none rounded-r-lg opacity-90" aria-hidden />
                </div>
            </div>

        </section>
    );
}
