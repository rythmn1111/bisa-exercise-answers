---
id: case2
title: "Integrated Case 2 — Corporate Bond Portfolio Review"
source: "Integrated exercises/Case 2/Corporate Bond Portfolio Review.pdf"
datafile: "Integrated exercises/Case 2/Bond_Portfolio_Practice.xlsx"
topic: "Left merge on a key, derived value columns, filtering, pivot tables, 2 × 2 Matplotlib figure"
group: "Integrated exercises"
order: 101
setup: |
  import pandas as pd
  import matplotlib.pyplot as plt
  pd.set_option("display.width", 140)

  W = "Bond_Portfolio_Practice.xlsx"
  hold = pd.read_excel(W, sheet_name="Bond_Holdings")   # 120 x 6
  mast = pd.read_excel(W, sheet_name="Bond_Master")     #  24 x 6

  # Q4 - keep every holding, so a LEFT merge with Bond_Holdings on the left
  port = pd.merge(hold, mast, on="Bond_Code", how="left")

  # Q5-Q9 derived columns - created once, read by every question from Q10 on
  port["Purchase_Value"]       = port["Units_Held"] * port["Purchase_Price"]
  port["Current_Value"]        = port["Units_Held"] * port["Current_Price"]
  port["Value_Change"]         = port["Current_Value"] - port["Purchase_Value"]
  port["Value_Change_pct"]     = (port["Value_Change"] / port["Purchase_Value"]) * 100
  port["Annual_Coupon_Income"] = port["Units_Held"] * port["Face_Value"] * (port["Coupon_Rate"] / 100)
---

### Q1

**Q.** Read both sheets into separate DataFrames.

**A.**

```python
hold = pd.read_excel(W, sheet_name="Bond_Holdings")
mast = pd.read_excel(W, sheet_name="Bond_Master")
print("Bond_Holdings:", hold.shape, "| Bond_Master:", mast.shape)
print(mast.head(3).to_string())
```

```text
Bond_Holdings: (120, 6) | Bond_Master: (24, 6)
  Bond_Code          Issuer        Industry Credit_Rating  Coupon_Rate  Face_Value
0    BND001      Aster Bank         Banking           AAA         9.14        1000
1    BND002  BluePeak Infra  Infrastructure            AA         9.61        1000
2    BND003  Crescent Power           Power             A         7.23       10000
```

### Q2

**Q.** For `Bond_Holdings`, display the first five observations, shape, column names, data types and general DataFrame information.

**A.**

```python
print(hold.head(5).to_string())
print("shape:", hold.shape)
print("columns:", list(hold.columns))
print(hold.dtypes.to_string())
hold.info()
```

```text
  Holding_ID Bond_Code  Units_Held  Purchase_Price  Current_Price  Holding_Months
0      H0001    BND012         167         1000.53         946.65               6
1      H0002    BND008         217          857.79         831.59               7
2      H0003    BND004         117          995.40         962.27              42
3      H0004    BND006         114          991.80         977.19              44
4      H0005    BND022         185          895.39         821.19              42
shape: (120, 6)
columns: ['Holding_ID', 'Bond_Code', 'Units_Held', 'Purchase_Price', 'Current_Price', 'Holding_Months']
Holding_ID         object
Bond_Code          object
Units_Held          int64
Purchase_Price    float64
Current_Price     float64
Holding_Months      int64
<class 'pandas.core.frame.DataFrame'>
RangeIndex: 120 entries, 0 to 119
Data columns (total 6 columns):
 #   Column          Non-Null Count  Dtype
---  ------          --------------  -----
 0   Holding_ID      120 non-null    object
 1   Bond_Code       120 non-null    object
 2   Units_Held      120 non-null    int64
 3   Purchase_Price  120 non-null    float64
 4   Current_Price   120 non-null    float64
 5   Holding_Months  120 non-null    int64
dtypes: float64(2), int64(2), object(2)
memory usage: 5.8+ KB
```

