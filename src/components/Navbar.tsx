"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { User, LogIn, LogOut, LayoutDashboard, Menu, X } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
    const { data: session } = useSession();
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <nav className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center gap-8">
                        <Link href="/" className="flex items-center gap-3 group">
                            <img
                                src="/logos.svg"
                                alt="Econosfera Logo"
                                className="w-8 h-8 group-hover:scale-110 transition-transform drop-shadow-md"
                            />
                            <span className="font-bold text-xl tracking-tight hidden sm:block">ECONOSFERA</span>
                        </Link>

                        <div className="hidden md:flex items-center gap-6">
                            {session && (
                                <Link href="/simulador" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Simuladores</Link>
                            )}
                            <Link href="/manual" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Manual</Link>
                        </div>
                    </div>

                    <div className="hidden md:flex items-center gap-4">
                        {session ? (
                            <div className="flex items-center gap-4">
                                <Link
                                    href="/dashboard"
                                    className="flex items-center gap-2 text-sm font-medium px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
                                >
                                    <LayoutDashboard className="w-4 h-4" />
                                    Mis Cálculos
                                </Link>
                                <div className="flex items-center gap-3 pl-4 border-l border-slate-700">
                                    <div className="text-right hidden lg:block">
                                        <p className="text-xs font-bold">{session.user.name || session.user.email}</p>
                                        <p className="text-[10px] text-blue-400 font-mono">{session.user.credits} créditos AI</p>
                                    </div>
                                    <button
                                        onClick={() => signOut()}
                                        className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-red-400 transition-colors"
                                        title="Cerrar Sesión"
                                    >
                                        <LogOut className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link
                                    href="/auth/signin"
                                    className="text-sm font-medium px-4 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-all"
                                >
                                    Entrar
                                </Link>
                                <Link
                                    href="/auth/register"
                                    className="text-sm font-bold px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20 transition-all active:scale-95"
                                >
                                    Registrarse
                                </Link>
                            </div>
                        )}
                    </div>

                    <div className="md:hidden">
                        <button onClick={() => setMenuOpen(!menuOpen)} className="p-2 text-slate-400">
                            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {menuOpen && (
                <div className="md:hidden bg-slate-900 border-b border-slate-800 px-4 pt-2 pb-6 space-y-3">
                    {session && (
                        <Link href="/simulador" className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:bg-slate-800">Simuladores</Link>
                    )}
                    <Link href="/manual" className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:bg-slate-800">Manual</Link>
                    <hr className="border-slate-800" />
                    {session ? (
                        <>
                            <Link href="/dashboard" className="block px-3 py-2 rounded-md text-base font-medium text-blue-400">Dashboard ({session.user.credits} créditos)</Link>
                            <button onClick={() => signOut()} className="w-full text-left flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium text-red-400 hover:bg-red-900/10">
                                <LogOut className="w-5 h-5" /> Cerrar Sesión
                            </button>
                        </>
                    ) : (
                        <>
                            <Link href="/auth/signin" className="block px-3 py-2 rounded-md text-base font-medium text-slate-300">Entrar</Link>
                            <Link href="/auth/register" className="block px-3 py-2 rounded-md text-base font-bold text-blue-400">Registrarse</Link>
                        </>
                    )}
                </div>
            )}
        </nav>
    );
}
