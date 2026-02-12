"use client";

import { useState } from "react";
import { BookOpen, ChevronDown, ExternalLink } from "lucide-react";

const CONCEPTOS = [
  {
    termino: "Inflación subyacente",
    definicion: "Indicador que excluye componentes volátiles (alimentos no elaborados, combustibles, tarifas reguladas) para captar la tendencia de mediano plazo de los precios.",
  },
  {
    termino: "Tasa real ex post",
    definicion: "Tasa de interés nominal menos la inflación ya observada. Mide el costo real del dinero después de que ocurrió la inflación.",
  },
  {
    termino: "Tasa real ex ante",
    definicion: "Tasa nominal menos la inflación esperada (aquí usamos la subyacente como proxy). Relevante para decisiones de inversión y consumo.",
  },
  {
    termino: "Regla de Taylor",
    definicion: "Fórmula que sugiere cómo debería moverse la tasa de política según la brecha de inflación (π − π*) y la brecha de producto. Referencia teórica, no una receta mecánica.",
  },
  {
    termino: "Brecha de producto",
    definicion: "Diferencia entre el PIB observado y el PIB potencial (en %). Positiva = economía sobrecalentada; negativa = holgura.",
  },
  {
    termino: "Política expansiva vs restrictiva",
    definicion: "Expansiva: el BC baja (o mantiene baja) la tasa para estimular crédito y actividad. Restrictiva: sube la tasa para enfriar la demanda y anclar expectativas de inflación.",
  },
];

export default function GuiaRapida() {
  const [abierto, setAbierto] = useState(false);

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 shadow-lg overflow-hidden">
      <button
        type="button"
        onClick={() => setAbierto(!abierto)}
        className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
      >
        <span className="flex items-center gap-2 font-semibold text-slate-800 dark:text-slate-100">
          <BookOpen className="w-5 h-5 text-slate-500 dark:text-slate-400" aria-hidden />
          Guía rápida para estudiantes
        </span>
        <ChevronDown
          className={`w-5 h-5 text-slate-500 transition-transform ${abierto ? "rotate-180" : ""}`}
          aria-hidden
        />
      </button>
      {abierto && (
        <div className="px-5 pb-5 pt-0 border-t border-slate-200 dark:border-slate-700">
          <ul className="space-y-4 mt-4">
            {CONCEPTOS.map((item) => (
              <li key={item.termino} className="space-y-1">
                <p className="font-medium text-slate-800 dark:text-slate-200 text-sm">
                  {item.termino}
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {item.definicion}
                </p>
              </li>
            ))}
          </ul>
          <div className="mt-5 pt-4 border-t border-slate-200 dark:border-slate-700">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">
              Basado en
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
              Estas definiciones se basan en documentos del <strong>Banco de México</strong>, <strong>CEMLA</strong>, <strong>El Trimestre Económico</strong> (FCE), <strong>Investigación Económica</strong> (UNAM) y <strong>CIDE</strong>. Consulta la sección «Referencias y fuentes para profundizar» más abajo para enlaces directos.
            </p>
            <a
              href="https://www.banxico.org.mx/DIBM/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline"
            >
              <ExternalLink className="w-3.5 h-3.5" aria-hidden />
              Documentos de investigación Banxico
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
