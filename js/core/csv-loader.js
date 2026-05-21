// ============================================================
// CSV-LOADER.JS — Load & parse the question CSV using PapaParse
// Works on both file:// (inline fallback) and http:// (fetch).
// ============================================================

const CSVLoader = (() => {

  /** CSV column names → internal schema field names */
  const SUBJECT_CLASS = {
    'Mathematics':      'math',
    'GEAS':             'geas',
    'Electronics Eng.': 'elex',
    'EST':              'est',
  };

  /**
   * Convert one PapaParse row object into the internal question object.
   * CSV columns: ID, Subject, Topic, Difficulty, Question,
   *              Choice A, Choice B, Choice C, Choice D, Answer
   */
  function normaliseRow(row, idx) {
    const choices = [
      row['Choice A'] || '',
      row['Choice B'] || '',
      row['Choice C'] || '',
      row['Choice D'] || '',
    ].map(c => c.trim());

    const answerText = (row['Answer'] || '').trim();
    const answerIdx  = choices.findIndex(c => c === answerText);

    return {
      id:         (row['ID'] || `Q-${idx}`).trim(),
      subject:    (row['Subject'] || '').trim(),
      topic:      (row['Topic'] || '').trim(),
      difficulty: (row['Difficulty'] || 'Moderate').trim(),
      subClass:   SUBJECT_CLASS[(row['Subject'] || '').trim()] || 'math',
      q:          (row['Question'] || '').trim(),
      choices,
      answer:     answerIdx >= 0 ? answerIdx : 0,  // fallback to A
      solution:   (row['Solution'] || '').trim(),   // load from CSV
    };
  }

  /**
   * Load questions from the CSV file at `csvPath`.
   * Returns a Promise<Array> of normalised question objects.
   */
  function load(csvPath) {
    return new Promise((resolve, reject) => {
      // PapaParse can fetch a remote file directly via `download: true`
      Papa.parse(csvPath, {
        download:       true,
        header:         true,
        skipEmptyLines: true,
        transformHeader: h => h.trim(),
        complete(results) {
          if (!results.data || results.data.length === 0) {
            reject(new Error('CSV parsed but returned 0 rows.'));
            return;
          }
          const questions = results.data
            .map(normaliseRow)
            .filter(q => q.q && q.choices.every(Boolean));
          console.log(`[CSVLoader] Parsed ${questions.length} questions from ${csvPath}`);
          resolve(questions);
        },
        error(err) {
          reject(new Error(`PapaParse error: ${err.message}`));
        },
      });
    });
  }

  /**
   * Parse an already-fetched CSV string (used as fallback when
   * PapaParse's `download` option fails on file://).
   */
  function parseString(csvText) {
    const results = Papa.parse(csvText, {
      header:         true,
      skipEmptyLines: true,
      transformHeader: h => h.trim(),
    });
    return results.data
      .map(normaliseRow)
      .filter(q => q.q && q.choices.every(Boolean));
  }

  return { load, parseString, normaliseRow };
})();
