const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Create demo organization
  const org = await prisma.organization.upsert({
    where: { slug: "demo-org" },
    update: {},
    create: {
      name: "Demo Organization",
      slug: "demo-org",
      plan: "PRO",
    },
  });

  // Create demo user
  const passwordHash = await bcrypt.hash("password123", 12);
  const user = await prisma.user.upsert({
    where: { email: "demo@autoblogger.ai" },
    update: {},
    create: {
      name: "Demo User",
      email: "demo@autoblogger.ai",
      passwordHash,
      role: "ADMIN",
      organizationId: org.id,
    },
  });

  // Create sample blogs
  const blogs = [
    {
      title: "The Future of AI in Content Marketing",
      slug: "future-of-ai-content-marketing-" + Date.now(),
      content: "# The Future of AI in Content Marketing\n\nArtificial intelligence is transforming how businesses create and distribute content. From automated blog generation to personalized content recommendations, AI tools are becoming indispensable for modern marketers.\n\n## Key Trends\n\n1. **Automated Content Creation**: AI can now generate high-quality blog posts, social media captions, and email newsletters.\n2. **Personalization at Scale**: Machine learning algorithms deliver personalized content to millions of users simultaneously.\n3. **SEO Optimization**: AI tools analyze search patterns and optimize content for better rankings.\n4. **Content Analytics**: Advanced analytics powered by AI provide deeper insights into content performance.\n\n## What This Means for Marketers\n\nMarketers who embrace AI tools will have a significant competitive advantage. The key is to use AI as a complement to human creativity, not a replacement.\n\n## Conclusion\n\nThe future of content marketing is AI-assisted, personalized, and data-driven. Start integrating AI tools into your workflow today.",
      excerpt: "Explore how AI is revolutionizing content marketing with automated creation, personalization, and analytics.",
      metaTitle: "The Future of AI in Content Marketing | 2025 Guide",
      metaDesc: "Discover how AI is transforming content marketing with automated blog generation, SEO optimization, and personalized content delivery.",
      keywords: ["AI content marketing", "automated blogging", "content AI", "marketing automation"],
      category: "Technology",
      niche: "Technology",
      wordCount: 180,
      readingTime: 1,
      status: "PUBLISHED",
      publishedAt: new Date(),
    },
    {
      title: "10 Ways to Boost Your Blog SEO in 2025",
      slug: "boost-blog-seo-2025-" + Date.now(),
      content: "# 10 Ways to Boost Your Blog SEO in 2025\n\nSearch engine optimization remains crucial for blog success. Here are the top strategies for 2025.\n\n## 1. Focus on Search Intent\nUnderstand what your audience is really looking for.\n\n## 2. Optimize for Core Web Vitals\nPage speed and user experience matter more than ever.\n\n## 3. Create Comprehensive Content\nLong-form, in-depth articles outperform thin content.\n\n## 4. Build Quality Backlinks\nFocus on earning links from authoritative sources.\n\n## 5. Use AI for Keyword Research\nLeverage AI tools to find untapped keyword opportunities.\n\n## 6. Optimize for Voice Search\nNatural language queries are on the rise.\n\n## 7. Implement Structured Data\nHelp search engines understand your content.\n\n## 8. Mobile-First Optimization\nEnsure your blog looks great on all devices.\n\n## 9. Regular Content Updates\nKeep existing content fresh and relevant.\n\n## 10. Leverage Video Content\nEmbed videos to increase engagement and dwell time.",
      excerpt: "Master SEO in 2025 with these 10 proven strategies for boosting your blog traffic.",
      metaTitle: "10 Blog SEO Strategies for 2025 That Actually Work",
      metaDesc: "Boost your blog traffic with these 10 proven SEO strategies for 2025, from AI keyword research to Core Web Vitals optimization.",
      keywords: ["blog SEO", "SEO 2025", "content optimization", "keyword research"],
      category: "Marketing",
      niche: "Marketing",
      wordCount: 200,
      readingTime: 1,
      status: "REVIEW",
    },
    {
      title: "Building Healthy Habits: A Science-Based Approach",
      slug: "building-healthy-habits-" + Date.now(),
      content: "# Building Healthy Habits: A Science-Based Approach\n\nCreating lasting habits requires understanding the science behind behavior change.\n\n## The Habit Loop\n\nEvery habit consists of three components: cue, routine, and reward.\n\n## Start Small\n\nBegin with tiny habits that are easy to maintain.\n\n## Consistency Over Perfection\n\nShowing up every day matters more than being perfect.\n\n## Track Your Progress\n\nUse habit tracking to maintain motivation and accountability.",
      excerpt: "Learn the science behind building lasting healthy habits with practical, evidence-based strategies.",
      keywords: ["healthy habits", "behavior change", "wellness", "self-improvement"],
      category: "Health & Wellness",
      niche: "Health & Wellness",
      wordCount: 100,
      readingTime: 1,
      status: "DRAFT",
    },
  ];

  for (const blogData of blogs) {
    await prisma.blog.create({
      data: {
        ...blogData,
        authorId: user.id,
        organizationId: org.id,
      },
    });
  }

  // Create sample analytics
  const publishedBlogs = await prisma.blog.findMany({
    where: { authorId: user.id, status: "PUBLISHED" },
  });

  for (const blog of publishedBlogs) {
    for (let i = 0; i < 30; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      await prisma.blogAnalytics.create({
        data: {
          blogId: blog.id,
          views: Math.floor(Math.random() * 500) + 50,
          uniqueVisitors: Math.floor(Math.random() * 300) + 30,
          clicks: Math.floor(Math.random() * 100) + 10,
          shares: Math.floor(Math.random() * 30) + 2,
          engagementRate: Math.random() * 10 + 2,
          avgReadTime: Math.random() * 5 + 1,
          date,
        },
      });
    }
  }

  // Create sample schedule
  await prisma.schedule.create({
    data: {
      name: "Daily Tech Blog",
      niche: "Technology",
      language: "en",
      frequency: "DAILY",
      cronExpression: "0 9 * * *",
      isActive: true,
      nextRunAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      userId: user.id,
      organizationId: org.id,
    },
  });

  console.log("Seed completed!");
  console.log("Demo login: demo@autoblogger.ai / password123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
