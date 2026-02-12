import type { VariablesSimulacion } from "./types";

export type PaisEconomia = "mexico" | "usa" | "europa" | "principales";

export interface FuenteVariable {
  variable: string;
  queEs: string;
  dondeObtener: string;
  url: string;
  nombreFuente: string;
}

export interface EconomiaConfig {
  id: PaisEconomia;
  nombre: string;
  bandera: string;
  variablesPorDefecto: VariablesSimulacion;
  fuentes: FuenteVariable[];
  fuentesRecomendadas: { nombre: string; url: string; descripcion: string }[];
}

const MEXICO: EconomiaConfig = {
  id: "mexico",
  nombre: "México",
  bandera: "🇲🇽",
  variablesPorDefecto: {
    inflacion: 4.5,
    inflacionSubyacente: 4.2,
    tasaPolitica: 11.0,
    metaInflacion: 3.0,
    tipoPolitica: "restrictiva",
    crecimientoPIB: 2.2,
    brechaProducto: -0.3,
    alphaTaylor: 0.5,
    betaTaylor: 0.5,
  },
  fuentes: [
    {
      variable: "Brecha del producto",
      queEs: "Diferencia entre el PIB observado y el PIB potencial, expresada como % del PIB potencial. Positiva = economía por encima del potencial (presiones inflacionarias); negativa = holgura (capacidad ociosa). Se estima con métodos estadísticos (filtro de Hodrick-Prescott, función de producción, etc.).",
      dondeObtener: "Banxico publica estimaciones en el Informe Trimestral y en el Reporte de Inflación. El INEGI no publica PIB potencial directamente; se usa el de Banxico o de organismos como la OCDE/CEPAL.",
      url: "https://www.banxico.org.mx/publicaciones-y-prensa/informes-trimestrales.html",
      nombreFuente: "Banxico, Informes trimestrales",
    },
    {
      variable: "Crecimiento esperado del PIB",
      queEs: "Previsión de crecimiento del PIB real (a precios constantes) para el año en curso o el siguiente. Refleja expectativas de analistas y del banco central.",
      dondeObtener: "Banxico: Encuesta de Expectativas de los Especialistas en Economía del Sector Privado (crecimiento esperado a 12 meses). También: CEPAL, OCDE, FMI y proyecciones del Banco de México en el Informe Trimestral.",
      url: "https://www.banxico.org.mx/SieInternet/consultarDirectorioInternetAction.do?accion=consultarCuadro&idCuadro=CE136&locale=es",
      nombreFuente: "Banxico, Expectativas (encuesta)",
    },
    {
      variable: "Meta de inflación",
      queEs: "Objetivo de inflación que el banco central se compromete a alcanzar en el mediano plazo. En México es un rango: 3% ± 1 punto porcentual (es decir, 2% a 4%).",
      dondeObtener: "Definida por Banxico y el Gobierno en el acuerdo de política monetaria. Siempre 3% ± 1% desde que se adoptó el esquema de metas de inflación.",
      url: "https://www.banxico.org.mx/marco-normativo/acuerdos-de-política-monetaria.html",
      nombreFuente: "Banxico, Acuerdos de política monetaria",
    },
    {
      variable: "Inflación general y subyacente",
      queEs: "General: variación anual del INPC (Índice Nacional de Precios al Consumidor). Subyacente: excluye mercancías y servicios con precios más volátiles (agropecuarios, energéticos y tarifas autorizadas).",
      dondeObtener: "INEGI publica el INPC e inflación (general y subyacente) mensualmente. Banxico y el INEGI difunden los datos en sus portales.",
      url: "https://www.inegi.org.mx/temas/inpc/",
      nombreFuente: "INEGI, INPC / inflación",
    },
    {
      variable: "Tasa de política monetaria",
      queEs: "Tasa objetivo que Banxico fija como referencia (actualmente la Tasa de Interés Interbancaria a un día). Es el principal instrumento de política monetaria.",
      dondeObtener: "Banxico anuncia la decisión tras cada reunión de la Junta de Gobierno. Histórico y actual en la sección de Tasas de interés.",
      url: "https://www.banxico.org.mx/tipos-de-interes/tasa-de-fondeo-banco-de-mexico.html",
      nombreFuente: "Banxico, Tasa de fondeo",
    },
  ],
  fuentesRecomendadas: [
    { nombre: "Banco de México", url: "https://www.banxico.org.mx", descripcion: "Política monetaria, tasas, expectativas, informes." },
    { nombre: "INEGI", url: "https://www.inegi.org.mx", descripcion: "INPC, PIB, empleo, indicadores coyunturales." },
    { nombre: "Banxico – Expectativas", url: "https://www.banxico.org.mx/SieInternet/consultarDirectorioInternetAction.do?accion=consultarCuadro&idCuadro=CE136&locale=es", descripcion: "Encuesta de expectativas (inflación, crecimiento, tipo de cambio)." },
    { nombre: "Reporte de Inflación (Banxico)", url: "https://www.banxico.org.mx/publicaciones-y-prensa/reportes-de-inflacion.html", descripcion: "Análisis de inflación y perspectivas." },
    { nombre: "OCDE – México", url: "https://www.oecd.org/economy/mexico-economic-snapshot/", descripcion: "Perspectivas y estadísticas comparadas." },
    { nombre: "CEPAL", url: "https://www.cepal.org", descripcion: "Proyecciones y estudios para América Latina." },
  ],
};

