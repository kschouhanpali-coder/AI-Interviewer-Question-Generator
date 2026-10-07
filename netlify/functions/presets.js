/**
 * Netlify Function: GET /api/presets
 * Returns the built-in interview presets.
 */

const { PRESETS } = require('../../src/presets');

exports.handler = async (event) => {
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: JSON.stringify({ success: false, error: 'Method Not Allowed' })
    };
  }

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ success: true, presets: PRESETS })
  };
};
