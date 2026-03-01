import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const MARGIN = 15;

export type BlockchainExportData = {
    tipo: 'Halving' | 'Trading' | 'AMM' | 'Consenso' | 'Staking';
    titulo: string;
    variables: Array<{ label: string; valor: string }>;
    resultados?: Array<{ label: string; valor: string }>;
    tabla?: {
        label: string;
        columns: string[];
        data: Array<any>;
    };
    chart?: string | null;
};

export const exportarBlockchainAPdf = async (data: BlockchainExportData) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    let currentY = 20;

    // --- Header ---
    doc.setFillColor(15, 23, 42); // slate-900
    doc.rect(0, 0, pageWidth, 40, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('ECONOSFERA', MARGIN, 20);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('BLOCKCHAIN & CRYPTO ECONOMICS', MARGIN, 27);

    doc.setFontSize(14);
    doc.text(`REPORTE: ${data.tipo.toUpperCase()}`, pageWidth - MARGIN, 25, { align: 'right' });

    currentY = 50;

    // --- Título del Reporte ---
    doc.setTextColor(30, 41, 59);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(data.titulo, MARGIN, currentY);
    currentY += 10;

    // --- Parámetros iniciales ---
    autoTable(doc, {
        startY: currentY,
        head: [['Parámetro de Red', 'Valor']],
        body: data.variables.map(v => [v.label, v.valor]),
        theme: 'striped',
        headStyles: { fillColor: [124, 58, 237] }, // violet-600
        margin: { left: MARGIN, right: 60 },
    });

    // @ts-ignore
    currentY = doc.lastAutoTable.finalY + 15;

    // --- Resultados destacados si existen ---
    if (data.resultados && data.resultados.length > 0) {
        doc.setFontSize(12);
        doc.text("Métricas de Simulación", MARGIN, currentY);
        currentY += 6;

        autoTable(doc, {
            startY: currentY,
            head: [['Indicador', 'Valor']],
            body: data.resultados.map(r => [r.label, r.valor]),
            theme: 'grid',
            headStyles: { fillColor: [30, 41, 59] },
            margin: { left: MARGIN, right: MARGIN },
        });
        // @ts-ignore
        currentY = doc.lastAutoTable.finalY + 15;
    }

    // --- Tabla de Datos (Bloques/Eras) ---
    if (data.tabla) {
        if (currentY > 200) { doc.addPage(); currentY = 20; }

        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text(data.tabla.label, MARGIN, currentY);
        currentY += 7;

        autoTable(doc, {
            startY: currentY,
            head: [data.tabla.columns],
            body: data.tabla.data.map(row => Object.values(row)),
            theme: 'striped',
            headStyles: { fillColor: [76, 29, 149] }, // purple-900
            margin: { left: MARGIN, right: MARGIN },
            styles: { fontSize: 8 }
        });
        // @ts-ignore
        currentY = doc.lastAutoTable.finalY + 15;
    }

    // --- Gráfico si existe ---
    if (data.chart) {
        if (currentY > 180) { doc.addPage(); currentY = 20; }
        try {
            doc.addImage(data.chart, 'PNG', MARGIN, currentY, 180, 70);
        } catch (e) {
            console.warn("Chart image failed for Blockchain", e);
        }
    }

    // --- Footer y Glosario ---
    const totalPages = (doc as any).internal.pages.length - 1;
    for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(148, 163, 184);
        doc.text(
            `Página ${i} de ${totalPages} | Econosfera Blockchain Lab | ${new Date().toLocaleDateString('es-MX')}`,
            pageWidth / 2,
            doc.internal.pageSize.getHeight() - 10,
            { align: 'center' }
        );
    }

    doc.save(`Econosfera_Blockchain_${data.tipo}_${new Date().toISOString().split('T')[0]}.pdf`);
};
