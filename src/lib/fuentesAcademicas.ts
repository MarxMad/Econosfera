/**
 * Fuentes académicas y oficiales por módulo: política monetaria/inflación, macroeconomía y microeconomía.
 * Mínimo 15 referencias por módulo para profundizar en teoría y práctica.
 */

export interface FuenteAcademica {
  titulo: string;
  url: string;
  institucion: string;
  descripcion: string;
}

/** Fuentes sobre política monetaria, inflación, regla de Taylor y bancos centrales */
export const FUENTES_INFLACION: FuenteAcademica[] = [
  {
    titulo: "Política monetaria e inflación",
    url: "https://www.banxico.org.mx/politica-monetaria/instrumentos-politica-monetaria.html",
    institucion: "Banco de México",
    descripcion: "Instrumentos y marco de política monetaria de Banxico (objetivo de inflación, tasa de interés).",
  },
  {
    titulo: "Programas de política monetaria",
    url: "https://www.banxico.org.mx/publicaciones-y-prensa/programas-de-política-monetaria/programas-politica-monetaria-.html",
    institucion: "Banco de México",
    descripcion: "Programas anuales de política monetaria (art. 51 Ley del Banco de México).",
  },
  {
    titulo: "Minutas de decisiones de política monetaria",
    url: "https://www.banxico.org.mx/publicaciones-y-prensa/minutas-de-las-decisiones-de-politica-monetaria/minutas-politica-monetaria-ta.html",
    institucion: "Banco de México",
    descripcion: "Minutas de la Junta de Gobierno con el análisis detrás de cada decisión.",
  },
  {
    titulo: "Monetary Policy (FOMC)",
    url: "https://www.federalreserve.gov/monetarypolicy.htm",
    institucion: "Federal Reserve (Fed)",
    descripcion: "Política monetaria de la Fed: decisiones, comunicados y marco del Comité Federal de Mercado Abierto.",
  },
  {
    titulo: "Monetary Policy Explained",
    url: "https://www.federalreserveeducation.org/teaching-resources/economics/monetary-policy-the-federal-reserve/monetary-policy-explained",
    institucion: "Federal Reserve Education",
    descripcion: "Recursos didácticos del Fed sobre qué es la política monetaria y el mandato dual.",
  },
  {
    titulo: "Research at BIS",
    url: "https://www.bis.org/research/index.htm",
    institucion: "Bank for International Settlements (BIS)",
    descripcion: "Investigación del BIS sobre política monetaria y estabilidad financiera global.",
  },
  {
    titulo: "BIS Working Papers",
    url: "https://www.bis.org/wpapers/index.htm",
    institucion: "BIS",
    descripcion: "Documentos de trabajo sobre reglas monetarias, inflación y bancos centrales.",
  },
  {
    titulo: "Monetary Policy Rules (NBER)",
    url: "https://www.nber.org/books-and-chapters/monetary-policy-rules",
    institucion: "NBER",
    descripcion: "Libro NBER editado por John B. Taylor sobre reglas de política monetaria.",
  },
  {
    titulo: "An Historical Analysis of Monetary Policy Rules",
    url: "https://www.nber.org/papers/w6768",
    institucion: "NBER",
    descripcion: "Taylor (1998): análisis histórico de reglas de tasas de interés (Taylor rule).",
  },
  {
    titulo: "Simple and Robust Rules for Monetary Policy",
    url: "https://www.nber.org/papers/w15908",
    institucion: "NBER",
    descripcion: "Taylor y Williams: reglas simples y robustas para política monetaria.",
  },
  {
    titulo: "Monetary policy (ECB)",
    url: "https://www.ecb.europa.eu/mopo/html/index.en.html",
    institucion: "Banco Central Europeo",
    descripcion: "Marco de política monetaria del BCE: objetivo de inflación y instrumentos.",
  },
  {
    titulo: "IMF Working Papers – Monetary Policy",
    url: "https://www.imf.org/en/Publications/WP/Search?series=WP&topics=259",
    institucion: "FMI",
    descripcion: "Documentos de trabajo del FMI sobre política monetaria e inflación.",
  },
  {
    titulo: "Inflation Targeting (IMF)",
    url: "https://www.imf.org/en/About/Factsheets/Sheets/2023/inflation-targeting",
    institucion: "FMI",
    descripcion: "Hoja informativa del FMI sobre metas de inflación.",
  },
  {
    titulo: "Monetary Policy (OECD)",
    url: "https://www.oecd.org/economy/monetary-policy/",
    institucion: "OCDE",
    descripcion: "Análisis de la OCDE sobre política monetaria y perspectivas económicas.",
  },
  {
    titulo: "Taylor rule (Wikipedia)",
    url: "https://en.wikipedia.org/wiki/Taylor_rule",
    institucion: "Wikipedia",
    descripcion: "Regla de Taylor: fórmula, interpretación y uso por bancos centrales.",
  },
  {
    titulo: "Bank of England – Monetary policy",
    url: "https://www.bankofengland.co.uk/monetary-policy",
    institucion: "Banco de Inglaterra",
    descripcion: "Explicación del marco de política monetaria del BoE.",
  },
  {
    titulo: "Política monetaria (CEPAL)",
    url: "https://www.cepal.org/es/temas/politica-monetaria",
    institucion: "CEPAL",
    descripcion: "Enfoque regional de CEPAL sobre política monetaria en América Latina.",
  },
  {
    titulo: "Biblioteca Digital UNAM",
    url: "https://www.bidi.unam.mx/",
    institucion: "UNAM / DGBSDI",
    descripcion: "Portal de la UNAM: libros (eLIBRUNAM), revistas (eSERIUNAM), tesis (eTESIUNAM) y bases de datos para investigación en economía.",
  },
  {
    titulo: "Tesis UNAM (eTESIUNAM)",
    url: "https://tesiunam.dgb.unam.mx/",
    institucion: "UNAM / DGB",
    descripcion: "Catálogo de tesis digitales de la UNAM. Buscar por «política monetaria», «inflación» o «bancos centrales» para trabajos de grado y posgrado.",
  },
  {
    titulo: "Documentos de investigación del Banco de México",
    url: "https://www.banxico.org.mx/DIBM/",
    institucion: "Banco de México",
    descripcion: "Trabajos de economistas e investigadores de Banxico sobre política monetaria, inflación y reglas de tasas (por tema y año).",
  },
  {
    titulo: "CEMLA – Publicaciones",
    url: "https://www.cemla.org/publicaciones.html",
    institucion: "CEMLA",
    descripcion: "Centro de Estudios Monetarios Latinoamericanos: documentos de trabajo, Latin American Journal of Central Banking y estudios de banca central (autores de la región).",
  },
  {
    titulo: "El Trimestre Económico",
    url: "https://www.scielo.org.mx/scielo.php?lng=es&pid=2448-718X&script=sci_serial",
    institucion: "FCE",
    descripcion: "Revista mexicana de economía (FCE, desde 1934). Artículos sobre política monetaria, inflación y economía mexicana por autores nacionales e internacionales.",
  },
  {
    titulo: "CIDE – División de Economía",
    url: "https://www.cide.edu/division-academica/economia/",
    institucion: "CIDE",
    descripcion: "Centro de Investigación y Docencia Económicas: investigación en política monetaria, tipo de cambio y economía mexicana.",
  },
  {
    titulo: "Repositorio CIDE (economía mexicana)",
    url: "https://repositorio-digital.cide.edu/",
    institucion: "CIDE",
    descripcion: "Acceso abierto a libros y trabajos como «La economía mexicana: un balance desde la academia» (política monetaria, inflación, desarrollo).",
  },
  {
    titulo: "Investigación Económica (revista UNAM)",
    url: "https://www.revistas.unam.mx/index.php/rie",
    institucion: "UNAM / IIEc",
    descripcion: "Revista del IIEc-UNAM: teoría económica, economía mexicana y América Latina. Incluye trabajos sobre inflación y política monetaria.",
  },
  {
    titulo: "Gerardo Esquivel (economista)",
    url: "https://es.wikipedia.org/wiki/Gerardo_Esquivel_(economista)",
    institucion: "Referencia biográfica",
    descripcion: "Economista mexicano (UNAM, Colmez, Harvard); ex subgobernador de Banxico. Trabajos sobre desigualdad, política monetaria e inflación en México.",
  },
];

