import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

const prisma = new PrismaClient();

export async function GET(){
    const session = await auth();

    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const fixTask = await prisma.task.findFirst({
            where : {
                userId: session.user.username,
                task_status: "fixing"
            },
            include : {
                machine : true
            },
            orderBy : {
                createdAt : 'desc'
            }
        })

        return NextResponse.json(fixTask)
    } catch (error) {
        console.error("Error fetching task:", error);
        return NextResponse.json({ error: "Failed to fetch task" }, { status: 500 });
    } finally {
        await prisma.$disconnect()
    }
}