import { Worker } from "bullmq";
import { getRedisConnection } from "../lib/queue/connection.js";
import { createPublisher } from "../lib/publishers/index.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const publishWorker = new Worker(
  "publishing",
  async (job) => {
    const { blogId, platformId } = job.data;

    console.log(`[PublishWorker] Publishing blog ${blogId} to platform ${platformId}`);

    const blog = await prisma.blog.findUnique({ where: { id: blogId } });
    if (!blog) throw new Error(`Blog not found: ${blogId}`);

    const platform = await prisma.platform.findUnique({ where: { id: platformId } });
    if (!platform) throw new Error(`Platform not found: ${platformId}`);

    const publication = await prisma.publication.create({
      data: {
        blogId,
        platformId,
        status: "PUBLISHING",
      },
    });

    try {
      const publisher = createPublisher(platform);
      const result = await publisher.publish({
        title: blog.title,
        content: blog.content,
        excerpt: blog.excerpt,
        slug: blog.slug,
        imageUrl: blog.imageUrl,
        tags: blog.keywords,
      });

      await prisma.publication.update({
        where: { id: publication.id },
        data: {
          status: "PUBLISHED",
          externalId: result.externalId,
          externalUrl: result.externalUrl,
          publishedAt: new Date(),
        },
      });

      await prisma.blog.update({
        where: { id: blogId },
        data: {
          status: "PUBLISHED",
          publishedAt: blog.publishedAt || new Date(),
        },
      });

      await prisma.jobLog.create({
        data: {
          blogId,
          jobType: "PUBLISHING",
          status: "COMPLETED",
          result: JSON.stringify(result),
          startedAt: new Date(job.processedOn || Date.now()),
          endedAt: new Date(),
        },
      });

      console.log(`[PublishWorker] Published to ${platform.type}: ${result.externalUrl}`);
      return result;
    } catch (error) {
      await prisma.publication.update({
        where: { id: publication.id },
        data: { status: "FAILED", error: error.message },
      });

      await prisma.jobLog.create({
        data: {
          blogId,
          jobType: "PUBLISHING",
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
    concurrency: 5,
    limiter: { max: 20, duration: 60000 },
  }
);

publishWorker.on("completed", (job, result) => {
  console.log(`[PublishWorker] Job ${job.id} completed`);
});

publishWorker.on("failed", (job, err) => {
  console.error(`[PublishWorker] Job ${job?.id} failed:`, err.message);
});

export default publishWorker;
