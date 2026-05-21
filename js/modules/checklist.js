// ============================================================
// CHECKLIST.JS — TOS Review Checklist & Progress Tracker
// Reads from TOS_DATA, persists state via localStorage
// ============================================================

const Checklist = (() => {

  // ── Storage key ──────────────────────────────────────────────
  const STORAGE_KEY = 'ece_tos_checklist_v2';

  // ── In-memory state: { [subtopicId]: { status, notes, lastReviewed } }
  let _state = {};

  // ── Status cycle: 'none' → 'in-progress' → 'done' → 'none'
  const STATUS = {
    NONE:     'none',
    PROGRESS: 'in-progress',
    DONE:     'done',
  };

  const STATUS_LABELS = {
    'none':        'Not Started',
    'in-progress': 'In Progress',
    'done':        'Completed',
  };

  // ── Load / Save ──────────────────────────────────────────────
  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      _state = raw ? JSON.parse(raw) : {};
    } catch (e) {
      _state = {};
    }
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(_state));
    } catch (e) {
      console.warn('[Checklist] Save failed:', e);
    }
  }

  // ── Get/set a subtopic's status ──────────────────────────────
  function getStatus(id) {
    return _state[id]?.status || STATUS.NONE;
  }

  function setStatus(id, status) {
    if (!_state[id]) _state[id] = {};
    _state[id].status = status;
    if (status !== STATUS.NONE) {
      _state[id].lastReviewed = new Date().toISOString();
    }
    saveState();
  }

  function cycleStatus(id) {
    const current = getStatus(id);
    const next = current === STATUS.NONE ? STATUS.PROGRESS
               : current === STATUS.PROGRESS ? STATUS.DONE
               : STATUS.NONE;
    setStatus(id, next);
    return next;
  }

  function getNotes(id) {
    return _state[id]?.notes || '';
  }

  function setNotes(id, notes) {
    if (!_state[id]) _state[id] = {};
    _state[id].notes = notes;
    saveState();
  }

  function getLastReviewed(id) {
    const iso = _state[id]?.lastReviewed;
    if (!iso) return null;
    return new Date(iso);
  }

  // ── Computed stats ───────────────────────────────────────────
  function getStatsForSubject(subjectData) {
    let total = 0, done = 0, inProgress = 0;
    subjectData.courses.forEach(course => {
      course.subtopics.forEach(st => {
        total++;
        const s = getStatus(st.id);
        if (s === STATUS.DONE)     done++;
        if (s === STATUS.PROGRESS) inProgress++;
      });
    });
    return { total, done, inProgress, remaining: total - done - inProgress };
  }

  function getOverallStats() {
    let total = 0, done = 0, inProgress = 0;
    TOS_DATA.forEach(subj => {
      const s = getStatsForSubject(subj);
      total     += s.total;
      done      += s.done;
      inProgress += s.inProgress;
    });
    const pct = total > 0 ? Math.round((done / total) * 100) : 0;
    return { total, done, inProgress, remaining: total - done - inProgress, pct };
  }

  // ── Bulk actions ─────────────────────────────────────────────
  function markCourseAll(courseData, status) {
    courseData.subtopics.forEach(st => setStatus(st.id, status));
    saveState();
  }

  function resetAll() {
    _state = {};
    saveState();
  }

  // ── Render the full checklist page ──────────────────────────
  function render(containerId, searchQuery = '') {
    const container = document.getElementById(containerId);
    if (!container) return;

    const query = (searchQuery || '').toLowerCase().trim();

    container.innerHTML = TOS_DATA.map(subj => renderSubject(subj, query)).join('');

    // Re-attach all event listeners
    attachListeners(container);
  }

  function renderSubject(subj, query) {
    const stats = getStatsForSubject(subj);
    const pct   = stats.total > 0 ? Math.round((stats.done / stats.total) * 100) : 0;
    const color = subj.color;

    // Filter courses based on search
    const filteredCourses = subj.courses.filter(course => {
      if (!query) return true;
      const courseMatch = course.name.toLowerCase().includes(query);
      const subtopicMatch = course.subtopics.some(st => st.name.toLowerCase().includes(query));
      return courseMatch || subtopicMatch;
    });

    if (query && filteredCourses.length === 0) return '';

    const coursesHTML = filteredCourses.map(course => renderCourse(course, query, color)).join('');

    return `
      <div class="tos-subject" id="tos-subj-${subj.id}">
        <div class="tos-subject-header" onclick="Checklist.toggleSubject('${subj.id}')">
          <div class="tos-subject-left">
            <div class="tos-subject-icon" style="background:${color}22;color:${color}">
              <i class="ti ${subj.icon}"></i>
            </div>
            <div>
              <div class="tos-subject-title">${subj.subject}</div>
              <div class="tos-subject-meta">
                ${stats.done} / ${stats.total} subtopics completed · ${subj.weight}% of board exam
              </div>
            </div>
          </div>
          <div class="tos-subject-right">
            <div class="tos-pct-badge" style="color:${color}">${pct}%</div>
            <div class="tos-mini-bar">
              <div class="tos-mini-fill" style="width:${pct}%;background:${color}"></div>
            </div>
            <i class="ti ti-chevron-down tos-chevron" id="chev-${subj.id}"></i>
          </div>
        </div>

        <div class="tos-subject-body ${query ? 'open' : ''}" id="tos-body-${subj.id}">
          <div class="tos-subject-prog-row">
            <div class="tos-prog-track">
              <div class="tos-prog-fill done-fill"   style="width:${pct}%;background:${color}"></div>
              <div class="tos-prog-fill prog-fill"   style="width:${stats.total > 0 ? Math.round((stats.inProgress/stats.total)*100) : 0}%;background:${color}55"></div>
            </div>
            <div class="tos-prog-legend">
              <span class="legend-dot" style="background:${color}"></span> ${stats.done} done
              <span class="legend-dot" style="background:${color}55;margin-left:8px"></span> ${stats.inProgress} in progress
              <span style="color:var(--text3);margin-left:8px">${stats.remaining} remaining</span>
            </div>
          </div>
          ${coursesHTML}
        </div>
      </div>`;
  }

  function renderCourse(course, query, color) {
    const allDone  = course.subtopics.every(st => getStatus(st.id) === STATUS.DONE);
    const anyDone  = course.subtopics.some(st => getStatus(st.id) !== STATUS.NONE);
    const doneCount = course.subtopics.filter(st => getStatus(st.id) === STATUS.DONE).length;

    const filteredSubtopics = query
      ? course.subtopics.filter(st =>
          st.name.toLowerCase().includes(query) || course.name.toLowerCase().includes(query))
      : course.subtopics;

    const subtopicsHTML = filteredSubtopics.map(st => renderSubtopic(st)).join('');

    return `
      <div class="tos-course" id="tos-course-${course.id}">
        <div class="tos-course-header" onclick="Checklist.toggleCourse('${course.id}')">
          <div class="tos-course-left">
            <i class="ti ti-chevron-right tos-course-chev" id="course-chev-${course.id}"></i>
            <span class="tos-course-name">${course.name}</span>
          </div>
          <div class="tos-course-right">
            <span class="tos-course-count">${doneCount}/${course.subtopics.length}</span>
            <span class="tos-course-weight">${course.items} items · ${course.weight}</span>
            <div class="tos-course-actions" onclick="event.stopPropagation()">
              <button class="tos-bulk-btn" title="Mark all done"
                onclick="Checklist.markCourseStatus('${course.id}', 'done')">
                <i class="ti ti-checks"></i>
              </button>
              <button class="tos-bulk-btn" title="Reset course"
                onclick="Checklist.markCourseStatus('${course.id}', 'none')">
                <i class="ti ti-refresh"></i>
              </button>
            </div>
          </div>
        </div>
        <div class="tos-course-body" id="tos-cbody-${course.id}">
          ${subtopicsHTML}
        </div>
      </div>`;
  }

  function renderSubtopic(st) {
    const status       = getStatus(st.id);
    const lastReviewed = getLastReviewed(st.id);
    const notes        = getNotes(st.id);
    const dateStr      = lastReviewed
      ? lastReviewed.toLocaleDateString('en-PH', { month:'short', day:'numeric', year:'numeric' })
      : '';

    return `
      <div class="tos-subtopic ${status}" id="tos-st-${st.id}">
        <div class="tos-st-main">
          <button class="tos-status-btn status-${status}"
                  onclick="Checklist.handleCycle('${st.id}')"
                  title="Click to cycle status: Not Started → In Progress → Done">
            <i class="ti ${status === 'done' ? 'ti-circle-check' : status === 'in-progress' ? 'ti-circle-half' : 'ti-circle'}"></i>
          </button>
          <div class="tos-st-content">
            <div class="tos-st-name">${st.name}</div>
            <div class="tos-st-meta">
              <span class="tos-status-label status-label-${status}">${STATUS_LABELS[status]}</span>
              ${dateStr ? `<span class="tos-last-reviewed"><i class="ti ti-clock" style="font-size:10px"></i> ${dateStr}</span>` : ''}
            </div>
          </div>
          <button class="tos-note-toggle" onclick="Checklist.toggleNote('${st.id}')"
                  title="Add notes" ${notes ? 'style="color:var(--gold)"' : ''}>
            <i class="ti ti-pencil"></i>
          </button>
        </div>
        <div class="tos-note-area" id="tos-note-${st.id}" style="display:none">
          <textarea class="tos-note-input" id="tos-note-input-${st.id}"
                    placeholder="Add study notes for this topic..."
                    onblur="Checklist.saveNote('${st.id}')"
                    >${notes}</textarea>
        </div>
      </div>`;
  }

  // ── Event handlers (called from HTML onclick) ────────────────

  function handleCycle(id) {
    const newStatus = cycleStatus(id);
    // Update the single subtopic element without full re-render
    _updateSubtopicDOM(id, newStatus);
    _updateParentProgress(id);
    renderOverallProgress();
  }

  function toggleNote(id) {
    const noteArea = document.getElementById(`tos-note-${id}`);
    if (!noteArea) return;
    const isOpen = noteArea.style.display !== 'none';
    noteArea.style.display = isOpen ? 'none' : 'block';
    if (!isOpen) {
      const input = document.getElementById(`tos-note-input-${id}`);
      if (input) input.focus();
    }
  }

  function saveNote(id) {
    const input = document.getElementById(`tos-note-input-${id}`);
    if (!input) return;
    setNotes(id, input.value.trim());
    // Update note toggle color
    const noteBtn = document.querySelector(`#tos-st-${id} .tos-note-toggle`);
    if (noteBtn) noteBtn.style.color = input.value.trim() ? 'var(--gold)' : '';
  }

  function toggleSubject(id) {
    const body  = document.getElementById(`tos-body-${id}`);
    const chev  = document.getElementById(`chev-${id}`);
    if (!body) return;
    const isOpen = body.classList.toggle('open');
    if (chev) chev.style.transform = isOpen ? 'rotate(180deg)' : '';
  }

  function toggleCourse(id) {
    const body = document.getElementById(`tos-cbody-${id}`);
    const chev = document.getElementById(`course-chev-${id}`);
    if (!body) return;
    const isOpen = body.classList.toggle('open');
    if (chev) chev.style.transform = isOpen ? 'rotate(90deg)' : '';
  }

  function markCourseStatus(courseId, status) {
    // Find course in TOS_DATA
    let found = null;
    TOS_DATA.forEach(subj => {
      subj.courses.forEach(c => {
        if (c.id === courseId) found = c;
      });
    });
    if (!found) return;
    markCourseAll(found, status);

    // Re-render course subtopics
    found.subtopics.forEach(st => _updateSubtopicDOM(st.id, status));
    _updateCourseProgress(found);
    _updateAllSubjectProgress();
    renderOverallProgress();
  }

  // ── DOM updates (surgical, avoid full re-render) ─────────────

  function _updateSubtopicDOM(id, status) {
    const el = document.getElementById(`tos-st-${id}`);
    if (!el) return;

    // Update class
    el.className = `tos-subtopic ${status}`;

    // Update icon button
    const btn = el.querySelector('.tos-status-btn');
    if (btn) {
      btn.className = `tos-status-btn status-${status}`;
      btn.innerHTML = `<i class="ti ${status === 'done' ? 'ti-circle-check' : status === 'in-progress' ? 'ti-circle-half' : 'ti-circle'}"></i>`;
    }

    // Update label
    const label = el.querySelector('.tos-status-label');
    if (label) {
      label.className = `tos-status-label status-label-${status}`;
      label.textContent = STATUS_LABELS[status];
    }

    // Update date
    const lastReviewed = getLastReviewed(id);
    const metaEl = el.querySelector('.tos-st-meta');
    if (metaEl && lastReviewed) {
      const dateStr = lastReviewed.toLocaleDateString('en-PH', { month:'short', day:'numeric', year:'numeric' });
      let dateSpan = metaEl.querySelector('.tos-last-reviewed');
      if (!dateSpan) {
        dateSpan = document.createElement('span');
        dateSpan.className = 'tos-last-reviewed';
        metaEl.appendChild(dateSpan);
      }
      dateSpan.innerHTML = `<i class="ti ti-clock" style="font-size:10px"></i> ${dateStr}`;
    }
  }

  function _updateParentProgress(subtopicId) {
    // Find which course/subject this subtopic belongs to
    TOS_DATA.forEach(subj => {
      subj.courses.forEach(course => {
        if (course.subtopics.some(st => st.id === subtopicId)) {
          _updateCourseProgress(course);
          _updateSubjectProgress(subj);
        }
      });
    });
  }

  function _updateCourseProgress(course) {
    const doneCount = course.subtopics.filter(st => getStatus(st.id) === STATUS.DONE).length;
    const countEl   = document.querySelector(`#tos-course-${course.id} .tos-course-count`);
    if (countEl) countEl.textContent = `${doneCount}/${course.subtopics.length}`;
  }

  function _updateSubjectProgress(subj) {
    const stats = getStatsForSubject(subj);
    const pct   = stats.total > 0 ? Math.round((stats.done / stats.total) * 100) : 0;

    // Percent badge
    const pctBadge = document.querySelector(`#tos-subj-${subj.id} .tos-pct-badge`);
    if (pctBadge) pctBadge.textContent = `${pct}%`;

    // Mini bar
    const miniBar = document.querySelector(`#tos-subj-${subj.id} .tos-mini-fill`);
    if (miniBar) miniBar.style.width = `${pct}%`;

    // Full progress bar
    const progFill = document.querySelector(`#tos-subj-${subj.id} .done-fill`);
    if (progFill) progFill.style.width = `${pct}%`;
    const progFillProg = document.querySelector(`#tos-subj-${subj.id} .prog-fill`);
    if (progFillProg) {
      const progPct = stats.total > 0 ? Math.round((stats.inProgress/stats.total)*100) : 0;
      progFillProg.style.width = `${progPct}%`;
    }

    // Legend text
    const legendEl = document.querySelector(`#tos-subj-${subj.id} .tos-prog-legend`);
    if (legendEl) {
      legendEl.innerHTML = `
        <span class="legend-dot" style="background:${subj.color}"></span> ${stats.done} done
        <span class="legend-dot" style="background:${subj.color}55;margin-left:8px"></span> ${stats.inProgress} in progress
        <span style="color:var(--text3);margin-left:8px">${stats.remaining} remaining</span>`;
    }

    // Subject meta
    const metaEl = document.querySelector(`#tos-subj-${subj.id} .tos-subject-meta`);
    if (metaEl) {
      metaEl.textContent = `${stats.done} / ${stats.total} subtopics completed · ${subj.weight}% of board exam`;
    }
  }

  function _updateAllSubjectProgress() {
    TOS_DATA.forEach(subj => _updateSubjectProgress(subj));
  }

  // ── Overall progress bar (top of page) ──────────────────────
  function renderOverallProgress() {
    const stats = getOverallStats();

    const totalEl      = document.getElementById('cl-total');
    const doneEl       = document.getElementById('cl-done');
    const inprogEl     = document.getElementById('cl-inprog');
    const remainEl     = document.getElementById('cl-remain');
    const pctEl        = document.getElementById('cl-pct');
    const barEl        = document.getElementById('cl-bar-fill');

    if (totalEl)   totalEl.textContent   = stats.total;
    if (doneEl)    doneEl.textContent    = stats.done;
    if (inprogEl)  inprogEl.textContent  = stats.inProgress;
    if (remainEl)  remainEl.textContent  = stats.remaining;
    if (pctEl)     pctEl.textContent     = `${stats.pct}%`;
    if (barEl)     barEl.style.width     = `${stats.pct}%`;

    // Per-subject mini progress bars
    TOS_DATA.forEach(subj => {
      const s = getStatsForSubject(subj);
      const p = s.total > 0 ? Math.round((s.done / s.total) * 100) : 0;
      const miniEl = document.getElementById(`cl-subj-pct-${subj.id}`);
      const barEl2 = document.getElementById(`cl-subj-bar-${subj.id}`);
      if (miniEl) miniEl.textContent = `${p}%`;
      if (barEl2) barEl2.style.width = `${p}%`;
    });
  }

  // ── Search ───────────────────────────────────────────────────
  function handleSearch(query) {
    render('tosChecklistBody', query);
    renderOverallProgress();
  }

  // ── Expand All / Collapse All ────────────────────────────────
  function expandAll() {
    document.querySelectorAll('.tos-subject-body').forEach(el => {
      el.classList.add('open');
    });
    document.querySelectorAll('.tos-course-body').forEach(el => {
      el.classList.add('open');
    });
    document.querySelectorAll('.tos-chevron').forEach(el => {
      el.style.transform = 'rotate(180deg)';
    });
    document.querySelectorAll('.tos-course-chev').forEach(el => {
      el.style.transform = 'rotate(90deg)';
    });
  }

  function collapseAll() {
    document.querySelectorAll('.tos-subject-body').forEach(el => el.classList.remove('open'));
    document.querySelectorAll('.tos-course-body').forEach(el => el.classList.remove('open'));
    document.querySelectorAll('.tos-chevron').forEach(el => { el.style.transform = ''; });
    document.querySelectorAll('.tos-course-chev').forEach(el => { el.style.transform = ''; });
  }

  // ── Full page init ───────────────────────────────────────────
  function init() {
    loadState();
    render('tosChecklistBody', '');
    renderOverallProgress();
  }

  // ── Attach DOM event listeners ───────────────────────────────
  function attachListeners(container) {
    // Note: listeners are attached via inline onclick for simplicity and stability
    // Textarea blur events are inline onblur
  }

  // Public API
  return {
    init,
    render,
    handleSearch,
    expandAll,
    collapseAll,
    handleCycle,
    toggleNote,
    saveNote,
    toggleSubject,
    toggleCourse,
    markCourseStatus,
    renderOverallProgress,
    getOverallStats,
    getStatsForSubject,
    resetAll,
  };

})();
