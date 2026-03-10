import BlockQuote from "@/components/blog/BlockQuote";
import FormulaBox from "@/components/blog/FormulaBox";
import ImageWithCaption from "@/components/blog/ImageWithCaption";
import ReferencesList from "@/components/blog/ReferencesList";

export function EjemploReglaTaylorContent() {
  return (
    <>
      <p className="leading-relaxed text-slate-700 dark:text-slate-300 mb-4">
        La Regla de Taylor (Taylor, 1993) es una fórmula de referencia que relaciona la tasa de interés de política monetaria con la inflación observada, la meta de inflación y la brecha de producto. No pretende ser un mandato mecánico para los bancos centrales, sino un benchmark para evaluar si la postura monetaria es expansiva o restrictiva.
      </p>

      <FormulaBox
        formula="i = r* + π* + α(π - π*) + β(y - y*)"
        label="Regla de Taylor (forma estándar)"
      />

      <p className="leading-relaxed text-slate-700 dark:text-slate-300 mb-4">
        Donde <em>i</em> es la tasa de política, <em>r*</em> la tasa real neutral, <em>π</em> la inflación observada, <em>π*</em> la meta, <em>y − y*</em> la brecha de producto. Los coeficientes α y β suelen tomar valores alrededor de 0.5 en la especificación original.
      </p>

      <BlockQuote
        quote="When the Fed raises the interest rate in response to an inflation rate that is above the target, it is said to be following the Taylor rule."
        author="John B. Taylor"
        source="Discretion versus policy rules in practice (1993)"
      />

      <p className="leading-relaxed text-slate-700 dark:text-slate-300 mb-4">
        En la práctica, los bancos centrales no siguen la regla al pie de la letra: existen incertidumbre sobre los datos, rezagos en la transmisión y consideraciones de estabilidad financiera. Aun así, la regla sirve como referencia de comunicación y para comparar la postura actual con una recomendación simple.
      </p>

      <ReferencesList
        references={[
          {
            id: "1",
            text: "Taylor, J. B. (1993). Discretion versus policy rules in practice. Carnegie-Rochester Conference Series on Public Policy, 39, 195-214.",
            href: "https://doi.org/10.1016/0167-2231(93)90009-L",
          },
          {
            id: "2",
            text: "Banco de México. Documentos de investigación y política monetaria.",
            href: "https://www.banxico.org.mx",
          },
        ]}
      />
    </>
  );
}

