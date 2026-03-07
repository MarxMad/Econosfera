"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useSession } from "next-auth/react";

const PLANS = [
  {
    id: "free",
    name: "Gratuito",
    price: "$0",
    credits: "10 para exportar",
    exports: "Consumen créditos",
    features: ["Macro y Micro básicos", "Sin minutas IA", "Glosario y manual"],
    highlight: false,
  },
  {
    id: "pro",
    name: "Estudiante Pro",
    price: "MXN 99/mes",
    credits: "50 IA/mes",
    exports: "PDF ilimitados",
    features: ["Merkle, Llaves, P2P, Smart Contracts", "DCF, Markowitz, Taylor", "Soporte prioritario"],
    highlight: true,
  },
  {
    id: "researcher",
    name: "Researcher",
    price: "MXN 199/mes",
    credits: "200 IA/mes",
    exports: "PDF ilimitados",
    features: ["Taylor, DCF, Black-Scholes", "AI Minutas Banxico", "AMM, Mundell, Juegos", "Soporte 24/7"],
    highlight: false,
  },
];

interface PlanComparadorProps {
  /** Si true, muestra versión compacta (solo tabla). Si false, con título y CTA. */
  compact?: boolean;
}

export default function PlanComparador({ compact = false }: PlanComparadorProps) {
  const { data: session } = useSession();
  const currentPlan = session?.user?.plan ?? "FREE";

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
      {!compact && (
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white">Desbloquea más con Pro</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Más créditos IA, exportaciones ilimitadas y modelos avanzados.</p>
          </div>
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-500 transition-colors"
          >
            Ver planes <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800">
              <th className="px-4 py-3 font-bold text-slate-700 dark:text-slate-300">Plan</th>
              <th className="px-4 py-3 font-bold text-slate-700 dark:text-slate-300">Precio</th>
              <th className="px-4 py-3 font-bold text-slate-700 dark:text-slate-300">Créditos IA</th>
              <th className="px-4 py-3 font-bold text-slate-700 dark:text-slate-300 hidden sm:table-cell">Exportaciones</th>
            </tr>
          </thead>
          <tbody>
            {PLANS.map((plan) => (
              <tr
                key={plan.id}
                className={`border-b border-slate-100 dark:border-slate-800/50 ${plan.highlight ? "bg-blue-50/50 dark:bg-blue-900/10" : ""}`}
              >
                <td className="px-4 py-3">
                  <span className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    {plan.name}
                    {currentPlan === plan.id.toUpperCase() && (
                      <span className="text-[10px] font-normal px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400">Actual</span>
                    )}
                  </span>
                </td>
                <td className="px-4 py-3 font-mono text-slate-700 dark:text-slate-300">{plan.price}</td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{plan.credits}</td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-400 hidden sm:table-cell">{plan.exports}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!compact && (
        <div className="px-4 py-3 bg-slate-50 dark:bg-slate-800/30 border-t border-slate-200 dark:border-slate-800">
          <Link href="/pricing" className="text-blue-600 dark:text-blue-400 text-sm font-bold hover:underline">
            Comparar todas las funciones →
          </Link>
        </div>
      )}
    </div>
  );
}
