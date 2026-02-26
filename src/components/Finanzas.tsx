"use client";

import { useState } from "react";
import { Building2, Wallet, FileText, TrendingUp, Landmark, Calculator, GitBranch, Map, BarChart2, Layers } from "lucide-react";
import type { ModuloSimulador } from "./NavSimuladores";
import {
  SimuladorVPVF,
  SimuladorBono,
  SimuladorCetes,
  SimuladorAhorro,
  FlujoSistemaFinanciero,
  MapaInstrumentos,
  MapaEstructuraCapital,
  SimuladorValuacion,
  SimuladorDCF
} from "./simuladores-finanzas";
import { BookOpen } from "lucide-react";

interface SeccionFinanzasProps {
  id: string;
  titulo: string;
  icono: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
  defaultAbierto?: boolean;
}

function SeccionFinanzas({ id, titulo, icono: Icono, children, defaultAbierto = false }: SeccionFinanzasProps) {
  const [abierto, setAbierto] = useState(defaultAbierto);
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 shadow-lg overflow-hidden">
      <button
        type="button"
        onClick={() => setAbierto(!abierto)}
        className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
        aria-expanded={abierto}
        aria-controls={id}
        id={`${id}-btn`}
      >
        <span className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-100">
          <Icono className="w-5 h-5 text-blue-600 dark:text-blue-400" aria-hidden />
          {titulo}
        </span>
        <span className="text-slate-500 dark:text-slate-400 text-sm">
          {abierto ? "Ocultar" : "Ver más"}
        </span>
      </button>
      {abierto && (
        <div id={id} className="px-5 pb-5 pt-0 border-t border-slate-200 dark:border-slate-700" aria-labelledby={`${id}-btn`}>
          {children}
        </div>
      )}
    </div>
  );
}

interface FinanzasProps {
  onIrAModulo?: (modulo: ModuloSimulador) => void;
  initialData?: any;
}

export default function Finanzas({ onIrAModulo, initialData }: FinanzasProps) {
  const [mostrarSimuladores, setMostrarSimuladores] = useState(!!initialData);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-slate-800 dark:to-slate-800 p-5">
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">Finanzas: bancos, instrumentos y mercados</h2>
        <p className="text-slate-600 dark:text-slate-400 text-sm">
          Conceptos de intermediación financiera, instrumentos de deuda, títulos bursátiles y mercado de valores. Para profundizar en términos, usa el{" "}
          {onIrAModulo ? (
            <button type="button" onClick={() => onIrAModulo("glosario")} className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
              Glosario
            </button>
          ) : (
            "Glosario"
          )}{" "}
          y las referencias al final.
        </p>
      </div>

      {/* Simuladores y visualizaciones */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 shadow-lg overflow-hidden">
        <button
          type="button"
          onClick={() => setMostrarSimuladores(!mostrarSimuladores)}
          className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
          aria-expanded={mostrarSimuladores}
        >
          <span className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-100">
            <Calculator className="w-5 h-5 text-emerald-600 dark:text-emerald-400" aria-hidden />
            Calculadoras y Simuladores Financieros
          </span>
          <span className="text-slate-500 dark:text-slate-400 text-sm">
            {mostrarSimuladores ? "Ocultar" : "Ver más"}
          </span>
        </button>
        {mostrarSimuladores && (
          <div className="px-5 pb-5 pt-0 border-t border-slate-200 dark:border-slate-700 space-y-6">
            <div className="grid gap-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-400">
                <Map className="w-4 h-4" aria-hidden />
                Calculadoras
              </div>
              <SimuladorVPVF initialData={initialData?.subType === "VPVF" ? initialData : undefined} />
              <SimuladorBono initialData={initialData?.subType === "BONO" ? initialData : undefined} />
              <SimuladorCetes initialData={initialData?.subType === "CETES" ? initialData : undefined} />
              <SimuladorAhorro initialData={initialData?.subType === "AHORRO" ? initialData : undefined} />
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-400">
                <BarChart2 className="w-4 h-4" aria-hidden />
                Valuación y Ratios
              </div>
              <SimuladorValuacion initialData={initialData?.subType === "VALUACION" ? initialData : undefined} />
              <SimuladorDCF />
            </div>
          </div>
        )}
      </div>

      <SeccionFinanzas id="conceptos" titulo="Conceptos y Estructura del Mercado" icono={BookOpen} defaultAbierto={false}>
        <div className="pt-4 space-y-8 text-sm text-slate-700 dark:text-slate-300">

          <div className="space-y-3">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2"><Building2 className="w-5 h-5 text-blue-500" /> Bancos e intermediación financiera</h3>
            <p>Los <strong>bancos</strong> son instituciones que captan recursos del público (depósitos) y los canalizan hacia el crédito y la inversión. Intermedian entre ahorradores y demandantes de financiamiento. En México, la regulación y supervisión corresponde a la CNBV y el Banco de México.</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Banca comercial:</strong> Depósitos, créditos al consumo, hipotecas, tarjetas.</li>
              <li><strong>Banca de desarrollo:</strong> Financiamiento a sectores prioritarios (Bancomext, Nafin, etc.).</li>
              <li><strong>Banco central:</strong> Emisión de moneda, tasa de interés de referencia, prestamista de última instancia.</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2"><Wallet className="w-5 h-5 text-emerald-500" /> Instrumentos financieros</h3>
            <p>Son contratos o activos que representan un derecho a flujos de efectivo. Se clasifican en <strong>instrumentos de deuda</strong> (préstamos, bonos, cetes) e <strong>instrumentos de capital</strong> (acciones).</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Renta fija:</strong> Pagos conocidos (cupones, principal). Ej.: bonos, cetes, pagarés.</li>
              <li><strong>Renta variable:</strong> Rendimiento ligado a resultados (dividendos, plusvalía). Ej.: acciones.</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2"><Layers className="w-5 h-5 text-indigo-500" /> Estructura y clasificación de los mercados financieros</h3>
            <p>Los mercados financieros se clasifican según el <strong>plazo</strong>, el <strong>tipo de renta</strong> y la <strong>estructura (bursátiles/extrabursátiles)</strong>.</p>
            <div className="rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/50 p-4 space-y-3">
              <p className="font-semibold text-slate-800 dark:text-slate-100">Por plazo y renta:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Corto plazo:</strong> mercado de dinero (cetes, pagarés).</li>
                <li><strong>Largo plazo y variable:</strong> mercado de capitales (bonos largos, acciones).</li>
              </ul>
              <p className="font-semibold text-slate-800 dark:text-slate-100 pt-2">Bursátiles y Extrabursátiles:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Bursátiles (BMV, NYSE):</strong> Mercados organizados para la negociación listada con alta regulación.</li>
                <li><strong>Extrabursátiles (OTC):</strong> Acuerdos a la medida fuera de la bolsa, como swaps o forwards.</li>
              </ul>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2"><Map className="w-5 h-5 text-amber-500" /> Flujos y Mapas Visuales</h3>
            <p className="mb-4">Esquemas y diagramas interactivos para visualizar la intermediación, los tipos de instrumentos y cómo se estructura el riesgo de inversión.</p>
            <div className="grid gap-6">
              <FlujoSistemaFinanciero />
              <MapaInstrumentos />
              <MapaEstructuraCapital />
            </div>
          </div>
        </div>
      </SeccionFinanzas>
    </div>
  );
}
