"use client";

import { useState, useEffect } from "react";
import {
  Building2,
  Wallet,
  Landmark,
  Calculator,
  BarChart2,
  Layers,
  PieChart,
  BookOpen,
  Info,
  Lock,
  Newspaper,
  Percent,
  Coins,
  TrendingUp,
  FileText,
  Target,
  Zap
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
  SimuladorCorrelacionFundamental,
  SimuladorAnualidad,
  SimuladorCAPM,
  SimuladorDuracionBono
} from "./simuladores-finanzas";

const TABS_FINANZAS = [
  { id: "vpvf", label: "VP/VF", icon: Calculator, plan: "FREE" as const },
  { id: "amortizacion", label: "Amortización", icon: FileText, plan: "FREE" as const },
  { id: "anualidad", label: "Anualidad", icon: Percent, plan: "FREE" as const },
  { id: "interesSimpleCompuesto", label: "Interés simple/compuesto", icon: Percent, plan: "FREE" as const },
  { id: "regla72", label: "Regla del 72", icon: Percent, plan: "FREE" as const },
  { id: "tasaEfectiva", label: "Tasa efectiva", icon: Percent, plan: "FREE" as const },
  { id: "bono", label: "Bono", icon: Coins, plan: "FREE" as const },
  { id: "cetes", label: "CETES", icon: Coins, plan: "FREE" as const },
  { id: "ahorro", label: "Ahorro", icon: Wallet, plan: "FREE" as const },
  { id: "impactoNoticias", label: "Impacto noticias", icon: Newspaper, plan: "FREE" as const },
  { id: "correlacionFundamental", label: "Correlación", icon: TrendingUp, plan: "FREE" as const },
  { id: "capm", label: "CAPM", icon: BarChart2, plan: "FREE" as const },
  { id: "valuacion", label: "Valuación", icon: Target, plan: "PRO" as const },
  { id: "dcf", label: "DCF", icon: BarChart2, plan: "PRO" as const },
  { id: "vpntir", label: "VPN/TIR", icon: BarChart2, plan: "PRO" as const },
  { id: "wacc", label: "WACC", icon: BarChart2, plan: "PRO" as const },
  { id: "duracionBono", label: "Duración bono", icon: Coins, plan: "PRO" as const },
  { id: "markowitz", label: "Markowitz", icon: PieChart, plan: "PRO" as const },
  { id: "portafolio2", label: "Portafolio", icon: PieChart, plan: "PRO" as const },
  { id: "blackScholes", label: "Black-Scholes", icon: Zap, plan: "PRO" as const },
  { id: "yieldCurve", label: "Yield Curve", icon: TrendingUp, plan: "PRO" as const },
  { id: "forward", label: "Forward", icon: TrendingUp, plan: "PRO" as const },
  { id: "breakEven", label: "Break-even", icon: Target, plan: "PRO" as const },
  { id: "flujoFinanciero", label: "Flujo sistema", icon: Layers, plan: "FREE" as const },
  { id: "mapaInstrumentos", label: "Mapa instrumentos", icon: Layers, plan: "FREE" as const },
  { id: "mapaEstructuraCapital", label: "Mapa estructura", icon: Layers, plan: "FREE" as const },
];

const SUBTYPE_TO_TAB: Record<string, string> = {
  VPVF: "vpvf", BONO: "bono", CETES: "cetes", AHORRO: "ahorro", VALUACION: "valuacion",
};

