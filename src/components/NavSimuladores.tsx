"use client";

export type ModuloSimulador = "inflacion" | "macro" | "micro" | "glosario" | "formulas";

const TABS: { id: ModuloSimulador; label: string; short: string }[] = [
  { id: "inflacion", label: "Inflación y política monetaria", short: "Monetaria" },
  { id: "macro", label: "Macroeconomía", short: "Macro" },
  { id: "micro", label: "Microeconomía", short: "Micro" },
  { id: "glosario", label: "Glosario", short: "Glosario" },
  { id: "formulas", label: "Fórmulas", short: "Fórmulas" },
];

interface NavSimuladoresProps {
  modulo: ModuloSimulador;
  onChange: (m: ModuloSimulador) => void;
}

export default function NavSimuladores({ modulo, onChange }: NavSimuladoresProps) {
  return (
    <nav className="flex flex-wrap gap-2 border-b border-slate-200 dark:border-slate-700 pb-4">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
            modulo === tab.id
              ? "bg-blue-600 text-white shadow-md shadow-blue-500/25"
              : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );
}
