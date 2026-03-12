"use client";

import { useState, useRef, useEffect } from "react";
import { Menu, ChevronDown, Check } from "lucide-react";

export type ModuloSimulador = "explorar" | "inflacion" | "monetaria" | "macro" | "micro" | "finanzas" | "contadores" | "actuaria" | "estadistica" | "blockchain" | "glosario" | "formulas";

const TABS: { id: ModuloSimulador; label: string; short: string }[] = [
  { id: "explorar", label: "🎨 Explorar todo", short: "Explorar" },
  { id: "finanzas", label: "Finanzas", short: "Finanzas" },
  { id: "contadores", label: "Contabilidad", short: "Contab." },
  { id: "inflacion", label: "Inflación", short: "Inflación" },
  { id: "monetaria", label: "Teoría monetaria", short: "Monetaria" },
  { id: "macro", label: "Macroeconomía", short: "Macro" },
  { id: "micro", label: "Microeconomía", short: "Micro" },
  { id: "actuaria", label: "Actuaría", short: "Actuaria" },
  { id: "estadistica", label: "Estadística y Econometría", short: "Stats" },
  { id: "blockchain", label: "Economía blockchain", short: "Blockchain" },
  { id: "glosario", label: "Glosario", short: "Glosario" },
  { id: "formulas", label: "Fórmulas", short: "Fórmulas" },
];

interface NavSimuladoresProps {
  modulo: ModuloSimulador;
  onChange: (m: ModuloSimulador) => void;
}

export default function NavSimuladores({ modulo, onChange }: NavSimuladoresProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const tabActual = TABS.find((t) => t.id === modulo) || TABS[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative border-b border-slate-200 dark:border-slate-700 pb-4 mb-6" ref={dropdownRef}>
      <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-1.5 px-1">
        Cambiar de simulador
      </p>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3.5 bg-gradient-to-r from-indigo-500 to-blue-600 dark:from-indigo-600 dark:to-blue-700 border-2 border-indigo-400/50 dark:border-indigo-500/50 rounded-2xl shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 hover:scale-[1.01] active:scale-[0.99] transition-all font-bold text-white"
      >
        <div className="flex items-center gap-3">
          <div className="p-1.5 rounded-lg bg-white/20">
            <Menu className="w-5 h-5" />
          </div>
          <span className="truncate">{tabActual.label}</span>
        </div>
        <ChevronDown className={`w-5 h-5 text-white/90 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 z-50 p-2 mt-2 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col max-h-[60vh] overflow-y-auto no-scrollbar">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  onChange(tab.id);
                  setIsOpen(false);
                }}
                className={`flex items-center justify-between w-full px-4 py-3 rounded-xl text-left text-sm font-semibold transition-all ${modulo === tab.id
                    ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50"
                  }`}
              >
                {tab.label}
                {modulo === tab.id && <Check className="w-4 h-4" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
