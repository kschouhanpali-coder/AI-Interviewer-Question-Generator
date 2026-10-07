/**
 * Groq Provider
 * Uses Groq's OpenAI-compatible REST API.
 * Docs: https://console.groq.com/docs/openai
 */

const GROQ_BASE_URL = 'https://api.groq.com/openai/v1';
const DEFAULT_MODEL  = 'llama-3.3-70b-versatile';

async function generateWithGroq(prompt, options = {}) {
  const apiKey = options.apiKey || process.env.GROQ_API_KEY;

  if (!apiKey) {
    throw new Error('GROQ_API_KEY is required. Set it in your .env file or pass it via options.');
  }

  const model = options.model || process.env.GROQ_MODEL || DEFAULT_MODEL;

  const response = await fetch(`${GROQ_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: 'system',
          content: 'You are an expert Placement Officer and HR Interview Designer. Return strictly valid JSON following the schema provided. Do not wrap the JSON in markdown code blocks.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3,
      response_format: { type: 'json_object' }
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Groq API error [${response.status}]: ${errorText}`);
  }

  const data = await response.json();
  const rawText = data.choices?.[0]?.message?.content || '{}';

  // Strip any accidental markdown fences
  const cleaned = rawText
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();

  return JSON.parse(cleaned);
}

module.exports = { generateWithGroq };
