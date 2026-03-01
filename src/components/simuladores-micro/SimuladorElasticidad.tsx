"use client";

import { useState, useMemo, useEffect } from "react";
import { TrendingUp, Info, HelpCircle, Tags, Zap, ArrowRight, MousePointer2 } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Label } from "recharts";

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
            <div className="flex justify-between items-center gap-2 text-[10px] font-black text-slate-500 uppercase">
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
                        className="min-w-[5rem] w-20 px-2 py-1 text-right font-mono font-bold rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
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
                className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-orange-600"
            />
        </div>
    );
}

export default function SimuladorElasticidad() {
    // Curva de Demanda Q = A * P^(-E)
    const [A, setA] = useState(1000); // Escala
    const [elasticity, setElasticity] = useState(1.0); // E (valor absoluto)
    const [currentPrice, setCurrentPrice] = useState(50);

    const data = useMemo(() => {
        const chartData = [];
        for (let p = 10; p <= 300; p += 5) {
            const q = A * Math.pow(p, -elasticity);
            const revenue = p * q;
            chartData.push({
                p: p,
                q: parseFloat(q.toFixed(1)),
                revenue: Math.round(revenue),
            });
        }
        return chartData;
    }, [A, elasticity]);

    const currentStats = useMemo(() => {
        const q = A * Math.pow(currentPrice, -elasticity);
        const revenue = currentPrice * q;
        return { q, revenue };
    }, [A, elasticity, currentPrice]);

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden relative">
                <div className="absolute top-0 right-0 p-8 opacity-10 text-orange-500">
                    <Tags className="w-24 h-24" />
                </div>
                <div className="relative z-10">
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2 flex items-center gap-3">
                        <MousePointer2 className="text-orange-500" />
                        Elasticidad Precio de la Demanda
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 max-w-2xl text-sm leading-relaxed">
                        Descubre cómo reaccionan las ventas ante cambios de precio. ¿Deberías subir el precio para ganar más, o el volumen de ventas caerá demasiado?
                    </p>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Controles */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-lg">
                        <h3 className="font-black text-slate-400 mb-8 uppercase text-[10px] tracking-widest">Ajustes Estratégicos</h3>

                        <div className="space-y-8">
                            <Slider label="Elasticidad (ε)" value={elasticity} min={0.1} max={5} step={0.1} onChange={setElasticity} />
                            <div className="flex justify-between text-[8px] text-slate-400 p-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 font-black uppercase">
                                <span>Necesidad (Baja ε)</span>
                                <span>Lujo (Alta ε)</span>
                            </div>
                            <Slider label="Precio de Venta" value={currentPrice} min={1} max={300} step={1} onChange={setCurrentPrice} suffix="$" />
                        </div>
                    </div>

                    <div className="bg-orange-600 rounded-3xl p-8 text-white shadow-xl shadow-orange-500/20 border border-orange-500 relative overflow-hidden">
                        <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
                        <h4 className="font-bold text-xs uppercase mb-4 tracking-widest opacity-80">Ingreso Total (P × Q)</h4>
                        <p className="text-5xl font-black mb-1 tracking-tighter">${currentStats.revenue.toLocaleString()}</p>
                        <p className="text-xs font-medium opacity-90 leading-relaxed mt-6 p-3 bg-black/10 rounded-2xl border border-white/10 italic">
                            {elasticity > 1 ?
                                "⚠️ Cuidado: Al ser ELÁSTICA, subir el precio REDUCIRÁ tus ingresos totales." :
                                elasticity < 1 ?
                                    "✅ Oportunidad: Al ser INELÁSTICA, subir el precio AUMENTARÁ tus ingresos totales." :
                                    "Optimizado: Estás en elasticidad unitaria."}
                        </p>
                    </div>
                </div>

                {/* Grafica Revenue vs Price */}
                <div className="lg:col-span-2">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-lg h-full min-h-[500px] flex flex-col">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="font-black text-slate-900 dark:text-white text-xl uppercase tracking-tighter">Impacto en el Ingreso</h3>
                        </div>

                        <div className="flex-1 min-h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={data}>
                                    <defs>
                                        <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#f97316" stopOpacity={0.2} />
                                            <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="p" label={{ value: 'Precio ($)', position: 'insideBottomRight', offset: -10, fontSize: 10 }} tick={{ fontSize: 10 }} />
                                    <YAxis label={{ value: 'Ingreso ($)', angle: -90, position: 'insideLeft', fontSize: 10 }} tick={{ fontSize: 10 }} />
                                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '10px' }} />
                                    <Area type="monotone" dataKey="revenue" stroke="#f97316" strokeWidth={4} fill="url(#colorRev)" animationDuration={1000} />
                                    <ReferenceLine x={currentPrice} stroke="#0ea5e9" strokeDasharray="3 3">
                                        <Label value="Precio Actual" position="top" fill="#0ea5e9" fontSize={10} fontWeight="black" />
                                    </ReferenceLine>
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="mt-8 grid grid-cols-2 gap-4">
                            <div className="p-5 bg-slate-50 dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700">
                                <p className="text-[10px] text-slate-400 font-black uppercase mb-1">Volumen de Venta</p>
                                <p className="text-2xl font-black text-slate-900 dark:text-white">{currentStats.q.toFixed(0)} <span className="text-xs font-normal text-slate-500">u.</span></p>
                            </div>
                            <div className="p-5 bg-slate-50 dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700">
                                <p className="text-[10px] text-slate-400 font-black uppercase mb-1">Estrategia Sugerida</p>
                                <p className={`text-xl font-black ${elasticity > 1 ? 'text-rose-500' : 'text-emerald-500'}`}>
                                    {elasticity > 1 ? 'Bajar Precios' : 'Subir Precios'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
