---
id: case3
title: "Integrated Case 3 — Insurance Claims Portfolio Analysis"
source: "Integrated exercises/Case 3/Insurance Claims Portfolio Analysis.pdf"
datafile: "Integrated exercises/Case 3/Insurance_Claims_Practice.xlsx"
topic: "Two-sheet left merge, derived ratio columns, filtering, describe, crosstab, pivot tables, three Matplotlib figures"
group: "Integrated exercises"
order: 102
setup: |
  import pandas as pd
  import matplotlib
  matplotlib.use("Agg")                    # drop this line in Jupyter
  import matplotlib.pyplot as plt
  pd.set_option("display.width", 160)
  pd.set_option("display.max_columns", 30)

  claims = pd.read_excel("Insurance_Claims_Practice.xlsx", sheet_name="Claims")
  policy = pd.read_excel("Insurance_Claims_Practice.xlsx", sheet_name="Policy_Master")

  # Q3 — all observations from Claims retained
  df = pd.merge(claims, policy, on="Policy_ID", how="left")
  # Q5 and Q6 — the two derived columns every later question uses
  df["Claim_to_SumInsured_pct"]   = (df["Claim_Amount"]   / df["Sum_Insured"]) * 100
  df["Premium_to_SumInsured_pct"] = (df["Annual_Premium"] / df["Sum_Insured"]) * 100
---

### Q1

**Q.** Read the two sheets (`Claims` and `Policy_Master`) into separate DataFrames.

**A.**

```python
claims = pd.read_excel("Insurance_Claims_Practice.xlsx", sheet_name="Claims")
policy = pd.read_excel("Insurance_Claims_Practice.xlsx", sheet_name="Policy_Master")
print("Claims:", claims.shape, "| Policy_Master:", policy.shape)
```

```text
Claims: (150, 6) | Policy_Master: (60, 6)
```

### Q2

**Q.** Display the first five observations of each DataFrame.

**A.**

```python
print(claims.head())
print(policy.head())
```

```text
  Claim_ID Policy_ID Claim_Date  Claim_Amount  Settlement_Days Claim_Status
0    C0001     P0038 2026-04-10     312013.63               70     Approved
1    C0002     P0048 2025-12-28     573508.62               61     Approved
2    C0003     P0017 2026-07-05      99722.73               27     Approved
3    C0004     P0048 2026-07-26     559165.67               26     Approved
4    C0005     P0048 2026-07-06     508146.10               70     Approved
  Policy_ID Policy_Type  Annual_Premium  Sum_Insured Region Risk_Category
0     P0001       Motor        20655.80       700000  North           Low
1     P0002      Health        12143.84       850000  South      Moderate
2     P0003      Travel         6794.08       750000   East          High
3     P0004    Property         7232.76      1000000   West           Low
4     P0005       Motor        13857.87      1050000  North      Moderate
```

### Q3

**Q.** Combine the policy information with the claims information using `Policy_ID`. Ensure that
all observations from `Claims` are retained.

**A.** "All observations from `Claims` retained" = a **left merge with `Claims` on the left**.

```python
print("Policy_IDs in Claims missing from Policy_Master:", set(claims["Policy_ID"]) - set(policy["Policy_ID"]))
print("policies that never appear in a claim:", len(set(policy["Policy_ID"]) - set(claims["Policy_ID"])))
df = pd.merge(claims, policy, on="Policy_ID", how="left")
print("left :", df.shape, "| outer:", pd.merge(claims, policy, on="Policy_ID", how="outer").shape)
```

```text
Policy_IDs in Claims missing from Policy_Master: set()
policies that never appear in a claim: 5
left : (150, 11) | outer: (155, 11)
```

Every `Policy_ID` in `Claims` exists in the master, so the left merge keeps exactly 150 rows — one
per claim. Five policies have never been claimed against; a left merge correctly drops them,
whereas `how="outer"` would add 5 rows in which every claim column is missing.

### Q4

**Q.** Check and display the shape of the combined DataFrame.

**A.**

```python
print("shape:", df.shape)
print("missing values:", int(df.isna().sum().sum()))
```

```text
shape: (150, 11)
missing values: 0
```

150 rows = the `Claims` row count, so no claim was dropped or duplicated; 11 columns = 6 + 6 − 1
shared key; zero missing values confirms every key matched.

### Q5

**Q.** Create `Claim_to_SumInsured_pct = (Claim_Amount / Sum_Insured) × 100`.

**A.**

```python
df["Claim_to_SumInsured_pct"] = (df["Claim_Amount"] / df["Sum_Insured"]) * 100
print(df[["Claim_ID", "Claim_Amount", "Sum_Insured", "Claim_to_SumInsured_pct"]].head().round(2))
```

