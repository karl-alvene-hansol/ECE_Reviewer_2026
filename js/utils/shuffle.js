// ============================================================
// SHUFFLE.JS — Fisher-Yates shuffle, no side effects
// ============================================================

/**
 * Returns a NEW shuffled copy of the array (pure function).
 * @param {Array} arr
 * @returns {Array}
 */
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
