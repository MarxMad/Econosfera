"use client";

import { useState } from "react";
import { Calculator, BookOpen, Target, Activity, TrendingUp } from "lucide-react";

export default function TaylorSolver() {
    const [mode, setMode] = useState<"tasa" | "meta" | "brecha">("tasa");

    // Variables base
    const [inflacionActual, setInflacionActual] = useState(4.5);
    const [metaInflacion, setMetaInflacion] = useState(3.0);
    const [brechaProducto, setBrechaProducto] = useState(1.0); // %
    const [tasaRealNeutral, setTasaRealNeutral] = useState(2.0); // r*
    const [alpha, setAlpha] = useState(0.5);
    const [beta, setBeta] = useState(0.5);
    const [tasaObjetivo, setTasaObjetivo] = useState(7.0);

    const brechaInflacion = inflacionActual - metaInflacion;

    // Calcular la Tasa Taylor: i = r* + π + α(π - π*) + β(y - y*)
    const calcularTasa = () => {
        return tasaRealNeutral + inflacionActual + (alpha * brechaInflacion) + (beta * brechaProducto);
    };

    // Calcular la Meta de Inflación asumiendo que conocemos la Tasa Objetivo (de Taylor)
    // i = r* + π + α(π - π*) + β(y) -> i = r* + π + απ - απ* + βy
    // απ* = r* + π + απ + βy - i
    // π* = (r* + π + απ + βy - i) / α
    const calcularMeta = () => {
        if (alpha === 0) return 0;
        return (tasaRealNeutral + inflacionActual + (alpha * inflacionActual) + (beta * brechaProducto) - tasaObjetivo) / alpha;
    };

    // Calcular la Brecha de Producto (sobrecalentamiento)
    // βy = i - r* - π - α(π - π*)
    const calcularBrecha = () => {
        if (beta === 0) return 0;
        return (tasaObjetivo - tasaRealNeutral - inflacionActual - (alpha * brechaInflacion)) / beta;
    };

    return (
        <div className="space-y-6">
            <div className="rounded-2xl border border-blue-200 dark:border-blue-900 bg-blue-50/50 dark:bg-blue-900/10 p-6">
                <h3 className="text-xl font-bold flex items-center gap-2 mb-3 text-blue-800 dark:text-blue-300">
                    <BookOpen className="w-5 h-5" />
                    ¿Qué es la Regla de Taylor y por qué importa?
                </h3>
                <div className="space-y-4 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                    <p>
                        Diseñada por John B. Taylor en 1993, esta ecuación es la "brújula" dorada de los economistas y bancos centrales (como la FED o Banxico). Sirve para calcular la <strong>Tasa de Interés Óptima</strong> que la economía necesita para mantener un balance saludable.
                    </p>
                    <p>
                        Los economistas calculan esto todos los días porque si la inflación sube, no basta con subir las tasas un poquito; deben subirlas lo suficiente para que la tasa <i>real</i> aumente y enfríe la economía (esto se llama "Principio de Taylor").
                    </p>
                    <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 font-mono text-center overflow-x-auto text-xs sm:text-sm">
                        i = r* + π + α(π - π*) + β(y)
                    </div>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li><strong>i (Tasa Objetivo):</strong> Lo que debería cobrar el Banco Central.</li>
                        <li><strong>r* (Tasa Real Neutral):</strong> La tasa natural que no estimula ni frena la economía (suele ser ~2%).</li>
                        <li><strong>π (Inflación Actual):</strong> Nivel general de precios actual.</li>
                        <li><strong>π* (Meta de Inflación):</strong> El objetivo oficial (usualmente 2% o 3%).</li>
                        <li><strong>y (Brecha de Producto):</strong> Diferencia entre lo que el país produce y lo que <i>podría</i> producir (PIB Potencial).</li>
                        <li><strong>α y β (Sensibilidad):</strong> Qué tan agresivo es el banco atacando inflación vs desempleo.</li>
                    </ul>
                </div>
            </div>

            <div className="grid lg:grid-cols-12 gap-6">
                <div className="lg:col-span-5 space-y-4">
                    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 p-6 shadow-sm">
                        <h4 className="font-bold flex items-center gap-2 mb-4">
                            <Calculator className="w-5 h-5 text-emerald-500" />
                            Solucionador Algebraico
                        </h4>
                        <label className="block text-sm font-semibold mb-2">Despejar ecuación para encontrar:</label>
                        <select
                            value={mode}
                            onChange={(e) => setMode(e.target.value as any)}
                            className="w-full bg-slate-100 dark:bg-slate-900 border-none rounded-xl p-3 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                            <option value="tasa">Tasa de Interés Óptima (i)</option>
                            <option value="meta">Meta de Inflación Implícita (π*)</option>
                            <option value="brecha">Brecha de Producto Implícita (y)</option>
                        </select>
                    </div>

                    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 p-6 shadow-sm space-y-4">
                        <h4 className="font-bold text-sm text-slate-500 uppercase tracking-wider mb-2">Variables Conocidas</h4>

                        {mode !== "tasa" && (
                            <div>
                                <label className="text-xs font-semibold">Tasa de Política Actual (i): <span className="text-blue-500">{tasaObjetivo}%</span></label>
                                <input type="range" min={-2} max={15} step={0.25} value={tasaObjetivo} onChange={(e) => setTasaObjetivo(Number(e.target.value))} className="w-full mt-1 accent-blue-500" />
                            </div>
                        )}

                        <div>
                            <label className="text-xs font-semibold">Inflación Actual (π): <span className="text-rose-500">{inflacionActual}%</span></label>
                            <input type="range" min={0} max={15} step={0.1} value={inflacionActual} onChange={(e) => setInflacionActual(Number(e.target.value))} className="w-full mt-1 accent-rose-500" />
                        </div>

                        {mode !== "meta" && (
                            <div>
                                <label className="text-xs font-semibold">Meta de Inflación (π*): <span className="text-emerald-500">{metaInflacion}%</span></label>
                                <input type="range" min={1} max={6} step={0.1} value={metaInflacion} onChange={(e) => setMetaInflacion(Number(e.target.value))} className="w-full mt-1 accent-emerald-500" />
                            </div>
                        )}

                        {mode !== "brecha" && (
                            <div>
                                <label className="text-xs font-semibold">Brecha de Producto (y): <span className="text-amber-500">{brechaProducto > 0 ? "+" : ""}{brechaProducto}%</span></label>
                                <input type="range" min={-5} max={5} step={0.1} value={brechaProducto} onChange={(e) => setBrechaProducto(Number(e.target.value))} className="w-full mt-1 accent-amber-500" />
                            </div>
                        )}

                        <div>
                            <label className="text-xs font-semibold">Tasa Real Neutral (r*): <span className="text-slate-500">{tasaRealNeutral}%</span></label>
                            <input type="range" min={-1} max={5} step={0.1} value={tasaRealNeutral} onChange={(e) => setTasaRealNeutral(Number(e.target.value))} className="w-full mt-1 accent-slate-500" />
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-7">
                    <div className="h-full rounded-2xl border-2 border-dashed border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-900/10 p-8 flex flex-col justify-center gap-8 relative overflow-hidden">
                        <div className="absolute -right-10 -top-10 w-40 h-40 bg-emerald-500/10 blur-3xl rounded-full" />

                        {mode === "tasa" && (
                            <>
                                <div className="text-center relative z-10">
                                    <p className="text-sm font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-2 flex items-center justify-center gap-2">
                                        <Activity className="w-4 h-4" /> Tasa de Referencia Sugerida
                                    </p>
                                    <p className="text-6xl md:text-8xl font-black font-mono text-slate-800 dark:text-white drop-shadow-sm">
                                        {calcularTasa().toFixed(2)}%
                                    </p>
                                </div>
                                <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm shadow-xl relative z-10">
                                    <p className="mb-2"><strong>Desglose de la ecuación:</strong></p>
                                    <p className="font-mono text-xs opacity-80 break-words">
                                        i = {tasaRealNeutral} + {inflacionActual} + {alpha}({inflacionActual} - {metaInflacion}) + {beta}({brechaProducto})
                                    </p>
                                    <p className="font-mono text-xs text-blue-500 mt-2 font-bold break-words">
                                        i = {tasaRealNeutral} + {inflacionActual} + {(alpha * brechaInflacion).toFixed(2)} + {(beta * brechaProducto).toFixed(2)} = {calcularTasa().toFixed(2)}
                                    </p>
                                </div>
                            </>
                        )}

                        {mode === "meta" && (
                            <>
                                <div className="text-center relative z-10">
                                    <p className="text-sm font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-2 flex items-center justify-center gap-2">
                                        <Target className="w-4 h-4" /> Meta de Inflación Implícita
                                    </p>
                                    <p className="text-6xl md:text-8xl font-black font-mono text-slate-800 dark:text-white drop-shadow-sm">
                                        {calcularMeta().toFixed(2)}%
                                    </p>
                                </div>
                                <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 text-sm shadow-xl relative z-10">
                                    <p className="opacity-80">
                                        Si el Banco Central mantiene la tasa en <strong>{tasaObjetivo}%</strong> dada la inflación actual y el PIB, matemáticamente están actuando como si su meta secreta de inflación fuera {calcularMeta().toFixed(1)}%. ¡Los mercados leen esto para apostar contra él!
                                    </p>
                                </div>
                            </>
                        )}

                        {mode === "brecha" && (
                            <>
                                <div className="text-center relative z-10">
                                    <p className="text-sm font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-2 flex items-center justify-center gap-2">
                                        <TrendingUp className="w-4 h-4" /> Brecha de Producto Implícita
                                    </p>
                                    <p className="text-6xl md:text-8xl font-black font-mono text-slate-800 dark:text-white drop-shadow-sm">
                                        {calcularBrecha().toFixed(2)}%
                                    </p>
                                </div>
                                <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 text-sm shadow-xl relative z-10">
                                    <p className="opacity-80">
                                        Dado que la tasa está en {tasaObjetivo}%, el mercado asume que el banco estima un {calcularBrecha() > 0 ? "sobrecalentamiento" : "estancamiento"} económico del {Math.abs(calcularBrecha()).toFixed(1)}% respecto a su potencial.
                                    </p>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
