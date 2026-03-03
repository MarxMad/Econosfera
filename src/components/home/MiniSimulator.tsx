"use client";

import { useState, useMemo } from "react";
import { TrendingUp, BarChart3, Package } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";

// Demanda: P = a - b·Q  =>  Qd = (a - P) / b
// Oferta:  P = c + d·Q  =>  Qs = (P - c) / d
// Equilibrio: Q* = (a - c) / (b + d), P* = a - b·Q*

const DEMANDA_A_MIN = 40;
const DEMANDA_A_MAX = 120;
const DEMANDA_B_MIN = 0.5;
const DEMANDA_B_MAX = 4;
const OFERTA_C_MIN = 0;
const OFERTA_C_MAX = 50;
const OFERTA_D_MIN = 0.5;
const OFERTA_D_MAX = 4;

export default function MiniSimulator() {
    const [a, setA] = useState(100);
    const [b, setB] = useState(2);
    const [c, setC] = useState(10);
    const [d, setD] = useState(1.5);

    const bSafe = Math.max(0.01, b);
    const dSafe = Math.max(0.01, d);

    const equilibrio = useMemo(() => {
        if (a <= c) return { P: 0, Q: 0 };
        const Q = (a - c) / (bSafe + dSafe);
        const P = a - bSafe * Q;
        if (Q <= 0 || P <= 0) return { P: 0, Q: 0 };
        return { P, Q };
    }, [a, bSafe, c, dSafe]);

    const data = useMemo(() => {
        const Pmax = Math.min(a + 5, 120);
        const step = Pmax / 40;
        const points: { precio: number; demanda: number; oferta: number }[] = [];
        for (let P = 0; P <= Pmax; P += step) {
            const Qd = (a - P) / bSafe;
            const Qs = (P - c) / dSafe;
            points.push({
                precio: Math.round(P * 100) / 100,
                demanda: Math.max(0, Math.round(Qd * 100) / 100),
                oferta: Math.max(0, Math.round(Qs * 100) / 100),
            });
        }
        return points;
    }, [a, bSafe, c, dSafe]);

    const domainP = useMemo(() => {
        const maxP = Math.max(80, equilibrio.P * 1.4, a * 1.1);
        return [0, Math.ceil(maxP / 10) * 10] as [number, number];
    }, [equilibrio.P, a]);

    const domainQ = useMemo(() => {
        const maxQ = Math.max(80, equilibrio.Q * 1.5, (a / bSafe) * 1.2);
        return [0, Math.ceil(maxQ / 20) * 20] as [number, number];
    }, [equilibrio.Q, a, bSafe]);

    return (
        <div className="bg-slate-900/60 backdrop-blur-xl border border-blue-500/20 rounded-3xl p-6 shadow-2xl text-white">
            <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-500 rounded-lg">
                    <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <div>
                    <h3 className="font-bold text-lg">Oferta y Demanda</h3>
                    <p className="text-xs text-slate-400">Fórmulas: Demanda P = a − b·Q · Oferta P = c + d·Q</p>
                </div>
            </div>

            {/* Variables de la fórmula */}
            <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="space-y-1.5">
                    <p className="text-[10px] uppercase font-bold text-blue-400 tracking-wider">Demanda</p>
                    <div className="space-y-1">
                        <div className="flex justify-between text-[10px] text-slate-400">
                            <span>Ordenada al origen (a)</span>
                            <span className="font-mono text-blue-300">{a}</span>
                        </div>
                        <input
                            type="range"
                            min={DEMANDA_A_MIN}
                            max={DEMANDA_A_MAX}
                            step={5}
                            value={a}
                            onChange={(e) => setA(Number(e.target.value))}
                            className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                        />
                        <div className="flex justify-between text-[10px] text-slate-400">
                            <span>Pendiente (b)</span>
                            <span className="font-mono text-blue-300">{b}</span>
                        </div>
                        <input
                            type="range"
                            min={DEMANDA_B_MIN}
                            max={DEMANDA_B_MAX}
                            step={0.1}
                            value={b}
                            onChange={(e) => setB(Number(e.target.value))}
                            className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                        />
                    </div>
                </div>
                <div className="space-y-1.5">
                    <p className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">Oferta</p>
                    <div className="space-y-1">
                        <div className="flex justify-between text-[10px] text-slate-400">
                            <span>Ordenada al origen (c)</span>
                            <span className="font-mono text-emerald-300">{c}</span>
                        </div>
                        <input
                            type="range"
                            min={OFERTA_C_MIN}
                            max={OFERTA_C_MAX}
                            step={2}
                            value={c}
                            onChange={(e) => setC(Number(e.target.value))}
                            className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                        />
                        <div className="flex justify-between text-[10px] text-slate-400">
                            <span>Pendiente (d)</span>
                            <span className="font-mono text-emerald-300">{d}</span>
                        </div>
                        <input
                            type="range"
                            min={OFERTA_D_MIN}
                            max={OFERTA_D_MAX}
                            step={0.1}
                            value={d}
                            onChange={(e) => setD(Number(e.target.value))}
                            className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                        />
                    </div>
                </div>
            </div>

            {/* Gráfico P (eje X) vs Q (eje Y) */}
            <div className="h-44 mb-4 -mx-2">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                        <XAxis
                            dataKey="precio"
                            type="number"
                            domain={domainP}
                            tick={{ fontSize: 10, fill: "#94a3b8" }}
                            tickFormatter={(v) => `$${v}`}
                        />
                        <YAxis
                            domain={domainQ}
                            tick={{ fontSize: 10, fill: "#94a3b8" }}
                            tickFormatter={(v) => `${v}`}
                            label={{ value: "Cantidad", angle: -90, position: "insideLeft", style: { fontSize: 10, fill: "#94a3b8" } }}
                        />
                        <Tooltip
                            contentStyle={{ backgroundColor: "#0f172a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", fontSize: "11px" }}
                            itemStyle={{ color: "#fff" }}
                            formatter={(value: number, name: string) => [
                                typeof value === "number" ? value.toFixed(1) : value,
                                name === "demanda" ? "Demanda (Qd)" : "Oferta (Qs)",
                            ]}
                            labelFormatter={(label) => `Precio: $${label}`}
                        />
                        {equilibrio.P > 0 && <ReferenceLine x={equilibrio.P} stroke="#f59e0b" strokeDasharray="4 2" strokeWidth={1.5} />}
                        {equilibrio.Q > 0 && <ReferenceLine y={equilibrio.Q} stroke="#f59e0b" strokeDasharray="4 2" strokeWidth={1.5} />}
                        <Line type="monotone" dataKey="demanda" stroke="#3b82f6" strokeWidth={2.5} dot={false} animationDuration={400} name="Demanda" />
                        <Line type="monotone" dataKey="oferta" stroke="#10b981" strokeWidth={2.5} dot={false} animationDuration={400} name="Oferta" />
                    </LineChart>
                </ResponsiveContainer>
                <div className="flex justify-between text-[9px] text-slate-500 font-medium px-1 mt-0.5">
                    <span>Precio ($)</span>
                    <span>Cantidad (Q)</span>
                </div>
            </div>

            {/* Precio y cantidad de equilibrio */}
            <div className="flex gap-4 p-4 bg-slate-800/50 rounded-2xl border border-slate-700">
                <div className="flex-1">
                    <p className="text-[10px] uppercase font-bold text-slate-400 mb-1 flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" /> Precio equilibrio P*
                    </p>
                    <p className="text-xl font-black text-amber-400">${equilibrio.P.toFixed(2)}</p>
                </div>
                <div className="flex-1 text-right">
                    <p className="text-[10px] uppercase font-bold text-slate-400 mb-1 flex items-center justify-end gap-1">
                        <Package className="w-3 h-3" /> Cantidad equilibrio Q*
                    </p>
                    <p className="text-xl font-black text-emerald-400">{equilibrio.Q.toFixed(1)} unds</p>
                </div>
            </div>

            {/* Fórmulas actuales */}
            <div className="mt-3 text-[10px] text-slate-500 font-mono space-y-0.5">
                <p>Demanda: P = {a} − {b}·Q</p>
                <p>Oferta: P = {c} + {d}·Q</p>
            </div>
        </div>
    );
}