const USA: EconomiaConfig = {
  id: "usa",
  nombre: "Estados Unidos",
  bandera: "🇺🇸",
  variablesPorDefecto: {
    inflacion: 3.2,
    inflacionSubyacente: 3.0,
    tasaPolitica: 5.25,
    metaInflacion: 2.0,
    tipoPolitica: "restrictiva",
    crecimientoPIB: 2.1,
    brechaProducto: 0.2,
    alphaTaylor: 0.5,
    betaTaylor: 0.5,
  },
  fuentes: [
    {
      variable: "Brecha del producto",
      queEs: "Diferencia entre el PIB real y el PIB potencial (output gap). La Fed y la CBO (Congressional Budget Office) publican estimaciones del PIB potencial y de la brecha.",
      dondeObtener: "Congressional Budget Office (CBO): potencial y brecha. Fed de San Luis (FRED): series de output gap y PIB potencial.",
      url: "https://www.cbo.gov/data/budget-economic-data",
      nombreFuente: "CBO, Economic data",
    },
    {
      variable: "Crecimiento esperado del PIB",
      queEs: "Previsión de crecimiento del PIB real. La Fed publica proyecciones (Summary of Economic Projections, SEP); también el CBO y encuestas como la de la FED de Philadelphia (SPF).",
      dondeObtener: "Fed: Summary of Economic Projections. Philadelphia Fed: Survey of Professional Forecasters. CBO y FMI.",
      url: "https://www.federalreserve.gov/monetarypolicy/fomc_projtabl.htm",
      nombreFuente: "Fed, Summary of Economic Projections",
    },
    {
      variable: "Meta de inflación",
      queEs: "La Fed tiene un objetivo de inflación del 2% (PCE). Desde 2020 se interpreta como promedio en el tiempo (average inflation targeting).",
      dondeObtener: "Declaraciones y marco de política monetaria de la Fed. Siempre 2% para PCE.",
      url: "https://www.federalreserve.gov/monetarypolicy/files/FOMC_LongerRunGoals.pdf",
      nombreFuente: "Fed, Longer-run goals",
    },
    {
      variable: "Inflación general y subyacente",
      queEs: "En EE.UU. se suele usar el PCE (Personal Consumption Expenditures) o el CPI. La Fed enfatiza el PCE; core PCE excluye alimentos y energía.",
      dondeObtener: "BEA (Bureau of Economic Analysis): PCE. BLS (Bureau of Labor Statistics): CPI. FRED agrega ambas.",
      url: "https://www.bea.gov/data/personal-consumption-expenditures-price-index",
      nombreFuente: "BEA, PCE price index",
    },
    {
      variable: "Tasa de política monetaria",
      queEs: "Federal Funds Rate (tasa de fondos federales), el rango objetivo que fija el FOMC. Es el instrumento principal de la Fed.",
      dondeObtener: "Fed: comunicados del FOMC y tasa de fondos federales. FRED: serie histórica.",
      url: "https://www.federalreserve.gov/monetarypolicy.htm",
      nombreFuente: "Fed, Monetary policy",
    },
  ],
  fuentesRecomendadas: [
    { nombre: "Federal Reserve", url: "https://www.federalreserve.gov", descripcion: "Política monetaria, tasas, proyecciones (SEP)." },
    { nombre: "FRED (Fed St. Louis)", url: "https://fred.stlouisfed.org", descripcion: "Series de tasas, PIB, inflación, brecha." },
    { nombre: "BEA", url: "https://www.bea.gov", descripcion: "PIB, PCE, inflación PCE." },
    { nombre: "CBO", url: "https://www.cbo.gov", descripcion: "PIB potencial y brecha del producto." },
    { nombre: "BLS", url: "https://www.bls.gov", descripcion: "CPI, empleo (Current Population Survey)." },
  ],
};

