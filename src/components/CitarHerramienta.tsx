"use client";

import { useState } from "react";
import { Quote, Copy, Check } from "lucide-react";
import { getCitaApa, getCitaChicago, getCitaBibtex } from "@/lib/citar";

type Formato = "apa" | "chicago" | "bibtex";

export default function CitarHerramienta() {
  const [abierto, setAbierto] = useState(false);
  const [copiado, setCopiado] = useState<Formato | null>(null);

  const citas: { key: Formato; label: string; getTexto: () => string }[] = [
    { key: "apa", label: "APA", getTexto: getCitaApa },
    { key: "chicago", label: "Chicago", getTexto: getCitaChicago },
    { key: "bibtex", label: "BibTeX", getTexto: getCitaBibtex },
  ];

  const copiar = async (formato: Formato) => {
    const item = citas.find((c) => c.key === formato);
    if (!item) return;
    try {
      await navigator.clipboard.writeText(item.getTexto());
      setCopiado(formato);
      setTimeout(() => setCopiado(null), 2000);
    } catch (e) {
      console.error("Error al copiar:", e);
    }
  };

  return (
    <div className="border-t border-slate-200 dark:border-slate-700 pt-4 mt-4">
      <button
        type="button"
        onClick={() => setAbierto(!abierto)}
        className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        aria-expanded={abierto}
      >
        <Quote className="w-4 h-4" />
        Cómo citar esta herramienta
      </button>
      {abierto && (
        <div className="mt-3 space-y-3">
          {citas.map(({ key, label, getTexto }) => (
            <div key={key} className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-3">
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  {label}
                </span>
                <button
                  type="button"
                  onClick={() => copiar(key)}
                  className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                >
                  {copiado === key ? (
                    <>
                      <Check className="w-3 h-3" />
                      Copiado
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      Copiar
                    </>
                  )}
                </button>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 font-mono whitespace-pre-wrap break-words">
                {getTexto()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
