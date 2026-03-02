import Link from "next/link";
import { Lock, ArrowRight, BookOpen } from "lucide-react";

interface BlogPaywallProps {
  /** Si true, mensaje orientado a un artículo concreto */
  forArticle?: boolean;
}

export default function BlogPaywall({ forArticle = false }: BlogPaywallProps) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full rounded-3xl border border-amber-200 dark:border-amber-900/50 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-slate-900 p-8 md:p-12 text-center shadow-xl">
        <div className="inline-flex p-4 rounded-2xl bg-amber-100 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 mb-6">
          <Lock className="w-12 h-12 text-amber-600 dark:text-amber-400" />
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-200/50 dark:bg-amber-800/30 text-amber-800 dark:text-amber-200 text-sm font-medium mb-4">
          <BookOpen className="w-4 h-4" />
          Blog premium
        </div>
        <h1 className="text-xl md:text-2xl font-black text-slate-800 dark:text-white mb-2">
          {forArticle ? "Este artículo es exclusivo para suscriptores" : "El blog es exclusivo para suscriptores"}
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mb-8">
          Los artículos del blog están disponibles para usuarios con plan <strong>Estudiante Pro</strong> o <strong>Researcher</strong>. Actualiza tu plan para leer análisis, referencias y cuadros preparados para economistas.
        </p>
        <Link
          href="/pricing"
          className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl shadow-lg transition-all hover:-translate-y-0.5"
        >
          Ver planes y precios
          <ArrowRight className="w-4 h-4" />
        </Link>
        <p className="mt-6 text-sm text-slate-500 dark:text-slate-400">
          ¿Ya tienes plan Pro? <Link href="/auth/signin" className="font-medium text-amber-600 dark:text-amber-400 hover:underline">Inicia sesión</Link>
        </p>
      </div>
    </div>
  );
}
