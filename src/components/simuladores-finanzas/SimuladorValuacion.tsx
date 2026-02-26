"use client";

import { useMemo, useState } from "react";
import { LineChart, BarChart, FileDown } from "lucide-react";
import { InputLibre } from "./InputLibre";
import { useSession } from "next-auth/react";
import PricingModal from "../PricingModal";

interface SimuladorValuacionProps {
    initialData?: any;
}

export function SimuladorValuacion({ initialData }: SimuladorValuacionProps) {
    const varsInit = initialData?.variables || {
        precioAccion: 150.0,
        utilidadNeta: 1000000,
        accionesEnCirculacion: 100000,
        dividendosPagados: 250000,
        capitalContable: 5000000
    };

    const [vars, setVars] = useState(varsInit);
    const { data: session, update } = useSession();
    const [showPricing, setShowPricing] = useState(false);

    const isLimitReached = (session?.user?.exportsCount || 0) >= 3;

    const res = useMemo(() => {
        const EPS = vars.utilidadNeta / vars.accionesEnCirculacion; // UPA
        const PERatio = vars.precioAccion / EPS;
        const dy = (vars.dividendosPagados / vars.accionesEnCirculacion) / vars.precioAccion;
        const ROE = vars.utilidadNeta / vars.capitalContable;

        return {
            EPS,
            PERatio,
            dy: dy * 100, // porcentaje
            ROE: ROE * 100 // porcentaje
        };
    }, [vars]);

    const setVar = (key: keyof typeof vars, val: number) => {
        setVars((p: typeof vars) => ({ ...p, [key]: val }));
    };

    const handlePrint = () => {
        if (isLimitReached) {
            setShowPricing(true);
            return;
        }
        fetch("/api/exports", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ type: "PRINT", module: "Valuacion" })
        }).then(() => update()).catch(console.error);
        window.print();
    };

    return (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden mt-4">
            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    <LineChart className="w-5 h-5 text-indigo-500" />
                    <h3 className="font-bold text-slate-800 dark:text-slate-100">Valuación de Acciones (Ratios Bursátiles)</h3>
                </div>
                <button
                    type="button"
                    onClick={handlePrint}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                >
                    <FileDown className="w-4 h-4" />
                    Exportar PDF
                </button>
            </div>
            <div className="p-5 grid md:grid-cols-2 gap-6" id="valuacion-form">
                <div className="space-y-4">
                    <InputLibre label="Precio de la Acción ($)" value={vars.precioAccion.toString()} onChange={(v: any) => setVar("precioAccion", Number(v))} step="1" suffix=" MXN" />
                    <InputLibre label="Utilidad Neta Total ($)" value={vars.utilidadNeta.toString()} onChange={(v: any) => setVar("utilidadNeta", Number(v))} step="1000" suffix=" MXN" />
                    <InputLibre label="Acciones en Circulación" value={vars.accionesEnCirculacion.toString()} onChange={(v: any) => setVar("accionesEnCirculacion", Number(v))} step="100" />
                    <InputLibre label="Dividendos Totales Pagados ($)" value={vars.dividendosPagados.toString()} onChange={(v: any) => setVar("dividendosPagados", Number(v))} step="1000" suffix=" MXN" />
                    <InputLibre label="Capital Contable Total ($)" value={vars.capitalContable.toString()} onChange={(v: any) => setVar("capitalContable", Number(v))} step="1000" suffix=" MXN" />
                </div>

                <div className="flex flex-col gap-4">
                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-100 dark:border-slate-700">
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Métricas Clave de Valoración</h4>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-600 dark:text-slate-400">UPA (Utilidad por Acción) / EPS</span>
                                <span className="font-mono font-bold text-slate-900 dark:text-white">${res.EPS.toFixed(2)}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-600 dark:text-slate-400">P/E Ratio (Múltiplo Precio/Utilidad)</span>
                                <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">{res.PERatio.toFixed(2)}x</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-600 dark:text-slate-400">Dividend Yield (Rendimiento por Dividendo)</span>
                                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{res.dy.toFixed(2)}%</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-600 dark:text-slate-400">ROE (Rentabilidad Financiera)</span>
                                <span className="font-mono font-bold text-purple-600 dark:text-purple-400">{res.ROE.toFixed(2)}%</span>
                            </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 text-xs text-slate-500">
                            <p className="mb-1"><strong>Interpretación:</strong></p>
                            <p>Un P/E bajo (usualmente &lt; 15x) puede indicar que la acción está subvalorada o que la empresa crece lento. Un ROE alto indica que la directiva está usando eficientemente el capital de los accionistas para generar retornos.</p>
                        </div>
                    </div>
                </div>
            </div>

            <PricingModal isOpen={showPricing} onClose={() => setShowPricing(false)} />
        </div>
    );
}
