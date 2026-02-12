"use client";

import Link from "next/link";
import CitarHerramienta from "@/components/CitarHerramienta";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            © {currentYear} Econosfera. Herramienta didáctica.
          </p>
          <nav className="flex items-center gap-6" aria-label="Legal">
            <Link
              href="/aviso-privacidad"
              className="text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors underline-offset-2 hover:underline"
            >
              Aviso de privacidad
            </Link>
            <Link
              href="/terminos-condiciones"
              className="text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors underline-offset-2 hover:underline"
            >
              Términos y condiciones
            </Link>
          </nav>
        </div>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-3 text-center sm:text-left">
          Herramienta de apoyo al análisis. No sustituye el criterio profesional ni las proyecciones oficiales.
        </p>
        <CitarHerramienta />
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 text-center">
          Creada por{" "}
          <a
            href="https://github.com/MarxMad"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors underline-offset-2 hover:underline"
          >
            MarxMad
          </a>
        </p>
      </div>
    </footer>
  );
}
