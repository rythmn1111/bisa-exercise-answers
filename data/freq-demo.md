---
id: freq-demo
title: "Frequency Distribution — Demo Case: Loan Applications"
source: "Frequency distribution/Demo case/Demo problem for frequency distribution.pdf"
datafile: "Frequency distribution/Demo case/loan_frequency_demo_dataset.xlsx"
topic: "Frequency tables with value_counts, class intervals with pd.cut, cross-tabulation"
group: "Frequency distribution"
order: 80
setup: |
  import pandas as pd
  df = pd.read_excel("loan_frequency_demo_dataset.xlsx", sheet_name="Loan_Data")
---

### Q1

**Q.** Find the number of customers in each `Risk_Category` using `value_counts()`.

**A.**

```python
risk_freq = df["Risk_Category"].value_counts()
print(risk_freq)
```

```text
Risk_Category
Low       14
Medium    10
High       6
Name: count, dtype: int64
```

### Q2

**Q.** Find the frequency of each `Loan_Type`.

**A.**

```python
loan_freq = df["Loan_Type"].value_counts()
print(loan_freq)
```

```text
Loan_Type
Home        10
Personal    10
Vehicle     10
Name: count, dtype: int64
```

### Q3

**Q.** Find how many loan applications came from each `Branch`.

**A.**

```python
branch_freq = df["Branch"].value_counts()
print(branch_freq)
```

```text
Branch
Panaji    10
Margao    10
Vasco     10
Name: count, dtype: int64
```

### Q4

**Q.** Create the following class intervals for `Processing_Days` — 0–5, 5–10, 10–15, 15–20, 20–25 days — and create a frequency distribution table showing the number of applications in each interval.

**A.**

```python
bins = [0, 5, 10, 15, 20, 25]
df["Processing_Group"] = pd.cut(df["Processing_Days"], bins=bins, right=False)
processing_freq = df["Processing_Group"].value_counts().sort_index()
print(processing_freq)
```

```text
Processing_Group
[0, 5)       0
[5, 10)     13
[10, 15)     9
[15, 20)     6
[20, 25)     2
Name: count, dtype: int64
```

`right=False` makes every class left-closed, `[lower, upper)`, so a 5-day application falls in `[5, 10)` — the paper never states the convention, and this is the one the course's own notebook uses. It matters: five values sit exactly on an edge (5, 5, 10, 15, 20), so `right=True` would give 2 / 12 / 9 / 6 / 1 instead.

### Q5

**Q.** Convert the grouped frequency distribution into a DataFrame with the columns `Processing_Days`, `Frequency`, `Percentage` and `Cumulative_Frequency`.

**A.**

```python
freq_table = processing_freq.reset_index()
freq_table.columns = ["Processing_Days", "Frequency"]
freq_table["Percentage"] = (freq_table["Frequency"] / freq_table["Frequency"].sum() * 100).round(2)
freq_table["Cumulative_Frequency"] = freq_table["Frequency"].cumsum()
print(freq_table)
```

```text
  Processing_Days  Frequency  Percentage  Cumulative_Frequency
0          [0, 5)          0        0.00                     0
1         [5, 10)         13       43.33                    13
2        [10, 15)          9       30.00                    22
3        [15, 20)          6       20.00                    28
4        [20, 25)          2        6.67                    30
```

Rename by position — the names `value_counts().reset_index()` produces differ across pandas versions.

### Q6

**Q.** For `Processing_Days`, find the count, mean, median, minimum, maximum and standard deviation.

**A.**

```python
print(df["Processing_Days"].agg(["count", "mean", "median", "min", "max", "std"]))
```

```text
count     30.000000
mean      11.600000
median    11.000000
min        5.000000
max       21.000000
std        4.724113
Name: Processing_Days, dtype: float64
```

`std()` is the sample standard deviation (`ddof=1`).

### Q7

**Q.** Create a cross-tabulation showing the number of customers in each `Risk_Category` for each `Branch`.

**A.**

```python
branch_risk = pd.crosstab(df["Branch"], df["Risk_Category"])
print(branch_risk)
```

```text
Risk_Category  High  Low  Medium
Branch                          
Margao            0    1       9
Panaji            3    7       0
Vasco             3    6       1
```

### Q8

**Q.** Create a cross-tabulation between `Loan_Type` and `Risk_Category`.

**A.**

```python
loan_risk = pd.crosstab(df["Loan_Type"], df["Risk_Category"])
print(loan_risk)
```

```text
Risk_Category  High  Low  Medium
Loan_Type                       
Home              2    8       0
Personal          2    1       7
Vehicle           2    5       3
```

### Q9

**Q.** From your tables, identify the most common risk category, the most common loan type, the processing-time interval containing the largest number of applications, and the branch with the highest number of applications.

**A.**

```python
print("Most common Risk_Category   :", df["Risk_Category"].mode().tolist())
print("Most common Loan_Type       :", df["Loan_Type"].mode().tolist())
print("Modal Processing_Days class :", df["Processing_Group"].mode().astype(str).tolist())
print("Branch with most applications:", df["Branch"].mode().tolist())
```

```text
Most common Risk_Category   : ['Low']
Most common Loan_Type       : ['Home', 'Personal', 'Vehicle']
Modal Processing_Days class : ['[5, 10)']
Branch with most applications: ['Margao', 'Panaji', 'Vasco']
```

`Loan_Type` and `Branch` are **exact three-way ties at 10 applications each**, so neither has a single most common value; `.mode()` reports every tied category, whereas `value_counts().idxmax()` would silently return only `Home` and `Panaji`.
