// ============================================================
// REVIEWER.JS — Study reviewer mode (browse questions by topic)
// ============================================================

const Reviewer = (() => {
  let _subject  = null;
  let _pool     = [];
  let _idx      = 0;
  let _revealed = false;

  const SUBJECTS = [
    { id: 'Mathematics',      label: 'Mathematics',              short: 'Math',  icon: 'ti-math',           cls: 'math', weight: '20%' },
    { id: 'GEAS',             label: 'GEAS',                     short: 'GEAS',  icon: 'ti-flask',          cls: 'geas', weight: '20%' },
    { id: 'Electronics Eng.', label: 'Electronics Engineering',  short: 'Elex',  icon: 'ti-circuit-diode',  cls: 'elex', weight: '30%' },
    { id: 'EST',              label: 'Electronics Systems & Tech',short: 'EST',  icon: 'ti-antenna',        cls: 'est',  weight: '30%' },
  ];

  // ── Subject grid ─────────────────────────────────────────────
  function renderSubjectGrid() {
    const grid = $('reviewerSubjectGrid');
    if (!grid) return;
    grid.innerHTML = SUBJECTS.map(s => {
      const count = AppState.questionBank.filter(q => q.subject === s.id).length;
      return `
        <div class="subject-card" data-subject="${s.id}" onclick="Reviewer.selectSubject('${s.id}')">
          <i class="ti ${s.icon} subject-icon" style="color:var(--accent2)"></i>
          <div class="subject-name">${s.label}</div>
          <div class="subject-meta">${count} question${count !== 1 ? 's' : ''}</div>
          <span class="subject-weight">${s.weight} of board exam</span>
        </div>`;
    }).join('');
  }

  // ── Select subject ───────────────────────────────────────────
  function selectSubject(subjectId) {
    _subject  = subjectId;
    _idx      = 0;
    _revealed = false;
    _pool     = shuffle(AppState.questionBank.filter(q => q.subject === subjectId));

    if (!_pool.length) { showToast('No questions for this subject.', 'error'); return; }

    $all('.subject-card').forEach(c => c.classList.toggle('active', c.dataset.subject === subjectId));
    const section = $('reviewerQSection');
    if (section) section.style.display = 'block';
    _renderQ();
  }

  // ── Render current question ───────────────────────────────────
  function _renderQ() {
    if (!_pool.length) return;
    _revealed = false;
    const q   = _pool[_idx];

    setText('reviewerProgress', `${_idx + 1} / ${_pool.length}`);
    $('reviewerQText').innerHTML = q.q;
    $('reviewerQMeta').innerHTML = `
      <span class="pill pill-${q.subClass}">${q.subject}</span>
      <span class="pill pill-${(q.difficulty || '').toLowerCase()}">${q.difficulty}</span>
      <span class="pill" style="background:var(--surface2);color:var(--text3)">${q.topic}</span>
    `;

    const choicesEl = $('reviewerChoices');
    choicesEl.innerHTML = q.choices.map((ch, ci) => `
      <div class="choice-btn" id="rchoice_${ci}" onclick="Reviewer.selectChoice(${ci})">
        <span class="choice-letter">${choiceLetter(ci)}</span>
        <span>${ch}</span>
      </div>
    `).join('');

    const solBox = $('reviewerSolution');
    if (solBox) { solBox.style.display = 'none'; solBox.innerHTML = ''; }

    const revBtn = $('reviewerRevealBtn');
    if (revBtn)  { revBtn.style.display = 'inline-flex'; revBtn.innerHTML = '<i class="ti ti-eye"></i> Show Answer'; }
  }

  // ── Select choice (self-quiz mode) ───────────────────────────
  function selectChoice(ci) {
    if (_revealed) return;
    const q = _pool[_idx];
    $all('.choice-btn', $('reviewerChoices')).forEach((btn, i) => {
      btn.disabled = true;
      if (i === q.answer) btn.classList.add('reveal-correct');
      if (i === ci && ci !== q.answer) btn.classList.add('chosen-wrong');
    });
    _revealed = true;
    _showSolution();
  }

  // ── Reveal answer ─────────────────────────────────────────────
  function revealSolution() {
    if (_revealed) return;
    const q = _pool[_idx];
    $all('.choice-btn', $('reviewerChoices')).forEach((btn, i) => {
      btn.disabled = true;
      if (i === q.answer) btn.classList.add('reveal-correct');
    });
    _revealed = true;
    _showSolution();
  }

  function _showSolution() {
    const q      = _pool[_idx];
    const solBox = $('reviewerSolution');
    if (solBox) {
      solBox.innerHTML     = q.solution
        ? `<div class="solution-label"><i class="ti ti-bulb"></i> Solution</div>${q.solution}`
        : `<div class="solution-label"><i class="ti ti-check"></i> Correct Answer</div>${q.choices[q.answer]}`;
      solBox.style.display = 'block';
    }
    const revBtn = $('reviewerRevealBtn');
    if (revBtn) revBtn.style.display = 'none';
  }

  // ── Navigate ─────────────────────────────────────────────────
  function navigate(dir) {
    const next = _idx + dir;
    if (next >= 0 && next < _pool.length) { _idx = next; _renderQ(); }
  }

  function reshuffle() {
    _pool = shuffle(_pool);
    _idx  = 0;
    _renderQ();
    showToast('Questions reshuffled!', 'success', 2000);
  }

  return { renderSubjectGrid, selectSubject, selectChoice, revealSolution, navigate, reshuffle };
})();
