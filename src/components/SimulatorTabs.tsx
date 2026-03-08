"use client";

import { Lock, MousePointer2 } from "lucide-react";

export interface TabItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  plan?: "FREE" | "PRO";
  group?: string;
}

interface SimulatorTabsProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (id: string) => void;
  /** Si hay tabs bloqueados, función para verificar acceso */
  isLocked?: (tabId: string) => boolean;
  /** Texto de ayuda para nuevos usuarios */
  hint?: string;
  /** Agrupar por categoría (group) si está definido */
  grouped?: boolean;
}

export default function SimulatorTabs({
  tabs,
  activeTab,
  onTabChange,
  isLocked = () => false,
  hint = "Elige un simulador para ver los resultados",
  grouped = false,
}: SimulatorTabsProps) {
  const tabButton = (tab: TabItem) => {
    const locked = isLocked(tab.id);
    const isActive = activeTab === tab.id;
    const TabIcon = tab.icon;
    return (
      <button
        key={tab.id}
        type="button"
        onClick={() => onTabChange(tab.id)}
        title={tab.label}
        className={`
          flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 shrink-0
          min-w-[120px] justify-center
          ${isActive
            ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/25 scale-[1.02] ring-2 ring-indigo-400/50"
            : locked
              ? "bg-slate-100 dark:bg-slate-800/80 text-slate-400 dark:text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700/80"
              : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 hover:text-indigo-700 dark:hover:text-indigo-300 hover:shadow-md border border-slate-200 dark:border-slate-700"
          }
        `}
      >
        {locked && <Lock className="w-4 h-4 shrink-0" />}
        <TabIcon className={`w-5 h-5 shrink-0 ${isActive ? "text-white" : ""}`} />
        <span className="truncate">{tab.label}</span>
        {tab.plan === "PRO" && !locked && (
          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${isActive ? "bg-white/20" : "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400"}`}>
            Pro
          </span>
        )}
      </button>
    );
  };

  if (grouped && tabs.some((t) => t.group)) {
    const groups = Array.from(new Set(tabs.map((t) => t.group).filter(Boolean))) as string[];
    const ungrouped = tabs.filter((t) => !t.group);
    return (
      <div className="space-y-5">
        <p className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
          <MousePointer2 className="w-4 h-4" />
          {hint}
        </p>
        <div className="space-y-4">
          {groups.map((groupName) => (
            <div key={groupName}>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2 px-1">
                {groupName}
              </p>
              <div className="flex flex-wrap gap-2">
                {tabs.filter((t) => t.group === groupName).map(tabButton)}
              </div>
            </div>
          ))}
          {ungrouped.length > 0 && (
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2 px-1">
                Otros
              </p>
              <div className="flex flex-wrap gap-2">
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
      <p className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
        <MousePointer2 className="w-4 h-4" />
        {hint}
      </p>
      <div className="flex flex-wrap gap-2">
        {tabs.map(tabButton)}
      </div>
    </div>
  );
}
