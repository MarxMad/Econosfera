import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { VariablesMacro, ResultadosMacro, VariablesISLM, ResultadosISLM } from './macro';

const MARGIN = 15;

export const exportarMacroAPdf = async (
    data: {
        multiplier?: { v: VariablesMacro; res: ResultadosMacro; chart?: string | null };
        islm?: { v: VariablesISLM; res: ResultadosISLM | null; chart?: string | null };
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
    doc.text('MACROECONOMÍA: ANÁLISIS DE EQUILIBRIO Y MULTIPLICADORES', MARGIN, 27);

    doc.setFontSize(14);
    doc.text('MACRO INTELLIGENCE REPORT', pageWidth - MARGIN, 25, { align: 'right' });

    currentY = 50;

    // --- Multiplicador Keynesiano ---
    if (data.multiplier) {
        doc.setTextColor(30, 41, 59);
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text('1. Multiplicador Keynesiano', MARGIN, currentY);
        currentY += 8;

        autoTable(doc, {
            startY: currentY,
            head: [['Variable Control', 'Valor', 'Métrica de Equilibrio', 'Resultado']],
            body: [
                ['Consumo Autónomo (C0)', data.multiplier.v.consumoAutonomo.toString(), 'Gasto Autónomo', data.multiplier.res.gastoAutonomo.toString()],
                ['PMC', data.multiplier.v.propensionMarginalConsumo.toString(), 'Renta de Equilibrio (Y*)', data.multiplier.res.rentaEquilibrio.toString()],
                ['Inversión (I)', data.multiplier.v.inversion.toString(), 'Consumo en Equilibrio', data.multiplier.res.consumoEquilibrio.toString()],
                ['Gasto Público (G)', data.multiplier.v.gastoPublico.toString(), 'Ahorro Privado', data.multiplier.res.ahorroPrivado.toString()],
                ['Impuestos (T)', data.multiplier.v.impuestos.toString(), 'Mult. Gasto', data.multiplier.res.multiplicadorGasto.toString()],
            ],
            theme: 'striped',
            headStyles: { fillColor: [37, 99, 235] },
            margin: { left: MARGIN, right: MARGIN },
        });

        // @ts-ignore
        currentY = doc.lastAutoTable.finalY + 10;

        if (data.multiplier.chart) {
            try {
                doc.addImage(data.multiplier.chart, 'PNG', MARGIN, currentY, 180, 60);
                currentY += 70;
            } catch (e) {
                console.warn("Chart image failed for Multiplier", e);
            }
        }
    }

    // --- Modelo IS-LM ---
    if (data.islm && data.islm.res) {
        if (currentY > 180) {
            doc.addPage();
            currentY = 20;
        } else {
            currentY += 10;
        }

        doc.setTextColor(30, 41, 59);
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text('2. Modelo IS-LM', MARGIN, currentY);
        currentY += 8;

        autoTable(doc, {
            startY: currentY,
            head: [['Variable IS-LM', 'Valor', 'Equilibrio r-Y', 'Resultado']],
            body: [
                ['Gasto Público (G)', data.islm.v.gastoPublico.toString(), 'Renta Equilibrio (Y*)', data.islm.res.rentaEquilibrio.toString()],
                ['Impuestos (T)', data.islm.v.impuestos.toString(), 'Tasa Interés (r*)', `${data.islm.res.tasaEquilibrio}%`],
                ['Oferta Dinero (M/P)', data.islm.v.ofertaRealDinero.toString(), 'Inversión Real', data.islm.res.inversionEquilibrio.toString()],
                ['Sens. Inversión (b)', data.islm.v.sensibilidadInversionTasa.toString(), 'Demanda Dinero (L)', data.islm.res.demandaDinero.toString()],
            ],
            theme: 'striped',
            headStyles: { fillColor: [15, 23, 42] },
            margin: { left: MARGIN, right: MARGIN },
        });

        // @ts-ignore
        currentY = doc.lastAutoTable.finalY + 10;

        if (data.islm.chart) {
            try {
                doc.addImage(data.islm.chart, 'PNG', MARGIN, currentY, 180, 60);
                currentY += 70;
            } catch (e) {
                console.warn("Chart image failed for IS-LM", e);
            }
        }
    }

    // --- Análisis de Sensibilidad (Stress Test) ---
    if (data.multiplier) {
        if (currentY > 200) { doc.addPage(); currentY = 20; }
        else { currentY += 10; }

        doc.setTextColor(30, 41, 59);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('1.2 Análisis de Sensibilidad (Stress Test)', MARGIN, currentY);
        currentY += 6;

        const pmc = data.multiplier.v.propensionMarginalConsumo;
        const variations = [-0.05, 0, 0.05]; // Sensibilidad en PMC

        autoTable(doc, {
            startY: currentY,
            head: [['Escenario PMC', 'PMC Var.', 'Nuevo Mult. Gasto', 'Impacto en Y*']],
            body: variations.map(v => {
                const newPmc = Math.max(0.1, Math.min(0.95, pmc + v));
                const newMult = 1 / (1 - newPmc);
                const impact = (data.multiplier!.res.gastoAutonomo * newMult).toFixed(2);
                return [
                    v === 0 ? 'Base' : v > 0 ? 'Optimista (+5%)' : 'Pésimista (-5%)',
                    newPmc.toFixed(2),
                    newMult.toFixed(2),
                    impact
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
    doc.text('ANEXO: GLOSARIO TÉCNICO Y REFERENCIAS', MARGIN, 10);

    doc.setTextColor(30, 41, 59);
    doc.setFontSize(10);
    const glosario = [
        ['Propensión Marginal (PMC)', 'Proporción de un peso adicional de ingreso que se destina al consumo.'],
        ['Multiplicador Gasto', 'Factor por el cual un incremento en el gasto autónomo eleva la renta nacional.'],
        ['Modelo IS-LM', 'Marco que integra el mercado de bienes y servicios con el mercado monetario.'],
        ['Tasa Real (r)', 'Tasa de interés ajustada por inflación que equilibra la oferta y demanda de dinero.'],
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
        'Aviso: Este reporte es con fines educativos y se basa en modelos económicos teóricos (Hicks-Hansen). No constituye asesoría financiera.',
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
            `Página ${i} de ${actualTotalPages} | Econosfera Macro Intelligence | ${new Date().toLocaleDateString('es-MX')}`,
            pageWidth / 2,
            doc.internal.pageSize.getHeight() - 10,
            { align: 'center' }
        );
    }

    doc.save(`Econosfera_Macro_Analysis_${new Date().toISOString().split('T')[0]}.pdf`);
};
