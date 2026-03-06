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
    styles: { overflow: 'linebreak' },
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
    styles: { overflow: 'linebreak' },
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
    styles: { overflow: "linebreak" },
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
    styles: { overflow: "linebreak" },
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
    styles: { overflow: "linebreak" },
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
    styles: { overflow: "linebreak" },
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
    styles: { overflow: "linebreak" },
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

/** PDF Poder adquisitivo (Fisher: nominal vs real). */
export async function exportarPoderAdquisitivoPdf(
  principal: number,
  tasaNominal: number,
  inflacion: number,
  years: number,
  finalNominal: number,
  finalReal: number,
  erosionPct: number,
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
  doc.text("PODER ADQUISITIVO – ECUACIÓN DE FISHER", MARGIN, 27);
  doc.setFontSize(14);
  doc.text("REPORTE", pageWidth - MARGIN, 25, { align: "right" });
  currentY = 50;

  doc.setTextColor(30, 41, 59);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Parámetros y resultados", MARGIN, currentY);
  currentY += 8;
  autoTable(doc, {
    startY: currentY,
    head: [["Concepto", "Valor"]],
    body: [
      ["Capital inicial", `$${principal.toLocaleString("es-MX")}`],
      ["Tasa nominal (i)", `${tasaNominal}%`],
      ["Inflación (π)", `${inflacion}%`],
      ["Horizonte (años)", String(years)],
      ["Valor nominal final", `$${finalNominal.toLocaleString("es-MX")}`],
      ["Valor real final", `$${finalReal.toLocaleString("es-MX")}`],
      ["Erosión acumulada", `${erosionPct.toFixed(1)}%`],
    ],
    theme: "striped",
    headStyles: { fillColor: [245, 158, 11], textColor: 255 },
    margin: { left: MARGIN, right: MARGIN },
    styles: { overflow: "linebreak" },
  });
  currentY = doc.lastAutoTable.finalY + 12;

  if (graficoDataUrl && currentY < 200) {
    try {
      doc.addImage(graficoDataUrl, "PNG", MARGIN, currentY, 180, 55);
    } catch (e) {
      console.warn("Gráfico Poder adquisitivo no añadido:", e);
    }
  }

  const totalPages = doc.internal.pages.length - 1;
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
  doc.save(`econosfera-poder-adquisitivo-${new Date().toISOString().split("T")[0]}.pdf`);
}

/** PDF Brecha de inflación. */
export async function exportarBrechaInflacionPdf(
  inflacionObservada: number,
  metaInflacion: number,
  brecha: number
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
  doc.text("BRECHA DE INFLACIÓN", MARGIN, 27);
  doc.setFontSize(14);
  doc.text("REPORTE", pageWidth - MARGIN, 25, { align: "right" });
  currentY = 50;

  doc.setTextColor(30, 41, 59);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Parámetros y resultado", MARGIN, currentY);
  currentY += 8;
  autoTable(doc, {
    startY: currentY,
    head: [["Concepto", "Valor"]],
    body: [
      ["Inflación observada", `${inflacionObservada}%`],
      ["Meta de inflación", `${metaInflacion}%`],
      ["Brecha (pp)", `${brecha > 0 ? "+" : ""}${brecha.toFixed(2)} pp`],
    ],
    theme: "striped",
    headStyles: { fillColor: [245, 158, 11], textColor: 255 },
    margin: { left: MARGIN, right: MARGIN },
    styles: { overflow: "linebreak" },
  });

  const totalPages = doc.internal.pages.length - 1;
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
  doc.save(`econosfera-brecha-inflacion-${new Date().toISOString().split("T")[0]}.pdf`);
}

