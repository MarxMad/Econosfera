"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Lock } from "lucide-react";
import { getRequiredPlan } from "@/lib/simulatorPlans";
import type { PlanLevel } from "@/lib/simulatorPlans";

export interface TabItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  plan?: PlanLevel;
  group?: string;
}

interface SimulatorDropdownProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (id: string) => void;
  moduleId?: string;
  isLocked?: (tabId: string) => boolean;
  placeholder?: string;
}

export default function SimulatorDropdown({
  tabs,
  activeTab,
  onTabChange,
  moduleId,
  isLocked = () => false,
  placeholder = "Elige un simulador",
}: SimulatorDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const active = tabs.find((t) => t.id === activeTab);
  const groups = Array.from(new Set(tabs.map((t) => t.group).filter(Boolean))) as string[];
  const ungrouped = tabs.filter((t) => !t.group);

  const renderItem = (tab: TabItem) => {
    const locked = isLocked(tab.id);
    const plan: PlanLevel | null = moduleId ? getRequiredPlan(moduleId, tab.id) : (tab.plan ?? null);
    const TabIcon = tab.icon;
    return (
      <button
        key={tab.id}
        type="button"
        onClick={() => {
          if (!locked) {
            onTabChange(tab.id);
            setOpen(false);
          }
        }}
        disabled={locked}
        className={`
          flex items-center gap-2 w-full px-3 py-2 rounded-lg text-left text-sm font-medium transition-colors
          ${locked
            ? "text-slate-400 dark:text-slate-500 cursor-not-allowed bg-slate-50 dark:bg-slate-800/50"
            : "text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 hover:text-indigo-700 dark:hover:text-indigo-300"
          }
          ${activeTab === tab.id ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300" : ""}
        `}
      >
        {locked && <Lock className="w-4 h-4 shrink-0" />}
        <TabIcon className="w-4 h-4 shrink-0 text-slate-500 dark:text-slate-400" />
        <span className="flex-1 truncate">{tab.label}</span>
        {plan === "PRO" && !locked && (
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 shrink-0">
            Pro
          </span>
        )}
        {plan === "RESEARCHER" && !locked && (
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-400 shrink-0">
            Researcher
          </span>
        )}
      </button>
    );
  };

  const ActiveIcon = active?.icon;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 w-full sm:w-auto min-w-[200px] px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-sm hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all shadow-sm"
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        {ActiveIcon && <ActiveIcon className="w-5 h-5 shrink-0 text-indigo-600 dark:text-indigo-400" />}
        <span className="flex-1 text-left truncate">{active?.label ?? placeholder}</span>
        <ChevronDown className={`w-4 h-4 shrink-0 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute top-full left-0 right-0 mt-2 z-50 max-h-[70vh] overflow-y-auto rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-xl py-2 animate-in fade-in slide-in-from-top-2 duration-200">
          {groups.map((groupName) => (
            <div key={groupName} className="px-2 pb-1">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-2 py-1.5">
                {groupName}
              </p>
              <div className="space-y-0.5">
                {tabs.filter((t) => t.group === groupName).map(renderItem)}
              </div>
            </div>
          ))}
          {ungrouped.length > 0 && (
            <div className="px-2 pb-1 border-t border-slate-100 dark:border-slate-800 mt-2 pt-2">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-2 py-1.5">
                Otros
              </p>
              <div className="space-y-0.5">
                {ungrouped.map(renderItem)}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