function InflacionSubyacenteGeneralContent() {
  return (
    <>
      <p className="leading-relaxed text-slate-700 dark:text-slate-300 mb-4">
        La inflación general y la inflación subyacente son dos indicadores que el Banco de México y el INEGI publican con periodicidad mensual. Aunque la primera suele acaparar los titulares, la segunda es la referencia principal para la política monetaria. Entender la distinción es crucial para interpretar las decisiones de Banxico y las expectativas de los mercados.
      </p>

      <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-8 mb-4">¿Qué es la inflación general?</h2>
      <p className="leading-relaxed text-slate-700 dark:text-slate-300 mb-4">
        La inflación general es la variación porcentual del Índice Nacional de Precios al Consumidor (INPC) en un periodo dado (mensual o anual). El INPC mide la evolución de los precios de una canasta fija de bienes y servicios representativa del consumo de los hogares en México. Incluye todos los componentes: alimentos no elaborados, energéticos, tarifas reguladas y el resto de bienes y servicios.
      </p>

      <FormulaBox
        formula="π_general = [(INPC_t - INPC_{t-12}) / INPC_{t-12}] × 100"
        label="Inflación general anual"
      />

      <p className="leading-relaxed text-slate-700 dark:text-slate-300 mb-4">
        Es el indicador más citado por medios y hogares porque refleja el costo de vida actual. Sin embargo, algunos de sus componentes son muy volátiles: una sequía puede disparar el precio de alimentos, el petróleo puede subir por tensiones geopolíticas o por decisiones de la OPEP. Esos choques pueden distorsionar la señal sobre la tendencia inflacionaria de fondo.
      </p>

      <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-8 mb-4">¿Qué es la inflación subyacente?</h2>
      <p className="leading-relaxed text-slate-700 dark:text-slate-300 mb-4">
        La inflación subyacente excluye de la canasta del INPC los componentes más volátiles: mercancías y servicios con precios fijados o administrados por el gobierno (energéticos, tarifas), y productos agropecuarios no elaborados (frutas, verduras, huevo). El objetivo es captar la tendencia de mediano plazo de la inflación, libre de choques temporales.
      </p>

      <BlockQuote
        quote="La inflación subyacente es la referencia principal para la conducción de la política monetaria."
        author="Banco de México"
        source="Informes de inflación"
      />

      <p className="leading-relaxed text-slate-700 dark:text-slate-300 mb-4">
        Banxico usa la inflación subyacente como guía porque responde mejor a la holgura de la economía y a las expectativas. Si el banco sube la tasa cada vez que la inflación general repunta por un choque de oferta (por ejemplo sequía de jitomate), podría estar generando volatilidad innecesaria en el producto y el empleo sin resolver el problema de fondo.
      </p>

      <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-8 mb-4">¿Por qué pueden divergir?</h2>
      <p className="leading-relaxed text-slate-700 dark:text-slate-300 mb-4">
        La inflación general y la subyacente pueden moverse en direcciones opuestas. Un alza de precios de energéticos o de alimentos no elaborados eleva la general pero puede no afectar la subyacente. Por el contrario, presiones de demanda en servicios o en bienes manufacturados suelen reflejarse en ambas. La divergencia indica si el impulso inflacionario viene del lado de la oferta (volátil) o de la demanda (más persistente).
      </p>

      <ReferencesList
        references={[
          { id: "1", text: "INEGI. Índice Nacional de Precios al Consumidor. Metodología y series.", href: "https://www.inegi.org.mx/temas/inpc/" },
          { id: "2", text: "Banco de México. Informes de inflación y comunicados de política monetaria.", href: "https://www.banxico.org.mx" },
          { id: "3", text: "Bryan, M. F. y Cecchetti, S. G. (1994). Measuring core inflation. NBER Working Paper.", href: "https://www.nber.org/papers/w4303" },
        ]}
      />
    </>
  );
}

function ComoLeerMinutaBanxicoContent() {
  return (
    <>
      <p className="leading-relaxed text-slate-700 dark:text-slate-300 mb-4">
        Las minutas de política monetaria del Banco de México se publican el jueves siguiente a cada decisión de tasa. Son el documento más esperado por analistas y mercados porque revelan el razonamiento del Board, la votación y las señales sobre la trayectoria futura. Esta guía te ayuda a interpretarlas paso a paso.
      </p>

      <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-8 mb-4">Estructura general</h2>
      <p className="leading-relaxed text-slate-700 dark:text-slate-300 mb-4">
        Una minuta típica incluye: (1) contexto del entorno externo e interno, (2) análisis de inflación y expectativas, (3) análisis de actividad económica y empleo, (4) balance de riesgos, (5) deliberación y votación, y (6) forward guidance. Cada sección aporta información clave para anticipar la siguiente decisión.
      </p>

      <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-8 mb-4">Qué buscar en el análisis de inflación</h2>
      <p className="leading-relaxed text-slate-700 dark:text-slate-300 mb-4">
        Presta atención a si la inflación subyacente se describe como «en línea con la meta», «por encima» o «por debajo». Las frases sobre «presiones inflacionarias» o «holgura» indican el diagnóstico. Si mencionan que las expectativas de mediano plazo «se mantienen ancladas» o «han mostrado señales de desanclaje», es una señal fuerte sobre la credibilidad del banco.
      </p>

      <BlockQuote
        quote="Las expectativas de inflación de mediano y largo plazo se mantienen ancladas en la meta."
        author="Banco de México"
        source="Minuta típica"
      />

      <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-8 mb-4">La votación y el forward guidance</h2>
      <p className="leading-relaxed text-slate-700 dark:text-slate-300 mb-4">
        La votación indica si hubo unanimidad o disensión. Un voto en contra puede señalar que la postura se está endureciendo o ablandando. El forward guidance —las frases sobre la trayectoria futura— suele estar al final del párrafo de deliberación. Si dicen que «mantendrán una postura restrictiva el tiempo necesario», esperan más subidas o mantener la tasa en niveles altos. Si hablan de «evaluar el ritmo de ajuste», la puerta a una pausa o bajada se abre.
      </p>

      <ReferencesList
        references={[
          { id: "1", text: "Banco de México. Minutas de política monetaria.", href: "https://www.banxico.org.mx/publicaciones-y-prensa/minutas-de-decisiones-de-politica-monetaria" },
          { id: "2", text: "Banco de México. Comunicados de política monetaria.", href: "https://www.banxico.org.mx/publicaciones-y-prensa/comunicados-de-politica-monetaria" },
        ]}
      />
    </>
  );
}

