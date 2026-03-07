import Link from "next/link";
import { BookOpen, LineChart, FileText, Download, Brain, Calculator, BarChart2, Shield, TrendingUp, Link2, Newspaper, FileDown } from "lucide-react";
import { getSlugDeTermino } from "@/lib/glosario";

export const metadata = {
    title: "Manual de Usuario | Econosfera",
    description: "Guía completa para utilizar los simuladores de modelos económicos y financieros, el glosario, el blog y las herramientas de exportación e IA de Econosfera.",
};

export default function ManualPage() {
    const slugReglaTaylor = getSlugDeTermino("Regla de Taylor");
    const slugDCF = getSlugDeTermino("DCF");

    return (
        <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-white py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-12">

                {/* Header */}
                <div className="text-center space-y-4">
                    <div className="inline-flex justify-center items-center p-3 sm:p-4 rounded-2xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mb-2">
                        <BookOpen className="w-8 h-8 sm:w-10 sm:h-10" />
                    </div>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight">Manual de Usuario</h1>
                    <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto text-lg">
                        Aprende a aprovechar al máximo los simuladores económicos, la Inteligencia Artificial, el glosario, el blog y la generación de reportes profesionales en Econosfera. Consulta el{" "}
                        <Link href="/glosario" className="text-blue-600 dark:text-blue-400 font-medium hover:underline">
                            glosario de términos económicos
                        </Link>{" "}
                        para definiciones de referencia.
                    </p>
                </div>

                {/* Content Section */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 shadow-xl border border-slate-200 dark:border-slate-800 space-y-12">

                    {/* Section 1: Análisis con IA */}
                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold flex items-center gap-3 text-slate-800 dark:text-slate-100 mb-6 pb-2 border-b border-slate-100 dark:border-slate-800">
                            <Brain className="w-6 h-6 text-blue-500" />
                            1. Análisis con Inteligencia Artificial
                        </h2>
                        <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-300">
                            <p>
                                Econosfera incluye un motor de IA que procesa actas de política monetaria en segundos y genera reportes ejecutivos.
                            </p>
                            <ul className="list-disc pl-5 space-y-2 mt-4">
                                <li>Ve al módulo <strong>Teoría monetaria</strong> y abre la pestaña <strong>Análisis AI Minutas</strong>.</li>
                                <li>Sube un documento en <strong>PDF o TXT</strong> (por ejemplo, minutas de Banxico).</li>
                                <li>La plataforma identifica posturas <em>hawkish</em> o <em>dovish</em>, votos disidentes y el balance de riesgos macroeconómicos.</li>
                                <li><strong>Créditos:</strong> Todas las exportaciones consumen 1 crédito. Free: 10 créditos. Pro: 50 créditos/mes. Solo <strong>Researcher</strong> tiene exportaciones ilimitadas (sin consumir créditos) y análisis de minutas Banxico con IA (200 créditos/mes).</li>
                                <li>Puedes descargar el análisis en PDF desde el mismo panel (botón &quot;Descargar Reporte PDF&quot;).</li>
                            </ul>
                        </div>
                    </section>

                    {/* Section 2: Simuladores completos por módulo */}
                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold flex items-center gap-3 text-slate-800 dark:text-slate-100 mb-6 pb-2 border-b border-slate-100 dark:border-slate-800">
                            <LineChart className="w-6 h-6 text-blue-500" />
                            2. Simuladores y Herramientas por Módulo
                        </h2>
                        <p className="text-slate-600 dark:text-slate-300 mb-6">
                            Desde el menú principal del simulador puedes elegir el módulo. Dentro de cada uno hay pestañas con herramientas específicas. Aquí se listan todas.
                        </p>

                        {/* Inflación */}
                        <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
                            <h3 className="font-bold text-lg flex items-center gap-2 text-slate-800 dark:text-slate-100">
                                <Calculator className="w-5 h-5 text-amber-500" />
                                Inflación
                            </h3>
                            <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1 list-disc pl-5">
                                <li><strong>Tasa real vs nominal:</strong> ecuación de Fisher, tasa real ex ante / ex post.</li>
                                <li><strong>Poder adquisitivo:</strong> cómo la inflación erosiona el valor del dinero en el tiempo.</li>
                                <li><strong>Comparar escenarios:</strong> comparativa de sensibilidad entre dos conjuntos de parámetros de inflación.</li>
                            </ul>
                        </div>

                        {/* Teoría monetaria */}
                        <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
                            <h3 className="font-bold text-lg flex items-center gap-2 text-slate-800 dark:text-slate-100">
                                <Calculator className="w-5 h-5 text-indigo-500" />
                                Teoría monetaria
                            </h3>
                            <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1 list-disc pl-5">
                                <li><strong>Simulador Core:</strong> variables macro, choques de oferta/demanda, transmisión a inflación y tasa.</li>
                                <li><strong>Regla de Taylor:</strong> resolución numérica de la{" "}
                                    {slugReglaTaylor ? <Link href={`/glosario/${slugReglaTaylor}`} className="text-blue-600 dark:text-blue-400 hover:underline">Regla de Taylor</Link> : "Regla de Taylor"}.</li>
                                <li><strong>Análisis AI Minutas:</strong> subida de PDF/TXT de actas de Banxico; análisis semántico y exportación a PDF.</li>
                            </ul>
                        </div>

                        {/* Macro */}
                        <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
                            <h3 className="font-bold text-lg flex items-center gap-2 text-slate-800 dark:text-slate-100">
                                <BarChart2 className="w-5 h-5 text-emerald-500" />
                                Macroeconomía
                            </h3>
                            <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1 list-disc pl-5">
                                <li><strong>Multiplicador keynesiano:</strong> consumo autónomo, propensión marginal, inversión, gasto público, impuestos; equilibrio y gráfico.</li>
                                <li><strong>IS-LM:</strong> modelo completo con oferta de dinero, sensibilidad inversión-tasa y demanda de dinero.</li>
                                <li><strong>Solow:</strong> crecimiento de largo plazo, capital, trabajo y productividad.</li>
                                <li><strong>Curva de Phillips:</strong> relación inflación–desempleo.</li>
                                <li><strong>Mundell-Fleming (IS-LM-BP):</strong> economía abierta y tipo de cambio.</li>
                            </ul>
                        </div>

                        {/* Micro */}
                        <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
                            <h3 className="font-bold text-lg flex items-center gap-2 text-slate-800 dark:text-slate-100">
                                <TrendingUp className="w-5 h-5 text-amber-500" />
                                Microeconomía
                            </h3>
                            <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1 list-disc pl-5">
                                <li><strong>Oferta y demanda:</strong> curvas lineales, precio y cantidad de equilibrio, excedentes.</li>
                                <li><strong>Estructuras de mercado:</strong> competencia, monopolio, oligopolio.</li>
                                <li><strong>Teoría de juegos:</strong> matrices de pagos y estrategias.</li>
                                <li><strong>Elasticidad:</strong> elasticidad arco precio-demanda y sensibilidad.</li>
                            </ul>
                        </div>

                        {/* Finanzas */}
                        <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
                            <h3 className="font-bold text-lg flex items-center gap-2 text-slate-800 dark:text-slate-100">
                                <BarChart2 className="w-5 h-5 text-blue-500" />
                                Finanzas y mercados de capital
                                <span className="text-[10px] bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 px-2 py-0.5 rounded-full">Pro/Full</span>
                            </h3>
                            <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1 list-disc pl-5">
                                <li><strong>Básico:</strong> VP/VF, amortización, bonos, CETES, planes de ahorro.</li>
                                <li><strong>Valuación:</strong> valuación por múltiplos,{" "}
                                    {slugDCF ? <Link href={`/glosario/${slugDCF}`} className="text-blue-600 dark:text-blue-400 hover:underline">DCF</Link> : "DCF"}, VPN/TIR, WACC.</li>
                                <li><strong>Portafolios y derivados:</strong> Markowitz, portafolio 2 activos, Black-Scholes, curva de rendimientos, forwards, punto de equilibrio.</li>
                                <li><strong>Estructura y flujos:</strong> flujo del sistema financiero, mapa de instrumentos, mapa de estructura de capital.</li>
                            </ul>
                        </div>

                        {/* Actuaría */}
                        <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
                            <h3 className="font-bold text-lg flex items-center gap-2 text-slate-800 dark:text-slate-100">
                                <Shield className="w-5 h-5 text-rose-500" />
                                Actuaría y riesgos
                            </h3>
                            <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1 list-disc pl-5">
                                <li><strong>Tablas de mortalidad:</strong> proyección de supervivencia y pensiones.</li>
                                <li><strong>Modelo de ruina:</strong> probabilidad de ruina a largo plazo.</li>
                                <li><strong>Poder adquisitivo:</strong> impacto de la inflación sobre el ahorro real.</li>
                            </ul>
                        </div>

                        {/* Estadística */}
                        <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
                            <h3 className="font-bold text-lg flex items-center gap-2 text-slate-800 dark:text-slate-100">
                                <TrendingUp className="w-5 h-5 text-indigo-500" />
                                Estadística y econometría
                            </h3>
                            <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1 list-disc pl-5">
                                <li><strong>Regresión lineal:</strong> MCO, intervalos de confianza, diagnóstico.</li>
                                <li><strong>Teorema del Límite Central (TLC):</strong> simulaciones y convergencia a la normal.</li>
                            </ul>
                        </div>

                        {/* Blockchain */}
                        <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
                            <h3 className="font-bold text-lg flex items-center gap-2 text-slate-800 dark:text-slate-100">
                                <Link2 className="w-5 h-5 text-violet-500" />
                                Economía blockchain
                                <span className="text-[10px] bg-violet-100 dark:bg-violet-900/50 text-violet-800 dark:text-violet-300 px-2 py-0.5 rounded-full">Full</span>
                            </h3>
                            <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1 list-disc pl-5">
                                <li><strong>Emisión (Halving):</strong> recompensa por bloque, supply máxima, stock-to-flow.</li>
                                <li><strong>Trading activo:</strong> simulación de trading y reporte PDF.</li>
                                <li><strong>Staking y yield farming:</strong> rendimientos y exportación.</li>
                                <li><strong>Market makers / AMM:</strong> liquidez y curvas.</li>
                                <li><strong>Hash &amp; blockchain:</strong> cadena de bloques y hashes.</li>
                                <li><strong>Wallets &amp; firmas:</strong> llaves y firmas digitales.</li>
                                <li><strong>Árboles Merkle:</strong> pruebas de inclusión y verificación.</li>
                                <li><strong>PoW vs PoS:</strong> consenso y seguridad.</li>
                                <li><strong>Redes P2P:</strong> gossip y propagación.</li>
                                <li><strong>Hacking contracts:</strong> vulnerabilidades en smart contracts.</li>
                            </ul>
                        </div>
                    </section>

                    {/* Section 3: Glosario */}
                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold flex items-center gap-3 text-slate-800 dark:text-slate-100 mb-6 pb-2 border-b border-slate-100 dark:border-slate-800">
                            <BookOpen className="w-6 h-6 text-blue-500" />
                            3. Glosario de Términos Económicos
                        </h2>
                        <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-300">
                            <p>
                                El glosario es un diccionario de referencia con definiciones de conceptos usados en los simuladores y en la literatura económica. No requiere cuenta para consultarlo.
                            </p>
                            <ul className="list-disc pl-5 space-y-2 mt-4">
                                <li><strong>Ordenación:</strong> Los términos se muestran agrupados por letra inicial (A–Z), en estilo diccionario.</li>
                                <li><strong>Categorías:</strong> Puedes filtrar por Inflación, Macro, Micro, Finanzas, Blockchain, Actuaría, Estadística, General o Teorías y Nobel.</li>
                                <li><strong>Búsqueda:</strong> Usa el campo de búsqueda para encontrar un concepto por nombre.</li>
                                <li><strong>Teorías y Nobel:</strong> Incluye una línea de tiempo de teorías económicas y premios Nobel relacionados.</li>
                            </ul>
                            <p className="mt-4">
                                <Link href="/glosario" className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 font-medium hover:underline">
                                    Ir al Glosario
                                </Link>
                            </p>
                        </div>
                    </section>

                    {/* Section 4: Blog */}
                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold flex items-center gap-3 text-slate-800 dark:text-slate-100 mb-6 pb-2 border-b border-slate-100 dark:border-slate-800">
                            <Newspaper className="w-6 h-6 text-blue-500" />
                            4. Blog (Contenido Premium)
                        </h2>
                        <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-300">
                            <p>
                                El blog de Econosfera publica artículos sobre política monetaria, macroeconomía, microeconomía, finanzas, mercados, metodología y datos. Está dirigido a estudiantes y profesionales de la economía.
                            </p>
                            <ul className="list-disc pl-5 space-y-2 mt-4">
                                <li><strong>Acceso:</strong> El contenido completo del blog es <strong>premium</strong>. Necesitas plan <strong>Estudiante Pro</strong> o <strong>Researcher</strong> para leer los artículos sin restricción.</li>
                                <li>Desde el listado puedes ver título, extracto y categoría; al entrar en un artículo se aplica el paywall si no tienes plan premium.</li>
                            </ul>
                            <p className="mt-4">
                                <Link href="/blog" className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 font-medium hover:underline">
                                    Ir al Blog
                                </Link>
                            </p>
                        </div>
                    </section>

                    {/* Section 5: Herramientas de exportación */}
                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold flex items-center gap-3 text-slate-800 dark:text-slate-100 mb-6 pb-2 border-b border-slate-100 dark:border-slate-800">
                            <FileDown className="w-6 h-6 text-blue-500" />
                            5. Herramientas de Exportación (PDF)
                        </h2>
                        <div className="bg-slate-900 border border-slate-700 text-white p-6 rounded-2xl flex items-start gap-4 flex-col sm:flex-row">
                            <FileText className="w-8 h-8 text-blue-400 flex-shrink-0" />
                            <div>
                                <h3 className="font-bold text-lg mb-2">Qué se puede exportar</h3>
                                <p className="text-sm text-slate-300 leading-relaxed mb-4">
                                    Casi todos los módulos y herramientas permiten descargar un reporte en PDF. Las exportaciones consumen créditos (generalmente 1 por descarga). Busca el botón &quot;Reporte PDF&quot; o &quot;Descargar Reporte PDF&quot; en cada pantalla.
                                </p>
                                <ul className="list-disc pl-5 text-sm space-y-1 text-slate-300 mb-4">
                                    <li><strong>Inflación:</strong> Reporte del escenario activo (variables, resultados, gráfico y, si aplica, análisis de minuta). Comparador de escenarios y reportes Taylor / Tasa real vs nominal.</li>
                                    <li><strong>Macro:</strong> Multiplicador keynesiano e IS-LM (tablas, resultados y gráficos). Curva de Phillips.</li>
                                    <li><strong>Micro:</strong> Mercado, elasticidad y resultados del módulo.</li>
                                    <li><strong>Finanzas:</strong> VP/VF, amortización, bonos, CETES, ahorro, DCF, VPN/TIR, WACC, Markowitz, portafolio, Black-Scholes, curva de rendimientos, forwards, break-even.</li>
                                    <li><strong>Blockchain:</strong> Halving, trading, staking, AMM y demás simuladores del módulo.</li>
                                    <li><strong>Actuaría:</strong> Mortalidad, ruina, poder adquisitivo.</li>
                                    <li><strong>Estadística:</strong> Regresión lineal y Teorema del Límite Central.</li>
                                    <li><strong>Minutas:</strong> Desde la pestaña Análisis AI Minutas, el reporte del análisis de la minuta subida (decisión, veredicto, insights, detalle).</li>
                                </ul>
                                <div className="flex items-center gap-2 text-sm font-bold text-amber-400">
                                    <Download className="w-4 h-4" /> Busca el botón &quot;Reporte PDF&quot; o &quot;Descargar Reporte PDF&quot; en cada módulo
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Section 6: Persistencia */}
                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold flex items-center gap-3 text-slate-800 dark:text-slate-100 mb-6 pb-2 border-b border-slate-100 dark:border-slate-800">
                            <span className="text-blue-500">6.</span> Persistencia (Espacio de Trabajo)
                        </h2>
                        <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-300">
                            <p>
                                Si tienes cuenta, puedes guardar escenarios y retomarlos más tarde.
                            </p>
                            <ul className="list-disc pl-5 space-y-2 mt-4">
                                <li>En cada simulador aparece el botón <strong>Guardar</strong> (o &quot;Guardar Escenario&quot;) cuando estás registrado.</li>
                                <li>Los escenarios se listan en tu <strong>Dashboard</strong> (&quot;Mis Cálculos&quot;).</li>
                                <li>Al cargar un escenario se restauran parámetros, sliders y, cuando aplica, los datos del último análisis de IA de esa sesión.</li>
                            </ul>
                        </div>
                    </section>

                </div>

                {/* Call to action */}
                <div className="text-center pt-8 space-y-4">
                    <Link
                        href="/simulador"
                        className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold tracking-wide rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/30 hover:bg-blue-500 hover:scale-[1.02] active:scale-[0.98] transition-all"
                    >
                        Ir a los Simuladores
                    </Link>
                    <div className="flex flex-wrap justify-center gap-4 text-sm">
                        <Link href="/glosario" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400">Glosario</Link>
                        <Link href="/blog" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400">Blog</Link>
                    </div>
                </div>

            </div>
        </div>
    );
}
