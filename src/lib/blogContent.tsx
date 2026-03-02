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

/** Mapa slug → componente de contenido. Añade aquí nuevos artículos. */
export const BLOG_CONTENT: Record<string, () => JSX.Element> = {
  "ejemplo-regla-taylor": EjemploReglaTaylorContent,
};
