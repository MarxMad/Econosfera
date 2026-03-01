"use client";

import { useState, useMemo, useEffect } from "react";
import { TrendingUp, Info, HelpCircle, Shield, Heart, User, Activity, FileDown, Save } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Label } from "recharts";
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
                        className="w-20 px-2 py-1 text-right font-mono font-bold rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-500"
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
                className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-rose-600"
            />
        </div>
    );
}

export default function SimuladorMortalidad() {
    // Parámetros Simplificados de Gompertz
    const [alpha, setAlpha] = useState(0.0001);
    const [beta, setBeta] = useState(0.085);
    const [currentAge, setCurrentAge] = useState(25);
    const { data: session } = useSession();
    const [showPricing, setShowPricing] = useState(false);
    const [exportando, setExportando] = useState(false);
    const [guardando, setGuardando] = useState(false);

    const data = useMemo(() => {
        const chartData = [];
        let survival = 1.0;
        for (let x = 0; x <= 110; x++) {
            const mu = alpha * Math.exp(beta * x);
            // S(x+1) = S(x) * exp(-mu)
            survival = survival * Math.exp(-mu);

            chartData.push({
                age: x,
                survival: parseFloat((survival * 100).toFixed(2)),
                mortality: parseFloat((mu * 100).toFixed(4)),
            });
        }
        return chartData;
    }, [alpha, beta]);

    const stats = useMemo(() => {
        // Esperanza de vida simplificada (área bajo la curva S(x))
        const lifeExp = data.reduce((acc, curr) => acc + curr.survival / 100, 0);
        const probAtCurrent = data.find(d => d.age === currentAge)?.survival || 0;

        // Probabilidad de llegar a los 80
        const prob80 = data.find(d => d.age === 80)?.survival || 0;

        return { lifeExp, probAtCurrent, prob80 };
    }, [data, currentAge]);

    const handleExport = async () => {
        if ((session?.user?.credits ?? 0) < 1) {
            setShowPricing(true);
            return;
        }
        setExportando(true);
        try {
            await import("@/lib/actions/exportActions").then((m) => m.registrarExportacion("Actuaria Mortalidad", "PDF"));
            const { exportarActuariaAPdf } = await import("@/lib/exportarActuariaPdf");
            let chartUrl: string | null = null;
            try {
                const { getGraficoAsDataUrl } = await import("@/lib/exportarGrafico");
                chartUrl = await getGraficoAsDataUrl("grafico-mortalidad");
            } catch (_) {}
            await exportarActuariaAPdf({
                tipo: "Mortalidad",
                titulo: "Bio-Actuaria: Mortalidad (Gompertz)",
                variables: [
                    { label: "Edad actual", valor: `${currentAge} años` },
                    { label: "Mortalidad base (α)", valor: String(alpha) },
                    { label: "Envejecimiento (β)", valor: String(beta) },
                ],
                resultados: [
                    { label: "Esperanza de vida", valor: `${stats.lifeExp.toFixed(1)} años` },
                    { label: "Prob. supervivencia hoy", valor: `${stats.probAtCurrent.toFixed(1)}%` },
                    { label: "Prob. llegar a 80", valor: `${stats.prob80.toFixed(1)}%` },
                ],
                chart: chartUrl,
            });
        } catch (e) {
            console.error(e);
            if (String(e).includes("créditos")) setShowPricing(true);
            else alert("Error al exportar reporte");
        } finally {
            setExportando(false);
        }
    };

    const handleSave = async () => {
        if (!session?.user) return;
        setGuardando(true);
        try {
            const { saveScenario } = await import("@/lib/actions/scenarioActions");
            const res = await saveScenario({
                type: "ACTUARIA",
                subType: "MORTALIDAD",
                name: `Mortalidad ${new Date().toLocaleDateString()}`,
                variables: { alpha, beta, currentAge },
                results: stats,
            });
            if (res.success) alert("Escenario guardado");
            else alert(res.error);
        } catch (e) {
            alert("Error al guardar");
        } finally {
            setGuardando(false);
        }
    };

    return (
        <>
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden relative">
                <div className="absolute top-0 right-0 p-8 opacity-10 text-rose-500">
                    <Heart className="w-24 h-24" />
                </div>
                <div className="relative z-10 flex items-center justify-between gap-4 flex-wrap">
                    <div>
                        <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2 flex items-center gap-3">
                            <Shield className="text-rose-500" />
                            Bio-Actuaria: Mortalidad
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 max-w-2xl text-sm italic">
                            Simula curvas de supervivencia usando la ley de Gompertz. Crucial para pensiones y gestión de longevidad.
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={handleExport}
                            disabled={exportando}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 dark:bg-slate-700 text-white hover:bg-slate-800 dark:hover:bg-slate-600 transition-all shadow-md active:scale-95 disabled:opacity-50"
                        >
                            <FileDown className="w-4 h-4" />
                            {exportando ? "Generando..." : "Reporte PDF"}
                        </button>
                        {session && (
                            <button
                                type="button"
                                onClick={handleSave}
                                disabled={guardando}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 text-white hover:bg-rose-500 transition-all shadow-md active:scale-95 disabled:opacity-50"
                            >
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
                        <h3 className="font-black text-slate-400 mb-8 uppercase text-[10px] tracking-widest">Ajustes Biométricos</h3>

                        <div className="space-y-8">
                            <Slider label="Tu Edad Actual" value={currentAge} min={0} max={100} step={1} onChange={setCurrentAge} suffix="años" />
                            <Slider label="Mortalidad Base (α)" value={alpha} min={0.00001} max={0.01} step={0.00001} onChange={setAlpha} />
                            <Slider label="Envejecimiento (β)" value={beta} min={0.01} max={0.2} step={0.001} onChange={setBeta} />
                        </div>
                    </div>

                    <div className="bg-rose-600 rounded-3xl p-8 text-white shadow-xl shadow-rose-500/20 border border-rose-500 relative overflow-hidden">
                        <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
                        <h4 className="font-bold text-xs uppercase mb-6 tracking-widest opacity-80 flex items-center gap-2">
                            <Activity className="w-4 h-4" /> Estadísticas Vitales
                        </h4>
                        <div className="space-y-6">
                            <div className="flex justify-between items-end border-b border-rose-400/50 pb-3">
                                <span className="text-[10px] font-black uppercase">Esperanza Vida</span>
                                <span className="text-3xl font-black tabular-nums">{stats.lifeExp.toFixed(1)} <span className="text-xs font-normal">años</span></span>
                            </div>
                            <div className="flex justify-between items-end border-b border-rose-400/50 pb-3">
                                <span className="text-[10px] font-black uppercase">Prob. Hoy</span>
                                <span className="text-3xl font-black tabular-nums">{stats.probAtCurrent.toFixed(1)}%</span>
                            </div>
                            <div className="flex justify-between items-end pt-2">
                                <span className="text-[10px] font-black uppercase">Llegar a los 80</span>
                                <span className="text-3xl font-black tabular-nums">{stats.prob80.toFixed(1)}%</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Grafica Survival */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-lg h-[450px] flex flex-col">
                        <div className="flex items-center justify-between mb-10">
                            <h3 className="font-black text-slate-900 dark:text-white uppercase text-sm tracking-tighter">Probabilidad de Supervivencia S(x)</h3>
                        </div>

                        <div id="grafico-mortalidad" className="flex-1 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={data}>
                                    <defs>
                                        <linearGradient id="colorSurvival" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.2} />
                                            <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis
                                        dataKey="age"
                                        tick={{ fontSize: 10, fontWeight: 700 }}
                                        label={{ value: 'Edad (años)', position: 'insideBottomRight', offset: -10, fontSize: 10 }}
                                    />
                                    <YAxis
                                        tick={{ fontSize: 10, fontWeight: 700 }}
                                        domain={[0, 100]}
                                        label={{ value: '% Población', angle: -90, position: 'insideLeft', fontSize: 10 }}
                                    />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '10px' }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="survival"
                                        stroke="#f43f5e"
                                        strokeWidth={4}
                                        fillOpacity={1}
                                        fill="url(#colorSurvival)"
                                        animationDuration={1000}
                                    />
                                    <ReferenceLine x={currentAge} stroke="#0ea5e9" strokeDasharray="3 3">
                                        <Label value="Tú" position="top" fill="#0ea5e9" fontSize={10} fontWeight="black" />
                                    </ReferenceLine>
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
                            <h4 className="flex items-center gap-2 font-black text-slate-900 dark:text-white mb-3 text-xs uppercase tracking-tight">
                                <User className="w-4 h-4 text-blue-500" />
                                Impacto Actuarial
                            </h4>
                            <p className="text-xs text-slate-500 leading-relaxed font-medium">
                                El área bajo esta curva determina la **Prima Única Nivelada**. Si la curva cae más lento, el costo de las pensiones aumenta drásticamente.
                            </p>
                        </div>
                        <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
                            <h4 className="flex items-center gap-2 font-black text-slate-900 dark:text-white mb-3 text-xs uppercase tracking-tight">
                                <Activity className="w-4 h-4 text-emerald-500" />
                                Tasa de Mortalidad
                            </h4>
                            <p className="text-xs text-slate-500 leading-relaxed font-medium">
                                A los 80 años, tu fuerza de mortalidad es de aprox. **{(data.find(d => d.age === 80)?.mortality || 0).toFixed(2)}%** bajo este escenario.
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
