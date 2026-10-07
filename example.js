/**
 * AI Interview Question Generator - Programmatic Usage Example
 * Demonstrates how to import and use the module in any Node.js application.
 * Formatted with beautiful terminal styling and clean visual hierarchy.
 */

const { generateInterviewQuestions } = require('./src/index');

// Clean ANSI color helpers (no external dependency needed)
const c = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  cyan: '\x1b[36m',
  blue: '\x1b[34m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  magenta: '\x1b[35m',
  red: '\x1b[31m',
  white: '\x1b[37m',
  bgBlue: '\x1b[44m',
  bgMagenta: '\x1b[45m',
  bgGreen: '\x1b[42m'
};

const badge = (text, color) => `${color}${c.bold} ${text} ${c.reset}`;
const diffBadge = (diff) => {
  const d = (diff || '').toUpperCase();
  if (d === 'EASY') return `${c.green}${c.bold}[ EASY ]${c.reset}`;
  if (d === 'HARD') return `${c.red}${c.bold}[ HARD ]${c.reset}`;
  return `${c.yellow}${c.bold}[ MEDIUM ]${c.reset}`;
};
const catBadge = (cat) => `${c.cyan}${c.bold}[${cat}]${c.reset}`;

async function main() {
  console.clear();
  console.log(`\n${c.cyan}${c.bold}╔══════════════════════════════════════════════════════════════════════════╗${c.reset}`);
  console.log(`${c.cyan}${c.bold}║           🎯  AI INTERVIEW QUESTION & EVALUATION SUITE                   ║${c.reset}`);
  console.log(`${c.cyan}${c.bold}║           Placement Officer & HR Rubric Designer (Node.js)               ║${c.reset}`);
  console.log(`${c.cyan}${c.bold}╚══════════════════════════════════════════════════════════════════════════╝${c.reset}\n`);

  console.log(`${c.dim}⚡ Initializing generator for target role: Data Analyst (Fresher)...${c.reset}\n`);

  const startTime = Date.now();
  const result = await generateInterviewQuestions({
    jobTitle: 'Data Analyst',
    experienceLevel: 'Fresher',
    interviewType: 'Mixed',
    numQuestions: 5,
    difficultyMix: { easy: 40, medium: 40, hard: 20 },
    keySkills: 'SQL, Python, Excel, Power BI',
    jobDescription: `
      We are hiring a campus graduate Data Analyst.
      Key duties: writing SQL queries to extract data, cleaning datasets with Python,
      and building visualization dashboards in Power BI. Must have strong analytical
      and communication skills.
    `,
    provider: 'auto'
  });
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);

  // 1. Role Overview Card
  console.log(`${c.bold}${c.white}📌 1. ROLE OVERVIEW${c.reset}`);
  console.log(`${c.dim}───────────────────────────────────────────────────────────────────────────${c.reset}`);
  console.log(`  ${c.bold}Target Role   :${c.reset} ${c.magenta}${result.metadata.jobTitle} (${result.metadata.experienceLevel} Level)${c.reset}`);
  console.log(`  ${c.bold}Interview Type:${c.reset} ${result.metadata.interviewType} (Technical + Behavioral)`);
  console.log(`  ${c.bold}Engine        :${c.reset} ${c.green}${result.metadata.providerUsed}${c.reset} ${c.dim}(generated in ${elapsed}s)${c.reset}`);
  console.log(`  ${c.bold}Summary       :${c.reset} ${result.roleSummary}`);
  console.log();

  // 2. Generated Questions
  console.log(`${c.bold}${c.white}❓ 2. TASK 1: INTERVIEW QUESTIONS (${result.questions.length} Generated)${c.reset}`);
  console.log(`${c.dim}───────────────────────────────────────────────────────────────────────────${c.reset}`);

  result.questions.forEach((q, idx) => {
    console.log(`\n  ${c.bold}${c.white}Question #${q.number}${c.reset} ${catBadge(q.category)} ${diffBadge(q.difficulty)}`);
    console.log(`  ${c.dim}Skill Target  :${c.reset} ${c.yellow}${q.skillTested}${c.reset}`);
    console.log(`  ${c.bold}${c.white}Q:${c.reset} ${q.question}`);
    console.log(`  ${c.dim}Expected Key Criteria in Strong Answer:${c.reset}`);
    q.expectedKeyPoints.forEach(pt => {
      console.log(`    ${c.green}✔${c.reset} ${pt}`);
    });
  });
  console.log();

  // 3. Evaluation Rubric Table
  console.log(`${c.bold}${c.white}📊 3. TASK 2: EVALUATION RUBRIC (1–5 Scale)${c.reset}`);
  console.log(`${c.dim}───────────────────────────────────────────────────────────────────────────${c.reset}`);
  console.log(`  ${c.bold}Scoring Formula:${c.reset} ${c.cyan}${result.rubric.formula}${c.reset}\n`);

  console.log(`  ${c.bold}Criteria Weightages & Descriptors:${c.reset}`);
  (result.rubric.criteria || []).forEach(cItem => {
    console.log(`  • ${c.bold}${cItem.name}${c.reset} ${c.dim}(Weight: ${cItem.weightage}%)${c.reset}`);
    console.log(`    ${c.dim}[1 Poor]        :${c.reset} ${cItem.levels['1']}`);
    console.log(`    ${c.dim}[3 Satisfactory]:${c.reset} ${cItem.levels['3']}`);
    console.log(`    ${c.dim}[5 Excellent]   :${c.reset} ${cItem.levels['5']}`);
  });
  console.log();

  // 4. Candidate Score Simulation
  console.log(`${c.bold}${c.white}🎯 4. CANDIDATE EVALUATION SIMULATOR${c.reset}`);
  console.log(`${c.dim}───────────────────────────────────────────────────────────────────────────${c.reset}`);

  const sampleGrades = [
    { tech: 4.5, rel: 4.5, diff: 4.5, candidate: 'Candidate A (High Performer)' },
    { tech: 3.5, rel: 4.0, diff: 3.0, candidate: 'Candidate B (Meets Standards)' },
    { tech: 2.0, rel: 2.5, diff: 2.0, candidate: 'Candidate C (Under-prepared)' }
  ];

  sampleGrades.forEach(sample => {
    const evalResult = result.calculateScore({
      technicalDepth: sample.tech,
      relevance: sample.rel,
      difficultyHandling: sample.diff
    });

    let verdictColor = c.green;
    if (evalResult.verdict === 'Borderline') verdictColor = c.yellow;
    if (evalResult.verdict === 'Reject') verdictColor = c.red;

    console.log(`  ${c.bold}${sample.candidate}${c.reset}`);
    console.log(`    Scores: Tech=${sample.tech}/5, Relevance=${sample.rel}/5, Difficulty=${sample.diff}/5`);
    console.log(`    Weighted Mark: ${c.bold}${evalResult.finalScore}/5.0${c.reset} (${evalResult.percentage}%) ➔  ${verdictColor}${c.bold}[ ${evalResult.verdict.toUpperCase()} ]${c.reset}\n`);
  });

  // 5. Interviewer Tips
  console.log(`${c.bold}${c.white}💡 5. INTERVIEWER EXECUTION TIPS${c.reset}`);
  console.log(`${c.dim}───────────────────────────────────────────────────────────────────────────${c.reset}`);
  result.interviewerTips.forEach(tip => {
    console.log(`  ${c.cyan}➤${c.reset} ${tip}`);
  });

  console.log(`\n${c.green}✔ Finished execution cleanly! To view in browser, run:${c.reset} ${c.bold}npm start${c.reset} ${c.dim}(http://localhost:3000)${c.reset}\n`);
}

main().catch(err => {
  console.error(`${c.red}Execution failed:${c.reset}`, err);
});
