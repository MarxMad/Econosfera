"use client";

import { useState, useMemo } from "react";
import { Coins, Zap } from "lucide-react";

export default function MiniBlockchain() {
    const [reward, setReward] = useState(3.125);
    const [scarcity, setScarcity] = useState(50); // % Stock-to-Flow increase

    const inflationAnn = useMemo(() => {
        return (reward * 52560) / 19600000 * 100; // Simplified annual inflation
    }, [reward]);

    return (
        <div className="bg-slate-900/60 backdrop-blur-xl border border-purple-500/20 rounded-3xl p-6 shadow-2xl text-white">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-purple-500 rounded-lg">
                    <Coins className="w-5 h-5 text-white" />
                </div>
                <div>
                    <h3 className="font-bold text-lg">Impacto del Halving</h3>
                    <p className="text-xs text-slate-400">Escasez Programada de Bitcoin</p>
                </div>
            </div>

            <div className="grid gap-6 mb-8">
                <div className="space-y-2">
                    <div className="flex justify-between text-xs font-medium">
                        <span className="text-slate-400 uppercase">Recompensa por Bloque (BTC)</span>
                        <span className="text-purple-400 font-bold">{reward} BTC</span>
                    </div>
                    <input
                        type="range"
                        min="0.1"
                        max="6.25"
                        step="0.1"
                        value={reward}
                        onChange={(e) => setReward(Number(e.target.value))}
                        className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                    />
                </div>

                <div className="p-4 bg-slate-800/50 rounded-2xl border border-slate-700">
                    <div className="flex justify-between items-center">
                        <p className="text-[10px] uppercase font-bold text-slate-400">Inflación Anual Proyectada</p>
                        <p className="text-xl font-black text-emerald-400">{inflationAnn.toFixed(2)}%</p>
                    </div>
                </div>

                <div className="text-center p-4">
                    <Zap className="w-8 h-8 text-amber-500 mx-auto mb-2 animate-pulse" />
                    <p className="text-xs text-slate-400 italic">
                        "Cada 4 años, la oferta se corta a la mitad. Menos oferta con demanda constante = Presión alcista."
                    </p>
                </div>
            </div>
        </div>
    );
}
