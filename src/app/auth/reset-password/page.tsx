"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Lock, Mail, KeyRound, ArrowLeft, CheckCircle2, Eye, EyeOff } from "lucide-react";

function ResetPasswordContent() {
    const searchParams = useSearchParams();
    const emailParam = searchParams.get("email") || "";
    const [email, setEmail] = useState(emailParam);
    const [code, setCode] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        if (newPassword !== confirmPassword) {
            setError("Las contraseñas no coinciden.");
            return;
        }
        if (newPassword.length < 8) {
            setError("La contraseña debe tener al menos 8 caracteres.");
            return;
        }
        setLoading(true);
        try {
            const res = await fetch("/api/auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: email.trim().toLowerCase(),
                    code: code.trim(),
                    newPassword,
                }),
            });
            const data = await res.json();
            if (res.ok && data.success) {
                setSuccess(true);
            } else {
                setError(data.error || "Error al restablecer la contraseña.");
            }
        } catch {
            setError("Error de conexión. Intenta de nuevo.");
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center p-4">
                <div className="w-full max-w-md space-y-8 bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Contraseña actualizada</h2>
                        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                            Ya puedes iniciar sesión con tu nueva contraseña.
                        </p>
                    </div>
                    <Link
                        href="/auth/signin"
                        className="block w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-center transition-all"
                    >
                        Ir a iniciar sesión
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-[80vh] flex items-center justify-center p-4">
            <div className="w-full max-w-md space-y-8 bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800">
                <div className="text-center">
                    <img src="/logos.svg" alt="Econosfera" className="w-16 h-16 mx-auto mb-4 object-contain" />
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Restablecer contraseña</h2>
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                        Ingresa el código que recibiste por correo y tu nueva contraseña.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
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
                    <div>
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1 block">Código de 6 dígitos</label>
                        <div className="relative">
                            <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                type="text"
                                required
                                maxLength={6}
                                value={code}
                                onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all text-center tracking-[0.5em] font-mono text-lg"
                                placeholder="000000"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1 block">Nueva contraseña</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                type={showPassword ? "text" : "password"}
                                required
                                minLength={8}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full pl-10 pr-12 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                placeholder="Mínimo 8 caracteres"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>
                    <div>
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1 block">Confirmar contraseña</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                type={showPassword ? "text" : "password"}
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                placeholder="Repite la contraseña"
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-lg shadow-blue-600/30 transition-all active:scale-[0.98] disabled:opacity-50"
                    >
                        {loading ? "Actualizando…" : "Restablecer contraseña"}
                    </button>
                </form>

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

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={
            <div className="min-h-[80vh] flex items-center justify-center p-4">
                <div className="w-full max-w-md text-center p-8 text-slate-500 dark:text-slate-400">Cargando…</div>
            </div>
        }>
            <ResetPasswordContent />
        </Suspense>
    );
}
