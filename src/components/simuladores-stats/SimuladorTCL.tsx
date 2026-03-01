"use client";

import { useState, useMemo, useEffect } from "react";
import { TrendingUp, Info, HelpCircle, BarChart, RefreshCw, Layers, FileDown, Save } from "lucide-react";
import { BarChart as RechartsBar, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
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
                        className="w-16 px-2 py-1 text-right font-mono font-bold rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
                className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
        </div>
    );
}

export default function SimuladorTCL() {
    const [sampleSize, setSampleSize] = useState(5);
    const [numSamples, setNumSamples] = useState(100);
    const [distType, setDistType] = useState<"uniform" | "exp" | "discrete">("uniform");
    const [seed, setSeed] = useState(0);
    const { data: session } = useSession();
    const [showPricing, setShowPricing] = useState(false);
    const [exportando, setExportando] = useState(false);
    const [guardando, setGuardando] = useState(false);

    const stats = useMemo(() => {
        const means = [];
        for (let i = 0; i < numSamples; i++) {
            let sum = 0;
            for (let j = 0; j < sampleSize; j++) {
                if (distType === "uniform") sum += Math.random() * 10;
                else if (distType === "exp") sum += -Math.log(Math.random()) * 5;
                else sum += Math.random() < 0.3 ? 8 : 2; // Discrete bi-modal
            }
            means.push(sum / sampleSize);
        }

        // Create Histogram Data
        const bins = 20;
        const min = Math.min(...means);
        const max = Math.max(...means);
        const binWidth = (max - min) / bins;

        const histogram = Array.from({ length: bins }, (_, i) => ({
            bin: (min + i * binWidth).toFixed(1),
            count: 0
        }));

        means.forEach(m => {
            const binIdx = Math.min(bins - 1, Math.floor((m - min) / binWidth));
            histogram[binIdx].count++;
        });

        return { histogram, avg: (means.reduce((a, b) => a + b, 0) / numSamples).toFixed(2) };
    }, [sampleSize, numSamples, distType, seed]);

    const handleExport = async () => {
        if ((session?.user?.credits ?? 0) < 1) { setShowPricing(true); return; }
        setExportando(true);
        try {
            await import("@/lib/actions/exportActions").then((m) => m.registrarExportacion("Estadística TCL", "PDF"));
            const { exportarEstadisticaAPdf } = await import("@/lib/exportarEstadisticaPdf");
            let chartUrl: string | null = null;
            try { chartUrl = await import("@/lib/exportarGrafico").then((m) => m.getGraficoAsDataUrl("grafico-tcl")); } catch (_) {}
            await exportarEstadisticaAPdf({
                tipo: "TCL",
                titulo: "Teorema del Límite Central",
                variables: [
                    { label: "Tamaño de muestra (n)", valor: String(sampleSize) },
                    { label: "Número de simulaciones", valor: String(numSamples) },
                    { label: "Distribución poblacional", valor: distType === "uniform" ? "Uniforme" : distType === "exp" ? "Exponencial" : "Discreta" },
                ],
                resultados: [
                    { label: "Media muestral promedio", valor: String(stats.avg) },
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
                subType: "TCL",
                name: `TCL ${new Date().toLocaleDateString()}`,
                variables: { sampleSize, numSamples, distType },
                results: { avg: stats.avg },
            });
            if (res.success) alert("Escenario guardado"); else alert(res.error);
        } catch (e) { alert("Error al guardar"); } finally { setGuardando(false); }
    };

    return (
        <>
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden relative">
                <div className="absolute top-0 right-0 p-8 opacity-10 text-emerald-500">
                    <BarChart className="w-24 h-24" />
                </div>
                <div className="relative z-10 flex items-center justify-between gap-4 flex-wrap">
                    <div>
                        <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2 flex items-center gap-3">
                            <Layers className="text-emerald-500" />
                            Teorema del Límite Central (TLC)
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 max-w-2xl text-sm italic">
                            El pilar de la inferencia estadística. Mira cómo el promedio de muestras aleatorias siempre converge a una **Distribución Normal**, sin importar el origen de los datos.
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <button type="button" onClick={handleExport} disabled={exportando} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 dark:bg-slate-700 text-white hover:bg-slate-800 dark:hover:bg-slate-600 transition-all shadow-md active:scale-95 disabled:opacity-50">
                            <FileDown className="w-4 h-4" />
                            {exportando ? "Generando..." : "Reporte PDF"}
                        </button>
                        {session && (
                            <button type="button" onClick={handleSave} disabled={guardando} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-500 transition-all shadow-md active:scale-95 disabled:opacity-50">
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
                            <h3 className="font-black text-slate-400 uppercase text-[10px] tracking-widest">Laboratorio de Muestreo</h3>
                            <button onClick={() => setSeed(s => s + 1)} className="p-2.5 bg-slate-50 dark:bg-slate-800 text-emerald-600 rounded-xl hover:bg-emerald-50 transition-all border border-slate-100 dark:border-slate-700 shadow-sm active:scale-95"><RefreshCw className="w-4 h-4" /></button>
                        </div>

                        <div className="space-y-8">
                            {/* Tipo de Dist */}
                            <div className="space-y-3">
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Distribución Poblacional (X)</span>
                                <div className="grid grid-cols-3 gap-2">
                                    {(['uniform', 'exp', 'discrete'] as const).map(t => (
                                        <button
                                            key={t}
                                            onClick={() => setDistType(t)}
                                            className={`py-2 text-[10px] font-black rounded-xl border transition-all ${distType === t ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-500/20' : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:border-slate-300 dark:hover:border-slate-600'}`}
                                        >
                                            {t === 'uniform' ? 'Uniforme' : t === 'exp' ? 'Exponenc' : 'Discreta'}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <Slider label="Tamaño de Muestra (n)" value={sampleSize} min={1} max={100} step={1} onChange={setSampleSize} />
                            <Slider label="Número de Simulaciones" value={numSamples} min={10} max={1000} step={10} onChange={setNumSamples} />
                        </div>
                    </div>

                    <div className="bg-emerald-600 rounded-3xl p-8 text-white shadow-xl shadow-emerald-500/20 border border-emerald-500 relative overflow-hidden">
                        <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
                        <h4 className="font-bold text-xs uppercase mb-4 tracking-widest opacity-80">Media Muestral Promedio</h4>
                        <p className="text-6xl font-black mb-1">{stats.avg}</p>
                        <p className="text-xs opacity-80 leading-relaxed uppercase font-black tracking-tighter mt-4">Estimación puntual de μ</p>
                    </div>
                </div>

                {/* Histograma */}
                <div className="lg:col-span-2">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-lg h-full min-h-[500px] flex flex-col">
                        <div className="flex items-center justify-between mb-10">
                            <div>
                                <h3 className="font-black text-slate-900 dark:text-white text-xl uppercase tracking-tighter">Convergencia a la Normal</h3>
                                <p className="text-xs text-slate-500 mt-1 font-medium">Histograma de medias para N={numSamples} experimentos</p>
                            </div>
                            <div className="px-4 py-2 bg-emerald-50 dark:bg-emerald-900/10 text-emerald-600 rounded-2xl text-[10px] font-black uppercase border border-emerald-100 dark:border-emerald-800 shadow-sm">
                                n = {sampleSize}
                            </div>
                        </div>

                        <div id="grafico-tcl" className="flex-1 w-full min-h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <RechartsBar data={stats.histogram}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="bin" tick={{ fontSize: 10 }} />
                                    <YAxis tick={{ fontSize: 10 }} />
                                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '10px' }} />
                                    <Bar dataKey="count" fill="#10b981" radius={[6, 6, 0, 0]}>
                                        {stats.histogram.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fillOpacity={0.4 + (entry.count / numSamples) * 0.6} className="transition-all duration-500" />
                                        ))}
                                    </Bar>
                                </RechartsBar>
                            </ResponsiveContainer>
                        </div>

                        <div className="mt-8 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-inner">
                            <h4 className="flex items-center gap-2 font-black text-slate-900 dark:text-white mb-3 text-xs uppercase tracking-tight">
                                <Info className="w-4 h-4 text-emerald-500" />
                                Intuición del Teorema
                            </h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                                El TLC justifica el uso de modelos normales incluso cuando desconocemos la distribución real de la población (ingresos, precios, estaturas). Observa cómo al subir **n**, la varianza de las medias se reduce y la forma se vuelve más simétrica.
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
