"use client";

import { useState, useEffect } from "react";
import { Network, Globe, RadioReceiver, ShieldCheck, Skull } from "lucide-react";

export function SimuladorRedP2P() {
    type NodeState = "idle" | "verifying" | "accepted" | "rejected" | "malicious";
    type NodeData = { id: number; location: string; state: NodeState; x: number; y: number };

    // Grilla 3x3 de nodos
    const initNodes: NodeData[] = [
        { id: 1, location: "New York", state: "idle", x: 10, y: 10 },
        { id: 2, location: "London", state: "idle", x: 45, y: 10 },
        { id: 3, location: "Tokyo", state: "idle", x: 80, y: 10 },

        { id: 4, location: "CDMX", state: "idle", x: 10, y: 50 },
        { id: 5, location: "Paris", state: "idle", x: 45, y: 50 },
        { id: 6, location: "Sydney", state: "idle", x: 80, y: 50 },

        { id: 7, location: "Bogota", state: "idle", x: 10, y: 90 },
        { id: 8, location: "Nairobi", state: "idle", x: 45, y: 90 },
        { id: 9, location: "Mumbai", state: "idle", x: 80, y: 90 },
    ];

    const [nodes, setNodes] = useState<NodeData[]>(initNodes);
    const [networkTx, setNetworkTx] = useState<string>("Ninguna Tx actual");
    const [maliciousEnabled, setMaliciousEnabled] = useState(false);
    const [isPropagating, setIsPropagating] = useState(false);

    // Conexiones visuales
    const connections = [
        [0, 1], [1, 2], [0, 3], [1, 4], [2, 5], [3, 4],
        [4, 5], [3, 6], [4, 7], [5, 8], [6, 7], [7, 8],
        [1, 5], [3, 7], [4, 8], [0, 4]
    ];

    const toggleMalicious = (nodeIndex: number) => {
        if (isPropagating) return;
        const newNodes = [...nodes];
        newNodes[nodeIndex].state = newNodes[nodeIndex].state === "malicious" ? "idle" : "malicious";
        setNodes(newNodes);

        // Revisar si habilitamos el modo malicioso general para ui
        setMaliciousEnabled(newNodes.some(n => n.state === "malicious"));
    };

    const broadcastTx = async (isValidData: boolean) => {
        if (isPropagating) return;
        setIsPropagating(true);
        setNetworkTx(isValidData ? "Enviando 50 ETH válidos..." : "Doble Gasto: Gastando 50 ETH falsos...");

        // Reseteamos estados (excepto los maliciosos)
        let nNodes = nodes.map(n => n.state === "malicious" ? n : { ...n, state: "idle" as NodeState });
        setNodes([...nNodes]);

        // Simula la propagación por la red, nodo por nodo (Gossip Protocol)
        // Tomamos el nodo 0 (New York) como el origen
        const propagateNode = async (idx: number, delayMs: number) => {
            return new Promise<void>(resolve => {
                setTimeout(() => {
                    setNodes(prev => {
                        const next = [...prev];
                        // Un nodo malicioso puede aceptar cosas falsas, o intentar mentir. 
                        // Para este simulador simple, el malicioso dirá 'accepted' a fraude, o 'rejected' a verdad.
                        if (next[idx].state === "malicious") {
                            next[idx].state = "malicious"; // Se mantiene fijo visualmente o podriamos darle otro color.
                        } else {
                            next[idx].state = "verifying";
                            // A los 500ms decide si acepta
                            setTimeout(() => {
                                setNodes(p2 => {
                                    const next2 = [...p2];
                                    if (next2[idx].state === "verifying") {
                                        next2[idx].state = isValidData ? "accepted" : "rejected";
                                    }
                                    return next2;
                                });
                            }, 400);
                        }
                        return next;
                    });
                    resolve();
                }, delayMs);
            });
        };

        // Propagación en oleadas
        await propagateNode(0, 200);
        await Promise.all([propagateNode(1, 400), propagateNode(3, 300), propagateNode(4, 500)]);
        await Promise.all([propagateNode(2, 600), propagateNode(5, 700), propagateNode(6, 400), propagateNode(7, 500)]);
        await propagateNode(8, 800);

        setTimeout(() => {
            setIsPropagating(false);
        }, 1200);
    };

    const resetNetwork = () => {
        setNodes(initNodes);
        setNetworkTx("Ninguna Tx actual");
        setMaliciousEnabled(false);
        setIsPropagating(false);
    };

    // Calcular estatus del consenso
    const acceptedCount = nodes.filter(n => n.state === "accepted").length;
    const maliciousCount = nodes.filter(n => n.state === "malicious").length;
    const isConsensusReached = !isPropagating && acceptedCount > 4;
    const isConsensusFailed = !isPropagating && acceptedCount <= 4 && acceptedCount > 0;

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="rounded-2xl border border-indigo-200 dark:border-indigo-900 bg-indigo-50/50 dark:bg-indigo-900/10 p-6 shadow-sm">
                <h3 className="text-xl font-bold flex items-center gap-2 mb-3 text-indigo-800 dark:text-indigo-300">
                    <Globe className="w-5 h-5" />
                    Protocolo Gossip: Nodos P2P y Tolerancia a Fallos
                </h3>
                <div className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
                    <p>
                        Bitcoin no existe en los cielos. Es una red de miles de computadoras ("Nodos") hablando entre sí usando el <strong>Protocolo Gossip</strong> (chisme). Cuando tú mandas dinero, le avisas a un Nodo amigo, éste le avisa a 5, esos 5 le avisan a 25. En segundos, todo el planeta lo sabe.
                    </p>
                    <p>
                        <strong>El Problema de los Generales Bizantinos</strong>: ¿Qué pasa si algunos Nodos son hackeados (maliciosos) e intentan propagar una transacción falsa? La magia de redes P2P es que <strong>la mayoría matemática gana</strong> y aísla la mentira (Tolerancia Bizantina a Fallos - BFT).
                    </p>
                </div>
            </div>

            <div className="grid lg:grid-cols-12 gap-6">

                {/* Visualizador de Red */}
                <div className="lg:col-span-8 rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-slate-900 shadow-xl overflow-hidden p-6 relative min-h-[400px]">
                    <h4 className="absolute top-4 left-4 font-black uppercase text-slate-500 tracking-widest text-xs z-20 flex gap-2">
                        <Network className="w-4 h-4" /> Mapa de Nodos Planetario
                    </h4>

                    {/* Líneas de conexión */}
                    <svg className="absolute inset-0 w-full h-full z-0 opacity-20 pointer-events-none">
                        {connections.map((conn, idx) => {
                            const n1 = nodes[conn[0]];
                            const n2 = nodes[conn[1]];
                            return (
                                <line
                                    key={idx}
                                    x1={`${n1.x}%`} y1={`${n1.y}%`}
                                    x2={`${n2.x}%`} y2={`${n2.y}%`}
                                    stroke="currentColor"
                                    className="text-indigo-500"
                                    strokeWidth="2"
                                />
                            );
                        })}
                    </svg>

                    {/* Nodos interactivos */}
                    {nodes.map((node, i) => (
                        <div
                            key={node.id}
                            className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10 cursor-pointer group"
                            style={{ left: `${node.x}%`, top: `${node.y}%` }}
                            onClick={() => toggleMalicious(i)}
                        >
                            <div className={`w-8 h-8 rounded-full border-2 shadow-lg flex items-center justify-center transition-all duration-300
                                ${node.state === "idle" ? "bg-slate-700 border-slate-500 text-slate-300 group-hover:bg-slate-600" :
                                    node.state === "verifying" ? "bg-amber-400 border-amber-200 text-amber-900 animate-pulse scale-125" :
                                        node.state === "accepted" ? "bg-emerald-500 border-emerald-300 text-emerald-950 scale-110 shadow-emerald-500/50" :
                                            node.state === "rejected" ? "bg-rose-500 border-rose-300 text-rose-950 scale-90" :
                                                "bg-purple-600 border-purple-400 text-purple-950 shadow-[0_0_15px_rgba(168,85,247,0.8)] rotate-45"}
                            `}>
                                {node.state === "malicious" ? <Skull className="w-4 h-4" /> : <RadioReceiver className="w-3 h-3" />}
                            </div>
                            <span className={`text-[10px] font-bold mt-2 uppercase px-2 py-0.5 rounded shadow-sm opacity-80 backdrop-blur-sm
                                ${node.state === "malicious" ? "bg-purple-900 text-purple-300" : "bg-black/50 text-slate-300"}`}>
                                {node.location}
                            </span>
                        </div>
                    ))}

                    <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md rounded-lg border border-slate-700 p-3 text-[10px] font-mono text-slate-400">
                        <p className="mb-1 text-slate-200">Leyenda interactiva:</p>
                        <ul className="space-y-1">
                            <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-slate-700"></span> Inactivo (Click p/ HACKEAR)</li>
                            <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Validó (Reglas sanas)</li>
                            <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-rose-500"></span> Rechazó Transacción</li>
                            <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-sm bg-purple-600 rotate-45"></span> Nodo Secuestrado / Mintiendo</li>
                        </ul>
                    </div>

                </div>

                {/* Controles de Red */}
                <div className="lg:col-span-4 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 shadow-xl overflow-hidden p-6 flex flex-col justify-between">
                    <div>
                        <h4 className="font-extrabold text-slate-800 dark:text-slate-100 uppercase tracking-widest mb-4">
                            Consola de Tráfico
                        </h4>

                        <div className="bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 p-4 rounded-xl font-mono text-sm mb-6 flex flex-col h-24 justify-center">
                            <span className="text-[10px] uppercase font-bold text-slate-500 mb-1">Último Ping:</span>
                            <span className={`font-bold ${networkTx.includes("Doble Gasto") ? "text-rose-500 animate-pulse" :
                                    networkTx.includes("Ninguna") ? "text-slate-500" :
                                        "text-emerald-500"
                                }`}>{networkTx}</span>
                        </div>

                        {/* State indicator */}
                        {isConsensusReached && (
                            <div className="mb-6 p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 rounded-xl flex items-center gap-3 animate-in zoom-in">
                                <ShieldCheck className="w-6 h-6 text-emerald-500" />
                                <div>
                                    <p className="font-bold text-[10px] uppercase text-emerald-700 dark:text-emerald-400">Consenso Global Alcanzado</p>
                                    <p className="font-mono text-emerald-600 dark:text-emerald-500 text-xs">A pesar de nodos caídos, la red aceptó la Tx legítima.</p>
                                </div>
                            </div>
                        )}
                        {isConsensusFailed && (
                            <div className="mb-6 p-3 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 rounded-xl flex items-center gap-3 animate-in zoom-in">
                                <ShieldCheck className="w-6 h-6 text-rose-500" />
                                <div>
                                    <p className="font-bold text-[10px] uppercase text-rose-700 dark:text-rose-400">Transacción Aislada</p>
                                    <p className="font-mono text-rose-600 dark:text-rose-500 text-xs">Intento de Doble Gasto bloqueado. Los nodos honestos rechazaron la mentira.</p>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="space-y-3">
                        <button
                            disabled={isPropagating}
                            onClick={() => broadcastTx(true)}
                            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl shadow-md transition-all active:scale-95 text-sm uppercase tracking-wider disabled:bg-slate-400 disabled:cursor-wait"
                        >
                            Propagar Tx Válida
                        </button>

                        <button
                            disabled={isPropagating}
                            onClick={() => broadcastTx(false)}
                            className="w-full bg-rose-600 hover:bg-rose-500 text-white font-bold py-3 rounded-xl shadow-md transition-all active:scale-95 text-sm uppercase tracking-wider disabled:bg-slate-400 disabled:cursor-wait"
                        >
                            Intentar Tx Falsa
                        </button>

                        {(acceptedCount > 0 || maliciousEnabled) && (
                            <button onClick={resetNetwork} className="w-full text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 pt-3 border-t border-slate-200 dark:border-slate-700 mt-2">
                                Reiniciar Red & Curar Nodos
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
