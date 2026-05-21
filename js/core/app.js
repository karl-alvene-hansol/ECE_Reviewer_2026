// ============================================================
// APP.JS — Bootstrap, Page Routing, Render Helpers
// ============================================================

// ── Bootstrap: load CSV ──────────────────────────────────────
async function loadQuestionBanks() {
  _showLoader(true);

  const CSV_PATH = 'data/questions/Mock_Board_Exam_200_Items.csv';

  try {
    const questions = await CSVLoader.load(CSV_PATH);
    _applyQuestionBank(questions);
  } catch (err) {
    console.error('[app] CSV load failed:', err);
    showToast('Failed to load questions. Check the CSV path.', 'error', 6000);
    _showLoader(false);
  }
}

function _applyQuestionBank(questions) {
  AppState.questionBank = questions;
  AppState.bankReady    = true;
  console.log(`[app] ${questions.length} questions ready.`);
  _showLoader(false);
  initApp();
}

function _showLoader(show) {
  const el = $('appLoader');
  if (el) el.style.display = show ? 'flex' : 'none';
}

// ── App init ──────────────────────────────────────────────────
function initApp() {
  applyTheme(Storage.getTheme());
  AppState.session.seenQuestions = Storage.loadSeenIds();
  AppState.session.examHistory   = Storage.getHistory();

  Reviewer.renderSubjectGrid();
  updateHomeStats();
  renderAnalytics();
  renderHistory();
  renderSetupPanel();

  showPage('homePage');
  console.log('[app] ECE Board Reviewer ready.');
}

// ── Theme ─────────────────────────────────────────────────────
function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  AppState.ui.theme = theme;
  Storage.saveTheme(theme);
  const btn = $('themeToggle');
  if (btn) btn.innerHTML = theme === 'dark'
    ? '<i class="ti ti-sun"></i> Light'
    : '<i class="ti ti-moon"></i> Dark';
}

function toggleTheme() {
  applyTheme(AppState.ui.theme === 'dark' ? 'light' : 'dark');
}

// ── Sidebar ───────────────────────────────────────────────────
function toggleSidebar() {
  const sidebar = $('sidebar');
  const overlay = $('sidebarOverlay');
  const isOpen  = sidebar.classList.toggle('open');
  overlay.classList.toggle('visible', isOpen);
  AppState.ui.sidebarOpen = isOpen;
}

function closeSidebar() {
  $('sidebar').classList.remove('open');
  $('sidebarOverlay').classList.remove('visible');
  AppState.ui.sidebarOpen = false;
}

// ── Page routing ──────────────────────────────────────────────
function showPage(pageId) {
  $all('.page').forEach(p => p.classList.remove('active'));
  $all('.nav-btn').forEach(b => b.classList.remove('active'));

  const page   = $(pageId);
  if (page) page.classList.add('active');

  const navBtn = $q(`[data-page="${pageId}"]`);
  if (navBtn) navBtn.classList.add('active');

  AppState.ui.currentPage = pageId;

  if (pageId === 'checklistPage') Checklist.init();
  if (pageId === 'reviewerPage')  Reviewer.renderSubjectGrid();
}

// ── Home stats ────────────────────────────────────────────────
function updateHomeStats() {
  const total   = AppState.session.totalAnswered;
  const correct = AppState.session.totalCorrect;
  const pct     = total > 0 ? Math.round((correct / total) * 100) : 0;

  setText('statTotalQ',    AppState.questionBank.length);
  setText('statAnswered',  total);
  setText('statAccuracy',  total > 0 ? `${pct}%` : '—');
  setText('statBestScore', AppState.session.bestPct > 0 ? `${AppState.session.bestPct}%` : '—');
}

// ── Setup panel ───────────────────────────────────────────────
function renderSetupPanel() {
  // Subject dropdown
  const sel = $('setupSubject');
  if (sel) {
    const subjects = ['All', 'Mathematics', 'GEAS', 'Electronics Eng.', 'EST'];
    sel.innerHTML  = subjects.map(s => `<option value="${s}">${s}</option>`).join('');
    sel.value      = AppState.config.subject;
  }

  // Difficulty dropdown
  const dif = $('setupDifficulty');
  if (dif) {
    const levels = ['All', 'Easy', 'Moderate', 'Difficult'];
    dif.innerHTML = levels.map(l => `<option value="${l}">${l}</option>`).join('');
    dif.value     = AppState.config.difficulty;
  }

  renderCountChips();
  renderTimerChips();
}

