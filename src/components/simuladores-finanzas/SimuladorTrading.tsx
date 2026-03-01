"use client";

import { useState, useEffect, useRef } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Activity, TrendingUp, TrendingDown, DollarSign, FileDown, Save } from "lucide-react";
import { registrarExportacion } from "@/lib/actions/exportActions";
import { exportarBlockchainAPdf } from "@/lib/exportarBlockchainPdf";
import { saveScenario } from "@/lib/actions/scenarioActions";
import { useSession } from "next-auth/react";
import PricingModal from "../PricingModal";

export function SimuladorTrading() {
    const { data: session } = useSession();
    const [price, setPrice] = useState(50000);
    const [history, setHistory] = useState<{ time: string; price: number }[]>([{ time: new Date().toLocaleTimeString(), price: 50000 }]);
    const [balanceUSD, setBalanceUSD] = useState(10000);
    const [balanceAsset, setBalanceAsset] = useState(0);
    const [amount, setAmount] = useState<number>(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [trades, setTrades] = useState<{ id: string; type: 'BUY' | 'SELL'; amountUSD: number; price: number; time: string }[]>([]);
    const [showPricing, setShowPricing] = useState(false);
    const [exportando, setExportando] = useState(false);
    const [guardando, setGuardando] = useState(false);

    const priceRef = useRef(price);
    const historyRef = useRef(history);

    useEffect(() => {
        priceRef.current = price;
        historyRef.current = history;
    }, [price, history]);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isPlaying) {
            interval = setInterval(() => {
                const currentPrice = priceRef.current;
                const change = (Math.random() - 0.5) * 0.02; // max +/- 1% per tick
                const newPrice = currentPrice * (1 + change);

                setPrice(newPrice);
                setHistory(prev => {
                    const newHist = [...prev, { time: new Date().toLocaleTimeString(), price: newPrice }];
                    if (newHist.length > 30) newHist.shift();
                    return newHist;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isPlaying]);

    const handleBuy = () => {
        if (amount > 0 && amount <= balanceUSD) {
            const purchasedAsset = amount / price;
            setBalanceUSD(prev => prev - amount);
            setBalanceAsset(prev => prev + purchasedAsset);
            setTrades(prev => [{ id: Math.random().toString(), type: 'BUY' as const, amountUSD: amount, price, time: new Date().toLocaleTimeString() }, ...prev].slice(0, 10));
        }
    };

    const handleSell = () => {
        if (amount > 0 && amount <= balanceAsset * price) {
            const soldAsset = amount / price;
            setBalanceAsset(prev => prev - soldAsset);
            setBalanceUSD(prev => prev + amount);
            setTrades(prev => [{ id: Math.random().toString(), type: 'SELL' as const, amountUSD: amount, price, time: new Date().toLocaleTimeString() }, ...prev].slice(0, 10));
        }
    };

    const totalValue = balanceUSD + balanceAsset * price;

    const handleExportTrading = async () => {
        if ((session?.user?.credits ?? 0) < 1) {
            setShowPricing(true);
            return;
        }
        setExportando(true);
        try {
            await registrarExportacion("Blockchain Trading", "PDF");
            let chartUrl: string | null = null;
            try {
                const { getGraficoAsDataUrl } = await import("@/lib/exportarGrafico");
                chartUrl = await getGraficoAsDataUrl("grafico-trading");
            } catch (_) {}
            exportarBlockchainAPdf({
                tipo: 'Trading',
                titulo: 'Simulación de Trading y Gestión de Riesgo',
                variables: [
                    { label: 'Balance USD', valor: `$${balanceUSD.toFixed(2)}` },
                    { label: 'Balance Activo', valor: balanceAsset.toFixed(4) },
                    { label: 'Valor Total Portfolio', valor: `$${totalValue.toFixed(2)}` },
                    { label: 'Precio Actual', valor: `$${price.toFixed(2)}` }
                ],
                tabla: {
                    label: 'Historial de Ejecuciones (Últimas 10)',
                    columns: ['ID', 'Tipo', 'Monto USD', 'Precio Ejecución', 'Hora'],
                    data: trades.map(t => ({
                        id: t.id.slice(-4),
                        type: t.type,
                        amount: `$${t.amountUSD.toLocaleString()}`,
                        p: `$${t.price.toFixed(2)}`,
                        time: t.time
                    }))
                },
                chart: chartUrl
            });
        } catch (e: any) {
            if (String(e?.message || e).includes("créditos")) setShowPricing(true);
            else alert(e?.message || "Error al exportar");
        } finally {
            setExportando(false);
        }
    };

    const handleSaveTrading = async () => {
        if (!session?.user) return;
        setGuardando(true);
        try {
            const res = await saveScenario({
                type: "BLOCKCHAIN",
                subType: "TRADING",
                name: `Trading ${new Date().toLocaleDateString()}`,
                variables: { balanceUSD, balanceAsset, price },
                results: { totalPortfolio: totalValue }
            });
            if (res.success) alert("Simulación de Trading guardada (1 crédito)");
            else alert(res.error);
        } catch (e: any) {
            alert("Error al guardar");
        } finally {
            setGuardando(false);
        }
    };

    return (
        <>
        <div className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-2 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 p-6 shadow-sm overflow-hidden">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
                        <div className="flex items-center justify-between w-full">
                            <div className="flex items-center gap-2">
                                <Activity className="w-5 h-5 text-blue-500" />
                                <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">Gráfico de Precio (Simulado)</h3>
                            </div>
                            <button
                                type="button"
                                onClick={handleExportTrading}
                                disabled={exportando}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 dark:bg-slate-700 text-white hover:bg-slate-800 dark:hover:bg-slate-600 transition-all shadow-md active:scale-95 disabled:opacity-50"
                            >
                                <FileDown className="w-3.5 h-3.5" />
                                {exportando ? "Generando..." : "Reporte PDF"}
                            </button>
                            {session && (
                                <button
                                    type="button"
                                    onClick={handleSaveTrading}
                                    disabled={guardando}
                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-violet-600 text-white hover:bg-violet-500 transition-all shadow-md active:scale-95 disabled:opacity-50"
                                >
                                    <Save className="w-3.5 h-3.5" />
                                    {guardando ? "Guardando..." : "Guardar"}
                                </button>
                            )}
                        </div>
                        <div className="flex flex-wrap items-center gap-4 w-full md:w-auto mt-2 md:mt-0">
                            <div className="text-right">
                                <p className="text-sm text-slate-500 dark:text-slate-400">Precio Actual</p>
                                <p className="text-xl font-mono font-bold text-slate-900 dark:text-slate-100">
                                    ${price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </p>
                            </div>
                            <button
                                onClick={() => setIsPlaying(!isPlaying)}
                                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${isPlaying ? 'bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400' : 'bg-emerald-100 text-emerald-600 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400'}`}
                            >
                                {isPlaying ? "Pausar Mercado" : "Iniciar Mercado"}
                            </button>
                        </div>
                    </div>
                    <div id="grafico-trading" className="h-64 mt-4 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={history} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" opacity={0.5} />
                                <XAxis dataKey="time" hide />
                                <YAxis domain={['auto', 'auto']} width={80} tickFormatter={(val) => `$${val.toLocaleString()}`} tick={{ fontSize: 12 }} />
                                <Tooltip formatter={(val: number) => `$${val.toLocaleString(undefined, { minimumFractionDigits: 2 })}`} labelFormatter={() => ""} />
                                <Line type="monotone" dataKey="price" stroke="#3b82f6" strokeWidth={2} dot={false} isAnimationActive={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    {trades.length > 0 && (
                        <div className="mt-6 border-t border-slate-200 dark:border-slate-700 pt-4">
                            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-3">Historial de Operaciones</h4>
                            <div className="space-y-2 max-h-40 overflow-y-auto pr-2 no-scrollbar">
                                {trades.map((trade) => (
                                    <div key={trade.id} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-sm animate-in fade-in slide-in-from-top-2">
                                        <div className="flex items-center gap-3">
                                            {trade.type === 'BUY' ? (
                                                <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                                                    <TrendingUp className="w-4 h-4" />
                                                </div>
                                            ) : (
                                                <div className="w-8 h-8 rounded-full bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center text-rose-600 dark:text-rose-400">
                                                    <TrendingDown className="w-4 h-4" />
                                                </div>
                                            )}
                                            <div>
                                                <p className="font-bold text-slate-800 dark:text-slate-200">
                                                    {trade.type === 'BUY' ? 'Compra' : 'Venta'}
                                                </p>
                                                <p className="text-[10px] text-slate-500">{trade.time}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-mono font-bold text-slate-900 dark:text-white">
                                                ${trade.amountUSD.toLocaleString()}
                                            </p>
                                            <p className="text-[10px] text-slate-500 font-mono">
                                                @ ${trade.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="space-y-6">
                    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 p-6 shadow-sm">
                        <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
                            <DollarSign className="w-5 h-5 text-emerald-500" />
                            Portafolio
                        </h3>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                                <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">Efectivo (USD)</span>
                                <span className="font-mono font-bold text-slate-900 dark:text-white">${balanceUSD.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                            </div>
                            <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                                <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">Activo (BTC)</span>
                                <span className="font-mono font-bold text-slate-900 dark:text-white">{balanceAsset.toLocaleString(undefined, { minimumFractionDigits: 4, maximumFractionDigits: 4 })}</span>
                            </div>
                            <div className="pt-3 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center">
                                <span className="text-sm font-bold text-slate-800 dark:text-slate-200">Valor Total Estimado</span>
                                <span className="font-mono font-bold text-blue-600 dark:text-blue-400">${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 p-6 shadow-sm">
                        <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-4">Operar (Market Order)</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Monto en USD a operar</label>
                                <div className="relative mt-1">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                                    <input
                                        type="number"
                                        value={amount || ""}
                                        onChange={(e) => setAmount(Number(e.target.value))}
                                        className="w-full pl-8 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all font-mono"
                                        placeholder="1000"
                                    />
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={handleBuy}
                                    disabled={amount <= 0 || amount > balanceUSD}
                                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <TrendingUp className="w-4 h-4" /> Comprar
                                </button>
                                <button
                                    onClick={handleSell}
                                    disabled={amount <= 0 || amount > balanceAsset * price}
                                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <TrendingDown className="w-4 h-4" /> Vender
                                </button>
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
