---
id: mpl-ex2
title: "Matplotlib — Exercise 2: Credit Card Usage"
source: "Matplotlib/Matplotlib exercises/Matplotlib Exercises.pdf"
datafile: "Matplotlib/Matplotlib exercises/credit_card_usage.csv"
topic: "Histogram, binning Age with pd.cut, bar of group means, scatter, box plot, pie chart"
group: "Matplotlib"
order: 91
setup: |
  import pandas as pd
  import matplotlib.pyplot as plt
  df = pd.read_csv("credit_card_usage.csv")

  # Q2, Q4 and Q5 all group by "age group", but the file has no Age Group column -
  # only a numeric Age from 19 to 69 - so it has to be derived first.
  df["Age Group"] = pd.cut(df["Age"], bins=[18, 30, 40, 50, 60, 70],
                           labels=["18-30", "31-40", "41-50", "51-60", "61-70"])
---

### Q1

**Q.** Visualize the distribution of total spend. Create a histogram to visualize the distribution of the total amount spent by customers.

**A.**

```python
plt.figure(figsize=(8, 5))
plt.hist(df["Total Spend"], bins=10, edgecolor="black")
plt.title("Distribution of Total Spend")
plt.xlabel("Total Spend (USD)")
plt.ylabel("Number of Customers")
plt.grid(True, linestyle="--", alpha=0.5)
plt.tight_layout()
plt.show()
```

The chart shows an almost perfectly flat distribution from 1,197 to 29,666 (median 15,250, skew 0.02) — every bin holds 7 to 13 of the 100 customers, so there is no typical spend level.

### Q2

**Q.** Compare the average credit limit by age group. Create a bar chart that shows the average credit limit for different age groups.

**A.**

`Age Group` is not a column in `credit_card_usage.csv`, so it has to be derived with `pd.cut` on `Age` using edges 18/30/40/50/60/70 (see the setup) — that step is part of the answer.

```python
g = df.groupby("Age Group", observed=True)["Credit Limit"].mean()
print(g.round(2))

plt.figure(figsize=(8, 5))
plt.bar(g.index.astype(str), g.values, color="steelblue", edgecolor="black")
plt.title("Average Credit Limit by Age Group")
plt.xlabel("Age Group")
plt.ylabel("Average Credit Limit (USD)")
plt.grid(True, axis="y", linestyle="--", alpha=0.5)
plt.tight_layout()
plt.show()
```

```text
Age Group
18-30    32128.62
31-40    26801.04
41-50    26588.11
51-60    24692.88
61-70    24220.58
Name: Credit Limit, dtype: float64
```

Five bars stepping down from 32,129 for the 18-30 band to 24,221 for 61-70; with only 17 to 24 customers per band the decline is weak, not a policy finding.

### Q3

**Q.** Analyze the relationship between credit limit and total spend. Create a scatter plot to visualize the relationship between credit limit and total spend. Use marker size to represent the number of transactions.

**A.**

```python
print("r(Credit Limit, Total Spend) =", round(df["Credit Limit"].corr(df["Total Spend"]), 4))

plt.figure(figsize=(9, 6))
plt.scatter(df["Credit Limit"], df["Total Spend"],
            s=df["Number of Transactions"],       # 4 to 197, no divisor needed
            alpha=0.6, color="steelblue", edgecolors="black", linewidths=0.4)
plt.title("Credit Limit vs Total Spend (size = number of transactions)")
plt.xlabel("Credit Limit (USD)")
plt.ylabel("Total Spend (USD)")
plt.grid(True, linestyle="--", alpha=0.4)
plt.tight_layout()
plt.show()
```

```text
r(Credit Limit, Total Spend) = 0.1251
```

The points form a formless cloud across the full range of both axes with no rising band; r = 0.125 is a very weak correlation, so there is no usable relationship between credit limit and total spend here. No colour bar, because nothing is mapped to `c=`.

### Q4

**Q.** Explore customer satisfaction across different age groups. Create a box plot to explore the variability in customer satisfaction across different age groups.

**A.**

Same derived `Age Group`. `plt.boxplot` wants a **list of arrays**, one per box, not a DataFrame plus a group column.

```python
print(df.groupby("Age Group", observed=True)["Customer Satisfaction"].describe().round(2).to_string())

groups = [g["Customer Satisfaction"].values for _, g in df.groupby("Age Group", observed=True)]
labels = [str(k) for k, _ in df.groupby("Age Group", observed=True)]

plt.figure(figsize=(8, 5))
plt.boxplot(groups, tick_labels=labels, patch_artist=True, showmeans=True)
plt.title("Customer Satisfaction by Age Group")
plt.xlabel("Age Group")
plt.ylabel("Customer Satisfaction")
plt.grid(True, axis="y", linestyle="--", alpha=0.5)
plt.tight_layout()
plt.show()
```

```text
           count  mean   std   min   25%   50%   75%   max
Age Group                                                 
18-30       21.0  4.58  2.98  1.05  1.85  4.08  6.21  9.84
31-40       24.0  5.11  2.84  1.15  2.80  4.99  7.43  9.50
41-50       19.0  5.85  3.01  1.46  2.66  6.73  8.38  9.69
51-60       17.0  4.62  2.19  1.64  3.31  4.12  5.98  9.73
61-70       19.0  6.07  2.45  2.25  3.83  6.91  7.85  9.50
```

Five heavily overlapping boxes with medians between 4.08 and 6.91 and no fliers, so satisfaction does not vary systematically with age. `tick_labels=` is the matplotlib 3.9 name; `labels=` is deprecated.

### Q5

**Q.** Visualize the proportion of customers in each age group. Create a pie chart to visualize the proportion of customers in each age group.

**A.**

```python
counts = df["Age Group"].value_counts().sort_index()      # sort_index() = bin order, not frequency
print(counts)

plt.figure(figsize=(6.5, 6.5))
plt.pie(counts.values, labels=counts.index.astype(str), autopct="%1.1f%%", startangle=90)
plt.title("Proportion of Customers in Each Age Group")
plt.axis("equal")
plt.tight_layout()
plt.show()
```

```text
Age Group
18-30    21
31-40    24
41-50    19
51-60    17
61-70    19
Name: count, dtype: int64
```

Five near-equal slices, 17.0% to 24.0% — again on the derived `Age Group`, and with 100 customers the counts are the percentages.
