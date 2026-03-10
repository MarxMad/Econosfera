"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { getDashboardData } from "@/lib/actions/dashboardActions";
import { deleteScenario } from "@/lib/actions/scenarioActions";
import { Trash2, Calculator, TrendingUp, Landmark, Clock, Play, BrainCircuit, Flame, Sparkles, ArrowRight, CreditCard, Zap } from "lucide-react";
import Link from "next/link";
import ProfileCard from "@/components/ProfileCard";
import PlanComparador from "@/components/PlanComparador";

const CREDITS_MAX = { FREE: 10, PRO: 50, RESEARCHER: 200 } as const;

function CreditsByPlanCard({ credits, plan }: { credits: number; plan: string }) {
    const max = CREDITS_MAX[plan as keyof typeof CREDITS_MAX] ?? CREDITS_MAX.FREE;
    const isUnlimited = plan === "RESEARCHER";
    const planLabel = plan === "FREE" ? "Free" : plan === "PRO" ? "Pro" : "Researcher";

    return (
        <div className="p-3 bg-white/10 rounded-2xl border border-white/10 backdrop-blur-sm">
            <div className="flex justify-between text-xs font-bold uppercase mb-2">
                <span>Créditos para exportar ({planLabel})</span>
                <span>
                    {isUnlimited ? (
                        <>Ilimitados</>
                    ) : (
                        <>{credits} / {max}</>
                    )}
                </span>
            </div>
            {!isUnlimited && (
                <div className="h-2 bg-blue-950/30 rounded-full overflow-hidden">
                    <div
                        className={`h-full rounded-full transition-all duration-1000 ${credits <= 0 ? "bg-rose-400" : "bg-emerald-400"}`}
                        style={{ width: `${Math.min((credits / max) * 100, 100)}%` }}
                    />
                </div>
            )}
            <p className="text-[10px] mt-2 opacity-70">
                {isUnlimited
                    ? "Exportaciones ilimitadas y análisis de minutas con IA."
                    : `Gasta tus ${max} créditos en exportaciones de análisis y escenarios.`}
            </p>
        </div>
    );
}

