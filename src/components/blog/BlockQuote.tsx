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
      className={`border-l-4 border-blue-500 pl-4 sm:pl-6 pr-3 sm:pr-4 py-3 sm:py-4 my-6 bg-slate-50 dark:bg-slate-800/50 rounded-r-xl italic text-slate-700 dark:text-slate-300 overflow-hidden min-w-0 ${className}`}
    >
      <p className="text-base sm:text-lg md:text-xl leading-relaxed break-words">"{quote}"</p>
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
