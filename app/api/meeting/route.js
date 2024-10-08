"use server";
import { auth } from "@/auth";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
    try {
        const getallMeeting = await prisma.meeting.findMany({
            include: {
                user: true,
               
            },
        });
        return NextResponse.json(getallMeeting, { status: 200 });
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
    const session = await auth();  // ตรวจสอบการดึง session

    // ตรวจสอบว่ามี session หรือไม่
    if (!session || !session.user) {
        return NextResponse.json({ error: "User is not authenticated" }, { status: 401 });
    }

    const body = await req.json();
    
    try {
        // ตรวจสอบฟิลด์ที่จำเป็น
        if (!body.name || !body.meeting_date || !body.meeting_tel || !body.meeting_des) {
            return NextResponse.json(
              { error: "Missing required fields" },
              { status: 400 }
            );
        }

        // ตรวจสอบว่ามีการเชื่อมโยงกับเครื่องจักรหรือไม่
        let machine = null;
        if (body.machineId) {
            machine = await prisma.machine.findUnique({
                where: { machine_id: body.machineId }
            });

            if (!machine) {
                return NextResponse.json({ error: "Machine not found" }, { status: 404 });
            }
        }

        // สร้างการนัดหมายใหม่
        const createMeeting = await prisma.meeting.create({
            data: {
                name: body.name,
                meeting_date: new Date(body.meeting_date),
                meeting_tel: body.meeting_tel,
                meeting_des: body.meeting_des,
                meeting_name: body.name,
                meeting_status: body.meeting_status || 'pending', 
                user: {
                    connect: {
                        username: session.user.username
                    }
                },
                Machine: machine ? { connect: { id: machine.id } } : undefined // เชื่อมโยงกับ Machine ผ่าน 'connect'
            },
        });
        
        return NextResponse.json({ success: true, data: createMeeting }, { status: 201 });
        
    } catch (error) {
        return NextResponse.json(
            { message: error.message },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}
