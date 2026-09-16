---
id: mpl-ex4
title: "Matplotlib — Exercise 4: Savings Account Analysis"
source: "Matplotlib/Matplotlib exercises/Matplotlib Exercises.pdf"
datafile: "Matplotlib/Matplotlib exercises/savings_account_analysis.csv"
topic: "Histogram, bar of group means, scatter, box plot over derived age bands, pie chart"
group: "Matplotlib"
order: 93
setup: |
  import pandas as pd
  import matplotlib.pyplot as plt
  df = pd.read_csv("savings_account_analysis.csv")
---

### Q1

**Q.** Visualize the distribution of account balances.

**A.**

```python
plt.figure(figsize=(8, 5))
plt.hist(df["Balance"], bins=10, edgecolor="black")
plt.title("Distribution of Account Balances")
plt.xlabel("Balance (USD)")
plt.ylabel("Number of Accounts")
plt.grid(True, linestyle="--", alpha=0.5)
plt.tight_layout()
plt.show()
```

The chart shows balances spread almost uniformly from 1,854 to 99,506 around a median of 53,372 — every bin holds 7 to 13 of the 100 accounts, with no mode and almost no skew (−0.14).

### Q2

**Q.** Compare the average balance by branch city.

**A.**

```python
g = df.groupby("Branch City")["Balance"].mean()
print(g.round(2))

plt.figure(figsize=(8, 5))
plt.bar(g.index, g.values, color="steelblue", edgecolor="black")
plt.title("Average Balance by Branch City")
plt.xlabel("Branch City")
plt.ylabel("Average Balance (USD)")
plt.xticks(rotation=45)
plt.grid(True, axis="y", linestyle="--", alpha=0.5)
plt.tight_layout()
plt.show()
```

```text
Branch City
Chicago        47200.80
Houston        58170.36
Los Angeles    51251.38
New York       49214.56
Phoenix        58493.55
Name: Balance, dtype: float64
```

Five bars: Phoenix is highest at 58,494 and Chicago lowest at 47,201, a gap of 11,293 or 24% of the lowest.

### Q3

**Q.** Analyze the relationship between age and account balance.

**A.**

```python
print("r(Age, Balance) =", round(df["Age"].corr(df["Balance"]), 4))

plt.figure(figsize=(9, 6))
plt.scatter(df["Age"], df["Balance"], alpha=0.7, color="steelblue",
            edgecolors="black", linewidths=0.4)
plt.title("Age vs Account Balance")
plt.xlabel("Age")
plt.ylabel("Balance (USD)")
plt.grid(True, linestyle="--", alpha=0.4)
plt.tight_layout()
plt.show()
```

```text
r(Age, Balance) = 0.0385
```

The points fill the whole plot area with no upward or downward band; r = 0.039 is effectively zero, so age does not predict account balance in this dataset.

### Q4

**Q.** Explore the variability in number of transactions by age.

**A.**

`Age` is numeric (19 to 79), so a box plot needs bands — bin it with `pd.cut` first, and check `max()` before choosing the edges or the oldest accounts become `NaN` and vanish from the chart.

```python
df["Age Group"] = pd.cut(df["Age"], bins=[18, 30, 40, 50, 60, 70, 80],
                         labels=["18-30", "31-40", "41-50", "51-60", "61-70", "71-80"])
print(df.groupby("Age Group", observed=True)["Number of Transactions"]
        .agg(["count", "median", "std"]).round(2))

groups = [g["Number of Transactions"].values for _, g in df.groupby("Age Group", observed=True)]
labels = [str(k) for k, _ in df.groupby("Age Group", observed=True)]

plt.figure(figsize=(9, 5))
plt.boxplot(groups, tick_labels=labels, patch_artist=True)
plt.title("Variability in Number of Transactions by Age Group")
plt.xlabel("Age Group")
plt.ylabel("Number of Transactions")
plt.grid(True, axis="y", linestyle="--", alpha=0.5)
plt.tight_layout()
plt.show()
```

```text
           count  median    std
Age Group                      
18-30         19    48.0  29.83
31-40         16    63.5  34.92
41-50         14    37.0  19.12
51-60         14    36.5  31.62
61-70         18    48.0  22.51
71-80         19    61.0  29.52
```

Six overlapping boxes with medians between 36.5 and 63.5 and no fliers: transaction activity does not vary systematically with age, and each band holds only 14 to 19 accounts. Note the sixth edge at 80 — `bins=[...,70]` would drop every account aged over 70.

### Q5

**Q.** Visualize the proportion of accounts in different branch cities.

**A.**

```python
bc = df["Branch City"].value_counts()
print(bc.to_string())

plt.figure(figsize=(6.5, 6.5))
plt.pie(bc.values, labels=bc.index, autopct="%1.1f%%", startangle=90)
plt.title("Proportion of Accounts in Different Branch Cities")
plt.axis("equal")
plt.tight_layout()
plt.show()
```

```text
Branch City
New York       25
Houston        22
Phoenix        20
Chicago        20
Los Angeles    13
```

Five slices: New York is the largest at 25.0% and Los Angeles the smallest at 13.0%. With 100 accounts the counts are the percentages.
