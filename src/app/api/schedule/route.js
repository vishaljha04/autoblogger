import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/helpers";
import prisma from "@/lib/db";

export async function GET() {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const schedules = await prisma.schedule.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(schedules);
  } catch (error) {
    console.error("Get schedules error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, niche, language, frequency, cronExpression, config } = await request.json();

    if (!name || !niche) {
      return NextResponse.json(
        { error: "Name and niche are required" },
        { status: 400 }
      );
    }

    const nextRunAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const schedule = await prisma.schedule.create({
      data: {
        name,
        niche,
        language: language || "en",
        frequency: frequency || "DAILY",
        cronExpression: cronExpression || "0 9 * * *",
        nextRunAt,
        config: config ? JSON.stringify(config) : null,
        userId: session.user.id,
        organizationId: session.user.organizationId || null,
      },
    });

    return NextResponse.json(schedule, { status: 201 });
  } catch (error) {
    console.error("Create schedule error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID required" }, { status: 400 });
    }

    await prisma.schedule.deleteMany({
      where: { id, userId: session.user.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete schedule error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
