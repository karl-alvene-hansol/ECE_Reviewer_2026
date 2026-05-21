// ============================================================
// ANALYTICS.JS — Local performance analytics (no backend)
// ============================================================

const Analytics = {

  /** Per-subject avg score from exam history */
  getSubjectStats() {
    const history = Storage.getHistory();
    const stats   = {};
    history.forEach(r => {
      const key = r.subject === 'All' ? 'Mixed' : r.subject;
      if (!stats[key]) stats[key] = { attempts: 0, totalPct: 0, best: 0 };
      stats[key].attempts++;
      stats[key].totalPct += r.pct;
      stats[key].best = Math.max(stats[key].best, r.pct);
    });
    Object.keys(stats).forEach(k => {
      stats[k].avg = Math.round(stats[k].totalPct / stats[k].attempts);
    });
    return stats;
  },

  /** Topics where avg score < 60 % (sorted worst first) */
  getWeakTopics(history) {
    const topicScores = {};
    history.forEach(r => {
      if (!r.topicBreakdown) return;
      Object.entries(r.topicBreakdown).forEach(([topic, { correct, total }]) => {
        if (!topicScores[topic]) topicScores[topic] = { correct: 0, total: 0 };
        topicScores[topic].correct += correct;
        topicScores[topic].total   += total;
      });
    });
    return Object.entries(topicScores)
      .map(([topic, { correct, total }]) => ({
        topic,
        pct:   Math.round((correct / total) * 100),
        total,
      }))
      .filter(t => t.pct < 60)
      .sort((a, b) => a.pct - b.pct);
  },
};
