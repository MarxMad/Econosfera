"use client";

import { useState } from "react";
import { Droplets, ArrowRightLeft, Coins, TrendingUp, FileDown, Save } from "lucide-react";
import { registrarExportacion } from "@/lib/actions/exportActions";
import { exportarBlockchainAPdf } from "@/lib/exportarBlockchainPdf";
import { saveScenario } from "@/lib/actions/scenarioActions";
import { useSession } from "next-auth/react";
import PricingModal from "../PricingModal";

export function SimuladorAMM() {
    const { data: session } = useSession();
    const [showPricing, setShowPricing] = useState(false);
    const [exportando, setExportando] = useState(false);
    const [guardando, setGuardando] = useState(false);
    // x * y = k (x = Token A, y = USDC)
    const [tokenA, setTokenA] = useState(1000); // Amount of Token A in pool
    const [tokenUSDC, setTokenUSDC] = useState(10000); // Amount of USDC in pool

    // Trade state
    const [tradeDirection, setTradeDirection] = useState<"buy_A" | "sell_A">("buy_A");
    const [tradeAmount, setTradeAmount] = useState(100);

    // K is constant
    const k = tokenA * tokenUSDC;
    const currentPrice = tokenUSDC / tokenA; // Price of 1 Token A in USDC

    // Calculate outcome of user trade
    let newA = tokenA;
    let newUSDC = tokenUSDC;
    let resultAmount = 0;
    let effectivePrice = 0;
    let slippage = 0;

    if (tradeAmount > 0) {
        if (tradeDirection === "buy_A") {
            // User adds USDC, gets Token A
            newUSDC = tokenUSDC + tradeAmount;
            newA = k / newUSDC;
            resultAmount = tokenA - newA; // amount of A user receives
        } else {
            // User adds Token A, gets USDC
            newA = tokenA + tradeAmount;
            newUSDC = k / newA;
            resultAmount = tokenUSDC - newUSDC; // amount of USDC user receives
        }
        effectivePrice = tradeDirection === "buy_A" ? (tradeAmount / resultAmount) : (resultAmount / tradeAmount);
        slippage = Math.abs((effectivePrice - currentPrice) / currentPrice) * 100;
    }

    // Tokenomics
    const [totalSupply, setTotalSupply] = useState(1000000);
    const fdv = totalSupply * currentPrice;

    const handleExportAMM = async () => {
        if ((session?.user?.credits ?? 0) < 1) {
            setShowPricing(true);
            return;
        }
        setExportando(true);
        try {
            await registrarExportacion("Blockchain AMM", "PDF");
            exportarBlockchainAPdf({
                tipo: 'AMM',
                titulo: 'Simulación de Automated Market Maker (AMM)',
                variables: [
                    { label: 'Reserva Token A', valor: tokenA.toLocaleString() },
                    { label: 'Reserva USDC', valor: `$${tokenUSDC.toLocaleString()}` },
                    { label: 'Total Supply', valor: totalSupply.toLocaleString() },
                    { label: 'Constante K', valor: k.toLocaleString() }
                ],
                resultados: [
                    { label: 'Precio Actual (Spot)', valor: `$${currentPrice.toFixed(4)}` },
                    { label: 'FDV', valor: `$${fdv.toLocaleString()}` },
                    { label: 'Último Swapper Recibe', valor: `${resultAmount.toFixed(4)}` },
                    { label: 'Slippage', valor: `${slippage.toFixed(2)}%` }
                ]
            });
        } catch (e: any) {
            if (String(e?.message || e).includes("créditos")) setShowPricing(true);
            else alert(e?.message || "Error al exportar");
        } finally {
            setExportando(false);
        }
    };

    const handleSaveAMM = async () => {
        if (!session?.user) return;
        setGuardando(true);
        try {
            const res = await saveScenario({
                type: "BLOCKCHAIN",
                subType: "AMM",
                name: `AMM ${new Date().toLocaleDateString()}`,
                variables: { tokenA, tokenUSDC, totalSupply },
                results: { currentPrice, fdv, slippage }
            });
            if (res.success) alert("Configuración de AMM guardada (1 crédito)");
            else alert(res.error);
        } catch (e: any) {
            alert("Error al guardar");
        } finally {
            setGuardando(false);
        }
    };

    return (
        <>
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {/* Header / Intro */}
            <div className="rounded-2xl border border-violet-200 dark:border-violet-900 bg-violet-50/50 dark:bg-violet-900/10 p-6 shadow-sm">
                <div className="flex items-center justify-between gap-4 mb-3">
                    <h3 className="text-xl font-bold flex items-center gap-2 text-violet-800 dark:text-violet-300">
                        <Droplets className="w-5 h-5" />
                        Automated Market Makers (AMM) y Liquidez
                    </h3>
                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={handleExportAMM}
                            disabled={exportando}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 dark:bg-slate-700 text-white hover:bg-slate-800 dark:hover:bg-slate-600 transition-all shadow-md active:scale-95 disabled:opacity-50"
                        >
                            <FileDown className="w-3.5 h-3.5" />
                            {exportando ? "Generando..." : "Reporte PDF"}
                        </button>
                        {session && (
                            <button
                                type="button"
                                onClick={handleSaveAMM}
                                disabled={guardando}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-violet-600 text-white hover:bg-violet-500 transition-all shadow-md active:scale-95 disabled:opacity-50"
                            >
                                <Save className="w-3.5 h-3.5" />
                                {guardando ? "Guardando..." : "Guardar"}
                            </button>
                        )}
                    </div>
                </div>
                <div className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
                    <p>
                        A diferencia de las bolsas tradicionales que usan un libro de órdenes, los DEX (Exchanges Descentralizados como Uniswap) usan la fórmula mágica <strong>x * y = k</strong>.
                    </p>
                    <p>
                        Si un pool tiene tokens <span className="text-violet-600 font-bold dark:text-violet-400">TKN</span> y <span className="text-emerald-600 font-bold dark:text-emerald-400">USDC</span>, el precio de TKN se fija por la proporción entre ambos. Si alguien compra TKN, saca TKN del pool y mete USDC. Al haber más USDC y menos TKN, el precio del TKN sube automáticamente.
                    </p>
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Pool State */}
                <div className="space-y-6">
                    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 p-6 shadow-sm">
                        <h4 className="font-bold flex items-center gap-2 mb-4">
                            <Coins className="w-5 h-5 text-indigo-500" />
                            Estado del Liquidity Pool
                        </h4>

                        <div className="space-y-4 mb-6">
                            <div>
                                <label className="text-xs font-semibold text-slate-500">Reserva de Token (TKN)</label>
                                <input type="number" min="1" value={tokenA} onChange={(e) => setTokenA(Number(e.target.value) || 1)} className="w-full mt-1 p-2 bg-slate-100 dark:bg-slate-900 rounded-lg text-violet-600 dark:text-violet-400 font-bold outline-none" />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-slate-500">Reserva de Dólares (USDC)</label>
                                <input type="number" min="1" value={tokenUSDC} onChange={(e) => setTokenUSDC(Number(e.target.value) || 1)} className="w-full mt-1 p-2 bg-slate-100 dark:bg-slate-900 rounded-lg text-emerald-600 dark:text-emerald-400 font-bold outline-none" />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                                <p className="text-[10px] font-bold uppercase text-slate-500 mb-1">Precio Actual (Spot)</p>
                                <p className="text-2xl font-mono font-black text-slate-900 dark:text-white">${currentPrice.toFixed(4)}</p>
                            </div>
                            <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                                <p className="text-[10px] font-bold uppercase text-slate-500 mb-1">Constante K</p>
                                <p className="text-lg font-mono font-bold text-slate-500">{k.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>

                    {/* Tokenomics */}
                    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 p-6 shadow-sm">
                        <h4 className="font-bold flex items-center gap-2 mb-4">
                            <TrendingUp className="w-5 h-5 text-amber-500" />
                            Tokenomics (Métricas)
                        </h4>
                        <div>
                            <label className="text-xs font-semibold text-slate-500">Oferta Total del Token (Total Supply)</label>
                            <input type="number" min="1" value={totalSupply} onChange={(e) => setTotalSupply(Number(e.target.value) || 1)} className="w-full mt-1 p-2 bg-slate-100 dark:bg-slate-900 rounded-lg font-bold outline-none mb-4" />
                        </div>
                        <div className="bg-amber-50 dark:bg-amber-900/10 p-4 rounded-xl border border-amber-200 dark:border-amber-900/50">
                            <p className="text-xs font-bold uppercase text-amber-600 dark:text-amber-400 mb-1">Fully Diluted Valuation (FDV)</p>
                            <p className="text-3xl font-mono font-black text-slate-900 dark:text-white">${fdv.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                            <p className="text-xs text-slate-500 mt-2">Es el valor del proyeto si todos los tokens existieran hoy. Compara el FDV con otros proyectos para saber si está "caro" o "barato".</p>
                        </div>
                    </div>
                </div>

                {/* Swap / Trading Simulator */}
                <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 p-6 shadow-sm flex flex-col">
                    <h4 className="font-bold flex items-center gap-2 mb-6">
                        <ArrowRightLeft className="w-5 h-5 text-blue-500" />
                        Simulador de Swap (Impacto en Precio)
                    </h4>

                    <div className="flex gap-2 mb-6">
                        <button onClick={() => setTradeDirection("buy_A")} className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${tradeDirection === "buy_A" ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/20" : "bg-slate-100 dark:bg-slate-800 text-slate-500"}`}>
                            Comprar TKN
                        </button>
                        <button onClick={() => setTradeDirection("sell_A")} className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${tradeDirection === "sell_A" ? "bg-rose-500 text-white shadow-md shadow-rose-500/20" : "bg-slate-100 dark:bg-slate-800 text-slate-500"}`}>
                            Vender TKN
                        </button>
                    </div>

                    <div className="mb-6">
                        <label className="text-xs font-semibold text-slate-500">Monto a {tradeDirection === "buy_A" ? "gastar (USDC)" : "vender (TKN)"}</label>
                        <input type="number" min="0" value={tradeAmount} onChange={(e) => setTradeAmount(Number(e.target.value))} className="w-full mt-1 p-3 text-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl font-mono font-bold outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>

                    <div className="flex-1 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800 p-6 flex flex-col justify-center">
                        <p className="text-sm font-bold text-slate-500 text-center mb-6">Resultado de la transacción</p>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-700 pb-2">
                                <span className="text-sm text-slate-600 dark:text-slate-400">Recibirás aprox:</span>
                                <span className="font-mono font-bold text-lg text-slate-900 dark:text-white">
                                    {resultAmount.toFixed(4)} {tradeDirection === "buy_A" ? "TKN" : "USDC"}
                                </span>
                            </div>
                            <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-700 pb-2">
                                <span className="text-sm text-slate-600 dark:text-slate-400">Precio efectivo pagado:</span>
                                <span className="font-mono font-bold text-slate-900 dark:text-white">
                                    ${effectivePrice.toFixed(4)}
                                </span>
                            </div>
                            <div className="flex justify-between items-center pb-2">
                                <span className="text-sm text-slate-600 dark:text-slate-400">Slippage (Penalización):</span>
                                <span className={`font-mono font-bold ${slippage > 5 ? 'text-rose-500' : 'text-emerald-500'}`}>
                                    {slippage.toFixed(2)}%
                                </span>
                            </div>
                        </div>

                        {slippage > 5 && (
                            <div className="mt-8 p-3 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 text-xs rounded-lg text-center font-medium">
                                ¡Peligro! Tu orden es demasiado grande para la liquidez de este pool. Estás moviendo drásticamente el precio.
                            </div>
                        )}
                        {slippage <= 5 && tradeAmount > 0 && (
                            <div className="mt-8 p-3 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-xs rounded-lg text-center font-medium">
                                Buena liquidez para el tamaño de tu orden.
                            </div>
                        )}
                    </div>
                </div>
        </div>
    </div>
    <PricingModal isOpen={showPricing} onClose={() => setShowPricing(false)} />
        </>
    );
}
