// src/smartsocial/agents/promptEnhancerAgent.ts


import OpenAI from "openai";
import { checkFirebaseCache, logToFirebase } from "../utils/firebaseLogger";

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

/**
 * Enhances a prompt using GPT (Claude enhancer can be added later)
 */
export const enhancePrompt = async (
  caption: string,
  style?: string,
  model: string = "gpt-4"
): Promise<string> => {
  try {
    const cached = await checkFirebaseCache(caption, "enhancedPrompt");
    if (cached) return cached;

    const prompt = style ? `${caption} in style of ${style}` : caption;

    const res = await openai.chat.completions.create({
      model,
      messages: [{ role: "user", content: `Enhance this image prompt: ${prompt}` }],
      temperature: 0.7,
    });

    const enhancedPrompt = res.choices[0]?.message?.content?.trim() || caption;

    await logToFirebase({
      prompt: caption,
      caption: enhancedPrompt,
      status: "enhancedPrompt"
    });

    return enhancedPrompt;
  } catch (err) {
    console.error("❌ Prompt enhancement failed:", err);
    return caption;
  }
};
