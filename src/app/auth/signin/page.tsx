"use client";

import { signIn, useSession } from "next-auth/react";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Lock, Mail, ArrowRight, LogIn, Eye, EyeOff, CheckCircle2 } from "lucide-react";

const VERIFY_ERROR_MESSAGES: Record<string, string> = {
    MissingToken: "Faltó el enlace de verificación.",
    InvalidToken: "El enlace expiró o no es válido. Solicita uno nuevo desde el registro.",
    InternalError: "Error al verificar. Intenta de nuevo más tarde.",
};

function SignInContent() {
    const { status } = useSession();
    const searchParams = useSearchParams();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const verified = searchParams.get("verified") === "1";
    const verifyError = searchParams.get("error");

    useEffect(() => {
        if (status === "authenticated") {
            router.push("/simulador");
        }
    }, [status, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const res = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        if (res?.error) {
            const isConfigError = /configuration|server|config/i.test(res.error);
            setError(isConfigError
                ? "Error del servidor. Si eres el administrador, revisa en Vercel que NEXTAUTH_SECRET y NEXTAUTH_URL estén definidos y que la base de datos sea accesible."
                : "Email o contraseña incorrectos");
            setLoading(false);
        } else {
            router.push("/simulador");
            router.refresh();
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center p-4">
            <div className="w-full max-w-md space-y-8 bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800">
                <div className="text-center">
                    <img
                        src="/logos.svg"
                        alt="Econosfera"
                        className="w-16 h-16 mx-auto mb-4 object-contain"
                    />
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Bienvenido de nuevo</h2>
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Inicia sesión en tu cuenta de Econosfera</p>
                </div>

                {verified && (
                    <div className="p-3 text-sm text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                        Tu correo ya está verificado. Inicia sesión para usar tus créditos.
                    </div>
                )}
                {verifyError && (
                    <div className="p-3 text-sm text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
                        {VERIFY_ERROR_MESSAGES[verifyError] || "Error de verificación. Intenta reenviar el correo desde el registro."}
                    </div>
                )}

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {error && (
                        <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div>
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1 block">Email</label>
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
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1 block">Contraseña</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-12 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    placeholder="••••••••"
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
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-lg shadow-blue-600/30 transition-all active:scale-98 disabled:opacity-50"
                    >
                        {loading ? "Entrando..." : <><LogIn className="w-5 h-5" /> Iniciar Sesión</>}
                    </button>
                </form>

                {process.env.NEXT_PUBLIC_GOOGLE_OAUTH_ENABLED === "true" && (
                    <>
                        <div className="relative my-8">
                            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-200 dark:border-slate-800"></span></div>
                            <div className="relative flex justify-center text-xs uppercase"><span className="bg-white dark:bg-slate-900 px-2 text-slate-500">O continúa con</span></div>
                        </div>
                        <button
                            onClick={() => signIn("google", { callbackUrl: "/simulador" })}
                            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all font-medium text-slate-700 dark:text-slate-300"
                        >
                            <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="Google" />
                            Google
                        </button>
                    </>
                )}

                <p className="text-center text-sm text-slate-600 dark:text-slate-400">
                    ¿No tienes cuenta?{" "}
                    <Link href="/auth/register" className="font-bold text-blue-600 hover:text-blue-500">
                        Regístrate ahora <ArrowRight className="inline w-4 h-4" />
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default function SignInPage() {
    return (
        <Suspense fallback={
            <div className="min-h-[80vh] flex items-center justify-center p-4">
                <div className="w-full max-w-md text-center p-8 text-slate-500 dark:text-slate-400">Cargando...</div>
            </div>
        }>
            <SignInContent />
        </Suspense>
    );
}
