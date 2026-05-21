// ============================================================
// FILTERS.JS — Question pool filtering & selection logic
// ============================================================

/**
 * Filter the full question bank by subject & difficulty.
 * @param {Array}  bank
 * @param {Object} config  { subject, difficulty }
 * @returns {Array}
 */
function getFilteredPool(bank, config) {
  return bank.filter(q => {
    const subjOk = config.subject === 'All' || q.subject === config.subject;
    const diffOk = config.difficulty === 'All' || q.difficulty === config.difficulty;
    return subjOk && diffOk;
  });
}

/**
 * Select `count` questions from pool, prioritising unseen ones.
 * Marks selected IDs in the seenIds Set.
 * @param {Array}  pool
 * @param {number} count
 * @param {Set}    seenIds  — mutated in place
 * @returns {Array}
 */
function selectQuestions(pool, count, seenIds) {
  const unseen   = pool.filter(q => !seenIds.has(q.id));
  const drawFrom = unseen.length >= count ? unseen : pool;
  const selected = shuffle(drawFrom).slice(0, count);
  selected.forEach(q => seenIds.add(q.id));
  return selected;
}

/**
 * Build exam-ready questions: shuffle choice order, track new answer index.
 * CSV answer is a text string matching one of the choices.
 * @param {Array} selected
 * @returns {Array}
 */
function buildExamQuestions(selected) {
  return selected.map(q => {
    const indices        = shuffle([0, 1, 2, 3]);
    const displayChoices = indices.map(i => q.choices[i]);
    // q.answer is the index of the correct choice in the ORIGINAL choices array
    const displayAnswer  = indices.indexOf(q.answer);
    return { ...q, displayChoices, displayAnswer };
  });
}
