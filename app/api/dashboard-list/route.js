import { auth } from "@/auth";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

// บอก Next.js ว่าเส้นทางนี้เป็น dynamic route
export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const session = await auth();
        const userId = session.user.userId;
        const getlistfixed = await prisma.task.findMany({
            where: {
                task_status: "fixing",
                userId: userId
            },
        });

        return NextResponse.json({ getlistfixed }, { status: 200 });
    } catch (error) {
        console.error("Error fetching tasks:", error);
    } finally {
        await prisma.$disconnect();
    }
}
