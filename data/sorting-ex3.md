---
id: sorting-ex3
title: "03 Sorting & Slicing — Exercise C: Stock Prices of ACME Ltd."
source: "Pandas exercises/03 Sorting and slicing in Pandas/Exercise 3 - Stock Prices/Exercise 3 - Stock Prices.pdf"
datafile: "Pandas exercises/03 Sorting and slicing in Pandas/Exercise 3 - Stock Prices/EX_C_stock_ACME.csv"
topic: "Date-index slicing, combined price/volume filters, loc versus iloc endpoints"
group: "Pandas exercises"
order: 52
setup: |
  import pandas as pd
  pd.set_option("display.width", 200)
  pd.set_option("display.max_columns", 20)

  acme = pd.read_csv("EX_C_stock_ACME.csv")   # (60, 4)
  print(acme.columns.tolist())
  # ['Date', 'Ticker', 'Close', 'Volume']
  # 60 consecutive CALENDAR days, 2024-03-01 to 2024-04-29 (weekends included).
---

### Q1

**Q.** Show the first 7 and last 7 rows of the dataset.

**A.**

```python
print(acme.head(7))
print(acme.tail(7))
```

```text
         Date Ticker   Close  Volume
0  2024-03-01   ACME  100.72   11509
1  2024-03-02   ACME  101.55   10596
2  2024-03-03   ACME  101.93    7474
3  2024-03-04   ACME  100.13   10114
4  2024-03-05   ACME   99.90    5714
5  2024-03-06   ACME   98.37    8079
6  2024-03-07   ACME   98.18   11035
          Date Ticker   Close  Volume
53  2024-04-23   ACME  120.43    9762
54  2024-04-24   ACME  123.68    7181
55  2024-04-25   ACME  125.66    3525
56  2024-04-26   ACME  127.53    7300
57  2024-04-27   ACME  126.14    6068
58  2024-04-28   ACME  125.76    5221
59  2024-04-29   ACME  126.04    7351
```

### Q2

**Q.** Sort the dataset by Date ascending and display the first 10 rows.

**A.**

```python
print(acme.sort_values("Date").head(10))
```

```text
         Date Ticker   Close  Volume
0  2024-03-01   ACME  100.72   11509
1  2024-03-02   ACME  101.55   10596
2  2024-03-03   ACME  101.93    7474
3  2024-03-04   ACME  100.13   10114
4  2024-03-05   ACME   99.90    5714
5  2024-03-06   ACME   98.37    8079
6  2024-03-07   ACME   98.18   11035
7  2024-03-08   ACME   98.93   10910
8  2024-03-09   ACME   99.03    6522
9  2024-03-10   ACME  101.00   11902
```

The file is already in date order, so the index stays 0–9.

### Q3

**Q.** Set Date as the index and slice records from 2024-03-10 to 2024-03-20, showing only the Close and Volume columns.

**A.**

`Date` arrives as text, so convert it with `pd.to_datetime` before `set_index` — otherwise the index is a plain string `Index` and partial-date lookups such as `.loc["2024-03"]` raise `KeyError`.

```python
A = acme.assign(Date=pd.to_datetime(acme["Date"])).set_index("Date").sort_index()
q3 = A.loc["2024-03-10":"2024-03-20", ["Close", "Volume"]]
print(q3)
print("rows:", q3.shape[0])
```

```text
             Close  Volume
Date
2024-03-10  101.00   11902
2024-03-11  101.21    3515
2024-03-12  102.80    8551
2024-03-13  107.13    6982
2024-03-14  108.37    3255
2024-03-15  106.08    4533
2024-03-16  104.29    8647
2024-03-17  104.09    8467
2024-03-18  105.28    3560
2024-03-19  104.74    6585
2024-03-20  105.67    3845
rows: 11
```

11 rows — the 10th **and** the 20th are both in the answer.

### Q4

**Q.** Filter days where Close is at least 100 and Volume is at least 6000, then sort them by Close descending.

**A.**

```python
q4 = acme.loc[(acme["Close"] >= 100) & (acme["Volume"] >= 6000)].sort_values("Close", ascending=False)
print(q4.shape)
print(q4.head(10))
```

```text
(41, 4)
          Date Ticker   Close  Volume
56  2024-04-26   ACME  127.53    7300
57  2024-04-27   ACME  126.14    6068
59  2024-04-29   ACME  126.04    7351
54  2024-04-24   ACME  123.68    7181
50  2024-04-20   ACME  122.53   10903
48  2024-04-18   ACME  121.99    8917
49  2024-04-19   ACME  121.63    6062
53  2024-04-23   ACME  120.43    9762
52  2024-04-22   ACME  120.27    8339
51  2024-04-21   ACME  120.24   11375
```

41 of the 60 days qualify.

### Q5

**Q.** Slice the dataset by dates 2024-03-15 to 2024-03-24, and then slice the same rows by their positions. Compare the difference in inclusion of the last row.

**A.**

```python
A = acme.assign(Date=pd.to_datetime(acme["Date"])).set_index("Date").sort_index()

lab = A.loc["2024-03-15":"2024-03-24", ["Close", "Volume"]]
print(lab)
print("loc rows:", lab.shape[0])
print("positions of those two dates:",
      A.index.get_loc(pd.Timestamp("2024-03-15")), A.index.get_loc(pd.Timestamp("2024-03-24")))
```

```text
             Close  Volume
Date
2024-03-15  106.08    4533
2024-03-16  104.29    8647
2024-03-17  104.09    8467
2024-03-18  105.28    3560
2024-03-19  104.74    6585
2024-03-20  105.67    3845
2024-03-21  105.01    9888
2024-03-22  104.63    9890
2024-03-23  104.26    9064
2024-03-24  107.23    8975
loc rows: 10
positions of those two dates: 14 23
```

Copy those endpoints straight into `.iloc` and the last row disappears:

```python
pos = A.iloc[14:23][["Close", "Volume"]]
print(pos)
print("iloc rows:", pos.shape[0])
print("iloc[14:24] rows:", A.iloc[14:24].shape[0],
      "| identical to loc?", A.iloc[14:24][["Close", "Volume"]].equals(lab))
```

```text
             Close  Volume
Date
2024-03-15  106.08    4533
2024-03-16  104.29    8647
2024-03-17  104.09    8467
2024-03-18  105.28    3560
2024-03-19  104.74    6585
2024-03-20  105.67    3845
2024-03-21  105.01    9888
2024-03-22  104.63    9890
2024-03-23  104.26    9064
iloc rows: 9
iloc[14:24] rows: 10 | identical to loc? True
```

`.loc["2024-03-15":"2024-03-24"]` gives **10** rows because `.loc` includes the stop label; `.iloc[14:23]` gives **9** because `.iloc` excludes the stop position, dropping 2024-03-24. To reproduce the label slice positionally you must write the stop one higher — `.iloc[14:24]` — which is identical to the `.loc` result.
