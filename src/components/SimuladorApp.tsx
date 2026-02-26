"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { Save } from "lucide-react";
import NavSimuladores, { type ModuloSimulador } from "@/components/NavSimuladores";
import PanelVariables from "@/components/PanelVariables";
import Resultados from "@/components/Resultados";
import GraficoSimulacion from "@/components/GraficoSimulacion";
import GuiaRapida from "@/components/GuiaRapida";
import FuentesOficialesMexico from "@/components/FuentesOficialesMexico";
import ReferenciasAcademicas from "@/components/ReferenciasAcademicas";
import SeccionFuentesColapsable from "@/components/SeccionFuentesColapsable";
import SimuladorMacro from "@/components/SimuladorMacro";
import SimuladorMicro from "@/components/SimuladorMicro";
import AnalisisMinuta from "@/components/AnalisisMinuta";
import Finanzas from "@/components/Finanzas";
import BlockchainEcon from "@/components/BlockchainEcon";
import Glosario from "@/components/Glosario";
import Formulas from "@/components/Formulas";
import ComparadorEscenarios from "@/components/ComparadorEscenarios";
import ExportarCompartir from "@/components/ExportarCompartir";
import type { VariablesSimulacion } from "@/lib/types";
import { calcularResultados } from "@/lib/calculos";
import { getEconomia, type PaisEconomia } from "@/lib/paises";
import { paramsToVariables } from "@/lib/escenarioUrl";

const VARIABLES_INICIALES: VariablesSimulacion = getEconomia("mexico").variablesPorDefecto;

export default function SimuladorApp() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const [modulo, setModulo] = useState<ModuloSimulador>("inflacion");
  const [pais, setPais] = useState<PaisEconomia>("mexico");
  const [variables, setVariables] = useState<VariablesSimulacion>(VARIABLES_INICIALES);
  const resultados = useMemo(() => calcularResultados(variables), [variables]);
  const [mostrarComparador, setMostrarComparador] = useState(false);
  const [datosAI, setDatosAI] = useState<any>(null);

  useEffect(() => {
    const scenarioId = searchParams.get("scenarioId");
    if (scenarioId) {
      const fetchScenario = async () => {
        const { getScenarioById } = await import("@/lib/actions/scenarioActions");
        const scenario = await getScenarioById(scenarioId);
        if (scenario) {
          if (scenario.type === "MACRO") setModulo("macro");
          else if (scenario.type === "MICRO") setModulo("micro");
          else if (scenario.type === "FINANZAS") setModulo("finanzas");
          else {
            setModulo("inflacion");
            if (scenario.data) {
              const data = scenario.data as any;
              if (data.variables) setVariables(data.variables);
              if (data.datosAI) setDatosAI(data.datosAI);
            }
          }

          setLoadedScenario(scenario);
        }
      };
      fetchScenario();
    } else {
      const desdeUrl = paramsToVariables(searchParams);
      if (desdeUrl) setVariables(desdeUrl);
    }
  }, [searchParams]);

  const [loadedScenario, setLoadedScenario] = useState<any>(null);

  const cargarDatosReferencia = () => {
    setVariables(getEconomia(pais).variablesPorDefecto);
  };

  return (
    <div className="bg-slate-100 dark:bg-slate-950">

      <main className="max-w-6xl mx-auto px-4 py-6 sm:py-8">
        <div className="mb-6">
          <NavSimuladores modulo={modulo} onChange={setModulo} />
        </div>

        {modulo === "inflacion" && (
          <>
            <div className="mb-6">
              <AnalisisMinuta
                onAnalisisComplete={setDatosAI}
                initialData={datosAI}
              />
            </div>
            <div className="mb-6">
              <GuiaRapida />
            </div>
            <div className="mb-4 flex flex-wrap items-center justify-end gap-2">
              <ExportarCompartir
                variables={variables}
                resultados={resultados}
                idGrafico="grafico-inflacion"
                datosAI={datosAI}
              />
              {session && (
                <button
                  type="button"
                  onClick={async () => {
                    const { saveScenario } = await import("@/lib/actions/scenarioActions");
                    const resSave = await saveScenario({
                      type: "INFLACION",
                      name: `Simulación Inflación ${new Date().toLocaleDateString()}`,
                      variables: { variables, datosAI },
                      results: resultados,
                    });
                    if (resSave.success) alert("Escenario guardado");
                    else alert(resSave.error);
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold bg-blue-600 text-white hover:bg-blue-500 transition-all shadow-md active:scale-95"
                >
                  <Save className="w-4 h-4" />
                  Guardar
                </button>
              )}
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
              <SeccionFuentesColapsable titulo="Fuentes oficiales y referencias para profundizar" defaultAbierto={false}>
                <FuentesOficialesMexico />
                <ReferenciasAcademicas modulo="inflacion" />
              </SeccionFuentesColapsable>
            </div>
          </>
        )}

        {modulo === "macro" && (
          <>
            <SimuladorMacro initialData={loadedScenario} />
            <div className="mt-6">
              <SeccionFuentesColapsable titulo="Referencias para profundizar" defaultAbierto={false}>
                <ReferenciasAcademicas modulo="macro" />
              </SeccionFuentesColapsable>
            </div>
          </>
        )}
        {modulo === "micro" && (
          <>
            <SimuladorMicro initialData={loadedScenario} />
            <div className="mt-6">
              <SeccionFuentesColapsable titulo="Referencias para profundizar" defaultAbierto={false}>
                <ReferenciasAcademicas modulo="micro" />
              </SeccionFuentesColapsable>
            </div>
          </>
        )}

        {modulo === "finanzas" && (
          <>
            <Finanzas onIrAModulo={setModulo} initialData={loadedScenario} />
            <div className="mt-6">
              <SeccionFuentesColapsable titulo="Referencias para profundizar" defaultAbierto={false}>
                <ReferenciasAcademicas modulo="finanzas" />
              </SeccionFuentesColapsable>
            </div>
          </>
        )}

        {modulo === "blockchain" && (
          <>
            <BlockchainEcon />
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
