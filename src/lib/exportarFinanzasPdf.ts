import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const MARGIN = 15;

export type FinanzasExportData = {
    tipo: 'VPVF' | 'Bono' | 'Cetes' | 'Ahorro' | 'DCF' | 'BlackScholes' | 'Amortizacion' | 'VPNTIR' | 'WACC' | 'Forward' | 'BreakEven' | 'Portafolio2';
    titulo: string;
    variables: Array<{ label: string; valor: string }>;
    resultados: Array<{ label: string; valor: string }>;
    extra?: {
        label: string;
        data: Array<any>;
        columns: string[];
    };
    chart?: string | null;
};

export const exportarFinanzasAPdf = async (data: FinanzasExportData) => {
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
    doc.text('FINANZAS: INTELIGENCIA FINANCIERA Y MERCADOS', MARGIN, 27);

    doc.setFontSize(14);
    doc.text(`REPORTE: ${data.tipo.toUpperCase()}`, pageWidth - MARGIN, 25, { align: 'right' });

    currentY = 50;

    // --- Título de la Sección ---
    doc.setTextColor(30, 41, 59);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(data.titulo, MARGIN, currentY);
    currentY += 10;

    // --- Variables y Resultados Profesionales ---
    autoTable(doc, {
        startY: currentY,
        head: [['Párametro de Entrada', 'Valor', 'Métrica de Resultado', 'Valor']],
        body: data.variables.map((v, i) => [
            v.label,
            v.valor,
            data.resultados[i]?.label || '',
            data.resultados[i]?.valor || ''
        ]),
        theme: 'striped',
        headStyles: { fillColor: [37, 99, 235] },
        margin: { left: MARGIN, right: MARGIN },
    });

    // @ts-ignore
    currentY = doc.lastAutoTable.finalY + 15;

    // --- Análisis de Sensibilidad (Stress Test Finanzas) ---
    if (currentY > 180) { doc.addPage(); currentY = 20; }

    doc.setTextColor(30, 41, 59);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Análisis de Sensibilidad (Escenarios)', MARGIN, currentY);
    currentY += 6;

    let sensitivityBody: any[][] = [];
    let sensitivityHead: string[] = [];

    if (data.tipo === 'VPVF') {
        const vp = parseFloat(data.variables.find(v => v.label.includes('VP'))?.valor.replace('$', '') || '0');
        const r = parseFloat(data.variables.find(v => v.label.includes('Tasa'))?.valor.replace('%', '') || '0') / 100;
        const n = parseFloat(data.variables.find(v => v.label.includes('Años'))?.valor || '0');
        sensitivityHead = ['Variación Tasa', 'Nueva Tasa', 'Nuevo VF', 'Cambio %'];
        sensitivityBody = [-0.02, -0.01, 0, 0.01, 0.02].map(v => {
            const newR = Math.max(0, r + v);
            const newVF = vp * Math.pow(1 + newR, n);
            const baseVF = vp * Math.pow(1 + r, n);
            return [
                `${(v * 100).toFixed(0)}%`,
                `${(newR * 100).toFixed(2)}%`,
                `$${newVF.toLocaleString('es-MX', { maximumFractionDigits: 0 })}`,
                `${(((newVF / baseVF) - 1) * 100).toFixed(2)}%`
            ];
        });
    } else if (data.tipo === 'Bono') {
        const nominal = parseFloat(data.variables.find(v => v.label.includes('Nominal'))?.valor.replace('$', '') || '0');
        const c = parseFloat(data.variables.find(v => v.label.includes('Cupón'))?.valor.replace('%', '') || '0') / 100;
        const ytm = parseFloat(data.variables.find(v => v.label.includes('YTM'))?.valor.replace('%', '') || '0') / 100;
        const t = parseFloat(data.variables.find(v => v.label.includes('Años'))?.valor || '0');
        sensitivityHead = ['Escenario YTM', 'Tasa YTM', 'Precio Bono', 'Duración Est.'];
        sensitivityBody = [-0.01, -0.005, 0, 0.005, 0.01].map(v => {
            const newY = Math.max(0.001, ytm + v);
            // Simplificación del precio del bono para la tabla de sensibilidad
            let p = 0;
            for (let i = 1; i <= t; i++) p += (nominal * c) / Math.pow(1 + newY, i);
            p += nominal / Math.pow(1 + newY, t);
            return [
                v === 0 ? 'Base' : v > 0 ? `+${(v * 10000).toFixed(0)} bps` : `${(v * 10000).toFixed(0)} bps`,
                `${(newY * 100).toFixed(2)}%`,
                `$${p.toFixed(2)}`,
                t > 0 ? (t * 0.9).toFixed(2) : '0' // Proxy de duración
            ];
        });
    } else if (data.tipo === 'DCF') {
        const wacc = parseFloat(data.variables.find(v => v.label.includes('WACC'))?.valor.replace('%', '') || '0') / 100;
        const terminal = parseFloat(data.variables.find(v => v.label.includes('Perpetuo'))?.valor.replace('%', '') || '0') / 100;
        const baseValue = parseFloat(data.resultados.find(v => v.label.includes('INTRÍNSECO'))?.valor.replace('$', '').replace(',', '') || '0');

        sensitivityHead = ['Variación WACC', 'Nuevo WACC', 'Valor Empresa', 'Cambio %'];
        sensitivityBody = [0.01, 0.005, 0, -0.005, -0.01].map(v => {
            const newWacc = Math.max(0.01, wacc + v);
            const impactFactor = (wacc - terminal) / (newWacc - terminal);
            const newValue = baseValue * impactFactor;
            return [
                v === 0 ? 'Base' : `${(v * 100).toFixed(1)}%`,
                `${(newWacc * 100).toFixed(1)}%`,
                `$${Math.round(newValue).toLocaleString()}`,
                `${(((newValue / baseValue) - 1) * 100).toFixed(1)}%`
            ];
        });
    } else if (data.tipo === 'BlackScholes') {
        const sigma = parseFloat(data.variables.find(v => v.label.includes('Volatilidad'))?.valor.replace('%', '') || '0') / 100;
        const baseCall = parseFloat(data.resultados.find(v => v.label.includes('CALL'))?.valor.replace('$', '') || '0');

        sensitivityHead = ['Var. Volatilidad', 'Nueva Sigma', 'Precio Call Est.', 'Vega Approx'];
        sensitivityBody = [-0.1, -0.05, 0, 0.05, 0.1].map(v => {
            const newSigma = Math.max(0.01, sigma + v);
            const newValue = baseCall * (newSigma / sigma);
            return [
                v === 0 ? 'Base' : `${(v * 100).toFixed(0)}%`,
                `${(newSigma * 100).toFixed(0)}%`,
                `$${newValue.toFixed(2)}`,
                `${(baseCall / sigma / 100).toFixed(2)}`
            ];
        });
    }

    if (sensitivityBody.length > 0) {
        autoTable(doc, {
            startY: currentY,
            head: [sensitivityHead],
            body: sensitivityBody,
            theme: 'grid',
            headStyles: { fillColor: [51, 65, 85] },
            margin: { left: MARGIN, right: MARGIN },
        });
        // @ts-ignore
        currentY = doc.lastAutoTable.finalY + 15;
    }

    // --- Gráfico si existe ---
    if (data.chart) {
        if (currentY > 180) { doc.addPage(); currentY = 20; }
        try {
            doc.addImage(data.chart, 'PNG', MARGIN, currentY, 180, 70);
            currentY += 80;
        } catch (e) {
            console.warn("Chart image failed for Finanzas", e);
        }
    }

    // --- Tabla Extra (Flujos, Plazos, etc) ---
    if (data.extra) {
        if (currentY > 200) { doc.addPage(); currentY = 20; }

        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text(data.extra.label, MARGIN, currentY);
        currentY += 7;

        autoTable(doc, {
            startY: currentY,
            head: [data.extra.columns],
            body: data.extra.data.map(row => Object.values(row)),
            theme: 'grid',
            headStyles: { fillColor: [15, 23, 42] },
            margin: { left: MARGIN, right: MARGIN },
        });
    }

    // --- Final Glossary Page ---
    doc.addPage();
    currentY = 25;
    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, pageWidth, 15, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.text('ANEXO: GLOSARIO Y NOTAS TÉCNICAS', MARGIN, 10);

    doc.setTextColor(30, 41, 59);
    doc.setFontSize(10);
    const glosario = [
        ['DCF (Discounted Cash Flow)', 'Método de valuación que estima el valor hoy de flujos de caja futuros descontados a una tasa.'],
        ['WACC', 'Costo promedio ponderado de capital. Es la tasa de descuento para los flujos de la empresa.'],
        ['Black-Scholes', 'Modelo matemático para valuar primas de opciones financieras europeas.'],
        ['Griegas (Delta/Vega)', 'Medidas de sensibilidad del precio de una opción ante cambios en el activo o volatilidad.'],
        ['Valor Terminal', 'Valor estimado de una empresa más allá del periodo de proyección explícito.'],
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
        'Aviso Legal: Los cálculos presentados son estimaciones teóricas. Los rendimientos pasados no garantizan resultados futuros. Econosfera no se hace responsable por decisiones de inversión basadas en este reporte.',
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
            `Página ${i} de ${actualTotalPages} | Econosfera Finance Analyst | ${new Date().toLocaleDateString('es-MX')}`,
            pageWidth / 2,
            doc.internal.pageSize.getHeight() - 10,
            { align: 'center' }
        );
    }

    doc.save(`Econosfera_Finance_${data.tipo}_${new Date().toISOString().split('T')[0]}.pdf`);
};