```text
  Claim_ID  Claim_Amount  Sum_Insured  Claim_to_SumInsured_pct
0    C0001     312013.63      1100000                    28.36
1    C0002     573508.62      1850000                    31.00
2    C0003      99722.73       450000                    22.16
3    C0004     559165.67      1850000                    30.23
4    C0005     508146.10      1850000                    27.47
```

No claim exceeds its own sum insured — the ratio tops out at 84.05% — so no capping is needed.

### Q6

**Q.** Create `Premium_to_SumInsured_pct = (Annual_Premium / Sum_Insured) × 100`.

**A.**

```python
df["Premium_to_SumInsured_pct"] = (df["Annual_Premium"] / df["Sum_Insured"]) * 100
print(df[["Claim_ID", "Annual_Premium", "Sum_Insured", "Premium_to_SumInsured_pct"]].head().round(2))
```

```text
  Claim_ID  Annual_Premium  Sum_Insured  Premium_to_SumInsured_pct
0    C0001        26090.01      1100000                       2.37
1    C0002        11457.84      1850000                       0.62
2    C0003        15384.86       450000                       3.42
3    C0004        11457.84      1850000                       0.62
4    C0005        11457.84      1850000                       0.62
```

### Q7

**Q.** Display only `Claim_ID`, `Policy_Type`, `Claim_Amount`, `Settlement_Days` and
`Claim_Status`.

**A.**

```python
cols = ["Claim_ID", "Policy_Type", "Claim_Amount", "Settlement_Days", "Claim_Status"]
print(df[cols].head())
print("shape:", df[cols].shape)
```

```text
  Claim_ID Policy_Type  Claim_Amount  Settlement_Days Claim_Status
0    C0001      Health     312013.63               70     Approved
1    C0002    Property     573508.62               61     Approved
2    C0003       Motor      99722.73               27     Approved
3    C0004    Property     559165.67               26     Approved
4    C0005    Property     508146.10               70     Approved
shape: (150, 5)
```

### Q8

**Q.** Extract all Approved claims.

**A.**

```python
approved = df[df["Claim_Status"] == "Approved"]
print("Approved claims:", approved.shape)
print(approved[cols].head())
```

```text
Approved claims: (101, 13)
  Claim_ID Policy_Type  Claim_Amount  Settlement_Days Claim_Status
0    C0001      Health     312013.63               70     Approved
1    C0002    Property     573508.62               61     Approved
2    C0003       Motor      99722.73               27     Approved
3    C0004    Property     559165.67               26     Approved
4    C0005    Property     508146.10               70     Approved
```

101 of 150 claims (67.3%). 13 columns because the Q5–Q6 derived columns are now part of `df`.

### Q9

**Q.** Extract claims where `Settlement_Days` exceeds 30 **OR** `Claim_Amount` exceeds
Rs. 2,00,000.

**A.**

```python
slow_or_big = df[(df["Settlement_Days"] > 30) | (df["Claim_Amount"] > 200000)]
print("matching claims:", slow_or_big.shape)
print(slow_or_big[["Claim_ID", "Claim_Amount", "Settlement_Days", "Claim_Status"]].head())
```

```text
matching claims: (124, 13)
  Claim_ID  Claim_Amount  Settlement_Days Claim_Status
0    C0001     312013.63               70     Approved
1    C0002     573508.62               61     Approved
3    C0004     559165.67               26     Approved
4    C0005     508146.10               70     Approved
5    C0006      75773.41               32     Approved
```

124 of 150 claims (82.7%): 98 slow + 73 large − 47 that are both. Each condition must be in its
own pair of brackets, because `|` binds tighter than `>`.

### Q10

**Q.** Extract observations belonging to High-risk policies where the claim has been Approved.

**A.**

```python
hr = df[(df["Risk_Category"] == "High") & (df["Claim_Status"] == "Approved")]
print("High risk and Approved:", hr.shape)
print(hr[["Claim_ID", "Policy_Type", "Risk_Category", "Claim_Amount", "Claim_Status"]].head())
```

```text
High risk and Approved: (36, 13)
   Claim_ID Policy_Type Risk_Category  Claim_Amount Claim_Status
1     C0002    Property          High     573508.62     Approved
3     C0004    Property          High     559165.67     Approved
4     C0005    Property          High     508146.10     Approved
16    C0017    Property          High     127993.16     Approved
21    C0022      Travel          High     143468.36     Approved
```

### Q11

**Q.** Sort the claims by `Claim_Amount` from highest to lowest.

**A.**