/** PDF Tasa real ex post. */
export async function exportarTasaRealExPostPdf(
  tasaNominal: number,
  inflacionObservada: number,
  tasaRealExPost: number
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
  doc.text("TASA REAL EX POST", MARGIN, 27);
  doc.setFontSize(14);
  doc.text("REPORTE", pageWidth - MARGIN, 25, { align: "right" });
  currentY = 50;

  doc.setTextColor(30, 41, 59);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Fórmula: r_ex_post = i − π_observada", MARGIN, currentY);
  currentY += 12;
  autoTable(doc, {
    startY: currentY,
    head: [["Concepto", "Valor"]],
    body: [
      ["Tasa nominal (i)", `${tasaNominal}%`],
      ["Inflación observada (π)", `${inflacionObservada}%`],
      ["Tasa real ex post", `${tasaRealExPost.toFixed(2)}%`],
    ],
    theme: "striped",
    headStyles: { fillColor: [99, 102, 241], textColor: 255 },
    margin: { left: MARGIN, right: MARGIN },
    styles: { overflow: "linebreak" },
  });

  const totalPages = doc.internal.pages.length - 1;
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
  doc.save(`econosfera-tasa-real-ex-post-${new Date().toISOString().split("T")[0]}.pdf`);
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
    styles: { overflow: "linebreak" },
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

/** PDF Ley de Okun. */
export async function exportarOkunPdf(
  crecimientoPIB: number,
  crecimientoPotencial: number,
  beta: number,
  cambioDesempleo: number
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
  doc.text("LEY DE OKUN", MARGIN, 27);
  doc.setFontSize(14);
  doc.text("REPORTE", pageWidth - MARGIN, 25, { align: "right" });
  currentY = 50;

  doc.setTextColor(30, 41, 59);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Parámetros y resultado", MARGIN, currentY);
  currentY += 8;
  autoTable(doc, {
    startY: currentY,
    head: [["Concepto", "Valor"]],
    body: [
      ["Crecimiento PIB (%)", `${crecimientoPIB}%`],
      ["Crecimiento potencial (%)", `${crecimientoPotencial}%`],
      ["Beta (β)", String(beta)],
      ["Cambio en desempleo (pp)", `${cambioDesempleo > 0 ? "+" : ""}${cambioDesempleo.toFixed(2)} pp`],
    ],
    theme: "striped",
    headStyles: { fillColor: [37, 99, 235], textColor: 255 },
    margin: { left: MARGIN, right: MARGIN },
    styles: { overflow: "linebreak" },
  });

  const totalPages = doc.internal.pages.length - 1;
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(
      `Página ${i} de ${totalPages} | Econosfera Macro | ${new Date().toLocaleDateString("es-MX")}`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: "center" }
    );
  }
  doc.save(`econosfera-ley-okun-${new Date().toISOString().split("T")[0]}.pdf`);
}

/** PDF Paridad de poder adquisitivo (PPP). */
export async function exportarPPPPdf(
  precioDomestico: number,
  precioExtranjero: number,
  tipoCambioImplicito: number
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
  doc.text("PARIDAD DE PODER ADQUISITIVO (PPP)", MARGIN, 27);
  doc.setFontSize(14);
  doc.text("REPORTE", pageWidth - MARGIN, 25, { align: "right" });
  currentY = 50;

  doc.setTextColor(30, 41, 59);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Parámetros y resultado", MARGIN, currentY);
  currentY += 8;
  autoTable(doc, {
    startY: currentY,
    head: [["Concepto", "Valor"]],
    body: [
      ["Precio doméstico (P_dom)", String(precioDomestico)],
      ["Precio extranjero (P_ext)", String(precioExtranjero)],
      ["Tipo de cambio implícito (S)", tipoCambioImplicito.toFixed(4)],
    ],
    theme: "striped",
    headStyles: { fillColor: [99, 102, 241], textColor: 255 },
    margin: { left: MARGIN, right: MARGIN },
    styles: { overflow: "linebreak" },
  });

  const totalPages = doc.internal.pages.length - 1;
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(
      `Página ${i} de ${totalPages} | Econosfera Macro | ${new Date().toLocaleDateString("es-MX")}`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: "center" }
    );
  }
  doc.save(`econosfera-ppp-${new Date().toISOString().split("T")[0]}.pdf`);
}

