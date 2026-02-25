"use client";

import { useState, useMemo } from "react";
import { ShieldCheck } from "lucide-react";

export default function MiniSimulatorSeguros() {
    const [edad, setEdad] = useState(30);
    const [sumaAsegurada, setSumaAsegurada] = useState(1000000);
    const [riesgo, setRiesgo] = useState(1.5); // Multiplicador de riesgo base

    const primaAnual = useMemo(() => {
        // Cálculo simulado de prima de seguro de vida básico
        // Prima base = (Suma Asegurada * Factor Edad) * Riesgo
        const factorEdad = (edad / 10000) * (edad > 40 ? 1.5 : 1);
        return Math.round(sumaAsegurada * factorEdad * riesgo);
    }, [edad, sumaAsegurada, riesgo]);

    return (
        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-6 shadow-2xl text-white mt-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-emerald-500 rounded-lg">
                    <ShieldCheck className="w-5 h-5 text-slate-900" />
                </div>
                <div>
                    <h3 className="font-bold text-lg">Actuaría: Cálculo de Prima</h3>
                    <p className="text-xs text-slate-400">¿Cuánto cuesta asegurar el futuro?</p>
                </div>
            </div>

            <div className="grid gap-6 mb-8">
                <div className="space-y-2">
                    <div className="flex justify-between text-xs font-medium">
                        <span className="text-slate-400 uppercase">Edad del Asegurado</span>
                        <span className="text-emerald-400 font-bold">{edad} años</span>
                    </div>
                    <input
                        type="range"
                        min="18"
                        max="75"
                        step="1"
                        value={edad}
                        onChange={(e) => setEdad(Number(e.target.value))}
                        className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                    />
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between text-xs font-medium">
                        <span className="text-slate-400 uppercase">Suma Asegurada</span>
                        <span className="text-emerald-400 font-bold">${sumaAsegurada.toLocaleString()}</span>
                    </div>
                    <input
                        type="range"
                        min="100000"
                        max="5000000"
                        step="100000"
                        value={sumaAsegurada}
                        onChange={(e) => setSumaAsegurada(Number(e.target.value))}
                        className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                    />
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between text-xs font-medium">
                        <span className="text-slate-400 uppercase">Factor Riesgo (Ocupación/Salud)</span>
                        <span className="text-emerald-400 font-bold">{riesgo}x</span>
                    </div>
                    <input
                        type="range"
                        min="1"
                        max="3"
                        step="0.1"
                        value={riesgo}
                        onChange={(e) => setRiesgo(Number(e.target.value))}
                        className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                    />
                </div>
            </div>

            <div className="p-4 bg-slate-800/50 rounded-2xl border border-slate-700">
                <div className="flex justify-between items-end">
                    <div>
                        <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Prima Anual Estimada</p>
                        <p className="text-2xl font-black text-white">${primaAnual.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] uppercase font-bold text-emerald-400 mb-1">Costo Mensual</p>
                        <p className="text-sm font-bold text-emerald-400">${Math.round(primaAnual / 12).toLocaleString()}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
