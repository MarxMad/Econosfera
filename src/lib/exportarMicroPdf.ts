import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { VariablesMercado, ResultadosMercado, VariablesElasticidad, ResultadosElasticidad } from './micro';

const MARGIN = 15;

export const exportarMicroAPdf = async (
    data: {
        mercado: { v: VariablesMercado; res: ResultadosMercado | null; chart?: string | null };
        elasticidad: { v: VariablesElasticidad; res: ResultadosElasticidad; chart?: string | null };
    }
) => {
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
    doc.text('MICROECONOMÍA: ANÁLISIS DE MERCADO Y ELASTICIDAD', MARGIN, 27);

    doc.setFontSize(14);
    doc.text('MICRO ANALYST REPORT', pageWidth - MARGIN, 25, { align: 'right' });

    currentY = 50;

    // --- Equilibrio de Mercado ---
    if (data.mercado.res) {
        doc.setTextColor(30, 41, 59);
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text('1. Equilibrio de Mercado y Excedentes', MARGIN, currentY);
        currentY += 8;

        autoTable(doc, {
            startY: currentY,
            head: [['Ecuación / Parámetro', 'Valor', 'Resultado Equilibrio', 'Valor']],
            body: [
                ['Intercepto Demanda (a)', data.mercado.v.demandaIntercepto.toString(), 'Precio Equilibrio (P*)', data.mercado.res.precioEquilibrio.toString()],
                ['Pendiente Demanda (b)', data.mercado.v.demandaPendiente.toString(), 'Cantidad Equilibrio (Q*)', data.mercado.res.cantidadEquilibrio.toString()],
                ['Intercepto Oferta (c)', data.mercado.v.ofertaIntercepto.toString(), 'Excedente Consumidor', data.mercado.res.excedenteConsumidor.toString()],
                ['Pendiente Oferta (d)', data.mercado.v.ofertaPendiente.toString(), 'Excedente Productor', data.mercado.res.excedenteProductor.toString()],
                ['Ecuación Demanda', `P = ${data.mercado.v.demandaIntercepto} - ${data.mercado.v.demandaPendiente}Q`, 'Elasticidad en P*', data.mercado.res.elasticidadPrecioDemanda.toString()],
            ],
            theme: 'striped',
            headStyles: { fillColor: [37, 99, 235] },
            margin: { left: MARGIN, right: MARGIN },
        });

        // @ts-ignore
        currentY = doc.lastAutoTable.finalY + 10;

        if (data.mercado.chart) {
            try {
                doc.addImage(data.mercado.chart, 'PNG', MARGIN, currentY, 180, 80);
                currentY += 90;
            } catch (e) {
                console.warn("Chart image failed for Market", e);
            }
        }
    }

    // --- Elasticidad Arco ---
    if (currentY > 200) {
        doc.addPage();
        currentY = 20;
    } else {
        currentY += 10;
    }

    doc.setTextColor(30, 41, 59);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('2. Análisis de Elasticidad Arco', MARGIN, currentY);
    currentY += 8;

    autoTable(doc, {
        startY: currentY,
        head: [['Punto Inicial', 'Punto Final', 'Coeficiente ε', 'Tipo / Interpretación']],
        body: [
            [
                `P: ${data.elasticidad.v.precioInicial}, Q: ${data.elasticidad.v.cantidadInicial}`,
                `P: ${data.elasticidad.v.precioFinal}, Q: ${data.elasticidad.v.cantidadFinal}`,
                data.elasticidad.res.elasticidadArco.toString(),
                `${data.elasticidad.res.tipo.toUpperCase()}\n${data.elasticidad.res.interpretacion}`
            ]
        ],
        theme: 'grid',
        headStyles: { fillColor: [15, 23, 42] },
        styles: { overflow: 'linebreak', cellWidth: 'wrap' },
        columnStyles: { 3: { cellWidth: 80 } },
        margin: { left: MARGIN, right: MARGIN },
    });

    // --- Análisis de Sensibilidad (Micro) ---
    if (data.mercado.res) {
        if (currentY > 180) { doc.addPage(); currentY = 20; }
        else { currentY += 10; }

        doc.setTextColor(30, 41, 59);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('1.2 Análisis de Sensibilidad (Cambios en Pendiente)', MARGIN, currentY);
        currentY += 6;

        const b = data.mercado.v.demandaPendiente;
        const variations = [0.8, 1, 1.2]; // Variación porcentual en la pendiente de demanda

        autoTable(doc, {
            startY: currentY,
            head: [['Demanda', 'Pendiente (b)', 'Nuevo P*', 'Nuevo Q*']],
            body: variations.map(v => {
                const newB = b * v;
                const d = data.mercado.v.ofertaPendiente;
                const a = data.mercado.v.demandaIntercepto;
                const c = data.mercado.v.ofertaIntercepto;
                const newQ = (a - c) / (newB + d);
                const newP = a - newB * newQ;
                return [
                    v === 1 ? 'Base' : v > 1 ? 'Más Inelástica' : 'Más Elástica',
                    newB.toFixed(2),
                    newP.toFixed(2),
                    newQ.toFixed(2)
                ];
            }),
            theme: 'grid',
            headStyles: { fillColor: [51, 65, 85] },
            margin: { left: MARGIN, right: MARGIN },
        });

        // @ts-ignore
        currentY = doc.lastAutoTable.finalY + 10;
    }

    // --- Footer & Glossary ---
    const totalPages = doc.internal.pages.length;

    // Add Glossary Page
    doc.addPage();
    currentY = 25;
    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, pageWidth, 15, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.text('ANEXO: GLOSARIO TÉCNICO Y FÓRMULAS', MARGIN, 10);

    doc.setTextColor(30, 41, 59);
    doc.setFontSize(10);
    const glosario = [
        ['Equilibrio de Mercado', 'Punto donde la cantidad ofrecida iguala la cantidad demandada (Qd = Qs).'],
        ['Elasticidad Precio', 'Medida de la sensibilidad de la cantidad demandada ante cambios en el precio.'],
        ['Excedente Consumidor', 'Diferencia entre lo que los consumidores están dispuestos a pagar y lo que pagan.'],
        ['Excedente Productor', 'Diferencia entre el precio que recibe el productor y su costo marginal.'],
    ];

    autoTable(doc, {
        startY: 20,
        body: glosario,
        theme: 'plain',
        styles: { fontSize: 9, cellPadding: 2 },
        columnStyles: { 0: { fontStyle: 'bold', cellWidth: 50 } },
    });

    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text(
        'Aviso: Este reporte es con fines académicos. Los modelos asumen competencia perfecta y funciones de oferta/demanda lineales.',
        MARGIN,
        doc.internal.pageSize.getHeight() - 20,
        { maxWidth: pageWidth - (2 * MARGIN) }
    );

    const actualTotalPages = doc.internal.pages.length - 1;
    for (let i = 1; i <= actualTotalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(148, 163, 184);
        doc.text(
            `Página ${i} de ${actualTotalPages} | Econosfera Micro Analyst | ${new Date().toLocaleDateString('es-MX')}`,
            pageWidth / 2,
            doc.internal.pageSize.getHeight() - 10,
            { align: 'center' }
        );
    }

    doc.save(`Econosfera_Micro_Analysis_${new Date().toISOString().split('T')[0]}.pdf`);
};
