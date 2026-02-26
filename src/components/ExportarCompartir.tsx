"use client";

import { useState } from "react";
import { FileDown, Link2, Check, Lock } from "lucide-react";
import { useSession } from "next-auth/react";
import PricingModal from "./PricingModal";
import type { VariablesSimulacion, ResultadosSimulacion } from "@/lib/types";
import { buildEscenarioUrl } from "@/lib/escenarioUrl";
import { getGraficoAsDataUrl } from "@/lib/exportarGrafico";
import { exportarEscenarioPdf } from "@/lib/exportarPdf";

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
  const [copiado, setCopiado] = useState(false);
  const [exportandoPdf, setExportandoPdf] = useState(false);
  const [showPricing, setShowPricing] = useState(false);

  const isLimitReached = (session?.user?.exportsCount || 0) >= 3;

  const pathname = typeof window !== "undefined" ? window.location.pathname || "/" : "/";
  const urlCompleta = typeof window !== "undefined" ? `${window.location.origin}${buildEscenarioUrl(pathname, variables)}` : "";

  const copiarEnlace = async () => {
    if (isLimitReached) {
      setShowPricing(true);
      return;
    }
    try {
      await navigator.clipboard.writeText(urlCompleta);
      setCopiado(true);
      fetch("/api/exports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "LINK", module: pathname })
      }).then(() => update()).catch(console.error);
      setTimeout(() => setCopiado(false), 2000);
    } catch (e) {
      console.error("Error al copiar:", e);
      alert("No se pudo copiar el enlace.");
    }
  };

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
      await exportarEscenarioPdf(variables, resultados, dataUrl, datosAI);
      fetch("/api/exports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "PDF", module: pathname })
      }).then(() => update()).catch(console.error);
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
        {exportandoPdf ? "Generando PDF…" : "Exportar PDF"}
      </button>
      <button
        type="button"
        onClick={copiarEnlace}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
      >
        {copiado ? (
          <>
            <Check className="w-4 h-4" />
            Enlace copiado
          </>
        ) : (
          <>
            <Link2 className="w-4 h-4" />
            Compartir enlace
          </>
        )}
      </button>

      <PricingModal isOpen={showPricing} onClose={() => setShowPricing(false)} />
    </div>
  );
}