/** Fuentes sobre macroeconomía: multiplicador keynesiano, IS-LM, demanda agregada */
export const FUENTES_MACRO: FuenteAcademica[] = [
  {
    titulo: "The Economy 2.0 – Macroeconomics",
    url: "https://www.core-econ.org/the-economy/macroeconomics/",
    institucion: "CORE Econ",
    descripcion: "Libro de texto abierto de macroeconomía (desempleo, política fiscal y monetaria).",
  },
  {
    titulo: "Principles of Macroeconomics 3e",
    url: "https://openstax.org/details/books/principles-macroeconomics-3e",
    institucion: "OpenStax",
    descripcion: "Manual gratuito de macro: PIB, inflación, política fiscal y monetaria.",
  },
  {
    titulo: "IS-LM Model (Money and Banking)",
    url: "https://saylordotorg.github.io/text_money-and-banking-v2/s24-is-lm.html",
    institucion: "Saylordotorg",
    descripcion: "Capítulo sobre el modelo IS-LM: mercado de bienes y de dinero.",
  },
  {
    titulo: "Keynesian Economics (Khan Academy)",
    url: "https://www.khanacademy.org/economics-finance-domain/macroeconomics/income-and-expenditure-topic",
    institucion: "Khan Academy",
    descripcion: "Renta, gasto y multiplicador keynesiano (vídeos y ejercicios).",
  },
  {
    titulo: "Aggregate Demand (Khan Academy)",
    url: "https://www.khanacademy.org/economics-finance-domain/macroeconomics/aggregate-supply-demand",
    institucion: "Khan Academy",
    descripcion: "Demanda agregada, oferta agregada y equilibrio macroeconómico.",
  },
  {
    titulo: "World Economic Outlook",
    url: "https://www.imf.org/en/Publications/WEO",
    institucion: "FMI",
    descripcion: "Perspectivas económicas globales: crecimiento, inflación y políticas.",
  },
  {
    titulo: "OECD Economic Outlook",
    url: "https://www.oecd.org/economy/economic-outlook/",
    institucion: "OCDE",
    descripcion: "Perspectivas y análisis macroeconómico de la OCDE.",
  },
  {
    titulo: "Macroeconomics (LibreTexts)",
    url: "https://socialsci.libretexts.org/Bookshelves/Economics",
    institucion: "LibreTexts",
    descripcion: "Recursos abiertos de macroeconomía (multiplicador, IS-LM, política fiscal).",
  },
  {
    titulo: "A History of Macroeconomics – IS-LM",
    url: "https://www.cambridge.org/core/books/history-of-macroeconomics-from-keynes-to-lucas-and-beyond/keynesian-macroeconomics-the-islm-model/00E12AB32B7C49CD51E9829DB89307FA",
    institucion: "Cambridge University Press",
    descripcion: "Contexto histórico del modelo IS-LM (Hicks, Keynes).",
  },
  {
    titulo: "Keynesian Cross and Multiplier (Lumen)",
    url: "https://courses.lumenlearning.com/wm-macroeconomics/chapter/the-keynesian-perspective/",
    institucion: "Lumen Learning",
    descripcion: "Perspectiva keynesiana: cruz keynesiana y multiplicador del gasto.",
  },
  {
    titulo: "Fiscal Policy (Investopedia)",
    url: "https://www.investopedia.com/terms/f/fiscalpolicy.asp",
    institucion: "Investopedia",
    descripcion: "Definición de política fiscal y su relación con el multiplicador.",
  },
  {
    titulo: "GDP and Growth (CEPAL)",
    url: "https://www.cepal.org/es/temas/crecimiento-economico",
    institucion: "CEPAL",
    descripcion: "Crecimiento económico y PIB en perspectiva regional (América Latina).",
  },
  {
    titulo: "NBER Macroeconomics",
    url: "https://www.nber.org/papers/by-program/EFG",
    institucion: "NBER",
    descripcion: "Documentos de trabajo sobre fluctuaciones económicas y crecimiento.",
  },
  {
    titulo: "ECONLIB – Macroeconomics",
    url: "https://www.econlib.org/library/Enc/Macroeconomics.html",
    institucion: "EconLib",
    descripcion: "Enciclopedia de macroeconomía (Keynes, ciclo económico, política).",
  },
  {
    titulo: "Federal Reserve – Economic Research",
    url: "https://www.federalreserve.gov/econres.htm",
    institucion: "Federal Reserve",
    descripcion: "Investigación económica del Fed: empleo, inflación y política monetaria.",
  },
  {
    titulo: "Blanchard – Macroeconomics (reference)",
    url: "https://www.pearson.com/en-us/subject-catalog/p/macroeconomics/P2000000032952",
    institucion: "Pearson",
    descripcion: "Libro de referencia: Blanchard, Macroeconomics (modelos IS-LM, OA-DA).",
  },
  {
    titulo: "Biblioteca Digital UNAM",
    url: "https://www.bidi.unam.mx/",
    institucion: "UNAM / DGBSDI",
    descripcion: "Libros, revistas y tesis en acceso abierto. Buscar «Macroeconomía» en eTESIUNAM para tesis sobre multiplicador, IS-LM y política fiscal.",
  },
  {
    titulo: "Tesis UNAM – Macroeconomía (eTESIUNAM)",
    url: "https://tesiunam.dgb.unam.mx/",
    institucion: "UNAM / DGB",
    descripcion: "Repositorio de tesis UNAM. Búsqueda por palabra «Macroeconomía» para tesis y trabajos sobre multiplicador keynesiano, IS-LM y demanda agregada.",
  },
  {
    titulo: "Documentos de investigación Banxico (macroeconomía)",
    url: "https://www.banxico.org.mx/DIBM/",
    institucion: "Banco de México",
    descripcion: "Documentos de investigadores de Banxico sobre crecimiento, PIB, política fiscal y monetaria (filtrar por tema macroeconomía).",
  },
  {
    titulo: "La economía mexicana: un balance desde la academia",
    url: "https://repositorio-digital.cide.edu/handle/11651/5906",
    institucion: "CIDE",
    descripcion: "Libro colectivo (2024) con análisis de académicos mexicanos: política monetaria, gasto público, desarrollo y competitividad.",
  },
  {
    titulo: "El Trimestre Económico (FCE)",
    url: "https://www.scielo.org.mx/scielo.php?lng=es&pid=2448-718X&script=sci_serial",
    institucion: "FCE",
    descripcion: "Revista de economía más antigua de América Latina. Artículos de autores mexicanos y latinoamericanos sobre macro y política económica.",
  },
  {
    titulo: "Facultad de Economía UNAM",
    url: "https://www.economia.unam.mx/",
    institucion: "UNAM",
    descripcion: "Página de la FE-UNAM: programas, profesores y publicaciones (Economía UNAM, Investigación Económica) en macro y teoría económica.",
  },
  {
    titulo: "Investigación Económica (UNAM)",
    url: "https://www.revistas.unam.mx/index.php/rie",
    institucion: "UNAM / IIEc",
    descripcion: "Revista del IIEc: paradigmas económicos, desarrollo, economía mexicana y latinoamericana (incluye macro y política fiscal).",
  },
  {
    titulo: "Instituto de Investigaciones Económicas (IIEc-UNAM)",
    url: "https://www.iiec.unam.mx/",
    institucion: "UNAM",
    descripcion: "Instituto de Investigaciones Económicas: investigadores y publicaciones sobre crecimiento, empleo y economía mexicana.",
  },
];

