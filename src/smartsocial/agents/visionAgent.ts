// D:\datasenceai\src\agents\imageAgent.ts

import { promptEnhancerAgent } from "@/smartsocial/agents/promptEnhancerAgent";
import { claudeImageHelper } from "@/smartsocial/agents/helpers/claudeImageHelper";
import { checkCachedPrompt, savePromptToCache } from "@/smartsocial/utils/promptCache";

const SMARTSOCIAL_API_KEY = import.meta.env.VITE_OPENAI_KEY_SMARTSOCIAL;
const MODEL_ENV = import.meta.env.VITE_PROMPT_MODEL_ENV || "prod";

// ✅ MAIN FUNCTION WITH MODEL TRACKING
export const callImageAgent = async (
  caption: string
): Promise<{ imageUrl: string; modelUsed: string }> => {
  try {
    let enhancedPrompt = await checkCachedPrompt(caption);
    let modelUsed = "cache";

    if (!enhancedPrompt) {
      let fallbackDetected = false;

      // 🧠 Try Claude enhancer
      try {
        enhancedPrompt = await claudeImageHelper(caption);
        fallbackDetected =
          !enhancedPrompt ||
          enhancedPrompt.startsWith("Visual artwork for:") ||
          enhancedPrompt.startsWith("Digital artwork for:");
        modelUsed = "claude-enhancer";
      } catch (e) {
        console.warn("⚠️ Claude enhancement failed, fallback to GPT.");
        fallbackDetected = true;
      }

      // 🤖 GPT fallback if Claude failed or was generic
      if (fallbackDetected) {
        const fallbackModel =
          MODEL_ENV === "prod" ? "gpt-4" : "gpt-3.5-turbo";
        enhancedPrompt = await promptEnhancerAgent(caption, undefined, fallbackModel);
        modelUsed = fallbackModel;
      }

      // 💾 Save enhanced prompt
      if (enhancedPrompt) {
        await savePromptToCache(caption, enhancedPrompt);
      }
    }

    // 🎨 Generate image with DALL·E
    const res = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${SMARTSOCIAL_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "dall-e-3",
        prompt: enhancedPrompt,
        n: 1,
        size: "1024x1024",
      }),
    });

    const data = await res.json();
    const imageUrl = data.data?.[0]?.url;

    // 🖼️ Fallback to Claude if DALL·E fails
    if (!imageUrl) {
      console.warn("⚠️ DALL·E failed, using Claude image fallback.");
      try {
        const claudeImage = await claudeImageHelper(enhancedPrompt || caption);
        return {
          imageUrl: claudeImage,
          modelUsed: "claude-image-fallback",
        };
      } catch (fallbackErr) {
        console.error("🚨 Claude image generation also failed.", fallbackErr);
        return {
          imageUrl: "⚠️ Image generation failed.",
          modelUsed: "none",
        };
      }
    }

    // ✅ Return image + source model
    return {
      imageUrl,
      modelUsed: `dall-e-3 (${modelUsed})`,
    };
  } catch (err) {
    console.error("🎨 ImageAgent Error:", err);
    return {
      imageUrl: "⚠️ Image generation failed.",
      modelUsed: "error",
    };
  }
};

// ➕ Still exposed for legacy usage (unchanged)
export const transformPromptForImage = (caption: string): string => {
  return caption;
};

// 🔧 Also unchanged
export const enhancePrompt = async (
  caption: string,
  style?: string
): Promise<string> => {
  const result = await promptEnhancerAgent(caption, style, "gpt-4");
  return result;
};
