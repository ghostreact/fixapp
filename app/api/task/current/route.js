import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

const prisma = new PrismaClient();

export async function GET() {
    const session = await auth();

    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const currentTask = await prisma.task.findFirst({
            where: {
                userId: session.user.username,
                task_status: "pending"
            },
            include: {
                machine: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return NextResponse.json(currentTask);
    } catch (error) {
        console.error("Error fetching current task:", error);
        return NextResponse.json({ error: "Failed to fetch current task" }, { status: 500 });
    }
}