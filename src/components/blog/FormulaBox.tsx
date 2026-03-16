interface FormulaBoxProps {
  formula: string;
  label?: string;
  className?: string;
}

export default function FormulaBox({ formula, label, className = "" }: FormulaBoxProps) {
  return (
    <div
      className={`my-6 p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 overflow-hidden ${className}`}
      role="figure"
      aria-label={label ?? "Fórmula"}
    >
      {label && (
        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
          {label}
        </p>
      )}
      <div className="overflow-x-auto -mx-1 px-1 scrollbar-thin">
        <p className="font-mono text-base sm:text-lg md:text-xl text-slate-800 dark:text-slate-200 whitespace-nowrap text-center min-w-max py-1">
          {formula}
        </p>
      </div>
    </div>
  );
}
