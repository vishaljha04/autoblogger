import { Worker } from "bullmq";
import { getRedisConnection } from "../lib/queue/connection.js";
import { generateBlogImage } from "../lib/ai/imageAgent.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const imageWorker = new Worker(
  "image-generation",
  async (job) => {
    const { blogId, title, content, style } = job.data;

    console.log(`[ImageWorker] Generating image for blog: ${blogId}`);

    const result = await generateBlogImage({ title, content, style });

    if (blogId) {
      await prisma.blog.update({
        where: { id: blogId },
        data: { imageUrl: result.url },
      });
    }

    await prisma.jobLog.create({
      data: {
        blogId,
        jobType: "IMAGE_GENERATION",
        status: "COMPLETED",
        result: JSON.stringify(result),
        startedAt: new Date(job.processedOn || Date.now()),
        endedAt: new Date(),
      },
    });

    console.log(`[ImageWorker] Image generated for blog: ${blogId}`);
    return result;
  },
  {
    connection: getRedisConnection(),
    concurrency: 3,
    limiter: { max: 5, duration: 60000 },
  }
);

imageWorker.on("completed", (job, result) => {
  console.log(`[ImageWorker] Job ${job.id} completed`);
});

imageWorker.on("failed", (job, err) => {
  console.error(`[ImageWorker] Job ${job?.id} failed:`, err.message);
});

export default imageWorker;
