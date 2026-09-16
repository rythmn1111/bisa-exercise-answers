---
id: case1
title: "Integrated Case 1 — Reliance, TCS and Infosys"
source: "Integrated exercises/Case 1/Integrated Exercise.pdf"
datafile: "Integrated exercises/Case 1/Integrated_Pandas_Matplotlib_Stock_Practice.xlsx"
topic: "Time-series prep, concat/join/merge, pivot and frequency tables, six-panel Matplotlib figure"
group: "Integrated exercises"
order: 100
setup: |
  import pandas as pd, numpy as np
  import matplotlib.pyplot as plt
  pd.set_option("display.width", 120)

  # The FIRST sheet is Read_Me, so a bare pd.read_excel(W) returns documentation.
  # Always pass sheet_name.
  W = "Integrated_Pandas_Matplotlib_Stock_Practice.xlsx"

  rel_raw = pd.read_excel(W, sheet_name="Reliance")
  tcs_raw = pd.read_excel(W, sheet_name="TCS")
  inf_raw = pd.read_excel(W, sheet_name="Infosys")
  master  = pd.read_excel(W, sheet_name="Company_Master")

  def prep(df):
      df = df.copy()
      df["Date"] = pd.to_datetime(df["Date"])
      df = df.set_index("Date").sort_index()
      df["Previous_Close"]    = df["Close"].shift(1)                 # Q5
      df["Price_Change"]      = df["Close"] - df["Previous_Close"]   # Q5
      df["Return"]            = df["Close"].pct_change()             # Q6
      df["Growth"]            = 1 + df["Return"].fillna(0)           # Q7
      df["Cum_Growth"]        = df["Growth"].cumprod()               # Q7
      df["Cumulative_Return"] = df["Cum_Growth"] - 1                 # Q7
      df["Wealth_Index"]      = df["Cum_Growth"] * 100               # Q7
      df["MA20"]  = df["Close"].rolling(20).mean()                   # Q8
      df["MA50"]  = df["Close"].rolling(50).mean()                   # Q8
      df["MA200"] = df["Close"].rolling(200).mean()                  # Q8
      df["Vol20"] = df["Return"].rolling(20).std()                   # Q8
      return df

  rel, tcs, inf = prep(rel_raw), prep(tcs_raw), prep(inf_raw)
  stocks = {"Reliance": rel, "TCS": tcs, "Infosys": inf}
---

### Q1

**Q.** Read the `Reliance`, `TCS` and `Infosys` sheets into three separate DataFrames. For each DataFrame: display the first five rows; display the last five rows; determine the number of rows and columns; display the column names; display the data type of every column; obtain general DataFrame information; obtain descriptive statistics. Also read the `Company_Master` sheet into a fourth DataFrame.

**A.**

```python
raw = {"Reliance": rel_raw, "TCS": tcs_raw, "Infosys": inf_raw}
for name, d in raw.items():
    print(f"{name:9s} shape={d.shape}  {d['Date'].min().date()} -> {d['Date'].max().date()}  cols={list(d.columns)}")

for name, d in raw.items():                      # the seven required displays
    print(f"===== {name} =====")
    print(d.head(3).to_string())                 # head(5) in the exam
    print(d.tail(3).to_string())                 # tail(5) in the exam
    print("shape:", d.shape, "| columns:", list(d.columns))
    print(d.dtypes.to_string())
    d.info()
    print(d.describe().round(2).to_string())

print(master.to_string(index=False))
```

```text
Reliance  shape=(1022, 6)  2019-01-01 -> 2022-12-30  cols=['Date', 'Open', 'High', 'Low', 'Close', 'Volume']
TCS       shape=(1024, 6)  2020-01-01 -> 2023-12-29  cols=['Date', 'Open', 'High', 'Low', 'Close', 'Volume']
Infosys   shape=(1026, 6)  2021-01-01 -> 2024-12-31  cols=['Date', 'Open', 'High', 'Low', 'Close', 'Volume']
===== Reliance =====
        Date     Open     High      Low    Close    Volume
0 2019-01-01  1118.38  1138.36  1092.27  1112.14  14715077
1 2019-01-02  1113.65  1124.37  1081.25  1091.76   8639311
2 2019-01-03  1099.08  1111.71  1074.53  1087.02  11770746
           Date     Open     High      Low    Close   Volume
1019 2022-12-28  2608.38  2624.35  2599.12  2615.06  7295110
1020 2022-12-29  2599.32  2642.59  2574.64  2617.74  7231363
1021 2022-12-30  2611.21  2632.54  2562.77  2583.87  6388694
shape: (1022, 6) | columns: ['Date', 'Open', 'High', 'Low', 'Close', 'Volume']
Date      datetime64[ns]
Open             float64
High             float64
Low              float64
Close            float64
Volume             int64
<class 'pandas.core.frame.DataFrame'>
RangeIndex: 1022 entries, 0 to 1021
Data columns (total 6 columns):
 #   Column  Non-Null Count  Dtype         
---  ------  --------------  -----         
 0   Date    1022 non-null   datetime64[ns]
 1   Open    1022 non-null   float64       
 2   High    1022 non-null   float64       
 3   Low     1022 non-null   float64       
 4   Close   1022 non-null   float64       
 5   Volume  1022 non-null   int64         
dtypes: datetime64[ns](1), float64(4), int64(1)
memory usage: 48.0 KB
                                Date     Open     High      Low    Close       Volume
count                           1022  1022.00  1022.00  1022.00  1022.00      1022.00
mean   2020-12-30 03:46:50.958903808  2105.26  2136.61  2075.53  2106.67   7581845.18
min              2019-01-01 00:00:00  1064.66  1076.02  1047.40  1064.31   2319391.00
25%              2019-12-31 06:00:00  1717.51  1744.64  1690.18  1719.08   6318583.25
50%              2020-12-30 12:00:00  2209.45  2245.58  2183.24  2211.50   7419014.00
75%              2021-12-29 18:00:00  2544.54  2584.42  2512.54  2548.07   8662703.00
max              2022-12-30 00:00:00  2920.81  2937.55  2862.03  2907.39  22332150.00
std                              NaN   481.54   487.66   474.60   480.86   1974411.32
# ... (the ===== TCS ===== and ===== Infosys ===== sections repeat the same seven displays; 1024 and 1026 rows, no nulls, Company_Master printed last)
```

