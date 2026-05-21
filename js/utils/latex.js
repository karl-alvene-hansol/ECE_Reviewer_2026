// ============================================================
// LATEX.JS — KaTeX-powered math rendering utility
// Scans a DOM element for $...$ and $$...$$ delimiters
// and any \( \) or \[ \] blocks, then renders them.
// Falls back gracefully if KaTeX is unavailable.
// ============================================================

const LatexRenderer = (() => {

  /** Return true if KaTeX is loaded and ready */
  function isReady() {
    return typeof katex !== 'undefined' && typeof renderMathInElement !== 'undefined';
  }

  /**
   * Render all math in a given DOM element.
   * Uses KaTeX auto-render with multiple delimiter formats.
   * @param {HTMLElement} el
   */
  function renderIn(el) {
    if (!el || !isReady()) return;
    try {
      renderMathInElement(el, {
        delimiters: [
          { left: '$$',  right: '$$',  display: true  },
          { left: '\\[', right: '\\]', display: true  },
          { left: '$',   right: '$',   display: false },
          { left: '\\(', right: '\\)', display: false },
        ],
        throwOnError: false,
        errorColor: 'var(--red)',
        strict: false,
        trust: false,
        output: 'html',
      });
    } catch (e) {
      console.warn('[LatexRenderer] renderIn error:', e);
    }
  }

  /**
   * Render math inside a freshly-set innerHTML element.
   * Call this immediately after setting .innerHTML to ensure
   * KaTeX processes new nodes before the browser paints.
   * @param {HTMLElement} el
   */
  function renderAfterInsert(el) {
    // Use requestAnimationFrame so the DOM is settled before render
    requestAnimationFrame(() => renderIn(el));
  }

  /**
   * Render a raw string as KaTeX inline math.
   * Returns an HTML string (not a DOM node).
   * @param {string} expr  — the LaTeX expression (without delimiters)
   * @param {boolean} display — block (true) or inline (false)
   */
  function renderString(expr, display = false) {
    if (!isReady()) return `<code>${expr}</code>`;
    try {
      return katex.renderToString(expr, {
        throwOnError: false,
        displayMode: display,
        errorColor: 'var(--red)',
      });
    } catch (e) {
      return `<code>${expr}</code>`;
    }
  }

  return { isReady, renderIn, renderAfterInsert, renderString };
})();
