"use client";

import { ShieldAlert, TrendingUp, ShieldCheck, AlertTriangle, ArrowUp, ArrowDown } from "lucide-react";

export default function MapaEstructuraCapital() {
    return (
        <div className="rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/50 shadow-xl p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition-opacity">
                <LandmarkIcon className="w-24 h-24" />
            </div>

            <h3 className="text-xl font-black text-slate-800 dark:text-slate-100 mb-2">Estructura de Capital</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 max-w-lg leading-relaxed">
                Visualización de la jerarquía financiera y el orden de prelación en la cascada de pagos corporativa.
            </p>

            <div className="flex gap-6">
                {/* Indicadores Laterales */}
                <div className="flex flex-col justify-between py-2 text-[10px] font-black uppercase tracking-tighter w-4">
                    <div className="flex flex-col items-center text-emerald-500">
                        <ArrowUp className="w-4 h-4" />
                        <span className="[writing-mode:vertical-lr] rotate-180">Seguridad</span>
                    </div>
                    <div className="flex flex-col items-center text-rose-500">
                        <span className="[writing-mode:vertical-lr]">Rendimiento</span>
                        <ArrowDown className="w-4 h-4" />
                    </div>
                </div>

                <div className="flex-1 flex flex-col gap-3">
                    {/* Deuda Senior Secured */}
                    <div className="p-4 border border-emerald-500/20 bg-emerald-50/30 dark:bg-emerald-900/10 rounded-2xl flex items-start gap-3 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors">
                        <div className="p-2 bg-emerald-500 rounded-lg text-white shadow-lg shadow-emerald-500/20">
                            <ShieldCheck className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="font-bold text-sm text-emerald-800 dark:text-emerald-400">1. Deuda Senior Garantizada (Secured)</h4>
                            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Primeros en cobrar. Respaldada por colateral físico o financiero.</p>
                        </div>
                    </div>

                    {/* Deuda Senior Unsecured */}
                    <div className="p-4 border border-blue-500/20 bg-blue-50/30 dark:bg-blue-900/10 rounded-2xl flex items-start gap-3 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                        <div className="p-2 bg-blue-500 rounded-lg text-white shadow-lg shadow-blue-500/20">
                            <ShieldAlert className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="font-bold text-sm text-blue-800 dark:text-blue-400">2. Deuda Senior Quirografaria (Unsecured)</h4>
                            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Bonos y papel comercial tradicional sin garantía específica.</p>
                        </div>
                    </div>

                    {/* Deuda Subordinada */}
                    <div className="p-4 border border-amber-500/20 bg-amber-50/30 dark:bg-amber-900/10 rounded-2xl flex items-start gap-3 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors">
                        <div className="p-2 bg-amber-500 rounded-lg text-white shadow-lg shadow-amber-500/20">
                            <AlertTriangle className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="font-bold text-sm text-amber-800 dark:text-amber-400">3. Deuda Subordinada (Mezzanine)</h4>
                            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Cobran después de toda la deuda senior. Alto interés.</p>
                        </div>
                    </div>

                    {/* Capital Preferente */}
                    <div className="p-4 border border-orange-500/20 bg-orange-50/30 dark:bg-orange-900/10 rounded-2xl flex items-start gap-3 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors">
                        <div className="p-2 bg-orange-500 rounded-lg text-white shadow-lg shadow-orange-500/20">
                            <TrendingUp className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="font-bold text-sm text-orange-800 dark:text-orange-400">4. Capital Preferente (Fixed-Income Equity)</h4>
                            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Dividendos fijos priorizados sobre acciones comunes.</p>
                        </div>
                    </div>

                    {/* Capital Común */}
                    <div className="p-4 border border-rose-500/20 bg-rose-50/30 dark:bg-rose-900/10 rounded-2xl flex items-start gap-3 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors">
                        <div className="p-2 bg-rose-500 rounded-lg text-white shadow-lg shadow-rose-500/20">
                            <TrendingUp className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="font-bold text-sm text-rose-800 dark:text-rose-400">5. Capital Común (Common Equity)</h4>
                            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Dueños residuales. Mayor potencial de ganancia y mayor riesgo.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function LandmarkIcon({ className }: { className?: string }) {
    return (
        <svg fill="currentColor" viewBox="0 0 24 24" className={className}>
            <path d="M12 1L2 6v2h20V6L12 1zm5 10v8h3v-8h-3zm-5 0v8h3v-8h-3zm-5 0v8h3v-8H7zm-5 9v2h20v-2H2z" />
        </svg>
    );
}

