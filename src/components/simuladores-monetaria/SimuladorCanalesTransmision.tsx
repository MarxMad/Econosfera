"use client";

import { useState } from "react";
import { Zap, ChevronDown, ChevronUp } from "lucide-react";
import { InstruccionesSimulador } from "../InstruccionesSimulador";

const CANALES = [
  {
    id: "tasa",
    titulo: "Tasa de política",
    desc: "El banco central sube o baja la tasa de referencia. Es el primer eslabón de la cadena.",
    efectos: ["Mercado interbancario", "CETES y bonos", "Tasas de crédito"],
  },
  {
    id: "credito",
    titulo: "Canal de crédito",
    desc: "Tasas más altas encarecen los préstamos. Menor crédito → menor consumo e inversión.",
    efectos: ["Hipotecas", "Crédito empresarial", "Consumo a crédito"],
  },
  {
    id: "tc",
    titulo: "Tipo de cambio",
    desc: "Tasas altas atraen capital → apreciación. Tasas bajas → salida de capital → depreciación.",
    efectos: ["Exportaciones", "Importaciones", "Inflación vía precios externos"],
  },
  {
    id: "precios",
    titulo: "Expectativas y precios de activos",
    desc: "La señal del banco central afecta expectativas de inflación y precios de bonos y acciones.",
    efectos: ["Rendimientos de bonos", "Valor presente de flujos", "Riqueza de hogares"],
  },
];

export default function SimuladorCanalesTransmision() {
  const [expandido, setExpandido] = useState<string | null>("tasa");

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 shadow-lg p-6">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <Zap className="w-5 h-5 text-amber-500" />
          Canales de transmisión monetaria
        </h3>
      </div>
      <InstruccionesSimulador>
        <p>La política monetaria afecta la economía a través de varios canales. Sube la tasa para enfriar la inflación; bájala para estimular.</p>
      </InstruccionesSimulador>
      <div className="space-y-3 mt-4">
        {CANALES.map((c) => (
          <div
            key={c.id}
            className="rounded-xl border border-slate-200 dark:border-slate-600 overflow-hidden"
          >
            <button
              type="button"
              onClick={() => setExpandido(expandido === c.id ? null : c.id)}
              className="w-full flex items-center justify-between p-4 text-left bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <span className="font-bold text-slate-800 dark:text-slate-100">{c.titulo}</span>
              {expandido === c.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            {expandido === c.id && (
              <div className="p-4 pt-0 space-y-2">
                <p className="text-sm text-slate-600 dark:text-slate-400">{c.desc}</p>
                <div className="flex flex-wrap gap-2">
                  {c.efectos.map((e) => (
                    <span key={e} className="px-2 py-1 rounded-lg bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 text-xs font-medium">
                      {e}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="mt-6 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
        <p className="text-sm font-bold text-blue-800 dark:text-blue-200">Resumen</p>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          Política restrictiva (↑ tasa) → menos crédito, apreciación, menor demanda → baja inflación.
          Política expansiva (↓ tasa) → más crédito, depreciación, mayor demanda → sube inflación.
        </p>
      </div>
    </div>
  );
}
