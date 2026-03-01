"use client";

import { useState, useMemo } from "react";
import { TrendingUp, PieChart, Info, HelpCircle, Save, Target, Activity } from "lucide-react";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ZAxis, Cell, ReferenceLine, Label } from "recharts";

export default function SimuladorMarkowitz() {
    // Activo 1
    const [ret1, setRet1] = useState(12); // %
    const [vol1, setVol1] = useState(20); // %
    // Activo 2
    const [ret2, setRet2] = useState(8); // %
    const [vol2, setVol2] = useState(10); // %
    // Correlación
    const [corr, setCorr] = useState(0.2);

    // Generar la Frontera Eficiente (2 activos)
    const frontierData = useMemo(() => {
        const data = [];
        for (let w1 = 0; w1 <= 1; w1 += 0.02) {
            const w2 = 1 - w1;
            // Retorno Portafolio
            const rp = w1 * ret1 + w2 * ret2;
            // Varianza Portafolio: w1^2*s1^2 + w2^2*s2^2 + 2*w1*w2*s1*s2*corr
            const varP = Math.pow(w1, 2) * Math.pow(vol1, 2) +
                Math.pow(w2, 2) * Math.pow(vol2, 2) +
                2 * w1 * w2 * vol1 * vol2 * corr;
            const volP = Math.sqrt(varP);

            data.push({
                x: parseFloat(volP.toFixed(2)),
                y: parseFloat(rp.toFixed(2)),
                w1: Math.round(w1 * 100),
                w2: Math.round(w2 * 100),
            });
        }
        return data;
    }, [ret1, vol1, ret2, vol2, corr]);

    // Encontrar Portafolio de Mínima Varianza
    const minVarPoint = useMemo(() => {
        return frontierData.reduce((min, p) => p.x < min.x ? p : min, frontierData[0]);
    }, [frontierData]);

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden relative">
                <div className="absolute top-0 right-0 p-8 opacity-10 text-blue-500">
                    <PieChart className="w-24 h-24" />
                </div>
                <div className="relative z-10">
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2 flex items-center gap-3">
                        <Target className="text-blue-500" />
                        Teoría de Portafolio (Markowitz)
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 max-w-2xl">
                        Encuentra la combinación óptima de activos. Entiende cómo la **diversificación** reduce el riesgo total del portafolio mediante la correlación.
                    </p>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Controles */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Activo A */}
                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-lg">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-lg flex items-center justify-center font-bold">A</div>
                            <h3 className="font-bold text-slate-900 dark:text-white">Activo de Alto Riesgo</h3>
                        </div>
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs font-bold text-slate-500 uppercase">
                                    <span>Retorno Esperado</span>
                                    <span className="text-blue-600">{ret1}%</span>
                                </div>
                                <input type="range" min="0" max="40" step="1" value={ret1} onChange={(e) => setRet1(parseInt(e.target.value))} className="w-full accent-blue-600" />
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs font-bold text-slate-500 uppercase">
                                    <span>Volatilidad (σ)</span>
                                    <span className="text-blue-600">{vol1}%</span>
                                </div>
                                <input type="range" min="1" max="60" step="1" value={vol1} onChange={(e) => setVol1(parseInt(e.target.value))} className="w-full accent-blue-600" />
                            </div>
                        </div>
                    </div>

                    {/* Activo B */}
                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-lg">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-lg flex items-center justify-center font-bold">B</div>
                            <h3 className="font-bold text-slate-900 dark:text-white">Activo Conservador</h3>
                        </div>
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs font-bold text-slate-500 uppercase">
                                    <span>Retorno Esperado</span>
                                    <span className="text-emerald-600">{ret2}%</span>
                                </div>
                                <input type="range" min="0" max="20" step="1" value={ret2} onChange={(e) => setRet2(parseInt(e.target.value))} className="w-full accent-emerald-600" />
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs font-bold text-slate-500 uppercase">
                                    <span>Volatilidad (σ)</span>
                                    <span className="text-emerald-600">{vol2}%</span>
                                </div>
                                <input type="range" min="1" max="40" step="1" value={vol2} onChange={(e) => setVol2(parseInt(e.target.value))} className="w-full accent-emerald-600" />
                            </div>
                        </div>
                    </div>

                    {/* Correlación */}
                    <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-xl">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold flex items-center gap-2 italic">
                                <Activity className="w-4 h-4 text-amber-400" /> Correlación (ρ)
                            </h3>
                            <span className="text-2xl font-black text-amber-400">{corr.toFixed(2)}</span>
                        </div>
                        <input
                            type="range" min="-1" max="1" step="0.05" value={corr}
                            onChange={(e) => setCorr(parseFloat(e.target.value))}
                            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-400 mb-4"
                        />
                        <p className="text-[10px] text-slate-400 leading-relaxed">
                            {corr < 0 ? "⚠️ Correlación negativa: La diversificación es MÁXIMA. Los activos se mueven en sentidos opuestos." :
                                corr > 0.8 ? "⚠️ Correlación alta: La diversificación ayuda poco. Se mueven casi igual." :
                                    "Correlación moderada: Buen balance para reducir riesgo."}
                        </p>
                    </div>
                </div>

                {/* Frontera Eficiente Visual */}
                <div className="lg:col-span-2">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-lg h-full min-h-[550px] flex flex-col">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="font-black text-slate-900 dark:text-white text-xl">Frontera Eficiente</h3>
                                <p className="text-xs text-slate-500">Relación Riesgo (Volatilidad) vs Retorno Esperado</p>
                            </div>
                        </div>

                        <div className="flex-1 w-full min-h-[400px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis
                                        type="number" dataKey="x" name="Volatilidad" unit="%"
                                        domain={['dataMin - 2', 'dataMax + 2']}
                                        label={{ value: "Riesgo (Volatilidad σ) %", position: "insideBottomRight", offset: -5, fontSize: 10, fontWeight: "bold" }}
                                        tick={{ fontSize: 10 }}
                                    />
                                    <YAxis
                                        type="number" dataKey="y" name="Retorno" unit="%"
                                        domain={['dataMin - 2', 'dataMax + 2']}
                                        label={{ value: "Retorno Esperado %", angle: -90, position: "insideLeft", fontSize: 10, fontWeight: "bold" }}
                                        tick={{ fontSize: 10 }}
                                    />
                                    <ZAxis type="number" range={[40, 40]} />
                                    <Tooltip
                                        cursor={{ strokeDasharray: '3 3' }}
                                        contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '10px' }}
                                        formatter={(value: any, name: string) => [`${value}%`, name === 'x' ? 'Riesgo' : 'Retorno']}
                                    />
                                    <Scatter name="Frontera" data={frontierData} fill="#3b82f6" line={{ stroke: '#3b82f6', strokeWidth: 2 }}>
                                        {frontierData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.x === minVarPoint.x ? '#f59e0b' : '#3b82f6'} />
                                        ))}
                                    </Scatter>

                                    {/* Punto Mínima Varianza */}
                                    <ReferenceLine x={minVarPoint.x} stroke="transparent">
                                        <Label value="MVP" position="top" fill="#f59e0b" fontSize={10} fontWeight="bold" />
                                    </ReferenceLine>
                                </ScatterChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-6 pt-6 border-t border-slate-50 dark:border-slate-800">
                            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl">
                                <p className="text-[10px] uppercase font-black text-slate-400 mb-1">Mínima Varianza (MVP)</p>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-xl font-bold text-slate-900 dark:text-white">{minVarPoint.x}%</span>
                                    <span className="text-xs text-slate-500 font-medium">Riesgo</span>
                                </div>
                            </div>
                            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl">
                                <p className="text-[10px] uppercase font-black text-slate-400 mb-1">Asset Allocation MVP</p>
                                <div className="flex gap-4">
                                    <span className="text-sm font-bold text-blue-500">{minVarPoint.w1}% A</span>
                                    <span className="text-sm font-bold text-emerald-500">{minVarPoint.w2}% B</span>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <button className="w-full py-4 bg-blue-600 text-white font-black rounded-2xl text-xs hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20">
                                    Cargar Datos Reales (Yahoo)
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