`Date` already arrives as `datetime64[ns]`, all three sheets are complete (no nulls, no duplicate dates, already in date order), and `describe()` on a datetime column reports date quantiles with a `NaN` standard deviation — that is normal.

### Q2

**Q.** For all three stock DataFrames, make `Date` the index. Then, using Reliance: (1) display the first row using `iloc`; (2) display the last row using `iloc`; (3) display rows at positions 10 to 19; (4) display only the `Close` and `Volume` columns; (5) display the first 15 rows containing only `Open`, `High`, `Low` and `Close`; (6) display all observations for March 2020; (7) display observations from 1 March 2020 to 31 March 2020.

**A.**

```python
# rel / tcs / inf already carry a sorted DatetimeIndex (set_index("Date") in the setup)
print(rel.iloc[0][["Open","High","Low","Close","Volume"]].to_string())    # 1
print(rel.iloc[-1][["Open","High","Low","Close","Volume"]].to_string())   # 2
print(rel.iloc[10:20, 0:5].head(3).to_string())                           # 3
print(rel[["Close","Volume"]].head(3).to_string())                        # 4
print("first 15 rows, Open..Close:", rel.loc[:, "Open":"Close"].head(15).shape)   # 5
print("March 2020        :", rel.loc["2020-03"].shape)                            # 6
print("2020-03-01 to 31  :", rel.loc["2020-03-01":"2020-03-31"].shape)            # 7
print("identical:", rel.loc["2020-03"].equals(rel.loc["2020-03-01":"2020-03-31"]))
print("index dtype:", rel.index.dtype, "| tcs:", tcs.index.dtype, "| inf:", inf.index.dtype)
```

```text
Open          1118.38
High          1138.36
Low           1092.27
Close         1112.14
Volume    14715077.00
Open         2611.21
High         2632.54
Low          2562.77
Close        2583.87
Volume    6388694.00
               Open     High      Low    Close   Volume
Date
2019-01-15  1080.65  1109.39  1070.27  1098.84  7859518
2019-01-16  1100.49  1115.37  1086.68  1101.55  9535633
2019-01-17  1096.89  1107.22  1089.88  1100.20  5967969
# ... (7 rows omitted, 10 in total)
              Close    Volume
Date
2019-01-01  1112.14  14715077
2019-01-02  1091.76   8639311
2019-01-03  1087.02  11770746
# ... (1019 rows omitted)
first 15 rows, Open..Close: (15, 4)
March 2020        : (22, 16)
2020-03-01 to 31  : (22, 16)
identical: True
index dtype: datetime64[ns] | tcs: datetime64[ns] | inf: datetime64[ns]
```

Parts 6 and 7 return the **same 22 rows**: `.loc["2020-03"]` is partial-string indexing and `.loc["2020-03-01":"2020-03-31"]` is a label slice, which on a `DatetimeIndex` includes the stop label.

### Q3

**Q.** For Reliance: (1) calculate the overall mean closing price; (2) extract all days on which `Close` was greater than this mean; (3) extract observations where both `Close` was above its mean and `Volume` was above its mean; (4) extract observations where either `Close` was above its mean or `Volume` was above its mean; (5) sort the entire DataFrame by `Close` from highest to lowest; (6) sort first by `Volume` descending and then by `Close` descending. Repeat parts 1–3 for TCS and Infosys.

**A.**

```python
mc, mv = rel["Close"].mean(), rel["Volume"].mean()
print("Reliance mean Close =", round(mc, 2), "| mean Volume =", round(mv, 2))
print("Close > mean     :", rel[rel["Close"] > mc].shape)
print("Close AND Volume :", rel[(rel["Close"] > mc) & (rel["Volume"] > mv)].shape)
print("Close OR  Volume :", rel[(rel["Close"] > mc) | (rel["Volume"] > mv)].shape)
print(rel.sort_values("Close", ascending=False)[["Close","Volume"]].head(3).to_string())
print(rel.sort_values(["Volume","Close"], ascending=[False, False])[["Close","Volume"]].head(3).to_string())

rows = []                                              # parts 1-3 for all three stocks
for name, d in stocks.items():
    m1, m2 = d["Close"].mean(), d["Volume"].mean()
    rows.append({"Stock": name, "Mean_Close": round(m1, 2),
                 "Close_above_mean": int((d["Close"] > m1).sum()),
                 "Close_AND_Vol": int(((d["Close"] > m1) & (d["Volume"] > m2)).sum()),
                 "Close_OR_Vol": int(((d["Close"] > m1) | (d["Volume"] > m2)).sum())})
print(pd.DataFrame(rows).to_string(index=False))
```

```text
Reliance mean Close = 2106.67 | mean Volume = 7581845.18
Close > mean     : (548, 16)
Close AND Volume : (263, 16)
Close OR  Volume : (770, 16)
              Close   Volume
Date
2021-09-23  2907.39  8683428
2021-09-29  2883.22  5885126
2021-09-27  2881.87  7788672
              Close    Volume
Date
2021-08-26  2635.19  22332150
2022-07-15  2353.76  20443423
2020-04-29  1818.10  19969440
   Stock  Mean_Close  Close_above_mean  Close_AND_Vol  Close_OR_Vol
Reliance     2106.67               548            263           770
     TCS     3270.40               649            317           822
 Infosys     1285.17               581            288           792
```

