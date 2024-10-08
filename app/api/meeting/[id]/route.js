import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

// GET: ดึงข้อมูลการนัดหมายตาม id
export async function GET(req, { params }) {
  const { id } = params;

  try {
    const meeting = await prisma.meeting.findUnique({
      where: { id: parseInt(id) },
      include: { user: true, Machine: true }, // รวมข้อมูลที่เกี่ยวข้องกับ user และ Machine
    });

    if (!meeting) {
      return NextResponse.json({ error: "Meeting not found" }, { status: 404 });
    }

    return NextResponse.json(meeting);
  } catch (error) {
    return NextResponse.json({ error: "Error fetching meeting" }, { status: 500 });
  }
}

// PUT: อัปเดตข้อมูลการนัดหมายตาม id
export async function PUT(req, { params }) {
  const { id } = params;
  const body = await req.json();

  try {
    const updatedMeeting = await prisma.meeting.update({
      where: { id: parseInt(id) },
      data: {
        name: body.name,
        meeting_date: new Date(body.meeting_date),
        meeting_tel: body.meeting_tel,
        meeting_des: body.meeting_des,
        meeting_name: body.meeting_name,
        machines: body.machines,  // อัปเดตข้อมูล Machine
        meeting_status: body.meeting_status,
        successAt: body.successAt ? new Date(body.successAt) : null,
      },
    });
    return NextResponse.json(updatedMeeting);
  } catch (error) {
    return NextResponse.json({ error: "Error updating meeting" }, { status: 500 });
  }  finally {
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
    return NextResponse.json({ error: "Error deleting meeting" }, { status: 500 });
  }  finally {
    await prisma.$disconnect();
  }
}
