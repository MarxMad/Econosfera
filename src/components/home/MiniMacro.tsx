"use client";

import { useState, useMemo } from "react";
import { TrendingUp, Calculator } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function MiniMacro() {
    const [c, setC] = useState(0.8); // Propensión marginal al consumo
    const [g, setG] = useState(100); // Gasto público autónomo

    const multiplicador = useMemo(() => 1 / (1 - c), [c]);
    const impacto = useMemo(() => g * multiplicador, [g, multiplicador]);

    const data = useMemo(() => {
        const points = [];
        for (let i = 0; i <= 500; i += 50) {
            points.push({
                gasto: i,
                renta: i * multiplicador
            });
        }
        return points;
    }, [multiplicador]);

    return (
        <div className="bg-white dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-blue-500/20 rounded-3xl p-6 shadow-xl dark:shadow-2xl text-slate-900 dark:text-white">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-500 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <div>
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white">Multiplicador Keynesiano</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Impacto del Gasto en la Renta</p>
                </div>
            </div>

            <div className="grid gap-6 mb-8">
                <div className="space-y-2">
                    <div className="flex justify-between text-xs font-medium">
                        <span className="text-slate-600 dark:text-slate-400 uppercase">Propensión al Consumo (c)</span>
                        <span className="text-blue-600 dark:text-blue-400 font-bold">{c * 100}%</span>
                    </div>
                    <input
                        type="range"
                        min="0.1"
                        max="0.95"
                        step="0.05"
                        value={c}
                        onChange={(e) => setC(Number(e.target.value))}
                        className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between text-xs font-medium">
                        <span className="text-slate-600 dark:text-slate-400 uppercase">Inyección de Gasto (ΔG)</span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold">${g.toLocaleString()}</span>
                    </div>
                    <input
                        type="range"
                        min="0"
                        max="500"
                        step="10"
                        value={g}
                        onChange={(e) => setG(Number(e.target.value))}
                        className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                    />
                </div>
            </div>

            <div className="flex gap-4 mb-6">
                <div className="flex-1 p-4 bg-slate-100 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 text-center">
                    <p className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 mb-1">Multiplicador (k)</p>
                    <p className="text-2xl font-black text-blue-600 dark:text-blue-400">{multiplicador.toFixed(2)}x</p>
                </div>
                <div className="flex-1 p-4 bg-slate-100 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 text-center">
                    <p className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 mb-1">Impacto Final (ΔY)</p>
                    <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">${impacto.toLocaleString()}</p>
                </div>
            </div>

            <div className="h-32 -mx-2 opacity-50">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                        <Line type="monotone" dataKey="renta" stroke="#3b82f6" strokeWidth={3} dot={false} />
                        <XAxis dataKey="gasto" hide />
                        <YAxis hide />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