### Q4

**Q.** For each of the three stocks, determine: first trading date; last trading date; first closing price; last closing price; highest closing price; date of the highest closing price; lowest closing price; date of the lowest closing price; mean closing price; median closing price; average trading volume; five highest-volume trading days; number of days on which the closing price was above its own mean closing price. Finally, compare the three stock profiles.

**A.**

```python
def profile(d):
    return pd.Series({
        "First_Date": d.index.min().date(), "Last_Date": d.index.max().date(),
        "First_Close": round(d["Close"].iloc[0], 2), "Last_Close": round(d["Close"].iloc[-1], 2),
        "Highest_Close": round(d["Close"].max(), 2), "Highest_Date": d["Close"].idxmax().date(),
        "Lowest_Close": round(d["Close"].min(), 2), "Lowest_Date": d["Close"].idxmin().date(),
        "Mean_Close": round(d["Close"].mean(), 2), "Median_Close": round(d["Close"].median(), 2),
        "Avg_Volume": round(d["Volume"].mean(), 0),
        "Days_Above_Mean": int((d["Close"] > d["Close"].mean()).sum())})

print(pd.DataFrame({k: profile(v) for k, v in stocks.items()}).to_string())
for name, d in stocks.items():
    print(name, "top-5 volume days:", [str(x.date()) for x in d["Volume"].nlargest(5).index])
```

```text
                   Reliance         TCS     Infosys
First_Date       2019-01-01  2020-01-01  2021-01-01
Last_Date        2022-12-30  2023-12-29  2024-12-31
First_Close         1112.14     2154.47     1292.51
Last_Close          2583.87     3838.28     1157.72
Highest_Close       2907.39     4312.09     1608.65
Highest_Date     2021-09-23  2022-09-13  2024-06-25
Lowest_Close        1064.31     1965.75      853.42
Lowest_Date      2019-01-21  2020-06-22  2021-07-30
Mean_Close          2106.67      3270.4     1285.17
Median_Close         2211.5      3629.1     1314.34
Avg_Volume        7581845.0   3235198.0   5162952.0
Days_Above_Mean         548         649         581
Reliance top-5 volume days: ['2021-08-26', '2022-07-15', '2020-04-29', '2021-03-18', '2020-10-07']
TCS top-5 volume days: ['2022-03-16', '2022-08-25', '2020-01-01', '2020-06-10', '2021-04-28']
Infosys top-5 volume days: ['2021-01-01', '2024-02-01', '2023-08-24', '2022-10-06', '2023-03-16']
```

**Comparison.** Reliance more than doubled over its window (1112 → 2584) and TCS rose strongly (2154 → 3838), while Infosys fell over its own window (1293 → 1158). Median close exceeds mean close for all three, so each price distribution is left-skewed. Reliance trades on roughly 2.3× TCS's average volume. The three windows are different periods, so this is not a like-for-like comparison — that is what the common-period dataset in Q12 fixes.

### Q5

**Q.** For each company create `Previous_Close` and `Price_Change`. Calculate `Previous_Close` by shifting closing prices by one observation and `Price_Change` as `Close − Previous_Close`. Then calculate the price change separately using `diff()` and verify that the results are the same. For each stock find the largest positive price change and its date, the largest negative price change and its date, and the mean price change.

**A.**

```python
print("Price_Change equals diff():", rel["Price_Change"].equals(rel["Close"].diff()))
print(rel[["Close","Previous_Close","Price_Change"]].head(3).to_string())

rows = []
for name, d in stocks.items():
    pc = d["Price_Change"]
    rows.append({"Stock": name, "Max_Rise": round(pc.max(), 2), "Max_Rise_Date": pc.idxmax().date(),
                 "Max_Fall": round(pc.min(), 2), "Max_Fall_Date": pc.idxmin().date(),
                 "Mean_Change": round(pc.mean(), 4)})
print(pd.DataFrame(rows).to_string(index=False))
print("diff equals check, all three:", [d["Price_Change"].equals(d["Close"].diff()) for d in stocks.values()])
```

```text
Price_Change equals diff(): True
              Close  Previous_Close  Price_Change
Date
2019-01-01  1112.14             NaN           NaN
2019-01-02  1091.76         1112.14        -20.38
2019-01-03  1087.02         1091.76         -4.74
   Stock  Max_Rise Max_Rise_Date  Max_Fall Max_Fall_Date  Mean_Change
Reliance    107.04    2021-06-07    -95.45    2021-06-04       1.4415
     TCS    161.42    2023-03-14   -169.35    2022-10-06       1.6460
 Infosys     52.53    2024-04-12    -54.26    2023-11-23      -0.1315
diff equals check, all three: [True, True, True]
```

`Close - Close.shift(1)` and `Close.diff()` are identical including the leading `NaN` — `.equals()` returns `True` for all three stocks, which is the verification asked for.

### Q6

**Q.** Create a `Return` column for each stock using closing prices. For each stock calculate the mean daily return, median daily return, standard deviation of daily returns, maximum daily return and its date, and minimum daily return and its date. Then sort each stock by `Return` and display its five highest-return days and its five lowest-return days. Also explain why the first return observation is missing.

**A.**

```python
rows = []
for name, d in stocks.items():
    r = d["Return"].dropna()
    rows.append({"Stock": name, "Mean_Return": round(r.mean(), 6), "Median_Return": round(r.median(), 6),
                 "Std_Return": round(r.std(), 6), "Max_Return": round(r.max(), 6),
                 "Max_Date": r.idxmax().date(), "Min_Return": round(r.min(), 6),
                 "Min_Date": r.idxmin().date()})
print(pd.DataFrame(rows).to_string(index=False))
print((rel["Return"].dropna().nlargest(5) * 100).round(2).to_string())     # five highest, in %
print((rel["Return"].dropna().nsmallest(5) * 100).round(2).to_string())    # five lowest, in %
print("first Return:", rel["Return"].iloc[0],
      "| NaN per stock:", {k: int(v["Return"].isna().sum()) for k, v in stocks.items()})
```

