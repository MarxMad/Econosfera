"use client";

import { useState, useMemo, useEffect } from "react";
import { TrendingUp, Info, HelpCircle, ShoppingCart, Ban, Calculator } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, ReferenceLine, Label } from "recharts";

function roundToStep(val: number, step: number): number {
    return Math.round(val / step) * step;
}

function Slider({
    label,
    value,
    min,
    max,
    step,
    onChange,
    suffix = "",
}: {
    label: string;
    value: number;
    min: number;
    max: number;
    step: number;
    onChange: (n: number) => void;
    suffix?: string;
}) {
    const [inputStr, setInputStr] = useState(String(value));
    const [editing, setEditing] = useState(false);

    useEffect(() => {
        if (!editing) setInputStr(String(value));
    }, [value, editing]);

    const commitInput = () => {
        const num = parseFloat(inputStr.replace(",", "."));
        if (!Number.isNaN(num)) {
            const rounded = roundToStep(num, step);
            onChange(rounded);
            setInputStr(String(rounded));
        } else {
            setInputStr(String(value));
        }
        setEditing(false);
    };

    return (
        <div className="space-y-2">
            <div className="flex justify-between items-center gap-2 text-xs font-bold text-slate-500 uppercase">
                <span>{label}</span>
                <div className="flex items-center gap-1">
                    <input
                        type="text"
                        inputMode="decimal"
                        value={inputStr}
                        onChange={(e) => {
                            setEditing(true);
                            setInputStr(e.target.value);
                        }}
                        onFocus={() => setEditing(true)}
                        onBlur={commitInput}
                        onKeyDown={(e) => e.key === "Enter" && commitInput()}
                        className="min-w-[5rem] w-20 px-2 py-1 text-right text-xs font-mono font-bold rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {suffix && <span className="text-slate-400">{suffix}</span>}
                </div>
            </div>
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={(e) => onChange(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
        </div>
    );
}

export default function SimuladorEstructurasMercado() {
    // Parámetros de Demanda
    const [a, setA] = useState(100); // Intercepto
    const [b, setB] = useState(1);   // Pendiente
    // Costo Marginal
    const [mc, setMc] = useState(20);

    const stats = useMemo(() => {
        // Competencia Perfecta: P = MC => a - bQ = mc => Q = (a-mc)/b
        const qC = (a - mc) / b;
        const pC = mc;

        // Monopolio: MR = MC => a - 2bQ = mc => Q = (a-mc)/(2b)
        const qM = (a - mc) / (2 * b);
        const pM = a - b * qM;
        const profitM = (pM - mc) * qM;

        // Pérdida Social (Deadweight Loss) = 0.5 * (pM - mc) * (qC - qM)
        const dwl = 0.5 * (pM - mc) * (qC - qM);

        return { qC, pC, qM, pM, profitM, dwl };
    }, [a, b, mc]);

    const chartData = useMemo(() => {
        const data = [];
        const maxQ = stats.qC * 1.5;
        for (let q = 0; q <= maxQ; q += maxQ / 30) {
            const demand = a - b * q;
            const mr = a - 2 * b * q;
            data.push({
                q: parseFloat(q.toFixed(1)),
                demand: Math.max(0, parseFloat(demand.toFixed(2))),
                mr: Math.max(0, parseFloat(mr.toFixed(2))),
                mc: mc,
            });
        }
        return data;
    }, [a, b, mc, stats]);

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden relative">
                <div className="absolute top-0 right-0 p-8 opacity-10 text-indigo-500">
                    <ShoppingCart className="w-24 h-24" />
                </div>
                <div className="relative z-10">
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2 flex items-center gap-3">
                        <Calculator className="text-indigo-500" />
                        Monopolio vs Competencia Perfecta
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 max-w-2xl text-sm">
                        ¿Por qué los monopolios son ineficientes? Visualiza la transferencia de excedente del consumidor y el impacto de la **Pérdida de Bienestar Social**.
                    </p>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Controles */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-lg">
                        <h3 className="font-bold text-slate-900 dark:text-white mb-6 uppercase text-[10px] tracking-widest text-slate-500">Variables del Mercado</h3>

                        <div className="space-y-6">
                            <Slider label="Demanda Máxima (a)" value={a} min={50} max={500} step={1} onChange={setA} />
                            <Slider label="Sensibilidad (b)" value={b} min={0.1} max={10} step={0.1} onChange={setB} />
                            <hr className="border-slate-100 dark:border-slate-800" />
                            <Slider label="Costo Marginal (MC)" value={mc} min={0} max={200} step={1} onChange={setMc} suffix="$" />
                        </div>
                    </div>

                    {/* Comparativa Social */}
                    <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-xl shadow-rose-500/10 border border-slate-800">
                        <div className="flex items-center gap-2 mb-4 text-xs font-black uppercase text-rose-400">
                            <Ban className="w-4 h-4" /> Pérdida de Eficiencia
                        </div>
                        <p className="text-5xl font-black mb-1 tracking-tighter">${stats.dwl.toFixed(0)}</p>
                        <p className="text-xs text-slate-400 leading-relaxed font-medium">
                            Esta es la riqueza que la sociedad deja de percibir porque el monopolio restringe la cantidad para subir los precios.
                        </p>
                        <div className="mt-8 grid grid-cols-2 gap-4 border-t border-slate-800 pt-6">
                            <div className="bg-slate-800/50 p-3 rounded-2xl border border-slate-700">
                                <p className="text-[10px] text-slate-500 uppercase font-black mb-1">Monopolio</p>
                                <p className="text-sm font-bold text-blue-400">Q={stats.qM.toFixed(1)}</p>
                                <p className="text-sm font-bold text-white">P=${stats.pM.toFixed(0)}</p>
                            </div>
                            <div className="bg-slate-800/50 p-3 rounded-2xl border border-slate-700">
                                <p className="text-[10px] text-slate-500 uppercase font-black mb-1">Competencia</p>
                                <p className="text-sm font-bold text-emerald-400">Q={stats.qC.toFixed(1)}</p>
                                <p className="text-sm font-bold text-white">P=${stats.pC.toFixed(0)}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Grafica de Micro */}
                <div className="lg:col-span-2">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-lg h-full min-h-[500px] flex flex-col">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="font-black text-slate-900 dark:text-white text-xl uppercase tracking-tighter">Diagrama de Equilibrio</h3>
                        </div>

                        <div className="flex-1 min-h-[350px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="q" tick={{ fontSize: 10 }} label={{ value: 'Cantidad (Q)', position: 'insideBottomRight', offset: -10, fontSize: 10 }} />
                                    <YAxis tick={{ fontSize: 10 }} label={{ value: 'Precio (P)', angle: -90, position: 'insideLeft', fontSize: 10 }} />
                                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '10px' }} />

                                    {/* Demanda */}
                                    <Line type="monotone" dataKey="demand" stroke="#3b82f6" strokeWidth={3} dot={false} name="Demanda" />
                                    {/* Ingreso Marginal */}
                                    <Line type="monotone" dataKey="mr" stroke="#94a3b8" strokeWidth={2} strokeDasharray="5 5" dot={false} name="Ingreso Marginal (MR)" />
                                    {/* Costo Marginal */}
                                    <Line type="monotone" dataKey="mc" stroke="#f43f5e" strokeWidth={3} dot={false} name="Costo Marginal (MC)" />

                                    {/* Puntos de Equilibrio */}
                                    <ReferenceLine x={stats.qM} stroke="#94a3b8" strokeDasharray="3 3">
                                        <Label value="Q_M" position="bottom" fill="#94a3b8" fontSize={10} />
                                    </ReferenceLine>
                                    <ReferenceLine y={stats.pM} stroke="#3b82f6" strokeDasharray="3 3">
                                        <Label value="P_M" position="right" fill="#3b82f6" fontSize={10} />
                                    </ReferenceLine>
                                    <ReferenceLine x={stats.qC} stroke="#10b981" strokeDasharray="3 3">
                                        <Label value="Q_Comp" position="bottom" fill="#10b981" fontSize={10} />
                                    </ReferenceLine>
                                </LineChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="mt-8 flex gap-8 items-center justify-center p-6 bg-emerald-50 dark:bg-emerald-900/10 rounded-3xl border border-emerald-100 dark:border-emerald-800 shadow-inner">
                            <div className="text-center">
                                <p className="text-[10px] text-emerald-600 font-black uppercase">Beneficio Monopólico</p>
                                <p className="text-3xl font-black text-emerald-700 dark:text-emerald-400">${stats.profitM.toFixed(0)}</p>
                            </div>
                            <div className="w-px h-12 bg-emerald-200" />
                            <div className="text-xs text-emerald-800 dark:text-emerald-300 max-w-sm leading-relaxed font-medium">
                                <span className="font-black text-emerald-600">Ineficiencia Allocativa:</span> En competencia perfecta, el mercado produce **{stats.qC.toFixed(1)}** unidades, logrando la máxima utilidad social posible. El monopolio "roba" excedente al reducir cantidad.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
