import { DefaultSession } from "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            credits: number;
            exportsCount: number;
            plan: string;
            emailVerified: Date | null;
        } & DefaultSession["user"];
    }

    interface User {
        credits: number;
        exportsCount: number;
        plan: string;
        emailVerified: Date | null;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string;
        credits: number;
        exportsCount: number;
        plan: string;
        emailVerified: Date | null;
    }
}