function renderCountChips() {
  const el = $('countChips');
  if (!el) return;
  const opts = [10, 20, 30, 50, 100];
  el.innerHTML = opts.map(n => `
    <button class="count-chip ${n === AppState.config.count && !AppState.config.isBoardExam ? 'active' : ''}"
            onclick="setCount(${n})">${n}</button>
  `).join('');
}

function setCount(n) {
  AppState.config.count       = n;
  AppState.config.isBoardExam = false;
  renderCountChips();
  // Deactivate board exam button if active
  const boardBtn = $('boardExamBtn');
  if (boardBtn) boardBtn.classList.remove('active');
}

function renderTimerChips() {
  const el = $('timerChips');
  if (!el) return;
  const opts = [0, 15, 30, 60, 90, 120, 180];
  el.innerHTML = opts.map(m => `
    <button class="count-chip ${m === AppState.config.timerMinutes ? 'active' : ''}"
            onclick="setTimer(${m})">${m === 0 ? 'None' : m + 'm'}</button>
  `).join('');
}

function setTimer(m) {
  AppState.config.timerMinutes = m;
  renderTimerChips();
}

/** Activate 200-item full board exam mode */
function setBoardExam() {
  AppState.config.isBoardExam = true;
  AppState.config.count       = 200;
  // Highlight board exam button, deactivate count chips
  $all('.count-chip').forEach(c => c.classList.remove('active'));
  const boardBtn = $('boardExamBtn');
  if (boardBtn) boardBtn.classList.add('active');
  // Auto-set timer to 3h if none selected
  if (AppState.config.timerMinutes === 0) {
    AppState.config.timerMinutes = 180;
    renderTimerChips();
  }
}

// ── Start exam ────────────────────────────────────────────────
function startExam() {
  AppState.config.subject    = $('setupSubject')?.value    || 'All';
  AppState.config.difficulty = $('setupDifficulty')?.value || 'All';

  const pool = getFilteredPool(AppState.questionBank, AppState.config);
  if (pool.length === 0) {
    showToast('No questions match your filters.', 'error');
    return;
  }

  showPage('examPage');
  Exam.start(AppState.config);
}

