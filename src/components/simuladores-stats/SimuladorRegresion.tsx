"use client";

import { useState, useMemo, useEffect } from "react";
import { TrendingUp, Info, HelpCircle, ScatterChart as ScatterIcon, LineChart as LineIcon, Activity, Zap, FileDown, Save } from "lucide-react";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line, ComposedChart, Cell } from "recharts";
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
                        className="w-16 px-2 py-1 text-right font-mono font-bold rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
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

export default function SimuladorRegresion() {
    const [noise, setNoise] = useState(10);
    const [beta1, setBeta1] = useState(0.5);
    const [n, setN] = useState(30);
    const { data: session } = useSession();
    const [showPricing, setShowPricing] = useState(false);
    const [exportando, setExportando] = useState(false);
    const [guardando, setGuardando] = useState(false);

    const results = useMemo(() => {
        const data = [];
        let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0, sumY2 = 0;

        for (let i = 0; i < n; i++) {
            const x = i;
            const y = beta1 * x + 5 + (Math.random() - 0.5) * noise;
            data.push({ x, y });

            sumX += x;
            sumY += y;
            sumXY += x * y;
            sumX2 += x * x;
            sumY2 += y * y;
        }

        const b1_hat = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
        const b0_hat = (sumY - b1_hat * sumX) / n;

        // R^2
        const ssr = data.reduce((acc, d) => acc + Math.pow(d.y - (b0_hat + b1_hat * d.x), 2), 0);
        const sst = data.reduce((acc, d) => acc + Math.pow(d.y - (sumY / n), 2), 0);
        const r2 = 1 - (ssr / sst);

        // Regresion line points
        const line = [
            { x: 0, y_hat: b0_hat },
            { x: n - 1, y_hat: b0_hat + b1_hat * (n - 1) }
        ];

        return { data, line, b1_hat, b0_hat, r2 };
    }, [n, beta1, noise]);

    const handleExport = async () => {
        if ((session?.user?.credits ?? 0) < 1) { setShowPricing(true); return; }
        setExportando(true);
        try {
            await import("@/lib/actions/exportActions").then((m) => m.registrarExportacion("Estadística Regresión", "PDF"));
            const { exportarEstadisticaAPdf } = await import("@/lib/exportarEstadisticaPdf");
            let chartUrl: string | null = null;
            try { chartUrl = await import("@/lib/exportarGrafico").then((m) => m.getGraficoAsDataUrl("grafico-regresion")); } catch (_) {}
            await exportarEstadisticaAPdf({
                tipo: "Regresion",
                titulo: "Regresión Lineal Simple (MCO)",
                variables: [
                    { label: "Pendiente real (β₁)", valor: String(beta1) },
                    { label: "Ruido / varianza", valor: String(noise) },
                    { label: "Tamaño muestra (N)", valor: String(n) },
                ],
                resultados: [
                    { label: "Intercepto estimado (β₀)", valor: results.b0_hat.toFixed(2) },
                    { label: "Pendiente estimada (β₁)", valor: results.b1_hat.toFixed(3) },
                    { label: "R²", valor: results.r2.toFixed(3) },
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
                type: "ESTADISTICA",
                subType: "REGRESION",
                name: `Regresión ${new Date().toLocaleDateString()}`,
                variables: { noise, beta1, n },
                results: { b0_hat: results.b0_hat, b1_hat: results.b1_hat, r2: results.r2 },
            });
            if (res.success) alert("Escenario guardado"); else alert(res.error);
        } catch (e) { alert("Error al guardar"); } finally { setGuardando(false); }
    };

    return (
        <>
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden relative">
                <div className="absolute top-0 right-0 p-8 opacity-10 text-blue-500">
                    <ScatterIcon className="w-24 h-24" />
                </div>
                <div className="relative z-10 flex items-center justify-between gap-4 flex-wrap">
                    <div>
                        <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2 flex items-center gap-3">
                            <Activity className="text-blue-500" />
                            Regresión Lineal Simple (MCO)
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 max-w-2xl text-sm italic">
                            Aprende cómo funciona el método de Mínimos Cuadrados Ordinarios. Observa cómo el ruido en los datos afecta la precisión de tus estimaciones.
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <button type="button" onClick={handleExport} disabled={exportando} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 dark:bg-slate-700 text-white hover:bg-slate-800 dark:hover:bg-slate-600 transition-all shadow-md active:scale-95 disabled:opacity-50">
                            <FileDown className="w-4 h-4" />
                            {exportando ? "Generando..." : "Reporte PDF"}
                        </button>
                        {session && (
                            <button type="button" onClick={handleSave} disabled={guardando} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 text-white hover:bg-blue-500 transition-all shadow-md active:scale-95 disabled:opacity-50">
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
                        <h3 className="font-black text-slate-400 mb-8 uppercase text-[10px] tracking-widest">Parámetros del Modelo</h3>

                        <div className="space-y-6">
                            <Slider label="Pendiente Real (β₁)" value={beta1} min={-5} max={5} step={0.1} onChange={setBeta1} />
                            <Slider label="Ruido / Varianza (u)" value={noise} min={0} max={100} step={1} onChange={setNoise} />
                            <Slider label="Tamaño Muestra (N)" value={n} min={10} max={200} step={1} onChange={setN} />
                        </div>
                    </div>

                    <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-xl border border-slate-800 shadow-blue-500/10 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl" />
                        <h4 className="font-bold text-xs uppercase mb-6 tracking-widest text-slate-500">Estimadores MCO</h4>
                        <div className="space-y-6">
                            <div className="flex justify-between items-center group">
                                <span className="text-[10px] font-black text-slate-500 uppercase group-hover:text-blue-400 transition-colors">Intercepto (β₀)</span>
                                <span className="text-2xl font-black tabular-nums">{results.b0_hat.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center group">
                                <span className="text-[10px] font-black text-slate-500 uppercase group-hover:text-blue-400 transition-colors">Pendiente (β₁)</span>
                                <span className="text-2xl font-black text-blue-400 tabular-nums">{results.b1_hat.toFixed(3)}</span>
                            </div>
                            <div className="pt-4 border-t border-slate-800">
                                <div className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5">
                                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Bondad Ajuste R²</span>
                                    <span className="text-3xl font-black text-emerald-400 tabular-nums">{results.r2.toFixed(3)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Grafica de Dispersion */}
                <div className="lg:col-span-2">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-lg h-full min-h-[500px] flex flex-col">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="font-black text-slate-900 dark:text-white text-xl uppercase tracking-tighter">Nube de Datos y Línea de Ajuste</h3>
                        </div>

                        <div id="grafico-regresion" className="flex-1 min-h-[350px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <ComposedChart data={results.data} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="x" type="number" tick={{ fontSize: 10 }} />
                                    <YAxis type="number" tick={{ fontSize: 10 }} />
                                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '10px' }} />

                                    <Scatter name="Observaciones" data={results.data} fill="#3b82f6" fillOpacity={0.4} />
                                    <Line
                                        name="Regregión MCO"
                                        data={results.line}
                                        dataKey="y_hat"
                                        stroke="#10b981"
                                        strokeWidth={4}
                                        dot={false}
                                        activeDot={false}
                                    />
                                </ComposedChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="mt-8 flex items-start gap-4 p-5 bg-blue-50 dark:bg-blue-900/10 rounded-3xl border border-blue-100 dark:border-blue-800">
                            <Zap className="w-5 h-5 text-blue-600 mt-1 shrink-0" />
                            <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed font-medium">
                                <span className="font-black uppercase tracking-tight text-blue-600 block mb-1">Análisis de los Residuos:</span>
                                El método MCO minimiza la suma de errores al cuadrado. Observa cómo al subir el **ruido**, los puntos se alejan de la línea verde y el **R²** disminuye drásticamente.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <PricingModal isOpen={showPricing} onClose={() => setShowPricing(false)} />
        </>
    );
}
