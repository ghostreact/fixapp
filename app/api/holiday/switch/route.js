"use server"
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
    try {
        // ดึงวันหยุดที่สามารถสลับได้ (เช่นที่ยังไม่ถูกสลับ)
        const holidays = await prisma.holiday.findMany({
            where: {
                switch_holiday: false,
            },
            include: {
                user: true, // ดึงข้อมูลผู้ใช้มาด้วย
            },
        });

        return NextResponse.json({ success: true, data: holidays });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}

export async function POST(req) {
    const body = await req.json();
    const { userId, targetId, holidayId } = body; // รับค่าจาก frontend

    try {
        // ดึงข้อมูลวันหยุดของ target (ผู้ที่ถูกเลือกให้สลับวันหยุด)
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

        // อัปเดตวันหยุดของ target เป็น null และ switch_holiday เป็น true
        const updateTargetHoliday = await prisma.holiday.update({
            where: {
                id: holidayId,
            },
            data: {
                holiday_start: null,
                holiday_end: null,
                switch_holiday: true,
            },
        });

        // สร้างวันหยุดใหม่สำหรับผู้ใช้ที่ขอสลับ โดยใช้วันหยุดของ target
        const createNewHolidayForUser = await prisma.holiday.create({
            data: {
                holiday_start: targetHoliday.holiday_start,
                holiday_end: targetHoliday.holiday_end,
                holiday_type: targetHoliday.holiday_type,
                userId: userId, // เปลี่ยน owner ของวันหยุดเป็น user ที่ขอสลับ
                overlimit: targetHoliday.overlimit,
                switch_holiday: true,
            },
        });

        return NextResponse.json({ success: true, message: "สลับวันหยุดสำเร็จ" });
    } catch (error) {
        console.error("Error switching holiday:", error);
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}