export default function Finanzas({ onIrAModulo, initialData }: { onIrAModulo?: (m: ModuloSimulador) => void; initialData?: any }) {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState<string>(TABS_FINANZAS[0].id);

  useEffect(() => {
    const subType = initialData?.subType;
    if (subType && SUBTYPE_TO_TAB[subType]) {
      setActiveTab(SUBTYPE_TO_TAB[subType]);
    }
  }, [initialData?.subType]);

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 dark:border-slate-700 bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 p-8 shadow-sm">
        <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-3">Finanzas y Mercados de Capital</h2>
        <p className="text-slate-600 dark:text-slate-400 text-sm max-w-2xl">
          Visualiza flujos de efectivo, valora activos y gestiona portafolios. Econosfera proporciona herramientas de grado profesional para entender la dinámica del capital.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 p-1 bg-slate-200 dark:bg-slate-800/50 rounded-2xl w-fit max-w-full overflow-x-auto">
        {TABS_FINANZAS.map((tab) => {
          const locked = !canAccess(session?.user?.plan, "finanzas", tab.id);
          const TabIcon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${activeTab === tab.id
                ? "bg-white dark:bg-slate-700 text-blue-600 shadow-sm"
                : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                } ${locked ? "opacity-80" : ""}`}
            >
              {locked && <Lock className="w-3 h-3" />}
              <TabIcon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
        {!canAccess(session?.user?.plan, "finanzas", activeTab) && getRequiredPlan("finanzas", activeTab) && (
          <SimulatorLocked requiredPlan={getRequiredPlan("finanzas", activeTab)!} moduleName="Finanzas" />
        )}
        {canAccess(session?.user?.plan, "finanzas", activeTab) && activeTab === "vpvf" && (
          <SimuladorVPVF initialData={initialData?.subType === "VPVF" ? initialData : undefined} />
        )}
        {canAccess(session?.user?.plan, "finanzas", activeTab) && activeTab === "amortizacion" && <SimuladorAmortizacion />}
        {canAccess(session?.user?.plan, "finanzas", activeTab) && activeTab === "anualidad" && <SimuladorAnualidad />}
        {canAccess(session?.user?.plan, "finanzas", activeTab) && activeTab === "interesSimpleCompuesto" && <SimuladorInteresSimpleCompuesto />}
        {canAccess(session?.user?.plan, "finanzas", activeTab) && activeTab === "regla72" && <SimuladorRegla72 />}
        {canAccess(session?.user?.plan, "finanzas", activeTab) && activeTab === "tasaEfectiva" && <SimuladorTasaEfectiva />}
        {canAccess(session?.user?.plan, "finanzas", activeTab) && activeTab === "bono" && (
          <SimuladorBono initialData={initialData?.subType === "BONO" ? initialData : undefined} />
        )}
        {canAccess(session?.user?.plan, "finanzas", activeTab) && activeTab === "cetes" && (
          <SimuladorCetes initialData={initialData?.subType === "CETES" ? initialData : undefined} />
        )}
        {canAccess(session?.user?.plan, "finanzas", activeTab) && activeTab === "ahorro" && (
          <SimuladorAhorro initialData={initialData?.subType === "AHORRO" ? initialData : undefined} />
        )}
        {canAccess(session?.user?.plan, "finanzas", activeTab) && activeTab === "impactoNoticias" && <SimuladorImpactoNoticias />}
        {canAccess(session?.user?.plan, "finanzas", activeTab) && activeTab === "correlacionFundamental" && <SimuladorCorrelacionFundamental />}
        {canAccess(session?.user?.plan, "finanzas", activeTab) && activeTab === "capm" && <SimuladorCAPM />}
        {canAccess(session?.user?.plan, "finanzas", activeTab) && activeTab === "valuacion" && (
          <SimuladorValuacion initialData={initialData?.subType === "VALUACION" ? initialData : undefined} />
        )}
        {canAccess(session?.user?.plan, "finanzas", activeTab) && activeTab === "dcf" && <SimuladorDCF />}
        {canAccess(session?.user?.plan, "finanzas", activeTab) && activeTab === "vpntir" && <SimuladorVPNTIR />}
        {canAccess(session?.user?.plan, "finanzas", activeTab) && activeTab === "wacc" && <SimuladorWACC />}
        {canAccess(session?.user?.plan, "finanzas", activeTab) && activeTab === "duracionBono" && <SimuladorDuracionBono />}
        {canAccess(session?.user?.plan, "finanzas", activeTab) && activeTab === "markowitz" && <SimuladorMarkowitz />}
        {canAccess(session?.user?.plan, "finanzas", activeTab) && activeTab === "portafolio2" && <SimuladorPortafolio2 />}
        {canAccess(session?.user?.plan, "finanzas", activeTab) && activeTab === "blackScholes" && <SimuladorBlackScholes />}
        {canAccess(session?.user?.plan, "finanzas", activeTab) && activeTab === "yieldCurve" && <SimuladorYieldCurve />}
        {canAccess(session?.user?.plan, "finanzas", activeTab) && activeTab === "forward" && <SimuladorForward />}
        {canAccess(session?.user?.plan, "finanzas", activeTab) && activeTab === "breakEven" && <SimuladorBreakEven />}
        {canAccess(session?.user?.plan, "finanzas", activeTab) && activeTab === "flujoFinanciero" && <FlujoSistemaFinanciero />}
        {canAccess(session?.user?.plan, "finanzas", activeTab) && activeTab === "mapaInstrumentos" && <MapaInstrumentos />}
        {canAccess(session?.user?.plan, "finanzas", activeTab) && activeTab === "mapaEstructuraCapital" && <MapaEstructuraCapital />}
      </div>

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
