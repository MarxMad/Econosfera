"use client";

import { useState } from "react";
import CryptoJS from "crypto-js";
import { GitMerge, FileText } from "lucide-react";

export function SimuladorMerkle() {
    const [txs, setTxs] = useState([
        "Gerry envía 1 BTC a Satoshi",
        "Alice compra 5 ETH",
        "Bob transfiere 100 USDT",
        "Contrato inteligente creado"
    ]);

    const hash = (data: string) => CryptoJS.SHA256(data).toString().slice(0, 16);

    // Hojas (Leaves)
    const h1 = hash(txs[0]);
    const h2 = hash(txs[1]);
    const h3 = hash(txs[2]);
    const h4 = hash(txs[3]);

    // Ramas (Branches)
    const h12 = hash(h1 + h2);
    const h34 = hash(h3 + h4);

    // Raíz (Root)
    const root = hash(h12 + h34);

    const updateTx = (index: number, newStr: string) => {
        const newTxs = [...txs];
        newTxs[index] = newStr;
        setTxs(newTxs);
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="rounded-2xl border border-violet-200 dark:border-violet-900 bg-violet-50/50 dark:bg-violet-900/10 p-6 shadow-sm">
                <h3 className="text-xl font-bold flex items-center gap-2 mb-3 text-violet-800 dark:text-violet-300">
                    <GitMerge className="w-5 h-5" />
                    Árboles de Merkle: Comprimiendo la Blockchain
                </h3>
                <div className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
                    <p>
                        Bitcoin tiene millones de transacciones. Si para comprobar si mi transacción es válida tuviera que descargar y recalcular todas las anteriores, requeriría una supercomputadora.
                    </p>
                    <p>
                        Los <strong>Árboles de Merkle</strong> solucionan esto comprimiendo las transacciones de dos en dos, desde la base hasta llegar a una única y comprimida <strong>Raíz de Merkle</strong> (Merkle Root). Toda alteración en una hoja de abajo, se propagará hacia arriba de la pirámide alterando la Raíz final.
                    </p>
                </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 sm:p-10 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-x-auto relative">

                {/* SVG Connecting Lines */}
                <svg className="absolute inset-0 w-full h-full text-slate-300 dark:text-slate-600 z-0 hidden sm:block pointer-events-none" style={{ minWidth: '600px' }}>
                    {/* Root to Branches */}
                    <path d="M50% 12% Q 50% 30% 25% 42%" fill="none" stroke="currentColor" strokeWidth="2" />
                    <path d="M50% 12% Q 50% 30% 75% 42%" fill="none" stroke="currentColor" strokeWidth="2" />
                    {/* Branches to Leaves */}
                    <path d="M25% 42% Q 25% 65% 12.5% 72%" fill="none" stroke="currentColor" strokeWidth="2" />
                    <path d="M25% 42% Q 25% 65% 37.5% 72%" fill="none" stroke="currentColor" strokeWidth="2" />
                    <path d="M75% 42% Q 75% 65% 62.5% 72%" fill="none" stroke="currentColor" strokeWidth="2" />
                    <path d="M75% 42% Q 75% 65% 87.5% 72%" fill="none" stroke="currentColor" strokeWidth="2" />
                </svg>

                <div className="relative z-10 flex flex-col items-center gap-10 min-w-[600px] pb-4">

                    {/* Level 1: Root */}
                    <div className="flex flex-col items-center">
                        <span className="text-[10px] uppercase font-bold text-violet-500 mb-1">Raíz de Merkle (Va en el Bloque)</span>
                        <div className="px-6 py-3 bg-violet-600 text-white font-mono rounded-xl shadow-lg border border-violet-700 font-bold transition-all duration-300 transform animate-in zoom-in-95">
                            {root}
                        </div>
                    </div>

                    {/* Level 2: Branches */}
                    <div className="flex justify-around w-full px-8">
                        <div className="flex flex-col items-center">
                            <span className="text-[10px] uppercase font-bold text-slate-500 mb-1">Rama H12</span>
                            <div className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-mono rounded-lg shadow-sm border border-slate-300 dark:border-slate-600 transition-colors">
                                {h12}
                            </div>
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="text-[10px] uppercase font-bold text-slate-500 mb-1">Rama H34</span>
                            <div className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-mono rounded-lg shadow-sm border border-slate-300 dark:border-slate-600 transition-colors">
                                {h34}
                            </div>
                        </div>
                    </div>

                    {/* Level 3: Hashes de Hojas */}
                    <div className="flex justify-between w-full px-4 text-center">
                        <div className="w-1/4 px-2">
                            <span className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Hash T1</span>
                            <div className="px-2 py-1 text-xs bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400 font-mono rounded border border-emerald-200 dark:border-emerald-800 truncate">
                                {h1}
                            </div>
                        </div>
                        <div className="w-1/4 px-2">
                            <span className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Hash T2</span>
                            <div className="px-2 py-1 text-xs bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400 font-mono rounded border border-emerald-200 dark:border-emerald-800 truncate">
                                {h2}
                            </div>
                        </div>
                        <div className="w-1/4 px-2">
                            <span className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Hash T3</span>
                            <div className="px-2 py-1 text-xs bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400 font-mono rounded border border-emerald-200 dark:border-emerald-800 truncate">
                                {h3}
                            </div>
                        </div>
                        <div className="w-1/4 px-2">
                            <span className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Hash T4</span>
                            <div className="px-2 py-1 text-xs bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400 font-mono rounded border border-emerald-200 dark:border-emerald-800 truncate">
                                {h4}
                            </div>
                        </div>
                    </div>

                    {/* Level 4: Editable Transactions */}
                    <div className="flex justify-between w-full text-center mt-2">
                        {txs.map((t, idx) => (
                            <div key={idx} className="w-1/4 px-2">
                                <span className="block flex items-center justify-center gap-1 text-[10px] uppercase font-bold text-blue-500 mb-1">
                                    <FileText className="w-3 h-3" /> Transacción {idx + 1}
                                </span>
                                <textarea
                                    className="w-full text-[10px] p-2 bg-white dark:bg-slate-900 border border-blue-200 dark:border-blue-900 rounded focus:ring-2 focus:ring-blue-500 outline-none resize-none font-medium h-16 shadow-sm"
                                    value={t}
                                    onChange={(e) => updateTx(idx, e.target.value)}
                                />
                            </div>
                        ))}
                    </div>

                </div>
            </div>
            <p className="text-xs text-center text-slate-500 mt-4 leading-relaxed">
                👉 Modifica alguna de las transacciones (ej: cambia "Alice" por "Carlos" en la Tx2).
                Dicha edición cambiará el "Hash T2", lo que forzará un cambio en la rama superior "Rama H12", lo cual finalmente destruirá y modificará la "Raíz de Merkle".
                Solo almacenando UN número (la Raíz de Merkle), la Blockchain se asegura de que ninguno de los millones de datos de abajo fuera alterado.
            </p>
        </div>
    );
}
