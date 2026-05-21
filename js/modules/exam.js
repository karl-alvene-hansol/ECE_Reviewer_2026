// ============================================================
// EXAM.JS — Core exam engine (start / answer / navigate / submit)
// ============================================================

const Exam = (() => {

  // ── Start ────────────────────────────────────────────────────
  function start(config) {
    const pool     = getFilteredPool(AppState.questionBank, config);
    const count    = config.isBoardExam ? 200 : config.count;

    if (pool.length === 0) {
      showToast('No questions match your filters. Try different settings.', 'error');
      return;
    }

    // For board exam, use ALL 200 if available; otherwise use what exists
    const useCount = Math.min(count, pool.length);
    if (useCount < count && config.isBoardExam) {
      showToast(`Only ${pool.length} questions available — using all of them.`, 'info');
    }

    const selected = selectQuestions(pool, useCount, AppState.session.seenQuestions);
    const questions = buildExamQuestions(selected);

    AppState.exam = {
      questions,
      currentIdx:  0,
      userAnswers: new Array(questions.length).fill(-1),
      correctMap:  new Array(questions.length).fill(false),
      answered:    new Array(questions.length).fill(false),
      active:      true,
      startTime:   Date.now(),
    };

    if (config.timerMinutes > 0) Timer.start(config.timerMinutes);
    Storage.saveSeenIds(AppState.session.seenQuestions);
    renderQuestion();
  }

  // ── Answer a question ────────────────────────────────────────
  function selectAnswer(choiceIdx) {
    const { exam } = AppState;
    const idx      = exam.currentIdx;
    if (exam.answered[idx]) return;           // already answered

    exam.userAnswers[idx] = choiceIdx;
    exam.answered[idx]    = true;
    exam.correctMap[idx]  = (choiceIdx === exam.questions[idx].displayAnswer);

    if (exam.correctMap[idx]) AppState.session.totalCorrect++;
    AppState.session.totalAnswered++;

    updateHomeStats();
    Storage.saveProgress(exam, AppState.config);

    // Render feedback immediately — no auto-advance; user clicks "Next Question"
    renderQuestion();
  }

  // ── Navigate ─────────────────────────────────────────────────
  function navigate(direction) {
    const { exam } = AppState;
    const next = exam.currentIdx + direction;
    if (next >= 0 && next < exam.questions.length) {
      exam.currentIdx = next;
      renderQuestion();
    }
  }

  /** Jump directly to a question index */
  function goTo(idx) {
    const { exam } = AppState;
    if (idx >= 0 && idx < exam.questions.length) {
      exam.currentIdx = idx;
      renderQuestion();
    }
  }

  // ── Submit ────────────────────────────────────────────────────
  function submit(timeExpired = false) {
    Timer.stop();
    AppState.exam.active = false;

    const { exam }  = AppState;
    const correct   = exam.correctMap.filter(Boolean).length;
    const total     = exam.questions.length;
    const pct       = Math.round((correct / total) * 100);

    // Build topic breakdown for analytics
    const topicBreakdown = {};
    exam.questions.forEach((q, i) => {
      if (!topicBreakdown[q.topic]) topicBreakdown[q.topic] = { correct: 0, total: 0 };
      topicBreakdown[q.topic].total++;
      if (exam.correctMap[i]) topicBreakdown[q.topic].correct++;
    });

    Storage.saveHistory({
      score: correct,
      total,
      pct,
      subject:        AppState.config.subject,
      isBoardExam:    AppState.config.isBoardExam,
      topicBreakdown,
    });
    Storage.clear(Storage.KEY_PROGRESS);

    if (pct > AppState.session.bestPct) AppState.session.bestPct = pct;

    Results.render(exam, timeExpired);
  }

  return { start, selectAnswer, navigate, goTo, submit };
})();
