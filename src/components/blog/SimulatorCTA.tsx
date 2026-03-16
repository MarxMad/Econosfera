import React from 'react';
import Link from 'next/link';
import { Zap, ArrowRight } from 'lucide-react';

interface SimulatorCTAProps {
    title: string;
    description: string;
    href: string;
}

export default function SimulatorCTA({ title, description, href }: SimulatorCTAProps) {
    return (
        <div className="my-8 sm:my-10 p-1 rounded-xl sm:rounded-[2.5rem] bg-gradient-to-br from-blue-600 via-indigo-600 to-emerald-600 overflow-hidden">
            <div className="bg-white dark:bg-[#0f172a] p-5 sm:p-8 md:p-10 rounded-[0.9rem] sm:rounded-[2.4rem] flex flex-col sm:flex-row items-center gap-6 sm:gap-8 min-w-0">
                <div className="p-4 sm:p-5 rounded-xl sm:rounded-[2rem] bg-blue-600 text-white shadow-xl shadow-blue-500/20 flex-shrink-0">
                    <Zap className="w-8 h-8 sm:w-10 sm:h-10 fill-current" />
                </div>

                <div className="flex-1 space-y-2 text-center sm:text-left min-w-0">
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-tight break-words">
                        {title}
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 font-medium text-sm sm:text-base break-words">
                        {description}
                    </p>
                </div>

                <Link
                    href={href}
                    className="group w-full sm:w-auto flex justify-center px-6 sm:px-8 py-4 sm:py-5 rounded-xl sm:rounded-2xl bg-slate-900 border border-slate-800 text-white font-black text-sm hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2"
                >
                    Probar Simulador
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>
        </div>
    );
}
