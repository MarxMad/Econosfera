"use client";

import Link from "next/link";
import { Home, AlertCircle, ChevronLeft } from "lucide-react";

export default function NotFound() {
    return (
        <div className="min-h-[80vh] flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-950">
            <div className="max-w-md w-full text-center">
                <div className="relative mb-8">
                    <div className="absolute inset-0 bg-blue-500/10 blur-3xl rounded-full" />
                    <div className="relative w-24 h-24 bg-white dark:bg-slate-900 rounded-3xl shadow-xl flex items-center justify-center mx-auto border border-slate-200 dark:border-slate-800">
                        <AlertCircle className="w-12 h-12 text-blue-500" />
                    </div>
                </div>

                <h1 className="text-6xl font-black text-slate-900 dark:text-white mb-4">404</h1>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-6 tracking-tight">
                    Oops, perdimos el equilibrio.
                </h2>
                <p className="text-slate-500 dark:text-slate-400 mb-10 leading-relaxed">
                    La página que buscas ha sido desplazada del mercado o nunca existió en nuestro modelo económico.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        href="/"
                        className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-500 shadow-lg shadow-blue-600/20 transition-all hover:-translate-y-0.5"
                    >
                        <Home className="w-4 h-4" />
                        Volver al inicio
                    </Link>
                    <button
                        onClick={() => window.history.back()}
                        className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold rounded-2xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Regresar
                    </button>
                </div>
            </div>
        </div>
    );
}
