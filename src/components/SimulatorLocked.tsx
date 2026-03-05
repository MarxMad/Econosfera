"use client";

import Link from "next/link";
import { Lock, ArrowRight, Zap } from "lucide-react";
import type { PlanLevel } from "@/lib/simulatorPlans";

const PLAN_LABEL: Record<PlanLevel, string> = {
  FREE: "Gratuito",
  PRO: "Estudiante Pro",
  RESEARCHER: "Researcher",
};

interface SimulatorLockedProps {
  requiredPlan: PlanLevel;
  moduleName?: string;
}

export default function SimulatorLocked({ requiredPlan, moduleName }: SimulatorLockedProps) {
  const planLabel = PLAN_LABEL[requiredPlan];

  return (
    <div className="rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/50 p-10 text-center">
      <div className="w-16 h-16 rounded-2xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mx-auto mb-4">
        <Lock className="w-8 h-8 text-amber-600 dark:text-amber-400" />
      </div>
      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
        Desbloquea con {planLabel}
      </h3>
      <p className="text-slate-600 dark:text-slate-400 text-sm max-w-md mx-auto mb-6">
        {requiredPlan === "PRO" && (
          <>Este simulador está disponible en el plan Estudiante Pro (MXN 99/mes): 50 créditos IA, exportaciones ilimitadas y modelos avanzados.</>
        )}
        {requiredPlan === "RESEARCHER" && (
          <>Este contenido está disponible en el plan Researcher: acceso completo a todos los simuladores, Smart Contracts, P2P y más.</>
        )}
        {moduleName && (
          <span className="block mt-2 text-slate-500">Módulo: {moduleName}</span>
        )}
      </p>
      <Link
        href="/pricing"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-500 transition-colors"
      >
        <Zap className="w-5 h-5" />
        Ver planes <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}
