"use client";

import { useRouter } from "next/navigation";
import {
  Calculator,
  TrendingUp,
  Zap,
  BarChart2,
  Coins,
  Brain,
  LineChart,
  PieChart,
  Percent,
  Link2,
} from "lucide-react";
import type { ModuloSimulador } from "@/components/NavSimuladores";

const SIMULADORES: {
  id: string;
  label: string;
  modulo: ModuloSimulador;
  tab?: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}[] = [
    { id: "solow", label: "Solow", modulo: "macro", tab: "solow", icon: TrendingUp, color: "blue" },
    { id: "taylor", label: "Regla de Taylor", modulo: "monetaria", tab: "taylor", icon: Calculator, color: "indigo" },
    { id: "blackscholes", label: "Black-Scholes", modulo: "finanzas", tab: "blackscholes", icon: Zap, color: "amber" },
    { id: "dcf", label: "DCF", modulo: "finanzas", tab: "dcf", icon: BarChart2, color: "emerald" },
    { id: "vpvf", label: "VP/VF", modulo: "finanzas", tab: "vpvf", icon: Calculator, color: "indigo" },
    { id: "islm", label: "IS-LM", modulo: "macro", tab: "islm", icon: LineChart, color: "blue" },
    { id: "minutas", label: "Minutas IA", modulo: "monetaria", tab: "ai", icon: Brain, color: "violet" },
    { id: "mercado", label: "Oferta y Demanda", modulo: "micro", tab: "mercado", icon: PieChart, color: "emerald" },
    { id: "halving", label: "Halving", modulo: "blockchain", tab: "halving", icon: Coins, color: "purple" },
    { id: "regresion", label: "Regresión", modulo: "estadistica", tab: "regresion", icon: Percent, color: "cyan" },
    { id: "inflacion", label: "Inflación", modulo: "inflacion", tab: "tasaReal", icon: Percent, color: "amber" },
    { id: "contadores", label: "Contabilidad", modulo: "contadores", tab: "balances", icon: Calculator, color: "teal" },
  ];

const COLOR_CLASSES: Record<string, string> = {
  blue: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800 hover:bg-blue-500/20",
  indigo: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800 hover:bg-indigo-500/20",
  amber: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800 hover:bg-amber-500/20",
  emerald: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-500/20",
  violet: "bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-200 dark:border-violet-800 hover:bg-violet-500/20",
  purple: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800 hover:bg-purple-500/20",
  cyan: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-200 dark:border-cyan-800 hover:bg-cyan-500/20",
  teal: "bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-200 dark:border-teal-800 hover:bg-teal-500/20",
};

import InteractiveShowcase from "./InteractiveShowcase";

export default function GaleriaSimuladores({
  onProbarClick,
}: {
  onProbarClick: (e: React.MouseEvent) => void;
}) {
  const router = useRouter();

  const handleClick = (modulo: ModuloSimulador, tab?: string) => {
    const url = tab ? `/simulador?modulo=${modulo}&tab=${tab}` : `/simulador?modulo=${modulo}`;
    router.push(url);
  };

  return (
    <section className="py-20 sm:py-28 bg-slate-50 dark:bg-slate-900/50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16 px-4">
          <h2 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">
            Laboratorio <span className="text-indigo-600 dark:text-indigo-400">Interactivo</span>
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-lg max-w-3xl mx-auto leading-relaxed">
            No somos solo una base de datos. Somos una plataforma viva donde puedes manipular variables y visualizar el impacto económico en tiempo real.
          </p>
        </div>

        {/* Showcase Interactivo - El Gancho */}
        <div className="mb-24">
          <InteractiveShowcase />
        </div>

        <div className="text-center mb-10">
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 uppercase tracking-widest text-[11px] mb-8">
            Y eso es solo el comienzo. Explora nuestra galería completa:
          </h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
          {SIMULADORES.map((s) => {
            const Icon = s.icon;
            const colorClass = COLOR_CLASSES[s.color] ?? COLOR_CLASSES.blue;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => handleClick(s.modulo, s.tab)}
                className={`group flex flex-col items-center justify-center gap-2 sm:gap-3 p-4 sm:p-5 rounded-2xl border transition-all duration-300 hover:scale-[1.03] hover:shadow-lg ${colorClass}`}
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center bg-white/50 dark:bg-black/20 group-hover:scale-110 transition-transform">
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <span className="text-xs sm:text-sm font-bold text-center leading-tight line-clamp-2">
                  {s.label}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-10 text-center">
          <button
            type="button"
            onClick={(e) => onProbarClick(e)}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-500 transition-colors shadow-lg"
          >
            Ir a simuladores
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
