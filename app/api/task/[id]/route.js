"use server";
import { auth } from "@/auth";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function DELETE(req, { params }) {
  const { id } = params;

  try {
    await prisma.task.delete({
      where: {
        id: parseInt(id),
      },
    });
  } catch (error) {
    console.error("Error deleting task:", error);
    return NextResponse.json({ error: "Error deleting task" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
