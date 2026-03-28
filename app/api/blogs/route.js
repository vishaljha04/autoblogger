import { NextResponse } from "next/server";
import { getSession } from "lib/auth/helpers";
import prisma from "lib/db";
import { slugify, calculateReadingTime, generateExcerpt } from "lib/utils";

export async function GET(request) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status");
    const niche = searchParams.get("niche");

    const where = { authorId: session.user.id };
    if (status) where.status = status;
    if (niche) where.niche = niche;

    const [blogs, total] = await Promise.all([
      prisma.blog.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          publications: { include: { platform: true } },
          _count: { select: { analytics: true } },
        },
      }),
      prisma.blog.count({ where }),
    ]);

    return NextResponse.json({
      blogs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get blogs error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();

    const blog = await prisma.blog.create({
      data: {
        title: data.title,
        slug: slugify(data.title) + "-" + Date.now(),
        content: data.content || "",
        excerpt: data.excerpt || generateExcerpt(data.content || ""),
        metaTitle: data.metaTitle || data.title,
        metaDesc: data.metaDesc || "",
        keywords: data.keywords || [],
        category: data.category || null,
        language: data.language || "en",
        imageUrl: data.imageUrl || null,
        niche: data.niche || null,
        wordCount: data.content ? data.content.split(/\s+/).length : 0,
        readingTime: data.content ? calculateReadingTime(data.content) : 0,
        status: data.status || "DRAFT",
        authorId: session.user.id,
        organizationId: session.user.organizationId || null,
      },
    });

    return NextResponse.json(blog, { status: 201 });
  } catch (error) {
    console.error("Create blog error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
