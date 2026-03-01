"use client";

import { useState, useEffect, useRef } from "react";
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
    Camera,
    Save,
} from "lucide-react";
import { getProfile, updateProfile, uploadProfileImage, resendVerification } from "@/lib/actions/authActions";

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
} | null;

export default function ProfileCard() {
    const { data: session, status, update } = useSession();
    const [profile, setProfile] = useState<ProfileData>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploadingPhoto, setUploadingPhoto] = useState(false);
    const [emailSent, setEmailSent] = useState(false);
    const [emailLoading, setEmailLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

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

    const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        const userId = session?.user?.id;
        if (!file || !userId) return;
        if (!file.type.startsWith("image/")) {
            alert("Selecciona una imagen (JPG, PNG, etc.).");
            return;
        }
        setUploadingPhoto(true);
        const formData = new FormData();
        formData.set("userId", userId);
        formData.set("file", file);
        const uploadRes = await uploadProfileImage(formData);
        if ("error" in uploadRes) {
            alert(uploadRes.error);
            setUploadingPhoto(false);
            return;
        }
        const updateRes = await updateProfile(userId, { image: uploadRes.url });
        if (updateRes.success) {
            setProfile((prev) => (prev ? { ...prev, image: uploadRes.url } : null));
            await update();
        } else {
            alert(updateRes.error);
        }
        setUploadingPhoto(false);
        e.target.value = "";
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
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-lg animate-pulse">
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
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4">
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

            <div className="flex flex-col sm:flex-row gap-6 mb-6">
                <div
                    className="relative group shrink-0"
                    onClick={() => fileInputRef.current?.click()}
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handlePhotoChange}
                        disabled={uploadingPhoto}
                    />
                    <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-500 to-emerald-500 p-0.5 shadow-md overflow-hidden">
                        <div className="w-full h-full rounded-2xl bg-slate-900 flex items-center justify-center text-2xl font-black text-white overflow-hidden">
                            {uploadingPhoto ? (
                                <Loader2 className="w-10 h-10 animate-spin text-white" />
                            ) : avatarUrl ? (
                                <img src={avatarUrl} alt="" className="w-full h-full object-cover" />
                            ) : (
                                displayName.charAt(0).toUpperCase()
                            )}
                        </div>
                    </div>
                    <div className="absolute inset-0 rounded-2xl bg-slate-900/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                        <Camera className="w-8 h-8 text-white" />
                    </div>
                </div>

                <div className="flex-1 min-w-0 space-y-4">
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
            </div>

            {!isVerified && (
                <div className="p-4 bg-amber-50 dark:bg-amber-950/30 rounded-2xl border border-amber-100 dark:border-amber-900/50">
                    <div className="flex items-start gap-2 mb-1">
                        <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-500 mt-0.5 shrink-0" />
                        <h4 className="text-sm font-bold text-amber-900 dark:text-amber-500">Verificación pendiente</h4>
                    </div>
                    <p className="text-xs text-amber-700 dark:text-amber-600/80 mb-3">
                        Confirma tu identidad para asegurar tus créditos IA y habilitar exportaciones ilimitadas.
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
