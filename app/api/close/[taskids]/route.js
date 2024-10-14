import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { auth } from "@/auth"; // ระบบ auth สำหรับตรวจสอบสิทธิ์ผู้ใช้
import path from 'path';
import fs from "fs";

const prisma = new PrismaClient();
const uploadDir = path.join(process.cwd(), "public/uploads"); // เพิ่มการประกาศตัวแปร uploadDir

export async function POST(req, { params }) {
  const { taskids } = params;

  try {
    // ตรวจสอบว่า req.formData นั้นถูกต้องหรือไม่ (สำหรับการรับข้อมูล POST/PUT/อื่นๆ)
    const formData = await req.formData();
    const afterImages = formData.getAll("afterImage"); // รับภาพหลังการซ่อม
    const session = await auth();
    const chackTask = await prisma.task.findUnique({
      where: {
        id: parseInt(taskids),
      },
    });

    console.log(chackTask);

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
        successAt :  new Date(),
        closeTask: {
          create: {
            machine_img_after: savedImages.length > 0 ? savedImages[0] : null,
            userId: session.user.userId, // เชื่อมโยงกับผู้ใช้ที่ปิดงาน
            machineId: chackTask.machineId, // เชื่อมโยงกับเครื่องจักรที่เกี่ยวข้อง
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

// export async function GET(req, { params }) {
//   const { taskId } = params;
//   // const session = await auth();

//   // if (!session || !session.user) {
//   //   return NextResponse.json(
//   //     { success: false, message: "Unauthorized" },
//   //     { status: 401 }
//   //   );
//   // }

//   try {
//    // const formData = await req.formData();
//    // const afterImages = formData.getAll("afterImage"); // รับภาพหลังการซ่อม

//     // ตรวจสอบว่า Task มีอยู่หรือไม่
//     const task = await prisma.task.findUnique({
//       where: { id: parseInt(taskId, 10) }, // แปลง taskId เป็น Integer
//       select: {
//         taskname: true,
//       },
//     });

//     console.log(task);

//     if (!task) {
//       return NextResponse.json(
//         { success: false, message: "Task not found" },
//         { status: 404 }
//       );
//     }

// บันทึกภาพหลังจากซ่อมเสร็จลงในโฟลเดอร์
// const savedImages = [];
// for (const image of afterImages) {
//   if (image && image.type.startsWith("image/")) {
//     const filePath = path.join(uploadDir, `${Date.now()}-${image.name}`);
//     const buffer = Buffer.from(await image.arrayBuffer());
//     fs.writeFileSync(filePath, buffer);
//     savedImages.push(`/uploads/${path.basename(filePath)}`);
//   }
// }

// // อัปเดต Task ให้เป็นการปิดงาน และสร้างข้อมูลใน Close_Task
// const updatedTask = await prisma.task.update({
//   where: { id: parseInt(taskId) },
//   data: {
//     task_status: "success",
//     updatedAt: new Date(),
//     closeTask: {
//       create: {
//         machine_img_after: savedImages.length > 0 ? savedImages[0] : null,
//         userId: session.user.userId, // เชื่อมโยงกับผู้ใช้ที่ปิดงาน
//         machineId: task.machineId, // เชื่อมโยงกับเครื่องจักรที่เกี่ยวข้อง
//         successAt: new Date(),
//       },
//     },
//   },
// });

// return NextResponse.json(
//   { success: true, data: updatedTask },
//   { status: 200 }
// );
//   } catch (error) {
//     console.error("Error closing task:", error);
//     return NextResponse.json(
//       { success: false, message: "An error occurred while closing the task." },
//       { status: 500 }
//     );
//   } finally {
//     await prisma.$disconnect();
//   }
// }
