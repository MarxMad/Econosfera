"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Shield, Lock, CreditCard, ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function CheckoutPage() {
    const searchParams = useSearchParams();
    const plan = searchParams.get("plan");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handlePayment = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Simular procesamiento de pago
        setTimeout(() => {
            setLoading(false);
            setSuccess(true);
        }, 2000);
    };

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-950">
                <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-xl text-center">
                    <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Shield className="w-10 h-10" />
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-4">¡Suscripción Exitosa!</h1>
                    <p className="text-slate-500 dark:text-slate-400 mb-8">
                        Bienvenido a Econosfera Pro. Tus beneficios han sido activados en tu cuenta.
                    </p>
                    <Link href="/dashboard" className="block w-full py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all">
                        Ir a mi Dashboard
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                <Link href="/pricing" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white mb-8 transition-colors">
                    <ChevronLeft className="w-4 h-4" />
                    Volver a planes
                </Link>

                <div className="grid md:grid-cols-5 gap-8">
                    <div className="md:col-span-3">
                        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-lg">
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8 flex items-center gap-3">
                                <CreditCard className="w-6 h-6 text-blue-500" />
                                Detalles del Pago
                            </h2>

                            <form onSubmit={handlePayment} className="space-y-6">
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Nombre en la tarjeta</label>
                                    <input required type="text" className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white" placeholder="EJ. JUAN PÉREZ" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Número de tarjeta</label>
                                    <div className="relative">
                                        <input required type="text" className="w-full p-4 pl-12 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white" placeholder="0000 0000 0000 0000" />
                                        <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Vencimiento</label>
                                        <input required type="text" className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white" placeholder="MM/YY" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">CVC</label>
                                        <input required type="text" className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white" placeholder="123" />
                                    </div>
                                </div>

                                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-900/30 flex items-start gap-3">
                                    <Lock className="w-4 h-4 text-blue-600 mt-1" />
                                    <p className="text-xs text-blue-700 dark:text-blue-400 leading-relaxed">
                                        Tus datos están protegidos por encriptación de grado bancario (AES-256). No almacenamos tus datos sensibles.
                                    </p>
                                </div>

                                <button disabled={loading} className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black rounded-2xl hover:shadow-xl transition-all disabled:opacity-50">
                                    {loading ? "Procesando..." : `Pagar $${plan === 'student' ? '4.99' : '12.99'}`}
                                </button>
                            </form>
                        </div>
                    </div>

                    <div className="md:col-span-2">
                        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-lg sticky top-8">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Resumen</h3>
                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-800">
                                    <div>
                                        <p className="font-bold text-slate-800 dark:text-slate-200 uppercase text-xs">Plan Seleccionado</p>
                                        <p className="text-slate-500">{plan === 'student' ? 'Estudiante Pro' : 'Investigador'}</p>
                                    </div>
                                    <p className="font-bold text-slate-900 dark:text-white">${plan === 'student' ? '4.99' : '12.99'}</p>
                                </div>
                                <div className="flex justify-between items-center">
                                    <p className="text-slate-500">Impuestos (IVA)</p>
                                    <p className="text-slate-900 dark:text-white">$0.00</p>
                                </div>
                            </div>
                            <div className="flex justify-between items-center mb-8">
                                <p className="text-xl font-black text-slate-900 dark:text-white">Total a pagar</p>
                                <p className="text-xl font-black text-blue-600">${plan === 'student' ? '4.99' : '12.99'}</p>
                            </div>

                            <div className="space-y-4">
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Incluye:</p>
                                <ul className="space-y-2">
                                    <li className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                                        <Shield className="w-3 h-3 text-emerald-500" /> Exportaciones Ilimitadas
                                    </li>
                                    <li className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                                        <Shield className="w-3 h-3 text-emerald-500" /> {plan === 'student' ? '25 Créditos IA' : 'IA Ilimitada'}
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
