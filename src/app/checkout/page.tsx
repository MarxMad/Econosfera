"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Shield, Lock, CreditCard, ChevronLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { processPayment } from "@/lib/actions/paymentActions";
import { Suspense } from "react";

function CheckoutForm() {
    const searchParams = useSearchParams();
    const plan = searchParams.get("plan") || "student";
    const { data: session, status } = useSession();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [useStripe, setUseStripe] = useState<boolean | null>(null);
    const [stripeError, setStripeError] = useState<string | null>(null);

    // Redirigir a Stripe Checkout si está configurado y el usuario está logueado
    useEffect(() => {
        if (status !== "authenticated" || !session?.user) {
            setUseStripe(false);
            setStripeError(null);
            return;
        }
        setStripeError(null);
        let cancelled = false;
        (async () => {
            try {
                const res = await fetch("/api/stripe/create-checkout-session", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ plan: plan === "researcher" ? "researcher" : "student" }),
                });
                const data = await res.json();
                if (cancelled) return;
                if (res.ok && data.url) {
                    setUseStripe(true);
                    window.location.href = data.url;
                    return;
                }
                setUseStripe(false);
                setStripeError(data?.error || (res.status === 429 ? "Demasiados intentos. Espera un momento." : "No se pudo conectar con la pasarela de pago."));
            } catch {
                setUseStripe(false);
                setStripeError("Error de conexión. Revisa tu internet e intenta de nuevo.");
            }
        })();
        return () => { cancelled = true; };
    }, [status, session?.user, plan]);

    const handlePaymentMock = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        await new Promise((r) => setTimeout(r, 1500));
        const res = await processPayment(plan);
        setLoading(false);
        if (res.success) setSuccess(true);
        else alert(res.error || "Algo salió mal.");
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

    // Mientras intentamos Stripe o no hay sesión
    if (useStripe === null || useStripe === true) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-10">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
                    <p className="text-slate-600 dark:text-slate-400 font-medium">Redirigiendo a la pasarela de pago segura…</p>
                    {!session && (
                        <p className="text-sm text-slate-500 mt-2">Si no eres redirigido, <Link href="/auth/signin" className="text-blue-600 font-bold">inicia sesión</Link> primero.</p>
                    )}
                </div>
            </div>
        );
    }

    // Stripe no configurado o falló: formulario mock (desarrollo)
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                <Link href="/pricing" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white mb-8 transition-colors">
                    <ChevronLeft className="w-4 h-4" />
                    Volver a planes
                </Link>

                {stripeError && (
                    <div className="mb-6 p-4 bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 rounded-2xl text-rose-800 dark:text-rose-200 text-sm">
                        <div className="flex items-start gap-3">
                            <Shield className="w-5 h-5 shrink-0 mt-0.5" />
                            <div className="flex-1">
                                <p className="font-bold mb-1">Error en la pasarela de pago</p>
                                <p>{stripeError}</p>
                                {session && (
                                    <p className="mt-2 text-xs opacity-90">
                                        Si Stripe está configurado en el servidor, verifica las variables de entorno (STRIPE_SECRET_KEY, STRIPE_PRICE_PRO, etc.).
                                    </p>
                                )}
                            </div>
                        </div>
                        {session && (
                            <button
                                type="button"
                                onClick={() => {
                                    setStripeError(null);
                                    fetch("/api/stripe/create-checkout-session", {
                                        method: "POST",
                                        headers: { "Content-Type": "application/json" },
                                        body: JSON.stringify({ plan: plan === "researcher" ? "researcher" : "student" }),
                                    })
                                        .then((r) => r.json())
                                        .then((d) => {
                                            if (d?.url) window.location.href = d.url;
                                            else setStripeError(d?.error || "Error al crear la sesión.");
                                        })
                                        .catch(() => setStripeError("Error de conexión."));
                                }}
                                className="mt-3 text-xs font-bold text-rose-700 dark:text-rose-300 hover:underline"
                            >
                                Reintentar con Stripe
                            </button>
                        )}
                    </div>
                )}

                <div className="grid md:grid-cols-5 gap-8">
                    <div className="md:col-span-3">
                        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-lg">
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8 flex items-center gap-3">
                                <CreditCard className="w-6 h-6 text-blue-500" />
                                Detalles del Pago
                            </h2>

                            <form onSubmit={handlePaymentMock} className="space-y-6">
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

                                <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-2xl border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200 text-xs">
                                    Modo desarrollo: el pago no se cobra. Configura Stripe en Vercel para usar la pasarela real.
                                </div>

                                <button disabled={loading} className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black rounded-2xl flex items-center justify-center gap-2 hover:shadow-xl transition-all disabled:opacity-50">
                                    {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                                    {loading ? "Procesando…" : `Pagar MXN ${plan === "researcher" ? "199" : "99"}`}
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
                                        <p className="font-bold text-slate-800 dark:text-slate-200 uppercase text-xs">Plan</p>
                                        <p className="text-slate-500">{plan === "researcher" ? "Investigador" : "Estudiante Pro"}</p>
                                    </div>
                                    <p className="font-bold text-slate-900 dark:text-white">MXN {plan === "researcher" ? "199" : "99"}</p>
                                </div>
                            </div>
                            <div className="flex justify-between items-center mb-8">
                                <p className="text-xl font-black text-slate-900 dark:text-white">Total</p>
                                <p className="text-xl font-black text-blue-600">MXN {plan === "researcher" ? "199" : "99"}/mes</p>
                            </div>
                            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
                                <li className="flex items-center gap-2"><Shield className="w-3 h-3 text-emerald-500" /> Exportaciones ilimitadas</li>
                                <li className="flex items-center gap-2"><Shield className="w-3 h-3 text-emerald-500" /> {plan === "researcher" ? "100" : "50"} créditos IA/mes</li>
                                <li className="flex items-center gap-2"><Shield className="w-3 h-3 text-emerald-500" /> Modelos premium</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function CheckoutPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-10">Cargando…</div>}>
            <CheckoutForm />
        </Suspense>
    );
}
