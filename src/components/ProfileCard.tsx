"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
    CheckCircle2,
    AlertCircle,
    Loader2,
    User,
    Mail,
    Building2,
    Phone,
    Briefcase,
    GraduationCap,
    Save,
    ChevronUp,
    Pencil,
    MailCheck,
    Gift,
} from "lucide-react";
import { getProfile, updateProfile, resendVerification } from "@/lib/actions/authActions";

const NIVELES_ESTUDIOS = [
    { value: "", label: "Seleccionar" },
    { value: "preparatoria", label: "Preparatoria / Bachillerato" },
    { value: "licenciatura", label: "Licenciatura" },
    { value: "maestria", label: "Maestría" },
    { value: "doctorado", label: "Doctorado" },
    { value: "otro", label: "Otro" },
];

type ProfileData = {
    name: string | null;
    lastName: string | null;
    email: string | null;
    image: string | null;
    institution: string | null;
    phone: string | null;
    occupation: string | null;
    educationLevel: string | null;
    emailVerified: Date | null;
    emailMarketingOptIn: boolean;
    unamCreditsClaimedAt: Date | null;
} | null;

type ProfileCardProps = {
    onCreditsClaimed?: () => void;
};

export default function ProfileCard({ onCreditsClaimed }: ProfileCardProps) {
    const { data: session, status, update } = useSession();
    const [profile, setProfile] = useState<ProfileData>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [emailSent, setEmailSent] = useState(false);
    const [emailLoading, setEmailLoading] = useState(false);
    const [editingProfile, setEditingProfile] = useState(false);
    const [claimingUnam, setClaimingUnam] = useState(false);
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    const [form, setForm] = useState({
        name: "",
        lastName: "",
        institution: "",
        phone: "",
        occupation: "",
        educationLevel: "",
    });

    useEffect(() => {
        if (session?.user?.id) {
            getProfile(session.user.id).then((p) => {
                setProfile(p);
                if (p) {
                    setForm({
                        name: p.name || (session?.user?.name as string) || "",
                        lastName: p.lastName || "",
                        institution: p.institution || "",
                        phone: p.phone || "",
                        occupation: p.occupation || "",
                        educationLevel: p.educationLevel || "",
                    });
                }
                setLoading(false);
            });
        } else {
            setLoading(false);
        }
    }, [session?.user?.id]);

    const handleSaveProfile = async () => {
        if (!session?.user?.id) return;
        setSaving(true);
        const res = await updateProfile(session.user.id, {
            name: form.name || undefined,
            lastName: form.lastName || undefined,
            institution: form.institution || undefined,
            phone: form.phone || undefined,
            occupation: form.occupation || undefined,
            educationLevel: form.educationLevel || undefined,
        });
        setSaving(false);
        if (res.success) {
            setProfile((prev) => (prev ? { ...prev, ...form } : null));
            await update();
        } else {
            alert(res.error);
        }
    };

    const handleResendEmail = async () => {
        setEmailLoading(true);
        const res = await resendVerification();
        if (res.success) {
            setEmailSent(true);
            alert("Correo enviado con éxito. Revisa tu bandeja de entrada.");
        } else {
            alert(res.error);
        }
        setEmailLoading(false);
    };

    if (status === "loading" || loading) {
        return (
            <div className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-lg animate-pulse">
                <div className="h-20 bg-slate-200 dark:bg-slate-700 rounded-2xl mb-4" />
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-2" />
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
            </div>
        );
    }

    const isVerified = !!profile?.emailVerified;
    const displayName = [form.name, form.lastName].filter(Boolean).join(" ") || session?.user?.name || "Usuario";
    const avatarUrl = profile?.image || session?.user?.image;

    return (
        <div className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-lg relative overflow-hidden">
            {/* Toast coqueto: recompensa reclamada */}
            {toastMessage && (
                <div
                    className="fixed bottom-4 left-4 right-4 sm:left-1/2 sm:right-auto sm:-translate-x-1/2 sm:max-w-md z-50 px-4 py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-400 text-white text-sm font-bold shadow-lg shadow-amber-500/30 ring-2 ring-amber-300/50 text-center"
                    role="status"
                >
                    {toastMessage}
                </div>
            )}
            <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
                {isVerified ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-500 border border-emerald-200 dark:border-emerald-800">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Verificado
                    </span>
                ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-500 border border-amber-200 dark:border-amber-800">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                        Pendiente
                    </span>
                )}
            </div>

            {/* Vista compacta: avatar + nombre + correo + botón editar */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4 pt-10 sm:pt-0">
                <div className="shrink-0 flex justify-center sm:justify-start">
                    <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-xl sm:rounded-2xl bg-gradient-to-br from-blue-500 to-emerald-500 p-0.5 shadow-md overflow-hidden">
                        <div className="w-full h-full rounded-[10px] sm:rounded-2xl bg-slate-900 flex items-center justify-center text-lg sm:text-2xl font-black text-white overflow-hidden">
                            {avatarUrl ? (
                                <img src={avatarUrl} alt="" className="w-full h-full object-cover" />
                            ) : (
                                displayName.charAt(0).toUpperCase()
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex-1 min-w-0 flex flex-col justify-center text-center sm:text-left">
                    <p className="font-bold text-slate-900 dark:text-white text-base sm:text-lg truncate">{displayName}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400 truncate">{profile?.email ?? session?.user?.email ?? ""}</p>
                    <button
                        type="button"
                        onClick={() => setEditingProfile((v) => !v)}
                        className="mt-2 inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors w-fit mx-auto sm:mx-0"
                    >
                        {editingProfile ? <ChevronUp className="w-3.5 h-3.5" /> : <Pencil className="w-3.5 h-3.5" />}
                        {editingProfile ? "Ocultar datos" : "Editar perfil"}
                    </button>
                </div>
            </div>

            {/* Sección colapsable: formulario de datos */}
            {editingProfile && (
                <div className="pt-4 border-t border-slate-200 dark:border-slate-700 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mb-1">
                                <User className="w-3.5 h-3.5" /> Nombre
                            </label>
                            <input
                                type="text"
                                value={form.name}
                                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="Tu nombre"
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mb-1">
                                <User className="w-3.5 h-3.5" /> Apellidos
                            </label>
                            <input
                                type="text"
                                value={form.lastName}
                                onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
                                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="Apellidos"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mb-1">
                            <Mail className="w-3.5 h-3.5" /> Correo
                        </label>
                        <input
                            type="email"
                            value={profile?.email ?? ""}
                            readOnly
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 text-sm cursor-not-allowed"
                        />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mb-1">
                                <Building2 className="w-3.5 h-3.5" /> Universidad / Institución
                            </label>
                            <input
                                type="text"
                                value={form.institution}
                                onChange={(e) => setForm((f) => ({ ...f, institution: e.target.value }))}
                                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="Ej. UNAM, ITAM"
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mb-1">
                                <Phone className="w-3.5 h-3.5" /> Teléfono
                            </label>
                            <input
                                type="tel"
                                value={form.phone}
                                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="Ej. +52 55 1234 5678"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mb-1">
                                <Briefcase className="w-3.5 h-3.5" /> Ocupación
                            </label>
                            <input
                                type="text"
                                value={form.occupation}
                                onChange={(e) => setForm((f) => ({ ...f, occupation: e.target.value }))}
                                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="Ej. Estudiante, Economista"
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mb-1">
                                <GraduationCap className="w-3.5 h-3.5" /> Nivel de estudios
                            </label>
                            <select
                                value={form.educationLevel}
                                onChange={(e) => setForm((f) => ({ ...f, educationLevel: e.target.value }))}
                                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            >
                                {NIVELES_ESTUDIOS.map((opt) => (
                                    <option key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={handleSaveProfile}
                        disabled={saving}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-50 transition-colors"
                    >
                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        {saving ? "Guardando..." : "Guardar perfil"}
                    </button>
                </div>
            )}

            {/* Banner UNAM: reclamar 10 créditos extra (solo una vez, cuenta verificada) */}
            {isVerified &&
                profile?.institution &&
                profile.institution.toLowerCase().includes("unam") &&
                !profile.unamCreditsClaimedAt && (
                    <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                        <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/20 border border-amber-200 dark:border-amber-800/50">
                            <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                                <div className="flex items-center gap-3 sm:block">
                                    <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-900/40 w-fit">
                                        <Gift className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                                    </div>
                                    <h4 className="text-sm font-bold text-slate-900 dark:text-white sm:hidden">¡Oferta UNAM!</h4>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="hidden sm:block text-sm font-bold text-slate-900 dark:text-white mb-1">
                                        ¡Oferta UNAM!
                                    </h4>
                                    <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">
                                        Como estudiante de la UNAM, reclama <strong>10 créditos extra</strong> para exportar análisis y escenarios. Solo una vez por cuenta.
                                    </p>
                                    <button
                                        type="button"
                                        onClick={async () => {
                                            if (!session?.user?.id || claimingUnam) return;
                                            setClaimingUnam(true);
                                            try {
                                                const res = await fetch("/api/claim-unam-credits", {
                                                    method: "POST",
                                                });
                                                const data = await res.json();
                                                if (res.ok && data.success) {
                                                    setProfile((p) =>
                                                        p ? { ...p, unamCreditsClaimedAt: new Date() } : null
                                                    );
                                                    await update();
                                                    onCreditsClaimed?.();
                                                    setToastMessage("¡10 créditos extra añadidos! 🎉");
                                                    setTimeout(() => setToastMessage(null), 3500);
                                                } else if (data.error?.includes("Ya reclamaste")) {
                                                    setToastMessage("¡Ya reclamaste esta recompensa! 😊");
                                                    setTimeout(() => setToastMessage(null), 3500);
                                                } else {
                                                    alert(data.error || "No se pudo reclamar");
                                                }
                                            } catch {
                                                alert("Error al reclamar. Intenta de nuevo.");
                                            } finally {
                                                setClaimingUnam(false);
                                            }
                                        }}
                                        disabled={claimingUnam}
                                        className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-2 rounded-xl bg-amber-600 text-white text-sm font-bold hover:bg-amber-500 disabled:opacity-50 transition-colors"
                                    >
                                        {claimingUnam ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <Gift className="w-4 h-4" />
                                        )}
                                        {claimingUnam ? "Reclamando…" : "Reclamar 10 créditos"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

            {/* Preferencias de correo: recordatorios, blog, promociones */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2 min-w-0">
                        <MailCheck className="w-4 h-4 shrink-0 text-slate-500 dark:text-slate-400" />
                        <div className="min-w-0">
                            <p className="text-sm font-bold text-slate-800 dark:text-slate-200">Notificaciones por correo</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Recordatorios, blog y promociones</p>
                        </div>
                    </div>
                    <button
                        type="button"
                        role="switch"
                        aria-checked={profile?.emailMarketingOptIn ?? false}
                        onClick={async () => {
                            if (!session?.user?.id) return;
                            const next = !(profile?.emailMarketingOptIn ?? false);
                            const res = await updateProfile(session.user.id, { emailMarketingOptIn: next });
                            if (res.success) {
                                setProfile((p) => (p ? { ...p, emailMarketingOptIn: next } : null));
                            } else {
                                alert(res.error);
                            }
                        }}
                        className={`relative inline-flex h-6 w-11 shrink-0 self-start sm:self-auto cursor-pointer rounded-full border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                            profile?.emailMarketingOptIn ? "bg-blue-600" : "bg-slate-200 dark:bg-slate-700"
                        }`}
                    >
                        <span
                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition ${
                                profile?.emailMarketingOptIn ? "translate-x-5" : "translate-x-1"
                            }`}
                        />
                    </button>
                </div>
            </div>

            {!isVerified && (
                <div className="p-3 sm:p-4 bg-amber-50 dark:bg-amber-950/30 rounded-xl sm:rounded-2xl border border-amber-100 dark:border-amber-900/50">
                    <div className="flex items-start gap-2 mb-1">
                        <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-500 mt-0.5 shrink-0" />
                        <h4 className="text-sm font-bold text-amber-900 dark:text-amber-500">Verificación pendiente</h4>
                    </div>
                    <p className="text-xs text-amber-700 dark:text-amber-600/80 mb-3">
                        Confirma tu correo para desbloquear tus 10 créditos de exportación. Pro y Researcher incluyen exportaciones ilimitadas.
                    </p>
                    <button
                        onClick={handleResendEmail}
                        disabled={emailLoading || emailSent}
                        className="w-full py-2 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2"
                    >
                        {emailLoading && <Loader2 className="w-3 h-3 animate-spin" />}
                        {emailSent ? "Correo enviado" : "Enviar enlace de verificación"}
                    </button>
                </div>
            )}
        </div>
    );
}
