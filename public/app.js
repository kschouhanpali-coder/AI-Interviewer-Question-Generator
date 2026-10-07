/**
 * InterviewForge — Client Logic
 * Handles presets, form controls, tabs, filters, and exports.
 */

let currentResult = null;
let presetsData = {};

document.addEventListener('DOMContentLoaded', () => {
  initPresets();
  initFormControls();
  initTabs();
  initFilters();
});

/* ============================
   1. Presets
   ============================ */
async function initPresets() {
  try {
    const res = await fetch('/api/presets');
    const json = await res.json();
    if (json.success) {
      presetsData = json.presets;
      applyPreset('fullstack_fresher');
    }
  } catch (err) {
    console.error('Failed to load presets:', err);
  }

  const container = document.getElementById('presets-container');
  container.addEventListener('click', (e) => {
    const pill = e.target.closest('.preset-pill');
    if (!pill) return;
    container.querySelectorAll('.preset-pill').forEach(p => p.classList.remove('active'));
    pill.classList.add('active');
    applyPreset(pill.getAttribute('data-preset'));
  });

  document.getElementById('resetBtn').addEventListener('click', () => {
    const active = container.querySelector('.preset-pill.active');
    if (active) {
      applyPreset(active.getAttribute('data-preset'));
      showToast('🔄 Reset to preset defaults');
    }
  });
}

function applyPreset(key) {
  const p = presetsData[key];
  if (!p) return;

  document.getElementById('jobTitle').value = p.jobTitle || '';
  document.getElementById('experienceLevel').value = p.experienceLevel || 'Fresher';
  document.getElementById('interviewType').value = p.interviewType || 'Mixed';
  document.getElementById('numQuestions').value = p.numQuestions || 10;
  document.getElementById('numQuestionsVal').textContent = p.numQuestions || 10;
  document.getElementById('keySkills').value = p.keySkills || '';
  document.getElementById('jobDescription').value = p.jobDescription || '';

  if (p.difficultyMix) {
    const e = p.difficultyMix.easy || 40;
    const m = p.difficultyMix.medium || 50;
    const h = p.difficultyMix.hard || 10;
    document.getElementById('diffEasy').value = e;
    document.getElementById('easyVal').textContent = `${e}%`;
    document.getElementById('diffMed').value = m;
    document.getElementById('medVal').textContent = `${m}%`;
    document.getElementById('diffHard').value = h;
    document.getElementById('hardVal').textContent = `${h}%`;
    updateRatioSummary(e, m, h);
  }
}

function updateRatioSummary(e, m, h) {
  const el = document.getElementById('ratioSummary');
  if (el) el.textContent = `${e}% / ${m}% / ${h}%`;
}

/* ============================
   2. Form Controls
   ============================ */
function initFormControls() {
  // Questions slider
  const numQ = document.getElementById('numQuestions');
  const numQVal = document.getElementById('numQuestionsVal');
  numQ.addEventListener('input', () => { numQVal.textContent = numQ.value; });

  // Difficulty sliders
  const diffEasy = document.getElementById('diffEasy');
  const diffMed = document.getElementById('diffMed');
  const diffHard = document.getElementById('diffHard');
  const easyVal = document.getElementById('easyVal');
  const medVal = document.getElementById('medVal');
  const hardVal = document.getElementById('hardVal');

  const onDiff = () => {
    easyVal.textContent = `${diffEasy.value}%`;
    medVal.textContent = `${diffMed.value}%`;
    hardVal.textContent = `${diffHard.value}%`;
    updateRatioSummary(diffEasy.value, diffMed.value, diffHard.value);
  };
  diffEasy.addEventListener('input', onDiff);
  diffMed.addEventListener('input', onDiff);
  diffHard.addEventListener('input', onDiff);

  // Provider / API key visibility
  const providerSel = document.getElementById('provider');
  const apiKeyGroup = document.getElementById('apiKeyGroup');
  providerSel.addEventListener('change', () => {
    apiKeyGroup.classList.toggle('hidden', providerSel.value === 'offline');
  });

  // API key visibility toggle
  const toggleApiKey = document.getElementById('toggleApiKey');
  const apiKeyInput = document.getElementById('apiKey');
  toggleApiKey.addEventListener('click', () => {
    const show = apiKeyInput.type === 'password';
    apiKeyInput.type = show ? 'text' : 'password';
    toggleApiKey.innerHTML = show
      ? `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`
      : `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`;
  });

  // Clear JD button
  document.getElementById('clearJdBtn').addEventListener('click', () => {
    document.getElementById('jobDescription').value = '';
    document.getElementById('jobDescription').focus();
  });

  // Form submit
  document.getElementById('generator-form').addEventListener('submit', handleFormSubmit);
}

