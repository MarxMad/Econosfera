"use client";

import { useState, useMemo } from "react";
import { TrendingUp, Wallet, ArrowRight } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function MiniSimulator() {
    const [monto, setMonto] = useState(1000);
    const [inflacion, setInflacion] = useState(5);
    const [anios, setAnios] = useState(10);

    const data = useMemo(() => {
        let currentMonto = monto;
        const results = [{ anio: 0, valor: monto }];
        for (let i = 1; i <= anios; i++) {
            currentMonto = currentMonto / (1 + inflacion / 100);
            results.push({ anio: i, valor: Math.round(currentMonto) });
        }
        return results;
    }, [monto, inflacion, anios]);

    const valorFinal = data[data.length - 1].valor;
    const perdida = monto - valorFinal;

    return (
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-2xl text-white">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-amber-400 rounded-lg">
                    <Wallet className="w-5 h-5 text-slate-900" />
                </div>
                <div>
                    <h3 className="font-bold text-lg">Poder de Compra</h3>
                    <p className="text-xs text-slate-400">¿Cuánto valdrá tu dinero mañana?</p>
                </div>
            </div>

            <div className="grid gap-6 mb-8">
                <div className="space-y-2">
                    <div className="flex justify-between text-xs font-medium">
                        <span className="text-slate-400 uppercase">Monto Inicial</span>
                        <span className="text-amber-400 font-bold">${monto.toLocaleString()}</span>
                    </div>
                    <input
                        type="range"
                        min="100"
                        max="10000"
                        step="100"
                        value={monto}
                        onChange={(e) => setMonto(Number(e.target.value))}
                        className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-amber-400"
                    />
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between text-xs font-medium">
                        <span className="text-slate-400 uppercase">Inflación Anual</span>
                        <span className="text-amber-400 font-bold">{inflacion}%</span>
                    </div>
                    <input
                        type="range"
                        min="1"
                        max="50"
                        step="1"
                        value={inflacion}
                        onChange={(e) => setInflacion(Number(e.target.value))}
                        className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-amber-400"
                    />
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between text-xs font-medium">
                        <span className="text-slate-400 uppercase">Horizonte (Años)</span>
                        <span className="text-amber-400 font-bold">{anios} años</span>
                    </div>
                    <input
                        type="range"
                        min="1"
                        max="30"
                        step="1"
                        value={anios}
                        onChange={(e) => setAnios(Number(e.target.value))}
                        className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-amber-400"
                    />
                </div>
            </div>

            <div className="h-40 mb-6 -mx-2">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                        <XAxis dataKey="anio" hide />
                        <YAxis hide domain={['dataMin - 100', 'dataMax']} />
                        <Tooltip
                            contentStyle={{ backgroundColor: "#1e293b", border: "none", borderRadius: "12px", fontSize: "12px" }}
                            itemStyle={{ color: "#fbbf24" }}
                            formatter={(value: number) => [`$${value}`, "Valor Real"]}
                            labelFormatter={(label) => `Año ${label}`}
                        />
                        <Line
                            type="monotone"
                            dataKey="valor"
                            stroke="#fbbf24"
                            strokeWidth={3}
                            dot={false}
                            animationDuration={500}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                <div className="flex justify-between items-end">
                    <div>
                        <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Valor Final Real</p>
                        <p className="text-2xl font-black text-white">${valorFinal.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] uppercase font-bold text-rose-400 mb-1">Pérdida de Valor</p>
                        <p className="text-sm font-bold text-rose-400">-${perdida.toLocaleString()}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
