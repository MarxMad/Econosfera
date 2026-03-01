import type { Metadata } from "next";
import Glosario from "@/components/Glosario";

export const metadata: Metadata = {
  title: "Glosario de Términos Económicos",
  description:
    "Diccionario de referencia mundial: inflación, política monetaria, macroeconomía, microeconomía, finanzas y más. Consulta sin crear cuenta.",
  keywords: [
    "glosario económico",
    "diccionario economía",
    "términos financieros",
    "inflación",
    "política monetaria",
    "macroeconomía",
    "microeconomía",
    "finanzas",
    "Regla de Taylor",
    "curva de Phillips",
    "IS-LM",
    "DCF",
    "VPN",
    "TIR",
  ],
  openGraph: {
    title: "Glosario de Términos Económicos | Econosfera",
    description: "Consulta definiciones de conceptos económicos y financieros. Referencia académica sin necesidad de cuenta.",
    url: "/glosario",
  },
  alternates: { canonical: "/glosario" },
};

export default function GlosarioPage() {
  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950">
      <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8">
        <Glosario standalone />
      </div>
    </div>
  );
}
