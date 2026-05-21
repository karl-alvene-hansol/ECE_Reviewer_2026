// ============================================================
// TIMER.JS — Countdown timer
// ============================================================

const Timer = (() => {
  let _interval  = null;
  let _seconds   = 0;
  let _totalSecs = 0;

  const WARN_PCT   = 0.25;   // amber at 25 % remaining
  const DANGER_PCT = 0.10;   // red   at 10 % remaining

  function start(minutes) {
    stop();                         // clear any previous interval
    _seconds   = minutes * 60;
    _totalSecs = _seconds;
    _render();                      // show immediately
    _interval  = setInterval(_tick, 1000);
  }

  function stop() {
    if (_interval) { clearInterval(_interval); _interval = null; }
  }

  function _tick() {
    _seconds = Math.max(0, _seconds - 1);
    _render();
    if (_seconds <= 0) {
      stop();
      Exam.submit(true);            // auto-submit on expiry
    }
  }

  function _render() {
    const m   = Math.floor(_seconds / 60);
    const s   = _seconds % 60;
    const txt = `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;

    const el    = $('timerText');
    const badge = $('timerBadge');
    if (el)    el.textContent = txt;
    if (badge) {
      const pct = _totalSecs > 0 ? _seconds / _totalSecs : 1;
      badge.className = 'timer-badge'
        + (pct <= DANGER_PCT ? ' danger' : pct <= WARN_PCT ? ' warn' : '');
    }
  }

  /** Remaining seconds (read by Exam.submit for time-elapsed calc) */
  function remaining() { return _seconds; }
  function total()     { return _totalSecs; }

  return { start, stop, remaining, total };
})();
