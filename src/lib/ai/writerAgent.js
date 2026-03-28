import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

function getModel() {
  return new ChatOpenAI({
    modelName: "gpt-4",
    temperature: 0.8,
    openAIApiKey: process.env.OPENAI_API_KEY,
  });
}

const writerPrompt = PromptTemplate.fromTemplate(`
You are an expert blog writer. Write a high-quality, engaging, and original blog post.

Topic: {topic}
Title: {title}
Key Points to Cover: {keyPoints}
Target Audience: {targetAudience}
Keywords to Include: {keywords}
Unique Angle: {angle}
Language: {language}
Tone: {tone}
Word Count Target: {wordCount}

Requirements:
- Write in markdown format
- Include a compelling introduction with a hook
- Use clear headings and subheadings (H2, H3)
- Include practical examples and actionable advice
- Use bullet points and numbered lists where appropriate
- Write a strong conclusion with a call to action
- Maintain a {tone} tone throughout
- Naturally incorporate the provided keywords
- Ensure the content is original and not duplicated
- Target approximately {wordCount} words

Write the complete blog post in markdown:
`);

export async function generateBlogContent({
  topic,
  title,
  keyPoints = [],
  targetAudience = "general",
  keywords = [],
  angle = "",
  language = "en",
  tone = "professional",
  wordCount = 1500,
}) {
  try {
    const chain = writerPrompt.pipe(getModel()).pipe(new StringOutputParser());
    const content = await chain.invoke({
      topic,
      title,
      keyPoints: keyPoints.join(", "),
      targetAudience,
      keywords: keywords.join(", "),
      angle,
      language,
      tone,
      wordCount: String(wordCount),
    });
    return content;
  } catch (error) {
    console.error("Writer agent error:", error);
    throw new Error(`Blog generation failed: ${error.message}`);
  }
}
