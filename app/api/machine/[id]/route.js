"use server";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req, { params }) {
    const { id } = params;

    try {
        const getMachineById = await prisma.machine.findUnique({
            where: { id: parseInt(id) },
            include: {
                tasks: true,
                meet: true,
            },
        });
        if (!getMachineById) {
            return NextResponse.json({ error: "Machine get not ID" });
        }

        return NextResponse.json(getMachineById, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}

// DELETE: ลบการนัดหมายตาม id
export async function DELETE(req, { params }) {
    const { id } = params;

    try {
        await prisma.meeting.delete({
            where: { id: parseInt(id) },
        });
        return NextResponse.json({ message: "Meeting deleted successfully" });
    } catch (error) {
        return NextResponse.json(
            { error: "Error deleting meeting" },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}
