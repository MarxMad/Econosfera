"use client";

import { BookMarked, BarChart3, TrendingUp, Scale, Landmark } from "lucide-react";
import {
  FUENTES_POR_MODULO,
  FUENTES_INFLACION,
  FUENTES_MACRO,
  FUENTES_MICRO,
  FUENTES_FINANZAS,
  type FuenteAcademica,
} from "@/lib/fuentesAcademicas";

type ModuloFuentes = "inflacion" | "macro" | "micro" | "finanzas" | "todos";

const TITULOS_MODULO: Record<"inflacion" | "macro" | "micro" | "finanzas", { titulo: string; icono: React.ComponentType<{ className?: string }> }> = {
  inflacion: {
    titulo: "Política monetaria e inflación",
    icono: BarChart3,
  },
  macro: {
    titulo: "Macroeconomía (multiplicador, IS-LM)",
    icono: TrendingUp,
  },
  micro: {
    titulo: "Microeconomía (oferta, demanda, elasticidad)",
    icono: Scale,
  },
  finanzas: {
    titulo: "Finanzas (bancos, instrumentos, bursátil)",
    icono: Landmark,
  },
};

function ItemFuente({ f }: { f: FuenteAcademica }) {
  return (
    <a
      href={f.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow transition-all group"
    >
      <p className="font-semibold text-slate-800 dark:text-slate-100 text-sm group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
        {f.titulo}
        <span className="ml-1 text-slate-400 group-hover:translate-x-0.5 inline-block transition-transform">→</span>
      </p>
      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{f.institucion}</p>
      <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{f.descripcion}</p>
    </a>
  );
}

function SeccionModulo({
  modulo,
  fuentes,
}: {
  modulo: "inflacion" | "macro" | "micro" | "finanzas";
  fuentes: FuenteAcademica[];
}) {
  const { titulo, icono: Icon } = TITULOS_MODULO[modulo];
  return (
    <div>
      <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-3 flex items-center gap-2">
        <Icon className="w-5 h-5 text-slate-600 dark:text-slate-400" aria-hidden />
        {titulo}
        <span className="text-sm font-normal text-slate-500 dark:text-slate-400">({fuentes.length} fuentes)</span>
      </h3>
      <ul className="space-y-2">
        {fuentes.map((f, i) => (
          <li key={`${modulo}-${i}`}>
            <ItemFuente f={f} />
          </li>
        ))}
      </ul>
    </div>
  );
}

interface ReferenciasAcademicasProps {
  modulo: ModuloFuentes;
}

export default function ReferenciasAcademicas({ modulo }: ReferenciasAcademicasProps) {
  const esTodos = modulo === "todos";

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 shadow-lg overflow-hidden">
      <div className="p-5 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-slate-800 dark:to-slate-800">
        <div className="flex items-center gap-2 mb-1">
          <BookMarked className="w-6 h-6 text-slate-600 dark:text-slate-400" aria-hidden />
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
            Referencias y fuentes para profundizar
          </h2>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          {esTodos
            ? "Fuentes académicas y oficiales por tema: teoría de política monetaria, macroeconomía y microeconomía."
            : "Enlaces a bancos centrales, organismos internacionales, manuales y documentos para ampliar el contenido del módulo."}
        </p>
      </div>

      <div className="p-5">
        {esTodos ? (
          <div className="grid md:grid-cols-1 gap-8">
            <SeccionModulo modulo="inflacion" fuentes={FUENTES_INFLACION} />
            <SeccionModulo modulo="macro" fuentes={FUENTES_MACRO} />
            <SeccionModulo modulo="micro" fuentes={FUENTES_MICRO} />
            <SeccionModulo modulo="finanzas" fuentes={FUENTES_FINANZAS} />
          </div>
        ) : (
          <ul className="space-y-2">
            {FUENTES_POR_MODULO[modulo].map((f, i) => (
              <li key={i}>
                <ItemFuente f={f} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
