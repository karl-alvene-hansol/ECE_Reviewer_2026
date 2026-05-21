// ============================================================
// STATE.JS — Single source of truth for all app state
// ============================================================

const AppState = {
  /** Full question bank loaded from CSV */
  questionBank: [],

  /** Whether the bank has been loaded yet */
  bankReady: false,

  /** Active exam session */
  exam: {
    questions:   [],
    currentIdx:  0,
    userAnswers: [],   // -1 = unanswered
    correctMap:  [],
    answered:    [],
    active:      false,
  },

  /** Exam config (set from setup panel) */
  config: {
    subject:      'All',
    difficulty:   'All',
    count:        10,
    timerMinutes: 0,
    isBoardExam:  false,   // 200-item full board exam mode
  },

  /** Session-wide cumulative stats */
  session: {
    totalAnswered:  0,
    totalCorrect:   0,
    bestPct:        0,
    seenQuestions:  new Set(),
    examHistory:    [],
  },

  /** UI flags */
  ui: {
    theme:       'dark',
    sidebarOpen: false,
    currentPage: 'homePage',
  },
};
