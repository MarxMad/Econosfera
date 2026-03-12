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
        <div className="my-10 p-1 rounded-[2.5rem] bg-gradient-to-br from-blue-600 via-indigo-600 to-emerald-600">
            <div className="bg-white dark:bg-[#0f172a] p-8 sm:p-10 rounded-[2.4rem] flex flex-col sm:flex-row items-center gap-8">
                <div className="p-5 rounded-[2rem] bg-blue-600 text-white shadow-xl shadow-blue-500/20">
                    <Zap className="w-10 h-10 fill-current" />
                </div>

                <div className="flex-1 space-y-2 text-center sm:text-left">
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white leading-tight">
                        {title}
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">
                        {description}
                    </p>
                </div>

                <Link
                    href={href}
                    className="group px-8 py-5 rounded-2xl bg-slate-900 border border-slate-800 text-white font-black text-sm hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                >
                    Probar Simulador
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>
        </div>
    );
}
