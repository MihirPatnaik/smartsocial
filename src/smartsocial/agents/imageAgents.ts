// src/smartsocial/agents/imageAgents.ts
import OpenAI from "openai";
import axios from "axios";
import { enhancePrompt as promptEnhancerAgent } from "./promptEnhancerAgent";
import { claudeImageHelper } from "./claudeImageHelper";
import { checkFirebaseCache, logToFirebase } from "../utils/firebaseLogger";

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

// Stability AI API key
const STABILITY_API_KEY = import.meta.env.VITE_STABILITY_API_KEY;
const MODEL_ENV = import.meta.env.VITE_PROMPT_MODEL_ENV || "prod";
const USE_FIREBASE_CACHE = import.meta.env.VITE_USE_FIREBASE_CACHE === "true";

/**
 * IMAGE GENERATION
 * - multi-model prompt enhancement & caching
 * - supports optional size param ("256x256" | "512x512" | "1024x1024")
 */
export const callImageAgent = async (
  caption: string,
  size: "256x256" | "512x512" | "1024x1024" = "1024x1024"
): Promise<{ imageUrl: string; modelUsed: string }> => {
  try {
    let enhancedPrompt = caption;
    let modelUsed = "cache";

    // 1) Firebase cached image
    if (USE_FIREBASE_CACHE) {
      const cachedImage = await checkFirebaseCache(caption, "generatedImage");
      if (cachedImage) {
        return { imageUrl: cachedImage, modelUsed: "firebase-cache" };
      }
    }

    // 2) Enhance prompt (Claude -> GPT fallback) with caching
    let cachedEnhancedPrompt: string | null = null;
    if (USE_FIREBASE_CACHE) {
      cachedEnhancedPrompt = await checkFirebaseCache(caption, "enhancedPrompt");
    }

    if (cachedEnhancedPrompt) {
      enhancedPrompt = cachedEnhancedPrompt;
    } else {
      let fallbackDetected = false;

      try {
        enhancedPrompt = await claudeImageHelper(caption);
        fallbackDetected =
          !enhancedPrompt ||
          enhancedPrompt.startsWith("Visual artwork for:") ||
          enhancedPrompt.startsWith("Digital artwork for:");
        modelUsed = "claude-enhancer";
      } catch {
        fallbackDetected = true;
      }

      if (fallbackDetected) {
        const fallbackModel = MODEL_ENV === "prod" ? "gpt-4" : "gpt-3.5-turbo";
        enhancedPrompt = await promptEnhancerAgent(caption);
        modelUsed = fallbackModel;
      }

      if (USE_FIREBASE_CACHE) {
        await logToFirebase({
          prompt: caption,
          caption: enhancedPrompt,
          status: "enhancedPrompt",
        });
      }
    }

    // 3) DALL·E (OpenAI)
    try {
      const res = await openai.images.generate({
        model: "dall-e-3",
        prompt: enhancedPrompt,
        size, // ✅ now dynamic (defaults to "1024x1024")
      });
      const imageUrl = res.data[0]?.url || null;
      if (imageUrl) {
        if (USE_FIREBASE_CACHE) {
          await logToFirebase({
            prompt: enhancedPrompt,
            caption: imageUrl,
            status: "generatedImage",
          });
        }
        return { imageUrl, modelUsed: `dall-e-3 (${modelUsed})` };
      }
    } catch (err) {
      console.warn("OpenAI DALL·E failed, trying Claude image fallback:", err);
    }

    // 4) Claude fallback
    try {
      const claudeImage = await claudeImageHelper(enhancedPrompt || caption);
      if (claudeImage) {
        if (USE_FIREBASE_CACHE) {
          await logToFirebase({
            prompt: enhancedPrompt,
            caption: claudeImage,
            status: "generatedImage",
          });
        }
        return { imageUrl: claudeImage, modelUsed: "claude-image-fallback" };
      }
    } catch (err) {
      console.warn("Claude image generation failed:", err);
    }

    // 5) Stability AI fallback
    try {
      const response = await axios.post(
        "https://api.stability.ai/v2beta/stable-image/generate/core",
        { prompt: enhancedPrompt },
        {
          headers: {
            Authorization: `Bearer ${STABILITY_API_KEY}`,
            Accept: "application/json",
          },
        }
      );
      const imageUrl = response.data?.image || null;
      if (imageUrl) {
        if (USE_FIREBASE_CACHE) {
          await logToFirebase({
            prompt: enhancedPrompt,
            caption: imageUrl,
            status: "generatedImage",
          });
        }
        return { imageUrl, modelUsed: "stability-ai" };
      }
    } catch (err) {
      console.error("Stability AI failed:", err);
    }

    return { imageUrl: "⚠️ Image generation failed.", modelUsed: "none" };
  } catch (err) {
    console.error("ImageAgent Error:", err);
    return { imageUrl: "⚠️ Image generation failed.", modelUsed: "error" };
  }
};

/**
 * CAPTION + HASHTAGS
 * - returns { caption, hashtags }
 * - auto-splits hashtags so UI doesn’t need to parse words starting with #
 */
export const callCaptionAgent = async (
  context: string
): Promise<{ caption: string; hashtags: string }> => {
  // choose model
  const model = MODEL_ENV === "prod" ? "gpt-4o-mini" : "gpt-3.5-turbo";

  // Ask for both caption & hashtags explicitly
  const prompt = `
You are a social media copywriter. Based on the idea below, write:
1) A short, engaging caption (1–2 sentences, plain text).
2) A set of 6–12 relevant hashtags (each begins with '#').

Return them in this exact JSON format:
{"caption":"...","hashtags":"#one #two #three"}

Idea: ${context}`.trim();

  try {
    const res = await openai.chat.completions.create({
      model,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const raw = res.choices[0]?.message?.content?.trim() || "";
    // Best-effort JSON parse (model returns the specified shape)
    const jsonStart = raw.indexOf("{");
    const jsonEnd = raw.lastIndexOf("}");
    const parsed =
      jsonStart >= 0 && jsonEnd > jsonStart
        ? JSON.parse(raw.slice(jsonStart, jsonEnd + 1))
        : { caption: raw, hashtags: "" };

    // Normalize hashtags: split by spaces, keep those starting with '#'
    const normalized =
      String(parsed.hashtags || "")
        .split(/\s+/)
        .filter((w: string) => w.startsWith("#"))
        .join(" ") || "#AI #SmartSocial";

    return {
      caption: String(parsed.caption || "").trim(),
      hashtags: normalized,
    };
  } catch (e) {
    console.error("callCaptionAgent failed:", e);
    // Fallback
    return {
      caption: context,
      hashtags: "#AI #SmartSocial",
    };
  }
};
