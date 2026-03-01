"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { BookOpen, Award, BookMarked } from "lucide-react";
import { buscarTerminos, getSlugDeTermino, FUENTES_CONCEPTOS, type TerminoGlosario } from "@/lib/glosario";
import { getLineaTiempoCompleta } from "@/lib/teoriasEconomicas";
import type { ModuloSimulador } from "./NavSimuladores";

interface GlosarioProps {
  moduloActivo?: ModuloSimulador;
  onIrAModulo?: (modulo: ModuloSimulador) => void;
  /** En página pública (/glosario): sin botón Ir al simulador y área expandida */
  standalone?: boolean;
}

const MODULO_LABEL: Record<string, string> = {
  inflacion: "Inflación", macro: "Macro", micro: "Micro", finanzas: "Finanzas", general: "General",
  blockchain: "Blockchain", actuaria: "Actuaria", estadistica: "Estadística",
};

export default function Glosario({ moduloActivo, onIrAModulo, standalone }: GlosarioProps) {
  const [busqueda, setBusqueda] = useState("");
  const [filtroModulo, setFiltroModulo] = useState<"todos" | ModuloSimulador | "general" | "teorias">("todos");

  const terminosFiltrados = useMemo(() => {
    let resultado = buscarTerminos(busqueda);
    if (filtroModulo !== "todos" && filtroModulo !== "teorias") {
      resultado = resultado.filter((t) => t.modulo === filtroModulo);
    }
    return resultado;
  }, [busqueda, filtroModulo]);

  const lineaTiempo = useMemo(() => getLineaTiempoCompleta(), []);

  const modulos: Array<{ id: "todos" | ModuloSimulador | "general" | "teorias"; label: string }> = [
    { id: "todos", label: "Todos" },
    { id: "inflacion", label: "Inflación" },
    { id: "macro", label: "Macro" },
    { id: "micro", label: "Micro" },
    { id: "finanzas", label: "Finanzas" },
    { id: "blockchain", label: "Blockchain" },
    { id: "actuaria", label: "Actuaria" },
    { id: "estadistica", label: "Estadística" },
    { id: "general", label: "General" },
    { id: "teorias", label: "Teorías y Nobel" },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-900 p-8 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 text-blue-500">
          <BookOpen className="w-24 h-24" />
        </div>
        <div className="relative z-10">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-3 flex items-center gap-3">
            <BookOpen className="text-blue-500 w-8 h-8" />
            Glosario de Términos
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm max-w-2xl italic mb-6">
            {standalone
              ? "Diccionario de referencia mundial: busca conceptos de inflación, política monetaria, macroeconomía, microeconomía y finanzas. No requiere cuenta."
              : "Diccionario económico interactivo para encontrar definiciones y conceptos clave en un instante."}
          </p>
          <input
            type="text"
            placeholder="Buscar término..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full lg:w-96 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2 p-1 bg-slate-200 dark:bg-slate-800/50 rounded-2xl w-fit">
        {modulos.map((mod) => (
          <button
            key={mod.id}
            type="button"
            onClick={() => setFiltroModulo(mod.id)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${filtroModulo === mod.id
              ? "bg-blue-600 text-white shadow"
              : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"
              }`}
          >
            {mod.label}
          </button>
        ))}
      </div>
      <div className={`p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-y-auto ${standalone ? "min-h-[60vh]" : "max-h-[600px]"}`}>
        {filtroModulo === "teorias" ? (
          <div className="space-y-0">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-2">
              <BookMarked className="w-5 h-5 text-amber-500" />
              Línea de tiempo: teorías económicas y premios Nobel
            </h3>
            <div className="relative border-l-2 border-slate-200 dark:border-slate-700 pl-6 sm:pl-8 space-y-8 pb-4">
              {lineaTiempo.map((evento, idx) => (
                <div key={idx} className="relative">
                  <div className="absolute -left-[29px] sm:-left-[33px] top-0 w-4 h-4 rounded-full border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900" />
                  {evento.tipo === "nobel" && (
                    <div className="absolute -left-[31px] sm:-left-[35px] top-0 w-5 h-5 rounded-full bg-amber-400 dark:bg-amber-500 flex items-center justify-center">
                      <Award className="w-2.5 h-2.5 text-amber-900" />
                    </div>
                  )}
                  <div className={`rounded-xl border p-4 ${evento.tipo === "nobel" ? "border-amber-200 dark:border-amber-900/50 bg-amber-50/50 dark:bg-amber-950/20" : "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/30"}`}>
                    <div className="flex flex-wrap items-baseline gap-2 mb-1">
                      <span className="font-mono text-sm font-bold text-blue-600 dark:text-blue-400">{evento.year}</span>
                      {evento.tipo === "nobel" && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-200 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300">Nobel Economía</span>
                      )}
                    </div>
                    <h4 className="font-bold text-slate-800 dark:text-slate-100">{evento.nombre}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{evento.autor}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">{evento.descripcion}</p>
                    {"obra" in evento && evento.obra && (
                      <p className="text-xs text-slate-500 dark:text-slate-500 mt-2 italic">Obra: {evento.obra}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : terminosFiltrados.length === 0 ? (
          <p className="text-slate-500 dark:text-slate-400 text-center py-8">
            No se encontraron términos con "{busqueda}"
          </p>
        ) : (
          <div className="space-y-4">
            {terminosFiltrados.map((termino, idx) => {
              const slug = getSlugDeTermino(termino.termino);
              const isLink = Boolean(slug && standalone);
              const content = (
                <>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg">{termino.termino}</h3>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 rounded text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                        {MODULO_LABEL[termino.modulo] ?? termino.modulo}
                      </span>
                      {onIrAModulo && !standalone && termino.modulo !== "general" && termino.modulo !== "teorias" && termino.modulo !== moduloActivo && (
                        <button
                          type="button"
                          onClick={() => onIrAModulo(termino.modulo as ModuloSimulador)}
                          className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          Ir →
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 mb-2">{termino.definicion}</p>
                  {termino.formula && (
                    <div className="mt-2 p-3 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 overflow-x-auto">
                      <p className="text-sm font-mono text-slate-800 dark:text-slate-200 whitespace-nowrap">{termino.formula}</p>
                    </div>
                  )}
                  {termino.ejemplo && (
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 italic">
                      <strong>Ejemplo:</strong> {termino.ejemplo}
                    </p>
                  )}
                  {isLink && (
                    <p className="mt-2 text-xs text-blue-600 dark:text-blue-400 font-medium">
                      Ver definición completa →
                    </p>
                  )}
                </>
              );
              const className = `p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/30 hover:shadow-md transition-shadow ${isLink ? "block" : ""}`;
              return isLink && slug ? (
                <Link key={idx} href={`/glosario/${slug}`} className={className}>
                  {content}
                </Link>
              ) : (
                <div key={idx} className={className}>
                  {content}
                </div>
              );
            })}
          </div>
        )}
        <div className="mt-6 pt-5 border-t border-slate-200 dark:border-slate-700">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">
            Basado en
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
            Las definiciones de este glosario se apoyan en documentos y revistas académicas mexicanas e internacionales:
          </p>
          <ul className="flex flex-wrap gap-2">
            {FUENTES_CONCEPTOS.map((f) => (
              <li key={f.nombre}>
                <a
                  href={f.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                >
                  {f.nombre} →
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
