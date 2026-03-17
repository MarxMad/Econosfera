"use client";

import { useState, useMemo } from "react";
import { Activity, Target, TrendingUp } from "lucide-react";

export default function MiniTaylor() {
    const [inf, setInf] = useState(4.5);
    const [meta, setMeta] = useState(3.0);
    const [gap, setGap] = useState(1.0);
    const [r, setR] = useState(2.0);

    const alpha = 0.5;
    const beta = 0.5;

    const tasaTaylor = useMemo(() => {
        return r + inf + alpha * (inf - meta) + beta * gap;
    }, [inf, meta, gap, r]);

    return (
        <div className="bg-white dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-rose-500/20 rounded-3xl p-6 shadow-xl dark:shadow-2xl text-slate-900 dark:text-white">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-rose-500 rounded-lg">
                    <Activity className="w-5 h-5 text-white" />
                </div>
                <div>
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white">Regla de Taylor</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Brújula de Bancos Centrales</p>
                </div>
            </div>

            <div className="grid gap-6 mb-8">
                <div className="space-y-2">
                    <div className="flex justify-between text-xs font-medium">
                        <span className="text-slate-600 dark:text-slate-400 uppercase">Inflación Actual</span>
                        <span className="text-rose-600 dark:text-rose-400 font-bold">{inf}%</span>
                    </div>
                    <input
                        type="range"
                        min="0"
                        max="15"
                        step="0.1"
                        value={inf}
                        onChange={(e) => setInf(Number(e.target.value))}
                        className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-rose-500"
                    />
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between text-xs font-medium">
                        <span className="text-slate-600 dark:text-slate-400 uppercase">Meta de Inflación</span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold">{meta}%</span>
                    </div>
                    <input
                        type="range"
                        min="1"
                        max="6"
                        step="0.1"
                        value={meta}
                        onChange={(e) => setMeta(Number(e.target.value))}
                        className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                    />
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between text-xs font-medium">
                        <span className="text-slate-600 dark:text-slate-400 uppercase">Brecha de Producto (Gap)</span>
                        <span className="text-amber-600 dark:text-amber-400 font-bold">{gap}%</span>
                    </div>
                    <input
                        type="range"
                        min="-5"
                        max="5"
                        step="0.1"
                        value={gap}
                        onChange={(e) => setGap(Number(e.target.value))}
                        className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
                    />
                </div>
            </div>

            <div className="p-5 bg-rose-50 dark:bg-gradient-to-br dark:from-rose-500/10 dark:to-transparent rounded-2xl border border-rose-200 dark:border-rose-500/20 text-center">
                <p className="text-[10px] uppercase font-bold text-rose-600 dark:text-rose-400 mb-2 flex items-center justify-center gap-2">
                    <Target className="w-3 h-3" /> Tasa de interés sugerida
                </p>
                <p className="text-4xl font-black text-slate-900 dark:text-white font-mono">{tasaTaylor.toFixed(2)}%</p>
                <div className="mt-4 pt-4 border-t border-slate-200 dark:border-white/5 flex items-center justify-center gap-4 text-[9px] font-mono text-slate-500 dark:text-slate-500 italic">
                    <span>i = r* + π + 0.5(π-π*) + 0.5(y)</span>
                </div>
            </div>
        </div>
    );
}
