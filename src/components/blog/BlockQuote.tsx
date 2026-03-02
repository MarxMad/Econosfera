import type { ReactNode } from "react";

interface BlockQuoteProps {
  quote: ReactNode;
  author?: string;
  source?: string;
  className?: string;
}

export default function BlockQuote({ quote, author, source, className = "" }: BlockQuoteProps) {
  return (
    <blockquote
      className={`border-l-4 border-blue-500 pl-6 pr-4 py-4 my-6 bg-slate-50 dark:bg-slate-800/50 rounded-r-xl italic text-slate-700 dark:text-slate-300 ${className}`}
    >
      <p className="text-lg sm:text-xl leading-relaxed">"{quote}"</p>
      {(author || source) && (
        <footer className="mt-3 not-italic text-sm text-slate-500 dark:text-slate-400">
          — {author}
          {source && (
            <>
              , <cite className="font-medium">{source}</cite>
            </>
          )}
        </footer>
      )}
    </blockquote>
  );
}
