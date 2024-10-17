import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
const prisma = new PrismaClient();

const generateUserID = async () => {
    const latestUser = await prisma.user.findFirst({
        orderBy: {
            id: "desc",
        },
    });
    const newID = latestUser ? latestUser.id + 1 : 1;
    return `A${newID.toString().padStart(3, "0")}`; // Generate userID in format 'Axxx'
};

export async function GET() {
    try {
        const getallusers = await prisma.user.findMany();
        return NextResponse.json(getallusers, { status: 200 });
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
    const userID = await generateUserID();
    const { name, username, password, fullName, lastName, role, tel } = await req.json();

    try {
        const exitUser = await prisma.user.findUnique({
            where: {
                username: username,
            },
        });

        if (exitUser) {
            return NextResponse.json(
                { success: false, message: "Username already exists" },
                { status: 409 } // HTTP 409 Conflict status code
            );
        }
        const hash_password = await hash(password, 12);
        const newUser = await prisma.user.create({
            data: {
                name: name,
                username: username,
                password: hash_password,
                fullName: fullName ?? null,
                lastName: lastName ?? null,
                userID: userID,
                tel: parseInt(tel),
                roles: {
                    connect: {
                        rolename: role
                    }
                }
            },
        });

        console.log(newUser);
        return NextResponse.json(newUser, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}
