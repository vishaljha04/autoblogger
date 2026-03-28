import { NextResponse } from "next/server";
import { getSession } from "lib/auth/helpers";
import prisma from "lib/db";

export async function GET(request) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || "30d";

    const daysMap = { "7d": 7, "30d": 30, "90d": 90 };
    const days = daysMap[period] || 30;
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const blogs = await prisma.blog.findMany({
      where: { authorId: session.user.id },
      select: { id: true },
    });
    const blogIds = blogs.map((b) => b.id);

    const analytics = await prisma.blogAnalytics.findMany({
      where: {
        blogId: { in: blogIds },
        date: { gte: since },
      },
      orderBy: { date: "asc" },
    });

    const totals = analytics.reduce(
      (acc, a) => ({
        views: acc.views + a.views,
        clicks: acc.clicks + a.clicks,
        shares: acc.shares + a.shares,
        uniqueVisitors: acc.uniqueVisitors + a.uniqueVisitors,
      }),
      { views: 0, clicks: 0, shares: 0, uniqueVisitors: 0 }
    );

    const avgEngagement =
      analytics.length > 0
        ? analytics.reduce((sum, a) => sum + a.engagementRate, 0) / analytics.length
        : 0;

    const blogStats = await prisma.blog.groupBy({
      by: ["status"],
      where: { authorId: session.user.id },
      _count: true,
    });

    return NextResponse.json({
      totals: { ...totals, avgEngagement },
      timeline: analytics,
      blogStats,
      totalBlogs: blogs.length,
    });
  } catch (error) {
    console.error("Analytics error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
