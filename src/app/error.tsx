"use client";

import { useEffect } from "react";
import { RefreshCcw, AlertTriangle } from "lucide-react";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Aquí podrías enviar el error a un servicio de monitoreo como Sentry
        console.error(error);
    }, [error]);

    return (
        <div className="min-h-[80vh] flex items-center justify-center p-4">
            <div className="max-w-md w-full text-center">
                <div className="w-20 h-20 bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
                    <AlertTriangle className="w-10 h-10" />
                </div>

                <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-3">Algo no salió como esperábamos</h1>
                <p className="text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
                    Hubo un error crítico en la ejecución del simulador. Hemos registrado el incidente para solucionarlo.
                </p>

                <div className="flex flex-col gap-3">
                    <button
                        onClick={() => reset()}
                        className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-2xl hover:shadow-lg transition-all active:scale-[0.98]"
                    >
                        <RefreshCcw className="w-4 h-4" />
                        Intentar de nuevo
                    </button>
                    <a
                        href="/"
                        className="text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors"
                    >
                        Ir a la página principal
                    </a>
                </div>

                {process.env.NODE_ENV === "development" && (
                    <div className="mt-8 p-4 bg-slate-100 dark:bg-slate-800 rounded-xl text-left overflow-auto max-h-40">
                        <p className="text-[10px] font-mono text-slate-500">{error.message}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
