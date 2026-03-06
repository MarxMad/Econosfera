"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession, signIn } from "next-auth/react";
import Link from "next/link";
import { User, Mail, Lock, ArrowRight, CheckCircle2, Eye, EyeOff, GraduationCap, Phone, Briefcase, Sparkles, Loader2, FileText, ShieldCheck } from "lucide-react";
import { registerUser } from "@/lib/actions/authActions";

export default function RegisterPage() {
    const { status } = useSession();
    const [consentStep, setConsentStep] = useState(true); // true = pantalla de aceptación; false = formulario
    const [acceptTerms, setAcceptTerms] = useState(false);
    const [acceptPrivacy, setAcceptPrivacy] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        lastName: "",
        email: "",
        institution: "",
        phone: "",
        occupation: "",
        educationLevel: "",
        password: "",
        confirmPassword: "",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [signInError, setSignInError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [resendStatus, setResendStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
    const router = useRouter();

    useEffect(() => {
        if (status === "authenticated") {
            router.push("/dashboard");
        }
    }, [status, router]);

    // Si ya está autenticado, redirigir al dashboard
    useEffect(() => {
        if (status === "authenticated") router.push("/dashboard");
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
        data.append("phone", formData.phone);
        data.append("occupation", formData.occupation);
        data.append("educationLevel", formData.educationLevel);
        data.append("password", formData.password);
        data.append("termsAccepted", "true");
        data.append("privacyAccepted", "true");

        const res = await registerUser(data);

        if (res.error) {
            setError(res.error);
        } else {
            setSuccess(true);
        }
        setLoading(false);
    };

    const handleResendVerification = async () => {
        if (!formData.email) return;
        setResendStatus("sending");
        const res = await import("@/lib/actions/authActions").then((m) => m.resendVerificationByEmail(formData.email));
        if (res.success) {
            setResendStatus("sent");
        } else {
            setResendStatus("error");
        }
    };

    if (success) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center p-4">
                <div className="w-full max-w-md bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 text-center space-y-6">
                    <div className="w-20 h-20 rounded-2xl bg-blue-500/10 dark:bg-blue-500/20 flex items-center justify-center mx-auto border border-blue-200 dark:border-blue-800/50">
                        <Mail className="w-10 h-10 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                            Revisa tu correo
                        </h2>
                        <p className="mt-2 text-slate-600 dark:text-slate-400">
                            Te enviamos un enlace de verificación a <strong className="text-slate-700 dark:text-slate-300">{formData.email}</strong>. Sin verificar tu correo no podrás usar créditos de IA ni exportar reportes.
                        </p>
                    </div>
                    <div className="space-y-3">
                        <button
                            type="button"
                            onClick={handleResendVerification}
                            disabled={resendStatus === "sending"}
                            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
                        >
                            {resendStatus === "sending" && <Loader2 className="w-4 h-4 animate-spin" />}
                            {resendStatus === "sent" ? "Correo reenviado" : resendStatus === "sending" ? "Enviando…" : "Reenviar correo de verificación"}
                        </button>
                        {resendStatus === "error" && (
                            <p className="text-xs text-amber-600 dark:text-amber-400">No se pudo reenviar. Espera unos minutos o intenta más tarde.</p>
                        )}
                        <Link
                            href="/auth/signin"
                            className="block w-full text-center py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-500 transition-colors"
                        >
                            Ir a iniciar sesión <ArrowRight className="inline w-4 h-4 ml-1" />
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // Pantalla de aceptación de términos y aviso de privacidad antes del registro
    if (consentStep) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center p-4">
                <div className="w-full max-w-md space-y-8 bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800">
                    <div className="text-center">
                        <img
                            src="/logos.svg"
                            alt="Econosfera"
                            className="w-16 h-16 mx-auto mb-4 object-contain"
                        />
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Antes de continuar</h2>
                        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Para crear tu cuenta, debes aceptar los siguientes documentos:</p>
                    </div>

                    <div className="space-y-4">
                        <label className="flex items-start gap-3 p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors">
                            <input
                                type="checkbox"
                                checked={acceptTerms}
                                onChange={(e) => setAcceptTerms(e.target.checked)}
                                className="mt-1 w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                            />
                            <div>
                                <span className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                                    <FileText className="w-4 h-4" />
                                    Acepto los Términos y Condiciones
                                </span>
                                <Link href="/terminos-condiciones" target="_blank" className="text-xs text-blue-600 dark:text-blue-400 hover:underline mt-1 block">
                                    Leer documento
                                </Link>
                            </div>
                        </label>

                        <label className="flex items-start gap-3 p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors">
                            <input
                                type="checkbox"
                                checked={acceptPrivacy}
                                onChange={(e) => setAcceptPrivacy(e.target.checked)}
                                className="mt-1 w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                            />
                            <div>
                                <span className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                                    <ShieldCheck className="w-4 h-4" />
                                    Acepto el Aviso de Privacidad
                                </span>
                                <Link href="/aviso-privacidad" target="_blank" className="text-xs text-blue-600 dark:text-blue-400 hover:underline mt-1 block">
                                    Leer documento
                                </Link>
                            </div>
                        </label>
                    </div>

                    <button
                        type="button"
                        onClick={() => setConsentStep(false)}
                        disabled={!acceptTerms || !acceptPrivacy}
                        className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-lg shadow-blue-600/30 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Continuar <ArrowRight className="w-5 h-5" />
                    </button>

                    <p className="text-center text-sm text-slate-600 dark:text-slate-400">
                        ¿Ya tienes cuenta?{" "}
                        <Link href="/auth/signin" className="font-bold text-blue-600 hover:text-blue-500">
                            Inicia sesión
                        </Link>
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-[80vh] flex items-center justify-center p-4">
            <div className="w-full max-w-md space-y-8 bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800">
                <div className="text-center">
                    <button
                        type="button"
                        onClick={() => setConsentStep(true)}
                        className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 mb-2 -mt-2"
                    >
                        ← Volver a términos
                    </button>
                    <img
                        src="/logos.svg"
                        alt="Econosfera"
                        className="w-16 h-16 mx-auto mb-4 object-contain"
                    />
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
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1 block">Teléfono <span className="font-normal text-slate-400">(opcional)</span></label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    placeholder="Ej. +52 55 1234 5678"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1 block">Ocupación <span className="font-normal text-slate-400">(opcional)</span></label>
                            <div className="relative">
                                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="text"
                                    value={formData.occupation}
                                    onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    placeholder="Ej. Estudiante, Economista"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1 block">Nivel de estudios <span className="font-normal text-slate-400">(opcional)</span></label>
                            <div className="relative">
                                <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <select
                                    value={formData.educationLevel}
                                    onChange={(e) => setFormData({ ...formData, educationLevel: e.target.value })}
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                >
                                    <option value="">Seleccionar</option>
                                    <option value="preparatoria">Preparatoria / Bachillerato</option>
                                    <option value="licenciatura">Licenciatura</option>
                                    <option value="maestria">Maestría</option>
                                    <option value="doctorado">Doctorado</option>
                                    <option value="otro">Otro</option>
                                </select>
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

                {process.env.NEXT_PUBLIC_GOOGLE_OAUTH_ENABLED === "true" && (
                    <>
                        <div className="relative my-8">
                            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-200 dark:border-slate-800"></span></div>
                            <div className="relative flex justify-center text-xs uppercase"><span className="bg-white dark:bg-slate-900 px-2 text-slate-500">O regístrate con</span></div>
                        </div>
                        <button
                            type="button"
                            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
                            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all font-medium text-slate-700 dark:text-slate-300"
                        >
                            <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="Google" />
                            Google
                        </button>
                    </>
                )}

                <p className="text-center text-sm text-slate-600 dark:text-slate-400 mt-6">
                    ¿Ya tienes cuenta?{" "}
                    <Link href="/auth/signin" className="font-bold text-blue-600 hover:text-blue-500">
                        Inicia sesión <ArrowRight className="inline w-4 h-4" />
                    </Link>
                </p>
            </div>
        </div>
    );
}
