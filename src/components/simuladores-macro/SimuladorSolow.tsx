"use client";

import { useState, useMemo } from "react";
import { TrendingUp, Info, HelpCircle, Save, ArrowRight, Gauge } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, ReferenceLine, Label } from "recharts";

export default function SimuladorSolow() {
    // Parámetros del modelo
    const [s, setS] = useState(0.2); // Tasa de ahorro
    const [n, setN] = useState(0.02); // Crecimiento poblacional
    const [g, setG] = useState(0.02); // Progreso tecnológico
    const [delta, setDelta] = useState(0.05); // Depreciación
    const [alpha, setAlpha] = useState(0.33); // Participación del capital
    const [kInitial, setKInitial] = useState(1); // Capital inicial

    // Cálculos del estado estacionario
    const stats = useMemo(() => {
        // k* = (s / (n + g + delta))^(1 / (1 - alpha))
        const breakEven = n + g + delta;
        const kStar = Math.pow(s / breakEven, 1 / (1 - alpha));
        const yStar = Math.pow(kStar, alpha);
        const cStar = yStar * (1 - s);

        // Regla de Oro: s_gold = alpha
        const kGold = Math.pow(alpha / breakEven, 1 / (1 - alpha));
        const yGold = Math.pow(kGold, alpha);
        const cGold = yGold * (1 - alpha);

        return { kStar, yStar, cStar, kGold, yGold, cGold, breakEven };
    }, [s, n, g, delta, alpha]);

    // Datos para la gráfica de funciones
    const chartData = useMemo(() => {
        const data = [];
        const maxK = stats.kStar * 2;
        for (let k = 0; k <= maxK; k += maxK / 50) {
            const output = Math.pow(k, alpha);
            const investment = s * output;
            const depreciationLine = stats.breakEven * k;
            data.push({
                k: parseFloat(k.toFixed(2)),
                output: parseFloat(output.toFixed(4)),
                investment: parseFloat(investment.toFixed(4)),
                depreciation: parseFloat(depreciationLine.toFixed(4)),
            });
        }
        return data;
    }, [s, alpha, stats]);

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden relative">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                    <TrendingUp className="w-24 h-24" />
                </div>
                <div className="relative z-10">
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2 flex items-center gap-3">
                        <Gauge className="text-blue-500" />
                        Modelo de Crecimiento de Solow
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 max-w-2xl mb-6">
                        Analiza cómo la acumulación de capital, el progreso tecnológico y el crecimiento poblacional determinan el nivel de vida de una nación a largo plazo.
                    </p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700">
                            <p className="text-[10px] font-bold uppercase text-slate-500 mb-1">Capital (k*)</p>
                            <p className="text-2xl font-black text-blue-600 dark:text-blue-400">{stats.kStar.toFixed(2)}</p>
                            <p className="text-[10px] text-slate-400 mt-1">Estado Estacionario</p>
                        </div>
                        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700">
                            <p className="text-[10px] font-bold uppercase text-slate-500 mb-1">Producto (y*)</p>
                            <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{stats.yStar.toFixed(2)}</p>
                            <p className="text-[10px] text-slate-400 mt-1">Nivel de Ingreso</p>
                        </div>
                        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700">
                            <p className="text-[10px] font-bold uppercase text-slate-500 mb-1">Consumo (c*)</p>
                            <p className="text-2xl font-black text-amber-600 dark:text-amber-400">{stats.cStar.toFixed(2)}</p>
                            <p className="text-[10px] text-slate-400 mt-1">Bienestar Actual</p>
                        </div>
                        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-800">
                            <p className="text-[10px] font-bold uppercase text-blue-600 dark:text-blue-400 mb-1">Regla de Oro</p>
                            <p className="text-2xl font-black text-blue-700 dark:text-blue-300">{(alpha * 100).toFixed(0)}%</p>
                            <p className="text-[10px] text-blue-500 mt-1">Ahorro Óptimo</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Controles */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-lg">
                        <h3 className="font-bold text-slate-900 dark:text-white mb-6 flex items-center justify-between">
                            Variables de Control
                            <HelpCircle className="w-4 h-4 text-slate-400 cursor-help" />
                        </h3>

                        <div className="space-y-6">
                            {/* Tasa de Ahorro */}
                            <div className="space-y-3">
                                <div className="flex justify-between items-center text-xs font-bold text-slate-500 uppercase">
                                    <span>Tasa de Ahorro (s)</span>
                                    <span className="text-blue-600 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded">{(s * 100).toFixed(0)}%</span>
                                </div>
                                <input
                                    type="range" min="0.05" max="0.8" step="0.01" value={s}
                                    onChange={(e) => setS(parseFloat(e.target.value))}
                                    className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                />
                                <div className="flex justify-between text-[10px] text-slate-400">
                                    <span>Consumo hoy</span>
                                    <span>Inversión</span>
                                </div>
                            </div>

                            {/* Crecimiento Poblacional */}
                            <div className="space-y-3">
                                <div className="flex justify-between items-center text-xs font-bold text-slate-500 uppercase">
                                    <span>Crecimiento de L (n)</span>
                                    <span className="text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded">{(n * 100).toFixed(1)}%</span>
                                </div>
                                <input
                                    type="range" min="0" max="0.1" step="0.001" value={n}
                                    onChange={(e) => setN(parseFloat(e.target.value))}
                                    className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                                />
                            </div>

                            {/* Progreso Tecnológico */}
                            <div className="space-y-3">
                                <div className="flex justify-between items-center text-xs font-bold text-slate-500 uppercase">
                                    <span>Eficiencia (g)</span>
                                    <span className="text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-0.5 rounded">{(g * 100).toFixed(1)}%</span>
                                </div>
                                <input
                                    type="range" min="0" max="0.1" step="0.001" value={g}
                                    onChange={(e) => setG(parseFloat(e.target.value))}
                                    className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                />
                            </div>

                            {/* Depreciación */}
                            <div className="space-y-3">
                                <div className="flex justify-between items-center text-xs font-bold text-slate-500 uppercase">
                                    <span>Depreciación (&delta;)</span>
                                    <span className="text-rose-600 bg-rose-50 dark:bg-rose-900/30 px-2 py-0.5 rounded">{(delta * 100).toFixed(1)}%</span>
                                </div>
                                <input
                                    type="range" min="0.01" max="0.2" step="0.01" value={delta}
                                    onChange={(e) => setDelta(parseFloat(e.target.value))}
                                    className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-rose-600"
                                />
                            </div>

                            <hr className="border-slate-100 dark:border-slate-800" />

                            {/* Capital Share */}
                            <div className="space-y-3">
                                <div className="flex justify-between items-center text-xs font-bold text-slate-500 uppercase">
                                    <span>Peso del Capital (&alpha;)</span>
                                    <span className="text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">{alpha.toFixed(2)}</span>
                                </div>
                                <input
                                    type="range" min="0.1" max="0.7" step="0.01" value={alpha}
                                    onChange={(e) => setAlpha(parseFloat(e.target.value))}
                                    className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-slate-800"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-blue-600 rounded-3xl p-6 text-white shadow-xl">
                        <h4 className="font-bold mb-2 flex items-center gap-2">
                            <Info className="w-4 h-4" />
                            Insight Académico
                        </h4>
                        <p className="text-xs text-blue-100 leading-relaxed">
                            Si la tasa de ahorro ({(s * 100).toFixed(0)}%) es {s > alpha ? 'superior' : 'inferior'} a &alpha; ({(alpha * 100).toFixed(0)}%), la economía está {s > alpha ? 'sobre-invirtiendo' : 'sub-invirtiendo'} respecto a la **Regla de Oro**.
                            {s > alpha ? ' Reducir el ahorro hoy aumentaría el consumo en el futuro y ahora mismo.' : ' Aumentar el ahorro hoy reduciría el consumo hoy pero lo maximizaría a largo plazo.'}
                        </p>
                    </div>
                </div>

                {/* Gráfica */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-lg h-full min-h-[500px] flex flex-col">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="font-black text-slate-900 dark:text-white text-xl">Dinámica de Acumulación</h3>
                                <p className="text-xs text-slate-500">Balance entre Inversión vs. Gasto de Mantenimiento</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-blue-500" />
                                    <span className="text-[10px] font-bold text-slate-500 uppercase">Inversión</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-slate-400" />
                                    <span className="text-[10px] font-bold text-slate-500 uppercase">Reposición</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 w-full min-h-[400px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorInv" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                    <XAxis
                                        dataKey="k"
                                        label={{ value: "Capital por trabajador (k)", position: "insideBottomRight", offset: -5, fontSize: 10 }}
                                        tick={{ fontSize: 10 }}
                                    />
                                    <YAxis tick={{ fontSize: 10 }} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                                        itemStyle={{ color: '#94a3b8' }}
                                    />
                                    <Area type="monotone" dataKey="investment" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorInv)" />
                                    <Line type="monotone" dataKey="output" stroke="#e2e8f0" strokeDasharray="5 5" dot={false} strokeWidth={1} />
                                    <Line type="monotone" dataKey="depreciation" stroke="#94a3b8" strokeWidth={2} dot={false} />
                                    <ReferenceLine x={stats.kStar} stroke="#10b981" strokeDasharray="3 3">
                                        <Label value="k*" position="top" fill="#10b981" fontSize={12} fontWeight="bold" />
                                    </ReferenceLine>
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4 border-t border-slate-100 dark:border-slate-800 pt-6">
                            <div className="space-y-1">
                                <span className="text-[10px] text-slate-400 uppercase font-bold">Consumo Óptimo (Golden)</span>
                                <p className="text-lg font-black text-slate-900 dark:text-white">{stats.cGold.toFixed(3)}</p>
                            </div>
                            <div className="space-y-1">
                                <span className="text-[10px] text-slate-400 uppercase font-bold">Inversión Necesaria</span>
                                <p className="text-lg font-black text-slate-900 dark:text-white">{(stats.breakEven * stats.kStar).toFixed(3)}</p>
                            </div>
                            <div className="space-y-1">
                                <span className="text-[10px] text-slate-400 uppercase font-bold">Eficiencia del Capital</span>
                                <p className="text-lg font-black text-slate-900 dark:text-white">{(alpha * 100).toFixed(1)}%</p>
                            </div>
                            <button className="flex items-center justify-center gap-2 p-3 bg-slate-900 text-white dark:bg-white dark:text-slate-900 rounded-2xl text-xs font-black hover:scale-[1.02] transition-all">
                                <Save className="w-3.5 h-3.5" />
                                Guardar Análisis
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