All 120 rows are complete, so no missing-value handling is needed anywhere in this case.

### Q3

**Q.** Obtain descriptive statistics for the numerical variables in `Bond_Holdings`.

**A.**

```python
print(hold.describe().round(2).to_string())
```

```text
       Units_Held  Purchase_Price  Current_Price  Holding_Months
count      120.00          120.00         120.00          120.00
mean       137.99          934.08         950.72           25.92
std         64.61           48.44          76.33           13.81
min         22.00          854.58         799.67            2.00
25%         80.50          892.66         889.16           13.75
50%        136.50          927.66         949.16           26.50
75%        195.25          979.56        1000.49           38.00
max        250.00         1019.34        1139.63           48.00
```

`describe()` restricts itself to the four numeric columns and skips the two text ones, which is exactly what "numerical variables" asks for. Mean current price (950.72) exceeds mean purchase price (934.08), so the portfolio is slightly up in aggregate.

### Q4

**Q.** Combine the bond holdings with the bond master information using `Bond_Code`. All observations appearing in `Bond_Holdings` should remain in the resulting DataFrame.

**A.** "All observations in `Bond_Holdings` should remain" means a **left merge with `Bond_Holdings` on the left**.

```python
print("codes in holdings missing from master:", set(hold["Bond_Code"]) - set(mast["Bond_Code"]))
print("distinct codes in holdings:", hold["Bond_Code"].nunique(), "| master key unique:", mast["Bond_Code"].is_unique)

port = pd.merge(hold, mast, on="Bond_Code", how="left")
print("merged shape:", port.shape, "| rows preserved:", len(port) == len(hold))
print(port.head(3).to_string())

chk = pd.merge(hold, mast, on="Bond_Code", how="left", indicator=True)
print(chk["_merge"].value_counts().to_string())
```

```text
codes in holdings missing from master: set()
distinct codes in holdings: 24 | master key unique: True
merged shape: (120, 11) | rows preserved: True
  Holding_ID Bond_Code  Units_Held  Purchase_Price  Current_Price  Holding_Months            Issuer         Industry Credit_Rating  Coupon_Rate  Face_Value
0      H0001    BND012         167         1000.53         946.65               6  Lotus Healthcare  Pharmaceuticals             A         8.27        5000
1      H0002    BND008         217          857.79         831.59               7     Harbor Energy   Infrastructure            AA         7.27       10000
2      H0003    BND004         117          995.40         962.27              42    Dynamo Telecom          Telecom           AAA         6.67       10000
_merge
both          120
left_only       0
right_only      0
```

120 × 6 merged with 24 × 6 on one shared key gives 120 × 11 (6 + 6 − 1). Every code matches, so `inner`, `right` and `outer` happen to return (120, 11) too — but write `how="left"`, because that is the only option guaranteed to satisfy the wording if a code were missing.

### Q5

**Q.** Create a new column `Purchase_Value` using `Purchase_Value = Units_Held × Purchase_Price`.

**A.**

```python
port["Purchase_Value"] = port["Units_Held"] * port["Purchase_Price"]
print(port[["Holding_ID","Units_Held","Purchase_Price","Purchase_Value"]].head(3).round(2).to_string(index=False))
```

```text
Holding_ID  Units_Held  Purchase_Price  Purchase_Value
     H0001         167         1000.53       167088.51
     H0002         217          857.79       186140.43
     H0003         117          995.40       116461.80
```

### Q6

**Q.** Create a new column `Current_Value` using `Current_Value = Units_Held × Current_Price`.

**A.**

```python
port["Current_Value"] = port["Units_Held"] * port["Current_Price"]
print(port[["Holding_ID","Units_Held","Current_Price","Current_Value"]].head(3).round(2).to_string(index=False))
```

```text
Holding_ID  Units_Held  Current_Price  Current_Value
     H0001         167         946.65      158090.55
     H0002         217         831.59      180455.03
     H0003         117         962.27      112585.59
```

