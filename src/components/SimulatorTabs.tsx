"use client";

import { Lock, MousePointer2 } from "lucide-react";
import { getRequiredPlan } from "@/lib/simulatorPlans";
import type { PlanLevel } from "@/lib/simulatorPlans";

export interface TabItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  plan?: PlanLevel;
  group?: string;
}

interface SimulatorTabsProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (id: string) => void;
  /** ID del módulo para obtener plan desde simulatorPlans (prioridad sobre tab.plan) */
  moduleId?: string;
  /** Si hay tabs bloqueados, función para verificar acceso */
  isLocked?: (tabId: string) => boolean;
  /** Texto de ayuda para nuevos usuarios */
  hint?: string;
  /** Agrupar por categoría (group) si está definido */
  grouped?: boolean;
  /** Modo compacto: tabs más pequeños para reducir scroll */
  compact?: boolean;
}

export default function SimulatorTabs({
  tabs,
  activeTab,
  onTabChange,
  moduleId,
  isLocked = () => false,
  hint = "Elige un simulador para ver los resultados",
  grouped = false,
  compact = false,
}: SimulatorTabsProps) {
  const tabButton = (tab: TabItem) => {
    const locked = isLocked(tab.id);
    const isActive = activeTab === tab.id;
    const TabIcon = tab.icon;
    const plan: PlanLevel | null = moduleId ? getRequiredPlan(moduleId, tab.id) : (tab.plan ?? null);
    return (
      <button
        key={tab.id}
        type="button"
        onClick={() => onTabChange(tab.id)}
        title={tab.label}
        className={`
          flex items-center gap-1.5 sm:gap-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 shrink-0
          ${compact ? "px-2.5 py-1.5 min-w-0 justify-center" : "px-4 py-2.5 min-w-[120px] justify-center"}
          ${isActive
            ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/25 scale-[1.02] ring-2 ring-indigo-400/50"
            : locked
              ? "bg-slate-100 dark:bg-slate-800/80 text-slate-400 dark:text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700/80"
              : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 hover:text-indigo-700 dark:hover:text-indigo-300 hover:shadow-md border border-slate-200 dark:border-slate-700"
          }
        `}
      >
        {locked && <Lock className="w-4 h-4 shrink-0" />}
        <TabIcon className={`shrink-0 ${compact ? "w-4 h-4" : "w-5 h-5"} ${isActive ? "text-white" : ""}`} />
        <span className="truncate">{tab.label}</span>
        {plan === "PRO" && !locked && (
          <span className={`font-bold px-1 py-0.5 rounded shrink-0 ${compact ? "text-[9px]" : "text-[10px]"} ${isActive ? "bg-white/20" : "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400"}`}>
            Pro
          </span>
        )}
        {plan === "RESEARCHER" && !locked && (
          <span className={`font-bold px-1 py-0.5 rounded shrink-0 ${compact ? "text-[9px]" : "text-[10px]"} ${isActive ? "bg-white/20" : "bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-400"}`}>
            Researcher
          </span>
        )}
      </button>
    );
  };

  if (grouped && tabs.some((t) => t.group)) {
    const groups = Array.from(new Set(tabs.map((t) => t.group).filter(Boolean))) as string[];
    const ungrouped = tabs.filter((t) => !t.group);
    return (
      <div className={compact ? "space-y-2" : "space-y-5"}>
        <p className={`flex items-center gap-2 font-semibold text-indigo-600 dark:text-indigo-400 ${compact ? "text-xs" : "text-sm"}`}>
          <MousePointer2 className={compact ? "w-3.5 h-3.5" : "w-4 h-4"} />
          {hint}
        </p>
        <div className={compact ? "space-y-2" : "space-y-4"}>
          {groups.map((groupName) => (
            <div key={groupName}>
              <p className={`font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-1 ${compact ? "text-[10px] mb-1" : "text-xs mb-2"}`}>
                {groupName}
              </p>
              <div className={`flex flex-wrap ${compact ? "gap-1.5" : "gap-2"}`}>
                {tabs.filter((t) => t.group === groupName).map(tabButton)}
              </div>
            </div>
          ))}
          {ungrouped.length > 0 && (
            <div>
              <p className={`font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-1 ${compact ? "text-[10px] mb-1" : "text-xs mb-2"}`}>
                Otros
              </p>
              <div className={`flex flex-wrap ${compact ? "gap-1.5" : "gap-2"}`}>
                {ungrouped.map(tabButton)}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="flex items-center gap-2 text-sm font-semibold text-indigo-600 dark:text-indigo-400">
        <MousePointer2 className="w-4 h-4" />
        {hint}
      </p>
      <div className="flex flex-wrap gap-2 p-1">
        {tabs.map(tabButton)}
      </div>
    </div>
  );
}
