/**
 * Offline / Rule-Based Generator
 * Generates structured interview questions and rubrics by extracting keywords,
 * tools, responsibilities, and seniority levels directly from the Job Description.
 * Ensures the Node module works standalone even without external API keys.
 */

const KNOWN_SKILL_PATTERNS = [
  { name: 'JavaScript', pattern: /\b(javascript|js|es6|node(?:\.js)?|express)\b/i },
  { name: 'TypeScript', pattern: /\b(typescript|ts)\b/i },
  { name: 'React', pattern: /\b(react(?:\.js)?|next(?:\.js)?|redux|frontend)\b/i },
  { name: 'Python', pattern: /\b(python|django|fastapi|flask|pandas|numpy)\b/i },
  { name: 'Java', pattern: /\b(java|spring(?:\s*boot)?|hibernate)\b/i },
  { name: 'SQL & Databases', pattern: /\b(sql|mysql|postgresql|postgres|mongodb|nosql|redis)\b/i },
  { name: 'REST APIs & Backend', pattern: /\b(rest(?:\s*api)?|graphql|microservices|backend|api)\b/i },
  { name: 'Git & Version Control', pattern: /\b(git|github|gitlab|ci\/cd|version\s*control)\b/i },
  { name: 'Docker & DevOps', pattern: /\b(docker|kubernetes|k8s|aws|azure|cloud|devops)\b/i },
  { name: 'Data Analysis & BI', pattern: /\b(excel|power\s*bi|tableau|data\s*analyst|analytics)\b/i },
  { name: 'Machine Learning & AI', pattern: /\b(machine\s*learning|ml|deep\s*learning|nlp|llm|pytorch|tensorflow)\b/i },
  { name: 'System Design', pattern: /\b(system\s*design|architecture|scalability|high\s*availability)\b/i },
  { name: 'Testing & QA', pattern: /\b(unit\s*test|jest|cypress|selenium|qa|testing)\b/i },
  { name: 'Agile & Collaboration', pattern: /\b(agile|scrum|jira|cross-functional|sprint)\b/i }
];

function extractSkillsFromJD(jdText, keySkills = '') {
  const detected = new Set();

  if (keySkills) {
    keySkills.split(',').map(s => s.trim()).filter(Boolean).forEach(s => detected.add(s));
  }

  for (const item of KNOWN_SKILL_PATTERNS) {
    if (item.pattern.test(jdText)) {
      detected.add(item.name);
    }
  }

  if (detected.size === 0) {
    detected.add('Problem Solving');
    detected.add('Core Technical Fundamentals');
    detected.add('Communication & Collaboration');
  }

  return Array.from(detected);
}

function calculateDifficultyCounts(total, mix = { easy: 30, medium: 50, hard: 20 }) {
  const easyRatio = (mix.easy || 30) / 100;
  const mediumRatio = (mix.medium || 50) / 100;
  
  let easy = Math.max(1, Math.round(total * easyRatio));
  let hard = Math.max(1, Math.round(total * ((mix.hard || 20) / 100)));
  let medium = total - (easy + hard);

  if (medium < 0) {
    medium = 1;
    if (easy > 1) easy--;
    else if (hard > 1) hard--;
  }

  return { easy, medium, hard };
}

