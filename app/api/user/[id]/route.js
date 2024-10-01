import { auth } from "@/auth";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function PUT(req, { params }) {
  const session = await auth();
  const { id } = params;
  const { name, username, password, fullName, lastName, role, tel } =
    await req.json();

  // ตรวจสอบว่ามี session หรือไม่
  if (!session || !session.user) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  // ตรวจสอบสิทธิ์ของผู้ใช้
  if (session.user.role !== "ADMIN") {
    try {
      const updateByUser = await prisma.user.update({
        where: { id: parseInt(id) },
        data: {
          name: name,
          fullName: fullName,
          lastName: lastName,
          tel: parseInt(tel),
        },
      });
      console.log(updateByUser);
      return NextResponse.json(updateByUser, { status: 200 });
    } catch (error) {
      console.error("Error Update by User:", error);
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 500 }
      );
    } finally {
      await prisma.$disconnect();
    }
  } else {
    try {
      const updateByAdmin = await prisma.user.update({
        where: { id: parseInt(id) },
        data: {
          name: name,
          username: username,
          password: password,
          fullName: fullName ?? null,
          lastName: lastName ?? null,
          role: role,
          tel: parseInt(tel),
        },
      });
      console.log(updateByAdmin);
      return NextResponse.json(updateByAdmin, { status: 200 });
    } catch (error) {
      console.error("Error Update by Admin:", error);
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 500 }
      );
    } finally {
      await prisma.$disconnect();
    }
  }
}
