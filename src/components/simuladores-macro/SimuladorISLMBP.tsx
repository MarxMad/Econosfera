"use client";

import { useState, useMemo } from "react";
import { TrendingUp, Info, HelpCircle, Save, Globe, Landmark, Zap } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Label } from "recharts";

export default function SimuladorISLMBP() {
    // Escenario
    const [regime, setRegime] = useState<"fixed" | "flexible">("flexible");
    const [mobility, setMobility] = useState<"perfect" | "imperfect">("perfect");

    // Shocks de Política
    const [fiscalExpansion, setFiscalExpansion] = useState(0); // G
    const [monetaryExpansion, setMonetaryExpansion] = useState(0); // M

    // Parámetros estructurales (fijos para simplicidad visual)
    const baseISOffset = 5;
    const baseLMOffset = 5;
    const worldInterestRate = 5;

    // Cálculo de Curvas
    const chartData = useMemo(() => {
        const data = [];
        // Desplazamientos
        const isShift = fiscalExpansion * 0.5;
        const lmShift = monetaryExpansion * 0.5;

        for (let y = 0; y <= 10; y += 0.5) {
            // IS: r = offset - b*Y
            const isRate = (baseISOffset + isShift) - 0.5 * y;
            // LM: r = b*Y - offset
            const lmRate = 0.5 * y - (lmShift - baseLMOffset);

            data.push({
                y: y,
                is: parseFloat(isRate.toFixed(2)),
                lm: parseFloat(lmRate.toFixed(2)),
                bp: worldInterestRate,
            });
        }
        return data;
    }, [fiscalExpansion, monetaryExpansion]);

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden relative">
                <div className="absolute top-0 right-0 p-8 opacity-10 text-indigo-500">
                    <Globe className="w-24 h-24" />
                </div>
                <div className="relative z-10">
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2 flex items-center gap-3">
                        <Landmark className="text-indigo-500" />
                        Modelo Mundell-Fleming (IS-LM-BP)
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 max-w-2xl">
                        Simula la efectividad de la política fiscal y monetaria en una economía abierta. ¿Qué pasa con el PIB y la tasa de interés bajo distintos regímenes cambiarios?
                    </p>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Controles */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-lg">
                        <h3 className="font-bold text-slate-900 dark:text-white mb-6 uppercase text-xs tracking-widest">Configuración Institucional</h3>

                        <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl mb-8">
                            <button
                                onClick={() => setRegime("flexible")}
                                className={`flex-1 py-3 rounded-xl text-xs font-black transition-all ${regime === "flexible" ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-sm' : 'text-slate-500'}`}
                            >
                                T.C. Flexible
                            </button>
                            <button
                                onClick={() => setRegime("fixed")}
                                className={`flex-1 py-3 rounded-xl text-xs font-black transition-all ${regime === "fixed" ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-sm' : 'text-slate-500'}`}
                            >
                                T.C. Fijo
                            </button>
                        </div>

                        <div className="space-y-8">
                            {/* Política Fiscal */}
                            <div className="space-y-4">
                                <div className="flex justify-between items-center text-xs font-bold text-slate-500 uppercase">
                                    <span className="flex items-center gap-2 italic">
                                        <Zap className="w-3 h-3 text-amber-500" /> Política Fiscal (G)
                                    </span>
                                    <span className={`px-2 py-0.5 rounded ${fiscalExpansion > 0 ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500'}`}>
                                        {fiscalExpansion > 0 ? `+${fiscalExpansion}` : fiscalExpansion}%
                                    </span>
                                </div>
                                <input
                                    type="range" min="-5" max="5" step="0.5" value={fiscalExpansion}
                                    onChange={(e) => setFiscalExpansion(parseFloat(e.target.value))}
                                    className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
                                />
                            </div>

                            {/* Política Monetaria */}
                            <div className="space-y-4">
                                <div className="flex justify-between items-center text-xs font-bold text-slate-500 uppercase">
                                    <span className="flex items-center gap-2 italic">
                                        <Landmark className="w-3 h-3 text-blue-500" /> Política Monetaria (M)
                                    </span>
                                    <span className={`px-2 py-0.5 rounded ${monetaryExpansion > 0 ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-500'}`}>
                                        {monetaryExpansion > 0 ? `+${monetaryExpansion}` : monetaryExpansion}%
                                    </span>
                                </div>
                                <input
                                    type="range" min="-5" max="5" step="0.5" value={monetaryExpansion}
                                    onChange={(e) => setMonetaryExpansion(parseFloat(e.target.value))}
                                    className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Explicación Dinámica */}
                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-lg">
                        <h4 className="font-bold text-xs text-slate-500 uppercase tracking-widest mb-4">Resultado de la Política</h4>
                        <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl border border-indigo-100 dark:border-indigo-800">
                            {regime === "flexible" ? (
                                <p className="text-xs text-indigo-700 dark:text-indigo-300 leading-relaxed">
                                    En T.C. Flexible, la **Política Monetaria** es altamente efectiva. La expansión {monetaryExpansion > 0 ? 'baja' : 'sube'} la tasa, provocando una {monetaryExpansion > 0 ? 'depreciación' : 'apreciación'} del peso que estimula las Exportaciones Netas.
                                </p>
                            ) : (
                                <p className="text-xs text-indigo-700 dark:text-indigo-300 leading-relaxed">
                                    En T.C. Fijo, la **Política Fiscal** es la más efectiva. Cualquier intento de política monetaria es neutralizado por la intervención obligatoria del Banco Central en el mercado cambiario.
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Grafica IS-LM-BP */}
                <div className="lg:col-span-2">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-lg h-full min-h-[500px]">
                        <div className="flex items-center justify-between mb-10">
                            <div>
                                <h3 className="font-black text-slate-900 dark:text-white text-xl">Equilibrio IS-LM-BP</h3>
                                <p className="text-xs text-slate-500 font-medium tracking-tight">Efectos de Política en Economía Abierta</p>
                            </div>
                            <div className="flex gap-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-1 bg-amber-500" />
                                    <span className="text-[10px] font-bold text-slate-400">IS</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-1 bg-blue-500" />
                                    <span className="text-[10px] font-bold text-slate-400">LM</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-1 bg-indigo-500 stroke-dasharray" />
                                    <span className="text-[10px] font-bold text-slate-400">BP</span>
                                </div>
                            </div>
                        </div>

                        <div className="h-[400px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis
                                        dataKey="y"
                                        type="number"
                                        domain={[0, 10]}
                                        label={{ value: "PIB (Y)", position: "insideBottomRight", offset: -5, fontSize: 10, fontWeight: 700 }}
                                        tick={{ fontSize: 10 }}
                                    />
                                    <YAxis
                                        label={{ value: "Tasa Interés (r)", angle: -90, position: "insideLeft", fontSize: 10, fontWeight: 700 }}
                                        tick={{ fontSize: 10 }}
                                    />

                                    {/* Curva IS */}
                                    <Line type="basis" dataKey="is" stroke="#f59e0b" strokeWidth={3} dot={false} animationDuration={300} />
                                    {/* Curva LM */}
                                    <Line type="basis" dataKey="lm" stroke="#3b82f6" strokeWidth={3} dot={false} animationDuration={300} />
                                    {/* Curva BP (Tasa Internacional) */}
                                    <ReferenceLine y={worldInterestRate} stroke="#6366f1" strokeWidth={2} strokeDasharray="5 5">
                                        <Label value="r*" position="insideTopRight" fill="#6366f1" fontSize={10} fontWeight="black" />
                                    </ReferenceLine>

                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                                        formatter={(value: any, name: string) => [value, name.toUpperCase()]}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="mt-8 flex flex-col md:flex-row gap-8 items-center justify-between border-t border-slate-50 dark:border-slate-800 pt-8">
                            <div className="flex gap-12">
                                <div>
                                    <p className="text-[10px] uppercase font-black text-slate-400 mb-1">Presión Cambiaria</p>
                                    <p className={`text-xl font-bold ${monetaryExpansion > fiscalExpansion ? 'text-rose-500' : 'text-emerald-500'}`}>
                                        {monetaryExpansion > fiscalExpansion ? 'Depreciación' : fiscalExpansion > monetaryExpansion ? 'Apreciación' : 'Neutral'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase font-black text-slate-400 mb-1">Impacto en PIB</p>
                                    <p className="text-xl font-bold text-slate-900 dark:text-white">
                                        {regime === "flexible" && monetaryExpansion > 0 ? 'Fuerte' : regime === "fixed" && fiscalExpansion > 0 ? 'Máximo' : 'Moderado'}
                                    </p>
                                </div>
                            </div>
                            <button className="px-8 py-3 bg-indigo-600 text-white font-black rounded-2xl shadow-lg shadow-indigo-600/20 hover:scale-105 transition-all text-xs">
                                Ver Derivación Matemática
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
