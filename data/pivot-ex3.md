---
id: pivot-ex3
title: "04 Sorting, Slicing & Pivot — Exercise 3: Mutual Fund Transactions"
source: "Pandas exercises/04 Sorting, slicing and pivot/Exercise 3/Mutual Fund Transactions.pdf"
datafile: "Pandas exercises/04 Sorting, slicing and pivot/Exercise 3/mutual_funds.csv"
topic: "loc/iloc slicing, multi-key sorting and pivot_table on mutual fund transactions"
group: "Pandas exercises"
order: 62
setup: |
  import pandas as pd
  pd.set_option("display.width", 200)
  pd.set_option("display.max_columns", 30)
  df = pd.read_csv("mutual_funds.csv")   # (70, 9)
---

### QA1

**Q.** Show `txn_id`, `amc`, `amount` where `investor_type == "HNI"` or (`investor_type == "Retail"` and `kyc_ok == True`), sorted by `amount` descending.

**A.** `kyc_ok` is a real `bool`, so it needs no `== True`.

```python
q = df.loc[(df["investor_type"] == "HNI")
           | ((df["investor_type"] == "Retail") & df["kyc_ok"]),
           ["txn_id", "amc", "amount"]].sort_values("amount", ascending=False)
print(q.shape)
print(q.head(10).to_string(index=False))
```

```text
(40, 3)
 txn_id   amc    amount
  30033   UTI 103696.77
  30023 ICICI 103683.90
  30042 ICICI  98346.54
  30034   UTI  98084.81
  30050   SBI  91910.89
  30067   UTI  91427.61
  30017  Axis  91303.88
  30012   SBI  90178.14
  30054  Axis  87291.04
  30043  Axis  87013.15
```

### QA2

**Q.** Using `.iloc`, return rows 15:45 and columns 0:6, then sort by the column at position 5 descending.

**A.** Here the column slice starts at 0, so the in-slice and original readings of "position 5" coincide — both are `nav`. Resolve it with `.columns[5]` anyway.

```python
sub = df.iloc[15:45, 0:6]
print("sub.shape:", sub.shape, "| position 5:", sub.columns[5])
q = sub.sort_values(by=sub.columns[5], ascending=False)
print(q.head(8).to_string(index=False))
```

```text
sub.shape: (30, 6) | position 5: nav
 txn_id   amc scheme     channel   units   nav
  30044 ICICI Hybrid Distributor  125.49 96.93
  30027 ICICI Hybrid Distributor  848.84 68.84
  30032  Axis Equity Distributor 1527.38 68.84
  30026   UTI Equity Distributor 1270.24 67.61
  30033   UTI Equity Distributor 1636.37 63.37
  30017  Axis Hybrid      Online 1454.81 62.76
  30021   UTI Equity      Online  312.10 61.31
  30023 ICICI Equity Distributor 1706.45 60.76
```

### QA3

**Q.** Filter where `channel` in `{"Direct","Online"}` and `nav >= 40`; return `txn_id`, `scheme`, `nav`.

**A.**

```python
q = df.loc[df["channel"].isin({"Direct", "Online"}) & (df["nav"] >= 40),
           ["txn_id", "scheme", "nav"]]
print(q.shape)
print(q.head(10).to_string(index=False))
```

```text
(31, 3)
 txn_id    scheme   nav
  30004      Debt 41.85
  30005    Hybrid 53.04
  30006      Debt 56.76
  30007    Hybrid 42.97
  30008      Debt 52.12
  30009 Arbitrage 41.55
  30011    Equity 41.91
  30017    Hybrid 62.76
  30018    Hybrid 44.83
  30020 Arbitrage 47.48
```

### QA4

**Q.** Using `.loc`, select `amc` in `{"HDFC","ICICI"}` and columns `["txn_id","amc","scheme","units"]`.

**A.**

```python
q = df.loc[df["amc"].isin({"HDFC", "ICICI"}),
           ["txn_id", "amc", "scheme", "units"]]
print(q.shape)
print(q.head(10).to_string(index=False))
```

```text
(23, 4)
 txn_id   amc scheme   units
  30001  HDFC Equity  698.01
  30002  HDFC Equity 1831.56
  30003  HDFC   Debt  950.39
  30004 ICICI   Debt  899.16
  30006 ICICI   Debt 1306.77
  30018  HDFC Hybrid 1413.18
  30023 ICICI Equity 1706.45
  30024  HDFC   Debt 1439.40
  30027 ICICI Hybrid  848.84
  30030  HDFC Hybrid 1509.22
```

### QA5

**Q.** Using `.iloc`, take every 3rd row up to 36 and columns positions `[0, 2, 4, 8]`.

**A.**

```python
q = df.iloc[:36:3, [0, 2, 4, 8]]
print(q.shape)
print(q.to_string(index=False))
```

