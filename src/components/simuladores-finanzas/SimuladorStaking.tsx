"use client";

import { useState, useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Sprout, Coins, FileDown, Save } from "lucide-react";
import { useSession } from "next-auth/react";
import { registrarExportacion } from "@/lib/actions/exportActions";
import { exportarBlockchainAPdf } from "@/lib/exportarBlockchainPdf";
import { saveScenario } from "@/lib/actions/scenarioActions";
import PricingModal from "../PricingModal";

export function SimuladorStaking() {
    const { data: session } = useSession();
    const [showPricing, setShowPricing] = useState(false);
    const [exportando, setExportando] = useState(false);
    const [guardando, setGuardando] = useState(false);
    const [initialStake, setInitialStake] = useState(1000);
    const [apr, setApr] = useState(12);
    const [months, setMonths] = useState(12);

    const data = useMemo(() => {
        const result = [];
        let currentBalance = initialStake;
        const monthlyRate = apr / 100 / 12;

        for (let i = 0; i <= months; i++) {
            result.push({
                month: `Mes ${i}`,
                balance: currentBalance,
                interest: currentBalance - initialStake
            });
            currentBalance += currentBalance * monthlyRate;
        }
        return result;
    }, [initialStake, apr, months]);

    const finalBalance = data[data.length - 1].balance;
    const totalEarned = finalBalance - initialStake;
    const apy = ((finalBalance - initialStake) / initialStake) * 100;

    const handleExportStaking = async () => {
        if ((session?.user?.credits ?? 0) < 1) { setShowPricing(true); return; }
        setExportando(true);
        try {
            await registrarExportacion("Blockchain Staking", "PDF");
            let chartUrl: string | null = null;
            try {
                const { getGraficoAsDataUrl } = await import("@/lib/exportarGrafico");
                chartUrl = await getGraficoAsDataUrl("grafico-staking");
            } catch (_) {}
            await exportarBlockchainAPdf({
                tipo: "Staking",
                titulo: "Staking y Yield Farming",
                variables: [
                    { label: "Tokens invertidos (Stake)", valor: initialStake.toLocaleString() },
                    { label: "APR anual (%)", valor: `${apr}%` },
                    { label: "Plazo (meses)", valor: String(months) },
                ],
                resultados: [
                    { label: "Balance final", valor: finalBalance.toLocaleString("en-US", { maximumFractionDigits: 2 }) },
                    { label: "Ganancias totales", valor: `+${totalEarned.toLocaleString("en-US", { maximumFractionDigits: 2 })}` },
                    { label: "APY equivalente", valor: `${apy.toFixed(2)}%` },
                ],
                chart: chartUrl,
            });
        } catch (e: any) {
            if (String(e?.message || e).includes("créditos")) setShowPricing(true);
            else alert(e?.message || "Error al exportar");
        } finally { setExportando(false); }
    };

    const handleSaveStaking = async () => {
        if (!session?.user) return;
        setGuardando(true);
        try {
            const res = await saveScenario({
                type: "BLOCKCHAIN",
                subType: "STAKING",
                name: `Staking ${new Date().toLocaleDateString()}`,
                variables: { initialStake, apr, months },
                results: { finalBalance, totalEarned, apy },
            });
            if (res.success) alert("Escenario de Staking guardado (1 crédito)");
            else alert(res.error);
        } catch (e: any) { alert("Error al guardar"); } finally { setGuardando(false); }
    };

    return (
        <>
        <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                    <Sprout className="w-5 h-5 text-emerald-500" />
                    Staking y Yield Farming
                </h3>
                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={handleExportStaking}
                        disabled={exportando}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 dark:bg-slate-700 text-white hover:bg-slate-800 dark:hover:bg-slate-600 transition-all shadow-md active:scale-95 disabled:opacity-50"
                    >
                        <FileDown className="w-3.5 h-3.5" />
                        {exportando ? "Generando..." : "Reporte PDF"}
                    </button>
                    {session && (
                        <button
                            type="button"
                            onClick={handleSaveStaking}
                            disabled={guardando}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-violet-600 text-white hover:bg-violet-500 transition-all shadow-md active:scale-95 disabled:opacity-50"
                        >
                            <Save className="w-3.5 h-3.5" />
                            {guardando ? "Guardando..." : "Guardar"}
                        </button>
                    )}
                </div>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-4">
                    <div>
                        <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Tokens Invertidos (Stake)</label>
                        <input
                            type="number"
                            value={initialStake}
                            onChange={(e) => setInitialStake(Number(e.target.value))}
                            className="w-full mt-1 px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">APR Anual (%)</label>
                        <input
                            type="number"
                            value={apr}
                            onChange={(e) => setApr(Number(e.target.value))}
                            className="w-full mt-1 px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Plazo (Meses)</label>
                        <input
                            type="range"
                            min="1"
                            max="60"
                            value={months}
                            onChange={(e) => setMonths(Number(e.target.value))}
                            className="w-full mt-2 h-2 rounded-lg appearance-none cursor-pointer bg-slate-200 dark:bg-slate-700 accent-emerald-600"
                        />
                        <div className="text-right text-xs mt-1 font-mono text-slate-500">{months} meses</div>
                    </div>

                    <div className="pt-4 space-y-3">
                        <div className="rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/30 p-4">
                            <p className="text-xs font-semibold uppercase text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                                <Sprout className="w-4 h-4" /> Ganancias
                            </p>
                            <p className="text-2xl font-bold font-mono text-slate-900 dark:text-slate-100 mt-1">
                                +{totalEarned.toLocaleString("en-US", { maximumFractionDigits: 2 })}
                            </p>
                        </div>
                        <div className="rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/30 p-4">
                            <p className="text-xs font-semibold uppercase text-blue-600 dark:text-blue-400">APY Equivalente (Interés Compuesto)</p>
                            <p className="text-xl font-bold font-mono text-slate-900 dark:text-slate-100 mt-1">
                                {apy.toFixed(2)}%
                            </p>
                            <p className="text-[10px] text-slate-500 mt-1">Asumiendo reinversión mensual</p>
                        </div>
                    </div>
                </div>

                <div className="md:col-span-2 overflow-hidden">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4">
                        <h3 className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                            <Coins className="w-5 h-5 text-emerald-500" />
                            Crecimiento Proyectado
                        </h3>
                        <span className="font-mono font-bold text-xl text-emerald-600 dark:text-emerald-400">
                            Total: {finalBalance.toLocaleString("en-US", { maximumFractionDigits: 2 })}
                        </span>
                    </div>
                    <div id="grafico-staking" className="h-64 sm:h-80 w-full bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 p-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
                                <XAxis dataKey="month" hide />
                                <YAxis tickFormatter={(val) => val >= 1000 ? `${(val / 1000).toFixed(1)}k` : val} tick={{ fontSize: 12 }} width={50} />
                                <Tooltip formatter={(val: number) => val.toLocaleString("en-US", { maximumFractionDigits: 2 })} />
                                <Line type="monotone" dataKey="balance" stroke="#10b981" strokeWidth={3} dot={false} name="Balance Total" />
                                <Line type="monotone" dataKey="initialStake" stroke="#94a3b8" strokeDasharray="5 5" strokeWidth={1} dot={false} name="Inversión Inicial" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
        <PricingModal isOpen={showPricing} onClose={() => setShowPricing(false)} />
        </>
    );
}