// ── Render exam question ──────────────────────────────────────
function renderQuestion() {
  const { exam } = AppState;
  const q        = exam.questions[exam.currentIdx];
  const idx      = exam.currentIdx;
  const total    = exam.questions.length;
  const answered = exam.answered[idx];
  const answeredCount = exam.answered.filter(Boolean).length;

  // Progress bar
  const pct = Math.round((answeredCount / total) * 100);
  const progFill = $('examProgressFill');
  if (progFill) progFill.style.width = `${pct}%`;

  setText('examQNum',     `Question ${idx + 1} of ${total}`);
  setText('examProgress', `${answeredCount} answered`);

  // Timer badge
  const timerBadge = $('timerBadge');
  if (timerBadge) timerBadge.style.display = AppState.config.timerMinutes > 0 ? 'inline-flex' : 'none';

  // Question text & meta
  $('questionText').innerHTML = q.q;
  $('questionMeta').innerHTML = `
    <span class="question-num">Q${idx + 1}</span>
    <span class="pill pill-${q.subClass}">${q.subject}</span>
    <span class="pill pill-${(q.difficulty || '').toLowerCase()}">${q.difficulty}</span>
    <span style="font-size:0.78rem;color:var(--text3);margin-left:auto">${q.topic}</span>
  `;

  // Choices
  const choicesEl = $('choicesGrid');
  choicesEl.innerHTML = q.displayChoices.map((ch, ci) => {
    let cls = '';
    if (answered) {
      if (ci === q.displayAnswer)                                cls = 'reveal-correct';
      if (ci === exam.userAnswers[idx] && !exam.correctMap[idx]) cls = 'chosen-wrong';
      if (ci === exam.userAnswers[idx] &&  exam.correctMap[idx]) cls = 'chosen-correct';
    }
    return `
      <button class="choice-btn ${cls}"
              onclick="Exam.selectAnswer(${ci})"
              ${answered ? 'disabled' : ''}>
        <span class="choice-letter">${choiceLetter(ci)}</span>
        <span>${ch}</span>
        ${answered && ci === q.displayAnswer ? '<i class="ti ti-check" style="margin-left:auto;color:var(--green)"></i>' : ''}
        ${answered && ci === exam.userAnswers[idx] && !exam.correctMap[idx] ? '<i class="ti ti-x" style="margin-left:auto;color:var(--red)"></i>' : ''}
      </button>`;
  }).join('');

  // Answer feedback + solution box
  const solBox = $('solutionBox');
  if (solBox) {
    if (answered) {
      const isCorrect   = exam.correctMap[idx];
      const correctText = q.displayChoices[q.displayAnswer];
      const userText    = exam.userAnswers[idx] >= 0 ? q.displayChoices[exam.userAnswers[idx]] : null;

      solBox.innerHTML = `
        <div class="answer-verdict ${isCorrect ? 'verdict-correct' : 'verdict-wrong'}">
          <i class="ti ${isCorrect ? 'ti-circle-check' : 'ti-circle-x'}"></i>
          <span>${isCorrect ? 'Correct!' : 'Incorrect'}</span>
          ${!isCorrect && userText ? `<span class="verdict-your">Your answer: <strong>${userText}</strong></span>` : ''}
        </div>
        <div class="solution-correct-row">
          <i class="ti ti-check-circle" style="color:var(--green);flex-shrink:0"></i>
          <span>Correct answer: <strong style="color:var(--green)">${correctText}</strong></span>
        </div>
        <div class="solution-content" id="solutionContent">
          ${q.solution
            ? `<div class="solution-label"><i class="ti ti-book"></i> Solution</div>
               <div class="solution-body" id="solutionBody">${_escapeHtml(q.solution)}</div>
               <div class="solution-divider"></div>
               <div class="solution-label solution-label-ai"><i class="ti ti-bulb"></i> Detailed Explanation</div>
               <div class="solution-body" id="solutionExplBody">
                 <div class="solution-loading"><span class="solution-spinner"></span><span>Loading explanation…</span></div>
               </div>`
            : `<div class="solution-label"><i class="ti ti-bulb"></i> Explanation</div>
               <div class="solution-body" id="solutionExplBody">
                 <div class="solution-loading"><span class="solution-spinner"></span><span>Loading explanation…</span></div>
               </div>`
          }
        </div>
      `;
      solBox.style.display = 'block';

      // Render any LaTeX in solution text from CSV
      const solutionBodyEl = $('solutionBody');
      if (solutionBodyEl) LatexRenderer.renderAfterInsert(solutionBodyEl);

      // Render LaTeX in question text too
      const qTextEl = $('questionText');
      if (qTextEl) LatexRenderer.renderAfterInsert(qTextEl);

      // Render LaTeX in choices
      const choicesEl2 = $('choicesGrid');
      if (choicesEl2) LatexRenderer.renderAfterInsert(choicesEl2);

      // Load explanation (cached CSV solution = fallback, AI preferred)
      _loadExplanation(q, isCorrect, userText, correctText);
    } else {
      solBox.style.display = 'none';

      // Still render LaTeX in question and choices when just loading
      requestAnimationFrame(() => {
        const qEl = $('questionText');
        const cEl = $('choicesGrid');
        if (qEl) LatexRenderer.renderIn(qEl);
        if (cEl) LatexRenderer.renderIn(cEl);
      });
    }
  }

  // Prev / Next nav buttons (always visible, for reviewed questions)
  const prevBtn = $('examPrevBtn');
  const nextBtn = $('examNextBtn');
  if (prevBtn) prevBtn.disabled = idx === 0;
  if (nextBtn) nextBtn.disabled = idx === total - 1;

  // "Next Question" CTA — shown after answering if not on last question
  const nextQBtn = $('examNextQBtn');
  if (nextQBtn) {
    if (answered && idx < total - 1) {
      nextQBtn.style.display = 'inline-flex';
    } else {
      nextQBtn.style.display = 'none';
    }
  }

  // Submit button — show on last question (if answered) or when all answered
  const submitBtn = $('examSubmitBtn');
  if (submitBtn) {
    const isLastAndAnswered = idx === total - 1 && answered;
    const allAnswered = exam.answered.every(Boolean);
    submitBtn.style.display = (isLastAndAnswered || allAnswered) ? 'inline-flex' : 'none';
  }
}

