"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import MiniSimulator from "@/components/home/MiniSimulator";
import MiniValuacion from "@/components/home/MiniValuacion";
import MiniSimulatorSeguros from "@/components/home/MiniSimulatorSeguros";
import AuthModal from "@/components/home/AuthModal";

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const handleProbarClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (session) {
      router.push("/simulador");
    } else {
      setAuthModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950">
      <section className="relative min-h-[85vh] flex flex-col justify-center bg-gradient-to-br from-[#0f172a] via-[#1e3a5f] to-[#1d3557] text-white overflow-hidden py-16">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(59,130,246,0.15),transparent)]" aria-hidden />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0f172a]/80 to-transparent" aria-hidden />

        <div className="relative z-10 max-w-7xl mx-auto px-4 w-full grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">

          <div className="text-left max-w-2xl mx-auto lg:mx-0">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-300 text-sm font-semibold mb-8 backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              Plataforma AI y Simuladores
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-white mb-6 leading-[1.1]">
              Domina la <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Ciencia Económica</span> con IA.
            </h1>

            <p className="text-slate-300 text-lg md:text-xl mb-10 max-w-xl leading-relaxed">
              La terminal de análisis definitivo para <span className="text-white font-bold">Economistas y Actuarios</span>. Modela equilibrios de mercado, analiza minutas de Banxico con IA y proyecta valuaciones bursátiles en segundos.
            </p>

            <ul className="space-y-4 text-slate-300 mb-10 font-medium">
              <li className="flex items-center gap-3">
                <div className="p-1 rounded-full bg-emerald-500/20 text-emerald-400">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                </div>
                Modelos IS-LM, Seguros y Matemáticas Financieras
              </li>
              <li className="flex items-center gap-3">
                <div className="p-1 rounded-full bg-emerald-500/20 text-emerald-400">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                </div>
                Exportación Profesional a PDF
              </li>
              <li className="flex items-center gap-3">
                <div className="p-1 rounded-full bg-emerald-500/20 text-emerald-400">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                </div>
                Persistencia de Sesiones y Dashboard
              </li>
            </ul>

            <button
              onClick={handleProbarClick}
              className="group inline-flex items-center justify-center px-8 py-4 text-xl font-bold tracking-wide rounded-2xl bg-amber-400 text-slate-900 shadow-[0_0_40px_-10px_rgba(251,191,36,0.6)] hover:bg-amber-300 hover:shadow-[0_0_60px_-15px_rgba(251,191,36,0.8)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
            >
              Comenzar a Analizar
              <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </button>
          </div>

          <div className="w-full max-w-md mx-auto lg:ml-auto relative mt-12 lg:mt-0 lg:scale-[1.05] transform origin-right">
            <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full" />
            <div className="relative space-y-6 max-h-[85vh] overflow-y-auto no-scrollbar pb-10 pr-2">
              <MiniSimulator />
              <MiniValuacion />
              <MiniSimulatorSeguros />
            </div>
          </div>

        </div>
      </section>

      {/* Secciones adicionales (Features / Cursos) */}
      <section className="py-20 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Una plataforma integral
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Diseñamos Econosfera no solo para entender la macroeconomía, sino para cubrir todas las ramas cuantitativas y de negocios estratégicos.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Economia */}
            <div className="bg-slate-50 dark:bg-slate-800/50 p-8 rounded-3xl border border-slate-200 dark:border-slate-700/50 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Economía y Política Monetaria</h3>
              <p className="text-slate-600 dark:text-slate-400">
                Analiza las decisiones del banco central, el modelo IS-LM y los multiplicadores keynesianos. Entiende de primera mano el balance de riesgos macroeconómicos y cómo impactan los movimientos de la tasa de referencia en la inflación del país.
              </p>
            </div>

            {/* Actuaria */}
            <div className="bg-slate-50 dark:bg-slate-800/50 p-8 rounded-3xl border border-slate-200 dark:border-slate-700/50 hover:shadow-xl transition-shadow cursor-pointer relative overflow-hidden group">
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Actuaría y Seguros</h3>
              <p className="text-slate-600 dark:text-slate-400">
                Calculadoras actuariales para primas de seguros, análisis de siniestralidad, matemáticas financieras y evaluación de riesgos bajo diferentes perfiles demográficos.
              </p>
              <div className="absolute top-4 right-4 bg-emerald-500/10 text-emerald-500 text-xs font-bold px-2 py-1 rounded-full border border-emerald-500/20">
                Próximamente
              </div>
            </div>

            {/* Administracion & Contabilidad */}
            <div className="bg-slate-50 dark:bg-slate-800/50 p-8 rounded-3xl border border-slate-200 dark:border-slate-700/50 hover:shadow-xl transition-shadow relative cursor-pointer group">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Administración y Contabilidad</h3>
              <p className="text-slate-600 dark:text-slate-400">
                Simula los estados de resultados, balances y estados de flujo de caja. Aprende analizando métricas financieras (EBITDA, ROE, ROA) y rentabilidad corporativa de forma interactiva.
              </p>
              <div className="absolute top-4 right-4 bg-purple-500/10 text-purple-500 text-xs font-bold px-2 py-1 rounded-full border border-purple-500/20">
                Próximamente
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Parallax / Featured Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        {/* Parallax Background Effect */}
        <div
          className="absolute inset-0 z-0 bg-fixed bg-cover bg-center transition-transform hover:scale-110 duration-[3000ms]"
          style={{
            backgroundImage: "linear-gradient(rgba(15, 23, 42, 0.7), rgba(15, 23, 42, 0.7)), url('https://images.unsplash.com/photo-1611974717482-97217830ce12?q=80&w=2670&auto=format&fit=crop')"
          }}
        />

        <div className="relative z-10 text-center px-4 max-w-4xl">
          <h2 className="text-4xl md:text-6xl font-black text-white mb-6 uppercase tracking-tighter">
            Domina los <span className="text-blue-400">Datos Financieros</span>
          </h2>
          <p className="text-xl md:text-2xl text-slate-300 font-medium mb-10">
            Únete a la nueva generación de economistas que usan Inteligencia Artificial para modelar el futuro.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <div className="flex flex-col items-center">
              <span className="text-4xl font-black text-white">+5k</span>
              <span className="text-sm text-slate-400 font-bold uppercase tracking-widest">Simulaciones</span>
            </div>
            <div className="h-12 w-[1px] bg-slate-700 hidden sm:block" />
            <div className="flex flex-col items-center">
              <span className="text-4xl font-black text-white">+20</span>
              <span className="text-sm text-slate-400 font-bold uppercase tracking-widest">Modelos</span>
            </div>
            <div className="h-12 w-[1px] bg-slate-700 hidden sm:block" />
            <div className="flex flex-col items-center">
              <span className="text-4xl font-black text-white">100%</span>
              <span className="text-sm text-slate-400 font-bold uppercase tracking-widest">Digital</span>
            </div>
          </div>
        </div>
      </section>

      {/* Planes de Precificacin (Pricing) */}
      <section className="py-20 bg-slate-50 dark:bg-slate-950/50 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Planes y Precios
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Invierte en tu educación. Empieza gratis o lleva tu análisis al siguiente nivel con nuestras herramientas impulsadas por IA.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Plan Gratuito */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Plan Gratuito</h3>
              <div className="text-4xl font-black text-slate-900 dark:text-white mb-6">
                $0 <span className="text-base font-medium text-slate-500">/mes</span>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                  <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  Modelos Macro y Micro ilimitados
                </li>
                <li className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400 font-bold">
                  <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  2 Análisis de Inteligencia Artificial
                </li>
                <li className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400 font-bold">
                  <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  1 Exportación a PDF gratuito
                </li>
              </ul>
              <button onClick={handleProbarClick} className="w-full py-3 rounded-xl border-2 border-slate-200 dark:border-slate-800 font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                Comenzar Gratis
              </button>
            </div>

            {/* Plan Estudiante (Destacado) */}
            <div className="bg-blue-600 rounded-3xl p-8 border border-blue-500 shadow-xl shadow-blue-900/20 transform md:-translate-y-4 flex flex-col relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-amber-400 text-amber-900 text-xs font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider">
                Más Popular
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Plan Estudiante</h3>
              <div className="text-4xl font-black text-white mb-6">
                $4.99 <span className="text-base font-medium text-blue-200">/mes</span>
              </div>
              <ul className="space-y-4 mb-8 flex-1 text-blue-50">
                <li className="flex items-center gap-3 text-sm">
                  <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  Todo lo del Plan Gratuito
                </li>
                <li className="flex items-center gap-3 text-sm font-bold text-white">
                  <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  10 Análisis de IA (Créditos/mes)
                </li>
                <li className="flex items-center gap-3 text-sm font-bold text-white">
                  <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  Exportaciones a PDF Ilimitadas
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  Soporte prioritario
                </li>
              </ul>
              <button className="w-full py-3 rounded-xl bg-white text-blue-600 font-black hover:bg-blue-50 transition-colors shadow-lg">
                Suscribirme Ahora
              </button>
            </div>

            {/* Plan Pro */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Plan Pro</h3>
              <div className="text-4xl font-black text-slate-900 dark:text-white mb-6">
                $9.99 <span className="text-base font-medium text-slate-500">/mes</span>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                  <svg className="w-5 h-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  Todo lo del Plan Estudiante
                </li>
                <li className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400 font-bold">
                  <svg className="w-5 h-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  Análisis de IA Ilimitados
                </li>
                <li className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                  <svg className="w-5 h-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  Acceso anticipado a Contabilidad
                </li>
                <li className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                  <svg className="w-5 h-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  Módulo de Simulacros/Exámenes
                </li>
              </ul>
              <button className="w-full py-3 rounded-xl border-2 border-purple-500 text-purple-600 dark:text-purple-400 font-bold hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors">
                Obtener Pro
              </button>
            </div>
          </div>
        </div>
      </section>

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
    </div>
  );
}
