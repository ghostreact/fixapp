import { auth } from "@/auth";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const session = await auth();
    const userId = session.user.userId;
    const currentDate = new Date();
    const firstDayOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    ); // วันที่ 1 ของเดือน
    const lastDayOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    ); // วันที่สิ้นเดือน

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const machinePadding = await prisma.machine.count({
      where: {
        tasks: {
          none: {},
        },
      },
    });
    const taskSuccess = await prisma.task.count({
      where: {
        task_status: "success",
        userId: userId,
        successAt: {
          gte: firstDayOfMonth,
          lte: lastDayOfMonth,
        },
      },
    });
    const taskFixing = await prisma.task.count({
      where: {
        task_status: "fixing",
        userId: userId,
      },
    });
    const userTotal = await prisma.user.count();

    return NextResponse.json({
      machinePadding,
      taskSuccess,
      userTotal,
      taskFixing,
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard stats" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
