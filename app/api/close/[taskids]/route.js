import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import path from 'path';
import fs from "fs";

const prisma = new PrismaClient();
const uploadDir = path.join(process.cwd(), "public/uploads");

export async function POST(req, { params }) {
  const { taskids } = params;

  try {
    const formData = await req.formData();
    const afterImages = formData.getAll("afterImage"); // รับภาพหลังการซ่อมทั้งหมด
    const session = await auth();
    const chackTask = await prisma.task.findUnique({
      where: {
        id: parseInt(taskids),
      },
    });

    // บันทึกภาพหลังจากซ่อมเสร็จลงในโฟลเดอร์
    const savedImages = [];
    for (const image of afterImages) {
      if (image && image.type.startsWith("image/")) {
        const filePath = path.join(uploadDir, `${Date.now()}-${image.name}`);
        const buffer = Buffer.from(await image.arrayBuffer());
        fs.writeFileSync(filePath, buffer);
        savedImages.push(`/uploads/${path.basename(filePath)}`);
      }
    }

    // อัปเดต Task ให้เป็นการปิดงาน และสร้างข้อมูลใน Close_Task
    const updatedTask = await prisma.task.update({
      where: { id: parseInt(taskids) },
      data: {
        task_status: "success",
        updatedAt: new Date(),
        successAt: new Date(),
        closeTask: {
          create: {
            machine_img_after: savedImages.length > 0 ? savedImages : null, // บันทึกรูปหลายรูป
            userId: session.user.userId,
            machineId: chackTask.machineId,
            successAt: new Date(),
          },
        },
      },
    });

    if (chackTask) {
      return NextResponse.json({ message: "HI" }, { status: 200 });
    }

    if (updatedTask) {
      return NextResponse.json(
        { success: true, data: updatedTask },
        { message: "create OK" },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ message: "An error occurred" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