### Q7

**Q.** Create a column `Value_Change` using `Value_Change = Current_Value − Purchase_Value`.

**A.**

```python
port["Value_Change"] = port["Current_Value"] - port["Purchase_Value"]
print(port[["Holding_ID","Purchase_Value","Current_Value","Value_Change"]].head(3).round(2).to_string(index=False))
print("portfolio total Value_Change:", round(port["Value_Change"].sum(), 2))
```

```text
Holding_ID  Purchase_Value  Current_Value  Value_Change
     H0001       167088.51      158090.55      -8997.96
     H0002       186140.43      180455.03      -5685.40
     H0003       116461.80      112585.59      -3876.21
portfolio total Value_Change: 229298.43
```

### Q8

**Q.** Create `Value_Change_pct` using `Value_Change_pct = (Value_Change / Purchase_Value) × 100`.

**A.**

```python
port["Value_Change_pct"] = (port["Value_Change"] / port["Purchase_Value"]) * 100
print(port[["Holding_ID","Value_Change","Value_Change_pct"]].head(3).round(2).to_string(index=False))
print("range:", round(port["Value_Change_pct"].min(), 2), "to", round(port["Value_Change_pct"].max(), 2))
```

```text
Holding_ID  Value_Change  Value_Change_pct
     H0001      -8997.96             -5.39
     H0002      -5685.40             -3.05
     H0003      -3876.21             -3.33
range: -9.87 to 13.91
```

### Q9

**Q.** Estimate the annual coupon income for every holding using `Annual_Coupon_Income = Units_Held × Face_Value × (Coupon_Rate / 100)`.

**A.**

```python
port["Annual_Coupon_Income"] = port["Units_Held"] * port["Face_Value"] * (port["Coupon_Rate"] / 100)
print(port[["Holding_ID","Units_Held","Face_Value","Coupon_Rate","Annual_Coupon_Income"]].head(3).round(2).to_string(index=False))
print(port[["Purchase_Value","Current_Value","Value_Change","Annual_Coupon_Income"]].sum().round(2).to_string())
print("final shape:", port.shape)
```

```text
Holding_ID  Units_Held  Face_Value  Coupon_Rate  Annual_Coupon_Income
     H0001         167        5000         8.27               69054.5
     H0002         217       10000         7.27              157759.0
     H0003         117       10000         6.67               78039.0
Purchase_Value          15453445.04
Current_Value           15682743.47
Value_Change              229298.43
Annual_Coupon_Income     6329471.10
final shape: (120, 16)
```

The coupon uses `Face_Value`, not price — coupons are paid on face value, so a holding can be down in price and still be a large income earner. The portfolio cost ₹1.545 crore, is worth ₹1.568 crore (a net gain of ₹2.29 lakh, +1.48%) and yields ₹63.3 lakh of annual coupon income.

### Q10

**Q.** Display all holdings with a positive `Value_Change`.

**A.**

```python
gainers = port[port["Value_Change"] > 0]
print("holdings with a positive Value_Change:", gainers.shape)
print(gainers[["Holding_ID","Issuer","Credit_Rating","Value_Change","Value_Change_pct"]].head(5).round(2).to_string(index=False))
```

```text
holdings with a positive Value_Change: (64, 16)
Holding_ID          Issuer Credit_Rating  Value_Change  Value_Change_pct
     H0007     Unity Roads             A       5911.36              3.37
     H0008  BluePeak Infra            AA       6864.78              9.72
     H0009  Crescent Power             A       8096.34             11.92
     H0010   Keystone Auto            AA       4236.50              5.73
     H0015 Frontier Pharma             A      12312.12              6.33
# ... (59 rows omitted)
```

64 of 120 holdings (53.3%) have gained value; 56 have lost.

### Q11

**Q.** Extract holdings for which `Credit_Rating` is AAA and `Current_Value` exceeds Rs. 4,00,000.