function ModeloISLMContent() {
  return (
    <>
      <p className="leading-relaxed text-slate-700 dark:text-slate-300 mb-4">
        El modelo IS-LM es el marco estándar para analizar la interacción entre el mercado de bienes y el mercado de dinero en el corto plazo. Desarrollado por Hicks y Hansen a partir de la Teoría General de Keynes, permite entender cómo la política fiscal y monetaria afectan la renta y el tipo de interés de equilibrio.
      </p>

      <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-8 mb-4">La curva IS</h2>
      <p className="leading-relaxed text-slate-700 dark:text-slate-300 mb-4">
        La curva IS representa las combinaciones de renta (Y) y tipo de interés (r) para las cuales el mercado de bienes está en equilibrio: la demanda agregada (C + I + G + X - M) iguala al producto. Tiene pendiente negativa: una tasa más alta reduce la inversión y, por tanto, la demanda y el producto.
      </p>

      <FormulaBox
        formula="Y = C(Y - T) + I(r) + G + X - M"
        label="Equilibrio en el mercado de bienes (IS)"
      />

      <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-8 mb-4">La curva LM</h2>
      <p className="leading-relaxed text-slate-700 dark:text-slate-300 mb-4">
        La curva LM representa las combinaciones de Y y r para las cuales el mercado de dinero está en equilibrio: la oferta real de dinero (M/P) iguala a la demanda de saldos reales. Tiene pendiente positiva: mayor renta aumenta la demanda de dinero y, para mantener el equilibrio, la tasa debe subir.
      </p>

      <FormulaBox
        formula="M/P = L(Y, r)"
        label="Equilibrio en el mercado de dinero (LM)"
      />

      <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-8 mb-4">Efectos de política</h2>
      <p className="leading-relaxed text-slate-700 dark:text-slate-300 mb-4">
        Una política fiscal expansiva (aumento de G o reducción de T) desplaza la IS a la derecha: sube la renta y el tipo de interés. Una política monetaria expansiva (aumento de M) desplaza la LM a la derecha: sube la renta y baja el tipo de interés. El modelo IS-LM es la base del Mundell-Fleming para economías abiertas.
      </p>

      <BlockQuote
        quote="The IS-LM model remains the workhorse of short-run macroeconomics."
        author="Olivier Blanchard"
        source="Macroeconomics (7th ed.)"
      />

      <ReferencesList
        references={[
          { id: "1", text: "Hicks, J. R. (1937). Mr. Keynes and the Classics. Econometrica.", href: "https://www.jstor.org/stable/1907242" },
          { id: "2", text: "Mankiw, N. G. (2019). Macroeconomics. Worth Publishers.", href: "" },
        ]}
      />
    </>
  );
}