```text
   Stock  Mean_Return  Median_Return  Std_Return  Max_Return   Max_Date  Min_Return   Min_Date
Reliance     0.000911       0.000680    0.013085    0.040159 2021-06-07   -0.044100 2019-12-11
     TCS     0.000640       0.000555    0.012303    0.042395 2023-03-14   -0.044429 2022-10-06
 Infosys    -0.000023      -0.000141    0.013017    0.038317 2021-07-14   -0.040648 2023-11-23
Date
2021-06-07    4.02
2019-02-19    3.93
2019-10-17    3.61
2021-07-22    3.47
2020-04-14    3.40
Date
2019-12-11   -4.41
2022-06-06   -3.71
2021-06-04   -3.46
2021-12-20   -3.43
2020-07-16   -3.23
first Return: nan | NaN per stock: {'Reliance': 1, 'TCS': 1, 'Infosys': 1}
```

**Why the first return is missing.** A daily return compares today's close with the previous day's close, and the first row of each sheet has no previous row to compare against. `pct_change()` therefore returns `NaN` for position 0 — exactly one missing value per stock, which is why the return statistics are computed on `Return.dropna()`. It is a structural consequence of the calculation, not a data error.

### Q7

**Q.** For each company: (1) calculate daily returns; (2) convert returns into growth factors; (3) calculate cumulative growth; (4) create a `Cumulative_Return` column; (5) create a `Wealth_Index` assuming an initial investment value of ₹100. Determine the final Wealth Index value for each stock, and identify which investment finished with the highest value over its own available period.

**A.**

```python
# Growth = 1 + Return with the first (NaN) return filled with 0, then cumprod() x 100
rows = []
for name, d in stocks.items():
    rows.append({"Stock": name, "First_Close": round(d["Close"].iloc[0], 2),
                 "Last_Close": round(d["Close"].iloc[-1], 2),
                 "Final_Cumulative_Return_pct": round(d["Cumulative_Return"].iloc[-1] * 100, 2),
                 "Final_Wealth_Index": round(d["Wealth_Index"].iloc[-1], 2)})
wi_tab = pd.DataFrame(rows)
print(wi_tab.to_string(index=False))
print("Highest final Wealth Index:", wi_tab.loc[wi_tab["Final_Wealth_Index"].idxmax(), "Stock"])
print("check 2583.87/1112.14*100 =", round(2583.87 / 1112.14 * 100, 2))
```

```text
   Stock  First_Close  Last_Close  Final_Cumulative_Return_pct  Final_Wealth_Index
Reliance      1112.14     2583.87                       132.33              232.33
     TCS      2154.47     3838.28                        78.15              178.15
 Infosys      1292.51     1157.72                       -10.43               89.57
Highest final Wealth Index: Reliance
check 2583.87/1112.14*100 = 232.33
```

₹100 invested on each stock's own first trading day finishes at ₹232.33 (Reliance), ₹178.15 (TCS) and ₹89.57 (Infosys), so **Reliance finished with the highest value over its own available period**. The `cumprod` chain reproduces the raw price ratio exactly. Caveat: these are three *different* four-year windows, so the ranking measures the windows as much as the companies — it is not a like-for-like comparison.

### Q8

**Q.** For every stock calculate the 20-day, 50-day and 200-day moving averages of `Close` and the 20-day rolling standard deviation of `Return`. For each company: (1) determine the maximum 20-day rolling standard deviation and its date; (2) extract the last 10 rows containing `Close`, `MA20`, `MA50` and `MA200`; (3) explain why the beginning of the moving-average columns contains missing values.

**A.**

```python
rows = []
for name, d in stocks.items():
    v = d["Vol20"]
    rows.append({"Stock": name, "Max_Vol20": round(v.max(), 6), "Date": v.idxmax().date(),
                 "NaN_MA20": int(d["MA20"].isna().sum()), "NaN_MA50": int(d["MA50"].isna().sum()),
                 "NaN_MA200": int(d["MA200"].isna().sum())})
print(pd.DataFrame(rows).to_string(index=False))
print(rel[["Close","MA20","MA50","MA200"]].tail(10).round(2).to_string())
```

```text
   Stock  Max_Vol20       Date  NaN_MA20  NaN_MA50  NaN_MA200
Reliance   0.018149 2021-06-07        19        49        199
     TCS   0.018237 2023-02-02        19        49        199
 Infosys   0.019689 2021-08-06        19        49        199
              Close     MA20     MA50    MA200
Date
2022-12-19  2566.08  2368.48  2331.60  2383.51
2022-12-20  2568.21  2383.28  2336.28  2383.03
2022-12-21  2559.15  2397.83  2341.14  2382.30
# ... (5 rows omitted)
2022-12-29  2617.74  2481.72  2373.30  2378.66
2022-12-30  2583.87  2494.59  2377.82  2377.98
```

**Why the moving averages start with missing values.** A rolling window of *n* observations cannot produce a value until *n* observations have accumulated, so the first *n* − 1 rows are `NaN`: 19 for `MA20`, 49 for `MA50` and 199 for `MA200` in every stock. The same applies to `Vol20`, which is a 20-day rolling standard deviation of `Return` and additionally inherits the one missing first return, so its first valid value appears one row later still.

### Q9

**Q.** Split the Reliance DataFrame into `reliance_early` (2019 and 2020) and `reliance_late` (2021 and 2022). Then (1) concatenate the two DataFrames vertically; (2) create another concatenated version using a fresh integer index; (3) verify whether the reconstructed data contain the same number of rows as the original. Next create DataFrame A containing `Close` and `Volume` from the early period and DataFrame B containing `Close` and `High` from the later period, concatenate them once retaining all columns and once retaining only common columns, and explain the differences between the two results.

