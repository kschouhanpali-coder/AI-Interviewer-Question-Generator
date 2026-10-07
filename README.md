# AI Interview Question & Rubric Generator (Node.js Module)

An AI-driven Placement Officer and HR Interview Designer engine built for campus placements and corporate hiring. It takes any Job Description (JD) and generates strictly role-specific interview questions alongside a comprehensive 1–5 scale evaluation rubric.

---

## 🌟 Key Features

- **Strict Master Prompt Adherence**:
  - **Task 1: Question Generation**: Categorized into *Technical*, *Scenario / Problem-Solving*, *Behavioral / HR*, and *Role-Fit*. Includes question, JD-linked skill, difficulty (Easy/Medium/Hard), and 2–4 expected strong answer bullet points.
  - **Task 2: Evaluation Rubric**: Scored on *Technical Depth*, *Relevance*, and *Difficulty Handling* across a 1–5 scale, with weightages, scoring formulas, and hiring interpretation bands (*Strong Hire*, *Hire*, *Borderline*, *Reject*).
- **Flexible AI Providers**:
  - **Google Gemini** (`gemini-2.5-flash` via `@google/genai`)
  - **OpenAI / Compatible** (e.g., Groq, Ollama, DeepSeek)
  - **Smart Offline Engine**: Intelligent keyword and skill extractor for zero-API-key demonstrations, college viva, and offline tests.
- **Multiple Ways to Run**:
  1. **Node.js Module**: Import into your Express, Nest.js, or backend services.
  2. **Interactive CLI**: Run directly in your terminal (`npm run cli`).
  3. **Modern Web UI**: Complete glassmorphism web interface (`npm start`).

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment (Optional for Cloud AI)
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Add your Google Gemini API key or OpenAI API key:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```
*(Note: If no API key is provided, the module will automatically run using the built-in Smart Offline Engine!)*

---

## 💻 1. Programmatic Node.js Module Usage

Import and use `generateInterviewQuestions`:

```javascript
const { generateInterviewQuestions, calculateScore } = require('./src/index');

async function run() {
  const result = await generateInterviewQuestions({
    jobTitle: 'Data Analyst',
    experienceLevel: 'Fresher',          // 'Fresher' | 'Junior' | 'Mid' | 'Senior'
    interviewType: 'Mixed',              // 'Technical' | 'HR' | 'Mixed'
    numQuestions: 10,
    difficultyMix: { easy: 30, medium: 50, hard: 20 },
    keySkills: 'SQL, Python, Excel, Power BI',
    jobDescription: `
      Looking for a campus Data Analyst. Must know SQL joins and aggregations,
      Python for data cleansing (Pandas), and building reports in Power BI or Excel.
    `,
    provider: 'auto' // 'auto' | 'gemini' | 'openai' | 'offline'
  });

  // Access structured results
  console.log('Role Summary:', result.roleSummary);
  console.log('Questions:', result.questions);
  console.log('Rubric:', result.rubric);

  // Convert to Markdown or CSV
  const markdownReport = result.toMarkdown();
  const csvReport = result.toCsv();

  // Simulate candidate rubric evaluation
  const evaluation = result.calculateScore({
    technicalDepth: 4,      // 1 to 5
    relevance: 5,           // 1 to 5
    difficultyHandling: 3   // 1 to 5
  });

  console.log(`Candidate Score: ${evaluation.finalScore}/5.0 -> ${evaluation.verdict}`);
}

run();
```

---

## 🖥️ 2. Terminal CLI Runner

Run the interactive terminal wizard:
```bash
npm run cli
```
Or run directly with presets:
```bash
node bin/cli.js --preset fullstack_fresher
node bin/cli.js --preset data_analyst
node bin/cli.js --preset cloud_devops
node bin/cli.js --preset ai_ml_engineer
```

---

## 🌐 3. Interactive Web Application

Start the local server:
```bash
npm start
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

### Web UI Features:
- **Instant Presets**: 1-click loading for Fresher Full Stack, Junior Data Analyst, Mid DevOps, and Senior AI/ML.
- **Difficulty Mix Sliders**: Real-time adjustment of Easy / Medium / Hard distributions.
- **Accordion Question Cards**: Badges for difficulty, categories, and expandable answer criteria.
- **Live Rubric Simulator**: Interactive candidate scoring sliders calculating weighted scores and verdicts in real-time.
- **Export Toolbar**: Copy Markdown, download `.md` file, download `.csv` spreadsheet, or print/save as PDF.

---

## 🧪 Testing

Run automated tests to verify the Node module:
```bash
npm test
```

Run the example script:
```bash
npm run example
```

---

## 📁 Project Structure

```
├── src/
│   ├── index.js             # Main Node.js module entry point
│   ├── promptBuilder.js     # Master prompt builder following exact specification
│   ├── presets.js           # Curated job descriptions for testing
│   ├── providers/
│   │   ├── gemini.js        # Google Gemini integration (@google/genai)
│   │   ├── openai.js        # OpenAI / LLM-compatible provider
│   │   └── offline.js       # Standalone rule-based parser & generator
│   └── utils/
│       └── formatter.js     # Markdown, CSV, and rubric score calculator
├── bin/
│   └── cli.js               # Terminal command-line executable
├── public/                  # Responsive web UI
│   ├── index.html
│   ├── styles.css
│   └── app.js
├── example.js               # Programmatic code example
├── test.js                  # Automated test suite
├── server.js                # Express Web Server
└── package.json
```
