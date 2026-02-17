"use client";

import { useState } from "react";
import { ArrowRight, Users, Building2, Landmark, Briefcase } from "lucide-react";

const NODOS = [
  {
    id: "ahorradores",
    label: "Ahorradores",
    desc: "Familias y empresas que tienen excedentes de recursos y los depositan en bancos o invierten en el mercado de valores.",
    icono: Users,
    color: "bg-blue-100 dark:bg-blue-900/40 border-blue-300 dark:border-blue-700",
  },
  {
    id: "bancos",
    label: "Bancos",
    desc: "Captan depósitos y otorgan créditos. Intermedian entre quienes ahorran y quienes necesitan financiamiento.",
    icono: Building2,
    color: "bg-emerald-100 dark:bg-emerald-900/40 border-emerald-300 dark:border-emerald-700",
  },
  {
    id: "mercado",
    label: "Mercado de valores (BMV)",
    desc: "Donde se emiten y negocian acciones, bonos y otros valores. Conecta oferta y demanda de capital.",
    icono: Landmark,
    color: "bg-amber-100 dark:bg-amber-900/40 border-amber-300 dark:border-amber-700",
  },
  {
    id: "demandantes",
    label: "Empresas y gobierno",
    desc: "Demandantes de financiamiento: emiten deuda (bonos, cetes) o capital (acciones) para invertir o gastar.",
    icono: Briefcase,
    color: "bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-600",
  },
] as const;

export default function FlujoSistemaFinanciero() {
  const [activo, setActivo] = useState<string | null>(null);
  const nodoActivo = NODOS.find((n) => n.id === activo);

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 shadow-lg p-5">
      <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-2">Flujo del sistema financiero</h3>
      <p className="text-xs text-slate-600 dark:text-slate-400 mb-4">
        Haz clic en cada caja para ver su papel. El ahorro se canaliza hacia la inversión a través de bancos y del mercado de valores.
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 flex-wrap">
        {NODOS.map((nodo, i) => {
          const Icon = nodo.icono;
          const isActive = activo === nodo.id;
          return (
            <div key={nodo.id} className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActivo(activo === nodo.id ? null : nodo.id)}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 transition-all text-left min-w-[140px] ${nodo.color} ${
                  isActive ? "ring-2 ring-offset-2 ring-blue-500 dark:ring-offset-slate-900 ring-offset-white" : "hover:opacity-90"
                }`}
              >
                <Icon className="w-5 h-5 text-slate-600 dark:text-slate-400 shrink-0" aria-hidden />
                <span className="font-semibold text-slate-800 dark:text-slate-100 text-sm">{nodo.label}</span>
              </button>
              {i < NODOS.length - 1 && (
                <ArrowRight className="w-5 h-5 text-slate-400 dark:text-slate-500 shrink-0 hidden sm:block" aria-hidden />
              )}
            </div>
          );
        })}
      </div>

      {/* Flujo vertical en móvil */}
      <div className="sm:hidden flex flex-col items-center gap-2 mt-4">
        {NODOS.slice(0, -1).map((_, i) => (
          <ArrowRight className="w-5 h-5 text-slate-400 rotate-90" aria-hidden key={i} />
        ))}
      </div>

      {nodoActivo && (
        <div className="mt-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-600">
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-1">{nodoActivo.label}</p>
          <p className="text-sm text-slate-600 dark:text-slate-400">{nodoActivo.desc}</p>
        </div>
      )}

      <p className="text-xs text-slate-500 dark:text-slate-400 mt-3">
        Ahorradores → depositan en bancos o compran valores → Bancos y mercado canalizan fondos → Empresas y gobierno reciben financiamiento.
      </p>
    </div>
  );
}
