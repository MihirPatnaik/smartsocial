import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true, // ⚠️ Already discussed in imageAgents.ts
});

/**
 * Generate a rich, engaging caption + hashtags for social media.
 */
export async function generateCaptionAndHashtags(
  prompt: string
): Promise<{ caption: string; hashtags: string }> {
  try {
    const systemPrompt = `
You are an expert social media copywriter.
Your goal is to create ONE engaging caption (with emojis) AND a set of relevant hashtags.
Tone: Fun, engaging, and shareable — perfect for Instagram, LinkedIn, or Facebook.

Rules:
- Do NOT repeat the exact wording from the prompt — creatively enhance it.
- Use emojis naturally in the caption (2–5 max).
- Make hashtags relevant, trending, and varied (8–12 max).
- Return ONLY in this exact JSON format:
{
  "caption": "...",
  "hashtags": "...(space separated hashtags)..."
}
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Post idea: ${prompt}` },
      ],
      temperature: 0.8,
      max_tokens: 300,
    });

    const content = response.choices[0]?.message?.content?.trim() || "";
    let parsed = { caption: "", hashtags: "" };

    try {
      parsed = JSON.parse(content);
    } catch {
      console.warn("⚠️ Could not parse AI response as JSON. Raw output:", content);

      // Fallback: Try extracting caption and hashtags from text
      const captionMatch = content.match(/caption["']?\s*[:\-]\s*["']?([^"'\n]+)/i);
      const hashtagsMatch = content.match(/#\w+(?:\s+#\w+)*/g);

      parsed.caption = captionMatch
        ? captionMatch[1]
        : content.split("\n")[0] || "✨ Your amazing post goes here!";
      parsed.hashtags = hashtagsMatch
        ? hashtagsMatch.join(" ")
        : "#inspiration #ai";
    }

    return parsed;
  } catch (error) {
    console.error("❌ Caption generation failed:", error);
    return { caption: "✨ Your amazing post goes here!", hashtags: "#inspiration #ai" };
  }
}
// Export for easier testing