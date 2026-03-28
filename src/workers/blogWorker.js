import { Worker } from "bullmq";
import { getRedisConnection } from "../lib/queue/connection.js";
import { runBlogPipeline } from "../lib/ai/pipeline.js";
import { PrismaClient } from "@prisma/client";
import { slugify, calculateReadingTime, generateExcerpt } from "../lib/utils/index.js";

const prisma = new PrismaClient();

const blogWorker = new Worker(
  "blog-generation",
  async (job) => {
    const { userId, niche, language, tone, wordCount, generateImage, scheduleId } = job.data;

    console.log(`[BlogWorker] Starting blog generation for user ${userId}, niche: ${niche}`);

    await job.updateProgress(10);

    try {
      const result = await runBlogPipeline({
        niche,
        language,
        tone,
        wordCount,
        generateImage,
        onProgress: (stage, message) => {
          console.log(`[BlogWorker] ${stage}: ${message}`);
          const progressMap = {
            researching: 20,
            writing: 40,
            optimizing: 60,
            imaging: 80,
            complete: 100,
          };
          job.updateProgress(progressMap[stage] || 50);
        },
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
          language,
          imageUrl: result.imageUrl,
          niche,
          wordCount: result.content.split(/\s+/).length,
          readingTime: calculateReadingTime(result.content),
          status: "REVIEW",
          authorId: userId,
        },
      });

      await prisma.jobLog.create({
        data: {
          blogId: blog.id,
          jobType: "BLOG_GENERATION",
          status: "COMPLETED",
          result: JSON.stringify({ blogId: blog.id, title: blog.title }),
          startedAt: new Date(job.processedOn || Date.now()),
          endedAt: new Date(),
        },
      });

      console.log(`[BlogWorker] Blog created: ${blog.id} - ${blog.title}`);
      return { blogId: blog.id, title: blog.title };
    } catch (error) {
      await prisma.jobLog.create({
        data: {
          jobType: "BLOG_GENERATION",
          status: "FAILED",
          error: error.message,
          startedAt: new Date(job.processedOn || Date.now()),
          endedAt: new Date(),
        },
      });
      throw error;
    }
  },
  {
    connection: getRedisConnection(),
    concurrency: 2,
    limiter: { max: 10, duration: 60000 },
  }
);

blogWorker.on("completed", (job, result) => {
  console.log(`[BlogWorker] Job ${job.id} completed:`, result);
});

blogWorker.on("failed", (job, err) => {
  console.error(`[BlogWorker] Job ${job?.id} failed:`, err.message);
});

export default blogWorker;