/** PDF Harrod-Domar. */
export async function exportarHarrodDomarPdf(
  tasaAhorro: number,
  relacionCapitalProducto: number,
  tasaCrecimiento: number
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
  doc.text("MODELO HARROD-DOMAR", MARGIN, 27);
  doc.setFontSize(14);
  doc.text("REPORTE", pageWidth - MARGIN, 25, { align: "right" });
  currentY = 50;

  doc.setTextColor(30, 41, 59);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Parámetros y resultado", MARGIN, currentY);
  currentY += 8;
  autoTable(doc, {
    startY: currentY,
    head: [["Concepto", "Valor"]],
    body: [
      ["Tasa de ahorro (%)", `${tasaAhorro}%`],
      ["Relación capital-producto (v)", String(relacionCapitalProducto)],
      ["Tasa de crecimiento (%)", `${tasaCrecimiento.toFixed(2)}%`],
    ],
    theme: "striped",
    headStyles: { fillColor: [16, 185, 129], textColor: 255 },
    margin: { left: MARGIN, right: MARGIN },
    styles: { overflow: "linebreak" },
  });

  const totalPages = doc.internal.pages.length - 1;
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(
      `Página ${i} de ${totalPages} | Econosfera Macro | ${new Date().toLocaleDateString("es-MX")}`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: "center" }
    );
  }
  doc.save(`econosfera-harrod-domar-${new Date().toISOString().split("T")[0]}.pdf`);
}

/** PDF Multiplicador de transferencias. */
export async function exportarMultTransferenciasPdf(pmc: number, multiplicador: number): Promise<void> {
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
  doc.text("MULTIPLICADOR DE TRANSFERENCIAS", MARGIN, 27);
  doc.setFontSize(14);
  doc.text("REPORTE", pageWidth - MARGIN, 25, { align: "right" });
  currentY = 50;

  doc.setTextColor(30, 41, 59);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Parámetros y resultado", MARGIN, currentY);
  currentY += 8;
  autoTable(doc, {
    startY: currentY,
    head: [["Concepto", "Valor"]],
    body: [
      ["PMC (Propensión marginal a consumir)", String(pmc)],
      ["Multiplicador (k_T)", multiplicador.toFixed(2)],
    ],
    theme: "striped",
    headStyles: { fillColor: [245, 158, 11], textColor: 255 },
    margin: { left: MARGIN, right: MARGIN },
    styles: { overflow: "linebreak" },
  });

  const totalPages = doc.internal.pages.length - 1;
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(
      `Página ${i} de ${totalPages} | Econosfera Macro | ${new Date().toLocaleDateString("es-MX")}`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: "center" }
    );
  }
  doc.save(`econosfera-mult-transferencias-${new Date().toISOString().split("T")[0]}.pdf`);
}

/** PDF Paridad UIP (Monetaria). */
export async function exportarUIPPdf(
  tasaExtranjera: number,
  depreciacionEsperada: number,
  tasaDomestica: number
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
  doc.text("PARIDAD DE TASAS DESCUBIERTA (UIP)", MARGIN, 27);
  doc.setFontSize(14);
  doc.text("REPORTE", pageWidth - MARGIN, 25, { align: "right" });
  currentY = 50;

  doc.setTextColor(30, 41, 59);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Parámetros y resultado", MARGIN, currentY);
  currentY += 8;
  autoTable(doc, {
    startY: currentY,
    head: [["Concepto", "Valor"]],
    body: [
      ["Tasa extranjera (%)", `${tasaExtranjera}%`],
      ["Depreciación esperada (%)", `${depreciacionEsperada}%`],
      ["Tasa doméstica implícita (%)", `${tasaDomestica.toFixed(2)}%`],
    ],
    theme: "striped",
    headStyles: { fillColor: [139, 92, 246], textColor: 255 },
    margin: { left: MARGIN, right: MARGIN },
    styles: { overflow: "linebreak" },
  });

  const totalPages = doc.internal.pages.length - 1;
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(
      `Página ${i} de ${totalPages} | Econosfera Monetaria | ${new Date().toLocaleDateString("es-MX")}`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: "center" }
    );
  }
  doc.save(`econosfera-paridad-uip-${new Date().toISOString().split("T")[0]}.pdf`);
}