/* ============================
   3. Tabs
   ============================ */
function initTabs() {
  const allTabBtns = document.querySelectorAll('.tab-btn');
  allTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      allTabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const target = btn.getAttribute('data-tab');
      document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));
      const map = {
        'tab-questions': 'pane-questions',
        'tab-rubric': 'pane-rubric',
        'tab-overview': 'pane-overview'
      };
      if (map[target]) {
        document.getElementById(map[target])?.classList.add('active');
      }
    });
  });
}

/* ============================
   4. Filters
   ============================ */
function initFilters() {
  const catFilter = document.getElementById('filterCategory');
  const diffFilter = document.getElementById('filterDiff');

  const applyFilters = () => {
    const catVal = catFilter.value;
    const diffVal = diffFilter.value;

    document.querySelectorAll('.question-card-neat').forEach(card => {
      const cardCat = card.getAttribute('data-category') || '';
      const cardDiff = card.getAttribute('data-difficulty') || '';
      const matchCat = catVal === 'all' || cardCat.toLowerCase().includes(catVal.toLowerCase());
      const matchDiff = diffVal === 'all' || cardDiff.toLowerCase() === diffVal.toLowerCase();
      card.classList.toggle('hidden', !(matchCat && matchDiff));
    });
  };

  catFilter.addEventListener('change', applyFilters);
  diffFilter.addEventListener('change', applyFilters);
}

/* ============================
   5. Form Submission
   ============================ */
async function handleFormSubmit(e) {
  e.preventDefault();

  const generateBtn = document.getElementById('generateBtn');
  const spinner = document.getElementById('submitSpinner');
  const btnLabel = document.getElementById('btnLabel');
  const overlay = document.getElementById('gen-overlay');
  const overlayMsg = document.getElementById('gen-status-msg');

  const payload = {
    jobTitle: document.getElementById('jobTitle').value.trim(),
    experienceLevel: document.getElementById('experienceLevel').value,
    interviewType: document.getElementById('interviewType').value,
    numQuestions: parseInt(document.getElementById('numQuestions').value, 10),
    difficultyMix: {
      easy: parseInt(document.getElementById('diffEasy').value, 10),
      medium: parseInt(document.getElementById('diffMed').value, 10),
      hard: parseInt(document.getElementById('diffHard').value, 10)
    },
    keySkills: document.getElementById('keySkills').value.trim(),
    provider: document.getElementById('provider').value,
    apiKey: document.getElementById('apiKey').value.trim(),
    jobDescription: document.getElementById('jobDescription').value.trim()
  };

  generateBtn.disabled = true;
  spinner.classList.remove('hidden');
  btnLabel.textContent = 'Generating...';

  // Show status overlay with rotating messages
  const messages = [
    'Analysing job requirements…',
    'Structuring multi-tier questions…',
    'Formulating evaluation rubric & criteria…',
    'Finalising interview suite pack…'
  ];
  let msgIdx = 0;
  if (overlayMsg) overlayMsg.textContent = messages[0];
  if (overlay) overlay.classList.remove('hidden');
  const statusTimer = setInterval(() => {
    msgIdx = (msgIdx + 1) % messages.length;
    if (overlayMsg) overlayMsg.textContent = messages[msgIdx];
  }, 1200);

  try {
    const res = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Server error');

    currentResult = json.data;
    renderResults(currentResult, json.elapsedSeconds);
    showToast('✨ Interview suite generated successfully!');
  } catch (err) {
    console.error(err);
    showToast(`❌ ${err.message}`);
  } finally {
    clearInterval(statusTimer);
    if (overlay) overlay.classList.add('hidden');
    generateBtn.disabled = false;
    spinner.classList.add('hidden');
    btnLabel.textContent = 'Generate Interview Suite';
  }
}

