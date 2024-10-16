// import { PrismaClient } from "@prisma/client";
// import moment from "moment";
// import { NextResponse } from "next/server";

// const prisma = new PrismaClient();

// export async function GET(req) {
//   const { searchParams } = new URL(req.url);
//   const machineSN = searchParams.get("machine_SN");
//   const machineAdvice = searchParams.get("machine_Advice");
//   const startDate = searchParams.get("startDate");
//   const endDate = searchParams.get("endDate");

//   try {
//     let whereClause = {};

//     // สร้างเงื่อนไขการค้นหาด้วย machine_SN หรือ machine_Advice
//     if (machineSN) {
//       whereClause = { machine: { machine_SN: machineSN } };
//     } else if (machineAdvice) {
//       whereClause = { machine: { machine_Advice: machineAdvice } };
//     }

//     // ค้นหาด้วยช่วงวันที่ สำหรับทั้ง createdAt และ successAt
//     if (startDate && endDate) {
//       const startDateUTC = moment(startDate).utc().startOf('day').toISOString(); // ตั้งเป็น 00:00:00 ของวันเริ่มต้น
//       const endDateUTC = moment(endDate).utc().endOf('day').toISOString(); // ตั้งเป็น 23:59:59 ของวันสิ้นสุด

//       whereClause.OR = [
//         {
//           createdAt: {
//             gte: new Date(startDateUTC),
//             lte: new Date(endDateUTC),
//           },
//         },
//         {
//           successAt: {
//             gte: new Date(startDateUTC),
//             lte: new Date(endDateUTC),
//           },
//         },
//       ];
//     }

//     // ดึงข้อมูลจาก Close_Task
//     const reportData = await prisma.close_Task.findMany({
//       where: whereClause,
//       include: {
//         user: true,
//         machine: true,
//       },
//     });

//     return NextResponse.json(
//       { success: true, data: reportData },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Error fetching report data:", error);
//     return NextResponse.json(
//       { success: false, message: "Failed to fetch report data" },
//       { status: 500 }
//     );
//   } finally {
//     await prisma.$disconnect();
//   }
// }

// import { PrismaClient } from "@prisma/client";
// import moment from "moment";
// import { NextResponse } from "next/server";

// const prisma = new PrismaClient();

// export async function GET(req) {
//   const { searchParams } = new URL(req.url);
//   const machineSN = searchParams.get("machine_SN");
//   const machineAdvice = searchParams.get("machine_Advice");
//   const startDate = searchParams.get("startDate");
//   const endDate = searchParams.get("endDate");

//   try {
//     let whereClause = {};

//     // สร้างเงื่อนไขการค้นหาด้วย machine_SN หรือ machine_Advice
//     if (machineSN) {
//       whereClause.machine = { machine_SN: machineSN };
//     } else if (machineAdvice) {
//       whereClause.machine = { machine_Advice: machineAdvice };
//     }

//     // ค้นหาด้วยช่วงวันที่ สำหรับทั้ง createdAt และ successAt
//     if (startDate && endDate) {
//       const startDateUTC = moment(startDate).utc().startOf('day').toISOString(); // ตั้งเป็น 00:00:00 ของวันเริ่มต้น
//       const endDateUTC = moment(endDate).utc().endOf('day').toISOString(); // ตั้งเป็น 23:59:59 ของวันสิ้นสุด

//       whereClause.OR = [
//         {
//           createdAt: {
//             gte: new Date(startDateUTC),
//             lte: new Date(endDateUTC),
//           },
//         },
//         {
//           successAt: {
//             gte: new Date(startDateUTC),
//             lte: new Date(endDateUTC),
//           },
//         },
//       ];
//     }

//     // ดึงข้อมูลจาก Task พร้อมรูปก่อนและหลังซ่อมจาก Close_Task
//     const reportData = await prisma.task.findMany({
//       where: whereClause,
//       include: {
//         user: true,
//         machine: {
//           select: {
//             machine_id: true,
//             machine_SN: true,
//             machine_Advice: true,
//           },
//         },
//         closeTask: {
//           select: {
//             machine_img_after: true,
//           },
//         },
//       },
//     });

//     return NextResponse.json(
//       { success: true, data: reportData },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Error fetching report data:", error);
//     return NextResponse.json(
//       { success: false, message: "Failed to fetch report data" },
//       { status: 500 }
//     );
//   } finally {
//     await prisma.$disconnect();
//   }
// }

import { PrismaClient } from "@prisma/client";
import moment from "moment";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const machineSN = searchParams.get("machine_SN");
  const machineAdvice = searchParams.get("machine_Advice");
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");

  try {
    let whereClause = {};

    if (machineSN) {
      whereClause.machine = { machine_SN: machineSN };
    } else if (machineAdvice) {
      whereClause.machine = { machine_Advice: machineAdvice };
    }

    if (startDate && endDate) {
      const startDateUTC = moment(startDate).utc().startOf("day").toISOString();
      const endDateUTC = moment(endDate).utc().endOf("day").toISOString();

      whereClause.OR = [
        {
          createdAt: { gte: new Date(startDateUTC), lte: new Date(endDateUTC) },
        },
        {
          successAt: { gte: new Date(startDateUTC), lte: new Date(endDateUTC) },
        },
      ];
    }

    const reportData = await prisma.task.findMany({
      where: whereClause,
      include: {
        user: { select: { fullName: true } },
        machine: {
          select: { machine_id: true, machine_SN: true, machine_Advice: true },
        },
        closeTask: {
          select: { machine_img_after: true,  },
        },
      },
    });

    const formattedData = reportData.map((task) => ({
      ...task,
      machine_img_before: task.machine_img_before || [],
      closeTask: task.closeTask
        ? {
            ...task.closeTask,
            machine_img_after: task.closeTask.machine_img_after || [],
            machine_img_before: task.machine_img_before || [],
          }
        : null,
    }));

    return NextResponse.json(
      { success: true, data: formattedData },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching report data:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch report data" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
