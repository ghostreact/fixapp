import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function PUT(req, { params }) {
    const { id } = params;
    const { name } =  await req.json();

    try {
        const updateRole = await prisma.role.update({
            where: { id: parseInt(id) },
            data: {
                rolename: name,
            },
        });
        console.log(updateRole);
        return NextResponse.json(updateRole, { status: 200 });
    } catch (error) {
        console.error("Error Update role:", error);
        return NextResponse.json({ error: "Error Update role" }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}

export async function DELETE(req, { params }) {
    const { id } = params;

    try {
        await prisma.role.delete({
            where: { id: parseInt(id) },
        });
        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        console.error("Error deleting task:", error);
        return NextResponse.json({ error: "Error deleting task" }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}
