/**
 * Línea de tiempo de teorías económicas y premios Nobel de Economía.
 * Referencia: manuales de historia del pensamiento económico, Nobel Prize official.
 */

export type TipoEvento = "teoria" | "nobel";

export interface EventoTeoria {
  year: number;
  autor: string;
  nombre: string;
  descripcion: string;
  tipo: "teoria";
  obra?: string;
}

export interface EventoNobel {
  year: number;
  autor: string;
  nombre: string;
  descripcion: string;
  tipo: "nobel";
}

export type EventoLinea = EventoTeoria | EventoNobel;

/** Principales teorías y obras de la economía (orden cronológico). */
export const TEORIAS_ECONOMICAS: EventoTeoria[] = [
  { year: 1758, autor: "François Quesnay", nombre: "Fisiocracia", descripcion: "La riqueza proviene de la tierra y el trabajo agrícola; el flujo circular entre sectores. Tableau économique.", tipo: "teoria", obra: "Tableau économique" },
  { year: 1776, autor: "Adam Smith", nombre: "La riqueza de las naciones", descripcion: "División del trabajo, mano invisible del mercado, ventaja absoluta y libertad económica como motor del crecimiento.", tipo: "teoria", obra: "An Inquiry into the Nature and Causes of the Wealth of Nations" },
  { year: 1798, autor: "Thomas Malthus", nombre: "Ensayo sobre el principio de la población", descripcion: "La población crece geométricamente y los medios de subsistencia aritméticamente; riesgo de escasez y pobreza.", tipo: "teoria", obra: "An Essay on the Principle of Population" },
  { year: 1817, autor: "David Ricardo", nombre: "Principios de economía política", descripcion: "Ventaja comparativa, teoría del valor-trabajo, renta de la tierra y distribución entre salarios, beneficios y rentas.", tipo: "teoria", obra: "On the Principles of Political Economy and Taxation" },
  { year: 1848, autor: "John Stuart Mill", nombre: "Principios de economía política", descripcion: "Síntesis clásica: valor, distribución, comercio internacional y papel del Estado. Libertad y utilitarismo.", tipo: "teoria", obra: "Principles of Political Economy" },
  { year: 1867, autor: "Karl Marx", nombre: "El capital", descripcion: "Plusvalía, explotación, acumulación y crisis del capitalismo. Materialismo histórico y ley tendencial de la tasa de ganancia.", tipo: "teoria", obra: "Das Kapital" },
  { year: 1871, autor: "William Stanley Jevons", nombre: "Teoría de la utilidad marginal", descripcion: "El valor depende de la utilidad marginal; revolución marginalista en Inglaterra.", tipo: "teoria", obra: "The Theory of Political Economy" },
  { year: 1871, autor: "Carl Menger", nombre: "Principios de economía", descripcion: "Escuela austriaca: valor subjetivo, utilidad marginal y proceso de mercado.", tipo: "teoria", obra: "Grundsätze der Volkswirtschaftslehre" },
  { year: 1874, autor: "Léon Walras", nombre: "Equilibrio general", descripcion: "Sistema de ecuaciones de oferta y demanda en todos los mercados; tâtonnement (subastador walrasiano).", tipo: "teoria", obra: "Éléments d'économie politique pure" },
  { year: 1890, autor: "Alfred Marshall", nombre: "Principios de economía", descripcion: "Oferta y demanda, elasticidad, excedente del consumidor, corto y largo plazo. Síntesis neoclásica.", tipo: "teoria", obra: "Principles of Economics" },
  { year: 1912, autor: "Joseph Schumpeter", nombre: "Teoría del desarrollo económico", descripcion: "Innovación y destrucción creativa; el empresario como motor del crecimiento.", tipo: "teoria", obra: "Theorie der wirtschaftlichen Entwicklung" },
  { year: 1936, autor: "John Maynard Keynes", nombre: "Teoría general del empleo, el interés y el dinero", descripcion: "Demanda efectiva, preferencia por la liquidez, multiplicador y papel de la política fiscal y monetaria para salir de la depresión.", tipo: "teoria", obra: "The General Theory of Employment, Interest and Money" },
  { year: 1937, autor: "John Hicks", nombre: "IS-LM", descripcion: "Modelo que formaliza el equilibrio en mercados de bienes (IS) y dinero (LM); síntesis keynesiana-neoclásica.", tipo: "teoria", obra: "Mr. Keynes and the Classics" },
  { year: 1944, autor: "John von Neumann & Oskar Morgenstern", nombre: "Teoría de juegos", descripcion: "Comportamiento estratégico, utilidad esperada y fundamentos de la economía de la incertidumbre.", tipo: "teoria", obra: "Theory of Games and Economic Behavior" },
  { year: 1947, autor: "Paul Samuelson", nombre: "Fundamentos del análisis económico", descripcion: "Maximización y condiciones de equilibrio con matemáticas; teorema de Stolper-Samuelson y bienes públicos.", tipo: "teoria", obra: "Foundations of Economic Analysis" },
  { year: 1948, autor: "Paul Samuelson", nombre: "Economía: un análisis introductorio", descripcion: "Manual que difundió la síntesis neoclásica-keynesiana en todo el mundo.", tipo: "teoria", obra: "Economics: An Introductory Analysis" },
  { year: 1952, autor: "Harry Markowitz", nombre: "Teoría de portafolio", descripcion: "Selección de carteras por media-varianza; diversificación y frontera eficiente.", tipo: "teoria", obra: "Portfolio Selection" },
  { year: 1954, autor: "Kenneth Arrow & Gérard Debreu", nombre: "Existencia del equilibrio general", descripcion: "Demostración matemática de que existe un equilibrio de precios en una economía competitiva bajo condiciones generales.", tipo: "teoria", obra: "Existence of an Equilibrium for a Competitive Economy" },
  { year: 1956, autor: "Robert Solow", nombre: "Modelo de crecimiento neoclásico", descripcion: "Crecimiento a largo plazo explicado por el progreso técnico (PTF); estado estacionario y convergencia.", tipo: "teoria", obra: "A Contribution to the Theory of Economic Growth" },
  { year: 1958, autor: "A.W. Phillips", nombre: "Curva de Phillips", descripcion: "Relación empírica inversa entre desempleo e inflación (salarial); luego extendida a inflación de precios.", tipo: "teoria", obra: "The Relation Between Unemployment and the Rate of Change of Money Wage Rates" },
  { year: 1960, autor: "Ronald Coase", nombre: "Teorema de Coase", descripcion: "Bajo derechos de propiedad bien definidos y costes de transacción nulos, los agentes internalizan externalidades.", tipo: "teoria", obra: "The Problem of Social Cost" },
  { year: 1961, autor: "Milton Friedman", nombre: "Monetarismo", descripcion: "La inflación es siempre y en todas partes un fenómeno monetario; reglas monetarias y crítica a la política discrecional.", tipo: "teoria", obra: "A Program for Monetary Stability" },
  { year: 1962, autor: "James Buchanan & Gordon Tullock", nombre: "Economía constitucional", descripcion: "Elección pública: cómo las reglas e instituciones afectan las decisiones políticas y el gasto público.", tipo: "teoria", obra: "The Calculus of Consent" },
  { year: 1963, autor: "Robert Mundell", nombre: "Mundell-Fleming", descripcion: "IS-LM en economía abierta; efectividad de política fiscal y monetaria según tipo de cambio fijo o flexible.", tipo: "teoria", obra: "Capital Mobility and Stabilization Policy" },
  { year: 1968, autor: "Edmund Phelps", nombre: "NAIRU y expectativas", descripcion: "La curva de Phillips de largo plazo es vertical; la tasa natural de desempleo y las expectativas racionales en inflación.", tipo: "teoria", obra: "Money-Wage Dynamics and Labor Market Equilibrium" },
  { year: 1972, autor: "John Taylor", nombre: "Regla de Taylor", descripcion: "Fórmula que relaciona la tasa de política con la brecha de inflación y la brecha de producto; referencia para bancos centrales.", tipo: "teoria", obra: "Discretion versus policy rules in practice" },
  { year: 1972, autor: "Robert Lucas", nombre: "Expectativas racionales", descripcion: "Los agentes usan toda la información disponible; crítica a la política sistemática y revolución de las expectativas racionales.", tipo: "teoria", obra: "Expectations and the Neutrality of Money" },
  { year: 1973, autor: "Fischer Black, Myron Scholes, Robert Merton", nombre: "Valoración de opciones", descripcion: "Fórmula Black-Scholes-Merton para valorar opciones europeas; fundamento de los derivados modernos.", tipo: "teoria", obra: "The Pricing of Options and Corporate Liabilities" },
  { year: 1976, autor: "Michael Jensen & William Meckling", nombre: "Teoría de la agencia", descripcion: "Conflictos de interés entre principal y agente; costes de agencia y estructura de capital.", tipo: "teoria", obra: "Theory of the Firm: Managerial Behavior, Agency Costs" },
  { year: 1982, autor: "George Akerlof, Michael Spence, Joseph Stiglitz", nombre: "Información asimétrica", descripcion: "Selección adversa, señalización y screening cuando una parte tiene más información que otra.", tipo: "teoria", obra: "Diversos artículos (mercado de limones, señales, screening)" },
  { year: 1988, autor: "Paul Romer", nombre: "Crecimiento endógeno", descripcion: "El progreso técnico y el capital humano son endógenos; las políticas pueden afectar el crecimiento a largo plazo.", tipo: "teoria", obra: "Endogenous Technological Change" },
  { year: 2008, autor: "Satoshi Nakamoto", nombre: "Bitcoin y blockchain", descripcion: "Dinero digital descentralizado y cadena de bloques como libro mayor inmutable; criptoeconomía.", tipo: "teoria", obra: "Bitcoin: A Peer-to-Peer Electronic Cash System" },
];

