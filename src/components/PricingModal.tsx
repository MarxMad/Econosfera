"use client";

import { X, Check, Zap } from "lucide-react";

interface PricingModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function PricingModal({ isOpen, onClose }: PricingModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-200 dark:border-slate-800">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="p-8">
                    <div className="flex items-center gap-2 text-blue-600 font-bold text-sm uppercase tracking-wider mb-2">
                        <Zap className="w-4 h-4 fill-current" />
                        Necesitas Estudiante Pro
                    </div>
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-4">
                        Desbloquea más créditos y exportaciones
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400 mb-6">
                        Has alcanzado el límite gratuito. Con <strong>Estudiante Pro por $4.99/mes</strong> obtienes 50 créditos IA y exportaciones PDF ilimitadas.
                    </p>

                    <div className="space-y-3 mb-6">
                        <div className="flex items-center gap-3">
                            <div className="p-1 bg-emerald-100 dark:bg-emerald-900/30 rounded-full">
                                <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <p className="font-medium text-slate-800 dark:text-slate-200">50 créditos IA al mes (análisis de minutas)</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="p-1 bg-emerald-100 dark:bg-emerald-900/30 rounded-full">
                                <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <p className="font-medium text-slate-800 dark:text-slate-200">Exportaciones PDF ilimitadas</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="p-1 bg-emerald-100 dark:bg-emerald-900/30 rounded-full">
                                <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <p className="font-medium text-slate-800 dark:text-slate-200">DCF, Black-Scholes y simuladores cripto</p>
                        </div>
                    </div>

                    <div className="flex gap-3 mb-6">
                        <div className="flex-1 bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-4 border border-blue-100 dark:border-blue-900/40">
                            <p className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">Pro mensual</p>
                            <p className="text-2xl font-black text-slate-900 dark:text-white">$4.99<span className="text-sm font-normal text-slate-500">/mes</span></p>
                        </div>
                        <div className="flex-1 bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 border border-slate-200 dark:border-slate-700">
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pro anual</p>
                            <p className="text-2xl font-black text-slate-900 dark:text-white">$49<span className="text-sm font-normal text-slate-500">/año</span></p>
                            <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">2 meses gratis</p>
                        </div>
                    </div>

                    <button
                        className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-lg shadow-blue-500/20 transition-all active:scale-[0.98]"
                        onClick={() => window.location.href = "/pricing"}
                    >
                        Ver planes y suscribirme
                    </button>

                    <p className="text-center text-[10px] text-slate-400 mt-4 uppercase tracking-widest font-bold">
                        Pago seguro con Stripe • Cancela cuando quieras
                    </p>
                </div>
            </div>
        </div>
    );
}
