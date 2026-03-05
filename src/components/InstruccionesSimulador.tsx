"use client";

import { useState } from "react";
import { Info, ChevronDown, ChevronUp, HelpCircle } from "lucide-react";

interface InstruccionesSimuladorProps {
  titulo?: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export function InstruccionesSimulador({ titulo = "Cómo usar este simulador", children, defaultOpen = true }: InstruccionesSimuladorProps) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="mb-6 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/50 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-2 px-4 py-3 text-left text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors"
      >
        <span className="flex items-center gap-2">
          <Info className="w-4 h-4 text-blue-500" />
          {titulo}
        </span>
        {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>
      {open && (
        <div className="px-4 pb-4 pt-0 text-xs text-slate-600 dark:text-slate-400 space-y-2 border-t border-slate-200 dark:border-slate-600 pt-3">
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
