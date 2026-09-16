---
id: freq-case3
title: "Frequency Distribution — Case 3: Stock Portfolio Transactions"
source: "Frequency distribution/Practice exercises/Case 3/Exercise 3.pdf"
datafile: "Frequency distribution/Practice exercises/Case 3/exercise_3_stock_transactions.xlsx"
topic: "Frequency tables with value_counts, class intervals with pd.cut, cross-tabulation"
group: "Frequency distribution"
order: 83
setup: |
  import pandas as pd
  df = pd.read_excel("exercise_3_stock_transactions.xlsx", sheet_name="Stock_Transactions")
---

### Q1

**Q.** Find the frequency of transactions for each `Sector`.

**A.**

```python
sector_freq = df["Sector"].value_counts()
print(sector_freq)
```

```text
Sector
Banking    10
IT          8
Auto        8
FMCG        8
Pharma      6
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
Buy     26
Sell    14
Name: count, dtype: int64
```

### Q3

**Q.** Find the frequency of each `Investor_Risk` category.

**A.**

```python
risk_freq = df["Investor_Risk"].value_counts()
print(risk_freq)
```

```text
Investor_Risk
Moderate    15
High        13
Low         12
Name: count, dtype: int64
```

### Q4

**Q.** Create a grouped frequency distribution for `Transaction_Value` using the intervals ₹20,000–40,000, ₹40,000–60,000, ₹60,000–80,000, ₹80,000–1,00,000, ₹1,00,000–1,20,000, ₹1,20,000–1,40,000.

**A.**

```python
bins = [20000, 40000, 60000, 80000, 100000, 120000, 140000]
df["Value_Group"] = pd.cut(df["Transaction_Value"], bins=bins, right=False)
value_freq = df["Value_Group"].value_counts().sort_index()
print(value_freq)
```

```text
Value_Group
[20000, 40000)      12
[40000, 60000)       7
[60000, 80000)       8
[80000, 100000)      7
[100000, 120000)     3
[120000, 140000)     3
Name: count, dtype: int64
```

`right=False` makes every class left-closed, `[lower, upper)`, so ₹60,000 falls in `[60000, 80000)` — the paper never states the convention, and this is the one the course's own notebook uses. It matters here: two rows sit exactly on an edge (₹60,000, ₹1,20,000), so `right=True` would give 12 / 8 / 7 / 7 / 4 / 2 instead of 12 / 7 / 8 / 7 / 3 / 3.

### Q5

**Q.** Convert the grouped frequency distribution into a DataFrame containing Transaction Value Group, Frequency, Percentage and Cumulative Frequency.

**A.**

```python
freq_table = value_freq.reset_index()
freq_table.columns = ["Transaction Value Group", "Frequency"]
freq_table["Percentage"] = (freq_table["Frequency"] / freq_table["Frequency"].sum() * 100).round(2)
freq_table["Cumulative_Frequency"] = freq_table["Frequency"].cumsum()
print(freq_table)
```

```text
  Transaction Value Group  Frequency  Percentage  Cumulative_Frequency
0          [20000, 40000)         12        30.0                    12
1          [40000, 60000)          7        17.5                    19
2          [60000, 80000)          8        20.0                    27
3         [80000, 100000)          7        17.5                    34
4        [100000, 120000)          3         7.5                    37
5        [120000, 140000)          3         7.5                    40
```

Rename by position — the names `value_counts().reset_index()` produces differ across pandas versions.

### Q6

**Q.** Find the count, mean, median, minimum, maximum and standard deviation of `Transaction_Value`.

**A.**

```python
print(df["Transaction_Value"].agg(["count", "mean", "median", "min", "max", "std"]))
```

```text
count         40.00000
mean       65125.00000
median     61000.00000
min        24000.00000
max       135000.00000
std        31483.97028
Name: Transaction_Value, dtype: float64
```

`std()` is the sample standard deviation (`ddof=1`).

### Q7

**Q.** Create a cross-tabulation between `Sector` and `Transaction_Type`.

**A.**

```python
sector_txn = pd.crosstab(df["Sector"], df["Transaction_Type"])
print(sector_txn)
```

```text
Transaction_Type  Buy  Sell
Sector                     
Auto                5     3
Banking             6     4
FMCG                5     3
IT                  6     2
Pharma              4     2
```

### Q8

**Q.** Create a cross-tabulation between `Sector` and `Investor_Risk`.

**A.**

```python
sector_risk = pd.crosstab(df["Sector"], df["Investor_Risk"])
print(sector_risk)
```

```text
Investor_Risk  High  Low  Moderate
Sector                            
Auto              2    1         5
Banking           3    0         7
FMCG              0    6         2
IT                8    0         0
Pharma            0    5         1
```

### Q9

**Q.** Identify the sector with the highest number of transactions, the most common transaction type, the most common investor risk category, and the transaction-value interval having the highest frequency.

**A.**

```python
print("Sector with most transactions :", df["Sector"].mode().tolist())
print("Most common Transaction_Type  :", df["Transaction_Type"].mode().tolist())
print("Most common Investor_Risk     :", df["Investor_Risk"].mode().tolist())
print("Modal Transaction_Value class :", df["Value_Group"].mode().astype(str).tolist())
```

```text
Sector with most transactions : ['Banking']
Most common Transaction_Type  : ['Buy']
Most common Investor_Risk     : ['Moderate']
Modal Transaction_Value class : ['[20000, 40000)']
```

`.mode()` is used instead of `value_counts().idxmax()` because `idxmax()` reports only the first of any tied categories. `Banking` wins outright at 10, but IT, Auto and FMCG tie for second at 8 each.
