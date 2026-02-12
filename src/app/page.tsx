"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950">
      <section className="relative min-h-[85vh] flex flex-col items-center justify-center bg-gradient-to-br from-[#0f172a] via-[#1e3a5f] to-[#1d3557] text-white overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(59,130,246,0.15),transparent)]" aria-hidden />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0f172a]/80 to-transparent" aria-hidden />
        <div className="relative z-10 max-w-2xl mx-auto px-4 text-center">
          <img
            src="/logos.svg"
            alt="Econosfera"
            className="h-24 sm:h-28 md:h-32 w-auto mx-auto mb-6 drop-shadow-lg"
            width={128}
            height={128}
          />
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white mb-3">
            Econosfera
          </h1>
          <p className="text-slate-300 text-lg sm:text-xl mb-2">
            Inflación, macro y micro. Simuladores y prácticas para economía.
          </p>
          <p className="text-slate-400 text-sm sm:text-base mb-10">
            Datos de referencia · Fuentes oficiales · Exportar y compartir
          </p>
          <Link
            href="/simulador"
            className="inline-flex items-center justify-center px-10 py-5 text-xl sm:text-2xl font-bold tracking-wide rounded-2xl bg-amber-400 text-slate-900 shadow-lg shadow-amber-400/30 hover:bg-amber-300 hover:shadow-amber-400/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-amber-400/50"
          >
            PROBAR
          </Link>
        </div>
      </section>
    </div>
  );
}
