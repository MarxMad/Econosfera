"use client";

import Link from "next/link";
import { ClipboardCheck, ArrowRight } from "lucide-react";

export default function BannerCuestionarios() {
  return (
    <Link
      href="/cuestionarios"
      className="block rounded-2xl border border-indigo-200 dark:border-indigo-800 bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-950/50 dark:to-blue-950/30 p-5 hover:border-indigo-400 dark:hover:border-indigo-600 hover:shadow-lg transition-all group"
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center group-hover:scale-105 transition-transform">
            <ClipboardCheck className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <p className="font-bold text-slate-900 dark:text-white">¿Pusiste a prueba lo que aprendiste?</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Resuelve cuestionarios por módulo y gana XP.</p>
          </div>
        </div>
        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-bold group-hover:bg-indigo-500 transition-colors">
          Ir a cuestionarios
          <ArrowRight className="w-4 h-4" />
        </span>
      </div>
    </Link>
  );
}
