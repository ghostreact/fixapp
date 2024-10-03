"use server";

import { PrismaClient } from "@prisma/client";
import { auth } from "@/auth";
import { NextResponse } from "next/server";
const prisma = new PrismaClient();
export async function POST(req) {
  const body = await req.json();
  const { userId, targetId, holidayId } = body; // รับค่าจาก frontend

  // ตรวจสอบว่า holidayId มีค่า
  if (!holidayId) {
    return NextResponse.json(
      { success: false, message: "ไม่พบค่า holidayId" },
      { status: 400 }
    );
  }

  try {
    // ตรวจสอบว่ามีวันหยุดที่ต้องการจะสลับ
    const targetHoliday = await prisma.holiday.findUnique({
      where: {
        id: holidayId, // ใช้ id ของวันหยุดที่ถูกเลือก
      },
    });

    if (!targetHoliday) {
      return NextResponse.json(
        { success: false, message: "ไม่พบวันหยุดของผู้ใช้ที่ถูกเลือก" },
        { status: 404 }
      );
    }

    // อัปเดตวันหยุดของ target เป็น username ใหม่ และ switch_holiday เป็น true
    const updateHoliday = await prisma.holiday.update({
      where: {
        id: holidayId,
      },
      data: {
        userId: userId, // เปลี่ยน owner ของวันหยุดเป็น user ที่ขอสลับ
        switch_holiday: true,
      },
    });

    return NextResponse.json({ success: true, message: 'สลับวันหยุดสำเร็จ' });
  } catch (error) {
    console.error('Error switching holiday:', error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function PUT(req, { params }) {
  const { id } = params; // รับค่า id จาก URL
  const body = await req.json();
  const { userId, switch_holiday } = body; // รับค่าจาก body ที่ frontend ส่งมา

  if (!id) {
    return NextResponse.json(
      { success: false, message: "ไม่พบค่า holidayId" },
      { status: 400 }
    );
  }

  try {
    // ตรวจสอบว่ามี holidayId ที่ต้องการอัปเดต
    const targetHoliday = await prisma.holiday.findUnique({
      where: { id: parseInt(id) },
    });

    if (!targetHoliday) {
      return NextResponse.json(
        { success: false, message: "ไม่พบวันหยุด" },
        { status: 404 }
      );
    }

    // อัปเดต userId และ switch_holiday
    const updatedHoliday = await prisma.holiday.update({
      where: { id: parseInt(id) },
      data: {
        userId: userId, // เปลี่ยนเจ้าของวันหยุดเป็น user ใหม่
        switch_holiday: switch_holiday, // ตั้งค่า switch_holiday เป็น true
      },
    });

    return NextResponse.json({ success: true, data: updatedHoliday }, { status: 200 });
  } catch (error) {
    console.error("Error updating holiday:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
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
