"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, Send, CheckCircle2 } from "lucide-react";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [sent, setSent] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const res = await fetch("/api/auth/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });
            const data = await res.json();
            if (res.ok && data.success) {
                setSent(true);
            } else {
                setError(data.error || "Error al enviar el correo.");
            }
        } catch {
            setError("Error de conexión. Intenta de nuevo.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center p-4">
            <div className="w-full max-w-md space-y-8 bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800">
                <div className="text-center">
                    <img src="/logos.svg" alt="Econosfera" className="w-16 h-16 mx-auto mb-4 object-contain" />
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">¿Olvidaste tu contraseña?</h2>
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                        Ingresa tu correo y te enviaremos un código de 6 dígitos para restablecerla.
                    </p>
                </div>

                {sent ? (
                    <div className="space-y-4">
                        <div className="p-4 text-sm text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl flex items-center gap-3">
                            <CheckCircle2 className="w-6 h-6 flex-shrink-0" />
                            <div>
                                <p className="font-bold">Revisa tu correo</p>
                                <p className="mt-1">Si el correo está registrado, recibirás un código en unos minutos. El código es válido 15 minutos.</p>
                            </div>
                        </div>
                        <Link
                            href={`/auth/reset-password${email ? `?email=${encodeURIComponent(email)}` : ""}`}
                            className="block w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-center transition-all"
                        >
                            Ingresar código
                        </Link>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                                {error}
                            </div>
                        )}
                        <div>
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1 block">Correo electrónico</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    placeholder="ejemplo@correo.com"
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-lg shadow-blue-600/30 transition-all active:scale-[0.98] disabled:opacity-50"
                        >
                            {loading ? "Enviando…" : <><Send className="w-5 h-5" /> Enviar código</>}
                        </button>
                    </form>
                )}

                <Link
                    href="/auth/signin"
                    className="flex items-center justify-center gap-2 text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Volver al inicio de sesión
                </Link>
            </div>
        </div>
    );
}