```text
(12, 4)
 txn_id    scheme   units   amount
  30001    Equity  698.01 32422.56
  30004      Debt  899.16 37629.85
  30007    Hybrid 1397.33 60043.27
  30010    Equity  656.50 25294.94
  30013    Equity 1564.28 40905.92
  30016      Debt 1469.61 54008.17
  30019 Arbitrage 1554.00 63216.72
  30022      Debt   93.14  3168.62
  30025     Index  194.76  6226.48
  30028    Equity  981.17 47429.76
  30031 Arbitrage 1166.65 45872.68
  30034      Debt 1716.57 98084.81
```

### QA6

**Q.** Sort by `scheme` ascending and `units` descending; return the first 10 rows via slicing.

**A.**

```python
q = df.sort_values(by=["scheme", "units"], ascending=[True, False])
print(q.iloc[:10][["txn_id", "scheme", "units", "nav"]].to_string(index=False))
```

```text
 txn_id    scheme   units   nav
  30064 Arbitrage 1815.23 33.64
  30052 Arbitrage 1742.52 47.95
  30019 Arbitrage 1554.00 40.68
  30056 Arbitrage 1527.53 52.09
  30039 Arbitrage 1412.36 39.30
  30020 Arbitrage 1233.28 47.48
  30031 Arbitrage 1166.65 39.32
  30045 Arbitrage  453.90 40.66
  30009 Arbitrage  400.92 41.55
  30034      Debt 1716.57 57.14
```

`Arbitrage` has only nine transactions, so the tenth row is the largest `Debt` one.

### QA7

**Q.** Filter `kyc_ok == False` then sort by `amc` ascending, `amount` descending; show `txn_id`, `amc`, `amount`.

**A.**

```python
q = df.loc[~df["kyc_ok"], ["txn_id", "amc", "amount"]].sort_values(
    by=["amc", "amount"], ascending=[True, False])
print(q.shape)
print(q.head(12).to_string(index=False))
```

```text
(32, 3)
 txn_id  amc    amount
  30032 Axis 105144.84
  30017 Axis  91303.88
  30054 Axis  87291.04
  30051 Axis  78831.85
  30016 Axis  54008.17
  30069 Axis  52509.93
  30038 Axis  39797.50
  30022 Axis   3168.62
  30052 HDFC  83553.83
  30003 HDFC  65310.80
  30002 HDFC  54763.64
  30059 HDFC  52214.19
```

### QA8

**Q.** Sort by `amount` descending; return rows 10–19 using `.iloc`.

**A.** Rows 10–19 counted from zero are ranks 11 to 20.

```python
q = df.sort_values("amount", ascending=False)
print(q.iloc[10:20][["txn_id", "amc", "amount"]].to_string(index=False))
```

```text
 txn_id  amc   amount
  30030 HDFC 87398.93
  30054 Axis 87291.04
  30043 Axis 87013.15
  30026  UTI 85880.93
  30052 HDFC 83553.83
  30056  SBI 79569.04
  30036  UTI 79396.17
  30051 Axis 78831.85
  30058  UTI 78191.45
  30005  SBI 76294.86
```

### QB1

**Q.** Sum `amount` by `amc` × `scheme` (`fill_value=0`, with totals).

**A.** "With totals" is `margins=True, margins_name="Total"`.

```python
print(df.pivot_table(index="amc", columns="scheme", values="amount",
                     aggfunc="sum", fill_value=0,
                     margins=True, margins_name="Total").round(2))
```

```text
scheme  Arbitrage        Debt      Equity     Hybrid      Index       Total
amc                                                                        
Axis     79874.95   316425.28   357108.49  212486.14  142371.01  1108265.87
HDFC    139059.58   152807.49   173795.19  221217.72   52214.19   739094.17
ICICI    79519.91   210148.66   134987.57   70597.90   46517.21   541771.25
SBI     125441.72   145811.50    88406.20  205296.30   54625.48   619581.20
UTI      58556.13   225010.61   553661.26   23791.12   73294.92   934314.04
Total   482452.29  1050203.54  1307958.71  733389.18  369022.81  3943026.53
```

### QB2

**Q.** Mean `nav` by `scheme` × `channel`.

**A.**

```python
print(df.pivot_table(index="scheme", columns="channel", values="nav",
                     aggfunc="mean").round(2))
```

```text
channel    Direct  Distributor  Online
scheme                                
Arbitrage   41.98        39.77   47.72
Debt        45.62        44.26   54.75
Equity      47.71        55.39   40.59
Hybrid      48.00        61.51   52.33
Index       42.12        33.26   42.52
```

### QB3

**Q.** Count of transactions by `investor_type` × `amc` (count `txn_id`).

**A.**

```python
print(df.pivot_table(index="investor_type", columns="amc", values="txn_id",
                     aggfunc="count", fill_value=0))
```

```text
amc            Axis  HDFC  ICICI  SBI  UTI
investor_type                             
HNI               5     4      3    4    6
Institutional     8     3      4    2    3
Retail            6     6      3    7    6
```

### QB4

**Q.** Std of `units` by `scheme` × `investor_type`.

