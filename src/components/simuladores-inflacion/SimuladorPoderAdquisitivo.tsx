"use client";

import { useState, useMemo } from "react";
import { Wallet, TrendingDown, Info } from "lucide-react";

/**
 * Simulador de poder adquisitivo: cómo la inflación erosiona el valor del dinero en el tiempo.
 * Fórmula: Valor futuro necesario = Valor actual × (1 + π)^n
 */
export default function SimuladorPoderAdquisitivo() {
    const [montoInicial, setMontoInicial] = useState(10000);
    const [inflacionAnual, setInflacionAnual] = useState(4.5);
    const [anios, setAnios] = useState(10);

    const valorNecesario = useMemo(() => {
        const factor = Math.pow(1 + inflacionAnual / 100, anios);
        return montoInicial * factor;
    }, [montoInicial, inflacionAnual, anios]);

    const perdidaPoder = useMemo(() => {
        return ((valorNecesario - montoInicial) / montoInicial) * 100;
    }, [montoInicial, valorNecesario]);

    const datosEvolucion = useMemo(() => {
        return Array.from({ length: anios + 1 }, (_, i) => ({
            anio: i,
            valor: Math.round(montoInicial * Math.pow(1 + inflacionAnual / 100, i) * 100) / 100,
        }));
    }, [montoInicial, inflacionAnual, anios]);

    return (
        <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200 dark:border-slate-700 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-slate-900 dark:to-slate-800/80 p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 rounded-2xl bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                        <Wallet className="w-8 h-8 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-slate-900 dark:text-white">Poder adquisitivo</h2>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            La inflación erosiona el valor del dinero. Este simulador muestra cuánto necesitarías en el futuro para mantener el mismo poder de compra.
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 p-6 shadow-sm">
                    <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
                        <TrendingDown className="w-5 h-5 text-amber-500" />
                        Parámetros
                    </h3>
                    <div className="space-y-5">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Monto actual ($)</label>
                            <input
                                type="number"
                                min="100"
                                step="100"
                                value={montoInicial}
                                onChange={(e) => setMontoInicial(Math.max(100, parseFloat(e.target.value) || 0))}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-mono font-bold"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Inflación anual (%)</label>
                            <input
                                type="number"
                                step="0.25"
                                min="0"
                                max="30"
                                value={inflacionAnual}
                                onChange={(e) => setInflacionAnual(Math.max(0, parseFloat(e.target.value) || 0))}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-mono font-bold"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Años</label>
                            <input
                                type="number"
                                min="1"
                                max="50"
                                value={anios}
                                onChange={(e) => setAnios(Math.max(1, Math.min(50, parseInt(e.target.value) || 1)))}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-mono font-bold"
                            />
                        </div>
                    </div>
                    <div className="mt-6 p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                        <p className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase mb-1">Valor necesario en {anios} años</p>
                        <p className="text-2xl font-black font-mono text-slate-900 dark:text-white">
                            ${valorNecesario.toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                            Pérdida de poder adquisitivo: {perdidaPoder.toFixed(1)}%
                        </p>
                    </div>
                </div>

                <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 p-6 shadow-sm">
                    <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-4">Evolución del valor necesario</h3>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                        {datosEvolucion.map((d) => (
                            <div key={d.anio} className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-700/50 last:border-0">
                                <span className="text-sm text-slate-600 dark:text-slate-400">Año {d.anio}</span>
                                <span className="font-mono font-bold text-slate-900 dark:text-white">
                                    ${d.valor.toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </span>
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 flex items-start gap-2">
                        <Info className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-slate-600 dark:text-slate-400">
                            Fórmula: V<sub>n</sub> = V<sub>0</sub> × (1 + π)<sup>n</sup>. Con inflación constante, el dinero pierde valor de forma exponencial.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
