import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
    try {
        const getUsername = await prisma.role.findMany();
        return NextResponse.json(getUsername, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}

export async function POST(req) {
    const { name } = await req.json();
    try {
        const newRole = await prisma.role.create({
            data: {
                rolename: name,
            },
        });

        console.log(newRole);
        return NextResponse.json(newRole, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}
