interface ReferenceItem {
  id: string;
  text: string;
  href?: string;
}

interface ReferencesListProps {
  references: ReferenceItem[];
  title?: string;
  className?: string;
}

export default function ReferencesList({ references, title = "Referencias", className = "" }: ReferencesListProps) {
  return (
    <aside
      className={`mt-12 pt-8 border-t border-slate-200 dark:border-slate-700 ${className}`}
      aria-label={title}
    >
      <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
        {title}
      </h3>
      <ol className="space-y-2 text-sm text-slate-600 dark:text-slate-300 list-decimal list-inside">
        {references.map((ref) => (
          <li key={ref.id} id={`ref-${ref.id}`}>
            {ref.href ? (
              <a
                href={ref.href}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-600 dark:hover:text-blue-400 underline underline-offset-2"
              >
                {ref.text}
              </a>
            ) : (
              <span>{ref.text}</span>
            )}
          </li>
        ))}
      </ol>
    </aside>
  );
}
