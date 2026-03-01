"use client";

import { useState, useMemo } from "react";
import { TrendingUp, Info, HelpCircle, Save, Layers, Zap, ArrowRight, Activity } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, AreaChart, Area, Label } from "recharts";
import { useSession } from "next-auth/react";
import { registrarExportacion } from "@/lib/actions/exportActions";
import { exportarFinanzasAPdf } from "@/lib/exportarFinanzasPdf";
import { saveScenario } from "@/lib/actions/scenarioActions";
import PricingModal from "../PricingModal";

// Función de aproximación para la CDF de la distribución normal estándar
function cdfNormal(x: number) {
    const b1 = 0.319381530;
    const b2 = -0.356563782;
    const b3 = 1.781477937;
    const b4 = -1.821255978;
    const b5 = 1.330274429;
    const p = 0.2316419;
    const c = 0.39894228;

    if (x >= 0) {
        const t = 1.0 / (1.0 + p * x);
        return (1.0 - c * Math.exp(-x * x / 2.0) * t * (t * (t * (t * (t * b5 + b4) + b3) + b2) + b1));
    } else {
        const t = 1.0 / (1.0 - p * x);
        return (c * Math.exp(-x * x / 2.0) * t * (t * (t * (t * (t * b5 + b4) + b3) + b2) + b1));
    }
}

