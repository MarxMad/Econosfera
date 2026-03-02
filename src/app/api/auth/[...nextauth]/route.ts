import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

if (process.env.NODE_ENV === "production" && !process.env.NEXTAUTH_SECRET) {
  console.error(
    "[NextAuth] NEXTAUTH_SECRET no está definida. El login fallará con 'Server error'. Configúrala en Vercel → Settings → Environment Variables."
  );
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
