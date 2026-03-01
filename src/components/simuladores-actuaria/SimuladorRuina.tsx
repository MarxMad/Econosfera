"use client";

import { useState, useMemo, useEffect } from "react";
import { TrendingUp, Info, HelpCircle, ShieldAlert, Coins, RefreshCw, Zap, FileDown, Save } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Label } from "recharts";
import { useSession } from "next-auth/react";
import PricingModal from "../PricingModal";

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
                        className="w-20 px-2 py-1 text-right font-mono font-bold rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
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

export default function SimuladorRuina() {
    const [initialCapital, setInitialCapital] = useState(1000);
    const [premiumRate, setPremiumRate] = useState(150);
    const [lambda, setLambda] = useState(2);
    const [claimSize, setClaimSize] = useState(60);
    const [periods, setPeriods] = useState(20);
    const [seed, setSeed] = useState(0);
    const { data: session } = useSession();
    const [showPricing, setShowPricing] = useState(false);
    const [exportando, setExportando] = useState(false);
    const [guardando, setGuardando] = useState(false);

    // Simulación Monte Carlo
    const results = useMemo(() => {
        const numPaths = 15;
        const allPaths = [];
        let ruins = 0;

        for (let p = 0; p < numPaths; p++) {
            const path = [];
            let currentU = initialCapital;
            let isRuined = false;

            for (let t = 0; t <= periods; t++) {
                path.push({ t, u: Math.max(0, currentU) });

                if (currentU <= 0) {
                    isRuined = true;
                    // Llenar el resto con 0
                    for (let i = t + 1; i <= periods; i++) path.push({ t: i, u: 0 });
                    break;
                }

                // Generar siniestros (Poisson -> Uniform/Exp)
                // Simplificación: num claims = lambda + noise
                const numClaims = Math.max(0, Math.round(lambda + (Math.random() - 0.5) * 2));
                let totalS = 0;
                for (let i = 0; i < numClaims; i++) {
                    totalS += -claimSize * Math.log(Math.random()); // Exponential claim
                }

                currentU = currentU + premiumRate - totalS;
            }

            if (isRuined) ruins++;
            allPaths.push(path);
        }

        // Formatear para Recharts (unir paths)
        const chartData = [];
        for (let t = 0; t <= periods; t++) {
            const row: any = { t };
            allPaths.forEach((path, idx) => {
                row[`path${idx}`] = path[t]?.u || 0;
            });
            chartData.push(row);
        }

        return { chartData, ProbRuina: (ruins / numPaths) * 100, numPaths };
    }, [initialCapital, premiumRate, lambda, claimSize, periods, seed]);

    const handleExport = async () => {
        if ((session?.user?.credits ?? 0) < 1) { setShowPricing(true); return; }
        setExportando(true);
        try {
            await import("@/lib/actions/exportActions").then((m) => m.registrarExportacion("Actuaria Ruina", "PDF"));
            const { exportarActuariaAPdf } = await import("@/lib/exportarActuariaPdf");
            let chartUrl: string | null = null;
            try { chartUrl = await import("@/lib/exportarGrafico").then((m) => m.getGraficoAsDataUrl("grafico-ruina")); } catch (_) {}
            await exportarActuariaAPdf({
                tipo: "Ruina",
                titulo: "Modelo de Ruina del Asegurador",
                variables: [
                    { label: "Capital inicial (U₀)", valor: `$${initialCapital}` },
                    { label: "Carga de prima (c)", valor: `$${premiumRate}` },
                    { label: "Frecuencia (λ)", valor: String(lambda) },
                    { label: "Siniestro promedio", valor: `$${claimSize}` },
                    { label: "Periodos", valor: String(periods) },
                ],
                resultados: [
                    { label: "Prob. insolvencia", valor: `${results.ProbRuina.toFixed(0)}%` },
                ],
                chart: chartUrl,
            });
        } catch (e) {
            console.error(e);
            if (String(e).includes("créditos")) setShowPricing(true);
            else alert("Error al exportar reporte");
        } finally { setExportando(false); }
    };

    const handleSave = async () => {
        if (!session?.user) return;
        setGuardando(true);
        try {
            const { saveScenario } = await import("@/lib/actions/scenarioActions");
            const res = await saveScenario({
                type: "ACTUARIA",
                subType: "RUINA",
                name: `Ruina ${new Date().toLocaleDateString()}`,
                variables: { initialCapital, premiumRate, lambda, claimSize, periods },
                results: { ProbRuina: results.ProbRuina },
            });
            if (res.success) alert("Escenario guardado"); else alert(res.error);
        } catch (e) { alert("Error al guardar"); } finally { setGuardando(false); }
    };

    return (
        <>
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden relative">
                <div className="absolute top-0 right-0 p-8 opacity-10 text-amber-500">
                    <ShieldAlert className="w-24 h-24" />
                </div>
                <div className="relative z-10 flex items-center justify-between gap-4 flex-wrap">
                    <div>
                        <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2 flex items-center gap-3">
                            <Coins className="text-amber-500" />
                            Ruina del Asegurador
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 max-w-2xl text-sm italic">
                            Simulación actuarial de Monte Carlo. Observa la probabilidad de insolvencia técnica ante la aleatoriedad de los siniestros.
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <button type="button" onClick={handleExport} disabled={exportando} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 dark:bg-slate-700 text-white hover:bg-slate-800 dark:hover:bg-slate-600 transition-all shadow-md active:scale-95 disabled:opacity-50">
                            <FileDown className="w-4 h-4" />
                            {exportando ? "Generando..." : "Reporte PDF"}
                        </button>
                        {session && (
                            <button type="button" onClick={handleSave} disabled={guardando} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-amber-600 text-white hover:bg-amber-500 transition-all shadow-md active:scale-95 disabled:opacity-50">
                                <Save className="w-4 h-4" />
                                {guardando ? "Guardando..." : "Guardar"}
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Controles */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-lg">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="font-black text-slate-400 uppercase text-[10px] tracking-widest">Variables de Solvencia</h3>
                            <button
                                onClick={() => setSeed(s => s + 1)}
                                className="p-2.5 bg-slate-50 dark:bg-slate-800 text-blue-600 rounded-xl hover:bg-blue-50 transition-all border border-slate-100 dark:border-slate-700 shadow-sm active:scale-95"
                            >
                                <RefreshCw className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="space-y-8">
                            <Slider label="Capital Inicial (U₀)" value={initialCapital} min={100} max={50000} step={100} onChange={setInitialCapital} suffix="$" />
                            <Slider label="Carga de Prima (c)" value={premiumRate} min={10} max={5000} step={10} onChange={setPremiumRate} suffix="$" />
                            <Slider label="Frecuencia (λ)" value={lambda} min={0.1} max={50} step={0.1} onChange={setLambda} />
                            <Slider label="Siniestro Promedio (E[X])" value={claimSize} min={10} max={1000} step={1} onChange={setClaimSize} suffix="$" />
                        </div>
                    </div>

                    <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-xl shadow-amber-500/10 border border-slate-800 relative overflow-hidden">
                        <div className={`absolute inset-0 opacity-10 ${results.ProbRuina > 20 ? 'bg-rose-600' : 'bg-emerald-600'} blur-2xl`} />
                        <h4 className="relative z-10 font-black text-[10px] uppercase mb-4 tracking-widest text-slate-500">Probabilidad de Insolvencia</h4>
                        <p className={`relative z-10 text-6xl font-black mb-2 tabular-nums ${results.ProbRuina > 20 ? 'text-rose-500' : 'text-emerald-400'}`}>
                            {results.ProbRuina.toFixed(0)}%
                        </p>
                        <p className="relative z-10 text-xs text-slate-400 leading-relaxed font-medium">
                            {results.ProbRuina > 10 ? "⚠️ Alerta: El recargo de seguridad no compensa la volatilidad." : "✅ Proceso estable: Las reservas son adecuadas."}
                        </p>
                    </div>
                </div>

                {/* Grafica de Trayectorias */}
                <div className="lg:col-span-2">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-lg h-full min-h-[500px] flex flex-col">
                        <div className="flex items-center justify-between mb-10">
                            <h3 className="font-black text-slate-900 dark:text-white text-xl uppercase tracking-tighter">Trayectorias de Capital</h3>
                        </div>

                        <div id="grafico-ruina" className="flex-1 w-full min-h-[350px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={results.chartData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="t" tick={{ fontSize: 10, fontWeight: 700 }} />
                                    <YAxis tick={{ fontSize: 10, fontWeight: 700 }} />
                                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '10px' }} />

                                    {Array.from({ length: 15 }).map((_, i) => (
                                        <Line
                                            key={i}
                                            type="monotone"
                                            dataKey={`path${i}`}
                                            stroke={i === 0 ? '#3b82f6' : '#94a3b8'}
                                            strokeWidth={i === 0 ? 3 : 1}
                                            strokeOpacity={i === 0 ? 1 : 0.2}
                                            dot={false}
                                            className="transition-all duration-700"
                                        />
                                    ))}

                                    <ReferenceLine y={0} stroke="#f43f5e" strokeWidth={2} strokeDasharray="5 5" />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="mt-8 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-inner flex items-start gap-4">
                            <Zap className="w-5 h-5 text-blue-600 mt-1 shrink-0" />
                            <div className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                                <span className="font-extrabold text-slate-700 dark:text-slate-300 block mb-1">Recargo de Seguridad (θ):</span>
                                Actualmente es del **{((premiumRate / (lambda * claimSize) - 1) * 100).toFixed(1)}%**.
                                Si θ ≤ 0, la ruina es SEGURA en el largo plazo (ley de los grandes números).
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
