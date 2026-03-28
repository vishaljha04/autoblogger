import { NextResponse } from "next/server";
import { getSession } from "lib/auth/helpers";
import { runBlogPipeline } from "lib/ai/pipeline";
import prisma from "lib/db";
import { slugify, calculateReadingTime, generateExcerpt } from "lib/utils";

export async function POST(request) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { niche, language, tone, wordCount, generateImage } = await request.json();

    if (!niche) {
      return NextResponse.json({ error: "Niche is required" }, { status: 400 });
    }

    const result = await runBlogPipeline({
      niche,
      language: language || "en",
      tone: tone || "professional",
      wordCount: wordCount || 1500,
      generateImage: generateImage !== false,
    });

    const blog = await prisma.blog.create({
      data: {
        title: result.title,
        slug: slugify(result.title) + "-" + Date.now(),
        content: result.content,
        excerpt: result.excerpt || generateExcerpt(result.content),
        metaTitle: result.metaTitle,
        metaDesc: result.metaDesc,
        keywords: result.keywords,
        category: niche,
        language: language || "en",
        imageUrl: result.imageUrl,
        niche,
        wordCount: result.content.split(/\s+/).length,
        readingTime: calculateReadingTime(result.content),
        status: "REVIEW",
        authorId: session.user.id,
        organizationId: session.user.organizationId || null,
      },
    });

    return NextResponse.json({ blog, seoScore: result.seoScore }, { status: 201 });
  } catch (error) {
    console.error("AI generate error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
