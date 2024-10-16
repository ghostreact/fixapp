import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request) {
  try {
    // ดึงข้อมูลวันหยุดพนักงานทั้งหมด
    const holidays = await prisma.holiday.findMany({
      include: {
        user: true, // รวมข้อมูลพนักงานที่ลางาน
      },
    });

    // ดึงข้อมูลการนัดหมายพนักงานทั้งหมด
    const meetings = await prisma.meeting.findMany({
      include: {
        user: true, // รวมข้อมูลผู้ที่สร้างการนัดหมาย
      },
    });

    // ส่งข้อมูลวันหยุดและการนัดหมายกลับไปในรูปแบบ JSON
    return new Response(
      JSON.stringify({
        holidays,
        meetings,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error fetching data:', error);
    return new Response(JSON.stringify({ error: 'Unable to fetch events' }), {
      status: 500,
    });
  }
}