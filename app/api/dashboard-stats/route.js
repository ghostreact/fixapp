import { auth } from "@/auth";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
 
    try {
      const session = await auth();
      const userId = session.user.userId
     
      if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      
      const machinePadding = await prisma.task.count({
        where: { task_status: "pending" },
      });
      const taskSuccess = await prisma.task.count({
        where: { task_status: "success", userId: userId },
      });
      const taskFixing = await prisma.task.count({
        where: { task_status: "fixing", userId: userId },
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
