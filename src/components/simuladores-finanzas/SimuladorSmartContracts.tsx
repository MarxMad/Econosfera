"use client";

import { useState } from "react";
import { Bug, Laptop, ShieldAlert, BadgeDollarSign, TerminalSquare, AlertTriangle } from "lucide-react";

export function SimuladorSmartContracts() {
    // Contract states
    const [contractBalance, setContractBalance] = useState(100);
    const [userBalance, setUserBalance] = useState(10); // User's map balance IN the contract

    // Hacker states
    const [hackerBalance, setHackerBalance] = useState(0); // Real funds outside contract
    const [hacking, setHacking] = useState(false);
    const [logs, setLogs] = useState<string[]>(["Contrato Banco.sol Desplegado. Balance Total: 100 ETH"]);

    const addLog = (msg: string) => setLogs(prev => [msg, ...prev].slice(0, 10));

    const withdrawNormal = () => {
        if (userBalance <= 0) return addLog("❌ Error: Balance Insuficiente");

        // 1. Check Balance
        if (userBalance >= 10) {
            // 2. Transfiere ETH real (vulnerable order in reentrancy)
            // But doing it normally works fine
            setUserBalance(userBalance - 10);
            setContractBalance(contractBalance - 10);
            addLog("✅ Usuario retira 10 ETH legítimamente");
        }
    };

    const executeReentrancyAttack = () => {
        if (hacking) return;
        setHacking(true);
        addLog("🚨 Hacker inicializa Contrato Malicioso!");
        addLog("👿 Hacker deposita 10 ETH");

        let cBal = contractBalance;
        let pBal = 10; // Hacker deposits 10 to hack
        let totalStolen = 0;

        const attackLoop = setInterval(() => {
            if (cBal > 0 && pBal > 0) {
                // Hacker calls withdraw(10)
                addLog(`⚙️ Hacker.sol llama withdraw(). Contrato Banco tiene ${cBal} ETH...`);

                // Bank sends 10 ETH BEFORE subtracting balance
                cBal -= 10;
                totalStolen += 10;
                addLog(`💸 Banco envía 10 ETH. El Banco aún NO resta el balance del Hacker!`);

                // Fallback loops back immediately
                addLog(`🔁 Fallback de Hacker.sol intercepta pago y VUELVE A LLAMAR withdraw()!`);

                setContractBalance(cBal);
                setHackerBalance(totalStolen);
            } else {
                clearInterval(attackLoop);
                if (cBal <= 0) {
                    addLog("💀 Contrato vaciado por completo. Ataque Terminado.");
                    setUserBalance(0);
                }
                setHacking(false);
            }
        }, 1500);
    };

    const restartSimulator = () => {
        setContractBalance(100);
        setUserBalance(10);
        setHackerBalance(0);
        setLogs(["🔄 Simulador Reiniciado. Contrato Banco.sol Desplegado con 100 ETH."]);
        setHacking(false);
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="rounded-2xl border border-rose-200 dark:border-rose-900 bg-rose-50/50 dark:bg-rose-900/10 p-6 shadow-sm">
                <h3 className="text-xl font-bold flex items-center gap-2 mb-3 text-rose-800 dark:text-rose-300">
                    <Bug className="w-5 h-5" />
                    Vulnerabilidades en Smart Contracts (Reentrancy)
                </h3>
                <div className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
                    <p>
                        Un <strong>Smart Contract</strong> es simplemente código (IF - THEN) que se ejecuta idéntico en todas las computadoras del mundo. Es imparable. Pero, ¿qué pasa si el código original tiene un bug matemático que se quedó escrito para siempre en la Blockchain?
                    </p>
                    <p>
                        La vulnerabilidad más cara y famosa se llama <strong>Ataque de Reentrada (Reentrancy)</strong>. Ocurre cuando un Contrato Bancario le envía los fondos de retiro a un Hacker, y el Hacker tiene un código malicioso que grita ¡Oye Banco, vuelve a retirarme fondos! ANTES de que el Banco alcance a restarle su saldo en su cuadernillo interno.
                    </p>
                    <p className="p-3 bg-white dark:bg-slate-800 rounded-lg text-xs font-mono border border-slate-200 dark:border-slate-700 shadow-sm">
                        {"function withdraw(uint amount) public {"} <br />
                        &nbsp;&nbsp;require(balances[msg.sender] {">"} 0); <br />
                        &nbsp;&nbsp;<span className="text-rose-500 font-bold">// 1. GRAVE ERROR: Enviar dinero ANTES de actualizar el saldo</span><br />
                        &nbsp;&nbsp;msg.sender.transfer(amount); <br />
                        &nbsp;&nbsp;<span className="text-emerald-500 font-bold">// 2. Hacker interrumpe el flujo y exige retirar más. Esta línea jamás se ejecuta.</span><br />
                        &nbsp;&nbsp;balances[msg.sender] -= amount; <br />
                        {"}"}
                    </p>
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">

                {/* Visualizador del Banco y Hacker */}
                <div className="space-y-6">
                    <div className="rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-xl overflow-hidden p-6 relative">
                        <BadgeDollarSign className="absolute -right-4 -top-4 w-24 h-24 text-slate-100 dark:text-slate-800" />

                        <h4 className="font-extrabold text-slate-800 dark:text-slate-100 uppercase tracking-widest flex items-center gap-2 relative z-10 mb-6">
                            Contrato "Banco.sol"
                        </h4>

                        <div className="grid grid-cols-2 gap-4 relative z-10">
                            <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-xl p-4 text-center">
                                <p className="text-[10px] font-bold text-slate-500 uppercase">Liquidez Total (Víctimas)</p>
                                <p className="text-3xl font-mono font-black text-blue-600">{contractBalance} ETH</p>
                            </div>
                            <div className="bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 rounded-xl p-4 text-center">
                                <p className="text-[10px] font-bold text-slate-500 uppercase">Mi Saldo Interno</p>
                                <p className="text-xl font-mono font-black text-emerald-600 mt-2">{userBalance} ETH</p>
                                <button
                                    onClick={withdrawNormal}
                                    disabled={hacking || contractBalance <= 0 || userBalance <= 0}
                                    className="w-full mt-2 bg-emerald-600 text-white text-[10px] font-bold uppercase py-1.5 rounded-md hover:bg-emerald-500 disabled:bg-slate-300 disabled:text-slate-500 dark:disabled:bg-slate-800"
                                >
                                    Retiro Normal
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border-2 border-rose-200 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/20 shadow-xl p-6 relative">

                        <h4 className="font-extrabold text-rose-800 dark:text-rose-300 uppercase tracking-widest flex items-center gap-2 mb-6">
                            <Laptop className="w-5 h-5" /> Contrato "Hacker.sol"
                        </h4>

                        <div className="bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-800 rounded-xl p-4 flex justify-between items-center mb-6 shadow-sm">
                            <p className="text-xs font-bold text-slate-500 uppercase">Botín Robado (Real)</p>
                            <p className={`text-3xl font-mono font-black ${hackerBalance > 0 ? 'text-rose-600' : 'text-slate-400'}`}>
                                +{hackerBalance} ETH
                            </p>
                        </div>

                        <button
                            onClick={executeReentrancyAttack}
                            disabled={hacking || contractBalance <= 0}
                            className={`w-full py-4 text-lg rounded-xl font-bold text-white shadow-xl transition-all uppercase tracking-wider flex items-center justify-center gap-3 ${hacking || contractBalance <= 0 ? "bg-slate-400 dark:bg-slate-800 cursor-not-allowed" : "bg-rose-600 hover:bg-rose-500 animate-pulse"}`}
                        >
                            {hacking ? "Hackeando Drenaje..." : contractBalance <= 0 ? "Banco Destruido" : "Activar Reentrancy Hack"}
                            {!hacking && contractBalance > 0 && <ShieldAlert className="w-5 h-5" />}
                        </button>

                        <button onClick={restartSimulator} className="w-full mt-4 text-xs font-bold text-slate-500 uppercase hover:text-slate-800 dark:hover:text-slate-200">
                            Reiniciar Escenario
                        </button>
                    </div>
                </div>

                {/* Log de Ejecucion (Terminal) */}
                <div className="rounded-2xl bg-slate-900 p-6 shadow-xl border border-slate-800 flex flex-col h-full font-mono text-xs">
                    <div className="flex items-center gap-2 text-slate-400 border-b border-slate-800 pb-4 mb-4">
                        <TerminalSquare className="w-4 h-4" />
                        <span className="uppercase tracking-widest font-bold">Terminal EVM (Logs)</span>
                    </div>

                    <div className="flex-1 space-y-2 overflow-y-auto pr-2" style={{ maxHeight: "400px" }}>
                        {logs.map((log, i) => (
                            <div key={i} className={`p-2 rounded border ${log.includes("Error") || log.includes("GRAVE") ? "bg-red-950/50 border-red-900 text-red-400" :
                                    log.includes("Hacker") || log.includes("Robb") || log.includes("🚨") || log.includes("💸") || log.includes("🔁") ? "bg-rose-950/30 border-rose-900/50 text-rose-300" :
                                        log.includes("Normal") || log.includes("legítima") ? "text-emerald-400 bg-emerald-950/30 border-emerald-900/50" :
                                            "text-slate-300 border-transparent bg-slate-800/30"
                                }`}>
                                <span className="text-slate-500 mr-2">[{logs.length - i}]</span>
                                {log}
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}
