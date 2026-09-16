---
id: freq-case1
title: "Frequency Distribution — Case 1: Mutual Fund Investor Transactions"
source: "Frequency distribution/Practice exercises/Case 1/Frequency distribution - Case 1.pdf"
datafile: "Frequency distribution/Practice exercises/Case 1/exercise_1_mutual_fund_transactions.xlsx"
topic: "Frequency tables with value_counts, class intervals with pd.cut, cross-tabulation"
group: "Frequency distribution"
order: 81
setup: |
  import pandas as pd
  df = pd.read_excel("exercise_1_mutual_fund_transactions.xlsx", sheet_name="Mutual_Fund_Data")
---

### Q1

**Q.** Find the number of investors belonging to each `Investor_Type`.

**A.**

```python
investor_freq = df["Investor_Type"].value_counts()
print(investor_freq)
```

```text
Investor_Type
Retail       24
HNI           8
Corporate     8
Name: count, dtype: int64
```

### Q2

**Q.** Find the frequency of each `Transaction_Type`.

**A.**

```python
txn_freq = df["Transaction_Type"].value_counts()
print(txn_freq)
```

```text
Transaction_Type
Purchase      17
SIP           15
Redemption     8
Name: count, dtype: int64
```

### Q3

**Q.** Find the frequency of each `Risk_Profile`.

**A.**

```python
risk_freq = df["Risk_Profile"].value_counts()
print(risk_freq)
```

```text
Risk_Profile
High        15
Moderate    14
Low         11
Name: count, dtype: int64
```

### Q4

**Q.** Create a grouped frequency distribution for `Investment_Amount` using the intervals ₹0–50,000, ₹50,000–1,00,000, ₹1,00,000–1,50,000, ₹1,50,000–2,00,000, ₹2,00,000–2,50,000, ₹2,50,000–3,00,000.

**A.**

```python
bins = [0, 50000, 100000, 150000, 200000, 250000, 300000]
df["Investment_Group"] = pd.cut(df["Investment_Amount"], bins=bins, right=False)
investment_freq = df["Investment_Group"].value_counts().sort_index()
print(investment_freq)
```

```text
Investment_Group
[0, 50000)          17
[50000, 100000)      9
[100000, 150000)     4
[150000, 200000)     5
[200000, 250000)     4
[250000, 300000)     1
Name: count, dtype: int64
```

`right=False` makes every class left-closed, `[lower, upper)`, so ₹50,000 falls in `[50000, 100000)` — the paper never states the convention, and this is the one the course's own notebook uses. It matters here: four rows sit exactly on an edge (₹50,000, ₹1,50,000, ₹2,00,000, ₹2,50,000), so `right=True` would give 18 / 8 / 5 / 5 / 4 / 0 — emptying the top class `[250000, 300000)` completely, because ₹2,50,000 is the column maximum.

### Q5

**Q.** Convert the grouped frequency distribution into a DataFrame containing Investment Amount Group, Frequency, Percentage and Cumulative Frequency.

**A.**

```python
freq_table = investment_freq.reset_index()
freq_table.columns = ["Investment Amount Group", "Frequency"]
freq_table["Percentage"] = (freq_table["Frequency"] / freq_table["Frequency"].sum() * 100).round(2)
freq_table["Cumulative_Frequency"] = freq_table["Frequency"].cumsum()
print(freq_table)
```

```text
  Investment Amount Group  Frequency  Percentage  Cumulative_Frequency
0              [0, 50000)         17        42.5                    17
1         [50000, 100000)          9        22.5                    26
2        [100000, 150000)          4        10.0                    30
3        [150000, 200000)          5        12.5                    35
4        [200000, 250000)          4        10.0                    39
5        [250000, 300000)          1         2.5                    40
```

Rename by position — the names `value_counts().reset_index()` produces differ across pandas versions.

### Q6

**Q.** Find the count, mean, median, minimum, maximum and standard deviation of `Investment_Amount`.

**A.**

```python
print(df["Investment_Amount"].agg(["count", "mean", "median", "min", "max", "std"]))
```

```text
count         40.000000
mean       88900.000000
median     57500.000000
min        15000.000000
max       250000.000000
std        71404.158465
Name: Investment_Amount, dtype: float64
```

`std()` is the sample standard deviation (`ddof=1`).

### Q7

**Q.** Create a cross-tabulation between `Investor_Type` and `Transaction_Type`.

**A.**

```python
investor_txn = pd.crosstab(df["Investor_Type"], df["Transaction_Type"])
print(investor_txn)
```

```text
Transaction_Type  Purchase  Redemption  SIP
Investor_Type                              
Corporate                6           2    0
HNI                      3           2    3
Retail                   8           4   12
```

### Q8

**Q.** Create a cross-tabulation between `Investor_Type` and `Risk_Profile`.

**A.**

```python
investor_risk = pd.crosstab(df["Investor_Type"], df["Risk_Profile"])
print(investor_risk)
```

```text
Risk_Profile   High  Low  Moderate
Investor_Type                     
Corporate         8    0         0
HNI               7    0         1
Retail            0   11        13
```

### Q9

**Q.** Identify the most common investor type, the most common transaction type, the most common risk profile, and the investment amount interval having the highest frequency.

**A.**

```python
print("Most common Investor_Type     :", df["Investor_Type"].mode().tolist())
print("Most common Transaction_Type  :", df["Transaction_Type"].mode().tolist())
print("Most common Risk_Profile      :", df["Risk_Profile"].mode().tolist())
print("Modal Investment_Amount class :", df["Investment_Group"].mode().astype(str).tolist())
```

```text
Most common Investor_Type     : ['Retail']
Most common Transaction_Type  : ['Purchase']
Most common Risk_Profile      : ['High']
Modal Investment_Amount class : ['[0, 50000)']
```

`.mode()` is used instead of `value_counts().idxmax()` because `idxmax()` reports only the first of any tied categories. Nothing is tied for first here, though `HNI` and `Corporate` tie for second at 8 each.
