"use client";

import Link from "next/link";
import { Award, ArrowLeft } from "lucide-react";
import type { EventoNobel } from "@/lib/teoriasEconomicas";

interface PremiosNobelContentProps {
  nobeles: EventoNobel[];
}

export default function PremiosNobelContent({ nobeles }: PremiosNobelContentProps) {
  return (
    <article className="space-y-8">
      <header className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-slate-900 dark:to-slate-900 p-8 shadow-sm">
        <Link
          href="/glosario"
          className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al glosario
        </Link>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mb-3 flex items-center gap-3">
          <Award className="w-10 h-10 text-amber-500" />
          Premios Nobel de Economía
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl">
          Lista completa de galardonados con el Premio Nobel de Ciencias Económicas desde su creación en 1969. 
          Cada entrada incluye el año, los laureados y una breve descripción de sus contribuciones.
        </p>
        <p className="text-sm text-slate-500 dark:text-slate-500 mt-2">
          Referencia: Nobel Prize official. Última actualización: 2024.
        </p>
      </header>

      <section aria-label="Línea de tiempo de premios Nobel">
        <h2 className="sr-only">Línea de tiempo cronológica</h2>
        <div className="relative border-l-2 border-amber-300 dark:border-amber-700 pl-6 sm:pl-8 space-y-6">
          {nobeles.map((nobel, idx) => (
            <article
              key={idx}
              className="relative"
              itemScope
              itemType="https://schema.org/Event"
            >
              <div className="absolute -left-[29px] sm:-left-[33px] top-0 w-6 h-6 rounded-full bg-amber-400 dark:bg-amber-500 flex items-center justify-center shadow-md">
                <Award className="w-3 h-3 text-amber-900" />
              </div>
              <div className="rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50/80 dark:bg-amber-950/30 p-4 sm:p-5 transition-shadow hover:shadow-md">
                <div className="flex flex-wrap items-baseline gap-2 mb-1">
                  <time
                    dateTime={`${nobel.year}-01-01`}
                    className="font-mono text-base font-black text-amber-700 dark:text-amber-400"
                  >
                    {nobel.year}
                  </time>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-200 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300">
                    Nobel Economía
                  </span>
                </div>
                <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100" itemProp="name">
                  Premio Nobel de Ciencias Económicas
                </h3>
                <p
                  className="text-sm text-slate-700 dark:text-slate-300 mt-0.5 font-semibold"
                  itemProp="performer"
                >
                  {nobel.autor}
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2" itemProp="description">
                  {nobel.descripcion}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <footer className="pt-8 border-t border-slate-200 dark:border-slate-800">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Fuente:{" "}
          <a
            href="https://www.nobelprize.org/prizes/economic-sciences/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-amber-600 dark:text-amber-400 hover:underline font-medium"
          >
            Nobel Prize – Economic Sciences
          </a>
        </p>
        <Link
          href="/glosario"
          className="inline-flex items-center gap-2 mt-4 text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          Ver glosario completo
        </Link>
      </footer>
    </article>
  );
}