function generateOfflineInterview(options = {}) {
  const {
    jobTitle = 'Software Engineer',
    jobDescription = '',
    experienceLevel = 'Fresher',
    interviewType = 'Mixed',
    numQuestions = 10,
    difficultyMix = { easy: 30, medium: 50, hard: 20 },
    keySkills = ''
  } = options;

  const detectedSkills = extractSkillsFromJD(jobDescription, keySkills);
  const diffCounts = calculateDifficultyCounts(numQuestions, difficultyMix);

  // Distribute difficulty labels across questions
  const difficultyList = [];
  for (let i = 0; i < diffCounts.easy; i++) difficultyList.push('Easy');
  for (let i = 0; i < diffCounts.medium; i++) difficultyList.push('Medium');
  for (let i = 0; i < diffCounts.hard; i++) difficultyList.push('Hard');

  // Fill up if rounding differences
  while (difficultyList.length < numQuestions) difficultyList.push('Medium');
  while (difficultyList.length > numQuestions) difficultyList.pop();

  // Determine category distribution based on interviewType
  let categoryPool = [];
  if (interviewType === 'Technical') {
    categoryPool = ['Technical', 'Technical', 'Scenario/Problem-Solving', 'Technical'];
  } else if (interviewType === 'HR') {
    categoryPool = ['Behavioral/HR', 'Role-Fit', 'Behavioral/HR', 'Scenario/Problem-Solving'];
  } else {
    // Mixed
    categoryPool = ['Technical', 'Scenario/Problem-Solving', 'Behavioral/HR', 'Role-Fit'];
  }

  const questions = [];

  for (let i = 0; i < numQuestions; i++) {
    const qNum = i + 1;
    const category = categoryPool[i % categoryPool.length];
    const difficulty = difficultyList[i];
    const primarySkill = detectedSkills[i % detectedSkills.length];

    let questionText = '';
    let expectedKeyPoints = [];

    if (category === 'Technical') {
      if (difficulty === 'Easy') {
        questionText = `Explain the core principles of ${primarySkill} and how you have used it in academic or personal projects.`;
        expectedKeyPoints = [
          `Clear definition and foundational terminology of ${primarySkill}`,
          `Practical syntax or typical use-case illustration`,
          `Understanding of how it compares to alternative tools or standards`
        ];
      } else if (difficulty === 'Medium') {
        questionText = `How do you handle error boundaries, debugging, and edge cases when working with ${primarySkill}? Describe a specific bug you diagnosed.`;
        expectedKeyPoints = [
          `Systematic debugging methodology (logs, breakpoints, profiling)`,
          `Root-cause identification and remediation strategy`,
          `Best practices for defensive coding and validation`
        ];
      } else {
        questionText = `In a production environment requiring high concurrency and low latency, how would you architect and optimize a solution utilizing ${primarySkill}?`;
        expectedKeyPoints = [
          `Architectural tradeoffs (caching, indexing, asynchronous execution)`,
          `Bottleneck analysis and metric monitoring`,
          `Scalability, resilience, and security considerations`
        ];
      }
    } else if (category === 'Scenario/Problem-Solving') {
      if (difficulty === 'Easy') {
        questionText = `Suppose a critical requirement in a project task involving ${primarySkill} is ambiguous or incomplete. How would you proceed?`;
        expectedKeyPoints = [
          `Proactive communication with team leads and stakeholders`,
          `Documenting assumptions before proceeding with code`,
          `Iterative feedback loop rather than building in isolation`
        ];
      } else if (difficulty === 'Medium') {
        questionText = `A feature you deployed that relies on ${primarySkill} fails in staging right before a deadline. Walk us through your triage and rollback process.`;
        expectedKeyPoints = [
          `Calm prioritization and immediate impact containment`,
          `Version control rollback / feature-flag disablement`,
          `Post-mortem RCA and adding preventive automated tests`
        ];
      } else {
        questionText = `You discover a major performance regression or architectural flaw in an existing legacy codebase tied to ${primarySkill}. How do you pitch and execute a refactoring plan without halting active delivery?`;
        expectedKeyPoints = [
          `Quantifying technical debt and impact on business KPIs`,
          `Strangler fig or phased migration strategy`,
          `Maintaining regression test coverage during refactoring`
        ];
      }
    } else if (category === 'Behavioral/HR') {
      questionText = `Describe a time when you had a disagreement with a team member regarding a technical decision or project direction. How was it resolved?`;
      expectedKeyPoints = [
        `Objective listening and focusing on project goals over personal ego`,
        `Data-driven or benchmark-backed technical evaluation`,
        `Commitment to the final consensus and professional team cohesion`
      ];
    } else { // Role-Fit
      questionText = `Why are you specifically interested in this ${jobTitle} opportunity, and how does your background with ${primarySkill} align with our company's mission?`;
      expectedKeyPoints = [
        `Knowledge of the organization's domain and recent initiatives`,
        `Direct alignment between candidate's career trajectory and the role`,
        `Demonstrated curiosity, self-driven learning, and long-term commitment`
      ];
    }

    questions.push({
      number: qNum,
      category,
      question: questionText,
      skillTested: primarySkill,
      difficulty,
      expectedKeyPoints
    });
  }

  const roleSummary = `Targeted assessment for the role of ${jobTitle} (${experienceLevel} level). Focuses on key proficiencies including ${detectedSkills.slice(0, 4).join(', ')} with structured evaluations for ${interviewType.toLowerCase()} readiness.`;

  const assumptions = [
    `Candidate is evaluated at the ${experienceLevel} level according to industry-standard benchmarks.`,
    `Evaluation prioritizes hands-on competence in ${detectedSkills.slice(0, 3).join(', ')} as highlighted in the Job Description.`,
    `Difficulty mix adhered to: ${diffCounts.easy} Easy, ${diffCounts.medium} Medium, ${diffCounts.hard} Hard.`
  ];

  const rubric = {
    criteria: [
      {
        name: 'Technical Depth',
        weightage: 50,
        levels: {
          '1': 'Poor: Lacks fundamental knowledge, unable to articulate basic concepts or syntax.',
          '2': 'Developing: Knows elementary definitions but struggles with practical implementation.',
          '3': 'Satisfactory: Good grasp of core concepts, can implement standard patterns with minor gaps.',
          '4': 'Advanced: Strong technical command, understands performance tradeoffs and internal mechanics.',
          '5': 'Excellent: Master-level understanding, articulates clean architecture, optimization, and edge cases.'
        }
      },
      {
        name: 'Relevance',
        weightage: 30,
        levels: {
          '1': 'Poor: Wanders off-topic, fails to address the question or job requirements.',
          '2': 'Developing: Partially addresses the query but includes irrelevant or generic fluff.',
          '3': 'Satisfactory: Directly answers the prompt with applicable examples from JD-relevant skills.',
          '4': 'Advanced: Crisp, structured response (STAR method) directly tying past work to job expectations.',
          '5': 'Excellent: Highly tailored answer showcasing exact alignment with role demands and organizational impact.'
        }
      },
      {
        name: 'Difficulty Handling',
        weightage: 20,
        levels: {
          '1': 'Poor: Freezes or gives up completely when posed with non-trivial or ambiguous questions.',
          '2': 'Developing: Requires heavy interviewer prompting and hints to make incremental progress.',
          '3': 'Satisfactory: Handles moderate complexity steadily, reasons through unfamiliar scenarios logically.',
          '4': 'Advanced: Shows composure under pressure, asks clarifying questions, and breaks down complex problems.',
          '5': 'Excellent: Thrives on hard challenges, demonstrates creative problem solving and robust architectural thinking.'
        }
      }
    ],
    formula: 'Final Score = (Technical Depth * 0.50) + (Relevance * 0.30) + (Difficulty Handling * 0.20)',
    bands: [
      { range: '4.5 - 5.0', verdict: 'Strong Hire', description: 'Exceptional candidate exceeding core and stretch criteria; high velocity contributor.' },
      { range: '3.5 - 4.4', verdict: 'Hire', description: 'Competent candidate meeting all required technical and behavioral baselines.' },
      { range: '2.5 - 3.4', verdict: 'Borderline', description: 'Shows partial competence but presents noticeable skill or depth gaps; consider secondary round.' },
      { range: 'Below 2.5', verdict: 'Reject', description: 'Does not demonstrate minimum required competencies for this level and role.' }
    ]
  };

  const interviewerTips = [
    `Use the STAR method (Situation, Task, Action, Result) when probing Scenario and Behavioral answers.`,
    `Allow the candidate 30-45 seconds of thinking time before expecting architectural or multi-step answers.`,
    `If a candidate struggles with a Medium/Hard question, offer a minor hint to assess coachability and problem-solving speed.`,
    `Take objective notes on specific technical terms and examples cited, avoiding subjective first-impression bias.`
  ];

  return {
    roleSummary,
    assumptions,
    questions,
    rubric,
    interviewerTips
  };
}

module.exports = {
  generateOfflineInterview,
  extractSkillsFromJD,
  calculateDifficultyCounts
};
