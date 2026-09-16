---
id: missing-ex2
title: "02 Missing Values — Exercise 2: Stock Portfolio Analysis"
source: "Pandas exercises/02 Missing values/Exercise 2 - Portfolio analysis/Exercise 2 Portfolio analysis.pdf"
datafile: "Pandas exercises/02 Missing values/Exercise 2 - Portfolio analysis/Portfolio analysis.xlsx"
topic: "Mean fill, zero fill, Unknown placeholder, then value the portfolio"
group: "Pandas exercises"
order: 41
setup: |
  import pandas as pd
  df = pd.read_excel("Portfolio analysis.xlsx")
---

### Q1

**Q.** Count missing values in each column.

**A.**

```python
print(df)
print(df.isna().sum())
```

```text
   Stock   Price  Shares      Sector
0   AAPL   150.0    10.0        Tech
1  GOOGL     NaN     5.0        Tech
2   TSLA   700.0     NaN         NaN
3   AMZN  3300.0     NaN  E-commerce
4   MSFT     NaN    20.0        Tech
Stock     0
Price     2
Shares    2
Sector    1
dtype: int64
```

### Q2

**Q.** Fill missing Price with the mean Price of the portfolio.

**A.**

```python
print("mean Price:", df["Price"].mean())
df["Price"] = df["Price"].fillna(df["Price"].mean())
print(df)
```

```text
mean Price: 1383.3333333333333
   Stock        Price  Shares      Sector
0   AAPL   150.000000    10.0        Tech
1  GOOGL  1383.333333     5.0        Tech
2   TSLA   700.000000     NaN         NaN
3   AMZN  3300.000000     NaN  E-commerce
4   MSFT  1383.333333    20.0        Tech
```

The mean is taken over the 3 observed prices (150 + 700 + 3300) / 3 = 1383.33; `mean()` skips
`NaN` by default.

### Q3

**Q.** Fill missing Shares with 0.

**A.**

```python
df["Shares"] = df["Shares"].fillna(0)
print(df)
```

```text
   Stock        Price  Shares      Sector
0   AAPL   150.000000    10.0        Tech
1  GOOGL  1383.333333     5.0        Tech
2   TSLA   700.000000     0.0         NaN
3   AMZN  3300.000000     0.0  E-commerce
4   MSFT  1383.333333    20.0        Tech
```

### Q4

**Q.** Fill missing Sector with "Unknown".

**A.**

```python
df["Sector"] = df["Sector"].fillna("Unknown")
print(df)
print(df.isna().sum())
```

```text
   Stock        Price  Shares      Sector
0   AAPL   150.000000    10.0        Tech
1  GOOGL  1383.333333     5.0        Tech
2   TSLA   700.000000     0.0     Unknown
3   AMZN  3300.000000     0.0  E-commerce
4   MSFT  1383.333333    20.0        Tech
Stock     0
Price     0
Shares    0
Sector    0
dtype: int64
```

### Q5

**Q.** After cleaning, calculate: total portfolio value = Σ(Price × Shares), and the sector-wise
distribution of stocks.

**A.**

```python
df["Value"] = df["Price"] * df["Shares"]
print(df)
print("Total portfolio value =", df["Value"].sum())
print(df["Sector"].value_counts())
print(df.groupby("Sector")["Value"].sum())
```

```text
   Stock        Price  Shares      Sector         Value
0   AAPL   150.000000    10.0        Tech   1500.000000
1  GOOGL  1383.333333     5.0        Tech   6916.666667
2   TSLA   700.000000     0.0     Unknown      0.000000
3   AMZN  3300.000000     0.0  E-commerce      0.000000
4   MSFT  1383.333333    20.0        Tech  27666.666667
Total portfolio value = 36083.33333333333
Sector
Tech          3
Unknown       1
E-commerce    1
Name: count, dtype: int64
Sector
E-commerce        0.000000
Tech          36083.333333
Unknown           0.000000
Name: Value, dtype: float64
```

Total = **36,083.33**. "Sector-wise distribution" has two readings: by **count** it is 3 Tech,
1 E-commerce, 1 Unknown; by **value** it is 100 % Tech, because zero-filling `Shares` removed TSLA
and AMZN from the valuation entirely. Note also that the mean-filled prices of GOOGL and MSFT
carry 34,583.33 of the 36,083.33 total — 96 % of the reported value rests on imputed prices.

### Q6

**Q.** Discuss: What would happen if missing Prices were filled with 0 instead of mean?

**A.** A price of 0 asserts the holding is worthless, which is a factual claim about the asset
rather than an admission of ignorance. On this portfolio it drops the reported total from
**36,083.33 to 1,500.00** — about **4 %** of the mean-filled estimate — because GOOGL and MSFT are
the two imputed prices and they carry 34,583.33 of the value. The average price would also
collapse, dragging down every per-stock statistic, weight and return derived from it, and every
allocation percentage would be wrong. Mean-filling at 1,383.33 at least keeps the valuation in a
plausible range and leaves the column's mean unchanged. Best practice is to source the real market
price; failing that, use the mean (or the sector mean) and disclose how much of the total is
imputed.
