"use client";

import { useState, useMemo } from "react";
import {
    Compass,
    TrendingUp,
    Target,
    Coins,
    Calculator,
    ArrowRight,
    Search,
    PieChart,
    Activity,
    Zap,
    BookOpen,
    Scale
} from "lucide-react";
import type { ModuloSimulador } from "./NavSimuladores";

interface SimuladorExploreProps {
    onSelectModulo: (m: ModuloSimulador) => void;
}

const CATEGORIES = [
    {
        id: "finanzas",
        title: "Finanzas & Mercados",
        description: "Valuación DCF, WACC, Portafolios de inversión y derivados financieros.",
        icon: <PieChart className="w-6 h-6 text-blue-500" />,
        color: "blue",
        featured: ["DCF", "Black-Scholes", "CETES"]
    },
    {
        id: "macro",
        title: "Macroeconomía",
        description: "Modelo IS-LM, multiplicador keynesiano y curvas de crecimiento.",
        icon: <TrendingUp className="w-6 h-6 text-indigo-500" />,
        color: "indigo",
        featured: ["IS-LM", "Multiplicador", "Solow"]
    },
    {
        id: "blockchain",
        title: "Economía Blockchain",
        description: "Simuladores de Halving, AMM (Uniswap) y gestión de liquidez.",
        icon: <Zap className="w-6 h-6 text-amber-500" />,
        color: "amber",
        featured: ["Halving", "AMM", "Liquidez"]
    },
    {
        id: "micro",
        title: "Microeconomía",
        description: "Oferta y demanda, elasticidades y equilibrio de mercado.",
        icon: <Scale className="w-6 h-6 text-emerald-500" />,
        color: "emerald",
        featured: ["Oferta/Demanda", "Elasticidad"]
    },
    {
        id: "inflacion",
        title: "Inflación & Precios",
        description: "Calculadoras de IPC, poder adquisitivo e impacto inflacionario.",
        icon: <Activity className="w-6 h-6 text-rose-500" />,
        color: "rose",
        featured: ["Calculadora IPC", "Poder Adquisitivo"]
    },
    {
        id: "contadores",
        title: "Contabilidad & Fiscal",
        description: "Cálculo de impuestos, ISR y estados financieros interactivos.",
        icon: <Calculator className="w-6 h-6 text-slate-500" />,
        color: "slate",
        featured: ["ISR", "Punto de Equilibrio"]
    }
];

const USE_CASES = [
    {
        title: "Soy Inversionista",
        task: "Quiero saber cuánto vale una empresa",
        target: "finanzas",
        tab: "dcf"
    },
    {
        title: "Soy Estudiante",
        task: "Quiero entender el equilibrio macro",
        target: "macro",
        tab: "standard"
    },
    {
        title: "Tengo Ahorros",
        task: "Quiero proteger mi dinero de la inflación",
        target: "inflacion",
        tab: "main"
    },
    {
        title: "Exploro Cripto",
        task: "Quiero entender cómo funciona un AMM",
        target: "blockchain",
        tab: "amm"
    },
    {
        title: "Soy Analista",
        task: "Quiero calcular el punto de equilibrio",
        target: "contadores"
    },
    {
        title: "Soy Actuario",
        task: "Quiero modelar riesgos y seguros",
        target: "actuaria"
    }
];

export default function SimuladorExplore({ onSelectModulo }: SimuladorExploreProps) {
    const [search, setSearch] = useState("");

    const filteredCategories = useMemo(() => {
        if (!search) return CATEGORIES;
        const s = search.toLowerCase();
        return CATEGORIES.filter(c =>
            c.title.toLowerCase().includes(s) ||
            c.description.toLowerCase().includes(s) ||
            c.featured.some(f => f.toLowerCase().includes(s))
        );
    }, [search]);

    return (
        <div className="space-y-10 animate-in fade-in duration-700 pb-10">
            {/* Hero Section */}
            <div className="relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 p-8 sm:p-12 text-center">
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                    <div className="absolute top-0 right-0 p-10">
                        <Compass className="w-64 h-64 text-white" />
                    </div>
                </div>

                <div className="relative z-10 max-w-3xl mx-auto space-y-6">
                    <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight">
                        ¿Qué quieres <span className="text-blue-500">simular</span> hoy?
                    </h1>
                    <p className="text-slate-400 text-lg">
                        Econosfera es la plataforma más completa de simulación económica y financiera. Elige un camino para comenzar.
                    </p>

                    <div className="relative max-w-xl mx-auto pt-4">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                        <input
                            type="text"
                            placeholder="Busca por simulador, teoría o concepto..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-2xl"
                        />
                    </div>
                </div>
            </div>

            {/* Categories Grid */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                        <Compass className="w-6 h-6 text-indigo-500" />
                        Explorar por Categoría
                    </h2>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCategories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => onSelectModulo(cat.id as ModuloSimulador)}
                            className="group text-left p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-500 dark:hover:border-blue-500/50 transition-all hover:shadow-xl hover:-translate-y-1 relative overflow-hidden"
                        >
                            <div className="relative z-10 space-y-4">
                                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 w-fit group-hover:scale-110 transition-transform">
                                    {cat.icon}
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{cat.title}</h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
                                        {cat.description}
                                    </p>
                                </div>
                                <div className="flex flex-wrap gap-2 pt-2">
                                    {cat.featured.map(f => (
                                        <span key={f} className="text-[10px] font-bold px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 uppercase tracking-tighter">
                                            {f}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                                <ArrowRight className="w-5 h-5 text-blue-500" />
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Use Cases */}
            <div className="space-y-6 p-8 rounded-3xl bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/50">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-indigo-900 dark:text-indigo-300">¿No sabes por dónde empezar?</h2>
                        <p className="text-indigo-600 dark:text-indigo-400 text-sm italic">Mira algunas de las preguntas que resolvemos</p>
                    </div>
                    <div className="p-3 rounded-full bg-indigo-100 dark:bg-indigo-900/50">
                        <Calculator className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                    </div>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {USE_CASES.map((uc, i) => (
                        <button
                            key={i}
                            onClick={() => onSelectModulo(uc.target as ModuloSimulador)}
                            className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-indigo-100 dark:border-indigo-800 hover:shadow-md transition-all text-left group"
                        >
                            <div className="flex items-center justify-between mb-1">
                                <p className="text-[10px] font-black uppercase text-indigo-500">{uc.title}</p>
                                <ArrowRight className="w-3 h-3 text-indigo-300 group-hover:translate-x-1 transition-transform" />
                            </div>
                            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">{uc.task}</h4>
                        </button>
                    ))}
                </div>
            </div>

            {/* Global Map CTA */}
            <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 flex flex-col md:flex-row items-center gap-8 shadow-sm">
                <div className="p-5 rounded-3xl bg-blue-50 dark:bg-blue-900/30">
                    <BookOpen className="w-10 h-10 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1 space-y-2 text-center md:text-left">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Glosario de Términos Económicos</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xl">
                        ¿Duda con algún concepto? Consulta nuestro glosario interactivo con más de 200 términos y teorías actualizadas.
                    </p>
                </div>
                <button
                    onClick={() => onSelectModulo("glosario")}
                    className="px-6 py-3 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-sm hover:scale-105 active:scale-95 transition-all shadow-lg"
                >
                    Ir al Glosario
                </button>
            </div>
        </div>
    );
}
