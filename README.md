# ECE Board Reviewer · PH 🇵🇭

A fully client-side ECE Licensure Exam preparation web app with a **200-item Mock Board Exam** powered by a CSV question bank. No backend, no build tools — just open `index.html` in a browser (via Live Server or any static server).

---

## Features

| Feature | Details |
|---|---|
| **CSV Question Bank** | 200 questions across 4 subjects, loaded via PapaParse + Fetch API |
| **200-Item Board Exam** | Full PRC-aligned mock exam, 3-hour timer, randomized choices |
| **Custom Exam Mode** | Filter by subject, difficulty, and choose 10–100 questions |
| **Randomized Choices** | Fisher-Yates shuffle on answer choices per question (no repetition) |
| **Answer Highlighting** | Instant correct/wrong feedback with color-coded choices |
| **Solution Box** | Reveals correct answer text immediately after answering |
| **Timer** | Configurable countdown (15m–180m) with amber/red warning states |
| **Score Calculation** | Live score, accuracy %, pass/fail (≥70%) |
| **Answer Review Mode** | Full post-exam review with per-question breakdowns |
| **Subject Breakdown** | Per-subject score chart on results page (for mixed/board exams) |
| **TOS Checklist** | PRC 2022 Table of Specifications topic tracker with progress |
| **Study Reviewer** | Browse questions by subject, self-quiz with reveal mode |
| **Analytics** | Subject-wise avg score, weak topic detection (<60%) |
| **Exam History** | Last 20 exam records saved to localStorage |
| **Dark/Light Theme** | Persistent theme toggle |
| **Responsive** | Mobile-first sidebar, works on phones and tablets |

---

## Project Structure

```
ece-reviewer/
├── index.html                   # Main HTML shell
├── data/
│   ├── questions/
│   │   └── Mock_Board_Exam_200_Items.csv   # Question bank (CSV)
│   └── config/
│       ├── settings.json
│       └── subjects.json
├── css/
│   ├── base.css                 # CSS variables, resets, typography
│   ├── layout.css               # Sidebar, topbar, page shell
│   ├── components.css           # Cards, buttons, modals, toasts
│   ├── quiz.css                 # Exam/quiz page styles
│   ├── reviewer.css             # Reviewer + analytics + history
│   ├── checklist.css            # TOS checklist styles
│   └── theme.css                # Light/dark theme overrides
└── js/
    ├── utils/
    │   ├── shuffle.js           # Fisher-Yates shuffle (pure)
    │   ├── dom.js               # DOM helpers ($, setText, showToast…)
    │   └── filters.js           # Question filtering + selection logic
    ├── core/
    │   ├── state.js             # AppState — single source of truth
    │   ├── storage.js           # localStorage/sessionStorage helpers
    │   ├── csv-loader.js        # PapaParse CSV loader + row normaliser
    │   └── app.js               # Bootstrap, routing, render helpers
    ├── modules/
    │   ├── timer.js             # Countdown timer IIFE
    │   ├── exam.js              # Exam engine (start/answer/navigate/submit)
    │   ├── results.js           # Score rendering + answer review
    │   ├── reviewer.js          # Study reviewer (browse by subject)
    │   ├── analytics.js         # Local performance analytics
    │   └── checklist.js         # TOS checklist module
    └── data/
        └── tos_data.js          # PRC TOS static data
```

---

## CSV Format

The question bank is a plain CSV file at `data/questions/Mock_Board_Exam_200_Items.csv`.

```
ID,Subject,Topic,Difficulty,Question,Choice A,Choice B,Choice C,Choice D,Answer
MATH-001,Mathematics,Integral Calculus,Moderate,"Find the derivative of f(x)…",3x²−10x+3,3x²−5x+3,x³−10x+3,3x²−10x−7,3x²−10x+3
```

| Column | Description |
|---|---|
| `ID` | Unique question identifier |
| `Subject` | `Mathematics`, `GEAS`, `Electronics Eng.`, or `EST` |
| `Topic` | Sub-topic label |
| `Difficulty` | `Easy`, `Moderate`, or `Difficult` |
| `Question` | Question text (HTML is supported) |
| `Choice A–D` | Four answer choices |
| `Answer` | The **exact text** of the correct choice |

To add questions: open the CSV in any spreadsheet app, add rows, save as CSV.

---

## How to Run

### Option A — VS Code Live Server (recommended)
1. Open the `ece-reviewer/` folder in VS Code
2. Right-click `index.html` → **Open with Live Server**

### Option B — Python simple server
```bash
cd ece-reviewer
python3 -m http.server 5500
# Open http://localhost:5500
```

### Option C — Node.js
```bash
npx serve ece-reviewer
```

> **Why not just double-click `index.html`?**
> The CSV is loaded via `fetch()` which is blocked on `file://` protocol by browsers.
> You need any simple HTTP server (all options above work).

---

## Tech Stack

- **Vanilla JS** (ES2020, no framework)
- **PapaParse 5.4** (CSV parsing via CDN)
- **Tabler Icons** (icon font via CDN)
- **DM Sans / Syne / DM Mono** (Google Fonts)
- **localStorage + sessionStorage** (persistence, no backend)

---

## Contributing

1. Fork the repo
2. Add questions to the CSV (`data/questions/Mock_Board_Exam_200_Items.csv`)
3. Or add new JS modules under `js/modules/`
4. Open a pull request

---

## License

MIT License. Free to use for personal study and non-commercial purposes.
