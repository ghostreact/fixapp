"use server";
import { auth } from "@/auth";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const machines = await prisma.machine.findMany({
      include: {
        meet: true, // Include related meeting if needed
        tasks: true, // Include related tasks
      },
    });
    return NextResponse.json(machines);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(req) {
  try {
    // Fetch the latest machine entry to determine the next machine_id
    const lastMachine = await prisma.machine.findFirst({
      orderBy: {
        machine_id: "desc",
      },
    });

    // Generate the new machine_id
    const newIdNumber = lastMachine
      ? parseInt(lastMachine.machine_id.replace("M", "")) + 1
      : 1;
    const newMachineId = `M${newIdNumber.toString().padStart(5, "0")}`;

    const data = await req.json();
    const machine = await prisma.machine.create({
      data: {
        name: data.name,
        machine_type: data.machine_type,
        machine_img: data.machine_img,
        machine_id: newMachineId,
        machine_des: data.machine_des,
        machine_model: data.machine_model,
        machine_SN: data.machine_SN,
        machine_Advice: data.machine_Advice,
        machine_meet: data.machine_meet,
        meetId: parseInt(data.meetId),
      },
    });
    return NextResponse.json(machine);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
