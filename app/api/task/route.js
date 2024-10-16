import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import fs from "fs";
import path from "path";
// Create a singleton instance of PrismaClient
const prisma = new PrismaClient();

const generateTaskID = async () => {
  const genTaskID = await prisma.task.findFirst({
    orderBy: {
      id: "desc",
    },
  });

  const newTaskID = genTaskID ? genTaskID.id + 1 : 1;
  return `Task_ID${newTaskID.toString().padStart(5, "0")}`;
};

export async function GET() {
  try {
    const getAllTask = await prisma.task.findMany({
      include: {
        user: true,
        machine: true,
      },
    });
    return NextResponse.json(getAllTask, { status: 200 });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return NextResponse.json(
      { success: false, message: "An error occurred while fetching tasks." },
      { status: 500 }
    );
  }
}

// export async function POST(req) {
//     const body = await req.json();
//     const taskid = await generateTaskID();
//     const session = await auth();

//     if (!session || !session.user) {
//       return NextResponse.json(
//         { success: false, message: "Unauthorized" },
//         { status: 401 }
//       );
//     }

//     // สร้างโฟลเดอร์สำหรับเก็บรูปถ้าโฟลเดอร์ยังไม่มี
//   const uploadDir = path.join(process.cwd(), 'public/uploads');
//   if (!fs.existsSync(uploadDir)) {
//     fs.mkdirSync(uploadDir, { recursive: true });
//   }

//     try {
//       const form = await req.formData();
//       const newTask = await prisma.task.create({
//         data: {
//           taskname: body.taskname,
//           taskid: taskid,
//           task_status : "fixing",
//           user: {
//             connect: {
//               username: session.user.username
//             }
//           },
//           machine: {
//             connect: {
//               id: parseInt(body.machineId, 10)
//             }
//           },
//           createdAt: new Date(),
//         },
//       });
//       return NextResponse.json({success: true, data: newTask}, {status: 201})
//     } catch (error) {
//       console.error("Error creating task:", error);
//       return NextResponse.json(
//         { success: false, message: "An error occurred while creating the task." },
//         { status: 500 }
//       );
//     }
//   }
export const dynamic = 'force-dynamic';
export async function POST(req) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const form = await req.formData();
    const taskname = form.get("taskname");
    const machineId = form.get("machineId");
    const files = form.getAll("beforeImage");

    // Validate input
    if (!taskname || !machineId || files.length === 0) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    const taskid = await generateTaskID();
    const uploadDir = path.join(process.cwd(), "public/uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const savedImages = [];
    for (const image of files) {
      if (image && image.type.startsWith("image/")) {
        const filePath = path.join(uploadDir, `${Date.now()}-${image.name}`);
        const buffer = Buffer.from(await image.arrayBuffer());
        fs.writeFileSync(filePath, buffer);
        savedImages.push(`/uploads/${path.basename(filePath)}`);
      }
    }
    const newTask = await prisma.task.create({
      data: {
        taskname: taskname,
        taskid: taskid,
        task_status: "fixing",
        user: {
          connect: {
            userID: session.user.userId,
          },
        },
        machine: {
          connect: {
            id: parseInt(machineId, 10),
          },
        },
        machine_img_before: savedImages.length > 0 ? savedImages : null, // Store all image paths
        createdAt: new Date(),
      },
    });

    return NextResponse.json({ success: true, data: newTask }, { status: 201 });
  } catch (error) {
    console.error("Error creating task:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: "An error occurred while creating the task.",
        error: error.message 
      },
      { status: 500 }
    );
  }
}
