"use server";

import { prisma } from "../prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { sendVerificationEmail } from "../email";
import crypto from "crypto";
import bcrypt from "bcryptjs";

export async function resendVerification() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return { error: "No autorizado" };

    const user = await prisma.user.findUnique({
        where: { email: session.user.email }
    });

    if (!user) return { error: "Usuario no encontrado" };
    if (user.emailVerified) return { error: "Ya verificado" };

    const userEmail = user.email!;
    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 24 * 3600000); // 24 horas

    await prisma.verificationToken.deleteMany({ where: { identifier: userEmail } });
    await prisma.verificationToken.create({ data: { identifier: userEmail, token, expires } });

    const sendResult = await sendVerificationEmail(userEmail, token, user.name || "Usuario");
    if (!sendResult?.success) {
        return { error: sendResult?.error || "No se pudo enviar el correo. Revisa en Vercel que RESEND_API_KEY y el dominio estén configurados." };
    }

    return { success: true };
}

/** Reenvía el correo de verificación por email (sin requerir sesión). Útil tras registrarse. */
export async function resendVerificationByEmail(email: string) {
    if (!email || typeof email !== "string") return { error: "Correo no válido" };
    const trimmed = email.trim().toLowerCase();
    if (!trimmed) return { error: "Correo no válido" };

    const user = await prisma.user.findUnique({
        where: { email: trimmed },
        select: { name: true, emailVerified: true }
    });

    if (!user) return { error: "No hay ninguna cuenta con ese correo." };
    if (user.emailVerified) return { error: "Esa cuenta ya está verificada. Inicia sesión." };

    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 24 * 3600000); // 24 horas

    await prisma.verificationToken.deleteMany({ where: { identifier: trimmed } });
    await prisma.verificationToken.create({ data: { identifier: trimmed, token, expires } });
    const sendResult = await sendVerificationEmail(trimmed, token, user.name || "Usuario");
    if (!sendResult?.success) {
        return { error: sendResult?.error || "No se pudo enviar el correo." };
    }

    return { success: true };
}

export async function registerUser(formData: FormData) {
    try {
        const name = formData.get("name") as string;
        const lastName = formData.get("lastName") as string;
        const email = formData.get("email") as string;
        const institution = formData.get("institution") as string;
        const phone = (formData.get("phone") as string) || undefined;
        const occupation = (formData.get("occupation") as string) || undefined;
        const educationLevel = (formData.get("educationLevel") as string) || undefined;
        const password = (formData.get("password") as string) || "";
        const emailNorm = (formData.get("email") as string)?.trim().toLowerCase() || "";

        if (!emailNorm || !password || !name) {
            return { error: "Faltan campos obligatorios" };
        }

        // Verificar si existe
        const existingUser = await prisma.user.findUnique({
            where: { email: emailNorm },
        });

        if (existingUser) {
            return { error: "El correo ya está registrado" };
        }

        // Hashing
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crear usuario (email normalizado para login consistente)
        const user = await prisma.user.create({
            data: {
                name,
                lastName,
                email: emailNorm,
                institution,
                phone: phone || undefined,
                occupation: occupation || undefined,
                educationLevel: educationLevel || undefined,
                password: hashedPassword,
            },
        });

        // Generar token de verificación
        const token = crypto.randomBytes(32).toString('hex');
        const expires = new Date(Date.now() + 24 * 3600000); // 24 horas

        await prisma.verificationToken.create({
            data: {
                identifier: emailNorm,
                token,
                expires,
            },
        });

        // Enviar email
        await sendVerificationEmail(email, token, name);

        return { success: true };
    } catch (error: any) {
        console.error("Error en registro:", error);
        return { error: "Error al crear la cuenta" };
    }
}

export async function getProfile(userId: string) {
    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                name: true,
                lastName: true,
                email: true,
                image: true,
                institution: true,
                phone: true,
                occupation: true,
                educationLevel: true,
                emailVerified: true,
                emailMarketingOptIn: true,
            },
        });
        return user;
    } catch (e) {
        console.error(e);
        return null;
    }
}

export async function updateProfile(userId: string, data: {
    name?: string;
    lastName?: string;
    institution?: string;
    phone?: string;
    occupation?: string;
    educationLevel?: string;
    image?: string | null;
    emailMarketingOptIn?: boolean;
}) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.id !== userId) {
        return { error: "No autorizado" };
    }
    try {
        await prisma.user.update({
            where: { id: userId },
            data: {
                ...(data.name !== undefined && { name: data.name }),
                ...(data.lastName !== undefined && { lastName: data.lastName }),
                ...(data.institution !== undefined && { institution: data.institution }),
                ...(data.phone !== undefined && { phone: data.phone }),
                ...(data.occupation !== undefined && { occupation: data.occupation }),
                ...(data.educationLevel !== undefined && { educationLevel: data.educationLevel }),
                ...(data.image !== undefined && { image: data.image }),
                ...(data.emailMarketingOptIn !== undefined && { emailMarketingOptIn: data.emailMarketingOptIn }),
            },
        });
        return { success: true };
    } catch (e: any) {
        console.error(e);
        return { error: e?.message || "Error al actualizar perfil" };
    }
}

/** Sube la imagen de perfil a Supabase Storage y devuelve la URL pública. Acepta FormData con "file" y "userId". */
export async function uploadProfileImage(formData: FormData): Promise<{ url: string } | { error: string }> {
    const session = await getServerSession(authOptions);
    const userId = formData.get("userId");
    if (!session?.user?.id || typeof userId !== "string" || session.user.id !== userId) {
        return { error: "No autorizado" };
    }

    const file = formData.get("file");
    if (!file || !(file instanceof File)) {
        return { error: "No se envió ninguna imagen" };
    }

    const { getSupabaseServer, BUCKET_AVATARS } = await import("@/lib/supabase");
    const supabase = getSupabaseServer();
    if (!supabase) {
        return { error: "Almacenamiento de imágenes no configurado (Supabase)." };
    }

    const ext = file.name.split(".").pop() || "jpg";
    const path = `${userId}/avatar.${ext}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { error } = await supabase.storage
        .from(BUCKET_AVATARS)
        .upload(path, buffer, { upsert: true, contentType: file.type || "image/jpeg" });

    if (error) {
        console.error("Supabase upload error:", error);
        return { error: error.message || "Error al subir la imagen" };
    }

    const { data: urlData } = supabase.storage.from(BUCKET_AVATARS).getPublicUrl(path);
    return { url: urlData.publicUrl };
}
