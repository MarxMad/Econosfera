"use client";

import { useState } from "react";
import { Cpu, Zap, Pickaxe, Flame, DollarSign, Scale } from "lucide-react";

export function SimuladorConsenso() {
    const [powHashRate, setPowHashRate] = useState(50);
    const [posStake, setPosStake] = useState(50000);

    const powDailyCost = Math.round(powHashRate * 2.5);
    const powReward = Math.round(powHashRate * 4);

    const posAnnualYield = Math.round(posStake * 0.04);
    const posSlashingRisk = Math.round(posStake * 0.5);

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="rounded-2xl border border-blue-200 dark:border-blue-900 bg-blue-50/50 dark:bg-blue-900/10 p-6 shadow-sm">
                <h3 className="text-xl font-bold flex items-center gap-2 mb-3 text-blue-800 dark:text-blue-300">
                    <Scale className="w-5 h-5" />
                    Mecanismos de Consenso: ¿Quién decide la verdad?
                </h3>
                <div className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
                    <p>
                        Sin un banco central, ¿cómo deciden millones de personas qué transacciones son válidas? Se usa un <strong>Mecanismo de Consenso</strong>. Tienen una regla de oro en común: Forzar al participante a gastar o apostar algo valioso para que atacarlo sea económicamente estúpido.
                    </p>
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">

                {/* Proof of Work */}
                <div className="rounded-2xl border-2 border-red-200 dark:border-red-900 bg-white dark:bg-slate-900 p-6 shadow-xl relative overflow-hidden">
                    <div className="absolute -right-10 -top-10 w-40 h-40 bg-red-500/10 blur-3xl rounded-full" />

                    <div className="flex items-center gap-3 mb-4 relative z-10">
                        <Pickaxe className="w-8 h-8 text-red-500 p-1.5 bg-red-100 dark:bg-red-900/40 rounded-lg" />
                        <div>
                            <h4 className="font-extrabold text-lg text-slate-800 dark:text-slate-100 uppercase tracking-widest">
                                Proof of Work
                            </h4>
                            <p className="text-[10px] font-bold text-slate-500 uppercase">Ejemplo: Bitcoin (Minado Físico)</p>
                        </div>
                    </div>

                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 relative z-10 min-h-[60px]">
                        Comprobas tu lealtad quemando energía. Quien gasta más en computadoras y luz, tiene la probabilidad más alta de resolver el bloque y llevarse la recompensa en dinero fresco.
                    </p>

                    <div className="space-y-4 relative z-10">
                        <div>
                            <label className="text-xs font-bold text-slate-500 flex justify-between">
                                Inversión en Tarjetas Gráficas (Hash Rate)
                                <span className="text-red-600 font-mono">{powHashRate} TH/s</span>
                            </label>
                            <input
                                type="range"
                                min={10} max={200}
                                value={powHashRate}
                                onChange={(e) => setPowHashRate(Number(e.target.value))}
                                className="w-full mt-2 accent-red-500"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4 mt-6">
                            <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-xl p-4 text-center">
                                <Zap className="w-5 h-5 text-red-500 mx-auto mb-2" />
                                <p className="text-[10px] font-bold text-slate-500 uppercase">Gasto Diario Energía</p>
                                <p className="text-lg font-mono font-black text-rose-600">-${powDailyCost}</p>
                            </div>
                            <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 rounded-xl p-4 text-center">
                                <DollarSign className="w-5 h-5 text-emerald-500 mx-auto mb-2" />
                                <p className="text-[10px] font-bold text-slate-500 uppercase">Recompensa Promedio</p>
                                <p className="text-lg font-mono font-black text-emerald-600">+${powReward}</p>
                            </div>
                        </div>

                        <div className="p-3 bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-400 text-xs rounded-lg font-medium border border-amber-200 dark:border-amber-900">
                            <strong>El Ataque del 51%:</strong> Para controlar esta red y falsificar datos, un hacker necesitaría gastar billones hackeando plantas eléctricas e inundando el mercado de hardware. Económicamente casi imposible.
                        </div>
                    </div>
                </div>

                {/* Proof of Stake */}
                <div className="rounded-2xl border-2 border-indigo-200 dark:border-indigo-900 bg-white dark:bg-slate-900 p-6 shadow-xl relative overflow-hidden">
                    <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-indigo-500/10 blur-3xl rounded-full" />

                    <div className="flex items-center gap-3 mb-4 relative z-10">
                        <Flame className="w-8 h-8 text-indigo-500 p-1.5 bg-indigo-100 dark:bg-indigo-900/40 rounded-lg" />
                        <div>
                            <h4 className="font-extrabold text-lg text-slate-800 dark:text-slate-100 uppercase tracking-widest">
                                Proof of Stake
                            </h4>
                            <p className="text-[10px] font-bold text-slate-500 uppercase">Ejemplo: Ethereum (Virtual)</p>
                        </div>
                    </div>

                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 relative z-10 min-h-[60px]">
                        Comprobas tu lealtad depositando tu propio dinero en la red ("Staking"). Si te portas bien validando datos, la red te paga intereses. ¡Si intentas mentir, la red quema tu depósito!
                    </p>

                    <div className="space-y-4 relative z-10">
                        <div>
                            <label className="text-xs font-bold text-slate-500 flex justify-between">
                                Depósito Congelado en Staking
                                <span className="text-indigo-600 font-mono">${posStake.toLocaleString()}</span>
                            </label>
                            <input
                                type="range"
                                min={100} max={100000} step={100}
                                value={posStake}
                                onChange={(e) => setPosStake(Number(e.target.value))}
                                className="w-full mt-2 accent-indigo-500"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4 mt-6">
                            <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 rounded-xl p-4 text-center">
                                <DollarSign className="w-5 h-5 text-emerald-500 mx-auto mb-2" />
                                <p className="text-[10px] font-bold text-slate-500 uppercase">Interés Anual Pago</p>
                                <p className="text-lg font-mono font-black text-emerald-600">+${posAnnualYield.toLocaleString()}</p>
                            </div>
                            <div className="bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-4 text-center group hover:bg-rose-50 dark:hover:bg-rose-950 transition-colors">
                                <Cpu className="w-5 h-5 text-slate-500 group-hover:text-rose-500 mx-auto mb-2 transition-colors" />
                                <p className="text-[10px] font-bold text-slate-500 uppercase">Penalización (Slashing)</p>
                                <p className="text-lg font-mono font-black text-slate-600 group-hover:text-rose-600">-${posSlashingRisk.toLocaleString()}</p>
                            </div>
                        </div>

                        <div className="p-3 bg-blue-50 dark:bg-blue-950/30 text-blue-800 dark:text-blue-400 text-xs rounded-lg font-medium border border-blue-200 dark:border-blue-900">
                            <strong>Ecológico y Letal:</strong> Gasta 99% menos energía que PoW. El hacker no ataca con luz, sino que debería comprar el 51% de *todas las monedas circulantes* (Billones de dólares) y al atacar la red las destruiría todas al instante (Slashing).
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