/** Premios Nobel de Ciencias Económicas (selección representativa). */
export const NOBELES_ECONOMIA: EventoNobel[] = [
  { year: 1969, autor: "Ragnar Frisch, Jan Tinbergen", nombre: "Nobel Economía", descripcion: "Desarrollo y aplicación de modelos dinámicos al análisis de procesos económicos.", tipo: "nobel" },
  { year: 1970, autor: "Paul Samuelson", nombre: "Nobel Economía", descripcion: "Trabajo científico en teoría económica estática y dinámica.", tipo: "nobel" },
  { year: 1972, autor: "John Hicks, Kenneth Arrow", nombre: "Nobel Economía", descripcion: "Contribuciones pioneras a la teoría del equilibrio económico y del bienestar.", tipo: "nobel" },
  { year: 1974, autor: "Gunnar Myrdal, Friedrich Hayek", nombre: "Nobel Economía", descripcion: "Análisis de la interdependencia de fenómenos económicos, sociales e institucionales (Myrdal). Teoría monetaria y fluctuaciones económicas (Hayek).", tipo: "nobel" },
  { year: 1976, autor: "Milton Friedman", nombre: "Nobel Economía", descripcion: "Logros en el análisis del consumo, historia y teoría monetaria.", tipo: "nobel" },
  { year: 1981, autor: "James Tobin", nombre: "Nobel Economía", descripcion: "Análisis de los mercados financieros y sus relaciones con gasto, empleo y precios.", tipo: "nobel" },
  { year: 1983, autor: "Gérard Debreu", nombre: "Nobel Economía", descripcion: "Incorporación de nuevos métodos analíticos a la teoría del equilibrio económico.", tipo: "nobel" },
  { year: 1987, autor: "Robert Solow", nombre: "Nobel Economía", descripcion: "Contribuciones a la teoría del crecimiento económico.", tipo: "nobel" },
  { year: 1990, autor: "Harry Markowitz, Merton Miller, William Sharpe", nombre: "Nobel Economía", descripcion: "Teoría de la economía financiera: portafolio, estructura de capital (MM), CAPM.", tipo: "nobel" },
  { year: 1991, autor: "Ronald Coase", nombre: "Nobel Economía", descripcion: "Descubrimiento del significado de los costes de transacción y los derechos de propiedad.", tipo: "nobel" },
  { year: 1992, autor: "Gary Becker", nombre: "Nobel Economía", descripcion: "Extensión del análisis microeconómico a un amplio rango de comportamiento humano.", tipo: "nobel" },
  { year: 1994, autor: "John Harsanyi, John Nash, Reinhard Selten", nombre: "Nobel Economía", descripcion: "Análisis pionero del equilibrio en la teoría de juegos no cooperativos.", tipo: "nobel" },
  { year: 1995, autor: "Robert Lucas", nombre: "Nobel Economía", descripcion: "Desarrollo y aplicación de la hipótesis de expectativas racionales.", tipo: "nobel" },
  { year: 1997, autor: "Robert Merton, Myron Scholes", nombre: "Nobel Economía", descripcion: "Nuevo método para valorar derivados (fórmula Black-Scholes).", tipo: "nobel" },
  { year: 1998, autor: "Amartya Sen", nombre: "Nobel Economía", descripcion: "Contribuciones a la economía del bienestar y a la teoría del desarrollo.", tipo: "nobel" },
  { year: 2001, autor: "George Akerlof, Michael Spence, Joseph Stiglitz", nombre: "Nobel Economía", descripcion: "Análisis de mercados con información asimétrica.", tipo: "nobel" },
  { year: 2006, autor: "Edmund Phelps", nombre: "Nobel Economía", descripcion: "Análisis de los trade-offs intertemporales en política macroeconómica.", tipo: "nobel" },
  { year: 2008, autor: "Paul Krugman", nombre: "Nobel Economía", descripcion: "Análisis de los patrones de comercio y ubicación de la actividad económica.", tipo: "nobel" },
  { year: 2009, autor: "Elinor Ostrom, Oliver Williamson", nombre: "Nobel Economía", descripcion: "Gobernanza económica: bienes comunes (Ostrom) y límites de la empresa (Williamson).", tipo: "nobel" },
  { year: 2013, autor: "Eugene Fama, Lars Hansen, Robert Shiller", nombre: "Nobel Economía", descripcion: "Análisis empírico de los precios de los activos.", tipo: "nobel" },
  { year: 2017, autor: "Richard Thaler", nombre: "Nobel Economía", descripcion: "Contribuciones a la economía del comportamiento.", tipo: "nobel" },
  { year: 2018, autor: "William Nordhaus, Paul Romer", nombre: "Nobel Economía", descripcion: "Integración del cambio climático en el análisis macroeconómico (Nordhaus). Integración de la innovación en el crecimiento (Romer).", tipo: "nobel" },
  { year: 2019, autor: "Abhijit Banerjee, Esther Duflo, Michael Kremer", nombre: "Nobel Economía", descripcion: "Enfoque experimental para aliviar la pobreza global.", tipo: "nobel" },
  { year: 2020, autor: "Paul Milgrom, Robert Wilson", nombre: "Nobel Economía", descripcion: "Mejoras en la teoría de subastas e invención de nuevos formatos.", tipo: "nobel" },
  { year: 2021, autor: "David Card, Joshua Angrist, Guido Imbens", nombre: "Nobel Economía", descripcion: "Contribuciones empíricas al economía laboral y metodología de relaciones causales.", tipo: "nobel" },
  { year: 2022, autor: "Ben Bernanke, Douglas Diamond, Philip Dybvig", nombre: "Nobel Economía", descripcion: "Investigación sobre bancos y crisis financieras.", tipo: "nobel" },
  { year: 2023, autor: "Claudia Goldin", nombre: "Nobel Economía", descripcion: "Avances en la comprensión de los resultados de las mujeres en el mercado laboral.", tipo: "nobel" },
  { year: 2024, autor: "Daron Acemoglu, Simon Johnson, James Robinson", nombre: "Nobel Economía", descripcion: "Estudio de cómo se forman las instituciones y afectan la prosperidad.", tipo: "nobel" },
];

/** Eventos unificados y ordenados por año para la línea de tiempo. */
export function getLineaTiempoCompleta(): EventoLinea[] {
  const todos: EventoLinea[] = [...TEORIAS_ECONOMICAS, ...NOBELES_ECONOMIA];
  return todos.sort((a, b) => a.year - b.year);
}
