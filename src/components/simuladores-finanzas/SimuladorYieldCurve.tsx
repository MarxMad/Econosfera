"use client";

import { useState, useMemo } from "react";
import { TrendingUp, Info, HelpCircle, Save, BarChart4, MoveUp, MoveDown, GitCommit } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, AreaChart, Area } from "recharts";

export default function SimuladorYieldCurve() {
    // Parámetros Nelson-Siegel
    const [beta0, setBeta0] = useState(6.5); // Nivel (largo plazo)
    const [beta1, setBeta1] = useState(-3.0); // Pendiente
    const [beta2, setBeta2] = useState(-2.0); // Curvatura
    const [tau, setTau] = useState(2.0); // Escala

    // Calcular la curva
    const chartData = useMemo(() => {
        const data: { t: number, label: string, rate: number }[] = [];
        const periods = [
            0.25, 0.5, 1, 2, 3, 5, 7, 10, 20, 30
        ];

        periods.forEach(t => {
            const factor1 = (1 - Math.exp(-t / tau)) / (t / tau);
            const factor2 = factor1 - Math.exp(-t / tau);

            const yieldRate = beta0 + beta1 * factor1 + beta2 * factor2;

            data.push({
                t: t,
                label: t < 1 ? `${t * 12}M` : `${t}A`,
                rate: parseFloat(yieldRate.toFixed(2)),
            });
        });
        return data;
    }, [beta0, beta1, beta2, tau]);

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden relative">
                <div className="absolute top-0 right-0 p-8 opacity-10 text-emerald-500">
                    <BarChart4 className="w-24 h-24" />
                </div>
                <div className="relative z-10">
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2 flex items-center gap-3">
                        <TrendingUp className="text-emerald-500" />
                        Curva de Rendimiento (Yield Curve)
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 max-w-2xl">
                        Modelado de la estructura temporal de tasas de interés mediante el modelo **Nelson-Siegel**. Analiza curvas normales, invertidas o planas.
                    </p>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Controles */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-lg">
                        <h3 className="font-bold text-slate-900 dark:text-white mb-6 uppercase text-xs tracking-widest">Parámetros Nelson-Siegel</h3>

                        <div className="space-y-6">
                            {/* Beta 0 */}
                            <div className="space-y-3">
                                <div className="flex justify-between items-center text-xs font-bold text-slate-500 uppercase">
                                    <span>Nivel Largo Plazo (β₀)</span>
                                    <span className="text-emerald-600 font-mono">{beta0.toFixed(2)}%</span>
                                </div>
                                <input type="range" min="0" max="15" step="0.1" value={beta0} onChange={(e) => setBeta0(parseFloat(e.target.value))} className="w-full accent-emerald-600" />
                            </div>

                            {/* Beta 1 */}
                            <div className="space-y-3">
                                <div className="flex justify-between items-center text-xs font-bold text-slate-500 uppercase">
                                    <span>Pendiente (β₁)</span>
                                    <span className={`font-mono ${beta1 < 0 ? 'text-amber-600' : 'text-blue-600'}`}>{beta1.toFixed(2)}%</span>
                                </div>
                                <input type="range" min="-10" max="10" step="0.1" value={beta1} onChange={(e) => setBeta1(parseFloat(e.target.value))} className="w-full accent-slate-400" />
                                <div className="flex justify-between text-[8px] uppercase font-bold text-slate-400">
                                    <span>Normal</span>
                                    <span>Invertida</span>
                                </div>
                            </div>

                            {/* Beta 2 */}
                            <div className="space-y-3">
                                <div className="flex justify-between items-center text-xs font-bold text-slate-500 uppercase">
                                    <span>Curvatura (β₂)</span>
                                    <span className="text-purple-600 font-mono">{beta2.toFixed(2)}%</span>
                                </div>
                                <input type="range" min="-10" max="10" step="0.1" value={beta2} onChange={(e) => setBeta2(parseFloat(e.target.value))} className="w-full accent-purple-600" />
                            </div>

                            {/* Tau */}
                            <div className="space-y-3">
                                <div className="flex justify-between items-center text-xs font-bold text-slate-500 uppercase">
                                    <span>Escala (τ)</span>
                                    <span className="text-slate-600">{tau.toFixed(1)}</span>
                                </div>
                                <input type="range" min="0.5" max="10" step="0.1" value={tau} onChange={(e) => setTau(parseFloat(e.target.value))} className="w-full accent-slate-800" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-900 rounded-3xl p-6 text-white border border-slate-800">
                        <h4 className="font-bold text-sm mb-4 flex items-center gap-2">
                            <Info className="w-4 h-4 text-emerald-400" />
                            Lectura Económica
                        </h4>
                        <p className="text-xs text-slate-400 leading-relaxed">
                            {beta1 < -2 ?
                                "La curva tiene una pendiente positiva saludable. Indica expectativas de crecimiento económico." :
                                beta1 > 2 ?
                                    "⚠️ Curva Invertida: Históricamente asociada a una recesión inminente. Las tasas de corto plazo superan a las de largo." :
                                    "Curva Plana: Incertidumbre en la dirección futura de la economía y las tasas."}
                        </p>
                    </div>
                </div>

                {/* Grafica de la Curva */}
                <div className="lg:col-span-2">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-lg h-full min-h-[500px]">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="font-black text-slate-900 dark:text-white text-xl uppercase tracking-tighter">Estructura Temporal de Tasas</h3>
                            <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-lg text-[10px] font-black">
                                <GitCommit className="w-3 h-3" />
                                MODELO ACTIVO
                            </div>
                        </div>

                        <div className="h-[350px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis
                                        dataKey="label"
                                        tick={{ fontSize: 10, fontWeight: 700 }}
                                        label={{ value: 'Plazo (Tiempo)', position: 'insideBottomRight', offset: -10, fontSize: 10 }}
                                    />
                                    <YAxis
                                        tick={{ fontSize: 10, fontWeight: 700 }}
                                        label={{ value: 'Tasa %', angle: -90, position: 'insideLeft', fontSize: 10 }}
                                    />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '10px' }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="rate"
                                        stroke="#10b981"
                                        strokeWidth={4}
                                        fillOpacity={1}
                                        fill="url(#colorRate)"
                                        animationDuration={500}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-slate-50 dark:border-slate-800">
                            {[
                                { label: 'Tasa 1 Año', val: chartData.find(d => d.t === 1)?.rate },
                                { label: 'Tasa 10 Años', val: chartData.find(d => d.t === 10)?.rate },
                                { label: 'Spread 10Y-1Y', val: ((chartData.find(d => d.t === 10)?.rate || 0) - (chartData.find(d => d.t === 1)?.rate || 0)).toFixed(2) },
                                { label: 'Tasa 30 Años', val: chartData.find(d => d.t === 30)?.rate },
                            ].map((item, i) => (
                                <div key={i} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl text-center">
                                    <p className="text-[8px] uppercase font-black text-slate-400 mb-1">{item.label}</p>
                                    <p className="text-xl font-black text-slate-900 dark:text-white">{item.val}%</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
