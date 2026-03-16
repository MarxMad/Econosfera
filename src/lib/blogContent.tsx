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

      <h2 id="origen">1. El Origen: ¿Por qué una regla?</h2>
      <p>
        Antes de 1993, la política monetaria era vista a menudo como un "arte" oscuro. John B. Taylor demostró que se podía describir el comportamiento de la Fed con una fórmula sorprendentemente simple. Su propuesta resolvió el problema de la <em>inconsistencia dinámica</em>: si los mercados saben cómo reaccionará el banco, las expectativas se anclan y la inflación baja.
      </p>

      <FormulaBox
        formula="i = r* + π + 0.5(π - π*) + 0.5(y - y*)"
        label="La Ecuación Original de Taylor (1993)"
      />

      <h2 id="componentes">2. Desglose de los Componentes</h2>
      <ul>
        <li><strong>r* (Tasa Real Neutral):</strong> Es la tasa que no expande ni contrae la economía. En México, Banxico estima que se sitúa entre el 1.8% y 3.4%.</li>
        <li><strong>π - π* (Brecha de Inflación):</strong> La diferencia entre la inflación actual y la meta (en México es 3% ± 1%).</li>
        <li><strong>y - y* (Brecha de Producto):</strong> Qué tanto se desvía el PIB actual de su potencial.</li>
      </ul>

      <SimulatorCTA
        title="Simulador de Regla de Taylor"
        description="Ajusta la tasa neutral y la meta de inflación para ver cómo debería reaccionar Banxico hoy mismo."
        href="/simulador?tab=taylor"
      />

      <h2 id="practica">3. La Regla en México</h2>
      <p>
        En una economía abierta como la mexicana, la regla suele extenderse para incluir el <strong>tipo de cambio</strong> y la <strong>tasa de la Fed</strong>. Banxico debe considerar que una subida excesiva podría apreciar demasiado el peso, afectando a las exportaciones, mientras que quedarse corto ante la Fed podría causar fugas de capital.
      </p>
      <p>
        Los documentos de investigación del Banco de México publican periódicamente estimaciones de la tasa neutral (r*) y de la brecha de producto. Los analistas del mercado suelen comparar la tasa de fondeo vigente con la que arrojaría una regla de Taylor "estándar" o "modificada" para México, lo que genera expectativas sobre el sesgo de la siguiente decisión (alcista, neutral o recortes).
      </p>

      <h2 id="limitaciones">4. Limitaciones y Críticas</h2>
      <p>
        La regla no captura shocks financieros ni riesgos de cola; tampoco sustituye el juicio del comité. En épocas de crisis, los bancos centrales pueden desviarse deliberadamente de la regla para evitar una recesión profunda o para dar prioridad a la estabilidad financiera. Por eso se dice que la regla es una <strong>referencia</strong>, no un mandato mecánico.
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
      <p className="leading-relaxed text-slate-700 dark:text-slate-300 mb-6">
        Al excluir estos componentes, el indicador subyacente refleja mejor la presión de demanda y las expectativas de inflación que el banco central puede influir con la tasa de interés. En México, la meta de inflación de Banxico (3% ± 1%) se interpreta en la práctica como una meta sobre la inflación subyacente en el mediano plazo.
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
        Las minutas de política monetaria son el documento más esperado por analistas en México. A diferencia del comunicado inicial, que es breve, la minuta ofrece una <strong>radiografía</strong> de las discusiones internas del Junta de Gobierno. Es aquí donde se encuentran las pistas sobre si el ciclo de bajas ha terminado o si habrá sorpresas en la próxima reunión.
      </p>

      <h2 id="tono">1. El Tono: ¿Hawkish o Dovish?</h2>
      <p className="leading-relaxed text-slate-700 dark:text-slate-300 mb-4">
        En el lenguaje central bancario:
      </p>
      <ul className="list-disc pl-6 space-y-2 mb-6 text-slate-700 dark:text-slate-300">
        <li><strong>Hawkish (Halcón):</strong> Predisposición a subir tasas o mantenerlas altas para combatir la inflación. Prioriza la estabilidad sobre el crecimiento.</li>
        <li><strong>Dovish (Paloma):</strong> Predisposición a bajar tasas para estimular la economía. Muestra más preocupación por el crecimiento o el desempleo.</li>
      </ul>

      <h2 id="votacion">2. La Importancia de los Votos Disidentes</h2>
      <p className="leading-relaxed text-slate-700 dark:text-slate-300 mb-4">
        Si la decisión fue unánime (5-0), el mercado asume una postura sólida. Sin embargo, un voto disidente (4-1) suele ser un <strong>indicador adelantado</strong>. Si un subgobernador votó por una baja cuando la mayoría mantuvo, es probable que la baja se materialice en la siguiente o subsiguiente reunión.
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

      <h2 id="is">1. La Curva IS: El Mercado de Bienes</h2>
      <p className="leading-relaxed text-slate-700 dark:text-slate-300 mb-4">
        Representa todas las combinaciones de renta (Y) y tasa de interés (r) donde el gasto planeado iguala a la producción. Su pendiente es <strong>negativa</strong> porque un aumento en la tasa de interés encarece el crédito, reduciendo la inversión y, por ende, el producto total.
      </p>

      <FormulaBox
        formula="Y = C(Y-T) + I(r) + G"
        label="Equilibrio en el mercado de bienes"
      />

      <h2 id="lm">2. La Curva LM: El Mercado de Dinero</h2>
      <p className="leading-relaxed text-slate-700 dark:text-slate-300 mb-4">
        Representa el equilibrio entre la oferta y la demanda de dinero. Su pendiente es <strong>positiva</strong>: si la renta sube, la gente demanda más dinero para transacciones; para que el mercado se equilibre con una oferta monetaria fija, la tasa de interés debe subir.
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
        ¿Qué pasa si el gobierno aumenta el gasto (G)? La IS se desplaza a la derecha, aumentando el PIB pero también la tasa de interés (efecto <em>crowding-out</em>). ¿Y si el banco central aumenta la cantidad de dinero? La LM se desplaza a la derecha, bajando las tasas y estimulando la inversión.
      </p>

      <h2 id="extension">4. Extensiones: economía abierta y Mundell-Fleming</h2>
      <p className="leading-relaxed text-slate-700 dark:text-slate-300 mb-4">
        En economía abierta se añade el mercado de divisas y el tipo de cambio. El modelo Mundell-Fleming muestra que la eficacia de la política fiscal y monetaria depende del régimen cambiario (tipo de cambio fijo vs flexible). En un régimen flexible, la política monetaria gana efectividad para mover el producto, mientras que la política fiscal puede verse limitada por la apreciación del tipo de cambio y la caída de las exportaciones netas.
      </p>

      <h2 id="relevancia">5. Relevancia actual</h2>
      <p className="leading-relaxed text-slate-700 dark:text-slate-300 mb-4">
        Aunque el IS-LM es un modelo de corto plazo con supuestos simplificadores (precios rígidos, economía cerrada en su versión básica), sigue siendo la columna vertebral de muchos cursos de macroeconomía y de los informes de bancos centrales que analizan el impacto de un cambio en G o M sobre el producto y las tasas. Dominarlo facilita entender modelos más avanzados como los DSGE.
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

      <h2 id="fcf">1. El Motor: Free Cash Flow (FCF)</h2>
      <p className="leading-relaxed text-slate-700 dark:text-slate-300 mb-4">
        A diferencia de la utilidad neta (que es contable), el FCF es <strong>dinero real</strong>. Es lo que sobra después de pagar impuestos e invertir en el mantenimiento del negocio (CapEx) y en capital de trabajo.
      </p>

      <FormulaBox
        formula="FCF = EBIT(1-t) + Dep - \Delta NWC - CapEx"
        label="Flujo de Caja Libre para la Firma (FCFF)"
      />

      <h2 id="wacc">2. El Filtro: WACC</h2>
      <p className="leading-relaxed text-slate-700 dark:text-slate-300 mb-4">
        ¿A qué tasa descontamos? Al costo promedio ponderado del capital. Si el riesgo de la empresa aumenta, el WACC sube, y el valor presente de los flujos baja.
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
        Como no podemos proyectar 100 años, usamos el modelo de Gordon-Shapiro para estimar el valor de la empresa desde el año 6 hasta el infinito, asumiendo un crecimiento constante (g).
      </p>

      <h2 id="pasos">4. Pasos prácticos para armar un DCF</h2>
      <p className="leading-relaxed text-slate-700 dark:text-slate-300 mb-4">
        En la práctica se proyectan entre 5 y 10 años de FCF explícitos, se calcula el valor terminal (normalmente con crecimiento perpetuo o múltiplo de salida), se descuenta todo al WACC y se suma. El valor de la firma (Enterprise Value) menos la deuda neta y más el efectivo nos da el valor patrimonial; dividido entre las acciones en circulación, el valor por acción.
      </p>

      <h2 id="sensibilidad">5. Análisis de sensibilidad</h2>
      <p className="leading-relaxed text-slate-700 dark:text-slate-300 mb-4">
        Dado que el valor terminal suele representar más del 70% del valor total, pequeños cambios en la tasa de crecimiento a largo plazo (g) o en el WACC pueden mover mucho la valoración. Por eso es habitual construir una tabla de sensibilidad (WACC en filas, g en columnas) para ver el rango de valores razonables y comunicar la incertidumbre a quien toma la decisión.
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

      <h2 id="formula">1. La Medida de la Sensibilidad</h2>
      <p className="leading-relaxed text-slate-700 dark:text-slate-300 mb-4">
        La elasticidad no es una pendiente unitaria; es un cambio porcentual relativo. Se calcula dividiendo la variación porcentual de la cantidad entre la variación porcentual del precio.
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
        Además de la elasticidad precio, se estudia la elasticidad cruzada (cómo cambia la cantidad demandada de un bien cuando cambia el precio de otro) y la elasticidad ingreso (cómo cambia la demanda cuando cambia la renta). Los bienes normales tienen elasticidad ingreso positiva; los inferiores, negativa. Estos conceptos son útiles para segmentar mercados y para diseño de política pública.
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
