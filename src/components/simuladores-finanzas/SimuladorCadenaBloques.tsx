"use client";

import { useState, useEffect } from "react";
import CryptoJS from "crypto-js";
import { Link2, ShieldAlert, Cpu } from "lucide-react";

interface BlockData {
    id: number;
    nonce: number;
    data: string;
    prevHash: string;
    hash: string;
    isValid: boolean;
}

export function SimuladorCadenaBloques() {
    const DIFICULTAD = "000"; // Los hashes válidos deben empezar con "000"

    const generarHash = (id: number, nonce: number, data: string, prevHash: string) => {
        return CryptoJS.SHA256(id + nonce + data + prevHash).toString(CryptoJS.enc.Hex);
    };

    const isHashValid = (hash: string) => hash.startsWith(DIFICULTAD);

    const bloqueGenesis = {
        id: 1,
        nonce: 1303,
        data: "Bloque Génesis - Inicio de Econosfera",
        prevHash: "0000000000000000000000000000000000000000000000000000000000000000",
        hash: "",
        isValid: true,
    };
    bloqueGenesis.hash = generarHash(bloqueGenesis.id, bloqueGenesis.nonce, bloqueGenesis.data, bloqueGenesis.prevHash);

    const [blocks, setBlocks] = useState<BlockData[]>([
        bloqueGenesis,
        { id: 2, nonce: 846, data: "Gerry envía 10 TKN a Satoshi", prevHash: bloqueGenesis.hash, hash: "", isValid: true },
        { id: 3, nonce: 4721, data: "Contrato Inteligente Desplegado", prevHash: "", hash: "", isValid: true },
    ]);

    // Update hashes based on content and previous hashes
    useEffect(() => {
        const newBlocks = [...blocks];
        let previousValid = true;

        for (let i = 0; i < newBlocks.length; i++) {
            const currentBlock = newBlocks[i];

            // The previous hash is whatever the previous block's CURRENT hash is
            if (i > 0) {
                currentBlock.prevHash = newBlocks[i - 1].hash;
            }

            // Calculate the current block's hash
            currentBlock.hash = generarHash(currentBlock.id, currentBlock.nonce, currentBlock.data, currentBlock.prevHash);

            // It's valid ONLY if its hash starts with the difficulty AND the previous block was valid
            const currentValid = isHashValid(currentBlock.hash);
            currentBlock.isValid = currentValid && previousValid;

            // If this block breaks, the chain breaks for the next ones
            previousValid = currentBlock.isValid;
        }

        // Only update if something changed to prevent infinite loops (deep comparison of hashes)
        const hashesChanged = blocks.some((b, idx) => b.hash !== newBlocks[idx].hash || b.isValid !== newBlocks[idx].isValid);
        if (hashesChanged) {
            setBlocks(newBlocks);
        }
    }, [blocks]);

    const handleChangeData = (idx: number, newData: string) => {
        const newBlocks = [...blocks];
        newBlocks[idx].data = newData;
        setBlocks(newBlocks);
    };

    const handleChangeNonce = (idx: number, newNonce: number) => {
        const newBlocks = [...blocks];
        newBlocks[idx].nonce = newNonce;
        setBlocks(newBlocks);
    };

    // Mining function: Finds the nonce that results in a valid hash
    const mineBlock = (idx: number) => {
        const newBlocks = [...blocks];
        const block = newBlocks[idx];

        let nonce = 0;
        let pHash = idx > 0 ? newBlocks[idx - 1].hash : block.prevHash;
        let newHash = generarHash(block.id, nonce, block.data, pHash);

        // Brute force until hash starts with DIFICULTAD
        while (!isHashValid(newHash)) {
            nonce++;
            newHash = generarHash(block.id, nonce, block.data, pHash);
        }

        block.nonce = nonce;
        setBlocks(newBlocks);
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="rounded-2xl border border-blue-200 dark:border-blue-900 bg-blue-50/50 dark:bg-blue-900/10 p-6 shadow-sm">
                <h3 className="text-xl font-bold flex items-center gap-2 mb-3 text-blue-800 dark:text-blue-300">
                    <Link2 className="w-5 h-5" />
                    Arquitectura: La Cadena de Bloques (Proof of Work)
                </h3>
                <div className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
                    <p>
                        Una Blockchain no es más que una base de datos donde cada entrada (Bloque) está sellada herméticamente y vinculada matemáticamente a la anterior.
                    </p>
                    <p>
                        <strong>Si intentas alterar los datos del Bloque 1 (aunque sea una letra)</strong>, su Hash cambiará. Como el Bloque 2 depende del Hash del Bloque 1, el Bloque 2 se romperá instantáneamente, y el Bloque 3 también. Esto es lo que la hace <i>Inmutable</i>.
                    </p>
                    <p className="bg-white dark:bg-slate-800 p-3 rounded-lg border border-slate-200 dark:border-slate-700 text-xs">
                        Intenta escribir algo en el campo "Datos" del Bloque 1 y observa cómo la cadena entera se pone en rojo. Luego, dale al botón <strong>Minar</strong> en los bloques rotos para que tu computadora busque un nuevo "Nonce" (número minero) y repare la cadena.
                    </p>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6 relative">
                {/* Background Line Connector */}
                <div className="hidden lg:block absolute top-[50%] left-0 right-0 h-1 bg-slate-200 dark:bg-slate-700 z-0"></div>

                {blocks.map((block, idx) => (
                    <div key={block.id} className="relative z-10 transition-all duration-300">
                        {/* Connecting Line Vertical (Mobile) */}
                        {idx > 0 && <div className="lg:hidden w-1 h-6 bg-slate-200 dark:bg-slate-700 mx-auto"></div>}

                        <div className={`rounded-xl border-2 p-5 shadow-lg bg-slate-50 dark:bg-slate-900 ${block.isValid ? "border-emerald-500 shadow-emerald-500/10" : "border-rose-500 shadow-rose-500/20"}`}>
                            <div className="flex justify-between items-center mb-4">
                                <h4 className="font-black text-lg text-slate-800 dark:text-slate-100 uppercase tracking-widest">
                                    Bloque #{block.id}
                                </h4>
                                {!block.isValid && <ShieldAlert className="text-rose-500 w-5 h-5 animate-pulse" />}
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase">Nonce (Minado)</label>
                                    <input
                                        type="number"
                                        value={block.nonce}
                                        onChange={(e) => handleChangeNonce(idx, Number(e.target.value))}
                                        className={`w-full mt-1 p-2 rounded-lg font-mono text-sm border focus:ring-2 focus:outline-none ${block.isValid ? "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:ring-emerald-500" : "bg-rose-50 dark:bg-rose-950 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 focus:ring-rose-500"}`}
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase">Datos (Transacciones)</label>
                                    <textarea
                                        rows={3}
                                        value={block.data}
                                        onChange={(e) => handleChangeData(idx, e.target.value)}
                                        className={`w-full mt-1 p-2 rounded-lg text-sm border resize-none focus:ring-2 focus:outline-none ${block.isValid ? "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:ring-emerald-500" : "bg-rose-50 dark:bg-rose-950 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 focus:ring-rose-500"}`}
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase">Hash Anterior</label>
                                    <div className="mt-1 p-2 bg-slate-200 dark:bg-slate-800 rounded-lg text-xs font-mono break-all text-slate-500 border border-slate-300 dark:border-slate-700 h-10 overflow-hidden flex items-center">
                                        {block.prevHash}
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase">Hash Actual</label>
                                    <div className={`mt-1 p-2 rounded-lg text-xs font-mono break-all font-bold border h-10 overflow-hidden flex items-center ${block.isValid ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700/50" : "bg-rose-100 dark:bg-rose-900/30 text-rose-800 dark:text-rose-300 border-rose-300 dark:border-rose-700/50"}`}>
                                        {block.hash}
                                    </div>
                                </div>

                                <button
                                    onClick={() => mineBlock(idx)}
                                    disabled={block.isValid}
                                    className={`w-full mt-2 py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${block.isValid ? "bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-500 text-white shadow-md active:scale-95"}`}
                                >
                                    <Cpu className="w-4 h-4" />
                                    {block.isValid ? "Bloque Minado" : "Minar Bloque (Reparar)"}
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