**A.**

```python
print(df.pivot_table(index="scheme", columns="investor_type", values="units",
                     aggfunc="std").round(2))
```

```text
investor_type     HNI  Institutional  Retail
scheme                                      
Arbitrage      589.04         722.46  126.63
Debt           350.82         558.95  233.39
Equity         378.80         499.46  540.76
Hybrid         639.39         470.01  171.31
Index          254.49         328.69  605.12
```

### QB5

**Q.** Multiple aggs (sum, mean) of `amount` by `amc` × `channel` and flatten.

**A.**

```python
pt = df.pivot_table(index="amc", columns="channel", values="amount",
                    aggfunc=["sum", "mean"])
pt.columns = [f"{a}_{b}" for a, b in pt.columns]
print(pt.round(2))
print(df.groupby(["amc", "channel"]).size().unstack(fill_value=0))
```

```text
       sum_Direct  sum_Distributor  sum_Online  mean_Direct  mean_Distributor  mean_Online
amc                                                                                       
Axis    334877.73        230152.73   543235.41     47839.68          57538.18     67904.43
HDFC          NaN        343338.73   395755.44          NaN          49048.39     65959.24
ICICI   153692.18        272628.34   115450.73     51230.73          68157.08     38483.58
SBI     155863.90        284626.67   179090.63     77931.95          40660.95     44772.66
UTI     223419.52        348255.85   362638.67     55854.88          69651.17     60439.78
channel  Direct  Distributor  Online
amc                                 
Axis          7            4       8
HDFC          0            7       6
ICICI         3            4       3
SBI           2            7       4
UTI           4            5       6
```

`HDFC / Direct` is `NaN` because zero HDFC transactions came through Direct. `fill_value=0` would zero the sum, but a `mean_Direct` of 0 would be misleading.

### QB6

**Q.** Multiple values (`units`, `amount`) summed by `scheme` × `amc`; optional flatten.

**A.**

```python
pt = df.pivot_table(index="scheme", columns="amc", values=["units", "amount"],
                    aggfunc="sum", fill_value=0)
print(pt.round(2))
pt.columns = [f"{v}_{b}" for v, b in pt.columns]
print(list(pt.columns))
```

```text
              amount                                                units                                    
amc             Axis       HDFC      ICICI        SBI        UTI     Axis     HDFC    ICICI      SBI      UTI
scheme                                                                                                       
Arbitrage   79874.95  139059.58   79519.91  125441.72   58556.13  1954.92  3154.88  2269.13  2694.18  1233.28
Debt       316425.28  152807.49  210148.66  145811.50  225010.61  5479.11  4084.34  3887.93  2719.72  4919.64
Equity     357108.49  173795.19  134987.57   88406.20  553661.26  7092.08  5112.82  2720.17  2105.73  9576.52
Hybrid     212486.14  221217.72   70597.90  205296.30   23791.12  4712.73  4035.43   974.33  3880.25   662.89
Index      142371.01   52214.19   46517.21   54625.48   73294.92  3743.79  1422.73  1335.55  1288.77  1255.05
['amount_Axis', 'amount_HDFC', 'amount_ICICI', 'amount_SBI', 'amount_UTI', 'units_Axis', 'units_HDFC', 'units_ICICI', 'units_SBI', 'units_UTI']
```

### QB7

**Q.** Variance of `nav` by `amc` × `scheme`.

**A.**

```python
print(df.pivot_table(index="amc", columns="scheme", values="nav",
                     aggfunc="var").round(2))
```

```text
scheme  Arbitrage    Debt  Equity  Hybrid  Index
amc                                             
Axis         0.38  404.57  258.32  231.31  44.15
HDFC        37.41  860.25   70.22   90.29    NaN
ICICI       24.64   83.58  446.41  394.52    NaN
SBI         81.54  249.09    8.47    0.08  75.28
UTI           NaN   98.26  145.58     NaN    NaN
```

The five `NaN`s are single-transaction groups (`HDFC/Index`, `ICICI/Index`, `UTI/Arbitrage`, `UTI/Hybrid`, `UTI/Index`), where sample variance is undefined.

### QB8

**Q.** First and last `nav` by `scheme` × `channel` (flatten).

**A.**

```python
pt = df.pivot_table(index="scheme", columns="channel", values="nav",
                    aggfunc=["first", "last"])
pt.columns = [f"{a}_{b}" for a, b in pt.columns]
print(pt)
```

```text
           first_Direct  first_Distributor  first_Online  last_Direct  last_Distributor  last_Online
scheme                                                                                              
Arbitrage         41.55              40.68         47.48        33.64             39.30        47.95
Debt              56.76              68.72         41.85        58.51             43.31        47.18
Equity            26.15              46.45         29.90        59.93             44.83        30.88
Hybrid            53.04              52.66         62.76        42.97             35.89        63.31
Index             42.12              31.97         31.61        42.12             31.11        43.52
```

`Index / Direct` is 42.12 for both — that group has one transaction.