**A.** The filter is correct as written, but **no holding in the portfolio satisfies it**, so the result is an empty DataFrame of shape **(0, 16)**: the largest `Current_Value` anywhere in the portfolio is ₹246,147.60 (itself a AAA bond), so the ₹4,00,000 threshold is unreachable by any rating.

```python
q11 = port[(port["Credit_Rating"] == "AAA") & (port["Current_Value"] > 400000)]
print(q11)
print("shape:", q11.shape)
print("portfolio maximum Current_Value  :", round(port["Current_Value"].max(), 2))
print("AAA maximum Current_Value        :", round(port[port["Credit_Rating"] == "AAA"]["Current_Value"].max(), 2))
print("holdings above 400000 (any rating):", int((port["Current_Value"] > 400000).sum()))
```

```text
Empty DataFrame
Columns: [Holding_ID, Bond_Code, Units_Held, Purchase_Price, Current_Price, Holding_Months, Issuer, Industry, Credit_Rating, Coupon_Rate, Face_Value, Purchase_Value, Current_Value, Value_Change, Value_Change_pct, Annual_Coupon_Income]
Index: []
shape: (0, 16)
portfolio maximum Current_Value  : 246147.6
AAA maximum Current_Value        : 246147.6
holdings above 400000 (any rating): 0
```

Corrected version — a ₹1,50,000 threshold sits between the median (133,706) and the 75th percentile (180,613) of `Current_Value` and returns **13 rows**:

```python
q11_fixed = port[(port["Credit_Rating"] == "AAA") & (port["Current_Value"] > 150000)]
print("shape:", q11_fixed.shape)
print(q11_fixed[["Holding_ID","Issuer","Units_Held","Current_Value","Value_Change_pct"]]
      .sort_values("Current_Value", ascending=False).head(5).round(2).to_string(index=False))
```

```text
shape: (13, 16)
Holding_ID          Issuer  Units_Held  Current_Value  Value_Change_pct
     H0018 Vertex Networks         246      246147.60              2.89
     H0052 Vertex Networks         240      218337.60             -4.35
     H0088 Vertex Networks         237      210678.78             -7.01
     H0063  Dynamo Telecom         210      194100.90              3.28
     H0112  Summit Finance         198      179811.72             -9.53
# ... (8 rows omitted)
```

### Q12

**Q.** Sort the complete portfolio from the highest to the lowest `Current_Value`.

**A.**

```python
port_sorted = port.sort_values("Current_Value", ascending=False)
print(port_sorted[["Holding_ID","Issuer","Credit_Rating","Current_Value"]].head(5).round(2).to_string(index=False))
print("shape:", port_sorted.shape)
```

```text
Holding_ID            Issuer Credit_Rating  Current_Value
     H0018   Vertex Networks           AAA      246147.60
     H0074   Frontier Pharma             A      244002.85
     H0046      Indigo Roads             A      243645.60
     H0020 Zenith Healthcare             A      242670.20
     H0017 Riverstone Pharma             A      241293.60
# ... (115 rows omitted)
shape: (120, 16)
```

`sort_values` returns a new frame and leaves `port` untouched, which is what later questions need.

### Q13

**Q.** Display the five largest holdings based on `Current_Value`.

**A.**

```python
top5 = port.nlargest(5, "Current_Value")
print(top5[["Holding_ID","Issuer","Industry","Credit_Rating","Units_Held","Current_Price","Current_Value"]]
      .round(2).to_string(index=False))
```

```text
Holding_ID            Issuer        Industry Credit_Rating  Units_Held  Current_Price  Current_Value
     H0018   Vertex Networks         Telecom           AAA         246        1000.60      246147.60
     H0074   Frontier Pharma Pharmaceuticals             A         245         995.93      244002.85
     H0046      Indigo Roads           Power             A         220        1107.48      243645.60
     H0020 Zenith Healthcare Pharmaceuticals             A         244         994.55      242670.20
     H0017 Riverstone Pharma Pharmaceuticals             A         240        1005.39      241293.60
```

