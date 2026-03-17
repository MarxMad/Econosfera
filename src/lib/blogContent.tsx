import BlockQuote from "@/components/blog/BlockQuote";
import FormulaBox from "@/components/blog/FormulaBox";
import ImageWithCaption from "@/components/blog/ImageWithCaption";
import ReferencesList from "@/components/blog/ReferencesList";
import KeyTakeaways from "@/components/blog/KeyTakeaways";
import NewsletterBox from "@/components/blog/NewsletterBox";
import SimulatorCTA from "@/components/blog/SimulatorCTA";

export function EjemploReglaTaylorContent() {
  return (
    <>
      <KeyTakeaways
        points={[
          "Relaciona la tasa nominal con la inflación y el producto.",
          "Fue propuesta por John B. Taylor en 1993.",
          "Busca la estabilidad de precios y el pleno empleo.",
          "Es un benchmark, no una regla rígida para Banxico."
        ]}
      />

      <p>
        La <strong>Regla de Taylor</strong> es quizás la herramienta de consulta más importante para entender cómo los bancos centrales, como el Banco de México (Banxico) o la Reserva Federal (Fed), ajustan las tasas de interés. Lejos de ser un algoritmo ciego, la regla proporciona un marco lógico para equilibrar dos objetivos a menudo contradictorios: <strong>estabilidad de precios</strong> y <strong>crecimiento económico</strong>.
      </p>
      <p>
        En este artículo revisamos el origen de la regla, el significado de cada variable, su aplicación en México y las limitaciones que deben tener en cuenta tanto estudiantes como profesionales que siguen las decisiones del Banxico.
      </p>

      <h2 id="origen">1. El Origen: ¿Por qué una regla?</h2>
      <p>
        Antes de 1993, la política monetaria era vista a menudo como un "arte" oscuro. John B. Taylor demostró que se podía describir el comportamiento de la Fed con una fórmula sorprendentemente simple. Su propuesta resolvió el problema de la <em>inconsistencia dinámica</em>: si los mercados saben cómo reaccionará el banco, las expectativas se anclan y la inflación baja.
      </p>
      <p>
        La regla no fue diseñada como una prescripción obligatoria, sino como una <strong>descripción</strong> de una política monetaria coherente. Cuando el banco central sigue una regla creíble, los agentes forman expectativas de inflación más estables y el trade-off entre inflación y desempleo mejora. Por eso hoy forma parte del lenguaje común de los informes de inflación y de las minutas de política.
      </p>

      <FormulaBox
        formula="i = r* + π + 0.5(π - π*) + 0.5(y - y*)"
        label="La Ecuación Original de Taylor (1993)"
      />

      <h2 id="componentes">2. Desglose de los Componentes</h2>
      <p>
        Cada término de la ecuación tiene un rol preciso. La tasa nominal recomendada (i) se construye a partir de la tasa real neutral, la inflación actual y dos correcciones: una por la brecha de inflación y otra por la brecha de producto.
      </p>
      <ul>
        <li><strong>r* (Tasa Real Neutral):</strong> Es la tasa que no expande ni contrae la economía. En México, Banxico estima que se sitúa entre el 1.8% y 3.4%. No es observable directamente; se obtiene con modelos o filtros estadísticos y puede variar en el tiempo por cambios en la productividad o en la demografía.</li>
        <li><strong>π - π* (Brecha de Inflación):</strong> La diferencia entre la inflación actual (o esperada) y la meta. En México la meta es 3% con banda de ±1%. Una brecha positiva indica que la inflación está por encima del objetivo y suele justificar una subida de tasa.</li>
        <li><strong>y - y* (Brecha de Producto):</strong> El porcentaje en que el PIB observado se desvía del PIB potencial. Se estima con filtros (Hodrick-Prescott, por ejemplo) o con modelos de producción. Una brecha positiva implica que la economía está "sobrecalentada" y refuerza el argumento para tasas más altas.</li>
      </ul>
      <p>
        Los coeficientes 0.5 en la ecuación original indican que el banco reacciona igual de fuerte a desviaciones de inflación y a desviaciones del producto. En la práctica muchos bancos usan coeficientes distintos; lo importante es que el coeficiente de la brecha de inflación sea <strong>mayor que 1</strong> (Principio de Taylor) para que la tasa real suba cuando la inflación sube y la política sea estabilizadora.
      </p>

      <SimulatorCTA
        title="Simulador de Regla de Taylor"
        description="Ajusta la tasa neutral y la meta de inflación para ver cómo debería reaccionar Banxico hoy mismo."
        href="/simulador?tab=taylor"
      />

      <h2 id="practica">3. La Regla en México</h2>
      <p>
        En una economía abierta como la mexicana, la regla suele extenderse para incluir el <strong>tipo de cambio</strong> y la <strong>tasa de la Fed</strong>. Banxico debe considerar que una subida excesiva podría apreciar demasiado el peso, afectando a las exportaciones, mientras que quedarse corto ante la Fed podría causar fugas de capital y depreciación.
      </p>
      <p>
        Los documentos de investigación del Banco de México publican periódicamente estimaciones de la tasa neutral (r*) y de la brecha de producto. Los analistas del mercado suelen comparar la tasa de fondeo vigente con la que arrojaría una regla de Taylor "estándar" o "modificada" para México, lo que genera expectativas sobre el sesgo de la siguiente decisión (alcista, neutral o recortes).
      </p>
      <p>
        Cuando la tasa vigente está por <strong>debajo</strong> de la que sugiere la regla, se dice que la política está "acomodaticia" respecto a la regla y existe espacio para subidas si la inflación no cede. Cuando está por <strong>encima</strong>, el sesgo podría ser hacia pausas o recortes en el siguiente ciclo. Esta comparación no sustituye el análisis de las minutas y del forward guidance, pero da un primer marco cuantitativo.
      </p>

      <h2 id="limitaciones">4. Limitaciones y Críticas</h2>
      <p>
        La regla no captura shocks financieros ni riesgos de cola; tampoco sustituye el juicio del comité. En épocas de crisis, los bancos centrales pueden desviarse deliberadamente de la regla para evitar una recesión profunda o para dar prioridad a la estabilidad financiera. Por eso se dice que la regla es una <strong>referencia</strong>, no un mandato mecánico.
      </p>
      <p>
        Otras críticas habituales: la brecha de producto es difícil de estimar en tiempo real y se revisa mucho ex post; la tasa neutral también es incierta; y la regla no incorpora el tipo de cambio ni las condiciones financieras globales. Aun así, dominar la regla de Taylor permite leer con más criterio los informes de inflación y las declaraciones de los banqueros centrales.
      </p>

      <BlockQuote
        quote="La política monetaria debe ser sistemática pero no mecánica. La Regla de Taylor es una brújula, no un piloto automático."
        author="Analista Senior de Econosfera"
        source="Reporte Especial 2025"
      />

      <NewsletterBox />

      <h2 id="conclusion">5. Conclusión para Estudiantes</h2>
      <p>
        Para fines de consulta académica, recuerda que el "Principio de Taylor" dicta que el banco central debe subir la tasa nominal <strong>más</strong> que proporcionalmente al aumento de la inflación. Si la inflación sube 1%, la tasa debería subir más de 1% para que la tasa <em>real</em> suba y realmente frene la demanda.
      </p>
      <p>
        En resumen: la regla de Taylor es una brújula para interpretar si la política monetaria es restrictiva o expansiva respecto a un benchmark simple. Combinarla con la lectura de las minutas y con las expectativas del mercado te dará una visión más completa de hacia dónde pueden moverse las tasas en México y en el mundo.
      </p>

      <ReferencesList
        references={[
          {
            id: "1",
            text: "Taylor, J. B. (1993). Discretion versus policy rules in practice. Carnegie-Rochester Conference Series on Public Policy.",
            href: "https://doi.org/10.1016/0167-2231(93)90009-L",
          },
          {
            id: "2",
            text: "Banxico (2024). Informe Trimestral: Evolución de las tasas de interés neutrales.",
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
      <KeyTakeaways
        points={[
          "La inflación general incluye todos los bienes (INPC).",
          "La subyacente excluye energía y alimentos volátiles.",
          "Banxico usa la subyacente para 'leer' la tendencia de largo plazo.",
          "Choques de oferta (sequías, guerras) afectan más a la no subyacente."
        ]}
      />

      <p className="leading-relaxed text-slate-700 dark:text-slate-300 mb-6">
        La inflación general y la inflación subyacente son dos indicadores que el Banco de México y el INEGI publican con periodicidad quincenal y mensual. Aunque la primera suele acaparar los titulares, la segunda es la <strong>referencia principal</strong> para la política monetaria. Entender la distinción es crucial para interpretar las decisiones de Banxico y las expectativas de los mercados.
      </p>
      <p className="leading-relaxed text-slate-700 dark:text-slate-300 mb-6">
        En este artículo se explica qué mide cada indicador, por qué los bancos centrales prestan más atención a la subyacente, y cómo usar ambos números el día de la publicación del INPC para formarse una idea del sesgo de la siguiente decisión de política monetaria.
      </p>

      <h2 id="general">1. La Inflación General: El Costo de Vida Original</h2>
      <p className="leading-relaxed text-slate-700 dark:text-slate-300 mb-4">
        Es la variación del Índice Nacional de Precios al Consumidor (INPC). Mide cuánto ha subido el promedio de <strong>todos</strong> los precios de una canasta representativa del consumo mexicano.
      </p>

      <FormulaBox
        formula="π_{gen} = \frac{INPC_t - INPC_{t-1}}{INPC_{t-1}} \times 100"
        label="Variación porcentual del INPC"
      />

      <p className="leading-relaxed text-slate-700 dark:text-slate-300 mb-4">
        Su principal desventaja para un banco central es el <strong>ruido</strong>. Si el precio del limón sube 200% por una helada, la inflación general subirá, pero ese aumento no es culpa de que haya "demasiado dinero" en la calle. Es un choque de oferta temporal.
      </p>
      <p className="leading-relaxed text-slate-700 dark:text-slate-300 mb-4">
        El INEGI publica la inflación general cada quincena (las dos primeras quincenas del mes) y mensualmente. Los medios suelen destacar este número porque refleja el costo de vida que perciben los hogares; sin embargo, para tomar decisiones de política monetaria, Banxico pone mayor peso en la inflación subyacente.
      </p>

      <h2 id="subyacente">2. La Inflación Subyacente: El Corazón de la Tendencia</h2>
      <p className="leading-relaxed text-slate-700 dark:text-slate-300 mb-4">
        Este indicador <strong>limpia</strong> la canasta, eliminando los componentes que "ensucian" la señal. Excluye:
      </p>
      <ul className="list-disc pl-6 space-y-2 mb-4 text-slate-700 dark:text-slate-300">
        <li><strong>Agropecuarios:</strong> Frutas y verduras (sujetos a clima).</li>
        <li><strong>Energéticos y tarifas:</strong> Gasolina, luz, gas (sujetos a geopolítica o subsidios).</li>
      </ul>
      <p className="leading-relaxed text-slate-700 dark:text-slate-300 mb-4">
        Al excluir estos componentes, el indicador subyacente refleja mejor la presión de demanda y las expectativas de inflación que el banco central puede influir con la tasa de interés. En México, la meta de inflación de Banxico (3% ± 1%) se interpreta en la práctica como una meta sobre la inflación subyacente en el mediano plazo.
      </p>
      <p className="leading-relaxed text-slate-700 dark:text-slate-300 mb-6">
        La subyacente se calcula con la misma metodología que la general (variación porcentual del índice correspondiente), pero el índice excluye los genéricos volátiles. El INEGI y Banxico publican ambos indicadores en el mismo comunicado, lo que permite comparar de inmediato la trayectoria de cada uno y detectar si un repunte de la general es "ruido" o si la subyacente también está acelerando.
      </p>

      <BlockQuote
        quote="La inflación subyacente refleja la verdadera presión de demanda y es la que Banxico puede controlar mediante la tasa de interés."
        author="Econosfera Research"
      />

      <SimulatorCTA
        title="Simulador de Inflación"
        description="Analiza cómo los choques en el componente no subyacente afectan el poder adquisitivo real en México."
        href="/simulador?tab=inflacion"
      />

      <h2 id="divergencia">3. ¿Por qué es peligrosa la divergencia?</h2>
      <p className="leading-relaxed text-slate-700 dark:text-slate-300 mb-4">
        Cuando la inflación subyacente sube y se mantiene alta (resistencia a bajar), se dice que la inflación está <strong>"contaminando"</strong> otros precios. Esto suele forzar a Banxico a mantener tasas restrictivas por más tiempo, incluso si la inflación general parece estar bajando por una caída técnica en los energéticos.
      </p>
      <p className="leading-relaxed text-slate-700 dark:text-slate-300 mb-4">
        Por el contrario, cuando la general está muy por encima de la subyacente (por ejemplo, por un spike en gasolina o en alimentos), el banco central puede optar por no reaccionar con subidas agresivas si considera que el choque es transitorio. La comunicación del banco suele hacer explícita esta distinción para anclar expectativas.
      </p>

      <h2 id="uso">4. Uso en la práctica: qué mirar cada quincena</h2>
      <p className="leading-relaxed text-slate-700 dark:text-slate-300 mb-4">
        El día de publicación del INPC, los mercados observan tanto la general como la subyacente. Si la subyacente se mantiene estable o baja mientras la general repunta por energéticos, la reacción de tasas suele ser moderada. Si la subyacente acelera, aumenta la probabilidad de que Banxico mantenga o suba la tasa en la siguiente decisión.
      </p>
      <p className="leading-relaxed text-slate-700 dark:text-slate-300 mb-4">
        Conviene seguir también la inflación subyacente por <strong>componentes</strong> (mercancías vs servicios): en muchos ciclos recientes, la inflación de servicios ha sido más persistente que la de mercancías, y Banxico suele citar este desglose en sus informes. Por último, las expectativas de inflación a 12 y 24 meses (encuestas de Banxico y CEMLA) complementan la lectura: si la subyacente sube pero las expectativas se mantienen ancladas, el banco puede ser más paciente.
      </p>

      <h2 id="resumen">5. Resumen</h2>
      <p className="leading-relaxed text-slate-700 dark:text-slate-300 mb-4">
        La inflación general mide el costo de vida y es la que más resuena en la opinión pública; la subyacente es la brújula del banco central porque filtra choques temporales. Entender ambas y su posible divergencia te permite anticipar mejor el tono de las minutas y las decisiones de tasa en México.
      </p>

      <ReferencesList
        references={[
          { id: "1", text: "INEGI (2025). Glosario de términos del Índice Nacional de Precios al Consumidor.", href: "https://www.inegi.org.mx" },
          { id: "2", text: "Heath, J. (2024). Lectura de la inflación en México: Guía para estudiantes.", href: "#" },
          { id: "3", text: "Bryan, M. F. (1994). Measuring core inflation. NBER Working Paper.", href: "https://www.nber.org/papers/w4303" },
        ]}
      />
    </>
  );
}

function ComoLeerMinutaBanxicoContent() {
  return (
    <>
      <KeyTakeaways
        points={[
          "Se publican dos jueves después de cada anuncio de política.",
          "Revelan la identidad de los votos disidentes.",
          "El 'Forward Guidance' indica el futuro de las tasas.",
          "Diferenciar entre tono 'Hawkish' y 'Dovish' es clave."
        ]}
      />

      <p className="leading-relaxed text-slate-700 dark:text-slate-300 mb-6">
        Las minutas de política monetaria son el documento más esperado por analistas en México. A diferencia del comunicado inicial, que es breve, la minuta ofrece una <strong>radiografía</strong> de las discusiones internas de la Junta de Gobierno. Es aquí donde se encuentran las pistas sobre si el ciclo de bajas ha terminado o si habrá sorpresas en la próxima reunión.
      </p>
      <p className="leading-relaxed text-slate-700 dark:text-slate-300 mb-6">
        Este artículo te guía por la estructura típica de una minuta de Banxico, el significado del tono (hawkish vs dovish), la importancia de los votos disidentes, la sección de riesgos y el forward guidance. Con estos elementos podrás extraer señales de mercado de forma sistemática.
      </p>

      <h2 id="tono">1. El Tono: ¿Hawkish o Dovish?</h2>
      <p className="leading-relaxed text-slate-700 dark:text-slate-300 mb-4">
        En el lenguaje central bancario:
      </p>
      <ul className="list-disc pl-6 space-y-2 mb-4 text-slate-700 dark:text-slate-300">
        <li><strong>Hawkish (Halcón):</strong> Predisposición a subir tasas o mantenerlas altas para combatir la inflación. Prioriza la estabilidad de precios sobre el crecimiento. Lenguaje típico: "riesgos al alza para la inflación", "postura restrictiva el tiempo necesario", "vigilancia ante presiones".</li>
        <li><strong>Dovish (Paloma):</strong> Predisposición a bajar tasas para estimular la economía. Muestra más preocupación por el crecimiento o el desempleo. Lenguaje típico: "evaluar el ritmo de ajuste", "holgura en la economía", "riesgos a la baja para el crecimiento".</li>
      </ul>
      <p className="leading-relaxed text-slate-700 dark:text-slate-300 mb-6">
        Una misma minuta puede mezclar elementos de ambos: por ejemplo, reconocer que la inflación sigue alta (hawkish) pero que el crecimiento se está desacelerando (dovish). Lo que importa es el <strong>balance neto</strong> y si ese balance cambió respecto a la minuta anterior.
      </p>

      <h2 id="votacion">2. La Importancia de los Votos Disidentes</h2>
      <p className="leading-relaxed text-slate-700 dark:text-slate-300 mb-4">
        Si la decisión fue unánime (5-0), el mercado asume una postura sólida. Sin embargo, un voto disidente (4-1) suele ser un <strong>indicador adelantado</strong>. Si un subgobernador votó por una baja cuando la mayoría mantuvo, es probable que la baja se materialice en la siguiente o subsiguiente reunión. A la inversa, si alguien votó por una subida cuando la mayoría recortó, puede indicar que el espacio para más recortes es limitado.
      </p>
      <p className="leading-relaxed text-slate-700 dark:text-slate-300 mb-4">
        La minuta suele indicar explícitamente quién votó en sentido distinto y, en ocasiones, el razonamiento de los disidentes. Esa información es valiosa para calibrar la probabilidad de un cambio de postura en la próxima reunión.
      </p>

      <BlockQuote
        quote="La minuta nos permite escuchar las sutilezas que el comunicado oficial suele suavizar por razones de protocolo institucional."
        author="Gabinete de Análisis Econosfera"
      />

      <SimulatorCTA
        title="Predictor de Tasas"
        description="Analiza la balanza de riesgos de la última minuta y estima la probabilidad de un ajuste en la tasa de referencia."
        href="/simulador?tab=minutas"
      />

      <h2 id="riesgos">3. Balance de Riesgos</h2>
      <p className="leading-relaxed text-slate-700 dark:text-slate-300 mb-4">
        Busca siempre la sección sobre riesgos al alza y a la baja para la inflación. Si Banxico menciona riesgos <strong>"sesgados significativamente al alza"</strong>, es una señal inequívoca de que las tasas no bajarán pronto.
      </p>

      <h2 id="forward">4. El Forward Guidance: pistas sobre el siguiente movimiento</h2>
      <p className="leading-relaxed text-slate-700 dark:text-slate-300 mb-4">
        Las frases sobre la trayectoria futura de la tasa suelen aparecer al final del párrafo de deliberación. Expresiones como "mantendrán una postura restrictiva el tiempo necesario" indican que no hay prisa por bajar; "evaluarán el ritmo de ajuste" deja abierta la puerta a una pausa o a un recorte en reuniones futuras. Comparar el lenguaje de una minuta con la anterior es un ejercicio útil para detectar cambios de tono.
      </p>

      <h2 id="calendario">5. Calendario y fuentes</h2>
      <p className="leading-relaxed text-slate-700 dark:text-slate-300 mb-4">
        Las minutas se publican dos jueves después de cada decisión de política monetaria en el sitio del Banco de México. Conviene tener a mano el calendario anual de reuniones y el de publicaciones para no perderse ninguna fecha clave.
      </p>
      <p className="leading-relaxed text-slate-700 dark:text-slate-300 mb-4">
        <strong>Checklist rápido para leer una minuta:</strong> (1) Identificar el balance de riesgos para la inflación (al alza / equilibrado / a la baja). (2) Revisar si hubo votos disidentes y en qué sentido. (3) Buscar en el párrafo de deliberación las frases sobre la trayectoria futura de la tasa (forward guidance). (4) Comparar el tono con la minuta anterior: ¿más hawkish, más dovish o sin cambios? Con estos cuatro puntos tendrás una lectura operativa para tus pronósticos de tasa.
      </p>

      <ReferencesList
        references={[
          { id: "1", text: "Banco de México (2025). Calendario de publicación de minutas.", href: "https://www.banxico.org.mx" },
          { id: "2", text: "Financial Times. Central Banking Terms: Hawks vs Doves.", href: "https://ft.com" },
        ]}
      />
    </>
  );
}

function ModeloISLMContent() {
  return (
    <>
      <KeyTakeaways
        points={[
          "Muestra el equilibrio simultáneo en bienes y dinero.",
          "IS: Inversión-Ahorro (Mercado de bienes).",
          "LM: Liquidez-Dinero (Mercado monetario).",
          "Es la base para entender políticas expansivas y contractivas."
        ]}
      />

      <p className="leading-relaxed text-slate-700 dark:text-slate-300 mb-6">
        El modelo <strong>IS-LM</strong> es el pilar fundamental de la macroeconomía de corto plazo. Desarrollado por John Hicks en 1937 para formalizar las ideas de Keynes, este modelo explica cómo se determina el nivel de ingreso nacional y la tasa de interés en una economía cerrada.
      </p>
      <p className="leading-relaxed text-slate-700 dark:text-slate-300 mb-6">
        Aunque simplificado (precios dados, economía cerrada en su versión básica), el IS-LM sigue siendo la base de muchos informes de bancos centrales y de cursos de macro. Aquí revisamos las dos curvas, los efectos de la política fiscal y monetaria, y la extensión a economía abierta (Mundell-Fleming).
      </p>

      <h2 id="is">1. La Curva IS: El Mercado de Bienes</h2>
      <p className="leading-relaxed text-slate-700 dark:text-slate-300 mb-4">
        La curva IS representa todas las combinaciones de renta (Y) y tasa de interés (r) donde el gasto planeado iguala a la producción. Equivale a decir que el ahorro planeado iguala a la inversión planeada. Su pendiente es <strong>negativa</strong>: un aumento en la tasa de interés encarece el crédito, reduce la inversión y, por tanto, la demanda agregada y el producto de equilibrio.
      </p>
      <p className="leading-relaxed text-slate-700 dark:text-slate-300 mb-4">
        La IS se desplaza cuando cambia el gasto autónomo: un aumento del gasto público (G) o una rebaja de impuestos (T) que eleve el consumo desplazan la IS a la derecha; una caída de la confianza que reduzca la inversión autónoma la desplaza a la izquierda.
      </p>

      <FormulaBox
        formula="Y = C(Y-T) + I(r) + G"
        label="Equilibrio en el mercado de bienes"
      />

      <h2 id="lm">2. La Curva LM: El Mercado de Dinero</h2>
      <p className="leading-relaxed text-slate-700 dark:text-slate-300 mb-4">
        La curva LM representa el equilibrio entre la oferta real de dinero (M/P) y la demanda de saldos reales L(Y, r). La demanda de dinero aumenta con la renta (más transacciones) y disminuye con la tasa de interés (mayor costo de oportunidad de mantener efectivo). Por tanto, la LM tiene pendiente <strong>positiva</strong>: si la renta sube, la demanda de dinero sube; para que el mercado vuelva al equilibrio con M/P fijo, la tasa de interés debe subir para reducir la demanda.
      </p>
      <p className="leading-relaxed text-slate-700 dark:text-slate-300 mb-4">
        La LM se desplaza cuando cambia la oferta monetaria nominal (M) o el nivel de precios (P). Una expansión monetaria (M sube) o una caída de P desplaza la LM a la derecha; una contracción monetaria la desplaza a la izquierda.
      </p>

      <FormulaBox
        formula="M/P = L(Y, r)"
        label="Equilibrio en el mercado monetario"
      />

      <SimulatorCTA
        title="Simulador Macro: IS-LM"
        description="Desplaza las curvas IS y LM para visualizar el impacto de un aumento en el gasto público o una contracción monetaria."
        href="/simulador?tab=macro"
      />

      <h2 id="politica">3. Efectos de la Política</h2>
      <p className="leading-relaxed text-slate-700 dark:text-slate-300 mb-4">
        <strong>Política fiscal expansiva</strong> (sube G o baja T): la IS se desplaza a la derecha. El nuevo equilibrio tiene mayor renta (Y) y mayor tasa de interés (r). El aumento de r "desplaza" parte de la inversión privada: es el efecto <em>crowding-out</em>. En el modelo básico sin sector exterior, el multiplicador del gasto es menor que en el modelo 45° keynesiano porque la subida de la tasa frena la inversión.
      </p>
      <p className="leading-relaxed text-slate-700 dark:text-slate-300 mb-4">
        <strong>Política monetaria expansiva</strong> (sube M): la LM se desplaza a la derecha. La tasa de interés baja y la renta sube. La bajada de r estimula la inversión. Por tanto, en el IS-LM la política monetaria es efectiva para mover el producto a través del canal de la tasa de interés.
      </p>
      <p className="leading-relaxed text-slate-700 dark:text-slate-300 mb-4">
        En el <strong>tramo de liquidez</strong> (LM muy plana a tasas muy bajas), la política monetaria pierde efectividad porque la demanda de dinero se vuelve muy sensible a la tasa; la política fiscal, en cambio, gana efectividad porque casi no hay crowding-out. Este caso es relevante para episodios de tasas cercanas a cero (zero lower bound).
      </p>

      <h2 id="extension">4. Extensiones: economía abierta y Mundell-Fleming</h2>
      <p className="leading-relaxed text-slate-700 dark:text-slate-300 mb-4">
        En economía abierta se añade el mercado de divisas y el tipo de cambio. El modelo Mundell-Fleming muestra que la eficacia de la política fiscal y monetaria depende del régimen cambiario (tipo de cambio fijo vs flexible). En un régimen flexible, la política monetaria gana efectividad para mover el producto, mientras que la política fiscal puede verse limitada por la apreciación del tipo de cambio y la caída de las exportaciones netas.
      </p>

      <h2 id="relevancia">5. Relevancia actual</h2>
      <p className="leading-relaxed text-slate-700 dark:text-slate-300 mb-4">
        Aunque el IS-LM es un modelo de corto plazo con supuestos simplificadores (precios rígidos, economía cerrada en su versión básica), sigue siendo la columna vertebral de muchos cursos de macroeconomía y de los informes de bancos centrales que analizan el impacto de un cambio en G o M sobre el producto y las tasas. Dominarlo facilita entender modelos más avanzados como los DSGE.
      </p>
      <p className="leading-relaxed text-slate-700 dark:text-slate-300 mb-4">
        En resumen: la intersección IS-LM determina Y y r de equilibrio. La política fiscal mueve la IS; la política monetaria mueve la LM. El crowding-out de la política fiscal y la efectividad de la política monetaria dependen de la pendiente de la LM (y en economía abierta, del régimen cambiario). Usa el simulador para ver estos desplazamientos en vivo y fijar la intuición.
      </p>

      <ReferencesList
        references={[
          { id: "1", text: "Hicks, J. R. (1937). Mr. Keynes and the Classics: A Suggested Interpretation. Econometrica.", href: "https://www.jstor.org/stable/1907242" },
          { id: "2", text: "Blanchard, O. (2025). Macroeconomía (8ª Edición). Pearson.", href: "#" },
        ]}
      />
    </>
  );
}

function DCFPasoaPasoContent() {
  return (
    <>
      <KeyTakeaways
        points={[
          "El valor hoy de una empresa es la suma de sus flujos futuros.",
          "El WACC es la tasa que refleja el costo de deuda y capital.",
          "El Valor Terminal suele representar el >70% de la valoración.",
          "Sensibilidad: pequeños cambios en 'g' o WACC cambian todo."
        ]}
      />

      <p className="leading-relaxed text-slate-700 dark:text-slate-300 mb-6">
        La valoración por <strong>Descuento de Flujos de Caja (DCF)</strong> es el "Estándar de Oro" en Wall Street y en la academia. Se basa en una premisa simple: un activo vale lo que es capaz de generar en el futuro, traído a valor presente.
      </p>
      <p className="leading-relaxed text-slate-700 dark:text-slate-300 mb-6">
        En este artículo se revisan los conceptos de flujo de caja libre (FCFF), el costo promedio ponderado del capital (WACC), el valor terminal y las mejores prácticas para armar un DCF y comunicar la incertidumbre con tablas de sensibilidad.
      </p>

      <h2 id="fcf">1. El Motor: Free Cash Flow (FCF)</h2>
      <p className="leading-relaxed text-slate-700 dark:text-slate-300 mb-4">
        A diferencia de la utilidad neta (que es contable y está sujeta a criterios de reconocimiento), el FCF es <strong>dinero real</strong> que la empresa puede repartir a acreedores y accionistas sin comprometer su operación. Es lo que sobra después de pagar impuestos, invertir en el mantenimiento del negocio (CapEx) y en capital de trabajo (ΔNWC).
      </p>
      <p className="leading-relaxed text-slate-700 dark:text-slate-300 mb-4">
        Se distingue entre <strong>FCFF</strong> (flujo para la firma, antes de deuda) y <strong>FCFE</strong> (flujo para el accionista, después de intereses y reembolsos de deuda). Para valorar el Enterprise Value se usa el FCFF y se descuenta al WACC; para valorar solo el patrimonio (equity) se usa el FCFE y se descuenta al costo del capital propio (Ke).
      </p>

      <FormulaBox
        formula="FCF = EBIT(1-t) + Dep - \Delta NWC - CapEx"
        label="Flujo de Caja Libre para la Firma (FCFF)"
      />

      <h2 id="wacc">2. El Filtro: WACC</h2>
      <p className="leading-relaxed text-slate-700 dark:text-slate-300 mb-4">
        ¿A qué tasa descontamos los FCFF? Al <strong>costo promedio ponderado del capital (WACC)</strong>: el promedio ponderado del costo de la deuda (Kd, después de impuestos) y del costo del capital propio (Ke). Si el riesgo de la empresa aumenta, el Ke y por tanto el WACC suben, y el valor presente de los flujos baja.
      </p>
      <p className="leading-relaxed text-slate-700 dark:text-slate-300 mb-4">
        El Ke se suele estimar con el modelo CAPM (Ke = Rf + β × (Rm - Rf)); el Kd con el rendimiento al vencimiento de la deuda o con el spread sobre la tasa libre de riesgo. Las ponderaciones (E/V y D/V) pueden ser a valor de mercado o a valor objetivo si se asume una estructura de capital óptima. En la práctica, pequeños cambios en el WACC tienen un impacto grande en el valor por acción, por eso es clave documentar los supuestos y hacer sensibilidad.
      </p>

      <BlockQuote
        quote="Price is what you pay. Value is what you get. El DCF es la herramienta para intentar encontrar ese valor."
        author="Warren Buffett (Atribuido)"
      />

      <SimulatorCTA
        title="Valuador DCF Pro"
        description="Construye tu propio modelo de 5 años, calcula el WACC dinámicamente y obtén el valor intrínseco de cualquier acción."
        href="/simulador?tab=finanzas&tool=dcf"
      />

      <h2 id="terminal">3. Valor Terminal y Perpetuidad</h2>
      <p className="leading-relaxed text-slate-700 dark:text-slate-300 mb-4">
        Como no podemos proyectar 100 años, usamos el modelo de <strong>Gordon-Shapiro</strong> (crecimiento perpetuo) para estimar el valor de la empresa desde el año siguiente al último explícito hasta el infinito, asumiendo un crecimiento constante (g). La fórmula es VT = FCF del primer año después del horizonte explícito dividido entre (WACC - g). La hipótesis de g debe ser conservadora: en el largo plazo, g no puede superar de forma sostenida el crecimiento de la economía.
      </p>
      <p className="leading-relaxed text-slate-700 dark:text-slate-300 mb-4">
        Una alternativa al crecimiento perpetuo es el <strong>múltiplo de salida</strong>: se aplica un múltiplo (por ejemplo EV/EBITDA) al último año explícito para estimar el valor terminal. Es útil cuando la empresa se espera vender o cuando el crecimiento a largo plazo es muy incierto. En ambos casos, el valor terminal suele representar una fracción muy alta del valor total (a menudo más del 70%), por lo que los supuestos de terminal son críticos.
      </p>

      <h2 id="pasos">4. Pasos prácticos para armar un DCF</h2>
      <p className="leading-relaxed text-slate-700 dark:text-slate-300 mb-4">
        En la práctica se proyectan entre 5 y 10 años de FCF explícitos, se calcula el valor terminal (normalmente con crecimiento perpetuo o múltiplo de salida), se descuenta todo al WACC y se suma. El valor de la firma (Enterprise Value) menos la deuda neta y más el efectivo nos da el valor patrimonial; dividido entre las acciones en circulación, el valor por acción.
      </p>

      <h2 id="sensibilidad">5. Análisis de sensibilidad</h2>
      <p className="leading-relaxed text-slate-700 dark:text-slate-300 mb-4">
        Dado que el valor terminal suele representar más del 70% del valor total, pequeños cambios en la tasa de crecimiento a largo plazo (g) o en el WACC pueden mover mucho la valoración. Por eso es habitual construir una tabla de sensibilidad (WACC en filas, g en columnas) para ver el rango de valores razonables y comunicar la incertidumbre a quien toma la decisión.
      </p>
      <p className="leading-relaxed text-slate-700 dark:text-slate-300 mb-4">
        Errores frecuentes al hacer un DCF: usar un g mayor que el crecimiento de la economía a largo plazo; ignorar la necesidad de reinversión (el FCF debe ser sostenible); no ajustar el Beta por apalancamiento cuando la estructura de capital cambia; y no triangular el valor con otros métodos (múltiplos comparables, transacciones) para validar el resultado.
      </p>

      <ReferencesList
        references={[
          { id: "1", text: "Damodaran, A. (2024). Investment Valuation: Tools and Techniques for Determining the Value of Any Asset.", href: "https://pages.stern.nyu.edu/~adamodar/" },
          { id: "2", text: "McKinsey & Company. Valuation: Measuring and Managing the Value of Companies.", href: "#" },
        ]}
      />
    </>
  );
}

function ElasticidadPrecioDemandaContent() {
  return (
    <>
      <KeyTakeaways
        points={[
          "Mide qué tan sensible es el consumo a los cambios de precio.",
          "Inelástica (|e| < 1): Productos sin sustitutos (insulina, gasolina).",
          "Elástica (|e| > 1): Productos con muchos sustitutos (lujos).",
          "Ayuda a empresas a decidir si subir precios aumenta sus ingresos."
        ]}
      />

      <p className="leading-relaxed text-slate-700 dark:text-slate-300 mb-6">
        ¿Por qué un aumento de 10% en el precio del cine vacía las salas, pero un aumento de 10% en la gasolina apenas afecta el consumo? La respuesta está en la <strong>Elasticidad Precio de la Demanda</strong>.
      </p>
      <p className="leading-relaxed text-slate-700 dark:text-slate-300 mb-6">
        En este artículo se define la elasticidad precio (punto y arco), sus determinantes, la relación con el ingreso total del vendedor, y las aplicaciones en política de precios e impuestos. También se mencionan la elasticidad cruzada y la elasticidad ingreso para una visión más completa.
      </p>

      <h2 id="formula">1. La Medida de la Sensibilidad</h2>
      <p className="leading-relaxed text-slate-700 dark:text-slate-300 mb-4">
        La elasticidad no es la pendiente de la curva de demanda (que depende de las unidades). Es un <strong>cambio porcentual relativo</strong>: cuánto varía la cantidad demandada en porcentaje cuando el precio varía 1%. Se calcula como el cociente entre la variación porcentual de la cantidad y la variación porcentual del precio. En valor absoluto, si es mayor que 1 la demanda es elástica; si es menor que 1, inelástica.
      </p>
      <p className="leading-relaxed text-slate-700 dark:text-slate-300 mb-4">
        La <strong>elasticidad arco</strong> se usa entre dos puntos (se toma el promedio de precios y cantidades como base para evitar asimetría). La <strong>elasticidad en un punto</strong> se define con derivadas: ε = (dQ/dP) × (P/Q). En una curva de demanda lineal, la elasticidad varía a lo largo de la curva: es elástica en precios altos e inelástica en precios bajos.
      </p>

      <FormulaBox
        formula="\epsilon = \frac{\Delta \% Q}{\Delta \% P}"
        label="Elasticidad Precio de la Demanda"
      />

      <h2 id="determinantes">2. ¿Qué hace que una demanda sea inelástica?</h2>
      <p className="leading-relaxed text-slate-700 dark:text-slate-300 mb-4">
        Existen tres factores clave:
      </p>
      <ul className="list-disc pl-6 space-y-2 mb-4 text-slate-700 dark:text-slate-300">
        <li><strong>Sustitutos:</strong> A menos sustitutos, más inelástica.</li>
        <li><strong>Necesidad:</strong> El pan es inelástico, el caviar es elástico.</li>
        <li><strong>Tiempo:</strong> En el largo plazo, todas las demandas tienden a ser más elásticas (la gente encuentra alternativas).</li>
      </ul>

      <h2 id="aplicaciones">3. Aplicaciones: precios e impuestos</h2>
      <p className="leading-relaxed text-slate-700 dark:text-slate-300 mb-4">
        Una empresa con demanda inelástica puede subir precios y aumentar ingresos; con demanda elástica, una subida de precios reduce el ingreso total. En política tributaria, los impuestos sobre bienes inelásticos (tabaco, gasolina) recaen más en el consumidor y generan ingresos estables para el fisco, pero con menor pérdida de bienestar en cantidad transada que cuando se gravan bienes elásticos.
      </p>

      <h2 id="elasticidad-cruzada">4. Elasticidad cruzada e ingreso</h2>
      <p className="leading-relaxed text-slate-700 dark:text-slate-300 mb-4">
        La <strong>elasticidad cruzada</strong> mide cómo cambia la cantidad demandada del bien A cuando cambia el precio del bien B. Si es positiva, los bienes son sustitutos (ej. café y té); si es negativa, son complementarios (ej. café y leche). Si es cercana a cero, los bienes son independientes. Las empresas usan este concepto para predecir el efecto de cambios en precios de competidores o complementos.
      </p>
      <p className="leading-relaxed text-slate-700 dark:text-slate-300 mb-4">
        La <strong>elasticidad ingreso</strong> mide cómo cambia la demanda cuando cambia la renta del consumidor. Los bienes normales tienen elasticidad ingreso positiva; los bienes de lujo suelen tener elasticidad ingreso mayor que 1; los bienes inferiores (ej. cierto tipo de papas o transporte en autobús cuando sube el ingreso) tienen elasticidad ingreso negativa. Esto es útil para segmentar mercados y para proyectar demanda en distintas fases del ciclo económico.
      </p>

      <h2 id="resumen">5. Resumen</h2>
      <p className="leading-relaxed text-slate-700 dark:text-slate-300 mb-4">
        La elasticidad precio de la demanda resume la sensibilidad del consumo al precio y determina si una subida de precios aumenta o reduce el ingreso total del vendedor. Sus determinantes (sustitutos, necesidad, horizonte temporal) y las elasticidades cruzada e ingreso permiten aplicar la microeconomía a estrategia de precios, política tributaria y pronósticos de demanda.
      </p>

      <SimulatorCTA
        title="Simulador de Micro"
        description="Ajusta la curva de demanda y observa cómo cambia el Ingreso Total cuando modificas los precios. ¿Estás en el tramo elástico?"
        href="/simulador?tab=micro"
      />

      <ReferencesList
        references={[
          { id: "1", text: "Varian, H. (2025). Microeconomía Intermedia: Un enfoque actual.", href: "#" },
          { id: "2", text: "Pindyck, R. y Rubinfeld, D. Microeconomía.", href: "#" },
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
};
