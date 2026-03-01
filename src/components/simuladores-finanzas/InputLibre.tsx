"use client";

import { useState, useEffect } from "react";

/** Input numérico sin límite: acepta cualquier valor. Al salir o Enter se aplica el número (si no es válido se mantiene el valor anterior). */
export function InputLibre({
  label,
  value,
  onChange,
  suffix = "",
  placeholder,
  step = "any",
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
  suffix?: string;
  placeholder?: string;
  step?: string;
}) {
  const [inputStr, setInputStr] = useState(String(value));
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (!editing) setInputStr(String(value));
  }, [value, editing]);

  const commit = () => {
    const n = parseFloat(inputStr.replace(",", "."));
    if (!Number.isNaN(n)) onChange(n);
    else setInputStr(String(value));
    setEditing(false);
  };

  return (
    <div className="space-y-1">
      <label className="block text-sm text-slate-600 dark:text-slate-400">{label}</label>
      <span className="flex items-center gap-1 font-mono">
        <input
          type="number"
          inputMode="decimal"
          step={step}
          value={inputStr}
          onChange={(e) => {
            setEditing(true);
            setInputStr(e.target.value);
          }}
          onBlur={commit}
          onKeyDown={(e) => e.key === "Enter" && commit()}
          placeholder={placeholder}
          className="w-full min-w-[5rem] px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 tabular-nums"
          aria-label={label}
        />
        {suffix && <span className="text-slate-500 dark:text-slate-400 shrink-0">{suffix}</span>}
      </span>
    </div>
  );
}