export default function DashboardPage() {
    const { data: session, status } = useSession();
    const [scenarios, setScenarios] = useState<any[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [portalLoading, setPortalLoading] = useState(false);

    const handleOpenBillingPortal = async () => {
        setPortalLoading(true);
        try {
            const res = await fetch("/api/stripe/create-portal-session", { method: "POST" });
            const data = await res.json();
            if (res.ok && data.url) window.location.href = data.url;
            else alert(data.error || "No se pudo abrir el portal de facturación.");
        } catch {
            alert("Error al abrir la galería de pago.");
        } finally {
            setPortalLoading(false);
        }
    };

    useEffect(() => {
        if (session) {
            loadData();
        }
    }, [session]);

    const loadData = async () => {
        setLoading(true);
        const { user, scenarios: data } = await getDashboardData();
        setScenarios(data);
        setStats(user);
        setLoading(false);
    };

    const handleDelete = async (id: string) => {
        if (confirm("¿Estás seguro de eliminar este escenario?")) {
            const res = await deleteScenario(id);
            if (res.success) loadData();
            else alert(res.error);
        }
    };

    if (status === "loading") return <div className="p-8 sm:p-10 text-center text-slate-500">Cargando...</div>;
    if (!session) return <div className="p-8 sm:p-10 text-center text-slate-500">Debes iniciar sesión.</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
            <header className="mb-6 sm:mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2">Mi Espacio de Trabajo</h1>
                <p className="text-slate-500 dark:text-slate-400">Gestiona tus simulaciones guardadas y créditos de análisis AI.</p>
            </header>

            {/* Banner: sin créditos → CTA a Pro/Researcher */}
            {((stats?.credits ?? session.user.credits) ?? 0) === 0 && (
                <div className="mb-6 p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-900/40">
                            <Sparkles className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                        </div>
                        <div>
                            <p className="font-bold text-slate-900 dark:text-white">Sin créditos</p>
                            <p className="text-sm text-slate-600 dark:text-slate-400">Recarga con Pro (50 créditos/mes) o Researcher (exportaciones ilimitadas + minutas IA).</p>
                        </div>
                    </div>
                    <Link href="/pricing" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-600 text-white font-bold hover:bg-amber-500 transition-colors">
                        Ver planes <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            )}

            <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
                {/* Left Column: Stats, Profile & Credits */}
                <div className="space-y-6">
                    {/* Tarjeta de Perfil (datos, verificación) */}
                    <ProfileCard profile={stats} loading={loading} onCreditsClaimed={loadData} />

                    {/* Tarjeta de Créditos e IA */}
                    <div className="bg-gradient-to-br from-blue-600 to-indigo-800 rounded-2xl sm:rounded-3xl p-4 sm:p-6 text-white shadow-xl relative overflow-hidden">
                        <div className="absolute -right-4 -top-4 opacity-10">
                            <BrainCircuit className="w-32 h-32" />
                        </div>
                        <h3 className="text-sm font-semibold uppercase tracking-wider opacity-80 mb-1 relative z-10">IA & Análisis</h3>
                        <div className="flex items-end gap-2 mb-4 relative z-10">
                            <p className="text-5xl font-black">{stats?.credits ?? session.user.credits ?? 0}</p>
                            <span className="text-blue-200 mb-1">créditos</span>
                        </div>

                        <div className="space-y-4 relative z-10">
                            <CreditsByPlanCard
                                credits={stats?.credits ?? session.user.credits ?? 0}
                                plan={(session.user.plan ?? "FREE").toUpperCase()}
                            />

                            {(session.user.plan ?? "FREE").toUpperCase() !== "RESEARCHER" && (
                                <Link href="/pricing" className="block w-full py-3 bg-white text-blue-700 text-center font-bold rounded-xl hover:bg-blue-50 transition-all shadow-sm active:scale-[0.98]">
                                    Ver Planes (Pro: 50 / Researcher: 200 créditos)
                                </Link>
                            )}
                            {(session.user.plan === "PRO" || session.user.plan === "RESEARCHER") && (
                                <button
                                    type="button"
                                    onClick={handleOpenBillingPortal}
                                    disabled={portalLoading}
                                    className="w-full py-3 border border-white/30 text-white font-bold rounded-xl hover:bg-white/10 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {portalLoading ? "Abriendo…" : <><CreditCard className="w-4 h-4" /> Gestionar suscripción</>}
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Comparador Free vs Pro vs Researcher (solo para usuarios Free) */}
                    {((session.user.plan ?? "FREE") as string).toUpperCase() === "FREE" && <PlanComparador />}

                    {/* Resumen de Actividad Académica */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-lg">
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

                    {/* Tu siguiente paso */}
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-900 rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-blue-100 dark:border-slate-700">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">Tu siguiente paso</h3>
                        {((stats?.credits ?? session.user.credits) ?? 0) > 0 ? (
                            <p className="text-slate-700 dark:text-slate-300 text-sm mb-4">Usa tus créditos para exportar (1 por PDF). Pro: 50/mes. Solo Researcher tiene exportaciones ilimitadas y minutas IA.</p>
                        ) : (
                            <p className="text-slate-700 dark:text-slate-300 text-sm mb-4">Sin créditos. Pro: 50/mes. Researcher: exportaciones ilimitadas + minutas IA.</p>
                        )}
                        <div className="flex flex-wrap gap-2">
                            <Link href="/simulador" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-500 transition-colors">
                                <Calculator className="w-4 h-4" /> Ir al simulador
                            </Link>
                            {((stats?.credits ?? session.user.credits) ?? 0) === 0 && (
                                <Link href="/pricing" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 text-sm font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                                    Ver planes Pro
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Cuestionarios - CTA destacado */}
                    <Link
                        href="/cuestionarios"
                        className="block w-full group relative overflow-hidden rounded-2xl sm:rounded-3xl border-2 border-violet-300 dark:border-violet-600 bg-gradient-to-br from-violet-500 via-purple-600 to-indigo-700 dark:from-violet-600 dark:via-purple-700 dark:to-indigo-800 p-6 sm:p-8 shadow-xl shadow-violet-500/20 hover:shadow-violet-500/30 hover:scale-[1.02] active:scale-[0.99] transition-all duration-300"
                    >
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.15),transparent_50%)] pointer-events-none" />
                        <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white/10 blur-2xl group-hover:bg-white/20 transition-colors" />
                        <div className="relative z-10 flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/20 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-lg">
                                <BrainCircuit className="w-7 h-7 sm:w-9 sm:h-9 text-white" />
                            </div>
                            <div className="flex-1 text-center sm:text-left">
                                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-[10px] font-black uppercase tracking-wider text-white/90 mb-2">
                                    <Zap className="w-3 h-3" /> Pon a prueba tu conocimiento
                                </div>
                                <h3 className="text-xl sm:text-2xl font-black text-white mb-1">Cuestionarios</h3>
                                <p className="text-sm text-white/90">
                                    Responde quizzes de economía, finanzas y más. Gana XP y mantén tu racha.
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-bold text-white/90 hidden sm:inline">Practicar</span>
                                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
                                    <ArrowRight className="w-5 h-5 text-white" />
                                </div>
                            </div>
                        </div>
                        {stats?.currentStreak || stats?.totalScore ? (
                            <div className="relative z-10 mt-4 pt-4 border-t border-white/20 flex justify-center sm:justify-start gap-6">
                                {stats.currentStreak > 0 && (
                                    <span className="flex items-center gap-1.5 text-white/90 text-sm font-bold">
                                        <Flame className="w-4 h-4 text-amber-300" fill="currentColor" /> {stats.currentStreak} días de racha
                                    </span>
                                )}
                                {stats.totalScore > 0 && (
                                    <span className="text-white/90 text-sm font-bold">
                                        {stats.totalScore} XP acumulados
                                    </span>
                                )}
                            </div>
                        ) : null}
                    </Link>

                    <div className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 border border-slate-200 dark:border-slate-800 shadow-xl">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                            <div>
                                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">Mis Escenarios</h2>
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
