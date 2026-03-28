import { Queue } from "bullmq";
import { getRedisConnection } from "./connection.js";

const defaultOpts = {
  connection: null,
  defaultJobOptions: {
    removeOnComplete: { count: 100 },
    removeOnFail: { count: 50 },
    attempts: 3,
    backoff: { type: "exponential", delay: 2000 },
  },
};

function createQueue(name) {
  return new Queue(name, {
    ...defaultOpts,
    connection: getRedisConnection(),
  });
}

export const blogGenerationQueue = createQueue("blog-generation");
export const imageGenerationQueue = createQueue("image-generation");
export const publishingQueue = createQueue("publishing");
export const researchQueue = createQueue("research");
export const seoQueue = createQueue("seo-optimization");

export async function addBlogGenerationJob(data) {
  return blogGenerationQueue.add("generate-blog", data, {
    priority: data.priority || 1,
  });
}

export async function addImageGenerationJob(data) {
  return imageGenerationQueue.add("generate-image", data);
}

export async function addPublishingJob(data) {
  return publishingQueue.add("publish-blog", data);
}

export async function addResearchJob(data) {
  return researchQueue.add("research-topic", data);
}

export async function addSeoJob(data) {
  return seoQueue.add("optimize-seo", data);
}
