/**
 * Genera un PDF profesional con el resumen del escenario (variables, resultados y opcionalmente el gráfico).
 * Sigue el mismo estilo premium que el reporte de Minutas.
 */

import jsPDF from "jspdf";
import autoTable from 'jspdf-autotable';
import type { VariablesSimulacion, ResultadosSimulacion } from "./types";

const MARGIN = 15;

export async function exportarEscenarioPdf(
  variables: VariablesSimulacion,
  resultados: ResultadosSimulacion,
  graficoDataUrl?: string | null,
  datosAi?: any
): Promise<void> {
  const doc = new jsPDF() as any;
  const pageWidth = doc.internal.pageSize.getWidth();
  let currentY = 20;

  // --- Header Premium ---
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, pageWidth, 40, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('ECONOSFERA', MARGIN, 20);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('SIMULADOR DE POLÍTICA MONETARIA Y MACROECONOMÍA', MARGIN, 27);

  doc.setFontSize(14);
  doc.text('ESCENARIO REPORT', pageWidth - MARGIN, 25, { align: 'right' });

  currentY = 50;

  // --- Título del Escenario ---
  doc.setTextColor(30, 41, 59); // slate-800
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(`Análisis del Escenario: ${new Date().toLocaleDateString("es-MX", { dateStyle: "long" })}`, MARGIN, currentY);
  currentY += 12;

  // --- Variables del Escenario (Tabla) ---
  doc.setFontSize(12);
  doc.text("Configuración de Variables", MARGIN, currentY);
  currentY += 5;

  autoTable(doc, {
    startY: currentY,
    head: [['Variable', 'Valor']],
    body: [
      ['Inflación General (anual)', `${variables.inflacion}%`],
      ['Inflación Subyacente', `${variables.inflacionSubyacente}%`],
      ['Tasa de Política Monetaria', `${variables.tasaPolitica}%`],
      ['Meta de Inflación', `${variables.metaInflacion}%`],
      ['Tipo de Política', variables.tipoPolitica],
      ['Brecha de Producto', `${variables.brechaProducto} pp`],
      ['Crecimiento PIB esperado', `${variables.crecimientoPIB}%`],
    ],
    theme: 'striped',
    headStyles: { fillColor: [37, 99, 235], textColor: 255 }, // blue-600
    margin: { left: MARGIN, right: MARGIN },
  });

  // @ts-ignore
  currentY = doc.lastAutoTable.finalY + 15;

  // --- Resultados Calculados (Tabla) ---
  doc.setFontSize(12);
  doc.text("Resultados del Modelo Taylor y Tasa Real", MARGIN, currentY);
  currentY += 5;

  autoTable(doc, {
    startY: currentY,
    head: [['Métrica de Resultado', 'Valor']],
    body: [
      ['Tasa Real Ex Post', `${resultados.tasaRealExPost}%`],
      ['Tasa Real Ex Ante', `${resultados.tasaRealExAnte}%`],
      ['Brecha de Inflación', `${resultados.brechaInflacion > 0 ? "+" : ""}${resultados.brechaInflacion} pp`],
      ['Tasa Taylor Sugerida', `${resultados.tasaTaylor}%`],
      ['Desviación vs Taylor', `${resultados.desviacionTaylor > 0 ? "+" : ""}${resultados.desviacionTaylor} pp`],
    ],
    theme: 'grid',
    headStyles: { fillColor: [15, 23, 42] }, // slate-900
    margin: { left: MARGIN, right: MARGIN },
  });

  // @ts-ignore
  currentY = doc.lastAutoTable.finalY + 15;

  // --- Descripción de la Política ---
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Análisis de Postura Monetaria', MARGIN, currentY);
  currentY += 7;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const descLines = doc.splitTextToSize(resultados.descripcionPolitica, pageWidth - (MARGIN * 2));
  doc.text(descLines, MARGIN, currentY);
  currentY += (descLines.length * 5) + 15;

  // --- Gráfico Flow ---
  if (graficoDataUrl && currentY < 230) {
    try {
      doc.addImage(graficoDataUrl, "PNG", MARGIN, currentY, 180, 55);
      currentY += 65;
    } catch (e) {
      console.warn("No se pudo añadir la imagen al PDF:", e);
    }
  }

  // --- Sección de Inteligencia Banxico (AI Analyst) si existe ---
  if (datosAi) {
    if (currentY > 150) {
      doc.addPage();
      currentY = MARGIN;
    } else {
      currentY += 10;
    }

    doc.setFillColor(241, 245, 249); // slate-100
    doc.rect(0, currentY - 5, pageWidth, 25, 'F');

    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(37, 99, 235); // Blue-600
    doc.text("Inteligencia Banxico (AI Analyst)", MARGIN, currentY + 10);
    currentY += 25;

    doc.setFontSize(12);
    doc.setTextColor(30, 41, 59); // slate-800
    doc.text("Veredicto Estratégico:", MARGIN, currentY);
    currentY += 7;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    const veredictoLines = doc.splitTextToSize(datosAi.veredicto || "", pageWidth - (MARGIN * 2));
    doc.text(veredictoLines, MARGIN, currentY);
    currentY += (veredictoLines.length * 5) + 10;

    if (currentY > 240) { doc.addPage(); currentY = 20; }

    doc.setFont("helvetica", "bold");
    doc.text("Análisis Pormenorizado del Debate:", MARGIN, currentY);
    currentY += 7;

    doc.setFont("helvetica", "normal");
    const detalleLines = doc.splitTextToSize(datosAi.detalle?.pormenorizado || "", pageWidth - (MARGIN * 2));
    doc.text(detalleLines, MARGIN, currentY);
    currentY += (detalleLines.length * 5) + 12;

    if (datosAi.detalle?.disidente) {
      if (currentY > 220) { doc.addPage(); currentY = 20; }

      doc.setFillColor(254, 242, 242); // red-50
      doc.roundedRect(MARGIN, currentY - 5, pageWidth - (MARGIN * 2), 35, 3, 3, 'F');

      doc.setFont("helvetica", "bold");
      doc.setTextColor(185, 28, 28); // Red-700
      doc.text("DISSENT & NUANCES (VOCES DISIDENTES):", MARGIN + 5, currentY + 5);

      doc.setFont("helvetica", "normal");
      doc.setTextColor(127, 29, 29); // red-900
      const disidenteLines = doc.splitTextToSize(datosAi.detalle.disidente, pageWidth - (MARGIN * 2) - 10);
      doc.text(disidenteLines, MARGIN + 5, currentY + 12);
      currentY += 45;
    }
  }

  // --- Footer ---
  const totalPages = (doc as any).internal.pages.length - 1;
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184); // slate-400
    doc.text(
      `Página ${i} de ${totalPages} | Econosfera Professional Intelligence | ${new Date().toLocaleDateString('es-MX')}`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );
  }

  doc.save(datosAi ? "econosfera-analisis-profesional.pdf" : "econosfera-reporte-escenario.pdf");
}
