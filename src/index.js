/**
 * AI Interview Question Generator - Main Node.js Module
 * 
 * Implements the Master Prompt: Placement Officer and HR Interview Designer
 * Generates role-specific questions and 1-5 evaluation rubrics.
 */

require('dotenv').config();
const { buildMasterPrompt } = require('./promptBuilder');
const { generateOfflineInterview } = require('./providers/offline');
const { generateWithGemini } = require('./providers/gemini');
const { generateWithOpenAI } = require('./providers/openai');
const { generateWithGroq } = require('./providers/groq');
const { toMarkdown, toCsv, calculateScore } = require('./utils/formatter');
const { PRESETS } = require('./presets');

/**
 * Main generator function
 * @param {Object} options
 * @param {string} options.jobTitle - Job role title (e.g. 'Data Analyst')
 * @param {string} options.jobDescription - Full JD text
 * @param {'Fresher'|'Junior'|'Mid'|'Senior'} [options.experienceLevel='Fresher']
 * @param {'Technical'|'HR'|'Mixed'} [options.interviewType='Mixed']
 * @param {number} [options.numQuestions=10]
 * @param {Object|string} [options.difficultyMix={ easy: 30, medium: 50, hard: 20 }]
 * @param {string} [options.keySkills='']
 * @param {'auto'|'gemini'|'openai'|'groq'|'offline'} [options.provider='auto']
 * @param {string} [options.apiKey]
 * @param {string} [options.model]
 * @returns {Promise<Object>} Generated interview question suite & rubric
 */
async function generateInterviewQuestions(options = {}) {
  const mergedOptions = {
    jobTitle: options.jobTitle || 'Software Engineer',
    jobDescription: options.jobDescription || '',
    experienceLevel: options.experienceLevel || 'Fresher',
    interviewType: options.interviewType || 'Mixed',
    numQuestions: Number(options.numQuestions) || 10,
    difficultyMix: options.difficultyMix || { easy: 30, medium: 50, hard: 20 },
    keySkills: options.keySkills || '',
    provider: options.provider || 'auto',
    apiKey: options.apiKey,
    model: options.model
  };

  // Determine provider
  let providerToUse = mergedOptions.provider;
  if (providerToUse === 'auto') {
    if (mergedOptions.apiKey || process.env.GEMINI_API_KEY) {
      providerToUse = 'gemini';
    } else if (process.env.GROQ_API_KEY) {
      providerToUse = 'groq';
    } else if (process.env.OPENAI_API_KEY) {
      providerToUse = 'openai';
    } else {
      providerToUse = 'offline';
    }
  }

  const prompt = buildMasterPrompt(mergedOptions);
  let rawResult;
  let finalProvider = providerToUse;

  try {
    if (providerToUse === 'gemini') {
      rawResult = await generateWithGemini(prompt, mergedOptions);
    } else if (providerToUse === 'groq') {
      rawResult = await generateWithGroq(prompt, mergedOptions);
    } else if (providerToUse === 'openai') {
      rawResult = await generateWithOpenAI(prompt, mergedOptions);
    } else {
      rawResult = generateOfflineInterview(mergedOptions);
    }
  } catch (err) {
    // Graceful fallback to offline engine if API call fails or quota exhausted
    console.warn(`[ai-interview-generator] Provider ${providerToUse} failed: ${err.message}. Falling back to offline rule-based engine.`);
    rawResult = generateOfflineInterview(mergedOptions);
    finalProvider = 'offline (fallback)';
  }

  // Ensure consistent response structure
  const result = {
    roleSummary: rawResult.roleSummary || `Assessment for ${mergedOptions.jobTitle} (${mergedOptions.experienceLevel})`,
    assumptions: rawResult.assumptions || [],
    questions: rawResult.questions || [],
    rubric: rawResult.rubric || {},
    interviewerTips: rawResult.interviewerTips || [],
    metadata: {
      providerUsed: finalProvider,
      generatedAt: new Date().toISOString(),
      jobTitle: mergedOptions.jobTitle,
      experienceLevel: mergedOptions.experienceLevel,
      interviewType: mergedOptions.interviewType,
      numQuestions: rawResult.questions ? rawResult.questions.length : mergedOptions.numQuestions
    }
  };

  // Attach helper methods to result
  result.toMarkdown = () => toMarkdown(result);
  result.toCsv = () => toCsv(result);
  result.calculateScore = (candidateScores) => calculateScore(candidateScores);

  return result;
}

module.exports = {
  generateInterviewQuestions,
  calculateScore,
  buildMasterPrompt,
  PRESETS,
  toMarkdown,
  toCsv
};