function DCFPasoaPasoContent() {
  return (
    <>
      <p className="leading-relaxed text-slate-700 dark:text-slate-300 mb-4">
        La valoración por descuento de flujos de caja (DCF) es el método teórico de referencia en finanzas corporativas. El valor de una empresa o un activo es el valor presente de los flujos de caja libres futuros esperados, descontados a una tasa que refleje el riesgo. Esta guía recorre los pasos: FCF, WACC y valor terminal.
      </p>

      <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-8 mb-4">Paso 1: Flujo de caja libre (FCF)</h2>
      <p className="leading-relaxed text-slate-700 dark:text-slate-300 mb-4">
        El FCF es el efectivo generado por la operación después de impuestos, menos las inversiones en capital de trabajo y activos fijos necesarios para mantener o expandir el negocio. Es el flujo disponible para acreedores y accionistas.
      </p>

      <FormulaBox
        formula="FCF = EBIT × (1 - T) + Depreciación - CapEx - ΔCapital de trabajo"
        label="Flujo de caja libre"
      />

      <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-8 mb-4">Paso 2: WACC (tasa de descuento)</h2>
      <p className="leading-relaxed text-slate-700 dark:text-slate-300 mb-4">
        El WACC es el costo promedio ponderado del capital: combina el costo del equity (Ke, típicamente con CAPM) y el costo de la deuda después de impuestos (Kd × (1-T)), ponderados por la proporción de cada uno en la estructura de capital.
      </p>

      <FormulaBox
        formula="WACC = (E/V) × Ke + (D/V) × Kd × (1 - T)"
        label="Costo promedio ponderado del capital"
      />

      <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-8 mb-4">Paso 3: Valor terminal</h2>
      <p className="leading-relaxed text-slate-700 dark:text-slate-300 mb-4">
        El valor terminal captura el valor de los flujos más allá del horizonte explícito de proyección. Suele calcularse con crecimiento perpetuo: VT = FCF_{n+1} / (r - g), donde r es el WACC y g la tasa de crecimiento a largo plazo. La hipótesis de g debe ser conservadora (no superior al crecimiento de la economía).
      </p>

      <FormulaBox
        formula="VT = FCF_{n+1} / (WACC - g)"
        label="Valor terminal (crecimiento perpetuo)"
      />

      <BlockQuote
        quote="The value of any asset is the present value of the expected cash flows on that asset."
        author="Aswath Damodaran"
        source="Investment Valuation"
      />

      <ReferencesList
        references={[
          { id: "1", text: "Damodaran, A. Investment Valuation. Wiley.", href: "" },
          { id: "2", text: "Banco de México. Documentos de investigación.", href: "https://www.banxico.org.mx" },
        ]}
      />
    </>
  );
}

function ElasticidadPrecioDemandaContent() {
  return (
    <>
      <p className="leading-relaxed text-slate-700 dark:text-slate-300 mb-4">
        La elasticidad precio de la demanda mide la sensibilidad de la cantidad demandada ante cambios en el precio. Es un concepto central en microeconomía con aplicaciones directas en política de precios, imposición tributaria y análisis de bienestar. Un valor absoluto mayor que 1 indica demanda elástica; menor que 1, inelástica.
      </p>

      <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-8 mb-4">Fórmula de elasticidad precio</h2>
      <p className="leading-relaxed text-slate-700 dark:text-slate-300 mb-4">
        La elasticidad precio de la demanda mide el cambio porcentual en la cantidad demandada dividido por el cambio porcentual en el precio. En el punto: ε = (dQ/dP) × (P/Q). En arco (entre dos puntos) se usa el promedio de precios y cantidades como base para evitar asimetría.
      </p>

      <FormulaBox
        formula="ε = (ΔQ/Q) / (ΔP/P) = (ΔQ/ΔP) × (P/Q)"
        label="Elasticidad precio de la demanda"
      />

      <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-8 mb-4">Demanda elástica vs. inelástica</h2>
      <p className="leading-relaxed text-slate-700 dark:text-slate-300 mb-4">
        Si |ε| &gt; 1, la demanda es elástica: un aumento de 1% en el precio reduce la cantidad en más de 1%. El ingreso total del vendedor disminuye al subir el precio. Si |ε| &lt; 1, la demanda es inelástica: el ingreso total aumenta al subir el precio. Los bienes necesarios o con pocos sustitutos suelen tener demanda inelástica.
      </p>

      <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-8 mb-4">Aplicación en impuestos</h2>
      <p className="leading-relaxed text-slate-700 dark:text-slate-300 mb-4">
        La incidencia de un impuesto depende de las elasticidades. Si la demanda es más inelástica que la oferta, los consumidores absorben una mayor parte del impuesto (el precio sube más). Si la oferta es más inelástica, los productores absorben más. Los impuestos sobre bienes de demanda inelástica recaudan más pero generan mayor pérdida de bienestar por la reducción de la cantidad transada.
      </p>

      <BlockQuote
        quote="The elasticity of demand measures the responsiveness of quantity demanded to a change in price."
        author="Paul Samuelson"
        source="Economics"
      />

      <ReferencesList
        references={[
          { id: "1", text: "Varian, H. R. Microeconomía intermedia. Antoni Bosch.", href: "" },
          { id: "2", text: "Pindyck, R. S. y Rubinfeld, D. L. Microeconomía. Pearson.", href: "" },
        ]}
      />
    </>
  );
}

