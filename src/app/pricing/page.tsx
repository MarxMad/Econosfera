"use client";

import { Check, Zap, Star, Shield, HelpCircle, CreditCard } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useState } from "react";

const tiers = [
    {
        name: "Gratuito",
        price: "$0",
        description: "Para estudiantes que empiezan su camino en la economía.",
        features: [
            "10 créditos para exportar análisis y escenarios",
            "Modelos macro y micro básicos",
            "Simulador de Minado básico (Blockchain)",
            "Sin análisis de minutas con IA",
            "Soporte por comunidad"
        ],
        buttonText: "Actual",
        buttonHref: "#",
        mostPopular: false,
        highlight: false,
    },
    {
        name: "Estudiante Pro",
        price: "MXN 99",
        description: "Análisis avanzado para trabajos universitarios y tesis.",
        features: [
            "Exportaciones PDF ilimitadas (sin consumir créditos)",
            "Simuladores: Markowitz, VPN/TIR, WACC, Phillips",
            "Blockchain: Merkle, Llaves, P2P, Consenso, Smart Contracts",
            "50 Créditos IA/mes",
            "Acceso a la academia (Quizzes)",
            "Soporte prioritario"
        ],
        buttonText: "Suscribirse",
        buttonHref: "/checkout?plan=student",
        mostPopular: true,
        highlight: true,
    },
    {
        name: "Investigador / Full",
        price: "MXN 199",
        description: "Para profesionales que requieren todas las herramientas institucionales.",
        features: [
            "200 Créditos IA/mes (el doble que Pro)",
            "Regla de Taylor, DCF, Black-Scholes",
            "Análisis AI de Minutas Banxico",
            "Mundell-Fleming, Teoría de Juegos, AMM",
            "Exportaciones PDF ilimitadas",
            "Soporte prioritario 24/7"
        ],
        buttonText: "Suscribirse",
        buttonHref: "/checkout?plan=researcher",
        mostPopular: false,
        highlight: false,
    }
];

export default function PricingPage() {
    const { data: session } = useSession();
    const [portalLoading, setPortalLoading] = useState(false);

    const handleOpenBillingPortal = async () => {
        setPortalLoading(true);
        try {
            const res = await fetch("/api/stripe/create-portal-session", { method: "POST" });
            const data = await res.json();
            if (res.ok && data.url) window.location.href = data.url;
            else alert(data.error || "No se pudo abrir el portal de facturación.");
        } catch {
            alert("Error al abrir la galería de pago.");
        } finally {
            setPortalLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-20 px-4">
            <div className="max-w-7xl mx-auto text-center mb-16">
                <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">
                    Elige el plan que <span className="text-blue-600">potencie tu análisis</span>
                </h1>
                <p className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
                    Herramientas profesionales diseñadas por economistas para la próxima generación de líderes financieros.
                </p>
                {(session?.user?.plan === "PRO" || session?.user?.plan === "RESEARCHER") && (
                    <div className="mt-6">
                        <button
                            type="button"
                            onClick={handleOpenBillingPortal}
                            disabled={portalLoading}
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
                        >
                            <CreditCard className="w-5 h-5" />
                            {portalLoading ? "Abriendo…" : "Gestionar suscripción y facturación"}
                        </button>
                    </div>
                )}
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
                            <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-2">¿Cómo funcionan los créditos?</h4>
                            <p className="text-sm text-slate-500 dark:text-slate-400">El plan Gratuito incluye 10 créditos para exportar análisis y escenarios (PDF). El plan Pro da 50 créditos IA/mes para análisis de minutas Banxico y exportaciones ilimitadas. El Researcher da 200 créditos IA/mes.</p>
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-2">¿Cuáles simuladores de Blockchain bloquean y en qué plan?</h4>
                            <p className="text-sm text-slate-500 dark:text-slate-400">El Árbol de Merkle es exclusivo del plan <b>Pro</b>. La simulación de ataques a Smart Contracts y de Nodos P2P requieren del plan <b>Researcher / Full</b>. La minería básica es gratuita.</p>
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-2">¿Los modelos de valuación financiera están en el gratuito?</h4>
                            <p className="text-sm text-slate-500 dark:text-slate-400">No, las herramientas profesionales de Wall-Street como los modelos de Flujos Descontados (DCF) y valuación de opciones (Black-Scholes) requieren nivel Estudiante Pro o superior.</p>
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-2">¿Qué pasa si me acabo mis créditos?</h4>
                            <p className="text-sm text-slate-500 dark:text-slate-400">En el plan Gratuito, los 10 créditos se gastan en exportaciones (PDF de análisis y escenarios). Al agotarlos, actualiza a Pro para exportaciones ilimitadas. En Pro/Researcher, los créditos IA se recargan cada mes.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