/* ============================
   6. Render Results
   ============================ */
function renderResults(data, elapsed) {
  document.getElementById('empty-state').classList.add('hidden');
  const container = document.getElementById('output-container');
  container.classList.remove('hidden');


  // Tab count
  const tabQCount = document.getElementById('tab-q-count');
  if (tabQCount) tabQCount.textContent = data.questions ? data.questions.length : 0;

  // Switch to questions tab
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelector('[data-tab="tab-questions"]')?.classList.add('active');
  document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
  document.getElementById('pane-questions')?.classList.add('active');

  // Render questions
  const list = document.getElementById('output-questions-list');
  list.innerHTML = '';
  const stats = { easy: 0, medium: 0, hard: 0 };

  (data.questions || []).forEach(q => {
    const diff = q.difficulty || 'Medium';
    const diffL = diff.toLowerCase();
    if (diffL.includes('easy')) stats.easy++;
    else if (diffL.includes('hard')) stats.hard++;
    else stats.medium++;

    let catClass = 'cat-tech';
    if (q.category && q.category.includes('Scenario')) catClass = 'cat-scen';
    else if (q.category && q.category.includes('Behavioral')) catClass = 'cat-behave';
    else if (q.category && q.category.includes('Role-Fit')) catClass = 'cat-fit';

    let diffDot = 'medium';
    if (diffL.includes('easy')) diffDot = 'easy';
    else if (diffL.includes('hard')) diffDot = 'hard';

    const bullets = Array.isArray(q.expectedKeyPoints)
      ? q.expectedKeyPoints.map(pt => `<li><span class="check-bullet">✔</span> <span>${pt}</span></li>`).join('')
      : `<li><span class="check-bullet">✔</span> <span>${q.expectedKeyPoints}</span></li>`;

    const card = document.createElement('div');
    card.className = 'question-card-neat';
    card.setAttribute('data-category', q.category || 'General');
    card.setAttribute('data-difficulty', diff);
    card.innerHTML = `
      <div class="q-top-row">
        <div class="q-left-group">
          <div class="q-index-pill">#${q.number}</div>
          <span class="category-chip ${catClass}">${q.category || 'General'}</span>
        </div>
        <div class="q-right-group">
          <span class="skill-tag-neat">${q.skillTested || ''}</span>
          <span class="diff-chip-dot ${diffDot}">
            <span class="diff-dot"></span>${diff}
          </span>
        </div>
      </div>
      <div class="q-main-text">${q.question}</div>
      <div class="expected-panel">
        <div class="expected-head">Expected in a Strong Answer</div>
        <ul class="expected-checklist">${bullets}</ul>
      </div>
    `;
    list.appendChild(card);
  });

  // Stats chips
  const statsWrap = document.getElementById('question-stats-badges');
  if (statsWrap) {
    statsWrap.innerHTML = `
      <span class="pill-stat diff-chip-dot easy">${stats.easy} Easy</span>
      <span class="pill-stat diff-chip-dot medium">${stats.medium} Med</span>
      <span class="pill-stat diff-chip-dot hard">${stats.hard} Hard</span>
    `;
  }

  // Helper to remove redundant prefix like 'Poor: ' or 'Developing: '
  const cleanLevelText = (txt) => {
    if (!txt) return '—';
    return txt.replace(/^(Level\s*\d+\s*[-—:]?\s*)?(Poor|Developing|Satisfactory|Advanced|Excellent)\s*[-—:]\s*/i, '').trim();
  };

  // Rubric criterion cards
  const cardsWrap = document.getElementById('rubricCardsContainer');
  if (cardsWrap && data.rubric?.criteria) {
    cardsWrap.innerHTML = '';
    data.rubric.criteria.forEach(c => {
      const el = document.createElement('div');
      el.className = 'criterion-card';
      const l = c.levels || {};
      el.innerHTML = `
        <div class="criterion-header">
          <span class="criterion-name">${c.name}</span>
          <span class="criterion-weight">${c.weightage}% Weight</span>
        </div>
        <div class="criterion-levels-grid">
          <div class="level-card lvl-1">
            <span class="level-pill lvl-1">1</span>
            <div class="level-info">
              <span class="level-title">Poor</span>
              <p class="level-desc">${cleanLevelText(l['1'])}</p>
            </div>
          </div>
          <div class="level-card lvl-2">
            <span class="level-pill lvl-2">2</span>
            <div class="level-info">
              <span class="level-title">Developing</span>
              <p class="level-desc">${cleanLevelText(l['2'])}</p>
            </div>
          </div>
          <div class="level-card lvl-3">
            <span class="level-pill lvl-3">3</span>
            <div class="level-info">
              <span class="level-title">Satisfactory</span>
              <p class="level-desc">${cleanLevelText(l['3'])}</p>
            </div>
          </div>
          <div class="level-card lvl-4">
            <span class="level-pill lvl-4">4</span>
            <div class="level-info">
              <span class="level-title">Advanced</span>
              <p class="level-desc">${cleanLevelText(l['4'])}</p>
            </div>
          </div>
          <div class="level-card lvl-5">
            <span class="level-pill lvl-5">5</span>
            <div class="level-info">
              <span class="level-title">Excellent</span>
              <p class="level-desc">${cleanLevelText(l['5'])}</p>
            </div>
          </div>
        </div>
      `;
      cardsWrap.appendChild(el);
    });
  }

  // Rubric comparison table
  const tbody = document.getElementById('rubric-tbody');
  if (tbody && data.rubric?.criteria) {
    tbody.innerHTML = '';
    data.rubric.criteria.forEach(c => {
      const l = c.levels || {};
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong style="color:#f1f5f9">${c.name}</strong></td>
        <td><span style="font-family:var(--mono);font-size:0.78rem;color:#a5b4fc">${c.weightage}%</span></td>
        <td style="color:#fca5a5">${cleanLevelText(l['1'])}</td>
        <td style="color:#fdba74">${cleanLevelText(l['2'])}</td>
        <td style="color:#fde047">${cleanLevelText(l['3'])}</td>
        <td style="color:#7dd3fc">${cleanLevelText(l['4'])}</td>
        <td style="color:#6ee7b7">${cleanLevelText(l['5'])}</td>
      `;
      tbody.appendChild(tr);
    });
  }

  // Formula
  const formulaEl = document.getElementById('output-formula');
  if (formulaEl) formulaEl.textContent = data.rubric?.formula || 'Final Score = (Technical Depth × 0.50) + (Relevance × 0.30) + (Difficulty × 0.20)';

  // Bands
  const bandsWrap = document.getElementById('output-bands-grid');
  if (bandsWrap) {
    bandsWrap.innerHTML = '';
    (data.rubric?.bands || []).forEach(b => {
      let vColor = '#60a5fa';
      if (b.verdict && b.verdict.includes('Strong')) vColor = '#34d399';
      else if (b.verdict && b.verdict.includes('Border')) vColor = '#fbbf24';
      else if (b.verdict && b.verdict.includes('Reject')) vColor = '#fb7185';
      const tile = document.createElement('div');
      tile.className = 'band-tile';
      tile.innerHTML = `
        <span class="band-score">${b.range}</span>
        <span class="band-name" style="color:${vColor}">${b.verdict}</span>
        <span class="band-info">${b.description}</span>
      `;
      bandsWrap.appendChild(tile);
    });
  }

  // Overview & Tips
  const summaryEl = document.getElementById('output-summary');
  if (summaryEl) summaryEl.textContent = data.roleSummary || '';

  const assumpBox = document.getElementById('output-assumptions-box');
  const assumpList = document.getElementById('output-assumptions-list');
  if (assumpList) {
    assumpList.innerHTML = '';
    if (data.assumptions && data.assumptions.length > 0) {
      assumpBox?.classList.remove('hidden');
      data.assumptions.forEach(a => {
        const li = document.createElement('li');
        li.textContent = a;
        assumpList.appendChild(li);
      });
    } else {
      assumpBox?.classList.add('hidden');
    }
  }

  const tipsGrid = document.getElementById('output-tips-list');
  if (tipsGrid) {
    tipsGrid.innerHTML = '';
    (data.interviewerTips || []).forEach((tip, i) => {
      const tile = document.createElement('div');
      tile.className = 'tip-tile';
      tile.innerHTML = `<div class="tip-num-badge">0${i + 1}</div><div class="tip-body">${tip}</div>`;
      tipsGrid.appendChild(tile);
    });
  }

  if (window.innerWidth <= 1100) {
    container.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

/* ============================
   7. Export Actions
   ============================ */

function buildMarkdown(data) {
  let md = `# Interview Suite — ${data.metadata?.jobTitle || 'Role'}\n\n`;
  md += `## Role Summary\n${data.roleSummary || ''}\n\n`;

  if (data.assumptions?.length) {
    md += `## Assumptions\n`;
    data.assumptions.forEach(a => { md += `- ${a}\n`; });
    md += '\n';
  }

  md += `## Interview Questions\n\n`;
  md += `| # | Category | Question | Skill Tested | Difficulty | Key Points |\n`;
  md += `|---|----------|----------|--------------|------------|------------|\n`;
  (data.questions || []).forEach(q => {
    const pts = Array.isArray(q.expectedKeyPoints) ? q.expectedKeyPoints.join('; ') : q.expectedKeyPoints;
    const cleanQ = (q.question || '').replace(/\|/g, '\\|').replace(/\n/g, ' ');
    md += `| ${q.number} | ${q.category} | ${cleanQ} | ${q.skillTested} | ${q.difficulty} | ${pts} |\n`;
  });
  md += '\n';

  if (data.rubric?.criteria) {
    md += `## Evaluation Rubric\n\n`;
    md += `| Criterion | Weight | 1 Poor | 2 Developing | 3 Satisfactory | 4 Advanced | 5 Excellent |\n`;
    md += `|-----------|--------|--------|--------------|----------------|------------|-------------|\n`;
    data.rubric.criteria.forEach(c => {
      const l = c.levels || {};
      md += `| **${c.name}** | ${c.weightage}% | ${l['1']||'—'} | ${l['2']||'—'} | ${l['3']||'—'} | ${l['4']||'—'} | ${l['5']||'—'} |\n`;
    });
    md += '\n';
  }

  if (data.rubric?.formula) md += `### Formula\n\`\`\`\n${data.rubric.formula}\n\`\`\`\n\n`;

  if (data.interviewerTips?.length) {
    md += `## Interviewer Tips\n`;
    data.interviewerTips.forEach(t => { md += `- ${t}\n`; });
  }
  return md;
}

function buildCsv(data) {
  const header = ['"#"', '"Category"', '"Question"', '"Skill Tested"', '"Difficulty"', '"Key Points"'];
  const rows = (data.questions || []).map(q => {
    const pts = Array.isArray(q.expectedKeyPoints) ? q.expectedKeyPoints.join('; ') : q.expectedKeyPoints;
    return [
      `"${q.number}"`,
      `"${(q.category || '').replace(/"/g, '""')}"`,
      `"${(q.question || '').replace(/"/g, '""')}"`,
      `"${(q.skillTested || '').replace(/"/g, '""')}"`,
      `"${q.difficulty}"`,
      `"${(pts || '').replace(/"/g, '""')}"`
    ].join(',');
  });
  return [header.join(','), ...rows].join('\n');
}

function downloadFile(content, filename, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function slugify(name) {
  return (name || 'interview').toLowerCase().replace(/[^a-z0-9]+/g, '_');
}

/* ============================
   8. Toast
   ============================ */
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.remove('hidden');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.add('hidden'), 2800);
}
