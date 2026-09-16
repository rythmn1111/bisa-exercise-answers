# BISA Q&A — every exercise question, answered

A deliberately minimal companion site. Two things on the page: **the question as it was set, and
the answer.** Code where the question wants code, words where it wants words. No teaching, no
variants, no commentary — that is what the [guide](https://github.com/rythmn1111/bisa-exam-guide) is for.

Every code answer was executed against the real data files before being published, and its real
output is pasted underneath.

**Companion site:** [bisa-exam-guide](https://github.com/rythmn1111/bisa-exam-guide) — the same
exercise bank turned into a 16-chapter book of 231 reusable patterns, with a one-click PDF of the
whole thing.

## Run it

```bash
bun install
bun run dev        # http://localhost:3220
```

```bash
bun run build && bun run start
bun run check      # structure + coverage
bun run verify     # re-runs every code answer and diffs the pasted output
```

## Using it

- **Sidebar** — the 27 exercise sets, grouped, with question counts.
- **Search** (`⌘K`) — searches the text of every question, then jumps to it.
- **Hide answers** — collapses every answer so the page becomes a self-test. Click any hidden
  answer to reveal just that one. The setting persists.
- **Print** — a print stylesheet drops the chrome, so any set prints as a clean question sheet.

## Layout

```
qa/
  app/
    page.js           all sets, grouped
    s/[id]/page.js    one set: setup block, then question/answer pairs
    globals.css
  components/         Search, SideNav, HideToggle, QA
  lib/qa.js           parses data/*.md into sets and questions
  data/*.md           the content — one file per exercise set
  scripts/
    validate-qa.mjs     structure and coverage checks
    verify_answers.py   re-executes every answer, diffs the pasted output
  QA_SPEC.md            the contract every data file follows
```

## Adding or fixing a question set

`QA_SPEC.md` has the full contract. The shape is:

```markdown
---
id: basics-ex1                 # must equal the filename stem
title: "01 Basics — Exercise 1: Bank Transactions"
source: "Pandas exercises/01 Basics/.../Bank Transactions.pdf"
datafile: "Pandas exercises/01 Basics/.../bank_transactions.csv"
topic: "Inspect, select, filter, first look at missing values"
group: "Pandas exercises"       # one of six fixed groups
order: 30                       # unique across the site
setup: |
  import pandas as pd
  df = pd.read_csv("bank_transactions.csv")
---

### Q1

**Q.** Load the dataset and display the first 5 and last 5 rows.

**A.**

```python
print(df.head())
print(df.tail())
```

```text
   TxnID        Date  AccountID  Branch TxnType    Amount Channel   Remarks
0   5001  01-07-2025        101  Mumbai  Credit  250000.0    NEFT    Salary
```
```

### Two gates

`bun run check` enforces the important part — **coverage**. The expected number of questions per
set is hard-coded in `scripts/validate-qa.mjs` from the source PDFs, so a missing or merged
question is an error rather than something that quietly slips through. It also checks frontmatter
validity, unique `id`/`order`, that every block has both a `**Q.**` and a non-empty `**A.**`,
balanced code fences, and gaps or duplicates in the question numbering.

`bun run verify` re-runs every code answer and diffs it against the pasted output. It executes the
`setup:` block, then each answer in order in that one namespace, with the working directory set to
the set's own data folder (which is why `setup` can read by bare filename) and writes redirected to
a temp dir. Warning-location prefixes are normalised away; numbers and alignment must match.

**Every code answer on the site currently reproduces exactly.** If you edit an answer, run
`bun run verify -- --show` to see any diff, or `python3 scripts/verify_answers.py case2 --show`
for one set.

A consequence worth knowing: if an answer's pasted output shows a wide frame in full, its `setup`
block must set `pd.set_option("display.width", …)` and `display.max_columns`, or a reader copying
the setup will see pandas' `...` truncation instead. The verifier catches that.

## Where the questions are wrong

Some source exercises cannot be answered as printed. Those answers say so in one sentence and then
give the corrected version:

- **Integrated Case 2 Q11** — asks for AAA holdings with `Current_Value > 400000`; the portfolio
  maximum is 246,147.60, so the honest answer is an empty frame.
- **03 Sorting Exercise A** — the prose names columns `City` and `Revenue` and IDs `1010–1020`; the
  CSV has `Branch`, `DisbursedAmount` and IDs `11001–11200`. `df.loc[1010:1020]` returns zero rows
  with no error.
- **03 Sorting Exercise B** — prose says `Score1..Score3`/`Total`; the file has
  `Pick1_Score..Pick3_Score`/`TotalScore`.
- **Frequency distributions** — the class intervals never state which end is closed. Answers use
  `right=False` (what the course's own model notebook uses) and say so. It changes the table for
  three of the four datasets.
- **"Identify the most common …"** — in the demo data `Loan_Type` and `Branch` are both exact
  three-way ties at 10/10/10, so answers report every tied category instead of `idxmax()`'s first.
- **Matplotlib Exercise 2** — groups by an `Age Group` column that does not exist; answers derive
  it with `pd.cut` first.
- **bank_transactions.csv** — dates are `DD-MM-YYYY` despite the PDF saying `YYYY-MM-DD`.