**A.**

```python
reliance_early = rel.loc["2019":"2020"]
reliance_late  = rel.loc["2021":"2022"]
print("early:", reliance_early.shape, "| late:", reliance_late.shape)

recon     = pd.concat([reliance_early, reliance_late], axis=0)
recon_new = pd.concat([reliance_early, reliance_late], axis=0, ignore_index=True)
print("recon:", recon.shape, "| recon_new:", recon_new.shape, "| original:", rel.shape)
print("same row count:", len(recon) == len(rel), "| values identical:", recon.equals(rel))
print("recon_new index:", recon_new.index[:3].tolist(), "...", recon_new.index[-1])

A = reliance_early[["Close","Volume"]]
B = reliance_late[["Close","High"]]
outer = pd.concat([A, B], axis=0, join="outer")     # default: all columns
inner = pd.concat([A, B], axis=0, join="inner")     # only common columns
print("A:", A.shape, "| B:", B.shape)
print("outer:", outer.shape, list(outer.columns))
print("inner:", inner.shape, list(inner.columns))
print(outer.isna().sum().to_string())
print(outer.head(2).to_string()); print(outer.tail(2).to_string())
```

```text
early: (512, 16) | late: (510, 16)
recon: (1022, 16) | recon_new: (1022, 16) | original: (1022, 16)
same row count: True | values identical: True
recon_new index: [0, 1, 2] ... 1021
A: (512, 2) | B: (510, 2)
outer: (1022, 3) ['Close', 'Volume', 'High']
inner: (1022, 1) ['Close']
Close       0
Volume    510
High      512
              Close      Volume  High
Date
2019-01-01  1112.14  14715077.0   NaN
2019-01-02  1091.76   8639311.0   NaN
              Close  Volume     High
Date
2022-12-29  2617.74     NaN  2642.59
2022-12-30  2583.87     NaN  2632.54
```

**Difference between the two results.** Both keep all 1022 rows — a vertical concat never drops rows; only the **columns** differ. `join="outer"` keeps the union `{Close, Volume, High}` and fills the gaps with `NaN`: 510 missing `Volume` values (the length of B, which has no `Volume`) and 512 missing `High` values (the length of A). `join="inner"` keeps only the intersection `{Close}`, so nothing is `NaN` but two columns of data are discarded. Note also that `ignore_index=True` replaces the dates with `0…1021`, so the result can no longer be sliced by date, and that `Volume` becomes `float64` in the outer result because `NaN` forces a float column.

### Q10

**Q.** Create three one-column DataFrames containing only closing price, renamed `Reliance`, `TCS` and `Infosys`. Now create (1) an inner join of Reliance and TCS; (2) an outer join of Reliance and TCS; (3) a left join with Reliance controlling the dates; (4) a right join with TCS controlling the dates; (5) an outer combination containing all three stocks; (6) an inner combination containing all three stocks — reporting the shape of each result. For the outer three-stock combination, count missing values in every column and identify why they appear. For the inner three-stock combination, report the first and last date.

**A.**

```python
r = rel[["Close"]].rename(columns={"Close": "Reliance"})
t = tcs[["Close"]].rename(columns={"Close": "TCS"})
i = inf[["Close"]].rename(columns={"Close": "Infosys"})

res = {"1 inner R+T": r.join(t, how="inner"), "2 outer R+T": r.join(t, how="outer"),
       "3 left  R+T": r.join(t, how="left"),  "4 right R+T": r.join(t, how="right"),
       "5 outer R+T+I": r.join([t, i], how="outer"), "6 inner R+T+I": r.join([t, i], how="inner")}
for k, v in res.items():
    print(f"{k:15s} {str(v.shape):12s} {v.index.min().date()} -> {v.index.max().date()}")

o3, cp = res["5 outer R+T+I"], res["6 inner R+T+I"]
print(o3.isna().sum().to_string())
print("fully complete rows in the outer result:", int(o3.notna().all(axis=1).sum()))
print("inner first date:", cp.index.min().date(), "| last date:", cp.index.max().date())
```

```text
1 inner R+T     (752, 2)     2020-01-01 -> 2022-12-30
2 outer R+T     (1294, 2)    2019-01-01 -> 2023-12-29
3 left  R+T     (1022, 2)    2019-01-01 -> 2022-12-30
4 right R+T     (1024, 2)    2020-01-01 -> 2023-12-29
5 outer R+T+I   (1557, 3)    2019-01-01 -> 2024-12-31
6 inner R+T+I   (492, 3)     2021-01-01 -> 2022-12-30
Reliance    535
TCS         533
Infosys     531
fully complete rows in the outer result: 492
inner first date: 2021-01-01 | last date: 2022-12-30
```

**Why the missing values appear.** The outer three-way result holds the *union* of the three date sets — 1557 dates. Each column can only be non-null on the dates its own sheet covers, so `Reliance` is missing on 1557 − 1022 = 535 dates, `TCS` on 1557 − 1024 = 533 and `Infosys` on 1557 − 1026 = 531. They are not data errors: they are dates on which the other stocks traded and this one did not (different windows plus different omitted days). The inner result keeps only the **492** dates present in all three, which equals the count of fully complete rows in the outer result; it runs from 2021-01-01 to 2022-12-30.

### Q11

**Q.** Create a new DataFrame having one row per stock with the columns `Ticker`, `Mean_Close`, `Median_Close`, `Highest_Close`, `Lowest_Close`, `Average_Volume`, `Mean_Return` and `Return_Std`, using `RELIANCE.NS`, `TCS.NS` and `INFY.NS` as the `Ticker` values. Merge this summary DataFrame with `Company_Master` so that the final table also contains `Company` and `Sector`, and sort the completed table by `Mean_Return` from highest to lowest.

