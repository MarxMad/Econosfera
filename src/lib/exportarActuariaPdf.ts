import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const MARGIN = 15;

export type ActuariaExportData = {
  tipo: "Mortalidad" | "Ruina" | "PoderAdquisitivo";
  titulo: string;
  variables: Array<{ label: string; valor: string }>;
  resultados: Array<{ label: string; valor: string }>;
  chart?: string | null;
};

export async function exportarActuariaAPdf(data: ActuariaExportData) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  let currentY = 20;

  doc.setFillColor(190, 18, 60); // rose-700
  doc.rect(0, 0, pageWidth, 40, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("ECONOSFERA", MARGIN, 20);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("ACTUARÍA Y RIESGOS", MARGIN, 27);
  doc.setFontSize(14);
  doc.text(`REPORTE: ${data.tipo.toUpperCase()}`, pageWidth - MARGIN, 25, { align: "right" });

  currentY = 50;
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text(data.titulo, MARGIN, currentY);
  currentY += 10;

  const maxRows = Math.max(data.variables.length, data.resultados.length);
  const body = Array.from({ length: maxRows }, (_, i) => [
    data.variables[i]?.label ?? "",
    data.variables[i]?.valor ?? "",
    data.resultados[i]?.label ?? "",
    data.resultados[i]?.valor ?? "",
  ]);

  autoTable(doc, {
    startY: currentY,
    head: [["Parámetro de Entrada", "Valor", "Métrica de Resultado", "Valor"]],
    body,
    theme: "striped",
    headStyles: { fillColor: [190, 18, 60] },
    margin: { left: MARGIN, right: MARGIN },
  });

  // @ts-ignore
  currentY = doc.lastAutoTable.finalY + 15;

  if (data.chart && currentY < 200) {
    try {
      doc.addImage(data.chart, "PNG", MARGIN, currentY, 180, 70);
      currentY += 80;
    } catch (e) {
      console.warn("Chart image failed for Actuaria", e);
    }
  }

  const totalPages = doc.internal.pages.length - 1;
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(
      `Página ${i} de ${totalPages} | Econosfera Actuaría | ${new Date().toLocaleDateString("es-MX")}`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: "center" }
    );
  }

  doc.save(`Econosfera_Actuaria_${data.tipo}_${new Date().toISOString().split("T")[0]}.pdf`);
}