```python
by_amt = df.sort_values("Claim_Amount", ascending=False)
print(by_amt[["Claim_ID", "Policy_Type", "Claim_Amount", "Claim_Status"]].head())
print("shape:", by_amt.shape)
```

```text
    Claim_ID Policy_Type  Claim_Amount Claim_Status
138    C0139    Property    1136029.18     Rejected
55     C0056    Property    1018696.13      Pending
48     C0049    Property    1009846.83      Pending
28     C0029    Property    1008071.58      Pending
29     C0030    Property     991062.86     Rejected
shape: (150, 13)
```

### Q12

**Q.** Display the five largest claims.

**A.**

```python
print(df.nlargest(5, "Claim_Amount")[["Claim_ID", "Policy_ID", "Policy_Type", "Region",
                                      "Claim_Amount", "Claim_Status"]])
```

```text
    Claim_ID Policy_ID Policy_Type Region  Claim_Amount Claim_Status
138    C0139     P0020    Property   West    1136029.18     Rejected
55     C0056     P0056    Property   West    1018696.13      Pending
48     C0049     P0020    Property   West    1009846.83      Pending
28     C0029     P0044    Property   West    1008071.58      Pending
29     C0030     P0044    Property   West     991062.86     Rejected
```

All five are Property policies in the West region, and none of them is Approved.

### Q13

**Q.** Obtain descriptive statistics for `Annual_Premium`, `Sum_Insured`, `Claim_Amount`,
`Settlement_Days` and `Claim_to_SumInsured_pct`.

**A.**

```python
stat_cols = ["Annual_Premium", "Sum_Insured", "Claim_Amount", "Settlement_Days",
             "Claim_to_SumInsured_pct"]
print(df[stat_cols].describe().round(2))
```

```text
       Annual_Premium  Sum_Insured  Claim_Amount  Settlement_Days  Claim_to_SumInsured_pct
count          150.00       150.00        150.00           150.00                   150.00
mean         12406.93   1072333.33     268709.20            40.01                    29.88
std           9365.43    943852.18     246494.05            20.68                    19.23
min           1305.70    150000.00       7302.37             3.00                     1.48
25%           4818.72    400000.00      80094.57            22.00                    12.35
50%          11457.84    750000.00     188095.74            40.50                    28.84
75%          17108.75   1237500.00     365871.64            58.75                    45.45
max          43823.74   3900000.00    1136029.18            75.00                    84.05
```

`Claim_Amount` is strongly right-skewed (mean 268,709 against median 188,096); `Settlement_Days`
is almost symmetric and spans the full 3–75 range.

### Q14

**Q.** Calculate separately the mean, median, standard deviation, minimum and maximum of
`Settlement_Days`.

**A.**

```python
print(df["Settlement_Days"].agg(["mean", "median", "std", "min", "max"]).round(2))
```

```text
mean      40.01
median    40.50
std       20.68
min        3.00
max       75.00
Name: Settlement_Days, dtype: float64
```

### Q15

**Q.** Create a frequency table for `Claim_Status`.

**A.**

```python
status_counts = df["Claim_Status"].value_counts()
print(status_counts)
```

```text
Claim_Status
Approved    101
Pending      29
Rejected     20
Name: count, dtype: int64
```

67.3% approved, 19.3% pending, 13.3% rejected.

### Q16

**Q.** Create a cross-tabulation with `Policy_Type` as rows and `Claim_Status` as columns.

**A.**

```python
print(pd.crosstab(df["Policy_Type"], df["Claim_Status"], margins=True, margins_name="Total"))
```

```text
Claim_Status  Approved  Pending  Rejected  Total
Policy_Type                                     
Health              20        2         4     26
Motor               22       10         4     36
Property            28        8         5     41
Travel              31        9         7     47
Total              101       29        20    150
```

Add `normalize="index"` to compare types fairly: Health is approved most often (76.9%), Motor
least (61.1%) and Motor carries the largest pending backlog (27.8%).

### Q17

**Q.** Create a pivot table showing mean `Claim_Amount` for each `Policy_Type`.

**A.**

```python
pv = pd.pivot_table(df, values="Claim_Amount", index="Policy_Type", aggfunc="mean")
print(pv.round(2))
```

```text
             Claim_Amount
Policy_Type              
Health          298188.60
Motor           244500.16
Property        485567.72
Travel           81770.07
```

### Q18

**Q.** Create another pivot table showing the minimum, mean and maximum `Settlement_Days` for
each `Risk_Category`.

**A.**

```python
print(pd.pivot_table(df, values="Settlement_Days", index="Risk_Category",
                     aggfunc=["min", "mean", "max"]).round(2))
```

