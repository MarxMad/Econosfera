"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { BookOpen, Award, BookMarked, AlertTriangle } from "lucide-react";
import { buscarTerminos, getSlugDeTermino, getLetraInicial, getDefinicionSEO, FUENTES_CONCEPTOS, type TerminoGlosario } from "@/lib/glosario";
import { getLineaTiempoCompleta } from "@/lib/teoriasEconomicas";
import type { ModuloSimulador } from "./NavSimuladores";

interface GlosarioProps {
  moduloActivo?: ModuloSimulador;
  onIrAModulo?: (modulo: ModuloSimulador) => void;
  /** En página pública (/glosario): sin botón Ir al simulador y área expandida */
  standalone?: boolean;
}

const MODULO_LABEL: Record<string, string> = {
  inflacion: "Inflación", monetaria: "Teoría monetaria", macro: "Macro", micro: "Micro", finanzas: "Finanzas", contadores: "Contabilidad", general: "General",
  blockchain: "Blockchain", actuaria: "Actuaria", estadistica: "Estadística",
};

export default function Glosario({ moduloActivo, onIrAModulo, standalone }: GlosarioProps) {
  const searchParams = useSearchParams();
  const [busqueda, setBusqueda] = useState("");
  const [filtroModulo, setFiltroModulo] = useState<"todos" | ModuloSimulador | "general" | "teorias" | "nobel" | "contadores" | "crises">("todos");

  useEffect(() => {
    const filtro = searchParams.get("filtro");
    const validFiltros = ["teorias", "nobel", "crises", "contadores", "general"];
    if (filtro && validFiltros.includes(filtro)) {
      setFiltroModulo(filtro as any);
    }
  }, [searchParams]);

  const terminosFiltrados = useMemo(() => {
    let resultado = buscarTerminos(busqueda);
    if (filtroModulo !== "todos" && filtroModulo !== "teorias" && filtroModulo !== "nobel" && filtroModulo !== "crises") {
      resultado = resultado.filter((t) => t.modulo === filtroModulo);
    }
    return resultado;
  }, [busqueda, filtroModulo]);

  /** Agrupa términos por letra inicial (A, B, C...) para vista tipo diccionario. */
  const terminosPorLetra = useMemo(() => {
    const groups: Record<string, TerminoGlosario[]> = {};
    for (const t of terminosFiltrados) {
      const letra = getLetraInicial(t.termino);
      if (!groups[letra]) groups[letra] = [];
      groups[letra].push(t);
    }
    const ordenLetras = (a: string, b: string) => {
      if (a === "0-9") return -1;
      if (b === "0-9") return 1;
      if (a === "·") return 1;
      if (b === "·") return -1;
      return a.localeCompare(b, "es");
    };
    return Object.entries(groups).sort(([la], [lb]) => ordenLetras(la, lb));
  }, [terminosFiltrados]);

  const lineaTiempoCompleta = useMemo(() => getLineaTiempoCompleta(), []);
  const lineaTiempoFiltrada = useMemo(() => {
    if (filtroModulo === "teorias") return lineaTiempoCompleta.filter((e) => e.tipo === "teoria");
    if (filtroModulo === "nobel") return lineaTiempoCompleta.filter((e) => e.tipo === "nobel");
    if (filtroModulo === "crises") return lineaTiempoCompleta.filter((e) => e.tipo === "crisis");
    return lineaTiempoCompleta;
  }, [lineaTiempoCompleta, filtroModulo]);

  const modulos: Array<{ id: "todos" | ModuloSimulador | "general" | "teorias" | "nobel" | "contadores" | "crises"; label: string; icon?: React.ReactNode; destacado?: "teorias" | "nobel" | "crises" }> = [
    { id: "todos", label: "Todos" },
    { id: "teorias", label: "Teorías", icon: <BookMarked className="w-3.5 h-3.5" />, destacado: "teorias" },
    { id: "nobel", label: "Nobel", icon: <Award className="w-3.5 h-3.5" />, destacado: "nobel" },
    { id: "crises", label: "Crisis", icon: <AlertTriangle className="w-3.5 h-3.5" />, destacado: "crises" },
    { id: "inflacion", label: "Inflación" },
    { id: "monetaria", label: "Teoría monetaria" },
    { id: "macro", label: "Macro" },
    { id: "micro", label: "Micro" },
    { id: "finanzas", label: "Finanzas" },
    { id: "contadores", label: "Contabilidad" },
    { id: "blockchain", label: "Blockchain" },
    { id: "actuaria", label: "Actuaria" },
    { id: "estadistica", label: "Estadística" },
    { id: "general", label: "General" },
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
        {modulos.map((mod) => {
          const isTeorias = mod.destacado === "teorias";
          const isNobel = mod.destacado === "nobel";
          const isCrises = mod.id === "crises";
          const isActive = filtroModulo === mod.id;
          const activeClass = isTeorias && isActive
            ? "bg-indigo-600 text-white shadow shadow-indigo-200 dark:shadow-indigo-900/50"
            : isNobel && isActive
              ? "bg-amber-500 text-amber-950 shadow shadow-amber-200 dark:shadow-amber-900/50"
              : isCrises && isActive
                ? "bg-rose-600 text-white shadow shadow-rose-200 dark:shadow-rose-900/50"
                : isActive
                  ? "bg-blue-600 text-white shadow"
                  : "";
          const inactiveClass = isTeorias && !isActive
            ? "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/50"
            : isNobel && !isActive
              ? "bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 hover:bg-amber-100 dark:hover:bg-amber-900/40"
              : isCrises && !isActive
                ? "bg-rose-50 dark:bg-rose-950/30 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800 hover:bg-rose-100 dark:hover:bg-rose-900/40"
                : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600";
          return (
            <button
              key={mod.id}
              type="button"
              onClick={() => setFiltroModulo(mod.id)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${isActive ? activeClass : inactiveClass}`}
            >
              {mod.icon}
              {mod.label}
            </button>
          );
        })}
      </div>
      {/* Línea de tiempo: sección destacada cuando Teorías, Nobel o Crisis */}
      {(filtroModulo === "teorias" || filtroModulo === "nobel" || filtroModulo === "crises") && (
        <div className={`mb-6 rounded-3xl border-2 p-6 sm:p-8 shadow-xl overflow-hidden ${filtroModulo === "crises" ? "border-rose-200 dark:border-rose-800 bg-gradient-to-br from-rose-50 to-orange-50 dark:from-rose-950/40 dark:to-slate-900" :
          "border-indigo-200 dark:border-indigo-800 bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950/40 dark:to-slate-900"
          }`}>
          <div className="flex items-center gap-3 mb-6">
            <div className={`p-3 rounded-2xl ${filtroModulo === "nobel" ? "bg-amber-100 dark:bg-amber-900/40" :
              filtroModulo === "crises" ? "bg-rose-100 dark:bg-rose-900/40" :
                "bg-indigo-100 dark:bg-indigo-900/40"
              }`}>
              {filtroModulo === "nobel" ? (
                <Award className="w-8 h-8 text-amber-600 dark:text-amber-400" />
              ) : filtroModulo === "crises" ? (
                <AlertTriangle className="w-8 h-8 text-rose-600 dark:text-rose-400" />
              ) : (
                <BookMarked className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
              )}
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                {filtroModulo === "nobel" ? "Premios Nobel de Economía" :
                  filtroModulo === "crises" ? "Historia de las Crisis Financieras" :
                    "Línea de tiempo: Teorías económicas"}
              </h3>
              {filtroModulo === "nobel" && (
                <Link href="/premios-nobel-economia" className="inline-block mt-1 text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline">
                  Ver página dedicada con SEO optimizado →
                </Link>
              )}
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {filtroModulo === "nobel"
                  ? `${lineaTiempoFiltrada.length} galardonados desde 1969`
                  : filtroModulo === "crises"
                    ? `${lineaTiempoFiltrada.length} grandes pánicos desde 1637`
                    : `${lineaTiempoFiltrada.length} hitos desde 1758`}
              </p>
            </div>
          </div>
          <div className="relative border-l-2 border-indigo-300 dark:border-indigo-700 pl-6 sm:pl-8 space-y-6 max-h-[70vh] overflow-y-auto">
            {lineaTiempoFiltrada.map((evento, idx) => (
              <div key={idx} className="relative">
                <div className={`absolute -left-[29px] sm:-left-[33px] top-0 w-4 h-4 rounded-full border-2 bg-white dark:bg-slate-900 ${evento.tipo === "crisis" ? "border-rose-400 dark:border-rose-600" : "border-indigo-400 dark:border-indigo-600"
                  }`} />
                {evento.tipo === "nobel" && (
                  <div className="absolute -left-[31px] sm:-left-[35px] top-0 w-6 h-6 rounded-full bg-amber-400 dark:bg-amber-500 flex items-center justify-center shadow-md">
                    <Award className="w-3 h-3 text-amber-900" />
                  </div>
                )}
                {evento.tipo === "crisis" && (
                  <div className="absolute -left-[31px] sm:-left-[35px] top-0 w-6 h-6 rounded-full bg-rose-500 dark:bg-rose-600 flex items-center justify-center shadow-md">
                    <AlertTriangle className="w-3 h-3 text-white" />
                  </div>
                )}
                <div className={`rounded-xl border p-4 sm:p-5 transition-shadow hover:shadow-md ${evento.tipo === "nobel" ? "border-amber-200 dark:border-amber-800 bg-amber-50/80 dark:bg-amber-950/30" :
                  evento.tipo === "crisis" ? "border-rose-200 dark:border-rose-800 bg-rose-50/80 dark:bg-rose-950/30" :
                    "border-indigo-200 dark:border-indigo-800 bg-white dark:bg-slate-800/50"
                  }`}>
                  <div className="flex flex-wrap items-baseline gap-2 mb-1">
                    <span className={`font-mono text-base font-black ${evento.tipo === "crisis" ? "text-rose-600 dark:text-rose-400" : "text-indigo-600 dark:text-indigo-400"
                      }`}>{evento.year}</span>
                    {evento.tipo === "nobel" && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-200 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300">Nobel Economía</span>
                    )}
                    {evento.tipo === "crisis" && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-rose-200 text-rose-800 dark:bg-rose-900/50 dark:text-rose-300">Crisis Financiera</span>
                    )}
                  </div>
                  <h4 className="font-bold text-lg text-slate-800 dark:text-slate-100">{evento.nombre}</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5 font-medium">{evento.autor}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">{evento.descripcion}</p>
                  {"obra" in evento && evento.obra && (
                    <p className="text-xs text-slate-500 dark:text-slate-500 mt-2 italic">Obra: {evento.obra}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-5 border-t border-indigo-200 dark:border-indigo-800">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">Referencias</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Manuales de historia del pensamiento económico, Nobel Prize official.</p>
          </div>
        </div>
      )}

      <div className={`p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-y-auto ${(filtroModulo === "teorias" || filtroModulo === "nobel" || filtroModulo === "crises") ? "hidden" : ""} ${standalone ? "min-h-[60vh]" : "max-h-[600px]"}`}>
        {terminosFiltrados.length === 0 ? (
          <p className="text-slate-500 dark:text-slate-400 text-center py-8">
            No se encontraron términos con "{busqueda}"
          </p>
        ) : (
          <div className="space-y-8">
            {terminosPorLetra.map(([letra, terminos]) => (
              <div key={letra}>
                <div className="sticky top-0 z-10 py-2 mb-3 flex items-center gap-2 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white text-lg font-bold shadow">
                    {letra}
                  </span>
                  <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    {terminos.length} {terminos.length === 1 ? "término" : "términos"}
                  </span>
                </div>
                <div className="space-y-4">
                  {terminos.map((termino, idx) => {
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
                        <p className="text-slate-600 dark:text-slate-400 mb-2">{getDefinicionSEO(termino)}</p>
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
                      <Link key={`${letra}-${idx}`} href={`/glosario/${slug}`} className={className}>
                        {content}
                      </Link>
                    ) : (
                      <div key={`${letra}-${idx}`} className={className}>
                        {content}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
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
