"use client";

import { useState } from "react";
import {
  Building2,
  Wallet,
  TrendingUp,
  Landmark,
  Calculator,
  BarChart2,
  Layers,
  PieChart,
  Zap,
  LineChart,
  BookOpen,
  Info,
  Lock,
  Newspaper
} from "lucide-react";
import type { ModuloSimulador } from "./NavSimuladores";
import { useSession } from "next-auth/react";
import { canAccess, getRequiredPlan } from "@/lib/simulatorPlans";
import SimulatorLocked from "./SimulatorLocked";
import {
  SimuladorVPVF,
  SimuladorBono,
  SimuladorCetes,
  SimuladorAhorro,
  SimuladorAmortizacion,
  SimuladorVPNTIR,
  SimuladorWACC,
  SimuladorForward,
  SimuladorBreakEven,
  SimuladorPortafolio2,
  FlujoSistemaFinanciero,
  MapaInstrumentos,
  MapaEstructuraCapital,
  SimuladorValuacion,
  SimuladorDCF,
  SimuladorMarkowitz,
  SimuladorBlackScholes,
  SimuladorYieldCurve,
  SimuladorInteresSimpleCompuesto,
  SimuladorRegla72,
  SimuladorTasaEfectiva,
  SimuladorImpactoNoticias,
  SimuladorCorrelacionFundamental
} from "./simuladores-finanzas";

export default function Finanzas({ onIrAModulo, initialData }: { onIrAModulo?: (m: ModuloSimulador) => void; initialData?: any }) {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState<"basico" | "fundamental" | "valuacion" | "pro" | "mapas">("basico");

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-700 bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 p-8 shadow-sm">
        <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-3">Finanzas y Mercados de Capital</h2>
        <p className="text-slate-600 dark:text-slate-400 text-sm max-w-2xl">
          Visualiza flujos de efectivo, valora activos y gestiona portafolios. Econosfera proporciona herramientas de grado profesional para entender la dinámica del capital.
        </p>
      </div>

      {/* Standard Tabbed Menu */}
      <div className="flex flex-wrap gap-2 p-1 bg-slate-200 dark:bg-slate-800/50 rounded-2xl w-fit">
        {[
          { id: 'basico', label: 'Básico (VP/VF/Bonos)', icon: Calculator },
          { id: 'fundamental', label: 'Análisis Fundamental', icon: Newspaper },
          { id: 'valuacion', label: 'Valuación y DCF', icon: BarChart2 },
          { id: 'pro', label: 'Portafolios y Derivados', icon: PieChart },
          { id: 'mapas', label: 'Estructura y Flujos', icon: Layers },
        ].map((tab) => {
          const locked = !canAccess(session?.user?.plan, "finanzas", tab.id);
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === tab.id
                ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                } ${locked ? 'opacity-80' : ''}`}
            >
              {locked && <Lock className="w-3 h-3" />}
              <tab.icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
        {!canAccess(session?.user?.plan, "finanzas", activeTab) && getRequiredPlan("finanzas", activeTab) && (
          <SimulatorLocked requiredPlan={getRequiredPlan("finanzas", activeTab)!} moduleName="Finanzas" />
        )}
        {canAccess(session?.user?.plan, "finanzas", activeTab) && activeTab === 'basico' && (
          <div className="grid gap-6">
            <SimuladorVPVF initialData={initialData?.subType === "VPVF" ? initialData : undefined} />
            <SimuladorAmortizacion />
            <SimuladorInteresSimpleCompuesto />
            <SimuladorRegla72 />
            <SimuladorTasaEfectiva />
            <div className="grid md:grid-cols-2 gap-6">
              <SimuladorBono initialData={initialData?.subType === "BONO" ? initialData : undefined} />
              <SimuladorCetes initialData={initialData?.subType === "CETES" ? initialData : undefined} />
            </div>
            <SimuladorAhorro initialData={initialData?.subType === "AHORRO" ? initialData : undefined} />
          </div>
        )}

        {canAccess(session?.user?.plan, "finanzas", activeTab) && activeTab === 'fundamental' && (
          <div className="grid gap-6">
            <SimuladorImpactoNoticias />
            <SimuladorCorrelacionFundamental />
          </div>
        )}

        {canAccess(session?.user?.plan, "finanzas", activeTab) && activeTab === 'valuacion' && (
          <div className="grid gap-6">
            <SimuladorValuacion initialData={initialData?.subType === "VALUACION" ? initialData : undefined} />
            <SimuladorDCF />
            <SimuladorVPNTIR />
            <SimuladorWACC />
          </div>
        )}

        {canAccess(session?.user?.plan, "finanzas", activeTab) && activeTab === 'pro' && (
          <div className="grid gap-6">
            <SimuladorMarkowitz />
            <SimuladorPortafolio2 />
            <SimuladorBlackScholes />
            <SimuladorYieldCurve />
            <SimuladorForward />
            <SimuladorBreakEven />
          </div>
        )}

        {canAccess(session?.user?.plan, "finanzas", activeTab) && activeTab === 'mapas' && (
          <div className="space-y-8">
            <FlujoSistemaFinanciero />
            <div className="grid lg:grid-cols-2 gap-6">
              <MapaInstrumentos />
              <MapaEstructuraCapital />
            </div>
          </div>
        )}
      </div>

      {/* Knowledge Section */}
      <section className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 p-8 shadow-lg">
        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-blue-600" />
          Fundamentos del Sistema Financiero
        </h3>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="space-y-3">
            <div className="h-10 w-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
              <Building2 className="w-5 h-5 text-blue-600" />
            </div>
            <h4 className="font-bold">Intermediación</h4>
            <p className="text-xs text-slate-500 leading-relaxed">Los bancos conectan a los ahorradores con los inversionistas, transformando plazos y riesgos según la regulación de la CNBV y Banxico.</p>
          </div>
          <div className="space-y-3">
            <div className="h-10 w-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center">
              <Wallet className="w-5 h-5 text-emerald-600" />
            </div>
            <h4 className="font-bold">Instrumentos</h4>
            <p className="text-xs text-slate-500 leading-relaxed">Contratos que representan derechos de flujo. Se dividen en Deuda (CETES, Bonos) y Capital (Acciones), con perfiles de riesgo distintos.</p>
          </div>
          <div className="space-y-3">
            <div className="h-10 w-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center">
              <Landmark className="w-5 h-5 text-indigo-600" />
            </div>
            <h4 className="font-bold">Mercado de Valores</h4>
            <p className="text-xs text-slate-500 leading-relaxed">Espacio institucional (BMV, BIVA) donde se negocian títulos bajo supervisión, permitiendo a las empresas financiarse y a las personas crecer su capital.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
