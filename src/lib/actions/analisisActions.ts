"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function analizarMinutaBanxico(formData: FormData) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw new Error("Debes iniciar sesión para realizar análisis de IA.");
  }

  // Verificar créditos
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { credits: true }
  });

  if (!user || user.credits <= 0) {
    throw new Error("No tienes créditos de IA suficientes. Por favor, adquiere más créditos.");
  }

  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error("OPENAI_API_KEY no configurada en el servidor.");
  }

  // Descontar crédito antes de la llamada (o después, pero el usuario quiere control de vaciado)
  // Lo haremos antes para evitar carreras o si falla algo, pero podríamos hacerlo después si queremos ser "justos".
  // El usuario dice "que no nos vayan a vaciar", mejor descontar antes o marcar como pendiente.
  await prisma.user.update({
    where: { id: session.user.id },
    data: { credits: { decrement: 1 } }
  });

  const file = formData.get("file") as File;
  if (!file) {
    throw new Error("No se proporcionó ningún archivo.");
  }

  let contenido = "";

  try {
    if (file.type === "application/pdf" || file.name.endsWith(".pdf")) {
      const { PdfReader } = require("pdfreader");
      const buffer = Buffer.from(await file.arrayBuffer());

      const extractedText = await new Promise<string>((resolve, reject) => {
        let text = "";
        new PdfReader().parseBuffer(buffer, (err: any, item: any) => {
          if (err) reject(err);
          else if (!item) resolve(text);
          else if (item.text) {
            text += item.text + " ";
          }
        });
      });

      contenido = extractedText;
    } else {
      contenido = await file.text();
    }
  } catch (parseError: any) {
    console.error("Error al extraer texto del archivo:", parseError);
    throw new Error(`Error al leer el archivo PDF: ${parseError.message}`);
  }

  if (!contenido || contenido.trim().length === 0) {
    throw new Error("El archivo parece estar vacío o no se pudo extraer el texto.");
  }

  const prompt = `
    Analiza la siguiente minuta del Banco de México (Banxico) con un rigor académico, técnico y financiero extremo. Tu objetivo es actuar como un Director de Análisis Económico Senior para una firma de inversión global. No resumas; desmenuza y profundiza.

    INSTRUCCIONES CRÍTICAS PARA LA PROFUNDIDAD DEL INFORME:
    1. ESTRUCTURACIÓN POR SECCIONES: La minuta está dividida en las siguientes secciones clave que DEBES identificar y analizar para una precisión total:
       - 1. LUGAR, FECHA Y ASISTENTES: Contexto institucional y quórum.
       - 2. ANÁLISIS Y MOTIVACIÓN DE LOS VOTOS: Esta es la médula espinal del reporte. Debes expandir cada subpunto:
            * "Entorno Externo": Inflación global, política de la FED, riesgos geopolíticos.
            * "Actividad Económica en México": Brecha de producto, mercado laboral, consumo e inversión.
            * "Inflación en México": Desglose detallado de la subyacente (servicios vs mercancías) y no subyacente.
            * "Entorno Macrofinanciero": Tipo de cambio, curva de rendimientos, flujos de capital.
       - 3. DECISIÓN DE POLÍTICA MONETARIA: La postura oficial (Restrictiva, Neutral, Expansiva) y la guía futura (Forward Guidance).
       - 4. VOTACIÓN: Desglose exacto.
       - 5. OPINIONES/VOTOS DISIDENTES: Análisis exhaustivo de los desacuerdos técnicos.
    
    2. PRIORIDAD DE NEGRILLAS: Las partes en **negrita** son mandatos de comunicación del Banco. Úsalas para construir los insights más potentes.
    3. MAPEO E INDIVIDUALIZACIÓN: Identifica las posturas individuales mencionadas como "algunos miembros", "la mayoría", "un miembro".
    4. DISIDENCIAS TÉCNICAS: Explica con lujo de detalle POR QUÉ un miembro disiente (ej. si cree que la postura es demasiado restrictiva dado el entorno de crecimiento débil).
    5. TONO HAWKISH VS DOVISH: Identifica el balance de riesgos y si el tono general se inclina hacia la dureza (hawk) o la flexibilidad (dove).

    EXTRAE EN FORMATO JSON SIGUIENDO ESTA ESTRUCTURA EXACTA (genera textos largos y detallados, no párrafos de 2 líneas):
    {
      "decision": { 
        "tasa": "Valor exacto (ej. 7.00%)", 
        "cambio": "Descripción precisa (ej. Mantenimiento del nivel objetivo)", 
        "votacion": "Resultado detallado (ej. 4 votos a favor, 1 en contra)", 
        "tipo": "Etiqueta estratégica profesional (ej. Pausa Restrictiva con Sesgo al Alza)" 
      },
      "veredicto": "Un veredicto ejecutivo robusto de al menos 3 párrafos técnicos donde conectes el entorno externo con la inflación local y la decisión tomada.",
      "insights": [
        { "titulo": "Insight Estratégico 1", "desc": "Descripción detallada (mínimo 30 palabras) vinculando datos de la minuta con su impacto macro.", "color": "text-blue-500", "bg": "bg-blue-900/40" }
      ],
      "detalle": {
        "pormenorizado": "Un análisis técnico extenso (mínimo 200 palabras) sobre el debate interno de la Junta, contrastando las visiones sobre el crecimiento y la persistencia de la inflación en servicios.",
        "factoresInflacion": ["Factor detallado 1 (ej. Persistencia de la inflación subyacente en el rubro de servicios alimenticios)", "Factor detallado 2"],
        "mecanismosDefensa": ["Mecanismo detallado 1 (ej. Mantenimiento de una postura monetaria restrictiva por tiempo prolongado)", "Mecanismo detallado 2"],
        "disidente": "Si hay disenso (ej. Heath), explica detalladamente su tesis técnica (comunicado vs tasa) y por qué cree que la estrategia actual es subóptima. Si no hay disenso, analiza el grado de cohesión de la mayoría."
      },
      "ponderaciones": [
        { "label": "Nombre del Pilar Coyuntural", "pct": 40, "color": "bg-blue-600" }
      ]
    }

    IMPORTANTE: Si en una sección no encuentras información explícita, intenta inferirla del tono general de los miembros o indica que es un punto de consenso no detallado. No digas "No especificado" a menos que sea absolutamente imposible de hallar.

    Contenido de la minuta:
    ${contenido.substring(0, 100000)}
`;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4-turbo-preview",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
        temperature: 0.2,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Error de OpenAI API:", data);
      throw new Error(`OpenAI API error: ${data.error?.message || response.statusText}`);
    }

    if (!data.choices || !data.choices[0]?.message?.content) {
      console.error("Respuesta inesperada de OpenAI:", data);
      throw new Error("La IA devolvió una respuesta vacía o malformada.");
    }

    return JSON.parse(data.choices[0].message.content);
  } catch (error: any) {
    console.error("Error detallado en analisisActions:", error);
    throw new Error(error.message || "Error al procesar la minuta con la IA.");
  }
}
