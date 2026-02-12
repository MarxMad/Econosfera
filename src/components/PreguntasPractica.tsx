"use client";

import { useState, useEffect } from "react";
import { Target, Trophy, RefreshCw, BookOpen } from "lucide-react";
import { getSesionPreguntas, type Pregunta } from "@/lib/preguntas";
import type { ModuloSimulador } from "./NavSimuladores";

const MODULOS_CON_PRACTICA: Array<"inflacion" | "macro" | "micro"> = ["inflacion", "macro", "micro"];
const NOMBRES_MODULO: Record<"inflacion" | "macro" | "micro", string> = {
  inflacion: "Inflación y política monetaria",
  macro: "Macroeconomía",
  micro: "Microeconomía",
};

interface PreguntasPracticaProps {
  modulo: ModuloSimulador;
  onIrAModulo?: (modulo: ModuloSimulador) => void;
}

const CANTIDAD_POR_SESION = 10;

export default function PreguntasPractica({ modulo, onIrAModulo }: PreguntasPracticaProps) {
  const [sessionKey, setSessionKey] = useState(0);
  const [preguntaActual, setPreguntaActual] = useState(0);
  const [respuestaUsuario, setRespuestaUsuario] = useState<string | number>("");
  const [mostrarResultado, setMostrarResultado] = useState(false);
  const [preguntasCorrectas, setPreguntasCorrectas] = useState(0);
  const [totalIntentos, setTotalIntentos] = useState(0);
  const [sesionCompletada, setSesionCompletada] = useState(false);
  const [preguntas, setPreguntas] = useState<Pregunta[]>([]);

  // Sesión de preguntas solo en el cliente (getSesionPreguntas usa Math.random, evita hydration mismatch)
  useEffect(() => {
    if (modulo === "inflacion" || modulo === "macro" || modulo === "micro") {
      setPreguntas(getSesionPreguntas(modulo, CANTIDAD_POR_SESION));
    } else {
      setPreguntas([]);
    }
  }, [modulo, sessionKey]);

  useEffect(() => {
    setPreguntaActual(0);
    setRespuestaUsuario("");
    setMostrarResultado(false);
    setPreguntasCorrectas(0);
    setTotalIntentos(0);
    setSesionCompletada(false);
  }, [modulo]);

  const pregunta = preguntas[preguntaActual];
  const esUltimaPregunta = preguntas.length > 0 && preguntaActual === preguntas.length - 1;

  const verificarRespuesta = () => {
    if (respuestaUsuario === "" || !pregunta) return;
    setTotalIntentos((prev) => prev + 1);
    const esCorrecta =
      typeof pregunta.respuestaCorrecta === "number"
        ? Math.abs(Number(respuestaUsuario) - pregunta.respuestaCorrecta) < 0.01
        : respuestaUsuario === pregunta.respuestaCorrecta;
    if (esCorrecta) {
      setPreguntasCorrectas((prev) => prev + 1);
    }
    setMostrarResultado(true);
  };

  const siguientePregunta = () => {
    if (esUltimaPregunta) {
      setSesionCompletada(true);
      return;
    }
    setPreguntaActual((prev) => prev + 1);
    setRespuestaUsuario("");
    setMostrarResultado(false);
  };

  const reiniciar = () => {
    setSessionKey((k) => k + 1);
    setPreguntaActual(0);
    setRespuestaUsuario("");
    setMostrarResultado(false);
    setPreguntasCorrectas(0);
    setTotalIntentos(0);
    setSesionCompletada(false);
  };

  const irATema = (m: ModuloSimulador) => {
    onIrAModulo?.(m);
  };

  if (preguntas.length === 0) {
    return null;
  }

  const esCorrecta =
    pregunta &&
    (typeof pregunta.respuestaCorrecta === "number"
      ? Math.abs(Number(respuestaUsuario) - pregunta.respuestaCorrecta) < 0.01
      : respuestaUsuario === pregunta.respuestaCorrecta);

  if (sesionCompletada) {
    const porcentaje = totalIntentos > 0 ? Math.round((preguntasCorrectas / totalIntentos) * 100) : 0;
    return (
      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 shadow-lg overflow-hidden">
        <div className="p-5 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-slate-800 dark:to-slate-800">
          <div className="flex items-center gap-2">
            <Trophy className="w-6 h-6 text-amber-500" aria-hidden />
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Resultado de la sesión</h2>
          </div>
        </div>
        <div className="p-6 space-y-6">
          <div className="text-center py-4">
            <p className="text-4xl font-bold text-slate-800 dark:text-slate-100">
              {preguntasCorrectas} / {CANTIDAD_POR_SESION}
            </p>
            <p className="text-lg text-slate-600 dark:text-slate-400 mt-1">{porcentaje}% de aciertos</p>
            <p className="text-sm text-slate-500 dark:text-slate-500 mt-2">
              Tema: {NOMBRES_MODULO[modulo as "inflacion" | "macro" | "micro"] ?? "Práctica"}
            </p>
          </div>
          {onIrAModulo && (
            <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-3">Completar sesiones en temas específicos:</p>
              <div className="flex flex-wrap gap-2">
                {MODULOS_CON_PRACTICA.map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => irATema(m)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                  >
                    <BookOpen className="w-4 h-4" />
                    {NOMBRES_MODULO[m]}
                  </button>
                ))}
              </div>
            </div>
          )}
          <div className="flex justify-center">
            <button
              type="button"
              onClick={reiniciar}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Repetir este tema
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 shadow-lg overflow-hidden">
      <div className="p-5 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-slate-800 dark:to-slate-800">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Target className="w-6 h-6 text-slate-600 dark:text-slate-400" aria-hidden />
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Preguntas de práctica</h2>
          </div>
          {totalIntentos > 0 && (
            <div className="text-sm text-slate-600 dark:text-slate-400">
              {preguntasCorrectas}/{totalIntentos} correctas
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
          <span>Pregunta {preguntaActual + 1} de {preguntas.length}</span>
          {totalIntentos > 0 && (
            <span className="text-blue-600 dark:text-blue-400">
              ({Math.round((preguntasCorrectas / totalIntentos) * 100)}% aciertos)
            </span>
          )}
        </div>
      </div>

      <div className="p-5">
        {pregunta && (
          <div className="space-y-4">
            <div>
              <p className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">
                {pregunta.pregunta}
              </p>

              {pregunta.tipo === "multiple" && pregunta.opciones && (
                <div className="space-y-2">
                  {pregunta.opciones.map((opcion, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => !mostrarResultado && setRespuestaUsuario(opcion)}
                      disabled={mostrarResultado}
                      className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-all ${
                        mostrarResultado
                          ? opcion === pregunta.respuestaCorrecta
                            ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                            : respuestaUsuario === opcion && opcion !== pregunta.respuestaCorrecta
                              ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                              : "border-slate-200 dark:border-slate-700"
                          : respuestaUsuario === opcion
                            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                            : "border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                      }`}
                    >
                      <span className="font-medium text-slate-800 dark:text-slate-200">{opcion}</span>
                    </button>
                  ))}
                </div>
              )}

              {pregunta.tipo === "numerica" && (
                <div>
                  <input
                    type="number"
                    value={respuestaUsuario}
                    onChange={(e) => !mostrarResultado && setRespuestaUsuario(e.target.value)}
                    disabled={mostrarResultado}
                    step="0.01"
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-500 disabled:opacity-50"
                    placeholder="Ingresa tu respuesta numérica"
                  />
                </div>
              )}
            </div>

            {mostrarResultado && (
              <div
                className={`p-4 rounded-xl border-2 ${
                  esCorrecta
                    ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                    : "border-amber-500 bg-amber-50 dark:bg-amber-900/20"
                }`}
              >
                <p className={`font-semibold mb-2 ${esCorrecta ? "text-green-700 dark:text-green-300" : "text-amber-700 dark:text-amber-300"}`}>
                  {esCorrecta ? "✓ Correcto" : "✗ Incorrecto"}
                </p>
                <p className="text-sm text-slate-700 dark:text-slate-300">
                  <strong>Respuesta correcta:</strong> {typeof pregunta.respuestaCorrecta === "number" ? pregunta.respuestaCorrecta : pregunta.respuestaCorrecta}
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">{pregunta.explicacion}</p>
              </div>
            )}

            <div className="flex gap-3">
              {!mostrarResultado ? (
                <button
                  type="button"
                  onClick={verificarRespuesta}
                  disabled={respuestaUsuario === ""}
                  className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Verificar respuesta
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={siguientePregunta}
                    className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                  >
                    {esUltimaPregunta ? "Ver resultado final" : "Siguiente pregunta"}
                  </button>
                  <button
                    type="button"
                    onClick={reiniciar}
                    className="px-4 py-2.5 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-semibold hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                  >
                    Reiniciar
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
