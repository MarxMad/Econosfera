"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { User, LogIn, LogOut, Menu, X, Home, ChevronDown, Coins, Cpu } from "lucide-react";
import { useState, useRef, useEffect } from "react";

function SignOutButton({ variant = "icon", onClose }: { variant?: "icon" | "full"; onClose?: () => void }) {
  const className =
    variant === "full"
      ? "w-full text-left flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium text-red-400 hover:bg-red-900/10"
      : "w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white";
  const handleSignOut = () => {
    onClose?.();
    signOut({ callbackUrl: "/" });
  };
  return (
    <button type="button" onClick={handleSignOut} className={className} title="Cerrar Sesión">
      <LogOut className="w-4 h-4 shrink-0" />
      {variant === "full" && "Cerrar Sesión"}
    </button>
  );
}

const NAV_LINKS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/simulador", label: "Simuladores", icon: Cpu },
  { href: "/glosario", label: "Glosario", icon: null },
  { href: "/pricing", label: "Precios", icon: null },
  { href: "/blog", label: "Blog", icon: null },
] as const;

function ProfileDropdown({
  session,
  onClose,
  onLinkClick,
}: {
  session: { user: { name?: string | null; email?: string | null; credits?: number } };
  onClose?: () => void;
  onLinkClick?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const closeAll = () => {
    setOpen(false);
    onClose?.();
    onLinkClick?.();
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
        title="Mi cuenta"
        aria-expanded={open}
      >
        <div className="w-8 h-8 rounded-full bg-blue-600/80 flex items-center justify-center">
          <User className="w-4 h-4 text-white" />
        </div>
        <ChevronDown className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-slate-700 bg-slate-900 shadow-xl py-2 z-50">
          <div className="px-4 py-2 border-b border-slate-700">
            <p className="text-sm font-bold text-white truncate">{session.user.name || session.user.email}</p>
            <p className="text-xs text-blue-400 font-mono">{session.user.credits ?? 0} créditos AI</p>
          </div>
          <Link
            href="/dashboard"
            onClick={closeAll}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white"
          >
            <User className="w-4 h-4" />
            Mi Perfil
          </Link>
          <Link
            href="/dashboard"
            onClick={closeAll}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white"
          >
            <Coins className="w-4 h-4" />
            Créditos
          </Link>
          <div className="border-t border-slate-700 mt-2 pt-2">
            <SignOutButton variant="full" onClose={closeAll} />
          </div>
        </div>
      )}
    </div>
  );
}

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
              {NAV_LINKS.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className="text-sm font-medium text-slate-300 hover:text-white transition-colors flex items-center gap-1.5"
                >
                  {Icon && <Icon className="w-4 h-4" />}
                  {label}
                </Link>
              ))}
            </div>
          </div>

          <div className="hidden md:flex items-center gap-4">
            {session ? (
              <ProfileDropdown session={session} />
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

          <div className="md:hidden flex items-center gap-4">
            {session && (
              <ProfileDropdown session={session} onLinkClick={() => setMenuOpen(false)} />
            )}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label={menuOpen ? "Cerrar menú de páginas" : "Abrir menú de páginas"}
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu - solo páginas (perfil en icono separado) */}
      {menuOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800 px-4 pt-2 pb-6">
          <div className="space-y-1">
            {NAV_LINKS.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-base font-medium text-slate-300 hover:bg-slate-800 hover:text-white"
              >
                {Icon && <Icon className="w-5 h-5 shrink-0" />}
                {label}
              </Link>
            ))}
          </div>

          {/* Entrar / Registrarse (solo si no hay sesión) */}
          {!session && (
            <div className="mt-4 pt-4 border-t border-slate-800 flex gap-3">
              <Link
                href="/auth/signin"
                onClick={() => setMenuOpen(false)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-300 bg-slate-800 hover:bg-slate-700"
              >
                <LogIn className="w-4 h-4" />
                Entrar
              </Link>
              <Link
                href="/auth/register"
                onClick={() => setMenuOpen(false)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-500"
              >
                Registrarse
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
