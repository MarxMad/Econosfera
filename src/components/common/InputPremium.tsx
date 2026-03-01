"use client";

import { useState, useEffect, useRef } from "react";

interface InputPremiumProps {
    label: string;
    value: number;
    min: number;
    max: number;
    step: number;
    onChange: (n: number) => void;
    suffix?: string;
    className?: string;
    color?: "blue" | "violet" | "emerald" | "amber" | "rose" | "indigo";
}

export function InputPremium({
    label,
    value,
    min,
    max,
    step,
    onChange,
    suffix = "",
    className = "",
    color = "blue",
}: InputPremiumProps) {
    const [inputStr, setInputStr] = useState(String(value));
    const [editing, setEditing] = useState(false);

    useEffect(() => {
        if (!editing) setInputStr(String(value));
    }, [value, editing]);

    const commitInput = () => {
        const num = parseFloat(inputStr.replace(",", "."));
        if (!Number.isNaN(num)) {
            // Round to nearest step
            const rounded = Math.round(num / step) * step;
            // Clamp between min and max
            const clamped = Math.max(min, Math.min(max, rounded));
            onChange(clamped);
            setInputStr(String(clamped));
        } else {
            setInputStr(String(value));
        }
        setEditing(false);
    };

    const colors = {
        blue: "accent-blue-500 ring-blue-500",
        violet: "accent-violet-500 ring-violet-500",
        emerald: "accent-emerald-500 ring-emerald-500",
        amber: "accent-amber-500 ring-amber-500",
        rose: "accent-rose-500 ring-rose-500",
        indigo: "accent-indigo-500 ring-indigo-500",
    };

    return (
        <div className={`space-y-3 group ${className}`}>
            <div className="flex justify-between items-center gap-4">
                <label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors">
                    {label}
                </label>
                <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/50 p-1 rounded-xl border border-slate-200 dark:border-slate-700/50 group-hover:border-slate-300 dark:group-hover:border-slate-600 transition-all">
                    <input
                        type="text"
                        inputMode="decimal"
                        value={inputStr}
                        onChange={(e) => {
                            setEditing(true);
                            setInputStr(e.target.value);
                        }}
                        onFocus={() => setEditing(true)}
                        onBlur={commitInput}
                        onKeyDown={(e) => e.key === "Enter" && commitInput()}
                        className="min-w-[5rem] w-20 bg-transparent text-right text-sm font-black font-mono text-slate-900 dark:text-white tabular-nums outline-none"
                        aria-label={`${label} numeric value`}
                    />
                    {suffix && (
                        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 pr-2">
                            {suffix}
                        </span>
                    )}
                </div>
            </div>

            <div className="relative h-6 flex items-center">
                <input
                    type="range"
                    min={min}
                    max={max}
                    step={step}
                    value={value}
                    onChange={(e) => onChange(Number(e.target.value))}
                    className={`w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer ${colors[color]} transition-all hover:h-2`}
                />
            </div>
        </div>
    );
}
