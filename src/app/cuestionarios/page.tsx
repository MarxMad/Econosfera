"use client";

import { Suspense, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { getQuizzes, getUserStats } from "@/lib/actions/quizActions";
import { BrainCircuit, Trophy, Flame, Lock, Unlock, PlayCircle, Star, Target } from "lucide-react";

function CuestionariosContent() {
    const { data: session, status } = useSession();
    const searchParams = useSearchParams();
    const showLockedMessage = searchParams.get("locked") === "1";
    const [quizzes, setQuizzes] = useState<any[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === "authenticated") {
            loadData();
        } else if (status === "unauthenticated") {
            setLoading(false);
        }
    }, [status]);

    const loadData = async () => {
        setLoading(true);
        const [q, s] = await Promise.all([getQuizzes(), getUserStats()]);
        setQuizzes(q);
        setStats(s);
        setLoading(false);
    };

    if (status === "loading" || loading) {
        return <div className="p-20 text-center text-slate-500 animate-pulse">Cargando módulos de aprendizaje...</div>;
    }

    if (!session) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 text-center">
                <BrainCircuit className="w-20 h-20 text-indigo-500 mb-6" />
                <h1 className="text-3xl font-black mb-4">Módulos de Gamificación</h1>
                <p className="text-slate-500 max-w-md mx-auto mb-8">Debes iniciar sesión para acumular XP, desbloquear insignias y desafiar tus conocimientos financieros.</p>
                <Link href="/auth/signin" className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold shadow-lg shadow-indigo-600/30 transition-all">
                    Iniciar Sesión
                </Link>
            </div>
        );
    }

    const plan = (session?.user as any)?.plan ?? "FREE";
    const isFree = plan === "FREE";
    const difficultyStyles: any = {
        'BASIC': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
        'INTERMEDIATE': 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-400 border-amber-200 dark:border-amber-800',
        'ADVANCED': 'bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-400 border-rose-200 dark:border-rose-800',
    };

    const moduleColors: any = {
        'MACRO': 'text-blue-500 bg-blue-50 dark:bg-blue-900/20',
        'MICRO': 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20',
        'FINANZAS': 'text-purple-500 bg-purple-50 dark:bg-purple-900/20',
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <header className="mb-10 text-center sm:text-left flex flex-col sm:flex-row justify-between items-center gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white mt-2 mb-3 bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">
                        Academia Econosfera
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 max-w-xl text-lg">
                        Pon a prueba tu rigor técnico. Completa los desafíos para ganar XP y desbloquear prestigiosas insignias de mercado.
                    </p>
                </div>

                {/* Resumen del perfil del jugador */}
                <div className="flex items-center gap-4 bg-white dark:bg-slate-900 p-3 pr-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-all"></div>
                    <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center text-white shadow-md relative z-10">
                        <Trophy className="w-7 h-7" />
                    </div>
                    <div className="relative z-10">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-0.5">Nivel Actual</p>
                        <div className="flex items-end gap-2 text-slate-900 dark:text-white">
                            <span className="text-2xl font-black leading-none">{stats?.totalScore || 0}</span>
                            <span className="text-sm font-bold text-indigo-500 dark:text-indigo-400 pb-0.5">XP</span>
                        </div>
                    </div>
                    <div className="h-10 w-px bg-slate-200 dark:bg-slate-800 mx-2 relative z-10"></div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-1.5 text-amber-500 dark:text-amber-400">
                            <Flame className="w-5 h-5" fill="currentColor" />
                            <span className="text-xl font-black">{stats?.currentStreak || 0}</span>
                        </div>
                        <p className="text-[10px] font-bold text-slate-400 text-center uppercase mt-0.5">Racha</p>
                    </div>
                </div>
            </header>

            {showLockedMessage && (
                <div className="mb-6 p-4 rounded-2xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 flex items-center gap-3">
                    <Lock className="w-6 h-6 text-amber-600 dark:text-amber-400 shrink-0" />
                    <div>
                        <p className="font-bold text-amber-800 dark:text-amber-200">Cuestionario bloqueado</p>
                        <p className="text-sm text-amber-700 dark:text-amber-300">Actualiza a Pro para acceder a todos los cuestionarios de la academia.</p>
                    </div>
                    <Link href="/pricing" className="ml-auto px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold text-sm whitespace-nowrap">
                        Ver planes
                    </Link>
                </div>
            )}

            <div className="grid lg:grid-cols-3 gap-8 relative z-10">
                {/* Lista de Cuestionarios */}
                <div className="lg:col-span-2 space-y-5">
                    <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-6 flex items-center gap-2">
                        <Target className="w-5 h-5 text-indigo-500" /> Cuestionarios Disponibles
                    </h2>

                    {quizzes.map((quiz, i) => {
                        const isLocked = isFree && i >= 2;
                        return (
                            <div key={quiz.id} className={`group bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row gap-6 items-start sm:items-center relative overflow-hidden ${isLocked ? 'opacity-75' : 'hover:border-indigo-400 dark:hover:border-indigo-600 hover:shadow-xl hover:shadow-indigo-500/5 transition-all'}`}>
                                {isLocked && (
                                    <div className="absolute inset-x-0 -bottom-px h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-60"></div>
                                )}
                                <div className={`p-4 rounded-2xl shrink-0 ${isLocked ? 'bg-slate-200 dark:bg-slate-800 text-slate-500' : `${moduleColors[quiz.module] || 'bg-slate-100 text-slate-600'} group-hover:scale-110 transition-transform`}`}>
                                    {isLocked ? <Lock className="w-8 h-8" /> : <BrainCircuit className="w-8 h-8" />}
                                </div>

                                <div className="flex-1">
                                    <div className="flex flex-wrap items-center gap-3 mb-2">
                                        {isLocked && (
                                            <span className="px-2.5 py-1 text-[10px] font-black uppercase tracking-widest rounded-md border bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-400 border-amber-200 dark:border-amber-800">Pro</span>
                                        )}
                                        <span className={`px-2.5 py-1 text-[10px] font-black uppercase tracking-widest rounded-md border ${difficultyStyles[quiz.difficulty]}`}>
                                            {quiz.difficulty}
                                        </span>
                                        <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                                            <Star className="w-3.5 h-3.5 text-amber-500" fill="currentColor" /> {quiz.xpReward} XP
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{quiz.title}</h3>
                                    <p className="text-sm text-slate-500 leading-relaxed pr-6">{quiz.description}</p>
                                </div>

                                {isLocked ? (
                                    <Link href="/pricing" className="w-full sm:w-auto mt-4 sm:mt-0 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 whitespace-nowrap transition-all hover:-translate-y-0.5">
                                        <Lock className="w-4 h-4" /> Desbloquear con Pro
                                    </Link>
                                ) : stats?.quizAttempts?.some((a: any) => a.quizId === quiz.id && a.completed) ? (
                                    <button disabled className="w-full sm:w-auto mt-4 sm:mt-0 px-6 py-3 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 rounded-xl font-bold flex items-center justify-center gap-2 whitespace-nowrap cursor-not-allowed">
                                        <Trophy className="w-4 h-4" /> Completado
                                    </button>
                                ) : (
                                    <Link href={`/cuestionarios/${quiz.id}`} className="w-full sm:w-auto mt-4 sm:mt-0 px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:-translate-y-1 hover:shadow-lg transition-all rounded-xl font-bold flex items-center justify-center gap-2 whitespace-nowrap">
                                        <PlayCircle className="w-5 h-5" /> Iniciar
                                    </Link>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Right Column: Mini Leaderboard / Badges */}
                <div className="space-y-6">
                    <div className="bg-gradient-to-b from-indigo-900 to-slate-900 rounded-3xl p-6 border border-indigo-800/50 text-white shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500 rounded-full blur-3xl opacity-20"></div>

                        <h2 className="font-bold text-lg mb-6 flex items-center gap-2">
                            <Trophy className="w-5 h-5 text-amber-400" /> Tus Insignias
                        </h2>

                        {stats?.userBadges?.length > 0 ? (
                            <div className="grid grid-cols-2 gap-4">
                                {stats.userBadges.map((ub: any) => (
                                    <div key={ub.id} className="text-center p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors backdrop-blur-md">
                                        <div className="w-12 h-12 mx-auto bg-amber-500/20 text-amber-400 rounded-full flex items-center justify-center mb-3">
                                            <Star className="w-6 h-6" fill="currentColor" />
                                        </div>
                                        <p className="text-xs font-bold font-white">{ub.badge.name}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <div className="w-16 h-16 rounded-full bg-indigo-800/50 flex items-center justify-center mx-auto mb-4 border-2 border-dashed border-indigo-700">
                                    <Unlock className="w-6 h-6 text-indigo-400/50" />
                                </div>
                                <p className="text-sm font-medium text-indigo-200/60 leading-relaxed px-4">
                                    Responde correctamente los cuestionarios para desbloquear tu primera insignia.
                                </p>
                            </div>
                        )}

                        <div className="mt-8 pt-6 border-t border-indigo-800/50">
                            <h3 className="text-xs font-black uppercase text-indigo-400 tracking-widest mb-4">Próximos Logros</h3>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 opacity-60">
                                    <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center">🥉</div>
                                    <div className="flex-1">
                                        <p className="text-sm font-bold text-white">Analista Junior</p>
                                        <p className="text-[10px] text-slate-400">Gana 50 XP Básicos</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 opacity-60">
                                    <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center">🥈</div>
                                    <div className="flex-1">
                                        <p className="text-sm font-bold text-white">Maestro del Tiempo</p>
                                        <p className="text-[10px] text-slate-400">Aprueba todos los quizzes de Micro</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function CuestionariosPage() {
    return (
        <Suspense fallback={<div className="p-20 text-center text-slate-500 animate-pulse">Cargando módulos de aprendizaje...</div>}>
            <CuestionariosContent />
        </Suspense>
    );
}
