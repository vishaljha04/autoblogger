import { researchTopic } from "./researchAgent.js";
import { generateBlogContent } from "./writerAgent.js";
import { optimizeSEO } from "./seoAgent.js";
import { generateBlogImage } from "./imageAgent.js";

export async function runBlogPipeline({
  niche,
  language = "en",
  tone = "professional",
  wordCount = 1500,
  generateImage = true,
  context = "",
  onProgress = () => {},
}) {
  const results = { research: null, content: null, seo: null, image: null };

  // Step 1: Research
  onProgress("researching", "Researching trending topics...");
  results.research = await researchTopic({ niche, language, context });

  // Step 2: Generate content
  onProgress("writing", "Generating blog content...");
  results.content = await generateBlogContent({
    topic: results.research.topic,
    title: results.research.title,
    keyPoints: results.research.keyPoints,
    targetAudience: results.research.targetAudience,
    keywords: results.research.keywords,
    angle: results.research.angle,
    language,
    tone,
    wordCount,
  });

  // Step 3: SEO optimization
  onProgress("optimizing", "Optimizing for SEO...");
  results.seo = await optimizeSEO({
    title: results.research.title,
    content: results.content,
    keywords: results.research.keywords,
    language,
  });

  // Step 4: Image generation (optional)
  if (generateImage) {
    onProgress("imaging", "Generating blog image...");
    try {
      results.image = await generateBlogImage({
        title: results.research.title,
        content: results.content.substring(0, 500),
      });
    } catch (err) {
      console.error("Image generation skipped:", err.message);
      results.image = null;
    }
  }

  onProgress("complete", "Blog generation complete!");

  return {
    title: results.seo?.optimizedTitle || results.research.title,
    content: results.seo?.optimizedContent || results.content,
    excerpt: results.seo?.metaDescription || "",
    metaTitle: results.seo?.optimizedTitle || results.research.title,
    metaDesc: results.seo?.metaDescription || "",
    keywords: results.research.keywords,
    slug: results.seo?.slug || "",
    imageUrl: results.image?.url || null,
    niche,
    language,
    research: results.research,
    seoScore: results.seo?.readabilityScore || null,
  };
}
