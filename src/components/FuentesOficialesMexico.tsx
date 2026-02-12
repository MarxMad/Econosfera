"use client";

import { Building2, BarChart3, TrendingUp } from "lucide-react";

const BANXICO = [
  {
    nombre: "Portal del Banco de México",
    url: "https://www.banxico.org.mx",
    descripcion: "Sitio oficial: política monetaria, comunicados y estadísticas.",
  },
  {
    nombre: "Tasa de fondeo (tasa de política)",
    url: "https://www.banxico.org.mx/SieInternet/consultarDirectorioInternetAction.do?sector=18&accion=consultarCuadro&idCuadro=CF101&locale=es",
    descripcion: "Tasas de interés en el mercado de dinero (SIE): tasa objetivo, TIIE de fondeo.",
  },
  {
    nombre: "Inflación y precios",
    url: "https://www.banxico.org.mx/SieInternet/consultarDirectorioInternetAction.do?sector=8&accion=consultarCuadro&idCuadro=CP151&locale=es",
    descripcion: "Inflación (SIE): INPC, general, subyacente y no subyacente (mensual y anual).",
  },
  {
    nombre: "Encuesta de expectativas",
    url: "https://www.banxico.org.mx/publicaciones-y-prensa/encuestas-sobre-las-expectativas-de-los-especialis/encuestas-expectativas-del-se.html",
    descripcion: "Encuesta sobre expectativas de especialistas: inflación, crecimiento y tipo de cambio.",
  },
  {
    nombre: "Anuncios de decisiones de política monetaria",
    url: "https://www.banxico.org.mx/publicaciones-y-prensa/anuncios-de-las-decisiones-de-politica-monetaria/anuncios-politica-monetaria-t.html",
    descripcion: "Comunicados de la Junta de Gobierno: cambios en la tasa objetivo.",
  },
];

const INEGI = [
  {
    nombre: "Portal del INEGI",
    url: "https://www.inegi.org.mx",
    descripcion: "Instituto Nacional de Estadística y Geografía: estadísticas oficiales.",
  },
  {
    nombre: "INPC e inflación",
    url: "https://www.inegi.org.mx/temas/inpc/",
    descripcion: "Índice Nacional de Precios al Consumidor, inflación general y subyacente.",
  },
  {
    nombre: "Sistema de Información Económica (INEGI)",
    url: "https://www.inegi.org.mx/sistemas/bie/",
    descripcion: "Cuentas nacionales, PIB, indicadores coyunturales.",
  },
  {
    nombre: "Comunicados de prensa",
    url: "https://www.inegi.org.mx/app/saladeprensa/",
    descripcion: "Sala de prensa INEGI: noticias, calendario y comunicados.",
  },
];

function TarjetaFuente({
  nombre,
  url,
  descripcion,
  icono: Icon,
}: {
  nombre: string;
  url: string;
  descripcion: string;
  icono: React.ComponentType<{ className?: string }>;
}) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="block p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-md transition-all group"
    >
      <div className="flex items-start gap-3">
        <Icon className="w-6 h-6 text-slate-500 dark:text-slate-400 flex-shrink-0" aria-hidden />
        <div>
          <p className="font-semibold text-slate-800 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {nombre}
            <span className="ml-1 text-slate-400 group-hover:translate-x-0.5 inline-block transition-transform">→</span>
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">{descripcion}</p>
        </div>
      </div>
    </a>
  );
}

export default function FuentesOficialesMexico() {
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 shadow-lg overflow-hidden">
      <div className="p-5 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-slate-800 dark:to-slate-800">
        <div className="flex items-center gap-2 mb-1">
          <Building2 className="w-6 h-6 text-slate-600 dark:text-slate-400" aria-hidden />
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
            Fuentes oficiales para consulta (México)
          </h2>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Enlaces directos a Banxico e INEGI para que los estudiantes obtengan datos actualizados de inflación, tasas y expectativas.
        </p>
      </div>

      <div className="p-5 grid md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-3 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-[#0c2340] text-white flex items-center justify-center text-sm font-bold">
              B
            </span>
            Banco de México (Banxico)
          </h3>
          <ul className="space-y-2">
            {BANXICO.map((f, i) => (
              <li key={i}>
                <TarjetaFuente {...f} icono={BarChart3} />
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-3 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-[#0a3d62] text-white flex items-center justify-center text-sm font-bold">
              I
            </span>
            INEGI
          </h3>
          <ul className="space-y-2">
            {INEGI.map((f, i) => (
              <li key={i}>
                <TarjetaFuente {...f} icono={TrendingUp} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
