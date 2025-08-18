import { OpenAIStream, StreamingTextResponse } from 'ai'
import { createTool } from 'ai'
import { z } from 'zod'
import { ClaudeHaikuClient } from '@/lib/clients/anthropic'

export const claudeDiagramAgent = createTool({
  name: 'claudeDiagramAgent',
  description:
    'Generates clean and simple SVG diagrams from text descriptions. Intended for technical use cases like software architecture, RAG pipelines, or LLM workflows where accuracy is critical and images should be diagrammatic, not artistic. Does not use DALL·E or Stability AI.',
  parameters: z.object({
    prompt: z.string().describe('A clear, structured description of the technical diagram to generate in SVG format.'),
  }),
  generate: async function* ({ prompt }) {
    const fullPrompt = `
You are a diagram-generating AI. Your task is to output valid and clean SVG markup for technical diagrams.

Please follow these rules:
- Your output must be only the SVG code and nothing else.
- The SVG should be minimal, clean, and well-structured.
- The diagram should visually represent the described system, with labeled nodes, arrows for relationships, and grouping if needed.
- Do not add any non-SVG comments or explanations.

Diagram description:
${prompt}
`

    const response = await ClaudeHaikuClient.chat.completions.create({
      model: 'claude-3-haiku-20240307',
      stream: true,
      temperature: 0.2,
      max_tokens: 4096,
      messages: [
        {
          role: 'user',
          content: fullPrompt,
        },
      ],
    })

    for await (const chunk of response) {
      const content = chunk.choices[0]?.delta?.content
      if (content) yield content
    }
  },
})
