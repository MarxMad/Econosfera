"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { TrendingUp, Brain, Link2, FileDown } from "lucide-react";
import MiniSimulator from "@/components/home/MiniSimulator";
import MiniValuacion from "@/components/home/MiniValuacion";
import MiniSimulatorSeguros from "@/components/home/MiniSimulatorSeguros";
import AuthModal from "@/components/home/AuthModal";
import GaleriaSimuladores from "@/components/home/GaleriaSimuladores";
import ComoFunciona from "@/components/home/ComoFunciona";
import TimelineLanding from "@/components/home/TimelineLanding";

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [unamLogoError, setUnamLogoError] = useState(false);

  const handleProbarClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (session) {
      router.push("/simulador");
    } else {
      setAuthModalOpen(true);
    }
  };

  const handleExplorarModelos = () => {
    const preview = document.getElementById("simuladores-preview");
    const isMobile = typeof window !== "undefined" && window.innerWidth < 1024;
    if (isMobile && preview) {
      preview.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      router.push("/simulador");
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950">
      <section className="relative min-h-[90vh] flex flex-col justify-center bg-[#020617] text-white overflow-hidden py-12 sm:py-16 lg:py-20">
        {/* Background Effects Premium */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Animated Glow Orbs */}
          <div className="absolute top-0 left-[20%] w-[800px] h-[800px] bg-blue-600/20 blur-[150px] rounded-full animate-pulse mix-blend-screen" style={{ animationDuration: '4s' }} />
          <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-emerald-500/15 blur-[150px] rounded-full animate-pulse mix-blend-screen" style={{ animationDuration: '6s', animationDelay: '1s' }} />
          <div className="absolute top-[30%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/20 blur-[120px] rounded-full animate-pulse mix-blend-screen" style={{ animationDuration: '5s', animationDelay: '2s' }} />

          {/* Faded Tech Grid */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 w-full grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="text-left animate-in fade-in slide-in-from-left duration-1000">
            {/* Pill Badge: más compacto en móvil */}
            <div className="relative inline-flex items-center gap-2 sm:gap-3 px-3 sm:px-5 py-2 sm:py-2.5 rounded-full bg-slate-900/50 border border-white/10 text-xs sm:text-sm font-bold mb-5 sm:mb-8 backdrop-blur-xl shadow-2xl overflow-hidden group hover:border-blue-500/50 transition-colors cursor-default">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="flex -space-x-2 relative z-10">
                {[1, 2, 3].map(i => (
                  <div key={i} className="w-6 h-6 sm:w-7 sm:h-7 rounded-full border-2 border-[#020617] bg-slate-800 flex items-center justify-center overflow-hidden shadow-lg">
                    <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="user" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
              <span className="text-slate-400 relative z-10 flex items-center gap-1.5 sm:gap-2">
                Confianza de <span className="text-white relative"><span className="absolute -bottom-1 left-0 w-full h-px bg-white/30 hidden group-hover:block"></span>+1,200 analistas</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping ml-0.5 sm:ml-1" />
              </span>
            </div>

            {/* Headline: tamaños ajustados para móvil */}
            <h1 className="font-black tracking-tighter text-white mb-5 sm:mb-8 leading-tight">
              <span className="block text-emerald-400 text-xl sm:text-2xl md:text-3xl lg:text-4xl mb-3 sm:mb-4 tracking-wider uppercase drop-shadow-[0_0_15px_rgba(52,211,153,0.5)]">Econosfera</span>
              <span className="block text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-8xl max-w-full">
                <span className="block whitespace-nowrap">EL SIMULADOR</span>
                <span className="relative block mt-1 sm:mt-2">
                  <span className="absolute -inset-2 bg-blue-600/20 blur-2xl opacity-40 animate-pulse" />
                  <span className="relative text-white whitespace-nowrap block">
                    PROFESIONAL
                  </span>
                </span>
              </span>
            </h1>

            {/* Description: más legible en móvil */}
            <p className="text-slate-400 text-base sm:text-xl md:text-2xl mb-8 sm:mb-12 max-w-2xl leading-relaxed font-medium">
              Para estudiantes y <span className="text-white font-bold">profesionales de la industria</span>. El puente real entre la teoría económica y el <span className="text-white font-bold">Trading Institucional</span>. Modela, proyecta y opera el mercado con <span className="text-emerald-400 border-b border-emerald-400/30 pb-0.5">poder de IA</span> y herramientas Wall Street grade.
            </p>

            {/* CTA principal: Ir a simuladores con fondo azul */}
            <div className="flex flex-col gap-4 sm:gap-5 mb-8 sm:mb-16 relative z-20">
              <button
                onClick={handleExplorarModelos}
                className="group relative inline-flex items-center justify-center w-full sm:w-auto px-6 sm:px-10 py-3.5 sm:py-5 text-base sm:text-lg font-bold tracking-wide rounded-2xl text-white overflow-hidden transition-all duration-300 transform hover:-translate-y-1 hover:shadow-[0_0_40px_rgba(59,130,246,0.6)]"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 group-hover:from-blue-500 group-hover:to-indigo-500 transition-colors" />
                <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />
                <div className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-white/10 to-transparent shadow-[0_4px_10px_rgba(0,0,0,0.5)]" />
                <span className="relative flex items-center gap-2">
                  <svg className="w-5 h-5 opacity-90 group-hover:opacity-100 transition-opacity flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  Ir a simuladores
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </span>
              </button>
            </div>

            {/* Móvil: preview de simuladores casi de inmediato (solo < lg) */}
            <div id="simuladores-preview" className="lg:hidden mt-6 sm:mt-8 -mx-2 sm:mx-0">
              <div className="rounded-2xl sm:rounded-3xl border border-white/15 bg-slate-900/80 shadow-[0_0_40px_rgba(0,0,0,0.4)] overflow-hidden backdrop-blur-sm">
                <div className="h-8 sm:h-9 bg-slate-800/80 border-b border-white/10 flex items-center px-3 sm:px-4 gap-1.5">
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-rose-500/60" />
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-amber-500/60" />
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-emerald-500/60" />
                  <span className="ml-auto text-[9px] sm:text-[10px] uppercase font-bold text-slate-500 tracking-widest">Simuladores</span>
                </div>
                <div className="p-2 sm:p-3 max-h-[320px] sm:max-h-[380px] overflow-y-auto no-scrollbar">
                  <MiniSimulator />
                  <div className="mt-3 pt-3 border-t border-white/5">
                    <MiniValuacion />
                  </div>
                </div>
                <div className="px-3 sm:px-4 py-2.5 bg-slate-800/50 border-t border-white/5 flex items-center justify-between gap-2">
                  <span className="text-[10px] sm:text-xs text-slate-500 font-medium">Vista previa</span>
                  <button
                    type="button"
                    onClick={handleExplorarModelos}
                    className="text-[10px] sm:text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors shrink-0"
                  >
                    Ir a simuladores →
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8 opacity-40 grayscale hover:grayscale-0 transition-all duration-500 mt-6">
              <span className="text-xs font-black uppercase tracking-[0.2em] break-words">Usada por alumnos de:</span>
              <div className="flex flex-wrap gap-4 sm:gap-6 items-center w-full">
                <div className="font-serif italic font-bold text-sm sm:text-base">ITAM</div>
                <div className="font-serif italic font-bold text-sm sm:text-base">UNAM</div>
                <div className="font-serif italic font-bold text-sm sm:text-base">TEC</div>
                <div className="font-serif italic font-bold text-sm sm:text-base">IBERO</div>
              </div>
            </div>
          </div>

          <div className="hidden lg:block w-full relative h-[700px]">
            {/* Floating Terminal UI Mockup */}
            <div className="absolute top-10 right-0 w-[500px] bg-slate-900 rounded-3xl border border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.5)] overflow-hidden animate-in fade-in zoom-in duration-1000 delay-300">
              <div className="h-8 bg-slate-800/50 border-b border-white/5 flex items-center px-4 gap-1.5">
                <div className="w-3 h-3 rounded-full bg-rose-500/50" />
                <div className="w-3 h-3 rounded-full bg-amber-500/50" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/50" />
                <span className="ml-auto text-[10px] uppercase font-bold text-slate-500 tracking-widest">econosfera-terminal-v1.0</span>
              </div>
              <div className="p-1 max-h-[600px] overflow-y-auto no-scrollbar">
                <MiniSimulator />
                <div className="p-4 bg-slate-900 border-t border-white/5">
                  <MiniValuacion />
                </div>
              </div>
            </div>

            {/* Smaller secondary element */}
            <div className="absolute bottom-10 left-0 w-[280px] bg-emerald-600 rounded-3xl p-6 shadow-2xl animate-bounce-slow">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                </div>
                <div className="font-black text-white">Análisis IA</div>
              </div>
              <div className="h-2 bg-white/20 rounded-full w-full mb-2" />
              <div className="h-2 bg-white/20 rounded-full w-[80%] mb-2" />
              <div className="h-2 bg-white/20 rounded-full w-[60%]" />
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof / Stats Ticker */}
      <div className="bg-white dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800 py-6 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap justify-between items-center gap-8 mb-6">
            <div className="flex flex-col">
              <span className="text-3xl font-black text-slate-900 dark:text-white">2.4k+</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Usuarios Activos</span>
            </div>
            <div className="w-px h-10 bg-slate-200 dark:bg-slate-800 hidden md:block" />
            <div className="flex flex-col">
              <span className="text-3xl font-black text-slate-900 dark:text-white">150+</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Países Impactados</span>
            </div>
            <div className="w-px h-10 bg-slate-200 dark:bg-slate-800 hidden md:block" />
            <div className="flex flex-col">
              <span className="text-3xl font-black text-slate-900 dark:text-white">12s</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Tiempo de Valuación</span>
            </div>
            <div className="w-px h-10 bg-slate-200 dark:bg-slate-800 hidden md:block" />
            <div className="flex flex-col">
              <span className="text-3xl font-black text-slate-900 dark:text-white">99%</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Satisfacción</span>
            </div>
          </div>
        </div>
      </div>

      {/* Banner UNAM - alumn@s */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/90 via-yellow-400/95 to-amber-500/90 dark:from-amber-600/95 dark:via-amber-500/95 dark:to-amber-600/95" />
        <div className="relative max-w-7xl mx-auto px-4 py-5 sm:py-6 flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
          <button
            type="button"
            onClick={handleProbarClick}
            className="flex-1 w-full sm:w-auto text-left group"
          >
            <p className="text-slate-900 font-black text-lg sm:text-xl md:text-2xl leading-tight drop-shadow-sm">
              ¿Eres alumn@ de UNAM?
            </p>
            <p className="text-slate-800 font-bold text-base sm:text-lg mt-0.5">
              Tenemos una sorpresa para ti — Crea tu cuenta ahora.
            </p>
            <span className="inline-flex items-center gap-1.5 mt-2 text-slate-800 font-bold text-sm group-hover:gap-2 transition-all">
              Ir a simuladores
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </span>
          </button>
          <div className="flex-shrink-0 w-32 h-16 sm:w-40 sm:h-20 flex items-center justify-center bg-white/20 rounded-xl border-2 border-white/40 shadow-lg overflow-hidden">
            {!unamLogoError ? (
              <img
                src="/Unam-Logo.jpg"
                alt="UNAM"
                className="max-w-full max-h-full object-contain"
                onError={() => setUnamLogoError(true)}
              />
            ) : (
              <span className="w-full h-full flex items-center justify-center text-slate-800 font-black text-sm sm:text-base bg-white/30">
                UNAM
              </span>
            )}
          </div>
        </div>
        {/* Brillo luminoso */}
        <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_50px_rgba(255,255,255,0.25),0_0_30px_rgba(251,191,36,0.3)]" />
      </div>

      {/* Cómo funciona */}
      <ComoFunciona onProbarClick={handleProbarClick} />

      {/* Cronología Histórica (Crisis, Nobels, Teorías) */}
      <TimelineLanding />

      {/* Galería de simuladores */}
      <GaleriaSimuladores onProbarClick={handleProbarClick} />

      {/* Grid de Funcionalidades Pro */}
      <section className="py-32 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center mb-24 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">
              Diseñado para la <br /> <span className="text-blue-600">Excelencia Cuantitativa</span>
            </h2>
            <p className="text-xl text-slate-500 leading-relaxed">
              No es un juguete. Es una herramienta de precisión que combina los modelos clásicos con la potencia del procesamiento moderno.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Motores de Valuación", desc: "Modelos DCF, Black-Scholes y curvas de rendimiento integrados con análisis de sensibilidad.", Icon: TrendingUp, color: "blue" },
              { title: "Neuro-Minutas IA", desc: "Nube de sentimientos y análisis de tópicos aplicado a minutas de política monetaria.", Icon: Brain, color: "indigo" },
              { title: "Economía Blockchain", desc: "Aprende Criptografía interactiva. Simuladores de Hashing, Nodos P2P y Ataques a Smart Contracts.", Icon: Link2, color: "purple" },
              { title: "Exportación Ejecutiva", desc: "Genera reportes técnicos en PDF con diseño editorial listos para el comité de inversión.", Icon: FileDown, color: "amber" }
            ].map((f, i) => {
              const Icon = f.Icon;
              const colorClasses: Record<string, string> = {
                blue: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-800",
                indigo: "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 border-indigo-100 dark:border-indigo-800",
                purple: "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 border-purple-100 dark:border-purple-800",
                amber: "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-800",
              };
              return (
                <div key={i} className="group p-8 rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/5 flex flex-col items-start">
                  <div className={`mb-6 p-4 rounded-2xl border ${colorClasses[f.color] ?? colorClasses.blue}`}>
                    <Icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 group-hover:text-blue-600 transition-colors">{f.title}</h3>
                  <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-sm lg:text-base">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing Section (Mejorada) */}
      <section id="pricing" className="py-32 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-5xl font-black mb-6">Invierte en tu <span className="text-blue-400">Ventaja Competitiva</span></h2>
            <p className="text-slate-400 text-xl max-w-2xl mx-auto font-medium">
              Planes flexibles para cada etapa de tu carrera profesional. Sin contratos, cancela cuando quieras.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 items-stretch">
            {/* Free */}
            <div className="p-10 rounded-[2.5rem] bg-slate-800/40 border border-white/5 flex flex-col hover:bg-slate-800/60 transition-colors">
              <span className="text-sm font-black uppercase tracking-widest text-slate-500 mb-2">Base</span>
              <h3 className="text-2xl font-bold mb-6">Gratuito</h3>
              <div className="mb-10">
                <span className="text-5xl font-black">$0</span>
                <span className="text-slate-500 font-medium"> /por siempre</span>
              </div>
              <ul className="space-y-5 mb-12 flex-1">
                {["Macro y Micro básicos", "Finanzas: VPVF, CETES, bonos, CAPM", "Portafolio, break-even, flujo financiero", "10 créditos (exportar consume créditos)", "Sin análisis de minutas IA"].map((item, i) => (
                  <li key={i} className="flex gap-3 text-sm text-slate-400">
                    <svg className="w-5 h-5 text-slate-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                    {item}
                  </li>
                ))}
              </ul>
              <button onClick={handleProbarClick} className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 font-bold hover:bg-white/10 transition-all">Empezar ahora</button>
            </div>

            {/* Student Pro */}
            <div className="p-8 lg:p-10 rounded-[2.5rem] bg-blue-600 border border-blue-400 shadow-[0_20px_60px_-15px_rgba(37,99,235,0.4)] flex flex-col relative lg:scale-[1.05] transform-gpu">
              <div className="absolute top-6 right-6 px-3 py-1 rounded-full bg-white/20 text-[10px] font-black uppercase tracking-widest text-white backdrop-blur-md">Hot</div>
              <span className="text-sm font-black uppercase tracking-widest text-blue-200 mb-2">Popular</span>
              <h3 className="text-2xl font-bold mb-6">Estudiante Pro</h3>
              <div className="mb-10">
                <span className="text-5xl font-black">MXN 99</span>
                <span className="text-blue-200 font-medium"> /mes</span>
              </div>
              <ul className="space-y-5 mb-12 flex-1">
                {["50 créditos/mes para exportar", "Exportaciones consumen créditos", "Modelos: DCF y Black-Scholes", "Simuladores Cripto: Merkle", "Soporte Prioritario"].map((item, i) => (
                  <li key={i} className="flex gap-3 text-sm text-blue-50">
                    <svg className="w-5 h-5 text-blue-200 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                    <span className={item.includes("Modelos") || item.includes("Cripto") || item.includes("50") ? "font-bold text-white" : ""}>{item}</span>
                  </li>
                ))}
              </ul>
              <button onClick={() => router.push('/pricing')} className="w-full py-5 rounded-2xl bg-white text-blue-600 font-black shadow-xl hover:scale-[1.02] transition-all">Obtener Ventaja Pro</button>
            </div>

            {/* Researcher */}
            <div className="p-10 rounded-[2.5rem] bg-slate-800/40 border border-white/5 flex flex-col hover:bg-slate-800/60 transition-colors">
              <span className="text-sm font-black uppercase tracking-widest text-slate-500 mb-2">Full</span>
              <h3 className="text-2xl font-bold mb-6">Researcher</h3>
              <div className="mb-10">
                <span className="text-5xl font-black">MXN 199</span>
                <span className="text-slate-500 font-medium"> /mes</span>
              </div>
              <ul className="space-y-5 mb-12 flex-1">
                {["200 Créditos IA/mes (minutas Banxico)", "Exportaciones PDF ilimitadas", "Simuladores Full: Smart Contracts, P2P", "Análisis AI de Minutas Banxico", "Soporte 24/7"].map((item, i) => (
                  <li key={i} className="flex gap-3 text-sm text-slate-400">
                    <svg className="w-5 h-5 text-indigo-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                    <span className={item.includes("Full") || item.includes("200") || item.includes("Minutas") || item.includes("ilimitadas") ? "font-bold text-white" : ""}>{item}</span>
                  </li>
                ))}
              </ul>
              <button onClick={() => router.push('/pricing')} className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 font-bold hover:bg-white/10 transition-all">Contactar Ventas</button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer / Call to Action Final */}
      <section className="py-24 bg-white dark:bg-slate-900">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-8">
            ¿Listo para cambiar la forma en que entiendes la economía?
          </h2>
          <button
            onClick={handleExplorarModelos}
            className="inline-flex items-center gap-2 px-8 sm:px-12 py-4 sm:py-5 bg-blue-600 text-white text-lg sm:text-xl font-black rounded-3xl hover:bg-blue-500 hover:shadow-2xl hover:scale-105 transition-all duration-300"
          >
            Ir a simuladores
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
          </button>
        </div>
      </section>

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
    </div>
  );
}
