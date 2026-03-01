import Link from "next/link";
import { BookOpen, LineChart, FileText, Download } from "lucide-react";
import { getSlugDeTermino } from "@/lib/glosario";

export const metadata = {
    title: "Manual de Usuario | Econosfera",
    description: "Guía completa para utilizar los simuladores de modelos económicos y financieros de Econosfera.",
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
                        Aprende a aprovechar al máximo los simuladores económicos, la Inteligencia Artificial y la generación de reportes profesionales en Econosfera. Consulta el{" "}
                        <Link href="/glosario" className="text-blue-600 dark:text-blue-400 font-medium hover:underline">
                            glosario de términos económicos
                        </Link>{" "}
                        para definiciones de referencia.
                    </p>
                </div>

                {/* Content Section */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 shadow-xl border border-slate-200 dark:border-slate-800 space-y-12">

                    {/* Section 1 */}
                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold flex items-center gap-3 text-slate-800 dark:text-slate-100 mb-6 pb-2 border-b border-slate-100 dark:border-slate-800">
                            <span className="text-blue-500">1.</span> Análisis con IA
                        </h2>
                        <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-300">
                            <p>
                                Econosfera cuenta con un potente motor de Inteligencia Artificial que procesa actas de política monetaria en segundos.
                            </p>
                            <ul className="list-disc pl-5 space-y-2 mt-4">
                                <li>Dirígete a la pestaña <strong>Inflación y política monetaria</strong>.</li>
                                <li>Sube un documento en formato <strong>.PDF o .TXT</strong> de las decisiones del banco central (ej. Banxico).</li>
                                <li>La plataforma identificará posturas "Hawkish" o "Dovish", votos disidentes y el balance de riesgos macroeconómicos automáticamente.</li>
                                <li><strong>Consumo de Créditos:</strong> Cada análisis profundo consume <strong>10 créditos</strong>. Los usuarios gratuitos inician con 10 créditos, mientras que el plan <strong>Estudiante Pro</strong> otorga 50 mensuales y el <strong>Researcher</strong> 100 mensuales.</li>
                            </ul>
                        </div>
                    </section>

                    {/* Section 2 */}
                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold flex items-center gap-3 text-slate-800 dark:text-slate-100 mb-6 pb-2 border-b border-slate-100 dark:border-slate-800">
                            <span className="text-blue-500">2.</span> Simuladores y Modelos Principales
                        </h2>
                        <div className="grid sm:grid-cols-2 gap-6 mt-4">
                            <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-2xl border border-slate-200 dark:border-slate-700">
                                <LineChart className="w-6 h-6 text-emerald-500 mb-3" />
                                <h3 className="font-bold text-lg mb-2">Macroeconomía</h3>
                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                    Modelo IS-LM, Curva de Phillips y la{" "}
                                    {slugReglaTaylor ? (
                                        <Link href={`/glosario/${slugReglaTaylor}`} className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                                            Regla de Taylor
                                        </Link>
                                    ) : (
                                        "Regla de Taylor"
                                    )}{" "}
                                    para el análisis de inflación, política fiscal y monetaria.
                                </p>
                            </div>
                            <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-2xl border border-slate-200 dark:border-slate-700">
                                <LineChart className="w-6 h-6 text-amber-500 mb-3" />
                                <h3 className="font-bold text-lg mb-2">Microeconomía</h3>
                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                    Curvas de Oferta/Demanda, precio equilibrio, excedentes y cálculo automático de elasticidades precio-demanda.
                                </p>
                            </div>
                            <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-2xl border border-slate-200 dark:border-slate-700">
                                <LineChart className="w-6 h-6 text-blue-500 mb-3" />
                                <h3 className="font-bold text-lg mb-2">Finanzas Cuantitativas <span className="ml-2 text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">Pro</span></h3>
                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                    Modelos profesionales de valuación{" "}
                                    {slugDCF ? (
                                        <Link href={`/glosario/${slugDCF}`} className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                                            DCF
                                        </Link>
                                    ) : (
                                        "DCF"
                                    )}{" "}
                                    (Flujos Descontados), Gordon-Shapiro y Black-Scholes para opciones financieras algorítmicas.
                                </p>
                            </div>
                            <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-2xl border border-slate-200 dark:border-slate-700">
                                <LineChart className="w-6 h-6 text-purple-500 mb-3" />
                                <h3 className="font-bold text-lg mb-2">Economía Blockchain <span className="ml-2 text-[10px] bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">Full</span></h3>
                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                    Herramientas de criptografía: Hashes, simuladores de Árboles de Merkle, redes P2P Gossip y demostraciones de ataques a Smart Contracts.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Section 3 */}
                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold flex items-center gap-3 text-slate-800 dark:text-slate-100 mb-6 pb-2 border-b border-slate-100 dark:border-slate-800">
                            <span className="text-blue-500">3.</span> Persistencia (Espacio de Trabajo)
                        </h2>
                        <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-300">
                            <p>
                                Para profesionales y estudiantes que requieran retomar su investigación, la plataforma te permite configurar un espacio de trabajo continuo.
                            </p>
                            <ul className="list-disc pl-5 space-y-2 mt-4">
                                <li>Al estar registrado, cada simulador activará un botón de <strong>Guardar Escenario</strong>.</li>
                                <li>Los escenarios se almacenan en tu <strong>Dashboard ("Mis Cálculos")</strong>.</li>
                                <li>Al cargar un escenario, la plataforma restaurará parámetros numéricos, sliders y los últimos reportes generados por la IA en esa sesión.</li>
                            </ul>
                        </div>
                    </section>

                    {/* Section 4 */}
                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold flex items-center gap-3 text-slate-800 dark:text-slate-100 mb-6 pb-2 border-b border-slate-100 dark:border-slate-800">
                            <span className="text-blue-500">4.</span> Reportes Ejecutivos (PDF)
                        </h2>
                        <div className="bg-slate-900 border border-slate-700 text-white p-6 rounded-2xl flex items-start gap-4 flex-col sm:flex-row">
                            <FileText className="w-8 h-8 text-blue-400 flex-shrink-0" />
                            <div>
                                <h3 className="font-bold text-lg mb-2">Exportación Profesional</h3>
                                <p className="text-sm text-slate-300 leading-relaxed mb-4">
                                    Cualquier escenario activo en Macro, Micro, Finanzas y Minutas puede exportarse a formato PDF. Los documentos generados están formateados bajo estándares profesionales, incluyendo:
                                </p>
                                <ul className="list-disc pl-5 text-sm space-y-1 text-slate-300 mb-4">
                                    <li>Tablas de sensibilidad / Stress Testing.</li>
                                    <li>Gráficos vectoriales y capturas de equilibrio.</li>
                                    <li>
                                        <Link href="/glosario" className="text-blue-400 hover:underline font-medium">
                                            Glosarios
                                        </Link>{" "}
                                        y descripciones técnicas para directivos.
                                    </li>
                                </ul>
                                <div className="flex items-center gap-2 text-sm font-bold text-amber-400">
                                    <Download className="w-4 h-4" /> Busca el botón oscuro "Descargar Reporte PDF"
                                </div>
                            </div>
                        </div>
                    </section>

                </div>

                {/* Call to action */}
                <div className="text-center pt-8">
                    <Link
                        href="/simulador"
                        className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold tracking-wide rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/30 hover:bg-blue-500 hover:scale-[1.02] active:scale-[0.98] transition-all"
                    >
                        Ir a los Simuladores
                    </Link>
                </div>

            </div>
        </div>
    );
}
