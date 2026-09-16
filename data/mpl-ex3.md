---
id: mpl-ex3
title: "Matplotlib — Exercise 3: Insurance Claim Analysis"
source: "Matplotlib/Matplotlib exercises/Matplotlib Exercises.pdf"
datafile: "Matplotlib/Matplotlib exercises/insurance_claims.csv"
topic: "Histogram, bar of group means, scatter, grouped box plot, two-slice pie chart"
group: "Matplotlib"
order: 92
setup: |
  import pandas as pd
  import matplotlib.pyplot as plt
  df = pd.read_csv("insurance_claims.csv")
---

### Q1

**Q.** Visualize the distribution of claim amounts.

**A.**

```python
plt.figure(figsize=(8, 5))
plt.hist(df["Claim Amount"], bins=10, edgecolor="black", color="darkorange")
plt.title("Distribution of Claim Amounts")
plt.xlabel("Claim Amount (USD)")
plt.ylabel("Number of Claims")
plt.grid(True, linestyle="--", alpha=0.5)
plt.tight_layout()
plt.show()
```

The chart shows claims spread from 1,197 to 49,925 around a median of 27,022, roughly flat apart from a dip at 10,943-15,815 (3 claims) and fuller bins at 20,688-30,434 (15 and 14 claims).

### Q2

**Q.** Compare the average claim amount by insurance type.

**A.**

```python
g = df.groupby("Insurance Type")["Claim Amount"].mean()
print(g.round(2))

plt.figure(figsize=(8, 5))
plt.bar(g.index, g.values, color="darkorange", edgecolor="black")
plt.title("Average Claim Amount by Insurance Type")
plt.xlabel("Insurance Type")
plt.ylabel("Average Claim Amount (USD)")
plt.grid(True, axis="y", linestyle="--", alpha=0.5)
plt.tight_layout()
plt.show()
```

```text
Insurance Type
Auto      25201.04
Health    27570.06
Home      29416.06
Life      24078.76
Name: Claim Amount, dtype: float64
```

Four bars of nearly the same height: Home is highest at 29,416 and Life lowest at 24,079, a spread of only 22%.

### Q3

**Q.** Analyze the relationship between age and claim amount.

**A.**

```python
print("r(Age, Claim Amount) =", round(df["Age"].corr(df["Claim Amount"]), 4))

plt.figure(figsize=(9, 6))
plt.scatter(df["Age"], df["Claim Amount"], alpha=0.7, color="darkorange",
            edgecolors="black", linewidths=0.4)
plt.title("Age vs Claim Amount")
plt.xlabel("Age")
plt.ylabel("Claim Amount (USD)")
plt.grid(True, linestyle="--", alpha=0.4)
plt.tight_layout()
plt.show()
```

```text
r(Age, Claim Amount) = -0.09
```

The points are scattered over the full range of both axes with no downward band and no clustering; r = −0.090 is effectively zero, so age tells you nothing about the size of a claim in this dataset.

### Q4

**Q.** Explore the variability in claim amounts by insurance type.

**A.**

```python
print(df.groupby("Insurance Type")["Claim Amount"].describe().round(0).to_string())

groups = [g["Claim Amount"].values for _, g in df.groupby("Insurance Type")]
labels = [k for k, _ in df.groupby("Insurance Type")]

plt.figure(figsize=(8, 5))
plt.boxplot(groups, tick_labels=labels, patch_artist=True, showmeans=True)
plt.title("Variability in Claim Amounts by Insurance Type")
plt.xlabel("Insurance Type")
plt.ylabel("Claim Amount (USD)")
plt.grid(True, axis="y", linestyle="--", alpha=0.5)
plt.tight_layout()
plt.show()
```

```text
                count     mean      std     min      25%      50%      75%      max
Insurance Type                                                                     
Auto             27.0  25201.0  14003.0  3327.0  13658.0  24776.0  33766.0  49925.0
Health           31.0  27570.0  15182.0  1197.0  19842.0  29021.0  39591.0  48323.0
Home             17.0  29416.0  12820.0  4304.0  22556.0  28728.0  41772.0  47645.0
Life             25.0  24079.0  15311.0  1854.0   8392.0  22834.0  35754.0  47717.0
```

Four boxes; `Life` is the widest (IQR 27,362 against 19,216-20,108 for the others) and has the lowest median (22,834), so Life claims are the least predictable even though their average is the smallest. No group contains any 1.5 × IQR outliers, and `Home` has only 17 claims, so that box is indicative rather than conclusive.

### Q5

**Q.** Visualize the proportion of claims approved vs. rejected.

**A.**

```python
st = df["Claim Status"].value_counts()
print(st.to_string())

plt.figure(figsize=(6, 6))
plt.pie(st.values, labels=st.index, autopct="%1.1f%%", startangle=90,
        colors=["#C44E52", "#55A868"], explode=[0, 0.05])
plt.title("Proportion of Claims Approved vs Rejected")
plt.axis("equal")
plt.tight_layout()
plt.show()
```

```text
Claim Status
Rejected    56
Approved    44
```

Two slices: 56.0% rejected against 44.0% approved, so fewer than half of all claims are paid.
