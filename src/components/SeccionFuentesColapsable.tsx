"use client";

import { useState } from "react";
import { ChevronDown, Library } from "lucide-react";

interface SeccionFuentesColapsableProps {
  titulo?: string;
  /** Si es true, la sección empieza abierta */
  defaultAbierto?: boolean;
  children: React.ReactNode;
}

export default function SeccionFuentesColapsable({
  titulo = "Fuentes oficiales y referencias para profundizar",
  defaultAbierto = false,
  children,
}: SeccionFuentesColapsableProps) {
  const [abierto, setAbierto] = useState(defaultAbierto);

  return (
    <div className="mb-6 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 shadow-lg overflow-hidden">
      <button
        type="button"
        onClick={() => setAbierto(!abierto)}
        className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
        aria-expanded={abierto}
      >
        <span className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-100">
          <Library className="w-6 h-6 text-slate-600 dark:text-slate-400 flex-shrink-0" aria-hidden />
          {titulo}
        </span>
        <ChevronDown
          className={`w-6 h-6 text-slate-500 dark:text-slate-400 flex-shrink-0 transition-transform duration-200 ${abierto ? "rotate-180" : ""}`}
          aria-hidden
        />
      </button>
      {abierto && (
        <div className="px-4 pb-4 pt-4 border-t border-slate-200 dark:border-slate-700">
          <div className="space-y-6">
            {children}
          </div>
        </div>
      )}
    </div>
  );
}
