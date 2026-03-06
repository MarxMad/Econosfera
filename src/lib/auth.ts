import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "./prisma";
import bcrypt from "bcryptjs";

// Asegurar NEXTAUTH_URL válida antes de que NextAuth la use (evita "Failed to construct URL: Invalid URL")
(function ensureNextAuthUrl() {
    const current = process.env.NEXTAUTH_URL?.trim();
    if (!current) {
        const fallback =
            process.env.NEXT_PUBLIC_SITE_URL ||
            (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null) ||
            "https://econosfera.xyz";
        process.env.NEXTAUTH_URL = (fallback || "https://econosfera.xyz").replace(/\/$/, "");
    } else if (!current.startsWith("http://") && !current.startsWith("https://")) {
        process.env.NEXTAUTH_URL = `https://${current.replace(/^\/+/, "")}`;
    }
})();

export const authOptions: NextAuthOptions = {
    // PrismaAdapter + CredentialsProvider pueden causar 500. Probar sin adapter para credentials.
    // Si usas Google OAuth, descomenta: adapter: PrismaAdapter(prisma),
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/auth/signin",
    },
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
                loginToken: { label: "Login Token", type: "text" },
            },
            async authorize(credentials) {
                try {
                    // Inicio de sesión con token de un solo uso (tras verificar correo)
                    if (credentials?.loginToken) {
                        const tokenRecord = await prisma.verificationToken.findUnique({
                            where: { token: credentials.loginToken },
                        });
                        if (!tokenRecord || tokenRecord.expires < new Date()) return null;
                        const user = await prisma.user.findUnique({
                            where: { email: tokenRecord.identifier },
                        });
                        await prisma.verificationToken.delete({ where: { token: credentials.loginToken } }).catch(() => {});
                        if (!user) return null;
                        return {
                            id: user.id,
                            email: user.email,
                            name: user.name,
                            image: user.image,
                            credits: user.credits,
                            exportsCount: (user as any).exportsCount,
                            plan: (user as any).plan,
                            emailVerified: user.emailVerified,
                        };
                    }

                    if (!credentials?.email || !credentials?.password) {
                        throw new Error("Invalid credentials");
                    }

                    const emailNorm = String(credentials.email).trim().toLowerCase();
                    const user = await prisma.user.findFirst({
                        where: {
                            email: { equals: emailNorm, mode: "insensitive" },
                        },
                    });

                    if (!user) {
                        throw new Error("User not found");
                    }
                    if (!user.password) {
                        throw new Error("GoogleAccount");
                    }

                    const isValid = await bcrypt.compare(credentials.password, user.password);

                    if (!isValid) {
                        throw new Error("Invalid password");
                    }

                    return {
                        id: user.id,
                        email: user.email,
                        name: user.name,
                        image: user.image,
                        credits: user.credits,
                        exportsCount: (user as any).exportsCount,
                        plan: (user as any).plan,
                        emailVerified: user.emailVerified,
                    };
                } catch (e) {
                    if (e instanceof Error && (e.message === "Invalid credentials" || e.message === "User not found" || e.message === "GoogleAccount" || e.message === "Invalid password")) {
                        throw e;
                    }
                    console.error("[NextAuth] authorize error:", e);
                    throw new Error("CredentialsSignin");
                }
            },
        }),
    ],
    callbacks: {
        async session({ token, session }) {
            if (token) {
                session.user.id = token.id;
                session.user.name = token.name;
                session.user.email = token.email;
                session.user.image = token.picture;
                session.user.credits = token.credits;
                session.user.exportsCount = token.exportsCount;
                session.user.plan = token.plan;
                session.user.emailVerified = token.emailVerified as Date | null;
            }
            return session;
        },
        async jwt({ token, user }) {
            try {
                const dbUser = await prisma.user.findFirst({
                    where: { email: token.email },
                });

                if (!dbUser) {
                    if (user) {
                        token.id = user.id;
                    }
                    return token;
                }

                return {
                    id: dbUser.id,
                    name: dbUser.name,
                    email: dbUser.email,
                    picture: dbUser.image,
                    credits: dbUser.emailVerified ? dbUser.credits : 0,
                    exportsCount: (dbUser as any).exportsCount,
                    plan: (dbUser as any).plan,
                    emailVerified: dbUser.emailVerified,
                };
            } catch (e) {
                console.error("[NextAuth] jwt callback error:", e);
                if (user) {
                    token.id = user.id;
                }
                return token;
            }
        },
    },
};
