---
id: missing-ex3
title: "02 Missing Values — Exercise 3: Daily Stock Market Data"
source: "Pandas exercises/02 Missing values/Exercise 3 - Stock market/Exercise 3 - Stock market data.pdf"
datafile: "Pandas exercises/02 Missing values/Exercise 3 - Stock market/Exercise 3 - stock market.csv"
topic: "Time-series gaps: forward fill the price, backward fill the volume"
group: "Pandas exercises"
order: 42
setup: |
  import pandas as pd
  df = pd.read_csv("Exercise 3 - stock market.csv")
---

### Q1

**Q.** Identify missing data in ClosingPrice and Volume.

**A.**

```python
print(df.isna().sum())
print(df[df.isna().any(axis=1)])
```

```text
Date            0
ClosingPrice    5
Volume          6
dtype: int64
         Date  ClosingPrice  Volume
0  2024-01-01         100.0     NaN
1  2024-01-02           NaN  5000.0
2  2024-01-03         102.0     NaN
3  2024-01-04           NaN     0.0
4  2024-01-05           NaN     NaN
6  2024-01-07          99.0     NaN
7  2024-01-08           NaN  6000.0
8  2024-01-09          98.0     NaN
9  2024-01-10           NaN     NaN
```

5 of 10 closing prices and 6 of 10 volumes are blank; only 2024-01-06 is complete. The `0.0`
volume on 2024-01-04 is a **real zero** (a no-trade day), not a missing value — do not impute it.

### Q2

**Q.** Use forward fill (ffill) to handle missing ClosingPrice.

**A.** `ffill` carries the last traded price forward, which is what a halt or feed outage means:
no new information, price unchanged.

```python
df["ClosingPrice"] = df["ClosingPrice"].ffill()
print(df)
print("ClosingPrice missing:", df["ClosingPrice"].isna().sum())
```

```text
         Date  ClosingPrice  Volume
0  2024-01-01         100.0     NaN
1  2024-01-02         100.0  5000.0
2  2024-01-03         102.0     NaN
3  2024-01-04         102.0     0.0
4  2024-01-05         102.0     NaN
5  2024-01-06         101.0  7000.0
6  2024-01-07          99.0     NaN
7  2024-01-08          99.0  6000.0
8  2024-01-09          98.0     NaN
9  2024-01-10          98.0     NaN
ClosingPrice missing: 0
```

`ClosingPrice` is now complete because row 0 has a value for `ffill` to carry.

### Q3

**Q.** Use backward fill (bfill) for missing Volume.

**A.** `bfill` borrows the next known value backwards, which is the remedy for the leading gap on
2024-01-01 where there is no earlier observation.

```python
df["Volume"] = df["Volume"].bfill()
print(df)
print(df.isna().sum())
```

```text
         Date  ClosingPrice  Volume
0  2024-01-01         100.0  5000.0
1  2024-01-02         100.0  5000.0
2  2024-01-03         102.0     0.0
3  2024-01-04         102.0     0.0
4  2024-01-05         102.0  7000.0
5  2024-01-06         101.0  7000.0
6  2024-01-07          99.0  6000.0
7  2024-01-08          99.0  6000.0
8  2024-01-09          98.0     NaN
9  2024-01-10          98.0     NaN
Date            0
ClosingPrice    0
Volume          2
dtype: int64
```

`Volume` still has **2 missing** values: rows 8 and 9 sit at the tail and `bfill` has no later
value to pull from, so the exercise's prescription is incomplete as printed. Either close the tail
with `df["Volume"] = df["Volume"].bfill().ffill()`, or leave the two blanks and state that no
volume can be inferred for the final two days.
