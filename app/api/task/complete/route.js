import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req) {
    const body = await req.json();
    const { machineId } = body;

    try {
        const completedTask = await prisma.task.updateMany({
            where: {
                machineId: parseInt(machineId),
                task_status: "fixing"
            },
            data: {
                task_status: "completed",
                successAt: new Date()
            }
        });

        return NextResponse.json({ success: true, completedTask });
    } catch (error) {
        console.error("Error completing task:", error);
        return NextResponse.json({ error: "Failed to complete task" }, { status: 500 });
    }
}