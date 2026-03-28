import { WordPressPublisher } from "./wordpress.js";
import { MediumPublisher } from "./medium.js";
import { LinkedInPublisher } from "./linkedin.js";
import { TwitterPublisher } from "./twitter.js";

export function createPublisher(platform) {
  const config = platform.credentials ? JSON.parse(platform.credentials) : {};

  switch (platform.type) {
    case "WORDPRESS":
      return new WordPressPublisher({
        apiUrl: config.apiUrl,
        username: config.username,
        appPassword: config.appPassword,
      });

    case "MEDIUM":
      return new MediumPublisher({
        accessToken: config.accessToken,
      });

    case "LINKEDIN":
      return new LinkedInPublisher({
        accessToken: config.accessToken,
      });

    case "TWITTER":
      return new TwitterPublisher({
        apiKey: config.apiKey,
        apiSecret: config.apiSecret,
        accessToken: config.accessToken,
        accessTokenSecret: config.accessTokenSecret,
      });

    default:
      throw new Error(`Unsupported platform: ${platform.type}`);
  }
}

export async function publishToMultiplePlatforms(blog, platforms) {
  const results = [];

  for (const platform of platforms) {
    try {
      const publisher = createPublisher(platform);
      const result = await publisher.publish({
        title: blog.title,
        content: blog.content,
        excerpt: blog.excerpt,
        slug: blog.slug,
        imageUrl: blog.imageUrl,
        externalUrl: blog.externalUrl || null,
        tags: blog.keywords || [],
      });

      results.push({
        platformId: platform.id,
        platformType: platform.type,
        status: "PUBLISHED",
        ...result,
      });
    } catch (error) {
      console.error(`Failed to publish to ${platform.type}:`, error);
      results.push({
        platformId: platform.id,
        platformType: platform.type,
        status: "FAILED",
        error: error.message,
      });
    }
  }

  return results;
}
