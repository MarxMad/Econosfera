"use client";

import { useState, useMemo } from "react";
import { TrendingUp, Info, HelpCircle, Save, Percent, Activity } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter, ReferenceLine, Label, Cell } from "recharts";

export default function SimuladorPhillips() {
    // Parámetros
    const [expectedInflation, setExpectedInflation] = useState(3.0);
    const [naturalUnemployment, setNaturalUnemployment] = useState(5.0);
    const [beta, setBeta] = useState(0.5); // Sensibilidad
    const [supplyShock, setSupplyShock] = useState(0); // Choque de oferta

    // Datos de la curva
    const chartData = useMemo(() => {
        const data = [];
        // Kurva de corto plazo
        for (let u = 2; u <= 10; u += 0.5) {
            const inflation = expectedInflation - beta * (u - naturalUnemployment) + supplyShock;
            data.push({
                u: parseFloat(u.toFixed(1)),
                pi: parseFloat(inflation.toFixed(2)),
            });
        }
        return data;
    }, [expectedInflation, naturalUnemployment, beta, supplyShock]);

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden relative">
                <div className="absolute top-0 right-0 p-8 opacity-10 text-rose-500">
                    <Activity className="w-24 h-24" />
                </div>
                <div className="relative z-10">
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2 flex items-center gap-3">
                        <Percent className="text-rose-500" />
                        Simulador de la Curva de Phillips
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 max-w-2xl">
                        Explora el trade-off entre inflación y desempleo. Observa cómo cambian las expectativas y los choques de oferta desplazan la curva de corto plazo.
                    </p>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Controles */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-lg">
                        <h3 className="font-bold text-slate-900 dark:text-white mb-6">Configuración del Modelo</h3>

                        <div className="space-y-6">
                            {/* Inflación Esperada */}
                            <div className="space-y-3">
                                <div className="flex justify-between items-center text-xs font-bold text-slate-500 uppercase">
                                    <span>Inflación Esperada (πᵉ)</span>
                                    <span className="text-rose-600 bg-rose-50 dark:bg-rose-900/30 px-2 py-0.5 rounded">{expectedInflation.toFixed(1)}%</span>
                                </div>
                                <input
                                    type="range" min="0" max="15" step="0.1" value={expectedInflation}
                                    onChange={(e) => setExpectedInflation(parseFloat(e.target.value))}
                                    className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-rose-500"
                                />
                            </div>

                            {/* Desempleo Natural */}
                            <div className="space-y-3">
                                <div className="flex justify-between items-center text-xs font-bold text-slate-500 uppercase">
                                    <span>Tasa Natural (uₙ)</span>
                                    <span className="text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">{naturalUnemployment.toFixed(1)}%</span>
                                </div>
                                <input
                                    type="range" min="2" max="10" step="0.1" value={naturalUnemployment}
                                    onChange={(e) => setNaturalUnemployment(parseFloat(e.target.value))}
                                    className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-slate-800"
                                />
                            </div>

                            {/* Sensibilidad Beta */}
                            <div className="space-y-3">
                                <div className="flex justify-between items-center text-xs font-bold text-slate-500 uppercase">
                                    <span>Rigidez de Salarios (β)</span>
                                    <span className="text-blue-600 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded">{beta.toFixed(2)}</span>
                                </div>
                                <input
                                    type="range" min="0.1" max="2.0" step="0.05" value={beta}
                                    onChange={(e) => setBeta(parseFloat(e.target.value))}
                                    className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                />
                            </div>

                            {/* Choque de Oferta */}
                            <div className="space-y-3">
                                <div className="flex justify-between items-center text-xs font-bold text-slate-500 uppercase">
                                    <span>Choque de Oferta (v)</span>
                                    <span className={`px-2 py-0.5 rounded ${supplyShock === 0 ? 'text-slate-500 bg-slate-100' : supplyShock > 0 ? 'text-amber-600 bg-amber-50' : 'text-emerald-600 bg-emerald-50'}`}>
                                        {supplyShock > 0 ? `+${supplyShock}` : supplyShock}%
                                    </span>
                                </div>
                                <input
                                    type="range" min="-5" max="5" step="0.1" value={supplyShock}
                                    onChange={(e) => setSupplyShock(parseFloat(e.target.value))}
                                    className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
                                />
                                <p className="text-[10px] text-slate-400">Ej: Aumento en precios del petróleo (+) o mejoras tecnológicas (-)</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-900 rounded-3xl p-6 text-white border border-slate-800">
                        <h4 className="font-bold mb-3 flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-rose-500" />
                            Predicción a Largo Plazo
                        </h4>
                        <p className="text-xs text-slate-400 leading-relaxed">
                            A largo plazo, la curva es vertical en **uₙ = {naturalUnemployment}%**. No hay trade-off; cualquier intento de reducir el desempleo por debajo de este nivel solo generará una aceleración perpetua de la inflación.
                        </p>
                    </div>
                </div>

                {/* Gráfica */}
                <div className="lg:col-span-2">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-lg h-full min-h-[500px]">
                        <div className="flex items-center justify-between mb-10">
                            <div>
                                <h3 className="font-black text-slate-900 dark:text-white text-xl">Mapa de Inflación-Desempleo</h3>
                                <p className="text-xs text-slate-500 font-medium">Curva de Phillips de Corto Plazo (SRPC)</p>
                            </div>
                        </div>

                        <div className="h-[400px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis
                                        dataKey="u"
                                        type="number"
                                        domain={[2, 10]}
                                        label={{ value: "Desempleo (u) %", position: "insideBottomRight", offset: -10, fontSize: 10, fontWeight: 700 }}
                                        tick={{ fontSize: 10 }}
                                    />
                                    <YAxis
                                        label={{ value: "Inflación (π) %", angle: -90, position: "insideLeft", fontSize: 10, fontWeight: 700 }}
                                        tick={{ fontSize: 10 }}
                                    />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                                        labelFormatter={(value) => `Desempleo: ${value}%`}
                                        formatter={(value: any) => [`${value}%`, "Inflación"]}
                                    />

                                    {/* Largo Plazo */}
                                    <ReferenceLine x={naturalUnemployment} stroke="#94a3b8" strokeWidth={2} strokeDasharray="5 5">
                                        <Label value="LRPC" position="top" fill="#94a3b8" fontSize={10} fontWeight="black" />
                                    </ReferenceLine>

                                    {/* Corto Plazo */}
                                    <Line
                                        type="monotone"
                                        dataKey="pi"
                                        stroke="#f43f5e"
                                        strokeWidth={4}
                                        dot={false}
                                        animationDuration={500}
                                    />

                                    {/* Punto de Equilibrio actual */}
                                    <ReferenceLine y={expectedInflation + supplyShock} x={naturalUnemployment} stroke="transparent">
                                        <Label value="●" position="center" fill="#f43f5e" fontSize={24} />
                                    </ReferenceLine>
                                </LineChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-slate-50 dark:border-slate-800">
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-rose-50 dark:bg-rose-900/20 text-rose-600 rounded-lg">
                                    <Activity className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase font-black text-slate-400">Punto NAIRU</p>
                                    <p className="text-xl font-bold text-slate-900 dark:text-white">{naturalUnemployment}%</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-amber-50 dark:bg-amber-900/20 text-amber-600 rounded-lg">
                                    <TrendingUp className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase font-black text-slate-400">Inflación de Eq.</p>
                                    <p className="text-xl font-bold text-slate-900 dark:text-white">{(expectedInflation + supplyShock).toFixed(1)}%</p>
                                </div>
                            </div>
                            <button className="h-full bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-2xl text-xs font-black border border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-700 transition-all">
                                Comparar con Datos Reales
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
