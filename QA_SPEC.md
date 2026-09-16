# QA_SPEC — how to write a question set file

This site has exactly two things on it: **the question, and the answer.** No teaching, no
"exam phrasings", no variants. If a reader wants explanation they go to the guide; here they want
the answer.

You are writing one file: `qa/data/<set-id>.md`

## Hard rules

1. **Every question in your assigned set gets an entry. No skipping, no merging.** If the source
   PDF numbers them 1–11, you produce Q1…Q11. If a question has parts (a)/(b) or A/B, keep them
   inside that one entry.
2. **RUN every code answer** with `python3` (3.9.6, pandas 2.3.3, matplotlib 3.9.4 — use
   `matplotlib.use("Agg")`) against the real course data files, which live in an `Exercises/`
   folder alongside this repo. Paste the real output. Never invent output.
3. **Quote the question close to verbatim** from the source PDF. Light trimming is fine; do not
   paraphrase away the specifics (column names, thresholds, interval edges).
4. **The answer is the shortest correct thing that answers the question**, in the examiner's own
   style. A one-liner if it is a one-liner. Do not pad.
5. There is a companion guide at `../book/content/` that already contains verified solutions to
   most of these questions. **Reuse it** rather than re-deriving — but still execute the code to
   confirm it runs and to capture the output. If the guide and your run disagree, trust your run
   and say so in your report.
6. Plain GitHub-flavoured Markdown only. No HTML except nothing — not even `<details>`.

## File format

Frontmatter, then one `### Q<n>` block per question. The parser is strict about this shape.

```markdown
---
id: 01-basics-ex1
title: "01 Basics — Exercise 1: Bank Transactions"
source: "Pandas exercises/01 Basics/Exercise 1 - Bank Transactions/Bank Transactions.pdf"
datafile: "Pandas exercises/01 Basics/Exercise 1 - Bank Transactions/bank_transactions.csv"
topic: "Inspect, select, filter, first look at missing values"
group: "Pandas exercises"
order: 20
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
   TxnID        Date  AccountID  Branch TxnType    Amount Channel          Remarks
0   5001  01-07-2025        101  Mumbai  Credit  250000.0    NEFT           Salary
...
```

### Q2

**Q.** Find the total number of rows and columns, and list all column names.

**A.**

```python
print(df.shape)
print(df.columns.tolist())
```

```text
(12, 8)
['TxnID', 'Date', 'AccountID', 'Branch', 'TxnType', 'Amount', 'Channel', 'Remarks']
```
```

### Frontmatter fields

| Field | Required | Notes |
| --- | --- | --- |
| `id` | yes | must equal the filename stem |
| `title` | yes | shown as the set heading |
| `source` | yes | path of the question PDF, relative to `Exercises/` |
| `datafile` | no | the data file(s) the set uses; a string or a list |
| `topic` | yes | one short phrase |
| `group` | yes | one of: `Core Python`, `Pandas exercises`, `Concat merge join`, `Frequency distribution`, `Matplotlib`, `Integrated exercises` |
| `order` | yes | the value given in your task; must be unique across the site |
| `setup` | no | a YAML block scalar (`\|`) of the imports/loads every answer in the file assumes. Rendered once at the top of the set so the per-question answers stay short. |

### Rules inside a question block

- The heading is exactly `### Q1`, `### Q2`, … (or `### Q1a` where the source itself splits them).
  Nothing else on that line.
- `**Q.**` starts the question. One paragraph, or a short bullet list if the source is a list.
- `**A.**` starts the answer. Then any mix of:
  - a ` ```python ` block — the code,
  - a ` ```text ` block — its real output,
  - short prose for a question that wants words rather than code.
- If the question asks for a **written/discussion answer** ("Discuss…", "Explain why…",
  "Evaluate the design…"), the answer is 2–5 sentences of prose. No code fence.
- If the question asks for a **chart**, give the code, and state in one line what the chart shows.
  Do not embed images.
- If a question is **impossible or wrong as printed**, answer it honestly in one sentence, then
  give the corrected version. Known cases:
  - `Integrated Case 2` Q11 (`Credit_Rating == "AAA"` and `Current_Value > 400000`) returns zero
    rows; the portfolio maximum is 246,147.60.
  - `03 Sorting/Exercise 1` names columns `City` and `Revenue` and IDs `1010–1020`; the CSV has
    `Branch`, `DisbursedAmount` and IDs `11001–11200`.
  - `03 Sorting/Exercise 2` says `Score1..Score3` and `Total`; the file has
    `Pick1_Score..Pick3_Score` and `TotalScore`.
  - Frequency-distribution class intervals never state the closure convention. Use
    `right=False` (what the course's own model notebook uses) and say so in one clause.
  - `value_counts().idxmax()` hides exact ties — in the frequency demo data `Loan_Type` is
    10/10/10 and `Branch` is 10/10/10. Report all tied categories.
  - `credit_card_usage.csv` has no `Age Group` column though three questions group by it; bin
    `Age` with `pd.cut` first.
  - `bank_transactions.csv` dates are `DD-MM-YYYY` (`01-07-2025`) though the PDF says
    `YYYY-MM-DD`; parse with `dayfirst=True`.

## Reporting back

Reply with: the file you wrote, the number of questions in it, how many code blocks you executed,
and any question where the source is ambiguous or wrong.