```text
                          min            mean             max
              Settlement_Days Settlement_Days Settlement_Days
Risk_Category                                                
High                        3           39.75              70
Low                         7           41.70              75
Moderate                    5           38.77              75
```

Risk category has almost no effect on settlement time — means of 38.8, 39.8 and 41.7 days against
a within-group standard deviation of 20.7 days.

### Q19

**Q.** Identify the `Policy_Type` having the highest average `Claim_Amount`. Then Part D
(unnumbered in the paper, so it belongs to this last entry):

- **Figure 1** — one figure in a 1 × 3 layout: left, a histogram of `Settlement_Days` using
  8 bins; centre, a scatter plot of `Sum_Insured` (x) against `Claim_Amount` (y); right, a bar
  chart of the average `Claim_Amount` for each `Policy_Type`. Provide titles and axis labels, and
  add grids where suitable.
- **Figure 2** — a separate pie chart showing the proportion of Approved, Rejected and Pending
  claims, with percentage values displayed on the chart.
- **Figure 3** — a separate boxplot comparing `Claim_Amount` for Motor, Health, Travel and
  Property policies, each box labelled.

**A.**

```python
avg_by_type = df.groupby("Policy_Type")["Claim_Amount"].mean()
print(avg_by_type.sort_values(ascending=False).round(2))
print("highest average Claim_Amount:", avg_by_type.idxmax(), "at", round(avg_by_type.max(), 2))
print("tied policy types:", list(avg_by_type[avg_by_type == avg_by_type.max()].index))
```

```text
Policy_Type
Property    485567.72
Health      298188.60
Motor       244500.16
Travel       81770.07
Name: Claim_Amount, dtype: float64
highest average Claim_Amount: Property at 485567.72
tied policy types: ['Property']
```

**Property**, at Rs. 4,85,567.72 — 1.6× Health, 2.0× Motor and 5.9× Travel. `idxmax()` reports
only one label, so the ranked table and the tie check are printed next to it to prove there is no
tie.

**Figure 1** — the 1 × 3 layout.

```python
avg_by_type = df.groupby("Policy_Type")["Claim_Amount"].mean().sort_values(ascending=False)

plt.figure(figsize=(16, 4.5))
plt.subplot(1, 3, 1)
plt.hist(df["Settlement_Days"], bins=8, color="steelblue", edgecolor="black")
plt.title("Distribution of Settlement Days"); plt.xlabel("Settlement days")
plt.ylabel("Number of claims"); plt.grid(True, axis="y")

plt.subplot(1, 3, 2)
plt.scatter(df["Sum_Insured"], df["Claim_Amount"], s=18, alpha=0.7, color="darkorange")
plt.title("Sum Insured vs Claim Amount"); plt.xlabel("Sum_Insured (Rs.)")
plt.ylabel("Claim_Amount (Rs.)"); plt.grid(True)

plt.subplot(1, 3, 3)
plt.bar(avg_by_type.index, avg_by_type.values, color="seagreen")
plt.title("Average Claim Amount by Policy Type"); plt.xlabel("Policy type")
plt.ylabel("Mean Claim_Amount (Rs.)"); plt.grid(True, axis="y")

plt.tight_layout()
plt.show()
```

The histogram is broadly flat across 3–75 days, so there is no typical settlement time; the
scatter shows a genuine positive relationship (`df["Sum_Insured"].corr(df["Claim_Amount"])` =
0.6441) with vertical stripes where several claims share one policy; the bar chart repeats Q19,
Property ≫ Health > Motor ≫ Travel.

**Figure 2** — claim-status composition.

```python
plt.figure(figsize=(6, 6))
plt.pie(status_counts.values, labels=status_counts.index, autopct="%1.1f%%", startangle=90)
plt.title("Claim status composition")
plt.tight_layout()
plt.show()
```

`autopct="%1.1f%%"` is what "display percentage values" asks for. The pie reads Approved 67.3%,
Pending 19.3%, Rejected 13.3%.

**Figure 3** — `Claim_Amount` by policy type.

```python
types = ["Motor", "Health", "Travel", "Property"]
groups = [df[df["Policy_Type"] == t]["Claim_Amount"] for t in types]

plt.figure(figsize=(8, 5))
plt.boxplot(groups)
plt.xticks([1, 2, 3, 4], types)
plt.title("Claim Amount by Policy Type"); plt.xlabel("Policy type")
plt.ylabel("Claim_Amount (Rs.)"); plt.grid(True, axis="y")
plt.tight_layout()
plt.show()
```

The boxes appear in the order the question names them. Property's box sits far above the rest and
Travel is compressed near zero; the four group sizes are Motor 36, Health 26, Travel 47,
Property 41, which sum to 150 — every claim used exactly once.