/** Fuentes sobre microeconomía: oferta, demanda, elasticidad, equilibrio */
export const FUENTES_MICRO: FuenteAcademica[] = [
  {
    titulo: "The Economy 2.0 – Microeconomics",
    url: "https://www.core-econ.org/the-economy/microeconomics/",
    institucion: "CORE Econ",
    descripcion: "Libro de texto abierto: oferta y demanda, bienestar, mercados.",
  },
  {
    titulo: "Principles of Microeconomics 3e",
    url: "https://openstax.org/details/books/principles-microeconomics-3e",
    institucion: "OpenStax",
    descripcion: "Manual gratuito: oferta, demanda, elasticidad y eficiencia.",
  },
  {
    titulo: "Price Elasticity of Demand and Supply",
    url: "https://openstax.org/books/principles-microeconomics-3e/pages/5-1-price-elasticity-of-demand-and-price-elasticity-of-supply",
    institucion: "OpenStax",
    descripcion: "Capítulo 5: elasticidad precio de la demanda y de la oferta.",
  },
  {
    titulo: "Supply, Demand and Equilibrium (Khan Academy)",
    url: "https://www.khanacademy.org/economics-finance-domain/microeconomics/supply-demand-equilibrium",
    institucion: "Khan Academy",
    descripcion: "Oferta, demanda y equilibrio de mercado (vídeos).",
  },
  {
    titulo: "Elasticity (Khan Academy)",
    url: "https://www.khanacademy.org/economics-finance-domain/microeconomics/elasticity-topic",
    institucion: "Khan Academy",
    descripcion: "Elasticidad precio, ingreso y cruzada.",
  },
  {
    titulo: "Mankiw Ch. 5 – Elasticity (WEA)",
    url: "https://www.worldeconomicsassociation.org/textbookchapters/mankiw9ch5/",
    institucion: "World Economics Association",
    descripcion: "Comentario al capítulo 5 de Mankiw sobre elasticidad.",
  },
  {
    titulo: "Microeconomics (LibreTexts)",
    url: "https://socialsci.libretexts.org/Bookshelves/Economics/Principles_of_Microeconomics_3e_(LibreTexts)",
    institucion: "LibreTexts",
    descripcion: "Principios de microeconomía: demanda, oferta, excedentes.",
  },
  {
    titulo: "Supply and Demand (EconLib)",
    url: "https://www.econlib.org/library/Enc/SupplyandDemand.html",
    institucion: "EconLib",
    descripcion: "Enciclopedia: oferta, demanda y precios de mercado.",
  },
  {
    titulo: "Elasticity (Investopedia)",
    url: "https://www.investopedia.com/terms/e/elasticity.asp",
    institucion: "Investopedia",
    descripcion: "Definición de elasticidad y tipos (precio, ingreso, cruzada).",
  },
  {
    titulo: "Consumer and Producer Surplus (Lumen)",
    url: "https://courses.lumenlearning.com/wm-microeconomics/chapter/consumer-surplus/",
    institucion: "Lumen Learning",
    descripcion: "Excedente del consumidor y del productor.",
  },
  {
    titulo: "OECD – Competition and Markets",
    url: "https://www.oecd.org/daf/competition/",
    institucion: "OCDE",
    descripcion: "Competencia y funcionamiento de mercados (OCDE).",
  },
  {
    titulo: "Mercados y precios (CEPAL)",
    url: "https://www.cepal.org/es/temas",
    institucion: "CEPAL",
    descripcion: "Temas económicos regionales (estructura de mercados, precios).",
  },
  {
    titulo: "NBER Industrial Organization",
    url: "https://www.nber.org/papers/by-program/IO",
    institucion: "NBER",
    descripcion: "Trabajos sobre organización industrial y mercados.",
  },
  {
    titulo: "Varian – Intermediate Microeconomics (reference)",
    url: "https://www.wwnorton.com/books/9780393934243",
    institucion: "W. W. Norton",
    descripcion: "Libro de referencia: Varian, Intermediate Microeconomics.",
  },
  {
    titulo: "Pindyck & Rubinfeld – Microeconomics (reference)",
    url: "https://www.pearson.com/en-us/subject-catalog/p/microeconomics/P2000000032951",
    institucion: "Pearson",
    descripcion: "Libro de referencia: Microeconomía (demanda, oferta, elasticidad).",
  },
  {
    titulo: "Key Concepts – Microeconomics (OpenStax)",
    url: "https://openstax.org/books/principles-microeconomics-3e/pages/5-key-concepts-and-summary",
    institucion: "OpenStax",
    descripcion: "Resumen de conceptos clave de elasticidad y mercados.",
  },
  {
    titulo: "Biblioteca Digital UNAM",
    url: "https://www.bidi.unam.mx/",
    institucion: "UNAM / DGBSDI",
    descripcion: "Recursos digitales UNAM: libros, revistas y tesis. Útil para profundizar en oferta, demanda y elasticidad con material en español.",
  },
  {
    titulo: "Tesis UNAM (eTESIUNAM)",
    url: "https://tesiunam.dgb.unam.mx/",
    institucion: "UNAM / DGB",
    descripcion: "Tesis digitales UNAM. Buscar «Microeconomía», «oferta y demanda» o «elasticidad» para trabajos académicos de referencia.",
  },
  {
    titulo: "Documentos de investigación Banxico (microeconomía)",
    url: "https://www.banxico.org.mx/DIBM/",
    institucion: "Banco de México",
    descripcion: "Trabajos de Banxico en competencia, mercados y precios (filtrar por microeconomía).",
  },
  {
    titulo: "CIDE – División de Economía",
    url: "https://www.cide.edu/division-academica/economia/",
    institucion: "CIDE",
    descripcion: "Investigación y docencia en economía; incluye competencia económica y mercados (autores mexicanos).",
  },
  {
    titulo: "Repositorio CIDE",
    url: "https://repositorio-digital.cide.edu/",
    institucion: "CIDE",
    descripcion: "Trabajos en acceso abierto sobre economía mexicana, competencia y desarrollo (incluye temas micro).",
  },
  {
    titulo: "Facultad de Economía UNAM",
    url: "https://www.economia.unam.mx/",
    institucion: "UNAM",
    descripcion: "FE-UNAM: programas de microeconomía, profesores y revistas (Economía UNAM, Economía Informa).",
  },
  {
    titulo: "El Trimestre Económico",
    url: "https://www.scielo.org.mx/scielo.php?lng=es&pid=2448-718X&script=sci_serial",
    institucion: "FCE",
    descripcion: "Revista mexicana de economía (FCE): artículos sobre mercados, precios y teoría microeconómica.",
  },
  {
    titulo: "Investigación Económica (UNAM)",
    url: "https://www.revistas.unam.mx/index.php/rie",
    institucion: "UNAM / IIEc",
    descripcion: "Revista del IIEc-UNAM: teoría económica, mercados y economía mexicana (indexada JEL, Conacyt).",
  },
  {
    titulo: "IIEc-UNAM",
    url: "https://www.iiec.unam.mx/",
    institucion: "UNAM",
    descripcion: "Instituto de Investigaciones Económicas: investigación en economía del trabajo, empresas y mercados.",
  },
];

