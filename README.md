# Decision Matrix

Buildless local evaluation prototype for W044. Serve `dist/` with any static HTTP server. Korean `/`; English `/en/`; Spanish `/es/`; Simplified Chinese `/zh/`; Japanese `/ja/`; German `/de/`. All routes share complete locale catalogs, including validation, examples, output labels, help and clipboard status. Language changes reload that locale's example.

## Features and arithmetic

- Up to 12 criteria and 30 alternatives. Enter baseline and scenario weights for each criterion, then 0–100 scores for each alternative in criterion order.
- Weighted mean: sum(score × weight) / sum(weight). Both baseline and scenario denominators must be positive. Individual zero weights are supported. Scenario comparison keeps the same scores while changing weights.
- Baseline/scenario scores and competition ranks, rank improvements, normalized weight shares, and expandable per-criterion score contributions.
- Ties within 1e-9 points share competition rank; the next place is skipped (1, 1, 3). Ranking uses unrounded values, while visible numbers show up to six decimals. Tied rows keep input order.
- UTF-8 CSV download and clipboard copy include raw scores, unrounded totals, ranks, rank changes and baseline/scenario contributions. Text is escaped and formula-prefix cells receive an apostrophe.
- All processing stays in the browser. No API calls, storage, analytics, advertising or external libraries. Editing inputs invalidates results and disables export.

Weights are user assumptions, not objective evidence. Higher scores must always mean better; users must reverse cost/risk scales before entering them. The tool does not select a correct answer or provide professional advice. Weight bounds: 0–1,000,000. Decimal point must be `.`. Blank values, negative weights, non-finite values, duplicate names and malformed rows are rejected. Names are limited to 60 characters.

## Verification

Executed with explicit RTK from the workspace; runtime paths are environment-specific. Equivalent commands:

```text
rtk proxy node --check sites/decision-matrix/dist/core.js
rtk proxy node --check sites/decision-matrix/dist/app.js
rtk proxy node sites/decision-matrix/test.mjs
rtk proxy node -e "import('./sites/decision-matrix/dist/locales.js').then(m=>console.log(Object.keys(m.catalogs)))"
```

Actual results: syntax checks passed. Fourteen fixture groups passed: known weighted scores and contributions, scenario rank reversal, ties, individual zero weights, both zero-denominator errors, negative weights, blank/out-of-range scores, field counts, duplicate criteria/alternatives, decimal weights and CSV escaping. Six locale catalogs loaded with exact key parity; all six static route files and relative bases checked. Browser visual/interaction QA has not been performed by this implementer.

## Source and attribution

Original implementation, design and samples. Arithmetic reference: [NIST Dataplot, Weighted Mean](https://www.itl.nist.gov/div898/software/dataplot/refman2/ch2/weigmean.pdf), formula 2-20. The tool applies this elementary arithmetic to user-entered evaluation weights; the reference does not endorse the selection method. No third-party prose or assets are copied.

## Public GitHub Pages release

Launch: https://nanalab.kr/decision-matrix/

Korean is at the root. English, Spanish, Chinese, Japanese and German use `/en/`, `/es/`, `/zh/`, `/ja/`, `/de/`.
GitHub Pages serves `main` → `/docs` using the branch build. No project CNAME is used.

Build: `node scripts/build-public.mjs`. The `dist/` snapshot and its original generators/tests are preserved as the application source. The public build adds metadata, six-locale sitemaps, original JPEG cards, More Apps styling and the existing NaNa publisher integrations. It does not upload selected user files.

Publisher integrations: AdSense, Google Tag Manager, Google Analytics and Cloudflare Web Analytics, with the same publisher settings as the NaNa Lab homepage. These scripts can make network requests independently of local file processing.

Original JPEG cards are rendered from original text and geometry using an installed system font; no font files are redistributed. Existing source references and third-party notices remain applicable.
