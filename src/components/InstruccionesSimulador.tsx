"use client";

import { useState } from "react";
import { Info, ChevronDown, ChevronUp, HelpCircle } from "lucide-react";

interface InstruccionesSimuladorProps {
  titulo?: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export function InstruccionesSimulador({ titulo = "Cómo usar este simulador", children, defaultOpen = false }: InstruccionesSimuladorProps) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="mb-6 rounded-xl border-2 border-blue-200 dark:border-blue-800/70 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/30 shadow-md shadow-blue-100/50 dark:shadow-blue-900/20 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-2 px-4 py-3.5 text-left text-sm font-bold text-blue-900 dark:text-blue-100 hover:bg-blue-100/50 dark:hover:bg-blue-900/30 transition-colors"
      >
        <span className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/20 dark:bg-blue-400/20">
            <Info className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </span>
          {titulo}
        </span>
        {open ? <ChevronUp className="w-4 h-4 text-blue-600 dark:text-blue-400" /> : <ChevronDown className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
      </button>
      {open && (
        <div className="px-4 pb-4 pt-0 text-xs text-slate-600 dark:text-slate-400 space-y-2 border-t border-blue-200/60 dark:border-blue-800/50 pt-3">
          {children}
        </div>
      )}
    </div>
  );
}

export function LabelConAyuda({ label, tooltip }: { label: string; tooltip: string }) {
  return (
    <span className="flex items-center gap-1.5">
      {label}
      <span title={tooltip} className="cursor-help text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
        <HelpCircle className="w-3.5 h-3.5" />
      </span>
    </span>
  );
}
