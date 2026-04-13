"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
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
    Scale,
    Sparkles
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
    const router = useRouter();
    const [search, setSearch] = useState("");

    const handleSelect = (modulo: ModuloSimulador, tab?: string) => {
        const url = tab ? `/simulador?modulo=${modulo}&tab=${tab}` : `/simulador?modulo=${modulo}`;
        router.push(url);
        onSelectModulo(modulo);
    };

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
            {/* Hero Section - Rediseñado para IMPACTO visual */}
            <div className="relative rounded-[2.5rem] overflow-hidden bg-slate-950 border border-white/5 p-8 sm:p-20 text-center shadow-2xl">
                {/* Background Effects Premium */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-blue-600/20 blur-[120px] rounded-full animate-pulse" style={{ animationDuration: '8s' }} />
                    <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-indigo-600/20 blur-[120px] rounded-full animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }} />

                    {/* Grid Mesh */}
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px]" />
                </div>

                <div className="relative z-10 max-w-4xl mx-auto space-y-8">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-black uppercase tracking-widest animate-in fade-in slide-in-from-top-4 duration-1000">
                        <Zap className="w-3 h-3" /> Explora Econosfera
                    </div>

                    <h1 className="text-4xl sm:text-6xl font-black text-white leading-[1.1] tracking-tighter">
                        Empieza por <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-emerald-400 animate-gradient">un área</span>
                    </h1>

                    <p className="text-slate-400 text-lg sm:text-xl max-w-2xl mx-auto font-medium leading-relaxed">
                        Elige una categoría abajo; dentro encontrarás los modelos concretos (Taylor, IS-LM, DCF, etc.). Así evitas ver decenas de opciones de golpe.
                    </p>

                    <div className="relative max-w-2xl mx-auto pt-6 group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200" />
                        <div className="relative flex items-center bg-slate-900 border border-slate-700/50 rounded-2xl overflow-hidden focus-within:ring-2 focus-within:ring-blue-500/50 transition-all shadow-2xl">
                            <div className="pl-6">
                                <Search className="w-6 h-6 text-slate-500" />
                            </div>
                            <input
                                type="text"
                                placeholder="Buscar categoría o palabra clave..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-4 pr-6 py-5 bg-transparent text-white placeholder-slate-500 font-bold focus:outline-none transition-all"
                            />
                            <div className="pr-4 hidden sm:block">
                                <div className="px-2 py-1 rounded-md bg-slate-800 border border-slate-700 text-[10px] font-black text-slate-500 tracking-widest">
                                    CMD + K
                                </div>
                            </div>
                        </div>
                    </div>

                    <p className="text-center text-xs text-slate-500 max-w-lg mx-auto pt-2">
                        Tip: si ya sabes qué buscas, usa el buscador; si no, basta con abrir una categoría.
                    </p>
                </div>

                {/* Decorative Compass Icon - Moving */}
                <div className="absolute bottom-[-100px] right-[-50px] opacity-20 pointer-events-none animate-spin-slow">
                    <Compass className="w-[450px] h-[450px] text-white/10" />
                </div>
            </div>

            {/* Categories Grid */}
            <div className="space-y-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-3xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20">
                                <Compass className="w-6 h-6 text-blue-500" />
                            </div>
                            Explorar por Categoría
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Cada tarjeta agrupa varios modelos; no tienes que elegirlos todos ahora.</p>
                    </div>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCategories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => handleSelect(cat.id as ModuloSimulador)}
                            className="group relative text-left p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 backdrop-blur-sm hover:border-blue-500 dark:hover:border-blue-500/50 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 overflow-hidden"
                        >
                            {/* Hover Gradient Glow */}
                            <div className={`absolute -inset-24 bg-${cat.color}-500/10 blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />

                            <div className="relative z-10 space-y-6">
                                <div className={`p-4 rounded-2xl bg-${cat.color}-500/10 w-fit group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                                    {cat.icon}
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{cat.title}</h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                                        {cat.description}
                                    </p>
                                </div>
                                <div className="flex flex-wrap gap-2 pt-2">
                                    {cat.featured.map(f => (
                                        <span key={f} className="text-[10px] font-black px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 uppercase tracking-widest border border-slate-200 dark:border-slate-700/50 group-hover:border-blue-500/30 transition-colors">
                                            {f}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div className="absolute bottom-8 right-8 opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500">
                                <div className="p-2 rounded-full bg-blue-600 text-white shadow-lg shadow-blue-600/20">
                                    <ArrowRight className="w-5 h-5" />
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Carrusel / ticker: ¿No sabes por dónde empezar? */}
            <div className="relative p-1.5 rounded-[2.5rem] bg-gradient-to-br from-indigo-400/30 via-blue-400/20 to-violet-400/30 dark:from-indigo-500/20 dark:via-slate-900/50 dark:to-blue-500/20 shadow-lg shadow-indigo-500/10 dark:shadow-none">
                <div className="bg-white dark:bg-[#020617]/90 backdrop-blur-xl p-8 sm:p-12 rounded-[2.2rem] border border-slate-200/80 dark:border-white/10">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-8">
                        <div className="space-y-2">
                            <h2 className="text-3xl font-black text-slate-900 dark:text-white leading-tight">¿No sabes por dónde empezar?</h2>
                            <p className="text-slate-600 dark:text-indigo-300 font-medium text-base">Desliza y elige tu perfil — te llevamos al simulador indicado.</p>
                        </div>
                        <div className="hidden sm:flex p-4 rounded-2xl bg-indigo-500 text-white shadow-lg shadow-indigo-500/30">
                            <Sparkles className="w-8 h-8" />
                        </div>
                    </div>

                    {/* Carrusel horizontal con scroll suave */}
                    <div className="relative -mx-2 sm:-mx-4">
                        <div className="overflow-x-auto overflow-y-hidden scroll-smooth snap-x snap-mandatory pb-2">
                            <div className="flex gap-4 min-w-0 px-1" style={{ width: "max-content" }}>
                                {USE_CASES.map((uc, i) => {
                                    const accents: Record<number, string> = {
                                        0: "from-blue-500/15 to-indigo-500/10 border-blue-200 dark:border-blue-500/30 hover:shadow-blue-500/15",
                                        1: "from-emerald-500/15 to-teal-500/10 border-emerald-200 dark:border-emerald-500/30 hover:shadow-emerald-500/15",
                                        2: "from-amber-500/15 to-orange-500/10 border-amber-200 dark:border-amber-500/30 hover:shadow-amber-500/15",
                                        3: "from-violet-500/15 to-purple-500/10 border-violet-200 dark:border-violet-500/30 hover:shadow-violet-500/15",
                                    };
                                    const accentColors: Record<number, string> = {
                                        0: "text-blue-600 dark:text-blue-400",
                                        1: "text-emerald-600 dark:text-emerald-400",
                                        2: "text-amber-600 dark:text-amber-400",
                                        3: "text-violet-600 dark:text-violet-400",
                                    };
                                    const acc = accents[i % 4];
                                    const accText = accentColors[i % 4];
                                    return (
                                        <button
                                            key={i}
                                            onClick={() => handleSelect(uc.target as ModuloSimulador, uc.tab)}
                                            className={`group flex-shrink-0 w-[280px] sm:w-[300px] snap-center p-6 rounded-2xl bg-gradient-to-br ${acc} border hover:shadow-xl transition-all text-left relative overflow-hidden`}
                                        >
                                            <div className={`absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b ${i % 4 === 0 ? "from-blue-500 to-indigo-500" : i % 4 === 1 ? "from-emerald-500 to-teal-500" : i % 4 === 2 ? "from-amber-500 to-orange-500" : "from-violet-500 to-purple-500"} opacity-80 group-hover:opacity-100 transition-opacity`} />
                                            <div className="flex items-center justify-between mb-3">
                                                <span className={`text-[10px] font-black uppercase ${accText} tracking-[0.15em]`}>{uc.title}</span>
                                                <div className="p-1.5 rounded-lg bg-white/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 -translate-x-2 transition-all shadow-sm">
                                                    <ArrowRight className="w-4 h-4" />
                                                </div>
                                            </div>
                                            <h4 className="text-base font-bold text-slate-800 dark:text-slate-100 leading-relaxed pr-2">{uc.task}</h4>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                        {/* Gradiente suave a la derecha para indicar más contenido */}
                        <div className="absolute top-0 right-0 bottom-2 w-12 sm:w-16 bg-gradient-to-l from-white dark:from-[#020617] to-transparent pointer-events-none rounded-r-lg opacity-90" aria-hidden />
                    </div>
                </div>
            </div>

            {/* Global Map CTA - Premium Redesign */}
            <div className="relative group rounded-[2.5rem] border border-blue-500/20 bg-slate-900 overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-transparent to-transparent opacity-50" />
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[100px] -mr-20 -mt-20 rounded-full" />

                <div className="relative z-10 p-8 sm:p-12 flex flex-col md:flex-row items-center gap-10">
                    <div className="flex-shrink-0 p-6 rounded-[2rem] bg-blue-500 text-white shadow-xl shadow-blue-500/20 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                        <BookOpen className="w-10 h-10" />
                    </div>

                    <div className="flex-1 space-y-3 text-center md:text-left">
                        <h3 className="text-3xl font-black text-white leading-tight">Glosario de Términos Económicos</h3>
                        <p className="text-slate-400 text-lg max-w-xl font-medium">
                            ¿Tienes dudas con algún concepto? Consulta nuestro glosario interactivo con más de 200 términos y teorías actualizadas por expertos.
                        </p>
                    </div>

                    <button
                        onClick={() => handleSelect("glosario")}
                        className="group/btn relative px-10 py-5 rounded-2xl bg-white text-slate-950 font-black text-sm hover:scale-105 active:scale-95 transition-all shadow-[0_20px_40px_-10px_rgba(255,255,255,0.2)] overflow-hidden"
                    >
                        <span className="relative z-10 flex items-center gap-2">
                            Explorar Glosario Completo
                            <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
}
