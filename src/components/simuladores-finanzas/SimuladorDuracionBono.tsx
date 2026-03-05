"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { HelpCircle, FileDown, Save } from "lucide-react";
import { precioBono, duracionMacaulay } from "@/lib/finanzas";
import { getSlugDeTermino } from "@/lib/glosario";
import { InputLibre } from "./InputLibre";
import { InstruccionesSimulador } from "../InstruccionesSimulador";
import { useSession } from "next-auth/react";
import PricingModal from "../PricingModal";

export default function SimuladorDuracionBono() {
  const { data: session } = useSession();
  const [showPricing, setShowPricing] = useState(false);
  const [exportando, setExportando] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [nominal, setNominal] = useState(100);
  const [cuponPct, setCuponPct] = useState(8);
  const [ytmPct, setYtmPct] = useState(9);
  const [anios, setAnios] = useState(5);

  const cupon = cuponPct / 100;
  const ytm = ytmPct / 100;
  const n = Math.max(1, Math.floor(anios));
  const { precio } = useMemo(() => precioBono(nominal, cupon, ytm, n), [nominal, cupon, ytm, n]);
  const duracion = useMemo(() => duracionMacaulay(nominal, cupon, ytm, n), [nominal, cupon, ytm, n]);
  const duracionModificada = duracion / (1 + ytm);

  const handleExport = async () => {
    if ((session?.user?.credits ?? 0) < 1) { setShowPricing(true); return; }
    setExportando(true);
    try {
      await import("@/lib/actions/exportActions").then((m) => m.registrarExportacion("Finanzas Duración Bono", "PDF"));
      await import("@/lib/exportarFinanzasPdf").then((m) => m.exportarFinanzasAPdf({
        tipo: "DuracionBono",
        titulo: "Duración de Macaulay y modificada",
        variables: [
          { label: "Valor nominal", valor: `$${nominal}` },
          { label: "Tasa cupón", valor: `${cuponPct}%` },
          { label: "YTM", valor: `${ytmPct}%` },
          { label: "Años", valor: String(n) },
        ],
        resultados: [
          { label: "Precio bono", valor: `$${precio.toFixed(2)}` },
          { label: "Duración Macaulay", valor: `${duracion.toFixed(2)} años` },
          { label: "Duración modificada", valor: `${duracionModificada.toFixed(2)}` },
        ],
      }));
    } catch (e) {
      if (String(e).includes("créditos")) setShowPricing(true);
      else alert("Error al exportar reporte");
    } finally { setExportando(false); }
  };

  const handleSave = async () => {
    if ((session?.user?.credits ?? 0) < 1) { setShowPricing(true); return; }
    setGuardando(true);
    try {
      const { saveScenario } = await import("@/lib/actions/scenarioActions");
      const res = await saveScenario({
        type: "FINANZAS",
        subType: "DURACION_BONO",
        name: `Duración bono ${new Date().toLocaleDateString()}`,
        variables: { nominal, cuponPct, ytmPct, anios },
        results: { precio, duracion, duracionModificada },
      });
      if (res.success) alert("Escenario guardado");
      else alert(res.error);
    } catch (e) { alert("Error al guardar"); } finally { setGuardando(false); }
  };

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 shadow-lg p-6">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Duración de un bono</h3>
        <div className="flex gap-2">
          <button type="button" onClick={handleExport} disabled={exportando} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-900 dark:bg-slate-700 text-white hover:bg-slate-800 dark:hover:bg-slate-600 transition-all shadow-md active:scale-95 disabled:opacity-50">
            <FileDown className="w-3.5 h-3.5" />
            {exportando ? "Generando..." : "Reporte PDF"}
          </button>
          {session && (
            <button type="button" onClick={handleSave} disabled={guardando} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold bg-blue-600 text-white hover:bg-blue-500 transition-all shadow-md active:scale-95 disabled:opacity-50">
              <Save className="w-3.5 h-3.5" />
              {guardando ? "Guardando..." : "Guardar"}
            </button>
          )}
        </div>
      </div>
      <p className="text-xs text-slate-600 dark:text-slate-400 mb-4">
        La duración mide la sensibilidad del precio a cambios en la tasa. Mayor duración = mayor volatilidad.
      </p>
      <InstruccionesSimulador>
        <p>La duración de Macaulay es el promedio ponderado del tiempo hasta recibir los flujos. La duración modificada aproxima el cambio % en el precio ante un cambio de 1% en el YTM. Relación inversa: cuando sube la tasa (YTM), el precio del bono baja.</p>
        <ul className="list-disc list-inside space-y-1 ml-1">
          <li><strong>Duración Macaulay:</strong> Promedio ponderado de los vencimientos de los flujos (en años).</li>
          <li><strong>Duración modificada:</strong> Macaulay / (1 + YTM). Aproximación: ΔP/P ≈ −Modificada × ΔYTM.</li>
          <li>Bonos con mayor plazo y menor cupón tienen mayor duración.</li>
        </ul>
        {getSlugDeTermino("Duration") && (
          <p className="pt-2">
            <Link href={`/glosario/${getSlugDeTermino("Duration")}`} className="text-blue-600 dark:text-blue-400 hover:underline font-medium">Ver definición de Duration en el glosario</Link>
          </p>
        )}
      </InstruccionesSimulador>
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="space-y-4">
          <InputLibre label="Valor nominal $" value={nominal} onChange={setNominal} step="1" tooltip="Valor del bono al vencimiento." />
          <InputLibre label="Tasa cupón %" value={cuponPct} onChange={setCuponPct} suffix="%" step="0.5" tooltip="Tasa de interés anual que paga el bono." />
          <InputLibre label="YTM (rendimiento) %" value={ytmPct} onChange={setYtmPct} suffix="%" step="0.5" tooltip="Rendimiento al vencimiento: tasa que iguala precio con flujos." />
          <InputLibre label="Años al vencimiento" value={anios} onChange={setAnios} step="1" tooltip="Plazo restante hasta el vencimiento." />
        </div>
        <div className="space-y-4">
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/50">
            <p className="text-xs font-bold text-slate-500 uppercase mb-1 flex items-center gap-1">
              Precio del bono
              <span title="Valor presente de cupones + principal." className="cursor-help"><HelpCircle className="w-3.5 h-3.5 text-slate-400" /></span>
            </p>
            <p className="text-2xl font-black text-slate-900 dark:text-white">${precio.toLocaleString("es-MX", { minimumFractionDigits: 2 })}</p>
          </div>
          <div className="p-4 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20">
            <p className="text-xs font-bold text-emerald-600 uppercase mb-1 flex items-center gap-1">
              Duración Macaulay
              <span title="Promedio ponderado del tiempo hasta recibir cada flujo." className="cursor-help"><HelpCircle className="w-3.5 h-3.5 text-emerald-500" /></span>
            </p>
            <p className="text-2xl font-black text-slate-900 dark:text-white">{duracion.toFixed(2)} años</p>
          </div>
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-600">
            <p className="text-xs font-bold text-slate-500 uppercase mb-1 flex items-center gap-1">
              Duración modificada
              <span title="Aproximación: si YTM sube 1%, el precio baja ~Modificada %." className="cursor-help"><HelpCircle className="w-3.5 h-3.5 text-slate-400" /></span>
            </p>
            <p className="text-xl font-bold text-slate-900 dark:text-white">{duracionModificada.toFixed(2)}</p>
          </div>
        </div>
      </div>
      <PricingModal isOpen={showPricing} onClose={() => setShowPricing(false)} />
    </div>
  );
}
