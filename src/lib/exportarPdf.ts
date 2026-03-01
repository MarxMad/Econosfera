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

/** PDF del comparador de escenarios A vs B (inflación / tasa de interés). */
export async function exportarComparadorEscenariosPdf(
  variablesA: VariablesSimulacion,
  resultadosA: ResultadosSimulacion,
  variablesB: VariablesSimulacion,
  resultadosB: ResultadosSimulacion,
  graficoDataUrl?: string | null
): Promise<void> {
  const doc = new jsPDF() as any;
  const pageWidth = doc.internal.pageSize.getWidth();
  let currentY = 20;

  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, pageWidth, 40, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("ECONOSFERA", MARGIN, 20);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("COMPARADOR DE ESCENARIOS – INFLACIÓN Y TASA DE INTERÉS", MARGIN, 27);
  doc.setFontSize(14);
  doc.text("REPORTE COMPARATIVO", pageWidth - MARGIN, 25, { align: "right" });
  currentY = 50;

  doc.setTextColor(30, 41, 59);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(37, 99, 235);
  doc.text("Escenario A", MARGIN, currentY);
  currentY += 8;
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(30, 41, 59);
  autoTable(doc, {
    startY: currentY,
    head: [["Variable", "Valor"]],
    body: [
      ["Inflación General", `${variablesA.inflacion}%`],
      ["Inflación Subyacente", `${variablesA.inflacionSubyacente}%`],
      ["Tasa de Política", `${variablesA.tasaPolitica}%`],
      ["Meta Inflación", `${variablesA.metaInflacion}%`],
      ["Brecha Producto", `${variablesA.brechaProducto} pp`],
      ["Tasa real ex post", `${resultadosA.tasaRealExPost}%`],
      ["Tasa Taylor", `${resultadosA.tasaTaylor}%`],
    ],
    theme: "striped",
    headStyles: { fillColor: [37, 99, 235], textColor: 255 },
    margin: { left: MARGIN, right: MARGIN },
  });
  currentY = doc.lastAutoTable.finalY + 12;

  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(220, 38, 38);
  doc.text("Escenario B", MARGIN, currentY);
  currentY += 8;
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(30, 41, 59);
  autoTable(doc, {
    startY: currentY,
    head: [["Variable", "Valor"]],
    body: [
      ["Inflación General", `${variablesB.inflacion}%`],
      ["Inflación Subyacente", `${variablesB.inflacionSubyacente}%`],
      ["Tasa de Política", `${variablesB.tasaPolitica}%`],
      ["Meta Inflación", `${variablesB.metaInflacion}%`],
      ["Brecha Producto", `${variablesB.brechaProducto} pp`],
      ["Tasa real ex post", `${resultadosB.tasaRealExPost}%`],
      ["Tasa Taylor", `${resultadosB.tasaTaylor}%`],
    ],
    theme: "striped",
    headStyles: { fillColor: [220, 38, 38], textColor: 255 },
    margin: { left: MARGIN, right: MARGIN },
  });
  currentY = doc.lastAutoTable.finalY + 12;

  if (currentY > 200) {
    doc.addPage();
    currentY = MARGIN;
  }
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(30, 41, 59);
  doc.text("Comparación A vs B (%)", MARGIN, currentY);
  currentY += 6;
  autoTable(doc, {
    startY: currentY,
    head: [["Métrica", "Escenario A", "Escenario B"]],
    body: [
      ["Inflación", `${variablesA.inflacion}%`, `${variablesB.inflacion}%`],
      ["Inflación subyacente", `${variablesA.inflacionSubyacente}%`, `${variablesB.inflacionSubyacente}%`],
      ["Tasa política", `${variablesA.tasaPolitica}%`, `${variablesB.tasaPolitica}%`],
      ["Meta inflación", `${variablesA.metaInflacion}%`, `${variablesB.metaInflacion}%`],
      ["Tasa real ex post", `${resultadosA.tasaRealExPost}%`, `${resultadosB.tasaRealExPost}%`],
      ["Tasa Taylor", `${resultadosA.tasaTaylor}%`, `${resultadosB.tasaTaylor}%`],
      ["Brecha producto", `${variablesA.brechaProducto} pp`, `${variablesB.brechaProducto} pp`],
    ],
    theme: "grid",
    headStyles: { fillColor: [15, 23, 42], textColor: 255 },
    margin: { left: MARGIN, right: MARGIN },
  });
  currentY = doc.lastAutoTable.finalY + 12;

  // --- Gráfico comparación A vs B ---
  if (graficoDataUrl && currentY < 200) {
    try {
      doc.addImage(graficoDataUrl, "PNG", MARGIN, currentY, 180, 60);
      currentY += 70;
    } catch (e) {
      console.warn("No se pudo añadir la imagen al PDF comparador:", e);
    }
  }

  const totalPages = (doc as any).internal.pages.length - 1;
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(
      `Página ${i} de ${totalPages} | Econosfera Comparador | ${new Date().toLocaleDateString("es-MX")}`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: "center" }
    );
  }
  doc.save(`econosfera-comparador-escenarios-${new Date().toISOString().split("T")[0]}.pdf`);
}

