"use client";

import { useState, useMemo } from "react";
import { TrendingUp, DollarSign, ArrowRight, Info, Calculator, Lock } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function SimuladorDCF() {
    const { data: session } = useSession();
    const isPro = session?.user?.plan === 'PRO' || session?.user?.plan === 'RESEARCHER';

    const [cfo, setCfo] = useState(100); // Flujo inicial
    // ... rest of state stays same
    const [growth, setGrowth] = useState(10);
    const [wacc, setWacc] = useState(8);
    const [terminalGrowth, setTerminalGrowth] = useState(3);
    const [years, setYears] = useState(5);

    const dcfData = useMemo(() => {
        // ... (data calculation logic stays same)
        const results = [];
        let currentFlow = cfo;
        let totalPv = 0;

        for (let i = 1; i <= years; i++) {
            currentFlow = currentFlow * (1 + growth / 100);
            const pv = currentFlow / Math.pow(1 + wacc / 100, i);
            totalPv += pv;
            results.push({
                year: `Año ${i}`,
                flow: Math.round(currentFlow),
                pv: Math.round(pv),
                accumulatedPv: Math.round(totalPv)
            });
        }

        const lastFlow = currentFlow * (1 + terminalGrowth / 100);
        const terminalValue = lastFlow / (wacc / 100 - terminalGrowth / 100);
        const pvTerminal = terminalValue / Math.pow(1 + wacc / 100, years);
        const totalValue = totalPv + pvTerminal;

        return {
            projection: results,
            terminalValue: Math.round(terminalValue),
            pvTerminal: Math.round(pvTerminal),
            totalValue: Math.round(totalValue),
            enterpriseValue: Math.round(totalValue)
        };
    }, [cfo, growth, wacc, terminalGrowth, years]);

    return (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden relative">
            {!isPro && (
                <div className="absolute inset-0 z-50 backdrop-blur-[2px] bg-slate-900/40 flex items-center justify-center p-6 transition-all">
                    <div className="max-w-sm bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 text-center animate-in fade-in zoom-in duration-300">
                        <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Lock className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">Herramienta Premium</h3>
                        <p className="text-sm text-slate-500 mb-8">
                            El modelo DCF está reservado para usuarios con plan **Estudiante Pro**. Obtén acceso ilimitado a valuaciones avanzadas.
                        </p>
                        <Link href="/pricing" className="block w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-500 shadow-lg shadow-blue-600/20 transition-all">
                            Subir a Pro
                        </Link>
                    </div>
                </div>
            )}

            <div className="bg-slate-900 p-6 text-white">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-blue-500 rounded-xl">
                        <Calculator className="w-5 h-5" />
                    </div>
                    <h2 className="text-xl font-black">Valuación por Flujos Descontados (DCF)</h2>
                </div>
                <p className="text-sm text-slate-400">El estándar de oro para la valuación intrínseca de activos y empresas.</p>
            </div>

            <div className="p-6 grid lg:grid-cols-3 gap-8">
                {/* Inputs */}
                <div className="space-y-6">
                    <div className="space-y-4">
                        <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Parámetros de Entrada</h4>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Flujo de Caja Libre (Año 0)</label>
                            <div className="relative">
                                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="number"
                                    value={cfo}
                                    onChange={(e) => setCfo(Number(e.target.value))}
                                    className="w-full pl-10 p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Tasa de Crecimiento (Fase 1: {growth}%)</label>
                            <input
                                type="range" min="0" max="50" step="1"
                                value={growth} onChange={(e) => setGrowth(Number(e.target.value))}
                                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">WACC / Tasa Descuento ({wacc}%)</label>
                            <input
                                type="range" min="1" max="25" step="0.5"
                                value={wacc} onChange={(e) => setWacc(Number(e.target.value))}
                                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Crecimiento Perpetuo ({terminalGrowth}%)</label>
                            <input
                                type="range" min="0" max={wacc - 0.5} step="0.1"
                                value={terminalGrowth} onChange={(e) => setTerminalGrowth(Number(e.target.value))}
                                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                            />
                        </div>
                    </div>

                    <div className="p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30 rounded-2xl">
                        <div className="flex gap-2 text-amber-700 dark:text-amber-400 mb-2">
                            <Info className="w-4 h-4 shrink-0" />
                            <p className="text-xs font-bold uppercase tracking-wider">Nota Técnica</p>
                        </div>
                        <p className="text-[10px] text-amber-800/80 dark:text-amber-400/80 leading-relaxed">
                            El modelo asume una fase de crecimiento explícito seguida de un valor terminal perpetuo. El WACC debe ser siempre mayor al crecimiento perpetuo para que el modelo converja.
                        </p>
                    </div>
                </div>

                {/* Gráfica y Resultados */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="h-[300px] w-full bg-slate-50 dark:bg-slate-800/20 rounded-3xl p-4 border border-slate-100 dark:border-slate-800">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={dcfData.projection}>
                                <defs>
                                    <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                                <XAxis dataKey="year" fontSize={10} fontWeight="bold" />
                                <YAxis fontSize={10} fontWeight="bold" tickFormatter={(v) => `$${v}`} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                                />
                                <Area type="monotone" dataKey="pv" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorPv)" name="Valor Presente" />
                                <Area type="monotone" dataKey="flow" stroke="#94a3b8" strokeWidth={1} strokeDasharray="5 5" fill="none" name="Flujo Nominal" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="p-5 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-3xl shadow-sm">
                            <p className="text-[10px] font-black text-slate-400 uppercase mb-1">VP Flujos Fase 1</p>
                            <p className="text-2xl font-black text-slate-900 dark:text-white">
                                ${dcfData.projection[dcfData.projection.length - 1].accumulatedPv.toLocaleString()}
                            </p>
                        </div>
                        <div className="p-5 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-3xl shadow-sm">
                            <p className="text-[10px] font-black text-slate-400 uppercase mb-1">VP Valor Terminal</p>
                            <p className="text-2xl font-black text-slate-900 dark:text-white">
                                ${dcfData.pvTerminal.toLocaleString()}
                            </p>
                        </div>
                        <div className="p-5 bg-blue-600 rounded-3xl shadow-xl shadow-blue-600/20 text-white">
                            <p className="text-[10px] font-black opacity-80 uppercase mb-1">VALOR INTRÍNSECO (EV)</p>
                            <p className="text-3xl font-black">
                                ${dcfData.enterpriseValue.toLocaleString()}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
