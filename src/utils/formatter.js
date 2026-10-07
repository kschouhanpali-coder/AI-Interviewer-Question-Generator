/**
 * Formatter utility: exports to Markdown, HTML, CSV, and calculates candidate rubric scores
 */

function toMarkdown(data) {
  const { roleSummary, assumptions = [], questions = [], rubric = {}, interviewerTips = [] } = data;

  let md = `# AI Interview Preparation & Evaluation Guide\n\n`;

  // 1. Role Summary
  md += `## 1. Role Summary\n`;
  md += `${roleSummary}\n\n`;

  // 2. Assumptions
  if (assumptions.length > 0) {
    md += `## 2. Assumptions Made\n`;
    assumptions.forEach(a => {
      md += `- ${a}\n`;
    });
    md += `\n`;
  }

  // 3. Task 1: Questions Table
  md += `## 3. Task 1: Interview Questions\n\n`;
  md += `| # | Category | Question | Skill Tested | Difficulty | Expected Key Points in Strong Answer |\n`;
  md += `|---|----------|----------|--------------|------------|--------------------------------------|\n`;

  questions.forEach(q => {
    const points = Array.isArray(q.expectedKeyPoints)
      ? q.expectedKeyPoints.map(p => `• ${p}`).join('<br>')
      : q.expectedKeyPoints || '';
    const cleanQ = (q.question || '').replace(/\|/g, '\\|').replace(/\n/g, ' ');
    md += `| ${q.number} | ${q.category} | ${cleanQ} | ${q.skillTested} | **${q.difficulty}** | ${points} |\n`;
  });
  md += `\n`;

  // 4. Task 2: Evaluation Rubric
  md += `## 4. Task 2: Evaluation Rubric\n\n`;
  md += `### Scoring Rubric (1 to 5 Scale)\n\n`;
  md += `| Criterion | Weight | 1 (Poor) | 2 (Developing) | 3 (Satisfactory) | 4 (Advanced) | 5 (Excellent) |\n`;
  md += `|-----------|--------|----------|----------------|------------------|--------------|---------------|\n`;

  if (rubric.criteria) {
    rubric.criteria.forEach(c => {
      const l = c.levels || {};
      md += `| **${c.name}** | ${c.weightage}% | ${l['1'] || '-'} | ${l['2'] || '-'} | ${l['3'] || '-'} | ${l['4'] || '-'} | ${l['5'] || '-'} |\n`;
    });
    md += `\n`;
  }

  if (rubric.formula) {
    md += `### Final Scoring Formula\n`;
    md += `\`\`\`text\n${rubric.formula}\n\`\`\`\n\n`;
  }

  if (rubric.bands && rubric.bands.length > 0) {
    md += `### Candidate Interpretation Bands\n\n`;
    md += `| Score Range | Verdict | Interpretation |\n`;
    md += `|-------------|---------|----------------|\n`;
    rubric.bands.forEach(b => {
      md += `| **${b.range}** | \`${b.verdict}\` | ${b.description} |\n`;
    });
    md += `\n`;
  }

  // 5. Interviewer Tips
  if (interviewerTips.length > 0) {
    md += `## 5. Interviewer Tips\n\n`;
    interviewerTips.forEach(tip => {
      md += `- ${tip}\n`;
    });
    md += `\n`;
  }

  return md;
}

function calculateScore({ technicalDepth = 3, relevance = 3, difficultyHandling = 3, weights = { technical: 0.5, relevance: 0.3, difficulty: 0.2 } }) {
  const finalScore = Number(
    (technicalDepth * weights.technical + relevance * weights.relevance + difficultyHandling * weights.difficulty).toFixed(2)
  );

  let verdict = 'Reject';
  let badgeClass = 'reject';
  if (finalScore >= 4.5) {
    verdict = 'Strong Hire';
    badgeClass = 'strong-hire';
  } else if (finalScore >= 3.5) {
    verdict = 'Hire';
    badgeClass = 'hire';
  } else if (finalScore >= 2.5) {
    verdict = 'Borderline';
    badgeClass = 'borderline';
  }

  return {
    technicalDepth,
    relevance,
    difficultyHandling,
    finalScore,
    percentage: Math.round((finalScore / 5.0) * 100),
    verdict,
    badgeClass
  };
}

function toCsv(data) {
  const questions = data.questions || [];
  const header = ['"Question Number"', '"Category"', '"Question"', '"Skill Tested"', '"Difficulty"', '"Expected Key Points"'];
  const rows = questions.map(q => {
    const points = Array.isArray(q.expectedKeyPoints) ? q.expectedKeyPoints.join('; ') : q.expectedKeyPoints;
    return [
      `"${q.number}"`,
      `"${(q.category || '').replace(/"/g, '""')}"`,
      `"${(q.question || '').replace(/"/g, '""')}"`,
      `"${(q.skillTested || '').replace(/"/g, '""')}"`,
      `"${q.difficulty}"`,
      `"${(points || '').replace(/"/g, '""')}"`
    ].join(',');
  });

  return [header.join(','), ...rows].join('\n');
}

module.exports = {
  toMarkdown,
  calculateScore,
  toCsv
};
