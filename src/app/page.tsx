"use client";

import { useMemo, useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import NavSimuladores, { type ModuloSimulador } from "@/components/NavSimuladores";
import PanelVariables from "@/components/PanelVariables";
import Resultados from "@/components/Resultados";
import GraficoSimulacion from "@/components/GraficoSimulacion";
import GuiaRapida from "@/components/GuiaRapida";
import ConceptosYFuentes from "@/components/ConceptosYFuentes";
import FuentesOficialesMexico from "@/components/FuentesOficialesMexico";
import ReferenciasAcademicas from "@/components/ReferenciasAcademicas";
import SeccionFuentesColapsable from "@/components/SeccionFuentesColapsable";
import SimuladorMacro from "@/components/SimuladorMacro";
import SimuladorMicro from "@/components/SimuladorMicro";
import Glosario from "@/components/Glosario";
import Formulas from "@/components/Formulas";
import PreguntasPractica from "@/components/PreguntasPractica";
import ComparadorEscenarios from "@/components/ComparadorEscenarios";
import ExportarCompartir from "@/components/ExportarCompartir";
import type { VariablesSimulacion } from "@/lib/types";
import { calcularResultados } from "@/lib/calculos";
import { getEconomia, type PaisEconomia } from "@/lib/paises";
import { paramsToVariables } from "@/lib/escenarioUrl";

const VARIABLES_INICIALES: VariablesSimulacion = getEconomia("mexico").variablesPorDefecto;

function HomeContent() {
  const searchParams = useSearchParams();
  const [modulo, setModulo] = useState<ModuloSimulador>("inflacion");
  const [pais, setPais] = useState<PaisEconomia>("mexico");
  const [variables, setVariables] = useState<VariablesSimulacion>(VARIABLES_INICIALES);
  const resultados = useMemo(() => calcularResultados(variables), [variables]);
  const [mostrarComparador, setMostrarComparador] = useState(false);

  useEffect(() => {
    const desdeUrl = paramsToVariables(searchParams);
    if (desdeUrl) setVariables(desdeUrl);
  }, [searchParams]);

  const cargarDatosReferencia = () => {
    setVariables(getEconomia(pais).variablesPorDefecto);
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950">
      <header className="relative bg-gradient-to-br from-[#132238] via-[#1d3557] to-[#204981] text-white shadow-lg">
        <div className="relative max-w-6xl mx-auto px-4 py-8 sm:py-10">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div className="flex items-start gap-4 sm:gap-5">
              <img
                src="/Logo.svg"
                alt="Econosfera"
                className="h-20 sm:h-24 md:h-28 w-auto flex-shrink-0"
                width={112}
                height={112}
              />
              <div>
                <p className="text-blue-100 text-sm font-medium uppercase tracking-wider mb-1">
                  Herramienta didáctica
                </p>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white drop-shadow-sm">
                  Econosfera
                </h1>
                <p className="mt-2 text-slate-100 text-base max-w-xl">
                  Inflación y política monetaria, macroeconomía (multiplicador keynesiano) y microeconomía (oferta y demanda, elasticidad). Para prácticas y trabajos.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-blue-100 text-sm">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Resultados en tiempo real
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 sm:py-8">
        <div className="mb-6">
          <NavSimuladores modulo={modulo} onChange={setModulo} />
        </div>

        {modulo === "inflacion" && (
          <>
            <div className="mb-6">
              <ConceptosYFuentes
                pais={pais}
                onPaisChange={setPais}
                onCargarDatosReferencia={cargarDatosReferencia}
              />
            </div>
            <SeccionFuentesColapsable titulo="Fuentes oficiales y referencias para profundizar" defaultAbierto={false}>
              <FuentesOficialesMexico />
              <ReferenciasAcademicas modulo="inflacion" />
            </SeccionFuentesColapsable>
            <div className="mb-6">
              <GuiaRapida />
            </div>
            <div className="mb-4 flex flex-wrap items-center justify-end gap-2">
              <ExportarCompartir variables={variables} resultados={resultados} idGrafico="grafico-inflacion" />
            </div>
            <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
              <div className="lg:col-span-1">
                <PanelVariables variables={variables} onChange={setVariables} />
              </div>
              <div className="lg:col-span-2 space-y-6">
                <Resultados resultados={resultados} />
                <GraficoSimulacion variables={variables} resultados={resultados} />
              </div>
            </div>
            <div className="mt-6 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 shadow-lg overflow-hidden">
              <button
                type="button"
                onClick={() => setMostrarComparador(!mostrarComparador)}
                className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
                aria-expanded={mostrarComparador}
              >
                <span className="font-bold text-slate-800 dark:text-slate-100">Comparar escenarios A vs B</span>
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  {mostrarComparador ? "Ocultar" : "Mostrar"}
                </span>
              </button>
              {mostrarComparador && (
                <div className="px-4 pb-4 pt-0 border-t border-slate-200 dark:border-slate-700">
                  <ComparadorEscenarios escenarioActual={variables} onCargarEnPrincipal={setVariables} />
                </div>
              )}
            </div>
            <div className="mt-6">
              <PreguntasPractica modulo={modulo} onIrAModulo={setModulo} />
            </div>
          </>
        )}

        {modulo === "macro" && (
          <>
            <SimuladorMacro />
            <div className="mt-6">
              <SeccionFuentesColapsable titulo="Referencias para profundizar" defaultAbierto={false}>
                <ReferenciasAcademicas modulo="macro" />
              </SeccionFuentesColapsable>
            </div>
            <div className="mt-6">
              <PreguntasPractica modulo={modulo} onIrAModulo={setModulo} />
            </div>
          </>
        )}
        {modulo === "micro" && (
          <>
            <SimuladorMicro />
            <div className="mt-6">
              <SeccionFuentesColapsable titulo="Referencias para profundizar" defaultAbierto={false}>
                <ReferenciasAcademicas modulo="micro" />
              </SeccionFuentesColapsable>
            </div>
            <div className="mt-6">
              <PreguntasPractica modulo={modulo} onIrAModulo={setModulo} />
            </div>
          </>
        )}

        {modulo === "glosario" && (
          <>
            <Glosario onIrAModulo={setModulo} />
            <div className="mt-6">
              <SeccionFuentesColapsable titulo="Referencias para profundizar (todas las áreas)" defaultAbierto={false}>
                <ReferenciasAcademicas modulo="todos" />
              </SeccionFuentesColapsable>
            </div>
          </>
        )}

        {modulo === "formulas" && (
          <>
            <Formulas onIrAModulo={setModulo} />
            <div className="mt-6">
              <SeccionFuentesColapsable titulo="Referencias para profundizar (todas las áreas)" defaultAbierto={false}>
                <ReferenciasAcademicas modulo="todos" />
              </SeccionFuentesColapsable>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-100 dark:bg-slate-950 animate-pulse" />}>
      <HomeContent />
    </Suspense>
  );
}
