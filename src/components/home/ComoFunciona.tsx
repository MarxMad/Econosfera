"use client";

import { UserPlus, MousePointer2, FileDown } from "lucide-react";

const PASOS = [
  {
    id: 1,
    label: "Crea tu cuenta",
    desc: "Regístrate gratis en segundos. Sin tarjeta de crédito para empezar.",
    icon: UserPlus,
  },
  {
    id: 2,
    label: "Elige un modelo",
    desc: "Navega entre Finanzas, Macro, Monetaria, Blockchain y más. Más de 60 simuladores.",
    icon: MousePointer2,
  },
  {
    id: 3,
    label: "Exporta tu reporte",
    desc: "Genera PDFs profesionales con gráficos y análisis listos para tus entregas.",
    icon: FileDown,
  },
];

export default function ComoFunciona() {
  return (
    <section className="py-20 sm:py-28 bg-white dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">
            Cómo funciona
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-lg max-w-2xl mx-auto">
            Tres pasos para pasar de la teoría a un reporte profesional.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {PASOS.map((paso, i) => {
            const Icon = paso.icon;
            return (
              <div key={paso.id} className="relative">
                {i < PASOS.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-[calc(50%+3rem)] w-full h-0.5 bg-gradient-to-r from-indigo-300 to-transparent dark:from-indigo-700" />
                )}
                <div className="relative z-10 flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-2xl bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center mb-6 border-2 border-indigo-200 dark:border-indigo-800">
                    <Icon className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <span className="text-xs font-black uppercase tracking-widest text-indigo-500 dark:text-indigo-400 mb-2">
                    Paso {paso.id}
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                    {paso.label}
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-xs">
                    {paso.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
