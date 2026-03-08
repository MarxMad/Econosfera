"use client";

import { useState, useEffect } from "react";
import {
  Wallet,
  Calculator,
  BarChart2,
  Layers,
  PieChart,
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
import SimulatorTabs from "./SimulatorTabs";
import BannerCuestionarios from "./BannerCuestionarios";
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
  { id: "vpvf", label: "VP/VF", icon: Calculator, group: "Básicos" },
  { id: "amortizacion", label: "Amortización", icon: FileText, group: "Básicos" },
  { id: "anualidad", label: "Anualidad", icon: Percent, group: "Básicos" },
  { id: "interesSimpleCompuesto", label: "Interés simple/compuesto", icon: Percent, group: "Básicos" },
  { id: "regla72", label: "Regla del 72", icon: Percent, group: "Básicos" },
  { id: "tasaEfectiva", label: "Tasa efectiva", icon: Percent, group: "Básicos" },
  { id: "bono", label: "Bono", icon: Coins, group: "Renta fija" },
  { id: "cetes", label: "CETES", icon: Coins, group: "Renta fija" },
  { id: "duracionBono", label: "Duración bono", icon: Coins, group: "Renta fija" },
  { id: "valuacion", label: "Valuación", icon: Target, group: "Valuación" },
  { id: "dcf", label: "DCF", icon: BarChart2, group: "Valuación" },
  { id: "vpntir", label: "VPN/TIR", icon: BarChart2, group: "Valuación" },
  { id: "wacc", label: "WACC", icon: BarChart2, group: "Valuación" },
  { id: "capm", label: "CAPM", icon: BarChart2, group: "Valuación" },
  { id: "markowitz", label: "Markowitz", icon: PieChart, group: "Portafolio" },
  { id: "portafolio2", label: "Portafolio", icon: PieChart, group: "Portafolio" },
  { id: "blackScholes", label: "Black-Scholes", icon: Zap, group: "Derivados" },
  { id: "yieldCurve", label: "Yield Curve", icon: TrendingUp, group: "Derivados" },
  { id: "forward", label: "Forward", icon: TrendingUp, group: "Derivados" },
  { id: "breakEven", label: "Break-even", icon: Target, group: "Empresa" },
  { id: "ahorro", label: "Ahorro", icon: Wallet, group: "Empresa" },
  { id: "impactoNoticias", label: "Impacto noticias", icon: Newspaper },
  { id: "correlacionFundamental", label: "Correlación", icon: TrendingUp },
  { id: "flujoFinanciero", label: "Flujo sistema", icon: Layers, group: "Mapas" },
  { id: "mapaInstrumentos", label: "Mapa instrumentos", icon: Layers, group: "Mapas" },
  { id: "mapaEstructuraCapital", label: "Mapa estructura", icon: Layers, group: "Mapas" },
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
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 p-4 sm:p-5 shadow-sm">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mb-1">Finanzas y Mercados de Capital</h2>
        <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm max-w-2xl">
          Visualiza flujos de efectivo, valora activos y gestiona portafolios.
        </p>
      </div>

      <div className="sticky top-16 z-20 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-950 shadow-md p-3 sm:p-4">
        <SimulatorTabs
          tabs={TABS_FINANZAS}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          moduleId="finanzas"
          isLocked={(id) => !canAccess(session?.user?.plan, "finanzas", id)}
          hint="Elige un simulador para ver los resultados"
          grouped
          compact
        />
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

      <BannerCuestionarios />
    </div>
  );
}
