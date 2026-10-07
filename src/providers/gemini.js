/**
 * Google Gemini Provider for AI Interview Question Generator
 * Uses the official @google/genai SDK
 */

const { GoogleGenAI } = require('@google/genai');

async function generateWithGemini(prompt, options = {}) {
  const apiKey = options.apiKey || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is required. Pass it in options or set it in .env');
  }

  const modelName = options.model || 'gemini-2.5-flash';
  const ai = new GoogleGenAI({ apiKey });

  const response = await ai.models.generateContent({
    model: modelName,
    contents: prompt,
    config: {
      temperature: 0.3,
      responseMimeType: 'application/json'
    }
  });

  const rawText = response.text || '';
  
  // Clean json output if enclosed in markdown backticks
  const cleaned = rawText
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch (err) {
    throw new Error(`Failed to parse Gemini JSON output: ${err.message}\nRaw response:\n${rawText}`);
  }
}

module.exports = {
  generateWithGemini
};
