"use client";

import { useState, useMemo } from "react";
import { TrendingUp, BarChart3, Package } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";

export default function MiniSimulator() {
    const [demandShock, setDemandShock] = useState(0);
    const [supplyShock, setSupplyShock] = useState(0);

    const data = useMemo(() => {
        const results = [];
        for (let P = 0; P <= 80; P += 5) {
            let Qd = 1000 - 10 * P + demandShock;
            let Qs = 200 + 15 * P + supplyShock;
            results.push({
                precio: P,
                demanda: Math.max(0, Qd),
                oferta: Math.max(0, Qs)
            });
        }
        return results;
    }, [demandShock, supplyShock]);

    // Equilibrio: 1000 - 10P + DS = 200 + 15P + SS => 25P = 800 + DS - SS
    const Pe = (800 + demandShock - supplyShock) / 25;
    const Qe = 200 + 15 * Pe + supplyShock;

    const displayPe = Math.max(0, Pe);
    const displayQe = Math.max(0, Qe);

    return (
        <div className="bg-slate-900/60 backdrop-blur-xl border border-blue-500/20 rounded-3xl p-6 shadow-2xl text-white">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-500 rounded-lg">
                    <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <div>
                    <h3 className="font-bold text-lg">Mercados (Micro)</h3>
                    <p className="text-xs text-slate-400">Modelo de Oferta y Demanda</p>
                </div>
            </div>

            <div className="grid gap-6 mb-8">
                <div className="space-y-2">
                    <div className="flex justify-between text-xs font-medium">
                        <span className="text-slate-400 uppercase">Preferencia (Demanda)</span>
                        <span className="text-blue-400 font-bold">{demandShock > 0 ? "+" : ""}{demandShock}</span>
                    </div>
                    <input
                        type="range"
                        min="-400"
                        max="400"
                        step="50"
                        value={demandShock}
                        onChange={(e) => setDemandShock(Number(e.target.value))}
                        className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between text-xs font-medium">
                        <span className="text-slate-400 uppercase">Tecnología (Oferta)</span>
                        <span className="text-emerald-400 font-bold">{supplyShock > 0 ? "+" : ""}{supplyShock}</span>
                    </div>
                    <input
                        type="range"
                        min="-400"
                        max="400"
                        step="50"
                        value={supplyShock}
                        onChange={(e) => setSupplyShock(Number(e.target.value))}
                        className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                    />
                </div>
            </div>

            <div className="h-40 mb-6 -mx-2">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                        <XAxis dataKey="precio" type="number" domain={[0, 80]} hide />
                        <YAxis hide domain={[0, 1600]} />
                        <Tooltip
                            contentStyle={{ backgroundColor: "#0f172a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", fontSize: "12px" }}
                            itemStyle={{ color: "#fff" }}
                            formatter={(value: number, name: string) => [
                                Math.round(value),
                                name === 'demanda' ? 'Cantidad Demandada' : 'Cantidad Ofertada'
                            ]}
                            labelFormatter={(label) => `Precio: $${label}`}
                        />
                        <ReferenceLine x={displayPe} stroke="#94a3b8" strokeDasharray="3 3" opacity={0.5} />
                        <ReferenceLine y={displayQe} stroke="#94a3b8" strokeDasharray="3 3" opacity={0.5} />
                        <Line
                            type="monotone"
                            dataKey="demanda"
                            stroke="#3b82f6"
                            strokeWidth={3}
                            dot={false}
                            animationDuration={500}
                        />
                        <Line
                            type="monotone"
                            dataKey="oferta"
                            stroke="#10b981"
                            strokeWidth={3}
                            dot={false}
                            animationDuration={500}
                        />
                    </LineChart>
                </ResponsiveContainer>
                <div className="flex justify-between text-[10px] text-slate-500 font-medium px-4 mt-1">
                    <span>Precio Bajo</span>
                    <span>Precio Alto</span>
                </div>
            </div>

            <div className="flex gap-4 p-4 bg-slate-800/50 rounded-2xl border border-slate-700">
                <div className="flex-1">
                    <p className="text-[10px] uppercase font-bold text-slate-400 mb-1 flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" /> P* de Equilibrio
                    </p>
                    <p className="text-xl font-black text-white">${displayPe.toFixed(2)}</p>
                </div>
                <div className="flex-1 text-right">
                    <p className="text-[10px] uppercase font-bold text-slate-400 mb-1 flex items-center justify-end gap-1">
                        <Package className="w-3 h-3" /> Q* Cantidad
                    </p>
                    <p className="text-xl font-black text-white">{Math.round(displayQe)} unds</p>
                </div>
            </div>
        </div>
    );
}
