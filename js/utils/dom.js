// ============================================================
// DOM.JS — Lightweight DOM helpers
// NOTE: showPage() lives in app.js (authoritative version)
// ============================================================

/** getElementById shorthand */
function $(id) { return document.getElementById(id); }

/** querySelector shorthand */
function $q(selector, ctx = document) { return ctx.querySelector(selector); }

/** querySelectorAll → real Array */
function $all(selector, ctx = document) { return Array.from(ctx.querySelectorAll(selector)); }

/** Safe textContent setter */
function setText(id, val) {
  const el = $(id);
  if (el) el.textContent = val;
}

/** Toast notification */
function showToast(message, type = 'info', duration = 3000) {
  const container = $('toastContainer');
  if (!container) return;
  const icons  = { info: 'ti-info-circle', success: 'ti-circle-check', error: 'ti-alert-circle' };
  const colors = { info: 'var(--accent2)', success: 'var(--green)', error: 'var(--red)' };
  const toast  = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<i class="ti ${icons[type]}" style="color:${colors[type]}"></i> ${message}`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

/** Open / close modal backdrops */
function openModal(id)  { const el = $(id); if (el) el.classList.add('open'); }
function closeModal(id) { const el = $(id); if (el) el.classList.remove('open'); }

/** Choice index → letter label */
function choiceLetter(idx) { return String.fromCharCode(65 + idx); }

/** ISO date → human-readable PH locale */
function formatDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' });
}
