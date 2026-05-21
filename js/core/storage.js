// ============================================================
// STORAGE.JS — Persistent storage helpers
// ============================================================

const Storage = {
  KEY_PROGRESS: 'ece_exam_progress',
  KEY_HISTORY:  'ece_exam_history',
  KEY_SEEN:     'ece_seen_questions',
  KEY_THEME:    'ece_theme',

  // ── Exam progress (session resume) ──────────────────────────
  saveProgress(exam, config) {
    try {
      sessionStorage.setItem(this.KEY_PROGRESS, JSON.stringify({
        config,
        answers:     exam.userAnswers,
        answered:    exam.answered,
        correctMap:  exam.correctMap,
        currentIdx:  exam.currentIdx,
        questionIds: exam.questions.map(q => q.id),
      }));
    } catch (e) { /* quota exceeded – silently skip */ }
  },

  // ── History ──────────────────────────────────────────────────
  saveHistory(record) {
    try {
      const h = this.getHistory();
      h.unshift({ ...record, date: new Date().toISOString() });
      localStorage.setItem(this.KEY_HISTORY, JSON.stringify(h.slice(0, 50)));
    } catch (e) {}
  },

  getHistory() {
    try { return JSON.parse(localStorage.getItem(this.KEY_HISTORY)) || []; }
    catch (e) { return []; }
  },

  // ── Theme ────────────────────────────────────────────────────
  saveTheme(t) { localStorage.setItem(this.KEY_THEME, t); },
  getTheme()   { return localStorage.getItem(this.KEY_THEME) || 'dark'; },

  // ── Seen question IDs ────────────────────────────────────────
  saveSeenIds(set) {
    try { localStorage.setItem(this.KEY_SEEN, JSON.stringify([...set])); }
    catch (e) {}
  },
  loadSeenIds() {
    try { return new Set(JSON.parse(localStorage.getItem(this.KEY_SEEN)) || []); }
    catch (e) { return new Set(); }
  },

  clear(key) {
    if (key) sessionStorage.removeItem(key);
  },
};