const EUROPA: EconomiaConfig = {
  id: "europa",
  nombre: "Zona euro",
  bandera: "🇪🇺",
  variablesPorDefecto: {
    inflacion: 2.5,
    inflacionSubyacente: 2.8,
    tasaPolitica: 4.0,
    metaInflacion: 2.0,
    tipoPolitica: "restrictiva",
    crecimientoPIB: 0.8,
    brechaProducto: -0.2,
    alphaTaylor: 0.5,
    betaTaylor: 0.5,
  },
  fuentes: [
    {
      variable: "Brecha del producto",
      queEs: "Output gap: diferencia entre PIB real y PIB potencial. La Comisión Europea y el BCE publican estimaciones.",
      dondeObtener: "Comisión Europea (European Commission): previsiones económicas con output gap. Eurostat y BCE.",
      url: "https://economy-finance.ec.europa.eu/economic-forecast-and-surveys/economic-forecasts_en",
      nombreFuente: "Comisión Europea, Previsiones",
    },
    {
      variable: "Crecimiento esperado del PIB",
      queEs: "Previsión de crecimiento del PIB real de la zona euro. Publicada por la Comisión, el BCE y el FMI.",
      dondeObtener: "Comisión Europea (European Economic Forecast). BCE: proyecciones macroeconómicas.",
      url: "https://www.ecb.europa.eu/pub/projections/html/index.en.html",
      nombreFuente: "BCE, Projections",
    },
    {
      variable: "Meta de inflación",
      queEs: "El BCE tiene un objetivo de inflación del 2% a medio plazo (HICP, armonizado). Desde 2021 se considera simétrico.",
      dondeObtener: "BCE: estrategia de política monetaria. Objetivo 2% sobre el HICP.",
      url: "https://www.ecb.europa.eu/mopo/strategy/html/index.en.html",
      nombreFuente: "BCE, Monetary policy strategy",
    },
    {
      variable: "Inflación general y subyacente",
      queEs: "HICP (Índice Armonizado de Precios de Consumo). La subyacente excluye alimentos no elaborados, energía y tabaco.",
      dondeObtener: "Eurostat: HICP y componentes. BCE: datos de inflación y análisis.",
      url: "https://ec.europa.eu/eurostat/web/hicp",
      nombreFuente: "Eurostat, HICP",
    },
    {
      variable: "Tasa de política monetaria",
      queEs: "Tipos de interés oficiales del BCE: tipo de la facilidad de depósito, de la operación principal de refinanciación y de la facilidad marginal de crédito.",
      dondeObtener: "BCE: decisiones de tipos de interés y comunicados del Consejo de Gobierno.",
      url: "https://www.ecb.europa.eu/stats/policy_and_exchange_rates/key_ecb_interest_rates/html/index.en.html",
      nombreFuente: "BCE, Key interest rates",
    },
  ],
  fuentesRecomendadas: [
    { nombre: "Banco Central Europeo", url: "https://www.ecb.europa.eu", descripcion: "Política monetaria, tipos, proyecciones." },
    { nombre: "Eurostat", url: "https://ec.europa.eu/eurostat", descripcion: "HICP, PIB, empleo zona euro." },
    { nombre: "Comisión Europea (Previsiones)", url: "https://economy-finance.ec.europa.eu/economic-forecast-and-surveys_en", descripcion: "Output gap y crecimiento esperado." },
    { nombre: "FMI – Zona euro", url: "https://www.imf.org/en/Countries/EMU", descripcion: "Perspectivas y datos comparados." },
  ],
};

