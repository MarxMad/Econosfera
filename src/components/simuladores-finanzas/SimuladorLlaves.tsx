"use client";

import { useState } from "react";
import CryptoJS from "crypto-js";
import { KeyRound, Lock, Unlock, FileSignature, CheckCircle2, XCircle } from "lucide-react";

export function SimuladorLlaves() {
    const [privateKey, setPrivateKey] = useState("");
    const [publicKey, setPublicKey] = useState("");
    const [message, setMessage] = useState("Transfiero 5 BTC a Alice");
    const [signature, setSignature] = useState("");

    const [verifyMessage, setVerifyMessage] = useState("Transfiero 5 BTC a Alice");
    const [verifySignature, setVerifySignature] = useState("");
    const [verifyPublicKey, setVerifyPublicKey] = useState("");

    const generateKeys = () => {
        // Simple simulation of Elliptic Curve generation
        // Private Key is random hex, Public Key is SHA256(PrivateKey)
        const priv = CryptoJS.lib.WordArray.random(32).toString(CryptoJS.enc.Hex);
        setPrivateKey(priv);
        // Simulator public key logic (in reality it's derived via secp256k1)
        const pub = "0x" + CryptoJS.SHA256(priv + "PUBLIC_DERIVATION").toString(CryptoJS.enc.Hex).slice(0, 40);
        setPublicKey(pub);
        setVerifyPublicKey(pub);
    };

    const signMessage = () => {
        if (!privateKey) return alert("Genera tus llaves primero");

        // Simulating digital signature: Hash(Message + PrivateKey)
        // A true signature uses ECDSA, producing r and s values
        const sig = CryptoJS.SHA256(message + privateKey).toString(CryptoJS.enc.Hex);
        setSignature(sig);

        // Auto-fill verification fields
        setVerifyMessage(message);
        setVerifySignature(sig);
    };

    const isSignatureValid = () => {
        if (!verifyPublicKey || !verifySignature || !verifyMessage) return null;

        // Simulating signature verification process
        // In this simulation, we check if SHA256(verifyMessage + PrivateKeyThatCreatedPubKey) matches verifySignature
        // Since we don't have the private key, we "cheat" the simulation by knowing the pair rules for demo purposes.
        // If we assumed the simplest conceptual verification:
        // We evaluate if the user changed the message, signature, or public key.
        return (
            verifySignature === signature &&
            verifyMessage === message &&
            verifyPublicKey === publicKey
        );
    };

    const validStatus = isSignatureValid();

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="rounded-2xl border border-blue-200 dark:border-blue-900 bg-blue-50/50 dark:bg-blue-900/10 p-6 shadow-sm">
                <h3 className="text-xl font-bold flex items-center gap-2 mb-3 text-blue-800 dark:text-blue-300">
                    <KeyRound className="w-5 h-5" />
                    Criptografía: Llaves y Firmas Digitales
                </h3>
                <div className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
                    <p>
                        "Not your keys, not your coins". Una <strong>Llave Privada</strong> es tu contraseña secreta absoluta. De ella se deriva matemáticamente tu <strong>Llave Pública</strong> (tu número de cuenta que sí compartes).
                    </p>
                    <p>
                        Para enviar dinero, usas tu Llave Privada para generar una <strong>Firma Digital</strong> sobre la transacción. La red puede usar tu Llave Pública y tu Firma para comprobar que TÚ autorizaste la transacción, ¡sin revelar jamás tu Llave Privada!
                    </p>
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                {/* 1. Generación y Firma */}
                <div className="space-y-4">
                    <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="font-bold flex items-center gap-2">
                                <Lock className="w-5 h-5 text-indigo-500" />
                                1. Tu Billetera (Wallet)
                            </h4>
                            <button onClick={generateKeys} className="px-3 py-1.5 bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300 text-xs font-bold rounded-lg hover:bg-indigo-200 dark:hover:bg-indigo-800 transition">
                                Generar Nuevas Llaves
                            </button>
                        </div>

                        <div className="space-y-3">
                            <div>
                                <label className="text-[10px] font-bold uppercase text-slate-500">Llave Privada (¡SECRETA!)</label>
                                <div className="p-2 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 rounded-lg text-rose-700 dark:text-rose-400 font-mono text-xs break-all min-h-[40px]">
                                    {privateKey || "Bóveda vacía. Da click en Generar."}
                                </div>
                            </div>
                            <div>
                                <label className="text-[10px] font-bold uppercase text-slate-500">Llave Pública (TU CUENTA)</label>
                                <div className="p-2 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 rounded-lg text-emerald-700 dark:text-emerald-400 font-mono text-xs break-all min-h-[40px]">
                                    {publicKey || "Bóveda vacía."}
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-700">
                            <h4 className="font-bold flex items-center gap-2 mb-4 text-sm">
                                <FileSignature className="w-4 h-4 text-blue-500" />
                                2. Firmar Transacción
                            </h4>
                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                className="w-full text-sm p-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 font-mono mb-3 focus:ring-2 focus:ring-indigo-500 outline-none"
                                rows={2}
                            />
                            <button
                                onClick={signMessage}
                                disabled={!privateKey}
                                className={`w-full py-2.5 rounded-lg text-sm font-bold transition ${!privateKey ? "bg-slate-200 text-slate-400 dark:bg-slate-800 cursor-not-allowed" : "bg-indigo-600 text-white hover:bg-indigo-500 shadow-md"}`}
                            >
                                Autorizar y Firmar con Llave Privada
                            </button>

                            {signature && (
                                <div className="mt-4 animate-in zoom-in-95">
                                    <label className="text-[10px] font-bold uppercase text-slate-500">Firma Digital Resultante</label>
                                    <div className="p-2 bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg font-mono text-[10px] text-slate-600 dark:text-slate-400 break-all">
                                        {signature}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* 2. Red / Verificación */}
                <div className="space-y-4">
                    <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 p-6 shadow-sm h-full flex flex-col">
                        <div className="flex items-center gap-2 mb-6">
                            <Unlock className="w-5 h-5 text-emerald-500" />
                            <h4 className="font-bold">3. La Red (Nodos Validadores)</h4>
                        </div>
                        <p className="text-xs text-slate-500 mb-6">
                            Cualquier computadora en el mundo recibe estos 3 datos (Públicos). Si intentas hackear el mensaje cambiando "Alice" por "Carlos", o intentas usar otra firma, la matemática fallará rotundamente y el bloque será rechazado.
                        </p>

                        <div className="space-y-4 flex-1">
                            <div>
                                <label className="text-[10px] font-bold uppercase text-slate-500">Mensaje a Validar</label>
                                <textarea
                                    value={verifyMessage}
                                    onChange={(e) => setVerifyMessage(e.target.value)}
                                    className="w-full mt-1 p-2 text-sm border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 font-mono focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
                                    rows={2}
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold uppercase text-slate-500">Llave Pública (Remitente)</label>
                                <input
                                    value={verifyPublicKey}
                                    onChange={(e) => setVerifyPublicKey(e.target.value)}
                                    className="w-full mt-1 p-2 text-xs border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 font-mono focus:ring-2 focus:ring-emerald-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold uppercase text-slate-500">Firma Digital Adjunta</label>
                                <textarea
                                    value={verifySignature}
                                    onChange={(e) => setVerifySignature(e.target.value)}
                                    className="w-full mt-1 p-2 text-[10px] border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 font-mono focus:ring-2 focus:ring-emerald-500 outline-none break-all resize-none"
                                    rows={3}
                                />
                            </div>
                        </div>

                        <div className="mt-8">
                            {validStatus === null ? (
                                <div className="p-4 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 text-center text-sm font-medium text-slate-400">
                                    Esperando transacción firmada...
                                </div>
                            ) : validStatus ? (
                                <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 flex items-center gap-3 animate-in pulse">
                                    <CheckCircle2 className="w-8 h-8 text-emerald-500 flex-shrink-0" />
                                    <div>
                                        <p className="font-bold text-emerald-800 dark:text-emerald-300 text-sm">Transacción Válida e Irrefutable</p>
                                        <p className="text-xs text-emerald-600 dark:text-emerald-400/80">La firma coincide matemáticamente con la llave pública y el mensaje. El usuario es dueño de la cuenta.</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-900/30 border border-rose-200 dark:border-rose-800 flex items-center gap-3 animate-in shake">
                                    <XCircle className="w-8 h-8 text-rose-500 flex-shrink-0" />
                                    <div>
                                        <p className="font-bold text-rose-800 dark:text-rose-300 text-sm">Transacción Hackeada / Falsa</p>
                                        <p className="text-xs text-rose-600 dark:text-rose-400/80">Alerta de Fraude: El mensaje fue alterado o la firma no corresponde a los fondos. Será rechazada de inmediato.</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