// ── AI-powered explanation loader ─────────────────────────────
async function _loadExplanation(q, isCorrect, userAnswer, correctAnswer) {
  const explBodyEl = $('solutionExplBody');
  if (!explBodyEl) return;

  // Check session cache first
  const cacheKey = `expl_${q.id}`;
  const cached   = sessionStorage.getItem(cacheKey);
  if (cached) {
    explBodyEl.innerHTML = cached;
    LatexRenderer.renderAfterInsert(explBodyEl);
    return;
  }

  try {
    const prompt = `You are an expert ECE (Electronics and Communications Engineering) board exam tutor for Philippine licensure exams.

Question: ${q.q}
Subject: ${q.subject} | Topic: ${q.topic} | Difficulty: ${q.difficulty}
Choices:
${q.displayChoices.map((ch, i) => `  ${String.fromCharCode(65+i)}. ${ch}`).join('\n')}
Correct Answer: ${correctAnswer}
${userAnswer && !isCorrect ? `Student's Answer: ${userAnswer} (WRONG)` : ''}
${q.solution ? `Reference Solution: ${q.solution}` : ''}

Provide a clear, educational explanation using these sections (use plain HTML only — no markdown, no backtick fences):

1. <strong>Why the correct answer is right</strong> — explain the concept, formula, or reasoning. For math/engineering equations, use LaTeX delimiters: inline $...$ or display $$...$$.
2. <strong>Step-by-step solution</strong> (if computational) — show each step with LaTeX math where appropriate.
3. <strong>Key formula or concept</strong> — use LaTeX for equations, e.g. $V = IR$ or $$f = \\frac{1}{2\\pi\\sqrt{LC}}$$.
4. <strong>Why other choices are wrong</strong> — briefly note the trap for 1-2 distractors.

Use $...$ for inline math and $$...$$ for display/block math. Keep under 280 words. Use <br> for line breaks.`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model:      'claude-sonnet-4-20250514',
        max_tokens: 1000,
        messages:   [{ role: 'user', content: prompt }],
      }),
    });

    const data = await response.json();
    const html = (data.content || []).filter(b => b.type === 'text').map(b => b.text).join('');

    sessionStorage.setItem(cacheKey, html);

    // Re-find element (DOM may have changed if user navigated quickly)
    const el = $('solutionExplBody');
    if (el) {
      el.innerHTML = html;
      LatexRenderer.renderAfterInsert(el);
    }

  } catch (err) {
    console.warn('[explanation] API call failed:', err);
    const fallback = q.solution
      ? `<em style="color:var(--text3);font-size:0.82rem">AI explanation unavailable — see solution above.</em>`
      : `<em style="color:var(--text3);font-size:0.82rem">Review <strong>${q.topic}</strong> in <strong>${q.subject}</strong>.</em>`;
    const el = $('solutionExplBody');
    if (el) el.innerHTML = fallback;
  }
}

/** Escape HTML for safe insertion of plain-text CSV solution */
function _escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/\n/g, '<br>');
}

// ── Question map ──────────────────────────────────────────────
function openQMap() {
  const { exam } = AppState;
  const grid = $('qmapGrid');
  if (!grid) return;

  const frag = document.createDocumentFragment();
  exam.questions.forEach((q, i) => {
    const cell = document.createElement('div');
    let cls = 'qmap-cell';
    if (i === exam.currentIdx)      cls += ' current';
    else if (exam.answered[i])      cls += exam.correctMap[i] ? ' correct' : ' wrong';
    cell.className   = cls;
    cell.textContent = i + 1;
    cell.title       = `Q${i + 1}: ${q.subject}`;
    cell.onclick     = () => { Exam.goTo(i); closeModal('qmapModal'); };
    frag.appendChild(cell);
  });

  grid.innerHTML = '';
  grid.appendChild(frag);
  openModal('qmapModal');
}

// ── Submit confirm ────────────────────────────────────────────
function confirmSubmit() {
  const unanswered = AppState.exam.answered.filter(a => !a).length;
  if (unanswered > 0) {
    if (!confirm(`You have ${unanswered} unanswered question(s). Submit anyway?`)) return;
  }
  Exam.submit();
}

// ── Analytics ─────────────────────────────────────────────────
function renderAnalytics() {
  const stats  = Analytics.getSubjectStats();
  const barsEl = $('subjectBars');
  const colors = { Mathematics: '#3b82f6', GEAS: '#10b981', 'Electronics Eng.': '#f59e0b', EST: '#8b5cf6', Mixed: '#94a3b8' };

  if (barsEl) {
    barsEl.innerHTML = Object.keys(stats).length === 0
      ? '<p style="color:var(--text3);font-size:0.85rem">No exam history yet.</p>'
      : Object.entries(stats).map(([sub, s]) => `
          <div class="subject-bar-row">
            <span class="subject-bar-label">${sub.split(' ')[0]}</span>
            <div class="subject-bar-track">
              <div class="subject-bar-fill" style="width:${s.avg}%;background:${colors[sub] || 'var(--accent)'}"></div>
            </div>
            <span class="subject-bar-pct">${s.avg}%</span>
          </div>`).join('');
  }

  const weakEl = $('weakTopics');
  if (weakEl) {
    const weak = Analytics.getWeakTopics(Storage.getHistory());
    weakEl.innerHTML = weak.length === 0
      ? '<p style="color:var(--text3);font-size:0.85rem">No weak topics identified yet.</p>'
      : weak.slice(0, 5).map(t => `
          <div class="weak-topic-item">
            <span class="weak-topic-name">${t.topic}</span>
            <span class="weak-topic-pct">${t.pct}%</span>
          </div>`).join('');
  }
}

// ── History ───────────────────────────────────────────────────
function renderHistory() {
  const history = Storage.getHistory();
  const tbody   = $('historyBody');
  if (!tbody) return;

  if (history.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;color:var(--text3);padding:24px">No history yet.</td></tr>`;
    return;
  }

  tbody.innerHTML = history.slice(0, 20).map(r => `
    <tr>
      <td>${formatDate(r.date)}</td>
      <td>${r.isBoardExam ? '📋 Board' : (r.subject === 'All' ? 'Mixed' : r.subject)}</td>
      <td>${r.score} / ${r.total}</td>
      <td class="${r.pct >= 70 ? 'score-pass' : 'score-fail'}">${r.pct}%</td>
      <td>${r.pct >= 70
        ? '<span class="pill" style="background:rgba(16,185,129,0.12);color:var(--green)">PASS</span>'
        : '<span class="pill" style="background:rgba(239,68,68,0.12);color:var(--red)">FAIL</span>'}</td>
    </tr>`).join('');
}

// ── Reset ─────────────────────────────────────────────────────
function resetSession() {
  if (!confirm('Reset all progress and history? This cannot be undone.')) return;
  localStorage.clear();
  sessionStorage.clear();
  AppState.session = { totalAnswered: 0, totalCorrect: 0, bestPct: 0, seenQuestions: new Set(), examHistory: [] };
  updateHomeStats();
  renderAnalytics();
  renderHistory();
  showToast('Session reset.', 'success');
}

function confirmResetChecklist() {
  if (!confirm('Reset all checklist progress? This cannot be undone.')) return;
  Checklist.resetAll();
  Checklist.render('tosChecklistBody', '');
  Checklist.renderOverallProgress();
  showToast('Checklist reset.', 'success');
}

// ── Bootstrap ─────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', loadQuestionBanks);
