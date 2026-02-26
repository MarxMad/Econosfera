"use client";

import { useState, useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Link2, Coins, Cpu, Wallet, BookOpen } from "lucide-react";
import { emisionConHalving, anosPorHalving, datosGraficoHalving } from "@/lib/blockchain";
import { InputLibre } from "./simuladores-finanzas/InputLibre";

interface SeccionBlockchainProps {
  id: string;
  titulo: string;
  icono: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
  defaultAbierto?: boolean;
}

function SeccionBlockchain({ id, titulo, icono: Icono, children, defaultAbierto = false }: SeccionBlockchainProps) {
  const [abierto, setAbierto] = useState(defaultAbierto);
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 shadow-lg overflow-hidden">
      <button
        type="button"
        onClick={() => setAbierto(!abierto)}
        className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
        aria-expanded={abierto}
      >
        <span className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-100">
          <Icono className="w-5 h-5 text-violet-500 dark:text-violet-400" aria-hidden />
          {titulo}
        </span>
        <span className="text-slate-500 dark:text-slate-400 text-sm">{abierto ? "Ocultar" : "Ver más"}</span>
      </button>
      {abierto && (
        <div className="px-5 pb-5 pt-0 border-t border-slate-200 dark:border-slate-700">
          {children}
        </div>
      )}
    </div>
  );
}

