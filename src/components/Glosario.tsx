"use client";

import { useState, useMemo } from "react";
import { BookOpen } from "lucide-react";
import { buscarTerminos, FUENTES_CONCEPTOS, type TerminoGlosario } from "@/lib/glosario";
import type { ModuloSimulador } from "./NavSimuladores";

interface GlosarioProps {
  moduloActivo?: ModuloSimulador;
  onIrAModulo?: (modulo: ModuloSimulador) => void;
}

export default function Glosario({ moduloActivo, onIrAModulo }: GlosarioProps) {
  const [busqueda, setBusqueda] = useState("");
  const [filtroModulo, setFiltroModulo] = useState<"todos" | ModuloSimulador | "general">("todos");

  const terminosFiltrados = useMemo(() => {
    let resultado = buscarTerminos(busqueda);
    if (filtroModulo !== "todos") {
      resultado = resultado.filter((t) => t.modulo === filtroModulo);
    }
    return resultado;
  }, [busqueda, filtroModulo]);

  const modulos: Array<{ id: "todos" | ModuloSimulador | "general"; label: string }> = [
    { id: "todos", label: "Todos" },
    { id: "inflacion", label: "Inflación" },
    { id: "macro", label: "Macro" },
    { id: "micro", label: "Micro" },
    { id: "finanzas", label: "Finanzas" },
    { id: "general", label: "General" },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-900 p-8 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 text-blue-500">
          <BookOpen className="w-24 h-24" />
        </div>
        <div className="relative z-10">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-3 flex items-center gap-3">
            <BookOpen className="text-blue-500 w-8 h-8" />
            Glosario de Términos
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm max-w-2xl italic mb-6">
            Diccionario económico interactivo para encontrar definiciones y conceptos clave en un instante.
          </p>
          <input
            type="text"
            placeholder="Buscar término..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full lg:w-96 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2 p-1 bg-slate-200 dark:bg-slate-800/50 rounded-2xl w-fit">
        {modulos.map((mod) => (
          <button
            key={mod.id}
            type="button"
            onClick={() => setFiltroModulo(mod.id)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${filtroModulo === mod.id
              ? "bg-blue-600 text-white shadow"
              : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"
              }`}
          >
            {mod.label}
          </button>
        ))}
      </div>
      <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl max-h-[600px] overflow-y-auto">
        {terminosFiltrados.length === 0 ? (
          <p className="text-slate-500 dark:text-slate-400 text-center py-8">
            No se encontraron términos con "{busqueda}"
          </p>
        ) : (
          <div className="space-y-4">
            {terminosFiltrados.map((termino, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/30 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg">{termino.termino}</h3>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 rounded text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                      {termino.modulo === "inflacion" ? "Inflación" : termino.modulo === "macro" ? "Macro" : termino.modulo === "micro" ? "Micro" : termino.modulo === "finanzas" ? "Finanzas" : "General"}
                    </span>
                    {onIrAModulo && termino.modulo !== "general" && termino.modulo !== moduloActivo && (
                      <button
                        type="button"
                        onClick={() => onIrAModulo(termino.modulo as ModuloSimulador)}
                        className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        Ir →
                      </button>
                    )}
                  </div>
                </div>
                <p className="text-slate-600 dark:text-slate-400 mb-2">{termino.definicion}</p>
                {termino.formula && (
                  <div className="mt-2 p-3 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 overflow-x-auto">
                    <p className="text-sm font-mono text-slate-800 dark:text-slate-200 whitespace-nowrap">{termino.formula}</p>
                  </div>
                )}
                {termino.ejemplo && (
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 italic">
                    <strong>Ejemplo:</strong> {termino.ejemplo}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
        <div className="mt-6 pt-5 border-t border-slate-200 dark:border-slate-700">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">
            Basado en
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
            Las definiciones de este glosario se apoyan en documentos y revistas académicas mexicanas e internacionales:
          </p>
          <ul className="flex flex-wrap gap-2">
            {FUENTES_CONCEPTOS.map((f) => (
              <li key={f.nombre}>
                <a
                  href={f.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                >
                  {f.nombre} →
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
