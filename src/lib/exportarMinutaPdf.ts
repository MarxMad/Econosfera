import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface AnalisisReal {
    decision: { tasa: string; cambio: string; votacion: string; tipo: string };
    veredicto: string;
    insights: Array<{ titulo: string; desc: string; color: string; bg: string }>;
    detalle: {
        pormenorizado: string;
        factoresInflacion: string[];
        mecanismosDefensa: string[];
        disidente: string;
    };
    ponderaciones: Array<{ label: string; pct: number; color: string }>;
}

export const exportarMinutaAPdf = (datos: AnalisisReal, nombreArchivo: string) => {
    const doc = new jsPDF();
    const margin = 15;
    const pageWidth = doc.internal.pageSize.getWidth();
    let currentY = 20;

    // --- Header ---
    doc.setFillColor(15, 23, 42); // slate-900
    doc.rect(0, 0, pageWidth, 40, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('ECONOSFERA', margin, 20);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('INTELIGENCIA DE MERCADOS Y POLÍTICA MONETARIA', margin, 27);

    doc.setFontSize(14);
    doc.text('AI ANALYST REPORT', pageWidth - margin, 25, { align: 'right' });

    currentY = 50;

    // --- Título de la Minuta ---
    doc.setTextColor(30, 41, 59); // slate-800
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(`Análisis: ${nombreArchivo.replace('.pdf', '').replace('.md', '').replace('.txt', '')}`, margin, currentY);
    currentY += 10;

    // --- Resumen de Decisión (Fila superior) ---
    autoTable(doc, {
        startY: currentY,
        head: [['Dato Clave', 'Valor']],
        body: [
            ['Tasa de Interés', datos.decision.tasa],
            ['Cambio', datos.decision.cambio],
            ['Votación', datos.decision.votacion],
            ['Tipo de Decisión', datos.decision.tipo],
        ],
        theme: 'striped',
        headStyles: { fillColor: [37, 99, 235], textColor: 255 }, // blue-600
        margin: { left: margin, right: margin },
    });

    // @ts-ignore
    currentY = doc.lastAutoTable.finalY + 15;

    // --- Veredicto Ejecutivo ---
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Veredicto Ejecutivo', margin, currentY);
    currentY += 7;

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    const veredictoLines = doc.splitTextToSize(datos.veredicto, pageWidth - (margin * 2));
    doc.text(veredictoLines, margin, currentY);
    currentY += (veredictoLines.length * 6) + 10;

    // --- Insights Clave ---
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Insights del Analista AI', margin, currentY);
    currentY += 10;

    datos.insights.forEach((insight, index) => {
        if (currentY > 260) {
            doc.addPage();
            currentY = 20;
        }

        doc.setFillColor(248, 250, 252); // slate-50
        doc.roundedRect(margin, currentY - 5, pageWidth - (margin * 2), 25, 3, 3, 'F');

        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(37, 99, 235); // blue-600
        doc.text(insight.titulo, margin + 5, currentY + 2);

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(71, 85, 105); // slate-600
        const descLines = doc.splitTextToSize(insight.desc, pageWidth - (margin * 2) - 10);
        doc.text(descLines, margin + 5, currentY + 8);

        currentY += 30;
    });

    // --- Análisis Pormenorizado ---
    if (currentY > 240) {
        doc.addPage();
        currentY = 20;
    }

    doc.setTextColor(30, 41, 59);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Análisis Pormenorizado', margin, currentY);
    currentY += 7;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const pormenorizadoLines = doc.splitTextToSize(datos.detalle.pormenorizado, pageWidth - (margin * 2));
    doc.text(pormenorizadoLines, margin, currentY);
    currentY += (pormenorizadoLines.length * 5) + 15;

    // --- Factores y Mecanismos (Tabla) ---
    if (currentY > 230) {
        doc.addPage();
        currentY = 20;
    }

    autoTable(doc, {
        startY: currentY,
        head: [['Factores de Inflación', 'Mecanismos de Defensa']],
        body: [
            [
                datos.detalle.factoresInflacion.join('\n• '),
                datos.detalle.mecanismosDefensa.join('\n• ')
            ]
        ],
        theme: 'grid',
        headStyles: { fillColor: [15, 23, 42] },
        styles: { overflow: 'linebreak' },
        margin: { left: margin, right: margin },
    });

    // @ts-ignore
    currentY = doc.lastAutoTable.finalY + 15;

    // --- Voces Disidentes ---
    if (currentY > 240) {
        doc.addPage();
        currentY = 20;
    }

    doc.setFillColor(254, 242, 242); // red-50
    doc.rect(margin, currentY - 5, pageWidth - (margin * 2), 30, 'F');

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(185, 28, 28); // red-700
    doc.text('ANÁLISIS DE DISIDENCIAS', margin + 5, currentY + 2);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(127, 29, 29); // red-900
    const disidenteLines = doc.splitTextToSize(datos.detalle.disidente, pageWidth - (margin * 2) - 10);
    doc.text(disidenteLines, margin + 5, currentY + 10);

    // --- Footer ---
    const totalPages = doc.internal.pages.length - 1;
    for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(148, 163, 184); // slate-400
        doc.text(
            `Página ${i} de ${totalPages} | Econosfera AI Analyst | Reporte generado el ${new Date().toLocaleDateString('es-MX')}`,
            pageWidth / 2,
            doc.internal.pageSize.getHeight() - 10,
            { align: 'center' }
        );
    }

    doc.save(`Econosfera_Analisis_${nombreArchivo.replace(/\.[^/.]+$/, "")}.pdf`);
};