function BrechaProductoContent() {
  return (
    <>
      <p className="leading-relaxed text-slate-700 dark:text-slate-300 mb-4">
        La brecha de producto es la diferencia porcentual entre el PIB observado y el PIB potencial. Cuando es positiva, la economía opera por encima de su capacidad y suelen aparecer presiones inflacionarias; cuando es negativa, hay holgura y el banco central puede mantener o bajar la tasa. Es un insumo clave de la Regla de Taylor y de la política monetaria.
      </p>

      <FormulaBox
        formula="brecha = (Y - Y*) / Y* × 100"
        label="Brecha de producto"
      />

      <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-8 mb-4">¿Qué es el PIB potencial?</h2>
      <p className="leading-relaxed text-slate-700 dark:text-slate-300 mb-4">
        El PIB potencial es el nivel máximo de producto que la economía puede sostener en el mediano plazo sin generar presiones inflacionarias insostenibles. Refleja la capacidad productiva: capital, trabajo, tecnología y la NAIRU (tasa de desempleo no aceleradora de la inflación). No es observable directamente; se estima con modelos.
      </p>

      <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-8 mb-4">Métodos de estimación</h2>
      <p className="leading-relaxed text-slate-700 dark:text-slate-300 mb-4">
        Los métodos más usados son: (1) filtro de Hodrick-Prescott: descompone el PIB en tendencia (potencial) y ciclo (brecha); (2) función de producción: estima el potencial con capital, trabajo y PTF; (3) modelos de estado espacio (Laubach-Williams): combinan la curva de Phillips con datos de inflación y producto. La estimación es incierta y se revisa con datos nuevos.
      </p>

      <BlockQuote
        quote="The output gap is a key input for monetary policy decisions, but it is unobservable and must be estimated."
        author="Federal Reserve"
        source="Monetary Policy Report"
      />

      <ReferencesList
        references={[
          { id: "1", text: "INEGI. Sistema de Cuentas Nacionales. PIB y series.", href: "https://www.inegi.org.mx/temas/pib/" },
          { id: "2", text: "Banco de México. Documentos de investigación. Estimación de brecha.", href: "https://www.banxico.org.mx/DIBM/" },
          { id: "3", text: "Laubach, T. y Williams, J. C. (2003). Measuring the natural rate of interest. Review of Economics and Statistics.", href: "" },
        ]}
      />
    </>
  );
}

/** Mapa slug → componente de contenido. Añade aquí nuevos artículos. */
export const BLOG_CONTENT: Record<string, () => JSX.Element> = {
  "ejemplo-regla-taylor": EjemploReglaTaylorContent,
  "inflacion-subyacente-vs-general": InflacionSubyacenteGeneralContent,
  "como-leer-minuta-banxico": ComoLeerMinutaBanxicoContent,
  "modelo-is-lm-politica": ModeloISLMContent,
  "dcf-paso-a-paso": DCFPasoaPasoContent,
  "elasticidad-precio-demanda": ElasticidadPrecioDemandaContent,
  "brecha-producto-estimacion": BrechaProductoContent,
};
