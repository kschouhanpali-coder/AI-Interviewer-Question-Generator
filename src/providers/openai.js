/**
 * OpenAI / Compatible Provider (supports OpenAI, Groq, Ollama, DeepSeek)
 * Uses native fetch available in Node.js 18+
 */

async function generateWithOpenAI(prompt, options = {}) {
  const apiKey = options.apiKey || process.env.OPENAI_API_KEY;
  const baseUrl = options.baseUrl || process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1';
  const model = options.model || process.env.OPENAI_MODEL || 'gpt-4o-mini';

  if (!apiKey && !baseUrl.includes('localhost') && !baseUrl.includes('127.0.0.1')) {
    throw new Error('OPENAI_API_KEY is required for OpenAI provider. Pass it in options or set it in .env');
  }

  const response = await fetch(`${baseUrl.replace(/\/$/, '')}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey || 'dummy'}`
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: 'system',
          content: 'You are an expert Placement Officer and HR Interview Designer. Return strictly valid JSON following the schema provided.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.3
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI API error [${response.status}]: ${errorText}`);
  }

  const data = await response.json();
  const rawText = data.choices?.[0]?.message?.content || '{}';

  const cleaned = rawText
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();

  return JSON.parse(cleaned);
}

module.exports = {
  generateWithOpenAI
};
