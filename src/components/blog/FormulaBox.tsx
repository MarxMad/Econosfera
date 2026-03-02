interface FormulaBoxProps {
  formula: string;
  label?: string;
  className?: string;
}

export default function FormulaBox({ formula, label, className = "" }: FormulaBoxProps) {
  return (
    <div
      className={`my-6 p-5 sm:p-6 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 overflow-x-auto ${className}`}
      role="figure"
      aria-label={label ?? "Fórmula"}
    >
      {label && (
        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
          {label}
        </p>
      )}
      <p className="font-mono text-lg sm:text-xl text-slate-800 dark:text-slate-200 whitespace-nowrap text-center">
        {formula}
      </p>
    </div>
  );
}
