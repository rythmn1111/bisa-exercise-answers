---
id: mpl-ex1
title: "Matplotlib — Exercise 1: Bank Branch Performance"
source: "Matplotlib/Matplotlib exercises/Matplotlib Exercises.pdf"
datafile: "Matplotlib/Matplotlib exercises/bank_branch_performance.csv"
topic: "Histogram, bar of group means, bubble scatter, annotated box plot, pie chart"
group: "Matplotlib"
order: 90
setup: |
  import pandas as pd
  import matplotlib.pyplot as plt
  df = pd.read_csv("bank_branch_performance.csv")
---

### Q1

**Q.** Visualize the distribution of customer satisfaction scores. Create a histogram to visualize the distribution of customer satisfaction scores across all branches. *Hint: use `plt.hist()`.*

**A.**

```python
plt.figure(figsize=(8, 5))
plt.hist(df["Customer Satisfaction"], bins=10, edgecolor="black")
plt.title("Distribution of Customer Satisfaction Scores")
plt.xlabel("Customer Satisfaction (1-10)")
plt.ylabel("Number of Branches")
plt.grid(True, linestyle="--", alpha=0.5)
plt.tight_layout()
plt.show()
```

The chart shows a flat, near-uniform spread from 1.14 to 9.96 — each of the ten bins holds between 5 and 14 of the 100 branches, so there is no typical satisfaction score.

### Q2

**Q.** Compare the average net profit by city. Create a bar chart that shows the average net profit of branches in each city. *Hint: use `plt.bar()` and group the data by the `City` column.*

**A.**

```python
g = df.groupby("City")["Net Profit"].mean()
print(g.round(2))

plt.figure(figsize=(8, 5))
plt.bar(g.index, g.values, color="steelblue", edgecolor="black")
plt.title("Average Net Profit by City")
plt.xlabel("City")
plt.ylabel("Average Net Profit (USD)")
plt.xticks(rotation=45)
plt.grid(True, axis="y", linestyle="--", alpha=0.5)
plt.tight_layout()
plt.show()
```

```text
City
Chicago        487511.44
Houston        526023.58
Los Angeles    548500.29
New York       554619.28
Phoenix        400370.74
Name: Net Profit, dtype: float64
```

Five bars: New York is highest at 554,619 and Phoenix lowest at 400,371, a gap of 154,249.

### Q3

**Q.** Analyze the relationship between total deposits and net profit. Create a scatter plot to visualize the relationship between total deposits and net profit. Use marker size to represent the number of customers and marker color to represent customer satisfaction. *Hint: use `plt.scatter()` and map marker sizes and colors to the relevant columns.*

**A.**

```python
print("r(Total Deposits, Net Profit) =", round(df["Total Deposits"].corr(df["Net Profit"]), 4))

plt.figure(figsize=(9, 6))
plt.scatter(df["Total Deposits"], df["Net Profit"],
            s=df["Customers"] / 10,              # marker AREA; Customers runs 646-4996
            c=df["Customer Satisfaction"],
            cmap="viridis", alpha=0.7, edgecolors="black", linewidths=0.4)
plt.colorbar(label="Customer Satisfaction")
plt.title("Total Deposits vs Net Profit (size = customers, colour = satisfaction)")
plt.xlabel("Total Deposits (USD)")
plt.ylabel("Net Profit (USD)")
plt.grid(True, linestyle="--", alpha=0.4)
plt.tight_layout()
plt.show()
```

```text
r(Total Deposits, Net Profit) = -0.0076
```

The bubbles fill the whole rectangle with no rising or falling band, and r = −0.008 is effectively zero — there is no visible relationship between total deposits and net profit in this dataset, and bubble size and colour show no pattern either. `s=` is an area in points squared, so `Customers` is divided by 10 to keep the bubbles separable.

### Q4

**Q.** Explore the variability in total loans across branches. Create a box plot to explore the variability in total loans across all branches. Annotate the median, quartiles, and outliers on the plot. *Hint: use `plt.boxplot()` and annotate using `plt.text()`.*

**A.**

```python
x = df["Total Loans"]
q1, med, q3 = x.quantile(0.25), x.quantile(0.50), x.quantile(0.75)
iqr = q3 - q1
lo, hi = q1 - 1.5 * iqr, q3 + 1.5 * iqr          # the 1.5 x IQR fences
out = x[(x < lo) | (x > hi)]

print("Q1     =", round(q1, 2))
print("Median =", round(med, 2))
print("Q3     =", round(q3, 2))
print("IQR    =", round(iqr, 2))
print("lower fence =", round(lo, 2), "| upper fence =", round(hi, 2))
print("outlier count =", len(out))
print("min =", x.min(), "| max =", x.max())

plt.figure(figsize=(8, 6))
plt.boxplot(x, tick_labels=["All branches"], showmeans=True)
plt.text(1.06, q3,  f"Q3 = {q3:,.0f}", color="green")
plt.text(1.06, med, f"Median = {med:,.0f}", color="blue")
plt.text(1.06, q1,  f"Q1 = {q1:,.0f}", color="green")
plt.text(1.06, hi,  f"Upper fence = {hi:,.0f}", color="grey")
plt.text(1.06, lo,  f"Lower fence = {lo:,.0f}", color="grey")
plt.text(0.58, (q1 + q3) / 2, f"IQR\n= {iqr:,.0f}", color="purple", ha="center", va="center")
for v in out:                                     # labels every outlier
    plt.text(1.02, v, f"{v:,.0f}", color="red", fontsize=8, va="center")
plt.ylim(lo - 0.2 * iqr, hi + 0.2 * iqr)
plt.xlim(0.35, 1.95)
plt.title("Variability in Total Loans Across Branches")
plt.ylabel("Total Loans (USD)")
plt.grid(True, axis="y", linestyle="--", alpha=0.5)
plt.tight_layout()
plt.show()
```

```text
Q1     = 1662357.75
Median = 2517402.0
Q3     = 3289419.75
IQR    = 1627062.0
lower fence = -778235.25 | upper fence = 5730012.75
outlier count = 0
min = 615294 | max = 3971080
```

One box with the median (2,517,402), both quartiles, the IQR and both fences labelled by `plt.text()`, which takes data coordinates so each label sits at the height it describes. `Total Loans` has **no outliers** under the 1.5 × IQR rule — the fences are −778,235 and 5,730,013 against a maximum of 3,971,080 — so the annotation loop draws no outlier labels on this data.

### Q5

**Q.** Visualize the proportion of branches in different cities. Create a pie chart to visualize the proportion of branches located in different cities. *Hint: use `plt.pie()` and include labels for each city.*

**A.**

```python
counts = df["City"].value_counts()
print(counts.to_string())

plt.figure(figsize=(6.5, 6.5))
plt.pie(counts.values, labels=counts.index, autopct="%1.1f%%", startangle=90)
plt.title("Proportion of Branches in Different Cities")
plt.axis("equal")
plt.tight_layout()
plt.show()
```

```text
City
Houston        26
Los Angeles    21
Phoenix        19
New York       18
Chicago        16
```

Five slices: Houston is the largest at 26.0%, Chicago the smallest at 16.0%. With exactly 100 branches the counts are the percentages. Pass `counts.values` and `counts.index` together so each label stays with its own slice.