**A.**

```python
summary = pd.DataFrame([
    {"Ticker": tk, "Mean_Close": round(d["Close"].mean(), 2), "Median_Close": round(d["Close"].median(), 2),
     "Highest_Close": round(d["Close"].max(), 2), "Lowest_Close": round(d["Close"].min(), 2),
     "Average_Volume": round(d["Volume"].mean(), 0), "Mean_Return": round(d["Return"].mean(), 6),
     "Return_Std": round(d["Return"].std(), 6)}
    for tk, d in [("RELIANCE.NS", rel), ("TCS.NS", tcs), ("INFY.NS", inf)]])
print(summary.to_string(index=False))

final = pd.merge(summary, master, on="Ticker", how="left").sort_values("Mean_Return", ascending=False)
print(final[["Ticker","Company","Sector","Mean_Close","Average_Volume","Mean_Return","Return_Std"]].to_string(index=False))
print("final shape:", final.shape)
```

```text
     Ticker  Mean_Close  Median_Close  Highest_Close  Lowest_Close  Average_Volume  Mean_Return  Return_Std
RELIANCE.NS     2106.67       2211.50        2907.39       1064.31       7581845.0     0.000911    0.013085
     TCS.NS     3270.40       3629.10        4312.09       1965.75       3235198.0     0.000640    0.012303
    INFY.NS     1285.17       1314.34        1608.65        853.42       5162952.0    -0.000023    0.013017
     Ticker                   Company Sector  Mean_Close  Average_Volume  Mean_Return  Return_Std
RELIANCE.NS       Reliance Industries Energy     2106.67       7581845.0     0.000911    0.013085
     TCS.NS Tata Consultancy Services     IT     3270.40       3235198.0     0.000640    0.012303
    INFY.NS                   Infosys     IT     1285.17       5162952.0    -0.000023    0.013017
final shape: (3, 10)
```

`Ticker` is an ordinary column in both frames, so `pd.merge(..., on="Ticker")` is the right tool rather than the index-based `join()`. All three tickers match, so the merge is lossless: (3, 8) + (3, 3) → (3, 10). Ranked by mean daily return the order is Reliance, TCS, Infosys — the same order as the Wealth Index in Q7.

### Q12

**Q.** Use only the common calendar period 2021-01-01 to 2022-12-30. For each stock (1) extract this period and (2) add a column named `Stock` containing the company name; then concatenate the three extracted datasets vertically into one DataFrame. Using this combined DataFrame, construct pivot tables showing (1) mean `Close` by `Stock`; (2) minimum and maximum `Close` by `Stock`; (3) mean `Close` and mean `Volume` by `Stock`; (4) minimum, mean and maximum `Volume` by `Stock`.

**A.**

```python
START, END = "2021-01-01", "2022-12-30"
parts = []
for name, d in stocks.items():
    p = d.loc[START:END].copy()
    p["Stock"] = name
    parts.append(p)
combined = pd.concat(parts, axis=0)
print(combined["Stock"].value_counts().to_string())
print("combined shape:", combined.shape)

print(pd.pivot_table(combined, values="Close", index="Stock", aggfunc="mean").round(2).to_string())
print(pd.pivot_table(combined, values="Close", index="Stock", aggfunc=["min","max"]).round(2).to_string())
print(pd.pivot_table(combined, values=["Close","Volume"], index="Stock", aggfunc="mean").round(2).to_string())
print(pd.pivot_table(combined, values="Volume", index="Stock", aggfunc=["min","mean","max"]).round(0).to_string())
```

```text
Stock
Infosys     513
TCS         511
Reliance    510
combined shape: (1534, 17)
            Close
Stock
Infosys   1194.37
Reliance  2528.81
TCS       3511.49
              min      max
            Close    Close
Stock
Infosys    853.42  1464.82
Reliance  2141.99  2907.39
TCS       2586.87  4312.09
            Close      Volume
Stock
Infosys   1194.37  5191400.13
Reliance  2528.81  7601119.76
TCS       3511.49  3214944.14
              min       mean       max
           Volume     Volume    Volume
Stock
Infosys   2083661  5191400.0  18331339
Reliance  3038132  7601120.0  22332150
TCS       1168198  3214944.0   8037554
```

The three slices of the *same* window have **different row counts — Reliance 510, TCS 511, Infosys 513** — because each sheet omits different days; the vertical concat therefore holds 1534 rows, not 3 × 492. The 492 figure from Q10 is the count of dates shared by all three. Inside this common window TCS has the highest mean close (3511) and Reliance more than double TCS's volume. A pivot with two aggfuncs produces a two-level column index — flatten it (`pv.columns = ["Min_Close","Max_Close"]`) before indexing into it.

### Q13

**Q.** For the common-period dataset, ensure each stock has its own correctly calculated `Return` and create return intervals using `pd.cut()` with the class limits: less than −2%, −2% to −1%, −1% to 0%, 0% to 1%, 1% to 2%, greater than 2%. Then (1) create a frequency table for Reliance using `value_counts()`; (2) arrange the intervals in their proper order; (3) convert the result to a DataFrame; (4) add cumulative frequency; (5)–(6) create the corresponding tables for TCS and Infosys; (7) create a cross-tabulation with `Stock` as rows and return interval as columns. Identify the most frequently occurring return interval for each stock.

**A.**

