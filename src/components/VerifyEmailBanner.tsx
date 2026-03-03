"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import { Mail, X } from "lucide-react";
import { resendVerification } from "@/lib/actions/authActions";

export default function VerifyEmailBanner() {
    const { data: session, update } = useSession();
    const [dismissed, setDismissed] = useState(false);
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState("");

    const show = session?.user && session.user.emailVerified === null && !dismissed;

    if (!show) return null;

    const handleResend = async () => {
        setSending(true);
        setError("");
        const res = await resendVerification();
        setSending(false);
        if (res?.success) {
            setSent(true);
            update();
        } else if (res?.error) {
            setError(res.error);
        }
    };

    return (
        <div className="bg-amber-500/90 dark:bg-amber-600/90 text-slate-900 px-4 py-2.5 flex flex-wrap items-center justify-center gap-2 text-sm font-medium">
            <Mail className="w-4 h-4 flex-shrink-0" />
            <span>
                Verifica tu correo para desbloquear tus créditos de IA y exportaciones.
            </span>
            <button
                type="button"
                onClick={handleResend}
                disabled={sending || sent}
                className="underline font-bold hover:no-underline disabled:opacity-70"
            >
                {sent ? "Correo reenviado" : sending ? "Enviando…" : "Reenviar correo"}
            </button>
            {error && <span className="text-red-900 font-semibold">— {error}</span>}
            <button
                type="button"
                onClick={() => setDismissed(true)}
                className="ml-2 p-1 rounded hover:bg-black/10"
                aria-label="Cerrar"
            >
                <X className="w-4 h-4" />
            </button>
        </div>
    );
}
