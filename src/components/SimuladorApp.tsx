"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
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
import Finanzas from "@/components/Finanzas";
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

export default function SimuladorApp() {
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
    <div className="bg-slate-100 dark:bg-slate-950">
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <img src="/logos.svg" alt="Econosfera" className="h-9 w-auto" width={36} height={36} />
            <span className="font-semibold">Econosfera</span>
          </Link>
          <Link
            href="/"
            className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
          >
            ← Inicio
          </Link>
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

        {modulo === "finanzas" && (
          <>
            <Finanzas onIrAModulo={setModulo} />
            <div className="mt-6">
              <SeccionFuentesColapsable titulo="Referencias para profundizar" defaultAbierto={false}>
                <ReferenciasAcademicas modulo="finanzas" />
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