const PRINCIPALES: EconomiaConfig = {
  id: "principales",
  nombre: "Otras economías (referencia)",
  bandera: "🌐",
  variablesPorDefecto: {
    inflacion: 2.8,
    inflacionSubyacente: 2.6,
    tasaPolitica: 4.5,
    metaInflacion: 2.0,
    tipoPolitica: "neutral",
    crecimientoPIB: 1.5,
    brechaProducto: 0,
    alphaTaylor: 0.5,
    betaTaylor: 0.5,
  },
  fuentes: [
    {
      variable: "Brecha del producto",
      queEs: "Estimaciones de output gap para distintas economías. OCDE y FMI publican series y proyecciones para países avanzados y emergentes.",
      dondeObtener: "OCDE Economic Outlook, FMI WEO (World Economic Outlook), BIS.",
      url: "https://www.imf.org/en/Publications/WEO",
      nombreFuente: "FMI, World Economic Outlook",
    },
    {
      variable: "Crecimiento esperado y meta de inflación",
      queEs: "Proyecciones de crecimiento y metas de inflación por país. Cada banco central define su meta (p. ej. Reino Unido 2%, Canadá 2%).",
      dondeObtener: "FMI WEO, OCDE, bancos centrales (BoE, BoC, BoJ, etc.).",
      url: "https://www.oecd.org/economic-outlook/",
      nombreFuente: "OCDE, Economic Outlook",
    },
    {
      variable: "Inflación y tasas de política",
      queEs: "Datos de inflación y tasas de interés por país. Los bancos centrales publican sus decisiones; BIS y FMI agregan comparaciones.",
      dondeObtener: "BIS statistics, FMI, OCDE. Por país: BoE (UK), BoC (Canadá), BoJ (Japón), etc.",
      url: "https://www.bis.org/statistics/",
      nombreFuente: "BIS, Statistics",
    },
  ],
  fuentesRecomendadas: [
    { nombre: "FMI – World Economic Outlook", url: "https://www.imf.org/en/Publications/WEO", descripcion: "Proyecciones globales y por país." },
    { nombre: "OCDE", url: "https://www.oecd.org", descripcion: "Economic Outlook, estadísticas comparadas." },
    { nombre: "BIS", url: "https://www.bis.org", descripcion: "Estadísticas de bancos centrales y tasas." },
    { nombre: "Banco de Inglaterra", url: "https://www.bankofengland.co.uk", descripcion: "UK: tasas, inflación, proyecciones." },
    { nombre: "Banco de Japón", url: "https://www.boj.or.jp", descripcion: "Japón: política monetaria y datos." },
  ],
};

export const ECONOMIAS: EconomiaConfig[] = [MEXICO, USA, EUROPA, PRINCIPALES];

export function getEconomia(id: PaisEconomia): EconomiaConfig {
  const found = ECONOMIAS.find((e) => e.id === id);
  if (!found) return MEXICO;
  return found;
}
