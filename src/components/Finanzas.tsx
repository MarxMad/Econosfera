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
} from "./simuladores-finanzas";

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
}

export default function Finanzas({ onIrAModulo }: FinanzasProps) {
  const [mostrarSimuladores, setMostrarSimuladores] = useState(true);

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
            Simuladores y mapas conceptuales
          </span>
          <span className="text-slate-500 dark:text-slate-400 text-sm">
            {mostrarSimuladores ? "Ocultar" : "Ver más"}
          </span>
        </button>
        {mostrarSimuladores && (
          <div className="px-5 pb-5 pt-0 border-t border-slate-200 dark:border-slate-700 space-y-6">
            <div className="grid gap-4 pt-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-400">
                <GitBranch className="w-4 h-4" aria-hidden />
                Flujos y mapas
              </div>
              <FlujoSistemaFinanciero />
              <MapaInstrumentos />
            </div>
            <div className="grid gap-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-400">
                <Map className="w-4 h-4" aria-hidden />
                Calculadoras
              </div>
              <SimuladorVPVF />
              <SimuladorBono />
              <SimuladorCetes />
              <SimuladorAhorro />
            </div>
          </div>
        )}
      </div>

      <SeccionFinanzas id="clasificacion-mercados" titulo="Características y clasificación de los mercados financieros" icono={BarChart2}>
        <div className="pt-4 space-y-4 text-sm text-slate-700 dark:text-slate-300">
          <p>
            Los mercados financieros se clasifican según el <strong>plazo</strong>, el <strong>tipo de renta</strong> y el <strong>momento de la operación</strong>.
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Por tiempo:</strong> <strong>Mercados de corto plazo</strong> (menor a un año): dinero, cetes, pagarés. <strong>Mercados de largo plazo</strong> (más de un año): bonos, obligaciones, acciones.</li>
            <li><strong>Por renta:</strong> <strong>Renta fija</strong> (flujos predecibles: cupones y principal) y <strong>Renta variable</strong> (dividendos y plusvalía, ej. acciones).</li>
            <li><strong>Mercado primario y secundario:</strong> En el <strong>primario</strong> el emisor coloca los valores por primera vez (IPO, colocación de bonos). En el <strong>secundario</strong> los inversionistas compran y venden entre sí (bolsa), dando liquidez.</li>
          </ul>
        </div>
      </SeccionFinanzas>

      <SeccionFinanzas id="estructura-mercados" titulo="Estructura de los mercados financieros" icono={Layers}>
        <div className="pt-4 space-y-4 text-sm text-slate-700 dark:text-slate-300">
          <p>
            La estructura distingue mercados <strong>bursátiles</strong> (organizados, en bolsa) y <strong>extrabursátiles</strong> (OTC, fuera de bolsa).
          </p>
          <div className="rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/50 p-4 space-y-3">
            <p className="font-semibold text-slate-800 dark:text-slate-100">Bursátiles</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Mercado de valores:</strong> Acciones, bonos y otros valores listados en bolsa (BMV, etc.).</li>
              <li><strong>Mercado de derivados:</strong> Futuros y opciones sobre índices, tasas o subyacentes, negociados en bolsa.</li>
            </ul>
            <p className="font-semibold text-slate-800 dark:text-slate-100 pt-2">Extrabursátiles (OTC)</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Monedas y metales:</strong> Divisas, metales preciosos; spot y derivados OTC.</li>
              <li><strong>Derivados OTC:</strong> <strong>Forwards</strong> (contratos a plazo), <strong>swaps</strong> (intercambio de flujos, ej. tasas o divisas), <strong>warrants</strong> (opciones emitidas por instituciones).</li>
            </ul>
          </div>
        </div>
      </SeccionFinanzas>

      <SeccionFinanzas id="bancos" titulo="Bancos e intermediación financiera" icono={Building2} defaultAbierto={true}>
        <div className="pt-4 space-y-4 text-sm text-slate-700 dark:text-slate-300">
          <p>
            Los <strong>bancos</strong> son instituciones que captan recursos del público (depósitos) y los canalizan hacia el crédito y la inversión. Intermedian entre ahorradores y demandantes de financiamiento. En México, la regulación y supervisión corresponde a la CNBV y el Banco de México (política monetaria y sistema de pagos).
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Banca comercial:</strong> Depósitos, créditos al consumo, hipotecas, tarjetas.</li>
            <li><strong>Banca de desarrollo:</strong> Financiamiento a sectores prioritarios (Bancomext, Nafin, etc.).</li>
            <li><strong>Banco central:</strong> Emisión de moneda, tasa de interés de referencia, prestamista de última instancia.</li>
          </ul>
        </div>
      </SeccionFinanzas>

      <SeccionFinanzas id="instrumentos-financieros" titulo="Instrumentos financieros" icono={Wallet}>
        <div className="pt-4 space-y-4 text-sm text-slate-700 dark:text-slate-300">
          <p>
            Son contratos o activos que representan un derecho a flujos de efectivo (renta fija, variable o mixta). Se clasifican en <strong>instrumentos de deuda</strong> (préstamos, bonos, cetes) y <strong>instrumentos de capital</strong> (acciones). También existen <strong>derivados</strong> (futuros, opciones, swaps) cuyo valor depende de un subyacente.
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Renta fija:</strong> Pagos conocidos (cupones, principal). Ej.: bonos, cetes, pagarés.</li>
            <li><strong>Renta variable:</strong> Rendimiento ligado a resultados (dividendos, plusvalía). Ej.: acciones.</li>
            <li><strong>Instrumentos híbridos:</strong> Características de deuda y capital (acciones preferentes, obligaciones convertibles).</li>
          </ul>
        </div>
      </SeccionFinanzas>

      <SeccionFinanzas id="instrumentos-deuda" titulo="Instrumentos de deuda" icono={FileText}>
        <div className="pt-4 space-y-4 text-sm text-slate-700 dark:text-slate-300">
          <p>
            Son compromisos de pago: el emisor debe devolver el principal y, en su caso, intereses (cupones). Incluyen valores gubernamentales y corporativos.
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Cetes (México):</strong> Certificados de la Tesorería a plazos (28 días a 1 año). Tasa descontada, sin cupones.</li>
            <li><strong>Bondes / Udibonos:</strong> Bonos del gobierno federal a mediano y largo plazo; Udibonos indexados a inflación.</li>
            <li><strong>Pagarés bursátiles:</strong> Emitidos por empresas en el mercado de valores.</li>
            <li><strong>Obligaciones:</strong> Deuda corporativa con cupones periódicos.</li>
          </ul>
        </div>
      </SeccionFinanzas>

      <SeccionFinanzas id="titulos-deuda" titulo="Títulos de deuda y bursátil" icono={Landmark}>
        <div className="pt-4 space-y-4 text-sm text-slate-700 dark:text-slate-300">
          <p>
            Los <strong>títulos de deuda</strong> son valores que representan un crédito frente al emisor (gobierno o empresa). Se negocian en mercados primarios (emisión) y secundarios (reventa). La <strong>bolsa de valores</strong> (BMV en México) es el mercado organizado donde se colocan y operan acciones y diversos instrumentos de deuda.
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Mercado de deuda:</strong> Gubernamental (cetes, bondes) y corporativo (pagarés, obligaciones).</li>
            <li><strong>Mercado de capitales (bursátil):</strong> Acciones (capital) y valores de deuda listados.</li>
            <li><strong>Índices bursátiles:</strong> IPC (BMV), S&P 500, etc.; miden el rendimiento de una canasta de acciones.</li>
          </ul>
        </div>
      </SeccionFinanzas>

      <SeccionFinanzas id="bursatil" titulo="Mercado bursátil" icono={TrendingUp}>
        <div className="pt-4 space-y-4 text-sm text-slate-700 dark:text-slate-300">
          <p>
            El <strong>mercado bursátil</strong> (o de valores) es el espacio donde se emiten y negocian acciones, títulos de deuda y otros valores. Facilita la canalización del ahorro hacia la inversión y ofrece liquidez mediante la compraventa en el mercado secundario.
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Mercado primario:</strong> Oferta inicial de valores (IPO en acciones; colocación de bonos).</li>
            <li><strong>Mercado secundario:</strong> Operaciones entre inversionistas (bolsa).</li>
            <li><strong>BMV (México):</strong> Bolsa Mexicana de Valores; listado de acciones, ETF, fideicomisos y deuda.</li>
          </ul>
        </div>
      </SeccionFinanzas>
    </div>
  );
}
