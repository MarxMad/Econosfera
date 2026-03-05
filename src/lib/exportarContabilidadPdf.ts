import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const MARGIN = 15;

export type ContabilidadExportData = {
    tipo: 'Depreciacion' | 'CostosInventario' | 'RazonesFinancieras' | 'EstadoResultados' | 'EcuacionContable' | 'Prorrateo' | 'CostoProduccion' | 'PuntoEquilibrio';
    titulo: string;
    variables: Array<{ label: string; valor: string }>;
    resultados: Array<{ label: string; valor: string }>;
    extra?: {
        label: string;
        data: Array<any>;
        columns: string[];
    };
};

export const exportarContabilidadAPdf = async (data: ContabilidadExportData) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    let currentY = 20;

    doc.setFillColor(15, 94, 102); // teal-800
    doc.rect(0, 0, pageWidth, 40, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('ECONOSFERA', MARGIN, 20);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('CONTABILIDAD: HERRAMIENTAS PARA CONTADORES', MARGIN, 27);

    doc.setFontSize(14);
    doc.text(`REPORTE: ${data.tipo.toUpperCase()}`, pageWidth - MARGIN, 25, { align: 'right' });

    currentY = 50;

    doc.setTextColor(30, 41, 59);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(data.titulo, MARGIN, currentY);
    currentY += 10;

    const maxRows = Math.max(data.variables.length, data.resultados.length);
    const body = Array.from({ length: maxRows }, (_, i) => [
        data.variables[i]?.label || '',
        data.variables[i]?.valor || '',
        data.resultados[i]?.label || '',
        data.resultados[i]?.valor || ''
    ]);

    autoTable(doc, {
        startY: currentY,
        head: [['Parámetro de Entrada', 'Valor', 'Resultado', 'Valor']],
        body,
        theme: 'striped',
        headStyles: { fillColor: [20, 118, 110] },
        margin: { left: MARGIN, right: MARGIN },
    });

    // @ts-ignore
    currentY = doc.lastAutoTable.finalY + 15;

    if (data.extra) {
        if (currentY > 200) { doc.addPage(); currentY = 20; }

        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text(data.extra.label, MARGIN, currentY);
        currentY += 7;

        autoTable(doc, {
            startY: currentY,
            head: [data.extra.columns],
            body: data.extra.data.map(row => (Array.isArray(row) ? row : Object.values(row))),
            theme: 'grid',
            headStyles: { fillColor: [15, 23, 42] },
            margin: { left: MARGIN, right: MARGIN },
        });
    }

    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text(
        'Aviso: Los cálculos son estimaciones contables. Consulte a un profesional para decisiones fiscales o legales.',
        MARGIN,
        doc.internal.pageSize.getHeight() - 20,
        { maxWidth: pageWidth - (2 * MARGIN) }
    );

    doc.save(`Econosfera_Contabilidad_${data.tipo}_${new Date().toISOString().split('T')[0]}.pdf`);
};
