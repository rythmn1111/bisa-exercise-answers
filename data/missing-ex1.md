---
id: missing-ex1
title: "02 Missing Values — Exercise 1: Customer Loan Applications"
source: "Pandas exercises/02 Missing values/Exercise 1 - Customer loan applications/Exercise 1 Customer loan applications.pdf"
datafile: "Pandas exercises/02 Missing values/Exercise 1 - Customer loan applications/Customer loan applications.csv"
topic: "Drop the undecidable column, fill the approximable one"
group: "Pandas exercises"
order: 40
setup: |
  import pandas as pd
  df = pd.read_csv("Customer loan applications.csv")
---

### Q1

**Q.** Identify the number of missing values in each column.

**A.**

```python
print(df)
print(df.isna().sum())
```

```text
  Customer   Age  CreditScore
0    Alice  25.0        720.0
1      Bob   NaN        650.0
2  Charlie  30.0          NaN
3    David   NaN        580.0
4      Eva  22.0          NaN
Customer       0
Age            2
CreditScore    2
dtype: int64
```

### Q2

**Q.** Drop rows where CreditScore is missing.

**A.**

```python
clean = df.dropna(subset=["CreditScore"]).copy()
print("original:", df.shape, "-> after:", clean.shape)
print(clean)
```

```text
original: (5, 3) -> after: (3, 3)
  Customer   Age  CreditScore
0    Alice  25.0        720.0
1      Bob   NaN        650.0
3    David   NaN        580.0
```

Charlie and Eva are removed: 5 rows down to 3.

### Q3

**Q.** Replace missing Age with the average Age of customers.

**A.**

```python
print("mean Age of the retained rows:", clean["Age"].mean())
clean["Age"] = clean["Age"].fillna(clean["Age"].mean())
print(clean)
```

```text
mean Age of the retained rows: 25.0
  Customer   Age  CreditScore
0    Alice  25.0        720.0
1      Bob  25.0        650.0
3    David  25.0        580.0
```

"Average Age of customers" is ambiguous after Q2 has dropped rows. Taking the question order at
face value, the mean is computed on the 3 surviving rows, where only Alice's age remains, so it is
**25.0**. Over the original 5 rows it would be **25.666666666666668** — say which you used.

### Q4

**Q.** Discuss: If missing CreditScore were instead replaced by the average score, how would that
affect loan approvals?

**A.** Every unscored applicant would be judged on the portfolio's average rather than their own
record, so the decision would be driven by other people's data. Weak credits would be pulled up to
the average and wrongly approved — the expensive error, because it books bad loans at
good-customer pricing — while genuinely strong applicants would be pulled down and wrongly
declined or mispriced. The bank would also lose the distinction between "no score" and "average
score", yet a thin or absent credit file is itself a risk signal usually referred to manual
underwriting. Statistically, mean imputation compresses the spread of `CreditScore`, so its power
to separate good from bad applicants falls and any cut-off calibrated on the imputed data is
wrong. The defensible treatments are to decline or refer the record, or to model "score missing"
as its own category — not to average it away.
