import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

const model = new ChatOpenAI({
  modelName: "gpt-4",
  temperature: 0.3,
  openAIApiKey: process.env.OPENAI_API_KEY,
});

const seoPrompt = PromptTemplate.fromTemplate(`
You are an SEO optimization expert. Analyze and optimize the following blog content for search engines.

Blog Title: {title}
Blog Content: {content}
Target Keywords: {keywords}
Language: {language}

Provide SEO optimizations in JSON format:
{{
  "optimizedTitle": "SEO-optimized title (max 60 chars)",
  "metaDescription": "Compelling meta description (max 160 chars)",
  "slug": "url-friendly-slug",
  "headings": ["Suggested H2/H3 improvements"],
  "keywordDensity": {{
    "primary": "percentage",
    "secondary": ["keyword: percentage"]
  }},
  "readabilityScore": "1-100",
  "suggestions": ["Specific improvement suggestions"],
  "optimizedContent": "The full blog content with SEO improvements applied"
}}
`);

export async function optimizeSEO({ title, content, keywords = [], language = "en" }) {
  try {
    const chain = seoPrompt.pipe(model).pipe(new StringOutputParser());
    const result = await chain.invoke({
      title,
      content: content.substring(0, 8000),
      keywords: keywords.join(", "),
      language,
    });
    return JSON.parse(result);
  } catch (error) {
    console.error("SEO agent error:", error);
    throw new Error(`SEO optimization failed: ${error.message}`);
  }
}
