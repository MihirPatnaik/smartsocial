// src/server/claudeProxy.ts
import express from 'express';
import fetch from 'node-fetch';

const router = express.Router();

router.post('/claude-enhance', async (req, res) => {
  const { prompt } = req.body;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': process.env.VITE_CLAUDE_API_KEY || 'REDACTED_KEY',
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307',
        max_tokens: 200,
        messages: [
          {
            role: 'user',
            content: `Enhance this image prompt: ${prompt}`,
          },
        ],
      }),
    });

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error('Claude API error:', err);
    res.status(500).json({ error: 'Claude proxy error' });
  }
});

export default router;