```python
# cut the FRACTION from pct_change(), and use open-ended first/last bins
bins   = [-np.inf, -0.02, -0.01, 0.0, 0.01, 0.02, np.inf]
labels = ["< -2%", "-2% to -1%", "-1% to 0%", "0% to 1%", "1% to 2%", "> 2%"]
combined["Return_Interval"] = pd.cut(combined["Return"], bins=bins, labels=labels)

def freq_table(df, stock):
    f = df[df["Stock"] == stock]["Return_Interval"].value_counts().sort_index()
    out = f.reset_index(); out.columns = ["Return_Interval", "Frequency"]
    out["Cumulative_Frequency"] = out["Frequency"].cumsum()
    return out

for s in ["Reliance", "TCS", "Infosys"]:
    print(f"--- {s} ---"); print(freq_table(combined, s).to_string(index=False))

ct = pd.crosstab(combined["Stock"], combined["Return_Interval"])
print(ct.to_string())
print(ct.idxmax(axis=1).to_string())     # modal interval
print(ct.max(axis=1).to_string())        # its count, so a tie would be visible
print(combined[combined["Return"].isna()]["Stock"].value_counts().to_string())
```

```text
--- Reliance ---
Return_Interval  Frequency  Cumulative_Frequency
          < -2%         28                    28
     -2% to -1%         82                   110
      -1% to 0%        146                   256
       0% to 1%        141                   397
       1% to 2%         83                   480
           > 2%         30                   510
--- TCS ---
Return_Interval  Frequency  Cumulative_Frequency
          < -2%         19                    19
     -2% to -1%         71                    90
      -1% to 0%        157                   247
       0% to 1%        153                   400
       1% to 2%         83                   483
           > 2%         28                   511
--- Infosys ---
Return_Interval  Frequency  Cumulative_Frequency
          < -2%         30                    30
     -2% to -1%         88                   118
      -1% to 0%        145                   263
       0% to 1%        136                   399
       1% to 2%         81                   480
           > 2%         32                   512
Return_Interval  < -2%  -2% to -1%  -1% to 0%  0% to 1%  1% to 2%  > 2%
Stock
Infosys             30          88        145       136        81    32
Reliance            28          82        146       141        83    30
TCS                 19          71        157       153        83    28
Stock
Infosys     -1% to 0%
Reliance    -1% to 0%
TCS         -1% to 0%
Categories (6, object): ['< -2%' < '-2% to -1%' < '-1% to 0%' < '0% to 1%' < '1% to 2%' < '> 2%']
Stock
Infosys     145
Reliance    146
TCS         157
Stock
Infosys    1
```

**Most frequent interval: −1% to 0% for all three stocks** (Reliance 146, TCS 157, Infosys 145). The class totals are 510, 511 and 512 against window row counts of 510, 511 and 513, so only Infosys is one short: `pd.cut` drops `NaN`, and Infosys's window starts on its very first trading day (2021-01-01), which has no previous close.

### Q14

**Q.** Using the results already obtained, create the following individual charts. **A.** Line chart: plot Reliance `Close`, `MA20` and `MA50` during 2022 on the same chart. **B.** Bar chart: the five highest-volume Reliance trading days. **C.** Histogram: the distribution of Reliance daily returns during the common period. **D.** Scatter plot: Reliance daily return against TCS daily return using only dates available for both stocks. **E.** Boxplot: the distributions of Reliance, TCS and Infosys daily returns during the common period. **F.** Pie chart: for Infosys during the common period, the percentage of observations falling into positive-return days and non-positive-return days.

**A.** Build the shared chart inputs once (Q15 reuses all of them):

```python
cp     = r.join([t, i], how="inner")        # 492 common dates, from Q10
cp_ret = cp.pct_change().dropna()           # 491 aligned daily returns
wi     = (1 + cp.pct_change().fillna(0)).cumprod() * 100
top5   = rel["Volume"].nlargest(5)
pos    = int((cp_ret["Infosys"] > 0).sum())
nonpos = int((cp_ret["Infosys"] <= 0).sum())

print("cp:", cp.shape, cp.index.min().date(), "->", cp.index.max().date(), "| cp_ret:", cp_ret.shape)
print(wi.iloc[-1].round(2).to_string())
print("Infosys positive:", pos, "| non-positive:", nonpos, "| total:", pos + nonpos)
print(top5.to_string())
print("corr(Reliance, TCS) =", round(cp_ret["Reliance"].corr(cp_ret["TCS"]), 4))
print("2022 rows:", len(rel.loc["2022"]), "| MA20 NaN inside 2022:", int(rel.loc["2022","MA20"].isna().sum()))
```

```text
cp: (492, 3) 2021-01-01 -> 2022-12-30 | cp_ret: (491, 3)
Reliance    109.40
TCS         146.25
Infosys      86.60
Infosys positive: 239 | non-positive: 252 | total: 491
Date
2021-08-26    22332150
2022-07-15    20443423
2020-04-29    19969440
2021-03-18    18756550
2020-10-07    17985216
corr(Reliance, TCS) = -0.049
2022 rows: 254 | MA20 NaN inside 2022: 0
```

```python
r22 = rel.loc["2022"]                                                                  # A
plt.figure(figsize=(10, 5))
plt.plot(r22.index, r22["Close"], label="Close")
plt.plot(r22.index, r22["MA20"],  label="MA20")
plt.plot(r22.index, r22["MA50"],  label="MA50")
plt.title("Reliance Close with MA20 and MA50 (2022)")
plt.xlabel("Date"); plt.ylabel("Price (Rs.)"); plt.legend(); plt.grid(True)
plt.tight_layout(); plt.show()

plt.figure(figsize=(8, 4))                                                             # B
plt.bar(top5.index.strftime("%d-%b-%y"), top5.values)
plt.title("Reliance: five highest-volume days"); plt.xlabel("Date"); plt.ylabel("Volume")
plt.tight_layout(); plt.show()

plt.figure(figsize=(8, 4))                                                             # C
plt.hist(cp_ret["Reliance"], bins=30, edgecolor="black")
plt.title("Reliance daily returns (common period)"); plt.xlabel("Daily return"); plt.ylabel("Days")
plt.tight_layout(); plt.show()

plt.figure(figsize=(8, 4))                                                             # D
plt.scatter(cp_ret["Reliance"], cp_ret["TCS"], s=12)
plt.title("Reliance vs TCS daily returns"); plt.xlabel("Reliance return"); plt.ylabel("TCS return")
plt.tight_layout(); plt.show()

plt.figure(figsize=(8, 4))                                                             # E
plt.boxplot([cp_ret["Reliance"], cp_ret["TCS"], cp_ret["Infosys"]])
plt.xticks([1, 2, 3], ["Reliance", "TCS", "Infosys"])
plt.title("Daily return distributions (common period)"); plt.ylabel("Daily return")
plt.tight_layout(); plt.show()

plt.figure(figsize=(5, 5))                                                             # F
plt.pie([pos, nonpos], labels=["Positive", "Non-positive"], autopct="%1.1f%%")
plt.title("Infosys: positive vs non-positive return days")
plt.tight_layout(); plt.show()
```

