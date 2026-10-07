/**
 * Netlify Function: POST /api/generate
 * Generates interview questions via the selected AI provider.
 */

const { generateInterviewQuestions } = require('../../src/index');

exports.handler = async (event) => {
  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ success: false, error: 'Method Not Allowed' })
    };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const startTime = Date.now();
    const result = await generateInterviewQuestions(body);
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);

    // Remove non-serialisable helper methods before sending
    const { toMarkdown, toCsv, calculateScore, ...data } = result;

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: true, data, elapsedSeconds: elapsed })
    };
  } catch (err) {
    console.error('Error generating questions:', err);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: false,
        error: err.message || 'Failed to generate interview questions'
      })
    };
  }
};
