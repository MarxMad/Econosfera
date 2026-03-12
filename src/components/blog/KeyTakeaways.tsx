import React from 'react';
import { Lightbulb } from 'lucide-react';

interface KeyTakeawaysProps {
    points: string[];
}

export default function KeyTakeaways({ points }: KeyTakeawaysProps) {
    return (
        <div className="my-10 p-8 rounded-[2rem] bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/50 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-10">
                <Lightbulb className="w-24 h-24 text-amber-600 dark:text-amber-400" />
            </div>

            <div className="relative z-10">
                <h3 className="text-xl font-black text-amber-900 dark:text-amber-200 mb-6 flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-amber-200/50 dark:bg-amber-800/50">
                        <Lightbulb className="w-5 h-5" />
                    </div>
                    Conceptos Clave de Consulta
                </h3>

                <ul className="grid sm:grid-cols-2 gap-4">
                    {points.map((point, i) => (
                        <li key={i} className="flex gap-3 text-sm text-amber-800 dark:text-amber-300 font-medium">
                            <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-amber-500 mt-2" />
                            {point}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
