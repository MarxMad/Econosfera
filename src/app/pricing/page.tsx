"use client";

import { Check, Zap, Star, Shield, HelpCircle } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";

const tiers = [
    {
        name: "Gratuito",
        price: "$0",
        description: "Para estudiantes que empiezan su camino en la economía.",
        features: [
            "Hasta 3 exportaciones PDF/mes",
            "Modelos macro y micro básicos",
            "Interpretación de gráficas estándar",
            "10 Créditos de IA iniciales",
            "Soporte por comunidad"
        ],
        buttonText: "Actual",
        buttonHref: "#",
        mostPopular: false,
        highlight: false,
    },
    {
        name: "Estudiante Pro",
        price: "$4.99",
        description: "Análisis avanzado para trabajos universitarios y tesis.",
        features: [
            "Exportaciones PDF ilimitadas",
            "Análisis de minutas Banxico con IA",
            "Modelos macro avanzados (IS-LM-BP)",
            "25 Créditos de IA/mes",
            "Acceso a la academia (Quizzes)",
            "Soporte prioritario"
        ],
        buttonText: "Suscribirse",
        buttonHref: "/checkout?plan=student",
        mostPopular: true,
        highlight: true,
    },
    {
        name: "Investigador",
        price: "$12.99",
        description: "Para profesionales que requieren precisión institucional.",
        features: [
            "Todo lo de Estudiante Pro",
            "IA sin límites de créditos",
            "API de datos financieros premium",
            "Reportes ejecutivos automáticos",
            "Personalización de marca en PDF",
            "Consultoría 1-on-1"
        ],
        buttonText: "Contactar Ventas",
        buttonHref: "mailto:pro@econosfera.com",
        mostPopular: false,
        highlight: false,
    }
];

export default function PricingPage() {
    const { data: session } = useSession();

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-20 px-4">
            <div className="max-w-7xl mx-auto text-center mb-16">
                <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">
                    Elige el plan que <span className="text-blue-600">potencie tu análisis</span>
                </h1>
                <p className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
                    Herramientas profesionales diseñadas por economistas para la próxima generación de líderes financieros.
                </p>
            </div>

            <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8 mb-20">
                {tiers.map((tier) => (
                    <div
                        key={tier.name}
                        className={`relative flex flex-col p-8 rounded-3xl border transition-all duration-300 ${tier.highlight
                                ? 'bg-white dark:bg-slate-900 border-blue-500 shadow-2xl shadow-blue-500/10 scale-105 z-10'
                                : 'bg-white/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800'
                            }`}
                    >
                        {tier.mostPopular && (
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
                                Más Popular
                            </div>
                        )}

                        <div className="mb-8">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{tier.name}</h3>
                            <div className="flex items-baseline gap-1 mb-4">
                                <span className="text-4xl font-black text-slate-900 dark:text-white">{tier.price}</span>
                                <span className="text-slate-500 font-medium">/mes</span>
                            </div>
                            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                                {tier.description}
                            </p>
                        </div>

                        <ul className="space-y-4 mb-10 flex-1">
                            {tier.features.map((feature) => (
                                <li key={feature} className="flex items-start gap-3">
                                    <div className={`mt-1 p-0.5 rounded-full ${tier.highlight ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                                        <Check className="w-3.5 h-3.5" />
                                    </div>
                                    <span className="text-sm text-slate-600 dark:text-slate-300 font-medium">{feature}</span>
                                </li>
                            ))}
                        </ul>

                        <Link
                            href={tier.buttonHref}
                            className={`w-full py-4 text-center font-bold rounded-2xl transition-all active:scale-[0.98] ${tier.highlight
                                    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20'
                                    : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                                }`}
                        >
                            {tier.buttonText}
                        </Link>
                    </div>
                ))}
            </div>

            <div className="max-w-4xl mx-auto">
                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 md:p-12">
                    <div className="flex items-center gap-3 mb-8">
                        <HelpCircle className="w-6 h-6 text-blue-500" />
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Preguntas Frecuentes</h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 text-left">
                        <div>
                            <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-2">¿Cómo funcionan los créditos de IA?</h4>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Cada análisis profundo de una minuta (PDF) consume 1 crédito. Los planes Pro incluyen una bolsa mensual que se renueva cada 30 días.</p>
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-2">¿Puedo cancelar en cualquier momento?</h4>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Sí, no hay contratos forzosos. Si cancelas, mantendrás tus beneficios Pro hasta el final de tu periodo de facturación.</p>
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-2">¿Hay descuentos para instituciones?</h4>
                            <p className="text-sm text-slate-500 dark:text-slate-400">¡Claro! Ofrecemos licencias por volumen para departamentos de economía y actuaria de universidades. Contáctanos.</p>
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-2">¿Qué pasa si me acabo mis créditos?</h4>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Puedes comprar paquetes de créditos adicionales (5, 10 o 50) desde tu dashboard sin necesidad de cambiar de plan.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
