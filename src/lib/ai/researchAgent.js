import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

const model = new ChatOpenAI({
  modelName: "gpt-4",
  temperature: 0.7,
  openAIApiKey: process.env.OPENAI_API_KEY,
});

const researchPrompt = PromptTemplate.fromTemplate(`
You are a research agent specializing in finding trending and relevant blog topics.

Niche: {niche}
Language: {language}
Additional Context: {context}

Research and provide:
1. A compelling blog topic that is currently trending or highly relevant
2. Key points and subtopics to cover
3. Target audience for this topic
4. Suggested keywords (5-10) for SEO
5. Unique angle or perspective to differentiate from existing content

Format your response as JSON:
{{
  "topic": "...",
  "title": "...",
  "keyPoints": ["..."],
  "targetAudience": "...",
  "keywords": ["..."],
  "angle": "...",
  "sources": ["..."]
}}
`);

export async function researchTopic({ niche, language = "en", context = "" }) {
  try {
    const chain = researchPrompt.pipe(model).pipe(new StringOutputParser());
    const result = await chain.invoke({ niche, language, context });
    return JSON.parse(result);
  } catch (error) {
    console.error("Research agent error:", error);
    throw new Error(`Research failed: ${error.message}`);
  }
}