/** PDF para el solucionador de Regla de Taylor (Inflación). */
export async function exportarTaylorPdf(vars: {
  mode: string;
  inflacionActual: number;
  metaInflacion: number;
  brechaProducto: number;
  tasaRealNeutral: number;
  alpha: number;
  beta: number;
  tasaObjetivo: number;
  resultado: number;
  resultadoLabel: string;
}): Promise<void> {
  const doc = new jsPDF() as any;
  const pageWidth = doc.internal.pageSize.getWidth();
  let currentY = 20;

  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, pageWidth, 40, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("ECONOSFERA", MARGIN, 20);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("MODELADO DE INFLACIÓN Y TASA DE INTERÉS – REGLA DE TAYLOR", MARGIN, 27);
  doc.setFontSize(14);
  doc.text("REPORTE TAYLOR", pageWidth - MARGIN, 25, { align: "right" });
  currentY = 50;

  doc.setTextColor(30, 41, 59);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Variables del modelo", MARGIN, currentY);
  currentY += 8;
  autoTable(doc, {
    startY: currentY,
    head: [["Parámetro", "Valor"]],
    body: [
      ["Modo de despeje", vars.mode === "tasa" ? "Tasa óptima (i)" : vars.mode === "meta" ? "Meta π*" : "Brecha y"],
      ["Inflación actual (π)", `${vars.inflacionActual}%`],
      ["Meta inflación (π*)", `${vars.metaInflacion}%`],
      ["Brecha producto (y)", `${vars.brechaProducto}%`],
      ["Tasa real neutral (r*)", `${vars.tasaRealNeutral}%`],
      ["Alpha (α)", String(vars.alpha)],
      ["Beta (β)", String(vars.beta)],
      ["Tasa objetivo (i)", `${vars.tasaObjetivo}%`],
    ],
    theme: "striped",
    headStyles: { fillColor: [37, 99, 235], textColor: 255 },
    margin: { left: MARGIN, right: MARGIN },
  });
  currentY = doc.lastAutoTable.finalY + 12;

  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text(vars.resultadoLabel, MARGIN, currentY);
  currentY += 8;
  doc.setFontSize(24);
  doc.setTextColor(37, 99, 235);
  doc.text(`${vars.resultado.toFixed(2)}%`, MARGIN, currentY);

  const totalPages = (doc as any).internal.pages.length - 1;
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(
      `Página ${i} de ${totalPages} | Econosfera Taylor | ${new Date().toLocaleDateString("es-MX")}`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: "center" }
    );
  }
  doc.save(`econosfera-taylor-${new Date().toISOString().split("T")[0]}.pdf`);
}

