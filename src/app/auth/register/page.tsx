"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { User, Mail, Lock, ArrowRight, CheckCircle2, Eye, EyeOff, GraduationCap } from "lucide-react";
import { registerUser } from "@/lib/actions/authActions";

export default function RegisterPage() {
    const { status } = useSession();
    const [formData, setFormData] = useState({ name: "", lastName: "", email: "", institution: "", password: "", confirmPassword: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (status === "authenticated") {
            router.push("/dashboard");
        }
    }, [status, router]);

    const passwordsMatch = formData.password === formData.confirmPassword;
    const showPasswordError = formData.confirmPassword.length > 0 && !passwordsMatch;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!passwordsMatch) {
            setError("Las contraseñas no coinciden");
            return;
        }

        setLoading(true);
        setError("");

        const data = new FormData();
        data.append("name", formData.name);
        data.append("lastName", formData.lastName);
        data.append("email", formData.email);
        data.append("institution", formData.institution);
        data.append("password", formData.password);

        const res = await registerUser(data);

        if (res.error) {
            setError(res.error);
            setLoading(false);
        } else {
            setSuccess(true);
            setTimeout(() => router.push("/auth/signin"), 2000);
        }
    };

    if (success) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center p-4">
                <div className="w-full max-w-md text-center space-y-4">
                    <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto animate-bounce" />
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white">¡Cuenta creada!</h2>
                    <p className="text-slate-500 dark:text-slate-400">Redirigiéndote al inicio de sesión...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-[80vh] flex items-center justify-center p-4">
            <div className="w-full max-w-md space-y-8 bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Únete a Econosfera</h2>
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Guarda tus escenarios y accede a análisis avanzados</p>
                </div>

                <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
                    {error && (
                        <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1 block">Nombre</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                        placeholder="Tu nombre"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1 block">Apellidos</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        required
                                        value={formData.lastName}
                                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                        placeholder="Tus apellidos"
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1 block">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    placeholder="ejemplo@correo.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1 block">Institución Educativa</label>
                            <div className="relative">
                                <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="text"
                                    value={formData.institution}
                                    onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    placeholder="Ej. UNAM, ITAM..."
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1 block">Contraseña</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full pl-10 pr-12 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    placeholder="Mínimo 8 caracteres"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between items-end mb-1">
                                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">Confirmar Contraseña</label>
                                {showPasswordError && <span className="text-xs font-bold text-red-500">Las contraseñas no coinciden</span>}
                            </div>
                            <div className="relative">
                                <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${showPasswordError ? 'text-red-400' : 'text-slate-400'}`} />
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    required
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    className={`w-full pl-10 pr-12 py-3 rounded-xl border bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 outline-none transition-all ${showPasswordError ? 'border-red-400 focus:ring-red-500' : 'border-slate-200 dark:border-slate-700 focus:ring-blue-500'}`}
                                    placeholder="Vuelve a escribir la contraseña"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                                >
                                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-lg shadow-blue-600/30 transition-all active:scale-98 disabled:opacity-50"
                    >
                        {loading ? "Creando cuenta..." : "Crear mi Cuenta"}
                    </button>
                </form>

                <p className="text-center text-sm text-slate-600 dark:text-slate-400">
                    ¿Ya tienes cuenta?{" "}
                    <Link href="/auth/signin" className="font-bold text-blue-600 hover:text-blue-500">
                        Inicia sesión <ArrowRight className="inline w-4 h-4" />
                    </Link>
                </p>
            </div>
        </div>
    );
}