What each chart shows: **A** — Reliance falls from about 2600 to 2200 by September 2022 then recovers, with MA20 crossing back above MA50 at the end of the year (there are 254 rows in 2022 and no `NaN` MA20 inside it, because the rolling average was computed on the full history *before* slicing). **B** — the five heaviest days sit at 18–22 m shares, roughly 2.4–2.9× the 7.6 m average. **C** — a single-peaked distribution centred just above zero with symmetric tails to about ±4%. **D** — a shapeless cloud; the correlation is −0.049, i.e. effectively zero. **E** — three boxes centred on zero with near-identical spread. **F** — 239 positive against 252 non-positive days, 48.7% vs 51.3%.

### Q15

**Q.** Create one single Matplotlib figure containing SIX charts. Use `plt.figure(figsize=(18, 10))` and divide it into a 2-row × 3-column layout using `plt.subplot(2, 3, position)`, with the positions exactly as follows — top-left: line chart of the Wealth Index of Reliance, TCS and Infosys for the common period; top-centre: bar chart of the five highest-volume Reliance trading days; top-right: histogram of Reliance daily returns; bottom-left: scatter plot of Reliance return versus TCS return on common dates; bottom-centre: boxplot of the daily returns of Reliance, TCS and Infosys; bottom-right: pie chart of positive versus non-positive Infosys return days. Every subplot should have an appropriate title, with axis labels where meaningful, legends where multiple series appear and grids where suitable. Then use `plt.tight_layout()`, save the complete figure as `Stock_Analysis.png`, save the same figure as `Stock_Analysis.pdf`, and display it.

**A.**

```python
plt.figure(figsize=(18, 10))

plt.subplot(2, 3, 1)                                   # top-left: Wealth Index, three lines
for c in ["Reliance", "TCS", "Infosys"]:
    plt.plot(wi.index, wi[c], label=c)
plt.title("Wealth Index (Rs.100 invested, common period)")
plt.xlabel("Date"); plt.ylabel("Wealth Index"); plt.legend(); plt.grid(True); plt.xticks(rotation=30)

plt.subplot(2, 3, 2)                                   # top-centre: top-5 volume bar
plt.bar(top5.index.strftime("%d-%b-%y"), top5.values, color="steelblue")
plt.title("Reliance: five highest-volume days")
plt.xlabel("Date"); plt.ylabel("Volume"); plt.xticks(rotation=45); plt.grid(True, axis="y")

plt.subplot(2, 3, 3)                                   # top-right: return histogram
plt.hist(cp_ret["Reliance"], bins=30, color="darkorange", edgecolor="black")
plt.title("Reliance daily returns (common period)")
plt.xlabel("Daily return"); plt.ylabel("Number of days"); plt.grid(True, axis="y")

plt.subplot(2, 3, 4)                                   # bottom-left: scatter
plt.scatter(cp_ret["Reliance"], cp_ret["TCS"], s=12, alpha=0.6)
plt.title("Reliance vs TCS daily returns")
plt.xlabel("Reliance return"); plt.ylabel("TCS return"); plt.grid(True)

plt.subplot(2, 3, 5)                                   # bottom-centre: boxplot
plt.boxplot([cp_ret["Reliance"], cp_ret["TCS"], cp_ret["Infosys"]])
plt.xticks([1, 2, 3], ["Reliance", "TCS", "Infosys"])
plt.title("Daily return distributions (common period)")
plt.ylabel("Daily return"); plt.grid(True, axis="y")

plt.subplot(2, 3, 6)                                   # bottom-right: pie
plt.pie([pos, nonpos], labels=["Positive", "Non-positive"], autopct="%1.1f%%", startangle=90)
plt.title("Infosys: positive vs non-positive return days")

plt.tight_layout()
plt.savefig("Stock_Analysis.png")      # save BEFORE show(), or the file can come out blank
plt.savefig("Stock_Analysis.pdf")
plt.show()

import os
print("Stock_Analysis.png:", os.path.getsize("Stock_Analysis.png"), "bytes")
print("Stock_Analysis.pdf:", os.path.getsize("Stock_Analysis.pdf"), "bytes")
```

```text
Stock_Analysis.png: 176886 bytes
Stock_Analysis.pdf: 47494 bytes
```

The figure shows, clockwise from the top-left: the three Wealth Index paths over the 492 common dates, Reliance's five heaviest volume days, the Reliance return histogram, the Reliance-versus-TCS return scatter, the three return boxplots, and the Infosys positive/non-positive pie. Over the **common** 2021–2022 window the Wealth Index ranking flips from Q7: ₹100 becomes ₹146.25 on TCS, ₹109.40 on Reliance and ₹86.60 on Infosys, because Q7's Reliance window also contained its 2019–2020 run-up. `plt.subplot` positions are 1-indexed and row-major (1–3 across the top, 4–6 across the bottom).
