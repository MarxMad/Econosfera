"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { getQuizById, submitQuizAttempt } from "@/lib/actions/quizSubmit";
import { BrainCircuit, Check, X, ArrowRight, Trophy, Sparkles } from "lucide-react";
import Link from "next/link";
import Confetti from "react-confetti";

export default function QuizPage({ params }: { params: { id: string } }) {
    const { data: session, status } = useSession();
    const router = useRouter();

    const [quiz, setQuiz] = useState<any>(null);
    const [currentIdx, setCurrentIdx] = useState(0);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [score, setScore] = useState(0);
    const [finished, setFinished] = useState(false);
    const [saving, setSaving] = useState(false);
    const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

    useEffect(() => {
        if (typeof window !== "undefined") {
            setWindowSize({ width: window.innerWidth, height: window.innerHeight });
        }
        if (status === "authenticated") {
            loadQuiz();
        }
    }, [status]);

    const loadQuiz = async () => {
        const q = await getQuizById(params.id);
        if (q) setQuiz(q);
        else router.push("/cuestionarios");
    };

    if (status === "loading" || !quiz) {
        return <div className="p-20 text-center text-slate-500 animate-pulse">Cargando desafío...</div>;
    }

    if (!session) {
        return <div className="p-20 text-center text-slate-500">Inicia sesión primero.</div>;
    }

    const question = quiz.questions[currentIdx];

    const handleSelect = (optionId: string) => {
        if (isAnswered) return;
        setSelectedOption(optionId);
    };

    const handleCheck = () => {
        if (!selectedOption) return;
        setIsAnswered(true);
        const opt = question.options.find((o: any) => o.id === selectedOption);
        if (opt?.isCorrect) {
            setScore(prev => prev + 1);
        }
    };

    const handleNext = async () => {
        if (currentIdx < quiz.questions.length - 1) {
            setCurrentIdx(prev => prev + 1);
            setSelectedOption(null);
            setIsAnswered(false);
        } else {
            // Finish
            setFinished(true);
            setSaving(true);
            const finalScore = score + (question.options.find((o: any) => o.id === selectedOption)?.isCorrect ? 1 : 0);
            const percentage = (finalScore / quiz.questions.length) * 100;
            // Award full XP if 100%, otherwise proportional
            const earnedXp = Math.floor(quiz.xpReward * (percentage / 100));

            await submitQuizAttempt(quiz.id, Math.round(percentage), earnedXp);
            setSaving(false);
        }
    };

    if (finished) {
        const percentage = (score / quiz.questions.length) * 100;
        const passed = percentage >= 70;
        return (
            <div className="max-w-3xl mx-auto px-4 py-20 text-center">
                {passed && <Confetti width={windowSize.width} height={windowSize.height} recycle={false} numberOfPieces={500} />}

                <div className={`w-24 h-24 mx-auto rounded-3xl mb-8 flex items-center justify-center shadow-xl 
                    ${passed ? 'bg-gradient-to-br from-indigo-500 to-purple-600' : 'bg-slate-200 dark:bg-slate-800'}`}>
                    <Trophy className={`w-12 h-12 ${passed ? 'text-white' : 'text-slate-400'}`} />
                </div>

                <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-4">
                    {passed ? "¡Desafío Completado!" : "Buen esfuerzo"}
                </h1>

                <p className="text-lg text-slate-500 mb-8 max-w-lg mx-auto">
                    Has obtenido <strong className="text-slate-900 dark:text-white">{score} de {quiz.questions.length}</strong> aciertos correctos.
                    Puntaje final: {Math.round(percentage)}%.
                </p>

                <div className="flex items-center justify-center gap-4">
                    <Link href="/cuestionarios" className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl shadow-xl shadow-indigo-600/30 transition-all hover:-translate-y-1">
                        Volver a los módulos
                    </Link>
                </div>
            </div>
        );
    }

    const progress = ((currentIdx) / quiz.questions.length) * 100;

    return (
        <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
            {/* Header / Progress bar */}
            <div className="mb-8">
                <div className="flex items-center justify-between text-sm font-bold text-slate-500 mb-3">
                    <button onClick={() => router.push('/cuestionarios')} className="hover:text-slate-900 dark:hover:text-white transition-colors">
                        ✕ Salir
                    </button>
                    <span className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 px-3 py-1 rounded-full uppercase tracking-wider text-[10px]">
                        Pregunta {currentIdx + 1} de {quiz.questions.length}
                    </span>
                </div>
                <div className="h-3 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
                </div>
            </div>

            {/* Question Card */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-10 shadow-xl border border-slate-200 dark:border-slate-800">
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-8 leading-tight">
                    {question.text}
                </h2>

                <div className="space-y-3 mb-8">
                    {question.options.map((opt: any) => {
                        const isSelected = selectedOption === opt.id;
                        let bgClass = "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-indigo-400 hover:shadow-md";
                        let textClass = "text-slate-700 dark:text-slate-300";

                        if (isAnswered) {
                            if (opt.isCorrect) {
                                bgClass = "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-500 shadow-md shadow-emerald-500/10";
                                textClass = "text-emerald-800 dark:text-emerald-400 font-bold";
                            } else if (isSelected && !opt.isCorrect) {
                                bgClass = "bg-rose-50 dark:bg-rose-900/20 border-rose-500 opacity-70";
                                textClass = "text-rose-800 dark:text-rose-400";
                            } else {
                                bgClass = "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 opacity-50";
                            }
                        } else if (isSelected) {
                            bgClass = "bg-indigo-50 dark:bg-indigo-900/20 border-indigo-500 shadow-md shadow-indigo-500/10";
                            textClass = "text-indigo-800 dark:text-indigo-400 font-bold";
                        }

                        return (
                            <button
                                key={opt.id}
                                disabled={isAnswered}
                                onClick={() => handleSelect(opt.id)}
                                className={`w-full text-left p-5 rounded-2xl border-2 transition-all ${bgClass}`}
                            >
                                <div className="flex items-center justify-between">
                                    <span className={`text-lg transition-colors ${textClass}`}>
                                        {opt.text}
                                    </span>
                                    {isAnswered && opt.isCorrect && (
                                        <div className="p-1 rounded-full bg-emerald-500 text-white">
                                            <Check className="w-4 h-4" />
                                        </div>
                                    )}
                                    {isAnswered && isSelected && !opt.isCorrect && (
                                        <div className="p-1 rounded-full bg-rose-500 text-white">
                                            <X className="w-4 h-4" />
                                        </div>
                                    )}
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* Explanation Box */}
                {isAnswered && question.explanation && (
                    <div className={`p-4 rounded-2xl mb-8 ${question.options.find((o: any) => o.id === selectedOption)?.isCorrect
                            ? 'bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/50'
                            : 'bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800/50'
                        }`}>
                        <div className="flex items-start gap-3">
                            <Sparkles className={`w-6 h-6 mt-1 flex-shrink-0 ${question.options.find((o: any) => o.id === selectedOption)?.isCorrect ? 'text-emerald-500' : 'text-rose-500'
                                }`} />
                            <div>
                                <h4 className={`text-sm font-black mb-1 ${question.options.find((o: any) => o.id === selectedOption)?.isCorrect ? 'text-emerald-800 dark:text-emerald-400' : 'text-rose-800 dark:text-rose-400'
                                    }`}>
                                    {question.options.find((o: any) => o.id === selectedOption)?.isCorrect ? '¡Excelente análisis!' : 'No exactamente...'}
                                </h4>
                                <p className={`text-sm leading-relaxed ${question.options.find((o: any) => o.id === selectedOption)?.isCorrect ? 'text-emerald-700/80 dark:text-emerald-300/80' : 'text-rose-700/80 dark:text-rose-300/80'
                                    }`}>
                                    {question.explanation}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
                    {!isAnswered ? (
                        <button
                            disabled={!selectedOption}
                            onClick={handleCheck}
                            className={`px-8 py-4 rounded-xl font-bold transition-all text-white shadow-lg ${selectedOption ? 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/30 hover:-translate-y-1' : 'bg-slate-300 dark:bg-slate-700 opacity-50 cursor-not-allowed shadow-none'
                                }`}
                        >
                            Comprobar
                        </button>
                    ) : (
                        <button
                            onClick={handleNext}
                            className="px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:-translate-y-1 hover:shadow-xl transition-all rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg"
                        >
                            {currentIdx < quiz.questions.length - 1 ? 'Siguiente Pregunta' : (saving ? 'Guardando XP...' : 'Finalizar Desafío')}
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
