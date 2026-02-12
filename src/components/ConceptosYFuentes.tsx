"use client";

import { useState } from "react";
import { BookOpen, ChevronDown } from "lucide-react";
import type { PaisEconomia } from "@/lib/paises";
import { ECONOMIAS, getEconomia } from "@/lib/paises";

interface ConceptosYFuentesProps {
  pais: PaisEconomia;
  onPaisChange: (p: PaisEconomia) => void;
  onCargarDatosReferencia: () => void;
}

export default function ConceptosYFuentes({ pais, onPaisChange, onCargarDatosReferencia }: ConceptosYFuentesProps) {
  const [abierto, setAbierto] = useState(false);
  const config = getEconomia(pais);

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 shadow-lg overflow-hidden">
      <div className="p-4 border-b border-slate-200 dark:border-slate-700">
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-3">Economía de referencia</p>
        <div className="flex flex-wrap gap-2">
          {ECONOMIAS.map((e) => (
            <button
              key={e.id}
              type="button"
              onClick={() => onPaisChange(e.id)}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                pais === e.id
                  ? "bg-blue-600 text-white shadow"
                  : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"
              }`}
            >
              <span aria-hidden>{e.bandera}</span>
              {e.nombre}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={onCargarDatosReferencia}
          className="mt-3 text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
        >
          Usar datos de referencia de {config.nombre} en el simulador
        </button>
      </div>

      <button
        type="button"
        onClick={() => setAbierto(!abierto)}
        className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
      >
        <span className="flex items-center gap-2 font-semibold text-slate-800 dark:text-slate-100">
          <BookOpen className="w-5 h-5 text-slate-500 dark:text-slate-400" aria-hidden />
          Conceptos y fuentes para {config.nombre}
        </span>
        <ChevronDown className={`w-5 h-5 text-slate-500 transition-transform ${abierto ? "rotate-180" : ""}`} aria-hidden />
      </button>

      {abierto && (
        <div className="px-5 pb-5 pt-0 border-t border-slate-200 dark:border-slate-700 space-y-4">
          {config.fuentes.map((f) => (
            <div key={f.variable} className="pt-4 border-b border-slate-100 dark:border-slate-700 last:border-0 last:pb-0">
              <p className="font-semibold text-slate-800 dark:text-slate-200 text-sm">{f.variable}</p>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1"><strong>Qué es:</strong> {f.queEs}</p>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1"><strong>Dónde obtener:</strong> {f.dondeObtener}</p>
              <a
                href={f.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
              >
                {f.nombreFuente} →
              </a>
            </div>
          ))}
          <div className="pt-4">
            <p className="font-semibold text-slate-800 dark:text-slate-200 text-sm mb-2">Fuentes recomendadas para investigar</p>
            <ul className="space-y-1.5">
              {config.fuentesRecomendadas.map((fuente) => (
                <li key={fuente.nombre}>
                  <a
                    href={fuente.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    {fuente.nombre}
                  </a>
                  <span className="text-slate-500 dark:text-slate-400 text-sm"> — {fuente.descripcion}</span>
                </li>
              ))}
            </ul>
          </div>
          <p className="pt-4 mt-4 border-t border-slate-200 dark:border-slate-600 text-xs text-slate-500 dark:text-slate-400">
            Los conceptos «Qué es» se basan en documentos del Banco de México, CEMLA, El Trimestre Económico (FCE), Investigación Económica (UNAM) y CIDE. Más abajo aparece la sección «Referencias y fuentes para profundizar» con enlaces directos.
          </p>
        </div>
      )}
    </div>
  );
}
