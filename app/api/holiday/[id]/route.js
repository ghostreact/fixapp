"use server";

import { PrismaClient } from "@prisma/client";
import { auth } from "@/auth";
import { NextResponse } from "next/server";
const prisma = new PrismaClient();

export async function PUT(req, { params }) {
  const session = await auth();
  const body = await req.json();
  const { id } = params;

  if (!session || !session.user) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    // ตรวจสอบว่าผู้ใช้มีอยู่ในฐานข้อมูลหรือไม่
    const updateHoliday = await prisma.holiday.update({
      where: { id: parseInt(id) },
      data: {
        holiday_start: new Date(body.holiday_start),
        holiday_end: new Date(body.holiday_end),
        holiday_type: body.holiday_type,
      },
    });

    return NextResponse.json(
      { success: true, data: createHoliday },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
