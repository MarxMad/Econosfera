"use client";

import React, { useState } from 'react';
import { Send, Mail, CheckCircle2 } from 'lucide-react';

export default function NewsletterBox() {
    const [subscribed, setSubscribed] = useState(false);

    if (subscribed) {
        return (
            <div className="my-12 p-8 rounded-[2.5rem] bg-blue-600 text-white text-center animate-in fade-in zoom-in duration-500">
                <div className="mb-4 inline-flex p-3 rounded-2xl bg-white/20">
                    <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-black mb-2">¡Bienvenido a bordo!</h3>
                <p className="text-blue-100 font-medium">Ahora eres parte de los 1,000 expertos que dominan la economía.</p>
            </div>
        );
    }

    return (
        <div className="my-12 p-8 sm:p-12 rounded-[2.5rem] bg-slate-900 border border-blue-500/20 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[100px] -mr-20 -mt-20 rounded-full" />

            <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                <div className="flex-1 space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-widest">
                        Únete a la comunidad
                    </div>
                    <h3 className="text-3xl font-black text-white leading-tight">
                        ¿Quieres dominar estos temas?
                    </h3>
                    <p className="text-slate-400 font-medium leading-relaxed">
                        Únete a nuestro newsletter semanal. Análisis de Banxico, modelos en Python y hacks de consulta rápida.
                    </p>
                </div>

                <div className="w-full md:w-auto flex-shrink-0">
                    <form
                        onSubmit={(e) => { e.preventDefault(); setSubscribed(true); }}
                        className="p-2 bg-slate-800 border border-slate-700 rounded-2xl flex flex-col sm:flex-row gap-2"
                    >
                        <div className="flex-1 flex items-center px-4 gap-3 py-3">
                            <Mail className="w-5 h-5 text-slate-500" />
                            <input
                                type="email"
                                placeholder="tu@email.com"
                                className="bg-transparent text-white placeholder-slate-500 focus:outline-none font-bold text-sm w-full"
                                required
                            />
                        </div>
                        <button className="px-8 py-4 rounded-xl bg-blue-600 text-white font-black text-sm hover:bg-blue-500 transition-all flex items-center justify-center gap-2">
                            Subscribirme
                            <Send className="w-4 h-4" />
                        </button>
                    </form>
                    <p className="text-[10px] text-slate-500 mt-4 text-center">
                        Respetamos tu privacidad. Un correo a la semana, cero spam.
                    </p>
                </div>
            </div>
        </div>
    );
}
