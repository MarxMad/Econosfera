"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { getScenarios, deleteScenario } from "@/lib/actions/scenarioActions";
import { getUserStats } from "@/lib/actions/quizActions";
import { Trash2, ExternalLink, Calculator, TrendingUp, Landmark, Clock, Play, BrainCircuit, Trophy, Flame } from "lucide-react";
import Link from "next/link";
import ProfileCard from "@/components/ProfileCard";

export default function DashboardPage() {
    const { data: session, status } = useSession();
    const [scenarios, setScenarios] = useState<any[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (session) {
            loadData();
        }
    }, [session]);

    const loadData = async () => {
        setLoading(true);
        const [data, s] = await Promise.all([getScenarios(), getUserStats()]);
        setScenarios(data);
        setStats(s);
        setLoading(false);
    };

    const handleDelete = async (id: string) => {
        if (confirm("¿Estás seguro de eliminar este escenario?")) {
            const res = await deleteScenario(id);
            if (res.success) loadData();
            else alert(res.error);
        }
    };

    if (status === "loading") return <div className="p-10 text-center">Cargando...</div>;
    if (!session) return <div className="p-10 text-center">Debes iniciar sesión.</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Mi Espacio de Trabajo</h1>
                <p className="text-slate-500 dark:text-slate-400">Gestiona tus simulaciones guardadas y créditos de análisis AI.</p>
            </header>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Left Column: Stats, Profile & Credits */}
                <div className="space-y-6">
                    {/* Tarjeta de Perfil (foto, datos, verificación) */}
                    <ProfileCard />

                    {/* Tarjeta de Créditos e IA */}
                    <div className="bg-gradient-to-br from-blue-600 to-indigo-800 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
                        <div className="absolute -right-4 -top-4 opacity-10">
                            <BrainCircuit className="w-32 h-32" />
                        </div>
                        <h3 className="text-sm font-semibold uppercase tracking-wider opacity-80 mb-1 relative z-10">IA & Análisis</h3>
                        <div className="flex items-end gap-2 mb-4 relative z-10">
                            <p className="text-5xl font-black">{stats?.credits !== undefined ? stats.credits : session.user.credits}</p>
                            <span className="text-blue-200 mb-1">créditos</span>
                        </div>

                        <div className="space-y-4 relative z-10">
                            <div className="p-3 bg-white/10 rounded-2xl border border-white/10 backdrop-blur-sm">
                                <div className="flex justify-between text-xs font-bold uppercase mb-2">
                                    <span>Exportaciones (Free)</span>
                                    <span>{stats?.exportsCount || 0} / 3</span>
                                </div>
                                <div className="h-2 bg-blue-950/30 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full transition-all duration-1000 ${(stats?.exportsCount || 0) >= 3 ? 'bg-rose-400' : 'bg-emerald-400'
                                            }`}
                                        style={{ width: `${Math.min(((stats?.exportsCount || 0) / 3) * 100, 100)}%` }}
                                    />
                                </div>
                                <p className="text-[10px] mt-2 opacity-70">Límite mensual para usuarios gratuitos.</p>
                            </div>

                            <Link href="/pricing" className="block w-full py-3 bg-white text-blue-700 text-center font-bold rounded-xl hover:bg-blue-50 transition-all shadow-sm active:scale-[0.98]">
                                Ver Planes (50 / 100 créditos)
                            </Link>
                        </div>
                    </div>

                    {/* Resumen de Actividad Académica */}
                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-lg">
                        <h3 className="font-bold text-slate-900 dark:text-white mb-4">Progreso Económico</h3>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                                <span className="text-sm text-slate-500">XP Acumulada</span>
                                <span className="font-black text-indigo-600 dark:text-indigo-400">{stats?.totalScore || 0} XP</span>
                            </div>
                            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                                <span className="text-sm text-slate-500">Racha de Estudio</span>
                                <div className="flex items-center gap-1.5 text-amber-500 font-black">
                                    <Flame className="w-4 h-4" fill="currentColor" /> {stats?.currentStreak || 0} días
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3 mt-2">
                                <div className="p-3 bg-blue-50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-900/30 text-center">
                                    <p className="text-[10px] text-blue-500 font-bold uppercase tracking-widest mb-1">Escenarios</p>
                                    <p className="text-xl font-black text-blue-700 dark:text-blue-400">{scenarios.length}</p>
                                </div>
                                <div className="p-3 bg-emerald-50 dark:bg-emerald-900/10 rounded-xl border border-emerald-100 dark:border-emerald-900/30 text-center">
                                    <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest mb-1">Badges</p>
                                    <p className="text-xl font-black text-emerald-700 dark:text-emerald-400">{stats?.userBadges?.length || 0}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Scenario List & Suggestions */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Acciones Rápidas */}
                    <div className="w-full">
                        <Link href="/cuestionarios" className="flex flex-col items-center justify-center gap-3 w-full min-h-[120px] md:min-h-[140px] p-6 md:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 hover:shadow-lg transition-all group">
                            <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <BrainCircuit className="w-7 h-7 md:w-8 md:h-8" />
                            </div>
                            <span className="text-sm md:text-base font-bold text-slate-600 dark:text-slate-300">Cuestionarios</span>
                        </Link>
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 border border-slate-200 dark:border-slate-800 shadow-xl">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-2xl font-black text-slate-900 dark:text-white">Mis Escenarios</h2>
                                <p className="text-sm text-slate-500 mt-1">Recupera tus proyecciones y reportes IA guardados.</p>
                            </div>
                            <button onClick={loadData} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-sm font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                                Actualizar
                            </button>
                        </div>

                        {loading ? (
                            <div className="py-20 text-center">
                                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent flex items-center justify-center rounded-full animate-spin mx-auto mb-4"></div>
                                <p className="text-slate-500 text-sm font-medium">Sincronizando con Supabase...</p>
                            </div>
                        ) : scenarios.length === 0 ? (
                            <div className="bg-slate-50 dark:bg-slate-800/30 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-700 p-12 text-center">
                                <div className="w-20 h-20 bg-white dark:bg-slate-800 rounded-full shadow-sm flex items-center justify-center mx-auto mb-6">
                                    <Calculator className="w-10 h-10 text-slate-300 dark:text-slate-600" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Workspace Vacío</h3>
                                <p className="text-slate-500 mb-8 max-w-sm mx-auto">Tus simulaciones y análisis de actas aparecerán aquí para que nunca pierdas tu progreso de estudio.</p>
                                <Link href="/simulador" className="inline-flex items-center justify-center px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-500 shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40 transition-all hover:-translate-y-0.5">
                                    Crear mi primera simulación
                                </Link>
                            </div>
                        ) : (
                            <div className="grid gap-4">
                                {scenarios.map((s) => (
                                    <div key={s.id} className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md hover:border-blue-300 dark:hover:border-blue-800 transition-all group relative overflow-hidden">

                                        {/* Color accent line */}
                                        <div className={`absolute left-0 top-0 bottom-0 w-1 ${s.type === 'MACRO' ? 'bg-blue-500' :
                                            s.type === 'MICRO' ? 'bg-emerald-500' :
                                                'bg-amber-500'
                                            }`}
                                        />

                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pl-2">
                                            <div className="flex items-start gap-4">
                                                <div className={`p-3 rounded-2xl ${s.type === 'MACRO' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600' :
                                                    s.type === 'MICRO' ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600' :
                                                        'bg-amber-50 dark:bg-amber-900/20 text-amber-600'
                                                    }`}>
                                                    {s.type === 'MACRO' ? <TrendingUp className="w-6 h-6" /> :
                                                        s.type === 'MICRO' ? <Landmark className="w-6 h-6" /> :
                                                            <Calculator className="w-6 h-6" />}
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-lg text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-1">{s.name}</h4>
                                                    <div className="flex flex-wrap items-center gap-3">
                                                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${s.type === 'MACRO' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-400' :
                                                            s.type === 'MICRO' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400' :
                                                                'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-400'
                                                            }`}>{s.type} {s.subType && `• ${s.subType}`}</span>
                                                        <span className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                                                            <Clock className="w-3.5 h-3.5" />
                                                            {new Date(s.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                                                        </span>
                                                        <span className="text-xs text-slate-400">•</span>
                                                        <span className="text-xs font-mono text-slate-500">{Object.keys(s.data).length} vars</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2 pl-14 sm:pl-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800 pt-3 sm:pt-0">
                                                <button
                                                    onClick={() => handleDelete(s.id)}
                                                    className="p-2 sm:px-3 sm:py-2 rounded-xl border border-transparent hover:border-red-200 dark:hover:border-red-900/50 hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-400 hover:text-red-600 transition-all font-bold text-xs flex items-center gap-2"
                                                    title="Eliminar"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                    <span className="hidden sm:inline">Eliminar</span>
                                                </button>
                                                <Link
                                                    href={`/simulador?scenarioId=${s.id}`}
                                                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-bold hover:shadow-lg hover:-translate-y-0.5 transition-all"
                                                >
                                                    <Play className="w-4 h-4" fill="currentColor" />
                                                    Cargar
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