export default function BlockchainEcon() {
  const [mostrarSimulador, setMostrarSimulador] = useState(true);
  const [recompensaInicial, setRecompensaInicial] = useState(50);
  const [bloquesPorHalving, setBloquesPorHalving] = useState(210000);
  const [minutosPorBloque, setMinutosPorBloque] = useState(10);
  const [numHalvings, setNumHalvings] = useState(8);

  const { eras, supplyMaxima } = useMemo(
    () => emisionConHalving(recompensaInicial, bloquesPorHalving, numHalvings),
    [recompensaInicial, bloquesPorHalving, numHalvings]
  );
  const anosPorEra = useMemo(
    () => anosPorHalving(minutosPorBloque, bloquesPorHalving),
    [minutosPorBloque, bloquesPorHalving]
  );
  const datosGrafico = useMemo(
    () => datosGraficoHalving(recompensaInicial, bloquesPorHalving, minutosPorBloque, numHalvings),
    [recompensaInicial, bloquesPorHalving, minutosPorBloque, numHalvings]
  );

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-gradient-to-r from-violet-50 to-purple-50 dark:from-slate-800 dark:to-slate-800 p-5">
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">Economía blockchain</h2>
        <p className="text-slate-600 dark:text-slate-400 text-sm">
          Consenso, minería, oferta monetaria y tokens. La economía de las cadenas de bloques estudia incentivos, emisión y uso de activos digitales.
        </p>
      </div>

      {/* Simulador de emisión con halving */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 shadow-lg overflow-hidden">
        <button
          type="button"
          onClick={() => setMostrarSimulador(!mostrarSimulador)}
          className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
          aria-expanded={mostrarSimulador}
        >
          <span className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-100">
            <Coins className="w-5 h-5 text-violet-500 dark:text-violet-400" aria-hidden />
            Simulador: emisión con halving
          </span>
          <span className="text-slate-500 dark:text-slate-400 text-sm">{mostrarSimulador ? "Ocultar" : "Ver más"}</span>
        </button>
        {mostrarSimulador && (
          <div className="px-5 pb-5 pt-0 border-t border-slate-200 dark:border-slate-700 space-y-4">
            <p className="text-xs text-slate-600 dark:text-slate-400 pt-4">
              En muchas cadenas (ej. Bitcoin) la recompensa por bloque se reduce a la mitad cada cierto número de bloques. Así se controla la oferta y se aproxima un tope máximo. Ajusta los parámetros y observa la oferta acumulada.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <InputLibre label="Recompensa inicial por bloque" value={recompensaInicial} onChange={setRecompensaInicial} step="0.01" />
                <InputLibre label="Bloques entre cada halving" value={bloquesPorHalving} onChange={setBloquesPorHalving} step="1" />
                <InputLibre label="Minutos por bloque" value={minutosPorBloque} onChange={setMinutosPorBloque} step="0.1" />
                <InputLibre label="Número de épocas (halvings) a mostrar" value={numHalvings} onChange={setNumHalvings} step="1" />
              </div>
              <div className="space-y-3">
                <div className="rounded-xl border border-violet-200 dark:border-violet-800 bg-violet-50 dark:bg-violet-900/30 p-4">
                  <p className="text-xs font-semibold uppercase text-violet-600 dark:text-violet-400">Supply máxima teórica</p>
                  <p className="text-2xl font-bold font-mono text-slate-900 dark:text-slate-100">
                    {Number.isFinite(supplyMaxima) ? supplyMaxima.toLocaleString("es-MX", { maximumFractionDigits: 0 }) : "—"}
                  </p>
                  <p className="text-xs mt-1 text-slate-500 dark:text-slate-400">2 × bloques por halving × recompensa inicial</p>
                </div>
                <div className="rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/50 p-4">
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Años aproximados por época</p>
                  <p className="text-lg font-mono font-bold text-slate-800 dark:text-slate-200">
                    {Number.isFinite(anosPorEra) ? anosPorEra.toFixed(1) : "—"} años
                  </p>
                </div>
              </div>
            </div>
            {datosGrafico.length > 0 && (
              <>
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={datosGrafico} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-600" />
                      <XAxis dataKey="etiqueta" tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => (v >= 1e6 ? `${v / 1e6}M` : v >= 1000 ? `${v / 1000}k` : String(v))} />
                      <Tooltip formatter={(val: number) => [Number(val).toLocaleString("es-MX", { maximumFractionDigits: 0 }), "Supply acumulada"]} labelFormatter={(l) => l} />
                      <Line type="monotone" dataKey="supply" stroke="#7c3aed" strokeWidth={2} dot={{ r: 3 }} name="Supply acumulada" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-600">
                        <th className="text-left py-1.5 px-2 text-slate-600 dark:text-slate-400">Época</th>
                        <th className="text-right py-1.5 px-2 text-slate-600 dark:text-slate-400">Recompensa/bloque</th>
                        <th className="text-right py-1.5 px-2 text-slate-600 dark:text-slate-400">Emisión época</th>
                        <th className="text-right py-1.5 px-2 text-slate-600 dark:text-slate-400">Supply acumulada</th>
                      </tr>
                    </thead>
                    <tbody>
                      {eras.map((e) => (
                        <tr key={e.era} className="border-b border-slate-100 dark:border-slate-700/50">
                          <td className="py-1 px-2 font-mono">{e.era}</td>
                          <td className="text-right font-mono">{e.recompensaPorBloque.toLocaleString("es-MX", { maximumFractionDigits: 4 })}</td>
                          <td className="text-right font-mono">{e.emisionEra.toLocaleString("es-MX", { maximumFractionDigits: 0 })}</td>
                          <td className="text-right font-mono text-slate-700 dark:text-slate-300">{e.supplyAcumulada.toLocaleString("es-MX", { maximumFractionDigits: 0 })}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      <SeccionBlockchain id="conceptos" titulo="Conceptos y Teoría Blockchain" icono={BookOpen} defaultAbierto={false}>
        <div className="pt-4 space-y-8 text-sm text-slate-700 dark:text-slate-300">

          <div className="space-y-3">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2"><Link2 className="w-5 h-5 text-violet-500" /> Intro a Economía Blockchain</h3>
            <p>La <strong>economía blockchain</strong> analiza incentivos, oferta monetaria y comportamiento de actores en redes descentralizadas. Las cadenas de bloques usan <strong>consenso</strong> (Proof of Work, Proof of Stake) para validar transacciones sin un intermediario central. La <strong>emisión</strong> de nuevos unidades (p. ej. por minería) y su programación en el tiempo (halving, tope fijo) afectan la oferta y las expectativas de valor.</p>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2"><Cpu className="w-5 h-5 text-blue-500" /> Minería y Consenso</h3>
            <p>En <strong>Proof of Work (PoW)</strong>, los mineros compiten resolviendo problemas criptográficos; quien resuelve primero propone el siguiente bloque y recibe una recompensa. En <strong>Proof of Stake (PoS)</strong>, validadores bloquean garantía (stake) y reciben recompensas por proponer/validar bloques.</p>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2"><Coins className="w-5 h-5 text-emerald-500" /> Tokens y Oferta Monetaria</h3>
            <p>Los <strong>tokens</strong> pueden ser la moneda nativa de la cadena (p. ej. BTC, ETH) o activos emitidos sobre ella. La <strong>oferta</strong> puede ser fija (tope máximo), con emisión decreciente (halving) o con reglas de emisión definidas por gobernanza.</p>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2"><Wallet className="w-5 h-5 text-indigo-500" /> Finanzas descentralizadas (DeFi)</h3>
            <p><strong>DeFi</strong> agrupa aplicaciones (préstamos, intercambios, derivados) construidas sobre blockchain, sin intermediarios tradicionales. Muchos protocolos emiten <strong>tokens de gobernanza</strong> que reparten derechos y a veces parte de los ingresos.</p>
          </div>

        </div>
      </SeccionBlockchain>
    </div>
  );
}
