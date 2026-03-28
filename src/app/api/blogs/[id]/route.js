import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/helpers";
import prisma from "@/lib/db";
import { slugify, calculateReadingTime, generateExcerpt } from "@/lib/utils";

export async function GET(request, { params }) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const blog = await prisma.blog.findFirst({
      where: { id, authorId: session.user.id },
      include: {
        publications: { include: { platform: true } },
        analytics: { orderBy: { date: "desc" }, take: 30 },
        jobLogs: { orderBy: { createdAt: "desc" }, take: 10 },
      },
    });

    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json(blog);
  } catch (error) {
    console.error("Get blog error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const data = await request.json();

    const existing = await prisma.blog.findFirst({
      where: { id, authorId: session.user.id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    const blog = await prisma.blog.update({
      where: { id },
      data: {
        title: data.title ?? existing.title,
        slug: data.title ? slugify(data.title) + "-" + Date.now() : existing.slug,
        content: data.content ?? existing.content,
        excerpt: data.excerpt ?? (data.content ? generateExcerpt(data.content) : existing.excerpt),
        metaTitle: data.metaTitle ?? existing.metaTitle,
        metaDesc: data.metaDesc ?? existing.metaDesc,
        keywords: data.keywords ?? existing.keywords,
        category: data.category ?? existing.category,
        language: data.language ?? existing.language,
        imageUrl: data.imageUrl ?? existing.imageUrl,
        niche: data.niche ?? existing.niche,
        wordCount: data.content ? data.content.split(/\s+/).length : existing.wordCount,
        readingTime: data.content ? calculateReadingTime(data.content) : existing.readingTime,
        status: data.status ?? existing.status,
      },
    });

    return NextResponse.json(blog);
  } catch (error) {
    console.error("Update blog error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const existing = await prisma.blog.findFirst({
      where: { id, authorId: session.user.id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    await prisma.publication.deleteMany({ where: { blogId: id } });
    await prisma.blogAnalytics.deleteMany({ where: { blogId: id } });
    await prisma.jobLog.deleteMany({ where: { blogId: id } });
    await prisma.blog.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete blog error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
