"use client";

import { useState, useMemo } from "react";
import { TrendingUp, Info, HelpCircle, Gamepad2, User2, Zap, Target } from "lucide-react";

export default function SimuladorTeoriaJuegos() {
    // Payoffs [Jugador A, Jugador B]
    const [p00_A, setP00_A] = useState(-1); // Cooperar, Cooperar
    const [p00_B, setP00_B] = useState(-1);

    const [p01_A, setP01_A] = useState(-10); // Cooperar, Defectar
    const [p01_B, setP01_B] = useState(0);

    const [p10_A, setP10_A] = useState(0); // Defectar, Cooperar
    const [p10_B, setP10_B] = useState(-10);

    const [p11_A, setP11_A] = useState(-5); // Defectar, Defectar
    const [p11_B, setP11_B] = useState(-5);

    // Encontrar Equilibrio de Nash
    const nash = useMemo(() => {
        const matrix = [
            [[p00_A, p00_B], [p01_A, p01_B]],
            [[p10_A, p10_B], [p11_A, p11_B]]
        ];

        const equilibriums = [];
        for (let i = 0; i < 2; i++) {
            for (let j = 0; j < 2; j++) {
                // A prefiere i dado j? 
                const isBestA = matrix[i][j][0] >= matrix[1 - i][j][0];
                // B prefiere j dado i?
                const isBestB = matrix[i][j][1] >= matrix[i][1 - j][1];

                if (isBestA && isBestB) {
                    equilibriums.push([i, j]);
                }
            }
        }
        return equilibriums;
    }, [p00_A, p00_B, p01_A, p01_B, p10_A, p10_B, p11_A, p11_B]);

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden relative">
                <div className="absolute top-0 right-0 p-8 opacity-10 text-emerald-500">
                    <Gamepad2 className="w-24 h-24" />
                </div>
                <div className="relative z-10">
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2 flex items-center gap-3">
                        <Target className="text-emerald-500" />
                        Teoría de Juegos: El Dilema del Prisionero
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 max-w-2xl">
                        Analiza decisiones estratégicas donde el resultado depende de las acciones de los demás. Encuentra el **Equilibrio de Nash** en tiempo real.
                    </p>
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Matriz de Pagos */}
                <div className="space-y-6">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-lg">
                        <div className="grid grid-cols-3 gap-4 mb-4">
                            <div className="col-span-1" />
                            <div className="col-span-2 text-center text-[10px] font-black uppercase text-slate-400 tracking-widest border-b border-slate-100 pb-2">Jugador B (Columnas)</div>

                            <div className="col-span-1 flex items-center justify-center text-[10px] font-black uppercase text-slate-400 tracking-widest [writing-mode:vertical-lr] border-r border-slate-100 pr-2">Jugador A (Filas)</div>

                            {/* Celdas */}
                            <div className="col-span-2 grid grid-cols-2 gap-4">
                                {/* Cooperar / Cooperar */}
                                <div className={`relative p-6 rounded-2xl border-2 transition-all ${nash.some(n => n[0] === 0 && n[1] === 0) ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' : 'border-slate-100 dark:border-slate-800'}`}>
                                    {nash.some(n => n[0] === 0 && n[1] === 0) && <div className="absolute top-2 right-2 px-2 py-0.5 bg-emerald-500 text-white text-[8px] font-bold rounded-full">NASH</div>}
                                    <div className="flex justify-between items-center h-full">
                                        <input type="number" value={p00_A} onChange={(e) => setP00_A(parseInt(e.target.value))} className="w-10 bg-transparent text-center font-black text-rose-600 focus:outline-none" />
                                        <div className="w-px h-8 bg-slate-200" />
                                        <input type="number" value={p00_B} onChange={(e) => setP00_B(parseInt(e.target.value))} className="w-10 bg-transparent text-center font-black text-blue-600 focus:outline-none" />
                                    </div>
                                    <div className="mt-4 text-center text-[8px] font-bold text-slate-400">Cooperar / Cooperar</div>
                                </div>

                                {/* Cooperar / Defectar */}
                                <div className={`relative p-6 rounded-2xl border-2 transition-all ${nash.some(n => n[0] === 0 && n[1] === 1) ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' : 'border-slate-100 dark:border-slate-800'}`}>
                                    {nash.some(n => n[0] === 0 && n[1] === 1) && <div className="absolute top-2 right-2 px-2 py-0.5 bg-emerald-500 text-white text-[8px] font-bold rounded-full">NASH</div>}
                                    <div className="flex justify-between items-center h-full">
                                        <input type="number" value={p01_A} onChange={(e) => setP01_A(parseInt(e.target.value))} className="w-10 bg-transparent text-center font-black text-rose-600 focus:outline-none" />
                                        <div className="w-px h-8 bg-slate-200" />
                                        <input type="number" value={p01_B} onChange={(e) => setP01_B(parseInt(e.target.value))} className="w-10 bg-transparent text-center font-black text-blue-600 focus:outline-none" />
                                    </div>
                                    <div className="mt-4 text-center text-[8px] font-bold text-slate-400">Cooperar / Defectar</div>
                                </div>

                                {/* Defectar / Cooperar */}
                                <div className={`relative p-6 rounded-2xl border-2 transition-all ${nash.some(n => n[0] === 1 && n[1] === 0) ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' : 'border-slate-100 dark:border-slate-800'}`}>
                                    {nash.some(n => n[0] === 1 && n[1] === 0) && <div className="absolute top-2 right-2 px-2 py-0.5 bg-emerald-500 text-white text-[8px] font-bold rounded-full">NASH</div>}
                                    <div className="flex justify-between items-center h-full">
                                        <input type="number" value={p10_A} onChange={(e) => setP10_A(parseInt(e.target.value))} className="w-10 bg-transparent text-center font-black text-rose-600 focus:outline-none" />
                                        <div className="w-px h-8 bg-slate-200" />
                                        <input type="number" value={p10_B} onChange={(e) => setP10_B(parseInt(e.target.value))} className="w-10 bg-transparent text-center font-black text-blue-600 focus:outline-none" />
                                    </div>
                                    <div className="mt-4 text-center text-[8px] font-bold text-slate-400">Defectar / Cooperar</div>
                                </div>

                                {/* Defectar / Defectar */}
                                <div className={`relative p-6 rounded-2xl border-2 transition-all ${nash.some(n => n[0] === 1 && n[1] === 1) ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' : 'border-slate-100 dark:border-slate-800'}`}>
                                    {nash.some(n => n[0] === 1 && n[1] === 1) && <div className="absolute top-2 right-2 px-2 py-0.5 bg-emerald-500 text-white text-[8px] font-bold rounded-full">NASH</div>}
                                    <div className="flex justify-between items-center h-full">
                                        <input type="number" value={p11_A} onChange={(e) => setP11_A(parseInt(e.target.value))} className="w-10 bg-transparent text-center font-black text-rose-600 focus:outline-none" />
                                        <div className="w-px h-8 bg-slate-200" />
                                        <input type="number" value={p11_B} onChange={(e) => setP11_B(parseInt(e.target.value))} className="w-10 bg-transparent text-center font-black text-blue-600 focus:outline-none" />
                                    </div>
                                    <div className="mt-4 text-center text-[8px] font-bold text-slate-400">Defectar / Defectar</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-900 rounded-3xl p-6 text-white">
                        <h4 className="font-bold flex items-center gap-2 mb-4">
                            <Zap className="w-4 h-4 text-amber-500" />
                            ¿Qué es el Equilibrio de Nash?
                        </h4>
                        <p className="text-xs text-slate-400 leading-relaxed">
                            Es una situación donde ningún jugador tiene incentivos para cambiar su estrategia de forma unilateral, asumiendo que el otro jugador mantendrá la suya. En el Dilema del Prisionero, el equilibrio suele ser que ambos "defecten", aunque ambos estarían mejor cooperando.
                        </p>
                    </div>
                </div>

                {/* Explicación y Personajes */}
                <div className="space-y-6">
                    <div className="p-8 bg-blue-600 rounded-3xl text-white shadow-xl relative overflow-hidden">
                        <User2 className="absolute -bottom-4 -right-4 w-32 h-32 opacity-20" />
                        <h3 className="font-black text-xl mb-4">Resultado del Escenario</h3>
                        {nash.length > 0 ? (
                            <div className="space-y-4">
                                <p className="text-sm font-medium">Se han encontrado **{nash.length}** puntos de equilibrio.</p>
                                <div className="p-4 bg-white/10 rounded-2xl border border-white/20">
                                    <p className="text-xs italic leading-relaxed">
                                        "El sistema se estabilizará en la celda destacada en verde. A pesar de los posibles beneficios colectivos, la desconfianza racional los lleva a este resultado."
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <p className="text-sm">No hay equilibrio estable en estrategias puras con estos valores.</p>
                        )}
                    </div>

                    <div className="p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-lg">
                        <h4 className="font-bold text-slate-900 dark:text-white mb-6 uppercase text-xs">Ejemplos Clásicos</h4>
                        <div className="grid gap-3">
                            <button onClick={() => { setP00_A(3); setP00_B(3); setP01_A(0); setP01_B(5); setP10_A(5); setP10_B(0); setP11_A(1); setP11_B(1); }} className="p-4 text-left rounded-2xl border border-slate-100 hover:border-emerald-500 hover:bg-emerald-50 transition-all">
                                <p className="text-xs font-bold text-slate-900 mb-1">Caza de Venados</p>
                                <p className="text-[10px] text-slate-400">Coordinación: confiar es mejor pero arriesgado.</p>
                            </button>
                            <button onClick={() => { setP00_A(1); setP00_B(1); setP01_A(-1); setP01_B(2); setP10_A(2); setP10_B(-1); setP11_A(0); setP11_B(0); }} className="p-4 text-left rounded-2xl border border-slate-100 hover:border-blue-500 hover:bg-blue-50 transition-all">
                                <p className="text-xs font-bold text-slate-900 mb-1">Guerra de Precios</p>
                                <p className="text-[10px] text-slate-400">Competencia de Duopolios.</p>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
