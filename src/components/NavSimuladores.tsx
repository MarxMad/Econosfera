"use client";

import { useState, useRef, useEffect } from "react";
import { Menu, ChevronDown, Check } from "lucide-react";

export type ModuloSimulador = "inflacion" | "macro" | "micro" | "finanzas" | "actuaria" | "estadistica" | "blockchain" | "glosario" | "formulas";

const TABS: { id: ModuloSimulador; label: string; short: string }[] = [
  { id: "finanzas", label: "Finanzas", short: "Finanzas" },
  { id: "inflacion", label: "Inflación y política monetaria", short: "Monetaria" },
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
    <div className="relative border-b border-slate-200 dark:border-slate-700 pb-4 mb-6">
      {/* Mobile Dropdown */}
      <div className="md:hidden" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between px-4 py-3.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all font-semibold text-slate-800 dark:text-slate-100"
        >
          <div className="flex items-center gap-3">
            <Menu className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span className="truncate">{tabActual.label}</span>
          </div>
          <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className="absolute top-14 left-0 right-0 z-50 p-2 mt-2 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
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

      {/* Desktop Tabs */}
      <nav className="hidden md:flex flex-wrap gap-2">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${modulo === tab.id
                ? "bg-blue-600 text-white shadow-md shadow-blue-500/25"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
}
