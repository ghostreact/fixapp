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

export const config = {
  api: {
    bodyParser: false,
  },
}

export async function POST(req) {
  const taskid = await generateTaskID();
  const session = await auth();

  if (!session || !session.user) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  const uploadDir = path.join(process.cwd(), "public/uploads");
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  try {
    const form = await req.formData();
    const taskname = form.get("taskname");
    const machineId = parseInt(form.get("machineId"));

    const files = form.getAll("beforeImage");
    const filePaths = await Promise.all(
      files.map(async (file) => {
        const filePath = path.join(uploadDir, `${Date.now()}-${file.name}`);
        const buffer = Buffer.from(await file.arrayBuffer());
        fs.writeFileSync(filePath, buffer);
        return `/uploads/${path.basename(filePath)}`;
      })
    );

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
            id: machineId,
          },
        },
        machine_img_before: filePaths.length > 0 ? filePaths[0] : null,
        createdAt: new Date(),
        
      },
    });

    return NextResponse.json({ success: true, data: newTask }, { status: 201 });
  } catch (error) {
    console.error("Error creating task:", error);
    return NextResponse.json(
      { success: false, message: "An error occurred while creating the task." },
      { status: 500 }
    );
  }
}