import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateBlogImage({ title, content, style = "digital art" }) {
  try {
    const prompt = `Create a professional blog header image for an article titled "${title}". 
    Style: ${style}. 
    The image should be visually appealing, modern, and relevant to the blog content. 
    No text in the image.`;

    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt.substring(0, 4000),
      n: 1,
      size: "1792x1024",
      quality: "standard",
    });

    return {
      url: response.data[0].url,
      revisedPrompt: response.data[0].revised_prompt,
    };
  } catch (error) {
    console.error("Image generation error:", error);
    throw new Error(`Image generation failed: ${error.message}`);
  }
}