/** Fuentes sobre bancos, instrumentos financieros, deuda y mercado bursátil */
export const FUENTES_FINANZAS: FuenteAcademica[] = [
  {
    titulo: "Sistema financiero mexicano",
    url: "https://www.gob.mx/cnbv",
    institucion: "CNBV",
    descripcion: "Comisión Nacional Bancaria y de Valores: regulación y supervisión de bancos y casas de bolsa.",
  },
  {
    titulo: "Mercado de valores (BMV)",
    url: "https://www.bmv.com.mx",
    institucion: "Bolsa Mexicana de Valores",
    descripcion: "Bolsa Mexicana de Valores: listado de emisores, índices (IPC), instrumentos de deuda y capital.",
  },
  {
    titulo: "Cetes y subastas",
    url: "https://www.banxico.org.mx/monetario/subastas-cetes.html",
    institucion: "Banco de México",
    descripcion: "Subastas de Cetes y otros valores gubernamentales; tasas y resultados.",
  },
  {
    titulo: "Indicadores del mercado de dinero",
    url: "https://www.banxico.org.mx/SieInternet/consultarDirectorioInternetAction.do?accion=consultarCuadro&idCuadro=CE109&locale=es",
    institucion: "Banco de México",
    descripcion: "Tasas de interés de mercado de dinero (Cetes, interbancaria, etc.).",
  },
  {
    titulo: "Instrumentos de inversión (Banxico)",
    url: "https://www.banxico.org.mx/sistemafinanciero/instrumentos-inversion.html",
    institucion: "Banco de México",
    descripcion: "Descripción de Cetes, Bondes, Udibonos y otros valores gubernamentales.",
  },
  {
    titulo: "Educación financiera (Condusef)",
    url: "https://www.condusef.gob.mx/",
    institucion: "Condusef",
    descripcion: "Comisión Nacional para la Protección de los Usuarios de Servicios Financieros: educación y defensa del usuario.",
  },
  {
    titulo: "Mercados financieros (Investopedia)",
    url: "https://www.investopedia.com/terms/f/financial-market.asp",
    institucion: "Investopedia",
    descripcion: "Conceptos de mercados financieros, instrumentos de deuda y capital.",
  },
  {
    titulo: "Bonds and fixed income",
    url: "https://www.investopedia.com/terms/b/bond.asp",
    institucion: "Investopedia",
    descripcion: "Definición de bonos, cupones, rendimiento y riesgo de tasa.",
  },
  {
    titulo: "Stock market basics (SEC)",
    url: "https://www.investor.gov/introduction-investing/investing-basics/what-stock",
    institucion: "SEC (EE.UU.)",
    descripcion: "Introducción a acciones y mercado de valores (educación al inversionista).",
  },
  {
    titulo: "BID – Sistema financiero y desarrollo",
    url: "https://www.iadb.org/es/temas/financiamiento-para-el-desarrollo/sistemas-financieros",
    institucion: "BID",
    descripcion: "Recursos del BID sobre sistemas financieros y mercados de capital en América Latina.",
  },
  {
    titulo: "CEMLA – Mercados financieros",
    url: "https://www.cemla.org/actividades/mercados.html",
    institucion: "CEMLA",
    descripcion: "CEMLA: investigación y eventos sobre mercados financieros y deuda en la región.",
  },
  {
    titulo: "CNBV – Reporte de inclusión financiera",
    url: "https://www.gob.mx/cnbv/articulos/reporte-de-inclusion-financiera",
    institucion: "CNBV",
    descripcion: "Estadísticas de inclusión financiera, bancos y canalización del ahorro.",
  },
];

export const FUENTES_POR_MODULO = {
  inflacion: FUENTES_INFLACION,
  macro: FUENTES_MACRO,
  micro: FUENTES_MICRO,
  finanzas: FUENTES_FINANZAS,
} as const;
