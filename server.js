/**
 * Express Server for AI Interview Question Generator Web Interface & API
 */

require('dotenv').config();
const express = require('express');
const path = require('path');
const { generateInterviewQuestions, calculateScore, PRESETS } = require('./src/index');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// API: Get presets
app.get('/api/presets', (req, res) => {
  res.json({ success: true, presets: PRESETS });
});

// API: Generate Interview Questions
app.post('/api/generate', async (req, res) => {
  try {
    const startTime = Date.now();
    const result = await generateInterviewQuestions(req.body);
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);

    res.json({
      success: true,
      data: result,
      elapsedSeconds: elapsed
    });
  } catch (err) {
    console.error('Error generating questions:', err);
    res.status(500).json({
      success: false,
      error: err.message || 'Failed to generate interview questions'
    });
  }
});

// API: Calculate candidate rubric score
app.post('/api/score', (req, res) => {
  try {
    const { technicalDepth, relevance, difficultyHandling, weights } = req.body;
    const scoreResult = calculateScore({
      technicalDepth: Number(technicalDepth) || 3,
      relevance: Number(relevance) || 3,
      difficultyHandling: Number(difficultyHandling) || 3,
      weights
    });
    res.json({ success: true, data: scoreResult });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// Start server with smart port fallback on EADDRINUSE
function startServer(portToTry, attemptsLeft = 5) {
  const server = app.listen(portToTry, () => {
    console.log(`\n======================================================`);
    console.log(`🚀 AI Interview Generator Server running!`);
    console.log(`📍 Web UI: http://localhost:${portToTry}`);
    console.log(`📦 Node Module: src/index.js`);
    console.log(`======================================================\n`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE' && attemptsLeft > 0) {
      console.warn(`⚠️  Port ${portToTry} is already in use. Retrying on port ${portToTry + 1}...`);
      startServer(portToTry + 1, attemptsLeft - 1);
    } else {
      console.error(`❌ Server error:`, err.message);
      process.exit(1);
    }
  });
}

startServer(Number(PORT) || 3000);

