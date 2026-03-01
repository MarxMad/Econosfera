import { useState, useMemo } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import {
  Link2, BookOpen, Coins, Droplets, LineChart as LineChartIcon, Wallet, ArrowRight,
  TrendingDown, Info, ShieldCheck, Zap, Globe, Cpu, Scale, GitMerge, KeyRound, Bug,
  FileDown, Save, Lock
} from "lucide-react";
import { emisionConHalving, anosPorHalving, datosGraficoHalving } from "@/lib/blockchain";
import { InputLibre } from "./simuladores-finanzas/InputLibre";
import { registrarExportacion } from "@/lib/actions/exportActions";
import { exportarBlockchainAPdf } from "@/lib/exportarBlockchainPdf";
import { saveScenario } from "@/lib/actions/scenarioActions";
import PricingModal from "./PricingModal";
import {
  SimuladorTrading, SimuladorStaking, SimuladorAMM, SimuladorCadenaBloques,
  SimuladorLlaves, SimuladorMerkle, SimuladorConsenso, SimuladorSmartContracts, SimuladorRedP2P
} from "./simuladores-finanzas";

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
  const { data: session } = useSession();
  const isPro = session?.user?.plan === 'PRO' || session?.user?.plan === 'RESEARCHER';
  const isResearcher = session?.user?.plan === 'RESEARCHER';
  const [showPricing, setShowPricing] = useState(false);
  const [exportandoHalving, setExportandoHalving] = useState(false);
  const [guardandoHalving, setGuardandoHalving] = useState(false);

  type TabType = "halving" | "trading" | "staking" | "amm" | "cadenabloques" | "llaves" | "merkle" | "consenso" | "smartcontracts" | "redp2p";
  const [activeTab, setActiveTab] = useState<TabType>("halving");
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

  const handleExportHalving = async () => {
    if ((session?.user?.credits ?? 0) < 1) {
      setShowPricing(true);
      return;
    }
    setExportandoHalving(true);
    try {
      await registrarExportacion("Blockchain Halving", "PDF");
      let chartUrl: string | null = null;
      try {
        const { getGraficoAsDataUrl } = await import("@/lib/exportarGrafico");
        chartUrl = await getGraficoAsDataUrl("grafico-halving");
      } catch (_) {}
      exportarBlockchainAPdf({
        tipo: 'Halving',
        titulo: 'Análisis de Emisión y Escasez Digital (Halving)',
        variables: [
          { label: 'Recompensa Inicial', valor: recompensaInicial.toString() },
          { label: 'Bloques por Época', valor: bloquesPorHalving.toString() },
          { label: 'Minutos por Bloque', valor: minutosPorBloque.toString() },
          { label: 'Número de Épocas', valor: numHalvings.toString() }
        ],
        resultados: [
          { label: 'Supply Máxima Teórica', valor: supplyMaxima.toLocaleString() },
          { label: 'Años por Época', valor: anosPorEra.toFixed(2) }
        ],
        tabla: {
          label: 'Detalle por Épocas de Emisión',
          columns: ['Era', 'Recompensa', 'Supply Acumulada', 'Inflación', 'S2F'],
          data: eras.map(e => ({
            era: e.era,
            rec: e.recompensaPorBloque.toFixed(4),
            sup: e.supplyAcumulada.toLocaleString(),
            inf: `${e.inflacionAnual.toFixed(2)}%`,
            s2f: `${e.stockToFlow.toFixed(1)}x`
          }))
        },
        chart: chartUrl
      });
    } catch (e: any) {
      if (String(e?.message || e).includes("créditos")) setShowPricing(true);
      else alert(e?.message || "Error al exportar");
    } finally {
      setExportandoHalving(false);
    }
  };

  const handleSaveHalving = async () => {
    if (!session?.user) return;
    setGuardandoHalving(true);
    try {
      const res = await saveScenario({
        type: "BLOCKCHAIN",
        subType: "HALVING",
        name: `Halving ${new Date().toLocaleDateString()}`,
        variables: { recompensaInicial, bloquesPorHalving, minutosPorBloque, numHalvings },
        results: { supplyMaxima, anosPorEra, eras }
      });
      if (res.success) alert("Escenario de Halving guardado (1 crédito)");
      else alert(res.error);
    } catch (e: any) {
      alert("Error al guardar");
    } finally {
      setGuardandoHalving(false);
    }
  };

  return (
    <>
    <div className="space-y-6 animate-in fade-in duration-700">
      {/* Hero */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-violet-50 to-purple-50 dark:from-slate-900 dark:to-slate-900 p-8 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 text-violet-500">
          <BookOpen className="w-24 h-24" />
        </div>
        <div className="relative z-10">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-3 flex items-center gap-3">
            <Link2 className="text-violet-500 w-8 h-8" />
            Economía Blockchain
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm max-w-2xl italic">
            Consenso, minería, oferta monetaria y tokens. La economía de las cadenas de bloques estudia incentivos, emisión y uso de activos digitales.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 p-1 bg-slate-200 dark:bg-slate-800/50 rounded-2xl w-fit">
        {[
          { id: 'halving', label: 'Emisión (Halving)', icon: Coins },
          { id: 'trading', label: 'Trading Activo', icon: LineChartIcon },
          { id: 'staking', label: 'Staking y Yield Framing', icon: Wallet },
          { id: 'amm', label: 'Market Makers / Liquidez', icon: Droplets },
          { id: 'cadenabloques', label: 'Hash & Blockchain', icon: Cpu },
          { id: 'llaves', label: 'Wallets & Firmas', icon: KeyRound },
          { id: 'merkle', label: 'Árboles Merkle', icon: GitMerge },
          { id: 'consenso', label: 'PoW vs PoS', icon: Scale },
          { id: 'redp2p', label: 'Redes P2P', icon: Globe },
          { id: 'smartcontracts', label: 'Hacking Contracts', icon: Bug },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === tab.id
              ? 'bg-white dark:bg-slate-700 text-violet-600 dark:text-violet-400 shadow-sm'
              : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
          >
            <tab.icon className="w-3.5 h-3.5" />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
        {activeTab === 'halving' && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 lg:p-8 border border-slate-200 dark:border-slate-800 shadow-xl">
            <div className="flex items-center justify-between gap-4 mb-2">
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <Coins className="w-5 h-5 text-violet-500" />
                Simulación de Emisión (Halving)
              </h3>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleExportHalving}
                  disabled={exportandoHalving}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 dark:bg-slate-700 text-white hover:bg-slate-800 dark:hover:bg-slate-600 transition-all shadow-md active:scale-95 disabled:opacity-50"
                >
                  <FileDown className="w-3.5 h-3.5" />
                  {exportandoHalving ? "Generando..." : "Reporte PDF"}
                </button>
                {session && (
                  <button
                    type="button"
                    onClick={handleSaveHalving}
                    disabled={guardandoHalving}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-violet-600 text-white hover:bg-violet-500 transition-all shadow-md active:scale-95 disabled:opacity-50"
                  >
                    <Save className="w-3.5 h-3.5" />
                    {guardandoHalving ? "Guardando..." : "Guardar"}
                  </button>
                )}
              </div>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mb-6">
              En muchas cadenas (ej. Bitcoin) la recompensa por bloque se reduce a la mitad cada cierto número de bloques. Este "Halving" es el mecanismo más famoso de escasez digital. Al reducir la emisión de nuevas monedas a la mitad, la <strong>Inflación Anual</strong> cae drásticamente y el <strong>Stock-to-Flow</strong> (qué tan difícil es producir más de lo que ya existe) se dispara, convirtiendo al activo en "dinero duro" (hard money) muy similar al comportamiento del oro.
            </p>
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="space-y-4">
                <InputLibre label="Recompensa inicial por bloque" value={recompensaInicial} onChange={setRecompensaInicial} step="0.01" />
                <InputLibre label="Bloques entre cada halving" value={bloquesPorHalving} onChange={setBloquesPorHalving} step="1" />
                <InputLibre label="Minutos por bloque" value={minutosPorBloque} onChange={setMinutosPorBloque} step="0.1" />
                <InputLibre label="Número de épocas (halvings) a mostrar" value={numHalvings} onChange={setNumHalvings} step="1" />
              </div>
              <div className="space-y-4">
                <div className="rounded-2xl border border-violet-200 dark:border-violet-800 bg-violet-50 dark:bg-violet-900/30 p-6">
                  <p className="text-xs font-semibold uppercase tracking-widest text-violet-600 dark:text-violet-400">Supply máxima teórica</p>
                  <p className="text-4xl font-black font-mono text-slate-900 dark:text-slate-100 my-2">
                    {Number.isFinite(supplyMaxima) ? supplyMaxima.toLocaleString("es-MX", { maximumFractionDigits: 0 }) : "—"}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">2 × bloques por halving × recompensa inicial</p>
                </div>
                <div className="rounded-2xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/50 p-6">
                  <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">Años aproximados por época</p>
                  <p className="text-2xl font-mono font-bold text-slate-800 dark:text-slate-200 my-2">
                    {Number.isFinite(anosPorEra) ? anosPorEra.toFixed(1) : "—"} años
                  </p>
                </div>
              </div>
            </div>

            {datosGrafico.length > 0 && (
              <div className="space-y-8">
                <div id="grafico-halving" className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={datosGrafico} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" vertical={false} />
                      <XAxis dataKey="etiqueta" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                      <YAxis yAxisId="left" tick={{ fontSize: 11 }} tickFormatter={(v) => (v >= 1e6 ? `${v / 1e6}M` : v >= 1000 ? `${v / 1000}k` : String(v))} axisLine={false} tickLine={false} />
                      <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} tickFormatter={(v) => `${v}%`} axisLine={false} tickLine={false} />
                      <Tooltip formatter={(val: number, name: string) => name === "Inflación (eje derecho)" ? [`${val.toFixed(2)}%`, name] : [Number(val).toLocaleString("es-MX", { maximumFractionDigits: 0 }), name]} labelFormatter={(l) => l} />
                      <Line yAxisId="left" type="monotone" dataKey="supply" stroke="#7c3aed" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} name="Supply acumulada" />
                      <Line yAxisId="right" type="stepAfter" dataKey="inflacionAnual" stroke="#10b981" strokeWidth={2} strokeDasharray="5 5" dot={false} name="Inflación (eje derecho)" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                        <th className="text-left py-3 px-4 font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider text-[10px]">Época</th>
                        <th className="text-right py-3 px-4 font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider text-[10px]">Recompensa/bloque</th>
                        <th className="text-right py-3 px-4 font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider text-[10px]">Supply acumulada</th>
                        <th className="text-right py-3 px-4 font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider text-[10px]">Inflación Anual</th>
                        <th className="text-right py-3 px-4 font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider text-[10px]">Stock-to-Flow</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {eras.map((e) => (
                        <tr key={e.era} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                          <td className="py-2 px-4 font-mono font-medium">{e.era}</td>
                          <td className="text-right font-mono py-2 px-4 text-slate-600 dark:text-slate-300">{e.recompensaPorBloque.toLocaleString("es-MX", { maximumFractionDigits: 4 })}</td>
                          <td className="text-right font-mono font-bold py-2 px-4 text-violet-600 dark:text-violet-400">{e.supplyAcumulada.toLocaleString("es-MX", { maximumFractionDigits: 0 })}</td>
                          <td className="text-right font-mono font-bold py-2 px-4 text-emerald-600 dark:text-emerald-400">{e.inflacionAnual.toFixed(2)}%</td>
                          <td className="text-right font-mono py-2 px-4 text-amber-600 dark:text-amber-400">{e.stockToFlow.toLocaleString("es-MX", { maximumFractionDigits: 1 })}x</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'trading' && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 lg:p-8 border border-slate-200 dark:border-slate-800 shadow-xl">
            <SimuladorTrading />
          </div>
        )}

        {activeTab === 'amm' && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 lg:p-8 border border-slate-200 dark:border-slate-800 shadow-xl">
            <SimuladorAMM />
          </div>
        )}

        {activeTab === 'cadenabloques' && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 lg:p-8 border border-slate-200 dark:border-slate-800 shadow-xl relative overflow-hidden">
            <SimuladorCadenaBloques />
          </div>
        )}

        {activeTab === 'llaves' && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 lg:p-8 border border-slate-200 dark:border-slate-800 shadow-xl relative overflow-hidden">
            <SimuladorLlaves />
          </div>
        )}

        {activeTab === 'merkle' && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 lg:p-8 border border-slate-200 dark:border-slate-800 shadow-xl relative overflow-hidden">
            {!isPro && (
              <div className="absolute inset-0 z-50 backdrop-blur-[4px] bg-slate-900/60 flex items-center justify-center p-6">
                <div className="max-w-sm bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 text-center animate-in fade-in zoom-in">
                  <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Lock className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-black mb-2">Características Premium</h3>
                  <p className="text-sm text-slate-500 mb-8">El Árbol de Merkle es avanzado y requiere nivel Estudiante Pro o Researcher.</p>
                  <a href="/pricing" className="block w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-500">Subir a Pro</a>
                </div>
              </div>
            )}
            <SimuladorMerkle />
          </div>
        )}

        {activeTab === 'consenso' && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 lg:p-8 border border-slate-200 dark:border-slate-800 shadow-xl relative overflow-hidden">
            <SimuladorConsenso />
          </div>
        )}

        {activeTab === 'smartcontracts' && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 lg:p-8 border border-slate-200 dark:border-slate-800 shadow-xl relative overflow-hidden">
            {!isResearcher && (
              <div className="absolute inset-0 z-50 backdrop-blur-[4px] bg-slate-900/60 flex items-center justify-center p-6">
                <div className="max-w-sm bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 text-center animate-in fade-in zoom-in">
                  <div className="w-16 h-16 bg-rose-100 dark:bg-rose-900/30 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Lock className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-black mb-2">Simulador Researcher</h3>
                  <p className="text-sm text-slate-500 mb-8">El laboratorio de ataques a Smart Contracts es exclusivo para el plan <b>Investigador / Full</b>.</p>
                  <a href="/pricing" className="block w-full py-3 bg-rose-600 text-white font-bold rounded-xl hover:bg-rose-500 shadow-lg shadow-rose-500/20 active:scale-95 transition-all">Desbloquear Nivel Investigador</a>
                </div>
              </div>
            )}
            <SimuladorSmartContracts />
          </div>
        )}

        {activeTab === 'redp2p' && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 lg:p-8 border border-slate-200 dark:border-slate-800 shadow-xl relative overflow-hidden">
            {!isResearcher && (
              <div className="absolute inset-0 z-50 backdrop-blur-[4px] bg-slate-900/60 flex items-center justify-center p-6">
                <div className="max-w-sm bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 text-center animate-in fade-in zoom-in">
                  <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Lock className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-black mb-2">Simulador de Nodos</h3>
                  <p className="text-sm text-slate-500 mb-8">Experimenta la propagación de transacciones y consenso en tiempo real con nivel <b>Investigador / Full</b>.</p>
                  <a href="/pricing" className="block w-full py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-500 shadow-lg shadow-indigo-500/20 active:scale-95 transition-all">Desbloquear Full</a>
                </div>
              </div>
            )}
            <SimuladorRedP2P />
          </div>
        )}

        {activeTab === 'staking' && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 lg:p-8 border border-slate-200 dark:border-slate-800 shadow-xl">
            <SimuladorStaking />
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
    <PricingModal isOpen={showPricing} onClose={() => setShowPricing(false)} />
    </>
  );
}
