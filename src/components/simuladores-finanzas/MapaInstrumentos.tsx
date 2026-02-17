"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, Wallet, FileText, TrendingUp, Layers } from "lucide-react";

interface NodoMapa {
  id: string;
  label: string;
  definicion: string;
  hijos?: NodoMapa[];
  icono?: React.ComponentType<{ className?: string }>;
}

const ARBOL: NodoMapa[] = [
  {
    id: "renta-fija",
    label: "Renta fija",
    definicion: "Flujos predecibles: cupones y/o principal. Bajo riesgo de crédito si el emisor es sólido; sensibles a cambios en tasas de interés.",
    icono: FileText,
    hijos: [
      { id: "cetes", label: "Cetes", definicion: "Certificados de la Tesorería (México). Deuda gubernamental a corto plazo, colocada al descuento, sin cupones." },
      { id: "bondes", label: "Bondes / Udibonos", definicion: "Bonos del gobierno federal a mediano y largo plazo. Udibonos están indexados a la inflación." },
      { id: "pagarés", label: "Pagarés bursátiles", definicion: "Deuda emitida por empresas en el mercado de valores; plazos y tasas variables." },
      { id: "obligaciones", label: "Obligaciones (bonos corporativos)", definicion: "Deuda con cupones periódicos; el emisor paga intereses y devuelve el principal al vencimiento." },
    ],
  },
  {
    id: "renta-variable",
    label: "Renta variable",
    definicion: "Rendimiento no garantizado: dividendos y plusvalía. Mayor riesgo y potencial de ganancia; representan propiedad (capital).",
    icono: TrendingUp,
    hijos: [
      { id: "acciones", label: "Acciones", definicion: "Participación en el capital de una empresa. Derecho a dividendos (si los hay) y a la plusvalía del precio." },
      { id: "etf", label: "ETF", definicion: "Fondos cotizados que replican un índice o canasta de activos. Se negocian en bolsa como una acción." },
    ],
  },
  {
    id: "hibridos",
    label: "Híbridos",
    definicion: "Combinan características de deuda y capital: pagos fijos con opción de conversión o participación en resultados.",
    icono: Layers,
    hijos: [
      { id: "preferentes", label: "Acciones preferentes", definicion: "Prioridad en dividendos y en liquidación; a veces con dividendos fijos similares a un cupón." },
      { id: "convertibles", label: "Obligaciones convertibles", definicion: "Bonos que pueden convertirse en acciones en condiciones preestablecidas." },
    ],
  },
  {
    id: "derivados",
    label: "Derivados",
    definicion: "Su valor depende de un subyacente (acción, índice, tasa, tipo de cambio). Futuros, opciones, swaps. Uso: cobertura o especulación.",
    icono: Wallet,
    hijos: [
      { id: "futuros", label: "Futuros", definicion: "Contrato para comprar o vender un activo en una fecha futura a un precio acordado." },
      { id: "opciones", label: "Opciones", definicion: "Derecho (no obligación) a comprar (call) o vender (put) un activo a un precio de ejercicio hasta una fecha." },
    ],
  },
];

function NodoArbol({ nodo, nivel = 0 }: { nodo: NodoMapa; nivel?: number }) {
  const [abierto, setAbierto] = useState(nivel < 1);
  const tieneHijos = nodo.hijos && nodo.hijos.length > 0;
  const Icon = nodo.icono;

  return (
    <div className="rounded-lg border border-slate-200 dark:border-slate-600 overflow-hidden">
      <button
        type="button"
        onClick={() => tieneHijos && setAbierto(!abierto)}
        className={`w-full flex items-center gap-2 px-3 py-2.5 text-left transition-colors ${
          tieneHijos ? "hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer" : "cursor-default"
        } ${nivel === 0 ? "bg-slate-50 dark:bg-slate-800/50 font-semibold" : "bg-white dark:bg-slate-800/30"}`}
      >
        {tieneHijos ? (
          abierto ? (
            <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" aria-hidden />
          ) : (
            <ChevronRight className="w-4 h-4 text-slate-500 shrink-0" aria-hidden />
          )
        ) : (
          <span className="w-4 shrink-0" />
        )}
        {Icon && <Icon className="w-4 h-4 text-slate-500 dark:text-slate-400 shrink-0" aria-hidden />}
        <span className="text-sm text-slate-800 dark:text-slate-100">{nodo.label}</span>
      </button>
      {abierto && tieneHijos && (
        <div className="pl-6 pr-3 pb-3 pt-0 space-y-1 border-t border-slate-100 dark:border-slate-700/50">
          <p className="text-xs text-slate-600 dark:text-slate-400 py-2">{nodo.definicion}</p>
          {nodo.hijos!.map((h) => (
            <NodoArbol key={h.id} nodo={h} nivel={nivel + 1} />
          ))}
        </div>
      )}
      {!tieneHijos && (
        <div className="pl-6 pr-3 pb-2 pt-0">
          <p className="text-xs text-slate-600 dark:text-slate-400">{nodo.definicion}</p>
        </div>
      )}
    </div>
  );
}

export default function MapaInstrumentos() {
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 shadow-lg p-5">
      <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-2">Mapa conceptual: instrumentos financieros</h3>
      <p className="text-xs text-slate-600 dark:text-slate-400 mb-4">
        Clasificación por tipo de flujo y emisor. Expande cada rama para ver ejemplos y definiciones.
      </p>
      <div className="space-y-2">
        {ARBOL.map((nodo) => (
          <NodoArbol key={nodo.id} nodo={nodo} />
        ))}
      </div>
    </div>
  );
}
