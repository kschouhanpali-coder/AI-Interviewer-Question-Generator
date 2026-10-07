<div align="center">

# 🎯 InterviewForge 🎯

### Design. Evaluate. Hire Better.

![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)
![Version](https://img.shields.io/badge/Version-1.0.0-green?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Live-brightgreen?style=for-the-badge)
![Type](https://img.shields.io/badge/Type-AI%20Interview%20Designer-7C3AED?style=for-the-badge)

An AI-powered interview designer for campus placements and corporate hiring. Paste a job description, pick the experience level and difficulty mix, and get role-specific questions, a 1–5 evaluation rubric, and interviewer tips, all in seconds.

*From job description to interview pack, in a few clicks.*

</div>

---

## 🚀 Live Demo

<div align="center">

### **[▶️ LAUNCH INTERVIEWFORGE - Live Demo](https://ai-interviewer-question.netlify.app)**

*Pick a preset, hit Generate, and get a complete interview suite right in your browser!*

</div>

---

## ✨ Features

- ⚡ **Instant Generation** - A complete interview suite in seconds
- 📄 **JD-Grounded Questions** - Questions based on your job description
- 🗂️ **4 Categories** - Technical, Scenario, Behavioral, and Role-Fit
- 🎛️ **Role Configuration** - Job title, experience level, interview type, question count, and key skills
- 📊 **Difficulty Split** - Control the Easy / Medium / Hard mix (default 40% / 50% / 10%)
- 🧪 **Quick Presets** - Full Stack Dev, Data Analyst, DevOps & Cloud, AI/ML Engineer
- 🔍 **Filters** - Filter questions by category and difficulty
- 📝 **Evaluation Rubric** - 1–5 grading scale with detailed criteria and a comparison matrix
- 🧮 **Weighted Formula** - Consistent, fair scoring across candidates
- 🏷️ **Interpretation Bands** - Turn final scores into clear hiring decisions
- 👔 **Role Summary & Placement Scope** - A quick overview of the role
- ✅ **Interviewer Best Practices** - Guidelines for structured, bias-free interviews
- 🔌 **Multiple Engines** - Offline mode with no key, or Groq, Gemini, and OpenAI

---

## 🏁 Quick Start

### Use Online
No installation needed! [Launch the live demo](https://ai-interviewer-question.netlify.app)

### Run Locally

**Prerequisites:** A modern web browser (Node.js is optional, for a local server)

1. Clone the repository:
```bash
git clone https://github.com/kschouhanpali-coder/ai-interviewer-question.git
cd ai-interviewer-question
```

2. (Optional) Add your API key for AI engines:
```bash
cp .env.example .env
```
```env
GROQ_API_KEY=your_groq_key
GEMINI_API_KEY=your_gemini_key
OPENAI_API_KEY=your_openai_key
```

3. Start the app:
```bash
npx serve .
```
Or simply open `index.html` in your browser.

4. Open `http://localhost:3000` and generate your first interview suite

> The **Smart Offline** engine works with no API key. Never commit your `.env` file.

---

## 🎯 How to Use

1. **Choose a preset** or enter your own **Job Title**
2. **Configure** the experience level, interview type, number of questions, and difficulty split
3. **Paste the Job Description** and add optional key skills
4. **Select an engine** - Smart Offline, Groq, Gemini, or OpenAI
5. **Generate** - click **Generate Interview Suite**
6. **Review** - browse questions, filter by category or difficulty, and open the rubric and tips

---

## 🗂️ App Workspace

| Tab | Description |
|------|-------------|
| **❓ Questions** | Generated questions with category and difficulty filters |
| **📝 Evaluation Rubric** | 1–5 criteria matrix, weighted formula, and interpretation bands |
| **👔 Role & Tips** | Role summary, placement scope, baseline assumptions, and interviewer best practices |

---

## ⚙️ Configuration Options

| Option | Choices |
|------|-------------|
| **Job Title** | Free text (required) |
| **Experience Level** | Fresher (0 yrs), Junior (1–2 yrs), Mid (3–5 yrs), Senior (5+ yrs) |
| **Interview Type** | Mixed (Tech + HR), Technical Only, Behavioral & HR |
| **Total Questions** | 4 to 24 (default 10) |
| **Difficulty Split** | Easy / Medium / Hard (default 40% / 50% / 10%) |
| **Engine** | Smart Offline, Groq Llama 3.3 70B, Gemini 2.5 Flash, GPT-4o Mini |

---

## 📊 Evaluation Rubric

Every answer is scored from **1 (Poor)** to **5 (Excellent)**:

| Criterion | Weight |
|------|-------------|
| **Technical Depth** | 50% |
| **Relevance** | 30% |
| **Difficulty Handling** | 20% |

```
Final Score = (Technical Depth × 0.50) + (Relevance × 0.30) + (Difficulty × 0.20)
```

---

## 💻 Technologies Used

- **Frontend:** HTML5, CSS3, JavaScript
- **AI Engines:** Groq (Llama 3.3 70B), Google Gemini 2.5 Flash, OpenAI GPT-4o Mini
- **Offline Mode:** Built-in Smart Offline generator (no API key)
- **Config:** `.env` for API keys
- **Deployment:** Netlify

---

## 📁 Project Structure

```
ai-interviewer-question/
├── index.html        # Main application file
├── assets/           # CSS and JS (if separate files)
├── .env.example      # API key template
├── netlify.toml      # Netlify config
└── README.md
```

---

## 📝 License

MIT License - Free to use and modify

---

<div align="center">

**[Live Demo](https://ai-interviewer-question.netlify.app) | [GitHub](https://github.com/kschouhanpali-coder/ai-interviewer-question) | [Report Issues](https://github.com/kschouhanpali-coder/ai-interviewer-question/issues)**

*From job description to interview pack, in a few clicks.* 🎯

</div>
