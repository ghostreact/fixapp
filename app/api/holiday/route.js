"use server";

import { PrismaClient } from "@prisma/client";
import { auth } from "@/auth";
import { NextResponse } from "next/server";
const prisma = new PrismaClient();

export async function GET(){
    try {
        const getallHoliday = await prisma.holiday.findMany()
        return NextResponse.json(getallHoliday,{status : 200})
    } catch (error) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect()
    }
}


export async function POST(req, { params }) {
  const session = await auth();
  const body = await req.json();

  if (!session || !session.user) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    // ตรวจสอบว่าผู้ใช้มีอยู่ในฐานข้อมูลหรือไม่
    const users = await prisma.user.findUnique({
      where: { username: session.user.username }, // ค้นหาผู้ใช้จาก userID
    });

    if (!users) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // สร้างวันหยุดให้กับผู้ใช้ที่พบในฐานข้อมูล
    const createHoliday = await prisma.holiday.create({
      data: {
        holiday_start: new Date(body.holiday_start),
        holiday_end: new Date(body.holiday_end),
        holiday_type: body.holiday_type,
        overlimit: body.overlimit,
        switch_holiday: body.switch_holiday || false,
        user: {
            connect : {
                username : session.user.username
            }
        },
      },
    });

    return NextResponse.json({ success: true, data: createHoliday }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
