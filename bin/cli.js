#!/usr/bin/env node

/**
 * CLI runner for AI Interview Question Generator
 * Usage:
 *   npm run cli
 *   node bin/cli.js
 *   node bin/cli.js --preset data_analyst
 */

const readline = require('readline');
const { generateInterviewQuestions, PRESETS } = require('../src/index');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const ask = (query, defaultValue) => new Promise(resolve => {
  const prompt = defaultValue ? `${query} [${defaultValue}]: ` : `${query}: `;
  rl.question(prompt, answer => {
    resolve(answer.trim() || defaultValue || '');
  });
});

async function main() {
  const args = process.argv.slice(2);
  console.log('\n======================================================');
  console.log('  🎯 AI INTERVIEW QUESTION & RUBRIC GENERATOR (CLI)   ');
  console.log('======================================================\n');

  // Check if preset flag passed
  const presetArgIndex = args.indexOf('--preset');
  let selectedPresetKey = presetArgIndex !== -1 ? args[presetArgIndex + 1] : null;

  if (!selectedPresetKey) {
    console.log('Select an option:');
    console.log(' 1) Junior Full Stack Developer (Fresher Preset)');
    console.log(' 2) Data Analyst (Junior Preset)');
    console.log(' 3) DevOps & Cloud Engineer (Mid Preset)');
    console.log(' 4) AI/ML Engineer (Senior Preset)');
    console.log(' 5) Enter Custom Job Description');
    const choice = await ask('\nEnter choice (1-5)', '1');

    if (choice === '1') selectedPresetKey = 'fullstack_fresher';
    else if (choice === '2') selectedPresetKey = 'data_analyst';
    else if (choice === '3') selectedPresetKey = 'cloud_devops';
    else if (choice === '4') selectedPresetKey = 'ai_ml_engineer';
  }

  let options = {};
  if (selectedPresetKey && PRESETS[selectedPresetKey]) {
    options = { ...PRESETS[selectedPresetKey] };
    console.log(`\nLoaded preset: ${options.jobTitle} (${options.experienceLevel})`);
  } else {
    options.jobTitle = await ask('Job Title', 'Software Engineer');
    options.experienceLevel = await ask('Experience Level (Fresher/Junior/Mid/Senior)', 'Fresher');
    options.interviewType = await ask('Interview Type (Technical/HR/Mixed)', 'Mixed');
    options.numQuestions = parseInt(await ask('Number of Questions', '10'), 10);
    options.keySkills = await ask('Key Skills to Focus On (comma-separated)', '');
    console.log('\nEnter/Paste Job Description (Press Enter, then Ctrl+D when finished):');
    
    // Read multiline input
    const lines = [];
    for await (const line of rl) {
      lines.push(line);
    }
    options.jobDescription = lines.join('\n').trim();
    if (!options.jobDescription) {
      options.jobDescription = `Looking for a ${options.jobTitle} with strong technical and problem-solving skills.`;
    }
  }

  console.log('\n⏳ Generating interview questions and rubric based on Master Prompt...');
  const startTime = Date.now();
  const result = await generateInterviewQuestions(options);
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);

  console.log(`\n✨ Generation Complete in ${elapsed}s (Provider: ${result.metadata.providerUsed})!\n`);
  console.log(result.toMarkdown());

  rl.close();
}

main().catch(err => {
  console.error('\n❌ CLI Error:', err.message);
  rl.close();
  process.exit(1);
});
