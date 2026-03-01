"use client";

import { useState } from "react";
import { FileDown } from "lucide-react";
import { useSession } from "next-auth/react";
import PricingModal from "./PricingModal";
import type { VariablesSimulacion, ResultadosSimulacion } from "@/lib/types";
import { getGraficoAsDataUrl } from "@/lib/exportarGrafico";
import { exportarEscenarioPdf } from "@/lib/exportarPdf";
import { registrarExportacion } from "@/lib/actions/exportActions";

interface ExportarCompartirProps {
  variables: VariablesSimulacion;
  resultados: ResultadosSimulacion;
  /** ID del elemento del gráfico a incluir en el PDF (ej. "grafico-inflacion") */
  idGrafico?: string;
  /** Datos del análisis de IA si están disponibles */
  datosAI?: any;
}

export default function ExportarCompartir({
  variables,
  resultados,
  idGrafico = "grafico-inflacion",
  datosAI,
}: ExportarCompartirProps) {
  const { data: session, update } = useSession();
  const [exportandoPdf, setExportandoPdf] = useState(false);
  const [showPricing, setShowPricing] = useState(false);

  const isLimitReached = (session?.user?.credits || 0) < 1;

  const descargarPdf = async () => {
    if (isLimitReached) {
      setShowPricing(true);
      return;
    }
    setExportandoPdf(true);
    try {
      let dataUrl: string | null = null;
      try {
        dataUrl = await getGraficoAsDataUrl(idGrafico);
      } catch {
        // El gráfico puede no estar montado o no existir
      }
      const pathname = typeof window !== "undefined" ? window.location.pathname || "/" : "/";
      await registrarExportacion(pathname, "PDF");
      await exportarEscenarioPdf(variables, resultados, dataUrl, datosAI);
      update();
    } catch (e) {
      console.error("Error al exportar PDF:", e);
      alert("No se pudo generar el PDF. Intenta de nuevo.");
    } finally {
      setExportandoPdf(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={descargarPdf}
        disabled={exportandoPdf}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 disabled:opacity-50 transition-colors"
      >
        <FileDown className="w-4 h-4" />
        {exportandoPdf ? "Generando..." : "Reporte PDF"}
      </button>

      <PricingModal isOpen={showPricing} onClose={() => setShowPricing(false)} />
    </div>
  );
}
