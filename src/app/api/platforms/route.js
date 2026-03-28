import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/helpers";
import prisma from "@/lib/db";

export async function GET() {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const platforms = await prisma.platform.findMany({
      where: { organizationId: session.user.organizationId || "" },
      include: { _count: { select: { publications: true } } },
    });

    return NextResponse.json(platforms);
  } catch (error) {
    console.error("Get platforms error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, type, credentials, config } = await request.json();

    if (!session.user.organizationId) {
      const org = await prisma.organization.create({
        data: {
          name: session.user.name + "'s Org",
          slug: session.user.id,
        },
      });
      await prisma.user.update({
        where: { id: session.user.id },
        data: { organizationId: org.id },
      });
      session.user.organizationId = org.id;
    }

    const platform = await prisma.platform.create({
      data: {
        name: name || type,
        type,
        credentials: credentials ? JSON.stringify(credentials) : null,
        config: config ? JSON.stringify(config) : null,
        organizationId: session.user.organizationId,
      },
    });

    return NextResponse.json(platform, { status: 201 });
  } catch (error) {
    console.error("Create platform error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
