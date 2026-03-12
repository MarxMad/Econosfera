"use client";

import { useState, useEffect } from "react";
import {
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
import SimulatorDropdown from "./SimulatorDropdown";
import BannerCuestionarios from "./BannerCuestionarios";
import {
  SimuladorCalculadoraFinanciera,
  SimuladorBono,
  SimuladorCetes,
  SimuladorVPNTIR,
  SimuladorWACC,
  SimuladorBreakEven,
  FlujoSistemaFinanciero,
  MapaInstrumentos,
  MapaEstructuraCapital,
  SimuladorValuacion,
  SimuladorDCF,
  SimuladorMarkowitz,
  SimuladorBlackScholes,
  SimuladorYieldCurve,
  SimuladorImpactoNoticias,
  SimuladorCorrelacionFundamental,
  SimuladorDuracionBono
} from "./simuladores-finanzas";

const TABS_FINANZAS = [
  { id: "calculadoraFinanciera", label: "Calculadora financiera", icon: Calculator, group: "Básicos" },
  { id: "bono", label: "Bono", icon: Coins, group: "Renta fija" },
  { id: "cetes", label: "CETES", icon: Coins, group: "Renta fija" },
  { id: "duracionBono", label: "Duración bono", icon: Coins, group: "Renta fija" },
  { id: "valuacion", label: "Valuación", icon: Target, group: "Valuación" },
  { id: "dcf", label: "DCF", icon: BarChart2, group: "Valuación" },
  { id: "vpntir", label: "VPN/TIR", icon: BarChart2, group: "Valuación" },
  { id: "wacc", label: "WACC", icon: BarChart2, group: "Valuación" },
  { id: "markowitz", label: "Markowitz", icon: PieChart, group: "Portafolio" },
  { id: "blackScholes", label: "Black-Scholes", icon: Zap, group: "Derivados" },
  { id: "yieldCurve", label: "Yield Curve", icon: TrendingUp, group: "Derivados" },
  { id: "breakEven", label: "Break-even", icon: Target, group: "Empresa" },
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
    if (subType) {
      if (TABS_FINANZAS.some(t => t.id === subType)) {
        setActiveTab(subType);
      } else if (SUBTYPE_TO_TAB[subType]) {
        setActiveTab(SUBTYPE_TO_TAB[subType]);
      }
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

      <div className="sticky top-16 z-20 flex items-center gap-3 py-3 -mx-1 px-1 bg-slate-100 dark:bg-slate-950 rounded-xl border border-indigo-200/50 dark:border-indigo-800/50 bg-gradient-to-r from-indigo-50/50 to-transparent dark:from-indigo-950/20">
        <SimulatorDropdown
          tabs={TABS_FINANZAS}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          moduleId="finanzas"
          isLocked={(id) => !canAccess(session?.user?.plan, "finanzas", id)}
          placeholder="Elige un simulador"
        />
        <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hidden sm:inline">
          ← Haz clic para cambiar
        </span>
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
        {!canAccess(session?.user?.plan, "finanzas", activeTab) && getRequiredPlan("finanzas", activeTab) && (
          <SimulatorLocked requiredPlan={getRequiredPlan("finanzas", activeTab)!} moduleName="Finanzas" />
        )}
        {canAccess(session?.user?.plan, "finanzas", activeTab) && activeTab === "calculadoraFinanciera" && (
          <SimuladorCalculadoraFinanciera initialData={initialData} />
        )}
        {canAccess(session?.user?.plan, "finanzas", activeTab) && activeTab === "bono" && (
          <SimuladorBono initialData={initialData?.subType === "BONO" ? initialData : undefined} />
        )}
        {canAccess(session?.user?.plan, "finanzas", activeTab) && activeTab === "cetes" && (
          <SimuladorCetes initialData={initialData?.subType === "CETES" ? initialData : undefined} />
        )}
        {canAccess(session?.user?.plan, "finanzas", activeTab) && activeTab === "impactoNoticias" && <SimuladorImpactoNoticias />}
        {canAccess(session?.user?.plan, "finanzas", activeTab) && activeTab === "correlacionFundamental" && <SimuladorCorrelacionFundamental />}
        {canAccess(session?.user?.plan, "finanzas", activeTab) && activeTab === "valuacion" && (
          <SimuladorValuacion initialData={initialData?.subType === "VALUACION" ? initialData : undefined} />
        )}
        {canAccess(session?.user?.plan, "finanzas", activeTab) && activeTab === "dcf" && <SimuladorDCF />}
        {canAccess(session?.user?.plan, "finanzas", activeTab) && activeTab === "vpntir" && <SimuladorVPNTIR />}
        {canAccess(session?.user?.plan, "finanzas", activeTab) && activeTab === "wacc" && <SimuladorWACC />}
        {canAccess(session?.user?.plan, "finanzas", activeTab) && activeTab === "duracionBono" && <SimuladorDuracionBono />}
        {canAccess(session?.user?.plan, "finanzas", activeTab) && activeTab === "markowitz" && <SimuladorMarkowitz />}
        {canAccess(session?.user?.plan, "finanzas", activeTab) && activeTab === "blackScholes" && <SimuladorBlackScholes />}
        {canAccess(session?.user?.plan, "finanzas", activeTab) && activeTab === "yieldCurve" && <SimuladorYieldCurve />}
        {canAccess(session?.user?.plan, "finanzas", activeTab) && activeTab === "breakEven" && <SimuladorBreakEven />}
        {canAccess(session?.user?.plan, "finanzas", activeTab) && activeTab === "flujoFinanciero" && <FlujoSistemaFinanciero />}
        {canAccess(session?.user?.plan, "finanzas", activeTab) && activeTab === "mapaInstrumentos" && <MapaInstrumentos />}
        {canAccess(session?.user?.plan, "finanzas", activeTab) && activeTab === "mapaEstructuraCapital" && <MapaEstructuraCapital />}
      </div>

      <BannerCuestionarios />
    </div>
  );
}
