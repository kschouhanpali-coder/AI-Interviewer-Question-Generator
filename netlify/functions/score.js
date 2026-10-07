/**
 * Netlify Function: POST /api/score
 * Calculates a weighted candidate rubric score.
 */

const { calculateScore } = require('../../src/index');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ success: false, error: 'Method Not Allowed' })
    };
  }

  try {
    const { technicalDepth, relevance, difficultyHandling, weights } = JSON.parse(event.body || '{}');
    const scoreResult = calculateScore({
      technicalDepth: Number(technicalDepth) || 3,
      relevance: Number(relevance) || 3,
      difficultyHandling: Number(difficultyHandling) || 3,
      weights
    });

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: true, data: scoreResult })
    };
  } catch (err) {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: false, error: err.message })
    };
  }
};
