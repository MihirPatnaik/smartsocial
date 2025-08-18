const SMARTSOCIAL_API_KEY = import.meta.env.VITE_OPENAI_KEY_SMARTSOCIAL;
const ENV = import.meta.env.VITE_PROMPT_MODEL_ENV;

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

import { claudeCaption } from './claudeCaption';

export const callCaptionAgent = async (prompt: string): Promise<string> => {
  const systemMessage = 'You are a creative caption writer for social media posts.';
  const userPrompt = `Write a short, catchy caption for this idea: "${prompt}"`;

  let attempt = 0;
  const maxRetries = 3;

  while (attempt < maxRetries) {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${SMARTSOCIAL_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: systemMessage },
            { role: 'user', content: userPrompt },
          ],
          temperature: 0.7,
          max_tokens: 100,
        }),
      });

      if (response.status === 429) {
        console.warn(`⚠️ GPT API 429: Rate limited. Retrying attempt ${attempt + 1}...`);
        await delay(1000 * (attempt + 1));
        attempt++;
        continue;
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ GPT API Error:', response.status, errorText);
        break; // Exit retry loop and fallback to Claude
      }

      const data = await response.json();
      const caption = data.choices?.[0]?.message?.content?.trim();
      return caption || '⚠️ GPT returned empty caption';
    } catch (error) {
      console.error('❌ callCaptionAgent exception:', error);
      break; // Exit retry loop and fallback to Claude
    }
  }

  // 👇 Claude fallback if GPT fails completely and we're in production mode
  if (ENV === 'prod') {
    console.info('⚠️ Falling back to Claude for caption generation...');
    try {
      return await claudeCaption(prompt);
    } catch (e) {
      console.error('❌ Claude caption fallback failed:', e);
      return '⚠️ Both GPT and Claude failed.';
    }
  }

  return '⚠️ GPT failed after multiple attempts.';
};