The top five are driven by large unit counts (220–246 units) rather than high prices, and four of the five are A-rated — the biggest positions are not the safest ones.

### Q14

**Q.** Determine the mean, median and standard deviation of `Current_Value`, and the largest and smallest `Value_Change`.

**A.**

```python
print("Current_Value  mean   :", round(port["Current_Value"].mean(), 2))
print("Current_Value  median :", round(port["Current_Value"].median(), 2))
print("Current_Value  std    :", round(port["Current_Value"].std(), 2))
print("Value_Change   max    :", round(port["Value_Change"].max(), 2))
print("Value_Change   min    :", round(port["Value_Change"].min(), 2))
```

```text
Current_Value  mean   : 130689.53
Current_Value  median : 133706.47
Current_Value  std    : 61369.23
Value_Change   max    : 27036.0
Value_Change   min    : -18944.64
```

Median slightly exceeds mean, so `Current_Value` is mildly left-skewed with no single dominating holding; the best holding gained ₹27,036 and the worst lost ₹18,945.

### Q15

**Q.** Produce a frequency table showing the number of holdings belonging to each `Credit_Rating`.

**A.**

```python
ft = port["Credit_Rating"].value_counts().reset_index()
ft.columns = ["Credit_Rating", "Holdings"]
ft["Percent"] = (ft["Holdings"] / ft["Holdings"].sum() * 100).round(1)
print(ft.to_string(index=False))
print("bonds per rating in the master:")
print(mast["Credit_Rating"].value_counts().to_string())
```

```text
Credit_Rating  Holdings  Percent
            A        46     38.3
           AA        39     32.5
          AAA        35     29.2
bonds per rating in the master:
Credit_Rating
AAA    8
AA     8
A      8
```

This counts **holdings** (120 in total), which is what the question asks. The *master* is a perfectly even 8/8/8 split of bonds across the three ratings; the holdings are not evenly spread across them.

### Q16

**Q.** Create a pivot table showing mean `Current_Value` by `Industry`.

**A.**

```python
print(pd.pivot_table(port, values="Current_Value", index="Industry", aggfunc="mean").round(2).to_string())
```

```text
                 Current_Value
Industry
Automobile           103574.81
Banking              115003.46
Infrastructure       133396.71
Pharmaceuticals      161081.29
Power                131030.83
Telecom              127602.25
```

Pharmaceuticals has the largest average holding (₹161,081) and Automobile the smallest (₹103,575) — a 1.56× spread. Add `.sort_values("Current_Value", ascending=False)` if the question asks which industry is largest. One quirk of this dataset: `Industry` and `Credit_Rating` are perfectly nested (each industry maps to exactly one rating), so a two-way pivot of the two is mostly `NaN` — the blanks mean "no such combination exists", not "missing value".

```python
print(pd.pivot_table(port, values="Current_Value", index="Industry",
                     columns="Credit_Rating", aggfunc="mean").round(0).to_string())
```

```text
Credit_Rating           A        AA       AAA
Industry
Automobile            NaN  103575.0       NaN
Banking               NaN       NaN  115003.0
Infrastructure        NaN  133397.0       NaN
Pharmaceuticals  161081.0       NaN       NaN
Power            131031.0       NaN       NaN
Telecom               NaN       NaN  127602.0
```

### Q17

**Q.** Create another pivot table showing the mean and maximum `Value_Change_pct` for each `Credit_Rating`. **Part D** — create one Matplotlib figure with a 2 × 2 layout containing: top-left, bar chart of the five largest bond holdings with `Issuer` on the x-axis and `Current_Value` on the y-axis; top-right, histogram of the distribution of `Value_Change_pct` using 10 bins; bottom-left, scatter plot of `Holding_Months` against `Value_Change_pct`; bottom-right, boxplot comparing `Current_Value` for AAA, AA and A-rated bonds. Use appropriate titles and axis labels, add grids where suitable, apply `tight_layout()` and display the figure.

