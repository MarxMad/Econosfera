"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { getScenarios, deleteScenario } from "@/lib/actions/scenarioActions";
import { Trash2, ExternalLink, Calculator, TrendingUp, Landmark, Clock, Play } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
    const { data: session, status } = useSession();
    const [scenarios, setScenarios] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (session) {
            loadScenarios();
        }
    }, [session]);

    const loadScenarios = async () => {
        setLoading(true);
        const data = await getScenarios();
        setScenarios(data);
        setLoading(false);
    };

    const handleDelete = async (id: string) => {
        if (confirm("¿Estás seguro de eliminar este escenario?")) {
            const res = await deleteScenario(id);
            if (res.success) loadScenarios();
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
                    {/* Tarjeta de Perfil y Verificación */}
                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-lg relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-500 border border-amber-200 dark:border-amber-800">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                                Pendiente de Verificar
                            </span>
                        </div>
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-emerald-500 p-0.5 shadow-md">
                                <div className="w-full h-full bg-slate-900 rounded-2xl flex items-center justify-center text-xl font-black text-white">
                                    {session.user.name?.charAt(0) || session.user.email?.charAt(0) || 'U'}
                                </div>
                            </div>
                            <div>
                                <h2 className="font-bold text-lg text-slate-900 dark:text-white leading-tight">
                                    {session.user.name || 'Usuario'}
                                </h2>
                                <p className="text-xs text-slate-500 truncate max-w-[150px]">{session.user.email}</p>
                            </div>
                        </div>

                        <div className="p-4 bg-amber-50 dark:bg-amber-950/30 rounded-2xl border border-amber-100 dark:border-amber-900/50 mb-4">
                            <h4 className="text-sm font-bold text-amber-900 dark:text-amber-500 mb-1">Verifica tu correo</h4>
                            <p className="text-xs text-amber-700 dark:text-amber-600/80 mb-3">
                                Para evitar spam y asegurar tus créditos IA, te enviaremos un enlace de confirmación.
                            </p>
                            <button className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl transition-colors shadow-sm">
                                Enviar correo de verificación
                            </button>
                        </div>
                    </div>

                    {/* Tarjeta de Créditos */}
                    <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
                        <div className="absolute -right-4 -top-4 opacity-10">
                            <TrendingUp className="w-32 h-32" />
                        </div>
                        <h3 className="text-sm font-semibold uppercase tracking-wider opacity-80 mb-1 relative z-10">Créditos AI disponibles</h3>
                        <div className="flex items-end gap-2 mb-4 relative z-10">
                            <p className="text-5xl font-black">{session.user.credits}</p>
                            <span className="text-blue-200 mb-1">/ 100</span>
                        </div>
                        <div className="h-2 bg-blue-900/50 rounded-full mb-4 overflow-hidden relative z-10">
                            <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${Math.min((session.user.credits / 100) * 100, 100)}%` }} />
                        </div>
                        <button className="w-full py-2.5 bg-white text-blue-700 font-bold rounded-xl hover:bg-blue-50 transition-colors relative z-10 shadow-sm">
                            Adquirir más créditos
                        </button>
                    </div>

                    {/* Resumen de Actividad */}
                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-lg">
                        <h3 className="font-bold text-slate-900 dark:text-white mb-4">Métricas de Estudio</h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg"><Calculator className="w-4 h-4" /></div>
                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Escenarios listos</span>
                                </div>
                                <span className="font-black text-lg text-slate-900 dark:text-white">{scenarios.length}</span>
                            </div>
                            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg"><Landmark className="w-4 h-4" /></div>
                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Módulos visitados</span>
                                </div>
                                <span className="font-black text-lg text-slate-900 dark:text-white">
                                    {new Set(scenarios.map(s => s.type)).size}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Scenario List & Suggestions */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Acciones Rápidas */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Link href="/simulador" className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 hover:shadow-md transition-all group">
                            <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <TrendingUp className="w-5 h-5" />
                            </div>
                            <span className="text-xs font-bold text-slate-600 dark:text-slate-300">Nuevo Macro</span>
                        </Link>
                        <Link href="/simulador" className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 hover:shadow-md transition-all group">
                            <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Landmark className="w-5 h-5" />
                            </div>
                            <span className="text-xs font-bold text-slate-600 dark:text-slate-300">Nuevo Micro</span>
                        </Link>
                        <Link href="/manual" className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-purple-500 hover:shadow-md transition-all group">
                            <div className="w-10 h-10 rounded-full bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Calculator className="w-5 h-5" />
                            </div>
                            <span className="text-xs font-bold text-slate-600 dark:text-slate-300">Leer Manual</span>
                        </Link>
                        <div className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-700 opacity-70 cursor-not-allowed">
                            <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-400 flex items-center justify-center">
                                <ExternalLink className="w-5 h-5" />
                            </div>
                            <span className="text-xs font-bold text-slate-500">Exámenes</span>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 border border-slate-200 dark:border-slate-800 shadow-xl">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-2xl font-black text-slate-900 dark:text-white">Mis Escenarios</h2>
                                <p className="text-sm text-slate-500 mt-1">Recupera tus proyecciones y reportes IA guardados.</p>
                            </div>
                            <button onClick={loadScenarios} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-sm font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
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