export default function SimuladorBlackScholes() {
    const { data: session } = useSession();
    const isPro = session?.user?.plan === 'PRO' || session?.user?.plan === 'RESEARCHER';
    const [showPricing, setShowPricing] = useState(false);
    // Parámetros
    const [S, setS] = useState(100); // Precio acción
    const [K, setK] = useState(100); // Strike
    const [T, setT] = useState(1);   // Tiempo (años)
    const [r, setR] = useState(0.05); // Tasa libre riesgo
    const [sigma, setSigma] = useState(0.2); // Volatilidad

    // Cálculos Black-Scholes
    const results = useMemo(() => {
        const d1 = (Math.log(S / K) + (r + Math.pow(sigma, 2) / 2) * T) / (sigma * Math.sqrt(T));
        const d2 = d1 - sigma * Math.sqrt(T);

        const call = S * cdfNormal(d1) - K * Math.exp(-r * T) * cdfNormal(d2);
        const put = K * Math.exp(-r * T) * cdfNormal(-d2) - S * cdfNormal(-d1);

        // Griegas básicas
        const deltaCall = cdfNormal(d1);
        const deltaPut = deltaCall - 1;

        return { call, put, deltaCall, deltaPut, d1, d2 };
    }, [S, K, T, r, sigma]);

    const handleExport = async () => {
        if ((session?.user?.credits ?? 0) < 1) {
            setShowPricing(true);
            return;
        }
        try {
            await registrarExportacion("Finanzas BlackScholes", "PDF");
            let chartUrl: string | null = null;
            try {
                const { getGraficoAsDataUrl } = await import("@/lib/exportarGrafico");
                chartUrl = await getGraficoAsDataUrl("grafico-blackscholes");
            } catch (_) {}
            exportarFinanzasAPdf({
                tipo: 'BlackScholes',
                titulo: 'Valuación de Opciones Europeas (Black-Scholes)',
                variables: [
                    { label: 'Precio Acción (S)', valor: `$${S}` },
                    { label: 'Precio Ejercicio (K)', valor: `$${K}` },
                    { label: 'Tiempo Vencimiento (T)', valor: `${T} Años` },
                    { label: 'Tasa Libre Riesgo (r)', valor: `${(r * 100).toFixed(2)}%` },
                    { label: 'Volatilidad (σ)', valor: `${(sigma * 100).toFixed(2)}%` }
                ],
                resultados: [
                    { label: 'Prima Europea CALL', valor: `$${results.call.toFixed(2)}` },
                    { label: 'Prima Europea PUT', valor: `$${results.put.toFixed(2)}` },
                    { label: 'Delta Call', valor: results.deltaCall.toFixed(4) },
                    { label: 'Delta Put', valor: results.deltaPut.toFixed(4) }
                ],
                chart: chartUrl
            });
        } catch (error: any) {
            if (String(error?.message || error).includes("créditos")) setShowPricing(true);
            else alert(error?.message || "Error al exportar");
        }
    };

    const handleSave = async () => {
        try {
            const res = await saveScenario({
                type: "FINANZAS",
                subType: "BS",
                name: `Black-Scholes ${new Date().toLocaleDateString()}`,
                variables: { S, K, T, r, sigma },
                results: { call: results.call, put: results.put }
            });
            if (res.success) alert("Escenario guardado correctamente (1 crédito utilizado)");
            else alert(res.error);
        } catch (e: any) {
            alert("Error al guardar");
        }
    };

    // Datos para gráfica de Payoff vs Stock Price
    const chartData = useMemo(() => {
        const data = [];
        const minS = K * 0.5;
        const maxS = K * 1.5;
        for (let p = minS; p <= maxS; p += (maxS - minS) / 40) {
            // Valor intrínseco al vencimiento
            const payoffCall = Math.max(0, p - K);
            const payoffPut = Math.max(0, K - p);

            // Valor teórico hoy (Black-Scholes)
            const d1_p = (Math.log(p / K) + (r + Math.pow(sigma, 2) / 2) * T) / (sigma * Math.sqrt(T));
            const d2_p = d1_p - sigma * Math.sqrt(T);
            const priceCall = p * cdfNormal(d1_p) - K * Math.exp(-r * T) * cdfNormal(d2_p);

            data.push({
                S: parseFloat(p.toFixed(2)),
                payoffCall: parseFloat(payoffCall.toFixed(2)),
                priceCall: parseFloat(priceCall.toFixed(2)),
            });
        }
        return data;
    }, [K, T, r, sigma]);

    return (
        <>
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden relative">
                <div className="absolute top-0 right-0 p-8 opacity-10 text-purple-500">
                    <Layers className="w-24 h-24" />
                </div>
                <div className="relative z-10 flex items-center justify-between gap-4">
                    <div>
                        <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2 flex items-center gap-3">
                            <Activity className="text-purple-500" />
                            Valuación de Opciones (Black-Scholes)
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 max-w-2xl">
                            Calcula el valor justo de opciones europeas. Observa cómo el tiempo, la volatilidad y la tasa de interés afectan la prima y las "griegas".
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={handleExport}
                            disabled={!isPro}
                            className="flex items-center gap-2 px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-2xl hover:scale-105 transition-all shadow-xl disabled:opacity-50"
                        >
                            <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
                            Reporte PDF
                        </button>
                        {session && (
                            <button
                                onClick={handleSave}
                                className="flex items-center gap-2 px-4 py-2 bg-slate-800 dark:bg-slate-700 text-white font-bold rounded-2xl hover:scale-105 transition-all shadow-xl active:scale-95"
                            >
                                <Save className="w-4 h-4" />
                                Guardar
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Controles */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-lg">
                        <h3 className="font-bold text-slate-900 dark:text-white mb-6 uppercase text-xs tracking-tighter">Variables de Mercado</h3>

                        <div className="space-y-6">
                            {/* Spot Price */}
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs font-bold text-slate-500 uppercase">
                                    <span>Precio Acción (S)</span>
                                    <span className="text-slate-900 dark:text-white font-mono">${S}</span>
                                </div>
                                <input type="range" min="10" max="500" step="1" value={S} onChange={(e) => setS(parseInt(e.target.value))} className="w-full accent-slate-900" />
                            </div>

                            {/* Strike Price */}
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs font-bold text-slate-500 uppercase">
                                    <span>Precio Ejercicio (K)</span>
                                    <span className="text-slate-900 dark:text-white font-mono">${K}</span>
                                </div>
                                <input type="range" min="10" max="500" step="1" value={K} onChange={(e) => setK(parseInt(e.target.value))} className="w-full accent-slate-900" />
                            </div>

                            {/* Volatilidad */}
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs font-bold text-slate-500 uppercase">
                                    <span>Volatilidad (σ)</span>
                                    <span className="text-purple-600 bg-purple-50 dark:bg-purple-900/30 px-2 py-0.5 rounded">{(sigma * 100).toFixed(0)}%</span>
                                </div>
                                <input type="range" min="0.01" max="1.5" step="0.01" value={sigma} onChange={(e) => setSigma(parseFloat(e.target.value))} className="w-full accent-purple-600" />
                            </div>

                            {/* Tiempo */}
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs font-bold text-slate-500 uppercase">
                                    <span>Vencimiento (T)</span>
                                    <span className="text-blue-600">{T} {T === 1 ? 'Año' : 'Años'}</span>
                                </div>
                                <input type="range" min="0.1" max="10" step="0.1" value={T} onChange={(e) => setT(parseFloat(e.target.value))} className="w-full accent-blue-600" />
                            </div>

                            {/* Tasa Libre Riesgo */}
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs font-bold text-slate-500 uppercase">
                                    <span>Tasa r (%)</span>
                                    <span className="text-emerald-600">{(r * 100).toFixed(1)}%</span>
                                </div>
                                <input type="range" min="0" max="0.2" step="0.001" value={r} onChange={(e) => setR(parseFloat(e.target.value))} className="w-full accent-emerald-600" />
                            </div>
                        </div>
                    </div>

                    {/* Reporte de Griegas */}
                    <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-xl">
                        <h4 className="font-bold text-sm mb-4 border-b border-slate-700 pb-2">Sensibilidad (Griegas)</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-3 bg-slate-800 rounded-xl border border-slate-700">
                                <p className="text-[10px] uppercase text-slate-400 font-bold mb-1">Delta Call</p>
                                <p className="text-lg font-black text-emerald-400">{results.deltaCall.toFixed(3)}</p>
                            </div>
                            <div className="p-3 bg-slate-800 rounded-xl border border-slate-700">
                                <p className="text-[10px] uppercase text-slate-400 font-bold mb-1">Delta Put</p>
                                <p className="text-lg font-black text-rose-400">{results.deltaPut.toFixed(3)}</p>
                            </div>
                        </div>
                        <p className="text-[10px] text-slate-500 mt-4 leading-relaxed italic">
                            El Delta indica cuánto cambia el precio de la opción por cada $1 de movimiento en la acción subyacente.
                        </p>
                    </div>
                </div>

                {/* Resultados y Gráfica */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-lg text-center">
                            <p className="text-[10px] uppercase font-black text-slate-400 mb-1">Prima Europea CALL</p>
                            <p className="text-4xl font-black text-blue-600">${results.call.toFixed(2)}</p>
                        </div>
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-lg text-center">
                            <p className="text-[10px] uppercase font-black text-slate-400 mb-1">Prima Europea PUT</p>
                            <p className="text-4xl font-black text-rose-500">${results.put.toFixed(2)}</p>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-lg h-[400px]">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="font-bold text-slate-900 dark:text-white">Curva de Valor Teórico (Call)</h3>
                            <div className="flex gap-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-blue-500" />
                                    <span className="text-[10px] font-bold text-slate-400">Valor Hoy</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-slate-300" />
                                    <span className="text-[10px] font-bold text-slate-400">Payoff Vencimiento</span>
                                </div>
                            </div>
                        </div>
                        <div className="h-[300px] w-full">
                            <div id="grafico-blackscholes" className="h-full w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData}>
                                    <defs>
                                        <linearGradient id="colorCall" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="S" tick={{ fontSize: 10 }} />
                                    <YAxis tick={{ fontSize: 10 }} />
                                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '10px' }} />
                                    <Area type="monotone" dataKey="priceCall" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorCall)" />
                                    <Line type="stepAfter" dataKey="payoffCall" stroke="#94a3b8" strokeDasharray="4 4" dot={false} />
                                    <ReferenceLine x={K} stroke="#94a3b8" strokeDasharray="3 3">
                                        <Label value="K (Strike)" position="top" fill="#94a3b8" fontSize={10} />
                                    </ReferenceLine>
                                </AreaChart>
                            </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <PricingModal isOpen={showPricing} onClose={() => setShowPricing(false)} />
        </>
    );
}
