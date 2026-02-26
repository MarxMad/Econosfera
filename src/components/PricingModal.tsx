"use client";

import { X, Check, Zap, Shield, Star } from "lucide-react";

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
                        Límite Alcanzado
                    </div>
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-4">
                        Pásate a Pro y desbloquea todo el potencial
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400 mb-8">
                        Has alcanzado el límite de exportaciones gratuitas mensuales. Suscríbete para obtener descargas ilimitadas y análisis de IA avanzados.
                    </p>

                    <div className="space-y-4 mb-8">
                        <div className="flex items-start gap-3">
                            <div className="mt-1 p-1 bg-emerald-100 dark:bg-emerald-900/30 rounded-full">
                                <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <div>
                                <p className="font-bold text-slate-800 dark:text-slate-200">Exportaciones PDF Ilimitadas</p>
                                <p className="text-sm text-slate-500">Descarga todos los escenarios que necesites sin restricciones.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="mt-1 p-1 bg-emerald-100 dark:bg-emerald-900/30 rounded-full">
                                <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <div>
                                <p className="font-bold text-slate-800 dark:text-slate-200">Créditos de IA Extra</p>
                                <p className="text-sm text-slate-500">Acceso a análisis profundos de Banxico e interpretación de mercado.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="mt-1 p-1 bg-emerald-100 dark:bg-emerald-900/30 rounded-full">
                                <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <div>
                                <p className="font-bold text-slate-800 dark:text-slate-200">Datos en Tiempo Real</p>
                                <p className="text-sm text-slate-500">Conexión con APIs bursátiles para valuaciones automáticas.</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 mb-8">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-sm font-medium text-slate-500">Suscripción Anual</p>
                                <p className="text-3xl font-black text-slate-900 dark:text-white">$49 <span className="text-sm font-normal text-slate-500">/ año</span></p>
                            </div>
                            <div className="px-3 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 text-xs font-bold rounded-full uppercase">
                                Ahorra 20%
                            </div>
                        </div>
                    </div>

                    <button
                        className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-lg shadow-blue-500/20 transition-all active:scale-[0.98]"
                        onClick={() => window.location.href = "/pricing"}
                    >
                        Suscribirme Ahora
                    </button>

                    <p className="text-center text-[10px] text-slate-400 mt-4 uppercase tracking-widest font-bold">
                        Pago seguro con Stripe • Cancela cuando quieras
                    </p>
                </div>
            </div>
        </div>
    );
}
