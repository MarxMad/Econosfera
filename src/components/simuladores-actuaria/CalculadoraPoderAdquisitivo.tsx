"use client";

import { useState, useMemo, useEffect } from "react";
import { TrendingUp, Info, HelpCircle, Flame, ShieldCheck, Wallet, ArrowDown, FileDown, Save } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
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

export default function CalculadoraPoderAdquisitivo() {
    const [principal, setPrincipal] = useState(10000);
    const [nominalRate, setNominalRate] = useState(11);
    const [inflation, setInflation] = useState(5);
    const [years, setYears] = useState(20);
    const { data: session } = useSession();
    const [showPricing, setShowPricing] = useState(false);
    const [exportando, setExportando] = useState(false);
    const [guardando, setGuardando] = useState(false);

    const chartData = useMemo(() => {
        const data = [];
        let nominalCurrent = principal;
        let realCurrent = principal;

        for (let t = 0; t <= years; t++) {
            data.push({
                year: t,
                nominal: Math.round(nominalCurrent),
                real: Math.round(realCurrent),
            });
            nominalCurrent *= (1 + nominalRate / 100);
            realCurrent *= (1 + (nominalRate - inflation) / 100);
        }
        return data;
    }, [principal, nominalRate, inflation, years]);

    const stats = useMemo(() => {
        const finalNominal = chartData[chartData.length - 1].nominal;
        const finalReal = chartData[chartData.length - 1].real;
        const erosionPercent = ((finalNominal - finalReal) / finalNominal) * 100;

        return { finalNominal, finalReal, erosionPercent };
    }, [chartData]);

    const handleExport = async () => {
        if ((session?.user?.credits ?? 0) < 1) { setShowPricing(true); return; }
        setExportando(true);
        try {
            await import("@/lib/actions/exportActions").then((m) => m.registrarExportacion("Actuaria Poder Adquisitivo", "PDF"));
            const { exportarActuariaAPdf } = await import("@/lib/exportarActuariaPdf");
            let chartUrl: string | null = null;
            try { chartUrl = await import("@/lib/exportarGrafico").then((m) => m.getGraficoAsDataUrl("grafico-poder-adquisitivo")); } catch (_) {}
            await exportarActuariaAPdf({
                tipo: "PoderAdquisitivo",
                titulo: "Poder Adquisitivo Real (Fisher)",
                variables: [
                    { label: "Capital inicial", valor: `$${principal.toLocaleString()}` },
                    { label: "Tasa nominal (i)", valor: `${nominalRate}%` },
                    { label: "Inflación (π)", valor: `${inflation}%` },
                    { label: "Horizonte (años)", valor: String(years) },
                ],
                resultados: [
                    { label: "Valor nominal final", valor: `$${stats.finalNominal.toLocaleString()}` },
                    { label: "Valor real final", valor: `$${stats.finalReal.toLocaleString()}` },
                    { label: "Erosión acumulada", valor: `${stats.erosionPercent.toFixed(0)}%` },
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
                subType: "PODER_ADQUISITIVO",
                name: `Poder Adquisitivo ${new Date().toLocaleDateString()}`,
                variables: { principal, nominalRate, inflation, years },
                results: stats,
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
                    <ShieldCheck className="w-24 h-24" />
                </div>
                <div className="relative z-10 flex items-center justify-between gap-4 flex-wrap">
                    <div>
                        <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2 flex items-center gap-3">
                            <Wallet className="text-emerald-500" />
                            Poder Adquisitivo Real
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 max-w-2xl text-sm italic">
                            Visualiza cómo la inflación erosiona el valor del dinero en el tiempo usando la ecuación de Fisher r ≈ i - π.
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
                        <h3 className="font-black text-slate-400 mb-8 uppercase text-[10px] tracking-widest text-slate-500">Variables Financieras</h3>

                        <div className="space-y-6">
                            <Slider label="Capital Inicial" value={principal} min={100} max={1000000} step={100} onChange={setPrincipal} suffix="$" />
                            <Slider label="Tasa Nominal (i)" value={nominalRate} min={0} max={100} step={0.1} onChange={setNominalRate} suffix="%" />
                            <Slider label="Inflación (π)" value={inflation} min={0} max={100} step={0.1} onChange={setInflation} suffix="%" />
                            <Slider label="Horizonte (Años)" value={years} min={1} max={100} step={1} onChange={setYears} />
                        </div>
                    </div>

                    <div className="bg-rose-500 rounded-3xl p-8 text-white shadow-xl shadow-rose-500/20 relative overflow-hidden">
                        <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
                        <h4 className="font-bold text-[10px] uppercase mb-4 tracking-widest opacity-80 flex items-center gap-2">
                            <Flame className="w-3 h-3" /> Impuesto Inflacionario
                        </h4>
                        <p className="text-6xl font-black mb-1">{stats.erosionPercent.toFixed(0)}%</p>
                        <p className="text-xs font-bold uppercase tracking-tight opacity-70">Desvalorización acumulada</p>

                        <div className="mt-8 pt-6 border-t border-rose-400/50 space-y-4">
                            <div className="flex justify-between items-end">
                                <span className="text-[10px] uppercase font-bold opacity-70">Valor Nominal Final</span>
                                <span className="text-xl font-bold font-mono">${stats.finalNominal.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-end p-4 bg-black/10 rounded-2xl border border-white/10">
                                <span className="text-[10px] uppercase font-bold text-emerald-300">Valor Real Final</span>
                                <span className="text-2xl font-black font-mono text-emerald-200">${stats.finalReal.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Grafica de Evolucion */}
                <div className="lg:col-span-2">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-lg h-full min-h-[500px] flex flex-col">
                        <div className="flex items-center justify-between mb-10">
                            <h3 className="font-black text-slate-900 dark:text-white text-xl uppercase tracking-tighter">Crecimiento Nominal vs Real</h3>
                        </div>

                        <div id="grafico-poder-adquisitivo" className="flex-1 w-full min-h-[350px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData}>
                                    <defs>
                                        <linearGradient id="colorNominal" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorReal" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="year" tick={{ fontSize: 10, fontWeight: 700 }} />
                                    <YAxis tick={{ fontSize: 10, fontWeight: 700 }} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '10px' }}
                                        formatter={(val: any) => [`$${val.toLocaleString()}`, ""]}
                                    />
                                    <Legend verticalAlign="top" height={36} iconType="circle" />
                                    <Area name="Crecimiento Nominal" type="monotone" dataKey="nominal" stroke="#3b82f6" strokeWidth={2} fill="url(#colorNominal)" />
                                    <Area name="Poder de Compra (Real)" type="monotone" dataKey="real" stroke="#10b981" strokeWidth={5} fill="url(#colorReal)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="mt-8 flex items-center justify-center gap-8 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-inner">
                            <div className="text-center">
                                <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Tasa Real (r)</p>
                                <p className={`text-2xl font-black tracking-tighter ${nominalRate - inflation > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                    {(nominalRate - inflation).toFixed(1)}%
                                </p>
                            </div>
                            <div className="w-px h-10 bg-slate-200 dark:bg-slate-700" />
                            <p className="text-xs text-slate-500 max-w-sm leading-relaxed font-medium">
                                <span className="font-extrabold text-slate-700 dark:text-slate-300 mr-1">Efecto Fisher:</span>
                                Tu dinero solo crece en términos reales si la tasa nominal supera a la inflación. De lo contrario, pierdes poder adquisitivo cada año.
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
