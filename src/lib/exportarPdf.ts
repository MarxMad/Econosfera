/**
 * Genera un PDF con el resumen del escenario (variables, resultados y opcionalmente el gráfico).
 */

import { jsPDF } from "jspdf";
import type { VariablesSimulacion, ResultadosSimulacion } from "./types";

const MARGIN = 14;
const LINE_HEIGHT = 6;
const TITLE_SIZE = 14;
const BODY_SIZE = 10;

export async function exportarEscenarioPdf(
  variables: VariablesSimulacion,
  resultados: ResultadosSimulacion,
  graficoDataUrl?: string | null
): Promise<void> {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  let y = MARGIN;

  doc.setFontSize(TITLE_SIZE);
  doc.text("Econosfera — Resumen del escenario", MARGIN, y);
  y += LINE_HEIGHT + 2;

  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.text(`Generado el ${new Date().toLocaleDateString("es-MX", { dateStyle: "long" })}`, MARGIN, y);
  doc.setTextColor(0, 0, 0);
  y += LINE_HEIGHT + 4;

  doc.setFontSize(BODY_SIZE);
  doc.setFont("helvetica", "bold");
  doc.text("Variables", MARGIN, y);
  y += LINE_HEIGHT;
  doc.setFont("helvetica", "normal");

  const vars = [
    ["Inflación general (anual)", `${variables.inflacion}%`],
    ["Inflación subyacente", `${variables.inflacionSubyacente}%`],
    ["Tasa de política monetaria", `${variables.tasaPolitica}%`],
    ["Meta de inflación", `${variables.metaInflacion}%`],
    ["Tipo de política", variables.tipoPolitica],
    ["Brecha de producto", `${variables.brechaProducto} pp`],
    ["Crecimiento PIB esperado", `${variables.crecimientoPIB}%`],
  ];
  vars.forEach(([label, value]) => {
    doc.text(`${label}: ${value}`, MARGIN + 4, y);
    y += LINE_HEIGHT * 0.9;
  });
  y += 2;

  doc.setFont("helvetica", "bold");
  doc.text("Resultados", MARGIN, y);
  y += LINE_HEIGHT;
  doc.setFont("helvetica", "normal");

  const res = [
    ["Tasa real ex post", `${resultados.tasaRealExPost}%`],
    ["Tasa real ex ante", `${resultados.tasaRealExAnte}%`],
    ["Brecha de inflación", `${resultados.brechaInflacion > 0 ? "+" : ""}${resultados.brechaInflacion} pp`],
    ["Tasa Taylor (ref.)", `${resultados.tasaTaylor}%`],
    ["Desv. vs Taylor", `${resultados.desviacionTaylor > 0 ? "+" : ""}${resultados.desviacionTaylor} pp`],
  ];
  res.forEach(([label, value]) => {
    doc.text(`${label}: ${value}`, MARGIN + 4, y);
    y += LINE_HEIGHT * 0.9;
  });
  y += 2;

  doc.text(resultados.descripcionPolitica, MARGIN, y, { maxWidth: 180 });
  y += doc.getTextDimensions(resultados.descripcionPolitica, { maxWidth: 180 }).h + 4;

  if (graficoDataUrl && y < 240) {
    try {
      const imgW = 180;
      const imgH = 55;
      if (y + imgH < 280) {
        doc.addImage(graficoDataUrl, "PNG", MARGIN, y, imgW, imgH);
        y += imgH + 4;
      }
    } catch (e) {
      console.warn("No se pudo añadir la imagen al PDF:", e);
    }
  }

  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text("Herramienta didáctica. No sustituye el criterio profesional ni las proyecciones oficiales.", MARGIN, 285);
  doc.setTextColor(0, 0, 0);

  doc.save("econosfera-escenario.pdf");
}
