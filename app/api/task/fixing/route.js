import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();


export async function GET() {
    try {
        const getFixTask = await prisma.task.findMany({
            include: {
                user: true,
                machine: true,
            },
        });
        return NextResponse.json(getFixTask, { status: 200 });
    } catch (error) {
        console.error("Error fetching tasks:", error);
        return NextResponse.json(
            { success: false, message: "An error occurred while fetching tasks." },
            { status: 500 }
        );
    }
}

export async function POST(req) {
    const body = await req.json();
    const { machineId } = body;

    try {
        const fixTask = await prisma.task.updateMany({
            where: {
                machineId: parseInt(machineId),
                task_status: "pending"
            },
            data: {
                task_status: "fixing",
               
            }
        });

        return NextResponse.json({ success: true, fixTask });
    } catch (error) {
        console.error("Error fixTask task:", error);
        return NextResponse.json({ error: "Failed to fixTask task" }, { status: 500 });
    }
}