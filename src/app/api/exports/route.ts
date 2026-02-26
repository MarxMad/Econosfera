import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        const body = await req.json();
        const { type, module: moduleName } = body;

        if (!type || !moduleName) {
            return NextResponse.json({ error: "Missing type or module" }, { status: 400 });
        }

        // Register export in ExportLog
        await prisma.exportLog.create({
            data: {
                userId: session?.user?.id || null,
                visitorId: session?.user?.id ? null : "anon", // Simple fallback for anonymous users
                type,
                module: moduleName,
            }
        });

        // If logged in, increment their exports counter
        if (session?.user?.id) {
            await prisma.user.update({
                where: { id: session.user.id },
                data: {
                    exportsCount: { increment: 1 }
                }
            });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error logging export:", error);
        return NextResponse.json({ error: "Failed to log export" }, { status: 500 });
    }
}
