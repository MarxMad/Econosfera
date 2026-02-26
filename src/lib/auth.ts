import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "./prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
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
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Invalid credentials");
                }

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email },
                });

                if (!user || !user.password) {
                    throw new Error("User not found");
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
                credits: dbUser.credits,
                exportsCount: (dbUser as any).exportsCount,
                plan: (dbUser as any).plan,
                emailVerified: dbUser.emailVerified,
            };
        },
    },
};
