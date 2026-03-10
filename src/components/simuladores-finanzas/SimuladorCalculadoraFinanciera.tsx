"use client";

import { useMemo, useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import {
  valorFuturo,
  valorPresente,
  valorFuturoSimple,
  evolucionVF,
  regla72,
  tasaEfectivaAnual,
  vpAnualidad,
  vfAnualidad,
  ahorroPeriodicoVF,
  ahorroEvolucion,
  tablaAmortizacion,
} from "@/lib/finanzas";
import { InputLibre } from "./InputLibre";
import { InstruccionesSimulador } from "../InstruccionesSimulador";
import { FileDown, Save } from "lucide-react";
import { useSession } from "next-auth/react";
import Heatmap from "../common/Heatmap";
import PricingModal from "../PricingModal";

const CAPITALIZACIONES = [
  { id: 1, label: "Anual" },
  { id: 2, label: "Semestral" },
  { id: 4, label: "Trimestral" },
  { id: 12, label: "Mensual" },
  { id: 365, label: "Diaria" },
];

export default function SimuladorCalculadoraFinanciera({ initialData }: { initialData?: any }) {
  const { data: session } = useSession();
  const [showPricing, setShowPricing] = useState(false);
  const [exportando, setExportando] = useState(false);

  const [monto, setMonto] = useState(10000);
  const [tasaPct, setTasaPct] = useState(8);
  const [anios, setAnios] = useState(5);
  const [pagoMensual, setPagoMensual] = useState(2000);
  const [capitalizaciones, setCapitalizaciones] = useState(12);

  useEffect(() => {
    if (initialData?.data) {
      const d = initialData.data;
      if (d.monto != null) setMonto(d.monto);
      if (d.tasaPct != null) setTasaPct(d.tasaPct);
      if (d.anios != null) setAnios(d.anios);
      if (d.pagoMensual != null) setPagoMensual(d.pagoMensual);
      if (d.capitalizaciones != null) setCapitalizaciones(d.capitalizaciones);
    }
  }, [initialData?.data]);

  const tasa = tasaPct / 100;
  const tasaNominal = tasa;
  const aniosSeguro = Math.max(0, Math.min(100, anios));
  const plazoMeses = Math.max(1, Math.floor(anios * 12));

  const resultados = useMemo(() => {
    const vf = valorFuturo(monto, tasa, anios);
    const vp = valorPresente(10000, tasa, anios);
    const vfSimple = valorFuturoSimple(monto, tasa, anios);
    const vfCompuesto = valorFuturo(monto, tasa, anios);
    const aniosDuplicar = regla72(tasaPct);
    const tasaEfectiva = tasaEfectivaAnual(tasaNominal, capitalizaciones);
    const vpAnu = vpAnualidad(pagoMensual, tasa / 12, anios * 12);
    const vfAnu = vfAnualidad(pagoMensual, tasa / 12, anios * 12);
    const vfAhorro = ahorroPeriodicoVF(pagoMensual, tasa, anios, 12);
    const totalAportado = pagoMensual * 12 * anios;
    const { cuota, totalInteres } = tablaAmortizacion(monto, tasa, plazoMeses);

    return {
      vf,
      vp,
      vfSimple,
      vfCompuesto,
      diferencia: vfCompuesto - vfSimple,
      aniosDuplicar,
      tasaEfectivaPct: tasaEfectiva * 100,
      vpAnu,
      vfAnu,
      vfAhorro,
      totalAportado,
      interesAhorro: vfAhorro - totalAportado,
      cuota,
      totalInteres,
    };
  }, [monto, tasa, anios, tasaPct, tasaNominal, capitalizaciones, pagoMensual, plazoMeses]);

  const datosGrafico = useMemo(
    () => evolucionVF(monto, tasa, aniosSeguro),
    [monto, tasa, aniosSeguro]
  );

  const datosAhorro = useMemo(
    () => ahorroEvolucion(pagoMensual, tasa, aniosSeguro, 12),
    [pagoMensual, tasa, aniosSeguro]
  );

  const fmt = (n: number, decimals = 2) =>
    n.toLocaleString("es-MX", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });

  const exportarReporte = async () => {
    if ((session?.user?.credits ?? 0) < 1) {
      setShowPricing(true);
      return;
    }
    setExportando(true);
    try {
      const { registrarExportacion } = await import("@/lib/actions/exportActions");
      await registrarExportacion("Calculadora Financiera", "PDF");
      const { exportarFinanzasAPdf } = await import("@/lib/exportarFinanzasPdf");
      const { getGraficoAsDataUrl } = await import("@/lib/exportarGrafico");
      let chartUrl: string | null = null;
      try {
        chartUrl = await getGraficoAsDataUrl("grafico-calc-financiera");
      } catch {}

      await exportarFinanzasAPdf({
        tipo: "CalculadoraFinanciera",
        titulo: "Calculadora financiera unificada",
        variables: [
          { label: "Monto principal", valor: `$${fmt(monto, 0)}` },
          { label: "Tasa anual", valor: `${tasaPct}%` },
          { label: "Años", valor: String(anios) },
          { label: "Pago mensual", valor: `$${fmt(pagoMensual, 0)}` },
          { label: "Capitalizaciones/año", valor: String(capitalizaciones) },
        ],
        resultados: [
          { label: "VF (compuesto)", valor: `$${fmt(resultados.vf)}` },
          { label: "VF simple", valor: `$${fmt(resultados.vfSimple)}` },
          { label: "Años para duplicar", valor: `${resultados.aniosDuplicar.toFixed(1)}` },
          { label: "Tasa efectiva", valor: `${resultados.tasaEfectivaPct.toFixed(2)}%` },
          { label: "Cuota amortización", valor: `$${fmt(resultados.cuota)}` },
        ],
        extra: {
          label: "Resumen de resultados (VP/VF, Anualidad, Ahorro, Amortización)",
          columns: ["Concepto", "Valor"],
          data: [
            { Concepto: "VF compuesto", Valor: `$${fmt(resultados.vf)}` },
            { Concepto: "VF interés simple", Valor: `$${fmt(resultados.vfSimple)}` },
            { Concepto: "Diferencia simple vs compuesto", Valor: `$${fmt(resultados.diferencia)}` },
            { Concepto: "Años para duplicar (Regla 72)", Valor: `${resultados.aniosDuplicar.toFixed(1)} años` },
            { Concepto: "Tasa efectiva anual", Valor: `${resultados.tasaEfectivaPct.toFixed(2)}%` },
            { Concepto: "VP anualidad", Valor: `$${fmt(resultados.vpAnu)}` },
            { Concepto: "VF anualidad", Valor: `$${fmt(resultados.vfAnu)}` },
            { Concepto: "VF ahorro acumulado", Valor: `$${fmt(resultados.vfAhorro)}` },
            { Concepto: "Total aportado (ahorro)", Valor: `$${fmt(resultados.totalAportado, 0)}` },
            { Concepto: "Interés ganado (ahorro)", Valor: `$${fmt(resultados.interesAhorro)}` },
            { Concepto: "Cuota mensual (amortización)", Valor: `$${fmt(resultados.cuota)}` },
            { Concepto: "Total intereses (amortización)", Valor: `$${fmt(resultados.totalInteres)}` },
          ],
        },
        chart: chartUrl ?? undefined,
      });
    } catch (e) {
      if (String(e).includes("créditos")) setShowPricing(true);
      else alert("Error al exportar");
    } finally {
      setExportando(false);
    }
  };

  const handleSave = async () => {
    if ((session?.user?.credits ?? 0) < 1) {
      setShowPricing(true);
      return;
    }
    try {
      const { saveScenario } = await import("@/lib/actions/scenarioActions");
      const res = await saveScenario({
        type: "FINANZAS",
        subType: "CALCULADORA_FINANCIERA",
        name: `Calculadora financiera ${new Date().toLocaleDateString()}`,
        variables: { monto, tasaPct, anios, pagoMensual, capitalizaciones },
        results: resultados,
      });
      if (res.success) alert("Escenario guardado");
      else alert(res.error);
    } catch (e) {
      alert("Error al guardar");
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 shadow-lg p-5">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
            Calculadora financiera unificada
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Un solo simulador: monto, tasa y periodo → VP/VF, interés simple/compuesto, regla 72, tasa efectiva, anualidad, ahorro y amortización.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={exportarReporte}
            disabled={exportando}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-900 dark:bg-slate-700 text-white hover:bg-slate-800 disabled:opacity-50"
          >
            <FileDown className="w-3.5 h-3.5" />
            {exportando ? "Generando..." : "Reporte PDF"}
          </button>
          {session && (
            <button
              type="button"
              onClick={handleSave}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold bg-blue-600 text-white hover:bg-blue-500"
            >
              <Save className="w-3.5 h-3.5" />
              Guardar
            </button>
          )}
        </div>
      </div>

      <InstruccionesSimulador>
        Ingresa monto, tasa y periodo. Verás todos los resultados: valor presente/futuro, interés simple vs compuesto, regla del 72, tasa efectiva, anualidad, ahorro periódico y tabla de amortización.
      </InstruccionesSimulador>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <InputLibre
          label="Monto principal (VP) $"
          value={monto}
          onChange={setMonto}
          tooltip="Cantidad inicial para VP/VF, interés y amortización."
        />
        <InputLibre
          label="Tasa anual %"
          value={tasaPct}
          onChange={setTasaPct}
          suffix="%"
          step="0.5"
        />
        <InputLibre
          label="Años"
          value={anios}
          onChange={setAnios}
          step="1"
        />
        <InputLibre
          label="Pago mensual (anualidad/ahorro) $"
          value={pagoMensual}
          onChange={setPagoMensual}
          tooltip="Aportación mensual para anualidad y ahorro."
        />
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Capitalizaciones/año (tasa efectiva)
          </label>
          <select
            value={capitalizaciones}
            onChange={(e) => setCapitalizaciones(Number(e.target.value))}
            className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
          >
            {CAPITALIZACIONES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label} ({c.id})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50/50 dark:bg-slate-900/30 p-4">
          <h4 className="font-bold text-slate-800 dark:text-slate-100 mb-3">Valor presente y futuro</h4>
          <div className="space-y-2 text-sm">
            <p>
              <span className="text-slate-500">VF de ${fmt(monto, 0)}:</span>{" "}
              <strong className="text-indigo-600 dark:text-indigo-400">${fmt(resultados.vf)}</strong>
            </p>
            <p>
              <span className="text-slate-500">VP de $10,000 a {anios} años:</span>{" "}
              <strong>${fmt(resultados.vp)}</strong>
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50/50 dark:bg-slate-900/30 p-4">
          <h4 className="font-bold text-slate-800 dark:text-slate-100 mb-3">Interés simple vs compuesto</h4>
          <div className="space-y-2 text-sm">
            <p>
              <span className="text-slate-500">VF simple:</span>{" "}
              <strong>${fmt(resultados.vfSimple)}</strong>
            </p>
            <p>
              <span className="text-slate-500">VF compuesto:</span>{" "}
              <strong className="text-indigo-600 dark:text-indigo-400">${fmt(resultados.vfCompuesto)}</strong>
            </p>
            <p>
              <span className="text-slate-500">Diferencia:</span>{" "}
              <strong>${fmt(resultados.diferencia)}</strong>
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50/50 dark:bg-slate-900/30 p-4">
          <h4 className="font-bold text-slate-800 dark:text-slate-100 mb-3">Regla del 72 y tasa efectiva</h4>
          <div className="space-y-2 text-sm">
            <p>
              <span className="text-slate-500">Años para duplicar:</span>{" "}
              <strong className="text-indigo-600 dark:text-indigo-400">{resultados.aniosDuplicar.toFixed(1)} años</strong>
            </p>
            <p>
              <span className="text-slate-500">Tasa efectiva ({capitalizaciones} cap./año):</span>{" "}
              <strong>{resultados.tasaEfectivaPct.toFixed(2)}%</strong>
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50/50 dark:bg-slate-900/30 p-4">
          <h4 className="font-bold text-slate-800 dark:text-slate-100 mb-3">Anualidad (pago mensual)</h4>
          <div className="space-y-2 text-sm">
            <p>
              <span className="text-slate-500">VP anualidad:</span>{" "}
              <strong>${fmt(resultados.vpAnu)}</strong>
            </p>
            <p>
              <span className="text-slate-500">VF anualidad:</span>{" "}
              <strong className="text-indigo-600 dark:text-indigo-400">${fmt(resultados.vfAnu)}</strong>
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50/50 dark:bg-slate-900/30 p-4">
          <h4 className="font-bold text-slate-800 dark:text-slate-100 mb-3">Ahorro periódico</h4>
          <div className="space-y-2 text-sm">
            <p>
              <span className="text-slate-500">VF acumulado:</span>{" "}
              <strong className="text-indigo-600 dark:text-indigo-400">${fmt(resultados.vfAhorro)}</strong>
            </p>
            <p>
              <span className="text-slate-500">Total aportado:</span>{" "}
              <strong>${fmt(resultados.totalAportado, 0)}</strong>
            </p>
            <p>
              <span className="text-slate-500">Interés ganado:</span>{" "}
              <strong>${fmt(resultados.interesAhorro)}</strong>
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50/50 dark:bg-slate-900/30 p-4">
          <h4 className="font-bold text-slate-800 dark:text-slate-100 mb-3">Amortización (crédito)</h4>
          <div className="space-y-2 text-sm">
            <p>
              <span className="text-slate-500">Cuota mensual:</span>{" "}
              <strong className="text-indigo-600 dark:text-indigo-400">${fmt(resultados.cuota)}</strong>
            </p>
            <p>
              <span className="text-slate-500">Total intereses ({plazoMeses} meses):</span>{" "}
              <strong>${fmt(resultados.totalInteres)}</strong>
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl border border-slate-200 dark:border-slate-600 p-4">
          <h4 className="font-bold text-slate-800 dark:text-slate-100 mb-3">Evolución VP → VF</h4>
          <div id="grafico-calc-financiera" className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={datosGrafico}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                <XAxis dataKey="ano" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  formatter={(v: number) => [`$${fmt(v)}`, "Valor"]}
                  labelFormatter={(l) => `Año ${l}`}
                />
                <Line type="monotone" dataKey="valor" stroke="#6366f1" strokeWidth={2} dot={false} name="Valor" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-600 p-4">
          <h4 className="font-bold text-slate-800 dark:text-slate-100 mb-3">Evolución ahorro mensual</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={datosAhorro.map((d) => ({ ...d, periodo: Math.round(d.periodo / 12) }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                <XAxis dataKey="periodo" stroke="#94a3b8" fontSize={12} name="Año" />
                <YAxis stroke="#94a3b8" fontSize={12} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  formatter={(v: number) => [`$${fmt(v)}`, "Acumulado"]}
                  labelFormatter={(l) => `Año ${l}`}
                />
                <Line type="monotone" dataKey="acumulado" stroke="#10b981" strokeWidth={2} dot={false} name="Acumulado" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <Heatmap
          title="Sensibilidad: VF ante cambios en tasa y años"
          xAxisLabel="Años"
          yAxisLabel="Tasa %"
          xValues={[3, 5, 7, 10, 15]}
          yValues={[4, 6, 8, 10, 12]}
          data={[4, 6, 8, 10, 12].map((t) =>
            [3, 5, 7, 10, 15].map((a) => valorFuturo(monto, t / 100, a))
          )}
          formatter={(v: number) => `$${(v / 1000).toFixed(1)}k`}
        />
      </div>

      <PricingModal isOpen={showPricing} onClose={() => setShowPricing(false)} />
    </div>
  );
}
