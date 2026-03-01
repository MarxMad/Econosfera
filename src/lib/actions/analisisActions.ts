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

  if (!user || user.credits < 10) {
    throw new Error("No tienes créditos de IA suficientes (se requieren 10). Por favor, adquiere más créditos.");
  }

  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error("OPENAI_API_KEY no configurada en el servidor.");
  }

  // Descontar 10 créditos antes de la llamada
  await prisma.user.update({
    where: { id: session.user.id },
    data: { credits: { decrement: 10 } }
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
    Analiza la siguiente minuta de la decisión de Política Monetaria del Banco de México (Banxico) con rigor analítico, cuantitativo y financiero de grado institucional.
    Tu objetivo es actuar como un Director de Análisis Económico (Chief Economist) estructurando un reporte crítico para fondos de inversión.

    INSTRUCCIONES CRÍTICAS (SI NO SIGUES ESTO, EL REPORTE SERÁ RECHAZADO):
    1. EXTRACCIÓN DE DATOS DUROS: NO HAGAS RESÚMENES GENÉRICOS. EXIGE NÚMEROS. Extrae cifras exactas mencionadas, porcentajes de inflación (general y subyacente, quincenal o mensual), estimaciones de PIB, y datos del mercado laboral. Si dicen "la inflación bajó", tú debes buscar en el texto y escribir "la inflación bajó a X.XX%".
    2. MAPEO MILIMÉTRICO DE DISIDENCIAS: OBLIGATORIO LEER AL FINAL DE LA MINUTA (sección de VOTACIÓN y OPINIONES/VOTOS DISIDENTES). Busca EXPRESAMENTE si la votación fue unánime (ej. 5-0) o hubo votos disidentes (ej. 4-1). Por lo general, subgobernadores como Jonathan Heath o Irene Espinosa pueden disentir en la magnitud del recorte o en la señal del comunicado. Si hay un voto a favor de una decisión distinta (ej. recortar 25pb en lugar de 50pb, o mantener en lugar de recortar), ESTO ES UNA DISIDENCIA Y DEBE SER DOCUMENTADA A DETALLE.
    3. DETALLE POR MIEMBROS: Rastrea diferencias de opinión: "un miembro destacó...", "algunos miembros advirtieron...", "la mayoría coincidió...". Atribuye posturas hawkish (restrictivas) o dovish (acomodaticias).

    ESTRUCTURA DEL JSON A DEVOLVER (RESPETA ESTE ESQUEMA EXACTO):
    {
      "decision": { 
        "tasa": "Valor final de la tasa de referencia impreso (ej. 11.25%, 11.00%)", 
        "cambio": "Magnitud exacta del cambio (ej. Recorte de 25 puntos base, Sin cambios)", 
        "votacion": "Resultado exacto de la votación (ej. Unanimidad, 4 votos a favor y 1 en contra de Heath por mantener)", 
        "tipo": "Clasificación profesional (ej. Pausa Hawkish, Recorte Dovish con precaución)" 
      },
      "veredicto": "Resumen ejecutivo de 3 a 4 párrafos PROFUNDOS. Especifica qué pesó más en la balanza de riesgos (ej. debilidad económica vs resistencia en inflación de servicios). Cita los números exactos de inflación o crecimiento económico mencionados que justificaron el voto.",
      "insights": [
        { "titulo": "Inflación de Servicios (Rigidez)", "desc": "Detalla los datos duros y la opinión de la junta sobre esto (Mín. 40 palabras).", "color": "text-rose-500", "bg": "bg-rose-900/10" },
        { "titulo": "Balance de Riesgos Económicos", "desc": "Detalles sobre PIB, empleo, tipo de cambio y brecha de producto.", "color": "text-blue-500", "bg": "bg-blue-900/10" },
        { "titulo": "Postura Global / FED", "desc": "Cómo influyó la decisión de la Reserva Federal o eventos geopolíticos.", "color": "text-indigo-500", "bg": "bg-indigo-900/10" }
      ],
      "detalle": {
        "pormenorizado": "Análisis extenso (mínimo 200 palabras) sobre el debate interno. Qué miembros están preocupados por la persistencia inflacionaria. Qué miembros notan estancamiento económico. Menciona el tono exacto sobre el Forward Guidance (guía prospectiva para las siguientes decisiones).",
        "factoresInflacion": ["Factor 1 exacto (ej. Servicios educativos crecieron X%)", "Factor 2 (Choques de oferta en agropecuarios)"],
        "mecanismosDefensa": ["Estrategia 1 (Mantener tasa en terreno restrictivo un tiempo prolongado)", "Estrategia 2 (Monitoreo de expectativas de inflación a largo plazo)"],
        "disidente": "¡REVISIÓN CRÍTICA! Ve a la sección de Votación. Si la decisión NO fue unánime, documenta nombre, voto exacto (qué proponía) y sus argumentos a profundidad. Si hubo unanimidad, explica qué concesión se en el comunicado para lograr esa unanimidad."
      },
      "ponderaciones": [
        { "label": "Inflación de Servicios / Subyacente", "pct": 45, "color": "bg-rose-600" },
        { "label": "Riesgo de Desaceleración / Brecha", "pct": 30, "color": "bg-blue-600" },
        { "label": "Entorno Externo y FED", "pct": 25, "color": "bg-indigo-600" }
      ]
    }

    IMPORTANTE: LEE TODO EL TEXTO. LA DISIDENCIA USUALMENTE ESTÁ EN LOS ÚLTIMOS PÁRRAFOS O ANEXOS. ASEGÚRATE DE USAR DATOS CUANTITATIVOS SI LA MINUTA LOS CONTIENE. RECHAZA PARRAFOS GENERALES.

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
      throw new Error(`OpenAI API error: ${data.error?.message || response.statusText} `);
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
