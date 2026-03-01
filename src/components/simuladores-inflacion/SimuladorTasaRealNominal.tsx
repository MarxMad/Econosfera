"use client";

import { useState, useMemo } from "react";
import { FileDown, Save, Percent, TrendingUp } from "lucide-react";
import { useSession } from "next-auth/react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import PricingModal from "@/components/PricingModal";
import { registrarExportacion } from "@/lib/actions/exportActions";
import { exportarTasaRealNominalPdf } from "@/lib/exportarPdf";

export default function SimuladorTasaRealNominal() {
    const { data: session, update } = useSession();
    const [showPricing, setShowPricing] = useState(false);
    const [exportando, setExportando] = useState(false);
    const [guardando, setGuardando] = useState(false);

    const [tasaNominal, setTasaNominal] = useState(11.25);
    const [inflacionEsperada, setInflacionEsperada] = useState(4.5);

    // Ecuación de Fisher: r ≈ i − π (aproximación)
    const tasaReal = useMemo(
        () => tasaNominal - inflacionEsperada,
        [tasaNominal, inflacionEsperada]
    );

    const datosGrafico = useMemo(
        () => [
            { name: "Tasa nominal (i)", valor: tasaNominal, fill: "#3b82f6" },
            { name: "Inflación esperada (πᵉ)", valor: inflacionEsperada, fill: "#f43f5e" },
            { name: "Tasa real (r)", valor: Math.round(tasaReal * 100) / 100, fill: "#10b981" },
        ],
        [tasaNominal, inflacionEsperada, tasaReal]
    );

    const isLimitReached = (session?.user?.credits ?? 0) < 1;

    const handleReportePdf = async () => {
        if (isLimitReached) {
            setShowPricing(true);
            return;
        }
        setExportando(true);
        try {
            await registrarExportacion("Inflación Tasa Real/Nominal", "PDF");
            let chartUrl: string | null = null;
            try {
                const { getGraficoAsDataUrl } = await import("@/lib/exportarGrafico");
                chartUrl = await getGraficoAsDataUrl("grafico-tasa-real-nominal");
            } catch (_) {}
            await exportarTasaRealNominalPdf(tasaNominal, inflacionEsperada, tasaReal, chartUrl);
            await update();
        } catch (e: any) {
            if (String(e?.message || e).includes("créditos")) setShowPricing(true);
            else alert(e?.message || "Error al exportar");
        } finally {
            setExportando(false);
        }
    };

    const handleGuardar = async () => {
        if (isLimitReached) {
            setShowPricing(true);
            return;
        }
        setGuardando(true);
        try {
            const { saveScenario } = await import("@/lib/actions/scenarioActions");
            const res = await saveScenario({
                type: "INFLACION",
                subType: "TASA_REAL_NOMINAL",
                name: `Tasa real vs nominal ${new Date().toLocaleDateString()}`,
                variables: { tasaNominal, inflacionEsperada },
                results: { tasaReal },
            });
            if (res.success) {
                alert("Escenario guardado");
                await update();
            } else alert(res.error);
        } catch (e: any) {
            alert("Error al guardar");
        } finally {
            setGuardando(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200 dark:border-slate-700 bg-gradient-to-br from-indigo-50 to-emerald-50 dark:from-slate-900 dark:to-slate-800/80 p-6 shadow-lg overflow-hidden relative">
                <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl" />
                <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="p-3 rounded-2xl bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                            <Percent className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-slate-900 dark:text-white">Tasa real vs nominal</h2>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                Ecuación de Fisher: r ≈ i − πᵉ. El banco central fija la tasa nominal; la tasa real es la que importa para decisiones de inversión.
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <button
                            type="button"
                            onClick={handleReportePdf}
                            disabled={exportando}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-50 transition-colors shadow-md"
                        >
                            <FileDown className="w-4 h-4" />
                            {exportando ? "Generando..." : "Reporte PDF"}
                        </button>
                        {session && (
                            <button
                                type="button"
                                onClick={handleGuardar}
                                disabled={guardando}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold bg-violet-600 text-white hover:bg-violet-500 disabled:opacity-50 transition-colors shadow-md"
                            >
                                <Save className="w-4 h-4" />
                                {guardando ? "Guardando..." : "Guardar"}
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 p-6 shadow-sm">
                    <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-indigo-500" />
                        Parámetros
                    </h3>
                    <div className="space-y-5">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Tasa nominal (i) %</label>
                            <input
                                type="number"
                                step="0.25"
                                min="0"
                                max="30"
                                value={tasaNominal}
                                onChange={(e) => setTasaNominal(parseFloat(e.target.value) || 0)}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-mono font-bold text-lg"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Inflación esperada (πᵉ) %</label>
                            <input
                                type="number"
                                step="0.1"
                                min="-5"
                                max="25"
                                value={inflacionEsperada}
                                onChange={(e) => setInflacionEsperada(parseFloat(e.target.value) || 0)}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-mono font-bold text-lg"
                            />
                        </div>
                    </div>
                    <div className="mt-6 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
                        <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase mb-1">Tasa real aproximada (r)</p>
                        <p className="text-3xl font-black font-mono text-slate-900 dark:text-white">{tasaReal.toFixed(2)}%</p>
                    </div>
                </div>

                <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 p-6 shadow-sm">
                    <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-4">Comparación (%)</h3>
                    <div id="grafico-tasa-real-nominal" className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={datosGrafico} margin={{ top: 8, right: 8, left: 8, bottom: 24 }}>
                                <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-600" />
                                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                                <YAxis tick={{ fontSize: 11 }} />
                                <Tooltip formatter={(v: number) => [`${v}%`, ""]} />
                                <Bar dataKey="valor" name="%" radius={[6, 6, 0, 0]}>
                                    {datosGrafico.map((entry, index) => (
                                        <Cell key={index} fill={entry.fill} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <PricingModal isOpen={showPricing} onClose={() => setShowPricing(false)} />
        </div>
    );
}
