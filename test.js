/**
 * Test script to verify the Node module works seamlessly
 */

const { generateInterviewQuestions, PRESETS, calculateScore } = require('./src/index');

async function runTests() {
  console.log('🧪 Starting AI Interview Generator Tests...\n');

  // Test 1: Generate for Fresher Full Stack preset
  console.log('Test 1: Generating questions for Junior Full Stack Developer (Fresher)...');
  const preset = PRESETS.fullstack_fresher;
  const result = await generateInterviewQuestions({
    ...preset,
    provider: 'offline'
  });

  console.log(`✅ Success! Generated ${result.questions.length} questions.`);
  console.log(`Summary: ${result.roleSummary}`);
  console.log(`\nSample Question 1:`);
  console.log(`[${result.questions[0].category}] (${result.questions[0].difficulty}) ${result.questions[0].question}`);
  console.log(`Skill Tested: ${result.questions[0].skillTested}`);
  console.log(`Key Points:\n  - ${result.questions[0].expectedKeyPoints.join('\n  - ')}`);

  // Test 2: Verify Markdown formatting
  console.log('\nTest 2: Verifying Markdown conversion...');
  const md = result.toMarkdown();
  if (md.includes('## 1. Role Summary') && md.includes('## 3. Task 1: Interview Questions')) {
    console.log('✅ Markdown output conforms to Master Prompt Section 7 format!');
  } else {
    throw new Error('Markdown output format mismatch');
  }

  // Test 3: Rubric Score calculation
  console.log('\nTest 3: Testing Rubric Candidate Scoring...');
  const scoreResult = calculateScore({
    technicalDepth: 4,
    relevance: 5,
    difficultyHandling: 4
  });
  console.log(`Candidate score: ${scoreResult.finalScore}/5.0 (${scoreResult.percentage}%) -> Verdict: ${scoreResult.verdict}`);
  if (scoreResult.verdict === 'Hire' || scoreResult.verdict === 'Strong Hire') {
    console.log('✅ Rubric evaluation calculation accurate!');
  } else {
    throw new Error('Score calculation failed');
  }

  console.log('\n🎉 All Node.js module tests passed successfully!');
}

runTests().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