**A.**

```python
pv = pd.pivot_table(port, values="Value_Change_pct", index="Credit_Rating", aggfunc=["mean","max"])
print(pv.round(2).to_string())
print("Value_Change_pct range:", round(port["Value_Change_pct"].min(), 2), "to",
      round(port["Value_Change_pct"].max(), 2))
```

```text
                          mean              max
              Value_Change_pct Value_Change_pct
Credit_Rating
A                         2.43            13.54
AA                        2.39            13.61
AAA                       0.38            13.91
Value_Change_pct range: -9.87 to 13.91
```

A and AA holdings averaged about +2.4% while AAA averaged only +0.38%, yet the single best performer overall is AAA (+13.91%); best-case outcomes are nearly identical across ratings (13.5–13.9%) and the rating gap is small relative to the −9.9% to +13.9% spread of the whole portfolio. Two aggfuncs produce a two-level column index — flatten it with `pv.columns = ["Mean_pct", "Max_pct"]` if you need to index or plot from it.

**Part D — the 2 × 2 figure.**

```python
top5 = port.nlargest(5, "Current_Value")

plt.figure(figsize=(14, 10))

plt.subplot(2, 2, 1)                                   # top-left: five largest holdings
plt.bar(top5["Issuer"], top5["Current_Value"], color="steelblue")
plt.title("Five largest bond holdings")
plt.xlabel("Issuer"); plt.ylabel("Current Value (Rs.)")
plt.xticks(rotation=30, ha="right"); plt.grid(True, axis="y")

plt.subplot(2, 2, 2)                                   # top-right: histogram, 10 bins
plt.hist(port["Value_Change_pct"], bins=10, color="darkorange", edgecolor="black")
plt.title("Distribution of Value_Change_pct (10 bins)")
plt.xlabel("Value change (%)"); plt.ylabel("Number of holdings"); plt.grid(True, axis="y")

plt.subplot(2, 2, 3)                                   # bottom-left: scatter
plt.scatter(port["Holding_Months"], port["Value_Change_pct"], s=18, alpha=0.7)
plt.title("Holding months vs value change")
plt.xlabel("Holding_Months"); plt.ylabel("Value change (%)"); plt.grid(True)

plt.subplot(2, 2, 4)                                   # bottom-right: boxplot by rating
groups = [port[port["Credit_Rating"] == g]["Current_Value"] for g in ["AAA", "AA", "A"]]
plt.boxplot(groups)
plt.xticks([1, 2, 3], ["AAA", "AA", "A"])
plt.title("Current Value by Credit Rating")
plt.xlabel("Credit rating"); plt.ylabel("Current Value (Rs.)"); plt.grid(True, axis="y")

plt.tight_layout()
plt.show()

print("boxplot group sizes:", [len(g) for g in groups])
print("Holding_Months range:", port["Holding_Months"].min(), "-", port["Holding_Months"].max())
print("corr(Holding_Months, Value_Change_pct) =",
      round(port["Holding_Months"].corr(port["Value_Change_pct"]), 4))
```

```text
boxplot group sizes: [35, 39, 46]
Holding_Months range: 2 - 48
corr(Holding_Months, Value_Change_pct) = 0.065
```

What the four panels show: the five largest holdings are all within about 2% of each other (₹241,294–₹246,148), so no position dominates; `Value_Change_pct` spreads from about −10% to +14% with the bins either side of zero fullest, matching the 64/56 gainer/loser split from Q10; the scatter shows **no relationship** (correlation +0.065 — holding period explains none of the variation, so do not claim longer holdings performed better); and the three rating bands have heavily overlapping value distributions, with group sizes 35/39/46 matching the Q15 frequency table. Pass a *list of Series* to `plt.boxplot` and label them with `plt.xticks`, keeping the list order and the label order in sync.
