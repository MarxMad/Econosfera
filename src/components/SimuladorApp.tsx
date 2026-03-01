"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { Save } from "lucide-react";
import NavSimuladores, { type ModuloSimulador } from "@/components/NavSimuladores";
import ReferenciasAcademicas from "@/components/ReferenciasAcademicas";
import SeccionFuentesColapsable from "@/components/SeccionFuentesColapsable";
import SimuladorMacro from "@/components/SimuladorMacro";
import SimuladorMicro from "@/components/SimuladorMicro";
import Finanzas from "@/components/Finanzas";
import BlockchainEcon from "@/components/BlockchainEcon";
import Glosario from "@/components/Glosario";
import Formulas from "@/components/Formulas";
import Actuaria from "@/components/Actuaria";
import Estadistica from "@/components/Estadistica";
import Inflacion from "@/components/Inflacion";
import type { VariablesSimulacion } from "@/lib/types";
import { calcularResultados } from "@/lib/calculos";
import { getEconomia, type PaisEconomia } from "@/lib/paises";
import { paramsToVariables } from "@/lib/escenarioUrl";

const VARIABLES_INICIALES: VariablesSimulacion = getEconomia("mexico").variablesPorDefecto;

export default function SimuladorApp() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const [modulo, setModulo] = useState<ModuloSimulador>("finanzas");
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
          <Inflacion
            variables={variables}
            setVariables={setVariables}
            resultados={resultados}
            datosAI={datosAI}
            setDatosAI={setDatosAI}
            initialData={loadedScenario}
          />
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

        {modulo === "actuaria" && (
          <>
            <Actuaria />
          </>
        )}

        {modulo === "estadistica" && (
          <>
            <Estadistica />
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