/** PDF Tasa real vs nominal (Fisher). */
export async function exportarTasaRealNominalPdf(
  tasaNominal: number,
  inflacionEsperada: number,
  tasaReal: number,
  graficoDataUrl?: string | null
): Promise<void> {
  const doc = new jsPDF() as any;
  const pageWidth = doc.internal.pageSize.getWidth();
  let currentY = 20;

  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, pageWidth, 40, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("ECONOSFERA", MARGIN, 20);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("TASA REAL VS NOMINAL – ECUACIÓN DE FISHER", MARGIN, 27);
  doc.setFontSize(14);
  doc.text("REPORTE", pageWidth - MARGIN, 25, { align: "right" });
  currentY = 50;

  doc.setTextColor(30, 41, 59);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Fórmula: Tasa real ≈ Tasa nominal − Inflación esperada", MARGIN, currentY);
  currentY += 12;
  autoTable(doc, {
    startY: currentY,
    head: [["Concepto", "Valor"]],
    body: [
      ["Tasa nominal (i)", `${tasaNominal}%`],
      ["Inflación esperada (πᵉ)", `${inflacionEsperada}%`],
      ["Tasa real aproximada (r)", `${tasaReal.toFixed(2)}%`],
    ],
    theme: "striped",
    headStyles: { fillColor: [37, 99, 235], textColor: 255 },
    margin: { left: MARGIN, right: MARGIN },
  });
  currentY = doc.lastAutoTable.finalY + 12;

  if (graficoDataUrl && currentY < 200) {
    try {
      doc.addImage(graficoDataUrl, "PNG", MARGIN, currentY, 180, 55);
    } catch (e) {
      console.warn("Gráfico Tasa real/nominal no añadido:", e);
    }
  }

  const totalPages = (doc as any).internal.pages.length - 1;
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(
      `Página ${i} de ${totalPages} | Econosfera Inflación | ${new Date().toLocaleDateString("es-MX")}`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: "center" }
    );
  }
  doc.save(`econosfera-tasa-real-nominal-${new Date().toISOString().split("T")[0]}.pdf`);
}

/** PDF Curva de Phillips (inflación–desempleo). */
export async function exportarPhillipsPdf(vars: {
  expectedInflation: number;
  naturalUnemployment: number;
  beta: number;
  supplyShock: number;
  inflacionEquilibrio: number;
}, graficoDataUrl?: string | null): Promise<void> {
  const doc = new jsPDF() as any;
  const pageWidth = doc.internal.pageSize.getWidth();
  let currentY = 20;

  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, pageWidth, 40, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("ECONOSFERA", MARGIN, 20);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("CURVA DE PHILLIPS – INFLACIÓN Y DESEMPLEO", MARGIN, 27);
  doc.setFontSize(14);
  doc.text("REPORTE", pageWidth - MARGIN, 25, { align: "right" });
  currentY = 50;

  doc.setTextColor(30, 41, 59);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Parámetros del modelo", MARGIN, currentY);
  currentY += 8;
  autoTable(doc, {
    startY: currentY,
    head: [["Parámetro", "Valor"]],
    body: [
      ["Inflación esperada (πᵉ)", `${vars.expectedInflation}%`],
      ["Desempleo natural (uₙ)", `${vars.naturalUnemployment}%`],
      ["Rigidez salarios (β)", String(vars.beta)],
      ["Choque de oferta (v)", `${vars.supplyShock}%`],
      ["Inflación de equilibrio", `${vars.inflacionEquilibrio.toFixed(1)}%`],
    ],
    theme: "striped",
    headStyles: { fillColor: [220, 38, 38], textColor: 255 },
    margin: { left: MARGIN, right: MARGIN },
  });
  currentY = doc.lastAutoTable.finalY + 12;

  if (graficoDataUrl && currentY < 200) {
    try {
      doc.addImage(graficoDataUrl, "PNG", MARGIN, currentY, 180, 65);
    } catch (e) {
      console.warn("Gráfico Phillips no añadido:", e);
    }
  }

  const totalPages = (doc as any).internal.pages.length - 1;
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(
      `Página ${i} de ${totalPages} | Econosfera Phillips | ${new Date().toLocaleDateString("es-MX")}`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: "center" }
    );
  }
  doc.save(`econosfera-phillips-${new Date().toISOString().split("T")[0]}.pdf`);
}
