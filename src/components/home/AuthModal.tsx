"use client";

import { X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    if (!mounted || !isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="relative w-full max-w-md bg-slate-900 border border-slate-700/50 rounded-3xl shadow-2xl p-8 animate-in zoom-in-95 duration-200">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="text-center mb-8">
                    <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center font-bold text-2xl mx-auto mb-4 shadow-lg shadow-blue-600/30">
                        E
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Acceso a Simuladores</h2>
                    <p className="text-slate-400 text-sm">
                        Para guardar tus escenarios y usar la Inteligencia Artificial, necesitas una cuenta gratis.
                    </p>
                </div>

                <div className="space-y-4">
                    <Link
                        href="/auth/register"
                        className="flex items-center justify-center w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-600/20 transition-all active:scale-[0.98]"
                    >
                        Crear cuenta gratis
                    </Link>
                    <Link
                        href="/auth/signin"
                        className="flex items-center justify-center w-full py-3.5 px-4 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-all active:scale-[0.98]"
                    >
                        Ya tengo cuenta
                    </Link>
                </div>

                <div className="mt-6 text-center">
                    <p className="text-xs text-slate-500">
                        Al registrarte aceptas nuestros <Link href="/terminos-condiciones" className="text-blue-400 hover:underline">Términos y Condiciones</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
