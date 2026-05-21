// ============================================================
// RESULTS.JS — Score rendering and post-exam answer review
// ============================================================

const Results = (() => {

  function render(exam, timeExpired = false) {
    const correct = exam.correctMap.filter(Boolean).length;
    const total   = exam.questions.length;
    const wrong   = exam.answered.filter((a, i) => a && !exam.correctMap[i]).length;
    const skipped = exam.answered.filter(a => !a).length;
    const pct     = Math.round((correct / total) * 100);
    const pass    = pct >= 70;

    showPage('resultsPage');

    // ── Score header ─────────────────────────────────────────
    $('resultsBadge').className = `result-badge ${pass ? 'pass' : 'fail'}`;
    $('resultsBadge').innerHTML = pass
      ? '<i class="ti ti-trophy"></i>'
      : '<i class="ti ti-x"></i>';

    setText('resultsHeadline', pass ? 'You Passed!' : 'Keep Practicing');
    setText('resultsSubline',
      timeExpired
        ? 'Time expired — auto-submitted.'
        : pass
          ? 'Great job on this mock board exam!'
          : 'Review the explanations below to improve.');

    setText('resultsScore', `${correct} / ${total}`);
    setText('resultsPct',   `${pct}%`);

    const bar = $('resultsPctBar');
    if (bar) {
      bar.style.width = `${pct}%`;
      bar.className   = `progress-fill ${pct >= 70 ? 'green' : pct >= 50 ? 'gold' : 'red'}`;
    }

    setText('resultsSubject', AppState.config.subject === 'All' ? 'Mixed' : AppState.config.subject);
    setText('resultsCorrect', correct);
    setText('resultsWrong',   wrong);
    setText('resultsSkipped', skipped);

    // ── Subject breakdown (board exam) ───────────────────────
    const breakdownEl = $('resultsBreakdown');
    if (breakdownEl) {
      const subjectStats = _buildSubjectBreakdown(exam);
      if (Object.keys(subjectStats).length > 1) {
        breakdownEl.style.display = 'block';
        breakdownEl.innerHTML = `
          <div class="card-title" style="margin-bottom:12px">Score by Subject</div>
          ${Object.entries(subjectStats).map(([sub, s]) => `
            <div class="subject-bar-row">
              <span class="subject-bar-label">${sub.split(' ')[0]}</span>
              <div class="subject-bar-track">
                <div class="subject-bar-fill" style="width:${s.pct}%;background:${_subjectColor(sub)}"></div>
              </div>
              <span class="subject-bar-pct">${s.correct}/${s.total} (${s.pct}%)</span>
            </div>
          `).join('')}
        `;
      } else {
        breakdownEl.style.display = 'none';
      }
    }

    // ── Review list ──────────────────────────────────────────
    _renderReviewList(exam);
  }

  // ── Private helpers ──────────────────────────────────────────

  function _renderReviewList(exam) {
    const reviewEl = $('reviewList');
    if (!reviewEl) return;

    // Use DocumentFragment for performance with 200 items
    const frag = document.createDocumentFragment();

    exam.questions.forEach((q, i) => {
      const userAns     = exam.userAnswers[i];
      const isCorrect   = exam.correctMap[i];
      const wasAnswered = exam.answered[i];
      const cachedExpl  = sessionStorage.getItem(`expl_${q.id}`);

      const item = document.createElement('div');
      item.className = `review-item ${isCorrect ? 'correct' : wasAnswered ? 'wrong' : 'skipped'}`;

      const statusIcon = isCorrect
        ? '<i class="ti ti-circle-check" style="color:var(--green)"></i>'
        : wasAnswered
          ? '<i class="ti ti-circle-x"     style="color:var(--red)"></i>'
          : '<i class="ti ti-circle-dot"   style="color:var(--gold)"></i>';

      // Build choices HTML with clear correct/wrong highlighting
      const choicesHtml = q.displayChoices.map((ch, ci) => {
        let cls = '';
        if (ci === q.displayAnswer)       cls = 'reveal-correct';
        if (ci === userAns && !isCorrect) cls = 'chosen-wrong';
        return `
          <div class="review-choice ${cls}">
            <span class="choice-letter">${choiceLetter(ci)}</span>
            <span class="review-choice-text">${ch}</span>
            ${ci === q.displayAnswer
              ? '<i class="ti ti-check" style="margin-left:auto;color:var(--green);flex-shrink:0"></i>'
              : ''}
            ${ci === userAns && !isCorrect
              ? '<i class="ti ti-x" style="margin-left:auto;color:var(--red);flex-shrink:0"></i>'
              : ''}
          </div>`;
      }).join('');

      // Build solution box: always show CSV solution + cached AI explanation
      let solutionHtml = '';
      if (q.solution || cachedExpl) {
        solutionHtml = `<div class="solution-box review-solution-box">`;
        if (q.solution) {
          solutionHtml += `
            <div class="solution-content">
              <div class="solution-label"><i class="ti ti-book"></i> Solution</div>
              <div class="solution-body">${_safeText(q.solution)}</div>
            </div>`;
        }
        if (cachedExpl) {
          solutionHtml += `
            <div class="solution-content" style="border-top:1px solid var(--border)">
              <div class="solution-label solution-label-ai"><i class="ti ti-bulb"></i> AI Explanation</div>
              <div class="solution-body">${cachedExpl}</div>
            </div>`;
        }
        solutionHtml += `</div>`;
      }

      item.innerHTML = `
        <div class="review-item-header">
          <span class="review-qnum">${statusIcon} Q${i + 1}</span>
          <span class="pill pill-${q.subClass}">${q.subject}</span>
          <span class="pill pill-${(q.difficulty || '').toLowerCase()}">${q.difficulty}</span>
          <span style="font-size:0.75rem;color:var(--text3);margin-left:auto">${q.topic}</span>
        </div>
        <div class="review-question">${q.q}</div>
        <div class="review-choices">${choicesHtml}</div>
        ${solutionHtml}
      `;

      frag.appendChild(item);
    });

    reviewEl.innerHTML = '';
    reviewEl.appendChild(frag);

    // Render LaTeX across the entire review list after DOM settles
    LatexRenderer.renderAfterInsert(reviewEl);
  }

  /** Safely convert plain-text solution for innerHTML (preserves $ for KaTeX) */
  function _safeText(text) {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\n/g, '<br>');
  }

  function _buildSubjectBreakdown(exam) {
    const stats = {};
    exam.questions.forEach((q, i) => {
      if (!stats[q.subject]) stats[q.subject] = { correct: 0, total: 0 };
      stats[q.subject].total++;
      if (exam.correctMap[i]) stats[q.subject].correct++;
    });
    Object.keys(stats).forEach(sub => {
      stats[sub].pct = Math.round((stats[sub].correct / stats[sub].total) * 100);
    });
    return stats;
  }

  function _subjectColor(sub) {
    return { Mathematics: '#3b82f6', GEAS: '#10b981', 'Electronics Eng.': '#f59e0b', EST: '#8b5cf6' }[sub] || 'var(--accent)';
  }

  return { render };
})();