/** PDF Regresión múltiple (estilo EViews). */
export async function exportarRegresionMultiplePdf(params: {
  n: number;
  b0: number;
  b1: number;
  b2: number;
  noise: number;
  res: import("./econometria").ResultadoMCO;
}): Promise<void> {
  const { res } = params;
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
  doc.text("REGRESIÓN MÚLTIPLE (MCO) — ESTILO EVIEWS", MARGIN, 27);
  doc.setFontSize(14);
  doc.text("REPORTE", pageWidth - MARGIN, 25, { align: "right" });
  currentY = 50;

  doc.setTextColor(30, 41, 59);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("Tabla de coeficientes", MARGIN, currentY);
  currentY += 6;
  const body = res.nombres.map((nom, i) => [
    nom,
    res.coeficientes[i].toFixed(4),
    res.erroresEstandar[i].toFixed(4),
    res.tStats[i].toFixed(3),
    res.pValores[i].toFixed(4),
  ]);
  autoTable(doc, {
    startY: currentY,
    head: [["Variable", "Coefficient", "Std. Error", "t-Statistic", "Prob."]],
    body,
    theme: "grid",
    headStyles: { fillColor: [67, 56, 202] },
    margin: { left: MARGIN, right: MARGIN },
    styles: { fontSize: 9 },
  });
  currentY = doc.lastAutoTable.finalY + 10;

  doc.setFontSize(10);
  doc.text(`R² = ${res.r2.toFixed(4)}  |  R² ajustado = ${res.r2Ajustado.toFixed(4)}  |  Durbin-Watson = ${res.durbinWatson.toFixed(4)}`, MARGIN, currentY);
  currentY += 8;
  doc.text(`F-statistic = ${res.fStat.toFixed(2)}  |  Prob(F) = ${res.fPValor.toFixed(4)}`, MARGIN, currentY);

  const totalPages = doc.internal.pages.length - 1;
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(
      `Página ${i} de ${totalPages} | Econosfera Estadística | ${new Date().toLocaleDateString("es-MX")}`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: "center" }
    );
  }
  doc.save(`econosfera-regresion-multiple-${new Date().toISOString().split("T")[0]}.pdf`);
}

/** PDF Matriz de correlación. */
export async function exportarMatrizCorrelacionPdf(nombres: string[], corr: number[][]): Promise<void> {
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
  doc.text("MATRIZ DE CORRELACIÓN", MARGIN, 27);
  doc.setFontSize(14);
  doc.text("REPORTE", pageWidth - MARGIN, 25, { align: "right" });
  currentY = 50;

  doc.setTextColor(30, 41, 59);
  const body = corr.map((row, i) => [nombres[i], ...row.map((v) => v.toFixed(3))]);
  autoTable(doc, {
    startY: currentY,
    head: [["", ...nombres]],
    body,
    theme: "grid",
    headStyles: { fillColor: [6, 182, 212] },
    margin: { left: MARGIN, right: MARGIN },
    styles: { fontSize: 9 },
  });

  const totalPages = doc.internal.pages.length - 1;
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(
      `Página ${i} de ${totalPages} | Econosfera Estadística | ${new Date().toLocaleDateString("es-MX")}`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: "center" }
    );
  }
  doc.save(`econosfera-matriz-correlacion-${new Date().toISOString().split("T")[0]}.pdf`);
}

/** PDF Estadísticas descriptivas. */
export async function exportarEstadisticasDescriptivasPdf(
  stats: Array<{ variable: string; media: number; mediana: number; desvEstandar: number; min: number; max: number; n: number }>
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
  doc.text("ESTADÍSTICAS DESCRIPTIVAS", MARGIN, 27);
  doc.setFontSize(14);
  doc.text("REPORTE", pageWidth - MARGIN, 25, { align: "right" });
  currentY = 50;

  doc.setTextColor(30, 41, 59);
  const body = stats.map((s) => [
    s.variable,
    s.media.toFixed(2),
    s.mediana.toFixed(2),
    s.desvEstandar.toFixed(2),
    s.min.toFixed(2),
    s.max.toFixed(2),
    String(s.n),
  ]);
  autoTable(doc, {
    startY: currentY,
    head: [["Variable", "Mean", "Median", "Std. Dev.", "Min", "Max", "N"]],
    body,
    theme: "grid",
    headStyles: { fillColor: [16, 185, 129] },
    margin: { left: MARGIN, right: MARGIN },
    styles: { fontSize: 9 },
  });

  const totalPages = doc.internal.pages.length - 1;
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(
      `Página ${i} de ${totalPages} | Econosfera Estadística | ${new Date().toLocaleDateString("es-MX")}`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: "center" }
    );
  }
  doc.save(`econosfera-estadisticas-descriptivas-${new Date().toISOString().split("T")[0]}.pdf`);
}
