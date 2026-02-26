"use client";

import { useState, useMemo } from "react";
import { LineChart, TrendingUp, DollarSign } from "lucide-react";

export default function MiniValuacion() {
    const [price, setPrice] = useState(150);
    const [eps, setEps] = useState(5);
    const [growth, setGrowth] = useState(10);

    const per = useMemo(() => price / eps, [price, eps]);
    const peg = useMemo(() => per / growth, [per, growth]);

    return (
        <div className="bg-slate-900/60 backdrop-blur-xl border border-indigo-500/20 rounded-3xl p-6 shadow-2xl text-white">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-indigo-500 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <div>
                    <h3 className="font-bold text-lg">Valuación Rápida</h3>
                    <p className="text-xs text-slate-400">Ratios Bursátiles (P/E & PEG)</p>
                </div>
            </div>

            <div className="grid gap-6 mb-8">
                <div className="space-y-2">
                    <div className="flex justify-between text-xs font-medium">
                        <span className="text-slate-400 uppercase">Precio Acción</span>
                        <span className="text-indigo-400 font-bold">${price}</span>
                    </div>
                    <input
                        type="range"
                        min="10"
                        max="500"
                        step="5"
                        value={price}
                        onChange={(e) => setPrice(Number(e.target.value))}
                        className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                    />
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between text-xs font-medium">
                        <span className="text-slate-400 uppercase">Utilidad por Acción (EPS)</span>
                        <span className="text-emerald-400 font-bold">${eps}</span>
                    </div>
                    <input
                        type="range"
                        min="0.5"
                        max="20"
                        step="0.5"
                        value={eps}
                        onChange={(e) => setEps(Number(e.target.value))}
                        className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                    />
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between text-xs font-medium">
                        <span className="text-slate-400 uppercase">Crecimiento Est. (%)</span>
                        <span className="text-amber-400 font-bold">{growth}%</span>
                    </div>
                    <input
                        type="range"
                        min="1"
                        max="50"
                        step="1"
                        value={growth}
                        onChange={(e) => setGrowth(Number(e.target.value))}
                        className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-400"
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-800/50 rounded-2xl border border-slate-700">
                    <p className="text-[10px] uppercase font-bold text-slate-400 mb-1 flex items-center gap-1">
                        P/E Ratio
                    </p>
                    <p className={`text-xl font-black ${per > 25 ? 'text-rose-400' : 'text-emerald-400'}`}>
                        {per.toFixed(1)}x
                    </p>
                </div>
                <div className="p-4 bg-slate-800/50 rounded-2xl border border-slate-700">
                    <p className="text-[10px] uppercase font-bold text-slate-400 mb-1 flex items-center gap-1">
                        PEG Ratio
                    </p>
                    <p className={`text-xl font-black ${peg > 1.5 ? 'text-rose-400' : 'text-emerald-400'}`}>
                        {peg.toFixed(2)}
                    </p>
                </div>
            </div>

            <div className="mt-6 space-y-2">
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-slate-500">
                    <span>Subvaluado</span>
                    <span>Sobrevaluado</span>
                </div>
                <div className="relative h-1.5 w-full bg-slate-800 rounded-full overflow-hidden flex">
                    <div className="h-full bg-emerald-500 w-[33%]" />
                    <div className="h-full bg-amber-500 w-[33%]" />
                    <div className="h-full bg-rose-500 w-[34%]" />
                </div>
                <div
                    className="w-3 h-3 bg-white rounded-full border-2 border-slate-900 shadow-lg transition-all duration-500 relative z-10"
                    style={{ left: `${Math.min(peg * 33, 100)}%`, transform: 'translate(-50%, -10px)' }}
                />
            </div>

            <p className="mt-4 text-[10px] text-slate-500 leading-tight italic">
                *Interpretación: Un PEG &lt; 1.0 suele considerarse una valuación atractiva respecto al crecimiento.
            </p>
        </div>
    );
}
