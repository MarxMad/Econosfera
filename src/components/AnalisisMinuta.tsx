"use client";

import { useState, useRef, useEffect } from "react";
import {
  Upload, FileText, ChevronRight, TrendingUp, AlertTriangle,
  CheckCircle2, Info, FileDown, LayoutDashboard, ListFilter,
  Share2, ArrowRight, ExternalLink, Activity, AlertCircle
} from "lucide-react";
import { analizarMinutaBanxico } from "@/lib/actions/analisisActions";
import { exportarMinutaAPdf } from "@/lib/exportarMinutaPdf";

type TabAnálisis = "resumen" | "detalle" | "flujos";

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

interface AnalisisMinutaProps {
  onAnalisisComplete?: (datos: AnalisisReal | null) => void;
  initialData?: any;
}

export default function AnalisisMinuta({ onAnalisisComplete, initialData }: AnalisisMinutaProps) {
  const [analizando, setAnalizando] = useState(false);
  const [minutaAnalizada, setMinutaAnalizada] = useState<string | null>(null);
  const [datosAnalizados, setDatosAnalizados] = useState<AnalisisReal | null>(null);

  useEffect(() => {
    if (initialData) {
      setDatosAnalizados(initialData);
      setMinutaAnalizada("Escenario Guardado");
      if (onAnalisisComplete) onAnalisisComplete(initialData);
    }
  }, [initialData]);
  const [tabActiva, setTabActiva] = useState<TabAnálisis>("resumen");
  const [exportando, setExportando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAnalizando(true);
    setError(null);
    setMinutaAnalizada(file.name);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const resultado = await analizarMinutaBanxico(formData);
      setDatosAnalizados(resultado);
      if (onAnalisisComplete) onAnalisisComplete(resultado);
      setTabActiva("resumen");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Error al analizar la minuta.");
      setMinutaAnalizada(null);
    } finally {
      setAnalizando(false);
    }
  };

  const exportarPdf = async () => {
    if (!datosAnalizados || !minutaAnalizada) return;

    setExportando(true);
    try {
      // Pequeño delay artificial para feedback visual de procesamiento
      await new Promise(resolve => setTimeout(resolve, 800));
      exportarMinutaAPdf(datosAnalizados, minutaAnalizada);
    } catch (err) {
      console.error("Error al exportar PDF:", err);
      alert("Error al generar el PDF. Por favor intenta de nuevo.");
    } finally {
      setExportando(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10">
        {/* Header Premium */}
        <div className="bg-gradient-to-r from-[#1e293b] via-[#0f172a] to-[#1e3a5f] p-6 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <Activity className="w-32 h-32" />
          </div>
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-500/20 rounded-xl backdrop-blur-md border border-white/10">
                <FileText className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold tracking-tight">Econosfera AI Analyst</h2>
                <p className="text-slate-400 text-xs font-medium uppercase tracking-widest">Real-time Banxico Intelligence</p>
              </div>
            </div>
            {datosAnalizados && (
              <button
                onClick={exportarPdf}
                disabled={exportando}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-xl text-sm font-bold transition-all shadow-lg shadow-blue-900/20 active:scale-95 disabled:opacity-50"
              >
                <FileDown className="w-4 h-4" />
                {exportando ? "Exportando..." : "Exportar Reporte"}
              </button>
            )}
          </div>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-2xl flex items-center gap-3 text-red-600 dark:text-red-400">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          {!datosAnalizados && !analizando && (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="group cursor-pointer border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-400 rounded-3xl p-12 flex flex-col items-center justify-center gap-4 transition-all hover:bg-blue-50/50 dark:hover:bg-blue-900/10"
            >
              <div className="p-5 bg-slate-50 dark:bg-slate-800 rounded-full group-hover:scale-110 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 transition-all duration-300">
                <Upload className="w-10 h-10 text-slate-400 group-hover:text-blue-500" />
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-slate-700 dark:text-slate-200">Subir Minuta Real de Banxico</p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xs mx-auto">
                  Sube cualquier minuta. Nuestra IA conectada a OpenAI extraerá el balance de riesgos y la lógica de decisión al instante.
                </p>
              </div>
              <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept=".md,.txt,.pdf" />
            </div>
          )}

          {analizando && (
            <div className="py-20 flex flex-col items-center justify-center gap-8 animate-in fade-in zoom-in duration-500">
              <div className="relative">
                <div className="w-20 h-20 border-[6px] border-blue-100 dark:border-blue-900/30 border-t-blue-600 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Activity className="w-8 h-8 text-blue-600 animate-pulse" />
                </div>
              </div>
              <div className="text-center space-y-2">
                <p className="text-xl font-black text-slate-800 dark:text-slate-100 tracking-tight">Consultando OpenAI Intelligence...</p>
                <div className="flex items-center gap-2 justify-center">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Analizando narrativa y sentimiento monetario...</p>
                </div>
              </div>
            </div>
          )}

          {datosAnalizados && (
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
              {/* Navegación de Pestañas */}
              <div className="flex p-1.5 bg-slate-100 dark:bg-slate-800/50 rounded-2xl mb-8 w-fit mx-auto sm:mx-0">
                <button
                  onClick={() => setTabActiva("resumen")}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${tabActiva === "resumen" ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`}
                >
                  <LayoutDashboard className="w-4 h-4" /> Resumen
                </button>
                <button
                  onClick={() => setTabActiva("detalle")}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${tabActiva === "detalle" ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`}
                >
                  <ListFilter className="w-4 h-4" /> Detalle
                </button>
                <button
                  onClick={() => setTabActiva("flujos")}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${tabActiva === "flujos" ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`}
                >
                  <TrendingUp className="w-4 h-4" /> Flujos
                </button>
              </div>

              {/* CONTENIDO DE PESTAÑAS */}
              <div className="min-h-[400px]">
                {/* TAB RESUMEN */}
                {tabActiva === "resumen" && (
                  <div className="grid lg:grid-cols-12 gap-8 animate-in fade-in duration-500">
                    <div className="lg:col-span-4 space-y-6">
                      <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 rounded-2xl border border-blue-100 dark:border-blue-800">
                        <p className="text-xs font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-2">Decisión de Tasa</p>
                        <h3 className="text-2xl font-black text-slate-800 dark:text-white mb-4">{datosAnalizados.decision.tipo}</h3>
                        <div className="flex items-end gap-2">
                          <span className="text-5xl font-black text-blue-700 dark:text-blue-400 tracking-tighter">{datosAnalizados.decision.tasa}</span>
                          <span className="text-sm font-bold text-slate-500 pb-2">{datosAnalizados.decision.cambio}</span>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-4 leading-relaxed font-medium">
                          {datosAnalizados.veredicto}
                        </p>
                      </div>

                      <div className="p-4 bg-emerald-50 dark:bg-emerald-900/10 rounded-xl border border-emerald-100 dark:border-emerald-800 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <CheckCircle2 className="w-8 h-8 text-emerald-500 shrink-0" />
                          <div>
                            <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase">Votación</p>
                            <p className="text-sm font-black text-slate-800 dark:text-slate-100">{datosAnalizados.decision.votacion}</p>
                          </div>
                        </div>
                        {datosAnalizados.detalle.disidente && (
                          <div className="px-2 py-1 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center gap-1.5 border border-amber-200 dark:border-amber-800">
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                            <span className="text-[10px] font-black text-amber-700 dark:text-amber-400 uppercase">Dissent</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="lg:col-span-8">
                      <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">Insights de la Minuta</h3>
                      <div className="grid sm:grid-cols-2 gap-4">
                        {Array.isArray(datosAnalizados.insights) ? (
                          datosAnalizados.insights.map((item, i) => (
                            <div key={i} className={`p-5 rounded-2xl ${item.bg || 'bg-slate-100 dark:bg-slate-800/50'} border border-slate-200 dark:border-slate-700 transition-transform hover:scale-[1.02] shadow-sm`}>
                              <p className={`font-black ${(item.color || 'text-blue-600').replace('text-', 'text-')} dark:text-white text-sm mb-1`}>{item.titulo}</p>
                              <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed font-bold">
                                {item.desc}
                              </p>
                            </div>
                          ))
                        ) : (
                          <p className="col-span-2 text-center text-xs text-slate-500 italic">No hay insights disponibles en este momento.</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB DETALLE */}
                {tabActiva === "detalle" && (
                  <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                    <div className="prose prose-slate dark:prose-invert max-w-none">
                      <section className="space-y-4">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                          <h4 className="text-lg font-black tracking-tight text-slate-800 dark:text-slate-100">Análisis Profundo</h4>
                        </div>
                        <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                          {datosAnalizados.detalle.pormenorizado}
                        </p>
                      </section>

                      <div className="grid md:grid-cols-2 gap-8 mt-8">
                        <div className="space-y-4">
                          <h5 className="text-xs font-black text-blue-600 uppercase tracking-widest">Factores Determinantes</h5>
                          <ul className="space-y-3">
                            {Array.isArray(datosAnalizados.detalle.factoresInflacion) ? (
                              datosAnalizados.detalle.factoresInflacion.map((f, i) => (
                                <li key={i} className="flex gap-2 text-sm text-slate-600 dark:text-slate-400">
                                  <ArrowRight className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                                  <span>{f}</span>
                                </li>
                              ))
                            ) : (
                              <li className="text-sm text-slate-600 dark:text-slate-400">{datosAnalizados.detalle.factoresInflacion}</li>
                            )}
                          </ul>
                        </div>
                        <div className="space-y-4">
                          <h5 className="text-xs font-black text-emerald-600 uppercase tracking-widest">Contrapesos y Estabilidad</h5>
                          <ul className="space-y-3">
                            {Array.isArray(datosAnalizados.detalle.mecanismosDefensa) ? (
                              datosAnalizados.detalle.mecanismosDefensa.map((m, i) => (
                                <li key={i} className="flex gap-2 text-sm text-slate-600 dark:text-slate-400">
                                  <ArrowRight className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                                  <span>{m}</span>
                                </li>
                              ))
                            ) : (
                              <li className="text-sm text-slate-600 dark:text-slate-400">{datosAnalizados.detalle.mecanismosDefensa}</li>
                            )}
                          </ul>
                        </div>
                      </div>

                      {datosAnalizados.detalle.disidente && (
                        <div className="mt-8 p-8 bg-slate-900 rounded-[2rem] text-white shadow-2xl border-l-4 border-amber-500 relative overflow-hidden group">
                          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <AlertTriangle className="w-24 h-24" />
                          </div>
                          <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-6">
                              <AlertTriangle className="w-6 h-6 text-amber-500" />
                              <h5 className="text-xl font-black tracking-tight uppercase">Voces Disidentes y Matices Críticos</h5>
                            </div>
                            <div className="space-y-4">
                              <p className="text-base text-slate-300 italic leading-relaxed font-medium">
                                {datosAnalizados.detalle.disidente}
                              </p>
                              <div className="pt-4 border-t border-slate-800">
                                <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Nota Técnica del Analista AI</p>
                                <p className="text-xs text-slate-400 mt-1">
                                  Esta sección captura los argumentos de miembros que, incluso participando en la unanimidad de la tasa, expresaron desacuerdos fundamentales con el comunicado o la guía prospectiva (ej. Jonathan Heath).
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* TAB FLUJOS */}
                {tabActiva === "flujos" && (
                  <div className="space-y-10 animate-in fade-in slide-in-from-left-4 duration-500">
                    <div className="bg-slate-50 dark:bg-slate-800/20 p-8 rounded-3xl border border-dashed border-slate-200 dark:border-slate-700">
                      <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6 text-center">Ponderación de Factores (AI Assessment)</h4>
                      <div className="space-y-6 max-w-2xl mx-auto">
                        {Array.isArray(datosAnalizados.ponderaciones) ? (
                          datosAnalizados.ponderaciones.map((item, i) => (
                            <div key={i} className="space-y-2">
                              <div className="flex justify-between text-xs font-bold">
                                <span className="text-slate-700 dark:text-slate-300">{item.label}</span>
                                <span className="text-blue-600 font-black">{item.pct}%</span>
                              </div>
                              <div className="h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                <div className={`h-full ${item.color} rounded-full transition-all duration-1000`} style={{ width: `${item.pct}%` }}></div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-center text-xs text-slate-500 italic">No hay datos de ponderación disponibles.</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Botón Consultar Más */}
              <div className="mt-10 pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4">
                <p className="text-[10px] text-slate-500 dark:text-slate-400 italic">
                  * Análisis real generado por OpenAI GPT-4 mediante integración segura de servidor. Los datos reflejan la narrativa de la minuta enviada.
                </p>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter">AI Analysis Active</span>
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Botón para reiniciar */}
      {(datosAnalizados || error) && (
        <div className="flex justify-center">
          <button
            onClick={() => {
              setDatosAnalizados(null);
              setMinutaAnalizada(null);
              setError(null);
            }}
            className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors"
          >
            <Upload className="w-4 h-4" /> Analizar otra minuta real
          </button>
        </div>
      )}
    </div>
  );
}
